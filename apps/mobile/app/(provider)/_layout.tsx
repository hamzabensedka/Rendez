import { Stack } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { Redirect } from 'expo-router';

export default function ProviderLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user || user.role !== 'provider') {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="appointments" />
      <Stack.Screen name="services" />
      <Stack.Screen name="availability" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
