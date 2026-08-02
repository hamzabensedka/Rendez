import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import {
  AvailabilityCacheJobData,
  AVAILABILITY_CACHE_JOB_NAME,
} from '../jobs/availability-cache.job';

@Processor('availability-cache')
export class AvailabilityProcessor extends WorkerHost {
  private readonly logger = new Logger(AvailabilityProcessor.name);

  async process(job: Job<AvailabilityCacheJobData, void, string>): Promise<void> {
    const { businessId, date, force } = job.data;

    this.logger.log(
      `Processing availability cache refresh job ${job.id} for business ${businessId}, date: ${date || 'all'}, force: ${force || false}`,
    );

    try {
      // Simulate cache refresh operation
      await new Promise((resolve) => setTimeout(resolve, 100));

      // In production, this would:
      // 1. Fetch availability slots from PostgreSQL
      // 2. Compute available slots
      // 3. Store in Redis cache with appropriate TTL

      this.logger.log(
        `Availability cache refresh job ${job.id} completed for business ${businessId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to process availability cache refresh job ${job.id}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
