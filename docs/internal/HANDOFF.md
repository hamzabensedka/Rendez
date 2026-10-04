# Handoff — Session state & next steps (updated 2026-10-04)

Read this first if you're picking up the Rendez/Planity app. It traces what the last
session shipped, the current repo state, and the ordered next steps with entry points.

> Conventions the last session followed (keep them): anti-laziness gates ledger per
> phase (`gates/phase-N.md`, verified with `unlazy/scripts/gate-check.mjs`), every leaf
> ends `pnpm typecheck && pnpm lint && pnpm test` green, logical commits, graphify rebuilt
> after code changes (`PYTHONUTF8=1 python -X utf8 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"`).

---

## 1. Product direction (locked with the owner)

- **Market:** Morocco + Tunisia. Salons are the paying customers; clients book for free.
- **Payments:** Stripe is NOT viable in MA/TN. Model is **B2B subscription** ("salons pay
  to stay on the app"), reconciled **manually** (bank transfer / CMI / mobile money) via an
  admin dashboard — not a card gateway. Free for the first ~6 months to win clients.
- **Auth:** keep the existing **JWT** auth (it's solid). Fill gaps with **Resend** email.
  Owner floated Clerk; decision was **no Clerk migration** (Expo friction + existing auth
  is good). Resend is already wired for notifications.

## 2. What the last session shipped (all committed on `master`)

### Phase 6 — land the Atelier redesign WIP (commits `ce09a0a`, `34f1ac0`, docs)
~98 uncommitted files verified, 3 real bugs fixed (RN `absoluteFillObject` type, prettier,
react-native ESM in a node-Jest test), then committed. Atelier editorial design system
(`providerTheme`, `shared/ui/atelier/*`), provider Desk/Floor console, redesigned
auth/booking/search/explore/business screens, web shims, route restructure
(`(main)/business/[id]/index` + `/reviews`).

### Phase 7a — Salon billing foundation (commit `cbd0fe1`)
Gateway-agnostic subscription/access-control. **No money movement.**
- Schema: `Subscription` (1:1 Business), `SubscriptionInvoice`, enums `BillingPlanStatus`
  (`TRIAL/ACTIVE/GRACE/SUSPENDED`) + `InvoiceStatus`. Migration `20261004000000_add_billing_subscriptions`.
- `BillingService` (global module): `canOperate`/`isSuspended`/`resolveStatus` (lazy
  GRACE→SUSPENDED lapse). OPERATING = TRIAL/ACTIVE/GRACE.
- Enforcement (live): SUSPENDED hidden from public search/viewport/detail (404);
  `appointments.create()` rejects SUSPENDED with 403. Providers keep read access.
- Admin API (admin-only, `apps/api/src/admin`): `GET /admin/subscriptions`,
  `PATCH /admin/subscriptions/:businessId`, `POST /admin/subscriptions/:businessId/invoices`,
  `POST /admin/invoices/:invoiceId/mark-paid` (manual reconcile → reactivates salon).
- Seed: `seedTrialSubscriptions()` backfills every business to TRIAL (+6mo). `seed.ts:137,1030`.
- Shared: `BillingPlanStatus`/`InvoiceStatus` exported (`packages/shared/src/types/index.ts`).
  NOTE: API code uses **Prisma's** `BillingPlanStatus` (from `@prisma/client`); the shared
  package mirrors it for mobile. Don't mix the two imports in API code.

### Phase 7b — Auth email flows via Resend (commit `5e99bc5`)
- Schema: `EmailVerificationToken` + `PasswordResetToken` (SHA-256 hashed, expiring,
  single-use) + `User.emailVerifiedAt`. Migration `20261004010000_add_auth_tokens`.
- Endpoints (`apps/api/src/auth/auth.controller.ts`): `POST /auth/verify-email`,
  `/auth/resend-verification`, `/auth/forgot-password` (always 200), `/auth/reset-password`
  (updates hash + revokes all refresh sessions via `logoutAllForUser`).
- `register()` emails a verification link (fire-and-forget). Links use `APP_WEB_BASE_URL`
  (optional env, default `http://localhost:8081`; added to `.env.example`).
- Mobile: `shared/lib/auth.ts` `forgotPassword`/`resendVerification`; Login "Forgot
  password?" wired; VerificationScreen shows a post-register "verify your email" notice.

### Quality gates
- **API 87/87 tests, mobile 9/9**, typecheck + lint + test all exit 0.
- Ledgers: `gates/phase-6.md` (12 gates), `gates/phase-7.md` (17 gates) — all MET.
- Graphify rebuilt (830 nodes / 1208 edges).

## 3. Current repo state
- Branch `master`, clean except 3 known artifacts (DO NOT "fix" these — see §6):
  `.gitignore`, `apps/api/package.json` (CRLF-only), `pnpm-lock.yaml` (corrupted-store churn).
- Two NEW migrations are committed but **not yet applied to any database**:
  `20261004000000_add_billing_subscriptions`, `20261004010000_add_auth_tokens`.

## 4. Apply migrations (required before running the app/tests against a real DB)
```bash
pnpm --filter @planity/api prisma migrate deploy   # applies both new migrations
pnpm --filter @planity/api prisma:generate         # if client is stale
pnpm --filter @planity/api exec prisma db seed     # backfill TRIAL subscriptions
```

## 5. Next steps (ordered by priority)

1. **Admin billing UI** (owner said "yes"). The API is done; build the dashboard surface.
   - Where: `apps/admin/` is a **zero-dep static web app** (`index.html`, `app.js`,
     `styles.css`) styled from editorialTheme tokens, consuming the admin API. Add a
     "Billing / Subscriptions" view: table of salons + planStatus, actions to extend
     trial, transition plan, create invoice, **mark invoice paid**.
   - Endpoints already exist (see §2 Phase 7a). This is the manual reconciliation surface
     for when charging starts.
   - Note the ROADMAP caveat: the long-term plan is to port admin onto the shared Expo
     shell + `@planity/ui` once pnpm installs are healthy; for now extend the static app.

2. **Verification screen cleanup.** `apps/mobile/src/features/auth/pages/VerificationScreen.tsx`
   still renders 6-digit OTP boxes, but verification is now **link-based**. Replace with a
   proper "check your inbox" page (email display + Resend + "I've verified" continue).

3. **Flip-to-paid runbook (config, not code).** When the owner starts charging: write a
   short `docs/` runbook — create monthly invoices per active salon, set `currentPeriodEnd`,
   move unpaid → `GRACE` (grace window) → `SUSPENDED`, mark paid via admin. The enforcement
   already works; this is operational.

4. **CMI / Paymee self-serve card payment (later, optional).** Only if salons want to pay
   in-app. Scope a one-shot local gateway (CMI for MA, Paymee/Konnect/D17 for TN) as an
   *alternative* to manual transfer — NOT recurring billing. Out of scope until step 3.

5. **Deferred infra (blocked on pnpm store health).** BullMQ queue driver swap (currently
   in-process scheduler), Sentry SDK, admin→Expo port. Do these only after dependency
   installs are verified healthy (`pnpm store status`).

## 6. Gotchas for the next agent
- **pnpm store is corrupted on this machine** + Windows symlink bugs. Do NOT add/change
  dependencies or run a bare `pnpm install` expecting success; `pnpm-lock.yaml` churn is a
  symptom, leave it uncommitted. Lockfile-only syncs (`--lockfile-only`) are the safe path.
- **CRLF noise**: many files show ` M` from line-ending normalization only. Verify real
  changes with `git -c core.autocrlf=false diff --ignore-cr-at-eol -- <file>` before assuming.
- **Prisma schema comments**: use `///` doc comments, NOT `/** */` (breaks `prisma validate`).
- **Enum imports**: in API code use Prisma enums (`@prisma/client`) for DB-backed enums;
  `@planity/shared` mirrors them for the mobile app. They are not type-interchangeable.
- **Tests**: an isolated auth-spec failure can appear under full parallel Jest load (worker
  teardown flake) — re-run to confirm before treating as a regression.
- **Graphify rebuild** needs UTF-8 forced on Windows (see top of doc).
