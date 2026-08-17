import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentsController } from './payments.controller';
import { PaymentsWebhook } from './payments.webhook';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PaymentService, PaymentsWebhook],
  controllers: [PaymentsController],
})
export class PaymentModule {}
