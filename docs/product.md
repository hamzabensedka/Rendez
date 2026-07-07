# Planity Clone - Product Specification

## Overview
Planity Clone is a mobile-first platform connecting clients with beauty & wellness businesses (salons, barbers, spas). It enables discovery, booking, payments, and management for clients, business owners, and admins.

## Goals
- Simplify appointment booking for end users.
- Empower businesses to manage slots and services.
- Provide admins oversight and platform control.

## User Roles
- Client (end user)
- Business Owner / Provider
- Admin
- Guest (unauthenticated)

## Feature Specifications

### 1. User Authentication
**Priority:** P0
**Description:** Secure signup/login via email, phone OTP, and social providers.
**Acceptance Criteria:**
- User can register with email and password; email verification required.
- User can login with phone OTP (SMS).
- Social login (Google/Apple) returns valid session.
- Password reset flow works.
- JWT or session token stored securely on device.
- Unauthorized API calls return 401.

### 2. Guest Browse & Explore
**Priority:** P0
**Description:** Unauthenticated users can explore businesses and services.
**Acceptance Criteria:**
- Guest can view home feed of featured businesses.
- Guest can view business detail and services but cannot book.
- Prompt to login appears when attempting booking.
- Guest state persists via local storage.

### 3. Business Search & Discovery
**Priority:** P0
**Description:** Search businesses by name, category, or keyword.
**Acceptance Criteria:**
- Search returns relevant results with debounce.
- Filters by category, price range, rating.
- Empty state shown when no results.
- Recent searches saved for logged-in users.

### 4. Map-based Search
**Priority:** P1
**Description:** View businesses on an interactive map with geolocation.
**Acceptance Criteria:**
- Map shows pins for businesses within viewport.
- User can enable location permission to center map.
- Tapping pin opens business preview card.
- List/map toggle works seamlessly.

### 5. Business Detail View
**Priority:** P0
**Description:** Comprehensive page showing business info, services, staff, reviews.
**Acceptance Criteria:**
- Displays cover image, address, hours, contact.
- Lists services with durations and prices.
- Shows staff members if applicable.
- Shows aggregate rating and recent reviews.
- "Book" CTA initiates booking flow.

### 6. Service Categories
**Priority:** P0
**Description:** Hierarchical taxonomy of services (e.g., Hair > Coloring).
**Acceptance Criteria:**
- Categories seeded from admin or migration.
- Businesses assign services to leaf categories.
- Clients browse by category from home.
- Search filters by category id.

### 7. Booking Flow
**Priority:** P0
**Description:** Multi-step flow: select service, staff, date, slot, confirm.
**Acceptance Criteria:**
- User selects service(s) and optional staff.
- Available slots computed from availability logic.
- User picks date and time; conflict detection prevents double booking.
- Summary screen shows price and duration.
- On confirm, appointment created with status pending payment (if required).
- Guest redirected to login/signup before confirmation.

### 8. Appointment Management
**Priority:** P0
**Description:** Clients view upcoming/past appointments; can reschedule/cancel.
**Acceptance Criteria:**
- List grouped by upcoming/past.
- Cancel allowed up to business policy (e.g., 24h).
- Reschedule opens booking flow with preselected business.
- Push/email confirmation received.
- Calendar sync (optional P1) exports .ics.

### 9. Favorites
**Priority:** P1
**Description:** Users bookmark businesses or services.
**Acceptance Criteria:**
- Heart icon toggles favorite on detail view.
- Favorites list accessible from profile.
- Favorites persist across devices for logged-in users.
- Guest favorites stored locally until login then merged.

### 10. User Profile
**Priority:** P0
**Description:** Manage personal info, payment methods, notifications settings.
**Acceptance Criteria:**
- Edit name, phone, avatar.
- View saved addresses.
- Manage notification preferences (push/email/SMS).
- Delete account with confirmation and GDPR compliance.

### 11. Availability & Slot Computation
**Priority:** P0
**Description:** Backend logic computing open slots based on business hours, staff shifts, existing bookings, and service duration.
**Acceptance Criteria:**
- Respects business weekly schedule and breaks.
- Considers staff assigned or any staff.
- Excludes slots overlapping existing appointments.
- Returns slots in configurable increments (e.g., 15 min).
- Handles timezones correctly (store UTC, display local).

### 12. Shared Types & Design System
**Priority:** P0
**Description:** Common TypeScript types, UI components, and style guide used across apps.
**Acceptance Criteria:**
- Monorepo package exports types (User, Business, Appointment, etc.).
- Component library includes Button, Card, Input, Modal, BottomSheet.
- Theme tokens (colors, spacing) defined and used.
- Accessibility (contrast, min tap target) met.

### 13. Reviews & Ratings
**Priority:** P1
**Description:** Clients rate and review after completed appointments.
**Acceptance Criteria:**
- Only users with completed appointment can review.
- Star rating 1-5 and text optional.
- Business can respond to reviews (P2).
- Average rating recalculated on new review.
- Inappropriate content flagged to admin.

### 14. Payment Integration
**Priority:** P0
**Description:** Secure payments via Stripe (or similar) for bookings.
**Acceptance Criteria:**
- Client adds card; PCI-compliant via Stripe Elements.
- Deposit or full payment captured per business setting.
- Refund triggered on cancellation per policy.
- Payment failure handled with retry.
- Receipt emailed and shown in appointment.

### 15. Notifications
**Priority:** P1
**Description:** Push (Firebase/APNs), email, SMS for booking events.
**Acceptance Criteria:**
- Appointment confirmed: push + email.
- Reminder 24h before: push.
- Cancellation/Reschedule: push + email.
- User can opt out per channel.
- Provider receives new booking alert.

### 16. Provider / Business Owner Portal
**Priority:** P0
**Description:** Web dashboard for businesses to manage profile, services, staff, availability, bookings.
**Acceptance Criteria:**
- Login as business role.
- Edit business info, photos, hours.
- CRUD services and assign categories.
- Manage staff and their schedules.
- View calendar of appointments, manually create/cancel.
- View basic analytics (bookings count, revenue).

### 17. Admin Dashboard
**Priority:** P1
**Description:** Super admin panel for platform oversight.
**Acceptance Criteria:**
- Manage users, businesses (approve/reject).
- Global categories management.
- View platform metrics (MAU, GMV).
- Handle reported reviews and disputes.
- Configure feature flags.

### 18. Background Jobs (BullMQ)
**Priority:** P1
**Description:** Queue-based processing for async tasks.
**Acceptance Criteria:**
- Job types: send reminders, sync calendars, generate reports, process refunds.
- Failed jobs retried with exponential backoff.
- Queue dashboard (Bull Board) for monitoring.
- Idempotent job handlers.
- Graceful shutdown on deploy.

## Prioritization Summary
- P0 (MVP): Auth, Guest Browse, Search, Business Detail, Categories, Booking, Appointment Mgmt, Profile, Availability, Shared Types, Payment, Provider Portal.
- P1: Map Search, Favorites, Reviews, Notifications, Admin, Background Jobs.
- P2: Advanced provider tools, review responses, calendar sync.

## Success Metrics
- Booking conversion rate > 20% from detail view.
- Average slot computation latency < 200ms.
- Crash-free sessions > 99%.