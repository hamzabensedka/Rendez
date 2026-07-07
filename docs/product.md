# Planity Clone — Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specs and acceptance criteria for a Planity-style beauty & wellness booking marketplace (mobile-first web app + provider portal + admin).

## Priorities
- **P0 (MVP):** User Auth, Guest Browse, Search & Discovery, Map Search, Business Detail, Categories, Booking Flow, Availability & Slots, Appointment Mgmt, Shared Types/Design, Notifications (basic), Provider Portal (core).
- **P1:** Favorites, Reviews & Ratings, Payment Integration, User Profile, Admin Dashboard, Background Jobs.
- **P2:** Advanced notifications, analytics, provider marketing tools.

---

## 1. User Authentication
**Spec:** Email/phone signup, login, logout, password reset. JWT-based sessions. Role: customer, provider, admin.
**AC:**
- User can register with email + password; receives verification email.
- Login returns token; protected routes require token.
- Password reset via email link works.
- Roles enforced server-side.
**Priority:** P0

## 2. Guest Browse & Explore
**Spec:** Non-logged users can browse businesses, categories, and deals.
**AC:**
- Guest sees home with featured businesses.
- Guest can open detail view but booking prompts login.
**Priority:** P0

## 3. Business Search & Discovery
**Spec:** Text search by name, service, location. Filters: category, price, rating, distance.
**AC:**
- Search returns relevant businesses in <1s.
- Filters combine correctly.
- Empty state shown when no results.
**Priority:** P0

## 4. Map-based Search
**Spec:** Google Maps view with business pins; tap pin → preview card.
**AC:**
- Map shows pins within viewport.
- Pan/zoom updates results.
- Pin click opens detail preview.
**Priority:** P0

## 5. Business Detail View
**Spec:** Cover, gallery, services, staff, hours, reviews, book button.
**AC:**
- All data renders accurately.
- “Book” starts booking flow.
- Shows next available slot.
**Priority:** P0

## 6. Service Categories
**Spec:** Tree of categories (Hair, Nails, Spa…) with icons.
**AC:**
- Categories listed on home.
- Selecting filters businesses.
**Priority:** P0

## 7. Booking Flow
**Spec:** Select service → staff (opt) → date → slot → confirm → pay.
**AC:**
- Only available slots selectable.
- Confirmation email/SMS sent.
- Double-booking prevented.
**Priority:** P0

## 8. Appointment Management
**Spec:** Customer views upcoming/past; cancel/reschedule. Provider sees schedule.
**AC:**
- Cancel frees slot.
- Reschedule re-checks availability.
- Status updates reflected in real time.
**Priority:** P0

## 9. Favorites
**Spec:** Save businesses/services to list.
**AC:**
- Heart toggles state.
- Favorites list renders saved items.
**Priority:** P1

## 10. User Profile
**Spec:** Edit name, phone, addresses, payment methods.
**AC:**
- Changes persist.
- Address used in booking.
**Priority:** P1

## 11. Availability & Slot Computation
**Spec:** Provider sets hours, breaks, service duration; system computes slots.
**AC:**
- Slots exclude booked + breaks.
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
- Only visited users review.
- Avg updates on detail.
- Abuse report works.
**Priority:** P1

## 14. Payment Integration
**Spec:** Stripe for cards; partial deposit or full.
**AC:**
- Payment success confirms booking.
- Failure rolls back.
- Refund via admin.
**Priority:** P1

## 15. Notifications
**Spec:** Email + SMS for booking, reminder, cancel.
**AC:**
- Triggered by events.
- User can opt out.
**Priority:** P0/P1

## 16. Provider / Business Owner Portal
**Spec:** Manage profile, services, staff, hours, bookings, payouts.
**AC:**
- CRUD on services reflects on app.
- Calendar shows bookings.
- Payout view accurate.
**Priority:** P0

## 17. Admin Dashboard
**Spec:** Manage users, providers, categories, disputes, content.
**AC:**
- Suspend user/provider.
- Create category.
- View metrics.
**Priority:** P1

## 18. Background Jobs (BullMQ)
**Spec:** Queue for reminders, emails, slot cache, sync.
**AC:**
- Job retries on fail.
- No duplicate reminders.
- Dashboard monitors queues.
**Priority:** P1
