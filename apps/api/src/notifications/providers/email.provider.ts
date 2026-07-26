import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailProvider {
  send(options: EmailOptions): Promise<void>;
}

@Injectable()
export class ResendEmailProvider implements EmailProvider {
  private readonly logger = new Logger(ResendEmailProvider.name);
  private readonly apiKey: string;
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('RESEND_API_KEY', 're_test_key');
    this.fromEmail = this.configService.get<string>('EMAIL_FROM', 'Planity <noreply@planity.com>');
  }

  async send(options: EmailOptions): Promise<void> {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.fromEmail,
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Resend API error: ${response.status} - ${error}`);
      }

      this.logger.log(`Email sent successfully to ${options.to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}`, error);
      throw error;
    }
  }
}

@Injectable()
export class StubEmailProvider implements EmailProvider {
  private readonly logger = new Logger(StubEmailProvider.name);

  async send(options: EmailOptions): Promise<void> {
    this.logger.log(`[STUB EMAIL] To: ${options.to}, Subject: ${options.subject}`);
    this.logger.debug(`[STUB EMAIL] HTML Content: ${options.html.substring(0, 200)}...`);
  }
}

export const EMAIL_PROVIDER = 'EMAIL_PROVIDER';
