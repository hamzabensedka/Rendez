import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  NotificationChannel,
  NotificationType,
  NotificationPayload,
  BookingNotificationData,
} from './notification-channel.enum';
import { QueueNotificationDto } from './dto/send-notification.dto';
import { EMAIL_PROVIDER, EmailProvider } from './providers/email.provider';
import { PUSH_PROVIDER, PushProvider } from './providers/push.provider';
import {
  getBookingConfirmationEmailTemplate,
  getBookingConfirmationPushTemplate,
} from './templates/booking-confirmation.template';
import {
  getBookingReminderEmailTemplate,
  getBookingReminderPushTemplate,
} from './templates/booking-reminder.template';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectQueue('notifications') private readonly notificationQueue: Queue,
    @Inject(EMAIL_PROVIDER) private readonly emailProvider: EmailProvider,
    @Inject(PUSH_PROVIDER) private readonly pushProvider: PushProvider,
  ) {}

  async sendBookingConfirmation(data: BookingNotificationData, channels?: NotificationChannel[]): Promise<void> {
    const notificationChannels = channels || [NotificationChannel.EMAIL, NotificationChannel.PUSH];

    for (const channel of notificationChannels) {
      const dto: QueueNotificationDto = {
        channel,
        type: NotificationType.BOOKING_CONFIRMATION,
        userId: data.customerEmail,
        email: data.customerEmail,
        data: data as any,
      };

      await this.queueNotification(dto);
    }
  }

  async sendBookingReminder(data: BookingNotificationData, channels?: NotificationChannel[]): Promise<void> {
    const notificationChannels = channels || [NotificationChannel.EMAIL, NotificationChannel.PUSH];

    for (const channel of notificationChannels) {
      const dto: QueueNotificationDto = {
        channel,
        type: NotificationType.BOOKING_REMINDER,
        userId: data.customerEmail,
        email: data.customerEmail,
        data: data as any,
        delay: 0,
      };

      await this.queueNotification(dto);
    }
  }

  async queueNotification(dto: QueueNotificationDto): Promise<void> {
    const payload: NotificationPayload = {
      channel: dto.channel,
      type: dto.type,
      userId: dto.userId,
      email: dto.email,
      pushToken: dto.pushToken,
      data: dto.data,
    };

    const jobName = `${dto.type}-${dto.channel}-${Date.now()}`;

    await this.notificationQueue.add(jobName, payload, {
      delay: dto.delay,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    });

    this.logger.log(`Queued notification: ${jobName}`);
  }

  async processNotification(payload: NotificationPayload): Promise<void> {
    this.logger.log(`Processing notification: ${payload.type} via ${payload.channel}`);

    switch (payload.channel) {
      case NotificationChannel.EMAIL:
        await this.sendEmail(payload);
        break;
      case NotificationChannel.PUSH:
        await this.sendPush(payload);
        break;
      case NotificationChannel.SMS:
        this.logger.warn('SMS notifications not implemented yet');
        break;
      default:
        this.logger.error(`Unknown notification channel: ${payload.channel}`);
    }
  }

  private async sendEmail(payload: NotificationPayload): Promise<void> {
    if (!payload.email) {
      this.logger.warn('No email address provided for email notification');
      return;
    }

    let template;
    const data = payload.data as BookingNotificationData;

    switch (payload.type) {
      case NotificationType.BOOKING_CONFIRMATION:
        template = getBookingConfirmationEmailTemplate(data);
        break;
      case NotificationType.BOOKING_REMINDER:
        template = getBookingReminderEmailTemplate(data);
        break;
      default:
        this.logger.warn(`No email template for notification type: ${payload.type}`);
        return;
    }

    await this.emailProvider.send({
      to: payload.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  private async sendPush(payload: NotificationPayload): Promise<void> {
    if (!payload.pushToken) {
      this.logger.warn('No push token provided for push notification');
      return;
    }

    let template;
    const data = payload.data as BookingNotificationData;

    switch (payload.type) {
      case NotificationType.BOOKING_CONFIRMATION:
        template = getBookingConfirmationPushTemplate(data);
        break;
      case NotificationType.BOOKING_REMINDER:
        template = getBookingReminderPushTemplate(data);
        break;
      default:
        this.logger.warn(`No push template for notification type: ${payload.type}`);
        return;
    }

    await this.pushProvider.send({
      token: payload.pushToken,
      title: template.title,
      body: template.body,
      data: payload.data,
    });
  }
}
