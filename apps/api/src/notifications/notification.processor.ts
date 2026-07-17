import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { NotificationService } from './notification.service';
import { SendNotificationDto } from './dto/send-notification.dto';

@Processor('notifications')
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(private readonly notificationService: NotificationService) {
    super();
  }

  async process(job: Job<SendNotificationDto>): Promise<void> {
    this.logger.log(`Processing notification job ${job.id}, type: ${job.data.type}`);

    try {
      await this.notificationService.processNotification(job.data);
      this.logger.log(`Notification job ${job.id} completed successfully`);
    } catch (error) {
      this.logger.error(`Notification job ${job.id} failed: ${error.message}`);
      throw error;
    }
  }
}
