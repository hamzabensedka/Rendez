export interface Appointment {
  id: string;
  clientName: string;
  clientId: string;
  serviceName: string;
  serviceId: string;
  businessId: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
