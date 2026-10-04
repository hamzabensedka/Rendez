import { Test, TestingModule } from '@nestjs/testing';
import { BillingPlanStatus } from '@prisma/client';
import { BillingService } from './billing.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BillingService', () => {
  let service: BillingService;
  let prisma: { subscription: { findUnique: jest.Mock } };

  const businessId = 'biz-1';

  beforeEach(async () => {
    prisma = { subscription: { findUnique: jest.fn() } };
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillingService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get<BillingService>(BillingService);
    jest.clearAllMocks();
  });

  describe('resolveStatus', () => {
    it('treats a missing subscription as TRIAL (pre-billing businesses operate)', async () => {
      prisma.subscription.findUnique.mockResolvedValue(null);
      await expect(service.resolveStatus(businessId)).resolves.toBe(BillingPlanStatus.TRIAL);
    });

    it('returns the persisted status for TRIAL/ACTIVE/SUSPENDED', async () => {
      for (const status of [
        BillingPlanStatus.TRIAL,
        BillingPlanStatus.ACTIVE,
        BillingPlanStatus.SUSPENDED,
      ]) {
        prisma.subscription.findUnique.mockResolvedValue({ planStatus: status, graceEndsAt: null });
        await expect(service.resolveStatus(businessId)).resolves.toBe(status);
      }
    });

    it('returns GRACE while the grace window is still open', async () => {
      prisma.subscription.findUnique.mockResolvedValue({
        planStatus: BillingPlanStatus.GRACE,
        graceEndsAt: new Date(Date.now() + 24 * 3600 * 1000),
      });
      await expect(service.resolveStatus(businessId)).resolves.toBe(BillingPlanStatus.GRACE);
    });

    it('lapses GRACE into SUSPENDED once the grace window has closed', async () => {
      prisma.subscription.findUnique.mockResolvedValue({
        planStatus: BillingPlanStatus.GRACE,
        graceEndsAt: new Date(Date.now() - 1000),
      });
      await expect(service.resolveStatus(businessId)).resolves.toBe(BillingPlanStatus.SUSPENDED);
    });
  });

  describe('canOperate / isSuspended', () => {
    it('allows TRIAL, ACTIVE and GRACE to operate', async () => {
      for (const status of [
        BillingPlanStatus.TRIAL,
        BillingPlanStatus.ACTIVE,
        BillingPlanStatus.GRACE,
      ]) {
        prisma.subscription.findUnique.mockResolvedValue({
          planStatus: status,
          graceEndsAt: new Date(Date.now() + 3600 * 1000),
        });
        await expect(service.canOperate(businessId)).resolves.toBe(true);
        await expect(service.isSuspended(businessId)).resolves.toBe(false);
      }
    });

    it('blocks SUSPENDED from operating', async () => {
      prisma.subscription.findUnique.mockResolvedValue({
        planStatus: BillingPlanStatus.SUSPENDED,
        graceEndsAt: null,
      });
      await expect(service.canOperate(businessId)).resolves.toBe(false);
      await expect(service.isSuspended(businessId)).resolves.toBe(true);
    });
  });
});
