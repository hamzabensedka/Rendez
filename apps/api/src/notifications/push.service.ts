import { Injectable, Logger } from '@nestjs/common';
import { Expo } from 'expo-server-sdk';

export interface PushNotification {
  to: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);
  private expo: Expo;

  constructor() {
    this.expo = new Expo();
    this.logger.log('Push notification service initialized');
  }

  async sendPush(notification: PushNotification): Promise<boolean> {
    try {
      if (!Expo.isExpoPushToken(notification.to)) {
        this.logger.warn(`Invalid Expo push token: ${notification.to}`);
        return false;
      }

      const messages = [
        {
          to: notification.to,
          sound: 'default',
          title: notification.title,
          body: notification.body,
          data: notification.data,
        },
      ];

      const tickets = await this.expo.sendPushNotificationsAsync(messages);
      this.logger.log(`Push notification sent, ticket ID: ${tickets[0]?.id}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send push notification: ${error.message}`);
      return false;
    }
  }

  async sendBookingConfirmationPush(pushToken: string, data: Record<string, any>): Promise<boolean> {
    return this.sendPush({
      to: pushToken,
      title: 'Booking Confirmed!',
      body: `Your appointment at ${data.businessName} on ${data.dateTime} is confirmed.`,
      data: { type: 'booking_confirmation', appointmentId: data.appointmentId },
    });
  }

  async sendBookingReminderPush(pushToken: string, data: Record<string, any>): Promise<boolean> {
    return this.sendPush({
      to: pushToken,
      title: 'Appointment Reminder',
      body: `Reminder: Your appointment at ${data.businessName} is in ${data.timeUntil}`,
      data: { type: 'booking_reminder', appointmentId: data.appointmentId },
    });
  }
}
