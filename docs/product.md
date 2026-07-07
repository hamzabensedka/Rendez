# Planity Clone — Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specs and acceptance criteria for a Planity-style beauty & wellness booking marketplace (client apps + provider portal + admin + jobs).

## Priorities
- P0 (MVP): User Auth, Guest Browse, Search & Discovery, Map Search, Business Detail, Categories, Booking Flow, Appt Management, Availability/Slots, Shared Types/Design, Notifications (basic), Provider Portal (core).
- P1: Favorites, Reviews & Ratings, Payment Integration, User Profile, Admin Dashboard, Background Jobs.
- P2: Advanced notifications, provider analytics, admin moderation tools.

## 1. User Authentication (P0)
- Features: email/phone signup, login, social login (Google/Apple), password reset, JWT/session, role (client/provider/admin).
- AC: User can register in <2 min; email verification sent; wrong password shows error; token persists across reload; roles restrict routes.

## 2. Guest Browse & Explore (P0)
- Features: home feed of featured businesses, no login required, CTAs to login on booking.
- AC: Guest sees 10+ businesses; tapping book prompts auth; no client data stored.

## 3. Business Search & Discovery (P0)
- Features: text search, filter by category, price, rating, distance, availability.
- AC: Search returns relevant results <1s; empty state shown when none; filters combine.

## 4. Map-based Search (P0)
- Features: Google Maps view, pins for businesses, tap pin -> preview, radius slider.
- AC: Map loads <3s; pins accurate within 50m; radius updates list.

## 5. Business Detail View (P0)
- Features: gallery, services, staff, hours, location, reviews summary, book button.
- AC: All sections render; book redirects to flow; phone/map links work.

## 6. Service Categories (P0)
- Features: tree of categories (Hair, Nails, Spa...), sub-services.
- AC: Categories seed-loaded; selecting filters businesses.

## 7. Booking Flow (P0)
- Features: select service, staff, date, slot, client info, confirm.
- AC: No double booking; confirmation screen + notification; slot locked.

## 8. Appointment Management (P0)
- Features: list upcoming/past, reschedule, cancel, reminders.
- AC: Client sees status; cancel updates availability; provider notified.

## 9. Favorites (P1)
- Features: save business/service, view list.
- AC: Persists per user; remove works; guest blocked.

## 10. User Profile (P1)
- Features: name, phone, addresses, payment methods, preferences.
- AC: Edits save; validation on phone; GDPR delete available.

## 11. Availability & Slot Computation (P0)
- Features: provider hours, service duration, breaks, buffer; generate slots.
- AC: Slots exclude booked; respect timezone; recompute on change.

## 12. Shared Types & Design System (P0)
- Features: TS types, UI kit (buttons, cards), color/type tokens.
- AC: Used across apps; documented; lint passes.

## 13. Reviews & Ratings (P1)
- Features: post-visit review, star + text, helpful votes.
- AC: Only visited users; avg updates; abuse report.

## 14. Payment Integration (P1)
- Features: Stripe/PCI, save card, charge on book, refund.
- AC: Success/fail handled; receipt sent; provider payout queued.

## 15. Notifications (P0/P1)
- Features: push/email/SMS for book, cancel, reminder.
- AC: Sent via job; user opts out; delivery logged.

## 16. Provider / Business Owner Portal (P0/P1)
- Features: manage profile, services, staff, hours, bookings, payouts.
- AC: Provider sees only own data; edits reflect in app; dashboard stats.

## 17. Admin Dashboard (P1)
- Features: users, businesses, categories, disputes, metrics.
- AC: Admin-only; suspend business; view KPIs.

## 18. Background Jobs (BullMQ) (P1)
- Features: reminders, payouts, image resize, slot sync.
- AC: Jobs retry; failed logged; dashboard monitors.

---
**Out of scope:** Real-time video, multi-language v1, loyalty program (P2).