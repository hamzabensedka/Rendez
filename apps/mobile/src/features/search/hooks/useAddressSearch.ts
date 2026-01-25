import { useState, useMemo, useCallback, useEffect } from 'react';
import { AddressSuggestion, UseAddressSearchResult } from '../types';
import { searchAddresses } from '../services/addressService';

/**
 * Custom hook for address search functionality
 * Handles query state, filtering, and address selection
 * 
 * @returns Address search state and handlers
 */
export function useAddressSearch(): UseAddressSearchResult {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Debounce search to avoid excessive API calls
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
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(timeoutId);
      setIsLoading(false);
    };
  }, [query]);

  const selectAddress = useCallback((address: AddressSuggestion) => {
    // TODO: Handle address selection - navigate to search results or save address
    // In production: navigate to results or save to context/state
    console.log('Selected address:', address);
  }, []);

  return {
    query,
    setQuery,
    suggestions,
    isLoading,
    error,
    selectAddress,
  };
}
