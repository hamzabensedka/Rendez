import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { AvailabilityService } from '../availability/availability.service';
import { NotificationService } from '../notifications/notification.service';
import { BookingNotificationData } from '../notifications/dto/send-notification.dto';

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly availabilityService: AvailabilityService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(userId: string, createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const isAvailable = await this.availabilityService.isSlotAvailable(
      createAppointmentDto.businessId,
      createAppointmentDto.serviceId,
      new Date(createAppointmentDto.start),
      new Date(createAppointmentDto.end),
    );

    if (!isAvailable) {
      throw new BadRequestException('The selected time slot is not available');
    }

    const appointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      userId,
      status: 'confirmed',
    });

    const savedAppointment = await this.appointmentRepository.save(appointment);
    this.logger.log(`Appointment created: ${savedAppointment.id}`);

    // Send booking confirmation notification
    await this.sendBookingConfirmationNotification(savedAppointment);

    return savedAppointment;
  }

  async findAllByUser(userId: string): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { userId },
      relations: ['business', 'service'],
      order: { start: 'ASC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id, userId },
      relations: ['business', 'service'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  async cancel(id: string, userId: string, cancelDto: CancelAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id, userId);

    if (appointment.status === 'cancelled') {
      throw new BadRequestException('Appointment is already cancelled');
    }

    appointment.status = 'cancelled';
    appointment.cancellationReason = cancelDto.reason;

    const updatedAppointment = await this.appointmentRepository.save(appointment);
    this.logger.log(`Appointment cancelled: ${id}`);

    return updatedAppointment;
  }

  async reschedule(
    id: string,
    userId: string,
    newStart: Date,
    newEnd: Date,
  ): Promise<Appointment> {
    const appointment = await this.findOne(id, userId);

    const isAvailable = await this.availabilityService.isSlotAvailable(
      appointment.businessId,
      appointment.serviceId,
      newStart,
      newEnd,
    );

    if (!isAvailable) {
      throw new BadRequestException('The new time slot is not available');
    }

    appointment.start = newStart;
    appointment.end = newEnd;

    const updatedAppointment = await this.appointmentRepository.save(appointment);
    this.logger.log(`Appointment rescheduled: ${id}`);

    // Send reschedule notification
    await this.sendBookingConfirmationNotification(updatedAppointment);

    return updatedAppointment;
  }

  private async sendBookingConfirmationNotification(appointment: Appointment): Promise<void> {
    try {
      const notificationData: BookingNotificationData = {
        appointmentId: appointment.id,
        businessName: appointment.business?.name || 'the business',
        serviceName: appointment.service?.name || 'your service',
        dateTime: new Date(appointment.start).toLocaleString(),
        customerName: 'Customer',
        customerEmail: 'customer@example.com',
      };

      // In production, fetch user email and push token from User service
      const userEmail = 'customer@example.com';
      const pushToken = null; // Would come from user profile

      await this.notificationService.sendBookingConfirmation(
        appointment.userId,
        userEmail,
        pushToken,
        notificationData,
      );

      this.logger.log(`Booking confirmation notification queued for appointment ${appointment.id}`);
    } catch (error) {
      this.logger.error(`Failed to send booking confirmation notification: ${error.message}`);
      // Don't throw - notification failure shouldn't fail the booking
    }
  }
}
