import { Router, Route, Outlet, Link } from '@tanstack/react-router';
import React from 'react';
import { Text, View } from 'react-native';
import { StripeProvider } from 'react-stripe-elements';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { usePayment } from '../../hooks/usePayment';

const PaymentRoute = () => {
  const { user } = useAuth();
  const { paymentMethod } = usePayment();
  const queryClient = useQueryClient();

  const handlePayment = async () => {
    try {
      const paymentIntent = await paymentMethod.createPaymentIntent({
        amount: 1000,
        currency: 'usd',
        payment_method_types: ['card'],
      });
      await queryClient.invalidateQueries('paymentIntent');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <StripeProvider
      publishableKey='YOUR_PUBLISHABLE_KEY'
      merchantId='YOUR_MERCHANT_ID'
    >
      <View>
        <Text>Payment Method:</Text>
        <Text>{paymentMethod.id}</Text>
        <Link to='/payment/success'>Make Payment</Link>
        <Button title='Make Payment' onPress={handlePayment} />
      </View>
    </StripeProvider>
  );
};

export default PaymentRoute;