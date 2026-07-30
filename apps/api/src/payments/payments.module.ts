import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsWebhookController } from './payments.controller';
import { PaymentService } from './payments.service';
import { Payment } from '../entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  controllers: [PaymentsWebhookController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentsModule {}
