import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { expo } from '../../api';
import { PaymentStatus } from '../../shared/types';
import { usePaymentMutation } from '../../api/mutations';

const PaymentStep = () => {
  const queryClient = useQueryClient();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.Pending);
  const { mutate: makePayment } = usePaymentMutation();

  const handlePayment = async () => {
    try {
      const response = await makePayment();
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
        <Text>Payment successful!</Text>
      )}
      {paymentStatus === PaymentStatus.Failure && (
        <Text>Payment failed.</Text>
      )}
    </View>
  );
};

export default PaymentStep;