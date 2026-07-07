# Planity Clone — Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specs and acceptance criteria for a Planity-style beauty & wellness booking marketplace (mobile-first web app + provider portal + admin).

## Priorities
- **P0 (MVP):** User Auth, Guest Browse, Search & Discovery, Map Search, Business Detail, Categories, Booking Flow, Availability & Slots, Appointment Mgmt, Shared Types/Design, Notifications (basic), Provider Portal (core).
- **P1:** Favorites, Reviews & Ratings, Payment Integration, User Profile, Admin Dashboard, Background Jobs.
- **P2:** Advanced notifications, provider analytics, admin moderation tools.

---

## 1. User Authentication (P0)
**Description:** Secure signup/login for clients and businesses.
**Features:** Email+password, Google/Apple OAuth, OTP optional, role selection (client/owner), JWT sessions.
**Acceptance:**
- User can register with email and verify via link.
- OAuth returns valid session.
- Passwords hashed (bcrypt).
- Role stored and routed correctly.
- Invalid creds show error, no leak.

## 2. Guest Browse & Explore (P0)
**Description:** Non-logged users can explore homepage and businesses.
**Features:** Featured businesses, popular categories, city selector.
**Acceptance:**
- Guest sees homepage with 10+ featured items.
- No auth wall for browsing.
- CTA to login appears on booking attempt.

## 3. Business Search & Discovery (P0)
**Description:** Text search with filters.
**Features:** Query by name/service, filter by category, price, rating, distance.
**Acceptance:**
- Search returns relevant results < 500ms.
- Filters combine correctly.
- Empty state shown if none.

## 4. Map-based Search (P0)
**Description:** Google Maps view of businesses.
**Features:** Pins, clustering, tap pin -> preview card.
**Acceptance:**
- Map loads with pins in viewport.
- Pin click opens detail sheet.
- Filter syncs with list view.

## 5. Business Detail View (P0)
**Description:** Full business profile.
**Features:** Gallery, services, staff, hours, reviews summary, book button.
**Acceptance:**
- All sections render.
- Book redirects to flow.
- Shows real-time availability badge.

## 6. Service Categories (P0)
**Description:** Taxonomy of beauty/wellness services.
**Features:** Tree (Hair > Cut > Men), icons, client-side cache.
**Acceptance:**
- 20+ categories seeded.
- Selection drives search and booking.

## 7. Booking Flow (P0)
**Description:** Multi-step booking.
**Steps:** Business -> Service -> Staff -> Date/Slot -> Confirm -> Pay.
**Acceptance:**
- Only available slots selectable.
- Conflict detection works.
- Confirmation saved with status PENDING.

## 8. Appointment Management (P0)
**Description:** View/cancel/reschedule.
**Features:** Upcoming/past tabs, reminders, cancel policy.
**Acceptance:**
- User sees appointments in timezone.
- Cancel updates slot as free.
- Reschedule recomputes.

## 9. Favorites (P1)
**Description:** Save businesses.
**Acceptance:**
- Heart toggles state.
- List view in profile.
- Syncs across devices.

## 10. User Profile (P1)
**Description:** Manage personal info.
**Features:** Name, phone, addresses, payment methods.
**Acceptance:**
- Edits persist.
- Validation on phone/email.

## 11. Availability & Slot Computation (P0)
**Description:** Engine for free slots.
**Rules:** Business hours - booked - breaks, service duration, staff.
**Acceptance:**
- Generates 15-min slots.
- Honors holidays.
- Scales to 1000 bookings/day.

## 12. Shared Types & Design System (P0)
**Description:** Mono-repo types and UI kit.
**Features:** TS interfaces, Tailwind theme, components.
**Acceptance:**
- No type duplication.
- Components used in 3+ screens.

## 13. Reviews & Ratings (P1)
**Description:** Post-visit reviews.
**Features:** 1-5 stars, text, photo, owner reply.
**Acceptance:**
- Only verified visits.
- Average updates instantly.
- Abuse report flag.

## 14. Payment Integration (P1)
**Description:** Stripe/Cash.
**Features:** Card, saved PM, partial deposit.
**Acceptance:**
- PCI compliant.
- Webhook updates status.
- Refund via admin.

## 15. Notifications (P0/P1)
**Features:** Email + push (FCM).
**Events:** Booking, reminder, cancel, promo.
**Acceptance:**
- Sent within 1 min.
- User pref respected.

## 16. Provider / Business Owner Portal (P0)
**Description:** Web dashboard for owners.
**Features:** Profile, services, staff, hours, bookings, calendar.
**Acceptance:**
- Owner edits reflect in app.
- Sees live bookings.
- Can block slots.

## 17. Admin Dashboard (P1)
**Description:** Super admin.
**Features:** Users, businesses, categories, disputes, metrics.
**Acceptance:**
- Suspend business.
- View GMV.
- Audit log.

## 18. Background Jobs (BullMQ) (P1)
**Description:** Async tasks.
**Jobs:** Reminder send, slot cache, report gen, image resize.
**Acceptance:**
- Retry on fail.
- Dashboard for queues.
- No job loss on restart.

---

## Success Metrics
- 500 businesses in 3 months.
- 20% repeat booking rate.
- <2% booking errors.

## Open Questions
- Multi-language?
- Loyalty program scope?