import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { NotificationsService } from './notifications.service';
import { NotificationChannel, NotificationType } from './notification-channel.enum';
import { SendNotificationDto, BookingNotificationData } from './dto/send-notification.dto';

export const NOTIFICATION_QUEUE = 'notifications';

export interface NotificationJobData {
  channel: NotificationChannel;
  type: NotificationType;
  email: string;
  pushToken?: string;
  userId: number;
  data: BookingNotificationData;
}

@Processor(NOTIFICATION_QUEUE)
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(
    private readonly notificationsService: NotificationsService,
  ) {
    super();
  }

  async process(job: Job<NotificationJobData>): Promise<void> {
    this.logger.log(`Processing notification job ${job.id} of type ${job.data.type}`);

    const { channel, type, email, pushToken, userId, data } = job.data;

    await this.notificationsService.sendNotification({
      channel,
      type,
      email,
      pushToken,
      userId,
      data,
    });

    this.logger.log(`Notification job ${job.id} completed successfully`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<NotificationJobData>) {
    this.logger.log(`Job ${job.id} completed for user ${job.data.userId}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<NotificationJobData>, error: Error) {
    this.logger.error(`Job ${job.id} failed: ${error.message}`);
  }
}
