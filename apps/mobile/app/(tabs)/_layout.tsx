import { Stack } from 'expo-router';
import { useAuth } from '../../src/application/providers';

export default function TabsLayout() {
  const { loading } = useAuth();

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="explore" />
      <Stack.Screen name="bookings" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="booking" />
      <Stack.Screen name="business/[id]" />
    </Stack>
  );
}

