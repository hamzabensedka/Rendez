import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { UseFrequentSearchesResult } from '../types';
import { FREQUENT_SEARCHES } from '../constants';

/**
 * Custom hook for frequent searches functionality
 * Handles navigation when a frequent search is selected
 */
export function useFrequentSearches(): UseFrequentSearchesResult {
  const router = useRouter();

  const selectSearch = useCallback(
    (search: string) => {
      // Navigate to address screen when clicking on frequent search items
      router.push('/address');
    },
    [router]
  );

  return {
    searches: FREQUENT_SEARCHES,
    selectSearch,
  };
}
