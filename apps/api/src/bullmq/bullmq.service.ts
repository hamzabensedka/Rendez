import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUE_NAMES } from './bullmq.module';
import { NotificationJobData } from './jobs/notification.job';
import { AvailabilityCacheJobData } from './jobs/availability-cache.job';
import { ScanSimulationJobData } from './jobs/scan-simulation.job';

@Injectable()
export class BullmqService {
  private readonly logger = new Logger(BullmqService.name);

  constructor(
    @InjectQueue(QUEUE_NAMES.NOTIFICATION) private readonly notificationQueue: Queue<NotificationJobData>,
    @InjectQueue(QUEUE_NAMES.AVAILABILITY_CACHE) private readonly availabilityQueue: Queue<AvailabilityCacheJobData>,
    @InjectQueue(QUEUE_NAMES.SCAN_SIMULATION) private readonly scanSimulationQueue: Queue<ScanSimulationJobData>,
  ) {}

  async addNotificationJob(data: NotificationJobData): Promise<string> {
    this.logger.log(`Enqueuing notification job for user ${data.userId}`);
    const job = await this.notificationQueue.add('send-notification', data);
    this.logger.log(`Notification job ${job.id} enqueued`);
    return job.id ?? '';
  }

  async addAvailabilityCacheRefreshJob(data: AvailabilityCacheJobData): Promise<string> {
    this.logger.log(`Enqueuing availability cache refresh for business ${data.businessId}`);
    const job = await this.availabilityQueue.add('refresh-availability-cache', data);
    this.logger.log(`Availability cache job ${job.id} enqueued`);
    return job.id ?? '';
  }

  async addScanSimulationJob(data: ScanSimulationJobData): Promise<string> {
    this.logger.log(`Enqueuing scan simulation for business ${data.businessId}`);
    const job = await this.scanSimulationQueue.add('run-scan-simulation', data);
    this.logger.log(`Scan simulation job ${job.id} enqueued`);
    return job.id ?? '';
  }

  async getQueueMetrics(): Promise<Record<string, unknown>> {
    const [notificationCounts, availabilityCounts, scanCounts] = await Promise.all([
      this.notificationQueue.getJobCounts(),
      this.availabilityQueue.getJobCounts(),
      this.scanSimulationQueue.getJobCounts(),
    ]);

    return {
      notification: notificationCounts,
      availability: availabilityCounts,
      scanSimulation: scanCounts,
    };
  }
}
