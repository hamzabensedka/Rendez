import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { Queue } from 'bull';
import { ReminderEmailJob } from './jobs/reminder-email.job';
import { AvailabilityCacheInvalidationJob } from './jobs/availability-cache-invalidation.job';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'reminder-email',
    }),
    BullModule.registerQueue({
      name: 'availability-cache-invalidation',
    }),
  ],
  providers: [ReminderEmailJob, AvailabilityCacheInvalidationJob],
})
export class BullMqModule {}
