# Gates: Phase 8 — Admin billing UI

Scope: add a Billing/Subscriptions view to the zero-dep admin SPA (`apps/admin/`),
following the existing design system (styles.css tokens), clean-code patterns
(api/esc/statusBadge/pager), and security (esc() on all rendered values, admin-only
endpoints, no inline secrets). Consumes the Phase 7a billing API. No new deps.

## A — DESIGN + SECURITY

- [ ] A1: Billing nav item added to the sidebar and router handles `#/billing`
  CHECK: rg -n "billing" apps/admin/index.html apps/admin/app.js
  EXPECT: /data-nav="billing"/ AND /renderBilling/
  EVIDENCE: pending
- [ ] A2: All dynamic values rendered through esc() (XSS-safe); no raw innerHTML of API data
  CHECK: rg -n "renderBilling" -A 60 apps/admin/app.js | Select-String "innerHTML.*\$\{(?!esc)"
  EXPECT: only esc()-wrapped or static interpolations in billing renderer
  EVIDENCE: pending
- [ ] A3: Plan-status badges reuse statusBadge/badge classes; layout reuses card/table/toolbar/pager tokens — no new hex colors or ad-hoc styles
  CHECK: rg -n "#[0-9a-fA-F]{6}" apps/admin/app.js
  EXPECT: /^$/ (no hex literals in JS)
  EVIDENCE: pending

## B — FUNCTIONALITY

- [ ] B1: Billing table lists salons with planStatus badge + trial/period dates (GET /admin/subscriptions)
  CHECK: rg -n "/admin/subscriptions" apps/admin/app.js
  EXPECT: /admin\/subscriptions/
  EVIDENCE: pending
- [ ] B2: Filter by planStatus + pagination wired
  CHECK: rg -n "planStatus" apps/admin/app.js
  EXPECT: /planStatus/
  EVIDENCE: pending
- [ ] B3: Per-row actions call the real endpoints: transition plan (PATCH), create invoice (POST invoices), mark invoice paid (POST mark-paid)
  CHECK: rg -n "subscriptions/\$\{|mark-paid|/invoices" apps/admin/app.js
  EXPECT: /mark-paid/ AND /invoices/
  EVIDENCE: pending
- [ ] B4: Actions prompt for required input (plan, amount, method) and surface server errors; reload the view on success
  CHECK: rg -n "renderBilling\(" apps/admin/app.js | Measure-Object -Line
  EXPECT: >=2 (initial + reload-after-action)
  EVIDENCE: pending

## C — QA + COMMIT

- [ ] C1: pnpm lint exits 0 (admin has no separate lint target; ensure no JS syntax errors via node --check)
  CHECK: node --check apps/admin/app.js
  EXPECT: exit 0
  EVIDENCE: pending
- [ ] C2: Workspace still green (typecheck + test unaffected; admin is static)
  CHECK: pnpm test
  EXPECT: exit 0
  EVIDENCE: pending
- [ ] C3: Committed; only CRLF/lockfile artifacts remain
  CHECK: git status --short
  EXPECT: only .gitignore / apps/api/package.json / pnpm-lock.yaml
  EVIDENCE: pending
- [ ] C4: graphify rebuilt
  CHECK: python -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"
  EXPECT: exit 0 (PYTHONUTF8=1)
  EVIDENCE: pending
