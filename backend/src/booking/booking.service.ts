import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AvailabilityService } from '../availability/availability.service';
import { PaymentService } from '../payment/payment.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly availabilityService: AvailabilityService,
    private readonly paymentService: PaymentService,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: string) {
    const { serviceId, staffId, date, startTime, extras = [] } = createBookingDto;

    // Validate service exists
    const service = await this.prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) throw new NotFoundException('Service not found');

    // Validate staff exists and belongs to business
    const staff = await this.prisma.staff.findUnique({ where: { id: staffId } });
    if (!staff || staff.businessId !== service.businessId)
      throw new BadRequestException('Invalid staff selection');

    // Check slot availability
    const isAvailable = await this.availabilityService.isSlotAvailable(staffId, date, startTime, service.duration);
    if (!isAvailable) throw new BadRequestException('Selected time slot is not available');

    // Calculate total price
    let totalPrice = service.price;
    for (const extraId of extras) {
      const extra = await this.prisma.serviceExtra.findUnique({ where: { id: extraId } });
      if (extra && extra.serviceId === serviceId) {
        totalPrice += extra.price;
      }
    }

    // Create appointment
    const appointment = await this.prisma.appointment.create({
      data: {
        clientId: userId,
        serviceId,
        staffId,
        date: new Date(date),
        startTime: new Date(startTime),
        status: 'pending',
        totalPrice,
        extras: {
          connect: extras.map(id => ({ id }))
        }
      },
      include: {
        client: true,
        service: true,
        staff: true,
      }
    });

    // Handle payment if required
    if (service.prepaymentRequired) {
      await this.paymentService.initiatePayment(appointment.id, userId);
    } else {
      await this.prisma.appointment.update({
        where: { id: appointment.id },
        data: { status: 'confirmed' }
      });
    }

    return appointment;
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        client: true,
        service: true,
        staff: true,
        business: true,
        extras: true,
      }
    });
    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appointment) throw new NotFoundException('Appointment not found');

    return this.prisma.appointment.update({
      where: { id },
      data: updateBookingDto,
    });
  }

  async cancel(id: string, userId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: { client: true }
    });

    if (!appointment) throw new NotFoundException('Appointment not found');
    if (appointment.clientId !== userId)
      throw new BadRequestException('Not authorized to cancel this appointment');

    // Apply cancellation policy
    const business = await this.prisma.business.findUnique({
      where: { id: appointment.staff.businessId },
      include: { cancellationPolicy: true }
    });

    const now = new Date();
    const appointmentStart = new Date(appointment.date);
    const hoursDiff = (appointmentStart.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (business.cancellationPolicy && hoursDiff < business.cancellationPolicy.freeCancellationHours) {
      // Charge cancellation fee if applicable
      if (business.cancellationPolicy.lateCancellationFee > 0) {
        await this.paymentService.chargeCancellationFee(appointment.id, business.cancellationPolicy.lateCancellationFee);
      }
    }

    // Refund if prepaid
    if (appointment.status === 'paid' || appointment.status === 'deposit_paid') {
      await this.paymentService.refundPayment(appointment.paymentIntentId);
    }

    // Update status
    return this.prisma.appointment.update({
      where: { id },
      data: { status: 'cancelled' }
    });
  }
}