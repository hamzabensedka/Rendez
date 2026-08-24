import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export interface AdminAppointmentQuery {
  businessId?: string;
  status?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async listAppointments(query: AdminAppointmentQuery) {
    const take = Math.min(
      Math.max(Math.trunc(query.limit ?? DEFAULT_PAGE_SIZE) || DEFAULT_PAGE_SIZE, 1),
      MAX_PAGE_SIZE
    );
    const skip = Math.max(((query.page ?? 1) - 1) * take, 0);

    const where = {
      ...(query.businessId ? { businessId: query.businessId } : {}),
      ...(query.status ? { status: query.status as never } : {}),
      ...(query.from || query.to
        ? {
            startAtUtc: {
              ...(query.from ? { gte: new Date(query.from) } : {}),
              ...(query.to ? { lte: new Date(query.to) } : {}),
            },
          }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.appointment.findMany({
        where,
        orderBy: { startAtUtc: 'desc' },
        take,
        skip,
        include: {
          clientUser: { select: { id: true, name: true, email: true } },
          business: { select: { id: true, name: true } },
          staff: { select: { id: true, name: true } },
          appointmentItems: {
            include: { serviceVariant: { select: { id: true, name: true } } },
          },
        },
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return { data, meta: { page: skip / take + 1, limit: take, total } };
  }

  /** Businesses for admin tables (includes non-active rows, unlike public listings). */
  async listBusinesses(page = 1, limit = DEFAULT_PAGE_SIZE) {
    const take = Math.min(
      Math.max(Math.trunc(limit ?? DEFAULT_PAGE_SIZE) || DEFAULT_PAGE_SIZE, 1),
      MAX_PAGE_SIZE
    );
    const skip = Math.max(((page ?? 1) - 1) * take, 0);

    const [data, total] = await this.prisma.$transaction([
      this.prisma.business.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          category: true,
          ratingAvg: true,
          ratingCount: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      this.prisma.business.count(),
    ]);

    return { data, meta: { page: skip / take + 1, limit: take, total } };
  }
}
