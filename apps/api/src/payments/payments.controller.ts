import {
  Controller,
  Post,
  Headers,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Stripe } from 'stripe';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Controller('payments')
export class PaymentsController {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('STRIPE_API_KEY');
    this.stripe = new Stripe(apiKey, { apiVersion: '2023-10-16' });
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

    // Stripe expects the raw request body to verify the signature
    // In a real app you might use a middleware to expose req.rawBody
    const event = this.stripe.webhooks.constructEvent(
      req['rawBody'] as Buffer,
      signature,
      webhookSecret,
    );

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        // TODO: fulfill booking, update payment status, etc.
        break;
      case 'payment_intent.succeeded':
        // TODO: update payment record
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return res.json({ received: true });
  }
}
