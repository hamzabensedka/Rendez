import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../auth/auth.context';

const DashboardSummary = () => {
  const { user } = useAuth();
  const { data, error, isLoading } = useQuery(
    ['dashboard-summary', user.id],
    async () => {
      const response = await fetch(`https://api.example.com/providers/${user.id}/dashboard-summary`);
      return response.json();
    }
  );

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <Text>Dashboard Summary</Text>
      <Text>Appointments: {data.appointments}</Text>
      <Text>Services: {data.services}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DashboardSummary;
