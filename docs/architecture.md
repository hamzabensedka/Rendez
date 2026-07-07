# Planity Clone - System Architecture

## 1. Overview
Jordan (Staff Architect) presents a clean, scalable architecture for Planity Clone, a mobile-first beauty & wellness booking platform. The system is built as an Nx pnpm monorepo with clear separation between mobile client, NestJS API, background workers, and shared libraries.

## 2. Tech Stack
- Mobile: Expo, React Native, TypeScript, Expo Router, TanStack React Query, React Native Reanimated
- Backend: NestJS, Prisma, PostgreSQL, PostGIS, Redis (BullMQ)
- Infra: Supabase (managed Postgres+PostGIS, Storage), Docker Compose, GitHub Actions, EAS Build
- Monorepo: Nx, pnpm
- Testing: Jest

## 3. Monorepo & Folder Scaffold

planity-clone/
├── apps/
│   ├── mobile/            # Expo app (customer + provider/role UIs)
│   │   ├── app/           # Expo Router screens (file-based)
│   │   ├── components/    # Feature components
│   │   ├── lib/           # Query hooks, api client, storage
│   │   └── config/        # Expo config, env
│   ├── api/               # NestJS REST API
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   ├── users/
│   │   │   │   ├── businesses/
│   │   │   │   ├── categories/
│   │   │   │   ├── services/
│   │   │   │   ├── bookings/
│   │   │   │   ├── availability/
│   │   │   │   ├── payments/
│   │   │   │   ├── reviews/
│   │   │   │   ├── favorites/
│   │   │   │   ├── notifications/
│   │   │   │   ├── admin/
│   │   │   │   └── provider/
│   │   │   ├── common/    # guards, decorators, pipes
│   │   │   └── main.ts
│   │   └── test/
│   ├── worker/            # BullMQ consumer (NestJS standalone)
│   │   └── src/           # job processors (notify, reminder, cleanup)
│   └── admin/             # Expo Web dashboard for super admin
├── libs/
│   ├── shared-types/      # TS interfaces, DTOs, enums (used by all apps)
│   ├── ui/                # Design system (buttons, cards, theme)
│   ├── prisma/            # Prisma schema, client, migrations
│   └── config/            # Shared tsconfig, eslint, jest presets
├── docker-compose.yml     # postgres, redis, api, worker
├── nx.json
├── package.json
└── pnpm-workspace.yaml

## 4. Service Boundaries

### API Modules (NestJS)
- **Auth**: JWT issuance, email/phone verification, password reset, Supabase Auth optional.
- **Users**: Profile, avatar, payment methods, notification settings.
- **Businesses**: CRUD, geo-location (PostGIS), images (Supabase Storage), staff.
- **Categories**: Hierarchical seeding and query.
- **Services**: Service offerings, pricing, duration.
- **Availability**: Slot computation (15-min increments) using business hours, staff, bookings.
- **Bookings**: Create/cancel/reschedule, status, payment linkage.
- **Payments**: Stripe/PayPal integration, deposits, refunds.
- **Reviews**: Rating submission, dedupe, aggregate.
- **Favorites**: Bookmark businesses.
- **Notifications**: Push (Expo/Supabase), email/SMS triggers.
- **Admin**: User/business moderation, metrics.
- **Provider**: Business owner portal logic (same models, role-scoped).

Each module exposes controllers (HTTP), services (logic), and repositories (Prisma). Cross-module communication via services only.

### Background Workers
BullMQ queues in Redis: `notifications`, `reminders`, `slot-cleanup`. Worker app consumes jobs, retries on failure, logs delivery.

### Data Layer
- **PostgreSQL + PostGIS** via Supabase: businesses, geo queries.
- **Prisma** as ORM; schema in libs/prisma.
- **Redis**: caching (search results, availability) and queues.

## 5. Mobile App Architecture
- **Expo Router**: `app/(guest)`, `app/(auth)`, `app/(provider)` route groups.
- **TanStack React Query**: server state, caching, mutations for bookings.
- **React Native Reanimated**: map pin animations, sheet transitions.
- **Design System (libs/ui)**: themed Button, Card, Input, MapPin.
- **Secure Storage**: JWT in Expo SecureStore.
- **Feature folders**: `features/auth`, `features/explore`, `features/booking`, `features/map`, `features/profile`.

## 6. Cross-Cutting Concerns
- **Shared Types**: libs/shared-types ensures frontend/backend contract.
- **CI/CD**: GitHub Actions runs `nx test`, `nx build`; Docker Compose for local; EAS Build for mobile binaries; Supabase migrations via Prisma.
- **Observability**: structured logs, Redis monitoring.

## 7. Key Flow: Booking
1. Mobile queries Availability module (Redis-cached slots).
2. User confirms -> Bookings service creates pending booking.
3. Payments service charges via Stripe, updates status.
4. Worker enqueues confirmation notification + reminder.
5. Cancel frees slot via Availability recompute.

## 8. Summary
Clean Nx monorepo with Expo mobile, NestJS API, BullMQ worker, Supabase PostGIS data, and shared libraries ensures maintainability and scale.