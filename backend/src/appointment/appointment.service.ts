import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    const { businessId, serviceIds, date, timeSlot, staffId, customerId, notes } = createAppointmentDto;

    // Validate business exists
    const business = await this.prisma.business.findUnique({ where: { id: businessId } });
    if (!business) throw new NotFoundException('Business not found');

    // Validate services
    const services = await this.prisma.service.findMany({
      where: { id: { in: serviceIds } },
    });
    if (services.length !== serviceIds.length) throw new BadRequestException('One or more services not found');

    // Validate staff if provided
    if (staffId) {
      const staff = await this.prisma.staff.findUnique({ where: { id: staffId } });
      if (!staff || staff.businessId !== businessId) {
        throw new BadRequestException('Invalid staff for this business');
      }
    }

    // Check slot availability (simplified)
    const slotKey = `slot:${businessId}:${date}:${timeSlot}`;
    const isSlotAvailable = await this.redis.get(slotKey);
    if (isSlotAvailable !== 'available') {
      throw new BadRequestException('Selected time slot is not available');
    }

    // Reserve slot temporarily
    await this.redis.setex(slotKey, 300, 'reserved'); // 5 minutes

    // Create appointment
    const appointment = await this.prisma.appointment.create({
      data: {
        id: uuidv4(),
        businessId,
        customerId,
        staffId,
        date: new Date(date),
        timeSlot,
        notes,
        status: 'CONFIRMED',
        totalDuration: services.reduce((sum, s) => sum + s.duration, 0),
        totalPrice: services.reduce((sum, s) => sum + s.price, 0),
        services: {
          connect: serviceIds.map(id => ({ id })),
        },
      },
      include: {
        business: true,
        customer: true,
        staff: true,
        services: true,
      },
    });

    // Clear slot reservation
    await this.redis.del(slotKey);

    return appointment;
  }

  async findAll(customerId: string) {
    return this.prisma.appointment.findMany({
      where: { customerId },
      include: {
        business: true,
        services: true,
        staff: true,
      },
      orderBy: { date: 'asc' },
    });
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        business: true,
        services: true,
        staff: true,
      },
    });
    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appointment) throw new NotFoundException('Appointment not found');

    return this.prisma.appointment.update({
      where: { id },
      data: updateAppointmentDto,
      include: {
        business: true,
        services: true,
        staff: true,
      },
    });
  }

  async cancel(id: string, reason?: string) {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appointment) throw new NotFoundException('Appointment not found');

    // Business logic: allow cancellation only within policy window
    const now = new Date();
    const appointmentDate = new Date(appointment.date);
    const hoursDiff = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursDiff < 24) {
      throw new BadRequestException('Cancellation not allowed within 24 hours of appointment');
    }

    const updated = await this.prisma.appointment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancellationReason: reason,
      },
    });

    // Free up slot
    const slotKey = `slot:${updated.businessId}:${updated.date.toISOString().split('T')[0]}:${updated.timeSlot}`;
    await this.redis.set(slotKey, 'available');

    return updated;
  }

  async reschedule(id: string, newDate: string, newTimeSlot: string) {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appointment) throw new NotFoundException('Appointment not found');

    // Free old slot
    const oldSlotKey = `slot:${appointment.businessId}:${appointment.date.toISOString().split('T')[0]}:${appointment.timeSlot}`;
    await this.redis.set(oldSlotKey, 'available');

    // Check new slot availability
    const newSlotKey = `slot:${appointment.businessId}:${newDate}:${newTimeSlot}`;
    const isAvailable = await this.redis.get(newSlotKey);
    if (isAvailable !== 'available') {
      // Restore old slot
      await this.redis.set(oldSlotKey, 'reserved');
      throw new BadRequestException('New time slot is not available');
    }

    // Reserve new slot
    await this.redis.setex(newSlotKey, 300, 'reserved');

    // Update appointment
    return this.prisma.appointment.update({
      where: { id },
      data: {
        date: new Date(newDate),
        timeSlot: newTimeSlot,
      },
    });
  }
}