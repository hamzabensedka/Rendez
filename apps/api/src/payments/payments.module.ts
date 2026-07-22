import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { WebhookController } from './payments.webhook.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [],
  controllers: [PaymentsController, WebhookController],
  providers: [PaymentService],
})
export class PaymentsModule {}
