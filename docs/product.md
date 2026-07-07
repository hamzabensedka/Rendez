# Planity Clone — Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specs and acceptance criteria for a Planity-style beauty & wellness booking marketplace (mobile-first web app + provider portal + admin).

## Priorities
- **P0 (MVP):** User Auth, Guest Browse, Search & Discovery, Map Search, Business Detail, Categories, Booking Flow, Availability & Slots, Appointment Mgmt, Shared Types/Design, Notifications (basic), Provider Portal (core).
- **P1:** Favorites, Reviews & Ratings, Payment Integration, User Profile, Admin Dashboard, Background Jobs.
- **P2:** Advanced notifications, analytics, promotions.

---

## 1. User Authentication
**Spec:** Email/phone signup, login, social (Google/Apple), password reset, JWT sessions.
**AC:**
- User can register with email + password; receives verification email.
- Login returns token; protected routes require token.
- Password reset email works.
- Social login creates account or links existing.
**Priority:** P0

## 2. Guest Browse & Explore
**Spec:** Non-logged users can browse categories, businesses, and view details.
**AC:**
- Guest sees home with featured businesses and categories.
- Guest can open business detail but booking prompts login.
**Priority:** P0

## 3. Business Search & Discovery
**Spec:** Text search by name, service, location; filters by category, price, rating.
**AC:**
- Search returns relevant businesses in <1s.
- Filters combine correctly.
- Empty state shown when no results.
**Priority:** P0

## 4. Map-based Search
**Spec:** Show businesses on map with clustering; tap pin → preview card.
**AC:**
- Map loads with user location (permission handled).
- Pins reflect current filters.
- Tap pin opens detail or preview sheet.
**Priority:** P0

## 5. Business Detail View
**Spec:** Photos, services, staff, hours, reviews summary, book button.
**AC:**
- Displays all active services with prices/durations.
- Shows next available slot.
- Reviews tab loads ratings.
**Priority:** P0

## 6. Service Categories
**Spec:** Tree of categories (Hair, Nails, Spa…) with icons.
**AC:**
- Categories seeded and editable by admin.
- Selecting category filters discovery.
**Priority:** P0

## 7. Booking Flow
**Spec:** Select service → staff (optional) → date/time → confirm → pay.
**AC:**
- Only available slots selectable.
- Confirmation screen + notification sent.
- Double-booking prevented.
**Priority:** P0

## 8. Appointment Management
**Spec:** List upcoming/past; cancel/reschedule; reminders.
**AC:**
- User can cancel with policy respected.
- Reschedule reuses slot logic.
- Status updates reflected in provider portal.
**Priority:** P0

## 9. Favorites
**Spec:** Save businesses/services; view in profile.
**AC:**
- Heart toggle works on detail.
- Favorites list loads saved items.
**Priority:** P1

## 10. User Profile
**Spec:** Edit name, phone, addresses, payment methods.
**AC:**
- Changes persist.
- Address used in booking default.
**Priority:** P1

## 11. Availability & Slot Computation
**Spec:** Provider sets hours, breaks, service durations; system computes free slots.
**AC:**
- Slots exclude booked + breaks.
- Timezone correct.
- Concurrent requests safe.
**Priority:** P0

## 12. Shared Types & Design System
**Spec:** TS types, UI kit (buttons, cards, colors) shared across apps.
**AC:**
- Single source of types imported by web/portal.
- Components match Figma.
**Priority:** P0

## 13. Reviews & Ratings
**Spec:** Post-visit review (1–5 stars + text); display aggregates.
**AC:**
- Only verified visits reviewable.
- Average rating updates.
- Abuse report available.
**Priority:** P1

## 14. Payment Integration
**Spec:** Stripe for cards; hold or charge; refund on cancel.
**AC:**
- Test card succeeds.
- Failed payment blocks booking.
- Refund triggers notification.
**Priority:** P1

## 15. Notifications
**Spec:** Email + push (web) for confirm, remind, cancel.
**AC:**
- Triggered by events via Background Jobs.
- User can opt out.
**Priority:** P0/P1

## 16. Provider / Business Owner Portal
**Spec:** Manage profile, services, staff, availability, appointments, payouts.
**AC:**
- Owner logs in to own business only.
- Edits reflect on client app.
- Dashboard shows day bookings.
**Priority:** P0

## 17. Admin Dashboard
**Spec:** Manage users, businesses, categories, moderate reviews.
**AC:**
- Admin can suspend business.
- Category CRUD works.
- Impersonate disabled in prod.
**Priority:** P1

## 18. Background Jobs (BullMQ)
**Spec:** Queue for reminders, emails, slot cleanup, analytics.
**AC:**
- Job retries on fail.
- No duplicate reminders.
- Monitorable in Redis.
**Priority:** P1

---

## Success Metrics
- 500+ bookings/month by month 3.
- <2% double-booking rate.
- 4.5+ avg review.

## Open Questions
- Native apps later?
- Multi-location businesses?