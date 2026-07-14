# Architecture Document

## 1. Project Overview
The Planity Clone is a mobile-first platform that connects users with local service businesses for discovery, booking, and management. The system follows a clean architecture with clear separation between the mobile client, API gateway, business logic, and data layers.

## 2. Tech Stack
- Mobile: Expo (SDK 49), React Native, TypeScript, Expo Router, TanStack React Query, React Native Reanimated
- API: NestJS (Node.js), Prisma ORM, PostgreSQL with PostGIS extension, Redis for caching and pub/sub, BullMQ for background jobs
- DevOps: Nx monorepo, pnpm workspace, Docker Compose for local dev, GitHub Actions for CI, EAS Build for OTA updates, Supabase for optional auth/storage fallback

## 3. High-Level Architecture
The solution is split into three main zones:
1. **Client Zone** – Expo app running on iOS/Android, communicates via HTTPS/WebSocket to the API.
2. **API Zone** – NestJS application exposing REST and GraphQL endpoints, handling authentication, business logic, validation, and orchestrating workers.
3. **Data Zone** – PostgreSQL/PostGIS stores core entities; Redis caches frequent queries and provides job queue backbone; optional Supabase storage for assets.

All zones reside in an Nx workspace enabling code sharing (types, validation schemas, utility functions).

## 4. Mobile App (Expo) Structure
apps/mobile/
- src/
  - app/ (Expo Router file-based routes)
    - (tabs)/
      - home.tsx
      - explore.tsx
      - map.tsx
      - bookings.tsx
      - profile.tsx
    - login.tsx
    - register.tsx
    - business/[id]/tx
      - detail.tsx
      - services.tsx
      - reviews.tsx
    - favorites.tsx
    - settings.tsx
  - components/
    - ui/ (shared reusable UI: Button, Input, Card, Avatar)
    - layout/ (Header, TabBar, Modal)
    - business/ (BusinessCard, ServiceList)
    - booking/ (SlotPicker, Confirmation)
  - hooks/
    - useAuth.ts
    - useBooking.ts
    - useMap.ts
    - useQueryWrapper.ts (wrapper around React Query)
  - services/
    - api.ts (axios instance with interceptors for auth/refresh)
    - ws.ts (WebSocket wrapper for real‑time updates)
    - storage.ts (AsyncSecureStore helpers)
  - types/
    - generated/ (Prisma-generated TS types via nx plugin)
    - domain.ts (UI‑specific view models)
  - constants/
    - endpoints.ts
    - queryKeys.ts
  - utils/
    - geolocation.ts
    - dateHelpers.ts
  - assets/
    - images/
    - icons/
  - tests/
    - unit/
    - integration/
- expo.config.ts
- tailwind.config.js (if using NativeWind)
- tsconfig.json

## 5. Backend (NestJS) Structure
apps/api/
- src/
  - main.ts
  - app.module.ts
  - config/
    - database.config.ts
    - redis.config.ts
    - auth.config.ts
  - common/
    - guards/
      - jwt.guard.ts
      - roles.guard.ts
    - interceptors/
      - logging.interceptor.ts
      - transform.interceptor.ts
    - pipes/
      - validation.pipe.ts
    - exceptions/
      - http.exception.filter.ts
  - modules/
    - auth/
      - auth.controller.ts
      - auth.service.ts
      - jwt.strategy.ts
    - users/
      - users.controller.ts
      - users.service.ts
      - users.schema.ts (Prisma)
    - businesses/
      - businesses.controller.ts
      - businesses.service.ts
      - businesses.schema.ts
    - services/
      - services.controller.ts
      - services.service.ts
      - services.schema.ts
    - bookings/
      - bookings.controller.ts
      - bookings.service.ts
      - bookings.schema.ts
    - reviews/
      - reviews.controller.ts
      - reviews.service.ts
      - reviews.schema.ts
    - notifications/
      - notifications.gateway.ts (WebSocket)
      - notifications.service.ts
    - admin/
      - admin.controller.ts
      - admin.service.ts
    - provider/
      - provider.controller.ts
      - provider.service.ts
  - prisma/
    - schema.prisma (defines models, indexes, PostGIS extensions)
    - seed.ts
  - jobs/
    - bookingProcessor.ts (BullMQ worker)
    - notificationProcessor.ts
    - availabilityUpdater.ts
  - utils/
    - geospatial.ts (PostGIS helpers)
    - slotCalculator.ts
  - tests/
    - unit/
    - e2e/
- dockerfile
- tsconfig.json

## 6. Shared Libraries (Nx)
libs/
- shared/
  - types/
    - src/
      - index.ts (re‑exports Prisma-generated types)
      - dto.ts (common data transfer objects used by both client and server via codegen)
      - enums.ts
  - utils/
    - src/
      - validation.ts (class‑validator schemas)
      - formatting.ts
      - constants.ts
  - ui/
    - src/
      - tokens.ts (design token definitions)
      - theme.ts (NativeWind theme)
      - components/ (library of presentational components used in mobile)
- api/
  - src/
    - interceptors.ts (shared NestJS interceptors)
    - pipes.ts
- mobile/
  - src/
    - hooks.ts (custom React hooks reusable across screens)
    - navigation.ts (Expo Router helpers)

## 7. Database Schema (Prisma + PostGIS)
Prisma schema defines:
- User (id, email, passwordHash, role, createdAt, updatedAt)
- Business (id, name, description, address, location: Point, phone, categoryId, ownerId, createdAt, updatedAt)
- Category (id, name, icon)
- Service (id, businessId, name, duration, price, createdAt, updatedAt)
- Booking (id, userId, serviceId, startTime, endTime, status, createdAt, updatedAt)
- Review (id, businessId, userId, rating, comment, createdAt)
- Favorite (id, userId, businessId, createdAt)
- ProviderProfile (id, userId, businessId, bio, etc)
- AdminAuditLog (id, adminId, action, entityType, entityId, timestamp)

Indexes: GIST index on Business.location for proximity queries; composite indexes on (serviceId, startTime) for slot lookup.

## 8. Caching & Pub/Sub (Redis)
- LRU cache for business list queries (TTL 5 min) using redis‑ts client.
- Pub/sub channels: `booking:updated`, `availability:changed` to push real‑time updates to connected clients via NestJS Gateway.
- BullMQ uses Redis for job queues: `booking-queue`, `notification-queue`, `availability-queue`.

## 9. Real‑time Updates
NestJS WebSocket Gateway (`NotificationsGateway`) maintains socket per authenticated user. Events:
- `booking-confirmed` (payload: booking)
- `slot-updated` (payload: {serviceId, slots})
- `notification` (payload: message)
Clients subscribe via the `ws.ts` service and update React Query cache optimistically.

## 10. Background Jobs (BullMQ)
- BookingProcessor: when a booking is created/cancelled, recompute affected service slots and publish `availability:changed`.
- NotificationProcessor: send push notifications (via Expo push tool) and emails.
- AvailabilityUpdater: nightly job to refresh cached slot calculations for high‑traffic services.

## 11. CI/CD (GitHub Actions, EAS Build, Docker Compose)
- `.github/workflows/ci.yml`:
  - Install pnpm, run nx lint, nx test, nx build (api & mobile).
  - Run prisma migrate deploy against test PostgreSQL.
  - Push Docker images to registry on success.
- `.github/workflows/cd.yml`:
  - On tag push: trigger EAS Build for iOS/Android, upload to stores.
  - Deploy API stack via Docker Compose on staging/prod servers (or Kubernetes).
- Local dev: `docker compose up` brings up PostgreSQL, Redis, API (hot reload), and Expo dev client.

## 12. Deployment & Environments
- Environments: dev, staging, prod.
- Config via NestJS ConfigService reading from `.env` files; secrets managed by GitHub Secrets / AWS Parameter Store.
- Database migrations handled by Prisma Migrate; seed script for initial categories and admin user.
- OTA updates: Expo EAS Update for JS bundle; native binaries versioned via store releases.

## 13. Service Boundaries & Responsibilities
| Zone | Responsibility |
|------|----------------|
| Mobile | UI presentation, user interaction, optimistic updates, offline caching, push notification handling, deep linking, auth token storage. |
| API Gateway (NestJS) | Request validation, auth (JWT + RBAC), business logic orchestration, transaction management, exposing REST/GraphQL, WebSocket gateway, job dispatch. |
| Business Logic (services) | Domain rules: slot calculation, availability, pricing, review aggregation, provider portal restrictions. |
| Data Access (Prisma) | CRUD operations, complex spatial queries, transactions. |
| Caching Layer (Redis) | Read‑through cache for lists, pub/sub for real‑time, job queue backing. |
| Background Workers (BullMQ) | Heavy computation, external notifications, batch updates. |
| Infrastructure (Docker, CI/CD) | Containerization, orchestration, testing, deployment, monitoring. |

## 14. Data Flow Examples
1. **Guest Browse**: Mobile sends GET `/businesses?near=lat,lng&radius=5km` → API checks Redis cache, if miss runs PostGIS query, caches result, returns list. UI displays via React Query.
2. **Booking Flow**: User selects slot → Mobile POST `/bookings` with serviceId & startTime → API validates auth, checks slot availability via transaction, creates Booking, triggers BookingProcessor job, updates Redis cache, emits WebSocket `slot-updated` and push notification.
3. **Provider Portal**: Provider logs in → API verifies role, returns provider‑specific endpoints (e.g., `GET /provider/bookings`) → Mobile shows list, allows reschedule via PATCH `/bookings/:id`.

## 15. Security Considerations
- Passwords hashed with bcrypt (salt 12).
- JWT access token 15 min, refresh token 7 days stored HTTP‑only cookie (or SecureStore).
- Role-based access control (USER, PROVIDER, ADMIN).
- Input validation using class‑validator & DTOs.
- Rate limiting via NestJS Throttler.
- CORS restricted to allowed origins.
- HTTPS enforced; API behind TLS termination.
- Regular dependency audits (`npm audit`, `pnpm audit`).

## 16. Testing Strategy
- Unit tests: Jest for services, utilities, React components (with React Native Testing Library).
- Integration tests: Supertest for API endpoints; React Native Testing Library with Jest for navigation flows.
- E2E tests: Detox for critical user journeys (login → search → book).
- Test coverage target >80% for backend, >70% for frontend.
- CI runs lint, type‑check (`nx typecheck`), and test suites on each PR.

## 17. Monitoring & Logging
- Winston logger with JSON format, routed to Elasticsearch or Loki.
- Request ID middleware for traceability.
- Prometheus metrics exposed via `@nestjs/prometheus` (request latency, error rates).
- Health check endpoint `/health`.
- Expo `expo-dev-client` logs; production errors sent to Sentry.
- Redis monitoring via `redis-cli info`.

## 18. Future Extensions
- GraphQL federation for micro‑service split.
- Push notifications via Firebase Cloud Messaging / Expo push.
- Multi‑currency & tax calculation.
- AI‑based recommendation service.
- Offline-first mode with Expo SQLite.

---
*This document provides a concise yet complete blueprint for building the Planity Clone with the specified stack, ensuring scalability, maintainability, and clear separation of concerns.*