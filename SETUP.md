# Setup Guide

## Prerequisites

- Node.js >= 18
- pnpm >= 8
- Supabase account (for database) - **No Docker needed!**

## Initial Setup

1. **Install dependencies:**
```bash
pnpm install
```

2. **Set up API environment:**
```bash
cd apps/api
cp .env.example .env
# Edit .env with your configuration
```

4. **Run database migrations:**
```bash
cd apps/api
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
```

5. **Set up mobile environment:**
```bash
cd apps/mobile
# Create .env file with:
# EXPO_PUBLIC_API_URL=http://localhost:3000/v1
```

## Running the Apps

### API Server
```bash
cd apps/api
pnpm start:dev
```
API: http://localhost:3000/v1
Swagger: http://localhost:3000/api

### Mobile App
```bash
cd apps/mobile
pnpm start
```
Then scan QR code with Expo Go app or press `i` for iOS simulator / `a` for Android emulator.

## Test Accounts

After seeding the database:
- **Admin**: `admin@planity.com` / `admin123`
- **Provider**: `provider@planity.com` / `provider123`
- **Client**: `client@planity.com` / `client123`

## Development Workflow

1. Make changes to code
2. API auto-reloads on save
3. Mobile app hot-reloads via Expo
4. Check Swagger docs for API changes

## Troubleshooting

### Database connection issues
- Verify Supabase connection string is correct
- Check DATABASE_URL in `.env` matches your Supabase project
- Ensure Supabase project is active

### Mobile app can't connect to API
- Ensure API is running on port 3000
- Check EXPO_PUBLIC_API_URL in mobile `.env`
- For iOS simulator, use `localhost`
- For physical device, use your computer's IP address

### Prisma errors
- Run `pnpm prisma:generate` after schema changes
- Run `pnpm prisma:migrate` to apply migrations

