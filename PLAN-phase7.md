# Plan: Phase 7 — Salon billing foundation + auth email flows

Decisions (locked with user):
- Payments: build gateway-agnostic subscription/access-control layer. All salons start on TRIAL (6 months). NO money movement, NO gateway (Stripe won't serve MA/TN; CMI/Paymee/manual-transfer integration deferred until user flips to paid).
- SUSPENDED effect: hidden from public search/detail + new bookings blocked; provider keeps read access; GRACE still operates.
- Auth: keep existing JWT. Add password reset + email verification via the existing Resend/log email pipeline (NotificationsService.sendOnce). NO Clerk.
- NOT building: any payment gateway, recurring billing engine, push notifications, Clerk.

## Contracts (bind both leaves)
- Access state on Business via 1:1 Subscription; enforcement via BillingService.canOperate.
- Email via NotificationsService.sendOnce (dedup + Resend/log transport). No new required env secrets.
- Tokens hashed at rest, single-use, expiring. forgot-password always 200 (no enumeration). reset revokes all refresh sessions (logoutAllForUser).
- Repo conventions: JWT via JwtAuthGuard, roles from @planity/shared, ownership re-verified server-side, GlobalExceptionFilter envelope, class-validator DTOs, whitelist+forbidNonWhitelisted. Every leaf ends `pnpm typecheck && pnpm lint && pnpm test` green.

## Leaf order & ownership
| Leaf | Owns | Deliverable |
|---|---|---|
| L1 BILLING | `apps/api/prisma/schema.prisma` (+migration), `apps/api/src/billing/**`, `apps/api/src/admin/**` (subscription endpoints), `apps/api/src/businesses/**` + `apps/api/src/appointments/**` (enforcement hooks), `apps/api/prisma/seed.ts` (TRIAL backfill) | Subscription + SubscriptionInvoice models, BillingPlanStatus enum, BillingService.canOperate, SUSPENDED hidden from search/detail + booking blocked, admin subscription management API, seed backfill. Tests. |
| L2 AUTH-EMAIL | `apps/api/prisma/schema.prisma` (+migration), `apps/api/src/auth/**` (verify/forgot/reset endpoints + token models), `apps/mobile/src/features/auth/**` (forgot-password + verify notice wiring), `.env.example`/`env.validation.ts` | EmailVerificationToken + PasswordResetToken models, verify-email/resend-verification/forgot-password/reset-password endpoints via Resend, mobile Forgot-password wiring + verify notice, env truth pass. Tests. |

Schema coordination: L1 and L2 both touch schema.prisma. Sequenced L1 -> L2 (L2 rebases on L1's schema). Distinct models; no conflict.

## Status log
- [x] PLAN.md + gates/phase-7.md written before work started
- [x] L1 BILLING complete — committed. Subscription+SubscriptionInvoice+enums, BillingService (global), SUSPENDED hidden from search/viewport/detail + booking blocked (403), admin subscription/invoice endpoints, TRIAL seed backfill. Shared enums exported. API 80/80 tests green (was 69, +11), typecheck+lint green. Enum-note: API uses Prisma's BillingPlanStatus; shared package mirrors it for mobile.
