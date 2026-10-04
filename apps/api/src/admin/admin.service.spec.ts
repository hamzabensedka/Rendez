import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BillingPlanStatus } from '@prisma/client';
import { AdminService } from './admin.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AdminService', () => {
  let service: AdminService;
  const prisma = {
    appointment: { findMany: jest.fn(), count: jest.fn() },
    business: { findMany: jest.fn(), count: jest.fn(), findFirst: jest.fn() },
    subscription: { findUnique: jest.fn(), upsert: jest.fn(), update: jest.fn() },
    subscriptionInvoice: { create: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    // Supports both array form ($transaction([p1,p2])) and callback form ($transaction(tx => ...)).
    prisma.$transaction.mockImplementation(
      async (ops: unknown): Promise<unknown> =>
        typeof ops === 'function'
          ? (ops as (p: typeof prisma) => unknown)(prisma)
          : Promise.all(ops as never[])
    );
    const moduleRef = await Test.createTestingModule({
      providers: [AdminService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = moduleRef.get(AdminService);
  });

  it('lists appointments paginated with clamped limit', async () => {
    prisma.appointment.findMany.mockResolvedValue([]);
    prisma.appointment.count.mockResolvedValue(0);

    await service.listAppointments({ page: 2, limit: 500 });

    expect(prisma.appointment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 100, skip: 100 })
    );
  });

  it('applies businessId/status/date filters', async () => {
    prisma.appointment.findMany.mockResolvedValue([]);
    prisma.appointment.count.mockResolvedValue(0);

    await service.listAppointments({
      businessId: 'biz-1',
      status: 'BOOKED',
      from: '2026-09-01T00:00:00Z',
      to: '2026-09-30T23:59:59Z',
    });

    const arg = prisma.appointment.findMany.mock.calls[0][0];
    expect(arg.where.businessId).toBe('biz-1');
    expect(arg.where.status).toBe('BOOKED');
    expect(arg.where.startAtUtc.gte).toBeDefined();
    expect(arg.where.startAtUtc.lte).toBeDefined();
  });

  it('lists businesses including non-active rows, newest first', async () => {
    prisma.business.findMany.mockResolvedValue([]);
    prisma.business.count.mockResolvedValue(0);

    await service.listBusinesses(1, 10);

    expect(prisma.business.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { createdAt: 'desc' },
        take: 10,
      })
    );
  });

  describe('salon billing', () => {
    it('updateSubscription upserts and stamps suspendedAt when SUSPENDED', async () => {
      prisma.business.findFirst.mockResolvedValue({ id: 'biz-1' });
      prisma.subscription.upsert.mockResolvedValue({ id: 'sub-1' });

      await service.updateSubscription('biz-1', { planStatus: BillingPlanStatus.SUSPENDED });

      const arg = prisma.subscription.upsert.mock.calls[0][0];
      expect(arg.where).toEqual({ businessId: 'biz-1' });
      expect(arg.update.planStatus).toBe(BillingPlanStatus.SUSPENDED);
      expect(arg.update.suspendedAt).toBeInstanceOf(Date);
    });

    it('updateSubscription clears suspendedAt when reactivating', async () => {
      prisma.business.findFirst.mockResolvedValue({ id: 'biz-1' });
      prisma.subscription.upsert.mockResolvedValue({ id: 'sub-1' });

      await service.updateSubscription('biz-1', { planStatus: BillingPlanStatus.ACTIVE });

      expect(prisma.subscription.upsert.mock.calls[0][0].update.suspendedAt).toBeNull();
    });

    it('updateSubscription throws NotFound when business missing', async () => {
      prisma.business.findFirst.mockResolvedValue(null);
      await expect(
        service.updateSubscription('nope', { planStatus: BillingPlanStatus.ACTIVE })
      ).rejects.toThrow(NotFoundException);
    });

    it('markInvoicePaid marks paid and reactivates the subscription', async () => {
      prisma.subscriptionInvoice.findUnique.mockResolvedValue({
        id: 'inv-1',
        subscriptionId: 'sub-1',
        periodEnd: new Date('2026-12-01T00:00:00Z'),
        subscription: { id: 'sub-1' },
      });
      prisma.subscriptionInvoice.update.mockResolvedValue({ id: 'inv-1', status: 'paid' });
      prisma.subscription.update.mockResolvedValue({ id: 'sub-1', planStatus: 'ACTIVE' });

      await service.markInvoicePaid('inv-1', { method: 'transfer', reference: 'TRX-123' });

      const subArg = prisma.subscription.update.mock.calls[0][0];
      expect(subArg.data.planStatus).toBe(BillingPlanStatus.ACTIVE);
      expect(subArg.data.suspendedAt).toBeNull();
      expect(subArg.data.graceEndsAt).toBeNull();
      const invArg = prisma.subscriptionInvoice.update.mock.calls[0][0];
      expect(invArg.data.status).toBe('paid');
      expect(invArg.data.method).toBe('transfer');
    });

    it('markInvoicePaid throws NotFound for unknown invoice', async () => {
      prisma.subscriptionInvoice.findUnique.mockResolvedValue(null);
      await expect(service.markInvoicePaid('nope', {})).rejects.toThrow(NotFoundException);
    });
  });
});
