import { Module } from '@nestjs/common';
import { BullMQModule } from '@nestjs/bullmq';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from '../redis/redis.module';
import { BullmqService } from './bullmq.service';
import { ReminderEmailJob } from '../jobs/reminder-email.job';
import { AvailabilityCacheInvalidationJob } from '../jobs/availability-cache-invalidation.job';

@Module({
  imports: [
    BullMQModule.registerQueue(
      {
        name: 'reminder-emails',
      },
    ),
    BullMQModule.registerQueue(
      {
        name: 'availability-cache-invalidation',
      },
    ),
    RedisModule,
  ],
  providers: [BullmqService, ReminderEmailJob, AvailabilityCacheInvalidationJob],
})
export class BullmqModule {}
