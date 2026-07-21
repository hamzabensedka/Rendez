import { apiClient } from '../../../lib/apiClient';

interface GetReviewsParams {
  businessId: string;
  page: number;
  limit: number;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface SubmitReviewPayload {
  businessId: string;
  appointmentId?: string;
  rating: number;
  comment: string;
}

export const reviewsApi = {
  getReviews: async (params: GetReviewsParams): Promise<PaginatedResponse<Review>> => {
    const response = await apiClient.get(`/businesses/${params.businessId}/reviews`, {
      params: {
        page: params.page,
        limit: params.limit,
      },
    });
    return response.data;
  },

  submitReview: async (payload: SubmitReviewPayload): Promise<Review> => {
    const response = await apiClient.post(`/businesses/${payload.businessId}/reviews`, {
      appointmentId: payload.appointmentId,
      rating: payload.rating,
      comment: payload.comment,
    });
    return response.data;
  },
};
