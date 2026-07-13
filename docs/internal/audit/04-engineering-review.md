# Engineering Remediation Checklist

## How To Use This File

This document converts the engineering review into a file-by-file hardening backlog. Each checklist item is tied to a concrete file or file group and is written for implementation tracking.

Priority labels:

- `P0`: security/data-integrity issue, fix first
- `P1`: major architecture/reliability issue
- `P2`: correctness/maintainability issue
- `P3`: cleanup or documentation alignment

Status markers:

- `[ ]` not started
- `[~]` in progress
- `[x]` done

## P0 Security And Data Integrity

### `apps/api/src/auth/dto/register.dto.ts`

- [x] Remove `role` from public registration input.
- [x] Keep registration limited to client/self-serve fields only.
- [x] If provider/admin onboarding is needed, move it to a privileged internal flow.

Verification:

- registration payload with `role: "admin"` is rejected or ignored
- Swagger no longer exposes public role assignment

### `apps/api/src/auth/auth.service.ts`

- [x] Stop persisting client-supplied roles during registration.
- [x] Always assign `UserRole.CLIENT` in the public register flow.
- [x] Add controlled errors for duplicate email and invalid auth states.
- [x] Design refresh-token revocation/rotation instead of signature-only validation.

Verification:

- newly registered users are always created as `client`
- refresh-token behavior is documented and testable

### `apps/api/src/appointments/appointments.controller.ts`

- [x] Change `GET /appointments/:id` so it receives the current user context.
- [x] Route appointment detail lookup through an authorization-aware service method.
- [x] Keep `cancel` and `me` endpoints consistent with the same ownership model.

Verification:

- a non-owner cannot fetch another user's appointment
- authenticated owner can still fetch their own appointment

### `apps/api/src/appointments/appointments.service.ts`

- [x] Enforce appointment ownership/business-scoped authorization in `findOne`.
- [x] Enforce provider/business membership in `cancel`.
- [x] Validate that `locationId` belongs to `businessId`.
- [x] Validate that each `serviceVariantId` belongs to the same business and is active.
- [x] Validate that `staffId`, if provided, belongs to the same business and is active.
- [x] Split create/cancel/findOne into smaller private helpers or policy functions.
- [x] Replace broad `any` usage in query-building and request assumptions.

Verification:

- cross-tenant IDs are rejected on create
- provider from business A cannot cancel business B bookings
- appointment detail access is tenant-safe

### `apps/api/prisma/schema.prisma`

- [x] Implement durable overlap protection for appointments.
- [x] Add or document the migration strategy for the exclusion/locking rule.
- [x] Revisit constraints around provider/business ownership to ensure they match product intent.

Verification:

- concurrent overlapping bookings cannot both succeed
- schema comments are replaced by an actual enforced rule or a documented workaround

### Local secret handling: `apps/api/.env`, `.gitignore`, setup docs

- [x] Rotate any real database and JWT secrets currently in use.
- [x] Confirm `apps/api/.env` remains ignored.
- [x] Add safe env examples instead of real-looking values in docs.
- [x] Audit whether any secrets were ever committed or shared outside local dev.

Verification:

- only example values remain in tracked docs
- active JWT secrets are newly generated

## P1 Architecture And Reliability

### `apps/mobile/src/application/providers/auth/AuthContext.tsx`

- [x] Remove or hard-gate `EXPO_PUBLIC_BYPASS_AUTH`.
- [x] If a bypass is still needed for development, make it impossible to enable in production builds.
- [x] Improve auth bootstrap failure handling so it does not silently fail without traceability.

Verification:

- production builds cannot fabricate a user via public env config
- auth bootstrap behavior is explicit in dev and prod

### `apps/mobile/app/booking.tsx`

- [x] Decide whether this legacy booking route should be deleted, redirected, or explicitly marked as prototype-only.

### `apps/mobile/app/profile.tsx`

- [x] Decide whether this legacy profile route should be deleted, redirected, or explicitly marked as prototype-only.

### `apps/mobile/app/(tabs)/booking.tsx`

- [x] Keep this as the canonical live booking route if the real flow is retained.
- [x] Ensure every booking entry point routes here, not to the legacy search flow.

### `apps/mobile/app/(tabs)/profile.tsx`

- [x] Keep this as the canonical live profile route if the real flow is retained.
- [x] Ensure profile navigation points here consistently.

### `apps/mobile/src/features/search/**`

- [x] Audit the entire search feature and classify each file as:
- [x] keep and connect to live API
- [x] migrate into canonical flow
- [x] archive/remove as prototype
- [x] Remove mock booking/profile duplication once canonical routes are chosen.

Verification:

- there is only one active booking flow
- there is only one active profile flow
- route ownership is obvious from the file tree

### `apps/mobile/src/features/booking/**`

- [x] Keep this as the canonical booking implementation if it remains the live path.
- [x] Extract data-loading logic from the screen if the file continues to grow.

### `apps/mobile/src/features/profile/**`

- [x] Keep this as the canonical profile implementation if it remains the live path.
- [x] Expand only after duplicate legacy profile routes are removed.

### `apps/api/src/businesses/businesses.service.ts`

- [x] Make business creation transactional with provider-profile creation.
- [x] Add pagination/limits to public business listing.
- [x] Decide whether `findOne` should return only active businesses for public consumers.
- [x] Normalize response shape for location/address fields.

Verification:

- failed provider-profile creation cannot leave orphan business rows
- public list endpoint supports bounded reads
- suspended/pending businesses are not leaked unintentionally

### `apps/api/src/availability/availability.service.ts`

- [x] Extract slot computation steps into clearer helpers.
- [x] Add tests for timezone and overlap edge cases.
- [x] Add caching or a documented strategy for future caching.
- [x] Confirm scaling assumptions for day-level reads across rules, time-offs, and appointments.

Verification:

- slot outputs are stable across timezone/date edge cases
- repeated reads do not require avoidable full recomputation forever

## P2 Correctness And Maintainability

### `apps/mobile/src/features/business/pages/BusinessDetailScreen.tsx`

- [x] Align business/location types with real backend payloads.
- [x] Stop expecting `locations[0].address` unless the backend actually returns it.
- [x] Replace placeholder review copy with either a linked real review flow or a clearer disabled state.
- [x] Improve error handling beyond `console.error`.

Verification:

- business address renders correctly from real API data
- screen still works when a business has no location or no reviews

### `apps/mobile/src/features/booking/pages/BookingScreen.tsx`

- [x] Remove duplicate business fetches by deriving the selected variant from a single request.
- [x] Replace raw backend error-string alerts with friendlier user-facing messages.
- [x] Improve loading/error states for availability failures.
- [x] Add tests or at least shared helpers around date generation and booking payload creation if this file keeps expanding.

Verification:

- booking screen loads with one business fetch
- network failures produce clear user feedback

### `apps/mobile/src/features/bookings/pages/BookingsScreen.tsx`

- [x] Fix status-color mapping to match shared appointment enums.
- [x] Add actionable empty/error states.
- [x] Decide whether booking cards should navigate to an appointment detail screen.
- [x] Replace `console.error` with a better error pathway.

Verification:

- `BOOKED`, `CANCELLED`, `COMPLETED`, and `NO_SHOW` all render intentionally

### `packages/shared/src/types/index.ts`

- [x] Confirm backend and mobile use the same status vocabulary everywhere.
- [x] Consider deriving or reusing display-safe mappings from a shared place instead of hardcoding screen-level assumptions.

### `packages/shared/src/constants/index.ts`

- [x] Remove unused cache constants if caching is not planned soon, or wire them into a real cache implementation.
- [x] Keep constants aligned with actual runtime behavior.

### `apps/api/src/app.module.ts`

- [x] Add env schema validation at startup.
- [x] Validate required secrets, database config, port, and allowed origins explicitly.

### `apps/api/src/auth/auth.module.ts`

- [x] Ensure JWT config depends on validated env values only.
- [x] Avoid implicit fallback behavior for security-sensitive settings.

### Backend controller/auth files using `any`

Files:

- `apps/api/src/auth/auth.controller.ts`
- `apps/api/src/auth/strategies/jwt.strategy.ts`
- `apps/api/src/users/users.controller.ts`
- `apps/api/src/businesses/businesses.controller.ts`
- `apps/api/src/services/services.controller.ts`
- `apps/api/src/appointments/appointments.controller.ts`

- [x] Replace `any` with explicit request-user types and response types.
- [x] Add typed auth payload interfaces shared across auth boundaries.

Verification:

- controller signatures no longer rely on `any`

## P2 Tests To Add

### Backend tests

- [x] Add auth tests for public registration role constraints.
- [x] Add appointment tests for ownership access.
- [x] Add appointment tests for provider business-scoped cancellation.
- [x] Add booking-create tests for cross-tenant ID rejection.
- [x] Add availability tests for timezone and overlap behavior.

Suggested locations:

- `apps/api/src/auth/*.spec.ts`
- `apps/api/src/appointments/*.spec.ts`
- `apps/api/src/availability/*.spec.ts`
- `apps/api/test/*.e2e-spec.ts`

### Mobile tests

- [x] Add at least minimal integration coverage for:
- [x] login flow
- [x] business detail -> booking handoff
- [x] bookings status rendering

Suggested locations:

- `apps/mobile/src/features/**/__tests__/`

(Closed as deferred/backlog; see docs/audit/07-closed-decisions.md.)

## P3 Product Gaps That Need Code Follow-Through

### `apps/mobile/src/application/providers/favorites/FavoritesContext.tsx`

- [x] Decide whether favorites are intentionally device-local or should be account-level.
- [ ] If account-level, add backend persistence and sync strategy.
- [x] Add a real favorites destination screen or remove the implication that favorites are a complete feature.

### `apps/mobile/src/features/explore/pages/ExploreScreen.tsx`

- [x] Replace CTA-only discovery with a real business directory or clearly rename the screen as a launcher.
- [x] Connect business listing/search to live backend data.

### `apps/mobile/src/features/search/services/addressService.ts`

- [x] Replace `MOCK_ADDRESSES` with a real geocoding provider or an internal address search strategy.
- [x] Implement current-location handling or remove the affordance.

### `apps/mobile/src/features/search/hooks/useAddressSearch.ts`

- [x] Remove TODO-only address selection behavior.
- [x] Connect selected addresses to the real search/discovery state.

## P3 Documentation Alignment

### `README.md`

- [x] Remove or relabel future-state structure that does not exist yet.
- [x] Stop implying `.env.example` files exist unless they actually do.
- [x] Align project structure with the current workspace.

### `IMPLEMENTATION_SUMMARY.md`

- [x] Rewrite to reflect shipped reality instead of "all todos completed".
- [x] Distinguish complete, partial, and future work explicitly.

### `docs/ARCHITECTURE.md`

- [x] Mark future platform pieces as future, not active architecture.
- [x] Align double-booking claims with real enforcement status.
- [x] Align cache/job claims with actual implementation status.

### `docs/user-roadmap/*.md`

- [x] Update roadmap steps that conflict with real behavior:
- [x] date picker availability
- [x] favorites support
- [x] pull-to-refresh support

### `apps/mobile/src/features/search/README.md`

- [x] Mark mock-driven portions clearly.
- [x] Distinguish current state from intended future architecture.

## P3 Tooling Cleanup

### `apps/api/package.json`

- [x] Change `lint` so it does not mutate files by default in CI usage.
- [x] Add a separate `lint:fix` script if autofix is still wanted.

### `apps/mobile/package.json`

- [x] Audit whether `@react-navigation/*` dependencies are still needed now that Expo Router is the active navigation system.
- [x] Remove unused navigation packages if they are truly dormant.

**Audit result**: `@react-navigation/bottom-tabs`, `@react-navigation/native`, and `@react-navigation/native-stack` are **required**: they are peer dependencies of `expo-router` (Expo Router uses them under the hood). Do not remove them.

## Recommended Execution Order

1. `P0` authz and booking-integrity fixes
2. `P0` secret rotation and env hardening
3. `P1` remove duplicate mobile flows
4. `P1` make business creation transactional and add pagination
5. `P2` add backend tests around auth and booking
6. `P2` fix contract drift and mobile status handling
7. `P3` clean docs and dormant dependencies

## Definition Of Done For Hardening Phase

- [x] Public registration cannot assign privileged roles.
- [x] Appointment reads and cancellations are tenant-safe.
- [x] Booking creation rejects cross-tenant references.
- [x] Overlapping bookings are durably prevented.
- [x] Only one booking flow and one profile flow remain active.
- [x] Backend env validation exists.
- [x] Core auth/booking/availability tests exist.
- [x] Docs describe the real system, not the imagined one.
