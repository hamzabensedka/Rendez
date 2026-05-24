import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../shared/lib/api';
import { useAuth } from '../auth/AuthContext';
import { queryKeys } from '../../query/queryKeys';

export interface FavoriteItem {
  businessId: string;
  businessName?: string;
  createdAt: string;
}

interface FavoritesContextType {
  favorites: string[];
  favoriteItems: FavoriteItem[];
  isFavorite: (businessId: string) => boolean;
  toggleFavorite: (businessId: string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

async function fetchFavoritesList(): Promise<FavoriteItem[]> {
  try {
    const res = await api.get<FavoriteItem[]>('/users/me/favorites');
    return Array.isArray(res.data) ? res.data : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  const favoritesQuery = useQuery({
    queryKey: queryKeys.favorites(userId),
    queryFn: fetchFavoritesList,
    enabled: Boolean(userId),
  });

  const favoriteItems = userId ? (favoritesQuery.data ?? []) : [];
  const loading = Boolean(userId) && favoritesQuery.isPending;

  const favorites = useMemo(
    () => favoriteItems.map((item: FavoriteItem) => item.businessId),
    [favoriteItems]
  );

  const refreshFavorites = useCallback(async () => {
    if (!userId) return;
    await queryClient.invalidateQueries({ queryKey: queryKeys.favorites(userId) });
  }, [queryClient, userId]);

  type ToggleVars = { businessId: string; add: boolean };
  type ToggleCtx = { previous: FavoriteItem[] | undefined };

  const toggleMutation = useMutation({
    mutationFn: async ({ businessId, add }: ToggleVars) => {
      if (add) {
        await api.post('/users/me/favorites', { businessId });
      } else {
        await api.delete(`/users/me/favorites/${businessId}`);
      }
    },
    onMutate: async ({ businessId, add }: ToggleVars): Promise<ToggleCtx | undefined> => {
      if (!userId) return undefined;
      await queryClient.cancelQueries({ queryKey: queryKeys.favorites(userId) });
      const previous = queryClient.getQueryData(queryKeys.favorites(userId)) as
        | FavoriteItem[]
        | undefined;
      queryClient.setQueryData(queryKeys.favorites(userId), (old: FavoriteItem[] = []) => {
        if (add) {
          return [
            ...old.filter((item: FavoriteItem) => item.businessId !== businessId),
            { businessId, createdAt: new Date().toISOString() },
          ];
        }
        return old.filter((item: FavoriteItem) => item.businessId !== businessId);
      });
      return { previous };
    },
    onError: (_err: Error, _vars: ToggleVars, context: ToggleCtx | undefined) => {
      if (!userId || context?.previous === undefined) return;
      queryClient.setQueryData(queryKeys.favorites(userId), context.previous);
    },
  });

  const isFavorite = useCallback(
    (businessId: string) => favorites.includes(businessId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (businessId: string) => {
      if (!userId) return;
      const add = !favorites.includes(businessId);
      await toggleMutation.mutateAsync({ businessId, add });
    },
    [userId, favorites, toggleMutation]
  );

  const value = useMemo(
    () => ({
      favorites,
      favoriteItems,
      isFavorite,
      toggleFavorite,
      refreshFavorites,
      loading,
    }),
    [favorites, favoriteItems, isFavorite, toggleFavorite, refreshFavorites, loading]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
