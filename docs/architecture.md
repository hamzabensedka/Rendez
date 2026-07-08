# Planity Clone - System Architecture

## 1. Overview
Planity Clone is a marketplace for beauty & wellness appointments. The system consists of a mobile client (Expo/React Native), a NestJS backend API, and optional web portals for providers and admins. A monorepo managed by Nx and pnpm ensures shared types and design system. PostgreSQL with PostGIS stores relational and geo data; Redis powers caching and BullMQ jobs; Supabase provides auth/OAuth and file storage. CI/CD via GitHub Actions, local dev via Docker Compose, mobile builds via EAS Build.

## 2. Technology Stack
- Mobile: Expo, React Native, TypeScript, Expo Router, TanStack React Query, React Native Reanimated
- Backend: NestJS, Prisma, PostgreSQL, PostGIS, Redis (BullMQ)
- Infra: Nx, pnpm, Docker Compose, GitHub Actions, Supabase, EAS Build, Jest

## 3. Monorepo Structure (Nx + pnpm)
planity-clone/
  ├── apps/
  │   ├── mobile/            # Expo RN app
  │   ├── api/               # NestJS server
  │   ├── provider-web/     # React dashboard (P1)
  │   └── admin-web/        # React admin (P1)
  ├── libs/
  │   ├── shared-types/     # TS interfaces (User, Business, etc.)
  │   ├── ui/               # Design system components & tokens
  │   ├── config/           # Shared env schemas
  │   └── api-client/       # Typed fetch wrappers
  ├── tools/
  │   └── scripts/
  ├── docker-compose.yml    # postgres+postgis, redis
  ├── nx.json
  ├── pnpm-workspace.yaml
  └── package.json

## 4. Backend Architecture (NestJS)
The API is organized into modules with clear boundaries:

- AuthModule: email/phone registration, JWT, OAuth (Supabase), password reset.
- UsersModule: profile, addresses, notification preferences.
- CategoriesModule: taxonomy seed & queries.
- BusinessesModule: CRUD, photos (Supabase Storage), staff, hours.
- SearchModule: text search + PostGIS geo queries, filters, sorting.
- MapModule: clustered pins, geo preview (uses SearchModule).
- AvailabilityModule: slot computation from hours/staff/appointments, timezone aware, buffer.
- BookingModule: multi-step booking orchestration, payment trigger.
- AppointmentsModule: manage upcoming/past, reschedule, cancel.
- PaymentsModule: Stripe integration, 3DS, refunds, invoices.
- NotificationsModule: email/push/SMS via BullMQ, opt-out.
- ReviewsModule: verified reviews, ratings aggregation, moderation.
- FavoritesModule: bookmark businesses.
- ProviderModule: business owner portal APIs.
- AdminModule: super admin management.
- JobsModule: BullMQ queues (email, sms, reminder cron, availability cache).

All DB access via PrismaService. Geo queries use raw PostGIS SQL through Prisma. Redis used for caching search results, sessions, and BullMQ.

## 5. Mobile Architecture (Expo)
apps/mobile/
  ├── app/                 # Expo Router screens (tabs, stack)
  │   ├── (auth)/
  │   ├── (tabs)/           # explore, search, map, profile
  │   ├── business/[id]/
  │   ├── booking/
  │   └── appointments/
  ├── components/          # reusable UI
  ├── features/            # feature slices (auth, explore, etc.)
  ├── hooks/               # React Query hooks
  ├── animations/          # Reanimated builders
  ├── lib/                 # api client, storage, env
  └── __tests__/           # Jest

State: TanStack React Query for server state, React Context for auth token. Reanimated for map pin transitions, sheet modals, list animations.

## 6. Shared Types & Design System
libs/shared-types holds DTOs and entities mirrored from Prisma. libs/ui exports Button, Card, Input, Modal, colors, spacing. Both mobile and web import these libs.

## 7. Background Jobs & Caching
BullMQ queues in Redis:
- notificationQueue: send email/push/SMS with retry.
- reminderCron: daily 24h-before reminders.
- availabilityCacheQueue: precompute slots for popular businesses.
- analyticsQueue: aggregate metrics.

Redis also caches category lists, trending businesses, and geo search results with TTL.

## 8. Infrastructure & CI/CD
- Docker Compose: postgres:15-postgis, redis:7, supabase local (optional).
- GitHub Actions: on PR run `pnpm install`, `nx affected:lint`, `nx affected:test` (Jest), `nx affected:build`. On tag: `eas build` for mobile, `docker build` for API, deploy to cloud.
- Supabase: managed Postgres+PostGIS, Auth, Storage. Prisma connects to Supabase DB.
- EAS Build: produces mobile binaries; uses app.config.ts with env.

## 9. Service Boundaries Summary
- Mobile -> API (HTTPS) -> NestJS Modules -> Prisma -> Postgres/PostGIS.
- Async tasks: API -> BullMQ -> Worker (same NestJS process or separate) -> Redis/External (Stripe, Email).
- Supabase: Auth token issuance, file storage, optional realtime.
- Web portals share API and libs.

## 10. Testing
Jest for unit tests (services, components, hooks). Integration tests for API using Prisma + test DB. E2E with Detox (mobile) optional.

This architecture meets P0 features: auth, browse, search, map, detail, categories, booking, availability, payments, notifications, jobs, shared types.