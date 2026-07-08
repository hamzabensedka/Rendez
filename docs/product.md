# Planity Clone - Product Specification

## Overview
Goal: Define complete feature specifications and acceptance criteria for Planity Clone, a mobile-first platform for discovering and booking beauty and wellness services.

## Priority Legend
- P0: Must-have for MVP
- P1: Important post-MVP
- P2: Nice-to-have

## Features

### 1. User Authentication
Description: Users register, login, logout, reset password via email or phone.
Acceptance Criteria:
- AC1: User registers with email and password; receives verification email.
- AC2: User logs in with valid credentials; session persisted.
- AC3: Password reset sends email with secure link.
- AC4: Social login (Google, Apple) supported (P1).
Priority: P0

### 2. Guest Browse and Explore
Description: Non-authenticated users browse businesses and services.
Acceptance Criteria:
- AC1: Guest views home feed of featured businesses.
- AC2: Guest can search but prompted to login at booking.
Priority: P0

### 3. Business Search and Discovery
Description: Search by name, category, filters (price, rating, distance).
Acceptance Criteria:
- AC1: Search returns relevant businesses with pagination.
- AC2: Filters apply correctly and update results.
Priority: P0

### 4. Map-based Search
Description: View businesses on map with geolocation.
Acceptance Criteria:
- AC1: Map shows pins for businesses in viewport.
- AC2: Tapping pin opens preview card.
- AC3: Search this area updates list.
Priority: P1

### 5. Business Detail View
Description: Show business info, services, staff, photos, reviews.
Acceptance Criteria:
- AC1: Displays address, hours, contact.
- AC2: Lists services with prices and durations.
- AC3: Shows aggregate rating and review snippets.
Priority: P0

### 6. Service Categories
Description: Hierarchical categories (e.g., Hair > Coloring).
Acceptance Criteria:
- AC1: Categories seed data loaded.
- AC2: User navigates category tree to filter businesses.
Priority: P0

### 7. Booking Flow
Description: Select service, staff, date, slot, confirm.
Acceptance Criteria:
- AC1: User selects service from business.
- AC2: Available slots computed from availability.
- AC3: Guest redirected to login before payment.
- AC4: Confirmation screen with summary.
Priority: P0

### 8. Appointment Management
Description: User views upcoming/past appointments, reschedule/cancel.
Acceptance Criteria:
- AC1: List of appointments with status.
- AC2: Cancel triggers notification and frees slot.
- AC3: Reschedule uses same booking flow.
Priority: P0

### 9. Favorites
Description: Save businesses/services to favorites.
Acceptance Criteria:
- AC1: User can favorite or unfavorite from list or detail.
- AC2: Favorites list accessible from profile.
Priority: P1

### 10. User Profile
Description: Manage personal info, payment methods, notification settings.
Acceptance Criteria:
- AC1: Edit name, phone, email.
- AC2: View booking history.
Priority: P0

### 11. Availability and Slot Computation
Description: Business defines working hours, breaks, service duration; system computes slots.
Acceptance Criteria:
- AC1: Algorithm returns non-overlapping slots respecting buffer.
- AC2: Handles staff-specific availability.
- AC3: Timezone aware.
Priority: P0

### 12. Shared Types and Design System
Description: Common TS types, UI components, color palette, typography.
Acceptance Criteria:
- AC1: Repository with shared package used by mobile, web, backend.
- AC2: Component library documented.
Priority: P0

### 13. Reviews and Ratings
Description: Users rate and review after appointment.
Acceptance Criteria:
- AC1: Submit 1-5 star with text.
- AC2: Reviews moderated by admin.
- AC3: Display on business detail.
Priority: P1

### 14. Payment Integration
Description: Stripe/Apple Pay for deposits or full payment.
Acceptance Criteria:
- AC1: Secure checkout with PCI compliance.
- AC2: Refund handled on cancellation per policy.
Priority: P0

### 15. Notifications
Description: Push (mobile) and email for booking confirm, remind, cancel.
Acceptance Criteria:
- AC1: Event-driven notifications via queue.
- AC2: User can opt-out.
Priority: P1

### 16. Provider / Business Owner Portal
Description: Dashboard for businesses to manage profile, services, staff, availability, bookings.
Acceptance Criteria:
- AC1: Login as provider.
- AC2: CRUD on services, staff, hours.
- AC3: View upcoming appointments.
Priority: P0

### 17. Admin Dashboard
Description: Super admin manages categories, users, businesses, reviews, monitor jobs.
Acceptance Criteria:
- AC1: Approve or reject business registrations.
- AC2: Disable users or content.
Priority: P1

### 18. Background Jobs (BullMQ)
Description: Async processing for notifications, slot cleanup, reminders.
Acceptance Criteria:
- AC1: Queue for email/sms dispatch.
- AC2: Retry on failure with dead-letter.
- AC3: Monitoring UI.
Priority: P1

## Summary
Complete spec with P0/P1 priorities ensures MVP covers auth, search, booking, provider portal.