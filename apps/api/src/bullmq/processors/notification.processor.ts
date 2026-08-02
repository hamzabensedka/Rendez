import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { NotificationJobData } from '../jobs/notification.job';

@Processor('notification')
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  async process(job: Job<NotificationJobData>): Promise<void> {
    const { userId, type, title, body, data } = job.data;

    this.logger.log(`Processing notification job ${job.id} for user ${userId} (type: ${type})`);

    try {
      // Simulate push notification sending
      // In production, this would integrate with Expo Push API, Firebase, or similar
      await this.sendPushNotification(userId, title, body, data);

      this.logger.log(`Successfully sent ${type} notification to user ${userId}`);
    } catch (error) {
      this.logger.error(
        `Failed to send notification to user ${userId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error; // Let BullMQ handle retries
    }
  }

  private async sendPushNotification(
    userId: string,
    title: string,
    body: string,
    data?: Record<string, unknown>,
  ): Promise<void> {
    // Simulate async push notification delivery
    // In production: fetch user's Expo push tokens from DB and call Expo Push API
    await new Promise((resolve) => setTimeout(resolve, 100));
    this.logger.debug(`Push notification delivered to user ${userId}: ${title}`);
  }
}
