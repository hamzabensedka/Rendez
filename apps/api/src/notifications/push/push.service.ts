import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface PushNotificationOptions {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

export interface PushProvider {
  send(options: PushNotificationOptions): Promise<void>;
}

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);
  private provider: PushProvider;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.initializeProvider();
  }

  private initializeProvider(): void {
    const provider = this.configService.get<string>('PUSH_PROVIDER', 'stub');

    if (provider === 'expo') {
      this.provider = new ExpoPushProvider(this.configService, this.logger);
    } else {
      this.provider = new StubPushProvider(this.logger);
    }
  }

  async send(options: PushNotificationOptions): Promise<void> {
    this.logger.log(`Sending push notification to token: ${options.token.substring(0, 10)}...`);
    await this.provider.send(options);
  }
}

class ExpoPushProvider implements PushProvider {
  private readonly logger: Logger;
  private readonly accessToken: string;

  constructor(
    private readonly configService: ConfigService,
    logger: Logger,
  ) {
    this.logger = logger;
    this.accessToken = this.configService.get<string>('EXPO_ACCESS_TOKEN', '');
  }

  async send(options: PushNotificationOptions): Promise<void> {
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

      const result = await response.json();

      if (result.errors) {
        throw new Error(`Expo push error: ${JSON.stringify(result.errors)}`);
      }

      this.logger.log(`Push notification sent via Expo to ${options.token.substring(0, 10)}...`);
    } catch (error) {
      this.logger.error(`Failed to send push notification: ${error.message}`);
      throw error;
    }
  }
}

class StubPushProvider implements PushProvider {
  constructor(private readonly logger: Logger) {}

  async send(options: PushNotificationOptions): Promise<void> {
    this.logger.log(`[STUB PUSH] To: ${options.token.substring(0, 10)}...`);
    this.logger.log(`[STUB PUSH] Title: ${options.title}`);
    this.logger.log(`[STUB PUSH] Body: ${options.body}`);
  }
}
