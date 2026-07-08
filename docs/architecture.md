# Planity Clone — System Architecture

## 1. Introduction
This document defines the system architecture for Planity Clone, a mobile-first platform for discovering and booking beauty and wellness services. The design follows clean architecture, separation of concerns, and uses an Nx + pnpm monorepo.

## 2. Technology Stack
- Mobile: Expo, React Native, TypeScript, Expo Router, TanStack React Query, React Native Reanimated, EAS Build.
- Backend: NestJS, Prisma, PostgreSQL + PostGIS, Redis (BullMQ), Supabase (managed Postgres/Storage/Auth).
- Tooling: Nx, pnpm, Docker Compose, GitHub Actions, Jest.

## 3. Monorepo Folder Scaffold
planity-clone/
├── apps/
│   ├── mobile/                # Expo React Native app
│   │   ├── app/               # Expo Router screens
│   │   ├── src/
│   │   │   ├── components/    # UI components from packages/ui
│   │   │   ├── features/      # auth, search, booking, profile
│   │   │   ├── hooks/         # React Query + Reanimated
│   │   │   ├── lib/           # API client, secure store
│   │   │   └── types/        # re-export shared-types
│   │   ├── assets/
│   │   ├── app.json
│   │   ├── eas.json
│   │   └── package.json
│   ├── api/                   # NestJS backend
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── common/        # guards, pipes, interceptors
│   │   │   ├── prisma/        # PrismaService
│   │   │   ├── redis/         # RedisModule, cache
│   │   │   ├── modules/       # auth, users, businesses, categories, services, staff, availability, bookings, payments, reviews, notifications, admin, provider
│   │   │   └── queues/        # BullMQ processors
│   │   ├── test/
│   │   └── package.json
│   ├── admin/                 # Expo Web admin (P1)
│   └── provider/             # Expo Web provider portal (P0)
├── packages/
│   ├── shared-types/          # TS contracts
│   ├── ui/                    # Design system (RN + Reanimated)
│   ├── config/                # tsconfig, eslint, jest
│   └── utils/                 # geo, date helpers
├── prisma/
│   ├── schema.prisma         # Models + PostGIS
│   ├── migrations/
│   └── seed/                 # Categories, demo data
├── infra/
│   ├── docker-compose.yml    # postgres-postgis, redis, api
│   ├── postgres/init.sql     # enable postgis
│   └── supabase/config.ts
├── .github/workflows/
│   ├── ci.yml
│   ├── deploy-api.yml
│   └── eas-build.yml
├── docs/
│   ├── product.md
│   └── architecture.md
├── nx.json
├── pnpm-workspace.yaml
└── package.json

## 4. Service Boundaries
### 4.1 Mobile App
Presentation layer only. Uses Expo Router for navigation, TanStack React Query for server state, Reanimated for animation. Stores JWT in Expo SecureStore. Consumes packages/ui and packages/shared-types. No direct DB/Redis.

### 4.2 API (NestJS)
Owns business logic. Modular by domain; each module has controller, service, Prisma repository, DTOs. Global AuthGuard (JWT), RolesGuard (RBAC). PrismaService queries PostGIS (e.g., ST_DWithin). RedisModule for cache and BullMQ.

### 4.3 Data Layer
PostgreSQL + PostGIS via Supabase. Prisma schema models User, Business, Category, Service, Staff, Availability, Booking, Review, Payment, Notification. Spatial indexes for geo queries.

### 4.4 Background Jobs
BullMQ queues: "email", "push", "reminder", "cleanup". Processors handle notifications, reminders, slot cleanup with retry and dead-letter.

### 4.5 Supabase
Provides managed PostGIS DB, Storage for photos, optional Auth for social login. NestJS validates tokens or mirrors users.

### 4.6 Payments
Stripe SDK mobile + webhook receiver in API. PCI compliant (no card data stored).

## 5. Key Domain Modules
- Auth: register/login/reset, social (P1).
- Businesses/Categories: CRUD, hierarchical categories, search/filter, map.
- Services/Staff: provider-managed.
- Availability: slot computation respecting hours, breaks, duration, buffer, timezone.
- Bookings: transactional reservation, payment, confirmation.
- Reviews: post-appointment, admin moderation (P1).
- Notifications: event-driven.
- Admin/Provider: RBAC portals.

## 6. Mobile Structure
Expo Router groups: (public), (tabs), business/[id], booking, provider, admin. Guest browse allowed; booking redirects to login on 401. React Query handles pagination, mutations. Reanimated for bottom sheets, map pin bounce.

## 7. Infrastructure & CI/CD
Docker Compose for local dev (postgres-postgis, redis, api). GitHub Actions: PR runs lint, typecheck, Jest; main deploys API image and triggers EAS Build. Supabase per environment; secrets in GitHub Environments.

## 8. Testing
Jest across apps/packages. API integration with dockerized PostGIS. Mobile component tests. Shared-types ensure contract safety.

## 9. Security & Scale
JWT, RBAC, HTTPS, secure store. Stateless API scales horizontally; Redis for cache/queues; PostGIS read replicas future.

This architecture delivers all P0/P1 features with clean separation and maintainable monorepo.