import { Stack } from 'expo-router';

export default function TabsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="explore" />
      <Stack.Screen name="bookings" />
      <Stack.Screen name="bookings/[id]" options={{ title: 'Appointment' }} />
      <Stack.Screen name="favorites" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="booking" />
      <Stack.Screen name="business/[id]" />
    </Stack>
  );
}

