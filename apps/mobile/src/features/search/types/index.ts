/**
 * Type definitions for the search feature
 */

export interface AddressSuggestion {
  id: string;
  address: string;
  city?: string;
  country?: string;
}

export interface SearchResult {
  id: string;
  name: string;
  category?: string;
}

export interface UseAddressSearchResult {
  query: string;
  setQuery: (query: string) => void;
  suggestions: AddressSuggestion[];
  isLoading: boolean;
  error: Error | null;
  selectAddress: (address: AddressSuggestion) => void;
}

export interface UseFrequentSearchesResult {
  searches: readonly string[];
  selectSearch: (search: string) => void;
}

export interface SalonAvailability {
  morning: readonly string[];
  afternoon: readonly string[];
}

export interface ServiceItem {
  id: string;
  name: string;
  duration: string;
  price: string;
  description?: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  items: ServiceItem[];
}

export interface Salon {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  reviewCount: number;
  priceLevel: '€' | '€€' | '€€€';
  description?: string;
  images: readonly string[];
  availability: SalonAvailability;
  services: ServiceCategory[];
}

export interface SearchResultsFilter {
  id: string;
  label: string;
  icon?: string;
}
