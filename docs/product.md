# Planity Clone - Product Specification

## Overview
Planity Clone is a mobile-first marketplace connecting clients with beauty and wellness professionals (salons, barbers, spas). It supports discovery, booking, payments, and management for clients, providers, and admins.

## Goals
- Enable seamless appointment booking.
- Provide business owners tools to manage slots and services.
- Admin oversight and platform health.

## Personas
- Client: books appointments.
- Provider: business owner managing offerings.
- Admin: platform operator.

## Feature Specifications

### 1. User Authentication
**Priority:** P0
**Description:** Secure signup/login via email, phone OTP, and social (Google/Apple).
**Acceptance Criteria:**
- User can register with email and password, verified via email link.
- User can login with OTP sent to phone.
- Social login returns JWT.
- Password reset flow works.
- Sessions persist via refresh token.

### 2. Guest Browse & Explore
**Priority:** P0
**Description:** Non-authenticated users can browse businesses and services.
**Acceptance Criteria:**
- Guest can view home feed of featured businesses.
- Guest can view business detail and services but cannot book.
- Prompt to login appears on booking attempt.

### 3. Business Search & Discovery
**Priority:** P0
**Description:** Search by name, service, or category with filters.
**Acceptance Criteria:**
- Search returns relevant businesses with pagination.
- Filters include category, price range, rating, distance.
- Sorting by relevance, distance, rating.

### 4. Map-based Search
**Priority:** P1
**Description:** View businesses on interactive map with geolocation.
**Acceptance Criteria:**
- Map shows pins for businesses within radius.
- Tap pin opens preview card.
- Search this area updates results.

### 5. Business Detail View
**Priority:** P0
**Description:** Comprehensive page with info, services, staff, reviews.
**Acceptance Criteria:**
- Shows address, hours, contact, gallery.
- Lists services with durations and prices.
- Shows provider bio and staff members.
- Displays aggregate rating and recent reviews.

### 6. Service Categories
**Priority:** P0
**Description:** Taxonomy of beauty and wellness categories (Hair, Nails, Spa, etc.).
**Acceptance Criteria:**
- Categories seeded and manageable via admin.
- Each business assigns categories.
- Subcategories supported.

### 7. Booking Flow
**Priority:** P0
**Description:** Multi-step booking: select service, staff, slot, confirm.
**Acceptance Criteria:**
- User selects service and optional staff.
- Available slots computed from availability.
- User confirms with notes.
- On success, appointment created and notification sent.

### 8. Appointment Management
**Priority:** P0
**Description:** Clients view upcoming and past appointments; reschedule or cancel.
**Acceptance Criteria:**
- List with status filters.
- Cancel up to 24h before free; else fee applies.
- Reschedule shows new slot picker.

### 9. Favorites
**Priority:** P1
**Description:** Save businesses or services.
**Acceptance Criteria:**
- Heart icon toggles favorite.
- Favorites list in profile.
- Sync across devices.

### 10. User Profile
**Priority:** P0
**Description:** Manage personal info, payment methods, addresses.
**Acceptance Criteria:**
- Edit name, phone, avatar.
- Add or remove cards (tokenized).
- View booking history.

### 11. Availability & Slot Computation
**Priority:** P0
**Description:** Engine to generate slots based on business hours, service duration, staff shifts, and existing bookings.
**Acceptance Criteria:**
- Computes 15-min granularity slots.
- Respects breaks and time-off.
- Handles multiple staff.
- Exposes API used by booking and provider portal.

### 12. Shared Types & Design System
**Priority:** P0
**Description:** Common TypeScript types, UI components, theme.
**Acceptance Criteria:**
- Monorepo package with Button, Card, Input, etc.
- Theme tokens (colors, spacing) consistent.
- Types for User, Business, Appointment shared across apps.

### 13. Reviews & Ratings
**Priority:** P1
**Description:** Clients rate after completed appointment.
**Acceptance Criteria:**
- 1-5 star plus text, photo optional.
- Only verified appointments can review.
- Business can respond.
- Average rating recalculated.

### 14. Payment Integration
**Priority:** P0
**Description:** Stripe for cards, wallets; hold or deposit support.
**Acceptance Criteria:**
- Save card via Stripe SetupIntent.
- Charge on booking or capture later.
- Handle refunds per cancellation policy.
- PCI compliant (no raw PAN).

### 15. Notifications
**Priority:** P1
**Description:** Push (FCM/APNs), email, SMS for booking events.
**Acceptance Criteria:**
- Confirmation, reminder 24h before, cancelled, reviewed.
- User preferences for channels.
- Provider gets new booking alert.

### 16. Provider / Business Owner Portal
**Priority:** P0
**Description:** Web dashboard for businesses to manage profile, services, staff, availability, bookings.
**Acceptance Criteria:**
- CRUD business info, services, categories.
- Set weekly hours and staff shifts.
- View calendar of appointments.
- Accept or decline bookings if manual.

### 17. Admin Dashboard
**Priority:** P1
**Description:** Super admin manages categories, users, businesses, disputes.
**Acceptance Criteria:**
- Approve or reject business registrations.
- Disable users or businesses.
- View platform metrics.
- Manage service taxonomy.

### 18. Background Jobs (BullMQ)
**Priority:** P1
**Description:** Queue system for async tasks: reminders, slot cleanup, report generation.
**Acceptance Criteria:**
- BullMQ queues with Redis.
- Job types: sendNotification, expirePending, aggregateStats.
- Retry with backoff.
- Dashboard to monitor queues.

## Priority Summary
- P0: Core MVP (Auth, Guest, Search, Detail, Categories, Booking, Appointments, Profile, Availability, Design System, Payment, Provider Portal)
- P1: Enhancements (Map, Favorites, Reviews, Notifications, Admin, Background Jobs)

## Success Metrics
- Booking conversion above 30 percent.
- Provider retention above 80 percent.