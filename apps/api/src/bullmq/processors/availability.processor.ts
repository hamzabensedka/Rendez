import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { AvailabilityCacheJobData } from '../jobs/availability-cache.job';

@Processor('availability-cache')
export class AvailabilityProcessor extends WorkerHost {
  private readonly logger = new Logger(AvailabilityProcessor.name);

  async process(job: Job<AvailabilityCacheJobData>): Promise<void> {
    const { businessId, date } = job.data;

    this.logger.log(
      `Processing availability cache refresh for business ${businessId} on ${date}`,
    );

    try {
      // Simulate cache refresh logic
      // In production, fetch availability from DB and update Redis cache
      await new Promise((resolve) => setTimeout(resolve, 300));

      this.logger.log(
        `Availability cache refreshed for business ${businessId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to refresh availability cache for business ${businessId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
