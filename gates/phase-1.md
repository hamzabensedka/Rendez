# Gates: Phase 1 — Quick wins

Scope: health endpoint, review moderation API, structured logging w/ request IDs, pagination sweep, README/architecture truth pass.

- [x] P1-G1: GET /v1/health returns liveness always; /v1/health/ready checks Prisma + Redis (200/503)
  CHECK: node -e "const fs=require('fs'); ['controller','service','module'].forEach(f=>{ if(!fs.existsSync('apps/api/src/health/health.'+f+'.ts')) process.exit(1) })"
  EXPECT: exit 0
  EVIDENCE: health module (3 files) registered in app.module; readiness returns report with explicit 200/503 mapping; DB required, cache optional

- [x] P1-G2: Admin-only review moderation: approve/reject endpoint + pending list; unit-tested
  CHECK: git grep -n "moderate" -- apps/api/src/reviews/reviews.controller.ts
  EXPECT: /moderate/
  EVIDENCE: PATCH /v1/reviews/:id/moderate + GET /v1/reviews/pending, both JwtAuthGuard+RolesGuard(ADMIN); 4 new service tests pass (approve/reject/404/pending-list)

- [x] P1-G3: Rating trigger verified/adjusted so public averages reflect APPROVED reviews only
  EVIDENCE: migration 20260405140000_enums_trgm_review_stats/migration.sql — sync_business_review_stats filters `AND r.status = 'approved'::\"ReviewStatus\"` for both AVG and COUNT. No change needed.

- [x] P1-G4: Requests carry correlation IDs; logs structured via pino; secrets redacted
  CHECK: git grep -n "genReqId" -- apps/api/src/app.module.ts
  EXPECT: /genReqId/
  EVIDENCE: LoggerModule.forRoot with genReqId=crypto.randomUUID (echoed by GlobalExceptionFilter via req.id), pino JSON logs (pino-pretty outside production), redact list covers authorization/cookie/password/refreshToken. NOTE pino deps remain in devDependencies — classification fix joins G9 ABANDON batch at Dockerization.

- [x] P1-G5: No unbounded live list endpoints remain
  CHECK: git grep -n "ArrayMaxSize" -- apps/api/src/appointments/dto/create-appointment.dto.ts
  EXPECT: /ArrayMaxSize\(20\)/
  EVIDENCE: full findMany sweep (17 non-spec sites): every call paginated, viewport-capped (200), date-range-scoped, user-scoped, or a naturally-small catalog; no global dump route exists post-purge. Booking items array now capped at 20.

- [x] P1-G6: README + docs/architecture.md describe post-purge reality; links resolve
  CHECK: git grep -in "rondez|autocrew|payment" -- README.md
  EXPECT: /^$/
  EVIDENCE: README rewritten (real feature list, ROADMAP pointer, working links); docs/architecture.md replaced malformed single-liner with real diagram/module list/contracts incl. deleted-modules note

- [x] P1-G7: Workspace gates still green after Phase 1 (typecheck/lint/test exit 0)
  CHECK: pnpm test
  EXPECT: exit 0
  EVIDENCE: typecheck exit 0, lint exit 0, test exit 0 — api 41/41 tests (37+4 moderation), mobile 3/3
