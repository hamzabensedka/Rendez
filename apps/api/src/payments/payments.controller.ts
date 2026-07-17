import {
  Controller,
  Post,
  Body,
  Headers,
  RawBodyRequest,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import Stripe from 'stripe';
import { PaymentService } from './payments.service';

// Stripe webhook signature secret should be set in env vars
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!webhookSecret) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not defined in environment');
}

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentService) {}

  /**
   * Stripe webhook endpoint.
   * Receives events from Stripe and forwards them to PaymentService for processing.
   * This endpoint is intentionally raw to allow verification of the signature.
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stripe webhook receiver' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async webhook(
    @Headers('stripe-signature') stripeSignature: string,
    @RawBodyRequest() rawBodyRequest: RawBodyRequest<Request, any>, // Nest type for raw body
  ) {
    const sig = stripeSignature;
    const event = await this.verifyStripeWebhookSignature(rawBodyRequest.body, sig);
    // Dispatch based on event type
    await this.handleStripeEvent(event);
    return { received: true };
  }

  /**
   * Verify the Stripe webhook signature.
   * Throws NotFoundException if verification fails.
   */
  private async verifyStripeWebhookSignature(
    payload: Buffer,
    signature: string,
  ): Promise<Stripe.Event> {
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        payload.toString(),
        signature,
        webhookSecret,
      );
    } catch (err) {
      throw new NotFoundException('Webhook signature verification failed');
    }
    return event;
  }

  /**
   * Dispatch events to appropriate handlers.
   */
  private async handleStripeEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await this.paymentsService.handleCheckoutSessionCompleted(session);
        break;
      }
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.paymentsService.handlePaymentIntentSucceeded(paymentIntent);
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.paymentsService.handlePaymentIntentFailed(paymentIntent);
        break;
      }
      // Add more cases as needed
      default:
        // For unhandled events, you can log or ignore
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }
  }
}
