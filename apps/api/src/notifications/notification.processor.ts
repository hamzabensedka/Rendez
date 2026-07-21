import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { NotificationService, NOTIFICATION_QUEUE } from './notification.service';
import { SendNotificationDto } from './dto/send-notification.dto';

@Processor(NOTIFICATION_QUEUE)
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(private readonly notificationService: NotificationService) {
    super();
  }

  async process(job: Job<SendNotificationDto>): Promise<boolean> {
    this.logger.log(`Processing notification job ${job.id} (${job.name})`);
    this.logger.debug(`Job data: ${JSON.stringify(job.data)}`);

    try {
      const result = await this.notificationService.processNotification(job.data);
      
      if (result) {
        this.logger.log(`Notification job ${job.id} completed successfully`);
      } else {
        this.logger.warn(`Notification job ${job.id} completed with issues`);
      }

      return result;
    } catch (error) {
      this.logger.error(`Notification job ${job.id} failed: ${error}`);
      throw error;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<SendNotificationDto>) {
    this.logger.log(`Job ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<SendNotificationDto> | undefined, error: Error) {
    this.logger.error(`Job ${job?.id} failed: ${error.message}`);
  }

  @OnWorkerEvent('active')
  onActive(job: Job<SendNotificationDto>) {
    this.logger.debug(`Job ${job.id} is now active`);
  }
}
