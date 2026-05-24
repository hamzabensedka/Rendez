import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DateTime } from 'luxon';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } from '@planity/shared';

/** Max businesses returned per viewport request (progressive loading). */
const VIEWPORT_MAX = 200;

/** Viewport query: north, south, east, west in degrees; zoom for optional clustering. */
export interface ViewportParams {
  north: number;
  south: number;
  east: number;
  west: number;
  zoom?: number;
  query?: string;
  /** @deprecated prefer categories */
  category?: string;
  /** Comma-separated category slugs */
  categories?: string;
  availDate?: string;
}

export interface ReviewListItem {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  clientName: string;
}

export interface PaginatedReviews {
  data: ReviewListItem[];
  total: number;
  page: number;
  limit: number;
  ratingAvg: number;
  ratingCount: number;
}

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

const DEFAULT_NEAR_RADIUS_KM = 20;

export interface FindAllBusinessesFilters {
  city?: string;
  query?: string;
  /** Comma-separated category slugs (OR match on business.category) */
  categories?: string;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  /** ISO date YYYY-MM-DD — businesses with a rule that day (Europe/Paris weekday) */
  availDate?: string;
}

function geoBoundingBox(lat: number, lng: number, radiusKm: number) {
  const R = 6371;
  const rad = Math.PI / 180;
  const dLat = (radiusKm / R) * (180 / Math.PI);
  const cosLat = Math.cos(lat * rad);
  const dLng = cosLat > 1e-6 ? (radiusKm / (R * cosLat)) * (180 / Math.PI) : 180;
  return {
    latMin: lat - dLat,
    latMax: lat + dLat,
    lngMin: lng - dLng,
    lngMax: lng + dLng,
  };
}

@Injectable()
export class BusinessesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Return businesses with at least one location inside the viewport bounds.
   * Uses PostGIS when available (geom column), otherwise falls back to lat/lng bbox.
   */
  async findInViewport(params: ViewportParams): Promise<{ data: BusinessListItem[] }> {
    const { north, south, east, west, query, category, categories, availDate } = params;
    const where: Prisma.BusinessWhereInput = {
      status: 'active',
      deletedAt: null,
      locations: {
        some: {
          lat: { gte: south, lte: north },
          lng: { gte: west, lte: east },
        },
      },
    };
    const slugList = categories
      ?.split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (slugList?.length) {
      where.category = { in: slugList, mode: 'insensitive' };
    } else if (category) {
      where.category = { contains: category, mode: 'insensitive' };
    }
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
      ];
    }
    if (availDate?.trim()) {
      const dt = DateTime.fromISO(availDate.trim(), { zone: 'Europe/Paris' });
      if (dt.isValid) {
        const dayOfWeek = dt.weekday % 7;
        where.AND = [
          {
            availabilityRules: {
              some: { dayOfWeek },
            },
          },
          {
            services: {
              some: {
                isActive: true,
                serviceVariants: { some: {} },
              },
            },
          },
        ];
      }
    }
    const data = await this.prisma.business.findMany({
      where,
      include: businessListInclude,
      orderBy: { ratingAvg: 'desc' },
      take: VIEWPORT_MAX,
    });
    return { data };
  }

  async findAll(
    city?: string,
    query?: string,
    page: number = DEFAULT_PAGE,
    limit: number = DEFAULT_LIMIT,
    extra?: FindAllBusinessesFilters
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

    const cityFilter = city?.trim();
    let bbox: ReturnType<typeof geoBoundingBox> | undefined;
    if (
      extra?.lat != null &&
      extra?.lng != null &&
      !Number.isNaN(extra.lat) &&
      !Number.isNaN(extra.lng)
    ) {
      const r = extra.radiusKm ?? DEFAULT_NEAR_RADIUS_KM;
      const radiusKm = r > 0 && r < 500 ? r : DEFAULT_NEAR_RADIUS_KM;
      bbox = geoBoundingBox(extra.lat, extra.lng, radiusKm);
    }

    const locationConditions: Prisma.LocationWhereInput[] = [];
    if (cityFilter) {
      locationConditions.push({
        city: { contains: cityFilter, mode: 'insensitive' },
      });
    }
    if (bbox) {
      locationConditions.push({
        AND: [
          { lat: { not: null } },
          { lng: { not: null } },
          { lat: { gte: bbox.latMin, lte: bbox.latMax } },
          { lng: { gte: bbox.lngMin, lte: bbox.lngMax } },
        ],
      });
    }
    if (locationConditions.length === 1) {
      where.locations = { some: locationConditions[0] };
    } else if (locationConditions.length > 1) {
      where.locations = { some: { AND: locationConditions } };
    }

    if (query?.trim()) {
      const q = query.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { category: { contains: q, mode: 'insensitive' } },
      ];
    }

    const slugList = extra?.categories
      ?.split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (slugList?.length) {
      where.category = { in: slugList, mode: 'insensitive' };
    }

    if (extra?.availDate?.trim()) {
      const dt = DateTime.fromISO(extra.availDate.trim(), { zone: 'Europe/Paris' });
      if (dt.isValid) {
        const dayOfWeek = dt.weekday % 7;
        const dateConditions: Prisma.BusinessWhereInput[] = [
          {
            availabilityRules: {
              some: { dayOfWeek },
            },
          },
          {
            services: {
              some: {
                isActive: true,
                serviceVariants: { some: {} },
              },
            },
          },
        ];
        where.AND = Array.isArray(where.AND)
          ? [...where.AND, ...dateConditions]
          : dateConditions;
      }
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
    return this.prisma.$transaction(async (tx) => {
      const slug = await this.generateUniqueSlug(tx, dto.name, dto.slug);

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

  private slugify(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private async generateUniqueSlug(
    tx: Prisma.TransactionClient,
    name: string,
    explicitSlug?: string | null
  ): Promise<string> {
    let base = explicitSlug?.trim()
      ? this.slugify(explicitSlug)
      : this.slugify(name);
    if (!base) base = 'business';
    let slug = base;
    let n = 0;
    while (
      await tx.business.findFirst({
        where: { slug },
        select: { id: true },
      })
    ) {
      n += 1;
      slug = `${base}-${n}`;
    }
    return slug;
  }

  /** Resolve active business id from UUID or slug (minimal query). */
  private async resolveActiveBusinessId(idOrSlug: string): Promise<string> {
    const byId = this.isUuid(idOrSlug)
      ? { id: idOrSlug }
      : { slug: idOrSlug };
    const row = await this.prisma.business.findFirst({
      where: {
        ...byId,
        status: 'active',
        deletedAt: null,
      },
      select: { id: true },
    });
    if (!row) {
      throw new NotFoundException('Business not found');
    }
    return row.id;
  }

  async listServicesForBusiness(idOrSlug: string) {
    const businessId = await this.resolveActiveBusinessId(idOrSlug);
    return this.prisma.service.findMany({
      where: { businessId, isActive: true },
      include: {
        serviceVariants: true,
      },
    });
  }

  async listStaffForBusiness(idOrSlug: string) {
    const businessId = await this.resolveActiveBusinessId(idOrSlug);
    return this.prisma.staff.findMany({
      where: { businessId, isActive: true },
    });
  }

  async getReviews(
    businessIdOrSlug: string,
    page: number = DEFAULT_PAGE,
    limit: number = Math.min(20, MAX_LIMIT)
  ): Promise<PaginatedReviews> {
    const byId = this.isUuid(businessIdOrSlug)
      ? { id: businessIdOrSlug }
      : { slug: businessIdOrSlug };
    const summary = await this.prisma.business.findFirst({
      where: {
        ...byId,
        status: 'active',
        deletedAt: null,
      },
      select: { id: true, ratingAvg: true, ratingCount: true },
    });
    if (!summary) {
      throw new NotFoundException('Business not found');
    }
    const businessId = summary.id;
    const safePage = Math.max(1, Math.floor(page));
    const safeLimit = Math.min(MAX_LIMIT, Math.max(1, Math.floor(limit)));
    const skip = (safePage - 1) * safeLimit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { businessId, status: 'approved' },
        orderBy: { createdAt: 'desc' },
        skip,
        take: safeLimit,
        include: {
          clientUser: { select: { name: true } },
        },
      }),
      this.prisma.review.count({ where: { businessId, status: 'approved' } }),
    ]);

    const data: ReviewListItem[] = reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      clientName: r.clientUser?.name ?? 'Anonymous',
    }));

    return {
      data,
      total,
      page: safePage,
      limit: safeLimit,
      ratingAvg: summary.ratingAvg ?? 0,
      ratingCount: summary.ratingCount ?? 0,
    };
  }
}

