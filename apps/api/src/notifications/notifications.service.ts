import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BullQueueService } from './bull-queue.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prismaService: PrismaService, private readonly bullQueueService: BullQueueService) {}

  async sendAppointmentReminder(appointmentId: number) {
    const appointment = await this.prismaService.appointment.findUnique({
      where: { id: appointmentId },
      include: { user: true, business: true },
    });

    if (!appointment) return;

    const notification = {
      type: 'appointmentReminder',
      userId: appointment.user.id,
      businessId: appointment.business.id,
      appointmentId,
    };

    await this.bullQueueService.add('notifications', notification);
  }
}
