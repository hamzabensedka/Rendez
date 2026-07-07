# Planity Clone — Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specs and acceptance criteria for a Planity-style beauty & wellness booking marketplace (client apps + provider portal + admin + jobs).

## Priorities
- P0 (MVP): User Authentication, Guest Browse, Business Search, Map Search, Business Detail, Categories, Booking Flow, Appointment Mgmt, Availability/Slots, Shared Types/Design, Notifications, Provider Portal (basic), Background Jobs.
- P1: Favorites, Reviews & Ratings, Payment Integration, User Profile, Admin Dashboard.
- P2: Advanced provider tools, analytics, promotions.

## 1. User Authentication (P0)
- Features: email/password signup-login, social login (Google/Apple), OTP phone verify, password reset, JWT refresh.
- AC: User can register in <2 min; invalid email blocked; token expires in 15m, refresh 7d; social login returns profile.

## 2. Guest Browse & Explore (P0)
- Features: home feed of featured businesses, trending categories, no account required.
- AC: Guest sees 10+ businesses; tapping opens detail; session persists cart/intent.

## 3. Business Search & Discovery (P0)
- Features: text search, filter by category, price, rating, distance, availability.
- AC: Query returns relevant results <500ms; empty state shown; filters combinable.

## 4. Map-based Search (P0)
- Features: Google Maps view, pins for businesses, radius slider, click pin -> detail.
- AC: Pins load within viewport; radius 1–50km; pin cluster when zoomed out.

## 5. Business Detail View (P0)
- Features: gallery, services list, staff, hours, reviews summary, book button.
- AC: Shows next available slot; images lazy-load; back button works.

## 6. Service Categories (P0)
- Features: tree of categories (Hair, Nails, Spa…), subcategories.
- AC: 20+ top categories seeded; selection drives search.

## 7. Booking Flow (P0)
- Features: select service, staff, date, slot; confirm; guest or login.
- AC: No double-booking; confirmation screen; email/SMS sent.

## 8. Appointment Management (P0)
- Features: list upcoming/past, reschedule, cancel (policy), reminders.
- AC: Cancel respects 24h rule; status updates real-time.

## 9. Favorites (P1)
- Features: save business/service, view list, remove.
- AC: Sync across devices; max 200 saved.

## 10. User Profile (P1)
- Features: name, phone, addresses, payment methods, preferences.
- AC: Edit saves; validation on phone.

## 11. Availability & Slot Computation (P0)
- Features: provider calendar, service duration, breaks, buffer.
- AC: Slots generated at 15min granularity; conflicts prevented.

## 12. Shared Types & Design System (P0)
- Features: TS types, UI kit (colors, buttons), API contracts.
- AC: Used by all modules; versioned.

## 13. Reviews & Ratings (P1)
- Features: 1–5 star, text, photo, owner reply.
- AC: Only verified visits; abuse report.

## 14. Payment Integration (P1)
- Features: Stripe/Cards, wallet, refund.
- AC: PCI compliant; failure retry; receipt sent.

## 15. Notifications (P0)
- Features: push, email, SMS for booking, reminder, promo.
- AC: Opt-in; delivered <1m; unsubscribe.

## 16. Provider / Business Owner Portal (P0)
- Features: manage profile, services, staff, hours, bookings, payouts.
- AC: Owner login isolated; edits live in 1m.

## 17. Admin Dashboard (P1)
- Features: users, businesses, disputes, content mod, metrics.
- AC: Role-based; audit log; export CSV.

## 18. Background Jobs (BullMQ) (P0)
- Features: reminder emails, slot cache, image resize, report gen.
- AC: Retry 3x; dead-letter; monitor UI.
