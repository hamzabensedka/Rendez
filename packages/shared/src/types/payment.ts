/**
 * Payment statuses aligned with the payment gateway lifecycle.
 */
export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'refunded'
  | 'cancelled';

/**
 * Supported payment methods.
 */
export type PaymentMethod =
  | 'card'
  | 'wallet'
  | 'bank_transfer'
  | 'cash';

/**
 * Represents a payment transaction.
 */
export interface PaymentTransaction {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Request payload to initiate a payment.
 */
export interface InitiatePaymentRequest {
  bookingId: string;
  method: PaymentMethod;
  amount: number;
  currency: string;
}

/**
 * Response after initiating a payment.
 */
export interface InitiatePaymentResponse {
  transactionId: string;
  status: PaymentStatus;
  receiptUrl?: string;
}
