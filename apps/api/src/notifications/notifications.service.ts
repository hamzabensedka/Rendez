import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BullMQService } from '../bullmq/bullmq.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bullMQService: BullMQService
  ) {}

  async sendAppointmentReminder(appointmentId: number) {
    const appointment = await this.prismaService.appointment.findUnique({
      where: { id: appointmentId },
      include: { user: true, business: true },
    });

    if (!appointment) {
      throw new Error(`Appointment not found`);
    }

    const user = appointment.user;
    const business = appointment.business;

    // Send notification using BullMQ
    await this.bullMQService.add('send-appointment-reminder', {
      userId: user.id,
      businessId: business.id,
      appointmentId,
    });
  }
}
