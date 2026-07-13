# Supabase Setup Guide

## Getting Your Database Connection String

1. Go to your [Supabase](https://supabase.com) project dashboard.
2. Navigate to **Settings** → **Database**.
3. Find the **Connection string** section and copy the **URI**.
4. It will look like (replace placeholders with your values):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```

## Setting Up the Database

### Option 1: Using Prisma Migrate (Recommended)

1. Update `apps/api/.env` with your Supabase connection string (from step above):
   ```bash
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   ```

2. Run Prisma migrations:
   ```bash
   cd apps/api
   pnpm prisma:generate
   pnpm prisma:migrate
   ```

3. Seed the database:
   ```bash
   pnpm prisma:seed
   ```

### Option 2: Using Supabase SQL Editor

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Run the migration SQL from `apps/api/prisma/migrations/` or use the Prisma migration files

## Redis Alternative

Since Supabase doesn't provide Redis, you have a few options:

1. **Use Upstash Redis** (Free tier available):
   - Sign up at https://upstash.com
   - Create a Redis database
   - Get the connection URL
   - Update `apps/api/.env`:
     ```bash
     REDIS_URL="your-upstash-redis-url"
     ```

2. **Skip Redis for MVP** (simplified):
   - For MVP, you can comment out Redis-dependent features
   - JWT refresh tokens can be stored in the database instead
   - Rate limiting can use in-memory store for development

3. **Local Redis** (if you have Docker working):
   - Keep using `docker-compose.yml` for Redis only
   - Or install Redis locally

## Environment Variables

Copy `apps/api/.env.example` to `apps/api/.env` and set at least:

- `DATABASE_URL` – your Supabase connection URI (see above).
- `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` – strong random strings (see below).

Optional: `JWT_ACCESS_EXPIRY`, `JWT_REFRESH_EXPIRY`, `PORT`, `NODE_ENV`. Do not commit `.env` or real secrets.

## Generating JWT Secrets

Generate two different secure random strings (one for access, one for refresh). Examples:

**OpenSSL:**
```bash
openssl rand -base64 32
```
Run twice to get two secrets.

**Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
Run twice.

**Important:**
- Use different values for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.
- Never commit `.env` or real secrets; use different secrets per environment (dev/staging/production).

## Testing the Connection

After setting up, test the connection:

```bash
cd apps/api
pnpm prisma:studio
```

This should open Prisma Studio and show your database tables.

