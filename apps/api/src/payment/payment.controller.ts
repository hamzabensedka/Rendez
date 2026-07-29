import { Controller, Post, Body, HttpStatus, BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { StripeService } from 'nestjs-stripe';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService, private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() createPaymentIntentDto: CreatePaymentIntentDto) {
    try {
      const paymentIntent = await this.paymentService.createPaymentIntent(createPaymentIntentDto);
      return paymentIntent;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}