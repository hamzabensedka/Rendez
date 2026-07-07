# Planity Clone — System Architecture

## 1. Overview
Planity Clone is a mobile-first marketplace for beauty & wellness booking. This document defines the system architecture, monorepo layout, service boundaries, and deployment pipeline. The design follows clean architecture, strict separation of concerns, and scalability.

## 2. Technology Stack
- Mobile: Expo, React Native, TypeScript, Expo Router, TanStack React Query, React Native Reanimated.
- Backend: NestJS, Prisma, PostgreSQL + PostGIS, Redis (cache + BullMQ), Supabase (Auth, Storage, Realtime).
- Tooling: Nx, pnpm, Docker Compose, GitHub Actions, EAS Build, Jest.

## 3. Monorepo Layout (Nx + pnpm)
We use a single Nx workspace managed by pnpm.

apps/
  mobile/                # Expo React Native app (client, provider, admin roles)
    app/                 # Expo Router screens
      (guest)/           # Guest browse, explore, business detail
      (auth)/            # Login, signup, OTP
      (tabs)/            # Authenticated tabs: Home, Search, Bookings, Profile
      provider/          # Provider portal screens
      admin/             # Admin dashboard screens (role-gated)
    assets/
    eas.json
  api/                   # NestJS application
    src/
      modules/
      main.ts
      prisma/
    test/
  admin/                 # Optional Expo Web admin (or same mobile role)
libs/
  shared-types/          # TypeScript interfaces, enums, DTOs (versioned)
  ui-kit/                # Design system: Button, Card, Colors, Typography
  api-client/            # React Query hooks, fetch wrapper, auth context
  config/                # Env schemas, constants
  utils/                 # Date, geo, formatting
packages/
  eslint-config/         # Shared lint rules
  tsconfig/              # Base tsconfig

## 4. Backend Architecture (NestJS)
The API is a modular monolith. Each domain is a NestJS module with clear boundaries.

### 4.1 Modules
- AuthModule: integrates Supabase Auth (email, phone OTP, OAuth) and issues JWT refresh tokens. Handles password reset, logout (token blacklist in Redis).
- UserModule: profile, addresses, favorites.
- BusinessModule: CRUD for businesses, galleries (Supabase Storage), staff.
- ServiceModule: categories tree, service offerings.
- SearchModule: text search + Geo queries via PostGIS; uses Redis cache for popular results.
- BookingModule: orchestrates availability, payment, confirmation; prevents double booking via DB constraints + transactional locks.
- AvailabilityModule: computes slots from hours, breaks, booked; DST-safe using UTC.
- PaymentModule: Stripe integration (cards, Apple/Google Pay, 3DS, refunds).
- NotificationModule: push (FCM via Supabase), email, SMS; opt-out.
- ReviewModule: verified reviews, ratings, owner replies, flags.
- AdminModule: user/business management, disputes, audit log, role guard.
- JobsModule: BullMQ queues for reminders, slot cleanup, reports.

### 4.2 Data Layer
- Prisma ORM with PostgreSQL + PostGIS extension (geometry columns for business location).
- Migrations via Prisma + Supabase CLI.
- Redis for: token blacklist, search cache, BullMQ job queue.

### 4.3 Realtime
- Supabase Realtime used for provider portal live booking updates and analytics.

## 5. Frontend Architecture (Expo Mobile)
- Expo Router provides file-based navigation.
- TanStack React Query manages server state, caching, and mutations; backed by api-client lib.
- React Native Reanimated powers map pin animations, sheet transitions, and micro-interactions.
- UI Kit from libs/ui-kit ensures consistent design.
- Feature-based screen grouping under app/ routes; shared hooks in libs/api-client.

## 6. Service Boundaries
| Service | Responsibility | Depends On |
|---------|----------------|------------|
| Mobile App | UI, navigation, local state | API, Supabase Auth |
| API (NestJS) | Business logic, validation | DB, Redis, Supabase, Stripe |
| Auth (Supabase) | Identity, OTP, OAuth | Postgres |
| Postgres+PostGIS | Persistent storage, geo | - |
| Redis | Cache, queues, blacklist | - |
| BullMQ | Background jobs | Redis, API |
| Stripe | Payments | API |
| FCM/Email/SMS | Notifications | API |

Boundaries: Mobile never touches DB directly. All writes go through NestJS. Provider portal uses same API with role-scoped tokens. Admin uses same API with elevated role.

## 7. Key Flows
- Guest Browse: Mobile -> SearchModule (cached) -> PostGIS query.
- Booking: Mobile -> BookingModule -> Availability check (Redis lock) -> PaymentModule (Stripe) -> NotificationModule -> Booking saved.
- Provider Update: Provider App -> BusinessModule -> Supabase Realtime broadcast.

## 8. CI/CD & Infra
- GitHub Actions: on push, run pnpm install, Nx affected lint/test (Jest), build API Docker image, run EAS Build for mobile.
- Docker Compose: local dev with postgres (postgis), redis, api, supabase emulators.
- EAS Build: produce iOS/Android binaries; uses eas.json.
- Supabase: cloud project for Auth, Storage, Realtime, DB.

## 9. Testing
- Jest for unit tests (services, utils) and integration (NestJS e2e with test DB).
- Shared types ensure contract testing between mobile and API.
- UI components tested with React Native Testing Library (Jest).

## 10. Security & Compliance
- RBAC via NestJS guards (Client, Owner, Admin).
- JWT short-lived access + refresh in Redis.
- Rate limiting on Auth and Search.
- PII encrypted at rest; Stripe handles card data (PCI).

## 11. Scalability
- Stateless API horizontally scalable.
- Redis cluster for cache/queue.
- PostGIS spatial index for fast map queries.
- CDN for Supabase storage images.

This architecture satisfies all P0/P1 features and provides clear extension points for P2.