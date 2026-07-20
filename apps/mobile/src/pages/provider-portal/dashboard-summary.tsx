import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getProviderDashboardSummary } from '../api/provider-api';

const DashboardSummary = () => {
  const { data, isLoading, error } = useQuery(['providerDashboardSummary'], getProviderDashboardSummary);

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <Text>Today's Appointments: {data.todayAppointments}</Text>
      <Text>Total Bookings: {data.totalBookings}</Text>
      <Text>Revenue: {data.revenue}</Text>
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
