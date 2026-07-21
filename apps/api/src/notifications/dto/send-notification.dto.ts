import { IsEnum, IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';
import { NotificationChannel, NotificationType } from '../notification-channel.enum';

export class SendNotificationDto {
  @IsEnum(NotificationChannel)
  channel: NotificationChannel;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  @IsNotEmpty()
  recipientId: string;

  @IsOptional()
  @IsString()
  recipientEmail?: string;

  @IsOptional()
  @IsString()
  recipientPushToken?: string;

  @IsObject()
  data: Record<string, any>;
}
