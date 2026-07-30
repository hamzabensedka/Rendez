import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';

@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;

  constructor(
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async processStripeEvent(event: Stripe.Event, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let stripeEvent: Stripe.Event;

    try {
      stripeEvent = this.stripe.webhooks.constructEvent(
        event.rawBody as Buffer,
        signature,
        webhookSecret,
      );
    } catch (err) {
      throw new BadRequestException(`Webhook signature verification failed: ${err.message}`);
    }

    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSession(stripeEvent);
        break;
      default:
        console.log(`Unhandled Stripe event type: ${stripeEvent.type}`);
    }
  }

  private async handleCheckoutSession(event: Stripe.Event) {
    const session = event.data.object as Stripe.Checkout.Session;
    // Example: mark the related appointment as paid
    // Implementation would retrieve appointment ID from session.metadata, etc.
    console.log('Checkout session completed, handling payment...');
  }
}