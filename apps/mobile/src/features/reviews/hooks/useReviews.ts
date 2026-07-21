import { useInfiniteQuery } from '@tanstack/react-query';
import { reviewsApi } from '../api/reviewsApi';

interface UseReviewsOptions {
  businessId: string;
  limit?: number;
}

export const useReviews = ({ businessId, limit = 10 }: UseReviewsOptions) => {
  return useInfiniteQuery(
    ['reviews', businessId],
    ({ pageParam = 1 }) => reviewsApi.getReviews({ businessId, page: pageParam, limit }),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.data.length < limit) return undefined;
        return allPages.length + 1;
      },
      enabled: !!businessId,
    }
  );
};
