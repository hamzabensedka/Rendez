import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewQueryDto } from './dto/review-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit a review for a completed appointment' })
  @ApiResponse({ status: 201, description: 'Review created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input or duplicate review.' })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  async createReview(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.create(user.id, dto);
  }

  @Get('business/:businessId')
  @ApiOperation({ summary: 'List reviews for a business' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, enum: ['recent', 'highest', 'lowest'] })
  @ApiResponse({ status: 200, description: 'Paginated list of reviews.' })
  async getBusinessReviews(
    @Param('businessId') businessId: string,
    @Query() query: GetReviewQueryDto,
  ) {
    return this.reviewsService.findByBusiness(businessId, query);
  }

  @Get('business/:businessId/stats')
  @ApiOperation({ summary: 'Aggregated rating stats for a business' })
  @ApiResponse({ status: 200, description: 'Rating statistics.' })
  async getBusinessRatingStats(
    @Param('businessId') businessId: string,
  ) {
    return this.reviewsService.getRatingStats(businessId);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List reviews written by the current user' })
  async getUserReviews(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ReviewQueryDto,
  ) {
    return this.reviewsService.findByUser(user.id, query);
  }

  @Post(':reviewId/report')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Report a review for moderation' })
  @ApiResponse({ status: 200, description: 'Review reported.' })
  async reportReview(
    @Param('reviewId') reviewId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.reviewsService.report(reviewId, user.id);
  }
}
