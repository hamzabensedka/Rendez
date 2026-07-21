import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'expo-router';
import { getUserAppointments } from '../api/appointments';
import { getBusinessServices } from '../api/businesses';

const ProviderPortal = () => {
  const route = useRoute();
  const { data: appointments } = useQuery(['appointments'], getUserAppointments);
  const { data: services } = useQuery(['services'], getBusinessServices);

  return (
    <View style={styles.container}>
      <Text>Provider Portal</Text>
      <View style={styles.summarySection}>
        <Text>Dashboard Summary</Text>
        {/* Add dashboard summary components here */}
      </View>
      <View style={styles.appointmentsSection}>
        <Text>Today's Appointments</Text>
        {appointments && appointments.map((appointment) => (
          <View key={appointment.id}>
            <Text>{appointment.serviceName}</Text>
            <Text>{appointment.startTime}</Text>
          </View>
        ))}
      </View>
      <View style={styles.servicesSection}>
        <Text>Quick Service Edit</Text>
        {services && services.map((service) => (
          <View key={service.id}>
            <Text>{service.name}</Text>
            {/* Add service edit components here */}
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
  summarySection: {
    marginBottom: 20,
  },
  appointmentsSection: {
    marginBottom: 20,
  },
  servicesSection: {
    marginBottom: 20,
  },
});

export default ProviderPortal;
