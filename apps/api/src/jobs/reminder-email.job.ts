import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BullMQ } from '@bullmq/bullmq';
import { JobOptions } from '@bullmq/bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ReminderEmailJob {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly bullMQ: BullMQ
  ) {}

  async handle(job: any, done: (err?: Error | null) => void) {
    const { appointmentId } = job.data;
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { user: true }
    });

    if (!appointment) {
      done(new Error(`Appointment not found: ${appointmentId}`));
      return;
    }

    const { user } = appointment;
    const notification = {
      recipient: user,
      message: `Reminder: ${appointment.title}`
    };

    try {
      await this.notifications.send(notification);
      done();
    } catch (error) {
      done(error);
    }
  }
}