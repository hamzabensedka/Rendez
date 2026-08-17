import axios from 'axios';
import { PaymentIntent } from '@stripe/stripe-js';

const stripeApiKey = 'YOUR_STRIPE_API_KEY';
const stripeApiUrl = 'https://api.stripe.com/v1';

export const createPaymentIntent = async (paymentMethod: string) => {
  try {
    const response = await axios.post(
      `${stripeApiUrl}/payment_intents`,
      {
        payment_method_types: [paymentMethod],
        amount: 1000,
        currency: 'usd',
        payment_method: paymentMethod,
      },
      {
        headers: {
          'Authorization': `Bearer ${stripeApiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createWebhook = async (paymentIntentId: string) => {
  try {
    const response = await axios.post(
      `${stripeApiUrl}/webhooks`,
      {
        url: 'https://your-webhook-url.com',
        enabled_events: [
          'payment_intent.succeeded',
          'payment_intent.failed',
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${stripeApiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};