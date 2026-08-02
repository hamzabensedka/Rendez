import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { QUEUE_NAMES } from '../bullmq.module';
import { NotificationJobData } from '../jobs/notification.job';

@Processor(QUEUE_NAMES.NOTIFICATION)
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  async process(job: Job<NotificationJobData>): Promise<void> {
    this.logger.log(`Processing notification job ${job.id} for user ${job.data.userId}`);

    const { userId, type, payload } = job.data;

    // Simulate push notification sending
    this.logger.log(`Sending ${type} notification to user ${userId}: ${JSON.stringify(payload)}`);

    // In production, this would call Expo Push API, Firebase, or email service
    await this.simulateSend(userId, type, payload);

    this.logger.log(`Notification job ${job.id} completed successfully`);
  }

  private async simulateSend(userId: string, type: string, payload: Record<string, unknown>): Promise<void> {
    // Simulate async delivery delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    this.logger.debug(`Simulated delivery to ${userId}: ${type} - ${JSON.stringify(payload)}`);
  }
}
