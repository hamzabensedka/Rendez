import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailData } from '../interfaces/notification.interface';

export interface EmailProvider {
  send(email: EmailData): Promise<void>;
}

@Injectable()
export class ResendEmailProvider implements EmailProvider {
  private readonly logger = new Logger(ResendEmailProvider.name);
  private readonly apiKey: string;
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('RESEND_API_KEY') || '';
    this.fromEmail = this.configService.get<string>('EMAIL_FROM') || 'noreply@planity-clone.com';
  }

  async send(email: EmailData): Promise<void> {
    if (!this.apiKey) {
      this.logger.warn('RESEND_API_KEY not configured, skipping email send');
      return;
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.fromEmail,
          to: email.to,
          subject: email.subject,
          html: email.html,
          text: email.text,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Resend API error: ${response.status} - ${error}`);
      }

      this.logger.log(`Email sent successfully to ${email.to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${email.to}:`, error);
      throw error;
    }
  }
}

@Injectable()
export class StubEmailProvider implements EmailProvider {
  private readonly logger = new Logger(StubEmailProvider.name);

  async send(email: EmailData): Promise<void> {
    this.logger.log(`[STUB] Email would be sent to ${email.to}`);
    this.logger.log(`[STUB] Subject: ${email.subject}`);
    this.logger.debug(`[STUB] Body: ${email.text?.substring(0, 100)}...`);
  }
}
