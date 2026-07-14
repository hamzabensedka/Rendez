# Planity Clone System Architecture

## 1. Overview
Planity Clone is a mobile-first appointment booking platform connecting users with local service businesses. The system consists of a React Native expo app, a NestJS API server, background workers, an admin portal, and shared libraries. Data is stored in PostgreSQL with PostGIS for geo‑queries, cached in Redis, and orchestrated via Docker Compose. The monorepo is managed with Nx and pnpm, with CI/CD through GitHub Actions, EAS Build for mobile, and Supabase for optional auth/storage.

## 2. High‑Level Components
- **Mobile Client** (`apps/mobile`): Expo + React Native + TypeScript, Expo Router, TanStack React Query, React Native Reanimated, UI kit.
- **API Gateway** (`apps/api`): NestJS REST/GraphQL hybrid, Prisma ORM, JWT auth, role‑based access, WebSocket via Socket.io for real‑time notifications.
- **Worker Service** (`apps/worker`): BullMQ backed by Redis, processes emails, SMS, payment webhooks, slot recomputation.
- **Admin Portal** (`apps/admin`): Next.js (or Expo web) internal dashboard for admins, uses same API.
- **Business Portal** (`apps/business`): Separate Expo/web app for owners to manage listings, schedules, bookings.
- **Shared Libraries** (`libs`): UI components, design system, shared Typescript types, validation schemas, API clients, utils.
- **Infrastructure** (`infra`): Docker Compose, Kubernetes manifests, Terraform (optional), Supabase config.

## 3. Service Boundaries & Responsibilities
| Service | Responsibility |
|---------|----------------|
| Mobile | Presentation, offline caching, push notifications, deep linking, Reanimated gestures. |
| API | Business logic, validation, transactional boundaries, Prisma models, PostGIS queries, rate limiting, auth. |
| Worker | Async jobs: booking confirmations, reminders, payment reconciliation, cache warming, analytics aggregation. |
| Business Portal | Owner‑facing CRUD for business profile, services, staff schedules, booking management, payouts. |
| Admin Portal | User/business moderation, analytics, system config, feature flags. |
| Shared | Design system, reusable hooks, query keys, constants, i18n, logging. |
| Infra | Container orchestration, env vars, secrets, DB migrations, backup strategy. |

## 4. Data Model (Prisma Schema Highlights)
- **User**: id, email, passwordHash, role (USER|BUSINESS|ADMIN), createdAt, profile (name, phone, avatar).
- **Business**: id, ownerId, name, description, address, lat/lng (PostGIS Point), categoryId, phone, website, images, isVerified.
- **Category**: id, name, slug, icon.
- **Service**: id, businessId, name, description, duration, price, bufferTime.
- **Staff**: id, businessId, name, email, specialty.
- **Schedule**: id, staffId, weekday, startTime, endTime, isActive.
- **Booking**: id, userId, businessId, serviceId, staffId, startTime, endTime, status (PENDING|CONFIRMED|CANCELLED|COMPLETED), paymentId, createdAt.
- **Payment**: id, bookingId, amount, currency, provider, status, transactionId.
- **Review**: id, bookingId, userId, rating, comment, createdAt.
- **Favorite**: id, userId, businessId.
- **Notification**: id, recipientId, type, payload, readAt, createdAt.

Indexes: spatial index on Business.location, composite indexes on Booking(userId,status), Booking(businessId,startTime).

## 5. API Design
- **REST** for CRUD operations (`/api/users`, `/api/businesses`, `/api/bookings`).
- **GraphQL** (optional) for complex queries with nested data (business + services + reviews).
- **Auth**: JWT access token (15 min) + refresh token (7 days) stored in SecureStore; social login via OAuth2 (Google, Apple).
- **Versioning**: URL prefix `/v1`.
- **Error Handling**: centralized exception filter, consistent JSON error shape.
- **Rate Limiting**: per‑IP and per‑user via NestJS Throttler.
- **WebSocket**: Socket.io namespace `/notifications` for real‑time updates (booking status, new messages).

## 6. State Management & Data Fetching
- **TanStack React Query** handles server state: query keys reflect resource IDs, automatic refetch on focus, optimistic updates for booking creation.
- **React Native Reanimated** used for animated transitions (modal bottom sheets, map interactions, swipe‑to‑cancel).
- **Expo Router** provides file‑based routing with deep linking support; screens map to `apps/mobile/app/(tabs)/...`.
- **Local Storage**: AsyncStorage for non‑critical prefs; MMKV for high‑performance storage if needed.

## 7. Design System & Shared Types
- Located in `libs/ui` (React Native primitives styled with Tailwind‑like `twrnc` or `styled-components`).
- `libs/types` contains generated Prisma types (`prisma/generate`) and Zod schemas for validation.
- `libs/api-client` wraps `axios` or `react-query` with auth interceptor.
- `libs/i18n` uses `expo-localization` + `i18next`.

## 8. Background Jobs (BullMQ)
- Queues: `email`, `sms`, `payment`, `slot-recalc`, `analytics`.
- Workers concurrency configurable; processed in `apps/worker/src/processors`.
- Failed jobs moved to dead‑letter queue with alerting via Sentry.
- Results cached in Redis for quick retrieval (e.g., computed available slots).

## 9. Admin & Business Portals
- Built as separate Expo web apps (`apps/admin`, `apps/business`) sharing UI libs.
- Auth guarded by same API; role‑based route guards.
- Features: CRUD, calendar view (using `react-native-calendars` or `fullcalendar`), export CSV, payouts integration.

## 10. DevOps & CI/CD
- **Repository**: monorepo root with `nx.json`, `package.json` (pnpm workspace).
- **Docker Compose**: defines `api`, `worker`, `redis`, `postgres`, `admin`, `business` (web) services; mobile built via EAS.
- **GitHub Actions**:
  - Lint & typecheck on PR.
  - Run Jest unit & integration tests.
  - Build Docker images, push to registry.
  - Deploy to staging via Docker‑Compose on a VM or Kubernetes.
  - EAS Build for iOS/Android on tag push.
- **Supabase** (optional): used for auth storage & file uploads (avatars, business images) via its S3‑compatible storage; fallback to local storage if not used.
- **Monitoring**: Loki/Prometheus/Grafana via Docker; Sentry for error tracking; Redis CLI for queue depth.

## 11. Testing Strategy
- **Unit**: Jest for services, utilities, Prisma mocks.
- **Integration**: SuperTest for API endpoints; React Native Testing Library for UI components; worker job processing with bullmq mocked.
- **E2E**: Detox for mobile critical flows (login, search, booking); Cypress for admin/business portals.
- **Test Coverage**: target >80% for backend, >70% for mobile.

## 12. Security Considerations
- HTTPS everywhere; HSTS.
- Password hashing with bcrypt.
- JWT stored in SecureStore; refresh token rotation.
- Input validation via Zod; Prisma prevents SQL injection.
- Rate limiting, brute‑force protection on auth endpoints.
- CSP headers for web portals.
- File upload validation (type, size) via Supabase storage rules.
- GDPR: data export/delete endpoints.

## 13. Deployment Environments
- **Local**: `docker compose up --build`.
- **Staging**: identical compose with separate DB schema; automated via GH Actions on `staging` branch.
- **Production**: managed Kubernetes (or Docker‑Swarm) with Helm charts; blue‑green deployments; DB migrations via Prisma migrate deploy.
- **Mobile**: EAS Build with over‑the‑air (OTA) updates via Expo Update; binary updates via App Store/Play Store.

## 14. Summary Diagram (textual)
[Mobile] <--HTTPS/WSS--> [API Gateway] <---> [PostgreSQL+PostGIS]
                               ^          |
                               |          v
                               |      [Redis] <---> [Worker (BullMQ)]
                               |
                               v
                        [Admin Portal]   [Business Portal]
                               ^          ^
                               |          |
                               +--- Shared Libs (UI, Types, API client)

---
*This architecture provides clear separation of concerns, scalability through micro‑service‑style workers, and a maintainable monorepo layout leveraging Nx and pnpm. It satisfies all functional requirements while enabling rapid iteration via Expo OTA and CI/CD pipelines.*