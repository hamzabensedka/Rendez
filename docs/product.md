# Planity Clone — Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specs and acceptance criteria for a Planity-style beauty & wellness booking marketplace (mobile-first web app + provider portal + admin).

## Priorities
- **P0 (MVP):** User Auth, Guest Browse, Search & Discovery, Map Search, Business Detail, Categories, Booking Flow, Availability & Slots, Appointment Mgmt, Shared Types/Design, Notifications (basic), Provider Portal (core).
- **P1:** Favorites, Reviews & Ratings, Payment Integration, User Profile, Admin Dashboard, Background Jobs.
- **P2:** Advanced notifications, analytics, promotions.

---

## 1. User Authentication
**Spec:** Email/phone signup, login, logout, password reset. JWT sessions. Role: customer, provider, admin.
**AC:**
- User can register with email+password; receives verification email.
- Login returns token; protected routes require token.
- Password reset via email link works.
- Invalid creds show error; no leak of existence.
**Priority:** P0

## 2. Guest Browse & Explore
**Spec:** Non-logged users can view home, categories, business list/detail, no booking.
**AC:**
- Guest sees featured businesses and categories.
- CTA to login appears on booking attempt.
- No personal data stored for guest.
**Priority:** P0

## 3. Business Search & Discovery
**Spec:** Text search by name, service, location. Filters: category, price, rating, distance.
**AC:**
- Search returns relevant businesses <500ms.
- Filters combine correctly.
- Empty state shown if no results.
**Priority:** P0

## 4. Map-based Search
**Spec:** Leaflet/Mapbox view with pins; click pin → preview card.
**AC:**
- Map shows businesses in viewport.
- Pan/zoom updates results.
- Pin click opens detail preview.
**Priority:** P0

## 5. Business Detail View
**Spec:** Cover, info, services, staff, reviews, map, book button.
**AC:**
- Shows all active services with prices/durations.
- Reviews summarized with rating.
- “Book” initiates flow or login.
**Priority:** P0

## 6. Service Categories
**Spec:** Tree of categories (Hair, Nails…) with icons.
**AC:**
- Category list renders with counts.
- Selecting filters businesses.
**Priority:** P0

## 7. Booking Flow
**Spec:** Select service → staff (opt) → date → slot → confirm → pay (if P1) → success.
**AC:**
- Only available slots selectable.
- Conflict prevented (double book).
- Confirmation saved with status pending/paid.
**Priority:** P0

## 8. Appointment Management
**Spec:** Customer views upcoming/past; cancel/reschedule. Provider sees day list.
**AC:**
- Cancel respects policy (24h).
- Reschedule reuses slot logic.
- Provider calendar updates.
**Priority:** P0

## 9. Favorites
**Spec:** Heart businesses; list in profile.
**AC:**
- Add/remove works instantly.
- Persists across sessions.
**Priority:** P1

## 10. User Profile
**Spec:** Name, phone, addresses, payment methods, appts.
**AC:**
- Edit saves.
- Delete account option.
**Priority:** P1

## 11. Availability & Slot Computation
**Spec:** Provider sets hours, breaks, service duration; engine computes free slots.
**AC:**
- Correctly excludes booked/break.
- Timezone aware.
- Supports recurring weekly.
**Priority:** P0

## 12. Shared Types & Design System
**Spec:** TS types, UI kit (buttons, cards), theme tokens.
**AC:**
- Single source types used by FE/BE.
- Components match Figma.
**Priority:** P0

## 13. Reviews & Ratings
**Spec:** Post-visit review 1–5 + text; display aggregated.
**AC:**
- Only verified visits.
- Average updates.
- Abuse report.
**Priority:** P1

## 14. Payment Integration
**Spec:** Stripe for card; hold or charge on book.
**AC:**
- Success/fail handled.
- Refund on cancel per policy.
- Invoice email.
**Priority:** P1

## 15. Notifications
**Spec:** Email/push for confirm, remind, cancel.
**AC:**
- Sent via job queue.
- User prefs respected.
**Priority:** P0/P1

## 16. Provider / Business Owner Portal
**Spec:** Manage profile, services, staff, hours, appts, payouts.
**AC:**
- CRUD services.
- View bookings calendar.
- Set unavailable.
**Priority:** P0

## 17. Admin Dashboard
**Spec:** Manage users, providers, categories, disputes.
**AC:**
- Suspend user.
- Edit global categories.
- View metrics.
**Priority:** P1

## 18. Background Jobs (BullMQ)
**Spec:** Queue for reminders, emails, slot cleanup.
**AC:**
- Job retries on fail.
- Dashboard monitors.
- No duplicate sends.
**Priority:** P1
