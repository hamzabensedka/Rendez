# Planity Clone — Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specs and acceptance criteria for a Planity-style beauty & wellness booking marketplace (client apps + provider portal + admin + jobs).

## Priorities
- P0 (MVP): User Authentication, Guest Browse, Business Search, Map Search, Business Detail, Service Categories, Booking Flow, Appointment Management, Availability & Slot Computation, Shared Types & Design System, Notifications (basic), Provider Portal (core), Admin Dashboard (core).
- P1: Favorites, Reviews & Ratings, Payment Integration, Background Jobs (BullMQ), Provider Portal (advanced), Admin (advanced).
- P2: Guest personalization, advanced analytics, loyalty.

## 1. User Authentication
- Features: Signup (email/phone), login, social login (Google/Apple), password reset, session management, role assignment (client, provider, admin).
- Acceptance:
  - User can register in <2 min; email verification required.
  - Invalid credentials show clear error.
  - JWT refreshed silently; logout clears session.
  - Roles restrict routes in UI and API.
- Priority: P0

## 2. Guest Browse & Explore
- Features: Landing page, featured businesses, trending services, city selection, no-account explore.
- Acceptance:
  - Guest sees curated list without login.
  - Tapping business prompts login only at booking.
  - City filter persists in localStorage.
- Priority: P0

## 3. Business Search & Discovery
- Features: Text search, filters (category, price, rating, distance, availability), sort.
- Acceptance:
  - Search returns relevant results in <1s.
  - Filters combine with AND logic.
  - Empty state shown when no results.
- Priority: P0

## 4. Map-based Search
- Features: Google Maps / Mapbox view, pins, cluster, tap pin -> preview card.
- Acceptance:
  - Pins reflect current filters.
  - Map and list sync on pan/zoom.
  - Preview card opens detail.
- Priority: P0

## 5. Business Detail View
- Features: Gallery, services, staff, hours, location, reviews summary, book button.
- Acceptance:
  - Shows real-time next available slot.
  - Gallery lazy loads.
  - Reviews tab paginated.
- Priority: P0

## 6. Service Categories
- Features: Tree categories (Hair, Nails, Spa…), icons, landing sections.
- Acceptance:
  - Category tree editable via admin.
  - Each business maps to >=1 category.
- Priority: P0

## 7. Booking Flow
- Features: Select service -> staff (optional) -> date -> slot -> client info -> confirm.
- Acceptance:
  - No double booking (atomic lock).
  - Shows price & duration before confirm.
  - Confirmation screen + notification sent.
- Priority: P0

## 8. Appointment Management
- Features: Upcoming/past, reschedule, cancel, reminders.
- Acceptance:
  - Client can cancel free up to policy limit.
  - Provider sees update instantly.
  - Cancellation emits notification.
- Priority: P0

## 9. Favorites
- Features: Save business/service, list view.
- Acceptance:
  - Saved state toggles instantly.
  - Persists across sessions.
- Priority: P1

## 10. User Profile
- Features: Personal info, addresses, payment methods, notifications pref.
- Acceptance:
  - Edits save with validation.
  - GDPR delete available.
- Priority: P0

## 11. Availability & Slot Computation
- Features: Provider calendar, working hours, breaks, service duration, concurrency.
- Acceptance:
  - Slots computed from 9–18 with 30m grid.
  - Unavailable dates excluded.
  - Buffer time respected.
- Priority: P0

## 12. Shared Types & Design System
- Features: TS types, UI kit (buttons, cards, colors), i18n.
- Acceptance:
  - Single source of truth in /shared.
  - Components used across web/mobile.
- Priority: P0

## 13. Reviews & Ratings
- Features: Star + text, photo, response by provider.
- Acceptance:
  - Only verified clients review.
  - Average updates on submit.
  - Abuse report available.
- Priority: P1

## 14. Payment Integration
- Features: Stripe/PCI, save card, partial deposit, refund.
- Acceptance:
  - Payment status synced with appointment.
  - Failed payment rolls back booking.
- Priority: P1

## 15. Notifications
- Features: Push (FCM), email, SMS (Twilio) for confirm, remind, cancel.
- Acceptance:
  - User can opt out per channel.
  - Sent via Background Jobs.
- Priority: P0/P1

## 16. Provider / Business Owner Portal
- Features: Manage profile, services, staff, hours, bookings, payouts.
- Acceptance:
  - Provider edits reflect in client app <1min.
  - Dashboard shows daily revenue.
- Priority: P0 (core), P1 (advanced)

## 17. Admin Dashboard
- Features: Users, businesses, categories, moderation, metrics.
- Acceptance:
  - Admin can suspend business.
  - Export CSV available.
- Priority: P0 (core), P1 (advanced)

## 18. Background Jobs (BullMQ)
- Features: Reminders, slot cache, report gen, webhooks.
- Acceptance:
  - Jobs retry with backoff.
  - Failed jobs logged & alerted.
- Priority: P1
