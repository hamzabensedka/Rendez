import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { NotificationService, NOTIFICATION_QUEUE } from './notification.service';
import { NotificationProcessor } from './notification.processor';
import { NotificationsController } from './notifications.controller';
import { EMAIL_PROVIDER, EmailProvider } from './providers/email.provider';
import { ResendProvider } from './providers/resend.provider';
import { PUSH_PROVIDER, ExpoPushProvider } from './providers/push.provider';

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
        removeOnFail: 50,
      },
    }),
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationService,
    NotificationProcessor,
    {
      provide: EMAIL_PROVIDER,
      useClass: ResendProvider,
    },
    {
      provide: PUSH_PROVIDER,
      useClass: ExpoPushProvider,
    },
  ],
  exports: [NotificationService],
})
export class NotificationsModule {}
