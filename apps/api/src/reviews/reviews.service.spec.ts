import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let prisma: PrismaService;

  const mockPrisma = {
    appointment: {
      findUnique: jest.fn(),
    },
    review: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
      update: jest.fn(),
    },
    business: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
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
    const dto = {
      appointmentId: 'appt-1',
      rating: 5,
      comment: 'Great service!',
    };

    it('should create a review for a completed appointment', async () => {
      const appointment = {
        id: 'appt-1',
        userId,
        businessId: 'biz-1',
        status: 'COMPLETED',
      };
      const createdReview = {
        id: 'rev-1',
        ...dto,
        userId,
        businessId: 'biz-1',
        status: 'PUBLISHED',
        user: { id: userId, firstName: 'John', lastName: 'Doe', avatarUrl: null },
      };

      mockPrisma.appointment.findUnique.mockResolvedValue(appointment);
      mockPrisma.review.findUnique.mockResolvedValue(null);
      mockPrisma.review.create.mockResolvedValue(createdReview);

      const result = await service.create(userId, dto);

      expect(result).toEqual(createdReview);
      expect(mockPrisma.review.create).toHaveBeenCalledWith({
        data: {
          appointmentId: dto.appointmentId,
          userId,
          businessId: 'biz-1',
          rating: dto.rating,
          comment: dto.comment,
          status: 'PUBLISHED',
        },
        include: expect.any(Object),
      });
    });

    it('should throw if appointment not found', async () => {
      mockPrisma.appointment.findUnique.mockResolvedValue(null);

      await expect(service.create(userId, dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw if appointment belongs to another user', async () => {
      mockPrisma.appointment.findUnique.mockResolvedValue({
        id: 'appt-1',
        userId: 'other-user',
        businessId: 'biz-1',
        status: 'COMPLETED',
      });

      await expect(service.create(userId, dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if appointment is not completed', async () => {
      mockPrisma.appointment.findUnique.mockResolvedValue({
        id: 'appt-1',
        userId,
        businessId: 'biz-1',
        status: 'CONFIRMED',
      });

      await expect(service.create(userId, dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if review already exists', async () => {
      mockPrisma.appointment.findUnique.mockResolvedValue({
        id: 'appt-1',
        userId,
        businessId: 'biz-1',
        status: 'COMPLETED',
      });
      mockPrisma.review.findUnique.mockResolvedValue({ id: 'rev-1' });

      await expect(service.create(userId, dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findByBusiness', () => {
    it('should return paginated reviews', async () => {
      const reviews = [
        { id: 'rev-1', rating: 5, comment: 'Great!', user: {} },
      ];
      mockPrisma.review.findMany.mockResolvedValue(reviews);
      mockPrisma.review.count.mockResolvedValue(1);

      const result = await service.findByBusiness('biz-1', { page: 1, limit: 10 });

      expect(result.data).toEqual(reviews);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('getStats', () => {
    it('should return rating stats', async () => {
      mockPrisma.business.findUnique.mockResolvedValue({ id: 'biz-1' });
      mockPrisma.review.groupBy.mockResolvedValue([
        { rating: 5, _count: { rating: 3 } },
        { rating: 4, _count: { rating: 1 } },
      ]);

      const result = await service.getStats('biz-1');

      expect(result.averageRating).toBe(4.75);
      expect(result.totalReviews).toBe(4);
      expect(result.distribution[5]).toBe(3);
    });

    it('should throw if business not found', async () => {
      mockPrisma.business.findUnique.mockResolvedValue(null);

      await expect(service.getStats('biz-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
