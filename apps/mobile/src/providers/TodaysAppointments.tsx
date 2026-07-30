import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../auth/auth.context';

const TodaysAppointments = () => {
  const { user } = useAuth();
  const { data, error, isLoading } = useQuery(
    ['today-appointments', user.id],
    async () => {
      const response = await fetch(`https://api.example.com/providers/${user.id}/today-appointments`);
      return response.json();
    }
  );

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <Text>Today's Appointments</Text>
      {data.appointments.map((appointment) => (
        <View key={appointment.id}>
          <Text>{appointment.serviceName}</Text>
          <Text>{appointment.time}</Text>
        </View>
      ))}
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

export default TodaysAppointments;
