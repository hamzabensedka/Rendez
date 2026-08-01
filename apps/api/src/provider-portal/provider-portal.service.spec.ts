import { Test, TestingModule } from '@nestjs/testing';
import { ProviderPortalService } from './provider-portal.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

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
    appointments: {
      findMany: jest.fn(),
    },
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

  describe('getBusinessByOwner', () => {
    it('should return business if found', async () => {
      const business = { id: 'b1', ownerId: 'u1' };
      mockPrisma.business.findFirst.mockResolvedValue(business);
      await expect(service.getBusinessByOwner('u1')).resolves.toEqual(business);
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.business.findFirst.mockResolvedValue(null);
      await expect(service.getBusinessByOwner('u1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('listServices', () => {
    it('should return services for the owner business', async () => {
      const business = { id: 'b1', ownerId: 'u1' };
      const services = [{ id: 's1', businessId: 'b1' }];
      mockPrisma.business.findFirst.mockResolvedValue(business);
      mockPrisma.service.findMany.mockResolvedValue(services);
      await expect(service.listServices('u1')).resolves.toEqual(services);
    });
  });

  describe('createService', () => {
    it('should create a service', async () => {
      const business = { id: 'b1', ownerId: 'u1' };
      const dto = { name: 'Haircut', duration: 30, price: 25 };
      const created = { id: 's1', ...dto, businessId: 'b1' };
      mockPrisma.business.findFirst.mockResolvedValue(business);
      mockPrisma.service.create.mockResolvedValue(created);
      await expect(service.createService('u1', dto)).resolves.toEqual(created);
    });
  });

  describe('updateService', () => {
    it('should update service if owned', async () => {
      const business = { id: 'b1', ownerId: 'u1' };
      const existing = { id: 's1', businessId: 'b1' };
      const dto = { name: 'Updated' };
      mockPrisma.business.findFirst.mockResolvedValue(business);
      mockPrisma.service.findFirst.mockResolvedValue(existing);
      mockPrisma.service.update.mockResolvedValue({ ...existing, ...dto });
      await expect(
        service.updateService('u1', 's1', dto),
      ).resolves.toMatchObject(dto);
    });

    it('should throw NotFoundException if service not owned', async () => {
      const business = { id: 'b1', ownerId: 'u1' };
      mockPrisma.business.findFirst.mockResolvedValue(business);
      mockPrisma.service.findFirst.mockResolvedValue(null);
      await expect(
        service.updateService('u1', 's1', {}),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteService', () => {
    it('should delete service if owned', async () => {
      const business = { id: 'b1', ownerId: 'u1' };
      const existing = { id: 's1', businessId: 'b1' };
      mockPrisma.business.findFirst.mockResolvedValue(business);
      mockPrisma.service.findFirst.mockResolvedValue(existing);
      mockPrisma.service.delete.mockResolvedValue(existing);
      await service.deleteService('u1', 's1');
      expect(mockPrisma.service.delete).toHaveBeenCalledWith({
        where: { id: 's1' },
      });
    });
  });
});
