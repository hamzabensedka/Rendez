# Gates: Phase 7 — Salon billing foundation + auth email flows

Scope: gateway-agnostic subscription/access-control layer (all salons TRIAL, no money movement) + password reset & email verification via Resend. SUSPENDED = hidden from search/detail + new bookings blocked, provider read-access retained. No gateway, no Clerk.

## L1 — BILLING

- [x] B1: Migration adds BillingPlanStatus enum, Subscription (1:1 Business) and SubscriptionInvoice models; prisma client regenerates clean
  CHECK: rg -n "enum BillingPlanStatus|model Subscription|model SubscriptionInvoice" apps/api/prisma/schema.prisma
  EXPECT: /enum BillingPlanStatus/ AND /model Subscription/ AND /model SubscriptionInvoice/
  EVIDENCE: schema has enum BillingPlanStatus, model Subscription (businessId @unique 1:1 Business), model SubscriptionInvoice (+ InvoiceStatus). Migration 20261004000000_add_billing_subscriptions written; prisma generate succeeded (v5.22.0, exit 0).
- [x] B2: Seed backfills every active Business with Subscription(TRIAL, trialEndsAt ~ +6 months)
  CHECK: rg -n "planStatus|TRIAL|subscription" apps/api/prisma/seed.ts
  EXPECT: /TRIAL/
  EVIDENCE: seed.ts seedTrialSubscriptions() upserts planStatus 'TRIAL' + trialEndsAt (~6mo) for every non-deleted business; called at end of main() (line 1028). Idempotent (update: {}).
- [x] B3: SUSPENDED businesses excluded from public search/map/detail
  CHECK: rg -n "SUSPENDED|canOperate|planStatus|subscription" apps/api/src/businesses
  EXPECT: /SUSPENDED|canOperate/
  EVIDENCE: businesses.service.ts — notSuspendedFilter (subscription null OR planStatus != SUSPENDED) applied to findAll + findInViewport (AND-preserving); findOne calls billing.isSuspended -> 404. Lines 50-55, 312.
- [x] B4: Booking create() rejects SUSPENDED business (403/409), allows TRIAL/ACTIVE/GRACE
  CHECK: rg -n "canOperate|SUSPENDED|BillingService" apps/api/src/appointments/appointments.service.ts
  EXPECT: /canOperate|SUSPENDED|Billing/
  EVIDENCE: appointments.service.ts injects BillingService; create() throws ForbiddenException 'This business is not accepting bookings' when billing.isSuspended(businessId). Lines 14, 33, 53. BillingService OPERATING_STATUSES = TRIAL/ACTIVE/GRACE.
- [x] B5: Admin subscription endpoints exist and are admin-only (list + patch planStatus)
  CHECK: rg -n "subscriptions|Roles\(UserRole.ADMIN\)" apps/api/src/admin
  EXPECT: /subscriptions/
  EVIDENCE: admin.controller.ts (class-level @Roles(UserRole.ADMIN) + JwtAuthGuard/RolesGuard) — GET /admin/subscriptions, PATCH /admin/subscriptions/:businessId, POST /admin/subscriptions/:businessId/invoices, POST /admin/invoices/:invoiceId/mark-paid. Lines 47, 61, 67, 73.
- [x] B6: Billing unit tests cover canOperate transitions + suspension enforcement
  CHECK: rg -ln "describe\(" apps/api/src/billing apps/api/src/admin
  EXPECT: /billing|admin/
  EVIDENCE: billing.service.spec.ts (resolveStatus: missing->TRIAL, persisted statuses, GRACE open, GRACE lapse->SUSPENDED; canOperate/isSuspended allow TRIAL/ACTIVE/GRACE + block SUSPENDED) + admin.service.spec.ts salon-billing describe (updateSubscription suspend/reactivate/not-found, markInvoicePaid reactivate + not-found). Full API run: 9 suites, 80/80 tests pass, exit 0.

## L2 — AUTH-EMAIL

- [x] E1: Migration adds EmailVerificationToken + PasswordResetToken (hashed, expiring, single-use)
  CHECK: rg -n "model EmailVerificationToken|model PasswordResetToken" apps/api/prisma/schema.prisma
  EXPECT: /EmailVerificationToken/ AND /PasswordResetToken/
  EVIDENCE: schema lines 532 + 548 — both models with tokenHash @unique, expiresAt, usedAt (single-use), cascade on user; User gains emailVerifiedAt. Migration 20261004010000_add_auth_tokens written; prisma generate exit 0.
- [x] E2: verify-email + resend-verification endpoints; register issues verification email
  CHECK: rg -n "verify-email|resend-verification|verifyEmail" apps/api/src/auth
  EXPECT: /verify-email|verifyEmail/
  EVIDENCE: auth.controller.ts POST /auth/verify-email (88) + /auth/resend-verification (97); auth.service register() calls sendVerificationEmail (fire-and-forget); verifyEmail/resendVerification methods present.
- [x] E3: forgot-password always returns 200 (no enumeration); reset-password updates hash + revokes all sessions
  CHECK: rg -n "forgot-password|reset-password|logoutAllForUser" apps/api/src/auth
  EXPECT: /forgot-password/ AND /reset-password/
  EVIDENCE: controller POST /auth/forgot-password (107, returns {sent:true} regardless) + /auth/reset-password (117). service forgotPassword no-ops when user missing; resetPassword updates passwordHash then logoutAllForUser(record.userId) at line 319.
- [x] E4: Emails sent via NotificationsService.sendOnce (dedup), links use APP_WEB_BASE_URL; no new REQUIRED env secrets
  CHECK: rg -n "sendOnce|APP_WEB_BASE_URL" apps/api/src/auth
  EXPECT: /sendOnce/
  EVIDENCE: both flows use notifications.sendOnce with dedupKey (verify-email:/password-reset:); links built via webBaseUrl() reading APP_WEB_BASE_URL (default http://localhost:8081). env.validation.ts REQUIRED unchanged (DATABASE_URL/JWT_ACCESS_SECRET/JWT_REFRESH_SECRET); APP_WEB_BASE_URL added to .env.example as optional.
- [x] E5: Mobile wires Forgot password -> forgot-password + post-register verify notice
  CHECK: rg -n "forgot-password|forgotPassword|verify" apps/mobile/src/features/auth
  EXPECT: /forgot|verify/
  EVIDENCE: shared/lib/auth.ts forgotPassword (95) + resendVerification (100); LoginScreen "Forgot password?" link -> forgotPassword (45); VerificationScreen post-register Alert "Verify your email" (51) + working Resend via resendVerification.
- [x] E6: Auth-email unit tests (token issue/verify/reset, enumeration-safe, session revoke)
  CHECK: rg -ln "forgot|reset|verify" apps/api/src/auth
  EXPECT: /auth/
  EVIDENCE: auth.service.spec.ts — register issues verification email; verifyEmail valid/expired-unknown; resendVerification only-when-unverified (enumeration-safe); forgotPassword emails only when account exists; resetPassword updates hash + deleteMany (session revoke); resetPassword rejects invalid token without revoking.

## INTEGRATION (run last)

- [x] I1: pnpm typecheck exits 0
  CHECK: pnpm typecheck
  EXPECT: exit 0
  EVIDENCE: "Successfully ran target typecheck for 2 projects", exit 0 (after fixing Prisma-vs-shared BillingPlanStatus mismatch + admin spec self-reference)
- [x] I2: pnpm lint exits 0
  CHECK: pnpm lint
  EXPECT: exit 0
  EVIDENCE: "Successfully ran target lint for 2 projects", exit 0 (after eslint --fix on 3 prettier errors + removing unused ForbiddenException import)
- [x] I3: pnpm test exits 0 (all prior suites + new billing/auth-email tests)
  CHECK: pnpm test
  EXPECT: exit 0
  EVIDENCE: "Successfully ran target test for 2 projects", exit 0 — api 9 suites/87 tests (69 baseline + 11 billing + 7 auth-email), mobile 3 suites/9 tests. All PASS.
- [ ] I4: Work committed; no stray uncommitted production files (CRLF/lockfile artifacts excluded)
  CHECK: git status --short
  EXPECT: only .gitignore / apps/api/package.json / pnpm-lock.yaml artifacts remain
  EVIDENCE: pending
- [ ] I5: graphify rebuilt
  CHECK: python -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"
  EXPECT: exit 0 (PYTHONUTF8=1)
  EVIDENCE: pending
