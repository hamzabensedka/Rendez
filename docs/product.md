# Planity Clone - Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting clients with beauty and wellness businesses for discovery, booking, and management. It includes consumer app, provider portal, and admin dashboard, supported by background jobs.

## 2. Personas
- Client: searches, books, manages appointments.
- Business Owner: manages profile, services, availability, appointments.
- Admin: oversees platform, users, businesses, content.

## 3. Feature Specifications

### 3.1 User Authentication (P0)
- Sign up and login via email, phone OTP, and social (Google/Apple).
- JWT-based sessions with refresh token.
- Password reset flow.
Acceptance Criteria:
- AC1: User can register with valid email and password; receives verification.
- AC2: Invalid credentials show error.
- AC3: OTP login sends code and verifies within 5 minutes.
- AC4: Session persists across app restarts via secure storage.

### 3.2 Guest Browse and Explore (P0)
- Non-logged users can browse businesses and services.
- Prompt to login only when booking or saving.
Acceptance Criteria:
- AC1: Guest sees home feed with featured businesses.
- AC2: Attempting booking redirects to auth.

### 3.3 Business Search and Discovery (P0)
- Search by name, category, or keyword.
- Filters: location, price, rating, availability.
Acceptance Criteria:
- AC1: Search returns relevant results in under 1 second.
- AC2: Filters combine correctly.
- AC3: Empty state shown when no results.

### 3.4 Map-based Search (P1)
- Display businesses on interactive map with pins.
- Tap pin shows mini detail; navigate to detail.
Acceptance Criteria:
- AC1: Map loads with user location permission.
- AC2: Pins reflect current filters.
- AC3: Clustering for dense areas.

### 3.5 Business Detail View (P0)
- Shows cover image, info, services, staff, reviews, availability.
- Actions: Book, Call, Favorite, Share.
Acceptance Criteria:
- AC1: All data loads reliably.
- AC2: Book button initiates booking flow.
- AC3: Shows next available slot.

### 3.6 Service Categories (P0)
- Tree of categories (Hair, Nails, Spa) and sub-services.
- Acceptance Criteria:
- AC1: Categories seeded and editable by admin.
- AC2: Each service linked to duration and price.
- AC3: Business can assign categories.

### 3.7 Booking Flow (P0)
- Select service, staff optional, date, slot, confirm.
- Multi-service support.
Acceptance Criteria:
- AC1: Only available slots shown.
- AC2: Price calculated correctly.
- AC3: Confirmation screen with summary.
- AC4: Creates appointment and notifies provider.

### 3.8 Appointment Management (P0)
- Client views upcoming and past appointments.
- Reschedule or cancel with rules (e.g., 24h).
- Provider can confirm or decline.
Acceptance Criteria:
- AC1: List updates in real-time.
- AC2: Cancellation triggers refund if applicable.
- AC3: Reminder sent 24h before.

### 3.9 Favorites (P1)
- Save businesses or services.
- Dedicated tab.
Acceptance Criteria:
- AC1: Save toggles state.
- AC2: Persists across devices.

### 3.10 User Profile (P0)
- Edit name, photo, contact, payment methods.
- View history.
Acceptance Criteria:
- AC1: Changes persist.
- AC2: GDPR delete option.

### 3.11 Availability and Slot Computation (P0)
- Provider sets working hours, breaks, holidays, service durations.
- System computes free slots per service and staff.
Acceptance Criteria:
- AC1: No double-booking.
- AC2: Timezone aware.
- AC3: Handles concurrent requests.

### 3.12 Shared Types and Design System (P0)
- Common TS types, UI components (buttons, cards, colors).
Acceptance Criteria:
- AC1: Single source of truth in repo.
- AC2: Components documented.
- AC3: Accessibility compliant.

### 3.13 Reviews and Ratings (P1)
- Client leaves star rating and text after completed appointment.
- Business replies.
Acceptance Criteria:
- AC1: Only verified visits can review.
- AC2: Average rating computed.
- AC3: Moderation by admin for abuse.

### 3.14 Payment Integration (P0)
- Stripe, Apple Pay, Google Pay.
- Deposit or full payment.
Acceptance Criteria:
- AC1: PCI compliant.
- AC2: Failed payment handled.
- AC3: Refund automated via job.

### 3.15 Notifications (P0)
- Push (FCM/APNs), email, SMS.
- Events: booking, reminder, promo.
Acceptance Criteria:
- AC1: User can opt-out.
- AC2: Delivered within 1 min for critical.
- AC3: Templates centralized.

### 3.16 Provider / Business Owner Portal (P1)
- Web dashboard to manage profile, services, staff, slots, appointments, analytics.
Acceptance Criteria:
- AC1: Role-based access.
- AC2: Real-time updates.
- AC3: Export data CSV.

### 3.17 Admin Dashboard (P1)
- Manage users, businesses, categories, reviews, payments.
- Impersonate, suspend.
Acceptance Criteria:
- AC1: Secure admin login.
- AC2: Audit log.
- AC3: Dashboard metrics.

### 3.18 Background Jobs (BullMQ) (P0)
- Queue for reminders, slot cleanup, refund, sync.
Acceptance Criteria:
- AC1: Jobs retry with backoff.
- AC2: Failed jobs logged.
- AC3: Idempotent processing.

## 4. Prioritization Summary
- P0 (MVP): User Authentication, Guest Browse, Business Search, Business Detail, Service Categories, Booking Flow, Appointment Management, User Profile, Availability, Shared Types, Payment, Notifications, Background Jobs.
- P1: Map-based Search, Favorites, Reviews, Provider Portal, Admin Dashboard.
- P2: Future loyalty, multi-location (out of scope).

## 5. Success Metrics
- Booking conversion >20%
- Repeat usage >40%
- Provider retention >80%