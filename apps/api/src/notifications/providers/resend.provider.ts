import { Injectable, Inject, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { EmailProvider, EMAIL_PROVIDER } from './email.provider';
import { EmailTemplate } from '../templates/email-templates';

@Injectable()
export class ResendProvider implements EmailProvider {
  private readonly logger = new Logger(ResendProvider.name);
  private readonly resend: Resend;
  private readonly fromEmail: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@planity-clone.com';

    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY not configured - email sending will be mocked');
    }

    this.resend = new Resend(apiKey);
  }

  async send(email: string, template: EmailTemplate): Promise<boolean> {
    try {
      if (!process.env.RESEND_API_KEY) {
        this.logger.log(`[MOCK EMAIL] To: ${email}, Subject: ${template.subject}`);
        return true;
      }

      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      if (error) {
        this.logger.error(`Failed to send email: ${error.message}`);
        return false;
      }

      this.logger.log(`Email sent successfully: ${data?.id}`);
      return true;
    } catch (error) {
      this.logger.error(`Email send error: ${error}`);
      return false;
    }
  }
}

export const ResendProviderFactory = {
  provide: EMAIL_PROVIDER,
  useClass: ResendProvider,
};
