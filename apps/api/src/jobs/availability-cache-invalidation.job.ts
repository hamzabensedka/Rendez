import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { CacheService } from '../../cache/cache.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AvailabilityCacheInvalidationJob {
  constructor(
    private readonly cacheService: CacheService,
    private readonly prismaService: PrismaService
  ) {}

  async handle(job: Job) {
    const { providerId } = job.data;
    await this.cacheService.invalidate(`availability:${providerId}`);
    await this.prismaService.provider.update({
      where: { id: providerId },
      data: { availability: { invalidateCache: true } }
    });
  }
}