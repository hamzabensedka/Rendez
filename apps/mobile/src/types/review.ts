export interface Review {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    avatarUrl?: string;
  };
  businessId: number;
}

export interface CreateReviewPayload {
  rating: number;
  comment?: string;
}
