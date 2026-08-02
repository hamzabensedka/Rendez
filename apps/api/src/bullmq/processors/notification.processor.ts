import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { NotificationJobData, NOTIFICATION_JOB_NAME } from '../jobs/notification.job';

@Processor('notification')
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  async process(job: Job<NotificationJobData, void, string>): Promise<void> {
    const { userId, type, payload, channels } = job.data;

    this.logger.log(
      `Processing notification job ${job.id} for user ${userId}, type: ${type}`,
    );

    try {
      // Simulate notification sending
      const sendChannels = channels || ['push', 'email'];

      for (const channel of sendChannels) {
        await this.sendViaChannel(channel, userId, type, payload);
      }

      this.logger.log(
        `Notification job ${job.id} completed successfully for user ${userId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to process notification job ${job.id}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  private async sendViaChannel(
    channel: 'push' | 'email',
    userId: string,
    type: string,
    payload: Record<string, unknown>,
  ): Promise<void> {
    // Simulate async sending with a small delay
    await new Promise((resolve) => setTimeout(resolve, 50));

    switch (channel) {
      case 'push':
        this.logger.debug(
          `[PUSH] Sending ${type} notification to user ${userId} with payload: ${JSON.stringify(payload)}`,
        );
        break;
      case 'email':
        this.logger.debug(
          `[EMAIL] Sending ${type} notification to user ${userId} with payload: ${JSON.stringify(payload)}`,
        );
        break;
      default:
        this.logger.warn(`Unknown notification channel: ${channel}`);
    }
  }
}
