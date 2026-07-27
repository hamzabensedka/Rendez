import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../auth/auth-context';
import { getProviderAppointments } from '../api/appointments';
import { getProviderServices } from '../api/services';

const ProviderPortal = () => {
  const { user } = useAuth();
  const { data: appointments, isLoading: isLoadingAppointments } = useQuery(
    ['provider-appointments', user.id],
    () => getProviderAppointments(user.id)
  );
  const { data: services, isLoading: isLoadingServices } = useQuery(
    ['provider-services', user.id],
    () => getProviderServices(user.id)
  );

  if (isLoadingAppointments || isLoadingServices) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text>Provider Portal</Text>
      <Text>Appointments:</Text>
      {appointments.map((appointment) => (
        <View key={appointment.id}>
          <Text>{appointment.serviceName}</Text>
          <Text>{appointment.date}</Text>
          <Text>{appointment.time}</Text>
        </View>
      ))}
      <Text>Services:</Text>
      {services.map((service) => (
        <View key={service.id}>
          <Text>{service.name}</Text>
          <Text>{service.description}</Text>
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

export default ProviderPortal;
