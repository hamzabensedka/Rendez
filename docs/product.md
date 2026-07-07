# Planity Clone — Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specs and acceptance criteria for a Planity-style beauty & wellness booking marketplace (mobile-first web app + provider portal + admin).

## Priorities
- **P0 (MVP):** User Auth, Guest Browse, Search & Discovery, Map Search, Business Detail, Categories, Booking Flow, Availability & Slots, Appointment Mgmt, Shared Types/Design, Notifications (basic), Provider Portal (core).
- **P1:** Favorites, Reviews & Ratings, Payment Integration, User Profile, Admin Dashboard, Background Jobs.
- **P2:** Advanced notifications, analytics, bulk ops.

## 1. User Authentication
- Email/phone signup, login, logout, password reset.
- OAuth (Google/Apple) optional P1.
- AC: User can register in <2 min; email verification required; JWT stored securely; wrong password shows limit + lockout after 5 tries.
- Priority: P0

## 2. Guest Browse & Explore
- Guests view categories, featured businesses, city landing.
- AC: No auth needed to browse; prompt login only at booking; session persists cart.
- Priority: P0

## 3. Business Search & Discovery
- Text search by name, service, city; filters (price, rating, distance).
- AC: Results <500ms; empty state shown; recent searches saved.
- Priority: P0

## 4. Map-based Search
- Google Maps view with pins; click pin -> preview card.
- AC: Map loads <2s; clusters at low zoom; filters apply to map.
- Priority: P0

## 5. Business Detail View
- Cover, gallery, services, staff, hours, reviews, book button.
- AC: All sections render; deep link works; shows next available slot.
- Priority: P0

## 6. Service Categories
- Tree: Beauty > Hair > Cut. Admin-managed.
- AC: 3-level max; used in nav and search; counts accurate.
- Priority: P0

## 7. Booking Flow
- Select service -> staff (optional) -> slot -> confirm -> pay.
- AC: No double booking; price calc clear; 10-min hold on slot; confirmation email/SMS.
- Priority: P0

## 8. Appointment Management
- List upcoming/past; cancel/reschedule (rules per business).
- AC: User sees status; provider synced; cancel triggers refund if paid.
- Priority: P0

## 9. Favorites
- Save businesses/services.
- AC: Toggle from list/detail; synced to profile; max 200.
- Priority: P1

## 10. User Profile
- Name, phone, addresses, payment methods, preferences.
- AC: Editable; avatar upload; GDPR delete.
- Priority: P1

## 11. Availability & Slot Computation
- Provider sets hours, breaks, service duration; engine computes free slots.
- AC: Respect timezone; buffer between appts; concurrent safe; recompute on change.
- Priority: P0

## 12. Shared Types & Design System
- TS types, UI kit (colors, buttons, inputs) in repo.
- AC: Used by all modules; versioned; Storybook.
- Priority: P0

## 13. Reviews & Ratings
- Post-visit review (1-5 + text, photos).
- AC: One per appointment; visible after 24h; flagging workflow.
- Priority: P1

## 14. Payment Integration
- Stripe: card, saved PM, partial deposit.
- AC: PCI compliant; webhooks update status; retry on fail.
- Priority: P1

## 15. Notifications
- Email/SMS/push for booking, reminder, cancel.
- AC: Templated; opt-out; delivered <1min via queue.
- Priority: P0 (basic), P2 (advanced)

## 16. Provider / Business Owner Portal
- Manage profile, services, staff, hours, bookings, payouts.
- AC: Role-based; live calendar; export CSV; reply to reviews.
- Priority: P0 (core)

## 17. Admin Dashboard
- Users, businesses, categories, disputes, metrics.
- AC: Search/filter; suspend; impersonate off; audit log.
- Priority: P1

## 18. Background Jobs (BullMQ)
- Reminders, slot cleanup, report gen, webhook retries.
- AC: Retry with backoff; dead-letter; monitor UI.
- Priority: P1
