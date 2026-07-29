import { Controller, Post, Get, Body, Param, UseGuards, HttpStatus, HttpException } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User } from '../auth/decorators/current-user.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  async create(@User() user: any, @Body() createReviewDto: CreateReviewDto) {
    try {
      const review = await this.reviewsService.create(user, createReviewDto);
      return review;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':businessId')
  async findAll(@Param('businessId') businessId: number) {
    try {
      const reviews = await this.reviewsService.findAll(businessId);
      return reviews;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}