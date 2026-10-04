# Gates: Phase 6 — Atelier redesign WIP landing

Scope: ~98 uncommitted files (73 modified tracked + ~25 untracked: provider Desk/Floor, atelier design system, redesigned auth/booking/search screens, API service edits, business reviews screen, route restructuring). Verify the tree is coherent, fix what is broken, commit it in logical units. Zero uncommitted production files at the end.

## A — INTENT + REVIEW (understand before committing)

- [ ] A1: API service diffs reviewed and intent confirmed (appointments, availability, provider-portal, redis-cache, main.ts, seed)
  CHECK: git diff --stat -- apps/api/src
  EXPECT: /provider-portal|availability|appointments/
  EVIDENCE: diff reviewed in full (1334 lines). Intent: (1) per-staff availability engine — slots tagged with concrete staff, "no preference" collapses to least-booked staff, staff+business rules intersected, salon-wide time-off subtracted; (2) multi-service cart via serviceVariantIds with summed duration; (3) booking create() validates startAt against live slot list and auto-assigns staff when omitted, 409 on stale slot; (4) slot-cache invalidation on appointment create + provider rule/time-off/staff mutations via RedisCacheService.delByPrefix; (5) CORS dev-origin handling (Expo web 8081/19006) + helmet crossOriginResourcePolicy for web images; (6) seed: approved reviews for all salons + idempotent credential refresh. Response DTO gains staff {id,name}. All consistent with atelier StaffChips/booking UI.
- [ ] A2: No debug leftovers / secrets / stray placeholders introduced in the diff
  CHECK: git diff -U0 | Select-String -Pattern "^\+.*(console\.log|debugger|sk_live|sk_test|BEGIN.*PRIVATE KEY)" | Measure-Object -Line
  EXPECT: /^\s*0\s/ (zero added debug/secret lines)
  EVIDENCE: 0 matched lines (Measure-Object empty; grep through full diff found no console.log/debugger/secret keys in added lines; seed console.log calls are pre-existing CLI output style)
- [ ] A3: Deleted route `app/(main)/business/[id].tsx` is fully replaced by `app/(main)/business/[id]/index.tsx` + `reviews.tsx` and no import references the old path
  CHECK: rg -l "business/\[id\]'|business/\[id\]\"" apps/mobile/src apps/mobile/app; rg -l "\(main\)/business/\[id\]" apps/mobile
  EXPECT: references only target [id]/index or [id]/reviews forms
  EVIDENCE: 8 references found — all use runtime paths `/(main)/business/${id}` (expo-router resolves to [id]/index.tsx) or `/(main)/business/${id}/reviews`; none reference the deleted `[id].tsx` file path directly. Old route fully replaced.
- [ ] A4: New files have no TODO/FIXME/HACK placeholders (unlazy: no placeholders)
  CHECK: rg "TODO|FIXME|HACK" apps/mobile/src/features/provider apps/mobile/src/shared/ui/atelier apps/mobile/src/features/auth/devAccounts.ts apps/mobile/src/shared/lib/tokenStore.ts
  EXPECT: /^$/
  EVIDENCE: grep exit "No matches found" — zero TODO/FIXME/HACK in provider/, shared/ui/atelier/, devAccounts.ts, tokenStore.ts

## B — QA GREEN

- [ ] B1: pnpm typecheck exits 0
  CHECK: pnpm typecheck
  EXPECT: exit 0
  EVIDENCE: initially FAILED with 2 errors (StyleSheet.absoluteFillObject not in RN type surface at ExploreScreen.tsx:170 and SalonAbout.tsx:227) — fixed with equivalent absolute-position literals; re-run: "Successfully ran target typecheck for 2 projects", exit 0
- [ ] B2: pnpm lint exits 0
  CHECK: pnpm lint
  EXPECT: exit 0
  EVIDENCE: initially FAILED with 7 prettier/prettier errors in availability.service.ts + spec (formatting only) — auto-fixed with eslint --fix; re-run: "Successfully ran target lint for 2 projects", exit 0
- [ ] B3: pnpm test exits 0 (api suites incl. modified appointment/availability/provider-portal specs; mobile incl. new deskModel + calendarLayout specs)
  CHECK: pnpm test
  EXPECT: exit 0
  EVIDENCE: initially FAILED — mobile api.refresh.spec couldn't parse react-native ESM imported via new tokenStore.ts/api.ts Platform import in node-env Jest. Fixed by detecting web via `typeof document !== 'undefined'` instead of importing react-native (documented in-code). Re-run: api 8 suites/69 tests PASS + mobile 3 suites/9 tests PASS (incl. deskModel + calendarLayout specs), EXIT=0

## C — COMMIT (atomic, logical units)

- [ ] C1: API changes committed (feature unit per intent found in A1)
  CHECK: git status --short -- apps/api
  EXPECT: /^$/
  EVIDENCE: pending
- [ ] C2: Mobile changes committed (atelier theme/design system, provider desk, screens — one or more logical commits)
  CHECK: git status --short -- apps/mobile
  EXPECT: /^$/
  EVIDENCE: pending
- [ ] C3: Docs + repo-level changes committed (docs/, .gitignore, pnpm-lock.yaml if legitimately synced)
  CHECK: git status --short
  EXPECT: only intentionally-ignored/untracked-none entries remain
  EVIDENCE: pending
- [ ] C4: Post-commit QA still green
  CHECK: pnpm test
  EXPECT: exit 0
  EVIDENCE: pending

## D — GRAPHIFY (workspace rule)

- [ ] D1: graphify code graph rebuilt after modifications
  CHECK: python -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"
  EXPECT: exit 0 OR ABANDON with reason (module missing on this machine)
  EVIDENCE: pending
