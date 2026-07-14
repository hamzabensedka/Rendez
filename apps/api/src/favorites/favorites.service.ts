import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface FavoriteItem {
  businessId: string;
  businessName?: string;
  createdAt: Date;
}

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string): Promise<FavoriteItem[]> {
    const rows = await this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        business: { select: { id: true, name: true } },
      },
    });
    return rows.map((r) => ({
      businessId: r.businessId,
      businessName: r.business.name,
      createdAt: r.createdAt,
    }));
  }

  async add(userId: string, businessId: string): Promise<{ businessId: string }> {
    const business = await this.prisma.business.findFirst({
      where: { id: businessId, deletedAt: null },
    });
    if (!business) {
      throw new NotFoundException('Business not found');
    }
    await this.prisma.favorite.upsert({
      where: {
        userId_businessId: { userId, businessId },
      },
      create: { userId, businessId },
      update: {},
    });
    return { businessId };
  }

  async remove(userId: string, businessId: string): Promise<void> {
    await this.prisma.favorite.deleteMany({
      where: { userId, businessId },
    });
  }
}
