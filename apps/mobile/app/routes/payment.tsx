import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { zodSchema } from 'zod-schema';
import { StripeProvider } from '@stripe/stripe-react-native';
import { usePaymentIntent } from '../hooks/usePaymentIntent';
import { usePaymentMutation } from '../hooks/usePaymentMutation';
import { PaymentIntent } from '../types/PaymentIntent';
import { Payment } from '../types/Payment';

const PaymentScreen = () => {
  const navigation = useNavigation();
  const { register, handleSubmit } = useForm<Payment>();
  const { mutate: createPaymentIntent } = usePaymentIntent();
  const { mutate: createPayment } = usePaymentMutation();

  const handlePayment = async (data: Payment) => {
    try {
      const paymentIntent: PaymentIntent = await createPaymentIntent(
        {
          amount: data.amount,
          currency: 'usd',
          payment_method_types: ['card'],
        }
      );

      const paymentMethod = await StripeProvider.setOptions({
        publishingKey: 'YOUR_PUBLISHABLE_KEY',
        merchantId: 'YOUR_MERCHANT_ID',
      });

      const payment = await StripeProvider.paymentRequestWithCardForm(
        paymentIntent.id,
        paymentMethod
      );

      if (payment.status === 'succeeded') {
        await createPayment({
          appointmentId: data.appointmentId,
          providerTxn: payment.transactionId,
          amount: data.amount,
          status: 'paid',
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Text>Payment Screen</Text>
      <TouchableOpacity onPress={handleSubmit(handlePayment)}>
        <Text>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentScreen;