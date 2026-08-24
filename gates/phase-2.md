# Gates: Phase 2 — Provider portal API

Scope: availability rules, time-off, staff management, appointment lifecycle — all ownership-checked, unit-tested, QA-green.

- [x] P2-G1: Availability rule CRUD under /v1/provider-portal, replace-in-transaction, overlap-validated, tested
  CHECK: Select-String count availabilityRule in service = 7
  EXPECT: >=3
  EVIDENCE: GET list + PUT replace-all-in-\ (deleteMany scoped to business+staff then createMany); staff-scope validated; spec: replace/clear/foreign-staff tests pass

- [x] P2-G2: Time-off CRUD scoped to owned business/staff, tested
  CHECK: Select-String count timeOff in service = 9
  EXPECT: >=4
  EVIDENCE: list(upcomingOnly/staff filter) + create(start<end enforced) + delete scoped by business; 404 on foreign id

- [x] P2-G3: Staff create/list/update/deactivate for owned business, tested
  CHECK: git grep staff controller
  EXPECT: /staff/
  EVIDENCE: POST/PATCH/list routes; deactivation via isActive flag (no hard delete, appointment history preserved); scoped updateMany + 404 tested

- [x] P2-G4: Provider appointment list (filters+pagination) and atomic lifecycle transitions BOOKED->COMPLETED|NO_SHOW|CANCELLED
  CHECK: git grep updateMany service
  EXPECT: /status/
  EVIDENCE: list w/ status+staff+date filters & clamped pagination; transitions COMPLETED|NO_SHOW|CANCELLED via atomic updateMany({id,businessId,status:'BOOKED'}) count-guard -> 409 on lost race; cancellation metadata set; 5 lifecycle tests pass

- [x] P2-G5: RBAC + ownership: every route requires providerOwner|providerStaff AND server-side membership check; cross-business access forbidden
  CHECK: RolesGuard refs in controller = 2
  EXPECT: >=1
  EVIDENCE: class-level JwtAuthGuard+RolesGuard+Roles(PROVIDER_OWNER, PROVIDER_STAFF); assertMembership(provider.findFirst{userId,businessId}) before every mutation; cross-business ForbiddenException unit-tested

- [x] P2-G6: Workspace gates green after Phase 2 API
  CHECK: pnpm test
  EXPECT: exit 0
  EVIDENCE: typecheck/lint/test all exit 0; api suites 6 passed, 55/55 tests (41 + 14 portal)
