# Planity Clone — System Architecture

## 1. Overview
Planity Clone is a mobile-first platform for beauty & wellness bookings. The system is built as an Nx pnpm monorepo with clear separation between client apps (Expo React Native, Expo Web portals), a NestJS API, and a BullMQ worker. Data is stored in PostgreSQL with PostGIS, cached/queued in Redis, and authenticated via Supabase.

## 2. Monorepo Layout (Nx + pnpm)
Below is the recommended folder scaffold:

apps/
  mobile/                # Expo + React Native (Expo Router) client app
  provider-web/          # Expo Web (or React) business owner dashboard
  admin-web/             # Expo Web (or React) admin panel
  api/                   # NestJS REST/GraphQL API
  worker/                # NestJS service running BullMQ consumers
libs/
  ui/                    # @planity/ui design system (RN + RN Web)
  types/                 # @planity/types shared TypeScript contracts
  api-client/            # @planity/api-client React Query hooks & clients
  config/                # @planity/config env schemas, feature flags
  prisma/                # @planity/prisma schema, migrations, client
tools/
  scripts/               # seed, codegen
docker-compose.yml       # postgres+postgis, redis
nx.json
package.json
tsconfig.base.json

All apps import libs via workspace packages. Strict module boundaries enforced with Nx lint rules.

## 3. Service Boundaries
- Mobile App: Handles guest browse, auth, search, map, booking, appointments, profile, favorites. No direct DB access; talks to API via @planity/api-client (TanStack React Query). Uses Reanimated for transitions and map animations.
- Provider Web: Business profile, services, staff, schedule, bookings, analytics. Same API client.
- Admin Web: User/business/category management, global metrics.
- API Service (NestJS): Single backend for all business logic. Exposes RESTful endpoints under /v1. Validates JWT from Supabase, enforces RBAC (client, owner, admin). Modules: Auth, Users, Businesses, Categories, Search, Booking, Availability, Payments, Reviews, Favorites, Notifications, Admin.
- Worker Service: Subscribes to Redis queues. Processes reminders, slot pre-computation, image thumbnail generation, analytics aggregation. Shares Prisma and config libs with API.
- Data Layer: PostgreSQL + PostGIS (via Supabase) for relational + spatial queries. Redis for cache (search results, availability slots) and BullMQ.
- External: Supabase Auth/Storage, Stripe/Adyen payments, Mapbox/Google Maps SDK, Firebase/APNs push, email/SMS providers.

## 4. Backend Architecture (NestJS)
API is modular:
- AuthModule: Verifies Supabase JWT, syncs user to local DB, issues session context.
- BusinessesModule: CRUD, ownership, staff, services, gallery (Supabase Storage URLs).
- CategoriesModule: Seed taxonomy, hierarchical.
- SearchModule: Uses Prisma raw queries with PostGIS ST_DWithin for radius (default 50km), full-text search, filters. Caches results in Redis with geo-key.
- AvailabilityModule: Pure TS engine computing free slots from BusinessHours, StaffSchedule, Appointments, Service duration, timezone. Exposes getSlots(businessId, date) and caches in Redis.
- BookingModule: Orchestrates select service/staff/time, creates Appointment (pending), calls PaymentsModule, confirms on success. Emits events to NotificationsModule.
- PaymentsModule: Stripe/Adyen intents, webhooks, refunds. PCI compliant (no raw card data).
- ReviewsModule: After completed appointment, create review, recompute aggregate rating via DB transaction.
- FavoritesModule: Toggle favorites, list.
- NotificationsModule: Publishes BullMQ jobs for email/SMS/push.
- AdminModule: Platform oversight, commission config.

All modules use PrismaService (libs/prisma). DTOs validated with class-validator.

## 5. Frontend Architecture
Mobile (apps/mobile):
- Expo Router file-based routing under app/. Routes: (tabs)/home, explore, bookings, profile; business/[id]; booking flow as stack.
- TanStack React Query for server state, mutations, caching, pagination. Query keys namespaced by resource.
- React Native Reanimated for bottom sheets, page transitions, map pin animations.
- @planity/ui provides Button, Card, Input, Sheet, MapView wrappers, theme tokens.
- @planity/types ensures contract safety.

Web portals (apps/provider-web, apps/admin-web):
- Same libs, responsive layouts, role-guarded routes.

## 6. Data Model (Prisma + PostGIS)
Key models (simplified):
- User (id, email, phone, role, supabaseId)
- Business (id, name, location geography(Point), address, hours, ownerId)
- Category (id, name, parentId?)
- Service (id, businessId, categoryId, durationMin, price)
- Staff (id, businessId, scheduleJson)
- Appointment (id, userId, businessId, staffId, serviceId, start, end, status, paymentId)
- Review (id, appointmentId, rating, text)
- Favorite (userId, businessId)
- Payment (id, appointmentId, stripeIntent, status)
- Notification (id, userId, type, channel, sentAt)

PostGIS extension enabled; location indexed with GiST. Search uses ST_DWithin(location, ST_MakePoint(:lng,:lat), :radius).

## 7. Background Jobs (BullMQ + Redis)
Queues:
- reminders: send 24h pre-appointment push/email/SMS.
- slot-cache: warm availability cache for active businesses.
- media: resize/upload images to Supabase Storage.
- analytics: daily GMV, utilization rollups.

Handlers idempotent (jobId based on entity). Bull Board mounted in worker for monitoring. Retry with exponential backoff.

## 8. Infrastructure & CI/CD
- docker-compose.yml: postgres:15-postgis, redis:7. Supabase used in cloud for Auth/Storage; locally can emulate with supabase CLI.
- GitHub Actions: on push, run pnpm install, nx affected lint, jest unit tests, build. Separate workflow for EAS Build (mobile) and Docker image build for API/worker.
- EAS Build: produces iOS/Android binaries; OTA updates via expo-updates.
- Nx caching speeds builds.

## 9. Security & Compliance
- Supabase Auth issues JWT; API validates signature and checks role claims.
- Passwords hashed by Supabase (bcrypt). Social login mapped.
- RBAC guards in NestJS for owner/admin routes.
- Payments tokenized; no card data touches our servers.
- PII minimized; guests have no stored data.
- Redis/Postgres secured via VPC; secrets in GitHub Environments / Supabase vault.

## 10. Conclusion
This architecture delivers clean separation: shared libs, independent apps, scalable NestJS backend, async workers, and spatial data. It meets all Must/Should features from product spec while remaining maintainable.