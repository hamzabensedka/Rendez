import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(PaymentService.name);
  private readonly webhookSecret: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new InternalServerErrorException('STRIPE_SECRET_KEY is not configured');
    }
    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16' as any,
    });
    this.webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET') ?? '';
  }

  async createCheckoutSession(dto: CreateCheckoutSessionDto, userId: string) {
    // Validate appointment exists and belongs to user
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: dto.appointmentId },
      include: { service: true, business: true },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.userId !== userId) {
      throw new BadRequestException('Appointment does not belong to current user');
    }

    if (appointment.payment) {
      throw new BadRequestException('Payment already exists for this appointment');
    }

    const amount = Math.round(appointment.service.price * 100); // cents
    const successUrl = this.configService.get<string>('STRIPE_SUCCESS_URL') ?? 'https://planity.app/success';
    const cancelUrl = this.configService.get<string>('STRIPE_CANCEL_URL') ?? 'https://planity.app/cancel';

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
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
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        appointmentId: appointment.id,
        userId: userId,
      },
    });

    // Create a pending payment record
    await this.prisma.payment.create({
      data: {
        appointmentId: appointment.id,
        providerTxn: session.id,
        amount: appointment.service.price,
        status: PaymentStatus.PENDING,
      },
    });

    return { url: session.url };
  }

  async createPaymentIntent(dto: CreateCheckoutSessionDto, userId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: dto.appointmentId },
      include: { service: true },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.userId !== userId) {
      throw new BadRequestException('Appointment does not belong to current user');
    }

    if (appointment.payment) {
      throw new BadRequestException('Payment already exists for this appointment');
    }

    const amount = Math.round(appointment.service.price * 100);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      metadata: {
        appointmentId: appointment.id,
        userId: userId,
      },
    });

    await this.prisma.payment.create({
      data: {
        appointmentId: appointment.id,
        providerTxn: paymentIntent.id,
        amount: appointment.service.price,
        status: PaymentStatus.PENDING,
      },
    });

    return { clientSecret: paymentIntent.client_secret };
  }

  async handleWebhook(signature: string, rawBody: Buffer) {
    if (!this.webhookSecret) {
      throw new InternalServerErrorException('STRIPE_WEBHOOK_SECRET is not configured');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, this.webhookSecret);
    } catch (err) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      throw new BadRequestException('Invalid signature');
    }

    this.logger.log(`Received Stripe event: ${event.type}`);

    try {
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
        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          await this.handlePaymentIntentSucceeded(paymentIntent);
          break;
        }
        case 'payment_intent.payment_failed': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          await this.handlePaymentIntentFailed(paymentIntent);
          break;
        }
        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      this.logger.error(`Error processing webhook event ${event.type}: ${error.message}`);
      throw error;
    }

    return { received: true };
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const payment = await this.prisma.payment.findFirst({
      where: { providerTxn: session.id },
    });

    if (!payment) {
      this.logger.error(`Payment not found for session: ${session.id}`);
      return;
    }

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.COMPLETED,
        providerTxn: session.id,
      },
    });

    this.logger.log(`Payment completed for appointment: ${payment.appointmentId}`);
  }

  private async handleCheckoutExpired(session: Stripe.Checkout.Session) {
    const payment = await this.prisma.payment.findFirst({
      where: { providerTxn: session.id },
    });

    if (!payment) {
      this.logger.error(`Payment not found for session: ${session.id}`);
      return;
    }

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.FAILED },
    });

    this.logger.log(`Payment expired for appointment: ${payment.appointmentId}`);
  }

  private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    const payment = await this.prisma.payment.findFirst({
      where: { providerTxn: paymentIntent.id },
    });

    if (!payment) {
      this.logger.error(`Payment not found for payment intent: ${paymentIntent.id}`);
      return;
    }

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.COMPLETED },
    });

    this.logger.log(`Payment succeeded for appointment: ${payment.appointmentId}`);
  }

  private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
    const payment = await this.prisma.payment.findFirst({
      where: { providerTxn: paymentIntent.id },
    });

    if (!payment) {
      this.logger.error(`Payment not found for payment intent: ${paymentIntent.id}`);
      return;
    }

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.FAILED },
    });

    this.logger.error(`Payment failed for appointment: ${payment.appointmentId}`);
  }

  async getPaymentStatus(appointmentId: string, userId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { appointmentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found for this appointment');
    }

    // Verify ownership through appointment
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment || appointment.userId !== userId) {
      throw new BadRequestException('Appointment does not belong to current user');
    }

    return {
      status: payment.status,
      amount: payment.amount,
      providerTxn: payment.providerTxn,
      createdAt: payment.createdAt,
    };
  }
}
