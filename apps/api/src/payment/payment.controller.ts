import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Stripe } from 'stripe';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() dto: any) {
    const stripe = new Stripe('YOUR_STRIPE_SECRET_KEY', {
      apiVersion: '2022-11-15',
    });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000,
      currency: 'usd',
      payment_method_types: ['card'],
    });
    return { clientSecret: paymentIntent.client_secret };
  }

  @Post('webhook')
  async handleWebhook(@Body() dto: any) {
    const stripe = new Stripe('YOUR_STRIPE_SECRET_KEY', {
      apiVersion: '2022-11-15',
    });
    const event = stripe.webhooks.constructEvent(
      dto.raw,
      dto.sig,
      'YOUR_STRIPE_WEBHOOK_SECRET'
    );
    if (event.type === 'payment_intent.succeeded') {
      // Handle successful payment intent
    } else if (event.type === 'payment_intent.payment_failed') {
      // Handle failed payment intent
    }
  }
}