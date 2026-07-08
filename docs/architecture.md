# Planity Clone - System Architecture

## 1. Overview
Planity Clone is a mobile-first platform for discovering and booking beauty and wellness services. The architecture follows clean separation of concerns using an Nx pnpm monorepo with three deployable surfaces: Expo React Native mobile app, Expo Web provider/admin portal, and NestJS API. Data persists in PostgreSQL with PostGIS (hosted via Supabase), with Redis powering cache and BullMQ background jobs.

## 2. Technology Stack
- Mobile: Expo, React Native, TypeScript, Expo Router, TanStack React Query, React Native Reanimated
- Backend: NestJS, Prisma, PostgreSQL + PostGIS, Redis, BullMQ, Supabase Auth
- Tooling: Nx, pnpm, Docker Compose, GitHub Actions, EAS Build, Jest

## 3. Monorepo Folder Scaffold
apps/
  mobile/                 # Expo RN app (iOS/Android)
    app/                  # Expo Router screens
    components/
    features/
    api/
  web/                    # Expo Web for Provider & Admin
    routes/
  api/                    # NestJS app
    src/
      modules/
libs/
  shared/
    types/                # Shared TS types (Feature 12)
    ui/                   # Design system components
    config/               # Theme tokens, env schemas
  mobile/
    features/             # auth, search, booking, etc.
    components/
    api/                  # React Query hooks
  backend/
    prisma/               # schema.prisma, migrations, seed
    auth/                 # Auth module (Supabase JWT guard)
    user/                 # Profile, payment methods
    business/             # Businesses, staff, services
    category/             # Taxonomy
    search/               # Text + Geo (PostGIS)
    booking/              # Appointments orchestration
    availability/         # Slot computation
    payment/              # Stripe/Apple/Google Pay
    review/               # Ratings
    notification/         # Push/email/SMS
    admin/                # Super-admin
    jobs/                 # BullMQ workers
  utils/                  # Logging, exceptions
packages/
  eslint-config/
  tsconfig/
tools/
  docker/                 # Dockerfiles, docker-compose.yml
  github/                 # Workflows
  jest/                   # Presets
package.json
pnpm-workspace.yaml
nx.json
tsconfig.base.json

## 4. Service Boundaries
### Backend (NestJS Modules)
- AuthModule: Validates Supabase JWT, issues session, enforces RBAC.
- UserModule: Manages profile, tokenized cards, notification prefs.
- BusinessModule: CRUD for salons, staff, services, hours (provider portal).
- CategoryModule: Seeded taxonomy, admin-editable.
- SearchModule: Combines text filters and PostGIS spatial queries.
- AvailabilityModule: Generates slots from hours, shifts, bookings, tz.
- BookingModule: Orchestrates flow, calls Availability, Payment, Notification.
- PaymentModule: Stripe/Apple/Google Pay, refunds, invoices.
- ReviewModule: Verified reviews, business replies.
- NotificationModule: FCM/email/SMS with per-type opt-out.
- AdminModule: Approves businesses, disables accounts, metrics.
- JobsModule: BullMQ producers/consumers (Redis), idempotent.

### Mobile (Feature Modules)
- auth: login, OTP, social, secure storage.
- explore: guest home, categories.
- search: filters, map view (Reanimated pins).
- business-detail: photos, services, reviews, CTA.
- booking: multi-step wizard with React Query mutations.
- appointments: list, reschedule, cancel.
- profile: info, payments, settings.
- favorites: toggle, synced list.

### Web Portals
- Provider portal (Expo Web): business management screens.
- Admin dashboard (Expo Web): platform oversight.

## 5. Data Architecture
PostgreSQL with PostGIS extension. Prisma models: User, Business, Staff, Service, Category, Appointment, Review, Payment, NotificationPref. Business has location geometry (PostGIS point). Search uses ST_DWithin for radius. Redis caches categories, trending businesses, and session metadata. BullMQ queues: reminder, email, thumbnail, slot-recompute.

## 6. Key Flows
1. Auth: Mobile uses Supabase Auth (email/OTP/social) -> JWT stored in expo-secure-store -> React Query attaches bearer.
2. Search/Map: Mobile sends viewport + filters -> SearchModule queries PostGIS -> pins animated via Reanimated.
3. Booking: Select service -> AvailabilityModule returns slots -> BookingModule creates appointment -> PaymentModule charges -> JobsModule enqueues confirmation + 24h reminder.
4. Background: BullMQ worker sends reminders, generates thumbnails, recomputes slots on staff changes.

## 7. CI/CD and Deployment
- GitHub Actions: Nx affected build/lint/test (Jest). API Docker build, mobile EAS Build.
- Docker Compose: local dev with postgres-postgis, redis, api, web.
- Supabase: managed Postgres+PostGIS, Auth, Storage.
- EAS Build: native binaries with env secrets.

## 8. Testing Strategy
- Jest unit tests for libs and modules.
- NestJS e2e with isolated test DB.
- React Native Testing Library for components.
- Mock Prisma and React Query in tests.

## 9. Cross-Cutting Concerns
- Design system in libs/shared/ui with dark/light tokens.
- Central error filters in NestJS, error boundaries in React.
- Structured logging, Redis failure alerts.
- Security: JWT validation, Stripe PCI tokenization, RBAC.

## 10. Scalability and Future
- Stateless API behind LB, horizontal scaling.
- Redis clustering for cache/queue.
- PostGIS spatial indexes for fast geo queries.
- Nx boundaries enable incremental builds and clear ownership.