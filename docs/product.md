# Planity Clone - Product Specification

## Overview
Planity Clone is a mobile-first platform connecting clients with beauty and wellness businesses (salons, barbers, spas). It supports discovery, booking, payments, and management for consumers, business owners, and admins. This document defines features, acceptance criteria, and priorities from a user-centric product perspective.

## Global Principles
- Mobile-first responsive design.
- Shared design system and types for consistency.
- Accessibility (WCAG 2.1 AA).
- Performance: search results under 1 second.

## Feature Specifications

### 1. User Authentication
**Priority:** P0
**Description:** Secure signup/login for clients via email, phone OTP, and social providers.
**Acceptance Criteria:**
- User can register with email and password; password hashed.
- User can login with phone number and OTP via SMS.
- Social login (Google, Apple) works on iOS and Android.
- JWT refresh token rotation implemented.
- Logout invalidates tokens.
- Error messages are user-friendly.

### 2. Guest Browse and Explore
**Priority:** P1
**Description:** Non-authenticated users can explore businesses and services.
**Acceptance Criteria:**
- Guest can view home feed of featured businesses.
- Guest can view business detail and services but cannot book.
- Prompt to login appears when attempting booking.
- Guest session does not persist data except local cache.

### 3. Business Search and Discovery
**Priority:** P0
**Description:** Clients search businesses by name, service, or category.
**Acceptance Criteria:**
- Search returns relevant businesses with pagination.
- Filters: category, price range, rating, distance.
- Empty state and suggestions handled.
- Search query logged for analytics in privacy-compliant way.

### 4. Map-based Search
**Priority:** P1
**Description:** Visual discovery via interactive map with pins.
**Acceptance Criteria:**
- Map shows businesses within viewport.
- Pin clustering at low zoom.
- Tapping pin opens mini business card.
- Search this area updates results.
- Works on mobile with GPS permission flow.

### 5. Business Detail View
**Priority:** P0
**Description:** Comprehensive view of a business profile.
**Acceptance Criteria:**
- Displays cover photo, logo, address, hours, services list, staff, reviews.
- Shows next available slot computed dynamically.
- Call and route buttons functional.
- Gallery and amenities visible.

### 6. Service Categories
**Priority:** P0
**Description:** Taxonomy of services (Hair, Nails, Spa) with sub-services.
**Acceptance Criteria:**
- Categories seeded and manageable via admin.
- Each service has duration, price, provider assignment.
- Clients can browse by category from home.
- Category icons from design system.

### 7. Booking Flow
**Priority:** P0
**Description:** Multi-step booking: select service, staff, date, slot, confirm.
**Acceptance Criteria:**
- User selects service(s) with total duration and price.
- Slot computation respects availability and buffers.
- User can choose any available staff or any option.
- Confirmation screen shows summary.
- Booking creates appointment and triggers notification.
- Concurrent booking prevented via optimistic lock.

### 8. Appointment Management
**Priority:** P0
**Description:** Users view upcoming/past appointments, reschedule, cancel.
**Acceptance Criteria:**
- List grouped by upcoming and past.
- Cancel respects business policy (free within X hours).
- Reschedule uses same booking flow.
- Add to calendar option.
- Provider receives update via portal and notification.

### 9. Favorites
**Priority:** P2
**Description:** Users bookmark businesses or services.
**Acceptance Criteria:**
- Heart icon toggles favorite on detail view.
- Favorites list in profile.
- Sync across devices after login.
- Guest favorites stored locally, merged on signup.

### 10. User Profile
**Priority:** P1
**Description:** Manage personal info, payment methods, notification settings.
**Acceptance Criteria:**
- Edit name, phone, avatar.
- View booking history.
- Manage saved cards (tokenized).
- Consent toggles for marketing.

### 11. Availability and Slot Computation
**Priority:** P0
**Description:** Core engine computing open slots from working hours, staff shifts, existing appointments, and service duration.
**Acceptance Criteria:**
- Returns slots in 15-min increments configurable.
- Considers buffer time between appointments.
- Handles exceptions (holidays, breaks).
- Scales for multiple staff.
- Exposes shared TypeScript types.

### 12. Shared Types and Design System
**Priority:** P1
**Description:** Monorepo package with UI components and TypeScript interfaces.
**Acceptance Criteria:**
- Components: Button, Card, Input, Modal, BottomSheet.
- Types: User, Business, Service, Appointment, etc.
- Used by consumer app, provider portal, admin.
- Documented with Storybook.

### 13. Reviews and Ratings
**Priority:** P1
**Description:** Clients rate completed appointments (1-5 stars, text).
**Acceptance Criteria:**
- Review prompt after appointment completion.
- Only verified clients can review.
- Business can reply via provider portal.
- Average rating displayed on detail view.
- Moderation via admin for abuse.

### 14. Payment Integration
**Priority:** P0
**Description:** Secure checkout via Stripe or payment gateway.
**Acceptance Criteria:**
- Card tokenization, no raw PAN stored.
- Supports full prepay or deposit based on business config.
- Refund and cancel flows integrated.
- Invoice sent via email.
- PCI-compliant.

### 15. Notifications
**Priority:** P1
**Description:** Push (FCM/APNs), email, and in-app notifications.
**Acceptance Criteria:**
- Booking confirmation, reminder (24h/2h), cancel/reschedule alerts.
- User preferences respected.
- Provider gets new booking alerts.
- Background jobs send scheduled reminders.

### 16. Provider / Business Owner Portal
**Priority:** P0
**Description:** Web dashboard for businesses to manage profile, staff, services, availability, appointments.
**Acceptance Criteria:**
- Login as provider role.
- CRUD business info, services, staff shifts.
- View day/week calendar of appointments.
- Accept/decline bookings if manual approval.
- Reply to reviews, view analytics.

### 17. Admin Dashboard
**Priority:** P1
**Description:** Super-admin panel for platform management.
**Acceptance Criteria:**
- Manage categories, users, businesses, providers.
- Suspend accounts, moderate reviews.
- View global metrics (bookings, revenue).
- Configure feature flags.

### 18. Background Jobs (BullMQ)
**Priority:** P1
**Description:** Redis-backed job queue for async tasks.
**Acceptance Criteria:**
- Jobs: send reminders, sync availability, cleanup expired OTP, generate reports.
- Retry with exponential backoff.
- Dead-letter queue for failures.
- Dashboard/metrics for job health.

## Prioritization Summary
- P0 (MVP): Auth, Search, Detail, Categories, Booking, Availability, Payment, Appointments, Provider Portal.
- P1: Guest Browse, Map, Profile, Design System, Reviews, Notifications, Admin, Background Jobs.
- P2: Favorites.

## Success Metrics
- Booking conversion above 20% from detail view.
- Search latency p95 under 800ms.
- Crash-free sessions above 99%.