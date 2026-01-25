import { DateTime } from 'luxon';

/**
 * Convert local time to UTC for a given timezone
 */
export function localToUtc(
  date: string, // YYYY-MM-DD
  time: string, // HH:mm
  timezone: string
): Date {
  const dt = DateTime.fromISO(`${date}T${time}`, { zone: timezone });
  return dt.toUTC().toJSDate();
}

/**
 * Convert UTC to local time for a given timezone
 */
export function utcToLocal(utcDate: Date, timezone: string): DateTime {
  return DateTime.fromJSDate(utcDate, { zone: 'utc' }).setZone(timezone);
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string, format = 'yyyy-MM-dd'): string {
  const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);
  return dt.toFormat(format);
}

/**
 * Format time for display
 */
export function formatTime(date: Date | string, format = 'HH:mm'): string {
  const dt = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(date);
  return dt.toFormat(format);
}

/**
 * Get start of day in UTC for a given date and timezone
 */
export function getStartOfDayUtc(date: string, timezone: string): Date {
  return localToUtc(date, '00:00', timezone);
}

/**
 * Get end of day in UTC for a given date and timezone
 */
export function getEndOfDayUtc(date: string, timezone: string): Date {
  return localToUtc(date, '23:59', timezone);
}

