import {
  IsEnum,
  IsOptional,
  IsString,
  IsEmail,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationChannel, NotificationType } from '../notification-channel.enum';

export class SendNotificationDto {
  @IsEnum(NotificationChannel)
  channel: NotificationChannel;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsEmail()
  recipientEmail?: string;

  @IsString()
  recipientPushToken?: string;

  @IsString()
  recipientPhone?: string;

  @IsString()
  userId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => BookingData)
  bookingData?: BookingData;

  @IsOptional()
  metadata?: Record<string, any>;
}

export class BookingData {
  @IsString()
  appointmentId: string;

  @IsString()
  businessName: string;

  @IsString()
  serviceName: string;

  @IsString()
  appointmentDate: string;

  @IsString()
  appointmentTime: string;

  @IsOptional()
  @IsString()
  businessAddress?: string;

  @IsOptional()
  @IsNumber()
  price?: number;
}

export class QueueNotificationDto extends SendNotificationDto {
  @IsString()
  jobId: string;

  @IsOptional()
  attempts?: number;
}
