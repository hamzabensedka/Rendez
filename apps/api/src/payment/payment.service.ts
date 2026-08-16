import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  async createPayment(createPaymentDto: CreatePaymentDto) {
    try {
      const payment = await this.stripe.charges.create({
        amount: createPaymentDto.amount,
        currency: 'usd',
        source: createPaymentDto.source,
        description: createPaymentDto.description,
      });
      return payment;
    } catch (error) {
      throw error;
    }
  }
}