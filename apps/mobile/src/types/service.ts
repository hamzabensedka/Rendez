export interface Service {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  category?: string;
  isActive: boolean;
  businessId: string;
  createdAt: string;
  updatedAt: string;
}
