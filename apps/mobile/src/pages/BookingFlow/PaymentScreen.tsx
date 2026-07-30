import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { PaymentStatus } from '../shared/types';
import { paymentApi } from '../api/paymentApi';
import { useNavigation } from '@react-navigation/native';

const PaymentScreen = () => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.IDLE);
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const handlePayment = async () => {
    try {
      const paymentResponse = await paymentApi.makePayment();
      setPaymentStatus(PaymentStatus.SUCCESS);
      // Update booking status
      await queryClient.invalidateQueries('booking');
      navigation.navigate('BookingConfirmation');
    } catch (error) {
      setPaymentStatus(PaymentStatus.FAILURE);
    }
  };

  return (
    <View>
      <Text>Payment Screen</Text>
      {paymentStatus === PaymentStatus.IDLE && (
        <Button title='Make Payment' onPress={handlePayment} />
      )}
      {paymentStatus === PaymentStatus.SUCCESS && (
        <Text>Payment successful!</Text>
      )}
      {paymentStatus === PaymentStatus.FAILURE && (
        <Text>Payment failed.</Text>
      )}
    </View>
  );
};

export default PaymentScreen;
