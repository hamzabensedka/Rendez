import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DateTime } from 'luxon';
import { localToUtc, getStartOfDayUtc, getEndOfDayUtc } from '@planity/shared';
import {
  DEFAULT_SLOT_STEP_MIN,
  CACHE_TTL_AVAILABILITY,
} from '@planity/shared';
import type { Business, ServiceVariant } from '@prisma/client';
import { RedisCacheService } from '../redis/redis-cache.service';

/** Interval in UTC for availability computation */
interface UtcInterval {
  start: Date;
  end: Date;
}

/** Response shape for available slots (also used as cache payload). */
export interface AvailabilitySlotsResponse {
  date: string;
  timezone: string;
  slotStepMin: number;
  slots: Array<{ startAt: string; staffId: string | null }>;
}

@Injectable()
export class AvailabilityService {
  constructor(
    private prisma: PrismaService,
    private readonly cache: RedisCacheService
  ) {}

  async getAvailableSlots(
    businessId: string,
    date: string,
    serviceVariantId: string,
    staffId?: string
  ) {
    const cacheKey = `planity:availability:slots:${[
      businessId,
      date,
      serviceVariantId,
      staffId ?? '',
    ].join(':')}`;
    const cached = await this.cache.getJson<AvailabilitySlotsResponse>(cacheKey);
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
      this.loadRulesForDay(businessId, date, timezone, staffId),
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
    const afterTimeOff = this.subtractIntervals(openFromRules, timeOffs);
    const afterAppointments = this.subtractIntervals(afterTimeOff, appointments);
    const slots = this.generateSlotsFromIntervals(
      afterAppointments,
      requiredDuration,
      staffId ?? null
    );

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
    timezone: string,
    staffId?: string
  ) {
    const dayOfWeek = DateTime.fromISO(date).weekday % 7;
    const dayStartUtc = getStartOfDayUtc(date, timezone);
    const dayEndUtc = getEndOfDayUtc(date, timezone);

    return this.prisma.availabilityRule.findMany({
      where: {
        businessId,
        staffId: staffId ?? null,
        dayOfWeek,
        OR: [
          { effectiveFrom: null },
          { effectiveFrom: { lte: dayEndUtc } },
        ],
        AND: [
          {
            OR: [
              { effectiveTo: null },
              { effectiveTo: { gte: dayStartUtc } },
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
        currentStart = new Date(
          Math.max(currentStart.getTime(), b.endAtUtc.getTime())
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
