import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Stripe } from 'stripe';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async createPaymentIntent(amount: number) {
    const stripe = new Stripe('YOUR_STRIPE_SECRET_KEY', {
      apiVersion: '2022-11-15',
    });
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });
    return paymentIntent;
  }

  async handleWebhook(event: any) {
    const stripe = new Stripe('YOUR_STRIPE_SECRET_KEY', {
      apiVersion: '2022-11-15',
    });
    const constructedEvent = stripe.webhooks.constructEvent(
      event.raw,
      event.sig,
      'YOUR_STRIPE_WEBHOOK_SECRET'
    );
    if (constructedEvent.type === 'payment_intent.succeeded') {
      // Handle successful payment intent
    } else if (constructedEvent.type === 'payment_intent.payment_failed') {
      // Handle failed payment intent
    }
  }
}