# Supabase Setup Guide

## Getting Your Database Connection String

1. Go to your Supabase project: https://seermvgqlfnrpjprtlva.supabase.co
2. Navigate to **Settings** → **Database**
3. Find the **Connection string** section
4. Copy the **URI** connection string (it should look like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.seermvgqlfnrpjprtlva.supabase.co:5432/postgres
   ```

## Setting Up the Database

### Option 1: Using Prisma Migrate (Recommended)

1. Update `apps/api/.env` with your Supabase connection string:
   ```bash
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.seermvgqlfnrpjprtlva.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
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

Update `apps/api/.env`:

```bash
# Supabase Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.seermvgqlfnrpjprtlva.supabase.co:5432/postgres"

# Redis (Upstash or local)
REDIS_URL="redis://localhost:6379"  # or your Upstash URL

# JWT Secrets (generate strong random strings)
# See below for how to generate these
JWT_ACCESS_SECRET="your-secret-key-here"
JWT_REFRESH_SECRET="your-refresh-secret-here"
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

# App
APP_BASE_URL="http://localhost:3000"
PORT=3000
NODE_ENV=development
```

## Generating JWT Secrets

You need to generate secure random strings for JWT secrets. Here are several ways:

### Option 1: Using the provided script (Recommended)
```bash
node scripts/generate-secrets.js
```

### Option 2: Using OpenSSL (if installed)
```bash
openssl rand -base64 32
```
Run this twice to get two different secrets.

### Option 3: Using Node.js directly
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
Run this twice to get two different secrets.

### Option 4: Online generator
- Visit: https://generate-secret.vercel.app/32
- Generate two different secrets

**Important:** 
- Use different values for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`
- Keep these secrets secure and never commit them to git
- Use different secrets for development, staging, and production

## Testing the Connection

After setting up, test the connection:

```bash
cd apps/api
pnpm prisma:studio
```

This should open Prisma Studio and show your database tables.

