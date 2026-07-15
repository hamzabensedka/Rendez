# Planity Clone Architecture

## 1. Overview
The Planity Clone is a full‑stack mobile‑first application that connects users with local service businesses. It consists of a React Native client built with Expo, a NestJS API server, and shared infrastructure (PostgreSQL/PostGIS, Redis, BullMQ). The architecture follows clean‑architecture principles: clear separation between presentation, domain, and infrastructure layers, with domain‑driven boundaries for Users, Businesses, Appointments, Payments, Reviews, and Admin.

## 2. Technology Stack
- **Client**: Expo (SDK 49), React Native, TypeScript, Expo Router, TanStack React Query, React Native Reanimated, React Native SVG, AsyncStorage (or MMKV) for local cache.
- **Server**: NestJS (Node.js), TypeScript, Prisma ORM, PostgreSQL + PostGIS extension, Redis (caching & pub/sub), BullMQ (job queue).
- **DevOps**: Nx monorepo, pnpm workspace, Docker Compose for local dev, GitHub Actions for CI, EAS Build for Expo OTA & app store builds, Supabase (optional for auth & storage fallback), Jest for unit/integration tests.
- **Design System**: Custom token‑based design system (colors, spacing, typography) built with StyleSheet.create and shared via `libs/ui`.

## 3. High‑Level Components
(Client) Expo App --> (API Gateway) NestJS --> (Services) Business, Auth, Booking, Payment, Review, Notification, Admin --> (Data) PostgreSQL/PostGIS + Redis --> (External) Payment Gateway (Stripe), Email Provider (SendGrid), Push Notifications (Expo Push/Firebase)

## 4. Folder Structure (Nx Monorepo)
planity-clone/
├─ apps/
│   ├─ mobile/            # Expo React Native app
│   │   ├─ src/
│   │   │   ├─ assets/            # images, fonts, icons
│   │   │   ├─ components/        # reusable UI (buttons, cards, modals)
│   │   │   ├─ screens/           # Expo Router route‑based screens
│   │   │   ├─ navigation/        # custom navigators (if needed)
│   │   │   ├─ hooks/             # custom React hooks
│   │   │   ├─ lib/               # utils, constants, API client
│   │   │   ├─ store/             # React Query query keys & mutators
│   │   │   ├─ theme/             # design tokens, StyleSheet helpers
│   │   │   ├─ types/             # shared TS interfaces (re‑exported from libs/types)
│   │   │   └─ App.tsx            # root entry (Expo Router)
│   │   ├─ e2e/                   # Detox tests
│   │   ├─ __tests__/             # Jest unit tests
│   │   ├─ app.json
│   │   ├─ babel.config.js
│   │   ├─ tsconfig.json
│   │   └─ expo.config.js
│   └─ api/                     # NestJS server
│       ├─ src/
│       │   ├─ app.module.ts
│       │   ├─ main.ts
│       │   ├─ config/            # env validation (nestjs/config)
│       │   ├─ common/            # guards, interceptors, pipes, exceptions
│       │   ├─ auth/              # JWT strategy, local & social strategies
│       │   ├─ users/             # CRUD, profile
│       │   ├─ businesses/        # business CRUD, geo search (PostGIS)
│       │   ├─ services/          # service catalog, categories
│       │   ├─ appointments/      # booking logic, slot generation
│       │   ├─ payments/          # Stripe integration, webhook handler
│       │   ├─ reviews/           # rating & review CRUD
│       │   ├─ notifications/     # BullMQ processors, email/sms send
│       │   ├─ admin/             # admin‑only endpoints
│       │   ├─ libs/              # shared NestJS utilities (prisma service, redis wrapper)
│       │   ├─ prisma/            # schema.prisma, migrations
│       │   └─ test/              # unit & e2e (Jest, SuperTest)
│       ├─ Dockerfile
│       ├─ .env.example
│       └─ tsconfig.json
├─ libs/
│   ├─ types/                     # shared DTOs & domain interfaces (used by both client & server)
│   ├─ ui/                        # design system components (Button, Input, Card, etc.)
│   ├─ utils/                     # cross‑platform helpers (date, geo, formatting)
│   ├─ config/                    # shared constants (API endpoints, feature flags)
│   └─ testing/                   # test helpers, mocks
├─ docker-compose.yml
├─ .github/
│   └─ workflows/
│       ├─ ci.yml                 # lint, test, build
│       └─ cd.yml                 # EAS build & deploy, Docker push
├─ nx.json
├─ package.json
├─ pnpm-workspace.yaml
└─ README.md

## 5. Service Boundaries (Domain‑Driven)
| Bounded Context | Responsibility | Key Entities | Main APIs (NestJS) |
|-----------------|----------------|--------------|--------------------|
| Auth | Registration, login, password reset, social OAuth, JWT issuance | User, AuthToken | POST /auth/register, POST /auth/login, POST /auth/refresh, POST /auth/logout |
| Users | Profile management, preferences, favorites | User, Favorite | GET /users/me, PATCH /users/me, GET /users/favorites, POST /users/favorites/:businessId |
| Businesses | CRUD, geo‑search, categories, operating hours | Business, Category, OperatingHour | GET /businesses, GET /businesses/:id, POST /businesses, PATCH /businesses/:id, GET /businesses/search?lat=&lng=&radius=&category= |
| Services | Service catalog tied to businesses | Service, Category | GET /services, GET /services/:id, POST /services (business‑scoped) |
| Appointments | Availability computation, slot generation, booking, rescheduling, cancellation | Appointment, TimeSlot, BusinessHours | GET /appointments (user), POST /appointments, PATCH /appointments/:id, DELETE /appointments/:id, GET /businesses/:businessId/slots?date= |
| Payments | Payment intent creation, webhook handling, invoices | Payment, Invoice | POST /payments/create-intent, POST /payments/webhook (Stripe), GET /payments/:id |
| Reviews | Ratings, comments, business responses | Review, ReviewResponse | GET /reviews?businessId=&page=, POST /reviews, PATCH /reviews/:id (business response) |
| Notifications | Email/SMS/push delivery, preference management | NotificationTemplate, UserNotificationPreference | POST /notifications/send (internal), GET /users/me/notification-prefs, PATCH /users/me/notification-prefs |
| Admin | Platform oversight, moderation, analytics | AdminUser, AuditLog | GET /admin/users, PATCH /admin/users/:id/status, GET /admin/metrics |
| Background Jobs (BullMQ) | Async tasks: send confirmation emails, push reminders, payment retry, data cleanup | Job Queues: email, push, payment-retry, cleanup | Internal only – triggered via NestJS services |

## 6. Data Model (Prisma Schema Highlights)
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  passwordHash  String
  name          String
  role          Role     @default(USER)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  favorites     Business[] @relation("UserFavorites")
  appointments  Appointment[]
  reviews       Review[]
}

model Business {
  id            String   @id @default(uuid())
  name          String
  description   String?
  address       String
  lat           Float
  lng           Float
  location      Point?   @db.Point
  categoryId    String
  category      Category @relation(fields: [categoryId], references: [id])
  operatingHours OperatingHour[]
  services      Service[]
  appointments  Appointment[]
  reviews       Review[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Category {
  id   String @id @default(uuid())
  name String @unique
  businesses Business[]
  services Service[]
}

model Service {
  id          String   @id @default(uuid())
  name        String
  durationMin Int      // minutes per slot
  price       Float
  businessId  String
  business    Business @relation(fields: [businessId], references: [id])
  categoryId  String?
  category    Category @relation(fields: [categoryId], references: [id])
}

model Appointment {
  id            String   @id @default(uuid())
  userId        String
  businessId    String
  serviceId     String
  startDateTime DateTime
  endDateTime   DateTime
  status        AppointmentStatus
  paymentId     String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  user          User     @relation(fields: [userId], references: [id])
  business      Business @relation(fields: [businessId], references: [id])
  service       Service  @relation(fields: [serviceId], references: [id])
  payment       Payment? @relation(fields: [paymentId], references: [id])
}

model Payment {
  id            String   @id @default(uuid())
  amount        Float
  currency      String   @default("usd")
  stripeIntentId String @unique
  status        PaymentStatus
  appointment   Appointment? @relation(fields: [appointmentId], references: [id])
  appointmentId String?
  createdAt     DateTime @default(now())
}

(Plus enums, indexes on `location` for PostGIS, and `UserNotificationPreference` table.)

## 7. API Contract Principles
- **Versioning**: `/api/v1/` prefix.
- **Response Envelope**: `{ success: boolean, data?: T, error?: { code:string, message:string } }`.
- **Pagination**: `limit` & `offset` (or cursor) for lists.
- **Filtering**: Query params (`?category=hair&lat=48.85&lng=2.35&radius=5000`).
- **Error Handling**: Central NestJS exception filter maps to HTTP status codes.
- **Authentication**: JWT Bearer token in `Authorization` header; public routes (guest browse) omit token.
- **Rate Limiting**: Per‑IP & per‑user via NestJS throttler.
- **Validation**: class‑validator + class‑transformer DTOs.

## 8. Client State Management
- **TanStack React Query** handles server state: queries for lists, mutations for writes.
- Query keys are namespaced: `['businesses',{lat,lng,radius}]`, `['appointments','me']`.
- Mutations invalidate related queries optimistically.
- **Local UI state** (modals, form inputs) managed with React `useState` or `useReducer`.
- **Authentication** state persisted via `AsyncStorage` (or MMKV) and refreshed silently via a background query.

## 9. Design System & Styling
- Tokens defined in `libs/ui/theme.ts` (colors, spacing, radius, typography).
- Components built with `StyleSheet.create` and styled via props (variant, size).
- Dark mode support via `useColorScheme`.
- Shared via Nx lib; both mobile and any future web apps can consume.

## 10. DevOps & CI/CD
- **Local Dev**: `docker compose up` runs PostgreSQL (with PostGIS), Redis, NestJS API, and Expo dev server.
- **Nx**: Affected commands (`nx affected:test`, `nx affected:build`) for monorepo efficiency.
- **GitHub Actions**:
  - `ci.yml`: lint (eslint, prettier), typecheck (`tsc`), unit tests (Jest), build Docker image.
  - `cd.yml`: on push to `main`, trigger EAS build (`eas build --platform all --auto-submit`) and push Docker image to registry.
- **EAS Build**: Manages iOS/Android binaries, OTA updates via Expo.
- **Supabase** (optional): fallback for auth & storage if needed; not primary.

## 11. Testing Strategy
- **Unit Tests**: Jest for pure functions, utility libs, NestJS services (mocked Prisma/Redis).
- **Integration Tests**:
  - Client: React Native Testing Library + Jest for screen rendering & query mocking.
  - Server: SuperTest against in‑memory SQLite (or testcontainers PostgreSQL) to validate endpoints.
- **E2E**: Detox for critical flows (login → browse → book → confirmation).
- **Contracts**: Pact or manual schema validation to ensure client‑server DTO alignment.
- **Coverage Target**: ≥80% for business logic.

## 12. Security Considerations
- **Authentication**: JWT with short‑lived access token (15 min) + refresh token stored HTTP‑only cookie (or‑secure storage.
- **Authorization**: Role‑based guards (`ADMIN`, `BUSINESS_OWNER`, `USER`).
- **Data Protection**: TLS everywhere; password hashed with bcrypt; PII encrypted at rest (PGPDB extension optional).
- **Input Validation**: DTO whitelisting, Prisma prevents SQL injection.
- **Rate Limiting & Brute‑Force**: NestJS throttler + captcha on login after N failures.

- **Secrets**: Managed via GitHub Actions secrets & Docker secrets; `.env` never committed.
- **Audit Log**: Admin actions logged to `AuditLog` table.

## 13. Deployment Overview
1. **Developer** pushes feature branch → CI runs lint, test, build.
2. **Merge to main** triggers CD:
   - Docker image built & pushed to registry (e.g., GHCR).
   - NestJS API deployed to Kubernetes / ECS (or simple VM) with rolling update.
   - Expo OTA update released via EAS; optional store build for iOS/Android.
3. **Database migrations** run automatically on startup via Prisma Migrate (or via separate migration job).
4. **Redis** persisted via Docker volume or managed Elasticache.
5. **Monitoring**: Prometheus + Grafana for API metrics; Expo logs via Sentry; application logs shipped to Loki.

## 14. Summary
The architecture separates concerns into clearly defined bounded contexts, leverages an Nx monorepo for code sharing, uses Expo + React Native for a performant mobile client, and relies on NestJS/Prisma/PostgreSQL for a scalable backend. Clean‑layered design, strong typing, and automated CI/CD ensure maintainability and rapid iteration as the Planity Clone grows.
