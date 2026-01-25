# Planity Clone - Booking Marketplace MVP

A salon/beauty booking marketplace with Apple-style UI/UX, built with React Native (Expo), NestJS, and Postgres.

## Tech Stack

- **Mobile**: Expo React Native + TypeScript
- **Backend**: NestJS + Prisma + Postgres
- **Cache/Jobs**: Redis + BullMQ
- **Monorepo**: Nx

## Getting Started

**👉 See [QUICK_START.md](QUICK_START.md) for detailed step-by-step instructions!**

### Quick Overview

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   - API: Create `apps/api/.env` (see `SUPABASE_SETUP.md`)
   - Mobile: Create `apps/mobile/.env` with `EXPO_PUBLIC_API_URL=http://localhost:3000/v1`

3. **Set up database (Supabase):**
   ```bash
   cd apps/api
   pnpm prisma:generate
   pnpm prisma:migrate
   pnpm prisma:seed
   ```

4. **Start development servers:**
   - Terminal 1: `cd apps/api && pnpm start:dev` (API at http://localhost:3000/v1)
   - Terminal 2: `cd apps/mobile && pnpm start` (Mobile app via Expo)

**For detailed instructions, see [QUICK_START.md](QUICK_START.md)**

## Project Structure

```
apps/
  api/          # NestJS backend
  mobile/       # Expo React Native app
  admin-web/    # Next.js admin dashboard (future)

packages/
  shared/       # Shared types, utils, constants
  ui/           # Design tokens, components
  config/       # ESLint, TypeScript configs

infra/          # Docker compose, deployment scripts
docs/           # Architecture docs, ADRs
```

## Development

- `pnpm dev` - Start all apps in dev mode
- `pnpm build` - Build all apps
- `pnpm lint` - Lint all projects
- `pnpm test` - Run tests
- `pnpm nx serve api` - Start API only
- `pnpm nx start mobile` - Start mobile app only

## Environment Variables

See `.env.example` files in each app directory for required variables.

