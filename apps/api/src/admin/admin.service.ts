import { Injectable, NotFoundException } from '@nestjs/common';
import { BillingPlanStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateInvoiceDto,
  MarkInvoicePaidDto,
  UpdateSubscriptionDto,
} from './dto/subscription.dto';

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export interface AdminAppointmentQuery {
  businessId?: string;
  status?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async listAppointments(query: AdminAppointmentQuery) {
    const take = Math.min(
      Math.max(Math.trunc(query.limit ?? DEFAULT_PAGE_SIZE) || DEFAULT_PAGE_SIZE, 1),
      MAX_PAGE_SIZE
    );
    const skip = Math.max(((query.page ?? 1) - 1) * take, 0);

    const where = {
      ...(query.businessId ? { businessId: query.businessId } : {}),
      ...(query.status ? { status: query.status as never } : {}),
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
        orderBy: { startAtUtc: 'desc' },
        take,
        skip,
        include: {
          clientUser: { select: { id: true, name: true, email: true } },
          business: { select: { id: true, name: true } },
          staff: { select: { id: true, name: true } },
          appointmentItems: {
            include: { serviceVariant: { select: { id: true, name: true } } },
          },
        },
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return { data, meta: { page: skip / take + 1, limit: take, total } };
  }

  /** Businesses for admin tables (includes non-active rows, unlike public listings). */
  async listBusinesses(page = 1, limit = DEFAULT_PAGE_SIZE) {
    const take = Math.min(
      Math.max(Math.trunc(limit ?? DEFAULT_PAGE_SIZE) || DEFAULT_PAGE_SIZE, 1),
      MAX_PAGE_SIZE
    );
    const skip = Math.max(((page ?? 1) - 1) * take, 0);

    const [data, total] = await this.prisma.$transaction([
      this.prisma.business.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          category: true,
          ratingAvg: true,
          ratingCount: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      this.prisma.business.count(),
    ]);

    return { data, meta: { page: skip / take + 1, limit: take, total } };
  }

  // ── Salon billing (B2B subscriptions) ──────────────────────────────────

  /** List businesses with their subscription, for the admin billing table. */
  async listSubscriptions(page = 1, limit = DEFAULT_PAGE_SIZE, planStatus?: BillingPlanStatus) {
    const take = Math.min(
      Math.max(Math.trunc(limit ?? DEFAULT_PAGE_SIZE) || DEFAULT_PAGE_SIZE, 1),
      MAX_PAGE_SIZE
    );
    const skip = Math.max(((page ?? 1) - 1) * take, 0);

    const where = {
      deletedAt: null,
      ...(planStatus ? { subscription: { planStatus } } : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.business.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          createdAt: true,
          subscription: {
            select: {
              id: true,
              planStatus: true,
              trialEndsAt: true,
              currentPeriodEnd: true,
              graceEndsAt: true,
              suspendedAt: true,
              notes: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      this.prisma.business.count({ where }),
    ]);

    return { data, meta: { page: skip / take + 1, limit: take, total } };
  }

  /**
   * Set/transition a business's plan. Creates the Subscription row on first use
   * (upsert) so pre-billing businesses can be managed without a backfill.
   */
  async updateSubscription(businessId: string, dto: UpdateSubscriptionDto) {
    const business = await this.prisma.business.findFirst({
      where: { id: businessId, deletedAt: null },
      select: { id: true },
    });
    if (!business) throw new NotFoundException('Business not found');

    const data = {
      planStatus: dto.planStatus,
      ...(dto.currentPeriodEnd ? { currentPeriodEnd: new Date(dto.currentPeriodEnd) } : {}),
      ...(dto.graceEndsAt ? { graceEndsAt: new Date(dto.graceEndsAt) } : {}),
      ...(dto.trialEndsAt ? { trialEndsAt: new Date(dto.trialEndsAt) } : {}),
      ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
      suspendedAt: dto.planStatus === BillingPlanStatus.SUSPENDED ? new Date() : null,
    };

    return this.prisma.subscription.upsert({
      where: { businessId },
      create: { businessId, ...data },
      update: data,
    });
  }

  /** Create a pending invoice for a billing period (used once charging starts). */
  async createInvoice(businessId: string, dto: CreateInvoiceDto) {
    const sub = await this.prisma.subscription.findUnique({ where: { businessId } });
    if (!sub) throw new NotFoundException('No subscription for this business');
    return this.prisma.subscriptionInvoice.create({
      data: {
        subscriptionId: sub.id,
        periodStart: new Date(dto.periodStart),
        periodEnd: new Date(dto.periodEnd),
        amountCents: dto.amountCents,
        ...(dto.currency ? { currency: dto.currency } : {}),
      },
    });
  }

  /**
   * Manual reconciliation: mark an invoice paid (bank transfer / CMI / mobile
   * money) and reactivate the subscription + advance its paid period.
   */
  async markInvoicePaid(invoiceId: string, dto: MarkInvoicePaidDto) {
    const invoice = await this.prisma.subscriptionInvoice.findUnique({
      where: { id: invoiceId },
      include: { subscription: true },
    });
    if (!invoice) throw new NotFoundException('Invoice not found');

    return this.prisma.$transaction(async (tx) => {
      const paid = await tx.subscriptionInvoice.update({
        where: { id: invoiceId },
        data: {
          status: 'paid',
          paidAt: new Date(),
          ...(dto.method ? { method: dto.method } : {}),
          ...(dto.reference ? { reference: dto.reference } : {}),
        },
      });
      const sub = await tx.subscription.update({
        where: { id: invoice.subscriptionId },
        data: {
          planStatus: BillingPlanStatus.ACTIVE,
          currentPeriodEnd: invoice.periodEnd,
          graceEndsAt: null,
          suspendedAt: null,
        },
      });
      return { invoice: paid, subscription: sub };
    });
  }
}
