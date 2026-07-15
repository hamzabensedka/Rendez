# Planity Clone System Architecture

## Overview
This document outlines the architecture for the Planity Clone mobile application and its supporting services. The system follows a clean, layered approach with clear separation of concerns, leveraging a monorepo managed by Nx and pnpm for dependency management.

## Technology Stack
- **Mobile**: Expo, React Native, TypeScript, Expo Router, TanStack React Query, React Native Reanimated
- **Web (Provider Portal & Admin Dashboard)**: NestJS (API) + optional React frontend (could be separate Expo web or Next.js, but kept within Nx)
- **Backend**: NestJS, Prisma ORM, PostgreSQL with PostGIS extension, Redis, BullMQ
- **DevOps**: Docker Compose, GitHub Actions, EAS Build (for mobile), Supabase (auth & storage), Jest (testing)
- **Monorepo Tools**: Nx, pnpm

## High-Level Components
1. **Mobile App** (`apps/mobile`) – Expo client handling user-facing features.
2. **Provider Portal** (`apps/provider`) – NestJS API serving business owner dashboard (could be paired with a React SPA).
3. **Admin Dashboard** (`apps/admin`) – NestJS API serving admin interface.
4. **Shared Libraries** (`libs/`) – reusable code across mobile and backend:
   - `shared-types` – TypeScript interfaces and enums.
   - `design-system` – UI components, tokens, theming.
   - `ui-kit` – reusable React Native components.
   - `utils` – helpers, constants, analytics.
   - `api-client` – generated NestJS client for mobile.
   - `geolocation` – PostGIS utilities.
5. **Services** (NestJS modules) – each encapsulating a bounded context:
   - `auth-service` – user registration, login, JWT issuance.
   - `business-service` – CRUD for businesses, categories, geospatial search.
   - `booking-service` – appointment creation, rescheduling, cancellation.
   - `payment-service` – integration with payment gateway (Stripe/PayPal).
   - `notification-service` – email/in-app push via BullMQ workers.
   - `provider-service` – business owner management (listings, availability).
   - `admin-service` – super‑user operations, moderation.
   - `gateway` – optional API gateway (NestJS) for routing and cross‑cutting concerns (authentication, rate‑limiting).

## Folder Structure
```
planity-clone/
├─ apps/
│  ├─ mobile/               # Expo React Native app
│  │   ├─ src/
│  │   │   ├─ assets/
│  │   │   ├─ components/
│  │   │   ├─ screens/
│  │   │   ├─ navigation/   # Expo Router config
│  │   │   ├─ hooks/
│  │   │   ├─ services/     # React Query wrappers
│  │   │   ├─ store/        # optional state (e.g., Zustand)
│  │   │   ├─ types/        # re-export from @planity/shared-types
│  │   │   └─ utils/
│  │   ├─ app.json
│  │   ├─ eas.json
│  │   └─ tsconfig.json
│  ├─ provider/             # NestJS API for business owners
│  │   ├─ src/
│  │   │   ├─ modules/
│  │   │   │   ├─ auth/
│  │   │   │   ├─ business/
│  │   │   │   ├─ availability/
│  │   │   │   └─ ...
│  │   │   ├─ main.ts
│  │   │   └─ ...
│  │   ├─ test/
│  │   ├─ Dockerfile
│  │   └─ tsconfig.json
│  ├─ admin/                # NestJS API for admins
│  │   └─ ... similar structure ...
│  └─ web/                  # optional React SPA (if needed) using Expo web or Next.js
│
├─ libs/
│  ├─ shared-types/
│  │   └─ src/index.ts
│  ├─ design-system/
│  │   ├─ src/
│  │   │   ├─ tokens/
│  │   │   ├─ components/
│  │   │   └─ index.ts
│  │   └─ tsconfig.json
│  ├─ ui-kit/
│  │   ├─ src/
│  │   │   ├─ components/
│  │   │   └─ index.ts
│  │   └─ tsconfig.json
│  ├─ utils/
│  │   └─ src/
│  ├─ api-client/
│  │   └─ generated NestJS client (via swagger or openapi)
│  ├─ geolocation/
│  │   └─ src/
│  └─ eslint-config/
│
├─ prisma/
│  ├─ schema.prisma         # defines User, Business, Category, Service, Appointment, Payment, Review, etc.
│  └─ migrations/
│
├─ docker-compose.yml       # services: postgres, redis, redis-bullmq, api (provider/admin/gateway), etc.
├─ nx.json
├─ package.json             # pnpm workspace root
├─ tsconfig.base.json
└─ .github/
    └─ workflows/
        ├─ ci.yml           # lint, test, build
        ├─ cd-mobile.yml    # EAS build & deploy
        └─ cd-api.yml       # Docker push & deploy

## Service Boundaries & Responsibilities
- **Auth Service**: Handles user registration (email/password), OAuth (optional), JWT issuance, token refresh, password reset. Shared with mobile, provider, admin.
- **Business Service**: Manages business profiles, service categories, location (PostGIS Point), operating hours. Provides search endpoints (text, geo‑radius, filters). Used by mobile browse, provider portal.
- **Booking Service**: Core appointment logic – slot generation based on business availability and service duration, booking creation, validation, rescheduling, cancellation, conflict detection. Emits events for notifications.
- **Payment Service**: Encapsulates payment gateway integration, creates payment intents, verifies webhook callbacks, stores payment records.
- **Notification Service**: Workers (BullMQ) that process jobs: send email (via Supabase/SMTP), push notifications (Expo Push), in-app notifications. Triggered by booking service events.
- **Provider Service**: API for business owners to manage their listings, services, staff, availability, view bookings, respond to reviews.
- **Admin Service**: Super‑user APIs for moderating businesses, users, reviews, system settings, analytics.
- **Gateway (optional)**: Aggregates APIs, applies global middleware (authentication, logging, rate limiting, CORS). Can be omitted if each app calls services directly.

## Data Layer
- **Prisma Schema** defines relational models with PostGIS support for location queries.
- **Indexes**: GIST index on location column for efficient radius searches.
- **Redis**: Used for caching frequent queries (business list, categories), session store (if needed), and as broker for BullMQ.
- **PostgreSQL**: Primary relational store; backups managed via Docker volumes or cloud provider.

## Background Jobs
- **BullMQ** workers run within the NestJS API (provider/admin/gateway) or as separate worker services defined in docker-compose.
- Job types: `send-booking-confirmation`, `send-reminder`, `update-availability-cache`, `process-payment-webhook`, `moderate-review`.
- Retry policies, dead‑letter queues, and monitoring via BullMQ UI.

## DevOps & CI/CD
- **Docker Compose** spins up postgres (with PostGIS extension), redis, api services, and optionally a maildev for local testing.
- **GitHub Actions**:
  - `ci.yml`: runs lint (`nx lint`), test (`nx test`), build (`nx build`) on push/PR.
  - `cd-mobile.yml`: on tag push to main, runs `eas build --platform all --auto-submit`.
  - `cd-api.yml`: builds Docker images for NestJS services and pushes to registry; triggers deployment (e.g., to AWS ECS or Docker Swarm).
- **EAS Build** handles OTA updates and store builds for iOS/Android.
- **Supabase** used for authentication (optional) and file storage (business images, user avatars). If using custom auth, Supabase can be bypassed.
- **Testing**: Jest unit and integration tests; React Native Testing Library for mobile components; NestJS testing utilities for APIs.

## Cross‑Cutting Concerns
- **Type Safety**: Shared types library ensures consistency between frontend and backend.
- **Design System**: Centralized UI tokens and components guarantee visual consistency across mobile screens and any web dashboards.
- **State Management**: React Query handles server state; optional local state (Zustand/Jotai) for UI‑only data.
- **Animation**: React Native Reanimated used for gesture‑based interactions (e.g., swipe to cancel booking, animated map markers).
- **Security**: JWT with refresh tokens, HTTPS, helmet, rate limiting, input validation (class‑validator/pipes), Prisma prevents SQL injection.
- **Accessibility**: Follows WCAG 2.1; design system includes ARIA labels, contrast checks.
- **Internationalization**: i18n library (e.g., react-i18next) placeholder; strings stored in `locales/`.

## Scalability & Future Enhancements
- **Microservice Split**: As load grows, each NestJS module can be extracted to its own service with its own database schema (shared via Prisma).
- **Caching Layer**: Introduce Redis‑based query caching for search results.
- **Event Streaming**: Replace BullMQ with Apache Kafka or AWS SQS for higher throughput.
- **Feature Flags**: LaunchDarkly or open-source alternative for gradual rollouts.
- **Analytics**: Integrate Segment or custom events sent to backend.

## Conclusion
The architecture leverages a monorepo to share code efficiently, enforces clean boundaries via NestJS modules and React layers, and uses proven tooling (Expo, Prisma, Redis, BullMQ, Docker, Nx, pnpm) to deliver a scalable, maintainable Planity Clone.
