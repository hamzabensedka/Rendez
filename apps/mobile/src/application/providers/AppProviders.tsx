import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  Inter_900Black,
} from '@expo-google-fonts/inter';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';

import { QueryClientProvider } from '@tanstack/react-query';
import { appQueryClient } from '../query/queryClient';
import { AuthProvider } from './auth/AuthContext';
import { FavoritesProvider } from './favorites/FavoritesContext';

// Keep the splash screen visible while fonts are loading
SplashScreen.preventAutoHideAsync();

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [loaded, error] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Bold': Inter_700Bold,
    'Inter-Black': Inter_900Black,
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={appQueryClient}>
          <AuthProvider>
            <FavoritesProvider>{children}</FavoritesProvider>
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}


