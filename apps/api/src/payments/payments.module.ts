import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentsWebhookController } from './payments.webhook.controller';

@Module({
  imports: [],
  controllers: [PaymentsController, PaymentsWebhookController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
