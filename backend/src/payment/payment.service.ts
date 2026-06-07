import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(amount: number, currency: string, businessId: string, customerId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency || 'usd',
        metadata: {
          businessId,
          customerId,
        },
      });
      return paymentIntent;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create payment intent');
    }
  }

  async confirmPayment(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      throw new BadRequestException('Payment confirmation failed');
    }
  }

  async processRefund(paymentIntentId: string, amount?: number): Promise<Stripe.Refund> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });
      return refund;
    } catch (error) {
      throw new InternalServerErrorException('Refund processing failed');
    }
  }

  async savePaymentMethod(customerId: string, paymentMethodId: string): Promise<Stripe.PaymentMethod> {
    try {
      const paymentMethod = await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });
      return paymentMethod;
    } catch (error) {
      throw new BadRequestException('Failed to save payment method');
    }
  }

  async getPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });
      return paymentMethods.data;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve payment methods');
    }
  }

  async handleWebhook(payload: Buffer, signature: string): Promise<void> {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);
    } catch (error) {
      throw new BadRequestException('Webhook signature verification failed');
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const { businessId, customerId } = paymentIntent.metadata;
    await this.prisma.payment.create({
      data: {
        stripePaymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: 'succeeded',
        businessId,
        customerId,
      },
    });
    // Invalidate relevant cache
    await this.redis.del(`payment:${paymentIntent.id}`);
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const { businessId, customerId } = paymentIntent.metadata;
    await this.prisma.payment.create({
      data: {
        stripePaymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: 'failed',
        businessId,
        customerId,
      },
    });
  }
}