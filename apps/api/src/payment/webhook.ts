import { Injectable } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Stripe } from 'stripe';

@Injectable()
export class WebhookService implements OnModuleInit {
  private stripe: Stripe;

  constructor(private readonly prismaService: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  onModuleInit() {
    this.stripe.webhooks.endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  }

  async handleWebhook(event: any) {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const payment = await this.prismaService.payment.update({
        where: { providerTxn: paymentIntent.id },
        data: { status: 'paid' },
      });
    }
  }
}
