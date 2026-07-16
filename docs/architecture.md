We need to escape double quotes and backslashes.

Simplify: Instead of trying to manually escape everything, we can produce content with minimal double quotes and no backslashes. Use single quotes for strings in code blocks? But Prisma syntax uses double quotes for string literals? Actually Prisma uses double quotes for string literals, e.g., `@default(uuid())` no quotes. Strings in Prisma are not quoted. So we can avoid double quotes entirely in code blocks by not using string literals. Eg: `model User { id String @id @default(uuid()) email String @unique }` no double quotes. Good.

In JSON examples we might need double quotes; we can avoid JSON examples or use single quotes. We'll avoid JSON examples.

Thus we can produce content with no double quotes at all, only single quotes and backticks. Then we only need to escape backslashes (if any). We have backslashes in code like `\n`? Not needed. We have backslashes in file paths? We used forward slashes. So we can avoid backslashes.

Thus we can produce content with zero double quotes. Then we just need to ensure any backslashes are escaped (but we won't have any). However we have code fences with triple backticks, which are fine.

Let's craft content without any double quotes.

We'll write:

```
# Planity Clone Architecture

## Overview
...

## Tech Stack
- Mobile: 'Expo', 'React Native', 'TypeScript', 'Expo Router', 'TanStack React Query', 'React Native Reanimated'
- Backend: 'NestJS', 'Prisma', 'PostgreSQL', 'PostGIS', 'Redis', 'BullMQ'
- Monorepo: 'Nx', 'pnpm'
- CI/CD: 'GitHub Actions', 'EAS Build', 'Docker Compose'
- Testing: 'Jest'
- Optional: 'Supabase'

## High-Level Architecture
...

## Folder Structure
```
planity-clone/
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   ├── prisma/
│   │   │   ├── bull/
│   │   │   ├── middleware/
│   │   │   └── main.ts
│   │   ├── test/
│   │   └── Dockerfile
│   └── mobile/
│       ├── src/
│       │   ├── components/
│       │   ├── screens/
│       │   ├── navigation/
│       │   ├── hooks/
│       │   ├── lib/
│       │   └── assets/
│       ├── test/
│       ├── app.json
│       └── eas.json
├── libs/
│   ├── design-system/
│   ├── types/
│   ├── utils/
│   └── eslint-config/
├── infrastructure/
│   ├── docker-compose.yml
│   └── prisma/
│       └── schema.prisma
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── cd.yml
└── README.md
```

## Service Boundaries
| Service | Responsibility | Technology |
|---------|----------------|------------|
| Auth Service | User registration login password reset social login JWT issuance | NestJS Passport Prisma |
| Business Service | CRUD businesses categories geospatial search | NestJS Prisma PostGIS |
| Service Catalog | Services offered by businesses pricing duration | NestJS Prisma |
| Booking Service | Slot computation appointment creation rescheduling cancellation | NestJS BullMQ Prisma |
| Appointment Service | User appointment history reminders | NestJS Redis BullMQ |
| Favorite Service | User favorited businesses services | NestJS Prisma |
| Review Service | Ratings comments | NestJS Prisma |
| Payment Service | Integration with payment gateway Stripe PayPal | NestJS external SDK |
| Notification Service | Send push email SMS via BullMQ workers | BullMQ Redis Expo Push |
| Admin Service | Dashboard analytics user business management | NestJS Prisma |
| Provider Portal | Business owner CRUD listings services appointments | NestJS Prisma |
| Shared Library | Design system types utils | React Native design-system TypeScript libs/types libs/utils |

## Data Model Prisma
```
model User {
  id String @id @default(uuid())
  email String @unique
  password String
  role Role @default(USER)
  businesses Business[]
  appointments Appointment[]
  favorites Favorite[]
  reviews Review[]
}
model Business {
  id String @id @default(uuid())
  name String
  description String?
  address String
  location Point @db.Postgis
  category String
  services Service[]
  openingHours Json?
}
model Service {
  id String @id @default(uuid())
  businessId String
  business Business @relation(fields: [businessId], references: [id])
  name String
  durationMin Int
  price Float
  appointments Appointment[]
}
model Appointment {
  id String @id @default(uuid())
  userId String
  user User @relation(fields: [userId], references: [id])
  serviceId String
  service Service @relation(fields: [serviceId], references: [id])
  startTime DateTime
  endTime DateTime
  status AppointmentStatus
}
model Favorite {
  id String @id @default(uuid())
  userId String
  user User @relation(fields: [userId], references: [id])
  businessId String?
  business Business? @relation(fields: [businessId], references: [id])
  serviceId String?
  service Service? @relation(fields: [serviceId], references: [id])
}
model Review {
  id String @id @default(uuid())
  userId String
  user User @relation(fields: [userId], references: [id])
  businessId String?
  business Business? @relation(fields: [businessId], references: [id])
  serviceId String?
  service Service? @relation(fields: [serviceId], references: [id])
  rating Int
  comment String?
}
enum Role { USER ADMIN PROVIDER }
enum AppointmentStatus { PENDING CONFIRMED COMPLETED CANCELLED }
```

## API Contracts
The NestJS API exposes REST endpoints under /api/v1. Examples:
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- GET /api/v1/businesses?lat=&lng=&radius=&category=
- GET /api/v1/businesses/:id
- POST /api/v1/bookings
- GET /api/v1/users/me/appointments
- POST /api/v1/notifications/send
Responses use envelope { success data error }.

## State Management Mobile
React Query handles server state. Local UI state uses React useState/useReducer. Reanimated drives gesture based animations.

## Authentication Flow
1. User submits credentials mobile calls /api/v1/auth/login.
2. Backend validates issues JWT access token refresh token.
3. Token stored securely expo-secure-store.
4. React Query attaches token via fetch interceptor.
5. Refresh token flow handled silently on expiry.

## Geospatial Search
PostgreSQL PostGIS stores business location as Point.
Backend provides GET /businesses/near with latitude longitude radius.
Query uses ST_DWithin for radius search.
Mobile displays results on MapView with clustering.

## Background Jobs BullMQ
- Slot Calculation Job runs nightly or on business hours change computes available slots per service stores in Slot table or cache.
- Notification Job processes queue to send push notifications via Expo push API.
- Analytics Aggregation nightly roll up of booking metrics.
Workers defined in apps/api/src/bull/ orchestrated via NestJS OnModuleInit.

## Payment Integration
Checkout screen uses PCI compliant SDK Stripe Elements.
Mobile calls /api/v1/payments/create-intent.
Backend creates PaymentIntent returns client secret.
After successful payment backend marks appointment CONFIRMED.

## Notifications
Expo Push Notification service used for mobile.
Backend pushes messages to Redis backed BullMQ queue workers fetch and call Expo API.
Users can toggle notification types in settings stored in User preferences.

## Provider Business Owner Portal
Separate screens under /provider/* protected by role PROVIDER.
Calls to provider specific endpoints e.g /api/v1/provider/businesses.
Allows CRUD of business profile services opening hours viewing appointments.

## Admin Dashboard
Web admin panel could be built with Next.js or Expo web shares same API.
Endpoints under /api/v1/admin/* protected by ADMIN role.

## DevOps CI CD
Local Development: docker compose.yml spins up PostgreSQL with PostGIS extension Redis optional Maildev.
Backend: Dockerfile builds NestJS image deployed to container platform e.g AWS ECS Fly io.
Mobile: EAS Build creates iOS Android binaries GitHub Actions workflow runs eas build --platform all on tag push.
CI: On each PR GitHub Actions runs lint nx lint test nx test build nx build api mobile.
CD: On merge to main workflow pushes Docker images to registry triggers EAS build deploys to staging via docker compose or kubernetes.
Monitoring: Health endpoint /health logs shipped to centralized service Loki.

## Testing Strategy
Unit Tests: Jest for services utilities React components.
Integration Tests: Supertest for API endpoints React Native Testing Library for screens.
E2E: Detox for critical flows login search booking.
Coverage target >80% core logic.

## Shared Types Design System
libs/types contains DTO enums API response types generated via prisma ts plugin or manual sync.
libs design-system provides tokens spacing color typography reusable components Button Input Card built with React Native Reanimated.
Consumed by apps mobile and any admin web apps.

## Security Considerations
JWTs signed with strong secret refresh tokens rotated.
Passwords hashed with bcrypt.
Rate limiting on auth endpoints.
Input validation via class validator DTOs.
SQL injection prevented by Prisma ORM.
Geo queries use parameterized PostGIS functions.
Payment data never touches our servers PCI compliant SDK.
Environment variables via .env never committed.

## Scalability Performance
Read heavy ops business search served via Redis cache of recent queries.
Write heavy ops booking processed asynchronously via BullMQ to smooth spikes.
Horizontal scaling of API containers behind load balancer.
Database read replicas for geo search workloads.
Image assets via CDN Supabase storage or AWS S3.

## Conclusion
This architecture gives a clean modular foundation for Planity Clone enabling rapid feature development while maintaining scalability maintainability operational excellence. Monorepo encourages code sharing between mobile and backend. Tech stack aligns with requirements for real time geospatial search complex booking logic polished UX.
```

Now we need to ensure there are no double quotes. I used single quotes around tech names, and I avoided double quotes elsewhere. Check for any accidental double quotes: In the list I used single quotes around each item, separated by commas. That's fine. In code blocks I used no double quotes. In the table I used no double quotes. In the API Contracts section I wrote examples with slashes and question marks, no double quotes. In the envelope I wrote { success data error } no quotes. Good.

Now we need to produce JSON with content string where newlines are escaped as \n and any double quotes escaped (none). Also need to escape backslashes if any. We have backslashes in code like `\n`? Not present. We have backslashes in `Point    @db.Postgis` none. We have backslashes in `default(uuid())` none. We have backslashes in `openingHours Json?` none. We have backslashes in `DateTime` none. We have backslashes in `expo-secure-store` none. We have backslashes in `npm`? none. We have backslashes in `docker-compose.yml` none. So we are safe.

Now we need to produce JSON:

{
  "content": "...the markdown with newlines replaced by \\n...",
  "summary": "Architecture document outlining monorepo structure, mobile frontend with Expo/React Native, backend NestJS services, data layer with Prisma/PostGIS, caching with Redis, background jobs with BullMQ, CI/CD with GitHub Actions, EAS Build, and shared types/design system."
}

We must ensure the content string is a single line with \n for line breaks. We'll need to convert the markdown we wrote into a single line with \n. That's tedious but doable manually? We'll produce approximate.

We'll need to be careful to escape any backslashes that appear in the markdown (like in file paths we used forward slashes, fine). Also we need to escape any double quotes (none). Also need to escape any backslashes that appear as part of \n in the markdown? We don't have any literal \n sequences; we only want to represent newlines as \n in JSON. So we will replace each actual newline in the markdown with the two characters backslash-n.

Thus we need to take the markdown block and produce a string where each line ends with \n. We'll do that manually by writing the content with explicit \n.

Given the length, we can produce a concise version but still complete. Let's craft a shorter markdown but still covering required sections. We'll produce maybe ~15 lines? But need to be complete. We'll produce a moderate length.

I'll write the markdown content as a series of lines separated by \n.

Let's construct:

Line1: "# Planity Clone Architecture"
Line2: ""
Line3: "## Overview"
Line4: "This document describes the complete system architecture for the Planity Clone mobile application. The solution follows a clean architecture with clear separation of concerns, leveraging a monorepo managed by Nx and pnpm. The mobile client is built with Expo and React Native, while the server side uses NestJS with Prisma ORM accessing a PostgreSQL database extended with PostGIS for geospatial queries. Redis provides caching and Pub/Sub, BullMQ handles background jobs, and Supabase can be used for optional authentication/storage. CI/CD is orchestrated via GitHub Actions, with EAS Build for mobile builds and Docker Compose for local development."
Line5: ""
Line6: "## Tech Stack"
Line7: "- Mobile: 'Expo', 'React Native', 'TypeScript', 'Expo Router', 'TanStack React Query', 'React Native Reanimated'"
Line8: "- Backend: 'NestJS', 'Prisma', 'PostgreSQL', 'PostGIS', 'Redis', 'BullMQ'"
Line9: "- Monorepo: 'Nx', 'pnpm'"
Line10: "- CI/CD: 'GitHub Actions', 'EAS Build', 'Docker Compose'"
Line11: "- Testing: 'Jest'"
Line12: "- Optional: 'Supabase'"
Line13: ""
Line14: "## High-Level Architecture"
Line15: "The system is split into three main layers:"
Line16: "1. Presentation Layer – Expo mobile app (apps/mobile) consuming REST/GraphQL APIs via React Query."
Line17: "2. Application Layer – NestJS API (apps/api) containing controllers, services, and use‑case logic."
Line18: "3. Infrastructure Layer – Databases (PostgreSQL/PostGIS), Redis, BullMQ workers, and file storage (Supabase or local)."
Line19: ""
Line20: "## Folder Structure"
Line21: "```"
Line22: "planity-clone/"
Line23: "├── apps/"
Line24: "│   ├── api/"
Line25: "│   │   ├── src/"
Line26: "│   │   │   ├── modules/"
Line27: "│   │   │   ├── prisma/"
Line28: "│   │   │   ├── bull/"
Line29: "│   │   │   ├── middleware/"
Line30: "│   │   │   └── main.ts"
Line31: "│   │   ├── test/"
Line32: "│   │   └── Dockerfile"
Line33: "│   └── mobile/"
Line34: "│       ├── src/"
Line35: "│       │   ├── components/"
Line36: "│       │   ├── screens/"
Line37: "│       │   ├── navigation/"
Line38: "│       │   ├── hooks/"
Line39: "│       │   ├── lib/"
Line40: "│       │   └── assets/"
Line41: "│       ├── test/"
Line42: "│       ├── app.json"
Line43: "│       └── eas.json"
Line44: "├── libs/"
Line45: "│   ├── design-system/"
Line46: "│   ├── types/"
Line47: "│   ├── utils/"
Line48: "│   └── eslint-config/"
Line49: "├── infrastructure/"
Line50: "│   ├── docker-compose.yml"
Line51: "│   └── prisma/"
Line52: "│       └── schema.prisma"
Line53: "├── .github/"
Line54: "│   └── workflows/"
Line55: "│       ├── ci.yml"
Line56: "│       └── cd.yml"
Line57: "└── README.md"
Line58: "```"
Line59: ""
Line60: "## Service Boundaries"
Line61: "| Service | Responsibility | Technology |"
Line62: "|---------|----------------|------------|"
Line63: "| Auth Service | User registration login password reset social login JWT issuance | NestJS Passport Prisma |"
Line64: "| Business Service | CRUD businesses categories geospatial search | NestJS Prisma PostGIS |"
Line65: "| Service Catalog | Services offered by businesses pricing duration | NestJS Prisma |"
Line66: "| Booking Service | Slot computation appointment creation rescheduling cancellation | NestJS BullMQ Prisma |"
Line67: "| Appointment Service | User appointment history reminders | NestJS Redis BullMQ |"
Line68: "| Favorite Service | User favorited businesses services | NestJS Prisma |"
Line69: "| Review Service | Ratings comments | NestJS Prisma |"
Line70: "| Payment Service | Integration with payment gateway Stripe PayPal | NestJS external SDK |"
Line71: "| Notification Service | Send push email SMS via BullMQ workers | BullMQ Redis Expo Push |"
Line72: "| Admin Service | Dashboard analytics user business management | NestJS Prisma |"
Line73: "| Provider Portal | Business owner CRUD listings services appointments | NestJS Prisma |"
Line74: "| Shared Library | Design system types utils | React Native design-system TypeScript libs/types libs/utils |"
Line75: ""
Line76: "## Data Model Prisma"
Line77: "```"
Line78: "model User {"
Line79: "  id String @id @default(uuid())"
Line80