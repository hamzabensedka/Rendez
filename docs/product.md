# Planity Clone — Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specs and acceptance criteria for a Planity-style beauty & wellness booking marketplace (mobile-first web app + provider portal + admin).

## Priorities
- **P0 (MVP):** User Auth, Guest Browse, Search & Discovery, Map Search, Business Detail, Categories, Booking Flow, Availability & Slots, Appointment Mgmt, Shared Types/Design, Notifications (basic), Provider Portal (core).
- **P1:** Favorites, Reviews & Ratings, Payment Integration, User Profile, Admin Dashboard, Background Jobs.
- **P2:** Advanced notifications, analytics, promotions.

---

## 1. User Authentication
**Spec:** Email/phone signup, login, logout, password reset. OAuth (Google/Apple) optional. JWT sessions.
**AC:**
- User can register with email+password; receives verification email.
- Login fails with wrong creds (error shown).
- Password reset email sent and works.
- Authenticated state persists across reloads.
**Priority:** P0

## 2. Guest Browse & Explore
**Spec:** Non-logged users can view categories, businesses, and details.
**AC:**
- Guest sees home with featured businesses.
- Guest can open business detail but booking prompts login.
**Priority:** P0

## 3. Business Search & Discovery
**Spec:** Text search by name, service, location. Filters: category, price, rating, distance.
**AC:**
- Search returns relevant businesses.
- Filters apply correctly and update list.
- Empty state shown when no results.
**Priority:** P0

## 4. Map-based Search
**Spec:** Show businesses on map with pins; click pin → preview card.
**AC:**
- Map loads with user location (permission).
- Pins reflect current filters.
- Clicking pin opens detail or quick view.
**Priority:** P0

## 5. Business Detail View
**Spec:** Photos, services, staff, hours, reviews, book button.
**AC:**
- All sections render with real data.
- “Book” opens booking flow.
- Shows next available slot.
**Priority:** P0

## 6. Service Categories
**Spec:** Tree of categories (Hair, Nails, Spa…) with icons.
**AC:**
- Categories list loads.
- Selecting category filters discovery.
- Provider can assign categories.
**Priority:** P0

## 7. Booking Flow
**Spec:** Select service → staff (opt) → date/time → confirm → pay (if P1) → success.
**AC:**
- Only available slots selectable.
- Conflict prevented (no double book).
- Confirmation saved and shown in appointments.
**Priority:** P0

## 8. Appointment Management
**Spec:** List upcoming/past, cancel, reschedule.
**AC:**
- User sees appointments sorted by date.
- Cancel updates provider availability.
- Reschedule uses same flow.
**Priority:** P0

## 9. Favorites
**Spec:** Save businesses to favorites list.
**AC:**
- Heart toggles state.
- Favorites view lists saved items.
- Syncs across sessions.
**Priority:** P1

## 10. User Profile
**Spec:** Name, contact, addresses, payment methods.
**AC:**
- Editable fields persist.
- Address used in search default.
**Priority:** P1

## 11. Availability & Slot Computation
**Spec:** Provider sets hours + breaks + service duration; system computes free slots.
**AC:**
- Slots exclude booked and breaks.
- Timezone correct.
- Concurrent requests safe.
**Priority:** P0

## 12. Shared Types & Design System
**Spec:** TS types, UI kit (buttons, cards, colors) in repo.
**AC:**
- Components reused across app.
- Types imported by frontend/backend.
**Priority:** P0

## 13. Reviews & Ratings
**Spec:** Post-visit review (1–5 stars + text). Display avg.
**AC:**
- Only visited users can review.
- Ratings update business average.
- Abuse report available.
**Priority:** P1

## 14. Payment Integration
**Spec:** Stripe/Cash. Save card, charge on book.
**AC:**
- Payment success creates appointment.
- Failure rolls back.
- Receipt emailed.
**Priority:** P1

## 15. Notifications
**Spec:** Email/push for booking, reminder, cancel.
**AC:**
- Triggered by events.
- User can opt out.
**Priority:** P0/P1

## 16. Provider / Business Owner Portal
**Spec:** Manage profile, services, staff, hours, appointments, payouts.
**AC:**
- Owner logs in to dashboard.
- Edits reflect on public app.
- Sees daily schedule.
**Priority:** P0

## 17. Admin Dashboard
**Spec:** Manage users, businesses, categories, moderate reviews.
**AC:**
- Admin role restricted.
- Can suspend business.
- View platform metrics.
**Priority:** P1

## 18. Background Jobs (BullMQ)
**Spec:** Queue for reminders, emails, slot cache.
**AC:**
- Job retries on fail.
- No duplicate notifications.
- Monitorable in Redis.
**Priority:** P1
