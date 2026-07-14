# System Architecture for Planity Clone

## Overview
The Planity Clone connects users with local businesses for discovering, booking, and managing appointments. The system follows a clean architecture with clear separation between mobile client, API gateway, backend services, and data layers.

## Technology Stack
- Mobile: Expo, React Native, TypeScript, Expo Router, TanStack React Query, React Native Reanimated
- Backend: NestJS, Prisma, PostgreSQL with PostGIS extension, Redis, BullMQ (background jobs)
- DevOps: Nx monorepo, pnpm, Docker Compose, GitHub Actions, EAS Build, Supabase (for auth and storage optional)
- Testing: Jest

## High-Level Components
1. Mobile Client (Expo app)
2. API Gateway (NestJS)
3. Core Services (Business, Booking, User, Provider Portal, Admin, Notifications, Payments)
4. Data Layer (PostgreSQL/PostGIS, Redis cache)
5. Background Job Workers (BullMQ)
6. Infrastructure (Docker, CI/CD)

## Folder Structure (Nx monorepo)
apps/
  mobile/                 # Expo React Native app
    src/
      assets/
      components/         # Shared UI components (design system)
      screens/            # Expo Router screens (tabs, stacks)
      hooks/              # Custom React Query hooks
      utils/
      types/              # Shared TypeScript types
      theme/              # Design system tokens
      navigation/         # Expo Router config
  api/                    # NestJS backend
    src/
      modules/
        auth/             # JWT authentication, Supabase integration
        users/            # CRUD, profile
        businesses/       # Business listings, search, geolocation
        services/         # Service categories, slot computation
        bookings/         # Booking flow, appointment management
        providers/        # Business owner portal
        admin/            # Admin dashboard
        payments/         # Payment gateway integration
        notifications/    # Email/SMS via BullMQ
        common/           # Guards, interceptors, DTOs, exceptions
      prisma/             # Prisma schema and migrations
      redis/              # Redis client wrapper
      bull/               # BullMQ queues and processors
      utils/
      types/
libs/
  design-system/          # Shared UI components, tokens
  utils/                  # Logging, helpers, constants
  types/                  # Shared TypeScript interfaces (used by mobile and api)
  test/                   # Testing utilities

## Service Boundaries
- Auth Service: Handles registration, login, password reset, token issuance (uses Supabase Auth or custom JWT).
- User Service: Manages user profiles, favorites, settings.
- Business Service: CRUD for businesses, categories, location indexing (PostGIS), search/filter.
- Service Service: Defines services offered by a business, duration, price, staff.
- Availability Service: Computes free time slots based on business schedule and existing bookings.
- Booking Service: Creates, updates, cancels appointments, handles payment initiation.
- Provider Portal Service: Allows business owners to manage their listing, schedule, view bookings.
- Admin Service: Admin CRUD over users, businesses, bookings, payments.
- Payment Service: Integrates with payment gateway (Stripe/Paypal), webhooks for payment status.
- Notification Service: Sends emails/SMS/push notifications via BullMQ workers.
- Background Job Workers: Process slot recomputation, notification dispatch, cleanup tasks.

## Data Models (Prisma schema highlights)
- User { id, email, passwordHash, role, profileJson, createdAt, updatedAt }
- Business { id, name, description, address, lat, lng (PostGIS point), categoryId, ownerId, createdAt, updatedAt }
- Category { id, name }
- Service { id, businessId, name, durationMin, price, createdAt }
- Schedule { id, businessId, dayOfWeek, startTime, endTime, isRecurring }
- Booking { id, userId, serviceId, startTime, endTime, status, paymentId, createdAt, updatedAt }
- Favorite { id, userId, businessId }
- Review { id, businessId, userId, rating, comment, createdAt }
- Payment { id, bookingId, gateway, amount, status, transactionId, createdAt }

Indexes: spatial index on Business.lat/lng for map search; composite indexes on Booking(userId, status) etc.

## API Design (RESTful with NestJS)
- Base path: /api/v1
- Auth: POST /auth/register, POST /auth/login, POST /auth/forgot-password
- Users: GET /users/me, PATCH /users/me
- Businesses: GET /businesses (query: search, category, lat, lng, radius), GET /businesses/:id
- Services: GET /services?businessId=:id
- Availability: GET /availability?serviceId=:id&date=:date
- Bookings: POST /bookings, GET /bookings/user/:userId, PATCH /bookings/:id, DELETE /bookings/:id
- Providers: GET /provider/business (owner), PATCH /provider/business/:id, GET /provider/bookings
- Admin: GET /admin/users, GET /admin/bookings, etc.
- Payments: POST /payments/webhook (gateway callback)
- Notifications: internal only, triggered via BullMQ.

## State Management & Caching
- Mobile: TanStack React Query for server state, Expo SecureStore for auth token, AsyncStorage for lightweight cache.
- API: Redis for caching frequent queries (business list, slot computation results), session store if needed.
- Shared types via libs/types to ensure consistency between mobile and API.

## Real-time & Background Jobs
- BullMQ queues: slot-recalc, notification-send, payment-retry.
- Workers defined in api/src/bull/processors.
- Triggers: after booking creation/update, after schedule change, after payment success/failure.

## DevOps & CI/CD
- Nx enables modular build and test.
- Docker Compose for local dev: services: postgres, redis, api, mobile (expo dev client).
- GitHub Actions: lint, type-check, test (Jest), build Docker images, push to registry, trigger EAS Build for mobile.
- EAS Build: creates iOS/Android binaries from Expo managed workflow.
- Supabase: optional for auth and file storage; can be replaced with custom NestJS auth.
- Environment variables managed via .env files, injected in CI.

## Security Considerations
- JWT authentication with short-lived access tokens, refresh token rotation.
- Passwords hashed with bcrypt.
- Role-based access control (RBAC) middleware in NestJS.
- Input validation via DTOs and class-validator.
- SQL injection prevented by Prisma ORM.
- Rate limiting on auth endpoints.
- HTTPS enforced in production.
- Sensitive data (payment details) never stored; only gateway tokens.
- Redis protected with password, network segmentation.

## Scalability & Performance
- Horizontal scaling of NestJS API behind load balancer.
- Read replicas for PostgreSQL for heavy read workloads (business search, map).
- Redis clustering for cache and job queue.
- Geospatial queries using PostGIS indexes.
- Pagination and cursor-based lists.
- Background jobs offload heavy computation.
- Mobile optimizations: React Query pagination, memoized components, Reanimated for smooth animations.

## Testing Strategy
- Unit tests: Jest for utils, services, controllers.
- Integration tests: Supertest for API endpoints, Jest with test database.
- Mobile unit/react testing: Jest with React Native Testing Library for components and hooks.
- E2E tests: Detox for critical flows (login, search, booking).
- Test coverage target >80% for backend, >70% for mobile.

## Deployment
- Development: Docker Compose spins up all services.
- Staging: Similar to prod with scaled resources, deployed via Docker images to Kubernetes or ECS.
- Production: Managed Kubernetes (EKS/GKE/AKS) or ECS Fargate; PostgreSQL managed (RDS/Aurora) with PostGIS extension; Redis Elasticache; BullMQ workers as separate worker services.
- Mobile: Distributed via App Store/Play Store using EAS Build updates.
- Monitoring: Prometheus + Grafana for metrics, Loki for logs, Alertmanager for alerts.
- CI/CD pipelines auto-deploy on merge to main.

## Summary
This architecture separates concerns into distinct services, leverages a monorepo for code sharing, uses proven scalable technologies, and ensures maintainability through clean boundaries, typed contracts, and automated testing.