# Planity Clone System Architecture

## Overview
The Planity Clone is a mobile‑first full stack application that connects users with local service businesses. It consists of an Expo/React Native client, a NestJS API server, and supporting services (PostgreSQL/PostGIS, Redis, BullMQ workers). The architecture follows clean layered principles: presentation, domain, application, and infrastructure, with clear separation between client, server, and background workers.

## Tech Stack
- Mobile: Expo SDK 49, React Native, TypeScript, Expo Router, TanStack React Query, React Native Reanimated
- Server: NestJS, TypeScript, Prisma ORM, PostgreSQL + PostGIS extension, Redis, BullMQ
- Tooling: Nx monorepo, pnpm workspace, Docker Compose for local dev, GitHub Actions CI/CD, EAS Build for OTA updates, Supabase (optional auth/storage fallback), Jest for testing
- Design System: Shared UI library built with React Native Reanimated and a Tailwind‑like utility set

## High Level Architecture
[Mobile Client] <-- HTTPS --> [API Gateway (NestJS)] <---> [PostgreSQL/PostGIS]
                                 |                ^
                                 |                |
                                 v                |
                              [Redis Cache]   [BullMQ Workers]
                                 |                |
                                 +------> [External Services (Payment, SMS, Email)]

## Service Boundaries
1. Auth Service – registration, login, password reset, social OAuth, JWT issuance
2. Business Service – CRUD for businesses, categories, services, geo‑indexed search, availability slots
3. Booking Service – appointment creation, validation, conflict detection, rescheduling, cancellation
4. Catalog Service – service definitions, pricing, duration
5. Review Service – CRUD for reviews, rating aggregation
6. Favorites Service – user‑business many‑to‑many relation
7. Notification Service – template rendering, dispatch via email/SMS/push, preference management
8. Payment Service – integration with payment gateway (Stripe/PayPal), webhook handling, transaction records
9. Admin Service – user/business moderation, analytics, system settings
10. Worker Service – BullMQ processors for async jobs: sending notifications, updating availability caches, cleaning expired slots, generating reports
11. Gateway / API Facade – NestJS modules exposing controllers, DTOs, validation pipes, orchestrating calls to the services

Each service is a NestJS module with its own DTOs, entities (via Prisma), repositories and business logic kept in a service class. Shared types (User, Business, Appointment, etc.) live in a @planity/shared library.

## Folder Structure (Nx Monorepo)
planity-clone/
├─ apps/
│   ├─ mobile/                 # Expo React Native app
│   │   ├─ src/
│   │   │   ├─ assets/
│   │   │   ├─ components/
│   │   │   ├─ screens/
│   │   │   ├─ navigation/
│   │   │   ├─ hooks/
│   │   │   ├─ store/
│   │   │   ├─ utils/
│   │   │   ├─ types/
│   │   │   └─ App.tsx
│   │   ├─ app.json
│   │   ├─ eas.json
│   │   └─ tsconfig.json
│   └─ api/                    # NestJS server
│       ├─ src/
│       │   ├─ shared/
│       │   ├─ modules/
│       │   │   ├─ auth/
│       │   │   ├─ business/
│       │   │   ├─ booking/
│       │   │   ├─ catalog/
│       │   │   ├─ review/
│       │   │   ├─ favorites/
│       │   │   ├─ notification/
│       │   │   ├─ payment/
│       │   │   ├─ admin/
│       │   └─ worker/
│       │   ├─ prisma/
│       │   ├─ middleware/
│       │   ├─ guards/
│       │   ├─ interceptors/
│       │   ├─ app.module.ts
│       │   └─ main.ts
│       ├─ test/
│       │   ├─ unit/
│       │   └─ e2e/
│       ├─ dockerfile
│       ├─ tsconfig.json
│   ├─ libs/
│   │   ├─ shared/
│   │   │   ├─ src/
│   │   │   │   ├─ dto/
│   │   │   │   ├─ entities/
│   │   │   │   ├─ constants/
│   │   │   │   └─ utils/
│   │   │   ├─ tsconfig.json
│   │   │   └─ package.json
│   │   ├─ ui/
│   │   │   └─ ...
│   │   └─ config/
├─ prisma/
│   ├─ schema.prisma
│   └─ migrations/
├─ docker-compose.yml
├─ nx.json
├─ package.json
└─ .github/
    └─ workflows/
        ├─ ci.yml
        └─ cd.yml

## Data Model (Prisma)
- User (id, email, passwordHash, role, createdAt, updatedAt)
- Business (id, name, description, address, lat, lng, phone, website, createdAt, updatedAt)
- BusinessCategory (many‑to‑many)
- Service (id, businessId, name, description, price, duration, bufferTime)
- Appointment (id, userId, businessId, serviceId, startTime, endTime, status, createdAt, updatedAt)
- Review (id, userId, businessId, rating, comment, createdAt)
- Favorite (id, userId, businessId)
- Notification (id, userId, type, payload, sentAt, readAt)
- PaymentTransaction (id, appointmentId, gateway, amount, currency, status, transactionId, createdAt)

PostGIS: lat and lng stored as a Point field for geo queries.

## API Design (REST)
- Auth: POST /auth/register, POST /auth/login, POST /auth/refresh, POST /auth/reset-request, POST /auth/reset-confirm
- Business: GET /businesses (search, filter, geo), GET /businesses/:id, POST /businesses (protected), PUT/PATCH /businesses/:id, DELETE /businesses/:id
- Service: GET /services?businessId=:id, POST /services (protected)
- Booking: GET /appointments (my), POST /appointments, PATCH /appointments/:id (reschedule/cancel), DELETE /appointments/:id
- Review: GET /reviews?businessId=:id, POST /reviews
- Favorite: GET /favorites, POST /favorites, DELETE /favorites/:businessId
- Notification: GET /notifications, PATCH /notifications/:id (read)
- Payment: POST /payment-intent, POST /webhook/:gateway
- Admin: GET /admin/users, GET /admin/businesses, etc. (role‑guarded)

All endpoints return JSON with { data, error? }. Validation via NestJS Pipes (class‑validator). Rate limiting via Redis.

## Mobile Client Architecture
- Expo Router provides file‑based navigation; each screen corresponds to a route under src/screens/.
- React Query handles server state: queries for businesses, appointments, mutations for writes.
- Reanimated 2 used for animated transitions, gesture‑based filters, and map interactions (via react‑native‑maps + Reanimated worklets).
- Shared UI Library (libs/ui) provides themed components (Button, Input, Card, Modal) built with Reanimated for smooth 60fps.
- State Management: Minimal local UI state (React useState/useReducer); global cache via React Query; optional Zustand for non‑server UI (e.g., modal stacks).
- Authentication Flow: AsyncStorage stores JWT; Axios instance with interceptors attaches token and handles 401 → refresh token flow.
- Offline Support: React Query’s stale‑while‑revalidate caches data; background sync via expo-background-fetch (future).
- Testing: Jest + React Native Testing Library for unit/component tests; E2E with Detox (optional).

## Background Jobs (BullMQ)
- Queues: notification, availability-update, payment-reconciliation, cleanup.
- Workers reside in the same NestJS process (or separate worker containers) and listen to queues.
- Jobs are typed using shared DTOs to ensure consistency.
- Failed jobs retry with exponential backoff; dead‑letter queue for manual inspection.

## DevOps & CI/CD
- Local Dev: docker compose up spins up PostgreSQL (with PostGIS), Redis, NestJS API, and optionally runs Expo dev client.
- CI: GitHub Actions runs lint, unit tests (Jest), builds Docker image, pushes to registry.
- CD: On merge to main, triggers EAS Build for iOS/Android OTA; Docker image deployed to Kubernetes/EKS (or simple VM) with rolling update.
- Environment Variables: Managed via .env files; secrets stored in GitHub Secrets / AWS Parameter Store.
- Monitoring: Prometheus + Grafana for API metrics; Loki for logs; Sentry for error tracking; Expo’s built‑in analytics for mobile.
- Health Checks: /health endpoint returns DB, Redis, queue status.

## Security Considerations
- JWT (HS256) with short-lived access token (15 min) and refresh token stored HTTP‑only cookie (if using cookies) or Secure AsyncStorage.
- Passwords hashed with bcrypt (salt 12).
- Rate limiting per IP via Redis.
- Input validation and sanitization (class‑validator, Prisma prevents SQL injection).
- CORS restricted to allowed origins (expo dev, production domains).
- HTTPS enforced; TLS termination at load balancer.
- Payment data never touches our servers; only webhook verification.
- GDPR‑style data export/delete endpoints in admin service.

## Monitoring & Observability
- API: Request latency, error rates, throughput (Prometheus).
- DB: Query performance, connection pool usage (PostgreSQL stats).
- Redis: Hit/miss ratio, memory usage.
- Workers: Job processing time, queue depth.
- Mobile: Crash reports (Sentry), session length, screen flow (Expo Firebase/Analytics).
- Logging: Structured JSON logs (winston) with request ID correlation.

## Future Extensions
- GraphQL endpoint for flexible data fetching.
- Multi‑language (i18n) support using react‑i18next.
- Push notifications via Expo Push Notification Service.
- Advanced analytics dashboard (Mixpanel/Amplitude).
- Machine‑learning based recommendation engine for businesses.
- Offline‑first mode with Expo SQLite + React Query persistence.

This architecture provides a clear separation of concerns, scalability through modular services, and a maintainable codebase leveraging the chosen stack.
