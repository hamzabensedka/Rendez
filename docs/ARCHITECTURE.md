# Architecture Overview

## Frontend Architecture (Mobile)

We follow a **Feature-Based (Vertical Slice) Architecture** for the frontend to ensure scalability and maintainability.

### Directory Structure

```text
src/
├── application/        # App initialization (providers, global store). Routes live in apps/mobile/app (Expo Router)
├── features/           # Core business logic (Vertical Slices: auth, explore, booking, etc.)
│   ├── [feature]/
│   │   ├── api.ts      # Feature-specific API calls
│   │   ├── components/ # Components unique to this feature
│   │   └── pages/      # Screens/Pages for this feature
├── entities/           # Domain models and shared logic (user, business)
├── shared/             # Reusable, app-agnostic code (ui, hooks, lib, types)
├── assets/             # Static assets (images, fonts)
└── styles/             # Global styles and themes
```

### Key Principles

1. **Feature Encapsulation**: Code that belongs to a specific business feature stays within that feature's folder.
2. **Atomic UI**: Reusable, pure UI components live in `shared/ui/` or the `@planity/ui` package.
3. **Domain Entities**: Common models like `Business` or `User` that are used by multiple features live in `entities/`.
4. **Avoid Type-Based Folders**: Do not use global `components/` or `services/` folders for feature-specific code.

## Tech Stack

**Active today:**

- **Monorepo**: Nx workspace
- **Mobile**: Expo React Native + TypeScript (Expo Router)
- **Backend**: NestJS + Prisma + Postgres

**Planned (not yet in repo):**

- Cache/Jobs: Redis + BullMQ
- Storage: S3-compatible
- Admin: Next.js admin dashboard

## Project Structure

**Present in repo:**

```
apps/
  api/          # NestJS backend
  mobile/       # Expo React Native app

packages/
  shared/       # Shared types, utils, constants
  ui/           # Design tokens, components
  config/       # ESLint, TypeScript configs
```

Planned: `admin-web/`, deployment/infra.

## Data Model

See `apps/api/prisma/schema.prisma` for the complete database schema.

Key entities:
- Users (clients, providers, admins)
- Businesses (salons, spas, etc.)
- Services & ServiceVariants
- Staff
- AvailabilityRules & TimeOff
- Appointments & AppointmentItems
- Payments & Refunds (for future Stripe integration)

## Booking Engine

The availability computation algorithm (implemented in `apps/api/src/availability/`):
1. Load availability rules for the business/staff
2. Expand rules to UTC intervals for the requested date
3. Subtract time-off periods
4. Subtract existing appointments
5. Generate discrete time slots at configured intervals
6. **Caching**: In-memory TTL cache for slot results (see `CACHE_TTL_AVAILABILITY` in `@planity/shared`). For multi-instance deployments, replace with Redis using the same key shape and TTL.

Double-booking prevention (implemented):
- Database-level exclusion constraints (Postgres) in the appointments schema
- Idempotency keys for retry safety
- Transaction-based creation and cross-tenant validation in the appointments service

## Public API behaviour

- **Business list** (`GET /businesses`): Paginated; supports `page`, `limit` (max 100), `city`, `query`. Response shape: `{ data, total, page, limit }`.

## Security

- Password hashing: Argon2
- JWT tokens: Access + Refresh
- Rate limiting: Throttler module
- Input validation: class-validator DTOs
- Role-based access: Guards + Decorators

## GDPR Compliance

- Data minimization
- User data export/deletion (V1)
- Consent management (V1)
- Audit logging (V1)

## Platform evolution (future)

The following are documented for when product scope or scale justify them:

- **Caching**: Availability slots use an in-memory cache today. For horizontal scaling, introduce a shared cache (e.g. Redis) with the same key pattern `businessId:date:serviceVariantId:staffId` and TTL from `CACHE_TTL_AVAILABILITY`. Business list pagination reduces load; optional Redis caching for list responses can use `CACHE_TTL_BUSINESS_LIST`.
- **Notifications and reminders**: Async notifications (email/SMS/push for confirmations, reminders, cancellations) are not implemented. When added, use a queue (e.g. BullMQ) and dedicated worker(s); document event types and idempotency in this section.
- **Provider and admin surfaces**: Provider dashboard and admin web app are planned; ownership and scope to be defined with product. Keep provider/admin APIs and UI in separate modules or apps for clear boundaries.

