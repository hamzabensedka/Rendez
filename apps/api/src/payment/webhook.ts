import { Injectable } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Stripe } from 'stripe';

@Injectable()
export class PaymentWebhook implements OnModuleInit {
  private stripe: Stripe;

  constructor(private readonly prismaService: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  onModuleInit() {
    this.stripe.webhooks.retrieve(
      'whsec_123',
      { at_most: 1 },
      (err, webhook) => {
        if (err) {
          console.error(err);
        } else {
          console.log(webhook);
        }
      }
    );
  }
}
