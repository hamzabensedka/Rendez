import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { updateService } from '../api/provider.api';

const QuickServiceEdit = () => {
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const { mutate, error, isLoading } = useMutation(['updateService'], updateService);

  const handleSubmit = () => {
    mutate({ serviceName, servicePrice });
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      <Text>Quick Service Edit</Text>
      <TextInput
        placeholder='Service Name'
        value={serviceName}
        onChangeText={(text) => setServiceName(text)}
      />
      <TextInput
        placeholder='Service Price'
        value={servicePrice}
        onChangeText={(text) => setServicePrice(text)}
      />
      <Button title='Update Service' onPress={handleSubmit} />
    </View>
  );
};

export default QuickServiceEdit;