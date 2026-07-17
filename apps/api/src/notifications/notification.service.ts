import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { NotificationChannel, NotificationType } from './notification-channel.enum';
import { SendNotificationDto, BookingNotificationData } from './dto/send-notification.dto';
import { EmailService } from './email.service';
import { PushService } from './push.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectQueue('notifications') private readonly notificationQueue: Queue,
    private readonly emailService: EmailService,
    private readonly pushService: PushService,
  ) {
    this.logger.log('Notification service initialized');
  }

  async sendNotification(dto: SendNotificationDto): Promise<void> {
    const job = await this.notificationQueue.add('send-notification', dto, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    });

    this.logger.log(`Notification job queued: ${job.id}`);
  }

  async sendBookingConfirmation(
    userId: string,
    email: string,
    pushToken: string | null,
    data: BookingNotificationData,
  ): Promise<void> {
    const channels: NotificationChannel[] = [NotificationChannel.EMAIL];
    if (pushToken) {
      channels.push(NotificationChannel.PUSH);
    }

    await this.sendNotification({
      userId,
      type: NotificationType.BOOKING_CONFIRMATION,
      channels,
      email,
      pushToken: pushToken || undefined,
      data,
    });
  }

  async sendBookingReminder(
    userId: string,
    email: string,
    pushToken: string | null,
    data: BookingNotificationData,
  ): Promise<void> {
    const channels: NotificationChannel[] = [NotificationChannel.EMAIL];
    if (pushToken) {
      channels.push(NotificationChannel.PUSH);
    }

    await this.sendNotification({
      userId,
      type: NotificationType.BOOKING_REMINDER,
      channels,
      email,
      pushToken: pushToken || undefined,
      data,
    });
  }

  async processNotification(dto: SendNotificationDto): Promise<void> {
    this.logger.log(`Processing notification: ${dto.type} for user ${dto.userId}`);

    for (const channel of dto.channels) {
      try {
        switch (channel) {
          case NotificationChannel.EMAIL:
            await this.processEmailNotification(dto);
            break;
          case NotificationChannel.PUSH:
            await this.processPushNotification(dto);
            break;
          case NotificationChannel.SMS:
            this.logger.warn('SMS notifications not yet implemented');
            break;
        }
      } catch (error) {
        this.logger.error(`Failed to send ${channel} notification: ${error.message}`);
        throw error;
      }
    }
  }

  private async processEmailNotification(dto: SendNotificationDto): Promise<void> {
    if (!dto.email) {
      this.logger.warn('No email provided for email notification');
      return;
    }

    switch (dto.type) {
      case NotificationType.BOOKING_CONFIRMATION:
        await this.emailService.sendBookingConfirmation(dto.email, dto.data);
        break;
      case NotificationType.BOOKING_REMINDER:
        await this.emailService.sendBookingReminder(dto.email, dto.data);
        break;
      default:
        this.logger.warn(`Email template not found for type: ${dto.type}`);
    }
  }

  private async processPushNotification(dto: SendNotificationDto): Promise<void> {
    if (!dto.pushToken) {
      this.logger.warn('No push token provided for push notification');
      return;
    }

    switch (dto.type) {
      case NotificationType.BOOKING_CONFIRMATION:
        await this.pushService.sendBookingConfirmationPush(dto.pushToken, dto.data);
        break;
      case NotificationType.BOOKING_REMINDER:
        await this.pushService.sendBookingReminderPush(dto.pushToken, dto.data);
        break;
      default:
        this.logger.warn(`Push notification not implemented for type: ${dto.type}`);
    }
  }
}
