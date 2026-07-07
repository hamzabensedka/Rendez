# Planity Clone — Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specs and acceptance criteria for a Planity-style beauty & wellness booking marketplace (mobile-first web app + provider portal + admin).

## Priorities
- **P0 (MVP):** User Auth, Guest Browse, Search & Discovery, Map Search, Business Detail, Categories, Booking Flow, Availability & Slots, Appointment Mgmt, Shared Types/Design, Notifications (basic), Provider Portal (core).
- **P1:** Favorites, Reviews & Ratings, Payment Integration, User Profile, Admin Dashboard, Background Jobs.
- **P2:** Advanced notifications, analytics, promotions.

---

## 1. User Authentication
**Spec:** Email/phone signup, login, logout, password reset. JWT-based sessions. OAuth (Google/Apple) optional.
**AC:**
- User can register with email+password; receives verification email.
- Login returns token; protected routes require token.
- Password reset via email link works.
- Invalid creds show error; lock after 5 fails.
**Priority:** P0

## 2. Guest Browse & Explore
**Spec:** Non-logged users can view home, categories, business list/detail, no booking.
**AC:**
- Guest sees curated categories and popular businesses.
- CTA to login appears on booking attempt.
**Priority:** P0

## 3. Business Search & Discovery
**Spec:** Text search by name, service, location. Filters: category, price, rating, distance.
**AC:**
- Search returns relevant businesses <500ms.
- Filters combine correctly; empty state shown.
**Priority:** P0

## 4. Map-based Search
**Spec:** Leaflet/Mapbox view with pins; click pin → preview card.
**AC:**
- Map shows businesses in viewport; pan/zoom updates results.
- Pin click opens detail sheet.
**Priority:** P0

## 5. Business Detail View
**Spec:** Cover, info, services, staff, reviews, map, book button.
**AC:**
- Shows real-time availability summary.
- Reviews paginated; services grouped by category.
**Priority:** P0

## 6. Service Categories
**Spec:** Tree of categories (Hair, Nails…) with icons.
**AC:**
- Category page lists businesses/offers.
- Admin can CRUD categories.
**Priority:** P0

## 7. Booking Flow
**Spec:** Select service → staff (opt) → slot → confirm → pay (if P1) → success.
**AC:**
- Only available slots selectable.
- Double-book prevented via lock.
- Confirmation notification sent.
**Priority:** P0

## 8. Appointment Management
**Spec:** User views upcoming/past; cancel/reschedule.
**AC:**
- Cancel frees slot; provider notified.
- Reschedule uses same flow.
**Priority:** P0

## 9. Favorites
**Spec:** Heart businesses; list in profile.
**AC:**
- Add/remove persists; guest prompt login.
**Priority:** P1

## 10. User Profile
**Spec:** Name, phone, addresses, payment methods.
**AC:**
- Edit saves; phone verified.
**Priority:** P1

## 11. Availability & Slot Computation
**Spec:** Provider sets hours, breaks, service duration; engine computes free slots.
**AC:**
- Correctly excludes booked; respects buffer.
- Timezone aware.
**Priority:** P0

## 12. Shared Types & Design System
**Spec:** TS types, UI kit (colors, buttons, components).
**AC:**
- Consistent across app; documented.
**Priority:** P0

## 13. Reviews & Ratings
**Spec:** Post-visit review (1–5, text, photos).
**AC:**
- Only verified visits; avg updates.
- Report abuse works.
**Priority:** P1

## 14. Payment Integration
**Spec:** Stripe/Cash; deposit or full.
**AC:**
- Success creates paid appt; failure frees slot.
- Refund via admin.
**Priority:** P1

## 15. Notifications
**Spec:** Email/push/SMS for book, cancel, remind.
**AC:**
- Sent via job queue; user prefs respected.
**Priority:** P0/P1

## 16. Provider / Business Owner Portal
**Spec:** Manage profile, services, staff, hours, bookings, payouts.
**AC:**
- CRUD works; live availability.
- Dashboard shows day stats.
**Priority:** P0

## 17. Admin Dashboard
**Spec:** Manage users, businesses, categories, disputes.
**AC:**
- Suspend business; view metrics.
**Priority:** P1

## 18. Background Jobs (BullMQ)
**Spec:** Queue for notifications, slot cleanup, reminders.
**AC:**
- Jobs retry; failed logged; dashboard monitors.
**Priority:** P1
