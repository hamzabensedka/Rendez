import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../auth/auth.context';

const QuickServiceEdit = () => {
  const { user } = useAuth();
  const { data, error, isLoading } = useQuery(
    ['quick-service-edit', user.id],
    async () => {
      const response = await fetch(`https://api.example.com/providers/${user.id}/quick-service-edit`);
      return response.json();
    }
  );

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <Text>Quick Service Edit</Text>
      <Text>Service Name: {data.serviceName}</Text>
      <Text>Service Price: {data.servicePrice}</Text>
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

export default QuickServiceEdit;
