import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, Job } from 'bullmq';
import { NotificationJobData } from './jobs/notification.job';
import { AvailabilityCacheJobData } from './jobs/availability-cache.job';
import { ScanSimulationJobData } from './jobs/scan-simulation.job';

@Injectable()
export class BullmqService {
  private readonly logger = new Logger(BullmqService.name);

  constructor(
    @InjectQueue('notification') private readonly notificationQueue: Queue<NotificationJobData>,
    @InjectQueue('availability-cache') private readonly availabilityCacheQueue: Queue<AvailabilityCacheJobData>,
    @InjectQueue('scan-simulation') private readonly scanSimulationQueue: Queue<ScanSimulationJobData>,
  ) {}

  async addNotificationJob(data: NotificationJobData): Promise<Job<NotificationJobData>> {
    this.logger.log(`Adding notification job for user ${data.userId}`);
    return this.notificationQueue.add('send-notification', data, {
      jobId: `notification-${data.userId}-${data.type}-${Date.now()}`,
    });
  }

  async addAvailabilityCacheRefreshJob(data: AvailabilityCacheJobData): Promise<Job<AvailabilityCacheJobData>> {
    this.logger.log(`Adding availability cache refresh job for business ${data.businessId}`);
    return this.availabilityCacheQueue.add('refresh-availability-cache', data, {
      jobId: `availability-cache-${data.businessId}-${data.date ?? 'all'}`,
    });
  }

  async addScanSimulationJob(data: ScanSimulationJobData): Promise<Job<ScanSimulationJobData>> {
    this.logger.log(`Adding scan simulation job for business ${data.businessId}`);
    return this.scanSimulationQueue.add('run-scan-simulation', data, {
      jobId: `scan-sim-${data.businessId}-${Date.now()}`,
    });
  }

  async getQueueMetrics(queueName: string): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  }> {
    const queue = this.getQueueByName(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ]);
    return { waiting, active, completed, failed, delayed };
  }

  private getQueueByName(name: string): Queue | null {
    switch (name) {
      case 'notification':
        return this.notificationQueue;
      case 'availability-cache':
        return this.availabilityCacheQueue;
      case 'scan-simulation':
        return this.scanSimulationQueue;
      default:
        return null;
    }
  }
}
