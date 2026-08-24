import { Test } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AdminService', () => {
  let service: AdminService;
  const prisma = {
    appointment: { findMany: jest.fn(), count: jest.fn() },
    business: { findMany: jest.fn(), count: jest.fn() },
    $transaction: jest.fn(async (ops: unknown[]) => Promise.all(ops as never[])),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
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
});
