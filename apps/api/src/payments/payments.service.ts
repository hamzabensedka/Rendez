import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  async handlePaymentSucceeded(intent: Stripe.PaymentIntent) {
    // TODO: update appointment status, send notification, etc.
    console.log(`Payment succeeded for ${intent.id}`);
  }
}