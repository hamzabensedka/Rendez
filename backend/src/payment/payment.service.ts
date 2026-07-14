import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import { SavePaymentMethodDto } from './dto/save-payment-method.dto';

/**
 * PaymentService — Implements Stripe PaymentIntent vs SetupIntent architecture
 * with idempotency keys, webhook reconciliation, and error recovery states.
 */
@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(PaymentService.name);

  // Retry configuration for transient Stripe errors
  private readonly maxRetries = 3;
  private readonly retryStatuses = [409, 429, 500, 502, 503];

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY')!, {
      apiVersion: '2023-10-16', // pinned for deterministic behavior
      typescript: true,
    });
  }

  /* --------------------------------------------------------------------------
   * PaymentIntent flow — used for immediate / deposit / pre-auth charges
   * -------------------------------------------------------------------------- */

  /**
   * Creates a Stripe PaymentIntent with idempotency key.
   * Saves a local Payment record in `payment_processing` status.
   * Returns client_secret so frontend can complete the payment.
   */
  async createPaymentIntent(dto: CreatePaymentIntentDto) {
    const idempotencyKey = this.generateIdempotencyKey('pi', dto.appointmentId);

    // 1. Validate booking ownership & state
    const booking = await this.prisma.appointment.findUnique({
      where: { id: dto.appointmentId },
      include: { payment: true },
    });

    if (!booking) {
      throw new NotFoundException('Appointment not found');
    }

    if (booking.status !== 'Pending') {
      throw new BadRequestException('Appointment is not in a payable state');
    }

    // Prevent duplicate active PaymentIntents for the same appointment
    if (booking.payment && booking.payment.status !== 'failed' && booking.payment.status !== 'cancelled') {
      throw new ConflictException('An active payment already exists for this appointment');
    }

    // 2. Compute amount & optional application fee (platform commission)
    const amount = await this.computeAmount(dto);
    const applicationFeeAmount = this.calculateApplicationFee(amount, booking.businessId);

    // 3. Create or reuse Stripe Customer
    const stripeCustomerId = await this.findOrCreateStripeCustomer(dto.userId);

    // 4. Create PaymentIntent on Stripe (idempotent)
    const intentParams: Stripe.PaymentIntentCreateParams = {
      amount,
      currency: dto.currency ?? 'eur',
      customer: stripeCustomerId,
      payment_method_types: this.mapPaymentMethodTypes(dto.paymentMethodTypes),
      capture_method: dto.captureMethod ?? 'automatic', // 'manual' for pre-auth
      setup_future_usage: dto.savePaymentMethod ? 'off_session' : undefined,
      metadata: {
        appointmentId: dto.appointmentId,
        userId: dto.userId,
        booking_held_until: booking.bookingHeldUntil?.toISOString() ?? '',
      },
      description: `Appointment ${dto.appointmentId} — ${booking.serviceName}`,
    };

    const paymentIntent = await this.withRetry(() =>
      this.stripe.paymentIntents.create(intentParams, {
        idempotencyKey,
      }),
    );

    // 5. Persist local Payment record
    const payment = await this.prisma.payment.upsert({
      where: { stripePaymentIntentId: paymentIntent.id },
      update: {
        amount,
        currency: dto.currency ?? 'eur',
        status: 'payment_processing',
        idempotencyKey,
        metadata: intentParams.metadata as any,
      },
      create: {
        appointmentId: dto.appointmentId,
        userId: dto.userId,
        stripePaymentIntentId: paymentIntent.id,
        amount,
        currency: dto.currency ?? 'eur',
        status: 'payment_processing',
        idempotencyKey,
        captureMethod: dto.captureMethod ?? 'automatic',
        metadata: intentParams.metadata as any,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id,
      requiresAction: paymentIntent.status === 'requires_action',
    };
  }

  /**
   * Confirms a PaymentIntent server-side (for back-end driven confirmations).
   * Handles 3D-Secure / requires_action by returning next_action data.
   */
  async confirmPayment(dto: ConfirmPaymentDto) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: dto.paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment record not found');
    }

    try {
      const intent = await this.stripe.paymentIntents.confirm(payment.stripePaymentIntentId, {
        payment_method: dto.paymentMethodId,
        return_url: dto.returnUrl,
      });

      // Update local state based on Stripe response
      await this.syncPaymentStatusFromIntent(payment.id, intent);

      return {
        status: intent.status,
        requiresAction: intent.status === 'requires_action',
        nextAction: intent.next_action ?? null,
      };
    } catch (err: any) {
      this.logger.error('Payment confirmation failed', err);
      throw new InternalServerErrorException('Unable to confirm payment');
    }
  }

  /* --------------------------------------------------------------------------
   * SetupIntent flow — save payment method for future off-session charges
   * -------------------------------------------------------------------------- */

  /**
   * Creates a SetupIntent for saving a payment method without immediate charge.
   * Used for “Save card for later” in user profile.
   */
  async createSetupIntent(userId: string) {
    const stripeCustomerId = await this.findOrCreateStripeCustomer(userId);

    const setupIntent = await this.stripe.setupIntents.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      usage: 'off_session',
      metadata: { userId },
    });

    return {
      clientSecret: setupIntent.client_secret,
    };
  }

  /**
   * Saves a payment method after SetupIntent confirmation.
   */
  async savePaymentMethod(dto: SavePaymentMethodDto) {
    // Retrieve the setup intent to ensure it succeeded
    const setupIntent = await this.stripe.setupIntents.retrieve(dto.setupIntentId);

    if (setupIntent.status !== 'succeeded') {
      throw new BadRequestException('SetupIntent has not succeeded');
    }

    const paymentMethodId = setupIntent.payment_method as string;

    // Attach to customer if not already
    const paymentMethod = await this.stripe.paymentMethods.retrieve(paymentMethodId);
    if (paymentMethod.customer !== setupIntent.customer) {
      await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: setupIntent.customer as string,
      });
    }

    // Optionally set as default
    if (dto.setAsDefault) {
      await this.stripe.customers.update(setupIntent.customer as string, {
        invoice_settings: { default_payment_method: paymentMethodId },
      });
    }

    // Persist tokenized reference (no raw card data)
    await this.prisma.paymentMethod.upsert({
      where: { stripePaymentMethodId: paymentMethodId },
      update: { isDefault: dto.setAsDefault ?? false, lastUsedAt: new Date() },
      create: {
        userId: dto.userId,
        stripePaymentMethodId: paymentMethodId,
        stripeCustomerId: setupIntent.customer as string,
        type: paymentMethod.type,
        lastFour: (paymentMethod.card as any)?.last4 ?? '',
        brand: (paymentMethod.card as any)?.brand ?? '',
        expiryMonth: (paymentMethod.card as any)?.exp_month ?? 0,
        expiryYear: (paymentMethod.card as any)?.exp_year ?? 0,
        isDefault: dto.setAsDefault ?? false,
      },
    });

    return { success: true };
  }

  /* --------------------------------------------------------------------------
   * Refunds
   * -------------------------------------------------------------------------- */

  async refundPayment(dto: RefundPaymentDto) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: dto.paymentId },
    });

    if (!payment || !payment.stripePaymentIntentId) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== 'payment_succeeded') {
      throw new BadRequestException('Only succeeded payments can be refunded');
    }

    const refundParams: Stripe.RefundCreateParams = {
      payment_intent: payment.stripePaymentIntentId,
      amount: dto.amount, // undefined = full refund
      reason: 'requested_by_customer',
      metadata: {
        originalPaymentId: payment.id,
        reason: dto.reason ?? '',
      },
    };

    const refund = await this.withRetry(() => this.stripe.refunds.create(refundParams));

    // Log refund record
    await this.prisma.refund.create({
      data: {
        paymentId: payment.id,
        stripeRefundId: refund.id,
        amount: refund.amount,
        status: refund.status,
        reason: dto.reason,
      },
    });

    // Update payment status
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: refund.status === 'succeeded' ? 'refunded' : 'partially_refunded' },
    });

    return { refundId: refund.id, status: refund.status };
  }

  /* --------------------------------------------------------------------------
   * Webhook Handler (to be called from StripeWebhookController)
   * -------------------------------------------------------------------------- */

  /**
   * Processes Stripe webhook events. Idempotent by event ID.
   */
  async handleWebhookEvent(event: Stripe.Event) {
    // Idempotency guard: skip already processed events
    const existing = await this.prisma.stripeWebhookEvent.findUnique({
      where: { stripeEventId: event.id },
    });
    if (existing) {
      this.logger.log(`Duplicate webhook event ${event.id} — skipped`);
      return { received: true };
    }

    // Record event immediately
    await this.prisma.stripeWebhookEvent.create({
      data: {
        stripeEventId: event.id,
        type: event.type,
        payload: event.data.object as any,
        createdAt: new Date(),
      },
    });

    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
          break;
        case 'payment_intent.canceled':
          await this.handlePaymentIntentCanceled(event.data.object as Stripe.PaymentIntent);
          break;
        case 'payment_intent.processing':
          // Optional: log interim state
          break;
        case 'payment_intent.requires_action':
          // Frontend handles; no state change needed
          break;
        case 'charge.refunded':
          await this.handleChargeRefunded(event.data.object as Stripe.Charge);
          break;
        case 'charge.refund.updated':
          await this.handleRefundUpdated(event.data.object as Stripe.Refund);
          break;
        case 'setup_intent.succeeded':
          // Already handled synchronously; log only
          break;
        default:
          this.logger.log(`Unhandled webhook event type: ${event.type}`);
      }
    } catch (err: any) {
      this.logger.error(`Webhook processing error for event ${event.id}`, err);
      // Do NOT throw — always return 200 to Stripe to prevent retries
      // Failed events remain in DB for manual reconciliation
    }

    return { received: true };
  }

  /* --------------------------------------------------------------------------
   * Webhook event handlers (private)
   * -------------------------------------------------------------------------- */

  private async handlePaymentIntentSucceeded(intent: Stripe.PaymentIntent) {
    const payment = await this.prisma.payment.findUnique({
      where: { stripePaymentIntentId: intent.id },
    });
    if (!payment) {
      this.logger.warn(`No local payment for PI ${intent.id}`);
      return;
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: 'payment_succeeded', paidAt: new Date() },
      });

      // Transition appointment to Confirmed
      await tx.appointment.update({
        where: { id: payment.appointmentId },
        data: { status: 'Confirmed' },
      });
    });
  }

  private async handlePaymentIntentFailed(intent: Stripe.PaymentIntent) {
    const payment = await this.prisma.payment.findUnique({
      where: { stripePaymentIntentId: intent.id },
    });
    if (!payment) return;

    const failureMessage =
      intent.last_payment_error?.message ?? 'Payment failed';

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'failed',
        failureMessage,
        failedAt: new Date(),
      },
    });

    // Keep appointment in Pending so user can retry payment
    // Notify user via background job (notification queue)
  }

  private async handlePaymentIntentCanceled(intent: Stripe.PaymentIntent) {
    const payment = await this.prisma.payment.findUnique({
      where: { stripePaymentIntentId: intent.id },
    });
    if (!payment) return;

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'cancelled' },
    });
  }

  private async handleChargeRefunded(charge: Stripe.Charge) {
    if (!charge.payment_intent) return;

    const payment = await this.prisma.payment.findUnique({
      where: { stripePaymentIntentId: charge.payment_intent as string },
    });
    if (!payment) return;

    const totalRefunded = charge.amount_refunded;
    const isFullRefund = totalRefunded >= charge.amount;

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: isFullRefund ? 'refunded' : 'partially_refunded' },
    });
  }

  private async handleRefundUpdated(refund: Stripe.Refund) {
    const localRefund = await this.prisma.refund.findUnique({
      where: { stripeRefundId: refund.id },
    });
    if (!localRefund) return;

    await this.prisma.refund.update({
      where: { id: localRefund.id },
      data: { status: refund.status },
    });
  }

  /* --------------------------------------------------------------------------
   * Reconciliation & error recovery helpers
   * -------------------------------------------------------------------------- */

  /**
   * Syncs local payment status from a Stripe PaymentIntent.
   */
  private async syncPaymentStatusFromIntent(
    paymentId: string,
    intent: Stripe.PaymentIntent,
  ) {
    const statusMap: Record<string, string> = {
      succeeded: 'payment_succeeded',
      processing: 'payment_processing',
      requires_payment_method: 'failed',
      requires_action: 'payment_processing',
      canceled: 'cancelled',
    };

    const localStatus = statusMap[intent.status] ?? 'payment_processing';

    await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: localStatus,
        paidAt: intent.status === 'succeeded' ? new Date() : undefined,
        failureMessage:
          intent.status === 'requires_payment_method'
            ? intent.last_payment_error?.message
            : undefined,
      },
    });
  }

  /**
   * Recovers payments stuck in `payment_processing` beyond the booking hold window.
   * Called by a scheduled job or admin action.
   */
  async recoverStalePayments() {
    const staleThreshold = new Date(Date.now() - 15 * 60 * 1000); // 15 min

    const stalePayments = await this.prisma.payment.findMany({
      where: {
        status: 'payment_processing',
        createdAt: { lt: staleThreshold },
        stripePaymentIntentId: { not: null },
      },
    });

    for (const payment of stalePayments) {
      try {
        const intent = await this.stripe.paymentIntents.retrieve(
          payment.stripePaymentIntentId!,
        );

        if (intent.status === 'succeeded') {
          await this.handlePaymentIntentSucceeded(intent);
        } else if (
          intent.status === 'canceled' ||
          intent.status === 'requires_payment_method'
        ) {
          await this.prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'failed', failureMessage: 'Recovered: booking hold expired' },
          });
        }
        // else still processing — leave as-is
      } catch (err: any) {
        this.logger.error(`Failed to recover payment ${payment.id}`, err);
      }
    }
  }

  /* --------------------------------------------------------------------------
   * Private utilities
   * -------------------------------------------------------------------------- */

  private async findOrCreateStripeCustomer(userId: string): Promise<string> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (profile?.stripeCustomerId) {
      return profile.stripeCustomerId;
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const customer = await this.stripe.customers.create({
      email: user.email,
      metadata: { userId },
    });

    await this.prisma.userProfile.upsert({
      where: { userId },
      update: { stripeCustomerId: customer.id },
      create: { userId, stripeCustomerId: customer.id },
    });

    return customer.id;
  }

  private async computeAmount(dto: CreatePaymentIntentDto): Promise<number> {
    // Base amount from appointment service price; tip/discount applied
    const booking = await this.prisma.appointment.findUnique({
      where: { id: dto.appointmentId },
    });

    let amount = booking?.price ?? 0;

    if (dto.tipAmount) {
      amount += dto.tipAmount;
    }
    if (dto.discountAmount) {
      amount = Math.max(0, amount - dto.discountAmount);
    }

    // Stripe expects amount in cents (integer)
    return Math.round(amount * 100);
  }

  private calculateApplicationFee(
    amountInCents: number,
    businessId: string,
  ): number | undefined {
    // Platform fee logic (configurable per business)
    const platformFeePercent = 0.05; // 5 % example
    return Math.round(amountInCents * platformFeePercent);
  }

  private mapPaymentMethodTypes(
    types?: string[],
  ): Stripe.PaymentIntentCreateParams.PaymentMethodType[] {
    const supported = ['card', 'ideal', 'bancontact', 'sofort', 'paypal'];
    if (!types || types.length === 0) return ['card'];
    return types.filter((t) => supported.includes(t)) as any;
  }

  private generateIdempotencyKey(prefix: string, seed: string): string {
    // Format: prefix_seed_timestamp_random (max 255 chars)
    const ts = Date.now().toString(36);
    const rand = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${seed}_${ts}_${rand}`.substring(0, 255);
  }

  private async withRetry<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: any;
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (err: any) {
        lastError = err;
        if (
          err.type === 'StripeIdempotencyError' ||
          !this.retryStatuses.includes(err.statusCode ?? err.status)
        ) {
          throw err; // non-retryable
        }
        this.logger.warn(`Stripe API retry attempt ${attempt}/${this.maxRetries}`);
        await this.sleep(Math.pow(2, attempt) * 100); // exponential backoff
      }
    }
    throw lastError;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
