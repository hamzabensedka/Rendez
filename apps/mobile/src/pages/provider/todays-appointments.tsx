import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getTodaysAppointments } from '../api/provider.api';

const TodaysAppointments = () => {
  const { data, error, isLoading } = useQuery(['todaysAppointments'], getTodaysAppointments);

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      <Text>Todays Appointments</Text>
      <FlatList
        data={data.appointments}
        renderItem={({ item }) => (
          <View>
            <Text>{item.customerName}</Text>
            <Text>{item.serviceName}</Text>
            <Text>{item.appointmentTime}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default TodaysAppointments;