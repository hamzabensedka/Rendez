export interface Review {
  id: string;
  businessId: string;
  userId: string;
  appointmentId?: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export interface ReviewsResponse {
  reviews: Review[];
  averageRating: number;
  totalCount: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
