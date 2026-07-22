import { Controller, Post, Req, Res, HttpCode } from '@nestjs/common';
import { Request, Response } from 'express';
import Stripe from 'stripe';

@Controller('webhook')
export class StripeWebhookController {
  private stripe: Stripe;

  constructor() {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
    }
    this.stripe = new Stripe(process.env.STRIPE_SECRET, { apiVersion: '2023-10-16' });
  }

  @Post()
  @HttpCode(200)
  async handle(@Req() req: any, @Res() res: Response) {
    const sig = req.headers['stripe-signature'] as string;

    let event: Stripe.Event;
    try {
      // req['rawBody'] contains the raw request buffer for signature verification
      event = this.stripe.webhooks.constructEvent(req['rawBody'] as Buffer, sig, webhookSecret);
    } catch (err) {
      return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        // TODO: update appointment payment status, fulfill order, etc.
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    return res.json({ received: true });
  }
}
