import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
}

interface ReviewsResponse {
  data: Review[];
  meta: {
    total: number;
    averageRating: number;
    page: number;
    limit: number;
  };
}

interface SubmitReviewPayload {
  businessId: string;
  rating: number;
  comment: string;
  appointmentId?: string;
}

export function useReviews(businessId: string) {
  return useQuery<ReviewsResponse>({
    queryKey: ['reviews', businessId],
    queryFn: async () => {
      const response = await apiClient.get(`/businesses/${businessId}/reviews`);
      return response.data;
    },
    enabled: !!businessId,
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SubmitReviewPayload) => {
      const response = await apiClient.post('/reviews', payload);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.businessId] });
      queryClient.invalidateQueries({ queryKey: ['business', variables.businessId] });
    },
  });
}
