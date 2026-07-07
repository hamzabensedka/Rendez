# Planity Clone - Product Specification

## Overview
Planity Clone is a mobile-first marketplace for beauty and wellness appointments. It connects customers with local businesses (salons, spas, barbers) to discover services, book slots, and manage visits. The platform includes customer app, provider portal, and admin dashboard, supported by background jobs.

## Roles
- Customer: browses, books, manages appointments.
- Guest: limited browse.
- Provider: manages business listing, availability, bookings.
- Admin: platform oversight.

## Feature Specifications

### 1. User Authentication
Description: Secure registration and login for customers and providers via email, phone OTP, and social providers.
Acceptance Criteria:
- AC1: User can register with email and password; receives verification email.
- AC2: User can login via SMS OTP.
- AC3: Social login (Google/Apple) returns valid session token.
- AC4: Password reset flow sends secure link.
- AC5: System assigns correct role (customer, provider, admin).
Priority: P0

### 2. Guest Browse & Explore
Description: Non-authenticated users can view home, categories, and business listings.
Acceptance Criteria:
- AC1: Guest can open landing page and see featured businesses.
- AC2: Attempting to book redirects to login/signup.
Priority: P1

### 3. Business Search & Discovery
Description: Text search and filtered discovery of businesses by category, price, rating, distance.
Acceptance Criteria:
- AC1: Search returns businesses matching name or services.
- AC2: Filters combine (AND) and update results instantly.
- AC3: Results paginated with 20 per page.
Priority: P0

### 4. Map-based Search
Description: Geographic exploration with interactive map and pins.
Acceptance Criteria:
- AC1: Map shows business markers within current viewport.
- AC2: Tapping a pin shows preview card with name and rating.
- AC3: Button `Search this area` refreshes results.
Priority: P1

### 5. Business Detail View
Description: Comprehensive page for a business with info, services, staff, reviews, and booking CTA.
Acceptance Criteria:
- AC1: Displays cover photo, address, hours, and service list.
- AC2: Shows average rating and latest reviews.
- AC3: `Book` button starts booking flow.
Priority: P0

### 6. Service Categories
Description: Taxonomy of beauty/wellness categories and sub-services.
Acceptance Criteria:
- AC1: Seed categories (Hair, Nails, Spa, Barber) loaded.
- AC2: Each business associates with relevant categories.
- AC3: Category screen lists businesses and filters.
Priority: P0

### 7. Booking Flow
Description: Multi-step flow to reserve a service slot.
Acceptance Criteria:
- AC1: Steps: select service -> choose staff/time -> confirm details -> payment.
- AC2: Only computed available slots are selectable.
- AC3: On success, appointment created and confirmation sent.
Priority: P0

### 8. Appointment Management
Description: Customer views upcoming/past appointments and can modify.
Acceptance Criteria:
- AC1: List shows status (upcoming, completed, cancelled).
- AC2: Cancel allowed per policy (e.g., 24h before).
- AC3: Reschedule opens slot picker with new options.
Priority: P0

### 9. Favorites
Description: Save businesses for quick access.
Acceptance Criteria:
- AC1: Heart icon toggles favorite state.
- AC2: Favorites tab lists saved businesses.
- AC3: State syncs across user devices.
Priority: P2

### 10. User Profile
Description: Manage personal data, addresses, payment methods.
Acceptance Criteria:
- AC1: User can edit name, phone, avatar.
- AC2: Add/remove saved addresses.
- AC3: Delete account with confirmation and data purge.
Priority: P1

### 11. Availability & Slot Computation
Description: Engine to generate bookable slots from hours, service duration, staff shifts, and existing bookings.
Acceptance Criteria:
- AC1: Slots generated at 15 or 30 min granularity.
- AC2: Excludes breaks, holidays, and already booked intervals.
- AC3: Respects business timezone.
Priority: P0

### 12. Shared Types & Design System
Description: Common TypeScript types and UI component library for consistency.
Acceptance Criteria:
- AC1: Shared package exports domain types (User, Business, Booking).
- AC2: Core components (Button, Card, Input) used across apps.
- AC3: Theme tokens (color, spacing) defined.
Priority: P1

### 13. Reviews & Ratings
Description: Post-visit reviews with star rating and comment.
Acceptance Criteria:
- AC1: Only users with completed appointment can review.
- AC2: Business average rating recalculates on new review.
- AC3: Provider can reply to reviews.
Priority: P1

### 14. Payment Integration
Description: Process payments via Stripe or similar PSP.
Acceptance Criteria:
- AC1: User can add and store card.
- AC2: Charge captured at booking; refund on eligible cancel.
- AC3: Handles 3D Secure challenges.
Priority: P0

### 15. Notifications
Description: Email, SMS, push notifications for booking events.
Acceptance Criteria:
- AC1: Triggered by background jobs on events.
- AC2: User can opt out per channel.
- AC3: Delivery status logged.
Priority: P1

### 16. Provider / Business Owner Portal
Description: Web portal for businesses to manage presence.
Acceptance Criteria:
- AC1: CRUD business profile and photos.
- AC2: Define services, prices, durations.
- AC3: Set staff, working hours, and breaks.
- AC4: View and manage bookings calendar.
Priority: P0

### 17. Admin Dashboard
Description: Internal tool for platform management.
Acceptance Criteria:
- AC1: List, filter, block users.
- AC2: Approve/reject business registrations.
- AC3: Moderate reviews and categories.
Priority: P1

### 18. Background Jobs (BullMQ)
Description: Queue system for async tasks like notifications, reminders, data cleanup.
Acceptance Criteria:
- AC1: BullMQ workers process jobs with Redis.
- AC2: Failed jobs retry with exponential backoff.
- AC3: Queue metrics exposed for monitoring.
Priority: P1

## Priority Summary
- P0 (MVP): Authentication, Search, Detail, Categories, Booking, Appointment, Availability, Payment, Provider Portal.
- P1: Guest, Map, Profile, Shared Types, Reviews, Notifications, Admin, Background Jobs.
- P2: Favorites.

## Success Metrics
- Booking conversion rate > 20%.
- Provider activation > 50% within 30 days.
- Crash-free sessions > 99%.