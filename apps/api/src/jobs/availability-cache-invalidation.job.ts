import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AvailabilityCacheInvalidationJob {
  constructor(private readonly prisma: PrismaService) {}

  async execute() {
    // Implement logic to invalidate availability cache using Prisma
    await this.prisma.$queryRaw`UPDATE availability SET cache = NULL`;
  }
}