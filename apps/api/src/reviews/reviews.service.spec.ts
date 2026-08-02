import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let prisma: PrismaService;

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
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const userId = 'user-1';
    const dto = { appointmentId: 'appt-1', rating: 5, comment: 'Great!' };

    it('should throw NotFoundException if appointment does not exist', async () => {
      (prisma.appointment.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.create(userId, dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if appointment belongs to another user', async () => {
      (prisma.appointment.findUnique as jest.Mock).mockResolvedValue({
        id: 'appt-1',
        userId: 'other-user',
        businessId: 'biz-1',
        status: 'COMPLETED',
      });

      await expect(service.create(userId, dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if appointment is not completed', async () => {
      (prisma.appointment.findUnique as jest.Mock).mockResolvedValue({
        id: 'appt-1',
        userId,
        businessId: 'biz-1',
        status: 'CONFIRMED',
      });

      await expect(service.create(userId, dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if review already exists', async () => {
      (prisma.appointment.findUnique as jest.Mock).mockResolvedValue({
        id: 'appt-1',
        userId,
        businessId: 'biz-1',
        status: 'COMPLETED',
      });
      (prisma.review.findUnique as jest.Mock).mockResolvedValue({ id: 'rev-1' });

      await expect(service.create(userId, dto)).rejects.toThrow(ConflictException);
    });

    it('should create and return review on success', async () => {
      const mockReview = {
        id: 'rev-1',
        userId,
        businessId: 'biz-1',
        appointmentId: 'appt-1',
        rating: 5,
        comment: 'Great!',
        user: { id: userId, firstName: 'John', lastName: 'Doe', avatarUrl: null },
      };

      (prisma.appointment.findUnique as jest.Mock).mockResolvedValue({
        id: 'appt-1',
        userId,
        businessId: 'biz-1',
        status: 'COMPLETED',
      });
      (prisma.review.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.review.create as jest.Mock).mockResolvedValue(mockReview);

      const result = await service.create(userId, dto);

      expect(result).toEqual(mockReview);
      expect(prisma.review.create).toHaveBeenCalledWith({
        data: {
          userId,
          businessId: 'biz-1',
          appointmentId: 'appt-1',
          rating: 5,
          comment: 'Great!',
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
        },
      });
    });
  });

  describe('findByBusiness', () => {
    it('should return paginated reviews with meta', async () => {
      const mockReviews = [
        { id: 'rev-1', rating: 5, comment: 'Nice', user: { id: 'u1', firstName: 'A', lastName: 'B', avatarUrl: null } },
      ];
      (prisma.review.findMany as jest.Mock).mockResolvedValue(mockReviews);
      (prisma.review.count as jest.Mock).mockResolvedValue(1);

      const result = await service.findByBusiness('biz-1', { page: 1, limit: 10, sort: 'recent' });

      expect(result).toEqual({
        data: mockReviews,
        meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
      });
    });
  });

  describe('getRatingStats', () => {
    it('should return average rating and distribution', async () => {
      (prisma.review.aggregate as jest.Mock).mockResolvedValue({
        _avg: { rating: 4.5 },
        _count: { rating: 10 },
      });
      (prisma.review.groupBy as jest.Mock).mockResolvedValue([
        { rating: 5, _count: { rating: 5 } },
        { rating: 4, _count: { rating: 5 } },
      ]);

      const result = await service.getRatingStats('biz-1');

      expect(result).toEqual({
        averageRating: 4.5,
        totalReviews: 10,
        ratingDistribution: {
          1: 0,
          2: 0,
          3: 0,
          4: 5,
          5: 5,
        },
      });
    });
  });

  describe('report', () => {
    it('should throw NotFoundException if review does not exist', async () => {
      (prisma.review.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.report('rev-1', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('should mark review as reported', async () => {
      (prisma.review.findUnique as jest.Mock).mockResolvedValue({ id: 'rev-1' });
      (prisma.review.update as jest.Mock).mockResolvedValue({
        id: 'rev-1',
        isReported: true,
        reportedBy: 'user-1',
        reportedAt: new Date(),
      });

      const result = await service.report('rev-1', 'user-1');

      expect(result).toEqual({
        message: 'Review has been moderated',
        reviewId: 'rev-1',
      });
    });
  });
});
