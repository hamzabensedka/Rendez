import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisCacheService } from '../redis/redis-cache.service';
import { DateTime } from 'luxon';

describe('AvailabilityService', () => {
  let service: AvailabilityService;
  const businessId = 'biz-1';
  const variantId = 'var-1';
  const timezone = 'Europe/Paris';

  const createMockPrisma = () => ({
    business: { findUnique: jest.fn() },
    serviceVariant: { findUnique: jest.fn() },
    availabilityRule: { findMany: jest.fn() },
    timeOff: { findMany: jest.fn() },
    appointment: { findMany: jest.fn() },
  });

  let mockPrisma: ReturnType<typeof createMockPrisma>;

  const mockCache = {
    getJson: jest.fn().mockResolvedValue(null),
    setJson: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    mockPrisma = createMockPrisma();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvailabilityService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisCacheService, useValue: mockCache },
      ],
    }).compile();

    service = module.get<AvailabilityService>(AvailabilityService);
    jest.clearAllMocks();
  });

  describe('getAvailableSlots', () => {
    const date = '2026-06-15';

    it('throws NotFoundException when business is not found', async () => {
      mockPrisma.business.findUnique.mockResolvedValue(null);

      await expect(
        service.getAvailableSlots(businessId, date, variantId)
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.getAvailableSlots(businessId, date, variantId)
      ).rejects.toThrow(/business not found/i);
    });

    it('throws NotFoundException when service variant is not found', async () => {
      mockPrisma.business.findUnique.mockResolvedValue({ id: businessId, timezone });
      mockPrisma.serviceVariant.findUnique.mockResolvedValue(null);

      await expect(
        service.getAvailableSlots(businessId, date, variantId)
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.getAvailableSlots(businessId, date, variantId)
      ).rejects.toThrow(/service variant not found/i);
    });

    it('returns date and timezone in response', async () => {
      mockPrisma.business.findUnique.mockResolvedValue({ id: businessId, timezone });
      mockPrisma.serviceVariant.findUnique.mockResolvedValue({
        id: variantId,
        durationMin: 30,
        bufferBeforeMin: 0,
        bufferAfterMin: 0,
      });
      mockPrisma.availabilityRule.findMany.mockResolvedValue([
        {
          startTimeLocal: '09:00',
          endTimeLocal: '17:00',
          dayOfWeek: DateTime.fromISO(date).weekday % 7,
        },
      ]);
      mockPrisma.timeOff.findMany.mockResolvedValue([]);
      mockPrisma.appointment.findMany.mockResolvedValue([]);

      const result = await service.getAvailableSlots(businessId, date, variantId);

      expect(result.date).toBe(date);
      expect(result.timezone).toBe(timezone);
      expect(Array.isArray(result.slots)).toBe(true);
    });

    it('excludes slots overlapping existing appointments', async () => {
      mockPrisma.business.findUnique.mockResolvedValue({ id: businessId, timezone });
      mockPrisma.serviceVariant.findUnique.mockResolvedValue({
        id: variantId,
        durationMin: 30,
        bufferBeforeMin: 0,
        bufferAfterMin: 0,
      });
      const startLocal = DateTime.fromISO(`${date}T10:00`, { zone: timezone }).toUTC().toJSDate();
      const endLocal = DateTime.fromISO(`${date}T10:30`, { zone: timezone }).toUTC().toJSDate();
      mockPrisma.availabilityRule.findMany.mockResolvedValue([
        {
          startTimeLocal: '09:00',
          endTimeLocal: '17:00',
          dayOfWeek: DateTime.fromISO(date).weekday % 7,
        },
      ]);
      mockPrisma.timeOff.findMany.mockResolvedValue([]);
      mockPrisma.appointment.findMany.mockResolvedValue([
        {
          startAtUtc: startLocal,
          endAtUtc: endLocal,
          status: 'BOOKED',
        },
      ]);

      const result = await service.getAvailableSlots(businessId, date, variantId);

      expect(result.slots.length).toBeGreaterThan(0);
      const slotStarts = result.slots.map((s) => s.startAt);
      const tenOClockIso = DateTime.fromISO(`${date}T10:00`, { zone: timezone })
        .toUTC()
        .toISO();
      expect(slotStarts).not.toContain(tenOClockIso);
    });
  });
});
