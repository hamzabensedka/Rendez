# Gates: Phase 2b — Provider portal mobile

Scope: provider portal screens (today/board, schedule editor, staff) in editorial design language, role-gated entry.

- [x] P2B-G1: Provider query hooks + cache keys exist for appointments/rules/timeoff/staff with typed mutations
  CHECK: queryKeys.providerPortal refs = 4 keys
  EXPECT: >=4
  EVIDENCE: useProviderPortal.ts — 10 hooks (appointments+transition, rules get/replace, timeoff list/create/delete, staff list/create/update) with typed payloads + invalidation

- [x] P2B-G2: Three screens shipped: ProviderHome (transitions), ScheduleEditor (rules+timeoff), Staff
  CHECK: screen names referenced across app routes + features
  EXPECT: >=6
  EVIDENCE: ProviderHomeScreen (filter pills + COMPLETE/NO-SHOW/CANCEL transitions), ScheduleEditorScreen (weekly windows editor + time-off add/delete), StaffScreen (list/badge/deactivate/add); routes app/(main)/provider-portal/{index,schedule,staff}.tsx

- [x] P2B-G3: Design contract honored: no hex literals / no raw fontSize numbers outside theme+ui package in new features
  CHECK: hex/fontSize grep in features/provider
  EXPECT: /^$/
  EVIDENCE: grep empty — all colors/spacing/typography via editorialTheme tokens; components from @planity/ui only

- [x] P2B-G4: Role-gated entry: profile link visible only to provider roles; non-provider deep-link shows access message
  CHECK: providerOwner in ProfileScreen
  EXPECT: /providerOwner/
  EVIDENCE: portal entry button rendered only for providerOwner|providerStaff; businessId sourced from /v1/auth/me providerProfile projection

- [x] P2B-G5: Workspace gates green (typecheck/lint/test)
  CHECK: pnpm typecheck
  EXPECT: exit 0
  EVIDENCE: typecheck/lint/test all exit 0 after format; mobile tsc strict clean
