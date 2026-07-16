import { Controller, Post, Headers, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import Stripe from 'stripe';
import { Request } from 'express';
import { PaymentService } from './payment.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('webhook')
  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  @HttpCode(HttpStatus.OK)
  async webhook(@Req() req: Request, @Headers('stripe-signature') signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        (req as any).rawBody as Buffer,
        signature,
        webhookSecret,
      );
    } catch (err) {
      console.error('Webhook signature verification failed.', err.message);
      return { statusCode: HttpStatus.BAD_REQUEST };
    }

    // Basic handling – extend as needed
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.paymentService.handlePaymentSucceeded(event);
        break;
      default:
        console.log(`Unhandled Stripe event type ${event.type}`);
    }

    return { statusCode: HttpStatus.OK };
  }
}
