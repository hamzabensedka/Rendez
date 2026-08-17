import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Stripe } from 'stripe';
import { Payment } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async createPayment(createPaymentDto: any) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: createPaymentDto.amount,
        currency: 'usd',
        payment_method_types: ['card'],
      });

      const payment = await this.prisma.payment.create({
        data: {
          amount: createPaymentDto.amount,
          paymentIntentId: paymentIntent.id,
          status: 'pending',
        },
      });

      return payment;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}