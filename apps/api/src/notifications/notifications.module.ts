import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { BullModule } from '@nestjs/bull';
import { QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.registerQueue('notifications', {
      defaultJobOptions: {
        removeOnComplete: true,
      },
    }),
  ],
  providers: [NotificationsService, QueueService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}