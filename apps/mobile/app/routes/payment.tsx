import { createPaymentIntent, createWebhook } from '../services/stripe';
import { PaymentIntent } from '../types/stripe';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { ExpoRouter } from 'expo-router';

const PaymentScreen = () => {
  const navigation = useNavigation();
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      const intent = await createPaymentIntent();
      setPaymentIntent(intent);
    };
    fetchPaymentIntent();
  }, []);

  const handlePayment = async () => {
    if (!paymentIntent) return;
    try {
      const webhook = await createWebhook();
      // Handle payment with Stripe
      setPaymentStatus('success');
    } catch (error) {
      setPaymentStatus('failed');
    }
  };

  return (
    <View>
      <Text>Payment Screen</Text>
      <Button title='Pay' onPress={handlePayment} />
      <Text>Payment Status: {paymentStatus}</Text>
    </View>
  );
};

export default PaymentScreen;