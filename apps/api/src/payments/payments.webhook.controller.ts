import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import Stripe from 'stripe';

@Controller('payments/webhook')
export class PaymentsWebhookController {
  private stripe: Stripe;

  constructor() {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
    }
    this.stripe = new Stripe(webhookSecret, { apiVersion: '2023-10-16' });
  }

  @Post()
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'] as Buffer,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        // TODO: fulfill order, update appointment status, etc.
        break;
      // Add other event handlers as needed
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 2xx response to acknowledge receipt of the event
    res.json({ received: true });
  }
}
