import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { PaymentStatus } from '../../../../shared/types';
import { paymentApi } from '../../../api';
import { useNavigation } from '@react-navigation/native';

const PaymentStep = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.Pending);

  const handlePayment = async () => {
    try {
      const paymentResponse = await paymentApi.makePayment();
      setPaymentStatus(PaymentStatus.Success);
    } catch (error) {
      setPaymentStatus(PaymentStatus.Failure);
    }
  };

  return (
    <View>
      <Text>Payment Step</Text>
      {paymentStatus === PaymentStatus.Pending && (
        <TouchableOpacity onPress={handlePayment}>
          <Text>Make Payment</Text>
        </TouchableOpacity>
      )}
      {paymentStatus === PaymentStatus.Success && (
        <Text>Payment Successful</Text>
      )}
      {paymentStatus === PaymentStatus.Failure && (
        <Text>Payment Failed</Text>
      )}
    </View>
  );
};

export default PaymentStep;