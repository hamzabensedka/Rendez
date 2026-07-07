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
- User can register with email + password (min 8 chars).
- Verification email/SMS sent; account active after confirm.
- Login returns token; protected routes require token.
- Password reset via email link works.
- OAuth login creates/links account.
**Priority:** P0

## 2. Guest Browse & Explore
**Spec:** Non-logged users can view categories, businesses, and details.
**AC:**
- Guest sees home with featured businesses and categories.
- Guest can open business detail but booking prompts login.
- No personal data stored for guest.
**Priority:** P0

## 3. Business Search & Discovery
**Spec:** Text search by name, service, location. Filters: category, price, rating, distance.
**AC:**
- Search returns relevant businesses in <1s.
- Filters combine correctly.
- Empty state shown when no results.
**Priority:** P0

## 4. Map-based Search
**Spec:** Show businesses as pins on map; move map updates results.
**AC:**
- Map renders with user location (with permission).
- Pins clickable to preview business.
- Radius filter reflects map bounds.
**Priority:** P0

## 5. Business Detail View
**Spec:** Photos, services, staff, hours, location, reviews summary, book button.
**AC:**
- All data loads correctly.
- Services list with prices/durations.
- “Book” starts flow or login if guest.
**Priority:** P0

## 6. Service Categories
**Spec:** Tree of categories (Hair, Nails, Spa…) with icons.
**AC:**
- Categories seeded and editable by admin.
- Selecting category filters discovery.
**Priority:** P0

## 7. Booking Flow
**Spec:** Select service → staff (opt) → date → slot → confirm → pay (if P1) → success.
**AC:**
- Only available slots shown.
- Double-booking prevented.
- Confirmation screen + notification sent.
**Priority:** P0

## 8. Appointment Management
**Spec:** User views upcoming/past, reschedule, cancel (policy-based).
**AC:**
- List accurate from DB.
- Cancel updates availability.
- Reschedule re-checks slots.
**Priority:** P0

## 9. Favorites
**Spec:** Save businesses to favorites list.
**AC:**
- Heart toggle on detail.
- Favorites list in profile.
- Sync across devices.
**Priority:** P1

## 10. User Profile
**Spec:** Name, contact, addresses, payment methods, preferences.
**AC:**
- Editable fields persist.
- Address used in search default.
**Priority:** P1

## 11. Availability & Slot Computation
**Spec:** Provider sets hours + breaks + service duration; system computes free slots.
**AC:**
- Slots exclude booked + breaks.
- Timezone correct.
- Concurrent requests safe.
**Priority:** P0

## 12. Shared Types & Design System
**Spec:** TS types, UI kit (colors, buttons, inputs) in repo.
**AC:**
- Components reused across app.
- Types imported by frontend/backend.
**Priority:** P0

## 13. Reviews & Ratings
**Spec:** Post-visit review (1–5 stars + text). Display averages.
**AC:**
- Only verified visits reviewable.
- Average updates on new review.
- Abuse report available.
**Priority:** P1

## 14. Payment Integration
**Spec:** Stripe for cards; deposit/full; refund on cancel.
**AC:**
- Payment success before confirmation.
- Webhook updates appointment status.
- Refund via admin/policy.
**Priority:** P1

## 15. Notifications
**Spec:** Email/push/SMS for booking, reminder, cancel.
**AC:**
- Triggered by events.
- User can opt out.
- Retry on fail.
**Priority:** P0 (basic), P1 (advanced)

## 16. Provider / Business Owner Portal
**Spec:** Manage profile, services, staff, hours, appointments, payouts.
**AC:**
- Owner logs in to own business only.
- Changes reflect in app immediately.
- Dashboard shows day/week bookings.
**Priority:** P0 (core), P1 (payouts)

## 17. Admin Dashboard
**Spec:** Manage users, businesses, categories, reviews, support.
**AC:**
- Admin role restricted.
- Can suspend business/user.
- View platform metrics.
**Priority:** P1

## 18. Background Jobs (BullMQ)
**Spec:** Queue for reminders, emails, slot cache, webhooks.
**AC:**
- Jobs retry with backoff.
- Failed jobs logged.
- No duplicate notifications.
**Priority:** P1

---

## Success Metrics
- 80% booking completion rate.
- <2% double-booking incidents.
- Provider NPS > 30.

## Assumptions
- Mobile-first responsive web.
- Initial market: one city.
- Stripe as sole PSP at launch.