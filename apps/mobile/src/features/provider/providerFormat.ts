import type { ProviderAppointment } from '../../application/query/hooks';

export function formatClock(iso: string): string {
  const d = new Date(iso);
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function formatHeadlineDate(day: Date): string {
  return day.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });
}

export function formatHumanRange(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();
  const day = (d: Date) =>
    d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  if (sameDay) return day(start);
  return `${day(start)} – ${day(end)}`;
}

export function formatDuration(startIso: string, endIso: string): string {
  const minutes = Math.max(1, Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000));
  return `${minutes}m`;
}

export function serviceLine(apt: ProviderAppointment): string {
  return (
    (apt.appointmentItems ?? [])
      .map((item) => item.serviceVariant?.name)
      .filter(Boolean)
      .join(' · ') || 'Service'
  );
}

export function statusLabel(status: string): string {
  if (status === 'COMPLETED') return 'Done';
  if (status === 'NO_SHOW') return 'No-show';
  if (status === 'CANCELLED') return 'Cancelled';
  return 'Booked';
}
