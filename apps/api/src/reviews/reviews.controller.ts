import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsQueryDto } from './dto/reviews-query.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.create(user.userId, dto);
  }

  @Get('business/:businessId')
  async findByBusiness(
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Query() query: ReviewsQueryDto,
  ) {
    return this.reviewsService.findByBusiness(businessId, query);
  }

  @Get('business/:businessId/stats')
  async getStats(@Param('businessId', ParseUUIDPipe) businessId: string) {
    return this.reviewsService.getStats(businessId);
  }
}
