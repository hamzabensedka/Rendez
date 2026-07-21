import { Controller, Post, Headers, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Controller('payments/webhook')
export class WebhookController {
  private readonly stripe: Stripe;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    this.stripe = new Stripe(apiKey, { apiVersion: '2023-10-16' });
  }

  @Post()
  async handle(@Headers('stripe-signature') signature: string, @Req() req: any, @Res() res: any) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    let event;
    try {
      event = this.stripe.webhooks.constructEvent(req['rawBody'] ?? JSON.stringify(req.body), signature, webhookSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // TODO: handle relevant Stripe events (e.g., checkout.session.completed)
    // Example:
    // if (event.type === 'checkout.session.completed') { ... }

    return res.json({ received: true });
  }
}
