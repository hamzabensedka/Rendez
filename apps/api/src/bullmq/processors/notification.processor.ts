import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { NotificationJobData } from '../jobs/notification.job';

@Processor('notifications')
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  async process(job: Job<NotificationJobData>): Promise<void> {
    const { userId, title, body, data } = job.data;

    this.logger.log(
      `Processing notification job ${job.id} for user ${userId}: ${title}`,
    );

    // Simulate push notification delivery
    // In production, integrate with Expo Push API or Firebase Cloud Messaging
    try {
      // Simulate async delivery delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      this.logger.log(
        `Notification sent to user ${userId}: ${title} - ${body}`,
      );

      // Log success metrics
      this.logger.debug(`Notification payload: ${JSON.stringify(data)}`);
    } catch (error) {
      this.logger.error(
        `Failed to send notification to user ${userId}: ${error.message}`,
        error.stack,
      );
      throw error; // BullMQ will handle retry based on job options
    }
  }
}
