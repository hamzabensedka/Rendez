import React from 'react';
import { View, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getProviderSummary } from '../api/provider.api';

const DashboardSummary = () => {
  const { data, error, isLoading } = useQuery(['providerSummary'], getProviderSummary);

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      <Text>Provider Dashboard Summary</Text>
      <Text>Appointments: {data.appointments}</Text>
      <Text>Services: {data.services}</Text>
    </View>
  );
};

export default DashboardSummary;