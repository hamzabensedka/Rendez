# System Architecture for Planity Clone

## Overview
Planity Clone is a monorepo managed with Nx and pnpm, comprising a mobile client (Expo React Native) and a server API (NestJS) with PostgreSQL/PostGIS, Redis, and BullMQ for background jobs.

## Tech Stack
- Mobile: Expo, React Native, TypeScript, Expo Router, TanStack React Query, React Native Reanimated
- Server: NestJS, TypeScript, Prisma ORM, PostgreSQL, PostGIS, Redis, BullMQ
- DevOps: Docker Compose, GitHub Actions, EAS Build, Supabase (for auth/storage optional), Jest
- Monorepo: Nx, pnpm

## High-Level Architecture
[Mobile App] <-- HTTPS --> [API Gateway (NestJS)] <---> [PostgreSQL/PostGIS]
                               |                       |                     |
                               |                       |                     v
                               |               [Redis Cache]          [BullMQ Job Queue]
                               |                       |
                               v                       v
                     [Prisma Generated Client]   [Worker Services]

- Mobile app handles UI, state management via React Query, animations via Reanimated.
- API exposes REST endpoints handling auth, business search, booking, payments, notifications, admin portal.
- Prisma maps to PostgreSQL with PostGIS extension for geo queries.
- Redis used for caching frequent reads (business listings, sessions) and as broker for BullMQ.
- BullMQ workers process background jobs: email/SMS notifications, payment webhook handling, slot recomputation.
- Supabase can be used for social auth and file storage (optional) but core auth handled via NestJS JWT.
- Docker Compose orchestrates local dev: API, DB, Redis, worker.
- GitHub Actions runs lint, test, build, and pushes Docker images; EAS Build creates iOS/Android binaries.
- Jest for unit and integration tests on both client and server.

## Service Boundaries
1. Auth Service – user registration, login, social login, password reset, JWT issuance.
2. Business Service – CRUD for businesses, categories, images, geo search using PostGIS.
3. Booking Service – slot computation, appointment creation, rescheduling, cancellation, conflict detection.
4. Payment Service – integration with payment gateway (Stripe/Paypal), webhook handling, transaction recording.
5. Review Service – create, read, aggregate ratings.
6. Notification Service – template management, sending via email/SMS/push, preferences.
7. Portal Service – business owner dashboard: manage listing, slots, view bookings.
8. Admin Service – manage users, businesses, system settings, analytics.
9. Worker Service – processes BullMQ jobs: notification dispatch, slot recomputation, payment reconciliation.

Each service is a NestJS module with its own controllers, services, DTOs, and entities. Shared modules: common utilities, guards, interceptors, types.

## Mobile App Folder Structure (Expo)
/apps
  /mobile
    /assets               # images, icons, fonts
    /components           # reusable UI components (buttons, cards, modals)
    /screens              # screen components per route (Expo Router)
    /navigation           # custom navigation helpers if needed
    /hooks                # custom React hooks
    /store                # React Query clients, query keys, mutators
    /types                # shared TypeScript interfaces (imported from libs)
    /utils                # formatting, date helpers, API client wrapper
    /constants            # strings, endpoints, colors
    /app.tsx              # root component (Expo Router)
    /app.json             # Expo config
    /tsconfig.json
    /eas.json
    /package.json

## Shared Libraries (Nx libs)
/libs
  /types                  # DTOs, entity shapes used by both mobile and server
  /ui                     # shared UI components (if using React Native Web for storybook)
  /utils                  # date, math, geo helpers
  /constants              # API endpoints, error messages
  /design-system          # tokens, theme, styled components

## Server (NestJS) Folder Structure
/apps
  /api
    /src
      /auth               # AuthModule
      /business           # BusinessModule
      /booking            # BookingModule
      /payment            # PaymentModule
      /review             # ReviewModule
      /notification       # NotificationModule
      /portal             # PortalModule
      /admin              # AdminModule
      /worker             # WorkerModule (BullMQ processors)
      /prisma             # Prisma service, client
      /common             # guards, interceptors, pipes, DTO base classes
      /config             # configuration modules (config.service.ts)
      /main.ts
      /test               # e2e, unit tests
    /prisma
      /schema.prisma      # DB models, PostGIS extensions
    /Dockerfile
    /tsconfig.json
    /package.json

## Data Layer
- Prisma schema defines models: User, Business, Category, Service, Slot, Appointment, Payment, Review, Notification, Favorite.
- PostGIS extension used on Business.location (point) for radius queries.
- Indexes on frequently queried fields: Business.categoryId, Business.location, Appointment.userId, Appointment.businessId.
- Redis schema: key-value for cached business list (geo hash), session tokens, rate limiting.

## DevOps & CI/CD
- Docker Compose file defines services: api, db, redis, worker.
- GitHub Actions workflow:
  1. Install pnpm dependencies.
  2. Run lint (eslint) and type-check.
  3. Run Jest tests.
  4. Build Docker images for api and worker.
  5. Push images to registry (on tag).
  6. EAS Build triggered on release branch to produce IPA/APK.
- Environment variables managed via .env files; secrets stored in GitHub Secrets.
- Monitoring: basic health endpoints; logs shipped to stdout for Docker.

## Testing Strategy
- Unit tests with Jest for services, utilities.
- Integration tests using Supertest for API endpoints.
- Mobile: Jest + React Native Testing Library for components; end-to-end with Detox (optional).
- Test coverage target >80%.

## Quality & Maintainability
- Clean Architecture: separation of concerns via modules, use cases (services) and controllers.
- Shared types ensure contract consistency between mobile and server.
- Nx enables affected: test, lint, build only changed projects.
- Prettier and ESLint configured.
- Commitlint with conventional commits.

## Deployment
- Development: docker compose up.
- Staging: Docker images deployed to Kubernetes or ECS (out of scope).
- Production: same, with managed PostgreSQL (e.g., Supabase or RDS) and Redis (Elasticache).
- Mobile updates via EAS Over-the-Air (OTA) for JS bundle; native updates via store.

## Summary
The architecture leverages a monorepo with clear service boundaries, using Expo React Native for the client and NestJS with Prisma/PostGIS for the server, supported by Redis caching and BullMQ workers, all orchestrated via Docker and CI/CD pipelines.
