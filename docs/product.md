# Planity Clone — Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specs and acceptance criteria for a Planity-style beauty & wellness booking marketplace (mobile-first web app + provider portal + admin).

## Priorities
- **P0 (MVP):** User Auth, Guest Browse, Search & Discovery, Map Search, Business Detail, Categories, Booking Flow, Availability & Slots, Appointment Mgmt, Shared Types/Design, Notifications (basic), Provider Portal (core).
- **P1:** Favorites, Reviews & Ratings, Payment Integration, User Profile, Admin Dashboard, Background Jobs.
- **P2:** Advanced notifications, provider analytics, promos.

---

## 1. User Authentication
**Spec:** Email/phone signup-login, OAuth (Google/Apple), JWT sessions, password reset.
**AC:**
- User can register with email and verified phone.
- Login returns JWT; protected routes require it.
- Password reset email works.
- OAuth completes in <5s.
**Priority:** P0

## 2. Guest Browse & Explore
**Spec:** Non-logged users view home, businesses, categories.
**AC:**
- Guest sees curated list and can open details.
- Booking prompts login.
**Priority:** P0

## 3. Business Search & Discovery
**Spec:** Text search, filters (category, price, rating, distance).
**AC:**
- Results <1s for 10k businesses.
- Filters combine correctly.
**Priority:** P0

## 4. Map-based Search
**Spec:** Leaflet/Mapbox view with pins, geolocation.
**AC:**
- Pins reflect filters.
- Tap pin opens preview card.
**Priority:** P0

## 5. Business Detail View
**Spec:** Gallery, services, staff, hours, reviews summary, book button.
**AC:**
- Shows next available slot.
- All sections render on mobile.
**Priority:** P0

## 6. Service Categories
**Spec:** Tree of categories (Hair, Nails…) with icons.
**AC:**
- Category links to filtered search.
- Provider can assign multiple.
**Priority:** P0

## 7. Booking Flow
**Spec:** Select service → staff → slot → confirm → pay.
**AC:**
- No double booking (lock slot).
- Confirmation saved to appointments.
**Priority:** P0

## 8. Appointment Management
**Spec:** List, reschedule, cancel, reminders.
**AC:**
- User cancels with policy applied.
- Provider sees update via jobs.
**Priority:** P0

## 9. Favorites
**Spec:** Save businesses/services.
**AC:**
- Persists across sessions.
- Shown in profile.
**Priority:** P1

## 10. User Profile
**Spec:** Personal info, addresses, payment methods, history.
**AC:**
- Edits save.
- GDPR delete available.
**Priority:** P1

## 11. Availability & Slot Computation
**Spec:** Provider calendars + service duration → free slots.
**AC:**
- Computes slots excluding breaks/booked.
- Timezone correct.
**Priority:** P0

## 12. Shared Types & Design System
**Spec:** TS types, UI kit (colors, components).
**AC:**
- Used across apps.
- Storybook exists.
**Priority:** P0

## 13. Reviews & Ratings
**Spec:** Post-visit review, avg score.
**AC:**
- Only visited users review.
- Moderation queue.
**Priority:** P1

## 14. Payment Integration
**Spec:** Stripe for cards, partial deposit.
**AC:**
- Success/failure handled.
- Refund via admin.
**Priority:** P1

## 15. Notifications
**Spec:** Email/push for confirm, remind, cancel.
**AC:**
- Sent via BullMQ.
- User opt-out works.
**Priority:** P0/P1

## 16. Provider / Business Owner Portal
**Spec:** Manage profile, services, staff, hours, bookings.
**AC:**
- Can block slots.
- Sees daily agenda.
**Priority:** P0

## 17. Admin Dashboard
**Spec:** Users, providers, disputes, categories.
**AC:**
- Suspend provider.
- View metrics.
**Priority:** P1

## 18. Background Jobs (BullMQ)
**Spec:** Reminders, slot cleanup, analytics.
**AC:**
- Retry on fail.
- Dashboard monitors.
**Priority:** P1
