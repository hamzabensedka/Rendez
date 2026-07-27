import { Controller, Post, Headers, Req, Res } from '@nestjs/common';
import { Stripe } from 'stripe';
import { ConfigService } from '@nestjs/config';

/**
 * Webhook endpoint for Stripe payment events.
 * Verifies the signature using STRIPE_WEBHOOK_SECRET and processes relevant events.
 */
@Controller('payments')
export class PaymentsController {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    this.stripe = new Stripe(apiKey, { apiVersion: '2023-10-16' });
  }

  @Post('webhook')
  async webhook(@Headers('stripe-signature') signature: string, @Req() req, @Res() res) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    let event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'] as Buffer,
        signature,
        webhookSecret,
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        // TODO: integrate with appointment/payment logic
        console.log('Checkout session completed', checkoutSession.id);
        break;
      }
      // Add other event types as needed
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Respond with 2xx to acknowledge receipt
    return res.json({ received: true });
  }
}
