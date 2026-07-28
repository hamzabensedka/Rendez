export interface Service {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
