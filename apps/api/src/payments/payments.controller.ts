import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

@Controller('payments')
export class PaymentsController {
  constructor(private configService: ConfigService) {}

  @Post('webhook')
  async handleWebhook(@Req() req: any, @Res() res: Response) {
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req['rawBody'] as Buffer, sig, endpointSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      // TODO: fulfill order, update appointment payment status, etc.
    } else {
      // Unexpected event type
      return res.status(200).json({ received: true });
    }

    // Return a 2xx response to acknowledge receipt of the event
    res.json({ received: true });
  }
}