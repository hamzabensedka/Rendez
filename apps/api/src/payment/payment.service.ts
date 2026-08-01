import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from './stripe.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Creates a Stripe Checkout Session for an appointment and persists a pending Payment record.
   */
  async createCheckoutSession(
    userId: string,
    dto: CreateCheckoutSessionDto,
  ): Promise<{ checkoutUrl: string }> {
    // 1. Validate the appointment belongs to the user and is in a payable state
    const appointment = await this.prisma.appointment.findFirst({
      where: {
        id: dto.appointmentId,
        userId,
        status: 'CONFIRMED',
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            businessId: true,
          },
        },
        business: {
          select: {
            id: true,
            name: true,
            stripeAccountId: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException(
        'Appointment not found or not eligible for payment',
      );
    }

    if (!appointment.service?.price || appointment.service.price <= 0) {
      throw new BadRequestException(
        'Appointment service has no valid price',
      );
    }

    // 2. Check if a successful payment already exists
    const existingPayment = await this.prisma.payment.findFirst({
      where: {
        appointmentId: appointment.id,
        status: PaymentStatus.SUCCEEDED,
      },
    });

    if (existingPayment) {
      throw new BadRequestException('Payment already completed for this appointment');
    }

    // 3. Create a pending Payment record
    const payment = await this.prisma.payment.create({
      data: {
        appointmentId: appointment.id,
        amount: appointment.service.price,
        currency: 'eur',
        status: PaymentStatus.PENDING,
        provider: 'STRIPE',
      },
    });

    // 4. Create Stripe Checkout Session
    try {
      const baseUrl = this.configService.get<string>('API_BASE_URL') ?? 'http://localhost:3000';
      const session = await this.stripeService.createCheckoutSession({
        paymentId: payment.id,
        amount: appointment.service.price,
        currency: 'eur',
        customerEmail: appointment.user.email,
        metadata: {
          paymentId: payment.id,
          appointmentId: appointment.id,
          businessId: appointment.business.id,
          userId: appointment.user.id,
        },
        successUrl: `${baseUrl}/api/payments/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${baseUrl}/api/payments/cancel?payment_id=${payment.id}`,
        stripeAccount: appointment.business.stripeAccountId ?? undefined,
      });

      // 5. Update payment record with Stripe session ID
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { providerTxnId: session.id },
      });

      this.logger.log(
        `Checkout session ${session.id} created for payment ${payment.id}`,
      );

      return { checkoutUrl: session.url! };
    } catch (error) {
      // Rollback payment record on failure
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.FAILED },
      });

      this.logger.error('Failed to create Stripe checkout session', error);
      throw new BadRequestException('Payment initialization failed');
    }
  }

  /**
   * Handles a successful Stripe checkout completion.
   */
  async handleCheckoutCompleted(event: any): Promise<void> {
    const session = event.data.object;
    const paymentId = session.metadata?.paymentId;

    if (!paymentId) {
      this.logger.warn('No paymentId in session metadata');
      return;
    }

    await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.SUCCEEDED,
        providerTxnId: session.id,
        paidAt: new Date(),
      },
    });

    this.logger.log(`Payment ${paymentId} succeeded via session ${session.id}`);
  }

  /**
   * Handles payment failure events.
   */
  async handlePaymentFailed(event: any): Promise<void> {
    const session = event.data.object;
    const paymentId = session.metadata?.paymentId;

    if (!paymentId) {
      this.logger.warn('No paymentId in failed payment metadata');
      return;
    }

    await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.FAILED,
        failureReason: session.last_payment_error?.message ?? 'Payment failed',
      },
    });

    this.logger.warn(`Payment ${paymentId} failed: ${session.last_payment_error?.message}`);
  }

  /**
   * Retrieves payment details for a given appointment.
   */
  async getPaymentByAppointment(appointmentId: string, userId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: {
        appointmentId,
        appointment: { userId },
      },
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        provider: true,
        providerTxnId: true,
        paidAt: true,
        createdAt: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }
}
