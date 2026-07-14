import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import {
  AppointmentStatus,
  AppointmentSource,
  UserRole,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
} from '@planity/shared';
import { generateIdempotencyKey } from '@planity/shared';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';

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
        if (existing.clientUserId !== userId) {
          throw new ConflictException('Idempotency key already used');
        }

        return this.getAppointmentById(existing.id);
      }
    }

    // Get business
    const business = await this.prisma.business.findFirst({
      where: {
        id: dto.businessId,
        status: 'active',
        deletedAt: null,
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const location = await this.prisma.location.findFirst({
      where: {
        id: dto.locationId,
        businessId: dto.businessId,
      },
    });

    if (!location) {
      throw new BadRequestException('Location does not belong to this business');
    }

    if (dto.staffId) {
      const staff = await this.prisma.staff.findFirst({
        where: {
          id: dto.staffId,
          businessId: dto.businessId,
          isActive: true,
        },
      });

      if (!staff) {
        throw new BadRequestException('Staff member does not belong to this business');
      }
    }

    // Get service variants and calculate total duration
    const variants = await this.prisma.serviceVariant.findMany({
      where: {
        id: { in: dto.items.map((item) => item.serviceVariantId) },
      },
      include: {
        service: {
          select: {
            businessId: true,
            isActive: true,
          },
        },
      },
    });

    if (variants.length !== dto.items.length) {
      throw new NotFoundException('Some service variants not found');
    }

    const invalidVariant = variants.find(
      (variant) =>
        variant.service.businessId !== dto.businessId || !variant.service.isActive
    );

    if (invalidVariant) {
      throw new BadRequestException(
        'One or more service variants do not belong to this business'
      );
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

    try {
      const appointment = await this.prisma.$transaction(async (tx) => {
        // Overlap check inside transaction so it runs in same snapshot as insert
        // (durable protection is also enforced by DB exclusion constraint)
        const conflicting = await tx.appointment.findFirst({
          where: {
            businessId: dto.businessId,
            staffId: dto.staffId ?? null,
            status: { not: AppointmentStatus.CANCELLED },
            AND: [
              { startAtUtc: { lt: endAt } },
              { endAtUtc: { gt: startAt } },
            ],
          },
        });

        if (conflicting) {
          throw new ConflictException('Time slot is no longer available');
        }

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

      return this.getAppointmentById(appointment.id);
    } catch (err) {
      if (err instanceof ConflictException) {
        throw err;
      }
      if (this.isOverlapOrConstraintError(err)) {
        throw new ConflictException('Time slot is no longer available');
      }
      throw err;
    }
  }

  private isOverlapOrConstraintError(err: unknown): boolean {
    if (err && typeof err === 'object' && 'code' in err) {
      const code = (err as { code: string }).code;
      if (code === 'P2002') return true; // unique
      if (code === 'P2010' || code === '23P01') return true; // raw exclusion / constraint
    }
    const msg = err instanceof Error ? err.message : String(err);
    return /exclusion|conflict|duplicate key|unique constraint/i.test(msg);
  }

  async findUserAppointments(
    userId: string,
    upcoming = true,
    page: number = DEFAULT_PAGE,
    limit: number = DEFAULT_LIMIT
  ) {
    const now = new Date();
    const where: Prisma.AppointmentWhereInput = {
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

    const safePage = Math.max(1, Math.floor(page));
    const safeLimit = Math.min(MAX_LIMIT, Math.max(1, Math.floor(limit)));
    const skip = (safePage - 1) * safeLimit;

    const [data, total] = await Promise.all([
      this.prisma.appointment.findMany({
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
        skip,
        take: safeLimit,
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return {
      data,
      total,
      page: safePage,
      limit: safeLimit,
    };
  }

  async findOne(id: string, requester: AuthenticatedUser) {
    const appointment = await this.getAppointmentById(id);
    await this.assertCanAccessAppointment(appointment, requester);
    // Normalize location with formatted address for clients
    if (appointment.location) {
      const loc = appointment.location;
      const address = [loc.address1, loc.address2, loc.postalCode, loc.city, loc.country]
        .filter(Boolean)
        .join(', ');
      return { ...appointment, location: { ...loc, address } };
    }
    return appointment;
  }

  async cancel(id: string, requester: AuthenticatedUser, reason?: string) {
    const appointment = await this.findOne(id, requester);

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

  private async getAppointmentById(id: string) {
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

  private async assertCanAccessAppointment(
    appointment: Awaited<ReturnType<AppointmentsService['getAppointmentById']>>,
    requester: AuthenticatedUser
  ) {
    if (appointment.clientUserId === requester.id) {
      return;
    }

    if (requester.role === UserRole.ADMIN) {
      return;
    }

    if (
      requester.role === UserRole.PROVIDER_OWNER ||
      requester.role === UserRole.PROVIDER_STAFF
    ) {
      const providerProfile = await this.prisma.provider.findFirst({
        where: {
          userId: requester.id,
          businessId: appointment.businessId,
        },
        select: { id: true },
      });

      if (providerProfile) {
        return;
      }
    }

    throw new ForbiddenException('You cannot access this appointment');
  }
}

