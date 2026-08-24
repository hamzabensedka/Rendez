# Plan: Audit Remediation — Phase 1 (P0 security + purge + green QA + booking correctness)

Task: implement the audit's P0/P1 fixes. Tree depth 3, solo-sequential mode
(single session, one gates file, leaves worked in order).

## Leaf order and file ownership (no two leaves edit the same file)

| Leaf | Owns | Deliverable |
|---|---|---|
| L1 PURGE | deletions across repo | Dead trees gone: `backend/`, `apps/admin`, API dead modules (`payment`,`payments`,`bullmq`,`notification`,`notifications`,`provider-portal`,`staff`,`business-hours`,`jobs`), `src/user` module, stale `apps/api/src/prisma/schema.prisma`, mobile dead trees (`unwired-app-stubs/`, `src/app/**`, `src/navigation/provider.routes.ts`, `src/types/tanstack-react-query.d.ts`, zombie clients `src/lib/`, `src/services/apiClient.ts`, `src/api/`), junk (`github/`, tracked `.autocrew/`, `output/reports`, `apps/api/Untitled`, orphan patches) |
| L2 API SECURITY | `apps/api/src/app.module.ts`, `users/**`, `reviews/**`, `common/filters/*`, `apps/api/package.json`, `.gitignore`, git index (.env untrack) | users module admin-only w/o passwordHash; `/auth/me` clean projection; reviews mutations JWT'd + public list scoped/paginated; ThrottlerModule + APP_GUARD active; helmet → dependencies; generic 500 bodies; `.env` untracked+ignored |
| L4 BOOKING | `appointments/**`, `availability` read-path bug fix if touched by spec | Transactional create validating business-active + location/staff/variant belonging; single-item policy explicit; priceCentsSnapshot written; 23P01→409 mapping; atomic cancel (BOOKED→CANCELLED only) enforcing free-cancellation window |
| L5 MOBILE | `apps/mobile/src/shared/lib/api.ts`, `features/bookings/**`, `features/favorites/**` | Single-flight token refresh; `/login`→`/(auth)/login`; mock-data fallbacks removed (honest empty/error states) |
| L3 QA GREEN | `apps/api/package.json` (typecheck script), mobile ESLint config, `.github/workflows/ci.yml`, any remaining broken specs | `pnpm typecheck` / `pnpm lint` / `pnpm test` all exit 0; CI on Node 20 incl. api typecheck |

Contracts:
- Error convention: Prisma P2002→409, P2025→404, exclusion-violation (23P01)→409, everything non-HTTP → generic 500 body.
- Roles: lowercase enum values from `@planity/shared` (`client|providerOwner|providerStaff|admin`).
- Reviews visibility: public reads see `approved` only for a given businessId; authors manage own reviews.

## Status log
- [x] PLAN.md + GATES.md written before work started
- [x] L1 PURGE complete (G1-G4)
- [x] L2 API SECURITY complete (G5-G8, G10, G11; G9 ABANDONED — deferred to Dockerization)
- [x] L4 BOOKING CORRECTNESS complete (G12-G15) — 37/37 api tests green
- [x] L5 MOBILE complete (G16-G18) — 3/3 mobile specs green
- [x] L3 QA GREEN complete (G19-G22) — typecheck/lint/test exit 0 workspace-wide; CI on Node 20
- [x] gate-check.mjs: 22 gates, ALL MET (21 met, 1 abandoned)
- NOTE: environment repair required: corrupted global pnpm store + pnpm 8.15 Windows symlink bugs + FS filter driver; handcrafted node_modules/.modules.yaml after forensic nx graph diagnosis; dev servers (expo/api watch/nx daemon) stopped during repair — restart needed.
