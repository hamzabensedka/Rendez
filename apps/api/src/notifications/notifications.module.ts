import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsService } from './notifications.service';
import { NotificationProcessor, NOTIFICATION_QUEUE } from './notification.processor';
import { EmailService } from './email/email.service';
import { PushService } from './push/push.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: NOTIFICATION_QUEUE,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: 100,
        removeOnFail: 1000,
      },
    }),
  ],
  providers: [
    NotificationsService,
    NotificationProcessor,
    EmailService,
    PushService,
  ],
  exports: [
    NotificationsService,
    NOTIFICATION_QUEUE,
  ],
})
export class NotificationsModule {}
