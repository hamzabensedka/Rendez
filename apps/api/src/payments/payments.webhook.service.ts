import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentsWebhookService {
  constructor(private configService: ConfigService) {}

  async handle(event: Stripe.Event) {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // Example: mark appointment as paid
        // const appointmentId = paymentIntent.metadata?.appointmentId;
        // if (appointmentId) {
        //   // update DB
        // }
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // Example: send failure email
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }
}