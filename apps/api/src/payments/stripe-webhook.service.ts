import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeWebhookService {
  private stripe: Stripe;
  private endpointSecret: string;

  constructor(private config: ConfigService) {
    this.stripe = new Stripe(this.config.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });
    this.endpointSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET');
  }

  async handleWebhook(signature: string, payload: any) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.endpointSecret,
      );
      // Placeholder handling – log event type
      console.log('Stripe webhook received:', event.type);
      return { success: true, event };
    } catch (err) {
      throw new BadRequestException(`Webhook signature verification failed: ${err.message}`);
    }
  }
}