import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { NotificationPayload } from './notification-channel.enum';
import { NotificationService } from './notification.service';

@Processor('notifications')
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(private readonly notificationService: NotificationService) {
    super();
  }

  async process(job: Job<NotificationPayload>): Promise<void> {
    this.logger.log(`Processing job ${job.id}: ${job.name}`);

    try {
      await this.notificationService.processNotification(job.data);
      this.logger.log(`Successfully processed job ${job.id}`);
    } catch (error) {
      this.logger.error(`Failed to process job ${job.id}`, error);
      throw error;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<NotificationPayload>) {
    this.logger.log(`Job ${job.id} completed for notification type: ${job.data.type}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<NotificationPayload> | undefined, error: Error) {
    this.logger.error(`Job ${job?.id} failed: ${error.message}`);
  }

  @OnWorkerEvent('active')
  onActive(job: Job<NotificationPayload>) {
    this.logger.debug(`Processing job ${job.id} with data:`, job.data);
  }
}
