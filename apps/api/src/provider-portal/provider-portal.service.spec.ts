import { Test } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ProviderPortalService } from './provider-portal.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@planity/shared';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';

const owner: AuthenticatedUser = {
  id: 'owner-user',
  email: 'o@x.com',
  name: 'Owner',
  role: UserRole.PROVIDER_OWNER,
  status: 'active',
};
const biz = 'biz-1';

function makePrisma() {
  const prisma = {
    provider: { findFirst: jest.fn() },
    staff: { findFirst: jest.fn(), findMany: jest.fn(), create: jest.fn(), updateMany: jest.fn() },
    availabilityRule: { findMany: jest.fn(), deleteMany: jest.fn(), createMany: jest.fn() },
    timeOff: { findMany: jest.fn(), create: jest.fn(), deleteMany: jest.fn() },
    appointment: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      updateMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };
  return prisma;
}

describe('ProviderPortalService', () => {
  let service: ProviderPortalService;
  let prisma: ReturnType<typeof makePrisma>;

  beforeEach(async () => {
    prisma = makePrisma();
    // Support both $transaction forms: interactive callbacks and array batches.
    (prisma.$transaction as jest.Mock).mockImplementation(async (arg: unknown) => {
      if (typeof arg === 'function') {
        return (arg as (tx: typeof prisma) => unknown)(prisma);
      }
      return Promise.all(arg as Promise<unknown>[]);
    });

    const moduleRef = await Test.createTestingModule({
      providers: [ProviderPortalService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = moduleRef.get(ProviderPortalService);
  });

  describe('membership guard', () => {
    it('forbids providers of other businesses', async () => {
      prisma.provider.findFirst.mockResolvedValue(null);

      await expect(service.listStaff(owner, biz)).rejects.toThrow(ForbiddenException);
    });

    it('allows members', async () => {
      prisma.provider.findFirst.mockResolvedValue({ id: 'prov-1' });
      prisma.staff.findMany.mockResolvedValue([]);

      await expect(service.listStaff(owner, biz)).resolves.toEqual([]);
    });
  });

  describe('availability rules', () => {
    const validDto = {
      staffId: 'staff-1',
      rules: [
        { dayOfWeek: 1, startTimeLocal: '09:00', endTimeLocal: '17:00' },
        { dayOfWeek: 3, startTimeLocal: '10:00', endTimeLocal: '18:30' },
      ],
    };

    it('replaces the rule set for (business, staff) in a transaction', async () => {
      prisma.provider.findFirst.mockResolvedValue({ id: 'prov-1' });
      prisma.staff.findFirst.mockResolvedValue({ id: 'staff-1' });
      prisma.availabilityRule.deleteMany.mockResolvedValue({ count: 2 });
      prisma.availabilityRule.createMany.mockResolvedValue({ count: 2 });

      const result = await service.replaceAvailabilityRules(owner, biz, validDto);

      expect(prisma.availabilityRule.deleteMany).toHaveBeenCalledWith({
        where: { businessId: biz, staffId: 'staff-1' },
      });
      expect(result).toEqual({ created: 2 });
    });

    it('rejects rules referencing staff from another business', async () => {
      prisma.provider.findFirst.mockResolvedValue({ id: 'prov-1' });
      prisma.staff.findFirst.mockResolvedValue(null);

      await expect(service.replaceAvailabilityRules(owner, biz, validDto)).rejects.toThrow(
        BadRequestException
      );
    });

    it('supports clearing all business-wide rules with an empty array', async () => {
      prisma.provider.findFirst.mockResolvedValue({ id: 'prov-1' });
      prisma.availabilityRule.deleteMany.mockResolvedValue({ count: 5 });

      await expect(service.replaceAvailabilityRules(owner, biz, { rules: [] })).resolves.toEqual({
        created: 0,
      });
      expect(prisma.availabilityRule.createMany).not.toHaveBeenCalled();
    });
  });

  describe('time off', () => {
    it('creates time off with start before end enforced', async () => {
      prisma.provider.findFirst.mockResolvedValue({ id: 'prov-1' });
      prisma.timeOff.create.mockResolvedValue({ id: 'to-1' });

      await service.createTimeOff(owner, biz, {
        startAtUtc: '2026-09-01T09:00:00Z',
        endAtUtc: '2026-09-01T17:00:00Z',
        reason: 'holiday',
      });

      expect(prisma.timeOff.create).toHaveBeenCalled();
    });

    it('rejects inverted ranges', async () => {
      prisma.provider.findFirst.mockResolvedValue({ id: 'prov-1' });

      await expect(
        service.createTimeOff(owner, biz, {
          startAtUtc: '2026-09-01T17:00:00Z',
          endAtUtc: '2026-09-01T09:00:00Z',
        })
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('staff', () => {
    it('creates staff scoped to the owned business', async () => {
      prisma.provider.findFirst.mockResolvedValue({ id: 'prov-1' });
      prisma.staff.create.mockResolvedValue({ id: 's-1', name: 'Alex' });

      await service.createStaff(owner, biz, { name: 'Alex' });

      expect(prisma.staff.create).toHaveBeenCalledWith({
        data: { businessId: biz, name: 'Alex', roleTitle: null },
      });
    });

    it('deactivates via scoped update and 404s on foreign ids', async () => {
      prisma.provider.findFirst.mockResolvedValue({ id: 'prov-1' });
      prisma.staff.updateMany
        .mockResolvedValueOnce({ count: 1 })
        .mockResolvedValueOnce({ count: 0 });
      prisma.staff.findFirst.mockResolvedValue({ id: 's-1', isActive: false });

      await service.updateStaff(owner, biz, 's-1', { isActive: false });
      expect(prisma.staff.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 's-1', businessId: biz } })
      );

      await expect(service.updateStaff(owner, biz, 'nope', { isActive: false })).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('appointment lifecycle', () => {
    const aptId = 'apt-1';

    it('lists appointments only for the owned business, paginated', async () => {
      prisma.provider.findFirst.mockResolvedValue({ id: 'prov-1' });
      prisma.appointment.findMany.mockResolvedValue([]);
      prisma.appointment.count.mockResolvedValue(0);

      await service.listAppointments(owner, biz, { page: 1, limit: 200 });

      expect(prisma.appointment.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { businessId: biz }, take: 100 })
      );
    });

    it('transitions BOOKED -> COMPLETED atomically with membership check', async () => {
      // Call 1 = status precheck (BOOKED); call 2 = final read after transition.
      prisma.appointment.findUnique
        .mockResolvedValueOnce({ id: aptId, businessId: biz, status: 'BOOKED' })
        .mockResolvedValueOnce({ id: aptId, businessId: biz, status: 'COMPLETED' });
      prisma.provider.findFirst.mockResolvedValue({ id: 'prov-1' });
      prisma.appointment.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.updateAppointmentStatus(owner, aptId, { status: 'COMPLETED' });

      expect(prisma.appointment.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: aptId, businessId: biz, status: 'BOOKED' },
          data: { status: 'COMPLETED' },
        })
      );
      expect(result?.status).toBe('COMPLETED');
    });

    it('sets cancellation metadata when cancelling', async () => {
      prisma.appointment.findUnique.mockResolvedValue({
        id: aptId,
        businessId: biz,
        status: 'BOOKED',
      });
      prisma.provider.findFirst.mockResolvedValue({ id: 'prov-1' });
      prisma.appointment.updateMany.mockResolvedValue({ count: 1 });

      await service.updateAppointmentStatus(owner, aptId, {
        status: 'CANCELLED',
        reason: 'double booked',
      });

      expect(prisma.appointment.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ cancelledAt: expect.any(Date) }),
        })
      );
    });

    it('conflicts when another actor already transitioned the appointment', async () => {
      prisma.appointment.findUnique
        .mockResolvedValueOnce({ id: aptId, businessId: biz, status: 'BOOKED' })
        .mockResolvedValue(undefined);
      prisma.provider.findFirst.mockResolvedValue({ id: 'prov-1' });
      prisma.appointment.updateMany.mockResolvedValue({ count: 0 });

      await expect(
        service.updateAppointmentStatus(owner, aptId, { status: 'NO_SHOW' })
      ).rejects.toThrow(ConflictException);
    });

    it('forbids non-members even for valid transitions', async () => {
      prisma.appointment.findUnique.mockResolvedValue({
        id: aptId,
        businessId: biz,
        status: 'BOOKED',
      });
      prisma.provider.findFirst.mockResolvedValue(null);

      await expect(
        service.updateAppointmentStatus(owner, aptId, { status: 'COMPLETED' })
      ).rejects.toThrow(ForbiddenException);
      expect(prisma.appointment.updateMany).not.toHaveBeenCalled();
    });
  });
});
