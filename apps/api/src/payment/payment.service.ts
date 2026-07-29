import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { StripeService } from 'nestjs-stripe';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly stripeService: StripeService,
  ) {}

  async createPaymentIntent(createPaymentIntentDto: CreatePaymentIntentDto) {
    const paymentIntent = await this.stripeService.paymentIntents.create({
      amount: createPaymentIntentDto.amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });
    return paymentIntent;
  }
}