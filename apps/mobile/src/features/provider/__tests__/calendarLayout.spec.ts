import {
  addDays,
  blockGeometry,
  isSameLocalDay,
  startOfLocalDay,
  visibleHourRange,
  PX_PER_HOUR,
} from '../calendarLayout';

describe('calendarLayout', () => {
  it('treats local midnights as the same day', () => {
    const a = new Date(2026, 5, 15, 9, 0, 0);
    const b = new Date(2026, 5, 15, 23, 0, 0);
    expect(isSameLocalDay(a, b)).toBe(true);
    expect(isSameLocalDay(a, addDays(a, 1))).toBe(false);
  });

  it('places a 10:00–11:00 block one hour below 8:00', () => {
    const day = startOfLocalDay(new Date(2026, 5, 15));
    const start = new Date(2026, 5, 15, 10, 0, 0);
    const end = new Date(2026, 5, 15, 11, 0, 0);
    const geo = blockGeometry(start, end, day, 8, 20);
    expect(geo).toEqual({ top: 2 * PX_PER_HOUR, height: PX_PER_HOUR });
  });

  it('widens the window when a late appointment exists', () => {
    const start = new Date(2026, 5, 15, 19, 30, 0);
    const end = new Date(2026, 5, 15, 21, 0, 0);
    const range = visibleHourRange([start], [end]);
    expect(range.endHour).toBeGreaterThanOrEqual(21);
  });
});
