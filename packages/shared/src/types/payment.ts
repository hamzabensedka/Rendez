/**
 * Shared Payment Types for Planity Clone
 * Used across frontend and backend for payment integration.
 */

/**
 * Payment status enum reflecting the lifecycle of a payment.
 */
export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'requires_payment_method'
  | 'requires_action'
  | 'requires_confirmation'
  | 'succeeded'
  | 'failed'
  | 'canceled'
  | 'refunded';

/**
 * Supported payment methods in the app.
 */
export type PaymentMethod = 'card' | 'apple_pay' | 'google_pay';

/**
 * Payment intent as returned by the API.
 */
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  clientSecret?: string;
  paymentMethod?: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}

/**
 * Request to create a payment intent.
 */
export interface CreatePaymentIntentRequest {
  appointmentId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
}

/**
 * Request to confirm a payment.
 */
export interface ConfirmPaymentRequest {
  paymentIntentId: string;
  appointmentId: string;
  paymentMethod: PaymentMethod;
}

/**
 * Payment record returned after confirmation.
 */
export interface Payment {
  id: string;
  appointmentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Response after confirming a payment.
 */
export interface PaymentConfirmationResponse {
  payment: Payment;
  appointment: {
    id: string;
    status: string;
  };
}
