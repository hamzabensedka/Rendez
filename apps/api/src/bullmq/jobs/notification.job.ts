export interface NotificationJobData {
  userId: string;
  type: 'booking_confirmation' | 'booking_reminder' | 'booking_cancellation' | 'booking_reschedule' | 'review_request';
  payload: Record<string, unknown>;
  channels?: ('push' | 'email')[];
}

export const NOTIFICATION_JOB_NAME = 'send-notification';
