import { Injectable, Logger } from '@nestjs/common';
import { NotificationChannel, NotificationType } from './notification-channel.enum';
import { SendNotificationDto, BookingNotificationData } from './dto/send-notification.dto';
import { EmailService } from './email/email.service';
import { PushService } from './push/push.service';
import { getBookingConfirmationTemplate, getBookingReminderTemplate } from './templates';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly pushService: PushService,
  ) {}

  async sendNotification(dto: SendNotificationDto): Promise<void> {
    this.logger.log(`Sending ${dto.type} notification via ${dto.channel} to user ${dto.userId}`);

    switch (dto.channel) {
      case NotificationChannel.EMAIL:
        await this.sendEmailNotification(dto);
        break;
      case NotificationChannel.PUSH:
        await this.sendPushNotification(dto);
        break;
      default:
        this.logger.warn(`Unsupported channel: ${dto.channel}`);
    }
  }

  private async sendEmailNotification(dto: SendNotificationDto): Promise<void> {
    const template = this.getEmailTemplate(dto.type, dto.data as BookingNotificationData);

    await this.emailService.send({
      to: dto.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  private async sendPushNotification(dto: SendNotificationDto): Promise<void> {
    if (!dto.pushToken) {
      this.logger.warn(`No push token provided for user ${dto.userId}`);
      return;
    }

    const { title, body, data } = this.getPushContent(dto.type, dto.data as BookingNotificationData);

    await this.pushService.send({
      token: dto.pushToken,
      title,
      body,
      data,
    });
  }

  private getEmailTemplate(type: NotificationType, data: BookingNotificationData) {
    switch (type) {
      case NotificationType.BOOKING_CONFIRMATION:
        return getBookingConfirmationTemplate(data);
      case NotificationType.BOOKING_REMINDER:
        return getBookingReminderTemplate(data);
      default:
        throw new Error(`Unsupported notification type for email: ${type}`);
    }
  }

  private getPushContent(type: NotificationType, data: BookingNotificationData) {
    switch (type) {
      case NotificationType.BOOKING_CONFIRMATION:
        return {
          title: 'Booking Confirmed ✓',
          body: `Your appointment for ${data.serviceName} at ${data.businessName} is confirmed for ${data.appointmentDate} at ${data.appointmentTime}.`,
          data: { type: NotificationType.BOOKING_CONFIRMATION, appointmentId: data.serviceName },
        };
      case NotificationType.BOOKING_REMINDER:
        return {
          title: '⏰ Appointment Tomorrow',
          body: `Reminder: ${data.serviceName} at ${data.businessName} tomorrow at ${data.appointmentTime}.`,
          data: { type: NotificationType.BOOKING_REMINDER },
        };
      default:
        return {
          title: 'Planity Notification',
          body: 'You have a new notification.',
          data: { type },
        };
    }
  }

  async sendBookingConfirmation(
    email: string,
    pushToken: string | undefined,
    userId: number,
    data: BookingNotificationData,
  ): Promise<void> {
    const tasks: Promise<void>[] = [];

    tasks.push(
      this.sendNotification({
        channel: NotificationChannel.EMAIL,
        type: NotificationType.BOOKING_CONFIRMATION,
        email,
        userId,
        data,
      }),
    );

    if (pushToken) {
      tasks.push(
        this.sendNotification({
          channel: NotificationChannel.PUSH,
          type: NotificationType.BOOKING_CONFIRMATION,
          email,
          pushToken,
          userId,
          data,
        }),
      );
    }

    await Promise.all(tasks);
  }

  async sendBookingReminder(
    email: string,
    pushToken: string | undefined,
    userId: number,
    data: BookingNotificationData,
  ): Promise<void> {
    const tasks: Promise<void>[] = [];

    tasks.push(
      this.sendNotification({
        channel: NotificationChannel.EMAIL,
        type: NotificationType.BOOKING_REMINDER,
        email,
        userId,
        data,
      }),
    );

    if (pushToken) {
      tasks.push(
        this.sendNotification({
          channel: NotificationChannel.PUSH,
          type: NotificationType.BOOKING_REMINDER,
          email,
          pushToken,
          userId,
          data,
        }),
      );
    }

    await Promise.all(tasks);
  }
}
