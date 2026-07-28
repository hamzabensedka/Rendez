export interface Business {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  category: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
