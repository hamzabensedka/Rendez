import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { BullModule } from '@nestjs/bull';
import { bullQueueFactory } from './bull-queue.factory';

@Module({
  imports: [
    BullModule.registerQueue('notifications', bullQueueFactory),
  ],
  providers: [NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}