import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let prisma: any;

  const mockPrisma = {
    appointment: {
      findUnique: jest.fn(),
    },
    review: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
      groupBy: jest.fn(),
    },
    business: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const userId = 'user-1';
    const dto = {
      appointmentId: 'appt-1',
      rating: 5,
      comment: 'Great service!',
    };

    it('should create a review successfully', async () => {
      prisma.appointment.findUnique.mockResolvedValue({
        id: 'appt-1',
        userId: 'user-1',
        businessId: 'biz-1',
        status: 'COMPLETED',
        business: { id: 'biz-1', name: 'Test Biz' },
      });
      prisma.review.findUnique.mockResolvedValue(null);
      prisma.review.create.mockResolvedValue({
        id: 'rev-1',
        ...dto,
        userId,
        businessId: 'biz-1',
        isFlagged: false,
        user: { id: 'user-1', firstName: 'John', lastName: 'Doe', avatarUrl: null },
      });
      prisma.review.aggregate.mockResolvedValue({ _avg: { rating: 5 }, _count: { rating: 1 } });
      prisma.business.update.mockResolvedValue({});

      const result = await service.create(userId, dto);
      expect(result).toHaveProperty('id', 'rev-1');
      expect(prisma.review.create).toHaveBeenCalled();
      expect(prisma.business.update).toHaveBeenCalled();
    });

    it('should throw if appointment not found', async () => {
      prisma.appointment.findUnique.mockResolvedValue(null);
      await expect(service.create(userId, dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw if appointment does not belong to user', async () => {
      prisma.appointment.findUnique.mockResolvedValue({
        id: 'appt-1',
        userId: 'other-user',
        businessId: 'biz-1',
        status: 'COMPLETED',
      });
      await expect(service.create(userId, dto)).rejects.toThrow(ForbiddenException);
    });

    it('should throw if appointment is not completed', async () => {
      prisma.appointment.findUnique.mockResolvedValue({
        id: 'appt-1',
        userId: 'user-1',
        businessId: 'biz-1',
        status: 'PENDING',
      });
      await expect(service.create(userId, dto)).rejects.toThrow(ForbiddenException);
    });

    it('should throw if duplicate review', async () => {
      prisma.appointment.findUnique.mockResolvedValue({
        id: 'appt-1',
        userId: 'user-1',
        businessId: 'biz-1',
        status: 'COMPLETED',
      });
      prisma.review.findUnique.mockResolvedValue({ id: 'existing-review' });
      await expect(service.create(userId, dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByBusiness', () => {
    it('should return paginated reviews', async () => {
      prisma.review.findMany.mockResolvedValue([]);
      prisma.review.count.mockResolvedValue(0);
      const result = await service.findByBusiness('biz-1', { page: 1, limit: 10 });
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result.meta.total).toBe(0);
    });
  });

  describe('getStats', () => {
    it('should return rating stats', async () => {
      prisma.business.findUnique.mockResolvedValue({
        id: 'biz-1',
        avgRating: 4.5,
        reviewCount: 10,
      });
      prisma.review.groupBy.mockResolvedValue([
        { rating: 5, _count: { rating: 6 } },
        { rating: 4, _count: { rating: 4 } },
      ]);
      const result = await service.getStats('biz-1');
      expect(result.averageRating).toBe(4.5);
      expect(result.ratingDistribution[5]).toBe(6);
    });

    it('should throw if business not found', async () => {
      prisma.business.findUnique.mockResolvedValue(null);
      await expect(service.getStats('biz-1')).rejects.toThrow(NotFoundException);
    });
  });
});
