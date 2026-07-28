export interface NotificationJobData {
  userId: string;
  type: 'push' | 'email';
  title: string;
  body: string;
  metadata?: Record<string, unknown>;
}
