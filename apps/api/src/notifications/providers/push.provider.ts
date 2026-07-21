import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PushData } from '../interfaces/notification.interface';

export interface PushProvider {
  send(push: PushData): Promise<void>;
}

@Injectable()
export class ExpoPushProvider implements PushProvider {
  private readonly logger = new Logger(ExpoPushProvider.name);
  private readonly accessToken: string;

  constructor(private readonly configService: ConfigService) {
    this.accessToken = this.configService.get<string>('EXPO_ACCESS_TOKEN') || '';
  }

  async send(push: PushData): Promise<void> {
    if (!this.accessToken) {
      this.logger.warn('EXPO_ACCESS_TOKEN not configured, skipping push notification');
      return;
    }

    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: push.token,
          title: push.title,
          body: push.body,
          data: push.data,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Expo API error: ${response.status} - ${error}`);
      }

      this.logger.log(`Push notification sent successfully to ${push.token}`);
    } catch (error) {
      this.logger.error(`Failed to send push notification:`, error);
      throw error;
    }
  }
}

@Injectable()
export class StubPushProvider implements PushProvider {
  private readonly logger = new Logger(StubPushProvider.name);

  async send(push: PushData): Promise<void> {
    this.logger.log(`[STUB] Push notification would be sent to ${push.token}`);
    this.logger.log(`[STUB] Title: ${push.title}`);
    this.logger.log(`[STUB] Body: ${push.body}`);
  }
}
