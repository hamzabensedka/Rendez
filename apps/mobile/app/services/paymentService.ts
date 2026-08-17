import axios from 'axios';
import { StripeProvider } from '@stripe/stripe-js';

const stripe = new StripeProvider('YOUR_STRIPE_PUBLISHABLE_KEY');

const paymentService = {
  makePayment: async () => {
    try {
      const paymentResponse = await axios.post('/payments/webhook', {
        amount: 10.99,
        currency: 'usd',
      });
      return paymentResponse.data;
    } catch (error) {
      throw error;
    }
  },
};

export { paymentService };