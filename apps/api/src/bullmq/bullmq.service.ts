import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { ReminderEmailJob } from '../jobs/reminder-email.job';
import { AvailabilityCacheInvalidationJob } from '../jobs/availability-cache-invalidation.job';

@Injectable()
export class BullMqService {
  private readonly reminderEmailQueue: Queue<ReminderEmailJob>;
  private readonly availabilityCacheInvalidationQueue: Queue<AvailabilityCacheInvalidationJob>;

  constructor() {
    this.reminderEmailQueue = new Queue<ReminderEmailJob>('reminder-email', {
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT)
      }
    });

    this.availabilityCacheInvalidationQueue = new Queue<AvailabilityCacheInvalidationJob>('availability-cache-invalidation', {
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT)
      }
    });
  }

  async addReminderEmailJob(appointmentId: number) {
    await this.reminderEmailQueue.add({ appointmentId });
  }

  async addAvailabilityCacheInvalidationJob(providerId: number) {
    await this.availabilityCacheInvalidationQueue.add({ providerId });
  }
}