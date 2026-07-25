import { Module } from '@nestjs/common';
import { PaymentsWebhookController } from './payments.webhook.controller';
import { PaymentsWebhookService } from './payments.webhook.service';

@Module({
  controllers: [PaymentsWebhookController],
  providers: [PaymentsWebhookService],
})
export class PaymentsWebhookModule {}
