import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BusinessesService', () => {
  let service: BusinessesService;
  let prisma: { business: { findFirst: jest.Mock; findMany: jest.Mock; count: jest.Mock } };

  const mockBusiness = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    slug: 'test-salon',
    name: 'Test Salon',
    status: 'active',
    deletedAt: null,
    locations: [
      {
        address1: '1 High Street',
        address2: null,
        postalCode: 'SW1A 1AA',
        city: 'London',
        country: 'UK',
      },
    ],
    services: [],
    staff: [],
    _count: { reviews: 0 },
  };

  beforeEach(async () => {
    prisma = {
      business: {
        findFirst: jest.fn() as jest.Mock,
        findMany: jest.fn() as jest.Mock,
        count: jest.fn() as jest.Mock,
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<BusinessesService>(BusinessesService);
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('finds by UUID when idOrSlug is a valid UUID', async () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      prisma.business.findFirst.mockResolvedValue(mockBusiness);

      const result = await service.findOne(uuid);

      expect(prisma.business.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id: uuid,
            status: 'active',
            deletedAt: null,
          }),
        })
      );
      expect(result).toBeDefined();
      expect(result.id).toBe(uuid);
      expect(result.locations[0]).toHaveProperty('address');
    });

    it('finds by slug when idOrSlug is not a UUID', async () => {
      const slug = 'test-salon';
      prisma.business.findFirst.mockResolvedValue(mockBusiness);

      const result = await service.findOne(slug);

      expect(prisma.business.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            slug,
            status: 'active',
            deletedAt: null,
          }),
        })
      );
      expect(result).toBeDefined();
      expect(result.slug).toBe(slug);
    });

    it('throws NotFoundException when business is not found', async () => {
      prisma.business.findFirst.mockResolvedValue(null);

      await expect(service.findOne('550e8400-e29b-41d4-a716-446655440000')).rejects.toThrow(
        NotFoundException
      );
      await expect(service.findOne('550e8400-e29b-41d4-a716-446655440000')).rejects.toThrow(
        /business not found/i
      );
    });

    it('treats slug-like string as slug (no UUID match)', async () => {
      prisma.business.findFirst.mockResolvedValue({ ...mockBusiness, slug: 'my-salon' });

      await service.findOne('my-salon');

      expect(prisma.business.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ slug: 'my-salon' }),
        })
      );
    });
  });
});
