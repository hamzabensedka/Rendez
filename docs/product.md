# Planity Clone — Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specs and acceptance criteria for a Planity-style beauty & wellness booking marketplace (mobile-first). Priorities: P0 (must-have MVP), P1 (launch enhancer), P2 (post-launch).

## 1. User Authentication (P0)
- **Spec:** Email/phone signup, login, logout, password reset. Social login (Google/Apple) optional P1. JWT-based sessions with refresh tokens.
- **Acceptance:**
  - User can register with email+password; receives verification email.
  - Invalid credentials show error; 5 fails trigger lockout 15m.
  - Authenticated session persists across app restarts.
  - Password reset email contains 1h-expiry link.

## 2. Guest Browse & Explore (P0)
- **Spec:** Non-logged users can browse businesses, categories, and view details. Booking requires auth.
- **Acceptance:**
  - Guest sees home with featured businesses and categories.
  - Tapping book on a business prompts login/signup.
  - Guest cart/intent preserved after auth.

## 3. Business Search & Discovery (P0)
- **Spec:** Text search by name, service, or city. Filters: category, price, rating, distance.
- **Acceptance:**
  - Search returns relevant results <500ms (p95).
  - Filters combine with search and update URL/state.
  - Empty state shows suggestions.

## 4. Map-based Search (P1)
- **Spec:** Show businesses as pins on map with radius slider and geolocation.
- **Acceptance:**
  - Map loads with user location (permission handled).
  - Pins open preview card; radius change updates results.
  - Tap pin → detail view.

## 5. Business Detail View (P0)
- **Spec:** Cover image, info, services list, staff, reviews, booking CTA.
- **Acceptance:**
  - Shows address, hours, phone, 4+ photos.
  - Services expandable with prices/durations.
  - Reviews tab paginated.

## 6. Service Categories (P0)
- **Spec:** Tree of categories (Hair, Nails, Spa…) with icons.
- **Acceptance:**
  - Category tap lists businesses offering it.
  - Admin can add/edit categories (see Admin).

## 7. Booking Flow (P0)
- **Spec:** Select service → staff (optional) → date/time slot → confirm → pay.
- **Acceptance:**
  - Only available slots shown (see Availability).
  - User can add multiple services in one cart.
  - Confirmation screen + notification sent.

## 8. Appointment Management (P0)
- **Spec:** List upcoming/past appts; cancel/reschedule (rules apply).
- **Acceptance:**
  - Cancel allowed >24h before; else blocked with msg.
  - Reschedule reuses slot engine.
  - Calendar sync (P2) optional.

## 9. Favorites (P1)
- **Spec:** Heart businesses/services; view in profile.
- **Acceptance:**
  - Toggle works on detail and list.
  - Favorites persist per user.

## 10. User Profile (P0)
- **Spec:** Name, avatar, contact, payment methods, appt history, favorites.
- **Acceptance:**
  - Editable fields save instantly.
  - Delete account with GDPR flow.

## 11. Availability & Slot Computation (P0)
- **Spec:** Provider sets working hours, breaks, service durations; engine computes free slots per day.
- **Acceptance:**
  - No double-booking; slots respect buffer.
  - Timezone correct per provider.
  - Concurrent requests safe.

## 12. Shared Types & Design System (P0)
- **Spec:** TS types, UI kit (colors, buttons, spacing) in repo.
- **Acceptance:**
  - All screens use shared components.
  - Types imported across frontend/backend.

## 13. Reviews & Ratings (P1)
- **Spec:** Post-visit review (1–5 stars + text, photos).
- **Acceptance:**
  - Only users with completed appt can review.
  - Average rating shown on detail.
  - Flagging handled by admin.

## 14. Payment Integration (P0)
- **Spec:** Stripe for cards; wallet (P2). Auth-capture at booking.
- **Acceptance:**
  - Success/failure handled; receipt emailed.
  - Refund via admin/provider.
  - PCI-compliant (no raw card store).

## 15. Notifications (P0)
- **Spec:** Push (FCM/APN) + email for booking, reminder, cancel.
- **Acceptance:**
  - Reminder 24h before appt.
  - User can opt out per type.
  - Background job sends batches.

## 16. Provider / Business Owner Portal (P1)
- **Spec:** Web dashboard to manage profile, services, staff, hours, bookings.
- **Acceptance:**
  - Provider edits live to availability.
  - Sees daily schedule and customer info.
  - Accepts/declines bookings (P2 auto-accept default).

## 17. Admin Dashboard (P1)
- **Spec:** Manage users, businesses, categories, reviews, payouts.
- **Acceptance:**
  - Suspend user/business.
  - View metrics (GMV, bookings).
  - Resolve review flags.

## 18. Background Jobs (BullMQ) (P0)
- **Spec:** Queue for notifications, slot cleanup, reminder emails, analytics.
- **Acceptance:**
  - Jobs retry with backoff.
  - Failed jobs logged and alerted.
  - No job loss on restart.

## Priority Summary
- P0: Auth, Guest, Search, Detail, Categories, Booking, Appt, Profile, Availability, Types, Payment, Notifications, BullMQ.
- P1: Map, Favorites, Reviews, Provider, Admin.
- P2: Social login, Calendar sync, Wallet.

## Success Metrics
- 30% MoM bookings; <2% cancel due to slot errors; 4.5+ app rating.