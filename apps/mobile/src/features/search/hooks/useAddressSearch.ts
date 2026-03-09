import { useState, useCallback, useEffect } from 'react';
import { AddressSuggestion, UseAddressSearchResult } from '../types';
import { searchAddresses } from '../services/addressService';

export interface UseAddressSearchOptions {
  /** Called when user selects an address; use to wire into search/discovery state (e.g. set city/region). */
  onSelect?: (address: AddressSuggestion) => void;
}

/**
 * Address search: query, suggestions (mock-backed), and selection.
 * selectedAddress is set when user picks one; pass onSelect to wire into parent state.
 */
export function useAddressSearch(options: UseAddressSearchOptions = {}): UseAddressSearchResult {
  const { onSelect } = options;
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    const timeoutId = setTimeout(async () => {
      try {
        const results = await searchAddresses({ query, limit: 10 });
        setSuggestions(results);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to search addresses'));
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => {
      clearTimeout(timeoutId);
      setIsLoading(false);
    };
  }, [query]);

  const selectAddress = useCallback((address: AddressSuggestion) => {
    setSelectedAddress(address);
    setQuery(address.address);
    setSuggestions([]);
    onSelect?.(address);
  }, [onSelect]);

  return {
    query,
    setQuery,
    suggestions,
    selectedAddress,
    isLoading,
    error,
    selectAddress,
  };
}
