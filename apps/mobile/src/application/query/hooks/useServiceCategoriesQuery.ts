import { useQuery } from '@tanstack/react-query';
import api from '../../../shared/lib/api';
import { queryKeys } from '../queryKeys';

export interface ServiceCategoryDto {
  slug: string;
  label: string;
  sortOrder: number;
}

export function useServiceCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.serviceCategories(),
    queryFn: async () => {
      const res = await api.get<{ data: ServiceCategoryDto[] }>('/service-categories');
      const list = res.data?.data;
      return Array.isArray(list) ? list : [];
    },
    staleTime: 1000 * 60 * 60,
  });
}
