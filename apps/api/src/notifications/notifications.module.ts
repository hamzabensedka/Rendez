import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsService } from './notifications.service';
import { ReminderScheduler } from './reminder.scheduler';
import { createEmailTransport } from './email.transport';

@Module({
  imports: [PrismaModule],
  providers: [
    NotificationsService,
    ReminderScheduler,
    {
      provide: 'EMAIL_TRANSPORT',
      useFactory: (config: ConfigService) => createEmailTransport(config),
      inject: [ConfigService],
    },
  ],
  exports: [NotificationsService, ReminderScheduler],
})
export class NotificationsModule {}
