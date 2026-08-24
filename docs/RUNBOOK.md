# Operations Runbook

## Health & readiness

- `GET /v1/health` — liveness (always 200 while the process is up)
- `GET /v1/health/ready` — readiness: `200` when Postgres answers, `503 {checks:{database:false}}` otherwise. Redis never degrades status (in-memory fallback).

Container/compose healthchecks target `/v1/health`; load balancers should use `/v1/health/ready`.

## Logs

pino JSON to stdout with per-request `req.id` correlation. Alert suggestions for your log platform:
- 5xx rate > 2% over 5 minutes
- repeated `GlobalExceptionFilter` stacks for the same route
- `ReminderScheduler` warn lines (scan failures)

Sentry SDK integration is intentionally deferred until dependency installs are healthy on this machine (same batch as BullMQ driver swap) — see docs/ROADMAP.md.

## Database backups

- **Automated:** `.github/workflows/backup.yml` — weekly `pg_dump | gzip`, uploaded as a workflow artifact (90-day retention). Requires secret `BACKUP_DATABASE_URL` (a read-only Supabase connection string).
- **Supabase PITR:** enable Point-in-Time Recovery in the Supabase dashboard (Database → Backups) and verify a restore point appears. This is the primary DR mechanism; the weekly dumps are the secondary.
- Verify monthly: download latest artifact, confirm non-trivial size (>0 bytes, roughly grows with data), run the restore drill below into a scratch database.

### Restore drill (do this once before go-live, then quarterly)

```bash
# 1. Create a scratch database (Supabase project or local container)
docker run -d --name restore-drill -e POSTGRES_PASSWORD=drill -p 5433:5432 postgres:16-alpine

# 2. Restore the dump
gunzip -c planity-db-YYYYMMDDT...Z.sql.gz | \
  docker exec -i restore-drill psql -U postgres -d postgres

# 3. Boot the API against it and verify /v1/health/ready + login works
DATABASE_URL="postgresql://postgres:drill@localhost:5433/postgres" \
JWT_ACCESS_SECRET=<32+ chars> JWT_REFRESH_SECRET=<32+ chars> \
  pnpm --filter @planity/api start:dev

# 4. Tear down
docker rm -f restore-drill
```

Success criteria: `/v1/health/ready` returns 200 and an existing user can log in.

## Deploy

```bash
docker compose -f compose.prod.yml up -d --build
```
Migrations apply automatically at container start (`prisma migrate deploy`) before the server binds. Image builds run on every CI push; publishing to a registry happens only on git tags (requires secrets `REGISTRY_IMAGE` + registry credentials configured in the CI environment).

## Environment

Copy `apps/api/.env.example` → `apps/api/.env` and fill values; every variable there is consumed by `apps/api/src/env.validation.ts`. Staging uses a separate Supabase project + its own secret set.
