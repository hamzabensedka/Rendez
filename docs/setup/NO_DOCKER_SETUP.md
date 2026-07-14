# Setup Without Docker

This project is configured to work **without Docker** using cloud services:

- **Database**: Supabase (Postgres in the cloud)
- **Redis**: Upstash (optional, cloud Redis) or skip for MVP

## Why No Docker?

- ✅ Easier setup - no Docker installation needed
- ✅ Works on all platforms (Windows, Mac, Linux)
- ✅ No architecture compatibility issues
- ✅ Free tiers available for Supabase and Upstash
- ✅ Production-ready from day one

## Setup Steps

### 1. Get Supabase Database

1. Go to: https://seermvgqlfnrpjprtlva.supabase.co
2. Settings → Database → Connection string
3. Copy the URI connection string

### 2. Get Upstash Redis (Optional)

1. Sign up at: https://upstash.com (free tier available)
2. Create a Redis database
3. Copy the connection URL

### 3. Configure Environment

Create `apps/api/.env`:
```bash
# Supabase Database (required)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.seermvgqlfnrpjprtlva.supabase.co:5432/postgres"

# Redis (optional - use Upstash or skip)
REDIS_URL="your-upstash-redis-url"

# JWT Secrets (generate with: node scripts/generate-secrets.js)
JWT_ACCESS_SECRET="..."
JWT_REFRESH_SECRET="..."

# App config
APP_BASE_URL="http://localhost:3000"
PORT=3000
NODE_ENV=development
```

### 4. Run Migrations

```bash
cd apps/api
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
```

### 5. Start Development

```bash
# Terminal 1: API
cd apps/api
pnpm start:dev

# Terminal 2: Mobile
cd apps/mobile
pnpm start
```

That's it! No Docker needed. 🎉

## If You Want to Use Docker Later

The `docker-compose.yml` file is still available if you want to run Postgres/Redis locally, but it's completely optional. The project works perfectly with cloud services.

