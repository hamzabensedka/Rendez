# Gates: Phase 5 — Ops hardening

Scope: containerized API, prod compose with healthchecks, CI image build, DB backups + restore runbook, env truth, dependency classification fix.

- [x] P5-G1: Multi-stage Dockerfile for the API; non-root runtime; container starts with migrations then serves
  CHECK: grep api.Dockerfile for USER node/health/migrate deploy
  EXPECT: >=2 matches
  EVIDENCE: docker/api.Dockerfile — multi-stage (pnpm fetch -> offline install -> prisma generate -> nest build), runtime USER node, CMD runs 'prisma migrate deploy' then dist; .dockerignore added

- [x] P5-G2: Legacy broken compose files deleted; single prod compose with healthchecks wired to /v1/health
  CHECK: git ls-files legacy composes = empty; compose.prod.yml present with /v1/health wget healthcheck + depends_on service_healthy
  EXPECT: both
  EVIDENCE: root docker-compose.yml + docker/docker-compose.yml git-rm'd; single compose.prod.yml (postgres16+redis7 healthchecked, api migrations-on-start)

- [x] P5-G3: CI builds the API image; publishes to registry only on version tags
  CHECK: build-push-action in ci.yml
  EXPECT: match
  EVIDENCE: ci.yml image job (needs lint/typecheck/test): builds planity-api:ci every run w/ gha cache; publishes REGISTRY_IMAGE:{tag,latest} only on refs/tags/*

- [x] P5-G4: Weekly DB backup automation + tested-step restore runbook
  CHECK: pg_dump in backup workflow + RUNBOOK
  EXPECT: match
  EVIDENCE: .github/workflows/backup.yml weekly cron+manual dispatch (pg_dump|gzip artifact, 90d retention, BACKUP_DATABASE_URL secret); docs/RUNBOOK.md restore drill w/ success criteria + PITR guidance

- [x] P5-G5: .env.example matches env.validation.ts exactly (required vars all listed, placeholders only)
  CHECK: required-vars script
  EXPECT: exit 0
  EVIDENCE: .env.example rewritten to mirror env.validation.ts exactly (3 required + documented optionals incl. REDIS_URL/ALLOWED_ORIGINS/LOG_LEVEL/RESEND_API_KEY/REMINDER_SCHEDULER); placeholders only

- [x] P5-G6: Dependency classification fixed: helmet/ioredis/pino family in dependencies; lockfile synced WITHOUT touching local node_modules
  CHECK: deps classification script
  EXPECT: exit 0
  EVIDENCE: helmet+ioredis+pino+nestjs-pino moved to dependencies (measured DEPS:0); pnpm-lock.yaml synced via --lockfile-only WITHOUT touching local node_modules — closes the G9 ABANDON batch from the baseline phase

- [x] P5-G7: Workspace gates still green after Phase 5
  CHECK: pnpm test
  EXPECT: exit 0
  EVIDENCE: typecheck/lint/test all exit 0 post-changes (63 api tests cached-green, mobile 3)
