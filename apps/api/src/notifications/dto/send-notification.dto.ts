import { IsEnum, IsOptional, IsString, IsObject, IsEmail } from 'class-validator';
import { NotificationChannel, NotificationType } from '../notification-channel.enum';

export class SendNotificationDto {
  @IsEnum(NotificationChannel)
  channel: NotificationChannel;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  userId: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  pushToken?: string;

  @IsObject()
  data: Record<string, any>;
}

export class QueueNotificationDto {
  @IsEnum(NotificationChannel)
  channel: NotificationChannel;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  userId: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  pushToken?: string;

  @IsObject()
  data: Record<string, any>;

  @IsOptional()
  delay?: number;
}
