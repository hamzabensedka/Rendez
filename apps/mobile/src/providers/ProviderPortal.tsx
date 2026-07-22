import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'expo-router';
import { Auth } from '../auth';
import { Appointment } from '../appointments';
import { Business } from '../businesses';

const ProviderPortal = () => {
  const route = useRoute();
  const { data: user } = Auth.useUser();
  const { data: appointments } = useQuery(['appointments'], () => Appointment.getAppointmentsForProvider(user.id));
  const { data: business } = useQuery(['business'], () => Business.getBusinessForProvider(user.id));

  if (!user || !appointments || !business) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text>Provider Portal</Text>
      <Text>Dashboard Summary</Text>
      <View style={styles.summaryContainer}>
        <Text>Total Appointments: {appointments.length}</Text>
        <Text>Total Revenue: ${business.revenue}</Text>
      </View>
      <Text>Today's Appointments</Text>
      <View style={styles.appointmentsContainer}>
        {appointments.map((appointment) => (
          <View key={appointment.id} style={styles.appointmentContainer}>
            <Text>{appointment.serviceName}</Text>
            <Text>{appointment.startTime}</Text>
          </View>
        ))}
      </View>
      <Text>Quick Service Edit</Text>
      <View style={styles.serviceContainer}>
        {business.services.map((service) => (
          <View key={service.id} style={styles.serviceItemContainer}>
            <Text>{service.name}</Text>
            <Text>${service.price}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  summaryContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 20,
  },
  appointmentsContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 20,
  },
  appointmentContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  serviceContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 20,
  },
  serviceItemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default ProviderPortal;
