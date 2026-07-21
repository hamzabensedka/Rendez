import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { NotificationPayload, EmailData, PushData } from './interfaces/notification.interface';
import { NotificationChannel, NotificationType } from './notification-channel.enum';
import { EmailProvider, ResendEmailProvider, StubEmailProvider } from './providers/email.provider';
import { PushProvider, ExpoPushProvider, StubPushProvider } from './providers/push.provider';
import { ConfigService } from '@nestjs/config';
import {
  getBookingConfirmationEmailTemplate,
  getBookingReminderEmailTemplate,
  getBookingCancellationEmailTemplate,
} from './templates';
import { BookingNotificationData } from './interfaces/notification.interface';

@Processor('notifications')
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);
  private readonly emailProvider: EmailProvider;
  private readonly pushProvider: PushProvider;

  constructor(private readonly configService: ConfigService) {
    super();
    
    // Use real providers if configured, otherwise use stubs
    const resendApiKey = this.configService.get<string>('RESEND_API_KEY');
    const expoAccessToken = this.configService.get<string>('EXPO_ACCESS_TOKEN');

    this.emailProvider = resendApiKey
      ? new ResendEmailProvider(configService)
      : new StubEmailProvider();

    this.pushProvider = expoAccessToken
      ? new ExpoPushProvider(configService)
      : new StubPushProvider();
  }

  async process(job: Job<NotificationPayload | { type: NotificationType; data: BookingNotificationData; appointmentId?: string }>): Promise<void> {
    this.logger.log(`Processing notification job ${job.id}, name: ${job.name}`);

    // Handle scheduled booking reminders
    if (job.name === 'booking-reminder') {
      const reminderJob = job.data as { type: NotificationType; data: BookingNotificationData; appointmentId: string };
      await this.sendBookingReminderNotification(reminderJob.data);
      return;
    }

    const payload = job.data as NotificationPayload;

    switch (payload.channel) {
      case NotificationChannel.EMAIL:
        await this.sendEmail(payload);
        break;
      case NotificationChannel.PUSH:
        await this.sendPush(payload);
        break;
      default:
        this.logger.warn(`Unsupported notification channel: ${payload.channel}`);
    }
  }

  private async sendEmail(payload: NotificationPayload): Promise<void> {
    if (!payload.recipientEmail) {
      this.logger.error('No recipient email provided');
      return;
    }

    const emailData: EmailData = {
      to: payload.recipientEmail,
      subject: payload.data.subject || `Notification from Planity Clone`,
      html: payload.data.html || '',
      text: payload.data.text || '',
    };

    await this.emailProvider.send(emailData);
    this.logger.log(`Email sent to ${payload.recipientEmail} for ${payload.type}`);
  }

  private async sendPush(payload: NotificationPayload): Promise<void> {
    if (!payload.recipientPushToken) {
      this.logger.error('No push token provided');
      return;
    }

    const pushData: PushData = {
      token: payload.recipientPushToken,
      title: payload.data.title || 'Planity Clone',
      body: payload.data.body || '',
      data: payload.data,
    };

    await this.pushProvider.send(pushData);
    this.logger.log(`Push notification sent to ${payload.recipientPushToken} for ${payload.type}`);
  }

  private async sendBookingReminderNotification(data: BookingNotificationData): Promise<void> {
    const emailTemplate = getBookingReminderEmailTemplate(data);

    const emailData: EmailData = {
      to: data.userEmail,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    };

    await this.emailProvider.send(emailData);
    this.logger.log(`Booking reminder sent to ${data.userEmail} for appointment ${data.appointmentId}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Notification job ${job.id} completed successfully`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Notification job ${job.id} failed: ${error.message}`);
  }
}
