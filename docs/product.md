# Planity Clone - Product Specification

## Overview
Planity Clone is a mobile-first platform connecting clients with beauty and wellness businesses (salons, barbers, spas). It enables discovery, booking, payment, and management for clients, providers, and admins.

## Personas
- Client: searches and books appointments.
- Provider: business owner managing listing, staff, and slots.
- Admin: platform operator monitoring health and content.

## Feature Specifications

### 1. User Authentication
Description: Register/login via email, phone, and OAuth (Google/Apple). JWT-based sessions.
Acceptance Criteria:
- AC1: User can register with email and password and receives verification email.
- AC2: Login returns access and refresh JWTs.
- AC3: Social login works on iOS and Android.
- AC4: Password reset flow sends secure link.
Priority: P0

### 2. Guest Browse & Explore
Description: Non-authenticated users can browse businesses, categories, and view details.
Acceptance Criteria:
- AC1: Guest sees home with featured businesses and categories.
- AC2: Login prompted only when attempting to book.
Priority: P0

### 3. Business Search & Discovery
Description: Text search with filters (category, price, rating, distance).
Acceptance Criteria:
- AC1: Search returns relevant results with pagination.
- AC2: Filters combine correctly and persist in URL/state.
Priority: P0

### 4. Map-based Search
Description: Display businesses on interactive map with clustering and radius filter.
Acceptance Criteria:
- AC1: Map shows markers within current viewport.
- AC2: Adjusting radius updates both map and list.
Priority: P1

### 5. Business Detail View
Description: Comprehensive view with photos, services, staff, hours, and reviews.
Acceptance Criteria:
- AC1: All required fields render correctly.
- AC2: Book CTA initiates booking flow.
- AC3: Shows real-time availability summary.
Priority: P0

### 6. Service Categories
Description: Taxonomy of services (Hair, Nails, Spa) with subcategories.
Acceptance Criteria:
- AC1: Categories seeded and manageable via admin.
- AC2: Businesses map services to categories.
Priority: P0

### 7. Booking Flow
Description: Multi-step flow: select service, staff, date, slot, confirm, pay.
Acceptance Criteria:
- AC1: Only computed available slots are selectable.
- AC2: User can use saved payment method or new one.
- AC3: On success, confirmation shown and notifications sent.
Priority: P0

### 8. Appointment Management
Description: Client views upcoming/past appointments, reschedules or cancels.
Acceptance Criteria:
- AC1: List sorted by date with status badges.
- AC2: Cancellation respects provider policy (e.g., 24h).
- AC3: Provider calendar updates instantly.
Priority: P0

### 9. Favorites
Description: Save businesses or services for quick access.
Acceptance Criteria:
- AC1: Add/remove from detail or list item.
- AC2: Favorites section in user profile.
Priority: P2

### 10. User Profile
Description: Manage personal info, payment methods, notification preferences.
Acceptance Criteria:
- AC1: Edit name, phone, avatar.
- AC2: Manage saved cards via Stripe.
- AC3: Toggle notification channels.
Priority: P1

### 11. Availability & Slot Computation
Description: Engine that computes free slots from hours, service duration, staff schedules, and existing bookings.
Acceptance Criteria:
- AC1: Excludes breaks, holidays, and booked intervals.
- AC2: Timezone aware per business.
- AC3: Supports multiple staff concurrency.
Priority: P0

### 12. Shared Types & Design System
Description: Monorepo package with TypeScript types and reusable UI components (buttons, cards, inputs, theme).
Acceptance Criteria:
- AC1: Types consumed by mobile, web, and backend.
- AC2: Component library documented with usage examples.
Priority: P1

### 13. Reviews & Ratings
Description: Post-appointment ratings with comments; aggregate scores.
Acceptance Criteria:
- AC1: Only verified bookings can submit review.
- AC2: Average rating and count shown on detail.
- AC3: Admin can moderate inappropriate content.
Priority: P1

### 14. Payment Integration
Description: Stripe for cards, plus Apple Pay / Google Pay. Supports charges and refunds.
Acceptance Criteria:
- AC1: Tokenized payment, no raw card data on server.
- AC2: Refund and partial refund flows work.
- AC3: Email receipt generated.
Priority: P0

### 15. Notifications
Description: Push (FCM/APNs), email, SMS for booking confirmations, reminders, cancellations.
Acceptance Criteria:
- AC1: User preferences respected per channel.
- AC2: Reminder sent 24h before appointment via background job.
Priority: P1

### 16. Provider / Business Owner Portal
Description: Web interface for providers to manage profile, services, staff, availability, bookings, payouts.
Acceptance Criteria:
- AC1: CRUD operations on business and services.
- AC2: Calendar view of appointments.
- AC3: Payout history and review responses.
Priority: P0

### 17. Admin Dashboard
Description: Central console to manage categories, users, businesses, and view analytics.
Acceptance Criteria:
- AC1: Approve/reject provider signups.
- AC2: Suspend users or businesses.
- AC3: Display KPI dashboards (bookings, GMV).
Priority: P1

### 18. Background Jobs (BullMQ)
Description: Queue-based processing for reminders, emails, slot recomputation, reports.
Acceptance Criteria:
- AC1: Failed jobs retry with backoff.
- AC2: Queue metrics exposed for monitoring.
- AC3: Jobs are idempotent.
Priority: P1

## Prioritization Summary
- P0 (MVP): Auth, Guest Browse, Search, Detail, Categories, Booking, Appointment, Availability, Payment, Provider Portal.
- P1: Map Search, Profile, Shared Types, Reviews, Notifications, Admin, Background Jobs.
- P2: Favorites.

## Success Metrics
- Booking conversion rate > 20% from detail view.
- Provider onboarding < 24h.
- Notification opt-in > 60%.
