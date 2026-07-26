import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface PushOptions {
  token: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

export interface PushProvider {
  send(options: PushOptions): Promise<void>;
}

@Injectable()
export class ExpoPushProvider implements PushProvider {
  private readonly logger = new Logger(ExpoPushProvider.name);
  private readonly accessToken: string;

  constructor(private readonly configService: ConfigService) {
    this.accessToken = this.configService.get<string>('EXPO_ACCESS_TOKEN', '');
  }

  async send(options: PushOptions): Promise<void> {
    try {
      const payload = {
        to: options.token,
        title: options.title,
        body: options.body,
        data: options.data,
        sound: 'default',
      };

      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(this.accessToken && { 'Authorization': `Bearer ${this.accessToken}` }),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Expo Push error: ${response.status} - ${error}`);
      }

      this.logger.log(`Push notification sent to token: ${options.token.substring(0, 20)}...`);
    } catch (error) {
      this.logger.error(`Failed to send push notification`, error);
      throw error;
    }
  }
}

@Injectable()
export class StubPushProvider implements PushProvider {
  private readonly logger = new Logger(StubPushProvider.name);

  async send(options: PushOptions): Promise<void> {
    this.logger.log(`[STUB PUSH] Token: ${options.token.substring(0, 20)}...`);
    this.logger.log(`[STUB PUSH] Title: ${options.title}, Body: ${options.body}`);
  }
}

export const PUSH_PROVIDER = 'PUSH_PROVIDER';
