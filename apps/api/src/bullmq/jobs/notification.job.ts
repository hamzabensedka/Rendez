export interface NotificationJobData {
  userId: string;
  type: 'booking_confirmation' | 'booking_reminder' | 'booking_cancellation' | 'review_request' | 'general';
  payload: {
    title: string;
    body: string;
    data?: Record<string, unknown>;
  };
}
