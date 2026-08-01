import {
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
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
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ): Promise<{ received: boolean }> {
    if (!signature) {
      this.logger.warn('Missing stripe-signature header');
      return { received: false };
    }

    try {
      const event = this.stripeService.constructWebhookEvent(
        req.rawBody!,
        signature,
      );

      this.logger.log(`Webhook received: ${event.type}`);

      switch (event.type) {
        case 'checkout.session.completed':
          await this.paymentService.handleCheckoutCompleted(event);
          break;

        case 'checkout.session.expired':
          // Handle expired checkout sessions
          this.logger.log(
            `Checkout session expired: ${event.data.object.id}`,
          );
          break;

        case 'payment_intent.payment_failed':
          await this.paymentService.handlePaymentFailed(event);
          break;

        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      this.logger.error('Webhook error', error);
      return { received: false };
    }
  }
}
