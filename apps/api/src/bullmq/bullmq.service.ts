import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
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

  async addNotificationJob(data: NotificationJobData): Promise<string> {
    const job = await this.notificationQueue.add('send-notification', data);
    this.logger.log(`Notification job ${job.id} added to queue`);
    return job.id;
  }

  async addAvailabilityCacheRefreshJob(data: AvailabilityCacheJobData): Promise<string> {
    const job = await this.availabilityCacheQueue.add('refresh-availability-cache', data);
    this.logger.log(`Availability cache refresh job ${job.id} added to queue`);
    return job.id;
  }

  async addScanSimulationJob(data: ScanSimulationJobData): Promise<string> {
    const job = await this.scanSimulationQueue.add('run-scan-simulation', data);
    this.logger.log(`Scan simulation job ${job.id} added to queue`);
    return job.id;
  }

  async getQueueMetrics(queueName: string): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  }> {
    const queue = this.getQueueByName(queueName);
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ]);
    return { waiting, active, completed, failed, delayed };
  }

  private getQueueByName(name: string): Queue {
    switch (name) {
      case 'notification':
        return this.notificationQueue;
      case 'availability-cache':
        return this.availabilityCacheQueue;
      case 'scan-simulation':
        return this.scanSimulationQueue;
      default:
        throw new Error(`Unknown queue: ${name}`);
    }
  }
}
