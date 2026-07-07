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
- User can register with email + password; receives verification email.
- Login returns token; protected routes require token.
- Password reset via email link works.
- Roles enforced server-side.
**Priority:** P0

## 2. Guest Browse & Explore
**Spec:** Non-logged users can view home, categories, business list/detail, but not book.
**AC:**
- Guest sees featured businesses and categories.
- Booking CTA prompts login.
**Priority:** P0

## 3. Business Search & Discovery
**Spec:** Text search by name, service, location. Filters: category, price, rating, distance.
**AC:**
- Search returns relevant businesses in <500ms.
- Filters combine correctly.
**Priority:** P0

## 4. Map-based Search
**Spec:** Leaflet/Mapbox view with pins; click pin → preview card.
**AC:**
- Map shows businesses in viewport.
- Pan/zoom updates results.
**Priority:** P0

## 5. Business Detail View
**Spec:** Gallery, services, staff, hours, location, reviews summary, book button.
**AC:**
- All data accurate from DB.
- Reviews shown with pagination.
**Priority:** P0

## 6. Service Categories
**Spec:** Tree of categories (Hair, Nails…) with icons.
**AC:**
- Category page lists businesses.
- Provider can assign multiple.
**Priority:** P0

## 7. Booking Flow
**Spec:** Select service → staff (opt) → date → slot → confirm → pay (if P1) → success.
**AC:**
- No double booking (atomic lock).
- Confirmation saved with status pending/confirmed.
**Priority:** P0

## 8. Appointment Management
**Spec:** Customer views upcoming/past; cancel/reschedule. Provider sees schedule.
**AC:**
- Cancel updates slot availability.
- Reminder sent 24h before.
**Priority:** P0

## 9. Favorites
**Spec:** Heart businesses; list in profile.
**AC:**
- Persists per user.
- Remove works.
**Priority:** P1

## 10. User Profile
**Spec:** Name, phone, addresses, payment methods, appts.
**AC:**
- Edits save.
- GDPR delete available.
**Priority:** P1

## 11. Availability & Slot Computation
**Spec:** Provider sets weekly hours + breaks + service duration; system computes free slots.
**AC:**
- Overlapping bookings prevented.
- Timezone correct.
**Priority:** P0

## 12. Shared Types & Design System
**Spec:** TS types, UI kit (buttons, cards), color tokens.
**AC:**
- Used across apps.
- Storybook exists.
**Priority:** P0

## 13. Reviews & Ratings
**Spec:** Post-visit review (1–5 stars + text). Avg shown.
**AC:**
- Only verified visits.
- Moderation flag.
**Priority:** P1

## 14. Payment Integration
**Spec:** Stripe for cards; deposit/full; refund.
**AC:**
- Webhook updates status.
- Failed pay → booking released.
**Priority:** P1

## 15. Notifications
**Spec:** Email + push for confirm, reminder, cancel.
**AC:**
- Sent via job queue.
- Prefs respected.
**Priority:** P0/P1

## 16. Provider / Business Owner Portal
**Spec:** Manage profile, services, staff, hours, bookings, payouts.
**AC:**
- Only own data.
- Calendar sync.
**Priority:** P0

## 17. Admin Dashboard
**Spec:** Manage users, businesses, categories, reports.
**AC:**
- Suspend user.
- View metrics.
**Priority:** P1

## 18. Background Jobs (BullMQ)
**Spec:** Queues for reminders, emails, slot cleanup.
**AC:**
- Retry on fail.
- Dashboard monitors.
**Priority:** P1
