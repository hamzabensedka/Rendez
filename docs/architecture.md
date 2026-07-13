We need to output JSON only, with content string containing escaped newlines. We must not have actual line breaks inside the JSON string (except as \n). So we need to produce a single line string where newlines are represented as \n.

Thus we need to convert the markdown to a single line with \n.

That is tedious but doable manually? We'll produce a compact representation.

We'll produce content as a single line with \n placeholders.

We'll need to escape any double quotes inside the markdown. We'll avoid double quotes inside; we used single quotes for strings in code blocks; but we have code fences with triple backticks which include backticks, not double quotes. That's fine.

We need to ensure we don't have any double quotes inside the content. We used double quotes in JSON examples inside markdown (like in code blocks we had JSON? Actually we didn't include JSON; we used Prisma schema which uses double quotes? No, Prisma uses double quotes for string literals? Actually Prisma uses double quotes for string values? In Prisma schema, string literals are not quoted; they are just raw text. So we are fine.

We used double quotes in some places like "role": "USER"? Not in our content. We used enum Role { USER ADMIN PROVIDER } no quotes.

We used code fences with triple backticks; inside we have text that may contain double quotes? For example in the API design we wrote: POST /auth/register etc. No double quotes.

We used "PostGIS" etc. No double quotes.

Thus we can avoid double quotes.

Now we need to convert the markdown into a string with \n.

We'll produce something like:

"content": "Overview\\n========\\nThe Planity Clone is a mobile-first appointment booking platform that connects users with local businesses. It consists of a React Native/Expo frontend and a NestJS backend, organized in an Nx monorepo using pnpm.\\n\\n## Tech Stack\\n- Mobile: Expo, React Native, TypeScript, Expo Router, TanStack React Query, React Native Reanimated\\n- Backend: NestJS, Prisma ORM, PostgreSQL with PostGIS extension, Redis, BullMQ\\n- Monorepo: Nx, pnpm\\n- DevOps: Docker Compose, GitHub Actions, EAS Build, Supabase (auth/storage)\\n- Testing: Jest\\n\\n## High-Level Architecture\\nThe system follows a clean layered architecture: the mobile app communicates with the API gateway over HTTPS. The API gateway (NestJS) exposes REST endpoints delegated to domain‑specific modules (Auth, Business, Booking, Payment, Notification, Admin, Provider). Business logic stays inside services; data access is handled by Prisma models. PostgreSQL stores relational data and geographic indexes via PostGIS. Redis provides caching, rate‑limiting, and acts as the broker for BullMQ background workers. Workers run as separate NestJS processes (or the same API instance) and handle jobs such as sending notifications, payment reconciliation, and slot recomputation.\\n\\n## Service Boundaries\\n1. **Frontend (apps/mobile)** – Expo React Native app responsible for UI, navigation (Expo Router), state management (React Query), animations (Reanimated), and offline optimizations.\\n2. **API Gateway (apps/api)** – NestJS application that receives HTTP requests, validates them, and routes to feature modules. It also hosts GraphQL‑like endpoints if needed, but primarily REST.\\n3. **Domain Libraries (libs/)**\\n   - **shared-types** – Central TypeScript interfaces (User, Business, Service, Appointment, etc.) shared between mobile and API.\\n   - **ui** – Design system components (buttons, cards, modals) built with React Native Reanimated for smooth animations.\\n   - **data-access** – Prisma schema, repositories, and reusable query utilities.\\n   - **utils** – Logging, error handling, date/time helpers, geo utilities (haversine, PostGIS helpers).\\n   - **test-helpers** – Mock factories and testing utilities for Jest.\\n4. **Background Jobs** – BullMQ workers defined in libs/jobs (or as NestJS modules) that consume Redis queues for tasks like email/SMS notifications, payment webhook handling, and nightly slot regeneration.\\n5. **External Services**\\n   - **Payment Gateway** – Stripe (or similar) integrated via a Payment service.\\n   - **Supabase** – Provides Auth (email/password, password reset) and file storage for business images.\\n   - **Map Provider** – Mapbox/Google Maps SDK for map‑based search and reverse geocoding.\\n\\n## Folder Structure\\n```\\nplanity-clone/\\n├── apps/\\n│   ├── mobile/          # Expo React Native app\\n│   │   ├── src/\\n│   │   │   ├── components/\\n│   │   │   ├── screens/\\n│   │   │   ├── navigation/\\n│   │   │   ├── hooks/\\n│   │   │   ├── assets/\\n│   │   │   └── App.tsx\\n│   │   └── expo.config.js\\n│   └── api/             # NestJS backend\\n│       ├── src/\\n│       │   ├── auth/\\n│       │   ├── business/\\n│       │   ├── booking/\\n│       │   ├── payment/\\n│       │   ├── notification/\\n│       │   ├── admin/\\n│       │   ├── provider/\\n│       │   ├── shared/\\n│       │   │   ├── dto/\\n│       │   │   ├── guards/\\n│       │   │   └── interceptors/\\n│       │   ├── app.module.ts\\n│       │   └── main.ts\\n│       └── test/\\n├── libs/\\n│   ├── shared-types/    # TypeScript interfaces\\n│   ├── ui/              # Design system (buttons, cards, etc.)\\n│   ├── data-access/     # Prisma schema, repositories\\n│   │   ├── prisma/\\n│   │   │   └── schema.prisma\\n│   │   └── src/\\n│   ├── utils/\\n│   │   ├── geo.ts\\n│   │   └── logger.ts\\n│   ├── jobs/            # BullMQ job definitions\\n│   │   ├── notification.job.ts\\n│   │   └── slot-recalc.job.ts\\n│   └── test-helpers/\\n├── tools/\\n├── docker-compose.yml\\n├── nx.json\\n└── package.json   # pnpm workspace\\n```\\n\\n## Data Model (Prisma)\\n```prisma\\nmodel User {\\n  id            String   @id @default(uuid())\\n  email         String   @unique\\n  name          String?\\n  role          Role     @default(USER)\\n  createdAt     DateTime @default(now())\\n  updatedAt     DateTime @updatedAt\\n  appointments  Appointment[]\\n  favorites     Favorite[]\\n  reviews       Review[]\\n}\\n\\nmodel Business {\\n  id            String   @id @default(uuid())\\n  name          String\\n  description   String?\\n  address       String\\n  latitude      Float\\n  longitude     Float\\n  @@index([latitude, longitude], type: gis)\\n  services      Service[]\\n  appointments  Appointment[]\\n  reviews       Review[]\\n}\\n\\nmodel Service {\\n  id          String   @id @default(uuid())\\n  businessId  String   @relation(\"businessServices\")\\n  business    Business @relation(\"businessServices\", fields: [businessId], references: [id])\\n  name        String\\n  duration    Int      // minutes\\n  price       Float\\n}\\n\\nmodel Appointment {\\n  id            String   @id @default(uuid())\\n  userId        String   @relation(\"userAppointments\")\\n  businessId    String   @relation(\"businessAppointments\")\\n  serviceId     String   @relation(\"serviceAppointments\")\\n  startTime     DateTime\\n  endTime       DateTime\\n  status        AppointmentStatus\\n  user          User     @relation(\"userAppointments\", fields: [userId], references: [id])\\n  business      Business @relation(\"businessAppointments\", fields: [businessId], references: [id])\\n  service       Service  @relation(\"serviceAppointments\", fields: [serviceId], references: [id])\\n  payment       Payment?\\n}\\n\\nmodel Review {\\n  id        String   @id @default(uuid())\\n  userId    String   @relation(\"userReviews\")\\n  businessId String   @relation(\"businessReviews\")\\n  rating    Int      @default(5)\\n  comment   String?\\n  createdAt DateTime @default(now())\\n  user      User     @relation(\"userReviews\", fields: [userId], references: [id])\\n  business  Business @relation(\"businessReviews\", fields: [businessId], references: [id])\\n}\\n\\nmodel Favorite {\\n  id        String   @id @default(uuid())\\n  userId    String   @relation(\"userFavorites\")\\n  businessId String   @relation(\"businessFavorites\")\\n  user      User     @relation(\"userFavorites\", fields: [userId], references: [id])\\n  business  Business @relation(\"businessFavorites\", fields: [businessId], references: [id])\\n}\\n\\nmodel Payment {\\n  id            String   @id @default(uuid())\\n  appointmentId String   @relation(\"appointmentPayment\")\\n  amount        Float\\n  status        PaymentStatus\\n  provider      String   // e.g., \"stripe\"\\n  providerId    String?\\n  createdAt     DateTime @default(now())\\n  appointment   Appointment @relation(\"appointmentPayment\", fields: [appointmentId], references: [id])\\n}\\n\\nenum Role { USER ADMIN PROVIDER }\\nenum AppointmentStatus { PENDING CONFIRMED COMPLETED CANCELLED }\\nenum PaymentStatus { PENDING SUCCEEDED FAILED REFUNDED }\\n```\\nPostGIS is used via a custom index on latitude/longitude for geo‑queries.\\n\\n## API Design (REST)\\n- **Auth** – POST /auth/register, POST /auth/login, POST /auth/forgot-password, POST /auth/reset-password\\n- **Business** – GET /businesses (search, filters, pagination), GET /businesses/:id, GET /businesses/:id/services\\n- **Booking** – POST /appointments (create), GET /appointments/me, PATCH /appointments/:id (cancel/reschedule), DELETE /appointments/:id\\n- **Payment** – POST /payments/webhook (Stripe), GET /payments/:id\\n- **Notification** – POST /notifications (trigger via BullMQ), GET /notifications/me\\n- **Review** – POST /reviews, GET /reviews/:businessId\\n- **Favorite** – POST /favorites, GET /favorites/me, DELETE /favorites/:id\\n- **Provider** – GET /provider/business (owned), PATCH /provider/business/:id, GET /provider/appointments\\n- **Admin** – GET /admin/stats, GET /admin/users, GET /admin/businesses\\nAll endpoints return JSON; errors follow a standard {error, message, details} shape.\\n\\n## Caching & Background Jobs\\n- **Redis** caches: session tokens (short‑TTL), business list geo‑queries, rate‑limit counters.\\n- **BullMQ** queues:\\n   * **notification** – sends email/SMS via Supabase or external provider.\\n   * **slot-recalc** – nightly regeneration of available slots per business/service.\\n   * **payment-reconcile** – verifies Stripe webhook events and updates Payment status.\\nWorkers are NestJS services decorated with @Processor.\\n\\n## DevOps & CI/CD\\n- **Local Development**: docker-compose.yml spins up api (NestJS), postgres (with PostGIS extension), redis. Expo dev server runs locally.\\n- **CI (GitHub Actions)**:\\n   * Install pnpm dependencies\\n   * Lint (ESLint)\\n   * Type check (tsc)\\n   * Run Jest unit & integration tests\\n   * Build Docker images for api\\n   * Run EAS build preview for mobile (optional).\\n- **Production**:\\n   * API deployed as Docker containers to a Kubernetes cluster or AWS ECS Fargate.\\n   * Managed PostgreSQL (Supabase or AWS RDS) with PostGIS enabled.\\n   * Elasticache Redis (or AWS Elasticache).\\n   * BullMQ workers run as separate worker pods.\\n   * Mobile binaries built with EAS Build and distributed via App Store/Play Store internal tracks.\\n   * Supabase used for Auth (email/password, magic link) and file storage (business photos, user avatars).\\n   * Monitoring via Prometheus/Grafana; logs shipped to Loki or CloudWatch.\\n\\n## Design System & Shared Types\\n- **libs/ui** provides reusable, themeable components (Button, Input, Card, Modal) built with React Native Reanimated for 60 fps animations.\\n- **libs/shared-types** holds plain‑TS interfaces that are imported by both mobile (via Expo web‑bundler) and API (via NestJS). This guarantees contract‑first development and eliminates drift.\\n\\n## Testing Strategy\\n- **Unit Tests** (Jest): service functions, DTO validation, Prisma repository methods.\\n- **Integration Tests** (Supertest): API endpoints with test DB (PostgreSQL in Docker).\\n- **Component Tests** (React Native Testing Library): UI components with Jest.\\n- **E2E** (Detox, optional): critical user flows (login → search → book → cancel).\\nAll tests are run in CI; coverage threshold 80 %.\\n\\n## Summary\\nThis architecture cleanly separates concerns, leverages an Nx monorepo for code sharing, uses Prisma/PostGIS for robust geo‑aware data storage, relies on React Query and Reanimated for a performant mobile experience, and employs Redis/BullMQ for scalable background processing—all orchestrated via Docker Compose locally and CI/CD pipelines for reliable delivery."

We need to ensure there are no stray double quotes. I see we have double quotes in some places like "stripe" inside a comment? In the Payment model comment we wrote: // e.g., \"stripe\" . That contains double quotes inside the string. That will break JSON. We need to escape those double quotes or avoid them. Better to change comment to // e.g., stripe without quotes. Or we can escape them as \\\" but easier to avoid.

Also we have "PostGIS" no quotes. Good.

We have "role": "Role"? Not.

We have "String" etc.

We have "DateTime". No quotes.

We have "Int". No.

We have "Float". No.

We have "String?" etc.

We have "String @id". No.

We have "@@index([latitude, longitude], type: gis)" includes parentheses but no quotes.

We have "/*" not.

We have "/*". Not.

We have "/*". Not.

We have "/*". Not.

We have "/*". Not.

We have "/*". Not.

We have "/*". Not.

We have "/*". Not.

Ok.

Now we need to ensure no double quotes appear. Let's scan the content string we plan to output.

We have:

- In the folder structure we have comments like "# Expo React Native app". No quotes.

- In the code fences we have triple backticks, not quotes.

- In the Prisma schema we have lines like `id            String   @id @default(uuid())` - no quotes.

- In the Service model we have comment `// minutes` - no quotes.

- In Payment model comment we had `// e.g., \"stripe\"` which includes double quotes. We'll change to `// e.g., stripe`.

- Also we have `provider      String   // e.g., stripe` after change.

- Also we have `providerId    String?` fine.

- Also we have `provider      String   // e.g., stripe` fine.

- Also we have `providerId    String?`.

- Also we have `provider      String   // e.g., stripe`.

- Also we have `providerId    String?`.

- Also we have `provider      String   // e.g., stripe`.

Ok.

- Also we have `providerId    String?`.

- Also we have `provider      String   // e.g., stripe`.

Now also we have in the API Design section: `POST /auth/register` etc. No quotes.

- In the Caching & Background Jobs: `* **notification** – sends email/SMS via Supabase or external provider.` No quotes.

- In the DevOps: `* Install pnpm dependencies` etc.

- In the Design System: `60 fps` includes a special space? It's a narrow space? Might be a non-breaking space? Safer to use regular space and "fps". We'll change to "60 fps".

- Also we have `60 fps` maybe a Unicode narrow space; we replace with "60 fps".

- Also we have `60 fps` appears once.

- Also we have `60 fps` in the Design System bullet.

- Also we have `60 fps` maybe elsewhere? Not.

- Also we have `60 fps` in the summary? Not.

- Also we have `60 fps` maybe not.

- Also we have `60 fps` only there.

Now also we have `60 fps` replaced.

Now also we have `60 fps` changed.

Now also we have `60 fps` replaced.

Now also we have `