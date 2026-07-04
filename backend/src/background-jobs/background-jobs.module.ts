import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { FirebaseMessagingService } from '../notifications/firebase-messaging.service';
import { EmailService } from '../notifications/email.service';
import { BookingRemindersJob } from './jobs/booking-reminders.job';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [
    PrismaService,
    NotificationsService,
    FirebaseMessagingService,
    EmailService,
    BookingRemindersJob,
  ],
})
export class BackgroundJobsModule {}