import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '../payment/payment.service';
import type { PaymentRequest, PaymentResponse, PaymentReceipt } from '@plan/plan-shared';

/**
 * React Query hooks for payment operations.
 */

// Query keys for payment cache
export const paymentKeys = {
  all: ['payments'] as const,
  status: (paymentId: string) => [...paymentKeys.all, 'status', paymentId] as const,
  receipt: (paymentId: string) => [...paymentKeys.all, 'receipt', paymentId] as const,
};

/**
 * Hook to process a new payment.
 */
export function useProcessPayment() {
  const queryClient = useQueryClient();

  return useMutation<PaymentResponse, Error, PaymentRequest>({
    mutationFn: (request) => paymentService.processPayment(request),
    onSuccess: (data) => {
      // Invalidate payment status and receipt queries
      queryClient.invalidateQueries({ queryKey: paymentKeys.status(data.id) });
      queryClient.invalidateQueries({ queryKey: paymentKeys.receipt(data.id) });
      // Invalidate related appointment queries
      queryClient.invalidateQueries({ queryKey: ['appointments', data.appointmentId] });
    },
  });
}

/**
 * Hook to fetch payment status.
 */
export function usePaymentStatus(paymentId: string | undefined) {
  return useQuery({
    queryKey: paymentKeys.status(paymentId!),
    queryFn: () => paymentService.getPaymentStatus(paymentId!),
    enabled: !!paymentId,
    // Poll every 3 seconds if payment is processing
    refetchInterval: (query) => {
      if (query.state.data?.status === 'processing') {
        return 3000;
      }
      return false;
    },
  });
}

/**
 * Hook to fetch payment receipt.
 */
export function usePaymentReceipt(paymentId: string | undefined) {
  return useQuery({
    queryKey: paymentKeys.receipt(paymentId!),
    queryFn: () => paymentService.getReceipt(paymentId!),
    enabled: !!paymentId,
  });
}

/**
 * Hook to cancel a pending payment.
 */
export function useCancelPayment() {
  const queryClient = useQueryClient();

  return useMutation<void, Promise<void>, string>({
    mutationFn: (paymentId) => paymentService.cancelPayment(paymentId),
    onSuccess: (_, paymentId) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.status(paymentId) });
    },
  });
}
