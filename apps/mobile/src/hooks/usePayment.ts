import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import { PaymentStatus } from '@/shared';

export interface PaymentRequest {
  appointmentId: string;
  amount: number;
  method: 'card' | 'wallet' | 'bank_transfer';
}

export interface PaymentResponse {
  status: PaymentStatus;
  transactionId: string;
  receiptUrl?: string;
}

export function usePayment() {
  const processPayment = async (payload: PaymentInitRequest): Promise<PaymentResponse> => {
    const response = await apiClient.post<PaymentResponse>('/payments', payload);
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: processPayment,
  });

  return {
    processPayment: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    data: mutation.data,
  };
}
