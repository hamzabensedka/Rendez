import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { createEmailTransport, EmailTransport, OutboundEmail } from './email.transport';

export interface NotificationInput {
  userId: string;
  /** Idempotency key, unique per business event (e.g. `reminder24h:{appointmentId}`). */
  dedupKey: string;
  type: string;
  toEmail?: string | null;
  subject: string;
  html: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly transport: EmailTransport;

  constructor(
    private readonly prisma: PrismaService,
    config: ConfigService
  ) {
    this.transport = createEmailTransport(config);
  }

  /**
   * Send-once semantics: the dedupKey is stored inside payloadJson; a prior
   * notification with the same key short-circuits the send. Transport failures
   * mark the row `failed` and never propagate to the caller.
   */
  async sendOnce(input: NotificationInput): Promise<{ id: string; delivered: boolean }> {
    const existing = await this.prisma.notification.findFirst({
      where: {
        type: input.type,
        payloadJson: { path: ['dedupKey'], equals: input.dedupKey },
      },
      select: { id: true, status: true },
    });
    if (existing) {
      return { id: existing.id, delivered: existing.status === 'sent' };
    }

    const record = await this.prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        channel: 'EMAIL',
        status: 'pending',
        payloadJson: {
          dedupKey: input.dedupKey,
          to: input.toEmail ?? null,
          subject: input.subject,
        },
      },
      select: { id: true },
    });

    if (!input.toEmail) {
      await this.mark(record.id, 'failed', 'no_recipient_email');
      return { id: record.id, delivered: false };
    }

    const email: OutboundEmail = {
      to: input.toEmail,
      subject: input.subject,
      html: input.html,
    };
    try {
      const result = await this.transport.send(email);
      await this.mark(record.id, result.delivered ? 'sent' : 'failed', result.info);
      return { id: record.id, delivered: result.delivered };
    } catch (err) {
      this.logger.warn(`Transport threw for ${input.dedupKey}: ${String(err)}`);
      await this.mark(record.id, 'failed', 'transport_exception');
      return { id: record.id, delivered: false };
    }
  }

  private async mark(id: string, status: 'sent' | 'failed', info?: string): Promise<void> {
    if (info) this.logger.debug(`Notification ${id} -> ${status} (${info})`);
    try {
      await this.prisma.notification.update({
        where: { id },
        data: { status, sentAt: status === 'sent' ? new Date() : null },
      });
    } catch (err) {
      this.logger.warn(`Could not update notification ${id}: ${String(err)}`);
    }
  }
}
