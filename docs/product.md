# Planity Clone — Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specs and acceptance criteria for a Planity-style beauty & wellness booking marketplace (mobile-first). Priorities: P0 (must-have launch), P1 (post-launch fast follow), P2 (later).

## 1. User Authentication (P0)
- Email/phone sign-up, login, logout.
- OAuth: Google/Apple.
- Password reset via email/SMS.
- JWT-based sessions with refresh tokens.
**Acceptance:**
- User can register in <2 min; verification required.
- Invalid creds show error; locked after 5 fails.
- OAuth returns verified profile.

## 2. Guest Browse & Explore (P0)
- Guests view home, categories, business lists without login.
- Prompt login only at booking.
**Acceptance:**
- 90% pages accessible as guest.
- CTA appears on booking attempt.

## 3. Business Search & Discovery (P0)
- Text search by name, service, location.
- Filters: category, price, rating, distance.
**Acceptance:**
- Results <500ms.
- Empty state shown if no match.

## 4. Map-based Search (P1)
- Google Maps view with pins.
- Tap pin → preview card.
**Acceptance:**
- Pins clustered; map loads <2s.
- Radius filter works.

## 5. Business Detail View (P0)
- Gallery, services, staff, hours, reviews.
- “Book” button.
**Acceptance:**
- All data accurate; book disabled if no slot.

## 6. Service Categories (P0)
- Tree: Hair, Nails, Spa, etc.
- Sub-services with duration/price.
**Acceptance:**
- Categories editable by admin.
- Show count per category.

## 7. Booking Flow (P0)
- Select service → staff → slot → pay.
- Multi-service cart.
**Acceptance:**
- Slot locked 10 min.
- Confirmation email/SMS sent.

## 8. Appointment Management (P0)
- User: list, reschedule, cancel.
- Reminders 24h before.
**Acceptance:**
- Cancel frees slot.
- History retained 12 months.

## 9. Favorites (P1)
- Save businesses/services.
- Push on offer.
**Acceptance:**
- Sync across devices.

## 10. User Profile (P0)
- Name, phone, addresses, payment methods.
**Acceptance:**
- Editable; GDPR delete.

## 11. Availability & Slot Computation (P0)
- Per business/staff rules.
- Compute free slots avoiding conflicts.
**Acceptance:**
- DST-safe; buffer respected.

## 12. Shared Types & Design System (P0)
- TS types, UI kit (React Native).
**Acceptance:**
- Reused by all modules.

## 13. Reviews & Ratings (P1)
- Post-visit review, 1–5 stars.
- Owner reply.
**Acceptance:**
- One review per visit.
- Flagged content hidden.

## 14. Payment Integration (P0)
- Stripe/Apple Pay.
- Deposit or full.
**Acceptance:**
- PCI compliant; refund flow.

## 15. Notifications (P0)
- Push, email, SMS.
- Preferences.
**Acceptance:**
- Opt-in; 99% delivery.

## 16. Provider / Business Owner Portal (P1)
- Manage profile, services, staff, slots.
- View bookings, payouts.
**Acceptance:**
- Real-time calendar.

## 17. Admin Dashboard (P1)
- Moderate users, businesses, categories.
- Metrics.
**Acceptance:**
- Role-based access.

## 18. Background Jobs (BullMQ) (P0)
- Reminders, slot release, analytics.
**Acceptance:**
- Retry; dead-letter logged.

## Priority Summary
- P0: 1,2,3,5,6,7,8,10,11,12,14,15,18
- P1: 4,9,13,16,17
- P2: none at launch