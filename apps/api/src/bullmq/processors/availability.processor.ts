import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger, Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AvailabilityCacheJobData } from '../jobs/availability-cache.job';
import { PrismaService } from '../../prisma/prisma.service';

@Processor('availability-cache')
export class AvailabilityProcessor extends WorkerHost {
  private readonly logger = new Logger(AvailabilityProcessor.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async process(job: Job<AvailabilityCacheJobData>): Promise<void> {
    const { businessId, serviceId, forceRefresh } = job.data;

    this.logger.log(
      `Processing availability cache refresh for business ${businessId}, service ${serviceId || 'all'}`,
    );

    try {
      const cacheKey = serviceId
        ? `availability:${businessId}:${serviceId}`
        : `availability:${businessId}`;

      // Check if cache exists and force refresh is not requested
      if (!forceRefresh) {
        const cachedData = await this.cacheManager.get(cacheKey);
        if (cachedData) {
          this.logger.log(`Cache hit for ${cacheKey}, skipping refresh`);
          return;
        }
      }

      // Fetch availability data from database
      const whereClause: any = { businessId };
      if (serviceId) {
        whereClause.serviceId = serviceId;
      }

      const availabilities = await this.prisma.availability.findMany({
        where: whereClause,
        include: {
          business: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Cache the availability data with TTL of 5 minutes
      await this.cacheManager.set(cacheKey, availabilities, 300000);

      await job.updateProgress(100);
      this.logger.log(
        `Availability cache refreshed for ${cacheKey}: ${availabilities.length} records`,
      );
    } catch (error) {
      this.logger.error(
        `Availability cache refresh failed for business ${businessId}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
