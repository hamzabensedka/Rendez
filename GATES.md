# Gates: Audit Remediation Phase 1

Scope: P0 security holes closed, dead code purged, booking flow made correct, QA gates green workspace-wide.

## L1 — PURGE

- [x] G1: Dead backend trees removed from disk AND git index
  CHECK: git ls-files backend apps/admin apps/api/src/payment apps/api/src/payments apps/api/src/bullmq apps/api/src/notification apps/api/src/notifications apps/api/src/provider-portal apps/api/src/staff apps/api/src/business-hours apps/api/src/jobs apps/api/src/user github output
  EXPECT: /^$/
  EVIDENCE: command output empty (all paths gone from git), 2026-08-24

- [x] G2: Mobile dead trees and zombie clients removed
  CHECK: git ls-files "apps/mobile/unwired-app-stubs" "apps/mobile/src/app" "apps/mobile/src/navigation" "apps/mobile/src/types/tanstack-react-query.d.ts" "apps/mobile/src/lib" "apps/mobile/src/services" "apps/mobile/src/api"
  EXPECT: /^$/
  EVIDENCE: output empty. NOTE: unwired-app-stubs/ and src/features/profile/api/ were UNTRACKED leftovers whose dirs are handle-locked by an external process (rd/takeown denied); excluded via tsconfig, invisible to git+build; manual deletion after closing editors listed in report.

- [x] G3: No live code imports deleted modules
  CHECK: git grep -l -E "provider-portal|unwired-app-stubs|tanstack-react-query|@plan/plan-shared|@stripe/stripe-react-native" -- apps/api/src apps/mobile/app apps/mobile/src
  EXPECT: /^$/
  EVIDENCE: exit code 1, zero matches

- [x] G4: Junk artifacts gone (Untitled, stale duplicate schema, orphan patches)
  CHECK: git ls-files apps/api/Untitled apps/api/src/prisma/schema.prisma patches/react-native-screens@4.16.0.patch patches/react-native-worklets@0.5.1.patch
  EXPECT: /^$/
  EVIDENCE: output empty

## L2 — API SECURITY

- [x] G5: users module requires admin auth on every route
  CHECK: git grep -c "UseGuards(JwtAuthGuard, RolesGuard)" -- apps/api/src/users/users.controller.ts
  EXPECT: /^[1-9]/
  EVIDENCE: output 'apps/api/src/users/users.controller.ts:1' (guard on controller class; every route admin-only)

- [x] G6: No passwordHash can leave users/user services (projection everywhere)
  CHECK: git grep -n "passwordHash" -- apps/api/src/users apps/api/src/auth/auth.service.ts
  EXPECT: /select|-passwordHash|data:/
  EVIDENCE: remaining passwordHash refs are write-path only (argon2.hash on create/update); all reads use USER_PUBLIC_SELECT projection incl. /v1/auth/me

- [x] G7: Reviews mutations require JWT; public list scoped to businessId + approved only + paginated
  CHECK: git grep -c "UseGuards(JwtAuthGuard)" -- apps/api/src/reviews/reviews.controller.ts
  EXPECT: /^[2-9]/
  EVIDENCE: 4 guarded routes (POST/GET mine/PUT/DELETE); public GET /reviews/business/:id filters status=approved + paginated

- [x] G8: Rate limiting actually active (ThrottlerModule.forRoot + global APP_GUARD)
  CHECK: git grep -c "ThrottlerModule.forRoot\|APP_GUARD" -- apps/api/src/app.module.ts
  EXPECT: /^[2-9]/ 
  EVIDENCE: count=3 (ThrottlerModule.forRoot + APP_GUARD provider); global floor 100/min, auth @Throttle overrides now effective

- [ ] G9: helmet is a production dependency of the api
  CHECK: node -e "const p=require('./apps/api/package.json'); process.exit(p.dependencies.helmet?0:1)"
  EXPECT: exit 0
  EVIDENCE: pending

ABANDON: G9 Reverted helmet (and ioredis) devDependencies→dependencies move: the dependency-graph change triggered pnpm-8.15-hoisted relinks of @prisma/argon2 packages, which deterministically crash on this machine (corrupted global store + FS filter driver + pnpm Windows symlink bugs). Practical risk today is zero — no Dockerfile/prod packaging exists yet; runtime resolution works via hoisted tree. MUST be re-applied together with Phase-2 Dockerization on a healthy install.

- [x] G10: Unexpected errors return a generic body; internal messages logged server-side only
  EVIDENCE: http-exception.filter.ts Error-branch no longer sets message from exception; clients get 'An unexpected error occurred', stack logged server-side. PrismaClientUnknownRequestError branch maps 23P01/no_overlapping to 409 'This time slot is no longer available'

- [x] G11: apps/api/.env untracked and ignored
  CHECK: git ls-files apps/api/.env; git grep -n "^\.env" -- .gitignore apps/api/.gitignore
  EXPECT: ls-files empty AND ignore rule present
  EVIDENCE: CORRECTION TO AUDIT: .env was NEVER tracked (git log --all -- apps/api/.env = 0 commits; earlier audit misread check-ignore output as ls-files). .gitignore rule present. No history scrub needed

## L4 — BOOKING CORRECTNESS

- [x] G12: create() runs validations (business active, location/staff/variant belong to business) inside $transaction and writes priceCentsSnapshot
  CHECK: git grep -c "\$transaction" -- apps/api/src/appointments/appointments.service.ts
  EXPECT: /^[1-9]/
  EVIDENCE: interactive \ validates business(active)/location/staff/variant-belongs and writes appointmentItem.createMany with priceCentsSnapshot + durationMinSnapshot; timezoneSnapshot = business.timezone

- [x] G13: Double-booking loser gets HTTP 409 (exclusion violation mapped), not 400
  EVIDENCE: spec test 'maps a double-booking exclusion violation to ConflictException' passes; filter also maps raw 23P01 to 409

- [x] G14: cancel() is atomic BOOKED→CANCELLED with free-cancellation-window enforcement
  EVIDENCE: cancel uses updateMany({where:{id,status:'BOOKED'}}) count-guard + freeCancellationBeforeHours window (spec tests: completed-reject, window-reject, atomic-provider-cancel all pass)

- [x] G15: appointments spec suite passes against real implementation (incl. new conflict/cancel tests)
  CHECK: cd apps/api; npx jest appointments --silent 2>&1 | Select-String -Pattern "Tests:"
  EXPECT: /failed: 0|, 0 failed/
  EVIDENCE: nx test @planity/api: 5 suites PASS, 37 tests PASS (incl. 3 new booking tests)

## L5 — MOBILE FIXES

- [x] G16: Token refresh is single-flight (concurrent 401s share one refresh call)
  CHECK: git grep -c "refreshPromise\|refreshInFlight" -- apps/mobile/src/shared/lib/api.ts
  EXPECT: /^[1-9]/
  EVIDENCE: refreshPromise single-flight implemented; new spec 'shares a single refresh call across concurrent 401s' passes (3/3 mobile api specs)

- [x] G17: Broken '/login' redirect fixed to '/(auth)/login'
  CHECK: git grep -n "replace('/login')" -- apps/mobile/src
  EXPECT: /^$/
  EVIDENCE: grep exit 1 (no matches); redirect now '/(auth)/login'

- [x] G18: Mock-data fallbacks gone from live screens (honest empty/error states)
  CHECK: git grep -n -E "MOCK_APPOINTMENTS|MOCK_FAVORITES|The Sculptural Cut|Glow Treatment" -- apps/mobile/src/features
  EXPECT: /^$/
  EVIDENCE: grep exit 1; Bookings/Favorites render real data with honest empty states + placeholder icons (no fabricated bookings/favorites/URLs)

## L3 — QA GREEN (run last; integrates all leaves)

- [x] G19: pnpm typecheck exits 0 across workspace (api included)
  CHECK: pnpm typecheck
  EXPECT: exit 0
  EVIDENCE: 'Successfully ran target typecheck for 2 projects', exit 0

- [x] G20: pnpm lint exits 0 across workspace (mobile has ESLint config)
  CHECK: pnpm lint
  EXPECT: exit 0
  EVIDENCE: 'Successfully ran target lint for 2 projects', exit 0 (after removing 2 unused vars)

- [x] G21: pnpm test passes all suites workspace-wide
  CHECK: pnpm test
  EXPECT: exit 0
  EVIDENCE: 'Successfully ran target test for 2 projects', exit 0 (api 37 + mobile 3)

- [x] G22: CI workflow runs Node 20 and typechecks the api too
  CHECK: git grep -n "node-version" -- .github/workflows/ci.yml
  EXPECT: /20/
  EVIDENCE: all three jobs node-version '20'; typecheck job now covers @planity/api via its new typecheck script

## ABANDONED (visible handover — out of session scope, needs human/infra decisions)

ABANDON: SECRET-ROTATION Rotate JWT/DB credentials and scrub git history — requires owning human + credential access; .env now untracked so future leaks stopped.
ABANDON: DB-INDEXES Add missing indexes (providers.businessId, appointment_items.serviceVariantId, reviews.clientUserId) via prisma migration — needs shadow-database/prod coordination, belongs to Phase 2.
ABANDON: FEATURE-COMPLETION Payments consolidation go-live, BullMQ wiring, provider portal rebuild — Phase 2 roadmap items, weeks of work.
ABANDON: DOCS-REGEN Regenerate README/docs to match post-purge reality — after feature completion lands.
