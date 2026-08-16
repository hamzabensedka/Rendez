import Stripe from 'stripe';

const stripe = new Stripe('YOUR_STRIPE_SECRET_KEY', {
  apiVersion: '2022-11-15',
});

export const createPaymentIntent = async () => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: 'usd',
    payment_method_types: ['card'],
  });
  return paymentIntent;
};

export const createWebhook = async () => {
  const webhook = await stripe.webhooks.create({
    url: 'https://your-webhook-url.com',
    enabled_events: ['payment_intent.succeeded'],
  });
  return webhook;
};