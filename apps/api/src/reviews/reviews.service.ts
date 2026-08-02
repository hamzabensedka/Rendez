import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewQueryDto } from './dto/review-query.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateReviewDto) {
    // Verify the appointment belongs to the user and is completed
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: dto.appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.userId !== userId) {
      throw new BadRequestException('You can only review your own appointments');
    }

    if (appointment.status !== 'COMPLETED') {
      throw new BadRequestException('You can only review completed appointments');
    }

    // Check for duplicate review
    const existing = await this.prisma.review.findUnique({
      where: { appointmentId: dto.appointmentId },
    });

    if (existing) {
      throw new ConflictException('You have already reviewed this appointment');
    }

    const review = await this.prisma.review.create({
      data: {
        userId,
        businessId: appointment.businessId,
        appointmentId: dto.appointmentId,
        rating: dto.rating,
        comment: dto.comment,
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

    return review;
  }

  async findByBusiness(businessId: string, query: ReviewQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const sort = query.sort ?? 'recent';

    const orderBy: Record<string, string> = {
      recent: 'createdAt',
      highest: 'rating',
      lowest: 'rating',
    };

    const orderDirection = sort === 'lowest' ? 'asc' : 'desc';

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: {
          businessId,
          isHidden: false,
        },
        orderBy: { [orderBy[sort]]: orderDirection },
        skip: (page - 1) * limit,
        take: limit,
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
      }),
      this.prisma.review.count({
        where: {
          businessId,
          isHidden: false,
        },
      }),
    ]);

    return {
      data: reviews,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getRatingStats(businessId: string) {
    const aggregations = await this.prisma.review.aggregate({
      where: {
        businessId,
        isHidden: false,
      },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const distribution = await this.prisma.review.groupBy({
      by: ['rating'],
      where: {
        businessId,
        isHidden: false,
      },
      _count: { rating: true },
      orderBy: { rating: 'desc' },
    });

    const ratingDistribution: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    for (const item of distribution) {
      ratingDistribution[item.rating] = item._count.rating;
    }

    return {
      averageRating: aggregations._avg.rating
        ? Math.round(aggregations._avg.rating * 10) / 10
        : 0,
      totalReviews: aggregations._count.rating,
      distribution: ratingDistribution,
    };
  }

  async findByUser(userId: string, query: ReviewQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          business: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
      }),
      this.prisma.review.count({ where: { userId } }),
    ]);

    return {
      data: reviews,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async report(reviewId: string, reporterId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        isReported: true,
        reportedBy: reporterId,
        reportedAt: new Date(),
      },
    });

    return { message: 'Review reported for moderation', reviewId: updated.id };
  }
}
