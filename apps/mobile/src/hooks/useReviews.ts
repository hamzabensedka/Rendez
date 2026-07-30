import { useInfiniteQuery } from '@tanstack/react-query';
import { reviewsApi } from '../features/Reviews/api/reviewsApi';
import { ReviewsResponse } from '../features/Reviews/types/review';

interface UseReviewsOptions {
  businessId: string;
  limit?: number;
}

export function useReviews({ businessId, limit = 10 }: UseReviewsOptions) {
  return useInfiniteQuery<ReviewsResponse, Error>({
    queryKey: ['reviews', businessId],
    queryFn: ({ pageParam = 1 }) =>
      reviewsApi.getReviews(businessId, pageParam as number, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.hasNextPage) {
        return lastPage.meta.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!businessId,
  });
}
