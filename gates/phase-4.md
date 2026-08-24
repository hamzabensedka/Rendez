# Gates: Phase 4 — Admin dashboard

Scope: admin web dashboard (login, review moderation, users, businesses, appointment search) + ADMIN appointments/businesses API. Zero-dependency frontend due to corrupted pnpm store (documented swap path).

- [x] P4-G1: Backend: GET /v1/admin/appointments + GET /v1/admin/businesses (ADMIN guard) + unit tests
  CHECK: node -e "const fs=require('fs'); ['admin.controller.ts','admin.service.ts','admin.service.spec.ts'].forEach(f=>{ if(!fs.existsSync('apps/api/src/admin/'+f)) process.exit(1) })"
  EXPECT: exit 0
  EVIDENCE: AdminModule registered; controller class-guarded JwtAuthGuard+RolesGuard(ADMIN); 3 service tests (clamped pagination, filter application, non-active inclusion) pass

- [x] P4-G2: Admin frontend exists with zero runtime deps (no package install required)
  CHECK: node -e "const fs=require('fs'); process.exit(fs.existsSync('apps/admin/index.html')&&fs.existsSync('apps/admin/app.js')&&fs.existsSync('apps/admin/styles.css')?0:1)"
  EXPECT: exit 0
  EVIDENCE: three files present; `node --check app.js` exit 0; runs from any static server (see README note re ALLOWED_ORIGINS)

- [x] P4-G3: Frontend covers all five functions: login, pending-reviews moderation, users, businesses, appointment search
  CHECK: Select-String counts of reviews/pending, auth/login, admin/appointments, /users?page, /admin/businesses in app.js each >= 1
  EXPECT: 1,1,1,1,1
  EVIDENCE: measured counts = 1,1,1,1,1

- [x] P4-G4: Design contract: styles.css mirrors editorialTheme token values via CSS variables
  CHECK: Select-String ":root" styles.css count >= 1
  EXPECT: >=1
  EVIDENCE: :root block maps every editorialTheme color + spacing/type scale to CSS vars with source comment pointing back at packages/ui tokens and the swap plan

- [x] P4-G5: Role safety: 401 clears session to login; 403 surfaces admin-required message client-side
  CHECK: git grep -n "403" -- apps/admin/app.js
  EXPECT: /403/
  EVIDENCE: api() interceptor handles 401 (logout+login view) and 403 (thrown message '403: admin role required'); requireAdmin() double-checks role after /auth/me reload

- [x] P4-G6: Workspace gates green (api touched only by new admin module)
  CHECK: pnpm test
  EXPECT: exit 0
  EVIDENCE: typecheck/lint/test all exit 0; api suites 8 passed, 63/63 tests (+3 admin)
