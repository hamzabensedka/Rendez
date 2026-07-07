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
- Invalid creds show error; 5 fails locks 15m.
- Authenticated user can access booked appointments.
- Token persists across refresh.
**Priority:** P0

## 2. Guest Browse & Explore
**Spec:** Non-logged users can view categories, businesses, and details.
**AC:**
- Guest sees home with popular categories.
- Guest can open business detail but booking prompts login.
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
**Spec:** Interactive map shows business pins; tap pin opens preview card.
**AC:**
- Map loads with user location (permission granted).
- Pins cluster when zoomed out.
- Tap pin → redirect to detail.
**Priority:** P0

## 5. Business Detail View
**Spec:** Gallery, services, staff, hours, location, reviews summary, “Book” CTA.
**AC:**
- Shows next available slot.
- Services expandable with prices/durations.
- Reviews tab loads paginated.
**Priority:** P0

## 6. Service Categories
**Spec:** Tree of categories (Hair, Nails, Spa…) with icons.
**AC:**
- Category tap lists businesses offering it.
- Admin can add/edit categories.
**Priority:** P0

## 7. Booking Flow
**Spec:** Select service → staff (opt) → date → slot → confirm → pay.
**AC:**
- Only available slots selectable.
- Conflict detection prevents double-book.
- Confirmation saved to appointments.
**Priority:** P0

## 8. Appointment Management
**Spec:** List upcoming/past; cancel/reschedule; reminders.
**AC:**
- User can cancel ≥2h before free.
- Reschedule reuses slot engine.
- Status updates reflected in provider portal.
**Priority:** P0

## 9. Favorites
**Spec:** Save businesses to favorites list.
**AC:**
- Heart toggle on detail.
- Favorites persist per user.
**Priority:** P1

## 10. User Profile
**Spec:** Name, phone, addresses, payment methods, preferences.
**AC:**
- Edits save and validate phone.
- Delete account purges PII (GDPR).
**Priority:** P1

## 11. Availability & Slot Computation
**Spec:** Engine computes slots from business hours, service duration, staff schedules, existing bookings.
**AC:**
- Returns 15-min granularity slots.
- Respects breaks and holidays.
- Scales to 1000 bookings/business.
**Priority:** P0

## 12. Shared Types & Design System
**Spec:** TS types, UI kit (buttons, cards, colors) in repo `shared/`.
**AC:**
- Web and portal import same types.
- Components meet a11y contrast.
**Priority:** P0

## 13. Reviews & Ratings
**Spec:** Post-visit review (1–5 stars + text). Display averages.
**AC:**
- Only verified visitors review.
- Business replies visible.
- Fake review flagging.
**Priority:** P1

## 14. Payment Integration
**Spec:** Stripe for cards; partial deposit or full.
**AC:**
- PCI-compliant; test mode.
- Failed payment rolls back booking.
- Refund via admin.
**Priority:** P1

## 15. Notifications
**Spec:** Email/push for booking, reminder, cancel.
**AC:**
- Sent via job queue.
- User can opt out.
**Priority:** P0/P1

## 16. Provider / Business Owner Portal
**Spec:** Manage profile, services, staff, hours, appointments, payouts.
**AC:**
- Owner login isolated from users.
- Can block slots manually.
- Dashboard shows daily revenue.
**Priority:** P0

## 17. Admin Dashboard
**Spec:** Manage users, businesses, categories, disputes.
**AC:**
- Suspend business.
- View platform metrics.
**Priority:** P1

## 18. Background Jobs (BullMQ)
**Spec:** Queue for reminders, emails, slot cache, analytics.
**AC:**
- Jobs retry with backoff.
- Failed jobs logged.
- No blocking on API reqs.
**Priority:** P1
