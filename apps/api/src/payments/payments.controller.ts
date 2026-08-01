import { Controller, Post, Headers, HttpCode, HttpStatus, Body, Buffer } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Controller('payments/webhook')
export class PaymentsWebhookController {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
      apiVersion: '2023-10-16',
    });
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Body({ raw: true }) rawBody: Buffer,
  ) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return { status: 500, message: 'STRIPE_WEBHOOK_SECRET not configured' };
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );
    } catch (err) {
      return { status: HttpStatus.BAD_REQUEST, message: `Webhook signature verification failed.` };
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        // TODO: mark appointment as paid, update payment status, etc.
        break;
      }
      // Add other event handlers as needed
      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    // Return a 2xx response to acknowledge receipt of the event
    return { status: 'ok' };
  }
}
