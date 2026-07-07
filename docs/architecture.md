# Planity Clone - System Architecture

## 1. Overview
Planity Clone is a mobile-first marketplace for salon and beauty appointments. The system is built as an Nx pnpm monorepo with clear separation between the Expo React Native mobile client and a NestJS backend API, sharing TypeScript types and a design system. The backend uses Prisma with PostgreSQL+PostGIS for geospatial queries and Redis for caching and BullMQ job queues.

## 2. Tech Stack
- Mobile: Expo, React Native, TypeScript, Expo Router, TanStack React Query, React Native Reanimated, Supabase (push/storage), EAS Build.
- Backend: NestJS, Prisma, PostgreSQL 15 + PostGIS, Redis 7 (BullMQ), JWT auth.
- Tooling: Nx, pnpm, Docker Compose, GitHub Actions, Jest.

## 3. Monorepo Layout (Nx + pnpm)
apps/
  mobile/        # Expo RN app
  api/           # NestJS app
  provider-portal/ # Future web (optional)
  admin-dashboard/ # Future web (optional)
libs/
  types/         # Shared TS models & enums
  ui/            # RN design system (Button, Card, Modal, Calendar)
  api-client/    # Fetch + React Query hooks
  prisma/        # Schema, migrations, seed
  utils/         # Date, geo, formatting
  config/        # Shared eslint, jest, tsconfig
Root files: nx.json, pnpm-workspace.yaml, docker-compose.yml, .github/workflows/ci.yml, package.json.

## 4. Folder Structure
### apps/mobile
app/
  (auth)/
    login.tsx
    register.tsx
  (tabs)/
    home.tsx
    search.tsx
    map.tsx
    favorites.tsx
    profile.tsx
  business/[id].tsx
  booking/
    index.tsx
    confirm.tsx
  appointment/
    [id].tsx
  category/[id].tsx
src/
  features/
    auth/ (hooks, components)
    explore/
    search/
    map/ (Reanimated clustering)
    business-detail/
    booking/ (wizard state)
    appointments/
    favorites/
    profile/
    notifications/
  lib/ (queryClient, api)
  animations/ (Reanimated snippets)
  assets/

### apps/api
src/
  main.ts
  app.module.ts
  common/ (guards, decorators, pipes, redis.service)
  config/ (env, database.module)
  modules/
    auth/ (auth.controller, auth.service, jwt.strategy, refresh.repository)
    users/
    categories/
    businesses/ (with postgis repository)
    services/
    staff/
    availability/ (slot.engine, cache.service)
    booking/ (booking.service, payment.integration)
    appointments/
    favorites/
    reviews/
    payments/ (stripe.service, webhook.controller)
    notifications/ (producer, templates)
    jobs/ (bullmq.module, processors)
    admin/
    provider/
  prisma/ (prisma.service, extensions)

## 5. Service Boundaries
### Backend Modules (NestJS)
- Auth: email/phone/OAuth signup, verification, JWT access + refresh rotation (refresh tokens stored in Redis), logout invalidation.
- Users: profile, addresses, saved payment methods (Stripe tokens), notification prefs, account deletion.
- Categories: hierarchical taxonomy seed (Hair, Nails, Spa, Beauty, Wellness), admin CRUD.
- Businesses: profile, geo-point (PostGIS geometry), hours, staff linkage; search endpoints.
- Services: per-business catalog with price/duration.
- Staff: shifts and assignments used by availability.
- Availability: pure computation service; inputs business hours, staff shifts, service duration, buffers, booked slots; returns 15-min increments; cached in Redis for 30-day horizon; respects timezone.
- Booking: orchestrates slot validation, payment intent (full/deposit), appointment creation, emits notification job.
- Appointments: reschedule/cancel with policy enforcement, refund trigger.
- Favorites: user-to-business/service links, synced.
- Reviews: gated to completed appointments, photo upload to Supabase storage, moderation flag.
- Payments: Stripe (cards, 3DS), PayPal optional, refund logic, accounting events.
- Notifications: BullMQ producers for email/SMS/push; templates per locale; opt-out respected.
- Jobs: BullMQ queues (notifications, reminders, media, reports) with retry/DLQ.
- Admin: user/business management, audit log.
- Provider: role-based portal APIs for business_admin/staff.

### Mobile Feature Boundaries
Each feature folder owns UI components, local state, and React Query hooks (from libs/api-client). Cross-feature communication via navigation params and shared query cache. No direct backend calls outside api-client.

### Shared Libraries
- libs/types: single source of truth for User, Business, Service, Appointment, etc.
- libs/ui: theme tokens, reusable components, ensures consistent UX.
- libs/api-client: typed fetch wrapper, React Query hooks, error handling.

## 6. Data Model (Prisma + PostGIS)
Key entities:
- User (id, email, phone, verified, avatar, addresses JSON, prefs)
- Business (id, name, location geometry(Point,4326), address, hours JSON, categoryId)
- Category (id, parentId self-relation, name, active)
- Service (id, businessId, categoryId, price, durationMin)
- Staff (id, businessId, shifts JSON)
- Appointment (id, userId, businessId, serviceId, staffId?, start, end, status, paymentId)
- Review (id, appointmentId, stars, text, photos[])
- Favorite (userId, businessId/ServiceId)
- Payment (id, stripeIntent, amount, status, refund)
- RefreshToken (redis key or table)

PostGIS enables ST_DWithin for distance filters and clustering. Prisma schema uses extensions for postgis.

## 7. Key Flows
### Authentication
Mobile form -> api/auth/login -> JWT (15m) + refresh (30d in Redis). React Query stores user. Logout calls api/auth/logout to drop Redis key.

### Search & Map
Guest can browse. Search uses query params; API uses PostGIS for distance + filters, returns paginated. Map screen debounces region change (200ms) and calls same endpoint with bbox; pins clustered client-side with Reanimated.

### Booking
Local wizard (service, staff, date, slot) -> mutation booking/create -> API re-checks availability, creates Stripe payment (deposit if configured), on success creates Appointment, enqueues confirmation notification.

### Availability
API availability/slots computes from DB + Redis cache; target <2s for 30-day horizon via pre-aggregation.

## 8. Infrastructure
- docker-compose.yml: postgres:15-postgis, redis:7. For local and CI.
- GitHub Actions: PR pipeline runs pnpm nx affected --target=test --runner=jest, lint, typecheck. Merge to main triggers API docker build and mobile EAS Build preview.
- EAS Build: configured via eas.json; produces binaries; uses Expo Vault for secrets.
- Supabase: used for push notification delivery (via Expo push) and review photo storage; credentials in env.

## 9. Testing
- Jest unit tests for NestJS services and React Query hooks.
- API e2e with supertest against test DB (docker).
- Mobile component tests with React Native Testing Library.
- Nx affected reduces suite time.

## 10. Security & Performance
- RBAC guards on provider/admin routes.
- Parameterized Prisma queries prevent injection.
- Redis cache for slots and refresh tokens.
- Debounced map queries, infinite scroll for lists.
- BullMQ ensures reliable notifications with DLQ.

## 11. Conclusion
The architecture meets P0/P1 requirements with clean separation, shared types, and scalable backend. It supports 80% booking completion via smooth UX and <2s slot computation via caching.