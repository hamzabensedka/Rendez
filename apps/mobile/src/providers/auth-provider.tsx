import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { apiClient } from '@/lib/api-client';
import { storage } from '@/lib/storage';

type User = {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'provider' | 'admin';
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const token = await storage.getToken();
      if (!token) {
        setUser(null);
        return;
      }
      const { data } = await apiClient.get('/auth/me');
      setUser(data.user);
    } catch (error) {
      setUser(null);
      await storage.removeToken();
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const signIn = async (email: string, password: string) => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    await storage.setToken(data.accessToken);
    setUser(data.user);
  };

  const signOut = async () => {
    await storage.removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signIn, signOut, refreshUser }}
    >
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
