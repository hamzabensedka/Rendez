We need to escape backslashes in the JSON string. For each backslash in the source, we need to write \\.

Thus we need to go through the content and replace every \ with \\.

Given the content includes many backslashes in code fences (like `\n` not present, but we have `\` in TypeScript code? Not many. We have `\"` maybe not. We have `\` in JSDoc? Not.

But we have `\n` in the description? Not.

We have `\` in the Prisma schema: `@default(uuid())` includes parentheses but not backslashes. `@default(PostGIS.Point(0,0))` no backslash.

We have `\\n` maybe not.

But we have `\` in the Dockerfile? Not.

Thus likely minimal backslashes.

Nevertheless, we need to produce a JSON string; easiest is to produce the content as a raw string with actual newlines, but we need to escape them as \n. We'll produce the content with \n literal.

Thus we will write the content as one line with \n placeholders.

Given the length, it's okay.

Let's produce final JSON.

We'll need to ensure the JSON is valid: outer braces, quotes.

We'll produce:

{
  "content": "...",
  "summary": "..."
}

The summary: one sentence.

Let's craft summary: "The Planity Clone architecture uses a monorepo with Expo React Native mobile client and NestJS backend, separating concerns into domain services, leveraging Prisma/PostGIS, Redis, and BullMQ for scalable appointment booking."

Now produce content.

We'll need to write the content string with \n for newlines.

Let's construct content string manually? That's tedious but we can approximate.

We'll produce the markdown as described, but we need to replace actual newlines with \n.

I'll write the content with visible \n placeholders.

Given length, I will produce a concise version but still complete.

Let's draft a shorter but still covering required parts.

We'll produce:

```
# System Architecture for Planity Clone

## Overview
...

## Technology Stack
...

## High-Level Architecture
...

## Service Boundaries
...

## Folder Structure (Nx Monorepo)
...

## Data Model (Prisma Schema Highlights)
...

## Caching & Background Jobs
...

## Mobile Client Details
...

## DevOps & CI/CD
...

## Security Considerations
...

## Scalability & Extensibility
...

## Testing Strategy
...

## Summary
...
```

Now we need to convert to a single line with \n.

I'll write the content with explicit \n.

Given the need to keep under 6000 words, our content will be far less.

Let's produce final JSON.

We'll need to escape any double quotes inside. We have none.

Let's write.

{
  "content": "# System Architecture for Planity Clone\n\n## Overview\nThe Planity Clone connects users with local service providers for booking appointments. The architecture follows a clean, modular approach using an Nx monorepo and pnpm, separating concerns into mobile client, API gateway, domain services, shared libraries, and infrastructure.\n\n## Technology Stack\n- **Mobile**: Expo, React Native, TypeScript, Expo Router, TanStack React Query, React Native Reanimated\n- **Backend**: NestJS (Node.js), Prisma ORM, PostgreSQL with PostGIS extension, Redis (cache & BullMQ)\n- **DevOps**: Docker Compose, GitHub Actions, EAS Build, Nx, pnpm\n- **Testing**: Jest\n- **Other**: BullMQ for background jobs\n\n## High-Level Architecture\n```\n[Mobile Client] <--HTTPS/WS--> [API Gateway (NestJS)] <---> [PostgreSQL/PostGIS]\n                     |                |\n                     |                --> [Redis (Cache & BullMQ)]\n                     |\n                     --> [Background Workers (BullMQ)]\n```\nThe mobile client talks exclusively to the NestJS API via REST (optional WebSocket for real‑time notifications). The API is split into domain‑oriented modules (Auth, Business, Booking, Payment, Notification, Admin, Provider). Shared libraries contain TypeScript types, UI components, design‑system tokens, and utilities used by both client‑used across mobile and backend. Prisma is the single source of truth for the database schema; migrations are managed via Nx tasks. Redis caches frequent data and backs BullMQ job queues (notifications, payments, slot recomputation). PostGIS enables geographic queries for map‑based search. Docker Compose defines local services (API, PostgreSQL, Redis). CI/CD runs on GitHub Actions: lint, test, build Docker images, push to registry, trigger EAS Build for mobile, and deploy to staging/production. EAS Build handles OTA updates and store builds.\n\n## Service Boundaries\n| Service | Responsibility | Key Endpoints (examples) |\n|---------|----------------|--------------------------|\n| Auth | Registration, login, logout, social auth, JWT issuance | POST /auth/register, POST /auth/login, POST /auth/logout |\n| Business | CRUD for businesses, categories, location, search/filter | GET /businesses, GET /businesses/:id, POST /businesses, PATCH /businesses/:id |\n| Booking | Appointment creation, rescheduling, cancellation, slot computation | GET /bookings, POST /bookings, PATCH /bookings/:id/cancel, PATCH /bookings/:id/reschedule |\n| Payment | Payment gateway integration, transaction recording, refunds | POST /payments, GET /payments/:id, POST /webhooks/:provider |\n| Notification | Template management, sending via email/push/SMS, preference storage | POST /notifications, GET /notifications/me |\n| Admin | User/business moderation, analytics, system settings | GET /admin/users, DELETE /admin/users/:id, POST /admin/businesses/:id/ban |\n| Provider (Business Owner Portal) | Profile, service catalog, booking overview, payouts | GET /provider/profile, PATCH /provider/profile, GET /provider/bookings |\n| Shared | Common DTOs, validation pipes, guards, exception filters, utilities | – |\n\nEach service is a NestJS module within `apps/api`, enabling independent development, testing, and deployment while sharing a common codebase.\n\n## Folder Structure (Nx Monorepo)\n```\nplanity-clone/\n├── apps/\n│   ├── mobile/                 # Expo React Native app\n│   │   ├── src/\n│   │   │   ├── app/            # Expo Router file‑based routes\n│   │   │   │   ├── (tabs)/\n│   │   │   │   │   ├── index.tsx          # home tab (guest browse)\n│   │   │   │   │   ├── search/\n│   │   │   │   │   │   └─ index.tsx\n│   │   │   │   │   ├── map/\n│   │   │   │   │   │   └─ index.tsx\n│   │   │   │   │   ├── business/\n│   │   │   │   │   │   └─ [id]/index.tsx   # business detail\n│   │   │   │   │   ├── booking/\n│   │   │   │   │   │   └─ [id]/index.tsx\n│   │   │   │   │   ├── profile/\n│   │   │   │   │   │   └─ index.tsx\n│   │   │   │   │   ├── provider/\n│   │   │   │   │   │   └─ index.tsx\n│   │   │   │   │   └─ auth/\n│   │   │   │   │       ├─ login.tsx\n│   │   │   │   │       └─ register.tsx\n│   │   │   ├── components/   # Reusable UI (design‑system based)\n│   │   │   ├── hooks/        # Custom React Query hooks\n│   │   │   ├── animations/   # Reanimated worklets\n│   │   │   ├── types/        # Shared TS types (re‑exported from libs/shared-types)\n│   │   │   └── utils/\n│   │   └── assets/\n│   │   └── expo.config.js\n│   └── api/                    # NestJS server\n│       ├── src/\n│       │   ├── auth/\n│       │   │   ├── auth.controller.ts\n│       │   │   ├── auth.service.ts\n│       │   │   └── dto/\n│       │   ├── business/\n│       │   │   ├── business.controller.ts\n│       │   │   ├── business.service.ts\n│       │   │   └── dto/\n│       │   ├── booking/\n│       │   │   ├── booking.controller.ts\n│       │   │   ├── booking.service.ts\n│       │   │   └── dto/\n│       │   ├── payment/\n│       │   │   ├── payment.controller.ts\n│       │   │   ├── payment.service.ts\n│       │   │   └── dto/\n│       │   ├── notification/\n│       │   │   ├── notification.controller.ts\n│       │   │   ├── notification.service.ts\n│       │   │   └── dto/\n│       │   ├── admin/\n│       │   │   ├── admin.controller.ts\n│       │   │   ├── admin.service.ts\n│       │   │   └── dto/\n│       │   ├── provider/\n│       │   │   ├── provider.controller.ts\n│       │   │   ├── provider.service.ts\n│       │   │   └── dto/\n│       │   ├── prisma/         # Prisma schema & migrations\n│       │   │   ├── schema.prisma\n│       │   │   └── migrations/\n│       │   ├── shared/\n│       │   │   ├── guards/\n│       │   │   ├── interceptors/\n│       │   │   ├── pipes/\n│       │   │   └── utils/\n│       │   ├── main.ts\n│       │   └── app.module.ts\n│       └── Dockerfile\n├── libs/\n│   ├── shared-types/           # Domain DTOs, enums, interfaces used by mobile & api\n│   ├── ui-components/          # React Native component library (design‑system)\n│   ├── design-system/          # Tokens (colors, spacing, typography) for both platforms\n│   ├── utils/                  # Helper functions (date, geo, validation)\n│   └── prisma/                 # Re‑exported Prisma client for libs that need it\n├── infra/\n│   ├── docker-compose.yml      # API, PostgreSQL, Redis\n│   └── Dockerfiles/            # Optional per‑service Dockerfiles\n├── .github/\n│   └── workflows/\n│       ├── ci.yml              # lint, test, build\n│       ├── cd-mobile.yml       # EAS Build triggers\n│       └── cd-api.yml          # Docker push & deploy\n├── nx.json\n├── package.json                # pnpm workspace root\n└── tsconfig.base.json\n```\n\n## Data Model (Prisma Schema Highlights)\n```prisma\nmodel User {\n  id            String   @id @default(uuid())\n  email         String   @unique\n  passwordHash  String\n  name          String\n  role          Role     @default(USER)\n  createdAt     DateTime @default(now())\n  updatedAt     DateTime @updatedAt\n  businesses    Business[]   @relation(\"OwnerBusinesses\")\n  appointments  Appointment[] @relation(\"UserAppointments\")\n  favorites     Favorite[]   @relation(\"UserFavorites\")\n  reviews       Review[]     @relation(\"UserReviews\")\n  notifications Notification[] @relation(\"UserNotifications\")\n}\n\nmodel Business {\n  id            String   @id @default(uuid())\n  ownerId       String\n  owner         User     @relation(\"OwnerBusinesses\", fields:[ownerId], references:[id])\n  name          String\n  description   String?\n  address       String\n  latitude      Float\n  longitude     Float\n  location      DbPoint  @default(PostGIS.Point(0,0)) @db.PostgisPoint\n  category      String\n  services      Service[]  @relation(\"BusinessServices\")\n  appointments  Appointment[] @relation(\"BusinessAppointments\")\n  reviews       Review[]   @relation(\"BusinessReviews\")\n  createdAt     DateTime @default(now())\n  updatedAt     DateTime @updatedAt\n}\n\nmodel Service {\n  id        String   @id @default(uuid())\n  businessId String\n  business  Business @relation(\"BusinessServices\", fields:[businessId], references:[id])\n  name      String\n  duration  Int      // minutes\n  price     Float\n}\n\nmodel Appointment {\n  id            String   @id @default(uuid())\n  userId        String\n  user          User     @relation(\"UserAppointments\", fields:[userId], references:[id])\n  businessId    String\n  business      Business @relation(\"BusinessAppointments\", fields:[businessId], references:[id])\n  serviceId     String\n  service       Service  @relation(\"ServiceAppointments\", fields:[serviceId], references:[id])\n  startTime     DateTime\n  endTime       DateTime\n  status        AppointmentStatus @default(PENDING)\n  paymentId     String?    @unique\n  createdAt     DateTime @default(now())\n  updatedAt     DateTime @updatedAt\n}\n// Additional models: Favorite, Review, Notification, PaymentTransaction, etc.\n```\n\n## Caching & Background Jobs\n- **Redis** stores:\n  - Cached business list responses (TTL 5 min) for guest browse.\n  - Geohash‑based proximity caches for map search.\n  - BullMQ job queues (`notifications`, `payments`, `slot-recalc`).\n- **BullMQ Workers** (operated as separate NestJS services or as part of the API with `@nestjs/bull`) process:\n  - Sending push/email notifications after booking, payment, or review.\n  - Payment gateway webhook handling and reconciliation.\n  - Recomputing available slots when a booking changes (triggered via queue to avoid blocking request).\n\n## Mobile Client Details\n- **Expo Router** provides file‑based navigation; route groups `(tabs)` for bottom tab navigation (Home, Search, Map, Bookings, Profile).\n- **TanStack React Query** handles server state:\n  - `useBusinesses`, `useBusinessDetail`, `useAvailableSlots`, etc.\n  - Automatic refetching on focus, optimistic updates for booking/cancel.\n- **React Native Reanimated 2** used for:\n  - Animated tab transitions.\n  - Interactive map markers with spring animations.\n  - Gesture‑based swipe‑to‑cancel appointment card.\n- **Shared Types** imported from `@planity/shared-types` ensure parity between client and server DTOs.\n- **Design System** (`@planity/design-system`) supplies tokens; UI component library (`@planity/ui-components`) builds reusable buttons, inputs, cards, etc.\n- **Authentication Flow**: JWT stored in SecureStore; Axios interceptor attaches token to requests; refresh token route handled via React Query.\n\n## DevOps & CI/CD\n- **Local Development**: `pnpm dev:api` runs NestJS in watch mode; `pnpm dev:mobile` starts Expo dev server.\n- **Docker Compose** (`infra/docker-compose.yml`) spins up:\n  - `api` (NestJS)\n  - `postgres` (with PostGIS extension)\n  - `redis`\n- **GitHub Actions**:\n  - `ci.yml`: `pnpm lint`, `pnpm test --ci`, `pnpm build`.\n  - `cd-api.yml`: on push to `main`, build Docker image, push to registry, trigger rolling update on staging/k8s.\n  - `cd-mobile.yml`: on tag or release, run `eas build --platform all --auto-submit`.\n- **EAS Build** manages OTA updates via `expo-updates`; release channels: `preview`, `production`.\n- **Monitoring** (optional): integrate Sentry for error tracking; use Prometheus + Grafana via Docker sidecar if needed.\n\n## Security Considerations\n- HTTPS enforced; API behind a reverse proxy (NGINX) in prod.\n- JWT with short‑lived access token (15 min) and refresh token rotation.\n- Passwords hashed via bcrypt (Prisma middleware).\n- Rate limiting via NestJS `@ThrottlerGuard`.\n- Input validation using class‑validator & class‑transformer DTOs.\n- Prisma protects against SQL injection; PostGIS queries use parameterized inputs.\n- Webhook endpoints verify signatures (Stripe, PayPal, etc.).\n- Environment variables managed via `.env` files; secrets injected in CI/CD via GitHub Secrets.\n\n## Scalability & Extensibility\n- Monorepo enables shared libraries; new features add a new NestJS module and corresponding mobile screens.\n- Horizontal scaling of API via stateless containers behind a load balancer.\n- Read replicas for PostgreSQL can be added for heavy map/search queries.\n- Redis cluster for higher throughput.\n- Worker services can be scaled independently based on queue depth.\n- Mobile code can be split into feature modules using Expo Router’s lazy loading.\n\n## Testing Strategy\n- **Unit Tests**: Jest for services, utilities, React hooks.\n- **Integration Tests**: Supertest for API endpoints; React Native Testing Library for mobile components.\n- **E2E Tests**: Detox for critical user flows (login → book → cancel).\n- **Database Tests**: Prisma migration test suite using a temporary PostgreSQL instance.\n- **Test Coverage**: Target >80% for critical paths.\n\n## Summary\nThe Planity Clone architecture uses a monorepo with Expo React Native mobile client and NestJS backend, separating concerns into domain services, leveraging Prisma/PostGIS, Redis, and BullMQ for a scalable, maintainable appointment‑booking platform.\n",
  "summary": "The Planity Clone architecture uses