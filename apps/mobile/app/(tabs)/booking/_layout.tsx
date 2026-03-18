import { Stack } from 'expo-router';

export default function BookingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="identification" />
      <Stack.Screen name="register" />
      <Stack.Screen name="verification" />
      <Stack.Screen name="success" />
    </Stack>
  );
}
