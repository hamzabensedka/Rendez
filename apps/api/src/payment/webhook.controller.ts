import {
  Controller,
  Headers,
  HttpCode,
  Logger,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { StripeService } from './stripe.service';
import { PaymentService } from './payment.service';

@Controller('payments/webhook')
export class StripeWebhookController {
  private readonly logger = new Logger(StripeWebhookController.name);

  constructor(
    private readonly stripeService: StripeService,
    private readonly paymentService: PaymentService,
  ) {}

  /**
   * Stripe webhook endpoint.
   * Receives raw body for signature verification.
   */
  @Post()
  @HttpCode(200)
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature) {
      this.logger.warn('Missing stripe-signature header');
      return { received: false, error: 'Missing signature' };
    }

    let event: Stripe.Event;

    try {
      event = this.stripeService.verifyWebhookSignature(
        req.rawBody,
        signature,
      );
    } catch (err) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      return { received: false, error: 'Invalid signature' };
    }

    this.logger.log(`Webhook received: ${event.type}`);

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          await this.paymentService.handlePaymentSucceeded(session.id);
          break;
        }

        case 'checkout.session.expired': {
          const session = event.data.object as Stripe.Checkout.Session;
          await this.paymentService.handlePaymentFailed(session.id);
          break;
        }

        case 'charge.refunded': {
          const charge = event.data.object as Stripe.Charge;
          if (charge.payment_intent) {
            const paymentIntent =
              typeof charge.payment_intent === 'string'
                ? charge.payment_intent
                : charge.payment_intent.id;
            await this.paymentService.handleRefund(paymentIntent);
          }
          break;
        }

        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
      }
    } catch (err) {
      this.logger.error(`Error processing webhook ${event.type}: ${err.message}`);
      // Still return 200 to Stripe to prevent retries
    }

    return { received: true };
  }
}
