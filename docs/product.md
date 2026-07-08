# Planity Clone – Product Specification

## Overview
Planity Clone is a mobile-first platform connecting clients with beauty & wellness businesses (salons, spas, barbers). It allows browsing, discovering, booking appointments, and managing them, plus provider and admin management.

## Goals
- Enable seamless booking experience.
- Empower business owners to manage slots and services.
- Provide admins oversight.

## Feature Specifications

### 1. User Authentication
**Priority:** P0
**Description:** Users can sign up, log in, logout, password reset via email/phone. Social login (Google/Apple) optional.
**Acceptance Criteria:**
- AC1: User can register with email+password; receives verification email.
- AC2: User can log in with valid credentials; session persisted.
- AC3: Invalid credentials show error.
- AC4: Password reset flow sends email with link.
- AC5: Social login returns token and creates account if new.

### 2. Guest Browse & Explore
**Priority:** P0
**Description:** Non-authenticated users can browse businesses, categories, and view details.
**Acceptance Criteria:**
- AC1: Guest can open app and see featured businesses.
- AC2: Guest can view business detail and services but booking prompts login.
- AC3: Guest session does not persist favorites.

### 3. Business Search & Discovery
**Priority:** P0
**Description:** Search by name, service, or category with filters (distance, rating, price).
**Acceptance Criteria:**
- AC1: Search returns relevant businesses with debounce.
- AC2: Filters apply correctly and update list.
- AC3: Empty state shown when no results.

### 4. Map-based Search
**Priority:** P1
**Description:** Display businesses on map with pins; tap pin shows preview.
**Acceptance Criteria:**
- AC1: Map shows pins within current viewport.
- AC2: User can move map to reload results (or button).
- AC3: Tap pin opens business preview sheet.

### 5. Business Detail View
**Priority:** P0
**Description:** Shows info: name, photos, address, hours, services, staff, reviews.
**Acceptance Criteria:**
- AC1: Displays all required fields.
- AC2: Services list expandable with prices/durations.
- AC3: `Book` CTA visible.

### 6. Service Categories
**Priority:** P0
**Description:** Hierarchical categories (e.g., Hair > Coloring). Used for browsing and filtering.
**Acceptance Criteria:**
- AC1: Categories seeded and displayed in nav.
- AC2: Selecting category lists businesses offering it.
- AC3: Admin can manage categories.

### 7. Booking Flow
**Priority:** P0
**Description:** Multi-step: select service, staff, date, slot, confirm, pay.
**Acceptance Criteria:**
- AC1: Only available slots shown based on availability engine.
- AC2: User can change steps before confirm.
- AC3: On confirm, appointment created and notification sent.
- AC4: Payment step integrated (if required).

### 8. Appointment Management
**Priority:** P0
**Description:** User views upcoming/past appointments, reschedule, cancel.
**Acceptance Criteria:**
- AC1: List shows status (confirmed, cancelled, completed).
- AC2: Reschedule opens slot picker with same rules.
- AC3: Cancel respects business policy (free within X hours).
- AC4: Provider sees same in portal.

### 9. Favorites
**Priority:** P1
**Description:** Users can favorite businesses/services.
**Acceptance Criteria:**
- AC1: Heart icon toggles state; persisted per user.
- AC2: Favorites list accessible from profile.
- AC3: Removing updates UI.

### 10. User Profile
**Priority:** P1
**Description:** Edit name, phone, preferences, view appointments, payment methods.
**Acceptance Criteria:**
- AC1: User can update profile fields with validation.
- AC2: Shows saved payment methods (masked).
- AC3: Delete account option with confirmation.

### 11. Availability & Slot Computation
**Priority:** P0
**Description:** Engine computes slots from business hours, service duration, staff shifts, existing bookings.
**Acceptance Criteria:**
- AC1: Generates slots at configurable intervals (e.g., 15 min).
- AC2: Excludes breaks and booked times.
- AC3: Handles multiple staff and concurrent capacity.
- AC4: Timezone aware.

### 12. Shared Types & Design System
**Priority:** P0
**Description:** Common TypeScript types, UI components (buttons, cards, inputs) for consistency.
**Acceptance Criteria:**
- AC1: Repository has /shared types used across frontend/backend.
- AC2: Component library documented (Storybook).
- AC3: Themes (light/dark) applied.

### 13. Reviews & Ratings
**Priority:** P1
**Description:** Users rate after completed appointment; display aggregate.
**Acceptance Criteria:**
- AC1: Only verified appointments can review.
- AC2: Star rating (1-5) and text optional.
- AC3: Business detail shows average and recent reviews.
- AC4: Moderation by admin for inappropriate content.

### 14. Payment Integration
**Priority:** P0
**Description:** Stripe/Apple Pay for deposits or full payment.
**Acceptance Criteria:**
- AC1: Secure checkout with PCI compliance via Stripe.
- AC2: Handles success/failure webhooks.
- AC3: Refund initiated from admin/provider.
- AC4: Receipt emailed.

### 15. Notifications
**Priority:** P1
**Description:** Push (Firebase) and email for booking confirm, remind, cancel.
**Acceptance Criteria:**
- AC1: User opts in for push; token stored.
- AC2: Triggered by events (booking created, 24h reminder).
- AC3: Email fallback if no push.

### 16. Provider / Business Owner Portal
**Priority:** P0
**Description:** Web dashboard for businesses to manage profile, services, staff, availability, appointments, reviews.
**Acceptance Criteria:**
- AC1: Login as provider role.
- AC2: CRUD services, categories, staff.
- AC3: Set working hours and breaks.
- AC4: View calendar with appointments.
- AC5: Respond to reviews.

### 17. Admin Dashboard
**Priority:** P1
**Description:** Super admin manages users, businesses, categories, flags, payments.
**Acceptance Criteria:**
- AC1: Admin role with restricted access.
- AC2: Approve/reject business registrations.
- AC3: View analytics (bookings, revenue).
- AC4: Manage categories and global settings.

### 18. Background Jobs (BullMQ)
**Priority:** P1
**Description:** Queue for notifications, reminder emails, slot recalculation, webhook processing.
**Acceptance Criteria:**
- AC1: BullMQ queues defined (notify, reminder, cleanup).
- AC2: Failed jobs retried with backoff.
- AC3: Dashboard (Bull Board) for monitoring.
- AC4: Idempotent processing.

## Prioritization Summary
- P0: Auth, Guest, Search, Detail, Categories, Booking, Appointment, Availability, Shared Types, Payment, Provider Portal.
- P1: Map Search, Favorites, Profile, Reviews, Notifications, Admin, Background Jobs.

## Out of Scope
- Real-time video consultation.
- Multi-language support (future).