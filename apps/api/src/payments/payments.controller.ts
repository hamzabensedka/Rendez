import { Controller, Post, Headers, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('webhook')
  async webhook(@Headers('stripe-signature') signature: string, @Req() req) {
    const event = await this.paymentsService.handleStripeWebhook(signature, req.body);
    return { received: true, event };
  }
}