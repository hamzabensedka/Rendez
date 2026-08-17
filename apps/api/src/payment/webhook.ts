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
    this.stripe.webhooks.retrieve(
      'whsec_123456789',
      { at_most: 5 },
      (err, webhook) => {
        if (err) {
          console.error(err);
        } else {
          console.log(webhook);
        }
      }
    );
  }

  async handleWebhook(@Body() body: any) {
    try {
      const sig = this.stripe.webhooks.constructSignature(
        body,
        'whsec_123456789',
      );

      if (!sig) {
        throw new Error('Invalid signature');
      }

      const event = this.stripe.webhooks.constructEvent(
        body,
        sig,
      );

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const payment = await this.prismaService.payment.update({
          where: { providerTxn: paymentIntent.id },
          data: { status: 'paid' },
        });
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}