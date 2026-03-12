import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } from '@planity/shared';

const businessListInclude = {
  locations: true,
  _count: { select: { services: true, staff: true } },
} as const;

export type BusinessListItem = Prisma.BusinessGetPayload<{
  include: typeof businessListInclude;
}>;

export interface PaginatedBusinesses {
  data: BusinessListItem[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class BusinessesService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    city?: string,
    query?: string,
    page: number = DEFAULT_PAGE,
    limit: number = DEFAULT_LIMIT
  ): Promise<PaginatedBusinesses> {
    const safePage = Math.max(1, Math.floor(page));
    const safeLimit = Math.min(
      MAX_LIMIT,
      Math.max(1, Math.floor(limit))
    );
    const skip = (safePage - 1) * safeLimit;

    const where: Prisma.BusinessWhereInput = {
      status: 'active',
      deletedAt: null,
    };

    if (city) {
      where.locations = {
        some: {
          city: {
            contains: city,
            mode: 'insensitive',
          },
        },
      };
    }

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.business.findMany({
        where,
        include: businessListInclude,
        orderBy: { ratingAvg: 'desc' },
        skip,
        take: safeLimit,
      }),
      this.prisma.business.count({ where }),
    ]);

    return { data, total, page: safePage, limit: safeLimit };
  }

  /** UUID regex (8-4-4-4-12 hex); if not matching, treat param as slug. */
  private isUuid(id: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  }

  async findOne(idOrSlug: string) {
    const byId = this.isUuid(idOrSlug)
      ? { id: idOrSlug }
      : { slug: idOrSlug };
    const business = await this.prisma.business.findFirst({
      where: {
        ...byId,
        status: 'active',
        deletedAt: null,
      },
      include: {
        locations: true,
        services: {
          where: { isActive: true },
          include: {
            serviceVariants: true,
          },
        },
        staff: {
          where: { isActive: true },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    // Normalize location/address: add a consistent formatted address for clients
    const locations = business.locations.map((loc) => ({
      ...loc,
      address: this.formatLocationAddress(loc),
    }));

    return { ...business, locations };
  }

  /** Single-line address for display; consistent across list and detail. */
  private formatLocationAddress(loc: {
    address1: string;
    address2?: string | null;
    postalCode: string;
    city: string;
    country: string;
  }): string {
    const parts = [
      loc.address1,
      loc.address2,
      loc.postalCode,
      loc.city,
      loc.country,
    ].filter(Boolean);
    return parts.join(', ');
  }

  async create(userId: string, dto: CreateBusinessDto) {
    const slug = dto.slug || this.generateSlug(dto.name);

    return this.prisma.$transaction(async (tx) => {
      const business = await tx.business.create({
        data: {
          name: dto.name,
          slug,
          description: dto.description,
          category: dto.category,
          timezone: dto.timezone || 'Europe/Paris',
          phone: dto.phone,
          email: dto.email,
          status: 'pending',
          freeCancellationBeforeHours: dto.freeCancellationBeforeHours || 24,
          allowRescheduleBeforeHours: dto.allowRescheduleBeforeHours || 2,
          locations: dto.locations
            ? {
                create: dto.locations.map((loc) => ({
                  label: loc.label || 'Main',
                  address1: loc.address1,
                  address2: loc.address2,
                  postalCode: loc.postalCode,
                  city: loc.city,
                  country: loc.country || 'FR',
                  lat: loc.lat,
                  lng: loc.lng,
                })),
              }
            : undefined,
        },
      });

      await tx.provider.create({
        data: {
          userId,
          displayName: dto.name,
          businessId: business.id,
          isOwner: true,
        },
      });

      return business;
    });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}

