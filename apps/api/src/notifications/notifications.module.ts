import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { BullModule } from '@nestjs/bull';
import { BullQueueService } from './bull-queue.service';

@Module({
  imports: [
    BullModule.registerQueue('notifications', {
      defaultJobOptions: {
        removeOnComplete: true,
      },
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, BullQueueService],
})
export class NotificationsModule {}
