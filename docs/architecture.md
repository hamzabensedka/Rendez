We need to output JSON with content being the markdown doc (escaped newlines) and a summary sentence.

We must produce architecture.md content. Under 6000 words, concise but complete. Provide folder structure, service boundaries, description of layers, tech stack usage.

We'll produce a markdown document with sections: Overview, Tech Stack, High-Level Architecture, Service Boundaries (frontend, backend, infra), Folder Structure (monorepo with Nx), Data Models, API Contracts, State Management, Authentication, Real-time, Deployment, CI/CD, Testing, etc.

We need to escape newlines in the JSON string. So content should be a single string with \n for newlines, and we need to escape any double quotes inside.

We'll produce markdown content, then JSON-encode it. As the answer must be JSON only, we will output something like:

{
  "content": "...",
  "summary": "..."
}

We need to ensure the content string is properly escaped: double quotes inside must be escaped as \", newline as \n.

We'll write the markdown content, then manually escape.

Given length, we need to be concise but still cover. Let's craft ~800-1000 words.

We'll produce markdown:

# Planity Clone System Architecture

## 1. Overview

...

## 2. Tech Stack

...

## 3. High-Level Architecture

...

## 4. Service Boundaries

### 4.1 Frontend (Expo React Native)

...

### 4.2 Backend (NestJS with Prisma, PostgreSQL, PostGIS, Redis, BullMQ)

...

### 4.3 Infra (Docker Compose, Nx, GitHub Actions, EAS Build, Supabase for auth/storage optional)

...

## 5. Folder Structure (Nx Monorepo)

...

## 6. Data Flow & API Contracts

...

## 7. State Management (TanStack React Query, React Native Reanimated)

...

## 8. Authentication & Authorization

...

## 9. Background Jobs (BullMQ)

...

## 10. Deployment & CI/CD

...

## 11. Testing Strategy

...

## 12. Design System & Shared Types

...

## 13. Security Considerations

...

## 14. Scalability & Performance

...

## 15. Open Questions / Future Work

...

Now we need to escape.

Let's craft the markdown content as a string.

I'll write it then escape.

First, raw markdown:

```
# Planity Clone System Architecture

## 1. Overview
The Planity Clone is a mobile-first marketplace for discovering and booking local services. The architecture follows a clean, layered approach with a monorepo managed by Nx, separating concerns into frontend (Expo/React Native), backend (NestJS/Prisma), and infrastructure (Docker, CI/CD). Shared types and a design system live in a libs package to ensure consistency across client and server.

## 2. Tech Stack
- **Mobile**: Expo SDK, React Native, TypeScript, Expo Router, TanStack React Query, React Native Reanimated
- **Backend**: NestJS (Node.js), TypeScript, Prisma ORM, PostgreSQL with PostGIS extension, Redis (caching & pub/sub), BullMQ (job queue)
- **Monorepo & Tooling**: Nx, pnpm, Docker Compose, GitHub Actions, EAS Build (Expo), Jest
- **Optional Services**: Supabase (auth, storage) – can be swapped for custom NestJS auth
- **Design System**: Custom UI library built with React Native Reanimated & styled-components or nativewind

## 3. High-Level Architecture
```
[Mobile App] <-- HTTPS/WS --> [API Gateway (NestJS)] <---> [PostgreSQL/PostGIS] <---> [Redis]
                              |                     |
                              |--> [BullMQ Workers] (background jobs)
                              |
                              |--> [Supabase] (auth/storage fallback)
```
The mobile app communicates exclusively via REST/GraphQL (we choose REST for simplicity) endpoints exposed by the NestJS server. Real‑time updates (e.g., new bookings, chat) use WebSocket via NestJS Gateway backed by Redis pub/sub. Background jobs are processed by BullMQ workers that also run inside the same NestJS process (or separate containers for scaling).

## 4. Service Boundaries

### 4.1 Frontend (Expo React Native)
- **Responsibility**: UI presentation, user interactions, offline caching, deep linking, push notifications.
- **Layers**:
  - **app/** (Expo Router) – screen components, route‑based code splitting.
  - **features/** – domain‑specific slices (auth, browse, booking, profile, etc.) each containing:
    - UI components (Reanimated animations)
    - React Query hooks for data fetching/mutation
    - Local state (zustand or React Context) if needed
  - **lib/** – shared utilities, API client, query keys, constants, custom hooks.
  - **design-system/** – reusable UI primitives (Button, Input, Card) styled with Reanimated gestures.
  - **types/** – generated shared types from backend (via nx lib) ensuring type safety.
- **State Management**: TanStack React Query handles server state; React Native Reanimated handles UI gestures and animations; optional lightweight client state (Zustand) for UI‑only data.
- **Authentication**: Custom hook using Supabase (or NestJS JWT) – stores tokens in SecureStore, refreshes silently.
- **Offline**: Query persistence via react-query/persistQueryClient; fallback UI for guest browse.

### 4.2 Backend (NestJS)
- **Responsibility**: Business logic, data persistence, validation, authentication, authorization, real‑time, job processing.
- **Modules** (each in `libs/backend` or `apps/api`):
  - **AuthModule** – JWT strategy, social OAuth (Google/Facebook) via passport.
  - **UserModule** – CRUD for users, profile, preferences.
  - **BusinessModule** – business entities, location (PostGIS), categories.
  - **ServiceModule** – services, pricing, availability slots.
  - **BookingModule** – booking lifecycle, slot computation, conflict detection.
  - **PaymentModule** – integration with Stripe/PayPal (webhook handling).
  - **ReviewModule** – ratings, comments, moderation.
  - **NotificationModule** – email/SMS/push via external providers (SendGrid, Twilio, Expo push).
  - **AdminModule** – privileged routes for admins.
  - **ProviderModule** – business owner portal (subset of Business/Service/Booking).
  - **WebsocketGateway** – real‑time events (new booking, review) using `@nestjs/websockets` + Redis adapter.
  - **JobsModule** – BullMQ queues (email, payment reconciliation, slot cleanup).
- **Data Access**: Prisma Client generated from schema.prisma; migrations managed via `prisma migrate`.
- **Caching**: Redis for session store, rate limiting, geo‑search caching.
- **Search**: PostGIS for proximity queries; full‑text search via PostgreSQL `tsvector` or external Elasticsearch (optional).
- **Validation**: class-validator + DTOs.
- **Error Handling**: global exception filter, logging via Winston.

### 4.3 Infrastructure
- **Containerization**: Docker Compose defines services:
  - `api` – NestJS app (node)
  - `db` – PostgreSQL + PostGIS
  - `redis` – Redis
  - `worker` – optional separate BullMQ worker (same image, different command)
  - `nginx` – reverse proxy (terminates SSL, routes `/api` to NestJS, `/` to Expo web build if needed)
- **Orchestration (dev)**: Docker Compose; (prod) can be deployed to Kubernetes or ECS using same images.
- **CI/CD**:
  - **GitHub Actions**:
    - Lint & type-check (nx affected:lint, nx affected:type-check)
    - Unit tests (nx test)
    - Build Docker images (docker/build-push-action)
    - Push to registry (GHCR or Docker Hub)
    - Deploy via SSH/K8s or trigger EAS Build for mobile.
  - **EAS Build**: Handles iOS/Android binary builds from Expo managed workflow; triggered on tag or manual.
- **Monitoring**: Basic health endpoints; logs shipped to stdout for collection (e.g., Loki).
- **Environment Variables**: Managed via `.env` files; secrets via GitHub Secrets.

## 5. Folder Structure (Nx Monorepo)
```
planity-clone/
├── apps/
│   ├── mobile/                 # Expo React Native app
│   │   ├── src/
│   │   │   ├── app/            # Expo Router (screens)
│   │   │   ├── features/
│   │   │   │   ├── auth/
│   │   │   │   ├── browse/
│   │   │   │   ├── booking/
│   │   │   │   ├── profile/
│   │   │   │   └── ...
│   │   │   ├── lib/
│   │   │   │   ├── api-client/
│   │   │   │   ├── query-keys/
│   │   │   │   ├── constants/
│   │   │   │   └── hooks/
│   │   │   ├── design-system/
│   │   │   │   ├── components/
│   │   │   │   └── themes/
│   │   │   └── types/          # generated shared types
│   │   ├── assets/
│   │   ├── expo.config.js
│   │   └── tsconfig.json
│   └── api/                    # NestJS backend
│       ├── src/
│       │   ├── auth/
│       │   ├── user/
│       │   ├── business/
│       │   ├── service/
│       │   ├── booking/
│       │   ├── payment/
│       │   ├── review/
│       │   ├── notification/
│       │   ├── admin/
│       │   ├── provider/
│       │   ├── websocket/
│       │   ├── jobs/
│       │   ├── common/
│       │   ├── app.module.ts
│       │   └── main.ts
│       ├── test/
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── migrations/
│       └── tsconfig.json
├── libs/
│   ├── shared-types/           # DTOs, interfaces generated from backend (or hand‑written)
│   ├── design-system/          # reusable UI components (can be used by mobile & web)
│   ├── utils/                  # logging, helpers, config
│   └── eslint-config/
├── docker/
│   ├── compose.yml
│   ├── Dockerfile.api
│   └── Dockerfile.mobile
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── cd.yml
├── nx.json
├── package.json
└── pnpm-workspace.yaml
```
*Note*: `shared-types` is built as an Nx library and consumed by both `apps/mobile` and `apps/api` to guarantee type‑safe contracts.

## 6. Data Flow & API Contracts
- **REST Endpoints**: Versioned under `/api/v1/` (e.g., `/api/v1/businesses`, `/api/v1/bookings`). Use NestJS controllers with DTO validation.
- **WebSocket**: `/socket.io` (or custom gateway) for real‑time events: `booking:created`, `review:added`, `notification`.
- **Query Keys**: Centralized in `libs/shared-types/query-keys.ts` to enable React Query caching and invalidation.
- **Mutations**: React Query mutations call the API client (`libs/mobile/lib/api-client`) which wraps `fetch` with auth headers and error handling.
- **Optimistic Updates**: For booking creation, UI updates optimistically; on error, rollback via query invalidation.
- **Geo Search**: Backend exposes `/api/v1/businesses/near?lat=&lng=&radius=` using PostGIS `ST_DWithin`.

## 7. State Management
- **Server State**: TanStack React Query – handles fetching, caching, background refetching, pagination, infinite queries (browse list).
- **Client State**: Minimal; UI toggles (modal visibility, drawer state) handled via React Context or Zustand.
- **Animations**: React Native Reanimated 2 for gesture‑based interactions (e.g., swipe to cancel booking, map marker drag).

## 8. Authentication & Authorization
- **Auth Strategy**: JWT (access token 15 min, refresh token 7 days) stored in SecureStore.
- **Social Login**: Expo SDK `expo-auth-session` + NestJS passport strategies.
- **Roles**: `user`, `provider`, `admin`. Guard decorators (`@Roles`, `@UseGuards`) protect routes.
- **Permission Matrix**:
  - Guest: read‑only browse, search.
  - User: create booking, manage own bookings, favorites, profile, reviews.
  - Provider: manage own business/services, view incoming bookings, respond to reviews.
  - Admin: CRUD on all entities, analytics, user/provider management.

## 9. Background Jobs (BullMQ)
- **Queues**:
  - `email`: send booking confirmations, reminders.
  - `payment`: reconcile webhook events, handle failed payments.
  - `slot-cleanup`: purge expired temporary slots.
  - `notification`: push notifications via Expo push service.
- **Workers**: Registered in `apps/api/src/jobs`; concurrency configurable; can be scaled horizontally via separate worker containers.
- **Retry Policies**: exponential backoff, dead‑letter queue for manual inspection.

## 10. Deployment & CI/CD
- **Development**: `docker compose up` spins up api, db, redis; Expo dev client for mobile.
- **Testing**:
  - Unit tests with Jest (both frontend and backend).
  - E2E tests for critical flows using Detox (mobile) and Supertest (API) – run in CI on PR.
- **Build**:
  - Frontend: `npx expo export:web` for web fallback; `eas build --platform all` for store binaries.
  - Backend: Docker multi‑stage build (`node:alpine` → compile → production).
- **Release**:
  - Tag triggers GitHub Actions workflow:
    1. Run lint, test, build.
    2. Push Docker images.
    3. Deploy to staging/k8s via ArgoCD or manual kubectl.
    4. Trigger EAS Build for iOS/Android; upload to TestFlight/Google Play internal track.
- **Rollback**: Keep previous image tags; DB migrations are forward‑only; revert via redeploy previous image.

## 11. Testing Strategy
- **Unit**: Jest + `@testing-library/react-native` for UI components; NestJS testing utilities for services/controllers.
- **Integration**: API contract tests using Pact or manual snapshot of shared-types; ensure backend DTO changes break frontend tests.
- **E2E**:
  - Mobile: Detox testing login, browse, booking flow.
  - Backend: Supertest endpoint tests with test database (Postgres in Docker).
- **Coverage**: Aim >80% for critical domains (auth, booking, payment).
- **CI Gates**: Fail PR if lint, type-check, or unit tests fail; E2E runs on nightly.

## 12. Design System & Shared Types
- **Design System Library**: Built with React Native Reanimated + styled-components (or nativewind). Exported as Nx lib `libs/design-system`.
- **Shared Types**: Generated from Prisma schema via `prisma generate` → TypeScript interfaces; also include API DTOs (nestjs dto classes) exported from `libs/shared-types`. Both mobile and backend import this lib, guaranteeing compile‑time parity.
- **Theme**: Light/dark mode via context; tokens stored in `libs/design-system/theme.ts`.

## 13. Security Considerations
- **Transport**: TLS termination at nginx; enforce HTTPS.
- **Data Protection**: Passwords hashed with bcrypt; sensitive fields (e.g., payment token) never stored; use Stripe/PayPal tokens.
- **API Security**: Helmet, rate limiting (express-rate-limit + Redis store), CORS restricted to allowed origins.
- **Authentication**: JWT signed with strong secret; refresh token rotation; token revocation via Redis blocklist on logout.
- **Input Validation**: DTO validation + Prisma schema constraints.
- **Geofencing**: Use PostGIS for distance queries; avoid exposing raw coordinates beyond needed precision.
- **Secrets**: Managed via GitHub Secrets; injected into Docker/K8s as env vars; never committed.

## 14. Scalability & Performance
- **Horizontal Scaling**: API stateless (except WebSocket sessions backed by Redis pub/sub); can run multiple replicas behind LB.
- **Database**: Read replicas for heavy search queries; partitioning by date for bookings.
- **Caching**: Redis caches frequent queries (featured businesses, categories); TTL 5‑15 min.
- **Image Assets**: Served via CDN (e.g., Cloudinary) with responsive sizes; Expo `Image` component uses cached network images.
- **Background Jobs**: Workers autoscaled based on queue length (using KEDA or custom scaler).
- **WebSocket**: Use Redis adapter to share state across instances; sticky sessions not required.

## 15. Open Questions / Future Work
- **GraphQL vs REST**: Evaluate GraphQL for flexible data fetching (potential reduction of over‑fetching).
- **Push Notification Provider**: Move from Expo push to a dedicated service (e.g., OneSignal) for richer analytics.
- **Multi‑tenancy**: If expanding to multiple markets, consider schema‑per‑tenant or shared‑tenant with tenant_id.
- **Offline First**: Expand offline capabilities with Expo SQLite and React Query persister.
- **Analytics**: Integrate Segment or Firebase Analytics for user behavior tracking.
- **AI Recommendations**: Future ML service for personalized business suggestions.

---
*This document captures the core architectural decisions, folder layout, and service boundaries for the Planity Clone using the prescribed stack. It serves as a single source of truth for developers, DevOps, and product stakeholders.*

```

Now we need to escape this for JSON.

We need to replace newline with \n, and escape any double quotes inside.

Let's scan the content for double quotes. There are many places: e.g., "Expo Router", "TanStack React Query", etc. We'll need to escape each double quote with \".

We'll need to produce a single JSON string. This is tedious manually but doable.

Alternative: we can output the markdown as a raw string with newlines but not escape double quotes? The JSON spec requires double quotes inside string to be escaped. So we must escape them.

We'll need to go through the content and replace every " with \".

Let's do that systematically.

I'll copy the content and then replace.

But to avoid mistakes, perhaps we can use a trick: we can output JSON with the content as a template literal using backticks? No, JSON only allows double quotes for strings, not backticks.

We must escape.

Given length, it's prone to error. Maybe we can reduce double quotes usage by using single quotes inside markdown? But markdown often uses double quotes for emphasis? Not required. We can avoid double quotes inside the markdown by using single quotes or backticks for code. However, we have many places where we naturally use double quotes, like "Expo Router". We could change to ‘Expo Router’ (unicode) but that's still a char but not double quote. Safer to replace double quotes with single quotes where possible, but we need to keep readability. However, the requirement is just to produce JSON; we can keep double quotes but escape them.

Let's attempt to produce escaped string manually but carefully.

I'll write the content with double quotes, then replace each " with \". I'll do it in my mind? Might be error prone.

Alternative: produce JSON where content is a string that itself contains the markdown but we can use a JSON library? Not possible.

Given the instructions, we must output JSON only. We'll try.

I'll create a version with minimal double quotes: Use single quotes for any quoted text inside markdown. In markdown, single quotes are fine. So we can replace double quotes with single quotes where they are not needed for code syntax. However, we have code snippets like `app.module.ts` which use backticks; that's fine. We have JSON-like examples? Not many.

We can avoid double quotes entirely by using single quotes for any quoted English. Let's rewrite the markdown using single quotes for quoting text, and keep double quotes only where required (maybe none). Then we won't need to escape any double quotes, making JSON easier.

Let's rewrite the markdown avoiding double quotes.

We'll need to be careful: In markdown, we sometimes use double quotes inside code fences? Not needed. We'll avoid them.

Let's rewrite the entire markdown with single quotes for any quoted text.

We'll produce:

# Planity Clone System Architecture

## 1. Overview
The Planity Clone is a mobile-first marketplace for discovering and booking local services. The architecture follows a clean, layered approach with a monorepo managed by Nx, separating concerns into frontend (Expo/React Native), backend (NestJS/Prisma), and infrastructure (Docker, CI/CD). Shared types and a design system live in a libs package to ensure consistency across client and server.

## 2. Tech Stack
- **Mobile**: Expo SDK, React Native, TypeScript, Expo Router, TanStack React Query, React Native Reanimated
- **Backend**: NestJS (Node.js), TypeScript, Prisma ORM, PostgreSQL with PostGIS extension, Redis (caching & pub/sub), BullMQ (job queue)
- **Monorepo & Tooling**: Nx, pnpm, Docker Compose, GitHub Actions, EAS Build (Expo), Jest
- **Optional Services**: Supabase (auth, storage) – can be swapped for custom NestJS auth
- **Design System**: Custom UI library built with React Native Reanimated & styled-components or nativewind

## 3. High-Level Architecture
```
[Mobile App] <-- HTTPS/WS --> [API Gateway (NestJS)] <---> [PostgreSQL/PostGIS] <---> [Redis]
                              |                     |
                              |--> [BullMQ Workers] (background jobs)
                              |
                              |--> [Supabase] (auth/storage fallback)
```
The mobile app communicates exclusively via REST/GraphQL (we choose REST for simplicity) endpoints exposed by the NestJS server. Real‑time updates (e.g., new bookings, chat) use WebSocket via NestJS Gateway backed by Redis pub/sub. Background jobs are processed by BullMQ workers that also run inside the same NestJS process (or separate containers for scaling).

## 4. Service Boundaries

### 4.1 Frontend (Expo React Native)
- **Responsibility**: UI presentation, user interactions, offline caching, deep linking, push notifications.
- **Layers**:
  - **app/** (Expo Router) – screen components, route‑based code splitting.
  - **features/** – domain‑specific slices (auth, browse, booking, profile, etc.) each containing:
    - UI components (Reanimated animations)
    - React Query hooks for data fetching/mutation
    - Local state (zustand or React Context) if needed
  - **lib/** – shared utilities, API client, query keys, constants, custom hooks.
  - **design-system/** – reusable UI primitives (Button, Input, Card) styled with Reanimated gestures.
  - **types/** – generated shared types from backend (via nx lib) ensuring type safety.
- **State Management**: TanStack React Query handles server state; React Native Reanimated handles UI gestures and animations; optional lightweight client state (Zustand) for UI‑only data.
- **Authentication**: Custom hook using Supabase (or NestJS JWT) – stores tokens in SecureStore, refreshes silently.
- **Offline**: Query persistence via react-query/persistQueryClient; fallback UI for guest browse.

### 4.2 Backend (NestJS)
- **Responsibility**: Business logic, data persistence, validation, authentication, authorization, real‑time, job processing.
- **Modules** (each in `libs/backend` or `apps/api`):
  - **AuthModule** – JWT strategy, social OAuth (Google/Facebook) via passport.
  - **UserModule** – CRUD for users, profile, preferences.
  - **BusinessModule** – business entities, location (PostGIS), categories.
  - **ServiceModule** – services, pricing, availability slots.
  - **BookingModule** – booking lifecycle, slot computation, conflict detection.
  - **PaymentModule** – integration with Stripe/PayPal (webhook handling).
  - **ReviewModule** – ratings, comments, moderation.
  - **NotificationModule** – email/SMS/push via external providers (SendGrid, Twilio, Expo push).
  - **AdminModule** – privileged routes for admins.
  - **ProviderModule** – business owner portal (subset of Business/Service/Booking).
  - **WebsocketGateway** – real‑time events (new booking, review) using `@nestjs/websockets` + Redis adapter.
  - **JobsModule** – BullMQ queues (email, payment reconciliation, slot cleanup).
- **Data Access**: Prisma Client generated from schema.prisma; migrations managed via `prisma migrate`.
- **Caching**: Redis for session store, rate limiting, geo‑search caching.
- **Search**: PostGIS for proximity queries; full‑text search via PostgreSQL `tsvector` or external Elasticsearch (optional).
- **Validation**: class-validator + DTOs.
- **Error Handling**: global exception filter, logging via Winston.

### 4.3 Infrastructure
- **Containerization**: Docker Compose defines services:
  - `api` – NestJS app (node)
  - `db` – PostgreSQL + PostGIS
  - `redis` – Redis
  - `worker` – optional separate BullMQ worker (same image, different command)
  - `nginx` – reverse proxy (terminates SSL, routes `/api` to NestJS, `/` to Expo web build if needed)
- **Orchestration (dev)**: Docker Compose; (prod) can be deployed to Kubernetes or ECS using same images.
- **CI/CD**:
  - **GitHub Actions**:
    - Lint & type-check (nx affected:lint, nx affected:type-check)
    - Unit tests (nx test)
    - Build Docker images (docker/build-push-action)
    - Push to registry (GHCR or Docker Hub)
    - Deploy via SSH/K8s or trigger EAS Build for mobile.
  - **EAS Build**: Handles iOS/Android binary builds from Expo managed workflow; triggered on tag or manual.
- **Monitoring**: Basic health endpoints; logs shipped to stdout for collection (e.g., Loki).
- **Environment Variables**: Managed via `.env` files; secrets via GitHub Secrets.

## 5. Folder Structure (Nx Monorepo)
```
planity-clone/
├── apps/
│   ├── mobile/                 # Expo React Native app
│   │   ├── src/
│   │   │   ├── app/            # Expo Router (screens)
│   │   │   ├── features/
│   │   │   │   ├── auth/
│   │   │   │   ├── browse/
│   │   │   │   ├── booking/
│   │   │   │   ├── profile/
│   │   │   │   └── ...
│   │   │   ├── lib/
│   │   │   │   ├── api-client/
│   │   │   │   ├── query-keys/
│   │   │   │   ├── constants/
│   │   │   │   └── hooks/
│   │   │   ├── design-system/
│   │   │   │   ├── components/
│   │   │   │   └── themes/
│   │   │   └── types/          # generated shared types
│   │   ├── assets/
│   │   ├── expo.config.js
│   │   └── tsconfig.json
│   └── api/                    # NestJS backend
│       ├── src/
│       │   ├── auth/
│       │   ├── user/
│       │   ├── business/
│       │   ├── service/
│       │   ├── booking/
│       │   ├── payment/
│       │   ├── review/
│       │   ├── notification/
│       │   ├── admin/
│       │   ├── provider/
│       │   ├── websocket/
│       │   ├── jobs/
│       │   ├── common/
│       │   ├── app.module.ts
│       │   └── main.ts
│       ├── test/
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── migrations/
│       └── tsconfig.json
├── libs/
│   ├── shared-types/           # DTOs, interfaces generated from backend (or hand‑written)
│   ├── design-system/          # reusable UI components (can be used by mobile & web)
│   ├── utils/                  # logging, helpers, config
│   └── eslint-config/
├── docker/
│   ├── compose.yml
│   ├── Dockerfile.api
│   └── Dockerfile.mobile
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── cd.yml
├── nx.json
├── package.json
└── pnpm-workspace.yaml
```
*Note*: `shared-types` is built as an Nx library and consumed by both `apps/mobile` and `apps/api` to guarantee type‑safe contracts.

## 6. Data Flow & API Contracts
- **REST Endpoints**: Versioned under `/api/v1/` (e.g., `/api/v1/businesses`, `/api/v1/bookings`). Use NestJS controllers with DTO validation.
- **WebSocket**: `/socket.io` (or custom gateway) for real‑time events: `booking:created`, `review:added`, `notification`.
- **Query Keys**: Centralized in `libs/shared-types/query-keys.ts` to enable React Query caching and invalidation.
- **Mutations**: React Query mutations call the API client (`libs/mobile/lib/api-client`) which wraps `fetch` with auth headers and error handling.
- **Optimistic Updates**: For booking creation, UI updates optimistically; on error, rollback via query invalidation.
- **Geo Search**: Backend exposes `/api/v1/businesses/near?lat=&lng=&radius=` using PostGIS `ST_DWithin`.

## 7. State Management
- **Server State**: TanStack React Query – handles fetching, caching, background refetching, pagination, infinite queries (browse list).
- **Client State**: Minimal; UI toggles (modal visibility, drawer state) handled via React Context or Zustand.
- **Animations**: React Native Reanimated 2 for gesture‑based interactions (e.g., swipe to cancel booking, map marker drag).

## 8. Authentication & Authorization
- **Auth Strategy**: JWT (access token 15 min, refresh token 7 days) stored in SecureStore.
- **Social Login**: Expo SDK `expo-auth-session` + NestJS passport strategies.
- **Roles**: `user`, `provider`, `admin`. Guard decorators (`@Roles`, `@UseGuards`) protect routes.
- **Permission Matrix**:
  - Guest: read‑only browse, search.
  - User: create booking, manage own bookings, favorites, profile.
  - Provider: manage own business/services, view incoming bookings, respond to reviews.
  - Admin: CRUD on all entities, analytics, user/provider management.

## 9. Background Jobs (BullMQ)
- **Queues**:
  - `email`: send booking confirmations, reminders.
  - `payment`: reconcile webhook events, handle failed payments.
  - `slot-cleanup`: purge expired temporary slots.
  - `notification`: push notifications via Expo push service.
- **Workers**: Registered in `apps/api/src/jobs`; concurrency configurable; can be scaled horizontally via separate worker containers.
- **Retry Policies**: exponential backoff, dead‑letter queue for manual inspection.

## 10. Deployment & CI/CD
- **Development**: `docker compose up` spins up api, db, redis; Expo dev client for mobile.
- **Testing**:
  - Unit tests with Jest (both frontend and backend).
  - E2E tests for critical flows using Detox (mobile) and Supertest (API) – run in CI on PR.
- **Build**:
  - Frontend: `npx expo export:web` for web fallback; `eas build --platform all` for store binaries.
  - Backend: Docker multi‑stage build (`node:alpine` → compile → production).
- **Release**:
  - Tag triggers GitHub Actions workflow:
    1. Run lint, test, build.
    2. Push Docker images.
    3. Deploy to staging/k8s via ArgoCD or manual kubectl.
    4. Trigger EAS Build for iOS/Android; upload to TestFlight/Google Play internal track.
- **Rollback**: Keep previous image tags; DB migrations are forward‑only; revert via redeploy previous image.

## 11. Testing Strategy
- **Unit**: Jest + `@testing-library/react-native` for UI components; NestJS testing utilities for services/controllers.
- **Integration**: API contract tests using Pact or manual snapshot of shared-types; ensure backend DTO changes break frontend tests.
- **E2E**:
  - Mobile: Detox testing login, browse, booking flow.
  - Backend: Supertest endpoint tests with test database (Postgres in Docker).
- **Coverage**: Aim >80% for critical domains (auth, booking, payment).
- **CI Gates**: Fail PR if lint, type-check, or unit tests fail; E2E runs on nightly.

## 12. Design System & Shared Types
- **Design System Library**: Built with React Native Reanimated + styled-components (or nativewind). Exported as Nx lib `libs/design-system`.
- **Shared Types**: Generated from Prisma schema via `prisma generate` → TypeScript interfaces; also include API DTOs (nestjs dto classes) exported from `libs/shared-types`. Both mobile and backend import this lib, guaranteeing compile‑time parity.
- **Theme**: Light/dark mode via context; tokens stored in `libs/design-system/theme.ts`.

## 13. Security Considerations
- **Transport**: TLS termination at nginx; enforce HTTPS.
- **Data Protection**: Passwords hashed with bcrypt; sensitive fields (e.g., payment token) never stored; use Stripe/PayPal tokens.
- **API Security**: Helmet, rate limiting (express-rate-limit + Redis store), CORS restricted to allowed origins.
- **Authentication**: JWT signed with strong secret; refresh token rotation; token revocation via Redis blocklist on logout.
- **Input Validation**: DTO validation + Prisma schema constraints.
- **Geofencing**: Use PostGIS for distance queries; avoid exposing raw coordinates beyond needed precision.
- **Secrets**: Managed via GitHub Secrets; injected into Docker/K8s as env vars; never committed.

## 14. Scalability & Performance
- **Horizontal Scaling**: API stateless (except WebSocket sessions backed by Redis pub/sub); can run multiple replicas behind LB.
- **Database**: Read replicas for heavy search queries; partitioning by date for bookings.
- **Caching**: Redis caches frequent queries (featured businesses, categories); TTL 5‑15 min.
- **Image Assets**: Served via CDN (e.g., Cloudinary) with responsive sizes; Expo `Image` component uses cached network images.
- **Background Jobs**: Workers autoscaled based on queue length (using KEDA or custom scaler).
- **WebSocket**: Use Redis adapter to share state across instances; sticky sessions not required.

## 15. Open Questions / Future Work
- **GraphQL vs REST**: Evaluate GraphQL for flexible data fetching (potential reduction of over‑fetching).
- **Push Notification Provider**: Move from Expo push to a dedicated service (e.g., OneSignal) for richer analytics.
- **Multi‑tenancy**: If expanding to multiple markets, consider schema‑per‑tenant or shared‑tenant with tenant_id.
- **Offline First**: Expand offline capabilities with Expo SQLite and React Query persister.
- **Analytics**: Integrate Segment or Firebase Analytics for user behavior tracking.
- **AI Recommendations**: Future ML service for personalized business suggestions.

---
*This document captures the core architectural decisions, folder layout, and service boundaries for the Planity Clone using the prescribed stack. It serves as a single source of truth for developers, DevOps, and product stakeholders.*

Now we need to ensure there are no double quotes. I see none; we used single quotes for quoting text. However, we have some places where we used double quotes inadvertently? Let's check.

In the section "### 4.1 Frontend (Expo React Native)" we have parentheses with no quotes. Good.

We have "Expo Router" – that's two words without quotes. Good.

We have "TanStack React Query" – no quotes.

We have "React Native Reanimated" – no quotes.

We have "NestJS (Node.js)" – parentheses fine.

We have "Prisma ORM" – fine.

We have "PostgreSQL with PostGIS extension" – fine.

We have "Redis (caching & pub/sub)" – fine.

We have "BullMQ (job queue)" – fine.

We have "Nx, pnpm, Docker Compose, GitHub Actions, EAS Build (Ex