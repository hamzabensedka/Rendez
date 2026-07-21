import { NotificationChannel, NotificationType } from '../notification-channel.enum';

export interface NotificationPayload {
  channel: NotificationChannel;
  type: NotificationType;
  recipientId: string;
  recipientEmail?: string;
  recipientPushToken?: string;
  data: Record<string, any>;
}

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface PushData {
  token: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

export interface BookingNotificationData {
  appointmentId: string;
  userId: string;
  userEmail: string;
  userName: string;
  businessName: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  businessAddress?: string;
  businessPhone?: string;
}
