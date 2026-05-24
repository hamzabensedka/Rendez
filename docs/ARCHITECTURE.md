# Planity Clone Architecture

Status legend:

- **IMPLEMENTED**: present in the current monorepo and backed by inspected code/config.
- **PLANNED**: required by product scope or architecture direction, but missing or only represented by database placeholders.
- **IMPLEMENTED + PLANNED**: partially shipped now, with explicit next additions.

Primary sources inspected: `docs/product.md`, `docs/debate-final-plan.md`, `nx.json`, `package.json`, `pnpm-workspace.yaml`, `docker-compose.yml`, `apps/api/src/app.module.ts`, `apps/api/prisma/schema.prisma`, `apps/mobile/package.json`, `apps/mobile/eas.json`, `.github/workflows/ci.yml`, API controllers/services, shared constants/types, and Prisma migrations.

## 1. C4-Style Overview

**Status: IMPLEMENTED + PLANNED**

### 1.1 System Context

```text
Clients / Guests
  use
Expo React Native Mobile App
  calls HTTPS JSON REST API
NestJS API
  reads/writes
PostgreSQL via Prisma

NestJS API also integrates with:
  Redis / Upstash              IMPLEMENTED for cache, PLANNED for BullMQ
  Supabase Postgres            IMPLEMENTED as managed DATABASE_URL target
  Supabase Storage             PLANNED for business images/documents
  Stripe                       PLANNED for card payments/refunds/webhooks
  Expo Push + Email Provider   PLANNED for notifications
  BullMQ Workers               PLANNED for async jobs
```

External actors:

- **Clients / guests** browse, search, book, favorite, review, and manage appointments.
- **Providers** manage businesses, services, staff, availability, and appointment operations.
- **Admins** operate marketplace safety, moderation, user/business status, and support workflows.

Current implementation is strongest for public discovery, auth, favorites, appointments, and basic availability. Payments, notifications, BullMQ workers, admin surfaces, and full provider back-office are planned.

### 1.2 Containers

| Container | Status | Technology | Responsibility |
| --- | --- | --- | --- |
| Mobile app | IMPLEMENTED | Expo, React Native, Expo Router, TanStack Query, React Native Reanimated, MapLibre | Client-facing discovery, auth, booking, favorites, profile, map search, appointment screens. Some screens still contain mock/fallback behavior. |
| API | IMPLEMENTED | NestJS, Prisma, Passport JWT, Swagger, Pino, Helmet, Throttler | `/v1` REST API for auth, users, businesses, services, availability, appointments, favorites, places, service categories, and public config. |
| PostgreSQL database | IMPLEMENTED | Prisma schema, PostgreSQL, optional PostGIS migration | Core marketplace data: users, providers, businesses, locations, services, availability rules, time off, appointments, payments, refunds, reviews, favorites, notifications. |
| Redis cache | IMPLEMENTED + PLANNED | `ioredis`, optional `REDIS_URL`, in-memory fallback | Implemented for cache/lock helpers and availability cache. Planned as BullMQ broker, queue state, and broader cache invalidation substrate. |
| Supabase | IMPLEMENTED + PLANNED | Supabase Postgres via `DATABASE_URL`; storage planned | Current docs/env target Supabase for managed Postgres. Supabase Auth is not implemented; API owns JWT auth. Supabase Storage is planned for media. |
| Stripe | PLANNED | Stripe PaymentIntents, webhooks | Card payment, refund, webhook reconciliation, SCA support, idempotent financial events. Prisma `Payment`/`Refund` exist but no Stripe dependency/module exists. |
| BullMQ | PLANNED | BullMQ + Redis | Async notifications, reminders, payment reconciliation, refunds, availability invalidation/warming, analytics. No BullMQ dependency, queues, processors, or worker app exists. |

## 2. Current Monorepo Structure

**Status: IMPLEMENTED + PLANNED**

Current workspace shape under `C:\planity`:

```text
C:\planity\
  apps\
    api\
      prisma\
        schema.prisma
        migrations\
        seed.ts
      src\
        app.module.ts
        main.ts
        auth\
        users\
        businesses\
        services\
        availability\
        appointments\
        favorites\
        places\
        service-categories\
        redis\
        prisma\
        config\
        common\
    mobile\
      app\
        (auth)\
        (main)\
        booking.tsx
        map-search.tsx
        search-results.tsx
      src\
        application\
        features\
        shared\
        types\
      eas.json
      package.json
  packages\
    shared\
      src\
        constants\
        types\
        utils\
    ui\
      src\
        components\
        tokens\
```

Current package boundaries:

- `apps/api`: NestJS API, Prisma schema/migrations/seed, REST controllers, services, auth guards, and API tests.
- `apps/mobile`: Expo Router app and vertical feature slices under `src/features`.
- `packages/shared`: shared enums, constants, date helpers, booking payload helpers, appointment status helpers, validation utilities.
- `packages/ui`: React Native design tokens and primitives (`Button`, `Card`, `Input`, `Badge`, `Text`).

Recommended additions only where missing:

| Addition | Status | Why |
| --- | --- | --- |
| `apps/api/src/payments` | PLANNED | Stripe PaymentIntent creation, webhook handling, refund orchestration, idempotency. |
| `apps/api/src/notifications` | PLANNED | Notification preferences, templates, dispatch records, push/email fanout. |
| `apps/api/src/jobs` or `apps/worker` | PLANNED | BullMQ processors. Start in API for simplicity; split to `apps/worker` when worker scaling differs from API scaling. |
| `apps/api/src/admin` | PLANNED | Minimal admin API before any dashboard UI. |
| `apps/api/src/reviews` | PLANNED | Review write/moderation ownership. Current approved review reads live inside `BusinessesService`. |
| `packages/api-client` | PLANNED | Generated or hand-authored TypeScript REST client and query key contracts, once OpenAPI output is stabilized. |
| `apps/provider` or provider routes inside `apps/mobile` | PLANNED | Provider operating loop is product-required but no provider UI exists. Use existing mobile app if provider ops stay mobile-first; add a dedicated app only if web back-office is required. |
| `apps/admin` | PLANNED | Admin dashboard is v2/not started; do not add until admin API and product scope are stable. |

## 3. NestJS Module Boundaries

**Status: IMPLEMENTED + PLANNED**

Current root module imports:

- `ConfigModule`, `LoggerModule`, `ThrottlerModule`, `RedisModule`, `PrismaModule`
- `AuthModule`, `UsersModule`
- `BusinessesModule`, `ServicesModule`, `ServiceCategoriesModule`
- `AvailabilityModule`, `AppointmentsModule`, `FavoritesModule`
- `PlacesModule`, app-level public `ConfigModule`

Target domain boundaries:

| Domain | Status | Owner module | Boundary |
| --- | --- | --- | --- |
| Auth | IMPLEMENTED | `auth` | Registration, login, refresh token rotation, logout, `me`, JWT strategy, `JwtAuthGuard`, `RolesGuard`. Registration always creates a client role. |
| Businesses | IMPLEMENTED + PLANNED | `businesses` | Public business listing/detail, viewport search, services/staff reads, approved reviews read. Provider/admin business creation exists; update/location/staff CRUD is planned. |
| Services | IMPLEMENTED + PLANNED | `services` | Provider/admin service and variant creation. Broader service catalog update/delete/deactivation and staff-service mapping are planned. |
| Appointments | IMPLEMENTED + PLANNED | `appointments` | Authenticated appointment creation/list/detail/cancel. Uses idempotency key and overlap checks. Payment coupling, final availability revalidation, provider calendar operations, and cancellation policy enforcement are planned. |
| Availability | IMPLEMENTED + PLANNED | `availability` | Public slot computation from rules, time off, appointments, service duration/buffers, Redis cache. Availability/time-off CRUD, multi-staff aggregation, explicit invalidation, and rule versioning are planned. |
| Favorites | IMPLEMENTED | `favorites` | Authenticated current-user favorites list/add/remove. |
| Reviews | IMPLEMENTED + PLANNED | currently inside `businesses`; planned `reviews` | Approved read-only business reviews are implemented. Review creation, moderation, provider replies, reporting, and admin workflows are planned. |
| Payments | PLANNED | planned `payments` | Prisma models exist, but no module/controller/service/webhook/Stripe dependency exists. |
| Notifications | PLANNED | planned `notifications` | Prisma model exists, but no push token, email provider, templates, dispatch service, or jobs exist. |
| Admin | PLANNED | planned `admin` | Role exists in schema/shared types. No admin module, app, endpoints, or audit model exists. |
| Places | IMPLEMENTED | `places` | Public Nominatim-backed address suggestion proxy with throttling. |
| Redis | IMPLEMENTED + PLANNED | `redis` | Cache and short lock helper. BullMQ usage is planned. |

Rules:

- Domain modules own their writes and invariants.
- Cross-domain reads may use Prisma directly today, but payment, notification, and job side effects should be emitted after transaction boundaries rather than called from controllers.
- Provider/admin actions must combine `JwtAuthGuard`, `RolesGuard`, and tenant ownership checks. Current role checks exist; complete tenant checks are still planned in provider/admin CRUD.

## 4. Prisma Data Model Summary

**Status: IMPLEMENTED + PLANNED**

Implemented enums:

- `UserRole`: `client`, `providerOwner`, `providerStaff`, `admin`
- `UserStatus`: `active`, `inactive`, `suspended`
- `BusinessStatus`: `draft`, `pending`, `active`, `suspended`
- `AppointmentStatus`: `BOOKED`, `CANCELLED`, `COMPLETED`, `NO_SHOW`
- `AppointmentSource`: `client`, `provider`, `admin`
- `ReviewStatus`: `pending`, `approved`, `rejected`
- `PaymentProvider`: `OFFLINE`, `STRIPE`
- `PaymentStatus`: `pending`, `completed`, `failed`, `refunded`

Key implemented models and relationships:

- `User`
  - Owns auth identity, role/status, soft delete timestamp.
  - Relations: optional `Provider`, many `Appointment`, `Review`, `Notification`, `Favorite`, `RefreshTokenSession`.
- `RefreshTokenSession`
  - Stores hashed refresh token sessions with expiry and optional revocation timestamp.
  - Used by refresh token rotation and logout.
- `Provider`
  - One-to-one with `User`; optional `businessId`; has `isOwner` and future `permissionsJson`.
  - Current provider model supports ownership, but fine-grained staff permissions remain planned.
- `Business`
  - Marketplace provider profile with status, slug, category, timezone, contact info, rating counters, cancellation/reschedule policy fields.
  - Relations: `Provider`, `Location`, `Staff`, `Service`, `AvailabilityRule`, `TimeOff`, `Appointment`, `Review`, `Promotion`, `Favorite`.
- `Location`
  - Address and `lat`/`lng`. Optional migration adds unmanaged `geom geometry(Point, 4326)` and GIST index for PostGIS.
  - Relations: belongs to `Business`, used by `Appointment`.
- `Staff`
  - Business staff member with active flag and `servicesOfferedJson` placeholder.
  - Relations: `AvailabilityRule`, `TimeOff`, `Appointment`.
  - Planned improvement: replace/augment JSON with typed staff-service join table.
- `Service` and `ServiceVariant`
  - Service belongs to a business; variants store price, duration, buffers, capacity.
  - Appointment items snapshot variant price/duration/buffers to preserve booking history.
- `AvailabilityRule`
  - Weekly rule by `businessId`, optional `staffId`, day of week, local start/end time, optional effective range.
- `TimeOff`
  - Business/staff blocking windows stored as UTC timestamptz.
- `Appointment`
  - Business/location/client/staff booking with UTC start/end, timezone snapshot, status, source, optional unique `idempotencyKey`.
  - Durable overlap protection is implemented by migration `appointments_no_overlap_per_staff` using `btree_gist` and a `tstzrange` exclusion constraint for non-cancelled appointments per business/staff.
- `AppointmentItem`
  - Service variant snapshot rows for appointment composition and historical price/duration integrity.
- `Payment` and `Refund`
  - Implemented schema placeholders for payment provider, status, amount, currency, provider refs, and refunds.
  - Payment processing logic is planned.
- `Review`
  - One review per appointment, tied to business and client, with moderation status.
  - Approved read endpoint exists; writes/moderation planned.
- `Favorite`
  - Unique `(userId, businessId)` saved business.
- `Promotion`
  - Basic promo fields exist in schema; no product/API surface inspected.
- `Notification`
  - User, type, channel, payload JSON, status, sent timestamp.
  - Delivery logic is planned.

Data model gaps to close before production:

- Add a typed staff-to-service eligibility model instead of relying on `servicesOfferedJson`.
- Add payment idempotency/webhook event tables or constraints for Stripe event ids.
- Add notification preference and push token models.
- Add audit log model for admin/provider sensitive operations.
- Add explicit payment state coverage if `requires_action`, `authorized`, or `partially_refunded` become shipped states.

## 5. API Contract Overview

**Status: IMPLEMENTED + PLANNED**

Global API behavior implemented:

- Base path: `/v1`.
- Swagger UI: `/api` in non-production.
- Validation: global `ValidationPipe` with `whitelist`, `forbidNonWhitelisted`, and `transform`.
- Security middleware: Helmet, CORS, throttling.
- Auth transport: `Authorization: Bearer <accessToken>`.

### 5.1 Implemented Endpoints

Auth:

- `POST /v1/auth/register` - public, throttled. Creates client user and returns tokens.
- `POST /v1/auth/login` - public, throttled. Returns user and access/refresh tokens.
- `POST /v1/auth/refresh` - public, throttled. Rotates refresh token session.
- `POST /v1/auth/logout` - public/idempotent. Revokes one refresh token when supplied.
- `POST /v1/auth/logout-all` - authenticated. Revokes all current user sessions.
- `GET /v1/auth/me` - authenticated. Returns current user profile.

Discovery and business:

- `GET /v1/businesses` - public, paginated. Filters: `city`, `query`, `categories`, `lat`, `lng`, `radiusKm`, `availDate`, `page`, `limit`.
- `GET /v1/businesses/viewport` - public. Map bounds: `north`, `south`, `east`, `west`, optional `zoom`, `query`, `category`, `categories`, `availDate`.
- `GET /v1/businesses/:id` - public. Business detail.
- `GET /v1/businesses/:id/services` - public. Service catalog.
- `GET /v1/businesses/:id/staff` - public. Staff list.
- `GET /v1/businesses/:id/reviews` - public, paginated. Approved reviews.
- `POST /v1/businesses` - provider owner/admin. Create business.
- `POST /v1/businesses/:businessId/services` - provider owner/admin. Create service.
- `POST /v1/businesses/:businessId/services/:serviceId/variants` - provider owner/admin. Create variant.

Availability:

- `GET /v1/businesses/:businessId/availability` - public. Query: `serviceVariantId`, `date`, optional `staffId`.

Appointments:

- `POST /v1/appointments` - authenticated. Create appointment.
- `GET /v1/appointments/me` - authenticated, paginated. Query: `upcoming`, `page`, `limit`.
- `GET /v1/appointments/:id` - authenticated. Appointment detail with user/admin authorization.
- `POST /v1/appointments/:id/cancel` - authenticated. Cancel appointment.

Favorites:

- `GET /v1/users/me/favorites` - authenticated.
- `POST /v1/users/me/favorites` - authenticated. Body includes `businessId`.
- `DELETE /v1/users/me/favorites/:businessId` - authenticated.

Supporting public endpoints:

- `GET /v1/service-categories`
- `GET /v1/places/suggest?q=&limit=`
- `GET /v1/config`

### 5.2 Planned Endpoints

Payments:

- `POST /v1/payments/intents` - authenticated client; creates Stripe PaymentIntent for booking attempt.
- `POST /v1/payments/offline` - authenticated client/provider policy; creates offline pending payment.
- `POST /v1/payments/webhooks/stripe` - public but signature-verified; idempotent webhook receiver.
- `POST /v1/payments/:id/refunds` - provider/admin or cancellation workflow.

Notifications:

- `POST /v1/users/me/push-tokens` - authenticated; register Expo push token.
- `GET/PATCH /v1/users/me/notification-preferences` - authenticated.
- Internal/job-only dispatch APIs should not be public.

Provider operations:

- Business update, location CRUD, staff CRUD, service/variant update/delete, availability rule CRUD, time-off CRUD, provider calendar, provider appointment cancel/complete/no-show.

Reviews:

- Create review for completed appointment, update/delete own pending review, moderation approve/reject, report review.

Admin:

- User status management, business status/verification, review moderation, audit log reads, operational health.

### 5.3 Auth Requirements

- Public endpoints: discovery, business detail, categories, places suggestions, availability, register/login/refresh.
- Client authenticated endpoints: profile, favorites, appointments, future payment creation, future review submission.
- Provider endpoints: service/business operations and future staff/availability/calendar operations require `providerOwner`, `providerStaff` where appropriate, or `admin`.
- Admin endpoints: `admin` only.

The product role vocabulary may say `provider`; current code splits that into `providerOwner` and `providerStaff`.

### 5.4 Error Format

Implemented global error envelope:

```json
{
  "statusCode": 409,
  "error": "CONFLICT",
  "message": "Time slot is no longer available",
  "requestId": "optional-correlation-id"
}
```

Current mappings include `VALIDATION_ERROR`, `BAD_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `TOO_MANY_REQUESTS`, `DATABASE_ERROR`, and `INTERNAL_ERROR`.

### 5.5 Pagination

Implemented constants:

- Default page: `1`
- Default limit: `20`
- Max limit: `100`

Current API response shapes are not fully normalized:

- Businesses and reviews return `{ data, total, page, limit }`.
- Shared type defines `{ data, meta: { page, limit, total, totalPages } }`.

Planned API contract cleanup: standardize all unbounded collections to:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

## 6. Availability And Slot Algorithm

**Status: IMPLEMENTED + PLANNED**

Implemented behavior:

- Endpoint: `GET /v1/businesses/:businessId/availability`.
- Inputs: `businessId`, `serviceVariantId`, `date`, optional `staffId`.
- Business timezone is read from `Business.timezone`, defaulting in schema to `Europe/Paris`.
- Weekly rules use `AvailabilityRule.dayOfWeek`, `startTimeLocal`, `endTimeLocal`, optional effective range, optional `staffId`.
- Time off uses UTC intervals from `TimeOff`.
- Existing appointments with `status != CANCELLED` block slots.
- Service duration includes `durationMin + bufferBeforeMin + bufferAfterMin`.
- Step size is `DEFAULT_SLOT_STEP_MIN = 15`.
- Results are cached for `CACHE_TTL_AVAILABILITY = 60` seconds.

Implemented cache key:

```text
planity:availability:slots:{businessId}:{date}:{serviceVariantId}:{staffIdOrEmpty}
```

Implemented overlap exclusion:

- Application layer subtracts overlapping time off and appointments.
- Appointment creation checks overlap inside a transaction.
- Database migration adds `appointments_no_overlap_per_staff`, an exclusion constraint on `(business_id, coalesced staff_id, tstzrange(start_at_utc, end_at_utc))` where status is not `CANCELLED`.
- Intervals should be treated as half-open `[start, end)` for algorithm and conflict reasoning.

Current algorithm:

1. Load active business and service variant.
2. Compute local business day start/end in UTC.
3. Load matching weekly availability rules for requested staff or business-level `null` staff.
4. Load overlapping time off for requested staff or business-level `null` staff.
5. Load non-cancelled overlapping appointments for requested staff or `null`.
6. Convert local rule windows to UTC.
7. Subtract time off intervals.
8. Subtract busy appointment intervals.
9. Generate candidate starts every 15 minutes where full required duration fits.
10. Return `{ date, timezone, slotStepMin, slots: [{ startAt, staffId }] }`.

Planned improvements:

- Aggregate across eligible active staff when `staffId` is omitted.
- Use typed staff-service eligibility rather than JSON placeholders.
- Add provider CRUD for availability rules and time off.
- Add explicit cache invalidation after appointment, rule, time-off, service variant, staff, or timezone changes.
- Add a rules version to the cache key, for example:

```text
availability:v2:business:{businessId}:serviceVariant:{serviceVariantId}:staff:{staffId|any}:date:{yyyy-mm-dd}:tz:{timezone}:rules:{version}
```

- Revalidate the selected slot through the availability service during booking confirmation, not only by overlap checks.
- Consider a short booking hold only if payment latency creates too many conflicts; avoid holds for MVP unless measured need appears.
- Keep Redis TTL short enough to limit stale slots: current 60 seconds is acceptable for MVP.

Invalidation matrix:

| Event | Required action |
| --- | --- |
| Appointment created/cancelled/completed/no-show | Delete affected business/date/staff/service availability keys. |
| Availability rule created/updated/deleted | Delete affected business/staff/date range keys and bump rules version. |
| Time off created/updated/deleted | Delete affected business/staff/date range keys and bump rules version. |
| Service variant duration/buffer/capacity changed | Delete affected service variant future availability. |
| Staff activated/deactivated or service eligibility changed | Delete affected business future availability. |
| Business timezone changed | Delete all future availability for the business. |

## 7. Authentication And Authorization

**Status: IMPLEMENTED + PLANNED**

Implemented auth:

- Password hashing with Argon2.
- JWT access tokens signed with `JWT_ACCESS_SECRET`.
- Refresh JWTs signed with `JWT_REFRESH_SECRET`.
- Default expiries: access `15m`, refresh `7d`.
- Refresh token sessions are stored in `RefreshTokenSession` as token hashes.
- Refresh rotation deletes the old session and stores the new refresh session.
- Logout revokes one refresh session; logout-all revokes all sessions for the user.
- `JwtStrategy` reads bearer tokens from `Authorization` header and rejects expired tokens.
- `JwtAuthGuard` protects authenticated routes.
- `RolesGuard` reads `@Roles(...)` metadata for provider/admin gates.

Implemented roles:

- `client`
- `providerOwner`
- `providerStaff`
- `admin`

Product role mapping:

- `client` maps directly.
- `provider` maps to `providerOwner` and `providerStaff`.
- `admin` maps directly.

Guard strategy:

- Public controllers remain unguarded.
- Authenticated user endpoints use `JwtAuthGuard`.
- Provider/admin endpoints use `JwtAuthGuard` + `RolesGuard`.
- Tenant ownership checks must live in services, because role membership alone is insufficient.

Planned auth hardening:

- Add password reset, email verification, optional MFA, and account deletion flows.
- Add provider staff permission granularity beyond role enum.
- Add admin audit logging for sensitive actions.
- Add rate-limit classes by endpoint sensitivity beyond current global/auth throttles.
- Keep Supabase as database/storage infrastructure unless a separate decision is made to replace API-owned JWT auth with Supabase Auth. Supabase Auth is not implemented today.

## 8. Payment Architecture

**Status: PLANNED**

Implemented today:

- Prisma `Payment` and `Refund` models.
- Shared payment enums for `OFFLINE`, `STRIPE`, `pending`, `completed`, `failed`, `refunded`.

Missing today:

- No Stripe dependency.
- No payments module/controller/service.
- No mobile checkout flow.
- No webhook endpoint.
- No webhook event idempotency store.
- No refund orchestration.

Recommended MVP approach:

- Use **Stripe PaymentIntents** for mobile checkout because Expo/mobile needs SCA-aware confirmation and mobile SDK integration.
- Stripe Checkout can be reserved for future web/provider flows if a hosted checkout is preferred there.
- Server owns PaymentIntent creation and final payment state.
- Mobile never sends card data to the API and never marks a booking paid based only on local UI success.

Planned payment flow:

1. Client selects slot and reviews booking.
2. API revalidates slot.
3. API creates a booking attempt or pending payment context with an idempotency key.
4. API creates Stripe PaymentIntent with metadata: user id, business id, service variant ids, proposed start, idempotency key.
5. Mobile confirms PaymentIntent through Stripe SDK.
6. Stripe webhook confirms `payment_intent.succeeded` or failure.
7. API transaction creates/updates `Payment` and confirms appointment only after slot revalidation.
8. Failed payments release the booking attempt and return the client to payment or slot selection.

Webhook requirements:

- Verify Stripe signature using `STRIPE_WEBHOOK_SECRET`.
- Persist processed Stripe event ids to make webhook handling idempotent.
- Treat webhooks as source of truth for final state.
- Do not create duplicate appointments for repeated webhook or client retry.
- Use idempotency keys for API payment creation and Stripe requests.

Offline payment:

- Allow `PaymentProvider.OFFLINE` only when provider policy enables pay-at-salon.
- Appointment may be `BOOKED` with payment `pending`.
- Provider/admin can mark offline payment as completed later.

Refunds:

- Refund on eligible cancellation through Stripe when online payment is completed.
- Store refund status and provider reference in `Refund`.
- Retry transient refund failures through BullMQ.

## 9. Notifications

**Status: PLANNED**

Implemented today:

- Prisma `Notification` model with `userId`, `type`, `channel`, `payloadJson`, `status`, `sentAt`.
- Shared notification channel enum: `EMAIL`, `PUSH`.

Missing today:

- No notification module/service/controller.
- No Expo push token model or registration endpoint.
- No email provider dependency/config.
- No templates.
- No queue workers.

Planned channels:

- Push: Expo push notifications for clients and providers.
- Email: transactional provider such as Resend, SendGrid, Postmark, or SES.
- SMS: out of MVP.

Planned event dispatch:

- Domain services emit normalized events after successful transactions, for example `appointment.confirmed`, `appointment.cancelled`, `payment.failed`, `refund.completed`, `security.login`.
- Event dispatcher enqueues BullMQ jobs rather than sending push/email inline.
- Notification worker resolves user preferences, renders templates, dispatches channel providers, and updates delivery status.

Minimum notification matrix:

| Event | Client push | Client email | Provider push | Provider email |
| --- | --- | --- | --- | --- |
| Account registered | No | Yes | No | No |
| Booking confirmed | Yes | Yes | Yes | Yes |
| Booking cancelled | Yes | Yes | Yes | Yes |
| Reminder 24h before | Yes | Yes | No | No |
| Reminder 2h before | Yes | No | No | No |
| Payment failed | Yes | Yes | No | No |
| Refund completed | No | Yes | No | Yes |
| Provider new booking | No | No | Yes | Yes |
| Security event | No | Yes | No | No |

Delivery rules:

- Transactional notifications bypass marketing unsubscribe but respect channel-specific feasibility.
- Reminder jobs must no-op if appointment is cancelled/completed/no-show before execution.
- Provider templates must use business-local date/time and timezone snapshot.
- Store only non-sensitive payment references in notification payloads.

## 10. Background Jobs

**Status: PLANNED**

Implemented today:

- Redis client/cache infrastructure exists with `REDIS_URL` or memory fallback.

Missing today:

- No BullMQ dependency.
- No queues, processors, schedulers, dashboard, dead-letter strategy, or worker deployment.

Planned BullMQ topology:

| Queue | Jobs | Retry policy |
| --- | --- | --- |
| `notifications` | `send_email`, `send_push`, `render_template` | 5 attempts, exponential backoff, dead-letter after exhaustion. |
| `reminders` | `appointment_reminder_24h`, `appointment_reminder_2h` | Delayed jobs; on execution re-read appointment state and no-op if stale. |
| `payments` | `stripe_webhook_reconcile`, `refund_retry`, `payment_timeout` | 8 attempts for transient provider errors, idempotent by payment/webhook id. |
| `availability` | `invalidate_slots`, `warm_slots_for_business_day` | 3 attempts, dedupe by business/date/staff/service. |
| `analytics` | `track_event`, `aggregate_daily_metrics` | Best-effort retry, dead-letter for inspection. |

Dead-letter policy:

- Use `<queue>:dlq` or a common failed-job inspection pattern with original queue, job name, payload hash, attempts, error, and last failed timestamp.
- Alert when dead-letter count exceeds threshold.
- Jobs must be idempotent; retries must not duplicate payment, appointment, or notification effects.

Deployment:

- MVP can run processors in the API process only for development.
- Production should use a separate worker process/container so API autoscaling is independent from job concurrency.

## 11. CI/CD

**Status: IMPLEMENTED + PLANNED**

Implemented GitHub Actions:

- `.github/workflows/ci.yml`
- Triggers on push and pull request to `main` and `develop`.
- Jobs: `lint`, `typecheck`, `test`.
- Uses `pnpm/action-setup@v2`, Node 18, pnpm cache, `pnpm install --frozen-lockfile`.

Implemented EAS config:

- `apps/mobile/eas.json`
- Profiles:
  - `development`: development client, internal distribution.
  - `preview`: internal distribution.
  - `production`: auto-increment.
- Production submit profile exists.

Planned CI/CD additions:

- Add `pnpm build` to CI once all projects have reliable build targets.
- Add Prisma validation/migration check: `pnpm --filter @planity/api prisma:generate` and migration drift checks.
- Add API container build once deployment target is selected.
- Add EAS build workflow or manual release runbook using:

```text
cd apps/mobile
eas build --profile development
eas build --profile preview
eas build --profile production
eas submit --profile production
```

- Use GitHub Secrets or deployment platform secrets for `DATABASE_URL`, `JWT_*`, `REDIS_URL`, Stripe, email, Expo/EAS, and provider API keys.
- Add branch protection requiring lint/typecheck/test before merge.

## 12. Local Development

**Status: IMPLEMENTED + PLANNED**

Implemented local services:

- `docker-compose.yml` is optional.
- Services:
  - `postgres`: `postgres:16`, port `5432`, database `planity_dev`, user `planity`.
  - `redis`: `redis:7`, port `6379`.
- Volumes: `postgres_data`, `redis_data`.
- Health checks exist for both services.

Important current caveat:

- The compose Postgres image is plain `postgres:16`, not a PostGIS image. The optional PostGIS migration requires PostGIS installed. For local PostGIS parity, use a PostGIS-enabled image or install the extension in the database image.
- Compose does not run the NestJS API or BullMQ worker. Developers run the API via pnpm/Nx.
- Project docs also support cloud Supabase Postgres and Upstash Redis instead of local Docker.

Implemented API env vars:

| Variable | Status | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | IMPLEMENTED required | PostgreSQL/Supabase connection string. |
| `JWT_ACCESS_SECRET` | IMPLEMENTED required | Access token signing secret; minimum 16 chars. |
| `JWT_REFRESH_SECRET` | IMPLEMENTED required | Refresh token signing secret; minimum 16 chars. |
| `JWT_ACCESS_EXPIRY` | IMPLEMENTED optional | Defaults to `15m`. |
| `JWT_REFRESH_EXPIRY` | IMPLEMENTED optional | Defaults to `7d`. |
| `PORT` | IMPLEMENTED optional | Defaults to `3000`. |
| `NODE_ENV` | IMPLEMENTED optional | Controls logging/Swagger behavior. |
| `ALLOWED_ORIGINS` | IMPLEMENTED optional | CORS origins; defaults to `http://localhost:19006`. |
| `APP_URL` | IMPLEMENTED optional | Returned by public config endpoint. |
| `REDIS_URL` | IMPLEMENTED optional | Redis cache/locks; falls back to memory if absent/unreachable. |
| `NOMINATIM_EMAIL` | IMPLEMENTED optional | Address suggestion provider policy contact. |
| `PLACES_COUNTRY_CODES` | IMPLEMENTED optional | Nominatim country filter; default documented as France. |

Implemented mobile env vars:

| Variable | Status | Purpose |
| --- | --- | --- |
| `EXPO_PUBLIC_API_URL` | IMPLEMENTED optional | Mobile API base URL; defaults in code to `http://localhost:3000/v1`. |
| `EXPO_PUBLIC_BYPASS_AUTH` | IMPLEMENTED dev-only behavior | Development auth bypass is documented elsewhere and must not be used in production. |

Planned env vars:

| Variable | Status | Purpose |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | PLANNED | Stripe server API key. |
| `STRIPE_WEBHOOK_SECRET` | PLANNED | Webhook signature verification. |
| `EXPO_ACCESS_TOKEN` | PLANNED | EAS/Expo CI automation. |
| `EMAIL_PROVIDER_API_KEY` | PLANNED | Transactional email provider. |
| `EMAIL_FROM` | PLANNED | Sender identity. |
| `SUPABASE_URL` | PLANNED | Supabase Storage/API integration if media storage is added. |
| `SUPABASE_SERVICE_ROLE_KEY` | PLANNED | Server-side Supabase Storage operations. |

Recommended local startup:

```text
docker-compose up -d
pnpm install
pnpm prisma:generate
pnpm --filter @planity/api prisma:migrate
pnpm --filter @planity/api prisma:seed
pnpm dev
```

## 13. Architectural Decisions

**Status: IMPLEMENTED + PLANNED**

- Keep the existing Nx monorepo and pnpm workspace. Do not rewrite into a different architecture.
- Keep NestJS REST as the API contract surface. Use Swagger/OpenAPI generation from controllers as the first contract artifact before introducing any heavier contract tooling.
- Keep Prisma/PostgreSQL as the source of truth. Supabase is infrastructure for managed Postgres today, not the app auth provider.
- Keep availability as a bounded context with deterministic server-side computation, short Redis TTL, and database overlap constraints.
- Use PaymentIntents for mobile card payments; keep web checkout decisions separate.
- Use BullMQ only when background work is introduced; do not add it before notifications/payments/reminders need it.
- Add provider/admin modules incrementally behind existing auth and role guards.