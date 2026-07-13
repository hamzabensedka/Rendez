Overview
=======
Planity Clone is a mobile-first appointment booking platform that connects users with local businesses. The system follows a clean layered architecture with clear separation of concerns, leveraging an Nx monorepo to share types, UI components, and utilities between the Expo mobile app and the NestJS backend.

Tech Stack
----------
- Mobile: Expo (React Native, TypeScript), Expo Router, TanStack React Query, React Native Reanimated
- Backend: NestJS (TypeScript), Prisma ORM, PostgreSQL + PostGIS, Redis, BullMQ (via NestJS)
- Monorepo: Nx, pnpm
- CI/CD: GitHub Actions, Docker Compose, EAS Build (mobile), Supabase (optional auth/storage)
- Testing: Jest
- Documentation: Shared types & design system

High-Level Architecture
-----------------------
The system is divided into five layers, each enforced by Nx library boundaries:
1. Presentation Layer (Expo mobile app)
2. Application Layer (NestJS controllers, DTOs, validators)
3. Domain Layer (NestJS services, business logic, use‑cases)
4. Infrastructure Layer (Prisma models, Redis clients, external integrations)
5. Data Layer (PostgreSQL/PostGIS, Redis)

Mobile App Structure (apps/mobile)
----------------------------------
apps/mobile/
├─ src/
│   ├─ app/                 # Expo Router file‑based routes
│   │   ├─ (tabs)/          # Tab navigator (Home, Search, Map, Profile, Bookings)
│   │   │   ├─ home.tsx
│   │   │   ├─ search.tsx
│   │   │   ├─ map.tsx
│   │   │   ├─ profile.tsx
│   │   │   └─ bookings.tsx
│   │   ├─ auth/
│   │   │   ├─ sign-in.tsx
│   │   │   ├─ sign-up.tsx
│   │   │   └─ reset-password.tsx
│   │   ├─ businesses/
│   │   │   ├─ [id]/        # Business detail route
│   │   │   │   ├─ index.tsx
│   │   │   │   ├─ services.tsx
│   │   │   │   ├─ reviews.tsx
│   │   │   │   └─ book.tsx
│   │   │   └─ list.tsx
│   │   ├─ bookings/
│   │   │   ├─ upcoming.tsx
│   │   │   └─ history.tsx
│   │   ├─ favorites/
│   │   │   └─ index.tsx
│   │   └─ _layout.tsx      # Root layout (providers, error boundaries)
│   ├─ components/          # Shared UI components (design system)
│   │   ├─ ui/
│   │   │   ├─ button.tsx
│   │   │   ├─ input.tsx
│   │   │   ├─ card.tsx
│   │   │   └─ modal.tsx
│   │   ├─ layout/
│   │   │   ├─ header.tsx
│   │   │   └─ footer.tsx
│   │   └─ maps/
│   │       └─ map-view.tsx # Uses react‑native‑maps with Reanimated gestures
│   ├─ hooks/               # Custom React hooks (query keys, form helpers)
│   │   ├─ useAuth.ts
│   │   ├─ useBusinesses.ts
│   │   └─ useBooking.ts
│   ├─ stores/              # Optional client‑state (Zustand/Jotai) for non‑query state
│   │   └─ authStore.ts
│   ├─ utils/               # Helper functions (date formatting, geolocation)
│   │   ├─ geo.ts
│   │   └─ formatting.ts
│   ├─ assets/              # Images, icons, fonts
│   │   └─ ...
│   ├─ theme/               # Design system tokens (colors, spacing, typography)
│   │   └─ tokens.ts
│   └─ types/               # Shared TypeScript interfaces (imported from libs/shared-types)
│       └─ index.ts
├─ expo.config.ts
├─ tsconfig.json
└─ package.json

Backend Structure (apps/api)
----------------------------
apps/api/
├─ src/
│   ├─ main.ts                  # NestJS bootstrap
│   ├─ app.module.ts            # Root module
│   ├─ config/                  # Configuration (dotenv, validation)
│   │   └─ config.module.ts
│   ├─ common/                  # Guards, interceptors, pipes, exceptions
│   │   ├─ auth/
│   │   │   ├─ jwt-auth.guard.ts
│   │   │   └─ roles.guard.ts
│   │   ├─ validation/
│   │   │   └─ uuid.validation.pipe.ts
│   │   └─ logging.interceptor.ts
│   ├─ modules/                 # Feature modules (DDD‑style)
│   │   ├─ auth/
│   │   │   ├─ auth.controller.ts
│   │   │   ├─ auth.service.ts
│   │   │   ├─ dto/
│   │   │   │   ├─ sign-up.dto.ts
│   │   │   │   └─ sign-in.dto.ts
│   │   │   ├─ entities/
│   │   │   │   └─ user.entity.ts
│   │   │   └─ auth.module.ts
│   │   ├─ businesses/
│   │   │   ├─ businesses.controller.ts
│   │   │   ├─ businesses.service.ts
│   │   │   ├─ dto/
│   │   │   │   ├─ create-business.dto.ts
│   │   │   │   └─ search-business.dto.ts
│   │   │   ├─ entities/
│   │   │   │   ├─ business.entity.ts
│   │   │   │   ├─ service.entity.ts
│   │   │   │   └─ category.entity.ts
│   │   │   ├─ repositories/
│   │   │   │   └─ business.repository.ts (Prisma)
│   │   │   └─ businesses.module.ts
│   │   ├─ bookings/
│   │   │   ├─ bookings.controller.ts
│   │   │   ├─ bookings.service.ts
│   │   │   ├─ dto/
│   │   │   │   ├─ create-booking.dto.ts
│   │   │   │   ├─ reschedule-booking.dto.ts
│   │   │   │   └─ cancel-booking.dto.ts
│   │   │   ├─ entities/
│   │   │   │   ├─ booking.entity.ts
│   │   │   │   └─ time-slot.entity.ts
│   │   │   ├─ repositories/
│   │   │   │   └─ booking.repository.ts
│   │   │   └─ bookings.module.ts
│   │   ├─ reviews/
│   │   │   ├─ reviews.controller.ts
│   │   │   ├─ reviews.service.ts
│   │   │   ├─ dto/
│   │   │   │   └─ create-review.dto.ts
│   │   │   ├─ entities/
│   │   │   │   └─ review.entity.ts
│   │   │   └─ reviews.module.ts
│   │   ├─ payments/
│   │   │   ├─ payments.controller.ts
│   │   │   ├─ payments.service.ts
│   │   │   ├─ dto/
│   │   │   │   └─ process-payment.dto.ts
│   │   │   ├─ entities/
│   │   │   │   └─ payment.entity.ts
│   │   │   └─ payments.module.ts
│   │   ├─ notifications/
│   │   │   ├─ notifications.controller.ts
│   │   │   ├─ notifications.service.ts
│   │   │   ├─ bullmq/
│   │   │   │   ├─ processor/
│   │   │   │   │   ├─ appointment-reminder.processor.ts
│   │   │   │   │   └─ payment-receipt.processor.ts
│   │   │   │   └─ queue.module.ts
│   │   │   └─ notifications.module.ts
│   │   ├─ admin/
│   │   │   ├─ admin.controller.ts
│   │   │   ├─ admin.service.ts
│   │   │   ├─ dto/
│   │   │   │   └─ user-management.dto.ts
│   │   │   ├─ entities/
│   │   │   │   └─ admin-user.entity.ts
│   │   │   └─ admin.module.ts
│   │   └─ providers/           # Business owner portal (similar to businesses but scoped)
│   │       ├─ provider.controller.ts
│   │       ├─ provider.service.ts
│   │       └─ provider.module.ts
│   ├─ prisma/                  # Prisma schema and client
│   │   ├─ schema.prisma
│   │   └─ seed.ts
│   ├─ redis/                   # Redis client wrapper
│   │   └─ redis.service.ts
│   ├─ utils/                   # Geospatial helpers (PostGIS), slot calculation
│   │   ├─ geo.utils.ts
│   │   └─ slot-calculator.utils.ts
│   └─ types/                   # Shared backend types (re‑export from libs/shared-types)
│       └─ index.ts
├─ Dockerfile
├─ tsconfig.json
└─ package.json

Shared Nx Libraries
-------------------
libs/
├─ shared-types/
│   ├─ src/
│   │   ├─ lib/
│   │   │   ├─ user.ts
│   │   │   ├─ business.ts
│   │   │   ├─ booking.ts
│   │   │   ├─ review.ts
│   │   │   ├─ payment.ts
│   │   │   └─ geo.ts
│   │   └─ index.ts
│   ├─ tsconfig.json
│   └─ package.json
├─ ui-kit/
│   ├─ src/
│   │   ├─ lib/
│   │   │   ├─ button.tsx
│   │   │   ├─ input.tsx
│   │   │   ├─ card.tsx
│   │   │   └─ modal.tsx
│   │   └─ index.ts
│   ├─ tsconfig.json
│   └─ package.json
├─ design-tokens/
│   ├─ src/
│   │   └─ lib/
│   │       └─ tokens.ts
│   ├─ tsconfig.json
│   └─ package.json
└─ utils/
    ├─ src/
    │   ├─ lib/
    │   │   ├─ date.ts
    │   │   ├─ validation.ts
    │   │   └─ api-client.ts   # wrapper for React Query + fetch
    │   └─ index.ts
    ├─ tsconfig.json
    └─ package.json

Database Schema (Prisma)
------------------------
Prisma schema (apps/api/prisma/schema.prisma) defines:
- User (id, email, passwordHash, role, createdAt, updatedAt)
- Business (id, ownerId, name, description, address, lat, lng, phone, website, createdAt, updatedAt)
- Service (id, businessId, name, durationMin, price, categoryId)
- Category (id, name)
- Booking (id, userId, businessId, serviceId, startTime, endTime, status, pricePaid, createdAt, updatedAt)
- TimeSlot (id, businessId, serviceId, startTime, endTime, isAvailable)
- Review (id, businessId, userId, rating, comment, createdAt)
- Payment (id, bookingId, amount, provider, status, transactionId, createdAt)
- AdminUser (id, email, passwordHash, role, createdAt)
- Favorite (id, userId, businessId, createdAt)

PostGIS extension is used for the `lat/lng` stored as a `Point` type; queries leverage `ST_DWithin` for radius‑based search.

Caching & Pub/Sub
-----------------
- Redis caches:
  * Business list/search results (TTL 5 min)
  * User sessions (JWT refresh tokens)
  * Popular services
- BullMQ queues (via NestJS) for:
  * Appointment reminder notifications
  * Payment receipt emails/SMS
  * Daily analytics aggregation

CI/CD & DevOps
--------------
- GitHub Actions workflow:
  * lint, type‑check, unit tests (Jest) on push/PR
  * Docker build for API, push to registry
  * EAS Build for iOS/Android on tag/release
  * Deploy API to staging/prod via Docker Compose on VM or Kubernetes (optional)
- Docker Compose (local dev):
  * api (NestJS)
  * db (PostgreSQL + PostGIS)
  * redis
  * (optional) maildev for email preview
- Supabase used optionally for:
  * Auth (email link) as alternative to custom JWT
  * Storage for business images
- Monitoring:
  * API health endpoint
  * React Query devtools in development
  * Error tracking via Sentry (optional)
  * Log aggregation (ELK or Loki)

Service Boundaries
------------------
1. **Mobile App (Expo)** – Presentation only; communicates with API via REST. No direct DB access.
2. **API Gateway (NestJS)** – Entry point; handles auth, validation, routing, rate limiting.
3. **Domain Services** – Encapsulate business logic (booking flow, slot calculation, payment processing).
4. **Data Access Layer** – Prisma models + repositories; abstracts DB.
5. **Caching Layer** – Redis service; transparent to domain.
6. **Background Workers** – BullMQ processors; triggered by domain events (e.g., booking created).
7. **Admin/Provider Portals** – Separate NestJS modules sharing the same DB but with role‑based guards.
8. **Shared Libraries** – Types, UI kit, utils; consumed by both mobile and API (via Nx).

Data Flow Examples
------------------
- **Guest Search**:
  1. Mobile → GET /businesses?lat=&lng=&radius=&category=
  2. API controller validates query, calls BusinessService.
  3. Service checks Redis cache; if miss, queries Prisma with PostGIS ST_DWithin.
  4. Result cached, returned as JSON.
- **Booking Flow**:
  1. Mobile POST /bookings with JWT.
  2. API validates JWT, validates DTO, checks slot availability via Service.
  3. Service creates Booking record, marks TimeSlot as unavailable, creates Payment intent.
  4. Event emitted → BullMQ queue for confirmation email & reminder.
  5. Response returns booking details.
- **Review Submission**:
  1. Mobile POST /reviews with JWT.
  2. API validates, creates Review, updates Business average rating (via trigger or service).
  3. Cached business list invalidated.

Security Considerations
-----------------------
- JWT (access token 15 min, refresh token 7 d) stored in SecureStore (expo‑secure‑store).
- HTTPS enforced; API behind TLS.
- Role‑based access control (USER, PROVIDER, ADMIN).
- Input validation via class‑validator & DTOs.
- Prisma protects against SQL injection.
- Rate limiting via NestJS Throttler.
- Sensitive payment details never stored; delegated to PCI‑compliant gateway (Stripe/PayPal).

Scalability & Performance
-------------------------
- Horizontal scaling of API nodes behind a load balancer.
- Read replicas for PostgreSQL for search‑heavy workloads.
- Redis cluster for caching and BullMQ.
- GIS indexing (GIST) on Point column for fast radius queries.
- Pagination (cursor‑based) for large lists.
- Lazy loading of images via Expo Image with CDN.

Testing Strategy
----------------
- Unit tests: Jest for services, utilities, React hooks.
- Integration tests: Supertest for API endpoints; React Native Testing Library for screens.
- E2E: Detox for critical flows (login → search → book).
- Test coverage target >80 %.

Documentation & Onboarding
--------------------------
- Storybook for UI kit (optional).
- Generated OpenAPI spec from NestJS controllers (Swagger module).
- Internal Confluence/wiki with architecture decisions (ADRs).

Conclusion
----------
This architecture separates concerns, leverages the power of an Nx monorepo for code sharing, uses battle‑tested tools (Expo, NestJS, Prisma, PostGIS, Redis) and provides a clear path to scale from MVP to a production‑ready appointment‑booking platform.
