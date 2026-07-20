import { IsEnum, IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';
import { NotificationChannel, NotificationType } from '../notification-channel.enum';

export class SendNotificationDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsArray()
  @IsEnum(NotificationChannel, { each: true })
  channels: NotificationChannel[];

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  pushToken?: string;

  @IsOptional()
  data?: Record<string, any>;
}

export class BookingNotificationData {
  appointmentId: string;
  businessName: string;
  serviceName: string;
  dateTime: string;
  customerName: string;
  customerEmail: string;
}
