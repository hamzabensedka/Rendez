import { useQuery } from '@tanstack/react-query';
import api from '../../../shared/lib/api';
import { queryKeys } from '../queryKeys';
import type { ApiBusinessListItem } from '../../../features/search/components';

export interface BusinessesSearchParams {
  query?: string;
  city?: string;
  categories?: string[];
  /** Device coordinates when "near me" is active */
  nearMeCoords?: { lat: number; lng: number } | null;
  radiusKm?: number;
  availDate?: string;
  /**
   * When true and nearMe is intended but coords are null, skip fetch (avoid unbounded list while locating).
   * Caller sets nearMeSelected + coords null -> enabled false.
   */
  enabled?: boolean;
}

export function useBusinessesSearchQuery(params: BusinessesSearchParams) {
  const query = params.query ?? '';
  const city = params.city ?? '';
  const categoriesKey = (params.categories ?? []).slice().sort().join(',');
  const nearKey =
    params.nearMeCoords != null
      ? `${params.nearMeCoords.lat.toFixed(4)},${params.nearMeCoords.lng.toFixed(4)},${params.radiusKm ?? 20}`
      : '';
  const availDate = params.availDate ?? '';

  const enabled = params.enabled !== false;

  return useQuery({
    queryKey: queryKeys.businessesSearch({
      queryKey: query,
      cityKey: city,
      categoriesKey,
      nearKey,
      availDateKey: availDate,
    }),
    queryFn: async () => {
      const res = await api.get<{ data: ApiBusinessListItem[] }>('/businesses', {
        params: {
          query: params.query || undefined,
          city: params.city || undefined,
          categories: categoriesKey || undefined,
          lat: params.nearMeCoords?.lat,
          lng: params.nearMeCoords?.lng,
          radiusKm: params.nearMeCoords != null ? params.radiusKm ?? 20 : undefined,
          availDate: params.availDate || undefined,
        },
      });
      const list = res.data?.data;
      return Array.isArray(list) ? list : [];
    },
    enabled,
  });
}
