export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'provider' | 'admin';
  avatar?: string;
  phone?: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description?: string;
  category?: string;
  businessId: string;
}

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  businessId: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
}

export interface AppointmentSummary {
  id: string;
  customerName: string;
  serviceName: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface DashboardSummary {
  todayAppointments: number;
  completedToday: number;
  pendingToday: number;
  totalRevenue: string;
  weeklyAppointments: number;
  monthlyRevenue: string;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  category: string;
  rating: number;
  reviewCount: number;
  images: string[];
  services: Service[];
  latitude: number;
  longitude: number;
}

export interface Availability {
  id: string;
  businessId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}
