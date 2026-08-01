import React from 'react';
import { Stack } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function ProviderLayout() {
  const { user, isLoading, isProvider } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!user || !isProvider) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="appointments" />
      <Stack.Screen name="services" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
