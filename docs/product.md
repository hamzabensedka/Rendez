# Planity Clone - Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting clients with beauty & wellness businesses (salons, barbers, spas). It supports discovery, booking, payments, reviews, and provider/admin management.

## 2. Goals
- Enable seamless booking of services.
- Provide business owners a portal to manage slots and appointments.
- Admin oversight of platform.

## 3. Personas
- Client: books appointments.
- Guest: browses without account.
- Provider: business owner/staff.
- Admin: platform operator.

## 4. Shared Types & Design System
Define common data models (User, Business, Service, Appointment, Review, Payment) and UI components (buttons, cards, nav). Use TypeScript types shared across frontend/backend. Design system: color palette, typography, spacing, icon set. Priority P0.

Acceptance:
- Shared types package published.
- Storybook with core components.
- Used by all features.

## 5. Feature Specifications

### 5.1 User Authentication
Description: Sign up/login via email, phone, OAuth (Google/Apple). JWT-based sessions.
Acceptance:
- User can register with email+password; receives verification.
- Login returns token; protected routes require token.
- Password reset flow works.
- OAuth providers functional.
Priority: P0.

### 5.2 Guest Browse & Explore
Description: Non-authenticated users can view businesses, categories, and limited details.
Acceptance:
- Guest can open home, view featured businesses.
- Attempting to book prompts login.
- Guest session tracked anonymously.
Priority: P1.

### 5.3 Business Search & Discovery
Description: Search by name, service, filters (price, rating, distance).
Acceptance:
- Text search returns relevant businesses.
- Filters combine correctly.
- Sorting by relevance, rating, distance.
Priority: P0.

### 5.4 Map-based Search
Description: Display businesses on map with pins; tap pin shows preview.
Acceptance:
- Map renders within 2s for area.
- Pins reflect filters.
- Clicking pin navigates to detail.
Priority: P1.

### 5.5 Business Detail View
Description: Show info: photos, services, staff, hours, reviews, location.
Acceptance:
- All data loads correctly.
- Services list with prices and durations.
- Book CTA visible.
Priority: P0.

### 5.6 Service Categories
Description: Taxonomy of services (Hair, Nails, Spa, etc.) with sub-categories.
Acceptance:
- Categories tree defined.
- Businesses tagged with categories.
- Browse by category works.
Priority: P0.

### 5.7 Booking Flow
Description: Select service, staff, date, slot, confirm, pay.
Acceptance:
- Available slots computed (see 5.11).
- User can select options; summary shown.
- On confirm, appointment created with status pending payment.
- Redirect to payment.
Priority: P0.

### 5.8 Appointment Management
Description: List upcoming/past appointments; cancel/reschedule.
Acceptance:
- Client sees appointments with details.
- Cancel triggers refund per policy.
- Reschedule opens slot picker.
- Provider portal syncs.
Priority: P0.

### 5.9 Favorites
Description: Save businesses/services to favorites.
Acceptance:
- Add/remove from detail view.
- Favorites list accessible in profile.
- Persisted across devices.
Priority: P2.

### 5.10 User Profile
Description: Manage personal info, payment methods, notifications settings.
Acceptance:
- Edit name, phone, avatar.
- View booking history.
- Toggle notification preferences.
Priority: P1.

### 5.11 Availability & Slot Computation
Description: Algorithm to compute free slots based on business hours, service duration, staff shifts, existing bookings.
Acceptance:
- Correctly excludes booked times.
- Handles multiple staff.
- Buffer times considered.
- Timezone aware.
Priority: P0.

### 5.12 Reviews & Ratings
Description: Clients rate businesses/services; write text reviews.
Acceptance:
- Only verified appointments can review.
- Average rating computed.
- Reviews modifiable/deletable by author.
- Admin can remove inappropriate.
Priority: P1.

### 5.13 Payment Integration
Description: Stripe/PayPal for cards, wallets; handle deposits, refunds.
Acceptance:
- Secure checkout.
- Webhook updates appointment status.
- Failed payment handled gracefully.
- Refund issued on cancel per rules.
Priority: P0.

### 5.14 Notifications
Description: Email, SMS, push for booking confirm, reminders, promos.
Acceptance:
- Triggered by events (booking, cancel, reminder 24h).
- User can opt-out.
- Delivery tracked.
Priority: P1.

### 5.15 Provider / Business Owner Portal
Description: Web app for providers to manage profile, services, staff, availability, appointments, analytics.
Acceptance:
- CRUD business info, services, staff.
- Set working hours and breaks.
- View calendar of appointments.
- Accept/decline bookings.
- Payout reports.
Priority: P0.

### 5.16 Admin Dashboard
Description: Super admin manages users, businesses, categories, reviews, payments, support.
Acceptance:
- Approve/reject business registrations.
- Suspend users/businesses.
- View platform metrics.
- Manage categories taxonomy.
Priority: P1.

### 5.17 Background Jobs (BullMQ)
Description: Async processing for notifications, reminder sends, slot cache, report generation, webhook retries.
Acceptance:
- BullMQ queues configured with Redis.
- Jobs retry with backoff.
- Failed jobs logged and alerted.
- Idempotent processing.
Priority: P0.

## 6. Prioritization Summary
P0: Auth, Search, Detail, Categories, Booking, Appointment, Slot Computation, Payment, Provider Portal, Background Jobs, Shared Types.
P1: Guest Browse, Map, Profile, Reviews, Notifications, Admin.
P2: Favorites.

## 7. Out of Scope
- Real-time video consultations.
- Multi-language support (future).
- Native iOS/Android (start with React Native or PWA).