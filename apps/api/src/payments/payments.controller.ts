import { Controller, Post, Headers, Req, Res, HttpCode } from '@nestjs/common';
import { Stripe } from 'stripe';
import { ConfigService } from '@nestjs/config';

export type StripeWebhookEvent = 
  | 'checkout.session.completed'
  | 'payment_intent.succeeded'
  | 'payment_intent.payment_failed';

@Controller('payments/webhook')
export class PaymentsWebhookController {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    const secret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    this.stripe = new Stripe(secret, { apiVersion: '2023-10-16' });
  }

  @Post()
  @HttpCode(200)
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req,
    @Res() res,
  ) {
    // Stripe requires the raw request body for signature verification
    const rawBody = req['rawBody'] as string;

    const event = this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      this.configService.get<string>('STRIPE_WEBHOOK_SECRET'),
    );

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        // TODO: fulfill order, update appointment status, etc.
        break;
      case 'payment_intent.succeeded':
        // TODO: mark payment as succeeded
        break;
      case 'payment_intent.payment_failed':
        // TODO: mark payment as failed
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 2xx response to acknowledge receipt of the event
    res.json({ received: true });
  }
}
