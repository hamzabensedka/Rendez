import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async getServices() {
    return this.prisma.service.findMany();
  }

  async getService(id: number) {
    return this.prisma.service.findUnique({ where: { id } });
  }

  async createService(service: any) {
    return this.prisma.service.create({ data: service });
  }
}
