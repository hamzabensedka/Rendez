import { Module } from '@nestjs/common';
import { BullmqModule } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CacheService } from '../cache/cache.service';
import { ReminderEmailJob } from '../jobs/reminder-email.job';
import { AvailabilityCacheInvalidationJob } from '../jobs/availability-cache-invalidation.job';

@Module({
  imports: [
    BullmqModule.registerQueue({
      name: 'reminder-emails'
    }),
    BullmqModule.registerQueue({
      name: 'availability-cache-invalidation'
    })
  ],
  providers: [
    ReminderEmailJob,
    AvailabilityCacheInvalidationJob,
    PrismaService,
    EmailService,
    CacheService
  ]
})
export class BullmqModule {}
