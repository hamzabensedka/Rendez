import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from '../auth/decorators/current-user.decorator';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async create(user: User, createReviewDto: CreateReviewDto) {
    try {
      const review = this.reviewRepository.create(createReviewDto);
      review.user = user;
      return await this.reviewRepository.save(review);
    } catch (error) {
      throw error;
    }
  }

  async findAll(businessId: number) {
    try {
      return await this.reviewRepository.find({ where: { businessId } });
    } catch (error) {
      throw error;
    }
  }
}