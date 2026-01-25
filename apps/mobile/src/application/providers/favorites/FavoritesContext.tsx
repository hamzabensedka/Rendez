import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

interface FavoritesContextType {
  favorites: string[];
  isFavorite: (businessId: string) => boolean;
  toggleFavorite: (businessId: string) => Promise<void>;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
const FAVORITES_KEY = 'favorites';

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    try {
      const stored = await SecureStore.getItemAsync(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  }

  async function saveFavorites(newFavorites: string[]) {
    try {
      await SecureStore.setItemAsync(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  }

  function isFavorite(businessId: string): boolean {
    return favorites.includes(businessId);
  }

  async function toggleFavorite(businessId: string) {
    const newFavorites = isFavorite(businessId)
      ? favorites.filter((id) => id !== businessId)
      : [...favorites, businessId];
    await saveFavorites(newFavorites);
  }

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}


