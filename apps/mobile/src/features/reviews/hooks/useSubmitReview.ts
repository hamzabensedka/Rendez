import { useMutation, useQueryClient } from '@tanstack/react-query';

interface SubmitReviewPayload {
  businessId: number;
  appointmentId?: number;
  rating: number;
  comment?: string;
}

const submitReview = async (payload: SubmitReviewPayload) => {
  const response = await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to submit review');
  }
  return response.json();
};

export function useSubmitReview(businessId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', businessId] });
      queryClient.invalidateQueries({ queryKey: ['business', businessId] });
    },
  });
}
