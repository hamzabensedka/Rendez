import { Controller, Post, Headers, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Controller('webhook')
export class PaymentsWebhookController {
  constructor(private readonly configService: ConfigService) {}

  @Post('stripe')
  async handle(@Headers('stripe-signature') signature: string, @Req() req: any, @Res() res: any) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    const stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, signature, webhookSecret);
    } catch (err) {
      return res.status(400).send('Webhook signature validation failed.');
    }

    // TODO: handle the event (e.g., update booking status)
    // For now just acknowledge
    return res.json({ received: true });
  }
}
