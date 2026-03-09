/**
 * Type definitions for the search feature
 */

export interface AddressSuggestion {
  readonly id: string;
  readonly address: string;
  readonly city?: string;
  readonly country?: string;
}

export interface SearchResult {
  readonly id: string;
  readonly name: string;
  readonly category?: string;
}

export interface UseAddressSearchResult {
  readonly query: string;
  readonly setQuery: (query: string) => void;
  readonly suggestions: readonly AddressSuggestion[];
  readonly isLoading: boolean;
  readonly error: Error | null;
  readonly selectAddress: (address: AddressSuggestion) => void;
}

export interface UseFrequentSearchesResult {
  readonly searches: readonly string[];
  readonly selectSearch: (search: string) => void;
}

export interface SalonAvailability {
  readonly morning: readonly string[];
  readonly afternoon: readonly string[];
}

export interface ServiceItem {
  readonly id: string;
  readonly name: string;
  readonly duration: string;
  readonly price: string;
  readonly description?: string;
}

export interface ServiceCategory {
  readonly id: string;
  readonly title: string;
  readonly items: readonly ServiceItem[];
}

export interface Salon {
  readonly id: string;
  readonly name: string;
  readonly address: string;
  readonly distance: string;
  readonly rating: number;
  readonly reviewCount: number;
  readonly priceLevel: '€' | '€€' | '€€€';
  readonly description?: string;
  readonly images: readonly string[];
  readonly availability: SalonAvailability;
  readonly services: readonly ServiceCategory[];
}

export interface SearchResultsFilter {
  readonly id: string;
  readonly label: string;
  readonly icon?: string;
}
