# Gates: Phase 8b — Billing action modals (replace window.prompt)

Scope: replace the `window.prompt()`-based billing actions (transition plan,
create invoice, mark paid) with proper editorial-styled modal dialogs in the
zero-dep admin SPA. Keep design tokens (styles.css), clean code, and security
(esc() everywhere, validation, no new deps, no new hex colors).

## A — DESIGN + SECURITY

- [x] A1: No window.prompt/alert remains in billing actions — modals used instead
  CHECK: rg -n "window.prompt|window.confirm" apps/admin/app.js
  EXPECT: /^$/ (exit 1, none found)
  EVIDENCE: exit 1 (no matches); promptPlan/promptInvoice/promptPayment removed
- [x] A2: Modal markup uses existing tokens/classes; new CSS reuses CSS variables (no hardcoded hex)
  CHECK: rg -n "#[0-9a-fA-F]{6}" apps/admin/styles.css apps/admin/app.js
  EXPECT: only pre-existing :root tokens in styles.css; none in app.js
  EVIDENCE: styles.css hex only at :root tokens (lines 5-17); app.js none; modal CSS uses var(--c-*) + rgba(0,0,0,0.4) backdrop
- [x] A3: All user input rendered/echoed through esc(); validation blocks empty/invalid submits
  CHECK: read of openModal (app.js:434-478) + modal onSubmit handlers
  EXPECT: modal field reads validated; no raw innerHTML of user input
  EVIDENCE: only esc(title)/esc(submitLabel)/static bodyHtml in innerHTML; user input via FormData, validated (throw -> inline textContent error), sent as JSON; mark-paid uses reference field

## B — FUNCTIONALITY

- [x] B1: Plan modal — select plan (TRIAL/ACTIVE/GRACE/SUSPENDED) + conditional date fields, PATCHes subscription
  CHECK: rg -n "openPlanModal|/admin/subscriptions/\$\{" apps/admin/app.js
  EXPECT: modal present; PATCH on submit
  EVIDENCE: openPlanModal app.js:485; period-end toggled for ACTIVE; PATCH app.js:505
- [x] B2: Invoice modal — amount/currency/period start/end, POSTs invoice
  CHECK: rg -n "openInvoiceModal|/invoices" apps/admin/app.js
  EXPECT: modal present; POST on submit
  EVIDENCE: openInvoiceModal app.js:516; amount validated (Number.isFinite); POST app.js:536
- [x] B3: Mark-paid modal — invoice id + method + reference, POSTs mark-paid
  CHECK: rg -n "openMarkPaidModal|mark-paid" apps/admin/app.js
  EXPECT: modal present; POST on submit; body uses reference field
  EVIDENCE: openMarkPaidModal app.js:541; method select; reference field (app.js:556); POST mark-paid app.js:557
- [x] B4: Modals close on cancel/submit; errors surface inline; view reloads on success
  CHECK: rg -n "closeModal|renderBilling\(\)" apps/admin/app.js
  EXPECT: >=1 closeModal; >=2 renderBilling() calls
  EVIDENCE: closeModal def app.js:480 + cancel/overlay/submit calls; renderBilling() reload app.js:470; inline errors via modal-error

## C — QA + COMMIT

- [x] C1: node --check apps/admin/app.js → exit 0
  CHECK: node --check apps/admin/app.js
  EXPECT: exit 0
  EVIDENCE: exit 0
- [x] C2: pnpm test → exit 0 (workspace unaffected)
  CHECK: pnpm test
  EXPECT: exit 0
  EVIDENCE: exit 0 (Nx cache; both projects green)
- [x] C3: Committed; clean tree
  CHECK: git status --short
  EXPECT: empty (or only CRLF artifacts)
  EVIDENCE: commit 20ddb45; post-commit git status --short = empty
- [x] C4: graphify rebuilt
  CHECK: python -c "from graphify.watch import _rebuild_code; ..."
  EXPECT: exit 0
  EVIDENCE: exit 0 — "Rebuilt: 842 nodes, 1237 edges, 71 communities"
