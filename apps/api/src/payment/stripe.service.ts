import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);
  private readonly webhookSecret: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!apiKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }

    this.stripe = new Stripe(apiKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    });

    this.webhookSecret =
      this.configService.get<string>('STRIPE_WEBHOOK_SECRET') ?? '';

    this.logger.log('Stripe service initialized');
  }

  /**
   * Creates a Stripe Checkout Session for a payment.
   */
  async createCheckoutSession(params: {
    paymentId: string;
    amount: number;
    currency: string;
    customerEmail: string;
    metadata: Record<string, string>;
    successUrl: string;
    cancelUrl: string;
    stripeAccount?: string;
  }): Promise<Stripe.Checkout.Session> {
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: params.currency,
            product_data: {
              name: 'Appointment Payment',
              description: `Payment for appointment`,
            },
            unit_amount: Math.round(params.amount * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: params.customerEmail,
      metadata: params.metadata,
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes
    };

    // If the business has a connected Stripe account, use it for direct charges
    if (params.stripeAccount) {
      stripeParams.payment_intent_data = {
        application_fee_amount: Math.round(params.amount * 0.1 * 100), // 10% platform fee
        transfer_data: {
          destination: params.stripeAccount,
        },
      };
    }

    return this.stripe.checkout.sessions.create(stripeParams);
  }

  /**
   * Verifies the Stripe webhook signature.
   */
  constructWebhookEvent(
    payload: Buffer,
    signature: string,
  ): Stripe.Event {
    if (!this.webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
    }

    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.webhookSecret,
    );
  }

  /**
   * Retrieves a checkout session by ID.
   */
  async getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    return this.stripe.checkout.sessions.retrieve(sessionId);
  }

  /**
   * Retrieves a payment intent by ID.
   */
  async getPaymentIntent(intentId: string): Promise<Stripe.PaymentIntent> {
    return this.stripe.paymentIntents.retrieve(intentId);
  }
}
