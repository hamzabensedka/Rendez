# Rondez

Salon and beauty booking marketplace with an Apple-inspired mobile experience. Discover local businesses, browse services, pick time slots, and manage appointments.

## Tech stack

- **Monorepo:** Nx + pnpm
- **Mobile:** Expo React Native, Expo Router, TypeScript
- **Backend:** NestJS, Prisma, PostgreSQL (Supabase)
- **Shared packages:** `@planity/ui` (design system), `@planity/shared` (types & utils)

## Features (shipped)

- User auth (register, login, JWT refresh via SecureStore)
- Explore businesses, business detail (services, staff, reviews placeholder)
- Real-time availability and appointment booking
- My bookings list and appointment detail
- Device-local favorites
- Provider business creation API (JWT-protected)

## Project structure

```
apps/
  api/       # NestJS backend (prefix /v1)
  mobile/    # Expo React Native app
packages/
  shared/    # Types, utils, constants
  ui/        # Design tokens and components
docs/        # Architecture, setup, product spec
```

## Getting started

**Full setup guide:** [docs/setup/QUICK_START.md](docs/setup/QUICK_START.md)

### Quick start

```bash
pnpm install

# API
cd apps/api && cp .env.example .env
# Set DATABASE_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
pnpm prisma:generate && pnpm prisma:migrate && pnpm prisma:seed
pnpm start:dev                    # http://localhost:3000/v1

# Mobile (separate terminal)
cd apps/mobile
# Create .env with EXPO_PUBLIC_API_URL=http://localhost:3000/v1
pnpm start
```

Swagger API docs: `http://localhost:3000/api` when the API is running.

## Documentation

| Doc | Description |
|-----|-------------|
| [docs/setup/QUICK_START.md](docs/setup/QUICK_START.md) | Step-by-step local setup |
| [docs/setup/SUPABASE_SETUP.md](docs/setup/SUPABASE_SETUP.md) | Supabase database setup |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture |
| [docs/IMPLEMENTATION_SUMMARY.md](docs/IMPLEMENTATION_SUMMARY.md) | What's built vs. roadmap |
| [docs/product.md](docs/product.md) | Product specification |
| [apps/api/README.md](apps/api/README.md) | API module reference |

## Development commands

```bash
pnpm dev          # Start API + mobile in parallel
pnpm build        # Build all apps
pnpm lint         # Lint all projects
pnpm test         # Run tests
```

## Roadmap

Payments, admin dashboard (Next.js), Redis/BullMQ job queue, provider mobile app, push notifications, account-level favorites.

## License

Private — portfolio project.
