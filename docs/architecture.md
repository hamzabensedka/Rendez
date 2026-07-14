# Planity Clone System Architecture

## Overview
The Planity Clone is a mobile-first application that connects users with local service businesses for discovery, booking, and management of appointments. The architecture follows a clean, layered approach with a React Native Expo frontend, a NestJS backend API, and shared libraries managed via Nx monorepo. Data persistence uses PostgreSQL with PostGIS for geospatial queries, Redis for caching and pub/sub, and BullMQ for background jobs. Authentication is handled via JWT with optional social login. Payments are processed through a third‑party gateway (e.g., Stripe). The app leverages Expo Router for file‑based navigation, TanStack React Query for server state, and React Native Reanimated for smooth animations. CI/CD is orchestrated with GitHub Actions, Docker Compose for local dev, and EAS Build for OTA updates.

## Technology Stack
- **Frontend**: Expo (SDK 49), React Native, TypeScript, Expo Router, TanStack React Query, React Native Reanimated, React Native SVG, AsyncStorage, Expo SecureStore.
- **Backend**: NestJS (Node.js), TypeScript, Prisma ORM, PostgreSQL + PostGIS extension, Redis, BullMQ, JWT, Passport (social strategies), Stripe SDK.
- **Monorepo**: Nx, pnpm workspace.
- **DevOps**: Docker Compose, GitHub Actions, EAS Build, Supabase (optional for auth/storage fallback), Jest, ESLint, Prettier.
- **Design System**: Shared UI library built with React Native Reanimated and styled‑components/native.

## High-Level Architecture
[Mobile App] <--HTTPS/WSS--> [API Gateway (NestJS)] <---> [PostgreSQL/PostGIS]
                                   |-> [Redis Cache/PubSub]
                                   |-> [BullMQ Workers]
                                   |-> [External Services (Stripe, Email/SMS)]
The mobile app communicates exclusively with the NestJS API via REST (WebSocket used for real‑time notifications). The API layer enforces authentication, authorization, validation, and business logic. Prisma maps to PostgreSQL; PostGIS enables location‑based queries. Redis stores session tokens, rate‑limit counters, and caches frequent queries (e.g., business listings). BullMQ processes asynchronous tasks such as appointment reminders, payment confirmations, and data exports.

## Service Boundaries
1. **Auth Service** – Handles registration, login, JWT issuance, social OAuth, password reset.
2. **Business Service** – CRUD for businesses, categories, geospatial search, opening hours.
3. **Service & Slot Service** – Manages service definitions, provider schedules, slot generation, availability computation.
4. **Booking Service** – Appointment creation, rescheduling, cancellation, conflict detection.
5. **Payment Service** – Integrates with Stripe, creates payment intents, verifies webhook events.
6. **Review & Rating Service** – Stores user feedback, aggregates scores.
7. **Notification Service** – Sends push (Expo Push Notifications), email/SMS via third‑party, manages preferences.
8. **User Profile Service** – Profile CRUD, preferences.
9. **Admin & Provider Portals** – Separate NestJS modules guarded by role‑based middleware (ADMIN, PROVIDER, USER).
10. **Shared Library** – Contains TypeScript interfaces, DTOs, utility functions, design system components, and custom hooks used across frontend and backend (via monorepo).

## Folder Structure (Nx Monorepo)
planity-clone/
├─ apps/
│   ├─ mobile/                 # Expo React Native app
│   │   ├─ assets/
│   │   ├─ components/         # Shared UI atoms/molecules
│   │   ├─ hooks/              # Custom React hooks
│   │   ├─ navigation/         # Expo Router file‑based routes (app/)
│   │   ├─ screens/            # Feature screens (auth, home, search, etc.)
│   │   ├─ services/           # API clients (React Query wrappers)
│   │   ├─ store/              # Optional global state (if needed)
│   │   ├─ theme/              # Design tokens, styled‑components
│   │   ├─ types/              # Shared TS types (re‑exported from libs)
│   │   └─ app.tsx             # Root entry
│   ├─ admin/                  # Next.js or NestJS admin dashboard (optional)
│   └─ portal/                 # Provider portal (NestJS module)
├─ libs/
│   ├─ design-system/          # UI kit (buttons, inputs, modals)
│   ├─ shared-types/           # Domain DTOs, enums, interfaces
│   ├─ ui/                     # Reusable native components
│   ├─ utils/                  # Logging, validation helpers
│   └─ api/                    # NestJS backend library (core)
│       ├─ src/
│       │   ├─ auth/
│       │   ├─ business/
│       │   ├─ service-slot/
│       │   ├─ booking/
│       │   ├─ payment/
│       │   ├─ review/
│       │   ├─ notification/
│       │   ├─ user/
│       │   ├─ admin/
│       │   ├─ provider/
│       │   ├─ common/         # guards, interceptors, pipes
│       │   └─ main.ts
│       └─ test/
├─ prisma/
│   ├─ schema.prisma
│   └─ migrations/
├─ docker/
│   └─ compose.yml
├─ .github/
│   └─ workflows/
│       ├─ ci.yml
│       └─ cd.yml
├─ jest.config.js
├─ nx.json
├─ package.json
└─ tsconfig.base.json

## Data Model Highlights (Prisma)
- **User**: id, email, passwordHash, role, providerId?, createdAt, updatedAt.
- **Business**: id, name, description, address, lat, lng (PostGIS Point), ownerId, categoryId, createdAt.
- **Category**: id, name.
- **Service**: id, businessId, name, duration, price.
- **Schedule**: recurring opening hours tied to Business.
- **Appointment**: id, userId, serviceId, startTime, endTime, status, paymentId, createdAt.
- **Review**: id, appointmentId, userId, rating, comment, createdAt.
- **Favorite**: id, userId, businessId.
- **NotificationToken**: id, userId, token, platform, createdAt.

## API Contracts (REST)
- POST /auth/register, POST /auth/login, POST /auth/logout
- GET /businesses?lat=&lng=&radius=&category=&search=
- GET /businesses/:id
- GET /businesses/:id/services
- POST /bookings (body: serviceId, startTime)
- PUT /bookings/:id (reschedule/cancel)
- GET /users/me/appointments
- POST /payments/webhook (Stripe)
- GET /notifications/prefs, PATCH /notifications/prefs
- POST /favorites, DELETE /favorites/:businessId
- POST /reviews (after appointment)

## State Management & Caching
- React Query handles server state with automatic refetching, optimistic updates for booking/cancel.
- Redis caches business list queries (TTL 5min) and slot computations.
- Expo SecureStore stores JWT refresh token; access token kept in memory.

## Real‑time & Background Jobs
- **WebSocket** (via NestJS Gateway) pushes appointment status changes to mobile.
- **BullMQ** queues:
  - appointment-reminder (send push/email 24h & 1h before)
  - payment-reconciliation (verify Stripe events)
  - export-reports (admin CSV generation)
- Failed jobs retry with exponential backoff; dead‑letter queue for manual inspection.

## DevOps & CI/CD
- **Local**: `docker compose up` spins PostgreSQL (with PostGIS), Redis, NestJS, and Expo dev server.
- **CI**: GitHub Actions runs lint, unit tests (Jest), integration tests (supertest), builds Docker images, pushes to registry.
- **CD**: On merge to `main`, EAS Build creates OTA update; Docker images deployed to Kubernetes/EKS (or simple VM) with rolling update.
- **Supabase** can be used as fallback for auth/storage during early stages.

## Security Considerations
- HTTPS everywhere; HSTS.
- JWT signed with RS256; short‑lived access token (15min), refresh token rotated.
- Rate limiting via Redis (IP‑based).
- Input validation with class‑validator & DTOs.
- Prisma prevents SQL injection.
- Stripe webhook signature verification.
- Role‑based guards (ADMIN, PROVIDER, USER) on NestJS routes.
- Sensitive data (password) hashed with bcrypt.

## Scalability & Performance
- Horizontal scaling of NestJS instances behind a load balancer.
- Read replicas for PostgreSQL for heavy search queries.
- Redis clustering for cache and pub/sub.
- BullMQ workers can be scaled independently.
- Mobile app uses pagination and infinite scroll for business lists.
- Geospatial queries leverage PostGIS GIST indexes.

## Testing Strategy
- **Unit**: Jest for services, utilities, React components (with React Native Testing Library).
- **Integration**: Supertest API tests; end‑to‑end with Detox for critical flows (login → search → book).
- **Contract**: Pact or generated OpenAPI spec to ensure frontend/backend compatibility.
- **CI** enforces ≥80% coverage.

## Deployment Summary
Developers run `docker compose up` for local dev. Push to `main` triggers GitHub Actions → build Docker images → push to registry → Kubernetes rollout → EAS Build OTA for mobile. Monitoring via Prometheus/Grafana (optional) and logs shipped to ELK.
