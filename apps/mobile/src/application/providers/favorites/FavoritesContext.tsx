import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../../../shared/lib/api';

export interface FavoriteItem {
  businessId: string;
  businessName?: string;
  createdAt: string;
}

/**
 * Favorites: API is source of truth (GET/POST/DELETE /users/me/favorites).
 * When not authenticated, API returns 401 and we show empty list.
 */
interface FavoritesContextType {
  favorites: string[];
  favoriteItems: FavoriteItem[];
  isFavorite: (businessId: string) => boolean;
  toggleFavorite: (businessId: string) => Promise<void>;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  const favorites = favoriteItems.map((item) => item.businessId);

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    try {
      const res = await api.get<FavoriteItem[]>('/users/me/favorites');
      const list = Array.isArray(res.data) ? res.data : [];
      setFavoriteItems(list);
    } catch {
      setFavoriteItems([]);
    } finally {
      setLoading(false);
    }
  }

  function isFavorite(businessId: string): boolean {
    return favorites.includes(businessId);
  }

  async function toggleFavorite(businessId: string) {
    const currentlyFavorite = isFavorite(businessId);
    try {
      if (currentlyFavorite) {
        await api.delete(`/users/me/favorites/${businessId}`);
        setFavoriteItems((prev) => prev.filter((item) => item.businessId !== businessId));
      } else {
        await api.post('/users/me/favorites', { businessId });
        await loadFavorites();
      }
    } catch {
      // Leave state unchanged on error (e.g. 401)
    }
  }

  return (
    <FavoritesContext.Provider value={{ favorites, favoriteItems, isFavorite, toggleFavorite, loading }}>
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
