# Gates: Phase 8b — Billing action modals (replace window.prompt)

Scope: replace the `window.prompt()`-based billing actions (transition plan,
create invoice, mark paid) with proper editorial-styled modal dialogs in the
zero-dep admin SPA. Keep design tokens (styles.css), clean code, and security
(esc() everywhere, validation, no new deps, no new hex colors).

## A — DESIGN + SECURITY

- [ ] A1: No window.prompt/alert remains in billing actions — modals used instead
  CHECK: rg -n "window.prompt|window.confirm" apps/admin/app.js
  EXPECT: /^$/ (exit 1, none found)
  EVIDENCE: pending
- [ ] A2: Modal markup uses existing tokens/classes; new CSS reuses CSS variables (no hardcoded hex)
  CHECK: rg -n "#[0-9a-fA-F]{6}" apps/admin/styles.css apps/admin/app.js
  EXPECT: only pre-existing :root tokens in styles.css; none in app.js
  EVIDENCE: pending
- [ ] A3: All user input rendered/echoed through esc(); validation blocks empty/invalid submits
  CHECK: rg -n "renderBilling|openModal" apps/admin/app.js
  EXPECT: modal field reads validated; no raw innerHTML of user input
  EVIDENCE: pending

## B — FUNCTIONALITY

- [ ] B1: Plan modal — select plan (TRIAL/ACTIVE/GRACE/SUSPENDED) + conditional date fields, PATCHes subscription
  CHECK: rg -n "openPlanModal|/admin/subscriptions/\$\{" apps/admin/app.js
  EXPECT: modal present; PATCH on submit
  EVIDENCE: pending
- [ ] B2: Invoice modal — amount/currency/period start/end, POSTs invoice
  CHECK: rg -n "openInvoiceModal|/invoices" apps/admin/app.js
  EXPECT: modal present; POST on submit
  EVIDENCE: pending
- [ ] B3: Mark-paid modal — invoice id + method + reference, POSTs mark-paid
  CHECK: rg -n "openMarkPaidModal|mark-paid" apps/admin/app.js
  EXPECT: modal present; POST on submit; body uses reference field
  EVIDENCE: pending
- [ ] B4: Modals close on cancel/submit; errors surface inline; view reloads on success
  CHECK: rg -n "closeModal|renderBilling\(\)" apps/admin/app.js
  EXPECT: >=1 closeModal; >=2 renderBilling() calls
  EVIDENCE: pending

## C — QA + COMMIT

- [ ] C1: node --check apps/admin/app.js → exit 0
  CHECK: node --check apps/admin/app.js
  EXPECT: exit 0
  EVIDENCE: pending
- [ ] C2: pnpm test → exit 0 (workspace unaffected)
  CHECK: pnpm test
  EXPECT: exit 0
  EVIDENCE: pending
- [ ] C3: Committed; clean tree
  CHECK: git status --short
  EXPECT: empty (or only CRLF artifacts)
  EVIDENCE: pending
- [ ] C4: graphify rebuilt
  CHECK: python -c "from graphify.watch import _rebuild_code; ..."
  EXPECT: exit 0
  EVIDENCE: pending
