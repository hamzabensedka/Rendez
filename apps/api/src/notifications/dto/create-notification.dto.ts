import { NotificationChannel } from './notification-channel.enum';

export class CreateNotificationDto {
  channel: NotificationChannel;
  data: any;
}