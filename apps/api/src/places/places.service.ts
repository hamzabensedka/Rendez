import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisCacheService } from '../redis/redis-cache.service';

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

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/search';
const CACHE_TTL_SEC = 24 * 60 * 60; // 24h
const NOMINATIM_LOCK_KEY = 'planity:places:nominatim:lock';
const NOMINATIM_LOCK_TTL_SEC = 2;
const NOMINATIM_LOCK_SPIN_MS = 15_000;

@Injectable()
export class PlacesService {
  constructor(
    private readonly config: ConfigService,
    private readonly cache: RedisCacheService
  ) {}

  async suggest(q: string, limit = 10): Promise<PlaceSuggestion[]> {
    const countryCodes = (
      this.config.get<string>('PLACES_COUNTRY_CODES') ?? 'fr'
    )
      .split(',')
      .map((c) => c.trim().toLowerCase())
      .filter(Boolean)
      .join(',');
    const key = `planity:places:suggest:${countryCodes}:${q.trim().toLowerCase()}:${Math.min(limit, 10)}`;
    const cached = await this.cache.getJson<PlaceSuggestion[]>(key);
    if (cached) {
      return cached;
    }

    if (!q?.trim()) {
      return [];
    }

    await this.cache.acquireLockSpin(
      NOMINATIM_LOCK_KEY,
      NOMINATIM_LOCK_TTL_SEC,
      NOMINATIM_LOCK_SPIN_MS
    );

    const params = new URLSearchParams({
      q: q.trim(),
      format: 'json',
      addressdetails: '1',
      limit: String(Math.min(limit, 10)),
      ...(countryCodes ? { countrycodes: countryCodes } : {}),
    });
    const url = `${NOMINATIM_BASE}?${params.toString()}`;
    const userAgent = this.getUserAgent();

    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': userAgent },
      });
      if (!res.ok) {
        return [];
      }
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
      await this.cache.setJson(key, results, CACHE_TTL_SEC);
      return results;
    } catch {
      return [];
    }
  }

  /** Required by Nominatim usage policy. */
  private getUserAgent(): string {
    const email = this.config.get<string>('NOMINATIM_EMAIL');
    const app = 'Planity/1.0 (salon booking; geocoding)';
    return email ? `${app} (${email})` : app;
  }
}
