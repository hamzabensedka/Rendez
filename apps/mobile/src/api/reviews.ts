import { apiClient } from './client';
import { Review, CreateReviewPayload } from '../types/review';

export const reviewsApi = {
  getBusinessReviews: async (businessId: number): Promise<Review[]> => {
    const { data } = await apiClient.get<Review[]>(
      `/businesses/${businessId}/reviews`
    );
    return data;
  },

  createReview: async (
    businessId: number,
    payload: CreateReviewPayload
  ): Promise<Review> => {
    const { data } = await apiClient.post<Review>(
      `/businesses/${businessId}/reviews`,
      payload
    );
    return data;
  },

  getUserReviews: async (): Promise<Review[]> => {
    const { data } = await apiClient.get<Review[]>('/reviews/mine');
    return data;
  },
};
