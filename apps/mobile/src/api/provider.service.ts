import { apiClient } from './client';

export interface DashboardData {
  todayCount: number;
  pendingCount: number;
  monthlyRevenue: number;
  rating: number;
}

export interface ProviderAppointment {
  id: string;
  clientName: string;
  serviceName: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
}

export interface ProviderService {
  id: string;
  name: string;
  price: number;
  duration: number;
  description?: string;
}

export interface UpdateServicePayload {
  id: string;
  name: string;
  price: number;
  duration: number;
  description?: string;
}

export async function getProviderDashboard(): Promise<DashboardData> {
  const response = await getNext().get('/provider/dashboard');
  return response.data;
}

export async function getProviderAppointments(params?: {
  date?: string;
  status?: string;
}): Promise<ProviderAppointment[]> {
  const response = await getNext().get('/provider/appointments', { params });
  return response.data;
}

export async function getProviderServices(): Promise<ProviderService[]> {
  const response = await getNext().get('/provider/services');
  return response.data;
}

export async function updateService(payload: UpdateServicePayload): Promise<ProviderService> {
  const { id, ...data } = payload;
  const response = await getNext().put(`/provider/services/${id}`, data);
  return response.data;
}
