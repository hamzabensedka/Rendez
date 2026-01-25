import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';

@Injectable()
export class BusinessesService {
  constructor(private prisma: PrismaService) {}

  async findAll(city?: string, query?: string) {
    const where: any = {
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

    return this.prisma.business.findMany({
      where,
      include: {
        locations: true,
        _count: {
          select: {
            services: true,
            staff: true,
          },
        },
      },
      orderBy: {
        ratingAvg: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const business = await this.prisma.business.findUnique({
      where: { id },
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

    if (!business || business.deletedAt) {
      throw new NotFoundException('Business not found');
    }

    return business;
  }

  async create(userId: string, dto: CreateBusinessDto) {
    const slug = dto.slug || this.generateSlug(dto.name);

    const business = await this.prisma.business.create({
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

    // Create provider profile
    await this.prisma.provider.create({
      data: {
        userId,
        displayName: dto.name,
        businessId: business.id,
        isOwner: true,
      },
    });

    return business;
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}

