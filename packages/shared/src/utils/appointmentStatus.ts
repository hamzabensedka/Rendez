import { AppointmentStatus } from '../types';

/**
 * User-facing label for appointment status. Use this so backend and mobile show the same wording.
 */
export function getAppointmentStatusLabel(status: string): string {
  switch (status) {
    case AppointmentStatus.BOOKED:
      return 'Booked';
    case AppointmentStatus.CANCELLED:
      return 'Cancelled';
    case AppointmentStatus.COMPLETED:
      return 'Completed';
    case AppointmentStatus.NO_SHOW:
      return 'No show';
    default:
      return status || 'Unknown';
  }
}
