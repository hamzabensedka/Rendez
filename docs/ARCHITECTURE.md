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

- **Monorepo**: Nx workspace
- **Mobile**: Expo React Native + TypeScript
- **Backend**: NestJS + Prisma + Postgres
- **Cache/Jobs**: Redis + BullMQ (future)
- **Storage**: S3-compatible (future)

## Project Structure

```
apps/
  api/          # NestJS backend
  mobile/       # Expo React Native app
  admin-web/    # Next.js admin (future)

packages/
  shared/       # Shared types, utils, constants
  ui/           # Design tokens, components
  config/       # ESLint, TypeScript configs
```

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

The availability computation algorithm:
1. Load availability rules for the business/staff
2. Expand rules to UTC intervals for the requested date
3. Subtract time-off periods
4. Subtract existing appointments
5. Generate discrete time slots at configured intervals
6. Cache results in Redis (future)

Double-booking prevention:
- Database-level exclusion constraints (Postgres)
- Idempotency keys for retry safety
- Transaction-based creation

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

