# Planity Clone — Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specs and acceptance criteria for a Planity-style beauty & wellness booking marketplace (client apps + provider portal + admin + jobs).

## Priorities
- P0 (MVP): User Authentication, Guest Browse, Business Search, Map Search, Business Detail, Categories, Booking Flow, Appointment Mgmt, Availability/Slots, Shared Types/Design, Notifications (basic), Provider Portal (core).
- P1: Favorites, Reviews & Ratings, Payment Integration, User Profile, Admin Dashboard, Background Jobs.
- P2: Advanced notifications, provider analytics, admin moderation tools.

## 1. User Authentication (P0)
- Features: email/password signup/login, social login (Google/Apple), OTP phone verify, password reset, JWT refresh.
- AC: User can register in <2 min; invalid email rejected; token persists session; logout clears secure storage.

## 2. Guest Browse & Explore (P0)
- Features: home feed of featured businesses, trending categories, no account required.
- AC: Guest sees 10+ businesses; tapping opens detail; prompted to login only at booking.

## 3. Business Search & Discovery (P0)
- Features: text search, filter by category, price, rating, distance.
- AC: Query returns relevant results <1s; empty state shown when no match.

## 4. Map-based Search (P0)
- Features: Google Maps view, pins for businesses, radius slider.
- AC: Map loads with user location; pins reflect filters; tap pin opens preview.

## 5. Business Detail View (P0)
- Features: gallery, services list, staff, hours, reviews summary, book button.
- AC: All sections render; services show price/duration; CTA initiates booking.

## 6. Service Categories (P0)
- Features: tree of categories (Hair, Nails, Spa…), sub-categories.
- AC: Categories seeded; navigation updates listing; counts shown.

## 7. Booking Flow (P0)
- Features: select service, staff, date, slot, confirm, guest→login if needed.
- AC: No double booking; confirmation screen + notification sent; slot locked.

## 8. Appointment Management (P0)
- Features: list upcoming/past, reschedule, cancel (policy), reminders.
- AC: User sees status; cancel respects rules; provider updated.

## 9. Favorites (P1)
- Features: save business/service, view list, remove.
- AC: Persists across sessions; heart toggles state.

## 10. User Profile (P1)
- Features: edit name, photo, addresses, payment methods, preferences.
- AC: Changes save; validation on fields.

## 11. Availability & Slot Computation (P0)
- Features: provider hours, service duration, breaks, buffer, existing appts.
- AC: Slots computed correctly; no overlap; timezone safe.

## 12. Shared Types & Design System (P0)
- Features: TS types, UI kit (colors, buttons, inputs), API contracts.
- AC: Used by all modules; documented in Storybook.

## 13. Reviews & Ratings (P1)
- Features: post-visit review, star + text, helpful votes, owner reply.
- AC: Only verified visits; avg rating updates; abuse flag.

## 14. Payment Integration (P1)
- Features: Stripe/Card, wallet, partial deposit, refund.
- AC: Charge succeeds; failure handled; receipt emailed.

## 15. Notifications (P0/P1)
- Features: push (FCM), email, SMS for booking, reminder, cancel.
- AC: Sent within 1 min; user can opt out; templates centralized.

## 16. Provider / Business Owner Portal (P0/P1)
- Features: dashboard, manage services, staff, hours, bookings, payouts.
- AC: Owner edits live; sees new bookings; can block slots.

## 17. Admin Dashboard (P1)
- Features: users, businesses, categories, reports, moderation.
- AC: Admin can suspend business; view metrics; export CSV.

## 18. Background Jobs (BullMQ) (P1)
- Features: reminder sender, slot cleanup, report gen, webhook retries.
- AC: Jobs queued; retries on fail; dashboard monitors.

---
**Notes:** Mobile-first; GDPR/PII compliant; API-first with shared types.