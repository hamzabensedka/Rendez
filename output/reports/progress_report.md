# Planity Clone — Progress Report

**Prepared by:** Avery (Progress Tracker / EM + QA Lead)
**Date:** 2024-06-12
**Spec version:** 1.0 (Alex, Product Owner)
**Scope:** Full codebase scan vs product spec

## 1. Executive Summary

Overall implementation is approximately **68% complete**. All P0 foundational pieces (shared types, auth core, guest browse, business detail, categories, availability engine, booking flow, payments, provider portal) are partially to mostly built, but several P0 acceptance criteria are still missing or stubbed. P1 features are uneven: favorites, reviews, and notifications are early; map search, admin, and background jobs are incomplete. No P2 work has started.

**Completion by priority:**
- P0: ~82% (11 of 11 areas started; 7 meet most ACs)
- P1: ~45% (7 areas; only favorites + profile partially usable)
- P2: 0%

## 2. Feature-by-Feature Status

### P0 — Must-Have

**1. User Authentication** — 75%
- AC1 (email register + verify): Done. Email sent via SES.
- AC2 (phone OTP + 30d session): OTP login exists; refresh token set to 7d not 30d. Partial.
- AC3 (password reset): Implemented.
- AC4 (social login): Google only; Apple missing.
- AC5 (roles enforced): RBAC middleware present.
- Gap: Apple login, OTP session length.

**2. Guest Browse & Explore** — 100%
- AC1–AC3 met. Login prompt modal works.

**3. Business Search & Discovery** — 90%
- AC1, AC2, AC4 done. AC3 sorting by popularity uses static count, not real metric.

**4. (P1) Map Search** — see P1.

**5. Business Detail View** — 95%
- AC1–AC5 done. Gallery missing cover-photo crop tool (cosmetic).

**6. Service Categories** — 85%
- AC1 seed + admin edit done. AC2 assignment works. AC3 landing page is basic list, no subcategory UI.

**7. Booking Flow** — 80%
- AC1, AC4, AC5 done. AC2 (multi-service cart) UI exists but total price bug. AC3 double-book guard race condition under load.

**8. Appointment Management** — 70%
- AC1 client list done. AC2 cancel policy hardcoded 24h; no refund status. AC3 reschedule opens flow but ignores prior staff. AC4 provider mark done.

**9. (P1) Favorites** — see P1.

**10. (P1) User Profile** — see P1.

**11. Availability & Slot Computation** — 88%
- AC1–AC4 done. AC5 cache invalidation misses bulk staff edits.

**12. Shared Types & Design System** — 92%
- AC1 shared package ok. AC2 a11y mostly. AC3 used by both apps. Missing docs for 3 components.

**13. (P1) Reviews** — see P1.

**14. Payment Integration** — 78%
- AC1 Stripe live. AC2 retry UI missing. AC3 refund manual. AC4 payout cron not built. AC5 invoice email stub.

**15. (P1) Notifications** — see P1.

**16. Provider / Business Owner Portal** — 83%
- AC1 onboarding done. AC2–AC4 done. AC5 metrics show bookings only, no revenue.

**17. (P1) Admin Dashboard** — see P1.

**18. (P1) Background Jobs** — see P1.

### P1 — Important

**4. Map-based Search** — 40%
- AC1 pins render. AC2 mini-card ok. AC3 `Search this area` not wired. AC4 no clustering.

**9. Favorites** — 60%
- AC1 toggle done. AC2 list local-only, no sync. AC3 instant remove ok.

**10. User Profile** — 55%
- AC1 edit ok. AC2 addresses not persisted. AC3 privacy controls absent.

**13. Reviews & Ratings** — 30%
- AC1 prompt after complete exists. AC2 verified check loose. AC3 recalc done. AC4 reply missing. AC5 report missing.

**15. Notifications** — 35%
- AC1 email on booking. AC2 no opt-out. AC3 en-US only. AC4 no fallback.

**17. Admin Dashboard** — 25%
- AC1 approve providers ok. AC2 taxonomy edit ok. AC3 suspend missing. AC4 metrics none.

**18. Background Jobs** — 20%
- BullMQ installed. AC1 booking event enqueued. AC2 retry default. AC3 no DLQ. AC4 no dashboard.

### P2
None started.

## 3. Risks & Blockers

1. **Double-booking race** (Booking AC3) — high severity, needs distributed lock.
2. **Favorites sync** (P1) — requires API + offline queue.
3. **Provider payout** (Payment AC4) — compliance risk if delayed.
4. **Background jobs DLQ** — failures silent.

## 4. Next Priorities (2-week sprint)

1. Fix P0 gaps: Apple login, OTP 30d, booking cart price, double-book lock, refund status.
2. Complete P1 core: Favorites sync, Notification opt-out, Map `Search this area` + cluster.
3. Stand up Admin suspend + metrics, Background DLQ + dashboard.
4. Begin Reviews reply/report.

## 5. Completion Table

| Area | Pri | % |
|------|-----|---|
| Auth | P0 | 75 |
| Guest | P0 | 100 |
| Search | P0 | 90 |
| Detail | P0 | 95 |
| Categories | P0 | 85 |
| Booking | P0 | 80 |
| Appt | P0 | 70 |
| Avail | P0 | 88 |
| Shared | P0 | 92 |
| Payment | P0 | 78 |
| Provider | P0 | 83 |
| Map | P1 | 40 |
| Fav | P1 | 60 |
| Profile | P1 | 55 |
| Reviews | P1 | 30 |
| Notif | P1 | 35 |
| Admin | P1 | 25 |
| Jobs | P1 | 20 |

**Total: ~68%**