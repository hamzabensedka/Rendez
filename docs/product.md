# Planity Clone - Product Specification

**Owner:** Alex (Product Owner)
**Version:** 1.0
**Goal:** Build a mobile-first marketplace for salon/spa booking (clone of Planity) connecting clients, businesses, and admins.

## Priorities
- P0: Must-have for MVP
- P1: Important post-MVP
- P2: Nice-to-have / later

## 1. User Authentication
**Description:** Secure signup/login for clients via email, phone OTP, Google/Apple.
**User Story:** As a client, I want to register and login so I can book appointments.
**Acceptance Criteria:**
- AC1: User can sign up with email+password, verified via OTP.
- AC2: Social login (Google/Apple) returns JWT.
- AC3: Password reset flow works.
- AC4: Token refresh implemented.
**Priority:** P0

## 2. Guest Browse & Explore
**Description:** Non-logged users can browse businesses and services.
**AC:**
- AC1: Guest can view home feed of featured businesses.
- AC2: Guest redirected to login when attempting booking.
**Priority:** P0

## 3. Business Search & Discovery
**Description:** Search by name, category, filters (price, rating, distance).
**AC:**
- AC1: Text search returns relevant businesses.
- AC2: Filters apply correctly and persist in state.
**Priority:** P0

## 4. Map-based Search
**Description:** Show businesses on map with geolocation.
**AC:**
- AC1: Map displays pins within viewport.
- AC2: Tap pin opens business preview sheet.
- AC3: Search this area updates results.
**Priority:** P1

## 5. Business Detail View
**Description:** Show info: gallery, services, staff, hours, reviews.
**AC:**
- AC1: Displays business profile, list of services with prices/durations.
- AC2: Shows available slots for selected service.
- AC3: Deep link to booking.
**Priority:** P0

## 6. Service Categories
**Description:** Taxonomy of services (Hair, Nails, Spa).
**AC:**
- AC1: Categories seeded and assignable to businesses.
- AC2: Category landing page lists businesses.
**Priority:** P0

## 7. Booking Flow
**Description:** Multi-step: select service -> staff -> slot -> confirm -> pay.
**AC:**
- AC1: User can complete booking in under 5 steps.
- AC2: Validation prevents double booking.
- AC3: Confirmation screen + notification sent.
**Priority:** P0

## 8. Appointment Management
**Description:** Client views upcoming/past appointments, reschedule/cancel.
**AC:**
- AC1: List with status filters.
- AC2: Cancel respects business policy (free within 24h).
- AC3: Reschedule opens slot picker.
**Priority:** P0

## 9. Favorites
**Description:** Save businesses/services.
**AC:**
- AC1: Heart icon toggles favorite.
- AC2: Favorites list in profile.
**Priority:** P1

## 10. User Profile
**Description:** Manage personal info, payment methods, addresses.
**AC:**
- AC1: Edit name, phone, avatar.
- AC2: View booking history.
**Priority:** P0

## 11. Availability & Slot Computation
**Description:** Compute free slots based on business hours, service duration, staff schedule, existing bookings.
**AC:**
- AC1: Engine returns slots in 15-min increments.
- AC2: Handles recurring closures and breaks.
- AC3: Timezone aware.
**Priority:** P0

## 12. Shared Types & Design System
**Description:** Common TS types, UI components (buttons, cards, colors).
**AC:**
- AC1: Repo has shared/ with types and component library.
- AC2: Used across mobile and web.
**Priority:** P0

## 13. Reviews & Ratings
**Description:** Clients rate after appointment; display aggregated.
**AC:**
- AC1: 1-5 stars + text, editable within 30 days.
- AC2: Business detail shows average and count.
- AC3: Fraud prevention: only verified bookings.
**Priority:** P1

## 14. Payment Integration
**Description:** Stripe/Apple Pay for deposits/full payment.
**AC:**
- AC1: Secure checkout with PCI compliance.
- AC2: Refund/cancel triggers reversal.
- AC3: Invoice email sent.
**Priority:** P0

## 15. Notifications
**Description:** Push (Firebase), email, SMS for booking status, reminders.
**AC:**
- AC1: Opt-in preferences.
- AC2: 24h reminder sent via scheduled job.
- AC3: Localization supported.
**Priority:** P1

## 16. Provider / Business Owner Portal
**Description:** Web dashboard for businesses to manage profile, services, staff, availability, bookings.
**AC:**
- AC1: Auth as business role.
- AC2: CRUD services, staff, hours.
- AC3: View calendar and accept/decline bookings.
- AC4: Payouts overview.
**Priority:** P0

## 17. Admin Dashboard
**Description:** Super admin manages categories, users, businesses, disputes.
**AC:**
- AC1: Approve/reject business registrations.
- AC2: Disable accounts.
- AC3: View platform metrics.
**Priority:** P1

## 18. Background Jobs (BullMQ)
**Description:** Queue for notifications, slot recomputation, analytics.
**AC:**
- AC1: Job for reminder emails 24h before appointment.
- AC2: Retry/backoff on failure.
- AC3: Monitoring for queues.
**Priority:** P1

## Success Metrics
- 1000 bookings in first quarter.
- Under 3% double-booking rate.