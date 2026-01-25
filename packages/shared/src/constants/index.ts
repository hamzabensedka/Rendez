// API version
export const API_VERSION = 'v1';

// Default pagination
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

// Slot computation
export const DEFAULT_SLOT_STEP_MIN = 15;
export const MIN_SLOT_STEP_MIN = 5;
export const MAX_SLOT_STEP_MIN = 60;

// Booking policies (defaults)
export const DEFAULT_FREE_CANCELLATION_HOURS = 24;
export const DEFAULT_ALLOW_RESCHEDULE_HOURS = 2;

// Cache TTLs (seconds)
export const CACHE_TTL_AVAILABILITY = 60; // 1 minute
export const CACHE_TTL_BUSINESS_LIST = 300; // 5 minutes

// JWT
export const JWT_ACCESS_EXPIRY = '15m';
export const JWT_REFRESH_EXPIRY = '7d';

// Rate limiting
export const RATE_LIMIT_AUTH = 5; // requests per window
export const RATE_LIMIT_WINDOW = 60; // seconds

