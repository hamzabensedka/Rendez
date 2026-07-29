import { Module } from '@nestjs/common';
import { PaymentsWebhookController } from './payments.webhook';

@Module({
  controllers: [PaymentsWebhookController],
})
export class PaymentsModule {}
