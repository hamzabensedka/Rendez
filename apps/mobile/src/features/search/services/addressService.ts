import { AddressSuggestion } from '../types';
import api from '../../../shared/lib/api';

/**
 * Address service: uses backend GET /places/suggest (geocoding proxy).
 * getCurrentLocation uses expo-location for "Around Me".
 */

export interface SearchAddressParams {
  query: string;
  limit?: number;
}

interface PlacesSuggestResponse {
  id: string;
  address: string;
  city?: string;
  country?: string;
  lat?: number;
  lng?: number;
}

/**
 * Search for addresses via backend places/suggest API.
 */
export async function searchAddresses(
  params: SearchAddressParams
): Promise<AddressSuggestion[]> {
  const { query, limit = 10 } = params;

  if (!query.trim()) {
    return [];
  }

  try {
    const res = await api.get<PlacesSuggestResponse[]>('/places/suggest', {
      params: { q: query.trim(), limit },
    });
    const list = Array.isArray(res.data) ? res.data : [];
    return list.map((item) => ({
      id: item.id,
      address: item.address,
      city: item.city,
      country: item.country,
    }));
  } catch {
    return [];
  }
}

/**
 * Get user's current location via expo-location.
 * Returns last known position immediately if available (no GPS wait),
 * then falls back to a fresh fix at balanced accuracy.
 */
export async function getCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
  try {
    const {
      requestForegroundPermissionsAsync,
      getCurrentPositionAsync,
      getLastKnownPositionAsync,
      LocationAccuracy,
    } = await import('expo-location');
    const { status } = await requestForegroundPermissionsAsync();
    if (status !== 'granted') return null;
    // Last known position is instant — no GPS cold-start delay
    const last = await getLastKnownPositionAsync({});
    if (last) return { lat: last.coords.latitude, lng: last.coords.longitude };
    // No cached fix — request a fresh one at balanced accuracy (faster than high-accuracy)
    const position = await getCurrentPositionAsync({ accuracy: LocationAccuracy.Balanced });
    return { lat: position.coords.latitude, lng: position.coords.longitude };
  } catch {
    return null;
  }
}
