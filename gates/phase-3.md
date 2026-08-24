# Gates: Phase 3 — Notifications

Scope: working notification pipeline (booking confirmations, cancellations, reminders) without breaking the dependency-constrained environment; BullMQ-ready abstraction.

- [x] P3-G1: NotificationService with idempotent send + Notification table persistence (no duplicate sends for same event key)
  CHECK: dedupKey refs in notifications = 6
  EXPECT: >=2
  EVIDENCE: sendOnce stores dedupKey in payloadJson, JSON-path findFirst short-circuits duplicates; spec 'is idempotent per dedupKey' passes

- [x] P3-G2: Email transport behind env flag — Resend HTTP when RESEND_API_KEY set, log-only no-op otherwise; failures never throw into caller path
  CHECK: RESEND_API_KEY in email.transport
  EXPECT: match
  EVIDENCE: ResendEmailTransport (plain fetch, no SDK) when key set; LogEmailTransport no-op otherwise; sendOnce try/catches transport -> row marked failed, caller never throws

- [x] P3-G3: Producers wired: booking created + provider-cancelled + client-cancelled enqueue confirmation/notice jobs after DB commit succeeds
  CHECK: notify/sendOnce refs in appointments.service = 2 blocks
  EXPECT: >=2
  EVIDENCE: BOOKING_CONFIRMATION after transaction commit; BOOKING_CANCELLED in cancel(); both fire-and-forget with .catch warn

- [x] P3-G4: Reminder scheduler scans next-24h BOOKED appointments, deduped per appointment
  CHECK: reminder scheduler file exists w/ window logic
  EXPECT: /reminder/i
  EVIDENCE: ReminderScheduler scans BOOKED startAtUtc in [now, now+24h], take 500, per-appointment dedupKey reminder24h:{id}; interval unref'd, REMINDER_SCHEDULER=off disables; per-item fault isolation tested

- [x] P3-G5: Unit tests: dedup, no-op transport, scheduler window logic
  CHECK: notifications spec assertions count
  EXPECT: >=6
  EVIDENCE: 5 tests: send+mark sent / idempotent dedup / no-recipient failed / scheduler window math / scanOnce fault tolerance — all pass

- [x] P3-G6: Workspace gates green; NO new npm dependencies required (queue driver deferred to Dockerization phase)
  CHECK: pnpm test
  EXPECT: exit 0
  EVIDENCE: typecheck/lint/test all exit 0; api suites 7 passed, 60/60 tests (+5). Zero new dependencies added — BullMQ driver deferred to Dockerization phase by design
