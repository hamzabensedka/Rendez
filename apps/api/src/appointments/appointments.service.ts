import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DateTime } from 'luxon';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AvailabilityService } from '../availability/availability.service';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';

type Tx = PrismaService | Parameters<Parameters<PrismaService['$transaction']>[0]>[0];

const isOverlapViolation = (err: unknown): boolean => {
  const raw = String((err as { message?: string; meta?: { message?: string } })?.message ?? '');
  const meta = String((err as { meta?: { message?: string } })?.meta?.message ?? '');
  return `${raw} ${meta}`.includes('23P01') || `${raw} ${meta}`.includes('no_overlapping');
};

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly availability: AvailabilityService
  ) {}

  async create(userId: string, dto: CreateAppointmentDto) {
    if (!dto.items.length) {
      throw new BadRequestException('At least one service item is required');
    }

    try {
      const appointment = await this.prisma.$transaction(async (tx: Tx) => {
        const business = await tx.business.findFirst({
          where: { id: dto.businessId, status: 'active', deletedAt: null },
          select: { id: true, timezone: true },
        });
        if (!business) {
          throw new NotFoundException('Business not found or not active');
        }

        const location = await tx.location.findFirst({
          where: { id: dto.locationId, businessId: dto.businessId },
          select: { id: true },
        });
        if (!location) {
          throw new BadRequestException('The selected location does not belong to this business');
        }

        if (dto.staffId) {
          const staff = await tx.staff.findFirst({
            where: { id: dto.staffId, businessId: dto.businessId, isActive: true },
            select: { id: true },
          });
          if (!staff) {
            throw new BadRequestException(
              'The selected staff member does not belong to this business or is inactive'
            );
          }
        }

        const variantIds = dto.items.map((i) => i.serviceVariantId);
        const variants = await tx.serviceVariant.findMany({
          where: { id: { in: variantIds } },
          select: {
            id: true,
            durationMin: true,
            bufferBeforeMin: true,
            bufferAfterMin: true,
            priceCents: true,
            service: { select: { businessId: true, isActive: true } },
          },
        });
        const byId = new Map(variants.map((v) => [v.id, v]));
        for (const item of dto.items) {
          const v = byId.get(item.serviceVariantId);
          if (!v || !v.service.isActive || v.service.businessId !== dto.businessId) {
            throw new BadRequestException(
              'One or more service variants do not belong to this business or are unavailable'
            );
          }
        }

        const start = new Date(dto.startAt);
        let durationMs = 0;
        let bufferAfterMs = 0;
        for (const item of dto.items) {
          const v = byId.get(item.serviceVariantId)!;
          const qty = item.quantity ?? 1;
          durationMs += v.durationMin * 60_000 * qty;
          // Leading buffers are enforced by the availability slot generator;
          // reserving them in the exclusion range requires a DB change (roadmap).
          bufferAfterMs = Math.max(bufferAfterMs, (v.bufferAfterMin ?? 0) * 60_000);
        }
        // Trailing buffer is reserved inside the excluded [start, end) range so
        // overlapping slots cannot be booked; leading buffer is honored by the
        // availability slot generator.
        const end = new Date(start.getTime() + durationMs + bufferAfterMs);

        const extraVariantIds = variantIds.filter((id) => id !== variantIds[0]);
        const dateInTz = DateTime.fromJSDate(start, { zone: 'utc' })
          .setZone(business.timezone)
          .toFormat('yyyy-MM-dd');
        const available = await this.availability.getAvailableSlots(
          dto.businessId,
          dateInTz,
          variantIds[0],
          dto.staffId,
          extraVariantIds,
          true
        );
        const startMs = start.getTime();
        const matching = available.slots.find(
          (slot) => new Date(slot.startAt).getTime() === startMs && Boolean(slot.staffId)
        );
        if (!matching?.staffId) {
          throw new ConflictException('This time slot is no longer available');
        }
        if (dto.staffId && matching.staffId !== dto.staffId) {
          throw new ConflictException('This time slot is no longer available');
        }
        const assignedStaffId = dto.staffId ?? matching.staffId;

        const appointment = await tx.appointment.create({
          data: {
            businessId: dto.businessId,
            locationId: dto.locationId,
            clientUserId: userId,
            staffId: assignedStaffId,
            startAtUtc: start,
            endAtUtc: end,
            timezoneSnapshot: business.timezone,
            idempotencyKey: dto.idempotencyKey,
          },
          include: {
            business: { select: { id: true, name: true, timezone: true, email: true } },
            location: true,
            staff: { select: { id: true, name: true } },
            appointmentItems: true,
            clientUser: { select: { id: true, name: true, email: true } },
          },
        });

        await tx.appointmentItem.createMany({
          data: dto.items.map((item) => {
            const v = byId.get(item.serviceVariantId)!;
            return {
              appointmentId: appointment.id,
              serviceVariantId: item.serviceVariantId,
              durationMinSnapshot: v.durationMin,
              priceCentsSnapshot: v.priceCents,
              quantity: item.quantity ?? 1,
            };
          }),
        });

        this.logger.log(`Created appointment ${appointment.id} for user ${userId}`);

        // Post-commit notification (fire-and-forget; never fails the request).
        void this.notifications
          .sendOnce({
            userId: appointment.clientUserId,
            dedupKey: `booking-created:${appointment.id}`,
            type: 'BOOKING_CONFIRMATION',
            toEmail: appointment.clientUser?.email ?? null,
            subject: `Booking confirmed — ${appointment.business.name}`,
            html: `<p>Your appointment at <strong>${appointment.business.name}</strong> on ${appointment.startAtUtc.toISOString()} is confirmed.</p>`,
          })
          .catch((notifyErr) =>
            this.logger.warn(`booking confirmation failed: ${String(notifyErr)}`)
          );

        return appointment;
      });
      await this.availability.invalidateForBusiness(dto.businessId);
      return appointment;
    } catch (err) {
      if (isOverlapViolation(err)) {
        throw new ConflictException('This time slot is no longer available');
      }
      throw err;
    }
  }

  async findUserAppointments(userId: string, upcoming = true, page = 1, limit = 20) {
    const take = Math.min(Math.max(limit || 20, 1), 100);
    const skip = Math.max(((page || 1) - 1) * take, 0);
    const now = new Date();

    const where = {
      clientUserId: userId,
      ...(upcoming ? { startAtUtc: { gte: now } } : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.appointment.findMany({
        where,
        include: {
          business: true,
          location: true,
          staff: { select: { id: true, name: true } },
          appointmentItems: { include: { serviceVariant: true } },
        },
        orderBy: { startAtUtc: upcoming ? 'asc' : 'desc' },
        skip,
        take,
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return { data, total, page: page || 1, limit: take };
  }

  async findOne(id: string, user: AuthenticatedUser) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        business: true,
        location: true,
        staff: { select: { id: true, name: true } },
        clientUser: { select: { id: true, name: true, email: true } },
        appointmentItems: { include: { serviceVariant: true } },
      },
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.clientUserId === user.id || user.role === 'admin') {
      return appointment;
    }

    if (user.role === 'providerOwner' || user.role === 'providerStaff') {
      const provider = await this.prisma.provider.findFirst({
        where: { userId: user.id, businessId: appointment.businessId },
        select: { id: true },
      });
      if (provider) return appointment;
      throw new ForbiddenException('You cannot access appointments of another business');
    }

    throw new ForbiddenException('You cannot access this appointment');
  }

  async cancel(id: string, user: AuthenticatedUser, reason?: string) {
    // Access control (owner / same-business provider / admin).
    const appointment = await this.findOne(id, user);

    if (appointment.status !== 'BOOKED') {
      throw new ConflictException(
        `Only booked appointments can be cancelled (current status: ${appointment.status})`
      );
    }

    const freeHours = appointment.business.freeCancellationBeforeHours;
    if (
      typeof freeHours === 'number' &&
      freeHours > 0 &&
      Date.now() > appointment.startAtUtc.getTime() - freeHours * 3_600_000
    ) {
      throw new ConflictException(
        `Free cancellation window has passed (${freeHours}h before start)`
      );
    }

    const result = await this.prisma.appointment.updateMany({
      where: { id, status: 'BOOKED' },
      data: {
        status: 'CANCELLED',
        cancelReason: reason,
        cancelledAt: new Date(),
      },
    });
    if (result.count === 0) {
      throw new ConflictException('Appointment was already cancelled');
    }

    this.logger.log(`Cancelled appointment ${id}`);

    // Notify the client their booking was cancelled (fire-and-forget).
    void this.notifications
      .sendOnce({
        userId: appointment.clientUserId,
        dedupKey: `booking-cancelled:${id}`,
        type: 'BOOKING_CANCELLED',
        toEmail: appointment.clientUser?.email ?? null,
        subject: `Booking cancelled — ${appointment.business.name}`,
        html: `<p>Your appointment at <strong>${appointment.business.name}</strong> on ${appointment.startAtUtc.toISOString()} has been cancelled.</p>`,
      })
      .catch((err) => this.logger.warn(`cancellation notice failed: ${String(err)}`));

    return this.findOne(id, user);
  }
}
