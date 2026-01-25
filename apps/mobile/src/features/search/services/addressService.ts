import { AddressSuggestion } from '../types';
import { MOCK_ADDRESSES } from '../constants';

/**
 * Address service for geocoding and address search
 * In production, this would call a real geocoding API (Google Maps, Mapbox, etc.)
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
    .map((address, index) => {
      const parts = address.split(',').map((p) => p.trim());
      return {
        id: `address-${index}-${address}`,
        address,
        city: parts[0],
        country: parts[parts.length - 1],
      };
    });

  return results;
}

/**
 * Get user's current location
 * In production, this would use expo-location
 */
export async function getCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
  // TODO: Implement with expo-location
  // const { status } = await Location.requestForegroundPermissionsAsync();
  // if (status !== 'granted') return null;
  // const location = await Location.getCurrentPositionAsync({});
  // return { lat: location.coords.latitude, lng: location.coords.longitude };
  
  return null;
}
