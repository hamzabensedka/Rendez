import { apiClient } from './client';
import { Review, ReviewsResponse } from '../types/review';

export const reviewsApi = {
  /**
   * Fetch paginated reviews for a business.
   */
  async getBusinessReviews(
    businessId: string,
    page = 1,
    limit = 20
  ): Promise<ReviewsResponse> {
    const response = await apiClient.get<ReviewsResponse>(
      `/businesses/${businessId}/reviews`,
      { params: { page, limit } }
    );
    return response.data;
  },

  /**
   * Submit a review for a business after an appointment.
   */
  async submitReview(data: {
    businessId: string;
    rating: number;
    comment: string;
    appointmentId?: string;
  }): Promise<Review> {
    const response = await apiClient.post<Review>('/api/reviews', data);
    return response.data;
  },

  /**
   * Fetch user's own reviews.
   */
  async getMyReviews(page = 1, limit = 20): Promise<ReviewsResponse> {
    const response = await apiClient.get<ReviewsResponse>('/api/reviews/me', {
      params: { page, limit },
    });
    return response.data;
  },
};
