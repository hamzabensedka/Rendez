import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../auth/auth.context';
import { useNavigation } from '@react-navigation/native';
import { ExpoRouter } from 'expo-router';
import { ReanimatedView } from 'react-native-reanimated';

const ProviderPortal = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const { data, error, isLoading } = useQuery(
    ['provider-portal', user.id],
    async () => {
      const response = await fetch(`https://api.example.com/providers/${user.id}`);
      return response.json();
    }
  );

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <ReanimatedView style={styles.container}>
      <Text>Provider Portal</Text>
      <Text>Welcome, {user.name}</Text>
      <ExpoRouter
        initialRoute={{ name: 'dashboard' }}
        routes={[
          {
            name: 'dashboard',
            component: <DashboardSummary />,
            initialRoute: true,
          },
          {
            name: 'today-appointments',
            component: <TodaysAppointments />,
          },
          {
            name: 'quick-service-edit',
            component: <QuickServiceEdit />,
          },
        ]}
      />
    </ReanimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProviderPortal;
