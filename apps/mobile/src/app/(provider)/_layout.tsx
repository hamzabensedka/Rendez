import { Stack } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function ProviderLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Gate: only allow provider role users
  if (!user || user.role !== 'provider') {
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
      <Stack.Screen
        name="appointment/[id]"
        options={{
          headerShown: true,
          headerTitle: 'Appointment Details',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="service/[id]"
        options={{
          headerShown: true,
          headerTitle: 'Edit Service',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
