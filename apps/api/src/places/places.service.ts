import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface PlaceSuggestion {
  id: string;
  address: string;
  city?: string;
  country?: string;
  lat?: number;
  lng?: number;
}

/** Nominatim result item (subset we use). */
interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    country?: string;
    country_code?: string;
  };
}

/** In-memory cache entry for geocoding (Nominatim policy: cache results). */
interface CacheEntry {
  results: PlaceSuggestion[];
  expiresAt: number;
}

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/search';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const NOMINATIM_MIN_INTERVAL_MS = 1100; // 1 req/sec + margin

@Injectable()
export class PlacesService {
  private lastNominatimCall = 0;
  private cache = new Map<string, CacheEntry>();

  constructor(private config: ConfigService) {}

  async suggest(q: string, limit = 10): Promise<PlaceSuggestion[]> {
    const key = `suggest:${q.trim().toLowerCase()}:${limit}`;
    const cached = this.cache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.results;
    }

    if (!q?.trim()) {
      return [];
    }

    await this.rateLimitNominatim();

    const params = new URLSearchParams({
      q: q.trim(),
      format: 'json',
      addressdetails: '1',
      limit: String(Math.min(limit, 10)),
    });
    const url = `${NOMINATIM_BASE}?${params.toString()}`;
    const userAgent = this.getUserAgent();

    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': userAgent },
      });
      if (!res.ok) return [];
      const data = (await res.json()) as NominatimResult[];
      const results: PlaceSuggestion[] = (data ?? []).slice(0, limit).map((f, i) => {
        const lat = parseFloat(f.lat);
        const lng = parseFloat(f.lon);
        const addr = f.address ?? {};
        const city =
          addr.city ?? addr.town ?? addr.village ?? addr.municipality;
        return {
          id: `nominatim-${f.place_id}-${i}`,
          address: f.display_name ?? `${f.lat}, ${f.lon}`,
          city: city ?? undefined,
          country: addr.country ?? undefined,
          lat: Number.isNaN(lat) ? undefined : lat,
          lng: Number.isNaN(lng) ? undefined : lng,
        };
      });
      this.cache.set(key, {
        results,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });
      return results;
    } catch {
      return [];
    }
  }

  /** Enforce Nominatim 1 request/second policy. */
  private async rateLimitNominatim(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastNominatimCall;
    if (elapsed < NOMINATIM_MIN_INTERVAL_MS) {
      await new Promise((r) =>
        setTimeout(r, NOMINATIM_MIN_INTERVAL_MS - elapsed)
      );
    }
    this.lastNominatimCall = Date.now();
  }

  /** Required by Nominatim usage policy. */
  private getUserAgent(): string {
    const email = this.config.get<string>('NOMINATIM_EMAIL');
    const app = 'Planity/1.0 (salon booking; geocoding)';
    return email ? `${app} (${email})` : app;
  }
}
