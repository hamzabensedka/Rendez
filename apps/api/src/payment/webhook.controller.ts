import { Controller, Post, Body, HttpStatus, BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { StripeService } from 'nestjs-stripe';
import { WebhookDto } from './dto/webhook.dto';

@Controller('payments/webhook')
export class WebhookController {
  constructor(private readonly paymentService: PaymentService, private readonly stripeService: StripeService) {}

  @Post()
  async handleWebhook(@Body() webhookDto: WebhookDto) {
    try {
      const event = await this.stripeService.webhooks.constructEvent(
        webhookDto.raw,
        webhookDto.signature,
        'whsec_123',
      );
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        await this.paymentService.handlePaymentIntentSucceeded(paymentIntent);
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}