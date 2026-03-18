import { View } from 'react-native';
import { Stack, useSegments } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../src/application/providers';
import { BottomNav, BOTTOM_NAV_TOTAL } from '../../src/application/components/BottomNav';

export default function TabsLayout() {
  const { loading, user } = useAuth();
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const firstSegment = Array.isArray(segments) ? segments[1] : undefined;
  const isExplore = firstSegment === 'explore';
  const showBottomNav = !!user;
  const bottomPadding =
    !showBottomNav || isExplore ? 0 : BOTTOM_NAV_TOTAL + insets.bottom;

  if (loading) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { paddingBottom: bottomPadding },
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
      {showBottomNav && <BottomNav />}
    </View>
  );
}

