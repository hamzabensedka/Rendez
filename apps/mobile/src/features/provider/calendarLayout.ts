export const PX_PER_HOUR = 56;
export const GUTTER_WIDTH = 48;
export const COLUMN_WIDTH = 118;

export function startOfLocalDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfLocalDay(date: Date): Date {
  const d = startOfLocalDay(date);
  d.setDate(d.getDate() + 1);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = startOfLocalDay(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function isSameLocalDay(a: Date, b: Date): boolean {
  return startOfLocalDay(a).getTime() === startOfLocalDay(b).getTime();
}

/** Visible hour window for a day, expanded if appointments fall outside 9–18. */
export function visibleHourRange(
  starts: Date[],
  ends: Date[],
  fallbackStart = 9,
  fallbackEnd = 18
): { startHour: number; endHour: number } {
  let startHour = fallbackStart;
  let endHour = fallbackEnd;
  for (const t of starts) {
    startHour = Math.min(startHour, t.getHours());
  }
  for (const t of ends) {
    const hour = t.getHours() + (t.getMinutes() > 0 || t.getSeconds() > 0 ? 1 : 0);
    endHour = Math.max(endHour, hour);
  }
  startHour = Math.max(7, Math.min(startHour, 12));
  endHour = Math.min(21, Math.max(endHour, startHour + 1));
  return { startHour, endHour };
}

export function blockGeometry(
  start: Date,
  end: Date,
  day: Date,
  startHour: number,
  endHour: number,
  pxPerHour = PX_PER_HOUR
): { top: number; height: number } | null {
  const windowStart = new Date(day);
  windowStart.setHours(startHour, 0, 0, 0);
  const windowEnd = new Date(day);
  windowEnd.setHours(endHour, 0, 0, 0);
  const clampedStart = start > windowStart ? start : windowStart;
  const clampedEnd = end < windowEnd ? end : windowEnd;
  if (clampedEnd.getTime() <= clampedStart.getTime()) return null;
  const top = ((clampedStart.getTime() - windowStart.getTime()) / 60000) * (pxPerHour / 60);
  const height = Math.max(36, ((clampedEnd.getTime() - clampedStart.getTime()) / 60000) * (pxPerHour / 60));
  return { top, height };
}
