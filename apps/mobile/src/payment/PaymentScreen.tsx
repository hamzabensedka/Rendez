import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { ExpoRouter } from 'expo-router';
import { paymentApi } from '../api';

const PaymentScreen = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvc, setCvc] = useState('');
  const queryClient = useQueryClient();

  const handlePayment = async () => {
    try {
      const paymentMethod = {
        cardNumber,
        expirationDate,
        cvc,
      };
      const response = await paymentApi.createPaymentMethod(paymentMethod);
      await queryClient.invalidateQueries('paymentMethods');
      ExpoRouter.navigate('payment-success');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Text>Payment Form</Text>
      <TextInput
        placeholder='Card Number'
        value={cardNumber}
        onChangeText={setCardNumber}
      />
      <TextInput
        placeholder='Expiration Date'
        value={expirationDate}
        onChangeText={setExpirationDate}
      />
      <TextInput
        placeholder='CVC'
        value={cvc}
        onChangeText={setCvc}
      />
      <Button title='Pay' onPress={handlePayment} />
    </View>
  );
};

export default PaymentScreen;
