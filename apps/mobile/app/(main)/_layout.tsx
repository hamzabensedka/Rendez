import { Stack } from 'expo-router';
import { View } from 'react-native';
import { BottomNav } from '../../src/application/components/BottomNav';

/** Main app stack under `(main)`; global chrome is BottomNav (not Expo Tabs). */
export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
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
      <BottomNav />
    </View>
  );
}

