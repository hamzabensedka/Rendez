import { create } from 'zustand';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),
}));

export function useAuth() {
  const { user, token, isLoading, setUser, setToken, logout } = useAuthStore();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: () => api.get('/auth/me').then((r) => r.data),
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    }
  }, [session]);

  return {
    user,
    token,
    isLoading,
    setUser,
    setToken,
    logout,
    isProvider: user?.role === 'provider',
  };
}
