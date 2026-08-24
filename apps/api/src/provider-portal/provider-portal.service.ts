import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import {
  CreateStaffDto,
  ReplaceAvailabilityRulesDto,
  ListTimeOffQuery,
  CreateTimeOffDto,
  UpdateStaffDto,
  UpdateAppointmentStatusDto,
  AppointmentListQuery,
} from './dto/provider-portal.dto';

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

/** Appointment statuses a provider may transition a BOOKED appointment to. */
const PROVIDER_TRANSITIONS = ['COMPLETED', 'NO_SHOW', 'CANCELLED'] as const;

@Injectable()
export class ProviderPortalService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Server-side ownership: the caller must hold a Provider row linked to the
   * business. Never trust a client-supplied businessId without this check.
   */
  private async assertMembership(userId: string, businessId: string): Promise<void> {
    const provider = await this.prisma.provider.findFirst({
      where: { userId, businessId },
      select: { id: true },
    });
    if (!provider) {
      throw new ForbiddenException('You are not a member of this business');
    }
  }

  private async assertStaffInBusiness(businessId: string, staffId: string): Promise<void> {
    const staff = await this.prisma.staff.findFirst({
      where: { id: staffId, businessId },
      select: { id: true },
    });
    if (!staff) {
      throw new BadRequestException('Staff member does not belong to this business');
    }
  }

  // ── Availability rules ────────────────────────────────────────────────

  async listAvailabilityRules(businessId: string, staffId?: string) {
    return this.prisma.availabilityRule.findMany({
      where: { businessId, ...(staffId ? { staffId } : {}) },
      orderBy: [{ dayOfWeek: 'asc' }, { startTimeLocal: 'asc' }],
    });
  }

  /** Replace-all semantics scoped to (business, staff|null) inside one transaction. */
  async replaceAvailabilityRules(
    user: AuthenticatedUser,
    businessId: string,
    dto: ReplaceAvailabilityRulesDto
  ) {
    await this.assertMembership(user.id, businessId);
    if (dto.staffId) {
      await this.assertStaffInBusiness(businessId, dto.staffId);
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.availabilityRule.deleteMany({
        where: { businessId, staffId: dto.staffId ?? null },
      });
      if (!dto.rules.length) return { created: 0 };
      await tx.availabilityRule.createMany({
        data: dto.rules.map((rule) => ({
          businessId,
          staffId: dto.staffId ?? null,
          dayOfWeek: rule.dayOfWeek,
          startTimeLocal: rule.startTimeLocal,
          endTimeLocal: rule.endTimeLocal,
          effectiveFrom: rule.effectiveFrom ? new Date(rule.effectiveFrom) : null,
          effectiveTo: rule.effectiveTo ? new Date(rule.effectiveTo) : null,
        })),
      });
      return { created: dto.rules.length };
    });
  }

  // ── Time off ──────────────────────────────────────────────────────────

  async listTimeOff(user: AuthenticatedUser, businessId: string, query: ListTimeOffQuery) {
    await this.assertMembership(user.id, businessId);
    return this.prisma.timeOff.findMany({
      where: {
        businessId,
        ...(query.staffId ? { staffId: query.staffId } : {}),
        ...(query.upcomingOnly ? { endAtUtc: { gte: new Date() } } : {}),
      },
      orderBy: { startAtUtc: 'asc' },
    });
  }

  async createTimeOff(user: AuthenticatedUser, businessId: string, dto: CreateTimeOffDto) {
    await this.assertMembership(user.id, businessId);
    if (dto.staffId) {
      await this.assertStaffInBusiness(businessId, dto.staffId);
    }
    const start = new Date(dto.startAtUtc);
    const end = new Date(dto.endAtUtc);
    if (!(start < end)) {
      throw new BadRequestException('Time off must end after it starts');
    }
    return this.prisma.timeOff.create({
      data: {
        businessId,
        staffId: dto.staffId ?? null,
        startAtUtc: start,
        endAtUtc: end,
        reason: dto.reason ?? null,
      },
    });
  }

  async deleteTimeOff(user: AuthenticatedUser, businessId: string, timeOffId: string) {
    await this.assertMembership(user.id, businessId);
    const deleted = await this.prisma.timeOff.deleteMany({
      where: { id: timeOffId, businessId },
    });
    if (deleted.count === 0) {
      throw new NotFoundException('Time off not found for this business');
    }
    return { deleted: true };
  }

  // ── Staff ─────────────────────────────────────────────────────────────

  async listStaff(user: AuthenticatedUser, businessId: string, includeInactive = false) {
    await this.assertMembership(user.id, businessId);
    return this.prisma.staff.findMany({
      where: { businessId, ...(includeInactive ? {} : { isActive: true }) },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createStaff(user: AuthenticatedUser, businessId: string, dto: CreateStaffDto) {
    await this.assertMembership(user.id, businessId);
    return this.prisma.staff.create({
      data: { businessId, name: dto.name, roleTitle: dto.roleTitle ?? null },
    });
  }

  async updateStaff(
    user: AuthenticatedUser,
    businessId: string,
    staffId: string,
    dto: UpdateStaffDto
  ) {
    await this.assertMembership(user.id, businessId);
    const updated = await this.prisma.staff.updateMany({
      where: { id: staffId, businessId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.roleTitle !== undefined ? { roleTitle: dto.roleTitle } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
      },
    });
    if (updated.count === 0) {
      throw new NotFoundException('Staff member not found for this business');
    }
    return this.prisma.staff.findFirst({ where: { id: staffId, businessId } });
  }

  // ── Appointments lifecycle ────────────────────────────────────────────

  async listAppointments(user: AuthenticatedUser, businessId: string, query: AppointmentListQuery) {
    await this.assertMembership(user.id, businessId);

    const take = Math.min(
      Math.max(Math.trunc(query.limit ?? DEFAULT_PAGE_SIZE) || DEFAULT_PAGE_SIZE, 1),
      MAX_PAGE_SIZE
    );
    const skip = Math.max(((query.page ?? 1) - 1) * take, 0);

    const where = {
      businessId,
      ...(query.status ? { status: query.status } : {}),
      ...(query.staffId ? { staffId: query.staffId } : {}),
      ...(query.from || query.to
        ? {
            startAtUtc: {
              ...(query.from ? { gte: new Date(query.from) } : {}),
              ...(query.to ? { lte: new Date(query.to) } : {}),
            },
          }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.appointment.findMany({
        where,
        orderBy: { startAtUtc: 'asc' },
        take,
        skip,
        include: {
          clientUser: { select: { id: true, name: true } },
          staff: { select: { id: true, name: true } },
          location: { select: { id: true, label: true } },
          appointmentItems: { include: { serviceVariant: { select: { id: true, name: true } } } },
        },
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return { data, meta: { page: skip / take + 1, limit: take, total } };
  }

  /**
   * Atomic transition: only BOOKED appointments can move on, and only to a
   * provider-legal target status. The businessId in the where clause doubles
   * as an ownership guard at the database level.
   */
  async updateAppointmentStatus(
    user: AuthenticatedUser,
    appointmentId: string,
    dto: UpdateAppointmentStatusDto
  ) {
    if (!(PROVIDER_TRANSITIONS as readonly string[]).includes(dto.status)) {
      throw new BadRequestException(
        `Providers may only set status to ${PROVIDER_TRANSITIONS.join(' | ')}`
      );
    }

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      select: { id: true, businessId: true, status: true },
    });
    if (!appointment) throw new NotFoundException('Appointment not found');

    await this.assertMembership(user.id, appointment.businessId);

    if (appointment.status !== 'BOOKED') {
      throw new BadRequestException(
        `Only BOOKED appointments can transition (current: ${appointment.status})`
      );
    }

    const result = await this.prisma.appointment.updateMany({
      where: { id: appointmentId, businessId: appointment.businessId, status: 'BOOKED' },
      data: {
        status: dto.status,
        ...(dto.status === 'CANCELLED'
          ? { cancelledAt: new Date(), cancelReason: dto.reason ?? 'cancelled_by_provider' }
          : {}),
      },
    });
    if (result.count === 0) {
      throw new ConflictException('Appointment is no longer booked');
    }

    return this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        clientUser: { select: { id: true, name: true } },
        staff: { select: { id: true, name: true } },
        appointmentItems: true,
      },
    });
  }
}
