import { Test, TestingModule } from '@nestjs/testing';
import { ProviderPortalService } from './provider-portal.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';

describe('ProviderPortalService', () => {
  let service: ProviderPortalService;
  let prisma: any;

  const mockBusiness = {
    id: 'biz-1',
    ownerId: 'owner-1',
    name: 'Test Business',
  };

  const mockService = {
    id: 'svc-1',
    businessId: 'biz-1',
    name: 'Haircut',
    duration: 30,
    price: 50,
  };

  const mockStaff = {
    id: 'staff-1',
    businessId: 'biz-1',
    name: 'John Doe',
    email: 'john@example.com',
  };

  beforeEach(async () => {
    prisma = {
      business: {
        findFirst: jest.fn().mockResolvedValue(mockBusiness),
        update: jest.fn().mockResolvedValue(mockBusiness),
      },
      service: {
        findMany: jest.fn().mockResolvedValue([mockService]),
        findUnique: jest.fn().mockResolvedValue(mockService),
        create: jest.fn().mockResolvedValue(mockService),
        update: jest.fn().mockResolvedValue(mockService),
        delete: jest.fn().mockResolvedValue(mockService),
      },
      staff: {
        findMany: jest.fn().mockResolvedValue([mockStaff]),
        findUnique: jest.fn().mockResolvedValue(mockStaff),
        create: jest.fn().mockResolvedValue(mockStaff),
        update: jest.fn().mockResolvedValue(mockStaff),
        delete: jest.fn().mockResolvedValue(mockStaff),
      },
      availability: {
        findMany: jest.fn().mockResolvedValue([]),
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
        createMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      appointment: {
        count: jest.fn().mockResolvedValue(0),
        findMany: jest.fn().mockResolvedValue([]),
      },
      $transaction: jest.fn((fn) => fn(prisma)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProviderPortalService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ProviderPortalService>(ProviderPortalService);
  });

  describe('getBusinessByOwner', () => {
    it('should return business for owner', async () => {
      const result = await service.getBusinessByOwner('owner-1');
      expect(result).toEqual(mockBusiness);
      expect(prisma.business.findFirst).toHaveBeenCalledWith({
        where: { ownerId: 'owner-1' },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException if no business', async () => {
      prisma.business.findFirst.mockResolvedValueOnce(null);
      await expect(service.getBusinessByOwner('owner-2')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createService', () => {
    it('should create a service for the provider business', async () => {
      const dto = { name: 'Haircut', duration: 30, price: 50 };
      const result = await service.createService('owner-1', dto);
      expect(result).toEqual(mockService);
      expect(prisma.service.create).toHaveBeenCalledWith({
        data: { businessId: 'biz-1', ...dto },
      });
    });
  });

  describe('deleteService', () => {
    it('should throw ConflictException if future appointments exist', async () => {
      prisma.appointment.count.mockResolvedValueOnce(2);
      await expect(
        service.deleteService('owner-1', 'svc-1'),
      ).rejects.toThrow(ConflictException);
    });

    it('should delete service if no future appointments', async () => {
      await service.deleteService('owner-1', 'svc-1');
      expect(prisma.service.delete).toHaveBeenCalledWith({
        where: { id: 'svc-1' },
      });
    });
  });

  describe('createStaff', () => {
    it('should create staff for the provider business', async () => {
      const dto = { name: 'Jane', email: 'jane@example.com' };
      const result = await service.createStaff('owner-1', dto);
      expect(result).toEqual(mockStaff);
      expect(prisma.staff.create).toHaveBeenCalledWith({
        data: { businessId: 'biz-1', ...dto },
      });
    });
  });

  describe('setAvailability', () => {
    it('should replace availability rules', async () => {
      const dto = {
        rules: [{ weekday: 1, start: '09:00', end: '17:00', slotLength: 30 }],
      };
      const result = await service.setAvailability('owner-1', dto);
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(prisma.availability.deleteMany).toHaveBeenCalledWith({
        where: { businessId: 'biz-1' },
      });
      expect(prisma.availability.createMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
