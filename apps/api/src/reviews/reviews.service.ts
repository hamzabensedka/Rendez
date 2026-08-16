import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createReviewDto: CreateReviewDto) {
    return this.prismaService.review.create({
      data: {
        rating: createReviewDto.rating,
        comment: createReviewDto.comment,
        salonId: createReviewDto.salonId,
        userId: createReviewDto.userId,
      },
    });
  }

  async findAll() {
    return this.prismaService.review.findMany();
  }

  async findOne(id: number) {
    return this.prismaService.review.findUnique({
      where: { id },
    });
  }
}
