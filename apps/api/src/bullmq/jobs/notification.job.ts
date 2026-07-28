export interface NotificationJobData {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}
