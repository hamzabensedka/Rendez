import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { NotificationService } from './notification.service';
import { NotificationProcessor } from './notification.processor';
import { EmailService } from './email.service';
import { PushService } from './push.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notifications',
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    }),
  ],
  providers: [NotificationService, NotificationProcessor, EmailService, PushService],
  exports: [NotificationService],
})
export class NotificationModule {}
