import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { paymentApi } from '../api';
import { PaymentStatus } from '../types';
import { useNavigation } from '@react-navigation/native';

const PaymentScreen = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.pending);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    try {
      const response = await paymentApi.makePayment();
      setPaymentStatus(response.status);
      if (response.status === PaymentStatus.success) {
        navigation.navigate('Receipt');
      }
    } catch (error) {
      setError(error);
    }
  };

  return (
    <View>
      <Text>Payment Screen</Text>
      {paymentStatus === PaymentStatus.pending && (
        <Button title="Make Payment" onPress={handlePayment} />
      )}
      {paymentStatus === PaymentStatus.success && (
        <Text>Payment successful!</Text>
      )}
      {paymentStatus === PaymentStatus.failure && (
        <Text>Payment failed.</Text>
      )}
      {error && (
        <Text>Error: {error.message}</Text>
      )}
    </View>
  );
};

export default PaymentScreen;
