# Planity Clone – Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specifications and acceptance criteria for Planity Clone, a mobile-first platform to discover and book beauty & wellness services.

## Overview
Planity Clone connects clients with salons/spas. It supports guest browsing, authenticated booking, provider management, and admin oversight.

## Feature List & Specifications

### 1. User Authentication
- Description: Sign up/login via email, phone (OTP), and social (Google/Apple).
- Acceptance Criteria:
  - AC1: User can register with email+password; receives verification email.
  - AC2: User can log in via OTP sent to phone.
  - AC3: JWT token stored securely; session persists.
  - AC4: Password reset flow works.
- Priority: P0

### 2. Guest Browse & Explore
- Description: Non-logged-in users can explore featured businesses and categories.
- AC1: Guest sees home screen with curated lists.
- AC2: Guest can view business detail but booking prompts login.
- AC3: No personal data stored for guest.
- Priority: P0

### 3. Business Search & Discovery
- Description: Text search with filters (category, price, rating, distance).
- AC1: Search returns relevant businesses by name, service, or tag.
- AC2: Filters apply correctly and combine.
- AC3: Empty state shown when no results.
- Priority: P0

### 4. Map-based Search
- Description: Display businesses on map with geolocation.
- AC1: Map shows pins within viewport.
- AC2: Tapping pin opens mini business card.
- AC3: Search this area updates results.
- Priority: P0

### 5. Business Detail View
- Description: Full info: photos, services, staff, hours, reviews.
- AC1: Shows all services with prices/durations.
- AC2: Displays aggregate rating and review list.
- AC3: Book CTA initiates booking flow.
- Priority: P0

### 6. Service Categories
- Description: Taxonomy of services (Hair, Nails, Spa, etc.).
- AC1: Categories seeded and editable via admin.
- AC2: Each business maps to categories.
- AC3: Category landing page lists businesses.
- Priority: P0

### 7. Booking Flow
- Description: Multi-step: select service -> staff -> date/time -> confirm.
- AC1: Only available slots shown (from Availability feature).
- AC2: User can apply promo code.
- AC3: On confirm, appointment created and payment triggered.
- Priority: P0

### 8. Appointment Management
- Description: User views upcoming/past appointments, reschedules/cancels.
- AC1: List sorted by date.
- AC2: Cancel respects business policy (free within X hours).
- AC3: Reschedule opens booking with preselected service.
- Priority: P0

### 9. Favorites
- Description: Save businesses or services.
- AC1: Heart icon toggles favorite.
- AC2: Favorites list accessible from profile.
- AC3: Syncs across devices.
- Priority: P1

### 10. User Profile
- Description: Manage personal info, payment methods, notifications settings.
- AC1: Edit name, phone, avatar.
- AC2: Add/remove cards (tokenized).
- AC3: Opt-in/out push/email.
- Priority: P1

### 11. Availability & Slot Computation
- Description: Compute open slots from business hours, staff shifts, existing bookings.
- AC1: Generate slots at configurable intervals (e.g., 30 min).
- AC2: Exclude breaks and booked times.
- AC3: Handle timezone correctly.
- Priority: P0

### 12. Shared Types & Design System
- Description: Common TS types, UI components, color palette, typography.
- AC1: Repository exports types.ts used by all apps.
- AC2: Component library (Button, Card, Input) consistent.
- AC3: Dark/light theme tokens.
- Priority: P0 (foundational)

### 13. Reviews & Ratings
- Description: Clients rate after appointment; display on business.
- AC1: Only verified bookings can review.
- AC2: Star rating 1-5 + text.
- AC3: Business can reply (provider portal).
- Priority: P1

### 14. Payment Integration
- Description: Stripe/Apple Pay/Google Pay for deposits/full payment.
- AC1: Secure checkout, PCI compliant.
- AC2: Handles refunds/cancellations.
- AC3: Invoice sent via email.
- Priority: P0

### 15. Notifications
- Description: Push (FCM), email, SMS for booking confirm, reminders.
- AC1: Confirmation sent immediately after booking.
- AC2: Reminder 24h before appointment.
- AC3: User can disable per type.
- Priority: P1 (core reminders P0)

### 16. Provider / Business Owner Portal
- Description: Web dashboard for businesses to manage profile, services, staff, availability, bookings, reviews.
- AC1: CRUD on services and staff.
- AC2: Set working hours and breaks.
- AC3: View upcoming appointments and analytics.
- Priority: P0 (basic), P1 (advanced)

### 17. Admin Dashboard
- Description: Super-admin manages categories, users, businesses, flag content.
- AC1: Approve/reject business registrations.
- AC2: Disable users/businesses.
- AC3: View platform metrics.
- Priority: P1

### 18. Background Jobs (BullMQ)
- Description: Async processing: reminder emails, slot recomputation, image thumbnails.
- AC1: Job queue with Redis, retries.
- AC2: Failed jobs logged and alerted.
- AC3: Idempotent processing.
- Priority: P0

## Prioritization Summary
- P0 (MVP): Auth, Guest Browse, Search, Map, Detail, Categories, Booking, Appointment, Availability, Shared Types, Payment, Provider Basic, Background Jobs, Notifications Core.
- P1: Favorites, Profile, Reviews, Notifications Full, Provider Advanced, Admin.
- P2: Future enhancements (loyalty, multi-location).

## Success Metrics
- 500+ businesses onboarded in 3 months.
- 30% booking conversion from detail view.
- <2% payment failure.