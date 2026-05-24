import { useQuery } from '@tanstack/react-query';
import api from '../../../shared/lib/api';
import { queryKeys } from '../queryKeys';

export interface AppointmentsPageResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export function useAppointmentsUpcomingQuery<T>(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.appointmentsUpcoming(userId),
    queryFn: async (): Promise<T[]> => {
      const response = await api.get<AppointmentsPageResponse<T>>('/appointments/me?upcoming=true');
      return response.data.data ?? [];
    },
    enabled: Boolean(userId),
  });
}
