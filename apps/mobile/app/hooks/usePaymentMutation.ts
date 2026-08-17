import { useMutation } from '@tanstack/react-query';
import { createPayment } from '../../api/payment';

const usePaymentMutation = () => {
  const { mutate } = useMutation(
    ['payment'],
    async (paymentData) => {
      const response = await createPayment(paymentData);
      return response.data;
    }
  );

  return { mutate };
};

export default usePaymentMutation;