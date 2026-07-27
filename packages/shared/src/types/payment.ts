/**
 * Shared payment types for Planity Clone
 * Used across frontend and backend for consistent payment status handling
 */

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  REQUIRES_ACTION = 'REQUIRES_ACTION',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
  REFUNDED = 'REFUNDED',
}

export interface PaymentIntent {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  clientSecret: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'sepa_debit' | 'ideal' | 'bancontact';
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
}

export interface PaymentConfirmation {
  paymentIntentId: string;
  bookingId: string;
  status: PaymentStatus;
  transactionId: string;
  receiptUrl: string | null;
  errorMessage: string | null;
  requiresAction: boolean;
  clientSecret: string | null;
}

export interface PaymentReceipt {
  transactionId: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  date: string;
  businessName: string;
  serviceName: string;
  paymentMethod: Pick<PaymentMethod, 'last4' | 'brand'>;
}

export interface CreatePaymentIntentRequest {
  bookingId: string;
  amount?: number;
  currency?: string;
}

export interface ConfirmPaymentRequest {
  paymentIntentId: string;
  bookingId: string;
  paymentMethod: {
    card: {
      number: string;
      expMonth: number;
      expYear: number;
      cvc: string;
    };
    billingDetails: {
      name: string;
      email?: string;
      address?: {
        line1: string;
        city: string;
        postalCode: string;
        country: string;
      };
    };
  };
}

export interface PaymentError {
  code: string;
  message: string;
  declineCode?: string;
  paymentIntentId?: string;
}
