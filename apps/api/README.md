# Planity API

NestJS backend API for the Planity booking marketplace.

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
# Create .env file (see SUPABASE_SETUP.md for details)
# You need:
# - DATABASE_URL (from Supabase)
# - JWT_ACCESS_SECRET & JWT_REFRESH_SECRET (generate with: node scripts/generate-secrets.js)
# - ALLOWED_ORIGINS (comma-separated browser origins; see .env.example)
# - APP_URL (optional; public app URL for config/deep links)
# - REDIS_URL (optional; shared cache + Nominatim coordination for multi-instance)
# - NOMINATIM_EMAIL (optional; recommended for geocoding User-Agent policy)
#
# Production DB: consider connection pool tuning on DATABASE_URL, e.g.
#   ?connection_limit=5&pool_timeout=20
```

3. Run database migrations:
```bash
pnpm prisma:generate
pnpm prisma migrate deploy
```
(Use `pnpm prisma:migrate` for interactive `migrate dev` in local development.)

**If `20260405140000_enums_trgm_review_stats` failed with `operator does not exist: "AppointmentStatus" = text`:** an older version of that migration altered `appointments.status` before dropping the overlap exclusion constraint. The migration file is fixed (drop constraint first, convert columns, then re-add exclusion using `'CANCELLED'::"AppointmentStatus"`). Mark the failed run rolled back, then deploy again:
```bash
pnpm prisma migrate resolve --rolled-back 20260405140000_enums_trgm_review_stats
pnpm prisma migrate deploy
```
The updated SQL is idempotent (safe if some enum steps already ran).

4. Seed the database:
```bash
pnpm prisma:seed
```

5. Start the development server:
```bash
pnpm start:dev
```

The API will be available at `http://localhost:3000/v1`
Swagger documentation at `http://localhost:3000/api` (disabled when `NODE_ENV=production`)

## Test Accounts

After seeding:
- Admin: `admin@planity.com` / `admin123`
- Provider: `provider@planity.com` / `provider123`
- Client: `client@planity.com` / `client123`

## Database

- Prisma Studio: `pnpm prisma:studio`
- Generate Prisma Client: `pnpm prisma:generate`

## API Endpoints

### Auth
- `POST /v1/auth/register` - Register new user
- `POST /v1/auth/login` - Login
- `POST /v1/auth/refresh` - Refresh token (rotates refresh session server-side)
- `POST /v1/auth/logout` - Revoke refresh token (body: `{ "refreshToken"?: string }`)
- `POST /v1/auth/logout-all` - Revoke all refresh sessions (JWT required)
- `GET /v1/auth/me` - Current user profile (canonical; includes `createdAt`, `status`)

### Businesses
- `GET /v1/businesses` - List businesses
- `GET /v1/businesses/:id` - Get business details
- `GET /v1/businesses/:id/services` - Get business services
- `GET /v1/businesses/:id/staff` - Get business staff

### Availability
- `GET /v1/businesses/:id/availability` - Get available slots

### Appointments
- `POST /v1/appointments` - Create appointment
- `GET /v1/appointments/me` - Get my appointments (`?page=&limit=&upcoming=`)
- `GET /v1/appointments/:id` - Get appointment details
- `POST /v1/appointments/:id/cancel` - Cancel appointment

### Provider (requires auth)
- `POST /v1/businesses` - Create business (provider owner / admin)
- `POST /v1/businesses/:businessId/services` - Create service
- `POST /v1/businesses/:businessId/services/:serviceId/variants` - Create service variant

