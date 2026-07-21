export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

export interface Payment {
  id: string;
  appointmentId: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripePaymentIntentId?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRequest {
  appointmentId: string;
  card: {
    number: string;
    expiryMonth: string;
    expiryYear: string;
    cvc: string;
  };
}

export interface PaymentResponse {
  id: string;
  status: PaymentStatus;
  receiptUrl: string;
}
