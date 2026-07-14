import { useQuery } from '@tanstack/react-query';
import api from '../../../shared/lib/api';
import { queryKeys } from '../queryKeys';

export function useBusinessDetailQuery<T = unknown>(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.business(id),
    queryFn: async () => {
      const res = await api.get<T>(`/businesses/${id}`);
      return res.data;
    },
    enabled: Boolean(id),
  });
}
