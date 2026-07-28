import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { NotificationJobData } from './jobs/notification.job';
import { AvailabilityCacheJobData } from './jobs/availability-cache.job';
import { ScanSimulationJobData } from './jobs/scan-simulation.job';

@Injectable()
export class BullMqService {
  private readonly logger = new Logger(BullMqService.name);

  constructor(
    @InjectQueue('notifications') private readonly notificationQueue: Queue,
    @InjectQueue('availability-cache') private readonly availabilityCacheQueue: Queue,
    @InjectQueue('scan-simulation') private readonly scanSimulationQueue: Queue,
  ) {}

  async addNotificationJob(data: NotificationJobData): Promise<string> {
    this.logger.log(`Adding notification job for user ${data.userId}`);
    const job = await this.notificationQueue.add('send-notification', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });
    return job.id as string;
  }

  async addAvailabilityCacheRefreshJob(data: AvailabilityCacheJobData): Promise<string> {
    this.logger.log(`Adding availability cache refresh job for business ${data.businessId}`);
    const job = await this.availabilityCacheQueue.add('refresh-availability-cache', data, {
      attempts: 2,
      backoff: { type: 'fixed', delay: 5000 },
    });
    return job.id as string;
  }

  async addScanSimulationJob(data: ScanSimulationJobData): Promise<string> {
    this.logger.log(`Adding scan simulation job for business ${data.businessId}`);
    const job = await this.scanSimulationQueue.add('run-scan-simulation', data, {
      attempts: 1,
      removeOnComplete: 50,
    });
    return job.id as string;
  }

  async getJobStatus(queueName: string, jobId: string) {
    const queue = this.getQueueByName(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }
    const job = await queue.getJob(jobId);
    if (!job) {
      return null;
    }
    return {
      id: job.id,
      name: job.name,
      status: await job.getState(),
      progress: job.progress,
      data: job.data,
      failedReason: job.failedReason,
    };
  }

  private getQueueByName(name: string): Queue | undefined {
    switch (name) {
      case 'notifications':
        return this.notificationQueue;
      case 'availability-cache':
        return this.availabilityCacheQueue;
      case 'scan-simulation':
        return this.scanSimulationQueue;
      default:
        return undefined;
    }
  }
}
