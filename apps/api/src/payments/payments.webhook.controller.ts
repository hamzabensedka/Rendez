import { Controller, Post, Headers, Req, Res } from '@nestjs/common';
import Stripe from 'stripe';
import { Request, Response } from 'express';
import { PaymentsWebhookService } from './payments.webhook.service';

@Controller('payments/webhook')
export class PaymentsWebhookController {
  private stripe: Stripe;
  private readonly service: PaymentsWebhookService;

  constructor(service: PaymentsWebhookService) {
    this.service = service;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
    }
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
  }

  @Post()
  async handleWebhook(@Headers('stripe-signature') signature: string, @Req() req: Request, @Res() res: Response) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(req.rawBody, signature, endpointSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    await this.service.handle(event);

    res.json({ received: true });
  }
}