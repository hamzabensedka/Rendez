import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';

const REVIEW_SELECT = {
  id: true,
  businessId: true,
  appointmentId: true,
  clientUserId: true,
  rating: true,
  comment: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  clientUser: { select: { id: true, name: true } },
} satisfies Prisma.ReviewSelect;

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

@Injectable()
export class ReviewsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: AuthenticatedUser, dto: CreateReviewDto) {
    const appointment = await this.prismaService.appointment.findUnique({
      where: { id: dto.appointmentId },
      select: { id: true, clientUserId: true, businessId: true, status: true },
    });
    if (!appointment) throw new NotFoundException('Appointment not found');
    if (appointment.clientUserId !== user.id) {
      throw new ForbiddenException('You can only review your own appointments');
    }
    if (appointment.status !== 'COMPLETED') {
      throw new ConflictException('Only completed appointments can be reviewed');
    }

    try {
      return await this.prismaService.review.create({
        data: {
          appointmentId: dto.appointmentId,
          businessId: appointment.businessId,
          clientUserId: user.id,
          rating: dto.rating,
          comment: dto.comment ?? null,
          status: 'pending',
        },
        select: REVIEW_SELECT,
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException('This appointment has already been reviewed');
      }
      throw err;
    }
  }

  /** Public listing for a business: approved reviews only, paginated. */
  async findByBusiness(businessId: string, page = 1, limit = DEFAULT_PAGE_SIZE) {
    const take = Math.min(Math.max(Math.trunc(limit) || DEFAULT_PAGE_SIZE, 1), MAX_PAGE_SIZE);
    const skip = Math.max(Math.trunc(page) - 1, 0) * take;
    const where: Prisma.ReviewWhereInput = { businessId, status: 'approved' };
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.review.findMany({
        where,
        select: REVIEW_SELECT,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      this.prismaService.review.count({ where }),
    ]);
    return { data, meta: { page: skip / take + 1, limit: take, total } };
  }

  async findMine(user: AuthenticatedUser, page = 1, limit = DEFAULT_PAGE_SIZE) {
    const take = Math.min(Math.max(Math.trunc(limit) || DEFAULT_PAGE_SIZE, 1), MAX_PAGE_SIZE);
    const skip = Math.max(Math.trunc(page) - 1, 0) * take;
    const where: Prisma.ReviewWhereInput = { clientUserId: user.id };
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.review.findMany({
        where,
        select: REVIEW_SELECT,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      this.prismaService.review.count({ where }),
    ]);
    return { data, meta: { page: skip / take + 1, limit: take, total } };
  }

  async findPending(page = 1, limit = DEFAULT_PAGE_SIZE) {
    const take = Math.min(Math.max(Math.trunc(limit) || DEFAULT_PAGE_SIZE, 1), MAX_PAGE_SIZE);
    const skip = Math.max(Math.trunc(page) - 1, 0) * take;
    const where: Prisma.ReviewWhereInput = { status: 'pending' };
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.review.findMany({
        where,
        select: REVIEW_SELECT,
        orderBy: { createdAt: 'asc' },
        take,
        skip,
      }),
      this.prismaService.review.count({ where }),
    ]);
    return { data, meta: { page: skip / take + 1, limit: take, total } };
  }

  async moderate(id: string, decision: 'approve' | 'reject') {
    const review = await this.prismaService.review.findUnique({
      where: { id },
      select: { id: true, status: true },
    });
    if (!review) throw new NotFoundException('Review not found');

    const nextStatus = decision === 'approve' ? 'approved' : 'rejected';
    const updated = await this.prismaService.review.update({
      where: { id },
      data: { status: nextStatus },
      select: REVIEW_SELECT,
    });
    // The `sync_business_review_stats` DB trigger recomputes the business
    // rating from APPROVED reviews on every insert/update/delete.
    return updated;
  }

  async update(user: AuthenticatedUser, id: string, dto: UpdateReviewDto) {
    const review = await this.prismaService.review.findUnique({
      where: { id },
      select: { id: true, clientUserId: true },
    });
    if (!review) throw new NotFoundException('Review not found');
    if (review.clientUserId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You can only edit your own reviews');
    }
    // Edits re-enter moderation.
    return this.prismaService.review.update({
      where: { id },
      data: {
        ...(dto.rating !== undefined ? { rating: dto.rating } : {}),
        ...(dto.comment !== undefined ? { comment: dto.comment } : {}),
        status: 'pending',
      },
      select: REVIEW_SELECT,
    });
  }

  async remove(user: AuthenticatedUser, id: string) {
    const review = await this.prismaService.review.findUnique({
      where: { id },
      select: { id: true, clientUserId: true },
    });
    if (!review) throw new NotFoundException('Review not found');
    if (review.clientUserId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('You can only delete your own reviews');
    }
    await this.prismaService.review.delete({ where: { id } });
    return { deleted: true };
  }
}
