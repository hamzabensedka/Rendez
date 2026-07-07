# Planity Clone - Product Specification

**Author:** Alex (Product Owner)
**Goal:** Define complete feature specifications and acceptance criteria for Planity Clone, ensuring all user needs are captured and prioritized.

## Overview
Planity Clone is a mobile-first platform connecting clients with beauty and wellness businesses (salons, barbers, spas). It supports guest browsing, authenticated booking, provider management, and admin oversight.

## Feature Priorities
- P0: Must-have for MVP
- P1: Important for post-MVP / early iteration
- P2: Nice-to-have

## Features

### 1. User Authentication
**Priority:** P0
**Description:** Secure sign-up/login for clients via email, phone (OTP), and social providers.
**User Needs:** Clients want to save personal data, manage bookings, and pay securely.
**Acceptance Criteria:**
- AC1: User can register with email+password; receives verification email.
- AC2: User can log in with phone number and OTP within 5 minutes.
- AC3: JWT token stored securely; session persists across app restarts.
- AC4: Password reset flow works via email link.
- AC5: Social login (Google/Apple) returns valid profile.

### 2. Guest Browse & Explore
**Priority:** P0
**Description:** Non-authenticated users can explore businesses and services.
**User Needs:** Users want to check offerings before committing to sign-up.
**Acceptance Criteria:**
- AC1: Guest can view home feed of featured businesses.
- AC2: Guest can open business detail and service lists but cannot book.
- AC3: Prompt to login appears when guest taps Book.

### 3. Business Search & Discovery
**Priority:** P0
**Description:** Search businesses by name, category, or keyword.
**User Needs:** Find relevant salon/spa quickly.
**Acceptance Criteria:**
- AC1: Search returns results matching name or service tags.
- AC2: Filters for category, price range, rating applied correctly.
- AC3: Empty state shown when no results.

### 4. Map-based Search
**Priority:** P1
**Description:** View businesses on interactive map with geolocation.
**User Needs:** Discover nearby places visually.
**Acceptance Criteria:**
- AC1: Map shows pins for businesses within radius.
- AC2: Tapping pin opens mini business card.
- AC3: User can adjust radius (1-20 km) and see updated results.

### 5. Business Detail View
**Priority:** P0
**Description:** Comprehensive page with info, services, staff, reviews.
**User Needs:** Evaluate business before booking.
**Acceptance Criteria:**
- AC1: Displays cover image, address, hours, contact.
- AC2: Lists services with durations and prices.
- AC3: Shows aggregate rating and recent reviews.
- AC4: Book button initiates booking flow.

### 6. Service Categories
**Priority:** P1
**Description:** Taxonomy of beauty/wellness services (Hair, Nails, Massage...).
**User Needs:** Browse by category.
**Acceptance Criteria:**
- AC1: Categories seeded and editable via admin.
- AC2: Each business maps to 1 or more categories.
- AC3: Category landing page lists businesses.

### 7. Booking Flow
**Priority:** P0
**Description:** Multi-step flow: select service -> staff -> slot -> confirm.
**User Needs:** Easy, transparent reservation.
**Acceptance Criteria:**
- AC1: User selects service and optional staff.
- AC2: Available slots computed from availability logic.
- AC3: Summary shows price, time, business.
- AC4: On confirm, appointment created and notification sent.

### 8. Appointment Management
**Priority:** P0
**Description:** View upcoming/past appointments, cancel/reschedule.
**User Needs:** Control their bookings.
**Acceptance Criteria:**
- AC1: List shows status (confirmed, cancelled, completed).
- AC2: User can cancel at least 2h before with free or fee logic.
- AC3: Reschedule opens booking flow with prior context.

### 9. Favorites
**Priority:** P1
**Description:** Save businesses or services.
**User Needs:** Quick access to preferred places.
**Acceptance Criteria:**
- AC1: Heart icon toggles favorite state.
- AC2: Favorites list accessible from profile.
- AC3: Synced across devices after login.

### 10. User Profile
**Priority:** P1
**Description:** Manage personal info, payment methods, notifications pref.
**User Needs:** Self-service account control.
**Acceptance Criteria:**
- AC1: Edit name, phone, avatar.
- AC2: View saved addresses.
- AC3: Toggle push/email notifications.

### 11. Availability & Slot Computation
**Priority:** P0
**Description:** Backend logic generating bookable slots from business hours, staff shifts, service duration, and existing appointments.
**User Needs:** Accurate real-time availability.
**Acceptance Criteria:**
- AC1: Excludes past times and breaks.
- AC2: Considers service duration and buffer.
- AC3: Handles multiple staff with overlapping shifts.
- AC4: Updates within 1s after new booking.

### 12. Shared Types & Design System
**Priority:** P1
**Description:** Common TypeScript types, UI components, color palette, typography.
**User Needs:** Consistent UX.
**Acceptance Criteria:**
- AC1: Design tokens documented (Figma + code).
- AC2: Reusable Button, Card, Input components.
- AC3: Shared API contract types used frontend/backend.

### 13. Reviews & Ratings
**Priority:** P1
**Description:** Clients rate and review after completed appointment.
**User Needs:** Trust via social proof.
**Acceptance Criteria:**
- AC1: Only verified clients can post review.
- AC2: Star rating 1-5 and text optional.
- AC3: Business detail shows average and count.
- AC4: Inappropriate content flaggable.

### 14. Payment Integration
**Priority:** P0
**Description:** Stripe/Apple Pay for deposits or full prepaid.
**User Needs:** Secure, frictionless payment.
**Acceptance Criteria:**
- AC1: Add card via Stripe Elements.
- AC2: Charge or hold authorized on booking.
- AC3: Refund triggered on cancellation per policy.
- AC4: Payment failures handled gracefully.

### 15. Notifications
**Priority:** P0
**Description:** Push (Firebase) and email for booking confirm, remind, cancel.
**User Needs:** Timely updates.
**Acceptance Criteria:**
- AC1: Confirmation sent immediately after booking.
- AC2: Reminder 24h before appointment.
- AC3: User can opt-out per channel.

### 16. Provider / Business Owner Portal
**Priority:** P1
**Description:** Web dashboard for businesses to manage profile, services, staff, availability, appointments.
**User Needs:** Control their listing and operations.
**Acceptance Criteria:**
- AC1: Owner logs in with business account.
- AC2: CRUD services, staff, working hours.
- AC3: View day/week calendar of bookings.
- AC4: Accept/decline pending appointments (if enabled).

### 17. Admin Dashboard
**Priority:** P1
**Description:** Super-admin manages categories, users, businesses, moderation.
**User Needs:** Platform governance.
**Acceptance Criteria:**
- AC1: Approve/reject business registrations.
- AC2: Disable users or content violating policies.
- AC3: View platform metrics (MAU, bookings).

### 18. Background Jobs (BullMQ)
**Priority:** P0
**Description:** Queue-based workers for notifications, slot recompute, analytics.
**User Needs:** Reliable async processing.
**Acceptance Criteria:**
- AC1: Job for sending reminders scheduled and retried on fail.
- AC2: Slot cache invalidation triggered on appointment change.
- AC3: Dead-letter queue captures stuck jobs.
- AC4: Dashboard monitors queue health.

## Summary of Priorities
- P0: Auth, Guest, Search, Business Detail, Booking, Appointment, Availability, Payment, Notifications, Background Jobs.
- P1: Map, Categories, Favorites, Profile, Shared Types, Reviews, Provider Portal, Admin.
- P2: None specified, future expansions.

## Success Metrics
- 80% booking completion rate.
- Less than 2% payment failure.
- 4.5+ avg app store rating.
