# Planity Clone — System Architecture

## 1. Overview
Planity Clone is a mobile-first marketplace for beauty & wellness bookings. The system is built as an Nx pnpm monorepo with three deployable surfaces: a React Native (Expo) mobile client, a NestJS backend API, and web portals (provider/admin) optionally served via Expo Router web or a lightweight React app. The backend uses Prisma over PostgreSQL with PostGIS, Redis for caching and BullMQ queues, and Supabase for managed Postgres/Auth/Storage. CI/CD is GitHub Actions, local infra via Docker Compose, mobile builds via EAS Build, tests via Jest.

## 2. High-Level Architecture
- Mobile Client (Expo Router) -> HTTPS -> NestJS API Gateway
- Web Portals -> HTTPS -> NestJS API
- NestJS API -> Prisma -> PostgreSQL + PostGIS (Supabase)
- NestJS API -> Redis (cache, BullMQ)
- BullMQ Workers -> Email/SMS/Push providers
- Supabase Storage for images, Supabase Auth optional for OAuth

Key principles: clean architecture, separation of concerns, shared types across apps, feature-based modules.

## 3. Monorepo Folder Scaffold (Nx + pnpm)

planity-clone/
├─ apps/
│  ├─ mobile/                # Expo React Native app
│  │  ├─ app/                # Expo Router screens (tabs, stack)
│  │  ├─ components/         # Local components
│  │  ├─ features/           # Feature modules (auth, booking)
│  │  ├─ hooks/              # React Query hooks
│  │  ├─ lib/                # Secure store, api client
│  │  ├─ assets/
│  │  ├─ eas.json
│  │  └─ package.json
│  ├─ backend/               # NestJS API
│  │  ├─ src/
│  │  │  ├─ main.ts
│  │  │  ├─ app.module.ts
│  │  │  ├─ modules/
│  │  │  │  ├─ auth/
│  │  │  │  ├─ user/
│  │  │  │  ├─ business/
│  │  │  │  ├─ category/
│  │  │  │  ├─ service/
│  │  │  │  ├─ search/
│  │  │  │  ├─ availability/
│  │  │  │  ├─ booking/
│  │  │  │  ├─ payment/
│  │  │  │  ├─ review/
│  │  │  │  ├─ favorite/
│  │  │  │  ├─ notification/
│  │  │  │  ├─ admin/
│  │  │  │  └─ provider/
│  │  │  └─ common/
│  │  ├─ test/
│  │  └─ nest-cli.json
│  ├─ web-provider/          # Provider portal (Expo Router web or React)
│  └─ web-admin/             # Admin dashboard
├─ libs/
│  ├─ shared-types/          # TS interfaces (User, Business, etc.)
│  ├─ shared-ui/             # Button, Card, Input, theme tokens
│  ├─ shared-utils/          # formatters, validators
│  ├─ backend-prisma/        # Prisma schema, migrations, client
│  ├─ backend-core/          # Guards, decorators, pipes
│  └─ mobile-ui/             # Mobile-specific UI wrappers
├─ tools/
│  ├─ docker/                # Dockerfiles
│  └─ github/                # GitHub Actions workflows
├─ docker-compose.yml        # postgres-postgis, redis
├─ nx.json
├─ pnpm-workspace.yaml
├─ tsconfig.base.json
└─ README.md

## 4. Service Boundaries (NestJS Modules)
Each module owns its domain logic, DTOs, and Prisma queries. Cross-module calls via injected services.

- Auth: JWT issuance, OAuth (Google/Apple), password reset, Supabase Auth bridge.
- User: profile, addresses, payment methods (tokenized).
- Business: CRUD, profile, photos (Supabase Storage), staff.
- Category: taxonomy seed, listing.
- Service: service offerings under business.
- Search: PostGIS geo queries, filters, pagination, sorting.
- Availability: slot computation engine (15-min granularity, breaks, shifts).
- Booking: appointment creation, status machine, reschedule/cancel.
- Payment: Stripe/PayPal integration, refunds, receipts.
- Review: post-visit ratings, flagging.
- Favorite: saved businesses/services.
- Notification: BullMQ producers for push/email/SMS.
- Admin: moderation, approvals, metrics.
- Provider: business owner operations, calendar, payouts.

Redis usage: cache search results, store session blacklist, BullMQ queues (email, sms, reminder).

## 5. Mobile Client Architecture
- Expo Router for file-based navigation (tabs: Home, Search, Bookings, Favorites, Profile).
- TanStack React Query for server state, caching, pagination.
- React Native Reanimated for map pin animations, sheet transitions.
- SecureStore for JWT; React Query persisted cache optional.
- Features consume API via typed hooks from libs/shared-types and backend DTOs.
- Design system from libs/shared-ui ensures consistency.

## 6. Shared Types & Design System
- libs/shared-types exports User, Business, Appointment, Service, Review, etc. Used by mobile, backend, web.
- libs/shared-ui exports themed components, light/dark tokens, used by all frontends.

## 7. Data Layer
- PostgreSQL with PostGIS extension (via Supabase or Docker). Prisma schema includes models with PostGIS columns (e.g., business.location geography(Point)).
- Migrations in libs/backend-prisma/migrations.
- Redis for cache and BullMQ.

## 8. Background Jobs
- NestJS Notification module enqueues BullMQ jobs.
- Worker processes (in backend or separate container) consume queues, call providers (Expo Push, SendGrid, Twilio).
- Dead-letter queue after retries.

## 9. Infrastructure & CI/CD
- docker-compose.yml spins up postgres-postgis and redis for local dev.
- GitHub Actions: on push, pnpm install, Nx affected lint/test/build, Jest coverage. Separate workflow for EAS Build (mobile) and backend Docker image.
- EAS Build config in apps/mobile/eas.json for preview/production.
- Supabase project hosts managed Postgres + Auth + Storage; env vars via GitHub secrets.

## 10. Testing
- Jest for unit tests in libs and apps.
- NestJS e2e with Supertest using test Postgres.
- React Native Testing Library for mobile components.
- Nx ensures targeted test runs.

## 11. Scalability & Maintainability
- Clear module boundaries allow independent scaling (e.g., search service can use read replica).
- Redis offloads hot queries.
- Shared types prevent drift.
- Nx caching speeds CI.
- Strict TypeScript everywhere.

This architecture satisfies all P0-P2 features with clean separation and ready for scale.