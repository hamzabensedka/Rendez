export interface ReviewUser {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Review {
  id: string;
  businessId: string;
  userId: string;
  appointmentId?: string;
  rating: number;
  comment?: string;
  response?: string;
  user?: ReviewUser;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewPayload {
  businessId: string;
  appointmentId?: string;
  rating: number;
  comment?: string;
}

export interface ReviewsResponse {
  data: Review[];
  meta: {
    totalCount: number;
    averageRating: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}
