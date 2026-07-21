import { IsEnum, IsOptional, IsString, IsEmail, IsNumber, IsObject } from 'class-validator';
import { NotificationChannel, NotificationType } from '../notification-channel.enum';

export class SendNotificationDto {
  @IsEnum(NotificationChannel)
  channel: NotificationChannel;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  pushToken?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNumber()
  userId: number;

  @IsObject()
  data: Record<string, any>;
}

export class BookingNotificationData {
  customerName: string;
  businessName: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  businessAddress?: string;
  businessPhone?: string;
}
