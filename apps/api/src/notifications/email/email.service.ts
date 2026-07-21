import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface EmailProvider {
  send(options: EmailOptions): Promise<void>;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private provider: EmailProvider;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.initializeProvider();
  }

  private initializeProvider(): void {
    const provider = this.configService.get<string>('EMAIL_PROVIDER', 'stub');

    if (provider === 'resend') {
      this.provider = new ResendEmailProvider(this.configService);
    } else if (provider === 'smtp') {
      this.provider = new SmtpEmailProvider(this.configService);
    } else {
      this.provider = new StubEmailProvider(this.logger);
    }
  }

  async send(options: EmailOptions): Promise<void> {
    this.logger.log(`Sending email to ${options.to}: ${options.subject}`);
    await this.provider.send(options);
  }
}

class ResendEmailProvider implements EmailProvider {
  private readonly logger = new Logger(ResendEmailProvider.name);
  private readonly apiKey: string;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('RESEND_API_KEY', '');
    this.from = this.configService.get<string>('EMAIL_FROM', 'Planity <noreply@planity.com>');
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
          from: this.from,
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Resend API error: ${error}`);
      }

      this.logger.log(`Email sent via Resend to ${options.to}`);
    } catch (error) {
      this.logger.error(`Failed to send email via Resend: ${error.message}`);
      throw error;
    }
  }
}

class SmtpEmailProvider implements EmailProvider {
  private readonly logger = new Logger(SmtpEmailProvider.name);

  constructor(private readonly configService: ConfigService) {
    this.logger.warn('SMTP email provider is a stub - implement nodemailer for production');
  }

  async send(options: EmailOptions): Promise<void> {
    this.logger.log(`[STUB] SMTP would send email to ${options.to}: ${options.subject}`);
    // In production, implement with nodemailer:
    // const transporter = nodemailer.createTransport({ ... });
    // await transporter.sendMail({ from, to, subject, html, text });
  }
}

class StubEmailProvider implements EmailProvider {
  constructor(private readonly logger: Logger) {}

  async send(options: EmailOptions): Promise<void> {
    this.logger.log(`[STUB EMAIL] To: ${options.to}`);
    this.logger.log(`[STUB EMAIL] Subject: ${options.subject}`);
    this.logger.debug(`[STUB EMAIL] Body: ${options.text}`);
  }
}
