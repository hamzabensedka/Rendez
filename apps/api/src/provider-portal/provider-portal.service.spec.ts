import { Test, TestingModule } from '@nestjs/testing';
import { ProviderPortalService } from './provider-portal.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('ProviderPortalService', () => {
  let service: ProviderPortalService;
  let prisma: PrismaService;

  const mockPrisma = {
    business: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    service: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    staff: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    availability: {
      findMany: jest.fn(),
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
    appointment: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    $availability: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProviderPortalService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ProviderPortalService>(ProviderPortalService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getMyBusiness', () => {
    it('should return the business owned by the user', async () => {
      const business = { id: 'b1', ownerId: 'u1', name: 'Test Biz' };
      mockPrisma.business.findFirst.mockResolvedValue(business);
      await expect(service.getMyBusiness('u1')).resolves.toEqual(business);
    });

    it('should throw NotFoundException if no business found', async () => {
      mockPrisma.business.findFirst.mockResolvedValue(null);
      await expect(service.getMyBusiness('u1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createService', () => {
    it('should create a service for the owned business', async () => {
      const business = { id: 'b1', ownerId: 'u1' };
      const dto = { name: 'Haircut', durationMinutes: 30, price: 25 };
      const created = { id: 's1', ...dto, businessId: 'b1' };
      mockPrisma.business.findFirst.mockResolvedValue(business);
      mockPrisma.service.create.mockResolvedValue(created);
      await expect(service.createService('u1', dto)).resolves.toEqual(created);
    });
  });

  describe('deleteService', () => {
    it('should throw ConflictException if future appointments exist', async () => {
      const business = { id: 'b1', ownerId: 'u1' };
      mockPrisma.business.findFirst.mockResolvedValue(business);
      mockPrisma.service.findFirst.mockResolvedValue({
        id: 's1',
        businessId: 'b1',
      });
      mockPrisma.appointment.findFirst.mockResolvedValue({ id: 'a1' });
      await expect(service.deleteService('u1', 's1')).rejects.toThrow(
        ConflictException,
      );
    });

    it('should delete service if no future appointments', async () => {
      const business = { id: 'b1', ownerId: 'u1' };
      mockPrisma.business.findFirst.mockResolvedValue(business);
      mockPrisma.service.findFirst.mockResolvedValue({
        id: 's1',
        businessId: 'b1',
      });
      mockPrisma.appointment.findFirst.mockResolvedValue(null);
      mockPrisma.service.delete.mockResolvedValue({ id: 's1' });
      await expect(service.deleteService('u1', 's1')).resolves.toEqual({
        id: 's1',
      });
    });
  });

  describe('setAvailability', () => {
    it('should replace all availability rules', async () => {
      const business = { id: 'b1', ownerId: 'u1' };
      const dto = {
        rules: [
          { weekday: 1, start: '09:00', end: '17:00', slotLength: 30 },
        ],
      };
      mockPrisma.business.findFirst.mockResolvedValue(business);
      mockPrisma.$availability.mockImplementation(
        async (fn: (tx: any) => Promise<void>) => {
          await fn(mockPrisma);
        },
      );
      mockPrisma.availability.findMany.mockResolvedValue([]);
      await service.setAvailability('u1', dto);
      expect(mockPrisma.availability.deleteMany).toHaveBeenCalledWith({
        where: { businessId: 'b1' },
      });
      expect(mockPrisma.availability.createMany).toHaveBeenCalled();
    });
  });

  describe('listBookings', () => {
    it('should return bookings for the owned business', async () => {
      const business = { id: 'b1', ownerId: 'u1' };
      const bookings = [{ id: 'a1', businessId: 'b1' }];
      mockPrisma.business.findFirst.mockResolvedValue(business);
      mockPrisma.appointment.findMany.mockResolvedValue(bookings);
      await expect(service.listBookings('u1')).resolves.toEqual(bookings);
    });
  });
});
