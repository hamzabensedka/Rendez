import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DateTime } from 'luxon';
import { localToUtc, getStartOfDayUtc, getEndOfDayUtc } from '@planity/shared';
import {
  DEFAULT_SLOT_STEP_MIN,
  CACHE_TTL_AVAILABILITY,
} from '@planity/shared';
import type { Business, ServiceVariant } from '@prisma/client';

/** Interval in UTC for availability computation */
interface UtcInterval {
  start: Date;
  end: Date;
}

/** Cache entry for availability slots */
interface AvailabilityCacheEntry {
  result: {
    date: string;
    timezone: string;
    slotStepMin: number;
    slots: Array< { startAt: string; staffId: string | null }>;
  };
  expiresAt: number;
}

@Injectable()
export class AvailabilityService {
  /** In-memory cache for slot results; replace with Redis for multi-instance. */
  private readonly slotCache = new Map<string, AvailabilityCacheEntry>();

  constructor(private prisma: PrismaService) {}

  async getAvailableSlots(
    businessId: string,
    date: string,
    serviceVariantId: string,
    staffId?: string
  ) {
    const cacheKey = [businessId, date, serviceVariantId, staffId ?? ''].join(':');
    const cached = this.getCachedSlots(cacheKey);
    if (cached) return cached;

    const { business, variant } = await this.loadBusinessAndVariant(
      businessId,
      serviceVariantId
    );
    const timezone = business.timezone;
    const requiredDuration =
      variant.durationMin + variant.bufferBeforeMin + variant.bufferAfterMin;

    const startOfDayUtc = getStartOfDayUtc(date, timezone);
    const endOfDayUtc = getEndOfDayUtc(date, timezone);

    const [rules, timeOffs, appointments] = await Promise.all([
      this.loadRulesForDay(businessId, date, staffId),
      this.loadTimeOffsInRange(businessId, startOfDayUtc, endOfDayUtc, staffId),
      this.loadAppointmentsInRange(
        businessId,
        startOfDayUtc,
        endOfDayUtc,
        staffId
      ),
    ]);

    const openFromRules = this.buildOpenIntervalsFromRules(
      date,
      timezone,
      rules
    );
    const afterTimeOff = this.subtractTimeOffsFromIntervals(openFromRules, timeOffs);
    const afterAppointments = this.subtractAppointmentsFromIntervals(
      afterTimeOff,
      appointments
    );
    const slots = this.generateSlotsFromIntervals(
      afterAppointments,
      requiredDuration,
      staffId ?? null
    );

    const result = {
      date,
      timezone,
      slotStepMin: DEFAULT_SLOT_STEP_MIN,
      slots: slots.map((s) => ({
        startAt: s.startAt.toISOString(),
        staffId: s.staffId,
      })),
    };

    this.setCachedSlots(cacheKey, result, CACHE_TTL_AVAILABILITY);
    return result;
  }

  private getCachedSlots(key: string): AvailabilityCacheEntry['result'] | null {
    const entry = this.slotCache.get(key);
    if (!entry || Date.now() > entry.expiresAt) {
      if (entry) this.slotCache.delete(key);
      return null;
    }
    return entry.result;
  }

  private setCachedSlots(
    key: string,
    result: AvailabilityCacheEntry['result'],
    ttlSeconds: number
  ): void {
    this.slotCache.set(key, {
      result,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  private async loadBusinessAndVariant(
    businessId: string,
    serviceVariantId: string
  ): Promise<{ business: Business; variant: ServiceVariant }> {
    const [business, variant] = await Promise.all([
      this.prisma.business.findUnique({ where: { id: businessId } }),
      this.prisma.serviceVariant.findUnique({
        where: { id: serviceVariantId },
      }),
    ]);
    if (!business) throw new NotFoundException('Business not found');
    if (!variant) throw new NotFoundException('Service variant not found');
    return { business, variant };
  }

  private async loadRulesForDay(
    businessId: string,
    date: string,
    staffId?: string
  ) {
    const dayOfWeek = DateTime.fromISO(date).weekday % 7;
    return this.prisma.availabilityRule.findMany({
      where: {
        businessId,
        staffId: staffId ?? null,
        dayOfWeek,
        OR: [
          { effectiveFrom: null },
          { effectiveFrom: { lte: new Date(date) } },
        ],
        AND: [
          {
            OR: [
              { effectiveTo: null },
              { effectiveTo: { gte: new Date(date) } },
            ],
          },
        ],
      },
    });
  }

  private async loadTimeOffsInRange(
    businessId: string,
    startUtc: Date,
    endUtc: Date,
    staffId?: string
  ) {
    return this.prisma.timeOff.findMany({
      where: {
        businessId,
        staffId: staffId ?? null,
        AND: [
          { startAtUtc: { lte: endUtc } },
          { endAtUtc: { gte: startUtc } },
        ],
      },
    });
  }

  private async loadAppointmentsInRange(
    businessId: string,
    startUtc: Date,
    endUtc: Date,
    staffId?: string
  ) {
    return this.prisma.appointment.findMany({
      where: {
        businessId,
        staffId: staffId ?? null,
        status: { not: 'CANCELLED' },
        AND: [
          { startAtUtc: { lte: endUtc } },
          { endAtUtc: { gte: startUtc } },
        ],
      },
    });
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

  private subtractTimeOffsFromIntervals(
    intervals: UtcInterval[],
    timeOffs: Array<{ startAtUtc: Date; endAtUtc: Date }>
  ): UtcInterval[] {
    const result: UtcInterval[] = [];
    for (const interval of intervals) {
      let currentStart = interval.start;
      const end = interval.end;
      const overlapping = timeOffs
        .filter(
          (to) => to.startAtUtc < end && to.endAtUtc > currentStart
        )
        .sort((a, b) => a.startAtUtc.getTime() - b.startAtUtc.getTime());
      for (const to of overlapping) {
        if (currentStart < to.startAtUtc) {
          result.push({ start: currentStart, end: to.startAtUtc });
        }
        currentStart = new Date(
          Math.max(currentStart.getTime(), to.endAtUtc.getTime())
        );
      }
      if (currentStart < end) {
        result.push({ start: currentStart, end });
      }
    }
    return result;
  }

  private subtractAppointmentsFromIntervals(
    intervals: UtcInterval[],
    appointments: Array<{ startAtUtc: Date; endAtUtc: Date }>
  ): UtcInterval[] {
    const result: UtcInterval[] = [];
    for (const interval of intervals) {
      let currentStart = interval.start;
      const end = interval.end;
      const overlapping = appointments
        .filter((apt) => apt.startAtUtc < end && apt.endAtUtc > currentStart)
        .sort((a, b) => a.startAtUtc.getTime() - b.startAtUtc.getTime());
      for (const apt of overlapping) {
        if (currentStart < apt.startAtUtc) {
          result.push({ start: currentStart, end: apt.startAtUtc });
        }
        currentStart = new Date(
          Math.max(currentStart.getTime(), apt.endAtUtc.getTime())
        );
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
    staffId: string | null
  ): Array<{ startAt: Date; staffId: string | null }> {
    const slots: Array<{ startAt: Date; staffId: string | null }> = [];
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
