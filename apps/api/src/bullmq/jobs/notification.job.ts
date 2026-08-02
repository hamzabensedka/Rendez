export interface NotificationJobData {
  userId: string;
  type: 'booking_confirmation' | 'reminder' | 'cancellation' | 'reschedule' | 'review_request';
  title: string;
  body: string;
  data?: Record<string, unknown>;
}
