import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { GetReviewQueryDto } from './dto/review-query.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateReviewDto) {
    // Verify the appointment exists and belongs to the user
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: dto.appointmentId },
      include: { business: true },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.userId !== userId) {
      throw new ForbiddenException('You can only review your own appointments');
    }

    if (appointment.status !== 'COMPLETED') {
      throw new BadRequestException('You can only review completed appointments');
    }

    // Check for duplicate review
    const existing = await this.prisma.review.findUnique({
      where: { appointmentId: dto.appointmentId },
    });

    if (existing) {
      throw new BadRequestException('You have already reviewed this appointment');
    }

    const review = await this.prisma.review.create({
      data: {
        rating: dto.rating,
        comment: dto.comment,
        userId,
        businessId: appointment.businessId,
        appointmentId: dto.appointmentId,
        isFlagged: this.containsFlaggedContent(dto.comment),
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

    // Update business aggregate rating
    await this.updateBusinessRating(appointment.businessId);

    return review;
  }

  async findByBusiness(businessId: string, query: GetReviewQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = {
      businessId,
      isFlagged: false, // Exclude flagged reviews from public listing
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

  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        business: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async getStats(businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: {
        id: true,
        avgRating: true,
        reviewCount: true,
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const distribution = await this.prisma.review.groupBy({
      by: ['rating'],
      where: {
        businessId,
        isFlagged: false,
      },
      _count: { rating: true },
    });

    const ratingDistribution: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    distribution.forEach((item) => {
      ratingDistribution[item.rating] = item._count.rating;
    });

    return {
      businessId: business.id,
      averageRating: business.avgRating,
      totalReviews: business.reviewCount,
      ratingDistribution,
    };
  }

  private async updateAggregateRating(businessId: string) {
    const result = await this.prisma.review.aggregate({
      where: {
        businessId,
        isFlagged: false,
      },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await this.prisma.business.update({
      where: { id: businessId },
      data: {
        avgRating: result._avg.rating ?? 0,
        reviewCount: result._count.rating ?? 0,
      },
    });
  }

  private containsFlagContent(comment?: string): boolean {
    if (!comment) return false;
    const flaggedPatterns = [
      'spam',
      'fake',
      'scam',
      'http://',
      'https://',
    ];
    const lowerComment = comment.toLowerCase();
    return flaggedPatterns.some((pattern) => lowerComment.includes(pattern));
  }
}
