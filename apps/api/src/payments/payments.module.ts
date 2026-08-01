import { Module } from '@nestjs/common';
import { PaymentsWebhookController } from './payments.controller';

@Module({
  controllers: [PaymentsWebhookController],
})
export class PaymentsModule {}
