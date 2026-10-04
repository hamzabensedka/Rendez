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

  const sophieId = 'staff-sophie';
  const thomasId = 'staff-thomas';

  const createMockPrisma = () => ({
    business: { findUnique: jest.fn() },
    serviceVariant: { findUnique: jest.fn(), findMany: jest.fn() },
    staff: { findMany: jest.fn() },
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

      await expect(service.getAvailableSlots(businessId, date, variantId)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.getAvailableSlots(businessId, date, variantId)).rejects.toThrow(
        /business not found/i
      );
    });

    it('throws NotFoundException when service variant is not found', async () => {
      mockPrisma.business.findUnique.mockResolvedValue({ id: businessId, timezone });
      mockPrisma.serviceVariant.findMany.mockResolvedValue([]);

      await expect(service.getAvailableSlots(businessId, date, variantId)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.getAvailableSlots(businessId, date, variantId)).rejects.toThrow(
        /service variant not found/i
      );
    });

    it('returns date and timezone in response', async () => {
      mockPrisma.business.findUnique.mockResolvedValue({ id: businessId, timezone });
      mockPrisma.serviceVariant.findMany.mockResolvedValue([
        {
          id: variantId,
          durationMin: 30,
          bufferBeforeMin: 0,
          bufferAfterMin: 0,
          service: { businessId, isActive: true },
        },
      ]);
      mockPrisma.staff.findMany.mockResolvedValue([]);
      mockPrisma.availabilityRule.findMany.mockResolvedValue([
        {
          staffId: null,
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
      mockPrisma.serviceVariant.findMany.mockResolvedValue([
        {
          id: variantId,
          durationMin: 30,
          bufferBeforeMin: 0,
          bufferAfterMin: 0,
          service: { businessId, isActive: true },
        },
      ]);
      mockPrisma.staff.findMany.mockResolvedValue([
        { id: sophieId, isActive: true, createdAt: new Date('2020-01-01') },
      ]);
      const startLocal = DateTime.fromISO(`${date}T10:00`, { zone: timezone }).toUTC().toJSDate();
      const endLocal = DateTime.fromISO(`${date}T10:30`, { zone: timezone }).toUTC().toJSDate();
      mockPrisma.availabilityRule.findMany.mockResolvedValue([
        {
          staffId: sophieId,
          startTimeLocal: '09:00',
          endTimeLocal: '17:00',
          dayOfWeek: DateTime.fromISO(date).weekday % 7,
        },
      ]);
      mockPrisma.timeOff.findMany.mockResolvedValue([]);
      mockPrisma.appointment.findMany.mockResolvedValue([
        {
          staffId: sophieId,
          startAtUtc: startLocal,
          endAtUtc: endLocal,
          status: 'BOOKED',
        },
      ]);

      const result = await service.getAvailableSlots(businessId, date, variantId);

      expect(result.slots.length).toBeGreaterThan(0);
      const slotStarts = result.slots.map((s) => s.startAt);
      const tenOClockIso = DateTime.fromISO(`${date}T10:00`, { zone: timezone }).toUTC().toISO();
      expect(slotStarts).not.toContain(tenOClockIso);
    });

    it('omitting staffId tags each slot with a real person and hides Sophie 10:00 when she is booked', async () => {
      mockPrisma.business.findUnique.mockResolvedValue({ id: businessId, timezone });
      mockPrisma.serviceVariant.findUnique.mockResolvedValue({
        id: variantId,
        durationMin: 30,
        bufferBeforeMin: 0,
        bufferAfterMin: 0,
        service: { businessId, isActive: true },
      });
      mockPrisma.serviceVariant.findMany.mockResolvedValue([
        {
          id: variantId,
          durationMin: 30,
          bufferBeforeMin: 0,
          bufferAfterMin: 0,
          service: { businessId, isActive: true },
        },
      ]);
      mockPrisma.staff.findMany.mockResolvedValue([
        { id: sophieId, isActive: true, createdAt: new Date('2020-01-01') },
        { id: thomasId, isActive: true, createdAt: new Date('2020-01-02') },
      ]);
      mockPrisma.availabilityRule.findMany.mockResolvedValue([
        { staffId: null, startTimeLocal: '09:00', endTimeLocal: '17:00' },
        { staffId: sophieId, startTimeLocal: '09:00', endTimeLocal: '17:00' },
        { staffId: thomasId, startTimeLocal: '09:00', endTimeLocal: '17:00' },
      ]);
      mockPrisma.timeOff.findMany.mockResolvedValue([]);
      const bookedStart = DateTime.fromISO(`${date}T10:00`, { zone: timezone }).toUTC().toJSDate();
      const bookedEnd = DateTime.fromISO(`${date}T10:30`, { zone: timezone }).toUTC().toJSDate();
      mockPrisma.appointment.findMany.mockResolvedValue([
        {
          staffId: sophieId,
          startAtUtc: bookedStart,
          endAtUtc: bookedEnd,
          status: 'BOOKED',
        },
      ]);

      const result = await service.getAvailableSlots(businessId, date, variantId);
      const tenIso = DateTime.fromISO(`${date}T10:00`, { zone: timezone }).toUTC().toISO();
      const atTen = result.slots.filter((s) => s.startAt === tenIso);

      expect(result.slots.every((s) => s.staffId !== null)).toBe(true);
      expect(atTen.some((s) => s.staffId === sophieId)).toBe(false);
      expect(atTen.some((s) => s.staffId === thomasId)).toBe(true);
    });

    it('subtracts salon-wide time off from a named staff calendar', async () => {
      mockPrisma.business.findUnique.mockResolvedValue({ id: businessId, timezone });
      mockPrisma.serviceVariant.findUnique.mockResolvedValue({
        id: variantId,
        durationMin: 30,
        bufferBeforeMin: 0,
        bufferAfterMin: 0,
        service: { businessId, isActive: true },
      });
      mockPrisma.serviceVariant.findMany.mockResolvedValue([
        {
          id: variantId,
          durationMin: 30,
          bufferBeforeMin: 0,
          bufferAfterMin: 0,
          service: { businessId, isActive: true },
        },
      ]);
      mockPrisma.staff.findMany.mockResolvedValue([
        { id: sophieId, isActive: true, createdAt: new Date('2020-01-01') },
      ]);
      mockPrisma.availabilityRule.findMany.mockResolvedValue([
        { staffId: sophieId, startTimeLocal: '09:00', endTimeLocal: '17:00' },
      ]);
      const dayStart = DateTime.fromISO(`${date}T00:00`, { zone: timezone }).toUTC().toJSDate();
      const dayEnd = DateTime.fromISO(`${date}T23:59`, { zone: timezone }).toUTC().toJSDate();
      mockPrisma.timeOff.findMany.mockResolvedValue([
        { staffId: null, startAtUtc: dayStart, endAtUtc: dayEnd },
      ]);
      mockPrisma.appointment.findMany.mockResolvedValue([]);

      const result = await service.getAvailableSlots(businessId, date, variantId, sophieId);

      expect(result.slots).toEqual([]);
    });

    it('uses the summed duration of every requested variant', async () => {
      const colorId = 'var-color';
      mockPrisma.business.findUnique.mockResolvedValue({ id: businessId, timezone });
      mockPrisma.serviceVariant.findUnique.mockResolvedValue({
        id: variantId,
        durationMin: 30,
        bufferBeforeMin: 0,
        bufferAfterMin: 0,
        service: { businessId, isActive: true },
      });
      mockPrisma.serviceVariant.findMany.mockResolvedValue([
        {
          id: variantId,
          durationMin: 30,
          bufferBeforeMin: 0,
          bufferAfterMin: 0,
          service: { businessId, isActive: true },
        },
        {
          id: colorId,
          durationMin: 60,
          bufferBeforeMin: 0,
          bufferAfterMin: 0,
          service: { businessId, isActive: true },
        },
      ]);
      mockPrisma.staff.findMany.mockResolvedValue([
        { id: sophieId, isActive: true, createdAt: new Date('2020-01-01') },
      ]);
      mockPrisma.availabilityRule.findMany.mockResolvedValue([
        { staffId: sophieId, startTimeLocal: '09:00', endTimeLocal: '11:00' },
      ]);
      mockPrisma.timeOff.findMany.mockResolvedValue([]);
      mockPrisma.appointment.findMany.mockResolvedValue([]);

      const result = await service.getAvailableSlots(businessId, date, variantId, sophieId, [
        colorId,
      ]);

      const lastStart = DateTime.fromISO(`${date}T10:00`, { zone: timezone }).toUTC().toISO();
      expect(result.slots.map((s) => s.startAt)).not.toContain(lastStart);
      const firstStart = DateTime.fromISO(`${date}T09:00`, { zone: timezone }).toUTC().toISO();
      expect(result.slots.map((s) => s.startAt)).toContain(firstStart);
    });
  });
});
