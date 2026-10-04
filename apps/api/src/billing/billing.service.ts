import { Injectable } from '@nestjs/common';
import { BillingPlanStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

/** Plan statuses that allow a business to transact (appear in search, take bookings). */
const OPERATING_STATUSES: ReadonlySet<BillingPlanStatus> = new Set([
  BillingPlanStatus.TRIAL,
  BillingPlanStatus.ACTIVE,
  BillingPlanStatus.GRACE,
]);

/**
 * Gateway-agnostic access control for salon billing.
 *
 * The source of truth is the Business's 1:1 Subscription row. Access rules:
 *  - TRIAL / ACTIVE / GRACE -> business operates normally.
 *  - SUSPENDED             -> hidden from public search/detail, new bookings blocked.
 *
 * While the product is free every business is TRIAL, so this never blocks anyone
 * today; flipping to paid later is a data/config change, not a rewrite.
 *
 * Note: `canOperate` is a simple read of planStatus; time-based transitions
 * (TRIAL -> GRACE -> SUSPENDED when a period lapses unpaid) are applied lazily by
 * `resolveStatus` so enforcement stays correct even before any billing cron exists.
 */
@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Effective plan status for a business, applying time-based transitions lazily.
   * No Subscription row => treat as TRIAL (pre-billing businesses always operate).
   */
  async resolveStatus(businessId: string): Promise<BillingPlanStatus> {
    const sub = await this.prisma.subscription.findUnique({
      where: { businessId },
      select: { planStatus: true, graceEndsAt: true },
    });
    if (!sub) return BillingPlanStatus.TRIAL;

    // GRACE lapses into SUSPENDED once the grace window closes. This is a derived
    // read; the persisted row is updated by the admin/billing writer when it acts.
    if (
      sub.planStatus === BillingPlanStatus.GRACE &&
      sub.graceEndsAt &&
      sub.graceEndsAt.getTime() < Date.now()
    ) {
      return BillingPlanStatus.SUSPENDED;
    }
    return sub.planStatus;
  }

  /** True when the business may appear publicly and accept new bookings. */
  async canOperate(businessId: string): Promise<boolean> {
    const status = await this.resolveStatus(businessId);
    return OPERATING_STATUSES.has(status);
  }

  /** True when the business is blocked from transacting (SUSPENDED). */
  async isSuspended(businessId: string): Promise<boolean> {
    return (await this.resolveStatus(businessId)) === BillingPlanStatus.SUSPENDED;
  }
}
