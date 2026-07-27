import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  async handleCheckoutSession(session: Stripe.Checkout.Session) {
    // Implementation would update appointment status, record payment, etc.
    console.log('Processing checkout session', session.id);
  }
}
