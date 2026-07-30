export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'wallet';
  lastFour: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransaction {
  id: string;
  appointmentId: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethodId: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentReceipt {
  transactionId: string;
  appointmentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paidAt: string;
  paymentMethod: {
    brand: string;
    lastFour: string;
  };
}
