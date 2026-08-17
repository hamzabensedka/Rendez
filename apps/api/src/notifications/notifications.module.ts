import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { BullModule } from '@nestjs/bull';
import { BullQueueModule } from '@nestjs/bull-queue';
import { RedisModule } from '@nestjs/redis';
import { PrismaModule } from '@nestjs/prisma';

@Module({
  imports: [
    BullModule.registerQueue('notifications', {
      defaultJobOptions: {
        removeOnComplete: true,
      },
    }),
    BullQueueModule.registerQueue('notifications'),
    RedisModule.registerClient({
      config: {
        host: 'localhost',
        port: 6379,
      },
    }),
    PrismaModule.registerClient({
      prismaClient: 'prisma',
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}