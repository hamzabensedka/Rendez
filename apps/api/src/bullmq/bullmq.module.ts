import { Module } from '@nestjs/common';
import { BullMQ } from '@bullmq/bullmq';
import { MongooseModule } from '@nestjs/mongoose';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { ReminderEmailJob } from '../jobs/reminder-email.job';
import { AvailabilityCacheInvalidationJob } from '../jobs/availability-cache-invalidation.job';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017'),
    BullMQ.registerQueue('reminder-email', {
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true
      }
    }),
    BullMQ.registerQueue('availability-cache-invalidation', {
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true
      }
    })
  ],
  providers: [QueueService, ReminderEmailJob, AvailabilityCacheInvalidationJob],
  controllers: [QueueController]
})
export class BullMQModule {}