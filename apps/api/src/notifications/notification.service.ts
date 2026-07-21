import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { NotificationChannel, NotificationType } from './notification-channel.enum';
import { NotificationPayload, EmailData, PushData, BookingNotificationData } from './interfaces/notification.interface';
import { SendNotificationDto } from './dto/send-notification.dto';
import {
  getBookingConfirmationEmailTemplate,
  getBookingReminderEmailTemplate,
  getBookingCancellationEmailTemplate,
} from './templates';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectQueue('notifications')
    private readonly notificationQueue: Queue,
  ) {}

  async sendNotification(dto: SendNotificationDto): Promise<void> {
    const payload: NotificationPayload = {
      channel: dto.channel,
      type: dto.type,
      recipientId: dto.recipientId,
      recipientEmail: dto.recipientEmail,
      recipientPushToken: dto.recipientPushToken,
      data: dto.data,
    };

    await this.notificationQueue.add('send-notification', payload, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    });

    this.logger.log(`Notification queued: ${dto.type} via ${dto.channel} for ${dto.recipientId}`);
  }

  async sendBookingConfirmation(data: BookingNotificationData): Promise<void> {
    const emailTemplate = getBookingConfirmationEmailTemplate(data);

    const dto: SendNotificationDto = {
      channel: NotificationChannel.EMAIL,
      type: NotificationType.BOOKING_CONFIRMATION,
      recipientId: data.userId,
      recipientEmail: data.userEmail,
      data: {
        ...data,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      },
    };

    await this.sendNotification(dto);
  }

  async sendBookingReminder(data: BookingNotificationData): Promise<void> {
    const emailTemplate = getBookingReminderEmailTemplate(data);

    const dto: SendNotificationDto = {
      channel: NotificationChannel.EMAIL,
      type: NotificationType.BOOKING_REMINDER,
      recipientId: data.userId,
      recipientEmail: data.userEmail,
      data: {
        ...data,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      },
    };

    await this.sendNotification(dto);
  }

  async sendBookingCancellation(data: BookingNotificationData): Promise<void> {
    const emailTemplate = getBookingCancellationEmailTemplate(data);

    const dto: SendNotificationDto = {
      channel: NotificationChannel.EMAIL,
      type: NotificationType.BOOKING_CANCELLATION,
      recipientId: data.userId,
      recipientEmail: data.userEmail,
      data: {
        ...data,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      },
    };

    await this.sendNotification(dto);
  }

  async scheduleBookingReminder(appointmentId: string, reminderTime: Date, data: BookingNotificationData): Promise<void> {
    const delay = reminderTime.getTime() - Date.now();
    
    if (delay <= 0) {
      this.logger.warn(`Reminder time is in the past for appointment ${appointmentId}`);
      return;
    }

    await this.notificationQueue.add(
      'booking-reminder',
      {
        appointmentId,
        type: NotificationType.BOOKING_REMINDER,
        data,
      },
      {
        delay,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    this.logger.log(`Booking reminder scheduled for appointment ${appointmentId} at ${reminderTime.toISOString()}`);
  }
}
