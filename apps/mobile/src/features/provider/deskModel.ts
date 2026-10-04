import type { ProviderAppointment } from '../../application/query/hooks';

export function isBooked(apt: ProviderAppointment): boolean {
  return apt.status === 'BOOKED';
}

export function nextUp(
  appointments: ProviderAppointment[],
  now = new Date()
): ProviderAppointment | null {
  const upcoming = appointments
    .filter((apt) => isBooked(apt) && new Date(apt.endAtUtc).getTime() >= now.getTime())
    .sort((a, b) => new Date(a.startAtUtc).getTime() - new Date(b.startAtUtc).getTime());
  return upcoming[0] ?? null;
}

export function deskStats(appointments: ProviderAppointment[], now = new Date()) {
  let remaining = 0;
  let done = 0;
  let late = 0;
  for (const apt of appointments) {
    if (apt.status === 'CANCELLED') continue;
    if (apt.status === 'COMPLETED') {
      done += 1;
      continue;
    }
    if (apt.status === 'NO_SHOW') continue;
    if (!isBooked(apt)) continue;
    const start = new Date(apt.startAtUtc).getTime();
    if (start < now.getTime()) late += 1;
    else remaining += 1;
  }
  return { remaining, done, late };
}

export function queueWithout(
  appointments: ProviderAppointment[],
  excludeId: string | undefined
): ProviderAppointment[] {
  return appointments
    .filter((apt) => apt.status !== 'CANCELLED' && apt.id !== excludeId)
    .sort((a, b) => new Date(a.startAtUtc).getTime() - new Date(b.startAtUtc).getTime());
}
