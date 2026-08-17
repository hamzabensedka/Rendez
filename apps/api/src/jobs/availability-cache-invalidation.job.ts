import { Processor, Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class AvailabilityCacheInvalidationJob {
  constructor(
    private readonly cacheService: CacheService,
  ) {}

  @Processor('availability-cache-invalidation')
  async handle(job: Job) {
    const availabilityId = job.data.availabilityId;
    await this.cacheService.invalidateAvailabilityCache(availabilityId);
  }
}