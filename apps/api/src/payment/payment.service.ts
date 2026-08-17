import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Stripe } from 'stripe';
import { Payment } from '@prisma/client';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private readonly prismaService: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  async createPaymentIntent(amount: number) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });
    return paymentIntent;
  }

  async handleWebhook(createPaymentDto: any) {
    const signature = createPaymentDto.headers['stripe-signature'];
    const event = this.stripe.webhooks.constructEvent(
      createPaymentDto.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const payment = await this.prismaService.payment.create({
        data: {
          appointmentId: paymentIntent.metadata.appointmentId,
          providerTxn: paymentIntent.id,
          amount: paymentIntent.amount,
          status: 'success',
        },
      });
      return payment;
    }
  }
}
