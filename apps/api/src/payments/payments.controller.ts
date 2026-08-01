import { Controller, Post, Headers, Req, Res } from '@nestjs/common';
import { stripe } from '../stripe.service';

@Controller('payments/webhook')
export class PaymentsWebhookController {
  @Post()
  async handleWebhook(
    @Req() req,
    @Res() res,
    @Headers('stripe-signature') signature: string,
  ) {
    // Verify signature using stripe secret from env
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      return res.status(400).send(`Webhook signature verification failed.`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        // TODO: handle successful payment
        break;
      // Add other event types as needed
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return res.json({ received: true });
  }
}