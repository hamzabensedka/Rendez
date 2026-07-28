import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { NotificationJobData } from '../jobs/notification.job';

@Processor('notifications')
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  async process(job: Job<NotificationJobData>): Promise<void> {
    const { userId, type, title, body, metadata } = job.data;

    this.logger.log(
      `Processing notification job ${job.id}: ${type} for user ${userId}`,
    );

    try {
      switch (type) {
        case 'push':
          await this.sendPushNotification(userId, title, body, metadata);
          break;
        case 'email':
          await this.sendEmailNotification(userId, title, body, metadata);
          break;
        default:
          throw new Error(`Unsupported notification type: ${type}`);
      }

      await job.updateProgress(100);
      this.logger.log(`Notification job ${job.id} completed successfully`);
    } catch (error) {
      this.logger.error(
        `Notification job ${job.id} failed: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  private async sendPushNotification(
    userId: string,
    title: string,
    body: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    // TODO: Integrate with Expo Push Notification service
    // For now, simulate push notification sending
    this.logger.log(
      `Sending push notification to user ${userId}: ${title} - ${body}`,
    );

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    this.logger.log(`Push notification sent to user ${userId}`);
  }

  private async sendEmailNotification(
    userId: string,
    title: string,
    body: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    // TODO: Integrate with email service (SendGrid, SES, etc.)
    this.logger.log(
      `Sending email notification to user ${userId}: ${title} - ${body}`,
    );

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    this.logger.log(`Email notification sent to user ${userId}`);
  }
}
