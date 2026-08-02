import { Processor, OnWorkerEvent, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { AvailabilityCacheJobData } from '../jobs/availability-cache.job';

@Processor('availability-cache')
export class AvailabilityProcessor extends WorkerHost {
  private readonly logger = new Logger(AvailabilityProcessor.name);

  async process(job: Job<AvailabilityCacheJobData>): Promise<void> {
    const { businessId, date } = job.data;

    this.logger.log(`Processing availability cache refresh for business ${businessId} (date: ${date ?? 'all'})`);

    try {
      // Simulate cache refresh logic
      // In production, this would:
      // 1. Query availability slots from the database
      // 2. Compute available time windows
      // 3. Store results in Redis cache with appropriate TTL
      await this.refreshAvailabilityCache(businessId, date);

      this.logger.log(`Availability cache refreshed for business ${businessId}`);
    } catch (error) {
      this.logger.error(
        `Failed to refresh availability cache for business ${businessId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  private async refreshAvailabilityCache(businessId: string, date?: string): Promise<void> {
    // Simulate cache computation and storage
    await new Promise((resolve) => setTimeout(resolve, 200));

    this.logger.debug(`Cache entry for business ${businessId} updated in Redis`);
  }
}
