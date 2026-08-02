export interface AvailabilityCacheJobData {
  businessId: string;
  date?: string;
  force?: boolean;
}

export const AVAILABILITY_CACHE_JOB_NAME = 'refresh-availability-cache';
