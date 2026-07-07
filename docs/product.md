# Planity Clone — Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specs and acceptance criteria for a Planity-style beauty & wellness booking marketplace (mobile-first web app + provider portal + admin).
**Priority legend:** P0 = must-have launch, P1 = important post-MVP, P2 = later.

---

## 1. Shared Types & Design System (P0)
Unified types, tokens, components used across app, portal, admin.

**Features**
- Design tokens (color, spacing, typography), UI kit (buttons, cards, inputs).
- Shared TS types: User, Business, Service, Slot, Booking, Review.

**Acceptance**
- AC1: Single npm package `@planity/design` consumed by all fronts.
- AC2: Components meet a11y (WCAG AA) and mobile breakpoints.
- AC3: Type definitions prevent duplicate models in repos.

---

## 2. User Authentication (P0)
Email/phone + OAuth (Google/Apple). Roles: customer, provider, admin.

**Features**
- Signup, login, logout, password reset, OTP verify.
- JWT refresh, role-based routing.

**Acceptance**
- AC1: Signup < 2 min; email verification required.
- AC2: Invalid creds show generic error (no enum leak).
- AC3: Session persists 7d via refresh token.

---

## 3. Guest Browse & Explore (P0)
Non-logged users view categories, businesses, no booking.

**Features**
- Home feed, category tiles, popular near me.

**Acceptance**
- AC1: Guest can open detail view but Booking prompts login.
- AC2: Zero personalized data stored for guest.

---

## 4. Business Search & Discovery (P0)
Text search, filters (price, rating, distance, availability).

**Features**
- Debounced search, filter chips, sort.

**Acceptance**
- AC1: Results < 500ms for 10k businesses.
- AC2: Empty state with suggestions.

---

## 5. Map-based Search (P1)
Leaflet/Mapbox view with pins and viewport filtering.

**Features**
- Geolocation, pin clustering, tap pin → preview card.

**Acceptance**
- AC1: Map updates results on move-end (debounced).
- AC2: Free tier usage under cost cap.

---

## 6. Business Detail View (P0)
Gallery, services, staff, hours, reviews, Book button.

**Features**
- Hero, info, service list, mini-map.

**Acceptance**
- AC1: Loads < 1.5s.
- AC2: Shows next available slot.

---

## 7. Service Categories (P0)
Tree: Hair → Cut, Color; Nails → Manicure.

**Features**
- Admin-managed taxonomy, icons.

**Acceptance**
- AC1: 2-level min; businesses map to leaf.
- AC2: Category changes reflect in 1h.

---

## 8. Booking Flow (P0)
Select service → staff → slot → pay → confirm.

**Features**
- Stepper, price summary, coupon.

**Acceptance**
- AC1: Double-book prevented via lock.
- AC2: Confirmation email/SMS sent.
- AC3: Abandoned cart cleared after 15m.

---

## 9. Appointment Management (P0)
List, reschedule, cancel, history.

**Features**
- Upcoming/past tabs, 24h cancel rule.

**Acceptance**
- AC1: Reschedule shows only free slots.
- AC2: Cancel triggers refund job.

---

## 10. Favorites (P1)
Save businesses/services.

**Features**
- Heart toggle, favorites tab.

**Acceptance**
- AC1: Sync across devices.
- AC2: Max 500 (soft).

---

## 11. User Profile (P0)
Edit name, phone, addresses, payment methods.

**Acceptance**
- AC1: Phone change re-verifies.
- AC2: GDPR export available.

---

## 12. Availability & Slot Computation (P0)
Engine: business hours × service dur × staff × breaks.

**Features**
- Rule builder, buffer, timezone safe.

**Acceptance**
- AC1: Correct slots for 30/60 min services.
- AC2: DST handled.

---

## 13. Reviews & Ratings (P0)
Post-visit review, photos, helpful votes.

**Features**
- 1–5 stars, text, owner reply.

**Acceptance**
- AC1: Only verified bookings review.
- AC2: Avg rating cached.

---

## 14. Payment Integration (P0)
Stripe: cards, 3DS, partial refund.

**Acceptance**
- AC1: PCI via Stripe, no raw PAN.
- AC2: Webhook updates booking.

---

## 15. Notifications (P0)
Email, SMS, push (reminders, marketing opt-in).

**Acceptance**
- AC1: Reminder 24h before.
- AC2: Unsubscribe honored.

---

## 16. Provider / Business Owner Portal (P0)
Manage profile, services, staff, slots, bookings, payouts.

**Features**
- Dashboard, calendar, reports.

**Acceptance**
- AC1: Can block slots live.
- AC2: Payout statement monthly.

---

## 17. Admin Dashboard (P1)
Manage users, businesses, categories, disputes.

**Acceptance**
- AC1: Suspend business.
- AC2: Audit log retained 1y.

---

## 18. Background Jobs (BullMQ) (P0)
Queues: reminders, refunds, sync, image resize.

**Acceptance**
- AC1: Retry with backoff.
- AC2: Dead-letter monitored.

---

## Priority Summary
P0: 1,2,3,4,6,7,8,9,11,12,13,14,15,16,18
P1: 5,10,17
P2: none at spec time
