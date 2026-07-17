import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  async handlePaymentSucceeded(event: any) {
    // TODO: implement payment success logic (e.g., update DB, send notification)
    console.log('Payment succeeded:', event.data.object.id);
  }
}
