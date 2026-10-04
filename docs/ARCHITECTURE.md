# Architecture

## System shape

Modular monolith API + React Native client, one shared design system.

```
┌──────────────┐   HTTP /v1    ┌──────────────────────────────┐
│ Expo client  │ ────────────► │ NestJS API (stateless)       │
│ apps/mobile  │               │  ├─ controllers → services    │
└──────────────┘               │  ├─ global: ValidationPipe,   │
                               │   │  ThrottlerGuard, pino,    │
                               │   │  GlobalExceptionFilter    │
                               │  └─ Prisma ─► PostgreSQL      │
                               │        └────► Redis (cache)   │
                               └──────────────────────────────┘
```

- **Stateless API**: JWT bearer auth; horizontally scalable. The per-request user fetch in `jwt.strategy` doubles as instant revocation for suspended/deleted accounts.
- **Postgres** owns integrity-critical invariants: GiST exclusion constraint (`appointments_no_overlap_per_staff`) prevents double-booking; trigger `sync_business_review_stats` maintains business rating from APPROVED reviews; PostGIS powers viewport search; pg_trgm powers name search.
- **Redis is optional** at all times: availability slot caching + geocoding locks. Failure degrades to in-process memory (single instance) — never to downtime.

## Layers

Controller → Service → Prisma. Business rules live in services; DB-level
constraints are the final authority (the booking flow validates *and* relies on
the exclusion constraint — the loser of a race gets a mapped HTTP 409).

## Cross-cutting contracts

| Concern | Implementation |
|---|---|
| Validation | Global `ValidationPipe` (whitelist + forbidNonWhitelisted + transform); every DTO uses class-validator |
| Errors | Single envelope from `GlobalExceptionFilter`: P2002→409, P2025→404, overlap violation→409, unexpected→generic 500 (details only in logs) |
| Rate limiting | Global floor 100 req/min/IP (`ThrottlerGuard` as APP_GUARD); stricter overrides via `@Throttle` on auth routes |
| AuthZ | Explicit `JwtAuthGuard` (+ `RolesGuard` with roles from `@planity/shared`); ownership re-checked against DB in services |
| Logging | pino JSON logs, per-request correlation id, secrets redacted |
| Health | `/v1/health` liveness; `/v1/health/ready` readiness (DB required, cache optional) |

## Modules (registered)

auth · users · businesses · appointments · availability · reviews · favorites ·
services · service-categories · places · config · redis · prisma · health

Deleted during the baseline purge (do not resurrect without reading
docs/ROADMAP.md): duplicate payment stacks, bullmq/notification stubs,
provider-portal/staff/business-hours scaffolds written against a stale schema.
Their replacements are planned in the roadmap phases.

## Design system

All React Native surfaces (mobile today, provider portal and admin later)
consume `@planity/ui` primitives and `editorialTheme` tokens exclusively —
no hex literals or ad-hoc typography outside the theme package.

## Environments & configuration

Configuration comes exclusively from env vars validated at boot by
`apps/api/src/env.validation.ts` (DATABASE_URL, JWT_ACCESS_SECRET ≥16 chars,
JWT_REFRESH_SECRET, optional REDIS_URL / ALLOWED_ORIGINS / LOG_LEVEL).
Swagger is served only outside production.
