import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, JobsOptions } from 'bullmq';
import { NotificationJobData } from './jobs/notification.job';
import { AvailabilityCacheJobData } from './jobs/availability-cache.job';
import { ScanSimulationJobData } from './jobs/scan-simulation.job';

@Injectable()
export class BullmqService {
  private readonly logger = new Logger(BullmqService.name);

  constructor(
    @InjectQueue('notifications')
    private readonly notificationQueue: Queue<NotificationJobData>,
    @InjectQueue('availability-cache')
    private readonly availabilityQueue: Queue<AvailabilityCacheJobData>,
    @InjectQueue('scan-simulation')
    private readonly scanSimulationQueue: Queue<ScanSimulationJobData>,
  ) {}

  async addNotificationJob(
    data: NotificationJobData,
    opts?: JobsOptions,
  ): Promise<string> {
    const job = await this.notificationQueue.add('send-notification', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
      ...opts,
    });
    this.logger.log(`Notification job enqueued: ${job.id}`);
    return job.id;
  }

  async addAvailabilityCacheJob(
    data: AvailabilityCacheJobData,
    opts?: JobsOptions,
  ): Promise<string> {
    const job = await this.availabilityQueue.add('refresh-availability', data, {
      attempts: 2,
      ...opts,
    });
    this.logger.log(`Availability cache job enqueued: ${job.id}`);
    return job.id;
  }

  async addScanSimulationJob(
    data: ScanSimulationJobData,
    opts?: JobsOptions,
  ): Promise<string> {
    const job = await this.scanSimulationQueue.add('simulate-scan', data, {
      attempts: 1,
      ...opts,
    });
    this.logger.log(`Scan simulation job enqueued: ${job.id}`);
    return job.id;
  }

  async getQueueMetrics(queueName: string): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  }> {
    const queue = this.resolveQueue(queueName);
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ]);
    return { waiting, active, completed, failed, delayed };
  }

  private resolveQueue(name: string): Queue {
    switch (name) {
      case 'notifications':
        return this.notificationQueue;
      case 'availability-cache':
        return this.availabilityQueue;
      case 'scan-simulation':
        return this.scanSimulationQueue;
      default:
        throw new Error(`Unknown queue: ${name}`);
    }
  }
}
