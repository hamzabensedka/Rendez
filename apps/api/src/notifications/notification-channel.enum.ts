export enum NotificationChannel {
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
  SMS = 'SMS',
}

export enum NotificationType {
  BOOKING_CONFIRMATION = 'BOOKING_CONFIRMATION',
  BOOKING_REMINDER = 'BOOKING_REMINDER',
  BOOKING_CANCELLATION = 'BOOKING_CANCELLATION',
  BOOKING_RESCHEDULE = 'BOOKING_RESCHEDULE',
  APPOINTMENT_UPCOMING = 'APPOINTMENT_UPCOMING',
}

export interface NotificationPayload {
  channel: NotificationChannel;
  type: NotificationType;
  userId: string;
  email?: string;
  pushToken?: string;
  data: Record<string, any>;
}

export interface BookingNotificationData {
  appointmentId: string;
  businessName: string;
  serviceName: string;
  dateTime: string;
  customerName: string;
  customerEmail: string;
}
