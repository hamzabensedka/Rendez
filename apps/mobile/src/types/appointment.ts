export interface Appointment {
  id: string;
  businessId: string;
  clientId: string;
  clientName?: string;
  serviceId: string;
  serviceName: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
