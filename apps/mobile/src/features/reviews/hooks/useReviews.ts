import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    id: number;
    firstName: string;
    lastName?: string;
    avatarUrl?: string;
  };
}

interface ReviewsResponse {
  data: Review[];
  meta: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

const fetchReviews = async ({
  businessId,
  pageParam = 1,
  limit = 10,
}: {
  businessId: number;
  pageParam?: number;
  limit?: number;
}): Promise<ReviewsResponse> => {
  const response = await fetch(
    `/api/businesses/${businessId}/reviews?page=${pageParam}&limit=${limit}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch reviews');
  }
  return response.json();
};

export function useReviews(businessId: number) {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery<ReviewsResponse, Error>({
    queryKey: ['reviews', businessId],
    queryFn: ({ pageParam = 1 }) =>
      fetchReviews({ businessId, pageParam: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.hasMore) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    enabled: !!businessId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const reviews = query.data?.pages.flatMap((page) => page.data) ?? [];

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['reviews', businessId] });
  }, [queryClient, businessId]);

  return {
    reviews,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isRefreshing: query.isRefetching && !query.isFetchingNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage ?? false,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
    invalidate: handleInvalidate,
  };
}
