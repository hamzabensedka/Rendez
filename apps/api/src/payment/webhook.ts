import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Stripe } from 'stripe';

@Injectable()
export class WebhookService {
  constructor() {}

  @OnEvent('payment_succeeded')
  paymentSucceeded(event: any) {
    console.log('Payment succeeded:', event);
  }

  @OnEvent('payment_failed')
  paymentFailed(event: any) {
    console.log('Payment failed:', event);
  }
}