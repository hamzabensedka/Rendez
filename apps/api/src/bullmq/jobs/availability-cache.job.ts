export interface AvailabilityCacheJobData {
  businessId: string;
  date?: string; // ISO date string for specific date, undefined means all dates
  forceRefresh?: boolean;
}
