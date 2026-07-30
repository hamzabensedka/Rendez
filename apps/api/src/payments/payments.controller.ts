import { Controller, Post, Headers, HttpCode, Body } from '@nestjs/common';
import { PaymentService } from './payments.service';

@Controller('payments/webhook')
export class PaymentsWebhookController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @HttpCode(200)
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Body() eventPayload: any,
  ) {
    await this.paymentService.processStripeEvent(eventPayload, signature);
    return;
  }
}