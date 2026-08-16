import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../../email/email.service';

@Injectable()
export class ReminderEmailJob {
  constructor(
    @InjectQueue('reminder-emails') private readonly queue: Queue,
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService
  ) {}

  async handle(job: any) {
    const { appointmentId } = job.data;
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { user: true }
    });

    if (!appointment) return;

    const user = appointment.user;
    const reminderEmail = {
      to: user.email,
      subject: 'Reminder: Upcoming Appointment',
      text: `You have an upcoming appointment on ${appointment.startDate}`
    };

    await this.emailService.send(reminderEmail);
  }
}