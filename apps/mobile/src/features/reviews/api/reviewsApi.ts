import { apiClient } from '../../../shared/api/apiClient';
import { CreateReviewRequest, Review, ReviewsResponse } from '../types/review';

export const reviewsApi = {
  async getReviews(
    businessId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ReviewsResponse> {
    const response = await apiClient.get<ReviewsResponse>(
      `/businesses/${businessId}/reviews`,
      { params: { page, limit } }
    );
    return response.data;
  },

  async createReview(payload: CreateReviewRequest): Promise<Review> {
    const response = await apiClient.post<Review>(
      `/businesses/${payload.businessId}/reviews`,
      {
        appointmentId: payload.appointmentId,
        rating: payload.rating,
        comment: payload.comment,
      }
    );
    return response.data;
  },
};
