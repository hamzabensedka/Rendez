import { useState } from 'react';
import { useMutation } from 'tanstack-react-query';
import { PaymentApi } from '../api/PaymentApi';
import { PaymentStatus } from '../types/PaymentStatus';

const usePayment = () => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.PENDING);
  const { mutate: makePayment } = useMutation(
    async () => {
      const paymentResponse = await PaymentApi.makePayment();
      setPaymentStatus(paymentResponse.status);
      return paymentResponse;
    },
    {
      onSuccess: () => {
        // Handle payment success
      },
      onError: (error) => {
        console.error('Error making payment:', error);
      }
    }
  );

  return { mutate: makePayment, paymentStatus };
};

export default usePayment;