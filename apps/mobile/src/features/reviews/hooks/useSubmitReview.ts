import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '../api/reviewsApi';
import { Alert } from 'react-native';

interface SubmitReviewPayload {
  businessId: string;
  appointmentId?: string;
  rating: number;
  comment: string;
}

export const useSubmitReview = (businessId: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    (payload: SubmitReviewPayload) => reviewsApi.submitReview(payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['reviews', businessId]);
        queryClient.invalidateQueries(['business', businessId]);
        Alert.alert('Success', 'Your review has been submitted.');
      },
      onError: (error: any) => {
        Alert.alert('Error', error?.message || 'Failed to submit review.');
      },
    }
  );
};
