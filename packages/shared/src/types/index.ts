// User roles
export enum UserRole {
  CLIENT = 'client',
  PROVIDER_OWNER = 'providerOwner',
  PROVIDER_STAFF = 'providerStaff',
  ADMIN = 'admin',
}

// User status
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

// Business status
export enum BusinessStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

// Appointment status
export enum AppointmentStatus {
  BOOKED = 'BOOKED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
}

// Appointment source
export enum AppointmentSource {
  CLIENT = 'client',
  PROVIDER = 'provider',
  ADMIN = 'admin',
}

// Payment provider
export enum PaymentProvider {
  OFFLINE = 'OFFLINE',
  STRIPE = 'STRIPE',
}

// Payment status
export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

// Review status
export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

// Promotion type
export enum PromotionType {
  PERCENT = 'PERCENT',
  FIXED = 'FIXED',
}

// Notification channel
export enum NotificationChannel {
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
}

// Common types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

