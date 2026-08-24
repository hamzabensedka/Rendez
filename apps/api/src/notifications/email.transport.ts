import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface OutboundEmail {
  to: string;
  subject: string;
  html: string;
}

export interface EmailTransport {
  send(email: OutboundEmail): Promise<{ delivered: boolean; info?: string }>;
}

/**
 * Production transport: Resend HTTP API (no SDK dependency — plain fetch).
 */
@Injectable()
export class ResendEmailTransport implements EmailTransport {
  private readonly logger = new Logger(ResendEmailTransport.name);
  private readonly apiKey: string;
  private readonly from: string;

  constructor(config: ConfigService) {
    this.apiKey = config.get<string>('RESEND_API_KEY') ?? '';
    this.from = config.get<string>('NOTIFICATIONS_FROM_EMAIL') ?? 'bookings@planity.app';
  }

  async send(email: OutboundEmail): Promise<{ delivered: boolean; info?: string }> {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.from,
          to: [email.to],
          subject: email.subject,
          html: email.html,
        }),
      });
      if (!response.ok) {
        const body = await response.text();
        this.logger.warn(`Resend responded ${response.status}: ${body.slice(0, 200)}`);
        return { delivered: false, info: `resend_${response.status}` };
      }
      return { delivered: true };
    } catch (err) {
      this.logger.warn(`Resend request failed: ${String(err)}`);
      return { delivered: false, info: 'resend_request_failed' };
    }
  }
}

/**
 * Development/default transport: logs the email and reports success so the
 * pipeline is fully exercisable without external services.
 */
@Injectable()
export class LogEmailTransport implements EmailTransport {
  private readonly logger = new Logger(LogEmailTransport.name);

  async send(email: OutboundEmail): Promise<{ delivered: boolean; info?: string }> {
    this.logger.log(
      `[email:no-op] to=${email.to} subject="${email.subject}" (${email.html.length} bytes)`
    );
    return { delivered: true, info: 'logged' };
  }
}

export function createEmailTransport(config: ConfigService): EmailTransport {
  if (config.get<string>('RESEND_API_KEY')) {
    return new ResendEmailTransport(config);
  }
  return new LogEmailTransport();
}
