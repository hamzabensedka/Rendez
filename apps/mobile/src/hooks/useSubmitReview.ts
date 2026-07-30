import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '../features/Reviews/api/reviewsApi';
import { CreateReviewRequest, Review } from '../features/Reviews/types/review';

export function useSubmitReview() {
  const queryClient = useQueryClient();

  const mutation = useMutation<Review, Error, CreateReviewRequest>({
    mutationFn: (payload) => reviewsApi.createReview(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', data.businessId] });
      queryClient.invalidateQueries({ queryKey: ['business', data.businessId] });
    },
  });

  return {
    submitReview: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    error: mutation.error,
  };
}
