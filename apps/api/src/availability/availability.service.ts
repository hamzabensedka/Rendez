import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DateTime } from 'luxon';
import { localToUtc, getStartOfDayUtc, getEndOfDayUtc } from '@planity/shared';
import { DEFAULT_SLOT_STEP_MIN } from '@planity/shared';

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  async getAvailableSlots(
    businessId: string,
    date: string, // YYYY-MM-DD
    serviceVariantId: string,
    staffId?: string
  ) {
    // Get business with timezone
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    // Get service variant
    const variant = await this.prisma.serviceVariant.findUnique({
      where: { id: serviceVariantId },
    });

    if (!variant) {
      throw new NotFoundException('Service variant not found');
    }

    const timezone = business.timezone;
    const requiredDuration = variant.durationMin + variant.bufferBeforeMin + variant.bufferAfterMin;

    // Get date range in UTC
    const startOfDayUtc = getStartOfDayUtc(date, timezone);
    const endOfDayUtc = getEndOfDayUtc(date, timezone);

    // Get availability rules
    const rules = await this.prisma.availabilityRule.findMany({
      where: {
        businessId,
        staffId: staffId || null,
        dayOfWeek: DateTime.fromISO(date).weekday % 7, // 0-6 (Sunday = 0)
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

    // Get time offs
    const timeOffs = await this.prisma.timeOff.findMany({
      where: {
        businessId,
        staffId: staffId || null,
        OR: [
          {
            AND: [
              { startAtUtc: { lte: endOfDayUtc } },
              { endAtUtc: { gte: startOfDayUtc } },
            ],
          },
        ],
      },
    });

    // Get existing appointments
    const appointments = await this.prisma.appointment.findMany({
      where: {
        businessId,
        staffId: staffId || null,
        status: { not: 'CANCELLED' },
        OR: [
          {
            AND: [
              { startAtUtc: { lte: endOfDayUtc } },
              { endAtUtc: { gte: startOfDayUtc } },
            ],
          },
        ],
      },
    });

    // Build available intervals
    const availableIntervals: Array<{ start: Date; end: Date }> = [];

    for (const rule of rules) {
      const startLocal = localToUtc(date, rule.startTimeLocal, timezone);
      const endLocal = localToUtc(date, rule.endTimeLocal, timezone);

      // Subtract time offs
      let intervalStart = startLocal;
      const intervalEnd = endLocal;

      for (const timeOff of timeOffs) {
        if (timeOff.startAtUtc <= intervalStart && timeOff.endAtUtc > intervalStart) {
          intervalStart = timeOff.endAtUtc;
        }
      }

      if (intervalStart < intervalEnd) {
        availableIntervals.push({ start: intervalStart, end: intervalEnd });
      }
    }

    // Subtract appointments
    const finalIntervals: Array<{ start: Date; end: Date }> = [];

    for (const interval of availableIntervals) {
      let currentStart = interval.start;

      // Sort appointments by start time
      const overlappingAppointments = appointments
        .filter(
          (apt) =>
            apt.startAtUtc < interval.end && apt.endAtUtc > interval.start
        )
        .sort((a, b) => a.startAtUtc.getTime() - b.startAtUtc.getTime());

      for (const apt of overlappingAppointments) {
        if (currentStart < apt.startAtUtc) {
          finalIntervals.push({ start: currentStart, end: apt.startAtUtc });
        }
        currentStart = new Date(Math.max(currentStart.getTime(), apt.endAtUtc.getTime()));
      }

      if (currentStart < interval.end) {
        finalIntervals.push({ start: currentStart, end: interval.end });
      }
    }

    // Generate slots
    const slots: Array<{ startAt: Date; staffId: string | null }> = [];
    const slotStepMs = DEFAULT_SLOT_STEP_MIN * 60 * 1000;
    const requiredDurationMs = requiredDuration * 60 * 1000;

    for (const interval of finalIntervals) {
      let slotStart = interval.start;

      while (slotStart.getTime() + requiredDurationMs <= interval.end.getTime()) {
        slots.push({
          startAt: new Date(slotStart),
          staffId: staffId || null,
        });
        slotStart = new Date(slotStart.getTime() + slotStepMs);
      }
    }

    return {
      date,
      timezone,
      slotStepMin: DEFAULT_SLOT_STEP_MIN,
      slots: slots.map((slot) => ({
        startAt: slot.startAt.toISOString(),
        staffId: slot.staffId,
      })),
    };
  }
}

