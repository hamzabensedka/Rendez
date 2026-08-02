import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsQueryDto } from './dto/reviews-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateReviewDto) {
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

    const existingReview = await this.prisma.review.findUnique({
      where: { appointmentId: dto.appointmentId },
    });

    if (existingReview) {
      throw new BadRequestException('Review already exists for this appointment');
    }

    const review = await this.prisma.review.create({
      data: {
        appointmentId: dto.appointmentId,
        userId,
        businessId: appointment.businessId,
        rating: dto.rating,
        comment: dto.comment,
        status: 'PUBLISHED',
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

  async findByBusiness(businessId: string, query: ReviewsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ReviewWhereInput = {
      businessId,
      status: 'PUBLISHED',
    };

    if (query.rating) {
      where.rating = query.rating;
    }

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
      this.prisma.review.count({ where }),
    ]);

    return {
      data: reviews,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getStats(businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const aggregations = await this.prisma.review.groupBy({
      by: ['rating'],
      where: {
        businessId,
        status: 'PUBLISHED',
      },
      _count: { rating: true },
    });

    const totalReviews = aggregations.reduce(
      (sum, item) => sum + item._count.rating,
      0,
    );

    const ratingSum = aggregations.reduce(
      (sum, item) => sum + item.rating * item._count.rating,
      0,
    );

    const averageRating = totalReviews > 0 ? ratingSum / totalReviews : 0;

    const distribution: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    aggregations.forEach((item) => {
      distribution[item.rating] = item._count.rating;
    });

    return {
      businessId,
      averageRating: Math.round(averageRating * 100) / 100,
      totalReviews,
      distribution,
    };
  }

  async flagReview(reviewId: string, reason: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return this.prisma.review.update({
      where: { id: reviewId },
      data: {
        status: 'FLAGGED',
        moderationReason: reason,
      },
    });
  }

  async moderateReview(reviewId: string, action: 'APPROVE' | 'REJECT') {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.status !== 'FLAGGED') {
      throw new BadRequestException('Only flagged reviews can be moderated');
    }

    const newStatus = action === 'APPROVE' ? 'PUBLISHED' : 'REJECTED';

    return this.prisma.review.update({
      where: { id: reviewId },
      data: {
        status: newStatus,
        moderationReason: null,
      },
    });
  }
}
