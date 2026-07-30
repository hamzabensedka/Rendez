import { Controller, Post, Headers, Req, Res, HttpCode } from '@nestjs/common';
import { Stripe } from 'stripe';
import { ConfigService } from '@nestjs/config';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentsController {
  private readonly stripe: Stripe;
  private readonly webhookSecret: string;

  constructor(
    private readonly paymentService: PaymentService,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });
    this.webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
  }

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: any,
    @Res() res: any,
  ) {
    // Verify signature using raw body
    const event = await this.paymentService.verifyWebhookSignature(
      req['rawBody'],
      signature,
      this.webhookSecret,
    );

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await this.paymentService.handleCheckoutSession(event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
}
