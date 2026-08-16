import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { StripeModule } from 'nestjs-stripe';

@Module({
  imports: [StripeModule.forRoot({
    apiKey: process.env.STRIPE_SECRET_KEY,
    apiVersion: '2022-11-15',
  }),],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}