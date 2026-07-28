import { create } from 'zustand';
import { api } from '../lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'provider' | 'admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
    set({ token });
  },
  logout: () => {
    set({ user: null, token: null });
    delete api.defaults.headers.common['Authorization'];
  },
  loadAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('auth-token');
      if (token) {
        get().setToken(token);
        const res = await api.get('/auth/me');
        set({ user: res.data, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ user: null, token: null, isLoading: false });
    }
  },
}));

export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    token: store.token,
    isLoading: store.isLoading,
    setUser: store.setUser,
    setToken: store.setToken,
    logout: store.logout,
    loadAuth: store.loadAuth,
  };
};
