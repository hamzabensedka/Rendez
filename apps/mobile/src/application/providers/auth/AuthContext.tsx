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
  login: (user: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    // Dev mode: bypass authentication entirely (no login required)
    if (process.env.EXPO_PUBLIC_BYPASS_AUTH === 'true') {
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
      }
    } catch {
      // Not authenticated
    } finally {
      setLoading(false);
    }
  }

  function login(userData: User) {
    setUser(userData);
  }

  async function logout() {
    if (process.env.EXPO_PUBLIC_BYPASS_AUTH === 'true') {
      // Keep the dev user signed in
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
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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


