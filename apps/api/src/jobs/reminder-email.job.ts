import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { MailService } from '../../mail/mail.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReminderEmailJob {
  constructor(
    private readonly mailService: MailService,
    private readonly prismaService: PrismaService
  ) {}

  async handle(job: Job) {
    const { appointmentId } = job.data;
    const appointment = await this.prismaService.appointment.findUnique({
      where: { id: appointmentId },
      include: { user: true }
    });

    if (!appointment) return;

    const { user } = appointment;
    const mailOptions = {
      to: user.email,
      subject: 'Reminder: Upcoming Appointment',
      text: `Reminder: You have an upcoming appointment on ${appointment.date}`
    };

    await this.mailService.sendMail(mailOptions);
  }
}