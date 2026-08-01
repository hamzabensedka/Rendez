/**
 * Payment-related shared types for Planity Clone.
 * Used by both frontend and backend to ensure consistency.
 */

// Represents the status of a payment
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';

// Represents a payment method
export type PaymentMethodType = 'card' | 'apple_pay' | 'google_pay' | 'paypal';

// Payment request sent to the API
export interface PaymentRequest {
  appointmentId: string;
  amount: number;
  currency: string;
  method: PaymentMethodType;
  // Optional token from payment provider (e.g., Stripe)
  paymentToken?: string;
}

// Payment response from the API
export interface PaymentResponse {
  id: string;
  appointmentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethodType;
  transactionId?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Payment receipt details
export interface PaymentReceipt {
  paymentId: string;
  appointmentId: string;
  businessName: string;
  serviceName: string;
  date: string;
  amount: number;
  currency: string;
  method: PaymentMethodType;
  status: PaymentStatus;
  transactionId?: string;
  paidAt: string;
}
