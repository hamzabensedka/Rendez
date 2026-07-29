import { Injectable } from '@nestjs/common';
import { BullQueue, BullWorker } from 'bull-queue';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { NotificationJob } from './jobs/notification.job';
import { AvailabilityCacheJob } from './jobs/availability-cache.job';
import { ScanSimulationJob } from './jobs/scan-simulation.job';

@Injectable()
export class BullMqService {
  private readonly notificationQueue: BullQueue;
  private readonly availabilityCacheQueue: BullQueue;
  private readonly scanSimulationQueue: BullQueue;

  constructor(private readonly prismaService: PrismaService, private readonly redisService: RedisService) {
    this.notificationQueue = new BullQueue('notifications', {
      redis: {
        host: 'localhost',
        port: 6379,
      },
    });

    this.availabilityCacheQueue = new BullQueue('availability-cache', {
      redis: {
        host: 'localhost',
        port: 6379,
      },
    });

    this.scanSimulationQueue = new BullQueue('scan-simulation', {
      redis: {
        host: 'localhost',
        port: 6379,
      },
    });
  }

  async processNotificationJobs() {
    await this.notificationQueue.process(async (job) => {
      const notificationJob = new NotificationJob(this.prismaService, this.redisService);
      await notificationJob.execute(job.data);
    });
  }

  async processAvailabilityCacheJobs() {
    await this.availabilityCacheQueue.process(async (job) => {
      const availabilityCacheJob = new AvailabilityCacheJob(this.prismaService, this.redisService);
      await availabilityCacheJob.execute(job.data);
    });
  }

  async processScanSimulationJobs() {
    await this.scanSimulationQueue.process(async (job) => {
      const scanSimulationJob = new ScanSimulationJob(this.prismaService, this.redisService);
      await scanSimulationJob.execute(job.data);
    });
  }
}
