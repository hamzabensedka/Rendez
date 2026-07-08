# Planity Clone - System Architecture

## 1. Overview
Planity Clone is a mobile-first platform for beauty & wellness booking. The system is built as an Nx pnpm monorepo containing an Expo React Native mobile app, an Expo web portal for business owners and admins, and a NestJS API. Data is stored in PostgreSQL with PostGIS, accessed via Prisma. Redis provides caching and BullMQ job queues. Supabase hosts managed Postgres and file storage. CI/CD uses GitHub Actions, EAS Build, and Docker Compose.

## 2. Monorepo Folder Structure
Below is the scaffold (Nx + pnpm):

apps/
  mobile/                # Expo RN app (iOS/Android) with Expo Router
    app/                 # File-based routes
      (auth)/            # login, register, reset
      (tabs)/            # home, search, bookings, profile
      business/[id]/     # business detail
      map/               # map search
      booking/           # multi-step flow
    components/          # feature components
    hooks/               # React Query hooks
    config/              # expo config, eas.json
  portal/                # Expo web app for owner/admin dashboards
    app/                 # routes for dashboard
    components/
  api/                   # NestJS application
    src/
      modules/
        auth/
        users/
        businesses/
        categories/
        services/
        staff/
        availability/
        booking/
        payment/
        review/
        notification/
        favorite/
        admin/
        jobs/            # BullMQ processors
      common/            # guards, decorators, prisma service
      main.ts
    test/
libs/
  shared-types/          # TS interfaces, DTOs, enums (used by all apps)
  ui/                    # Design system: Button, Card, Sheet, Theme (light/dark)
  api-client/            # Fetch wrapper + React Query hooks (tanstack)
  workers/               # Shared BullMQ queue definitions
  prisma/                # schema.prisma, migrations, seed
  config/                # Base tsconfig, eslint, jest presets
tools/
  docker/
    docker-compose.yml   # postgres-postgis, redis
  github/
    workflows/           # ci.yml, mobile.yml, api.yml
package.json
pnpm-workspace.yaml
nx.json

## 3. Service Boundaries
### 3.1 Client Apps
- mobile: Expo RN using Expo Router. Consumes API via api-client lib. Uses TanStack React Query for server state, React Native Reanimated for animations (bottom sheet, page transitions). No direct DB access.
- portal: Expo web (same libs) for business owner and admin. Role-based routing; uses same api-client.

### 3.2 API Layer (NestJS)
Single backend service exposing RESTful JSON endpoints under /api. Internal module boundaries:
- Auth: JWT issuance, social login, password reset.
- Users: profile, preferences, payment methods (tokenized via Stripe).
- Businesses: CRUD, geolocation (PostGIS), media (Supabase Storage).
- Categories: taxonomy CRUD (admin).
- Services: service definitions per business.
- Staff: staff profiles and assignments.
- Availability: slot computation using business hours, staff shifts, bookings; cached in Redis.
- Booking: create/cancel/reschedule, payment trigger.
- Payment: Stripe integration, refunds.
- Review: ratings, owner responses.
- Notification: push (Firebase) + email; enqueues jobs.
- Favorite: saved businesses/staff.
- Admin: user/business management, analytics.
- Jobs: BullMQ processors for async work.

### 3.3 Data Layer
- PostgreSQL + PostGIS: primary datastore. Business table has geometry column. Prisma for ORM; raw SQL for geo queries via Prisma.$queryRaw.
- Supabase: managed Postgres instance and Storage bucket for photos. Optionally Supabase Auth not used; custom JWT.
- Redis: availability cache, session blacklist, BullMQ queues.

### 3.4 Background Workers
BullMQ workers run inside API process or separate worker container. Queues:
- notify: send push/email.
- availability-cache: precompute popular slots.
- payment-sync: reconcile Stripe.
- cleanup: expired tokens, old logs.

## 4. Key Flows
### 4.1 Booking
Mobile -> React Query mutation -> POST /bookings -> BookingService checks Availability (Redis/DB) -> PaymentService charges -> NotificationJob queued -> Confirmation.

### 4.2 Map Search
Mobile map view calls /businesses/near?lat&lng&radius -> API uses PostGIS ST_DWithin -> returns pins -> pan triggers debounced refetch.

## 5. Cross-Cutting Concerns
- Shared Types: libs/shared-types ensures frontend/backend contract.
- Design System: libs/ui with theming (light/dark) using Reanimated for motion.
- Testing: Jest for unit/integration in all apps; API e2e with Supertest.
- CI: GitHub Actions runs pnpm install, nx affected test lint build. Mobile uses EAS Build for preview/prod. API builds Docker image.

## 6. Infrastructure
docker-compose for local dev:
  postgres: image postgis/postgis
  redis: image redis:7
GitHub Actions:
  - ci.yml: lint/test on PR
  - mobile.yml: EAS Build on push to main
  - api.yml: Docker build & deploy
Supabase project for cloud DB/storage; env vars via .env.

## 7. Priority Mapping
P0 features (Auth, Search, Detail, Categories, Booking, Availability, Payment, Owner Portal) implemented in initial modules. P1/P2 follow same boundaries.

## 8. Open Questions Addressed
- Cancellation policy: stored as column on Business; Availability respects.
- Multi-language: i18n lib added later; API returns localized strings via Accept-Language.

This document defines the complete architecture scaffold.