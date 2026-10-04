# Gates: Phase 9 — Verification Screen "Check your inbox" polish

Scope: replace the dead 6-digit OTP UI in the mobile VerificationScreen with a
link-based "Check your inbox" flow that matches the backend (POST /auth/register
emails a verification LINK; there is no code endpoint). Keep editorial/provider
design tokens, clean code, and security (no behavior change to auth endpoints,
pending-registration guard preserved).

## A — DESIGN + CLEAN CODE

- [x] A1: No OTP/digit-box UI remains (no DIGITS loop, no hidden TextInput, no slot styles)
  CHECK: rg -n "DIGITS|otpRow|slot|digit|TextInput|hidden" ...
  EXPECT: /^$/ (exit 1, none found)
  EVIDENCE: exit 1 — DIGITS/otpRow/slotFocus/styles.digit/styles.hidden/keyboardType all gone
- [x] A2: Uses only providerTheme tokens (T.colors / T.font / T.radius); no hardcoded hex in the screen
  CHECK: rg -n "#[0-9a-fA-F]{6}" ...
  EXPECT: /^$/ (exit 1)
  EVIDENCE: exit 1 — no hex; all colors via T.colors
- [x] A3: Copy reflects link-based verification ("check your inbox", "resend link"), not a code
  CHECK: rg -n "6-digit|code" ...
  EXPECT: /^$/ (no code references)
  EVIDENCE: exit 1 — no "6-digit"/"sent a code"/"Resend code"/"the code"; copy says "verification link"

## B — FUNCTIONALITY

- [x] B1: Primary action creates the account via register() and routes to homeHrefForRole(user.role)
  CHECK: rg -n "register\(|homeHrefForRole|setAuthUser" ...
  EXPECT: register + homeHrefForRole + setAuthUser present
  EVIDENCE: register line 27, setAuthUser 29, router.replace(homeHrefForRole(...)) 32
- [x] B2: Resend action calls resendVerification(email) and confirms via a non-blocking message
  CHECK: rg -n "resendVerification" ...
  EXPECT: resendVerification present
  EVIDENCE: line 50; button shows "Link sent" (resent state) instead of blocking alert
- [x] B3: Guard preserved: redirects back if pendingRegistration missing; setPendingRegistration(null) on success
  CHECK: rg -n "pendingRegistration|setPendingRegistration\(null\)|router.back" ...
  EXPECT: guard + cleanup present
  EVIDENCE: router.back() guard line 19; setPendingRegistration(null) line 28

## C — QA + COMMIT

- [x] C1: Mobile typecheck/lint for the file passes
  CHECK: cd apps/mobile; npx tsc --noEmit
  EXPECT: exit 0
  EVIDENCE: TSC-EXIT=0
- [x] C2: pnpm test → exit 0 (workspace green)
  CHECK: pnpm test
  EXPECT: exit 0
  EVIDENCE: TEST-EXIT=0 — "Successfully ran target test for 2 projects" (mobile re-ran)
- [x] C3: Committed; clean tree
  CHECK: git status --short
  EXPECT: empty
  EVIDENCE: commit 45c768a; post-commit git status --short = empty
- [x] C4: graphify rebuilt
  CHECK: python -c "from graphify.watch import _rebuild_code; ..."
  EXPECT: exit 0
  EVIDENCE: GRAPH-EXIT=0 — graph.json + GRAPH_REPORT.md updated
