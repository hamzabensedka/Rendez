import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import { SavePaymentMethodDto } from './dto/save-payment-method.dto';
import { Stripe } from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(dto: CreatePaymentIntentDto) {
    const { amount, currency = 'eur', metadata } = dto;

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency,
        metadata: {
          ...metadata,
          createdAt: new Date().toISOString(),
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create payment intent');
    }
  }

  async confirmPayment(dto: ConfirmPaymentDto) {
    const { paymentIntentId, appointmentId } = dto;

    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status !== 'succeeded') {
        throw new BadRequestException('Payment not successful');
      }

      // Update appointment status to confirmed
      const updatedAppointment = await this.prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: 'CONFIRMED' },
        include: { business: true, service: true, client: true },
      });

      return {
        success: true,
        appointment: updatedAppointment,
      };
    } catch (error) {
      throw new InternalServerErrorException('Payment confirmation failed');
    }
  }

  async refundPayment(dto: RefundPaymentDto) {
    const { paymentIntentId, amount } = dto;

    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });

      return {
        refundId: refund.id,
        status: refund.status,
      };
    } catch (error) {
      throw new InternalServerErrorException('Refund failed');
    }
  }

  async savePaymentMethod(dto: SavePaymentMethodDto) {
    const { paymentMethodId, clientId } = dto;

    try {
      const paymentMethod = await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: clientId,
      });

      await this.prisma.paymentMethod.upsert({
        where: { stripeId: paymentMethod.id },
        create: {
          stripeId: paymentMethod.id,
          clientId,
          type: paymentMethod.type,
          cardBrand: paymentMethod.card?.brand,
          cardLast4: paymentMethod.card?.last4,
          expiryMonth: paymentMethod.card?.exp_month,
          expiryYear: paymentMethod.card?.exp_year,
        },
        update: {},
      });

      return { success: true };
    } catch (error) {
      throw new InternalServerErrorException('Failed to save payment method');
    }
  }
}
