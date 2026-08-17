import { ExpoRouter } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';
import { useQueryClient } from '@tanstack/react-query';
import { paymentIntent } from '../api';
import { PaymentScreen } from '../features/payment';

const PaymentRoute = () => {
  const queryClient = useQueryClient();

  const handlePayment = async () => {
    const paymentIntentResponse = await paymentIntent();
    const { clientSecret } = paymentIntentResponse;

    // Initialize Stripe
    const stripe = StripeProvider.init('publishable_key');

    // Confirm payment
    const paymentResponse = await stripe.confirmPaymentIntent(clientSecret);

    if (paymentResponse.status === 'succeeded') {
      // Update payment status
      await queryClient.invalidateQueries('paymentStatus');
    }
  };

  return (
    <StripeProvider publishableKey="publishable_key">
      <PaymentScreen onPay={handlePayment} />
    </StripeProvider>
  );
};

export default PaymentRoute;