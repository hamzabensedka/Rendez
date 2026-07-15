# Planity Clone System Architecture

## 1. Overview
The Planity Clone is a mobile-first application that lets users discover, book and manage appointments with local service businesses. The backend is a NestJS API powered by Prisma and PostgreSQL (with PostGIS for location queries). Redis is used for caching and as a broker for BullMQ background jobs. The mobile client is built with Expo, React Native, TypeScript, Expo Router, TanStack React Query and React Native Reanimated for smooth animations. The monorepo is managed by Nx and pnpm, with CI/CD via GitHub Actions, Docker Compose for local dev, EAS Build for Expo, and Supabase for optional hosted services.

## 2. Service Boundaries
- Mobile Client (Expo) – UI, authentication flow, guest browse, search, map, booking, profile, favorites, reviews, notifications.
- API Gateway (NestJS) – REST/GraphQL endpoints, validation, auth (JWT), rate limiting, logging.
- Business Logic Services – NestJS modules encapsulating domain concerns:
  * Auth Service (users, roles, password reset)
  * Business Service (CRUD, categories, location)
  * Service Service (service definitions, pricing)
  * Booking Service (slot computation, appointment creation, cancellation)
  * Review Service (ratings, comments)
  * Payment Service (integration with Stripe/PayPal, webhook handling)
  * Notification Service (email, push, SMS via BullMQ workers)
  * Admin Service (dashboard, metrics, settings)
  * Provider Portal Service (business owner login, manage services/appointments)
- Data Access Layer – Prisma models with PostgreSQL (PostGIS extension) as the source of truth.
- Caching Layer – Redis for:
  * Session store (optional)
  * Frequently queried lists (business search, categories)
  * Rate limiting counters
- Background Job Processor – BullMQ workers (run as separate NestJS microservice or standalone Node process) consuming jobs from Redis for:
  * Appointment reminders
  * Review moderation
  * Payment reconciliation
  * Data exports
- Infrastructure – Docker Compose defines services: api, db (Postgres+PostGIS), redis, worker. GitHub Actions runs lint, test, build, and pushes Docker images. EAS Build creates Expo binaries. Supabase can be used for auth/storage fallback.

## 3. Folder Structure (Nx monorepo)
apps/
  expo-client/          # Expo React Native app
    src/
      assets/           # Images, icons, fonts
      components/       # Shared UI components (buttons, cards, modals)
      navigation/       # Expo Router route files (app/_layout.tsx, app/(tabs)/...)
      screens/          # Screen components per feature
        auth/           # Login, register, reset
        browse/         # Home, explore
        search/         # Search results, filters
        map/            # Map view, directions
        business/       # Business detail, services
        booking/        # Slot picker, checkout, confirmation
        profile/        # User profile, edit
        favorites/      # Favorites list
        reviews/        # Add review, view reviews
        notifications/  # Notification center
      hooks/            # Custom React Query hooks
      lib/              # Utility functions, constants, types
      theme/            # Design system (tokens, styled components)
      app.tsx           # Root entry
      expo-router.config.ts
  api/                  # NestJS backend
    src/
      auth/             # AuthModule (controllers, services, dto, guards)
      business/         # BusinessModule
      service/          # ServiceModule
      booking/          # BookingModule
      review/           # ReviewModule
      payment/          # PaymentModule
      notification/     # NotificationModule
      admin/            # AdminModule
      provider/         # ProviderPortalModule
      common/           # Interceptors, pipes, guards, exceptions
      prisma/           # Prisma client wrapper, migrations
      redis/            # Redis service wrapper
      bullmq/           # Queue definitions, workers
      main.ts
libs/
  shared-types/         # TypeScript interfaces used by both client and server (e.g. User, Business, Booking)
  ui-kit/               # Reusable React Native components (design system)
  utils/                # Helper functions (date, geo, validation)
  testing/              # Test utilities, mocks
  eslint-config/        # Shared ESLint config
  typescript-config/    # Shared tsconfig base
  jest-config/          # Shared Jest config
  docker/               # Dockerfiles, compose files
  scripts/              # Dev ops scripts (db migrate, seed)
## 4. Data Flow Examples
### 4.1 User Registration
1. Client sends POST /auth/register with email, password.
2. AuthController validates via AuthService.
3. Service hashes password, creates User record via Prisma.
4. JWT issued, returned to client; stored in SecureStore.
5. Client redirects to home.

### 4.2 Business Search (Map)
1. Client reads query (lat, lng, radius, category) from UI.
2. useQuery hook calls GET /businesses?near=&distance=&category=.
3. API uses Prisma with PostGIS ST_DWithin to find businesses within radius.
4. Results cached in Redis for 5 min.
5. Returns JSON list; client displays on map via react-native-maps.

### 4.3 Booking Flow
1. User selects service and opens slot picker.
2. Client queries GET /businesses/:id/services/:serviceId/slots?date=...
3. BookingService computes available slots:
   * Loads business hours, existing appointments for date.
   * Generates possible slots, subtracts booked intervals.
4. Slots returned; user picks time.
3. Client POST /bookings with userId, serviceId, slotStart, slotEnd.
4. BookingService validates availability again (optimistic lock), creates Booking record, triggers payment intent.
5. PaymentService contacts Stripe, returns client secret.
6. Client completes payment via Stripe SDK; webhook confirms success.
7. On success, Booking status set to confirmed, notification job enqueued (email/push).
8. BullMQ worker processes job, sends notification via Redis pub/sub or external provider.

### 4.4 Review Submission
1. Client POST /reviews with businessId, rating, comment.
2. ReviewService validates user has completed booking.
3. Prisma creates Review, updates Business aggregate rating.
4. Notification job enqueued for business owner.
5. Cached business summary invalidated in Redis.

## 5. Cross‑Cutting Concerns
- Authentication: JWT access token (15 min) + refresh token (7 days) stored in SecureStore; refresh endpoint rotates tokens.
- Authorization: NestJS guards (RolesGuard) based on user.role (user, provider, admin).
- Validation: DTOs with class-validator; server-side validation only.
- Error Handling: Global exception filter maps errors to consistent JSON {error, message, statusCode}.
- Logging: Winston logger with request ID; logs shipped to stdout for Docker.
- Testing: Unit tests with Jest; integration tests with Supertest; end-to-end with Detox for client.
- CI/CD: GitHub Actions runs lint, test, build, Docker images, pushes to registry; on tag triggers EAS Build and release.
- Dev Environment: Docker Compose brings up api, db, redis; expo-client runs with expo start; hot reload enabled.
- Production: Kubernetes or ECS can be used; images from CI; environment variables managed via Doppler or .env.

## 6. Security Considerations
- HTTPS enforced via TLS termination at load balancer.
- Passwords hashed with bcrypt (salt 12).
- Rate limiting on auth endpoints via @nestjs/throttler.
- CSP and helmet middleware.
- Input sanitization to prevent injection.
- Webhook signature verification for Stripe.
- Redis protected with auth; only internal services can connect.
- JWT secrets rotated regularly; stored in secret manager.

## 7. Scalability & Performance
- Read‑heavy search queries served from Redis cache.
- Pagination and cursor-based endpoints for large lists.
- Horizontal scaling of API stateless nodes behind load balancer.
- Worker processes scaled based on queue depth (BullMQ).
- Database read replicas for analytics/reporting.
- Indexes on PostGIS location columns and foreign keys.
- CDN for static assets (Expo assets can be hosted on a CDN).

## 8. Monitoring & Observability
- Health checks endpoint (/health) returns DB, Redis, queue status.
- Metrics exported via Prometheus (NestJS Prometheus module).
- Log aggregation via Loki or Elasticsearch.
- Error tracking with Sentry (both client and server).
- APM (optional) via Datadog or New Relic.

## 9. Deployment Diagram (textual)
[Expo Client] <--HTTPS--> [API Gateway (NestJS)] <--gRPC/HTTP--> [PostgreSQL+PostGIS]
                                 ^                |
                                 |                v
                                 |            [Redis] <---> [BullMQ Workers]
                                 |
                                 +--> [Supabase (optional auth/storage)]

## 10. Future Extensions
- GraphQL endpoint for flexible data fetching.
- Offline-first client with Expo SQLite and React Query persistence.
- Multi‑language support via i18next.
- AI‑powered recommendation service.
- Marketplace analytics dashboard.

--- End of Document ---
