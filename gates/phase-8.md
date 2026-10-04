# Gates: Phase 8 — Admin billing UI

Scope: add a Billing/Subscriptions view to the zero-dep admin SPA (`apps/admin/`),
following the existing design system (styles.css tokens), clean-code patterns
(api/esc/statusBadge/pager), and security (esc() on all rendered values, admin-only
endpoints, no inline secrets). Consumes the Phase 7a billing API. No new deps.

## A — DESIGN + SECURITY

- [x] A1: Billing nav item added to the sidebar and router handles `#/billing`
  CHECK: rg -n "billing" apps/admin/index.html apps/admin/app.js
  EXPECT: /data-nav="billing"/ AND /renderBilling/
  EVIDENCE: index.html:33 `data-nav="billing"`; app.js:524 `hash === 'billing') renderBilling()`; app.js:330 `async function renderBilling()`
- [x] A2: All dynamic values rendered through esc() (XSS-safe); no raw innerHTML of API data
  CHECK: manual read of renderBilling rows (app.js:367-389)
  EXPECT: only esc()-wrapped or static interpolations in billing renderer
  EVIDENCE: biz.name/slug/id/plan via esc(); dates via fmtDate (esc); plan via planBadge (esc); prompt() inputs are admin-typed and sent as JSON, never rendered
- [x] A3: Plan-status badges reuse statusBadge/badge classes; layout reuses card/table/toolbar/pager tokens — no new hex colors or ad-hoc styles
  CHECK: rg -n "#[0-9a-fA-F]{6}" apps/admin/app.js
  EXPECT: /^$/ (no hex literals in JS)
  EVIDENCE: exit 1 (no matches); zero styles.css changes; planBadge reuses .badge/.success/.danger/.dark

## B — FUNCTIONALITY

- [x] B1: Billing table lists salons with planStatus badge + trial/period dates (GET /admin/subscriptions)
  CHECK: rg -n "/admin/subscriptions" apps/admin/app.js
  EXPECT: /admin\/subscriptions/
  EVIDENCE: app.js:360 GET `/admin/subscriptions?...`; table renders planBadge + trial/grace/period dates (app.js:380-381)
- [x] B2: Filter by planStatus + pagination wired
  CHECK: rg -n "planStatus" apps/admin/app.js
  EXPECT: /planStatus/
  EVIDENCE: filter select (app.js:336-338) -> params.set('planStatus') (app.js:354); pager -> billingFilters.page (app.js:393-402)
- [x] B3: Per-row actions call the real endpoints: transition plan (PATCH), create invoice (POST invoices), mark invoice paid (POST mark-paid)
  CHECK: rg -n "subscriptions/\$\{|mark-paid|/invoices" apps/admin/app.js
  EXPECT: /mark-paid/ AND /invoices/
  EVIDENCE: PATCH app.js:420; POST invoices app.js:428; POST mark-paid app.js:436
- [x] B4: Actions prompt for required input (plan, amount, method) and surface server errors; reload the view on success
  CHECK: rg -n "renderBilling\(" apps/admin/app.js
  EXPECT: >=2 (initial + reload-after-action)
  EVIDENCE: promptPlan/promptInvoice/promptPayment build DTO-shaped bodies (reference field per MarkInvoicePaidDto); errors via alert(error.message); renderBilling() reload at app.js:441

## C — QA + COMMIT

- [x] C1: app.js is syntactically valid (node --check); admin is static, no separate lint target
  CHECK: node --check apps/admin/app.js
  EXPECT: exit 0
  EVIDENCE: exit 0 (after final hardening)
- [x] C2: Workspace still green (typecheck + test unaffected; admin is static)
  CHECK: pnpm test
  EXPECT: exit 0
  EVIDENCE: exit 0 — Tests: 87 passed, 87 total; Nx "Successfully ran target test for 2 projects"
- [x] C3: Committed; only CRLF/lockfile artifacts remain
  CHECK: git status --short
  EXPECT: only .gitignore / apps/api/package.json / pnpm-lock.yaml
  EVIDENCE: commit c3d6922; post-commit `git status --short` = empty (clean)
- [x] C4: graphify rebuilt
  CHECK: python -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"
  EXPECT: exit 0 (PYTHONUTF8=1)
  EVIDENCE: exit 0 — "Rebuilt: 839 nodes, 1231 edges, 77 communities"
