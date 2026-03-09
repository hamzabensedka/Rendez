# Phased Implementation Plan

## Purpose

This plan turns the remediation checklist into separate implementation phases that can be executed in different future sessions without losing context.

Use this file together with:

- `docs/audit/04-engineering-review.md`
- `docs/audit/03-feature-discovery.md`
- `docs/audit/02-architecture-analysis.md`

Each phase is intentionally scoped so it can be completed, reviewed, and tested before moving to the next one.

## Ground Rules For Every Session

Before starting any phase:

1. Read `docs/audit/04-engineering-review.md`.
2. Read the specific phase section in this file.
3. Limit changes to that phase unless a dependency forces a small adjacent fix.
4. Run relevant validation before ending the session.
5. Update `docs/audit/04-engineering-review.md` checkboxes for completed items.

## Recommended Order

1. Phase 1: Auth and authorization hardening
2. Phase 2: Booking integrity and concurrency hardening
3. Phase 3: Config, secrets, and environment safety
4. Phase 4: Backend tests for critical flows
5. Phase 5: Remove duplicate mobile flows
6. Phase 6: Contract alignment and mobile correctness fixes
7. Phase 7: Live search and directory integration
8. Phase 8: Documentation and tooling cleanup
9. Phase 9: Performance and long-term platform evolution

---

## Phase 1: Auth And Authorization Hardening

### Goal

Eliminate the highest-risk privilege and access-control flaws.

### Primary Files

- `apps/api/src/auth/dto/register.dto.ts`
- `apps/api/src/auth/auth.service.ts`
- `apps/api/src/appointments/appointments.controller.ts`
- `apps/api/src/appointments/appointments.service.ts`
- `apps/api/src/businesses/businesses.service.ts`

### Tasks

- Remove public role assignment from registration.
- Force public registration to create only `client` users.
- Make appointment detail access ownership-aware.
- Make appointment cancellation business-scoped for providers.
- Decide whether public business detail should exclude non-active businesses.
- Reduce unsafe `any` usage in touched auth/appointment controller boundaries if easy to do within scope.

### Validation

- Register flow cannot create admin/provider users.
- Authenticated user cannot read another user's appointment.
- Provider cannot cancel another business's appointment.
- Public business detail behavior is intentional and documented.

### Exit Criteria

- All Phase 1 authorization changes are implemented.
- No obvious regressions in login/register/appointments routes.
- Checklist items for the touched files are updated.

### New Session Prompt

```text
Implement Phase 1 from docs/audit/05-phased-implementation-plan.md.
Start by reading:
- docs/audit/05-phased-implementation-plan.md
- docs/audit/04-engineering-review.md

Only work on Phase 1: Auth and authorization hardening.
Focus on:
- apps/api/src/auth/dto/register.dto.ts
- apps/api/src/auth/auth.service.ts
- apps/api/src/appointments/appointments.controller.ts
- apps/api/src/appointments/appointments.service.ts
- apps/api/src/businesses/businesses.service.ts

Do the code changes, run relevant validation, and then update docs/audit/04-engineering-review.md checkboxes for completed items.
```

---

## Phase 2: Booking Integrity And Concurrency Hardening

### Goal

Make booking creation safe, tenant-correct, and durable under concurrent requests.

### Primary Files

- `apps/api/src/appointments/appointments.service.ts`
- `apps/api/prisma/schema.prisma`
- related Prisma migration files if needed

### Tasks

- Validate `locationId` belongs to `businessId`.
- Validate `staffId` belongs to the business and is active.
- Validate `serviceVariantId` values belong to the business and are active/bookable.
- Refactor booking-create logic into smaller helpers if needed.
- Implement durable overlap protection strategy.
- Document any migration or DB-specific rollout notes.

### Validation

- Cross-tenant booking payloads are rejected.
- Invalid staff/location/variant combinations are rejected.
- Overlapping bookings cannot both succeed in the chosen strategy.

### Exit Criteria

- Booking create path enforces business invariants.
- Concurrency protection is real, not comment-only.
- Prisma schema and migration state are aligned.

### New Session Prompt

```text
Implement Phase 2 from docs/audit/05-phased-implementation-plan.md.
Read:
- docs/audit/05-phased-implementation-plan.md
- docs/audit/04-engineering-review.md

Only work on Phase 2: Booking integrity and concurrency hardening.
Focus on:
- apps/api/src/appointments/appointments.service.ts
- apps/api/prisma/schema.prisma
- any required Prisma migrations

Do the code changes, validate booking invariants, and update docs/audit/04-engineering-review.md for completed checklist items.
```

---

## Phase 3: Config, Secrets, And Environment Safety

### Goal

Reduce operational risk from unsafe env handling and secret practices.

### Primary Files

- `apps/api/src/app.module.ts`
- `apps/api/src/auth/auth.module.ts`
- `apps/api/src/auth/auth.service.ts`
- `.gitignore`
- `README.md`
- `SETUP.md`
- `QUICK_START.md`
- `SUPABASE_SETUP.md`

### Tasks

- Add backend env schema validation.
- Make JWT and DB config fail fast when invalid.
- Clean docs so only safe example values are shown.
- Ensure env example guidance matches reality.
- Tighten secret-handling documentation.

### Validation

- Backend fails early with missing/invalid required env vars.
- Docs no longer imply unsafe or nonexistent setup patterns.

### Exit Criteria

- Config validation exists and is enforced at startup.
- Setup docs are safe and accurate.

### New Session Prompt

```text
Implement Phase 3 from docs/audit/05-phased-implementation-plan.md.
Read:
- docs/audit/05-phased-implementation-plan.md
- docs/audit/04-engineering-review.md

Only work on Phase 3: Config, secrets, and environment safety.
Focus on:
- apps/api/src/app.module.ts
- apps/api/src/auth/auth.module.ts
- apps/api/src/auth/auth.service.ts
- .gitignore
- README.md
- SETUP.md
- QUICK_START.md
- SUPABASE_SETUP.md

Add env validation, improve secret/config handling, and update the remediation checklist when done.
```

---

## Phase 4: Backend Tests For Critical Flows

### Goal

Create a safety net around the highest-risk backend behavior before broader refactors continue.

### Primary Files

- `apps/api/src/auth/*`
- `apps/api/src/appointments/*`
- `apps/api/src/availability/*`
- `apps/api/test/*`

### Tasks

- Add tests for public registration role constraints.
- Add tests for appointment ownership access.
- Add tests for provider business-scoped cancellation.
- Add tests for booking payload integrity rules.
- Add tests for availability timezone/overlap behavior.

### Validation

- New tests run and pass.
- Critical auth/booking invariants are covered.

### Exit Criteria

- There is real automated coverage for the highest-risk backend paths.

### New Session Prompt

```text
Implement Phase 4 from docs/audit/05-phased-implementation-plan.md.
Read:
- docs/audit/05-phased-implementation-plan.md
- docs/audit/04-engineering-review.md

Only work on Phase 4: Backend tests for critical flows.
Focus on:
- auth role constraint tests
- appointment ownership/cancellation tests
- booking integrity tests
- availability timezone/overlap tests

Add tests, run them, and update docs/audit/04-engineering-review.md when complete.
```

---

## Phase 5: Remove Duplicate Mobile Flows

### Goal

Choose one canonical booking/profile path and eliminate the parallel prototype/live routing problem.

### Primary Files

- `apps/mobile/app/booking.tsx`
- `apps/mobile/app/profile.tsx`
- `apps/mobile/app/(tabs)/booking.tsx`
- `apps/mobile/app/(tabs)/profile.tsx`
- `apps/mobile/src/features/search/**`
- `apps/mobile/src/features/booking/**`
- `apps/mobile/src/features/profile/**`

### Tasks

- Decide which routes remain canonical.
- Redirect, delete, or quarantine duplicate legacy routes.
- Remove prototype-only booking/profile code that should not remain active.
- Keep only one source of truth for profile and booking behavior.

### Validation

- Only one booking path is reachable.
- Only one profile path is reachable.
- Route intent is obvious from the file structure.

### Exit Criteria

- Route duplication is gone.
- Dead or dormant flow confusion is materially reduced.

### New Session Prompt

```text
Implement Phase 5 from docs/audit/05-phased-implementation-plan.md.
Read:
- docs/audit/05-phased-implementation-plan.md
- docs/audit/04-engineering-review.md
- docs/audit/03-feature-discovery.md

Only work on Phase 5: Remove duplicate mobile flows.
Focus on the duplicate booking/profile route problem and make one canonical flow remain.
Update docs/audit/04-engineering-review.md after the cleanup.
```

---

## Phase 6: Contract Alignment And Mobile Correctness Fixes

### Goal

Fix the known client/server mismatches and mobile correctness issues in the live flow.

### Primary Files

- `apps/mobile/src/features/business/pages/BusinessDetailScreen.tsx`
- `apps/mobile/src/features/booking/pages/BookingScreen.tsx`
- `apps/mobile/src/features/bookings/pages/BookingsScreen.tsx`
- `apps/api/src/businesses/businesses.service.ts`
- `packages/shared/src/types/index.ts`
- `packages/shared/src/constants/index.ts`

### Tasks

- Align location/address payload expectations.
- Remove duplicate business fetches in booking.
- Fix booking status display mapping.
- Improve live-screen error handling.
- Extract small helpers if needed to reduce screen complexity.

### Validation

- Business address renders correctly from real API payloads.
- Booking screen loads cleanly with fewer redundant requests.
- Bookings status badges match shared enums.

### Exit Criteria

- Core live mobile flow is more correct and less brittle.

### New Session Prompt

```text
Implement Phase 6 from docs/audit/05-phased-implementation-plan.md.
Read:
- docs/audit/05-phased-implementation-plan.md
- docs/audit/04-engineering-review.md

Only work on Phase 6: Contract alignment and mobile correctness fixes.
Focus on:
- business detail payload alignment
- booking fetch cleanup
- bookings status mapping
- mobile error-handling improvements in the live flow
```

---

## Phase 7: Live Search And Directory Integration

### Goal

Turn discovery into a real product feature instead of a mostly mock prototype.

### Primary Files

- `apps/mobile/src/features/explore/pages/ExploreScreen.tsx`
- `apps/mobile/src/features/search/pages/SearchScreen.tsx`
- `apps/mobile/src/features/search/pages/AddressScreen.tsx`
- `apps/mobile/src/features/search/pages/SearchResultsScreen.tsx`
- `apps/mobile/src/features/search/services/addressService.ts`
- `apps/mobile/src/features/search/hooks/useAddressSearch.ts`
- `apps/api/src/businesses/businesses.controller.ts`
- `apps/api/src/businesses/businesses.service.ts`

### Tasks

- Replace `MOCK_SALONS` result rendering with live business search/listing.
- Decide whether address search uses a real provider or an internal simplified flow.
- Connect selected address/category/time/filter state to real results.
- Make `ExploreScreen` a real discovery surface instead of mostly a launcher.

### Validation

- Search results come from live backend data.
- Address selection affects discovery meaningfully.
- Explore/search feel like one coherent feature.

### Exit Criteria

- Discovery is no longer primarily mock-driven.

### New Session Prompt

```text
Implement Phase 7 from docs/audit/05-phased-implementation-plan.md.
Read:
- docs/audit/05-phased-implementation-plan.md
- docs/audit/03-feature-discovery.md
- docs/audit/04-engineering-review.md

Only work on Phase 7: Live search and directory integration.
Replace mock-driven discovery with real backend-backed results where possible.
```

---

## Phase 8: Documentation And Tooling Cleanup

### Goal

Make the repository easier to trust and easier to onboard into.

### Primary Files

- `README.md`
- `IMPLEMENTATION_SUMMARY.md`
- `docs/ARCHITECTURE.md`
- `docs/user-roadmap/*.md`
- `apps/mobile/src/features/search/README.md`
- `apps/api/package.json`
- `apps/mobile/package.json`

### Tasks

- Rewrite stale or aspirational docs to match shipped reality.
- Update roadmap steps that conflict with implemented behavior.
- Fix `apps/api` lint script so CI-safe lint does not mutate files.
- Audit whether `@react-navigation/*` dependencies are still required.

### Validation

- Docs reflect the actual system.
- Tooling scripts behave predictably.
- Dependency list better matches active architecture.

### Exit Criteria

- New contributors can trust the docs more than they have to distrust them.

### New Session Prompt

```text
Implement Phase 8 from docs/audit/05-phased-implementation-plan.md.
Read:
- docs/audit/05-phased-implementation-plan.md
- docs/audit/04-engineering-review.md
- docs/audit/01-repository-exploration.md

Only work on Phase 8: Documentation and tooling cleanup.
Bring docs and scripts in line with the real system.
```

---

## Phase 9: Performance And Long-Term Platform Evolution

### Goal

Handle the work that matters after the core system is safe, correct, and coherent.

### Primary Areas

- `apps/api/src/availability/**`
- `apps/api/src/businesses/**`
- `packages/shared/src/constants/index.ts`
- future queue/cache modules
- future provider/admin surfaces

### Tasks

- Introduce caching for expensive public reads and slot computation.
- Add async notifications/reminders infrastructure.
- Add provider/admin app surfaces when product scope is ready.
- Continue modularizing service-heavy backend areas.

### Validation

- Performance work is measured, not guessed.
- New infrastructure has clear ownership and documented purpose.

### Exit Criteria

- The codebase is evolving beyond MVP hardening into platform growth.

### New Session Prompt

```text
Implement Phase 9 from docs/audit/05-phased-implementation-plan.md.
Read:
- docs/audit/05-phased-implementation-plan.md
- docs/audit/02-architecture-analysis.md
- docs/audit/04-engineering-review.md

Only work on Phase 9: Performance and long-term platform evolution.
Do not start this until Phases 1-8 are materially complete.
```

---

## Minimal Session Handoff Template

Use this at the start of any new session:

```text
Read these first:
- docs/audit/05-phased-implementation-plan.md
- docs/audit/04-engineering-review.md

Work only on Phase X.
Before editing, summarize:
- exact files you will touch
- exact checklist items you will complete
- how you will validate the phase

When done:
- run relevant validation
- update docs/audit/04-engineering-review.md
- summarize completed items and any blockers for the next phase
```
