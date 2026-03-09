# Planity Clone - Booking Marketplace MVP

A salon/beauty booking marketplace with Apple-style UI/UX, built with React Native (Expo), NestJS, and Postgres.

## Tech Stack

- **Mobile**: Expo React Native + TypeScript (Expo Router)
- **Backend**: NestJS + Prisma + Postgres
- **Monorepo**: Nx

Cache/Jobs (Redis + BullMQ) and admin dashboard are planned; the current codebase is the API + mobile app only.

## Getting Started

**👉 See [QUICK_START.md](QUICK_START.md) for detailed step-by-step instructions!**

### Quick Overview

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   - API: Copy `apps/api/.env.example` to `apps/api/.env` and set `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` (see [QUICK_START.md](QUICK_START.md) or `SUPABASE_SETUP.md`).
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

packages/
  shared/       # Shared types, utils, constants
  ui/           # Design tokens, components
  config/       # ESLint, TypeScript configs

docs/           # Architecture, roadmap, audit notes
```

Planned later: admin dashboard (Next.js), Redis/BullMQ, deployment/infra.

## Development

- `pnpm dev` - Start all apps in dev mode
- `pnpm build` - Build all apps
- `pnpm lint` - Lint all projects
- `pnpm test` - Run tests
- `pnpm nx serve api` - Start API only
- `pnpm nx start mobile` - Start mobile app only

## Environment Variables

- **API**: Copy `apps/api/.env.example` to `apps/api/.env` and set real values (never commit `.env` or real secrets). See [QUICK_START.md](QUICK_START.md).
- **Mobile**: Create `apps/mobile/.env` with `EXPO_PUBLIC_API_URL` pointing at your API.

