# Implementation Roadmap — Post-Baseline (v0.5 → v1.0)

Baseline: security-hardened, purged, QA-gated codebase (see GATES.md, 22/22 met).
Every phase below ends with `pnpm typecheck && pnpm lint && pnpm test` green
(same discipline as GATES.md — new gates file per leaf before work starts).

## Status (updated as phases land)

| Phase | State |
|---|---|
| Baseline purge + security | ✅ committed (`4d9ad81`) |
| 1 Quick wins | ✅ committed (`4d9ad81`) |
| 2 Provider portal | ✅ API `f0fed17`, mobile `86ee1fd` |
| 3 Notifications | ✅ `4f49371` — in-process scheduler; BullMQ driver deferred to Phase 5 |
| 4 Admin dashboard | ✅ `d8e3b47` — zero-dep static web app styled from editorialTheme tokens. **Platform note:** pnpm store corruption blocks adding an Expo dependency tree on this machine; when installs are healthy, port the four views onto the shared Expo shell reusing `@planity/ui` (the CSS in apps/admin mirrors those exact token values, and all endpoints it consumes stay identical) |
| 5 Ops hardening | ⏭️ next — Dockerfiles, compose, CI image build, Sentry, backups, dependency classification fixes (helmet/ioredis/pino → prod deps) |

## Global contracts (bind ALL phases)

| Contract | Rule |
|---|---|
| Auth | JWT via `JwtAuthGuard`; roles from `@planity/shared` enum (`client\|providerOwner\|providerStaff\|admin`); guards explicit per controller |
| Ownership | Every provider write re-verifies `provider.findFirst({ userId, businessId })` server-side — never trust body-supplied businessId |
| Errors | GlobalExceptionFilter envelope; P2002→409, P2025→404, 23P01→409 slot conflict, unexpected → generic 500 |
| Validation | class-validator DTOs only; global pipe stays `whitelist + forbidNonWhitelisted` |
| UI | React Native surfaces use ONLY `@planity/ui` primitives (`Text/Button/Card/Input/Badge`) + `editorialTheme` tokens (colors/spacing/typography/radius). No hex literals, no inline font sizes, no new design systems. Uppercase letter-spaced labels for section headers (existing editorial pattern) |
| Queues | Queue names: `notifications`, `reminders`. Payloads typed in `@planity/shared`. All handlers idempotent (keyed by jobId/dedup key) |
| Deps | Any dependency addition runs on a healthy install (store was corrupted; run `pnpm store status` first, prune if dirty) |

---

## Phase 1 — Quick wins (~2 days)

Unlocks existing value with tiny surface area.

1. **Health endpoint** — `/v1/health`: liveness (always 200) + readiness (Prisma `$queryRaw(1)` + Redis ping, 200/503). No auth. Gate: curl-ready check + spec.
2. **Review moderation API** — `PATCH /v1/reviews/:id/moderate` (`JwtAuthGuard+RolesGuard(admin)`): approve/reject sets `status`, stores moderator note. List pending: `GET /v1/reviews/pending?page&limit` (admin-only). **Verify the `sync_business_review_stats` trigger counts approved-only**; if it counts all, fix trigger in a migration. Mobile: nothing (public lists already filter approved).
3. **Structured logging** — wire `nestjs-pino` (already in devDeps → move to deps during healthy install): request-id correlation (assign `request.id` middleware — the filter already echoes it), redact `authorization` headers.
4. **Pagination sweep** — clamp `GET /services` list; confirm no other unbounded live endpoints remain.
5. **README/docs truth pass** — rewrite README features/roadmap sections + replace malformed `docs/architecture.md`.

## Phase 2 — Provider portal (supply side) (~1.5–2 weeks)

API first (`/v1/provider-portal/*`, all routes `providerOwner|providerStaff` + ownership check), then mobile screens inside the existing `(main)` group using editorial components.

1. **Availability rules** — CRUD over `AvailabilityRule` (weekly windows, effective range). Replace-all-in-transaction semantics like the old dead module intended, but against the REAL schema this time. Overlap-checked server-side.
2. **Time off** — CRUD over `TimeOff` (staff- or business-scoped). Availability service must subtract both (it already handles TimeOff).
3. **Staff management** — create/list/update/deactivate `Staff` records under owned business (invite-by-email comes later with notifications).
4. **Appointment lifecycle** — list by business (filters: date range/status/staff, paginated); transitions `BOOKED→COMPLETED|NO_SHOW|CANCELLED(provider)` as atomic conditional updates (same pattern as client cancel). Providers get read access via existing `findOne` ownership path.
5. **Mobile screens** — `ProviderHome` (today's schedule), `ScheduleEditor` (rules/time-off), `StaffList`, `AppointmentsBoard`. Route group `(provider)` gated on role; BottomNav adapts for provider accounts.

Gates: RBAC matrix test per endpoint; concurrency test (rule edit vs booking race covered by exclusion constraint); UI uses tokens only (grep gate: no `[0-9a-f]{6}` hex in feature files outside theme).

## Phase 3 — Notifications + BullMQ (~1 week)

1. **Deps** — `bullmq`, `@nestjs/bullmq`, move `ioredis` to deps (healthy-install rule).
2. **Queue module** — register `BullMQModule` (real Redis URL from env, no hardcoded localhost), two queues: `notifications` (emails) and `reminders` (delayed jobs).
3. **Producers** — booking created → confirmation email job; booking cancelled → notice; review submitted → notify owner; reminder scheduler: cron scans next-24h BOOKED appointments, enqueues deduped reminder jobs (`jobId = apt:{id}:reminder24h`).
4. **Consumers** — email processor renders simple HTML templates, sends via Resend HTTP API (env-keyed, no-op when `RESEND_API_KEY` unset → log-and-mark-sent for local dev); every send also upserts a `Notification` row (model exists) for in-app history.
5. **Failure policy** — 3 retries exponential backoff, dead-letter log, never throw into request path (producers are fire-and-forget after commit).

Gates: processor unit tests with mocked transport; dedup test (same appointment doesn't double-send); Redis-down = producers degrade silently, consumers retry.

## Phase 4 — Admin dashboard (~1–1.5 weeks)

Rebuild `apps/admin` as an **Expo app reusing `@planity/ui` + `editorialTheme`** (same design language as mobile; runs on web via expo-router too if needed later).

Screens: Login (admin role enforced server-side), Pending Reviews (approve/reject → Phase 1 API), Users (table over paginated admin users API), Businesses (read-only list + suspend toggle if added), Appointments search (by business/date/status).

No new backend beyond Phase 1/2 APIs unless a gap appears — prefer surfacing existing modules.

## Phase 5 — Ops hardening (~1 week)

1. **Dockerfile(api)** — multi-stage: pnpm fetch → prisma generate → nest build → dist runtime image, non-root user, `.dockerignore`.
2. **docker-compose.prod.yml** — api + postgres + redis, healthchecks wired to `/v1/health`, migrations-on-startup (`prisma migrate deploy`). Delete both legacy compose files.
3. **CI** — extend `.github/workflows/ci.yml`: build job producing the api image; push to registry on main tags. Node 20 stays.
4. **Monitoring** — Sentry (DSN env, release tagging) + pino JSON logs shipped by platform; alert on 5xx rate + queue dead-letter count.
5. **Backups/DR** — Supabase PITR enabled (doc + verification step), weekly `pg_dump` script to object storage, one-page restore runbook tested once.
6. **Envs** — `.env.example` regenerated to match `env.validation.ts` exactly; staging project separated.

## Docs

Continuous: every phase updates README + `docs/architecture.md` in the same PR (docs drift is what made this repo unauditable — not repeating that mistake).

## Order & dependencies

```
Phase 0 (commit baseline) ──► Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 4 ──► Phase 5
                                └──────────── docs updated every phase ────────────┘
```

Phase 3 needs Phase 2 events (booking confirmed by provider). Phase 4 only needs Phase 1. Phase 5 anytime after Phase 1 but before any public launch.
