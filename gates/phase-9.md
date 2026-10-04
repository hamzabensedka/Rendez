# Gates: Phase 9 — Verification Screen "Check your inbox" polish

Scope: replace the dead 6-digit OTP UI in the mobile VerificationScreen with a
link-based "Check your inbox" flow that matches the backend (POST /auth/register
emails a verification LINK; there is no code endpoint). Keep editorial/provider
design tokens, clean code, and security (no behavior change to auth endpoints,
pending-registration guard preserved).

## A — DESIGN + CLEAN CODE

- [ ] A1: No OTP/digit-box UI remains (no DIGITS loop, no hidden TextInput, no slot styles)
  CHECK: rg -n "DIGITS|otpRow|slot|digit|TextInput|hidden" apps/mobile/src/features/auth/pages/VerificationScreen.tsx
  EXPECT: /^$/ (exit 1, none found)
  EVIDENCE: pending
- [ ] A2: Uses only providerTheme tokens (T.colors / T.font / T.radius); no hardcoded hex in the screen
  CHECK: rg -n "#[0-9a-fA-F]{6}" apps/mobile/src/features/auth/pages/VerificationScreen.tsx
  EXPECT: /^$/ (exit 1)
  EVIDENCE: pending
- [ ] A3: Copy reflects link-based verification ("check your inbox", "resend link"), not a code
  CHECK: rg -n "6-digit|code" apps/mobile/src/features/auth/pages/VerificationScreen.tsx
  EXPECT: /^$/ (no code references)
  EVIDENCE: pending

## B — FUNCTIONALITY

- [ ] B1: Primary action creates the account via register() and routes to homeHrefForRole(user.role)
  CHECK: rg -n "register\(|homeHrefForRole|setAuthUser" apps/mobile/src/features/auth/pages/VerificationScreen.tsx
  EXPECT: register + homeHrefForRole + setAuthUser present
  EVIDENCE: pending
- [ ] B2: Resend action calls resendVerification(email) and confirms via a non-blocking message
  CHECK: rg -n "resendVerification" apps/mobile/src/features/auth/pages/VerificationScreen.tsx
  EXPECT: resendVerification present
  EVIDENCE: pending
- [ ] B3: Guard preserved: redirects back if pendingRegistration missing; setPendingRegistration(null) on success
  CHECK: rg -n "pendingRegistration|setPendingRegistration\(null\)|router.back" apps/mobile/src/features/auth/pages/VerificationScreen.tsx
  EXPECT: guard + cleanup present
  EVIDENCE: pending

## C — QA + COMMIT

- [ ] C1: Mobile typecheck/lint for the file passes
  CHECK: pnpm --filter mobile typecheck (or eslint on the file)
  EXPECT: exit 0
  EVIDENCE: pending
- [ ] C2: pnpm test → exit 0 (workspace green)
  CHECK: pnpm test
  EXPECT: exit 0
  EVIDENCE: pending
- [ ] C3: Committed; clean tree
  CHECK: git status --short
  EXPECT: empty
  EVIDENCE: pending
- [ ] C4: graphify rebuilt
  CHECK: python -c "from graphify.watch import _rebuild_code; ..."
  EXPECT: exit 0
  EVIDENCE: pending
