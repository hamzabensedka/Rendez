import { Controller, Post, Headers, Req, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Request, Response } from 'express';

@Controller('payments/webhook')
export class PaymentsWebhookController {
  private stripe: Stripe;
  private webhookSecret: string;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });
    this.webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
  }

  @Post()
  @HttpCode(200)
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    const sig = req.headers['stripe-signature'] as string;

    // Construct event – note that stripe expects the raw request body for signature verification.
    // In NestJS the body is parsed, so we need to access the raw buffer.
    // For simplicity, we assume the raw body is available via `req['rawBody']` if a raw-body
    // interceptor is attached, otherwise we fall back to `JSON.stringify(req.body)`.
    const rawBody = (req as any).rawBody || Buffer.from(JSON.stringify(req.body));
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        sig,
        this.webhookSecret,
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(HttpStatus.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        // TODO: update order status, send confirmation email, etc.
        break;
      // Add other event types as needed
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return res.json({ received: true });
  }
}
