# Planity Clone — Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specs and acceptance criteria for a Planity-style beauty & wellness booking marketplace (client apps + provider portal + admin + jobs).

## Priorities
- P0 (MVP): User Authentication, Guest Browse, Business Search, Map Search, Business Detail, Service Categories, Booking Flow, Appointment Management, Availability & Slot Computation, Shared Types & Design System, Notifications (basic), Provider Portal (core), Background Jobs (core).
- P1: Favorites, Reviews & Ratings, Payment Integration, User Profile, Admin Dashboard, Map enhancements.
- P2: Advanced notifications, analytics, promotions.

## 1. User Authentication (P0)
- Sign up (email/phone), login, logout, password reset.
- OAuth: Google/Apple.
- Role: customer, provider, admin.
**AC:**
1. User can register with verified email/phone.
2. Invalid creds show error.
3. JWT stored securely; session persists.
4. Roles route to correct app section.

## 2. Guest Browse & Explore (P0)
- Guests view categories, featured businesses, city landing.
- No booking allowed; prompt login.
**AC:**
1. Guest sees home without auth.
2. Tap book → login modal.

## 3. Business Search & Discovery (P0)
- Text search by name, service, location.
- Filters: category, price, rating, distance.
**AC:**
1. Results < 500ms for 10k businesses.
2. Filters combine correctly.

## 4. Map-based Search (P1)
- Show pins; move map updates results.
- Tap pin → preview card.
**AC:**
1. Map pan triggers debounced search.
2. Pins reflect filters.

## 5. Business Detail View (P0)
- Gallery, services, staff, hours, reviews, book button.
**AC:**
1. Loads in <1s.
2. Shows real-time slots.

## 6. Service Categories (P0)
- Tree: Hair, Nails, Spa, etc.
**AC:**
1. Categories seeded.
2. Business maps to leaf categories.

## 7. Booking Flow (P0)
- Select service → staff → slot → confirm.
**AC:**
1. No double booking.
2. Confirmation notification sent.

## 8. Appointment Management (P0)
- List upcoming/past; cancel/reschedule.
**AC:**
1. Cancel frees slot.
2. User gets notified.

## 9. Favorites (P1)
- Save businesses/services.
**AC:**
1. Sync across devices.
2. Easy remove.

## 10. User Profile (P1)
- Edit name, photo, addresses, payment methods.
**AC:**
1. Changes persist.
2. GDPR delete available.

## 11. Availability & Slot Computation (P0)
- Provider sets hours; system computes free slots minus appointments.
**AC:**
1. Correct across timezones.
2. Buffer respected.

## 12. Shared Types & Design System (P0)
- TS types, UI kit, colors, components.
**AC:**
1. Used by all apps.
2. Documented.

## 13. Reviews & Ratings (P1)
- Post-visit review; avg shown.
**AC:**
1. One review per visit.
2. Abuse report.

## 14. Payment Integration (P1)
- Stripe; deposit/full; refund.
**AC:**
1. PCI compliant.
2. Failure handled.

## 15. Notifications (P0/P1)
- Email/push: confirm, remind, cancel.
**AC:**
1. Opt-in respected.
2. Delivered <1min.

## 16. Provider / Business Owner Portal (P0)
- Manage profile, services, staff, hours, bookings.
**AC:**
1. Live calendar.
2. Pause bookings.

## 17. Admin Dashboard (P1)
- Users, businesses, disputes, config.
**AC:**
1. Role-restricted.
2. Audit log.

## 18. Background Jobs (BullMQ) (P0)
- Reminders, slot cleanup, emails.
**AC:**
1. Retry on fail.
2. Monitorable.
