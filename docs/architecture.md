# Planity Clone System Architecture

## 1. Overview
Planity Clone is a mobile-first marketplace that connects users with local service providers for booking appointments. The system follows a clean architecture with clear separation between UI, application logic, and infrastructure. An Nx monorepo managed with pnpm hosts the Expo React Native client, a NestJS API server, and shared TypeScript libraries. Data is stored in PostgreSQL with PostGIS for geospatial queries, cached via Redis, and background jobs are handled by BullMQ. CI/CD pipelines run on GitHub Actions, building Docker images, pushing to a registry, and deploying via Docker Compose (or Kubernetes) while Expo Application Services (EAS) builds the mobile binaries. Supabase is used for authentication and file storage during early development, with a migration path to a custom NestJS auth service.

## 2. Technology Stack
- **Mobile**: Expo SDK, React Native, TypeScript, Expo Router, TanStack React Query, React Native Reanimated
- **Web/Admin**: Same stack as mobile (Expo Web) or separate Next.js app (out of scope)
- **Backend**: NestJS (Node.js), TypeScript, Prisma ORM, PostgreSQL + PostGIS, Redis, BullMQ
- **DevOps**: Nx, pnpm, Docker Compose, GitHub Actions, EAS Build, Supabase (auth/storage)
- **Testing**: Jest, React Native Testing Library
- **Design System**: Shared UI component library built with React Native Reanimated and styled with TailwindCSS (or native wind)

## 3. High-Level Architecture
[Mobile Client] <--HTTPS/WS--> [API Gateway (NestJS)] <---> [PostgreSQL/PostGIS]
                               ^                |
                               |                v
                               |            [Redis Cache]
                               |
                               v
                         [BullMQ Job Workers]

- The mobile app communicates exclusively with the NestJS API via REST (or GraphQL) endpoints.
- WebSocket connections (via NestJS Gateway) push real‑time updates (e.g., availability changes, notifications).
- Prisma maps TypeScript entities to PostgreSQL tables; PostGIS extensions enable location‑based queries.
- Redis stores short‑lived data: session tokens, rate‑limit counters, and cached business lists.
- BullMQ processes background jobs such as email/SMS notifications, slot recomputation, and cleanup tasks.
- Supabase provides OAuth email/password magic link authentication and object storage for user‑uploaded media (profile pictures, business logos) during MVP; later replaced by a custom auth module in NestJS.

## 4. Monorepo Structure (Nx + pnpm)
repo-root/
├─ apps/
│   ├─ mobile/          # Expo React Native app
│   └─ api/             # NestJS server
├─ libs/
│   ├─ ui/              # Shared design system (buttons, inputs, theme)
│   ├─ auth/            # Auth helpers (JWT validation, Supabase client)
│   ├─ geo/             # Geospatial utilities (haversine, PostGIS helpers)
│   ├─ query/           # React Query wrappers & API client
│   ├─ types/           # Shared TypeScript interfaces (DTOs, entities)
│   └─ utils/           # Logging, error handling, date helpers
├─ tools/
│   ├─ eslint/          # Shared ESLint config
│   ├─ jest/            # Jest presets
│   └─ typescript/      # TS base configs
├─ docker/
│   └─ compose.yml      # Multi‑service dev environment
├─ .github/
│   └─ workflows/       # CI/CD pipelines
└─ nx.json              # Nx workspace configuration

- pnpm workspaces hoist shared dependencies.
- Nx enables affected‑command caching, linting, and testing across mobile and API.
- Each library is independently versioned and can be consumed by both apps.

## 5. Mobile Application (apps/mobile)
src/
├─ app/                 # Expo Router file‑based routes
│   ├─ (tabs)/          # Bottom tab navigator
│   │   ├─ index.tsx    # Home (guest browse)
│   │   ├─ search.tsx   # Search & map
│   │   ├─ bookings.tsx # My appointments
│   │   ├─ favorites.tsx
│   │   └─ profile.tsx
│   ├─ auth/
│   │   ├─ register.tsx
│   │   ├─ login.tsx
│   │   └─ reset-password.tsx
│   ├─ business/
│   │   ├─ [id]/        # Business detail
│   │   │   ├─ index.tsx
│   │   │   ├─ services.tsx
│   │   │   └─ reviews.tsx
│   │   └─ create.tsx   # (owner portal)
│   ├─ owner/           # Business owner portal (protected)
│   │   ├─ dashboard.tsx
│   │   ├─ availability.tsx
│   │   └─ bookings.tsx
│   └─ admin/           # Admin dashboard (protected, role‑based)
│       ├─ users.tsx
│       ├─ businesses.tsx
│       └─ analytics.tsx
├─ components/          # Reusable UI (from libs/ui)
├─ hooks/               # Custom React hooks (useAuth, useMap, useQuery)
├─ services/
│   ├─ api.ts           # Axios instance with interceptors (auth, error)
│   ├─ socket.ts        # WebSocket wrapper (NestJS Gateway)
│   └─ storage.ts       # AsyncStorage / Expo FileSystem helpers
├─ utils/               # Formatters, constants
├─ assets/              # Images, icons, fonts
└─ main.tsx             # Expo entry point

- State management: React Query for server state; React Context or Zustand for UI state.
- Animations: React Native Reanimated 2 for smooth transitions (e.g., map markers, modal sheets).
- Authentication flow: Supabase client (libs/auth) returns JWT; stored in SecureStore; attached to API requests.
- Offline fallback: Query caching with stale‑while‑revalidate strategy.

## 6. Backend API (apps/api)
src/
├─ main.ts              # NestJS bootstrap
├─ app.module.ts
├─ config/              # Environment validation (config.service.ts)
├─ common/
│   ├─ guards/          # AuthGuard, RolesGuard
│   ├─ interceptors/    # Logging, TransformInterceptor
│   ├─ pipes/           # ValidationPipe (class‑validator)
│   └─ exceptions/
├─ auth/
│   ├─ strategies/      # JWTStrategy (Supabase or custom)
│   ├─ auth.controller.ts
│   └─ auth.service.ts
├─ users/
│   ├─ user.entity.ts
│   ├─ users.controller.ts
│   └─ users.service.ts
├─ businesses/
│   ├─ business.entity.ts (PostGIS Point for location)
│   ├─ business.service.ts
│   ├─ businesses.controller.ts
│   └─ dto/
├─ services/
│   ├─ service.entity.ts
│   ├─ services.controller.ts
│   └─ services.service.ts
├─ bookings/
│   ├─ booking.entity.ts
│   ├─ bookings.controller.ts
│   └─ bookings.service.ts (slot computation logic)
├─ reviews/
│   ├─ review.entity.ts
│   ├─ reviews.controller.ts
│   └─ reviews.service.ts
├─ notifications/
│   ├─ notification.gateway.ts (WebSocket)
│   ├─ notification.service.ts
│   └─ notification.processor.ts (BullMQ)
├─ jobs/
│   ├─ slot-recompute.processor.ts
│   ├─ email-notification.processor.ts
│   └─ cleanup.processor.ts
├─ prisma/
│   └─ schema.prisma
└─ utils/
    ├─ geo.ts           # Haversine, PostGIS helpers
    └─ cache.ts         # Redis wrapper

- Prisma generates TypeScript clients; migrations managed via `prisma migrate dev`.
- Business location stored as `POINT`; queries use `@prisma/client` with raw SQL for radius search.
- Rate limiting via NestJS Throttler backed by Redis.
- BullMQ queues defined in `queues/` module; workers process jobs concurrently.
- WebSocket gateway uses `@nestjs/websockets` with Redis adapter for scaling across instances.

## 7. Shared Libraries (libs)
- **ui**: Exported components (Button, Input, Card, MapView) built with React Native Reanimated + Gesture Handler; styled with `tailwindcss-rn`.
- **auth**: Supabase client initialization, JWT verification helper, SecureStore wrappers.
- **geo**: Functions: `distanceBetween`, `withinRadius`, `bboxFromRadius`, conversion to PostGIS `ST_DWithin`.
- **query**: Custom `useApiQuery` and `useApiMutation` wrappers around React Query that inject auth token and handle error normalization.
- **types**: Exported interfaces for `User`, `Business`, `Service`, `Booking`, `Review`, `Notification`, plus API request/response DTOs.
- **utils**: Logger (pino), date‑format helpers, retry logic, deep‑clone.

## 8. Database & Caching
- **PostgreSQL 15** with **PostGIS 3** extension.
  - Tables: `users`, `businesses`, `services`, `bookings`, `reviews`, `notifications`.
  - Indexes: GIST on `location` column, composite indexes on `(business_id, start_time)` for slot lookup.
- **Redis 7**:
  - Token blacklist (logout), rate‑limit counters, cached business list (TTL 5 min), session stores for WebSocket sticky connections.
- **BullMQ** uses Redis as job store.
- **Supabase** (optional): Auth tables (`users`, `identities`) and storage bucket for assets; can be replaced by custom auth tables.

## 9. Background Jobs (BullMQ)
- **Slot Recomputation**: Triggered on booking creation/cancellation; updates a materialized view or cache of available slots per business per day.
- **Notification Processor**: Sends email/SMS via third‑party (SendGrid, Twilio) and pushes WebSocket notifications.
- **Cleanup Job**: Removes expired temporary tokens, old cache entries.
- Workers run as separate Node processes (`nx run api:workers`) or inside the same NestJS instance with `@nestjs/bullmq`.

## 10. DevOps & CI/CD
- **Local Development**: `docker compose up` starts PostgreSQL, Redis, and NestJS API; Expo dev client runs locally.
- **GitHub Actions Workflow**:
  1. Checkout → Setup pnpm → Install dependencies.
  2. Run lint (`nx lint`) and tests (`nx test`).
  3. Build Docker images for `api` (multi‑stage) and push to GitHub Packages.
  4. Run `eas build --platform all --auto-submit` for Expo (requires EAS credentials).
  5. Deploy API via `docker compose -f prod.yml up -d` on a VPS or Kubernetes cluster.
- **Environment Variables**: Managed via `.env` files; secrets injected via GitHub Secrets.
- **Monitoring**: Prometheus + Grafana (optional) exposed via NestJS `@nestjs/microservices` metrics; logs shipped to Loki or Elasticsearch.

## 11. Service Boundaries
| Boundary | Responsibility | Technologies |
|----------|----------------|--------------|
| **Mobile Client** | UI presentation, user interactions, offline cache, real‑time updates via WS | Expo, React Native, TanStack Query, Reanimated |
| **API Gateway** | Request routing, authentication, validation, rate limiting, WS gateway | NestJS, Passport/JWT, Throttler, WebSocket Adapter |
| **Auth Service** | User registration, login, password reset, token issuance (Supabase or custom) | Supabase Auth / NestJS AuthModule |
| **Business Domain** | CRUD for businesses, services, location search, category filtering | NestJS + Prisma + PostGIS |
| **Booking Domain** | Slot computation, booking lifecycle (create, reschedule, cancel), conflict detection | NestJS Service + BullMQ workers |
| **Review Domain** | Ratings, comments, owner responses | NestJS Service |
| **Notification Domain** | Outbound email/SMS, in‑app push via WS, preference management | BullMQ + NestJS Gateway |
| **Owner Portal** | Business owners manage listing, availability, view bookings | Same API, role‑based guards |
| **Admin Portal** | Platform‑wide user/business moderation, analytics | Same API, admin role guards |
| **Shared Libraries** | Reusable UI, types, utilities, geo helpers | Nx libs, TypeScript |
| **Infrastructure** | Data storage, caching, job queue, CI/CD pipelines | PostgreSQL/PostGIS, Redis, BullMQ, Docker, GitHub Actions, EAS |

## 12. Data Flow Examples
1. **Guest Search**
   - Mobile → `GET /businesses?query=&lat=&lng=&radius=` (API)
   - API validates params, uses PostGIS `ST_DWithin` to fetch nearby businesses.
   - Results cached in Redis for 2 min; returned as JSON.
   - Mobile displays list via React Query; map view uses same data.

2. **User Booking**
   - Mobile → `POST /bookings` with `{businessId, serviceId, startTime}`
   - API AuthGuard verifies JWT.
   - BookingService checks slot availability (reads from cached slot map or computes via stored procedure).
   - If free, creates booking record, publishes `booking.created` event to BullMQ notification queue.
   - Returns booking confirmation; mobile updates UI optimistically.

3. **Real‑Time Availability Update**
   - Upon booking creation, a BullMQ slot‑recompute job updates Redis hash `business:{id}:slots:{date}`.
   - NestJS WebSocket gateway subscribes to Redis channel and pushes updated slots to subscribed clients.
   - Mobile receives WS message, updates React Query cache, UI reflects new availability.

4. **Owner Updates Availability**
   - Owner portal → `PATCH /businesses/{id}/availability`
   - API updates business hours table, triggers slot recompute job.
   - Changes propagate as above.

## 13. Security Considerations
- **Authentication**: JWT with short expiry (15 min) + refresh token stored SecureStore; refresh via `/auth/refresh`.
- **Authorization**: Role‑based guards (USER, OWNER, ADMIN); resource‑level checks (e.g., only owner can modify their business).
- **Data Protection**: TLS everywhere; passwords hashed with bcrypt; PII encrypted at rest via `pgcrypto` if needed.
- **Input Validation**: class‑validator + DTOs; sanitization to prevent SQL injection (Prisma protects).
- **Rate Limiting**: Per‑IP and per‑user limits via Redis-backed Throttler.
- **Secrets Management**: GitHub Secrets for prod; `.env` ignored; Supabase keys rotated regularly.
- **Audit Logs**: Simple `events` table capturing mutative actions for admin review.

## 14. Scalability & Performance
- **Horizontal Scaling**: API stateless; run multiple instances behind a load balancer; WebSocket uses Redis adapter for sticky sessions.
- **Database Read Replicas**: Direct read‑only queries (search, listings) to replicas; writes to primary.
- **Caching**: Redis caches frequent queries (business lists, slot maps) reducing DB load.
- **Job Processing**: BullMQ workers can be scaled horizontally; prioritize notification jobs.
- **Mobile**: Expo OTA updates allow JS bundle patches without store review; assets bundled via EAS.
- **Database Indexes**: GIST on location; composite indexes on time ranges for slot lookups.
- **Query Optimization**: Prisma generates efficient SQL; use `select` and `include` only needed fields.

## 15. Open Questions & Future Work
- **Payments**: Integrate Stripe Connect for provider payouts; webhook handling.
- **Push Notifications**: Move from WS to Firebase/APNs for background alerts.
- **Analytics**: Event tracking (e.g., Mixpanel, Amplitude) for funnel optimization.
- **Internationalization**: Add i18n support (react‑i18next) for multiple languages.
- **Offline First**: Enhance local caching with MMKV or SQLite for intermittent connectivity.
- **Multi‑tenancy**: Consider schema‑per‑provider or row‑level security for SaaS scaling.

---
*This document captures the core architectural decisions for the Planity Clone MVP. Adjustments may arise as features evolve and performance testing informs scaling strategies.*