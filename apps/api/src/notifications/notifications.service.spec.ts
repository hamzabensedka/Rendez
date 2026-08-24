import { ConfigService } from '@nestjs/config';
import { NotificationsService } from './notifications.service';

function makePrisma() {
  return {
    notification: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    appointment: {
      findMany: jest.fn(),
    },
  };
}

function makeConfig(overrides: Record<string, string> = {}) {
  return {
    get: (key: string) => overrides[key],
  } as unknown as ConfigService;
}

describe('NotificationsService', () => {
  it('sends once and marks the row sent', async () => {
    const prisma = makePrisma();
    prisma.notification.findFirst.mockResolvedValue(null);
    prisma.notification.create.mockResolvedValue({ id: 'n-1' });
    prisma.notification.update.mockResolvedValue({});

    const service = new NotificationsService(prisma as never, makeConfig());

    const result = await service.sendOnce({
      userId: 'u-1',
      dedupKey: 'booking-created:a-1',
      type: 'BOOKING_CONFIRMATION',
      toEmail: 'client@example.com',
      subject: 'Confirmed',
      html: '<p>ok</p>',
    });

    expect(result.delivered).toBe(true);
    expect(prisma.notification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ type: 'BOOKING_CONFIRMATION', status: 'pending' }),
      })
    );
    // LogEmailTransport (no RESEND_API_KEY) reports success -> row marked sent.
    expect(prisma.notification.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: 'sent', sentAt: expect.any(Date) } })
    );
  });

  it('is idempotent per dedupKey — no second send', async () => {
    const prisma = makePrisma();
    prisma.notification.findFirst.mockResolvedValueOnce({ id: 'n-existing', status: 'sent' });

    const service = new NotificationsService(prisma as never, makeConfig());

    const result = await service.sendOnce({
      userId: 'u-1',
      dedupKey: 'reminder24h:a-1',
      type: 'APPOINTMENT_REMINDER',
      toEmail: 'client@example.com',
      subject: 'Reminder',
      html: '<p>soon</p>',
    });

    expect(result).toEqual({ id: 'n-existing', delivered: true });
    expect(prisma.notification.create).not.toHaveBeenCalled();
    expect(prisma.notification.update).not.toHaveBeenCalled();
  });

  it('marks failed when there is no recipient email, without throwing', async () => {
    const prisma = makePrisma();
    prisma.notification.findFirst.mockResolvedValue(null);
    prisma.notification.create.mockResolvedValue({ id: 'n-2' });
    prisma.notification.update.mockResolvedValue({});

    const service = new NotificationsService(prisma as never, makeConfig());

    const result = await service.sendOnce({
      userId: 'u-1',
      dedupKey: 'booking-cancelled:a-2',
      type: 'BOOKING_CANCELLED',
      toEmail: null,
      subject: 'Cancelled',
      html: '<p>bye</p>',
    });

    expect(result.delivered).toBe(false);
    expect(prisma.notification.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: 'failed', sentAt: null } })
    );
  });
});

describe('ReminderScheduler candidates', () => {
  it('selects only BOOKED appointments within the next 24h window', async () => {
    const { ReminderScheduler } = await import('./reminder.scheduler');
    const prisma = makePrisma();
    prisma.appointment.findMany.mockResolvedValue([
      {
        id: 'a-1',
        clientUserId: 'u-1',
        startAtUtc: new Date('2026-09-01T10:00:00Z'),
        clientUser: { email: 'c@x.com' },
        business: { name: 'Biz' },
      },
    ]);

    const scheduler = new ReminderScheduler(
      prisma as never,
      {} as never,
      makeConfig({ REMINDER_SCHEDULER: 'off' })
    );

    const now = new Date('2026-08-31T09:00:00Z');
    const candidates = await scheduler.findReminderCandidates(now);

    expect(candidates).toHaveLength(1);
    const whereArg = prisma.appointment.findMany.mock.calls[0][0];
    expect(whereArg.where.status).toBe('BOOKED');
    expect(whereArg.where.startAtUtc.gte.toISOString()).toBe(now.toISOString());
    expect(whereArg.where.startAtUtc.lte.getTime() - now.getTime()).toBe(24 * 3_600_000);
  });

  it('scanOnce sends a deduped reminder and tolerates transport errors', async () => {
    const { ReminderScheduler } = await import('./reminder.scheduler');
    const prisma = makePrisma();
    prisma.appointment.findMany.mockResolvedValue([]);
    prisma.notification.findFirst.mockResolvedValue(null);

    const notifications = {
      sendOnce: jest.fn().mockRejectedValue(new Error('transport down')),
    };
    const scheduler = new ReminderScheduler(
      prisma as never,
      notifications as never,
      makeConfig({ REMINDER_SCHEDULER: 'off' })
    );
    prisma.appointment.findMany.mockReturnValue(
      Promise.resolve([
        {
          id: 'a-9',
          clientUserId: 'u-9',
          startAtUtc: new Date('2026-09-01T10:00:00Z'),
          clientUser: { email: 'z@x.com' },
          business: { name: 'Biz' },
        },
      ]) as never
    );

    const result = await scheduler.scanOnce(new Date('2026-08-31T12:00:00Z'));

    expect(result.scanned).toBe(1);
    expect(result.sent).toBe(0);
  });
});
