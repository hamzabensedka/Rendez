import { AddressSuggestion } from '../types';
import { MOCK_ADDRESSES } from '../constants';

/**
 * Address service: internal strategy (mock) until a real geocoding provider is integrated.
 * - searchAddresses: filters MOCK_ADDRESSES; replace with Google Maps / Mapbox / or backend search when ready.
 * - getCurrentLocation: intentionally stubbed; implement with expo-location when "Around Me" is required.
 */

export interface SearchAddressParams {
  query: string;
  limit?: number;
}

/**
 * Search for addresses based on a query string
 * @param params - Search parameters
 * @returns Promise resolving to address suggestions
 */
export async function searchAddresses(
  params: SearchAddressParams
): Promise<AddressSuggestion[]> {
  const { query, limit = 10 } = params;

  if (!query.trim()) {
    return [];
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const normalizedQuery = query.toLowerCase().trim();

  const results = MOCK_ADDRESSES.filter((address) =>
    address.toLowerCase().includes(normalizedQuery)
  )
    .slice(0, limit)
    .map((addr, index) => {
      const parts = addr.split(',').map((p) => p.trim());
      const city = parts.length > 1 ? parts[parts.length - 1] : undefined;
      const country = city === 'Toulouse' ? 'France' : city === 'Paris' ? 'France' : city === 'London' ? 'UK' : city === 'New York' ? 'USA' : undefined;
      return {
        id: `address-${index}-${addr}`,
        address: addr,
        city,
        country,
      };
    });

  return results;
}

/**
 * Get user's current location. Stubbed until expo-location is integrated for "Around Me".
 */
export async function getCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
  return null;
}
