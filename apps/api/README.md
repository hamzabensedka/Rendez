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
# - REDIS_URL (optional - use Upstash or skip for MVP)
```

3. Run database migrations:
```bash
pnpm prisma:generate
pnpm prisma:migrate
```

4. Seed the database:
```bash
pnpm prisma:seed
```

5. Start the development server:
```bash
pnpm start:dev
```

The API will be available at `http://localhost:3000/v1`
Swagger documentation at `http://localhost:3000/api`

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
- `POST /v1/auth/refresh` - Refresh token
- `GET /v1/auth/me` - Get current user

### Businesses
- `GET /v1/businesses` - List businesses
- `GET /v1/businesses/:id` - Get business details
- `GET /v1/businesses/:id/services` - Get business services
- `GET /v1/businesses/:id/staff` - Get business staff

### Availability
- `GET /v1/businesses/:id/availability` - Get available slots

### Appointments
- `POST /v1/appointments` - Create appointment
- `GET /v1/appointments/me` - Get my appointments
- `GET /v1/appointments/:id` - Get appointment details
- `POST /v1/appointments/:id/cancel` - Cancel appointment

### Provider (requires auth)
- `POST /v1/provider/businesses` - Create business
- `POST /v1/provider/services` - Create service
- `POST /v1/provider/service-variants` - Create service variant

