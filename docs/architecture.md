# Planity Clone System Architecture

## Overview
The Planity Clone is a full‑stack application that enables users to discover, book, and manage appointments with local service businesses. The solution consists of a mobile client built with Expo and React Native, a NestJS API server, and optional web portals for business owners and administrators. All services share a PostgreSQL database with PostGIS for location‑based queries, Redis for caching and job queuing, and use Supabase for authentication and file storage. The monorepo is managed with Nx and pnpm, with Docker Compose for local development and GitHub Actions for CI/CD. Builds for the mobile app are handled by EAS Build.

## Tech Stack
- **Mobile**: Expo, React Native, TypeScript, Expo Router, TanStack React Query, React Native Reanimated
- **API**: NestJS, TypeScript, Prisma ORM, PostgreSQL, PostGIS, Redis, BullMQ (via Redis)
- **Auth & Storage**: Supabase (Auth, Storage)
- **Monorepo**: Nx, pnpm
- **DevOps**: Docker Compose, GitHub Actions, EAS Build
- **Testing**: Jest (unit, integration, e2e)

## High-Level Architecture
[Mobile App] <-- HTTPS --> [API Gateway (NestJS)] <---> [PostgreSQL + PostGIS]
                              ^                     |
                              |                     v
                              <---> [Redis] <-> [BullMQ Workers]
                              |
                              v
                         [Supabase Auth/Storage]

The mobile app communicates exclusively with the NestJS API via RESTful endpoints (or GraphQL if preferred). The API handles business logic, data access, and integrates with Supabase for user authentication and file uploads. Redis caches frequent queries and backs the BullMQ job queue for asynchronous tasks (e.g., sending notifications, processing payments). PostGIS enables efficient geo‑queries for map‑based search and discovery.

## Service Boundaries
1. **Mobile Client (apps/mobile)**
   - UI layer, navigation, state management, offline caching, deep linking.
   - Responsibilities: presentation, user interactions, local state via React Query, animations via Reanimated.

2. **API Server (apps/api)**
   - NestJS modules organized by domain: Auth, Business, Service, Booking, Payment, Notification, Admin, ProviderPortal.
   - Each module contains controllers, services, DTOs, and guards.
   - Data access via Prisma service layer.
   - Background job processing via BullMQ processors.

3. **Shared Libraries (libs)**
   - **types**: shared TypeScript interfaces (e.g., User, Business, Appointment) used across mobile and API.
   - **ui**: reusable React Native components (buttons, cards, modals) styled with the design system.
   - **design-system**: tokens, themes, typography.
   - **utils**: helper functions (date formatting, geo calculations, validation).
   - **api-client**: generated or hand‑written wrapper around NestJS endpoints for React Query.

4. **Infrastructure (infra)**
   - Docker Compose file defining services: postgres, redis, supabase (studio/kong optional), api, mobile (expo devclient).
   - Kubernetes/Helm charts optional for production.

## Folder Structure (Nx Monorepo)
planity-clone/
├─ apps/
│   ├─ api/                 # NestJS server
│   │   ├─ src/
│   │   │   ├─ main.ts
│   │   │   ├─ app.controller.ts
│   │   │   ├─ app.module.ts
│   │   │   ├─ auth/
│   │   │   │   ├─ auth.controller.ts
│   │   │   │   ├─ auth.service.ts
│   │   │   │   └─ dto/
│   │   │   ├─ business/
│   │   │   ├─ service/
│   │   │   ├─ booking/
│   │   │   ├─ payment/
│   │   │   ├─ notification/
│   │   │   ├─ admin/
│   │   │   ├─ provider/
│   │   │   └─ common/
│   │   │       ├─ guards/
│   │   │       ├─ interceptors/
│   │   │       └─ prisma/
│   │   ├─ test/
│   │   └─ nest-cli.json
│   └─ mobile/              # Expo React Native app
│       ├─ src/
│       │   ├─ app/         # Expo Router file‑based routes
│       │   │   ├─ (tabs)/
│       │   │   │   ├─ home.tsx
│       │   │   │   ├─ search.tsx
│       │   │   │   ├─ map.tsx
│       │   │   │   ├─ bookings.tsx
│       │   │   │   └─ profile.tsx
│       │   ├─ login.tsx
│       │   ├─ register.tsx
│       │   └─ ...  
│       │   ├─ components/  # reusable UI (from libs/ui)
│       │   ├─ hooks/       # custom React Query hooks
│       │   ├─ utils/
│       │   └─ assets/
│       ├─ app.json
│       ├─ eas.json
│       └─ tsconfig.json
├─ libs/
│   ├─ types/
│   │   └─ src/
│   │       ├─ index.ts
│   │       ├─ user.ts
│   │       ├─ business.ts
│   │       ├─ service.ts
│   │       ├─ booking.ts
│       │       └─ ...
│   ├─ ui/
│   │   └─ src/
│   │       ├─ components/
│   │       │   ├─ Button.tsx
│   │       │   ├─ Card.tsx
│   │       │   └─ ...
│   ├─ design-system/
│   │   └─ src/
│   │       ├─ tokens.ts
│   │       └─ theme.ts
│   ├─ utils/
│   │   └─ src/
│   │       ├─ geo.ts
│   │       ├─ date.ts
│   │       └─ validation.ts
│   └─ api-client/
│       └─ src/
│           ├─ index.ts
│           └─ query.ts
├─ infra/
│   ├─ docker-compose.yml
│   └─ Dockerfiles/
│       ├─ api.Dockerfile
│       └─ mobile.Dockerfile
├─ tools/
│   └─ scripts/
├─ .github/
│   └─ workflows/
│       ├─ ci.yml
│       └─ release.yml
├─ nx.json
├─ package.json
└─ pnpm-workspace.yaml

## Data Models (Prisma Schema Highlights)
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  name          String?
  role          Role     @default(USER)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  businesses    Business[] @relation("OwnerBusinesses")
  appointments  Appointment[] @relation("ClientAppointments")
  reviews       Review[]   @relation("AuthorReviews")
}

model Business {
  id            String   @id @default(uuid())
  name          String
  address       String
  latitude      Float
  longitude     Float
  location      Point?   @db.Point
  category      String
  phone         String?
  description   String?
  ownerId       String
  owner         User     @relation("OwnerBusinesses", fields: [ownerId], references: [id])
  services      Service[]
  workingHours  WorkingHour[]
  reviews       Review[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  @@index([location])
}

model Service {
  id            String   @id @default(uuid())
  name          String
  durationMin   Int
  price         Float
  businessId    String
  business      Business @relation(fields: [businessId], references: [id])
  slots         Slot[]
}

model Slot {
  id            String   @id @default(uuid())
  startTime     DateTime
  endTime       DateTime
  isAvailable   Boolean  @default(true)
  serviceId     String
  service       Service  @relation(fields: [serviceId], references: [id])
  booking       Booking? @relation(optional: true)
}

model Appointment {
  id            String   @id @default(uuid())
  clientId      String
  client        User     @relation("ClientAppointments", fields: [clientId], references: [id])
  serviceId     String
  service       Service  @relation(fields: [serviceId], references: [id])
  slotId        String
  slot          Slot     @relation(fields: [slotId], references: [id])
  status        AppointmentStatus @default(PENDING)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Review {
  id            String   @id @default(uuid())
  authorId      String
  author        User     @relation("AuthorReviews", fields: [authorId], references: [id])
  businessId    String
  business      Business @relation(fields: [businessId], references: [id])
  rating        Int
  comment       String?
  response      String?
  createdAt     DateTime @default(now())
}

## API Design (RESTful)
- **Auth**: `POST /auth/register`, `POST /auth/login`, `POST /auth/forgot-password`, `POST /auth/reset-password`
- **Business**: `GET /businesses` (search, filters, pagination), `GET /businesses/:id`, `GET /businesses/:id/services`
- **Service**: `GET /services/:id`, `GET /services/:id/slots`
- **Booking**: `POST /bookings`, `GET /bookings/my`, `PATCH /bookings/:id/reschedule`, `DELETE /bookings/:id/cancel`
- **Payment**: `POST /payments/create-intent` (Stripe placeholder), `POST /payments/webhook`
- **Notification**: `GET /notifications`, `POST /notifications/mark-read`
- **Provider Portal**: `GET /provider/business`, `PATCH /provider/business/:id`, `POST /provider/service`, etc.
- **Admin**: `GET /admin/users`, `GET /admin/businesses`, etc.
All endpoints are guarded by JWTAuthGuard (Supabase JWT validation) and role‑based guards (ADMIN, PROVIDER, USER). DTOs use class‑validator. Responses wrap data in `{ data, meta }` format.

## Mobile App Architecture
- **Navigation**: Expo Router provides file‑based routing; bottom tab bar for Home, Search, Map, Bookings, Profile.
- **State Management**: TanStack React Query handles server state; query keys are namespaced (`['businesses']`, `['business', id]`). Mutations for create/update/delete.
- **UI Layer**: Components sourced from `@planity/ui` library; themed via design system tokens.
- **Animations**: React Native Reanimated used for transitional gestures (e.g., swipe to cancel booking, map marker animation).
- **Location & Maps**: Expo Location + MapView (or react-native-maps) with PostGIS-backed geo queries; map markers rendered via FlatList.
- **Offline & Caching**: React Query’s stale‑while‑revalidate strategy; optional AsyncStorage for caching user preferences.
- **Deep Linking**: Expo Linking for handling appointment confirmation links from email/SMS.
- **Push Notifications**: Expo Notifications service; token stored on user record via API.
- **Form Handling**: React Hook Form with Yup validation (shared validation utils).
- **Testing**: Jest + React Native Testing Library for unit/component tests; E2E with Detox (optional).

## Backend Architecture
- **NestJS Modules**: Each domain is a module; modules are lazy‑loaded where appropriate.
- **Prisma Service**: Centralized PrismaClient wrapper providing transaction utilities.
- **Validation**: Pipe using class‑validator & class‑transformer.
- **Authentication**: Strategy using Supabase JWT; custom `JwtAuthGuard` extracts user ID and role.
- **Authorization**: `RolesGuard` checks metadata on controllers.
- **Background Jobs**: BullMQ queues defined in `queues/` (e.g., `notificationQueue`, `paymentQueue`). Processors reside in corresponding services.
- **Caching**: Redis wrapper service; `@Cacheable()` decorator for get‑businesses, get‑services.
- **Error Handling**: Global exception filter transforms exceptions to uniform JSON responses.
- **Testing**: Jest for unit/controller tests; SuperTest for endpoint integration tests; Prisma uses SQLite in-memory for test schema.
- **Docker**: Multi‑stage build; Node base, install dependencies, compile TS, run migrations.

## DevOps & Infrastructure
- **Local Development**: `docker compose up` starts postgres, redis, supabase (studio optional), and the API in watch mode; Expo dev client runs separately.
- **Environment Variables**: Stored in `.env` files; Supabase URL/anon key, JWT secret, Redis URL, Database URL.
- **Production**: 
  - API deployed to a container platform (e.g., Fly.io, AWS ECS) with rolling updates.
  - Database managed Supabase Postgres (or self‑hosted with backups).
  - Redis supplied by managed service (Redis Labs/AWS Elasticache).
  - BullMQ workers run as separate containers scaling based on queue depth.
  - Mobile app binaries built via EAS Build; distribution through App Store/Google Play.
  - CDN for static assets (Supabase Storage).
- **Monitoring**: 
  - API: Prometheus metrics via `@nestjs/prometheus`; logs sent to Loki or CloudWatch.
  - Mobile: Sentry for error tracking, Firebase Performance.
- **Security**: 
  - HTTPS enforced; Helmet middleware; rate limiting; input sanitization.
  - Supabase handles password hashing and email verification.
  - JWT short‑lived (15 min) with refresh token rotation.
  - Stripe (or similar) for PCI‑DSS compliant payment processing.

## CI/CD (GitHub Actions)
- **Workflow `.github/workflows/ci.yml`**
  - Trigger on push/PR to main.
  - Steps: checkout, setup pnpm, install, lint (eslint), type‑check (tsc), run unit tests (Jest) for api, mobile, libs.
  - Build Docker images for api and push to registry (on tag).
  - Run Expo prebuild and run EAS build preview (optional).
- **Workflow `.github/workflows/release.yml`**
  - Trigger on release tag.
  - Steps: similar to CI, plus:
    - Publish npm packages for libs (if any).
    - Deploy API to production.
    - Distribute mobile binaries via EAS to stores.

## Conclusion
This architecture separates concerns clearly, leverages a monorepo for code sharing, and uses proven scalable technologies. It supports the feature set outlined in the product spec while maintaining maintainability and extensibility for future enhancements.
