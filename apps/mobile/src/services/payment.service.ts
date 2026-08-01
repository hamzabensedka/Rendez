import { apiClient } from '../lib/api-client';
import type { PaymentRequest, PaymentResponse, PaymentReceipt } from '@planity/shared';

/**
 * Service for handling payment operations.
 */
export const paymentService = {
  /**
   * Process a payment for an appointment.
   */
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    const { data } = await apiClient.post<PaymentResponse>('/payments', request);
    return data;
  },

  /**
   * Get payment status by payment ID.
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    const { data } = await apiClient.get<PaymentResponse>(`/payments/${paymentId}`);
    return data;
  },

  /**
   * Get receipt for a completed payment.
   */
  async getReceipt(paymentId: string): Promise<PaymentReceipt> {
    const { data } = await apiClient.get<PaymentReceipt>(`/payments/${paymentId}/receipt`);
    return data;
  },

  /**
   * Cancel a pending payment.
   */
  async cancelPayment(paymentId: string): Promise<void> {
    await apiClient.delete(`/payments/${paymentId}`);
  },
};
