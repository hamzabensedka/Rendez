import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DateTime } from 'luxon';
import { localToUtc, getStartOfDayUtc, getEndOfDayUtc } from '@planity/shared';
import { DEFAULT_SLOT_STEP_MIN, CACHE_TTL_AVAILABILITY } from '@planity/shared';
import type { Business, ServiceVariant } from '@prisma/client';
import { RedisCacheService } from '../redis/redis-cache.service';

/** Interval in UTC for availability computation */
interface UtcInterval {
  start: Date;
  end: Date;
}

interface StaffRow {
  id: string;
  isActive: boolean;
  createdAt: Date;
}

interface RuleRow {
  staffId: string | null;
  startTimeLocal: string;
  endTimeLocal: string;
}

interface BusyRow {
  staffId: string | null;
  startAtUtc: Date;
  endAtUtc: Date;
}

/** Response shape for available slots (also used as cache payload). */
export interface AvailabilitySlotsResponse {
  date: string;
  timezone: string;
  slotStepMin: number;
  slots: Array<{ startAt: string; staffId: string | null }>;
}

const SLOT_CACHE_PREFIX = 'planity:availability:slots:';

@Injectable()
export class AvailabilityService {
  constructor(
    private prisma: PrismaService,
    private readonly cache: RedisCacheService
  ) {}

  async invalidateForBusiness(businessId: string): Promise<void> {
    await this.cache.delByPrefix(`${SLOT_CACHE_PREFIX}${businessId}:`);
  }

  async getAvailableSlots(
    businessId: string,
    date: string,
    serviceVariantId: string,
    staffId?: string,
    additionalVariantIds: string[] = [],
    skipCache = false
  ) {
    const variantIds = uniqueIds([serviceVariantId, ...additionalVariantIds]);
    const cacheKey = `${SLOT_CACHE_PREFIX}${[
      businessId,
      date,
      variantIds.join(','),
      staffId ?? '',
    ].join(':')}`;
    if (!skipCache) {
      const cached = await this.cache.getJson<AvailabilitySlotsResponse>(cacheKey);
      if (cached) return cached;
    }

    const { business, variants } = await this.loadBusinessAndVariants(businessId, variantIds);
    const timezone = business.timezone;
    const requiredDuration = variants.reduce(
      (sum, variant) =>
        sum + variant.durationMin + variant.bufferBeforeMin + variant.bufferAfterMin,
      0
    );

    const startOfDayUtc = getStartOfDayUtc(date, timezone);
    const endOfDayUtc = getEndOfDayUtc(date, timezone);

    const staff = await this.loadActiveStaff(businessId, staffId);
    const [rules, timeOffs, appointments] = await Promise.all([
      this.loadRulesForDay(businessId, date, timezone),
      this.loadTimeOffsInRange(businessId, startOfDayUtc, endOfDayUtc),
      this.loadAppointmentsInRange(
        businessId,
        startOfDayUtc,
        endOfDayUtc,
        staff.map((s) => s.id)
      ),
    ]);

    const perStaffSlots = staff.flatMap((member) =>
      this.slotsForStaff({
        member,
        date,
        timezone,
        requiredDuration,
        rules,
        timeOffs,
        appointments,
      })
    );

    const slots = staffId
      ? perStaffSlots
      : this.collapseNoPreference(perStaffSlots, staff, appointments);

    const result: AvailabilitySlotsResponse = {
      date,
      timezone,
      slotStepMin: DEFAULT_SLOT_STEP_MIN,
      slots: slots.map((s) => ({
        startAt: s.startAt.toISOString(),
        staffId: s.staffId,
      })),
    };

    await this.cache.setJson(cacheKey, result, CACHE_TTL_AVAILABILITY);
    return result;
  }

  private async loadBusinessAndVariants(
    businessId: string,
    variantIds: string[]
  ): Promise<{ business: Business; variants: ServiceVariant[] }> {
    const business = await this.prisma.business.findUnique({ where: { id: businessId } });
    if (!business) throw new NotFoundException('Business not found');
    const variants = await this.prisma.serviceVariant.findMany({
      where: { id: { in: variantIds } },
      include: { service: { select: { businessId: true, isActive: true } } },
    });
    if (!variants.length || variants.length !== variantIds.length) {
      throw new NotFoundException('Service variant not found');
    }
    for (const variant of variants) {
      const service = (
        variant as ServiceVariant & { service: { businessId: string; isActive: boolean } }
      ).service;
      if (!service?.isActive || service.businessId !== businessId) {
        throw new NotFoundException('Service variant not found');
      }
    }
    return { business, variants };
  }

  private async loadActiveStaff(businessId: string, staffId?: string): Promise<StaffRow[]> {
    const rows = await this.prisma.staff.findMany({
      where: { businessId, isActive: true, ...(staffId ? { id: staffId } : {}) },
      select: { id: true, isActive: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });
    return rows ?? [];
  }

  private async loadRulesForDay(businessId: string, date: string, timezone: string) {
    const dayOfWeek = DateTime.fromISO(date, { zone: timezone }).weekday % 7;
    const dayStartUtc = getStartOfDayUtc(date, timezone);
    const dayEndUtc = getEndOfDayUtc(date, timezone);

    return this.prisma.availabilityRule.findMany({
      where: {
        businessId,
        dayOfWeek,
        OR: [{ effectiveFrom: null }, { effectiveFrom: { lte: dayEndUtc } }],
        AND: [
          {
            OR: [{ effectiveTo: null }, { effectiveTo: { gte: dayStartUtc } }],
          },
        ],
      },
    });
  }

  private async loadTimeOffsInRange(businessId: string, startUtc: Date, endUtc: Date) {
    return this.prisma.timeOff.findMany({
      where: {
        businessId,
        AND: [{ startAtUtc: { lte: endUtc } }, { endAtUtc: { gte: startUtc } }],
      },
    });
  }

  private async loadAppointmentsInRange(
    businessId: string,
    startUtc: Date,
    endUtc: Date,
    staffIds: string[]
  ) {
    if (staffIds.length === 0) return [];
    return this.prisma.appointment.findMany({
      where: {
        businessId,
        staffId: { in: staffIds },
        status: { not: 'CANCELLED' },
        AND: [{ startAtUtc: { lte: endUtc } }, { endAtUtc: { gte: startUtc } }],
      },
    });
  }

  private slotsForStaff(args: {
    member: StaffRow;
    date: string;
    timezone: string;
    requiredDuration: number;
    rules: RuleRow[];
    timeOffs: BusyRow[];
    appointments: BusyRow[];
  }): Array<{ startAt: Date; staffId: string }> {
    const { member, date, timezone, requiredDuration, rules, timeOffs, appointments } = args;
    const staffRules = rules.filter((r) => r.staffId === member.id);
    const businessRules = rules.filter((r) => r.staffId == null);
    const open = this.openForStaff(date, timezone, staffRules, businessRules);
    const busy = [
      ...timeOffs.filter((t) => t.staffId === member.id || t.staffId == null),
      ...appointments.filter((a) => a.staffId === member.id),
    ];
    const free = this.subtractIntervals(open, busy);
    return this.generateSlotsFromIntervals(free, requiredDuration, member.id);
  }

  private openForStaff(
    date: string,
    timezone: string,
    staffRules: RuleRow[],
    businessRules: RuleRow[]
  ): UtcInterval[] {
    const staffOpen = this.buildOpenIntervalsFromRules(date, timezone, staffRules);
    const businessOpen = this.buildOpenIntervalsFromRules(date, timezone, businessRules);
    if (staffOpen.length && businessOpen.length) {
      return this.intersectIntervals(staffOpen, businessOpen);
    }
    if (staffOpen.length) return staffOpen;
    if (businessOpen.length) return businessOpen;
    return [];
  }

  private collapseNoPreference(
    slots: Array<{ startAt: Date; staffId: string }>,
    staff: StaffRow[],
    appointments: BusyRow[]
  ): Array<{ startAt: Date; staffId: string }> {
    const bookingCount = new Map<string, number>();
    for (const member of staff) {
      bookingCount.set(member.id, appointments.filter((a) => a.staffId === member.id).length);
    }
    const createdAt = new Map(staff.map((s) => [s.id, s.createdAt.getTime()] as const));
    const byStart = new Map<number, string[]>();
    for (const slot of slots) {
      const t = slot.startAt.getTime();
      const list = byStart.get(t) ?? [];
      list.push(slot.staffId);
      byStart.set(t, list);
    }
    const collapsed: Array<{ startAt: Date; staffId: string }> = [];
    const starts = [...byStart.keys()].sort((a, b) => a - b);
    for (const t of starts) {
      const candidates = byStart.get(t)!;
      const winner = [...candidates].sort((a, b) => {
        const countDiff = (bookingCount.get(a) ?? 0) - (bookingCount.get(b) ?? 0);
        if (countDiff !== 0) return countDiff;
        return (createdAt.get(a) ?? 0) - (createdAt.get(b) ?? 0);
      })[0];
      collapsed.push({ startAt: new Date(t), staffId: winner });
    }
    return collapsed;
  }

  private buildOpenIntervalsFromRules(
    date: string,
    timezone: string,
    rules: Array<{ startTimeLocal: string; endTimeLocal: string }>
  ): UtcInterval[] {
    const intervals: UtcInterval[] = [];
    for (const rule of rules) {
      const start = localToUtc(date, rule.startTimeLocal, timezone);
      const end = localToUtc(date, rule.endTimeLocal, timezone);
      intervals.push({ start, end });
    }
    return intervals;
  }

  private intersectIntervals(a: UtcInterval[], b: UtcInterval[]): UtcInterval[] {
    const result: UtcInterval[] = [];
    for (const x of a) {
      for (const y of b) {
        const start = x.start > y.start ? x.start : y.start;
        const end = x.end < y.end ? x.end : y.end;
        if (start < end) result.push({ start, end });
      }
    }
    return result;
  }

  private subtractIntervals(
    intervals: UtcInterval[],
    busy: Array<{ startAtUtc: Date; endAtUtc: Date }>
  ): UtcInterval[] {
    const result: UtcInterval[] = [];
    for (const interval of intervals) {
      let currentStart = interval.start;
      const end = interval.end;
      const overlapping = busy
        .filter((b) => b.startAtUtc < end && b.endAtUtc > currentStart)
        .sort((a, b) => a.startAtUtc.getTime() - b.startAtUtc.getTime());
      for (const b of overlapping) {
        if (currentStart < b.startAtUtc) {
          result.push({ start: currentStart, end: b.startAtUtc });
        }
        currentStart = new Date(Math.max(currentStart.getTime(), b.endAtUtc.getTime()));
      }
      if (currentStart < end) {
        result.push({ start: currentStart, end });
      }
    }
    return result;
  }

  private generateSlotsFromIntervals(
    intervals: UtcInterval[],
    requiredDurationMin: number,
    staffId: string
  ): Array<{ startAt: Date; staffId: string }> {
    const slots: Array<{ startAt: Date; staffId: string }> = [];
    const stepMs = DEFAULT_SLOT_STEP_MIN * 60 * 1000;
    const durationMs = requiredDurationMin * 60 * 1000;
    for (const interval of intervals) {
      let t = interval.start.getTime();
      const endMs = interval.end.getTime();
      while (t + durationMs <= endMs) {
        slots.push({ startAt: new Date(t), staffId });
        t += stepMs;
      }
    }
    return slots;
  }
}

function uniqueIds(ids: string[]): string[] {
  return [...new Set(ids.filter(Boolean))];
}
