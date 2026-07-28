import { Stack } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function ProviderLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Role gate: only allow provider or admin roles
  if (!user || (user.role !== 'provider' && user.role !== 'admin')) {
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
          headerBackTitle: 'Dashboard',
        }}
      />
      <Stack.Screen
        name="service/[id]"
        options={{
          headerShown: true,
          headerTitle: 'Edit Service',
          headerBackTitle: 'Services',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
