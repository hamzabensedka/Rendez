import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { DateTime } from 'luxon';
import { AppointmentStatus, AppointmentSource } from '@planity/shared';
import { generateIdempotencyKey } from '@planity/shared';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateAppointmentDto) {
    // Check idempotency
    if (dto.idempotencyKey) {
      const existing = await this.prisma.appointment.findUnique({
        where: { idempotencyKey: dto.idempotencyKey },
      });

      if (existing) {
        return this.findOne(existing.id);
      }
    }

    // Get business
    const business = await this.prisma.business.findUnique({
      where: { id: dto.businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    // Get service variants and calculate total duration
    const variants = await this.prisma.serviceVariant.findMany({
      where: {
        id: { in: dto.items.map((item) => item.serviceVariantId) },
      },
    });

    if (variants.length !== dto.items.length) {
      throw new NotFoundException('Some service variants not found');
    }

    let totalDuration = 0;
    let totalBufferBefore = 0;
    let totalBufferAfter = 0;

    for (const item of dto.items) {
      const variant = variants.find((v) => v.id === item.serviceVariantId);
      if (!variant) continue;

      const quantity = item.quantity || 1;
      totalDuration += variant.durationMin * quantity;
      totalBufferBefore = Math.max(totalBufferBefore, variant.bufferBeforeMin);
      totalBufferAfter = Math.max(totalBufferAfter, variant.bufferAfterMin);
    }

    const startAt = new Date(dto.startAt);
    const endAt = new Date(
      startAt.getTime() + (totalDuration + totalBufferBefore + totalBufferAfter) * 60 * 1000
    );

    // Verify slot is still available (basic check)
    const conflicting = await this.prisma.appointment.findFirst({
      where: {
        businessId: dto.businessId,
        staffId: dto.staffId || null,
        status: { not: AppointmentStatus.CANCELLED },
        OR: [
          {
            AND: [
              { startAtUtc: { lt: endAt } },
              { endAtUtc: { gt: startAt } },
            ],
          },
        ],
      },
    });

    if (conflicting) {
      throw new ConflictException('Time slot is no longer available');
    }

    // Create appointment in transaction
    const appointment = await this.prisma.$transaction(async (tx) => {
      // Create appointment
      const apt = await tx.appointment.create({
        data: {
          businessId: dto.businessId,
          locationId: dto.locationId,
          clientUserId: userId,
          staffId: dto.staffId,
          status: AppointmentStatus.BOOKED,
          startAtUtc: startAt,
          endAtUtc: endAt,
          timezoneSnapshot: business.timezone,
          source: AppointmentSource.CLIENT,
          idempotencyKey: dto.idempotencyKey || generateIdempotencyKey(),
        },
      });

      // Create appointment items
      await tx.appointmentItem.createMany({
        data: dto.items.map((item) => {
          const variant = variants.find((v) => v.id === item.serviceVariantId)!;
          return {
            appointmentId: apt.id,
            serviceVariantId: item.serviceVariantId,
            priceCentsSnapshot: variant.priceCents,
            durationMinSnapshot: variant.durationMin,
            bufferBeforeMinSnapshot: variant.bufferBeforeMin,
            bufferAfterMinSnapshot: variant.bufferAfterMin,
            quantity: item.quantity,
          };
        }),
      });

      return apt;
    });

    return this.findOne(appointment.id);
  }

  async findUserAppointments(userId: string, upcoming = true) {
    const now = new Date();
    const where: any = {
      clientUserId: userId,
    };

    if (upcoming) {
      where.startAtUtc = { gte: now };
      where.status = { not: AppointmentStatus.CANCELLED };
    } else {
      where.OR = [
        { startAtUtc: { lt: now } },
        { status: AppointmentStatus.CANCELLED },
      ];
    }

    return this.prisma.appointment.findMany({
      where,
      include: {
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        location: {
          select: {
            id: true,
            label: true,
            address1: true,
            city: true,
          },
        },
        staff: {
          select: {
            id: true,
            name: true,
          },
        },
        appointmentItems: {
          include: {
            serviceVariant: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        startAtUtc: upcoming ? 'asc' : 'desc',
      },
    });
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
            phone: true,
            email: true,
          },
        },
        location: true,
        staff: {
          select: {
            id: true,
            name: true,
          },
        },
        appointmentItems: {
          include: {
            serviceVariant: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async cancel(id: string, userId: string, reason?: string) {
    const appointment = await this.findOne(id);

    // Check permissions
    if (appointment.clientUserId !== userId) {
      // Check if user is provider/admin
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (!['providerOwner', 'providerStaff', 'admin'].includes(user?.role || '')) {
        throw new BadRequestException('You cannot cancel this appointment');
      }
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Appointment already cancelled');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: {
        status: AppointmentStatus.CANCELLED,
        cancelledAt: new Date(),
        cancelReason: reason,
      },
    });
  }
}

