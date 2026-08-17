import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Stripe } from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private readonly prismaService: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  async createPayment(createPaymentDto: any) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: createPaymentDto.amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    const payment = await this.prismaService.payment.create({
      data: {
        appointmentId: createPaymentDto.appointmentId,
        providerTxn: paymentIntent.id,
        amount: createPaymentDto.amount,
        status: 'pending',
      },
    });

    return payment;
  }
}
