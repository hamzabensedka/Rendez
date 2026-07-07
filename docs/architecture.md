# Planity Clone — System Architecture

## 1. Purpose
Define system architecture for a Planity-style beauty & wellness booking marketplace. The design covers a mobile-first customer app, provider portal, admin dashboard, and a scalable backend API.

## 2. Tech Stack
- Mobile: Expo, React Native, TypeScript, Expo Router, TanStack React Query, React Native Reanimated
- Backend: NestJS, Prisma, PostgreSQL + PostGIS, Redis (BullMQ)
- Tooling: Nx, pnpm, Docker Compose, GitHub Actions, EAS Build, Jest, Supabase (managed Postgres + Storage)

## 3. Monorepo Structure (Nx + pnpm)
planity-clone/
├── apps/
│   ├── mobile/                # Expo customer app (iOS/Android/Web)
│   │   ├── app/               # Expo Router screens (file-based)
│   │   ├── components/        # Shared UI components
│   │   ├── features/          # Feature modules (auth, search, booking)
│   │   ├── hooks/             # React Query hooks, Reanimated utils
│   │   ├── assets/
│   │   ├── eas.json
│   │   └── package.json
│   ├── provider/             # Expo provider portal (tablet/web)
│   │   ├── app/
│   │   ├── features/          # dashboard, staff, services
│   │   └── ...
│   ├── admin/                # Expo admin web dashboard
│   │   ├── app/
│   │   └── features/
│   └── api/                  # NestJS backend
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── users/
│       │   │   ├── businesses/
│       │   │   ├── categories/
│       │   │   ├── search/
│       │   │   ├── availability/
│       │   │   ├── bookings/
│       │   │   ├── appointments/
│       │   │   ├── notifications/
│       │   │   ├── reviews/
│       │   │   ├── payments/
│       │   │   ├── providers/
│       │   │   ├── admin/
│       │   │   └── jobs/       # BullMQ processors
│       │   ├── prisma/
│       │   ├── redis/
│       │   ├── common/        # guards, decorators, pipes
│       │   ├── config/
│       │   └── main.ts
│       ├── test/
│       └── Dockerfile
├── libs/
│   ├── shared-types/         # TS interfaces (User, Business, Slot, etc.)
│   │   └── src/index.ts
│   ├── ui/                   # Cross-app design system (buttons, inputs, theme)
│   │   └── src/
│   ├── api-client/           # Typed fetch + React Query hooks
│   │   └── src/
│   ├── config/               # Zod env schemas, constants
│   └── utils/                # Date, geo, format helpers
├── tools/
│   └── scripts/
├── docker-compose.yml        # postgres+postgis, redis
├── nx.json
├── package.json
├── tsconfig.base.json
└── .github/
    └── workflows/
        ├── ci.yml
        ├── mobile-build.yml
        └── api-deploy.yml

## 4. Service Boundaries
### 4.1 Mobile App (Customer)
- Expo Router routes: /(tabs)/home, /search, /map, /business/[id], /booking, /appointments, /profile, /favorites
- Uses TanStack React Query for all server state; mutations for booking/cancel.
- React Native Reanimated for page transitions, map pin animations, skeleton shimmers.
- Talks to API via libs/api-client.

### 4.2 Provider Portal
- Separate Expo app (or web) with routes /login, /dashboard, /business, /staff, /services, /appointments.
- Role guard: only owner of business or staff with permissions.
- Real-time updates via React Query refetch intervals or WebSocket (future).

### 4.3 Admin Dashboard
- Expo web app with /users, /businesses, /categories, /reviews, /metrics.
- Admin role enforced by backend guard.

### 4.4 Backend API (NestJS)
Modular monolith with clear module boundaries:
- AuthModule: JWT issuance, OAuth, password reset. Uses Supabase Auth or custom.
- UsersModule: profile, addresses, preferences.
- BusinessesModule: CRUD, photos (Supabase Storage), staff.
- CategoriesModule: tree management.
- SearchModule: geo-text search using PostGIS ST_DWithin, full-text.
- AvailabilityModule: computes free slots from hours/breaks/bookings; uses Redis lock.
- BookingsModule: transactionally create appointment, prevent double-booking.
- AppointmentsModule: reschedule/cancel, policy checks.
- NotificationsModule: enqueues email/push/SMS jobs.
- ReviewsModule: verified-visit checks, rating aggregation.
- PaymentsModule: Stripe integration, webhooks.
- ProvidersModule: portal-specific logic, payouts.
- AdminModule: platform management.
- JobsModule: BullMQ queues (reminders, emails, slot-cache).

All modules use PrismaService for DB, RedisService for cache/queues. DTOs validated with class-validator.

## 5. Data Model (Prisma + PostGIS)
Key entities: User, Business, Category, Service, Staff, Appointment, Review, Payment, Notification, Job. Geographic columns use PostGIS geometry(Point). Indexes on location, category, date.

## 6. Critical Flows
### 6.1 Booking
1. Mobile queries Availability for service+date -> API computes slots (Redis cache).
2. User selects slot -> Booking mutation.
3. API starts DB transaction, re-checks slot free, inserts Appointment, locks via Redis SET NX.
4. If P1 payment: create Stripe intent; on success confirm; webhook finalizes.
5. Enqueue Notification job.

### 6.2 Map Search
Map viewport -> debounced query with bounds -> SearchModule uses PostGIS && operator + text filter -> returns pins.

## 7. Infrastructure
- Local: docker-compose up (postgres-postgis, redis).
- Supabase: managed Postgres + Storage in cloud; same Prisma schema.
- Redis: caching + BullMQ.
- GitHub Actions: on PR run lint, typecheck, Jest (unit/integration with testcontainers). On merge to main: build API Docker image, push; trigger EAS Build for mobile.
- EAS Build: produce binaries; submit to stores.

## 8. Testing & Quality
- Jest for unit (services, components), integration (NestJS e2e with Supertest + test DB).
- React Native Testing Library for mobile components.
- Nx affected commands for fast CI.
- Sonarcloud optional.

## 9. Security & Performance
- JWT auth, RBAC guards per module.
- Rate limit on search/booking.
- PostGIS spatial index for <1s search.
- Redis atomic locks for slot safety.
- Opt-out notification preferences.

## 10. Summary
This architecture delivers a clean, scalable monorepo with separated apps and backend modules, shared types/UI, and automated pipelines suitable for the Planity Clone MVP and future growth.