import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { BullmqService } from '../bullmq/bullmq.service';
import Stripe from 'stripe';
import {
  CreatePaymentIntentDto,
  CreateCheckoutSessionDto,
  PaymentStatus,
} from './dto';

@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly bullmqService: BullmqService,
  ) {
    this.stripe = new Stripe(
      this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2025-02-24.acacia',
        typescript: true,
      },
    );
  }

  async createPaymentIntent(
    dto: CreatePaymentIntentDto,
    userId: string,
  ): Promise<Stripe.PaymentIntent> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: dto.appointmentId },
      include: { service: true, user: true },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.userId !== userId) {
      throw new BadRequestException(
        'You can only pay for your own appointments',
      );
    }

    const existingPayment = await this.prisma.payment.findUnique({
      where: { appointmentId: appointment.id },
    });

    if (existingPayment && existingPayment.status === PaymentStatus.SUCCEEDED) {
      throw new BadRequestException('This appointment is already paid');
    }

    const amount = Math.round(appointment.service.price * 100);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: dto.currency ?? 'eur',
      metadata: {
        appointmentId: appointment.id,
        userId: appointment.userId,
        businessId: appointment.businessId,
      },
      description: `Payment for ${appointment.service.name} at ${appointment.businessId}`,
    });

    await this.prisma.payment.upsert({
      where: { appointmentId: appointment.id },
      create: {
        appointmentId: appointment.id,
        providerTxn: paymentIntent.id,
        amount: paymentIntent.amount,
        status: PaymentStatus.PENDING,
        provider: 'STRIPE',
      },
      update: {
        providerTxn: paymentIntent.id,
        amount: paymentIntent.amount,
        status: PaymentStatus.PENDING,
        provider: 'STRIPE',
      },
    });

    return paymentIntent;
  }

  async createCheckoutSession(
    dto: CreateCheckoutSessionDto,
    userId: string,
  ): Promise<Stripe.Checkout.Session> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: dto.appointmentId },
      include: { service: true, user: true, business: true },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.userId !== userId) {
      throw new BadRequestException(
        'You can only pay for your own appointments',
      );
    }

    const existingPayment = await this.prisma.payment.findUnique({
      where: { appointmentId: appointment.id },
    });

    if (existingPayment && existingPayment.status === PaymentStatus.SUCCEEDED) {
      throw new BadRequestException('This appointment is already paid');
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
      success_url: dto.successUrl,
      cancel_url: dto.cancelUrl,
      metadata: {
        appointmentId: appointment.id,
        userId: appointment.userId,
      },
    });

    await this.prisma.payment.upsert({
      where: { appointmentId: appointment.id },
      create: {
        appointmentId: appointment.id,
        providerTxn: session.id,
        amount,
        status: PaymentStatus.PENDING,
        provider: 'STRIPE',
      },
      update: {
        providerTxn: session.id,
        amount,
        status: PaymentStatus.PENDING,
        provider: 'STRIPE',
      },
    });

    return session;
  }

  async handleWebhookEvent(
    rawBody: Buffer,
    signature: string,
  ): Promise<{ received: boolean }> {
    const webhookSecret = this.configService.getOrThrow<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );
    } catch (err) {
      this.logger.error('Webhook signature verification failed', err);
      throw new BadRequestException('Invalid webhook signature');
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentIntentSucceeded(
          event.data.object as Stripe.PaymentIntent,
        );
        break;
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(
          event.data.object as Stripe.PaymentIntent,
        );
        break;
      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }

  private async handlePaymentIntentSucceeded(
    paymentIntent: Stripe.PaymentIntent,
  ): Promise<void> {
    const appointmentId = paymentIntent.metadata.appointmentId;
    if (!appointmentId) {
      this.logger.warn('No appointmentId in payment intent metadata');
      return;
    }

    await this.prisma.payment.updateMany({
      where: {
        providerTxn: paymentIntent.id,
        appointmentId,
      },
      data: {
        status: PaymentStatus.SUCCEEDED,
        updatedAt: new Date(),
      },
    });

    await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'CONFIRMED' },
    });

    await this.bullmqService.addNotificationJob({
      type: 'PAYMENT_SUCCEEDED',
      appointmentId,
    });
  }

  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ): Promise<void> {
    const appointmentId = session.metadata?.appointmentId;
    if (!appointmentId) {
      this.logger.warn('No appointmentId in session metadata');
      return;
    }

    await this.prisma.payment.updateMany({
      where: {
        providerTxn: session.id,
        appointmentId,
      },
      data: {
        status: PaymentStatus.SUCCEEDED,
        updatedAt: new Date(),
      },
    });

    await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'CONFIRMED' },
    });

    await this.bullmqService.addJob({
      type: 'PAYMENT_SUCCEEDED',
      appointmentId,
    });
  }

  private async handlePaymentFailed(
    paymentIntent: Stripe.PaymentIntent,
  ): Promise<void> {
    const appointmentId = paymentIntent.metadata.appointmentId;
    if (!appointmentId) return;

    await this.prisma.payment.updateMany({
      where: {
        providerTxn: paymentIntent.id,
        appointmentId,
      },
      data: {
        status: PaymentStatus.FAILED,
        updatedAt: new Date(),
      },
    });

    await this.bullmqService.addJob({
      type: 'PAYMENT_FAILED',
      appointmentId,
    });
  }

  async getPaymentByAppointment(appointmentId: string) {
    return this.prisma.payment.findUnique({
      where: { appointmentId },
    });
  }
}
