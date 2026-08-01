import { Controller, Post, Headers, Req, Res } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Controller('payments/webhook')
export class PaymentsWebhookController {
  private readonly stripe: Stripe;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('STRIPE_SECRET');
    this.stripe = new Stripe(apiKey, { apiVersion: '2023-10-16' });
  }

  @Post()
async webhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    let event: Stripe.Event;

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
      case 'checkout.session.completed':
        // TODO: update appointment status, send confirmation, etc.
        break;
      default:
        console.log(`Unhandled event ${event.type}`);
    }

    // Return a 2xx response to acknowledge receipt of the event
    res.json({ status: 'success' });
  }
}
