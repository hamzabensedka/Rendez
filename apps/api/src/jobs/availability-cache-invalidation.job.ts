import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../cache/cache.service';

@Injectable()
export class AvailabilityCacheInvalidationJob {
  constructor(
    @InjectQueue('availability-cache-invalidation') private readonly queue: Queue,
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService
  ) {}

  async handle(job: any) {
    const { businessId } = job.data;
    await this.cacheService.invalidateAvailabilityCache(businessId);
  }
}