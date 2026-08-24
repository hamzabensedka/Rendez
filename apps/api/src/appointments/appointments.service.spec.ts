import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@planity/shared';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  const businessA = 'business-a';
  const businessB = 'business-b';
  const locationA = 'location-a';
  const locationB = 'location-b';
  const staffA = 'staff-a';
  const staffB = 'staff-b';
  const client1 = 'client-1';
  const providerA = 'provider-user-a';
  const providerB = 'provider-user-b';

  const mockAppointment = (
    overrides: Partial<{
      id: string;
      businessId: string;
      clientUserId: string;
      status: string;
    }> = {}
  ) => ({
    id: 'apt-1',
    businessId: businessA,
    locationId: locationA,
    clientUserId: client1,
    staffId: staffA,
    status: 'BOOKED',
    startAtUtc: new Date(),
    endAtUtc: new Date(),
    timezoneSnapshot: 'Europe/Paris',
    cancelledAt: null,
    cancelReason: null,
    source: 'client',
    idempotencyKey: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    business: { id: businessA, name: 'Biz A', slug: 'biz-a', phone: null, email: null },
    location: {
      id: locationA,
      label: 'Main',
      address1: '',
      postalCode: '',
      city: '',
      country: 'FR',
    },
    staff: { id: staffA, name: 'Staff A' },
    appointmentItems: [],
    ...overrides,
  });

  const createMockPrisma = () => ({
    business: { findFirst: jest.fn() },
    location: { findFirst: jest.fn() },
    staff: { findFirst: jest.fn() },
    serviceVariant: { findMany: jest.fn() },
    appointment: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    appointmentItem: { createMany: jest.fn() },
    provider: { findFirst: jest.fn() },
    $transaction: jest.fn(),
  });

  let mockPrisma: ReturnType<typeof createMockPrisma>;

  beforeEach(async () => {
    mockPrisma = createMockPrisma();
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentsService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('allows client owner to access their appointment', async () => {
      const apt = mockAppointment({ clientUserId: client1 });
      mockPrisma.appointment.findUnique.mockResolvedValue(apt);
      const requester: AuthenticatedUser = {
        id: client1,
        email: 'c@x.com',
        name: 'Client',
        role: UserRole.CLIENT,
        status: 'active',
      };

      const result = await service.findOne('apt-1', requester);

      expect(result.id).toBe('apt-1');
      expect(result.clientUserId).toBe(client1);
    });

    it('allows provider of same business to access appointment', async () => {
      const apt = mockAppointment({ businessId: businessA });
      mockPrisma.appointment.findUnique.mockResolvedValue(apt);
      mockPrisma.provider.findFirst.mockResolvedValue({ id: 'prov-1' });
      const requester: AuthenticatedUser = {
        id: providerA,
        email: 'p@x.com',
        name: 'Provider A',
        role: UserRole.PROVIDER_OWNER,
        status: 'active',
      };

      const result = await service.findOne('apt-1', requester);

      expect(result.id).toBe('apt-1');
      expect(mockPrisma.provider.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: providerA, businessId: businessA },
        })
      );
    });

    it('throws ForbiddenException when provider from another business tries to access', async () => {
      const apt = mockAppointment({ businessId: businessA });
      mockPrisma.appointment.findUnique.mockResolvedValue(apt);
      mockPrisma.provider.findFirst.mockResolvedValue(null);
      const requester: AuthenticatedUser = {
        id: providerB,
        email: 'p2@x.com',
        name: 'Provider B',
        role: UserRole.PROVIDER_STAFF,
        status: 'active',
      };

      await expect(service.findOne('apt-1', requester)).rejects.toThrow(ForbiddenException);
      await expect(service.findOne('apt-1', requester)).rejects.toThrow(/cannot access/i);
    });

    it('throws ForbiddenException when another client tries to access', async () => {
      const apt = mockAppointment({ clientUserId: client1 });
      mockPrisma.appointment.findUnique.mockResolvedValue(apt);
      const otherClient: AuthenticatedUser = {
        id: 'other-client',
        email: 'o@x.com',
        name: 'Other',
        role: UserRole.CLIENT,
        status: 'active',
      };

      await expect(service.findOne('apt-1', otherClient)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('cancel', () => {
    it('allows provider of same business to cancel atomically (BOOKED only)', async () => {
      const apt = mockAppointment({ businessId: businessA, status: 'BOOKED' });
      mockPrisma.appointment.findUnique.mockResolvedValue(apt);
      mockPrisma.provider.findFirst.mockResolvedValue({ id: 'prov-1' });
      mockPrisma.appointment.updateMany.mockResolvedValue({ count: 1 });
      const requester: AuthenticatedUser = {
        id: providerA,
        email: 'p@x.com',
        name: 'Provider A',
        role: UserRole.PROVIDER_OWNER,
        status: 'active',
      };

      await service.cancel('apt-1', requester, 'reason');

      expect(mockPrisma.appointment.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'apt-1', status: 'BOOKED' },
          data: expect.objectContaining({ status: 'CANCELLED' }),
        })
      );
    });

    it('rejects cancelling an already-completed appointment', async () => {
      const apt = mockAppointment({ clientUserId: client1, status: 'COMPLETED' });
      mockPrisma.appointment.findUnique.mockResolvedValue(apt);
      const requester: AuthenticatedUser = {
        id: client1,
        email: 'c@x.com',
        name: 'Client',
        role: UserRole.CLIENT,
        status: 'active',
      };

      await expect(service.cancel('apt-1', requester)).rejects.toThrow(ConflictException);
      expect(mockPrisma.appointment.updateMany).not.toHaveBeenCalled();
    });

    it('enforces the free-cancellation window', async () => {
      const startInOneHour = new Date(Date.now() + 3_600_000);
      const apt = {
        ...mockAppointment({ clientUserId: client1, status: 'BOOKED' }),
        startAtUtc: startInOneHour,
        business: {
          id: businessA,
          freeCancellationBeforeHours: 24,
        },
      };
      mockPrisma.appointment.findUnique.mockResolvedValue(apt);
      const requester: AuthenticatedUser = {
        id: client1,
        email: 'c@x.com',
        name: 'Client',
        role: UserRole.CLIENT,
        status: 'active',
      };

      await expect(service.cancel('apt-1', requester)).rejects.toThrow(/free cancellation window/i);
      expect(mockPrisma.appointment.updateMany).not.toHaveBeenCalled();
    });

    it('provider from another business cannot cancel (forbidden via findOne)', async () => {
      const apt = mockAppointment({ businessId: businessA });
      mockPrisma.appointment.findUnique.mockResolvedValue(apt);
      mockPrisma.provider.findFirst.mockResolvedValue(null);
      const requester: AuthenticatedUser = {
        id: providerB,
        email: 'p2@x.com',
        name: 'Provider B',
        role: UserRole.PROVIDER_STAFF,
        status: 'active',
      };

      await expect(service.cancel('apt-1', requester)).rejects.toThrow(ForbiddenException);
      expect(mockPrisma.appointment.update).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    const baseDto: CreateAppointmentDto = {
      businessId: businessA,
      locationId: locationA,
      staffId: staffA,
      items: [{ serviceVariantId: 'variant-a', quantity: 1 }],
      startAt: new Date(Date.now() + 86400000).toISOString(),
    };

    beforeEach(() => {
      mockPrisma.business.findFirst.mockResolvedValue({
        id: businessA,
        timezone: 'Europe/Paris',
      });
      mockPrisma.$transaction.mockImplementation(async (fn: (tx: unknown) => Promise<unknown>) => {
        return fn(mockPrisma);
      });
      mockPrisma.appointment.create.mockResolvedValue(
        mockAppointment({ id: 'new-apt', businessId: businessA })
      );
      mockPrisma.appointmentItem.createMany.mockResolvedValue({ count: 1 });
    });

    it('rejects when locationId does not belong to businessId', async () => {
      mockPrisma.location.findFirst.mockResolvedValue(null);

      await expect(service.create(client1, { ...baseDto, locationId: locationB })).rejects.toThrow(
        BadRequestException
      );
      await expect(service.create(client1, { ...baseDto, locationId: locationB })).rejects.toThrow(
        /location.*business/i
      );
    });

    it('rejects when staffId does not belong to business', async () => {
      mockPrisma.location.findFirst.mockResolvedValue({ id: locationA, businessId: businessA });
      mockPrisma.staff.findFirst.mockResolvedValue(null);

      await expect(service.create(client1, { ...baseDto, staffId: staffB })).rejects.toThrow(
        BadRequestException
      );
      await expect(service.create(client1, { ...baseDto, staffId: staffB })).rejects.toThrow(
        /staff.*business/i
      );
    });

    it('rejects when serviceVariantId does not belong to business', async () => {
      mockPrisma.location.findFirst.mockResolvedValue({ id: locationA, businessId: businessA });
      mockPrisma.staff.findFirst.mockResolvedValue({ id: staffA, businessId: businessA });
      mockPrisma.serviceVariant.findMany.mockResolvedValue([
        {
          id: 'variant-a',
          durationMin: 30,
          bufferBeforeMin: 0,
          bufferAfterMin: 0,
          priceCents: 1000,
          service: { businessId: businessB, isActive: true },
        },
      ]);

      await expect(service.create(client1, baseDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(client1, baseDto)).rejects.toThrow(
        /service variant.*do not belong to this business/i
      );
    });

    it('rejects when business is not found or not active', async () => {
      mockPrisma.business.findFirst.mockResolvedValue(null);

      await expect(service.create(client1, baseDto)).rejects.toThrow(NotFoundException);
      await expect(service.create(client1, baseDto)).rejects.toThrow(/business not found/i);
    });

    it('maps a double-booking exclusion violation to ConflictException', async () => {
      mockPrisma.location.findFirst.mockResolvedValue({ id: locationA, businessId: businessA });
      mockPrisma.staff.findFirst.mockResolvedValue({ id: staffA, businessId: businessA });
      mockPrisma.serviceVariant.findMany.mockResolvedValue([
        {
          id: 'variant-a',
          durationMin: 30,
          bufferBeforeMin: 0,
          bufferAfterMin: 0,
          priceCents: 1000,
          isActive: true,
          service: { businessId: businessA, isActive: true },
        },
      ]);
      mockPrisma.appointment.create.mockRejectedValue(
        new Error(
          'error: conflicting key value violates exclusion constraint "appointments_no_overlap_per_staff" (23P01)'
        )
      );

      await expect(service.create(client1, baseDto)).rejects.toThrow(ConflictException);
      await expect(service.create(client1, baseDto)).rejects.toThrow(/no longer available/i);
    });

    it('writes price and duration snapshots and uses the business timezone', async () => {
      mockPrisma.location.findFirst.mockResolvedValue({ id: locationA, businessId: businessA });
      mockPrisma.staff.findFirst.mockResolvedValue({ id: staffA, businessId: businessA });
      mockPrisma.serviceVariant.findMany.mockResolvedValue([
        {
          id: 'variant-a',
          durationMin: 45,
          bufferBeforeMin: 5,
          bufferAfterMin: 10,
          priceCents: 4500,
          isActive: true,
          service: { businessId: businessA, isActive: true },
        },
      ]);

      await service.create(client1, baseDto);

      expect(mockPrisma.appointmentItem.createMany).toHaveBeenCalledWith({
        data: [
          expect.objectContaining({
            durationMinSnapshot: 45,
            priceCentsSnapshot: 4500,
          }),
        ],
      });
      const createArg = mockPrisma.appointment.create.mock.calls[0][0];
      expect(createArg.data.timezoneSnapshot).toBe('Europe/Paris');
      // end = start + 45min + 10min buffer; occupied start = start - 5min buffer
      const start = new Date(baseDto.startAt).getTime();
      expect(new Date(createArg.data.endAtUtc).getTime()).toBe(start + (45 + 10) * 60_000);
    });
  });
});
