import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProviderService {
  constructor(private readonly prismaService: PrismaService) {}

  async getBusinesses() {
    return this.prismaService.business.findMany();
  }

  async getBusiness(id: number) {
    return this.prismaService.business.findUnique({ where: { id } });
  }

  async createBusiness(createBusinessDto: any) {
    return this.prismaService.business.create({ data: createBusinessDto });
  }

  async updateBusiness(id: number, updateBusinessDto: any) {
    return this.prismaService.business.update({ where: { id }, data: updateBusinessDto });
  }

  async deleteBusiness(id: number) {
    return this.prismaService.business.delete({ where: { id } });
  }
}
