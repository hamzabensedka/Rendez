import { Controller, Post, Req, Res, Headers } from '@nestjs/common';
import { Request, Response } from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

@Controller('payments/webhook')
export class PaymentsWebhookController {
  @Post()
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    const signature = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    // The raw body is needed for signature verification
    const rawBodyBuffer = Buffer.from(req['rawBody']);

    try {
      event = stripe.webhooks.constructEvent(
        rawBodyBuffer,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err) {
      return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
    }

    // ------------------------------------------------------------
    // Handle the event
    // ------------------------------------------------------------
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const appointmentId = session.metadata?.appointmentId;
        if (appointmentId) {
          // TODO: update appointment status to 'paid' in DB
        }
        break;
      }
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // TODO: any additional payment-specific logic
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Respond with 200 to acknowledge receipt of the webhook
    return res.json({ received: true });
  }
}
