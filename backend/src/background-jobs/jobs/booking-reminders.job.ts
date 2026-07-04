import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../../notifications/notifications.service';

@Injectable()
export class BookingRemindersJob {
  private readonly logger = new Logger(BookingRemindersJob.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handle24hReminders() {
    this.logger.log('Running 24h booking reminders job');
    const twentyFourHoursFromNow = new Date();
    twentyFourHoursFromNow.setHours(twentyFourHoursFromNow.getHours() + 24);

    const bookings = await this.prisma.booking.findMany({
      where: {
        date: {
          gte: twentyFourHoursFromNow,
          lt: new Date(twentyFourHoursFromNow.getTime() + 60 * 60 * 1000), // within next hour
        },
        status: 'CONFIRMED',
        reminder24hSent: false,
      },
    });

    for (const booking of bookings) {
      try {
        await this.notificationsService.sendBookingReminder(booking.id, '24h');
        await this.prisma.booking.update({
          where: { id: booking.id },
          data: { reminder24hSent: true },
        });
      } catch (error) {
        this.logger.error(`Failed to send 24h reminder for booking ${booking.id}: ${error.message}`);
      }
    }
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handle1hReminders() {
    this.logger.log('Running 1h booking reminders job');
    const oneHourFromNow = new Date();
    oneHourFromNow.setMinutes(oneHourFromNow.getMinutes() + 60);

    const bookings = await this.prisma.booking.findMany({
      where: {
        date: {
          gte: oneHourFromNow,
          lt: new Date(oneHourFromNow.getTime() + 30 * 60 * 1000), // within next 30 minutes
        },
        status: 'CONFIRMED',
        reminder1hSent: false,
      },
    });

    for (const booking of bookings) {
      try {
        await this.notificationsService.sendBookingReminder(booking.id, '1h');
        await this.prisma.booking.update({
          where: { id: booking.id },
          data: { reminder1hSent: true },
        });
      } catch (error) {
        this.logger.error(`Failed to send 1h reminder for booking ${booking.id}: ${error.message}`);
      }
    }
  }
}