# Planity Clone Architecture

## Overview
This document describes the system architecture for the Planity Clone mobile application covering client server infrastructure and development workflows.

## Technology Stack
- Mobile: Expo React Native TypeScript Expo Router TanStack React Query React Native Reanimated
- API: NestJS Node.js TypeScript
- ORM: Prisma
- Database: PostgreSQL with PostGIS extension
- Cache: Redis
- Background Jobs: BullMQ (running in NestJS workers)
- Monorepo: Nx with pnpm
- Containerization: Docker Compose
- CI/CD: GitHub Actions
- Mobile Build: Expo Application Services (EAS) Build
- Auth: Supabase Auth (optional)
- Testing: Jest

## High-Level Architecture
The system follows a clean layered architecture with clear separation of concerns:

1. Presentation Layer (Mobile App) – UI built with React Native navigation via Expo Router state management with TanStack Query animations with Reanimated.
2. API Layer (NestJS) – RESTful endpoints exposing business logic validation authentication and authorization.
3. Domain Layer – Encapsulated in NestJS services and Prisma models contains business rules availability slot computation booking flow.
4. Infrastructure Layer – Database (PostgreSQL/PostGIS) cache (Redis) job queue (BullMQ) external services (payment gateway notification provider).
5. Shared Layer – Nx libraries for TypeScript types UI components design system and utility functions shared between mobile and backend.

### Data Flow Example
- User opens app → Expo Router renders screen → TanStack Query fetches data from NestJS API → API validates request queries Prisma (PostGIS for location based search) → Results cached in Redis → Response returned to client.
- Booking flow: Client sends booking request → API validates checks availability via slot computation service → Creates booking record → Publishes job to BullMQ for payment processing and notification → Worker processes job → Updates booking status → Push notification sent via external service.

## Service Boundaries
| Service | Responsibility | Tech | Notes |
|---------|----------------|------|-------|
| Mobile Client | UI/UX navigation local state offline caching deep linking | Expo React Native TypeScript Expo Router TanStack Query Reanimated | Communicates with API over HTTPS |
| API Gateway (NestJS) | Request routing auth middleware rate limiting validation | NestJS | Thin layer can be split into multiple microservices later |
| Business Service | Business CRUD search categorization location queries | NestJS Prisma PostGIS | Handles geo search |
| Booking Service | Availability calculation slot generation booking creation modification cancellation | NestJS Prisma | Uses deterministic algorithms |
| Payment Service | Payment gateway integration transaction recording | NestJS payment provider SDK | Calls external gateway emits events |
| Notification Service | Sending push email SMS notifications | NestJS BullMQ workers | Workers process jobs from queue |
| User Service | Authentication profile management | NestJS Supabase Auth (or custom JWT) | Manages users roles |
| Admin Portal | Dashboard for admins to manage data | NestJS (maybe separate Next.js app) | Could be separate SPA |
| Provider Portal | Business owner UI for managing profile availability bookings | NestJS React (Next.js) or separate mobile/web | Same API |
| Worker | Background job processing (payments notifications reminders) | NestJS BullMQ workers | Scalable horizontally |
| Cache Layer | Redis for session store query caching rate limiting | Redis | |
| Database | Persistent storage spatial queries | PostgreSQL PostGIS | |
| Shared Libraries | TypeScript types design system UI components utils | Nx libs | Used by mobile and backend |

## Folder Structure (Nx Monorepo)
apps/
  mobile/
    src/
      assets/
      components/
      navigation/
      screens/
      hooks/
      lib/
      types/
      App.tsx
    expo.config.ts
    tailwind.config.js
  api/
    src/
      modules/
        auth/
        business/
        booking/
        payment/
        notification/
        user/
        admin/
      prisma/
        schema.prisma
        migrations/
      workers/
        payment.worker.ts
        notification.worker.ts
      main.ts
    test/
    nest-cli.json
  admin/
  provider/
libs/
  ui/
    src/
      components/
      index.ts
  types/
    src/
      index.ts
  utils/
    src/
      index.ts
  config/
    src/
      index.ts
docker/
  compose.yml
  Dockerfile.api
  Dockerfile.worker
.github/
  workflows/
    ci.yml
    cd.yml
prisma/
  schema.prisma
nx.json
package.json
tsconfig.base.json

## Development Workflow
1. Code Changes – Develop in feature branches; lint and unit tests run via GitHub Actions on PR.
2. Database – Prisma migrations managed via pnpm prisma migrate dev; schema stored in prisma/schema.prisma.
3. API – Run locally with pnpm --filter api run start:dev; Docker Compose brings up PostgreSQL Redis and worker.
4. Mobile – Start Expo dev client with pnpm --filter mobile run ios or android; uses Expo Router for file‑based navigation.
5. Testing – Jest configured for both mobile (React Native Testing Library) and API (NestJS testing utilities).
6. CI – On push to main: run lint unit tests build Docker images push to registry trigger EAS build for mobile.
7. CD – Docker images deployed to staging/production via Kubernetes or ECS; mobile builds distributed via Expo EAS.

## Deployment Architecture
- Development: Docker Compose orchestrates API PostgreSQL Redis Worker.
- Staging/Production:
  - API and workers run as separate containers (or Kubernetes pods) behind a load balancer.
  - Database: Managed PostgreSQL (e.g. Supabase or AWS RDS) with PostGIS extension.
  - Cache: Elasticache Redis or managed Redis.
  - Job Queue: BullMQ backed by Redis.
  - Mobile: Distributed via Expo EAS (binary builds) or TestFlight/Play Store internal tracks.
  - Static assets (if any) served via CDN.

## Security Considerations
- Authentication via JWT (issued by NestJS) or Supabase Auth; HTTPS enforced.
- Role-based access control (RBAC) for admin provider user.
- Input validation and sanitization using NestJS Pipes and class-validator.
- Sensitive data (payment details) never stored; tokenized via payment gateway.
- Rate limiting and brute‑force protection on auth endpoints.
- Environment variables managed via .env files; secrets injected via CI/CD.

## Observability
- Logging: Winston (NestJS) + Expo console; structured logs forwarded to ELK or Datadog.
- Metrics: Prometheus endpoints exposed by NestJS; Grafana dashboards.
- Tracing: OpenTelemetry instrumentation for API calls.
- Error tracking: Sentry for both mobile and backend.

## Future Scalability
- Microservice split: Business Booking Payment Notification services can be extracted into independent NestJS microservices communicating via message broker (e.g. RabbitMQ or Kafka).
- GraphQL layer could be added for flexible client queries.
- WebSocket support for real‑time updates (e.g. booking status) using NestJS Gateway.
- Mobile: Consider adding Expo Push Notifications service.

---
*This architecture document serves as a living guide; update as the system evolves.*
