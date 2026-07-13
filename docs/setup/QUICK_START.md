# Quick Start Guide

Follow these steps to get the project running:

## Prerequisites

- Node.js >= 18 installed
- pnpm >= 8 installed
- Supabase account (for database) - **No Docker needed!**
- (Optional) Upstash account (for Redis) or skip Redis for MVP

## Step 1: Install Dependencies

```bash
pnpm install
```

## Step 2: Set Up Environment Variables

### For API (Backend)

1. Create `apps/api/.env` file:
```bash
cd apps/api
cp .env.example .env
```

2. Edit `apps/api/.env` and set:

**Database (e.g. Supabase):**
- In your Supabase project: Settings → Database → Connection string (URI).
- Use the URI and replace the password placeholder with your database password.
```bash
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"
```

**JWT secrets (required):**
- Generate two strong random strings (e.g. `openssl rand -base64 32` run twice).
- Do not use example values; use different secrets for dev/staging/production.
```bash
JWT_ACCESS_SECRET="<paste-first-generated-secret>"
JWT_REFRESH_SECRET="<paste-second-generated-secret>"
```

**Redis (optional for MVP):**
- Can be skipped for local development. If needed, use e.g. Upstash and set `REDIS_URL`.

### For Mobile App

1. Create `apps/mobile/.env` file:
```bash
cd apps/mobile
```

2. Create `.env` with:
```bash
EXPO_PUBLIC_API_URL=http://localhost:3000/v1
```

**Note:** For physical devices, replace `localhost` with your computer's IP address (e.g., `http://192.168.1.100:3000/v1`)

## Step 3: Set Up Database

```bash
cd apps/api

# Generate Prisma Client
pnpm prisma:generate

# Run migrations (creates all tables)
pnpm prisma:migrate

# Seed database (creates test users and data)
pnpm prisma:seed
```

**Test accounts created:**
- Admin: `admin@planity.com` / `admin123`
- Provider: `provider@planity.com` / `provider123`
- Client: `client@planity.com` / `client123`

## Step 4: Start the Development Servers

### Terminal 1: Start API Server

```bash
cd apps/api
pnpm start:dev
```

API will run at: http://localhost:3000/v1
Swagger docs at: http://localhost:3000/api

### Terminal 2: Start Mobile App

```bash
cd apps/mobile
pnpm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app (on your phone)

## Step 5: Test the App

1. **Open the mobile app** (via Expo Go or simulator)
2. **Register/Login** with test account: `client@planity.com` / `client123`
3. **Browse businesses** in the Explore tab
4. **View business details** and services
5. **Book an appointment** by selecting a service and time slot
6. **View bookings** in the Bookings tab

## Troubleshooting

### API won't start
- Check that `.env` file exists in `apps/api/`
- Verify `DATABASE_URL` is correct
- Make sure Prisma migrations ran successfully: `pnpm prisma:migrate`

### Mobile app can't connect to API
- Ensure API is running on port 3000
- Check `EXPO_PUBLIC_API_URL` in `apps/mobile/.env`
- For physical device: Use your computer's IP instead of `localhost`
- Check firewall isn't blocking port 3000

### Database connection errors
- Verify Supabase connection string is correct
- Check that migrations ran: `pnpm prisma:migrate`
- Try: `pnpm prisma:studio` to verify connection

### Prisma errors
- Run: `pnpm prisma:generate` after schema changes
- Run: `pnpm prisma:migrate` to apply migrations

## Next Steps

- Check `SUPABASE_SETUP.md` for detailed Supabase setup
- Check `apps/api/README.md` for API documentation
- Check `apps/mobile/README.md` for mobile app info

## Development Commands

```bash
# Run both API and mobile (if configured)
pnpm dev

# Lint all projects
pnpm lint

# Type check all projects
pnpm typecheck

# Format code
pnpm format
```

