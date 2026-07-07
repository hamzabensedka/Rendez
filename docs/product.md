# Planity Clone — Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specs and acceptance criteria for a Planity-style beauty & wellness booking marketplace (mobile-first). Priorities use MoSCoW: Must / Should / Could / Won't (now).

---

## 1. Shared Types & Design System (Must)
**Description:** Central TS types and UI kit for consistent UX across apps.
**Spec:**
- Define entities: User, Business, Service, Slot, Booking, Review, Payment, Notification.
- Design system: colors, typography, buttons, cards, bottom nav, dark mode.
**Acceptance:**
- AC1: Types compile with no `any`.
- AC2: Storybook shows all components.
- AC3: Used by all features below.

## 2. User Authentication (Must)
**Description:** Signup/login via email, phone OTP, Google/Apple.
**Spec:**
- JWT refresh, role claim (client/owner/admin).
- Forgot password flow.
**Acceptance:**
- AC1: User can register in <2 min.
- AC2: Wrong OTP blocked.
- AC3: Session persists 7 days.

## 3. Guest Browse & Explore (Must)
**Description:** Non-logged users view home, businesses, categories.
**Spec:**
- Home shows popular, near me, promos.
- CTA to login on booking.
**Acceptance:**
- AC1: Guest sees 20+ businesses.
- AC2: Booking prompts login.

## 4. Business Search & Discovery (Must)
**Description:** Text search with filters (category, price, rating, distance).
**Spec:**
- Debounced search, recent queries.
- Sort by relevance/distance/price.
**Acceptance:**
- AC1: Results <500ms.
- AC2: Filters combine correctly.

## 5. Map-based Search (Should)
**Description:** Google Maps view with pins and radius filter.
**Spec:**
- Cluster pins, tap for preview card.
**Acceptance:**
- AC1: Pins load <1s.
- AC2: Radius updates list.

## 6. Business Detail View (Must)
**Description:** Show info, services, staff, photos, reviews.
**Spec:**
- Hours, address, call button.
- “Book” deep links to flow.
**Acceptance:**
- AC1: All sections render.
- AC2: Gallery swipe works.

## 7. Service Categories (Must)
**Description:** Tree: Hair > Cut > Men’s Cut.
**Spec:**
- Seed 50 categories.
**Acceptance:**
- AC1: 3-level nav works.
- AC2: Used in search.

## 8. Availability & Slot Computation (Must)
**Description:** Generate slots from working hours, service duration, breaks.
**Spec:**
- Engine in backend, cache via Redis.
- Handle timezone.
**Acceptance:**
- AC1: No overlap.
- AC2: Correct under DST.

## 9. Booking Flow (Must)
**Description:** Select service > staff > slot > pay > confirm.
**Spec:**
- Support multi-service cart.
- Coupon apply.
**Acceptance:**
- AC1: Completed in 4 steps.
- AC2: Email/SMS sent.

## 10. Appointment Management (Must)
**Description:** List upcoming/past, reschedule, cancel.
**Spec:**
- 24h cancel rule.
- Add to calendar.
**Acceptance:**
- AC1: Status accurate.
- AC2: Push on change.

## 11. Favorites (Should)
**Description:** Save businesses/services.
**Spec:**
- Sync across devices.
**Acceptance:**
- AC1: Instant toggle.
- AC2: List in profile.

## 12. User Profile (Must)
**Description:** Edit name, phone, addresses, payment methods.
**Spec:**
- GDPR export.
**Acceptance:**
- AC1: Save validates.
- AC2: Delete account purges.

## 13. Reviews & Ratings (Must)
**Description:** 1–5 stars + text after visit.
**Spec:**
- Owner can reply.
- Flag inappropriate.
**Acceptance:**
- AC1: Only past clients review.
- AC2: Avg updates.

## 14. Payment Integration (Must)
**Description:** Stripe + Apple/Google Pay.
**Spec:**
- Save card, 3DS.
- Refund via admin.
**Acceptance:**
- AC1: Success <3s.
- AC2: Webhook updates booking.

## 15. Notifications (Must)
**Description:** Push (FCM), SMS, email.
**Spec:**
- Templates: confirm, remind, cancel.
- Preferences.
**Acceptance:**
- AC1: Reminder 24h before.
- AC2: Opt-out honored.

## 16. Provider / Business Owner Portal (Must)
**Description:** Web app for owners.
**Spec:**
- Manage profile, services, staff, hours.
- View bookings, reply reviews.
**Acceptance:**
- AC1: Slots reflect changes.
- AC2: Multi-staff supported.

## 17. Admin Dashboard (Should)
**Description:** Super admin web.
**Spec:**
- Approve businesses, categories, refunds.
- Metrics.
**Acceptance:**
- AC1: Suspend user.
- AC2: Export CSV.

## 18. Background Jobs (BullMQ) (Must)
**Description:** Async: reminders, slot cache, sync.
**Spec:**
- Queues: notify, availability, report.
- Retry/backoff.
**Acceptance:**
- AC1: Job retries 3x.
- AC2: Failed logged.

---

## Priority Summary
- Must: 1,2,3,4,6,7,8,9,10,12,13,14,15,16,18
- Should: 5,11,17
- Could: loyalty, chat
- Won't: native desktop

## Milestones
- M1 (Must core): 1–4,6–10,12–16,18
- M2 (Should): 5,11,17

## Open Questions
- SMS vendor region?
- Multi-language scope?