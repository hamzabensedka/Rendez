import type { Appointment } from './appointment';

export interface DashboardSummary {
  todayAppointments: number;
  totalRevenue: number;
  newClients: number;
  rating: number;
}

export interface ProviderDashboardData {
  summary: DashboardSummary;
  todayAppointments: Appointment[];
}
