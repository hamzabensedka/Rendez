import { Injectable, Logger } from '@nestjs/common';
import { Expo } from 'expo-server-sdk';

export interface PushProvider {
  send(token: string, title: string, body: string, data?: Record<string, any>): Promise<boolean>;
}

@Injectable()
export class ExpoPushProvider implements PushProvider {
  private readonly logger = new Logger(ExpoPushProvider.name);
  private readonly expo: Expo;

  constructor() {
    this.expo = new Expo();
  }

  async send(
    token: string,
    title: string,
    body: string,
    data?: Record<string, any>,
  ): Promise<boolean> {
    try {
      const isValidToken = Expo.isExponentPushToken(token);
      
      if (!isValidToken) {
        this.logger.warn(`Invalid push token: ${token}`);
        return false;
      }

      const messages = [
        {
          to: token,
          sound: 'default',
          title,
          body,
          data,
        },
      ];

      const chunks = this.expo.chunkPushNotifications(messages);
      const tickets = [];

      for (const chunk of chunks) {
        try {
          const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          this.logger.error(`Chunk send error: ${error}`);
        }
      }

      const failureCount = tickets.filter((t) => t.status === 'error').length;
      if (failureCount > 0) {
        this.logger.warn(`${failureCount} push notifications failed`);
        return false;
      }

      this.logger.log('Push notification sent successfully');
      return true;
    } catch (error) {
      this.logger.error(`Push send error: ${error}`);
      return false;
    }
  }
}

export const PUSH_PROVIDER = 'PUSH_PROVIDER';

export const ExpoPushProviderFactory = {
  provide: PUSH_PROVIDER,
  useClass: ExpoPushProvider,
};
