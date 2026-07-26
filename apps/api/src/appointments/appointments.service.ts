import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { NotificationService } from '../notifications/notification.service';
import { BookingNotificationData, NotificationChannel } from '../notifications/notification-channel.enum';

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(userId: string, dto: CreateAppointmentDto) {
    const appointment = await this.prisma.appointment.create({
      data: {
        userId,
        businessId: dto.businessId,
        serviceId: dto.serviceId,
        start: new Date(dto.start),
        end: new Date(dto.end),
        status: 'CONFIRMED',
      },
      include: {
        user: true,
        business: true,
        service: true,
      },
    });

    this.logger.log(`Created appointment ${appointment.id} for user ${userId}`);

    // Send booking confirmation notification
    try {
      const notificationData: BookingNotificationData = {
        appointmentId: appointment.id,
        businessName: appointment.business.name,
        serviceName: appointment.service.name,
        dateTime: appointment.start.toISOString(),
        customerName: appointment.user.name || appointment.user.email,
        customerEmail: appointment.user.email,
      };

      await this.notificationService.sendBookingConfirmation(
        notificationData,
        [NotificationChannel.EMAIL],
      );

      // Schedule booking reminder (24 hours before)
      const reminderTime = appointment.start.getTime() - 24 * 60 * 60 * 1000;
      const now = Date.now();
      
      if (reminderTime > now) {
        await this.notificationService.sendBookingReminder(
          notificationData,
          [NotificationChannel.EMAIL],
        );
      }
    } catch (error) {
      this.logger.error('Failed to send booking confirmation notification', error);
    }

    return appointment;
  }

  async findAllByUser(userId: string) {
    return this.prisma.appointment.findMany({
      where: { userId },
      include: {
        business: true,
        service: true,
      },
      orderBy: { start: 'asc' },
    });
  }

  async cancel(userId: string, appointmentId: string, dto: CancelAppointmentDto) {
    const appointment = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'CANCELLED',
        cancelReason: dto.reason,
      },
      include: {
        user: true,
        business: true,
        service: true,
      },
    });

    this.logger.log(`Cancelled appointment ${appointmentId}`);

    return appointment;
  }
}
