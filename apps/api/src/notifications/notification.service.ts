import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  NotificationChannel,
  NotificationType,
  BookingData,
} from './notification-channel.enum';
import { SendNotificationDto } from './dto/send-notification.dto';
import { EmailProvider, EMAIL_PROVIDER } from './providers/email.provider';
import { ExpoPushProvider, PUSH_PROVIDER } from './providers/push.provider';
import { EmailTemplates } from './templates/email-templates';

export const NOTIFICATION_QUEUE = 'notification-queue';

export interface NotificationJob {
  id: string;
  data: SendNotificationDto;
  attemptsMade?: number;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectQueue(NOTIFICATION_QUEUE) private readonly notificationQueue: Queue,
    @Inject(EMAIL_PROVIDER) private readonly emailProvider: EmailProvider,
    @Inject(PUSH_PROVIDER) private readonly pushProvider: ExpoPushProvider,
  ) {}

  async sendNotification(dto: SendNotificationDto): Promise<string> {
    const job = await this.notificationQueue.add('send-notification', dto, {
      jobId: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: 100,
      removeOnFail: 50,
    });

    this.logger.log(`Notification job created: ${job.id}`);
    return job.id;
  }

  async sendBookingConfirmation(
    email: string,
    bookingData: BookingData,
  ): Promise<string> {
    return this.sendNotification({
      channel: NotificationChannel.EMAIL,
      type: NotificationType.BOOKING_CONFIRMATION,
      recipientEmail: email,
      bookingData,
    });
  }

  async sendBookingReminder(
    email: string,
    pushToken: string | undefined,
    bookingData: BookingData,
  ): Promise<string[]> {
    const jobIds: string[] = [];

    if (email) {
      const emailJobId = await this.sendNotification({
        channel: NotificationChannel.EMAIL,
        type: NotificationType.BOOKING_REMINDER,
        recipientEmail: email,
        bookingData,
      });
      jobIds.push(emailJobId);
    }

    if (pushToken) {
      const pushJobId = await this.sendNotification({
        channel: NotificationChannel.PUSH,
        type: NotificationType.BOOKING_REMINDER,
        recipientPushToken: pushToken,
        bookingData,
      });
      jobIds.push(pushJobId);
    }

    return jobIds;
  }

  async processNotification(jobData: SendNotificationDto): Promise<boolean> {
    const { channel } = jobData;

    switch (channel) {
      case NotificationChannel.EMAIL:
        return this.processEmailNotification(jobData);
      case NotificationChannel.PUSH:
        return this.processPushNotification(jobData);
      default:
        this.logger.warn(`Unsupported channel: ${channel}`);
        return false;
    }
  }

  private async processEmailNotification(dto: SendNotificationDto): Promise<boolean> {
    if (!dto.recipientEmail || !dto.bookingData) {
      this.logger.error('Missing email or booking data');
      return false;
    }

    const template = EmailTemplates.getTemplate(dto.type, dto.bookingData);
    return this.emailProvider.send(dto.recipientEmail, template);
  }

  private async processPushNotification(dto: SendNotificationDto): Promise<boolean> {
    if (!dto.recipientPushToken || !dto.bookingData) {
      this.logger.error('Missing push token or booking data');
      return false;
    }

    const { bookingData } = dto;
    let title: string;
    let body: string;

    switch (dto.type) {
      case NotificationType.BOOKING_CONFIRMATION:
        title = 'Booking Confirmed!';
        body = `Your appointment at ${bookingData.businessName} is confirmed for ${bookingData.appointmentDate} at ${bookingData.appointmentTime}.`;
        break;
      case NotificationType.BOOKING_REMINDER:
        title = 'Appointment Tomorrow';
        body = `Reminder: ${bookingData.serviceName} at ${bookingData.businessName} tomorrow at ${bookingData.appointmentTime}.`;
        break;
      case NotificationType.BOOKING_CANCELLATION:
        title = 'Booking Cancelled';
        body = `Your appointment at ${bookingData.businessName} has been cancelled.`;
        break;
      default:
        title = 'Planity Clone';
        body = 'You have a new notification.';
    }

    return this.pushProvider.send(dto.recipientPushToken, title, body, {
      type: dto.type,
      appointmentId: bookingData.appointmentId,
    });
  }

  async getQueueStats(): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
  }> {
    const [waiting, active, completed, failed] = await Promise.all([
      this.notificationQueue.getWaitingCount(),
      this.notificationQueue.getActiveCount(),
      this.notificationQueue.getCompletedCount(),
      this.notificationQueue.getFailedCount(),
    ]);

    return { waiting, active, completed, failed };
  }
}
