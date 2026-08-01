import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { usePayment } from '../hooks/usePayment';
import { PaymentStatus } from '../types/PaymentStatus';
import { ExpoRouter } from 'expo-router';
import { useQueryClient } from 'tanstack-react-query';

const PaymentStep = () => {
  const { mutate: makePayment } = usePayment();
  const queryClient = useQueryClient();

  const handlePayment = async () => {
    try {
      const paymentResponse = await makePayment();
      if (paymentResponse.status === PaymentStatus.SUCCESS) {
        queryClient.invalidateQueries('bookings');
        ExpoRouter.navigate('BookingConfirmation');
      } else {
        console.error('Payment failed');
      }
    } catch (error) {
      console.error('Error making payment:', error);
    }
  };

  return (
    <View>
      <Text>Payment Step</Text>
      <TouchableOpacity onPress={handlePayment}>
        <Text>Make Payment</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentStep;