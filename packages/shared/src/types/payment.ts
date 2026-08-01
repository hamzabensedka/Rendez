export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export type PaymentMethod = 'card' | 'wallet' | 'bank_transfer';

export interface Payment {
  id: string;
  appointmentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  transactionId?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}
