import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { getCurrentUser, logout as apiLogout } from '../../../shared/lib/auth';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (user: User) => void;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Bypass is allowed only in development builds; production cannot enable it via env. */
const isBypassAllowed =
  typeof __DEV__ !== 'undefined' && __DEV__ === true &&
  process.env.EXPO_PUBLIC_BYPASS_AUTH === 'true';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    setError(null);
    // Dev-only bypass: never active in production (EXPO_PUBLIC_* is build-time; production builds don't set this)
    if (isBypassAllowed) {
      setUser({
        id: 'dev-user',
        email: 'dev@rendez.local',
        name: 'Dev User',
        role: 'client',
      });
      setLoading(false);
      return;
    }

    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        const userData = await getCurrentUser();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Auth check failed';
      setError(message);
      if (__DEV__) {
        console.warn('[AuthContext] Bootstrap auth check failed:', e);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  function login(userData: User) {
    setUser(userData);
    setError(null);
  }

  function clearError() {
    setError(null);
  }

  async function logout() {
    if (isBypassAllowed) {
      return;
    }
    try {
      await apiLogout();
    } catch {
      // Ignore errors
    } finally {
      setUser(null);
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


