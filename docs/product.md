# Planity Clone — Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specs and acceptance criteria for a Planity-style beauty & wellness booking marketplace (mobile-first web app + provider portal + admin).

## Priorities
- **P0 (MVP):** User Auth, Guest Browse, Search & Discovery, Map Search, Business Detail, Categories, Booking Flow, Availability/Slots, Appointment Mgmt, Favorites, Profile, Shared Types/Design, Notifications (basic), Provider Portal (core), Background Jobs (core).
- **P1:** Reviews & Ratings, Payment Integration, Admin Dashboard, Map enhancements, Provider portal full.
- **P2:** Advanced notifications, analytics, promos.

## 1. User Authentication (P0)
**Spec:** Email/phone signup, login, logout, password reset. JWT sessions. OAuth (Google/Apple) optional.
**AC:**
- User can register with email+password; receives verification.
- Login returns token; protected routes require it.
- Password reset email works.
- Invalid creds show error.

## 2. Guest Browse & Explore (P0)
**Spec:** Non-logged users can browse categories, businesses, and view details.
**AC:**
- Guest sees home with featured businesses.
- Guest can open detail but booking prompts login.

## 3. Business Search & Discovery (P0)
**Spec:** Text search by name, category, service. Filters: price, rating, distance.
**AC:**
- Search returns relevant results <1s.
- Filters apply correctly.

## 4. Map-based Search (P0)
**Spec:** Show businesses on map with clustering; tap pin → preview.
**AC:**
- Map loads with user location (permission).
- Pins reflect filters.

## 5. Business Detail View (P0)
**Spec:** Photos, services, staff, hours, reviews summary, book button.
**AC:**
- All sections render.
- Book redirects to flow.

## 6. Service Categories (P0)
**Spec:** Tree of categories (Hair, Nails…). Used in nav and search.
**AC:**
- Category list loads.
- Selecting filters businesses.

## 7. Booking Flow (P0)
**Spec:** Select service → staff → slot → confirm → pay (if P1) → success.
**AC:**
- Only available slots shown.
- Double-book prevented.
- Confirmation saved.

## 8. Appointment Management (P0)
**Spec:** List upcoming/past; cancel/reschedule.
**AC:**
- User sees appointments.
- Cancel updates availability.

## 9. Favorites (P0)
**Spec:** Save businesses; view list.
**AC:**
- Toggle works.
- Persists across sessions.

## 10. User Profile (P0)
**Spec:** Name, contact, payment methods, notifications prefs.
**AC:**
- Edit saves.
- Shows bookings count.

## 11. Availability & Slot Computation (P0)
**Spec:** Provider sets hours; system computes free slots minus booked.
**AC:**
- Slots generated per service duration.
- No overlap.

## 12. Shared Types & Design System (P0)
**Spec:** TS types, UI kit (colors, buttons). Used across apps.
**AC:**
- Components reused.
- Types documented.

## 13. Reviews & Ratings (P1)
**Spec:** Post-visit review; avg shown.
**AC:**
- Only visited users review.
- Displayed on detail.

## 14. Payment Integration (P1)
**Spec:** Stripe for cards; hold or charge.
**AC:**
- Payment succeeds/fails handled.
- Refund on cancel per policy.

## 15. Notifications (P0/P1)
**Spec:** Email/push for booking, reminder.
**AC:**
- Sent on events.
- User can opt out.

## 16. Provider / Business Owner Portal (P0/P1)
**Spec:** Manage profile, services, staff, hours, appointments.
**AC:**
- Provider logs in separately.
- Edits reflect on app.

## 17. Admin Dashboard (P1)
**Spec:** Manage users, providers, categories, flags.
**AC:**
- Admin can suspend.
- View metrics.

## 18. Background Jobs (BullMQ) (P0)
**Spec:** Queue for reminders, slot cleanup, emails.
**AC:**
- Jobs processed reliably.
- Failures retried.
