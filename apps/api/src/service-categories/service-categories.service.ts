import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServiceCategoriesService {
  constructor(private prisma: PrismaService) {}

  async listOrdered() {
    return this.prisma.serviceCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      select: { slug: true, label: true, sortOrder: true },
    });
  }
}
