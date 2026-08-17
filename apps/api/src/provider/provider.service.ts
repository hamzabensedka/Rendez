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

  async createBusiness(createBusinessDto: any) {
    return this.prisma.business.create({ data: createBusinessDto });
  }

  async updateBusiness(id: number, updateBusinessDto: any) {
    return this.prisma.business.update({ where: { id }, data: updateBusinessDto });
  }

  async deleteBusiness(id: number) {
    return this.prisma.business.delete({ where: { id } });
  }
}