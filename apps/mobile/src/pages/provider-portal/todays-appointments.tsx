import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getTodaysAppointments } from '../api/provider-api';

const TodaysAppointments = () => {
  const { data, isLoading, error } = useQuery(['todaysAppointments'], getTodaysAppointments);

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.appointmentContainer}>
            <Text>Client Name: {item.clientName}</Text>
            <Text>Service: {item.service}</Text>
            <Text>Time: {item.time}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentContainer: {
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
  },
});

export default TodaysAppointments;
