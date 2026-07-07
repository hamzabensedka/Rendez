# Planity Clone - System Architecture

## 1. Overview
This document defines the complete system architecture for Planity Clone, a mobile-first beauty & wellness booking platform. The design follows clean architecture, strict separation of concerns, and monorepo-based development to ensure maintainability at scale.

## 2. Technology Stack
- Mobile: Expo, React Native, TypeScript, Expo Router, TanStack React Query, React Native Reanimated
- Backend: NestJS, Prisma, PostgreSQL, PostGIS, Redis (BullMQ)
- Tooling: Nx, pnpm, Docker Compose, GitHub Actions, EAS Build, Supabase, Jest

## 3. Monorepo Structure (Nx + pnpm)
The workspace is organized as follows:

planity-clone/
├── apps/
│   ├── mobile/                 # Expo React Native app
│   ├── api/                    # NestJS backend
│   ├── admin-web/              # (P1) Admin dashboard web app
│   └── provider-web/           # (P1) Business owner portal
├── libs/
│   ├── shared-types/           # Common TS interfaces/DTOs
│   ├── ui/                     # Cross-platform design system (RN + web)
│   ├── config/                 # Shared env/config schemas
│   └── utils/                  # Helpers (date, geo, format)
├── docker/
│   └── docker-compose.yml      # Postgres, Redis, API
├── .github/
│   └── workflows/              # CI pipelines
├── tools/                      # Custom scripts
├── package.json
├── pnpm-workspace.yaml
├── nx.json
└── tsconfig.base.json

## 4. Mobile App Architecture (apps/mobile)
File-based routing via Expo Router under `app/`. Feature-first folders:

apps/mobile/
├── app/                        # Routes (index, (tabs), business/[id], book, profile)
├── components/                 # Shared UI components
├── features/
│   ├── auth/
│   ├── explore/
│   ├── search/
│   ├── map/                    # P1
│   ├── booking/
│   ├── appointments/
│   ├── favorites/              # P1
│   ├── profile/                # P1
│   └── reviews/                # P1
├── hooks/                      # TanStack Query hooks (useBusiness, useBook)
├── api/                        # API client (axios/fetch wrapper)
├── store/                      # Local state (Zustand/Context)
├── animations/                 # Reanimated definitions
└── config/

State management: TanStack React Query for server cache; React Native Reanimated for transitions (bottom sheets, tab animations). Guest browse allowed; auth gate redirects to login.

## 5. Backend Architecture (apps/api)
NestJS modular monolith with clear module boundaries:

apps/api/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── common/                 # Guards, decorators, pipes, exceptions
│   ├── modules/
│   │   ├── auth/               # JWT, social, bcrypt
│   │   ├── users/              # Profile, preferences
│   │   ├── businesses/         # CRUD, photos, staff
│   │   ├── categories/         # Hierarchical categories
│   │   ├── services/           # Service offerings
│   │   ├── search/             # Text + PostGIS geo queries
│   │   ├── availability/       # Slot computation engine
│   │   ├── booking/            # Appointment lifecycle
│   │   ├── payments/           # Stripe/PayPal integration
│   │   ├── reviews/            # Ratings, provider responses
│   │   ├── notifications/      # Push/email dispatch
│   │   ├── favorites/          # Saved businesses/services
│   │   ├── admin/              # Platform management
│   │   ├── provider/           # Owner portal APIs
│   │   └── jobs/               # BullMQ producers/consumers
│   ├── prisma/                 # PrismaService, migrations
│   └── redis/                  # RedisService, BullMQ setup
└── test/

Each module exposes controllers (HTTP), services (business logic), and repositories (Prisma). DTOs validated with class-validator.

## 6. Data Layer
- PostgreSQL with PostGIS extension for spatial queries (business location, distance filters).
- Prisma ORM with schema defining models: User, Business, Staff, Service, Category, Appointment, Review, Payment, Favorite, Notification, Job.
- Redis used for:
  - Cache of computed slots and search results (TTL).
  - BullMQ queue storage for background jobs.
  - Session blacklist if needed.

## 7. Service Boundaries
- Auth: Issues JWT, handles social login, password hashing. No business logic.
- Users: Manages profile, payment methods (tokenized), notification settings.
- Businesses/Services/Categories: CRUD for directory; owned by Provider module.
- Search: Aggregates filters (text, category, price, rating, geo) using PostGIS; read-only.
- Availability: Pure function engine computing slots from business hours, staff shifts, duration, existing bookings; timezone aware. Triggered on changes via Jobs.
- Booking: Orchestrates availability + payment; creates appointment with pending status; emits events.
- Payments: Integrates Stripe; webhook handler updates appointment status; refunds.
- Notifications: Consumes events to send push (FCM/APNs) and email; respects opt-outs.
- Reviews: Restricted to completed appointments; updates aggregate rating.
- Favorites: Lightweight read/write to user lists.
- Admin/Provider: Separate bounded contexts for management UIs; reuse core modules.
- Jobs: Background processing (reminders, slot cache warming, analytics). Decoupled via BullMQ.

## 8. Background Jobs (BullMQ + Redis)
Queues:
- `reminders`: Daily scan for appointments T-24h, enqueue notification.
- `slot-cache`: Recompute and cache slots when availability or booking changes.
- `analytics`: Aggregate metrics for admin/provider.
- `webhooks`: Retry failed payment/webhook events.
Each job has retry with exponential backoff; dashboard via Bull Board.

## 9. Infrastructure & CI/CD
- Docker Compose: Local services for postgres (with postgis), redis, api.
- Supabase: Managed Postgres + Storage for images; migrate via Prisma.
- GitHub Actions: On PR, run `pnpm lint`, `pnpm test` (Jest), `nx build api`, `nx build mobile`. On merge, deploy API (Docker) and trigger EAS Build for mobile.
- EAS Build: Produce iOS/Android binaries; submit to stores.
- Jest: Unit tests for modules, hooks, utils; coverage threshold.

## 10. Security & Performance
- JWT auth, bcrypt hashing, HTTPS only.
- Prisma prevents SQL injection.
- PostGIS spatial indexes for fast geo queries.
- Redis caching reduces DB load for hot searches.
- Rate limiting on auth and search.

## 11. Summary
The architecture separates client, API domains, and infrastructure cleanly within an Nx monorepo, enabling independent scaling and clear ownership for the Planity Clone platform.