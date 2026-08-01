import { Stack } from 'expo-router';
import { useAuth } from '@/providers/auth-provider';
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

  // Gate: only users with provider role can access these screens
  if (!user || user.role !== 'provider') {
    return <Redirect href="/(app)" />;
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
        name="service-edit"
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack>
  );
}
