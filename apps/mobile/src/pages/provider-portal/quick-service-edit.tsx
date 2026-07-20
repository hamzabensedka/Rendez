import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { updateService } from '../api/provider-api';

const QuickServiceEdit = () => {
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const { mutate, isLoading, error } = useMutation(['updateService'], updateService);

  const handleUpdateService = () => {
    mutate({ name: serviceName, price: servicePrice });
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <Text>Service Name:</Text>
      <TextInput
        style={styles.input}
        value={serviceName}
        onChangeText={(text) => setServiceName(text)}
      />
      <Text>Service Price:</Text>
      <TextInput
        style={styles.input}
        value={servicePrice}
        onChangeText={(text) => setServicePrice(text)}
      />
      <Button title='Update Service' onPress={handleUpdateService} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    margin: 10,
  },
});

export default QuickServiceEdit;
