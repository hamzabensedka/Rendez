import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { paymentApi } from '../api/paymentApi';
import { PaymentStatus } from '../types/PaymentStatus';
import { useNavigation } from '@react-navigation/native';

const PaymentScreen = () => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.Pending);
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const handlePayment = async () => {
    try {
      const response = await paymentApi.makePayment();
      setPaymentStatus(response.status);
      if (response.status === PaymentStatus.Success) {
        navigation.navigate('Receipt');
      }
    } catch (error) {
      setPaymentStatus(PaymentStatus.Failure);
    }
  };

  return (
    <View>
      <Text>Payment Status: {paymentStatus}</Text>
      <Button title="Make Payment" onPress={handlePayment} />
    </View>
  );
};

export default PaymentScreen;
