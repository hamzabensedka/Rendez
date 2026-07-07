# Planity Clone - Product Specification

## Overview
Planity Clone is a mobile-first platform for discovering and booking beauty, wellness, and personal care services. It connects clients with businesses such as salons, spas, and barbers, and provides business owners a portal to manage their offerings.

## Goals
- Enable seamless discovery and booking of services.
- Provide business owners tools to manage availability and appointments.
- Ensure scalable architecture with background job processing.

## Feature Specifications

### 1. User Authentication
**Description:** Users can sign up, log in, and reset password via email or phone. Social login with Google and Apple is supported.
**Acceptance Criteria:**
- User can register with email and password and receives verification email.
- User can log in with valid credentials; invalid shows error.
- Password reset flow sends email with secure link.
- Social login returns JWT token.
**Priority:** P0

### 2. Guest Browse & Explore
**Description:** Non-authenticated users can browse featured businesses and categories.
**Acceptance Criteria:**
- Guest can view home screen with popular businesses.
- Guest can view business detail but booking prompts login.
- No personal data stored for guest.
**Priority:** P1

### 3. Business Search & Discovery
**Description:** Search businesses by name, service, or keyword with filters for distance, rating, and price.
**Acceptance Criteria:**
- Search returns relevant results with pagination.
- Filters apply correctly and update results.
- Empty state shown when no results.
**Priority:** P0

### 4. Map-based Search
**Description:** Display businesses on map with pins; user can pan and zoom to discover nearby options.
**Acceptance Criteria:**
- Map shows pins for businesses in viewport.
- Tapping pin shows quick info card.
- Search this area updates list.
**Priority:** P1

### 5. Business Detail View
**Description:** Shows business info, services, staff, photos, reviews, and booking call-to-action.
**Acceptance Criteria:**
- Displays address, hours, contact.
- Lists services with prices and durations.
- Shows aggregate rating and recent reviews.
- Booking button initiates flow.
**Priority:** P0

### 6. Service Categories
**Description:** Hierarchical categories such as Hair > Coloring for browsing.
**Acceptance Criteria:**
- Categories displayed on home and search.
- Selecting category filters businesses or services.
- Admin can manage categories.
**Priority:** P1

### 7. Booking Flow
**Description:** Multi-step: select service, staff, date, slot, confirm, pay.
**Acceptance Criteria:**
- User can select service and optional staff.
- Available slots computed from availability.
- Confirmation screen shows summary.
- On success, appointment created and notification sent.
**Priority:** P0

### 8. Appointment Management
**Description:** Users view upcoming and past appointments, reschedule, cancel.
**Acceptance Criteria:**
- List shows status such as confirmed, completed, cancelled.
- Cancel respects business policy (free within 24h).
- Reschedule opens booking with pre-filled data.
**Priority:** P0

### 9. Favorites
**Description:** Users can favorite businesses for quick access.
**Acceptance Criteria:**
- Heart icon toggles favorite.
- Favorites list accessible from profile.
- Syncs across devices.
**Priority:** P2

### 10. User Profile
**Description:** Manage personal info, payment methods, notification settings.
**Acceptance Criteria:**
- User can edit name, phone, avatar.
- Can add or remove cards (tokenized).
- Can opt out of marketing notifications.
**Priority:** P1

### 11. Availability & Slot Computation
**Description:** System computes available slots based on business hours, service duration, staff shifts, and existing bookings.
**Acceptance Criteria:**
- Generates slots at configurable intervals such as 15 min.
- Excludes breaks and booked times.
- Handles multiple staff with overlapping skills.
**Priority:** P0

### 12. Shared Types & Design System
**Description:** Common TypeScript types, UI components, color palette, typography.
**Acceptance Criteria:**
- Repository exports types used by mobile and backend.
- Component library includes Button, Card, Input.
- Theme consistent across app.
**Priority:** P1

### 13. Reviews & Ratings
**Description:** Users rate and review after completed appointment.
**Acceptance Criteria:**
- Star rating 1-5 and text optional.
- Only verified appointments can review.
- Business can respond to reviews.
**Priority:** P1

### 14. Payment Integration
**Description:** Stripe or PayPal for card payments, deposits, no-shows.
**Acceptance Criteria:**
- Secure checkout with PCI compliance via tokenization.
- Supports full pay or deposit.
- Refund triggered on cancellation per policy.
**Priority:** P0

### 15. Notifications
**Description:** Push and email for booking confirm, reminders, promos.
**Acceptance Criteria:**
- Sends confirmation immediately after booking.
- Reminder 24h before appointment.
- User can disable categories.
**Priority:** P1

### 16. Provider / Business Owner Portal
**Description:** Web dashboard for businesses to manage profile, services, staff, availability, appointments.
**Acceptance Criteria:**
- Owner can edit business info and photos.
- Create or edit services with duration and price.
- Set weekly hours and staff shifts.
- View calendar of appointments.
**Priority:** P0

### 17. Admin Dashboard
**Description:** Super admin manages categories, users, businesses, flag content.
**Acceptance Criteria:**
- Approve or reject business registrations.
- Suspend users or businesses.
- View platform metrics.
**Priority:** P1

### 18. Background Jobs (BullMQ)
**Description:** Queue-based processing for notifications, slot updates, analytics.
**Acceptance Criteria:**
- BullMQ workers handle email and push dispatch.
- Failed jobs retry with backoff.
- Monitoring dashboard for queue health.
**Priority:** P1

## Priorities Summary
- P0: Core MVP including Auth, Search, Detail, Booking, Availability, Payment, Provider Portal, Appointment Management.
- P1: Enhancements including Guest, Map, Categories, Profile, Reviews, Notifications, Admin, Background Jobs, Design System.
- P2: Nice-to-have such as Favorites.

## Out of Scope
- Real-time video consultations.
- Multi-language support initially.