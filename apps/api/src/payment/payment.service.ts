import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined');
    }
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16',
    });
  }

  async createCheckoutSession(
    userId: string,
    dto: CreateCheckoutSessionDto,
  ): Promise<{ sessionId: string; url: string }> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: dto.appointmentId },
      include: { service: true, business: true },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.userId !== userId) {
      throw new BadRequestException('Appointment does not belong to user');
    }

    if (appointment.status !== 'CONFIRMED') {
      throw new BadRequestException(
        'Payment can only be created for confirmed appointments',
      );
    }

    const existingPayment = await this.prisma.payment.findFirst({
      where: {
        appointmentId: appointment.id,
        status: PaymentStatus.SUCCEEDED,
      },
    });

    if (existingPayment) {
      throw new BadRequestException('Appointment is already paid');
    }

    const amount = Math.round(appointment.service.price * 100);

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: dto.currency ?? 'eur',
            product_data: {
              name: appointment.service.name,
              description: `Appointment at ${appointment.business.name}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: dto.successUrl ?? `${this.configService.get<string>('APP_URL')}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: dto.cancelUrl ?? `${this.configService.get<string>('APP_URL')}/payment/cancel`,
      metadata: {
        appointmentId: appointment.id,
        userId: userId,
      },
    });

    await this.prisma.payment.create({
      data: {
        appointmentId: appointment.id,
        providerTxn: session.id,
        amount: appointment.service.price,
        status: PaymentStatus.PENDING,
      },
    });

    this.logger.log(
      `Checkout session ${session.id} created for appointment ${appointment.id}`,
    );

    return {
      sessionId: session.id,
      url: session.url!,
    };
  }

  async handleWebhook(
    signature: string,
    rawBody: Buffer,
  ): Promise<{ received: boolean }> {
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );
    } catch (err) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      throw new BadRequestException('Invalid webhook signature');
    }

    this.logger.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await this.handleCheckoutCompleted(session);
        break;
      }
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        await this.handleCheckoutExpired(session);
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.handlePaymentFailed(paymentIntent);
        break;
      }
      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }

  private async handleCheckoutCompleted(
    session: Stripe.Checkout.Session,
  ): Promise<void> {
    const payment = await this.prisma.payment.findFirst({
      where: { providerTxn: session.id },
    });

    if (!payment) {
      this.logger.warn(`Payment not found for session ${session.id}`);
      return;
    }

    if (payment.status === PaymentStatus.SUCCEEDED) {
      this.logger.log(`Payment ${payment.id} already succeeded (idempotent)`);
      return;
    }

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.SUCCEEDED,
        providerTxn: session.payment_intent as string ?? session.id,
      },
    });

    this.logger.log(`Payment ${payment.id} marked as succeeded`);
  }

  private async handleCheckoutExpired(
    session: Stripe.Checkout.Session,
  ): Promise<void> {
    const payment = await this.prisma.payment.findFirst({
      where: { providerTxn: session.id },
    });

    if (!payment) {
      this.logger.warn(`Payment not found for session ${session.id}`);
      return;
    }

    if (payment.status !== PaymentStatus.PENDING) {
      return;
    }

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.FAILED },
    });

    this.logger.log(`Payment ${payment.id} expired`);
  }

  private async handlePaymentFailed(
    paymentIntent: Stripe.PaymentIntent,
  ): Promise<void> {
    const payment = await this.prisma.payment.findFirst({
      where: { providerTxn: paymentIntent.id },
    });

    if (!payment) {
      this.logger.warn(`Payment not found for intent ${paymentIntent.id}`);
      return;
    }

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.FAILED },
    });

    this.logger.log(`Payment ${payment.id} failed`);
  }

  async getPaymentStatus(appointmentId: string): Promise<{
    status: PaymentStatus;
    amount: number;
  }> {
    const payment = await this.prisma.payment.findFirst({
      where: { appointmentId },
      orderBy: { createdAt: 'desc' },
    });

    if (!payment) {
      throw new NotFoundException('No payment found for this appointment');
    }

    return {
      status: payment.status,
      amount: payment.amount,
    };
  }
}
