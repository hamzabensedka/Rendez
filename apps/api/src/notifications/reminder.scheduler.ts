import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from './notifications.service';

const SCAN_INTERVAL_MS = 60_000;
const REMINDER_WINDOW_HOURS = 24;

export interface ReminderCandidate {
  id: string;
  clientUserId: string;
  clientEmail: string | null;
  startAtUtc: Date;
  businessName: string;
}

/**
 * Scans for BOOKED appointments starting within the reminder window and sends
 * one reminder per appointment (idempotent via dedupKey). Replaces the deleted
 * BullMQ stub; the scheduler interface here is queue-shaped so a BullMQ driver
 * can replace the interval at Dockerization time without touching callers.
 */
@Injectable()
export class ReminderScheduler implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ReminderScheduler.name);
  private timer: ReturnType<typeof setInterval> | null = null;
  private running = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    config: ConfigService
  ) {
    if (config.get<string>('REMINDER_SCHEDULER') === 'off') {
      this.logger.log('Reminder scheduler disabled (REMINDER_SCHEDULER=off).');
      this.timer = null;
    }
  }

  onModuleInit(): void {
    if (this.timer !== null || process.env.REMINDER_SCHEDULER === 'off') return;
    // First scan shortly after boot, then every minute.
    this.timer = setInterval(() => void this.scanOnce(), SCAN_INTERVAL_MS);
    this.timer.unref?.();
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  /** BOOKED appointments starting inside [now, now + 24h]. Exposed for tests. */
  async findReminderCandidates(now: Date): Promise<ReminderCandidate[]> {
    const until = new Date(now.getTime() + REMINDER_WINDOW_HOURS * 3_600_000);
    const rows = await this.prisma.appointment.findMany({
      where: {
        status: 'BOOKED',
        startAtUtc: { gte: now, lte: until },
      },
      select: {
        id: true,
        clientUserId: true,
        startAtUtc: true,
        clientUser: { select: { email: true } },
        business: { select: { name: true } },
      },
      take: 500,
    });
    return rows.map((row) => ({
      id: row.id,
      clientUserId: row.clientUserId,
      clientEmail: row.clientUser?.email ?? null,
      startAtUtc: row.startAtUtc,
      businessName: row.business?.name ?? 'your salon',
    }));
  }

  async scanOnce(now = new Date()): Promise<{ scanned: number; sent: number }> {
    if (this.running) return { scanned: 0, sent: 0 };
    this.running = true;
    try {
      const candidates = await this.findReminderCandidates(now);
      let sent = 0;
      for (const candidate of candidates) {
        // One bad recipient must never abort the remaining reminders.
        try {
          const result = await this.notifications.sendOnce({
            userId: candidate.clientUserId,
            dedupKey: `reminder24h:${candidate.id}`,
            type: 'APPOINTMENT_REMINDER',
            toEmail: candidate.clientEmail,
            subject: `Reminder — ${candidate.businessName}`,
            html: `<p>See you soon at <strong>${candidate.businessName}</strong> on ${candidate.startAtUtc.toISOString()}.</p>`,
          });
          if (result.delivered) sent += 1;
        } catch (err) {
          this.logger.warn(`Reminder ${candidate.id} failed: ${String(err)}`);
        }
      }
      if (candidates.length > 0) {
        this.logger.log(`Reminder scan: ${sent}/${candidates.length} sent.`);
      }
      return { scanned: candidates.length, sent };
    } catch (err) {
      this.logger.warn(`Reminder scan failed: ${String(err)}`);
      return { scanned: 0, sent: 0 };
    } finally {
      this.running = false;
    }
  }
}
