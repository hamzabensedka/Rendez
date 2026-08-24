# Planity

Salon and beauty booking marketplace. Discover local businesses, browse services,
pick real availability, book — with a provider portal and admin tooling on the
same design language.

## Status

The codebase is a **clean baseline**: security-hardened, dead-code-free, all QA
gates green (`pnpm typecheck && pnpm lint && pnpm test`). See
[docs/ROADMAP.md](docs/ROADMAP.md) for the active implementation plan.

## Tech stack

- **Monorepo:** Nx + pnpm (`apps/*`, `packages/*`)
- **Mobile:** Expo React Native (SDK 54), Expo Router, TanStack Query, TypeScript strict
- **API:** NestJS 10, Prisma + PostgreSQL (Supabase), Redis cache, BullMQ (planned)
- **Shared packages:** `@planity/ui` (design system: Text/Button/Card/Input/Badge + editorialTheme tokens), `@planity/shared` (types & utils)

## What works today

- Auth: register/login, JWT access+refresh with hashed rotating refresh-token sessions, logout/logout-all
- Client: explore businesses, map/viewport search, business detail, real availability slots, booking (validated, conflict-safe via DB exclusion constraint), bookings list, favorites
- Provider: same-business appointment read/cancel paths (portal UI: see roadmap Phase 2)
- Reviews: create on completed appointments, public approved-only listings; moderation endpoints for admins
- Platform: rate limiting (global floor + stricter auth limits), structured pino logs with request IDs, health probes (`/v1/health`, `/v1/health/ready`)

## Project structure

```
apps/
  api/       # NestJS API (prefix /v1) — modules in src/, one folder per domain
  mobile/    # Expo client (client experience)
packages/
  shared/    # Types, constants, utils used by api + mobile
  ui/        # Design-system primitives + editorialTheme tokens (single source of style)
docs/
  ROADMAP.md       # Active plan (provider portal, notifications, admin, ops)
  architecture.md  # System architecture
```

## Getting started

See [docs/setup/QUICK_START.md](docs/setup/QUICK_START.md).

```bash
pnpm install

# API
cd apps/api && cp .env.example .env   # DATABASE_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
node ../../node_modules/prisma/build/index.js generate
pnpm prisma:migrate && pnpm prisma:seed
pnpm start:dev                        # http://localhost:3000/v1

# Mobile (separate terminal)
cd apps/mobile
echo "EXPO_PUBLIC_API_URL=http://localhost:3000/v1" > .env
pnpm start
```

Swagger API docs: `http://localhost:3000/api` (non-production only).

## Development commands

```bash
pnpm dev          # API + mobile in parallel (nx run-many serve)
pnpm typecheck    # tsc --noEmit across workspace projects
pnpm lint         # eslint across workspace projects
pnpm test         # jest suites across workspace projects
pnpm format       # prettier write
```

## Documentation

| Doc | Description |
|-----|-------------|
| [docs/ROADMAP.md](docs/ROADMAP.md) | Active implementation plan |
| [docs/architecture.md](docs/architecture.md) | System architecture |
| [docs/setup/QUICK_START.md](docs/setup/QUICK_START.md) | Local setup |

## License

Private.
