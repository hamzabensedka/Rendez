import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { QUEUE_NAMES } from '../bullmq.module';
import { AvailabilityCacheJobData } from '../jobs/availability-cache.job';

@Processor(QUEUE_NAMES.AVAILABILITY_CACHE)
export class AvailabilityProcessor extends WorkerHost {
  private readonly logger = new Logger(AvailabilityProcessor.name);

  async process(job: Job<AvailabilityCacheJobData>): Promise<void> {
    this.logger.log(`Processing availability cache refresh for business ${job.data.businessId}`);

    const { businessId, date } = job.data;

    // Simulate cache refresh logic
    // In production, this would query the database and update Redis cache
    await this.refreshCache(businessId, date);

    this.logger.log(`Availability cache refreshed for business ${businessId}`);
  }

  private async refreshCache(businessId: string, date?: string): Promise<void> {
    // Simulate cache refresh delay
    await new Promise((resolve) => setTimeout(resolve, 200));
    this.logger.debug(`Cache refreshed for business ${businessId} on ${date || 'all dates'}`);
  }
}
