import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser } from '../api/auth.service';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'provider' | 'admin';
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const isProvider = user?.role === 'provider' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  const logout = useCallback(async () => {
    queryClient.setQueryData(['current-user'], null);
    queryClient.invalidateQueries();
  }, [queryClient]);

  return {
    user,
    isLoading,
    error,
    isProvider,
    isAdmin,
    logout,
  };
}
