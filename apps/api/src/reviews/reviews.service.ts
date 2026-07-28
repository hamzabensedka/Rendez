import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(reviewDto: ReviewDto) {
    return this.prismaService.review.create({
      data: reviewDto,
    });
  }

  async findAll(businessId: number) {
    return this.prismaService.review.findMany({
      where: {
        businessId,
      },
    });
  }
}
