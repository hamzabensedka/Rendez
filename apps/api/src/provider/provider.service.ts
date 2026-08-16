import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProviderService {
  constructor(private readonly prisma: PrismaService) {}

  async getBusinesses() {
    return this.prisma.business.findMany();
  }

  async getBusiness(id: number) {
    return this.prisma.business.findUnique({ where: { id } });
  }

  async createBusiness(business: any) {
    return this.prisma.business.create({ data: business });
  }
}
