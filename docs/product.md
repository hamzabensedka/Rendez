# Planity Clone - Product Specification

## Overview
Planity Clone is a mobile-first platform for discovering and booking beauty & wellness services. This spec defines features, acceptance criteria, and priorities.

## Feature List

### 1. User Authentication
**Description:** Users can sign up, log in, and reset password via email/phone. Social login optional.
**Acceptance Criteria:**
- User can register with email and password; receives verification.
- User can log in and maintain session.
- Password reset flow works.
- JWT stored securely.
**Priority:** P0

### 2. Guest Browse & Explore
**Description:** Non-authenticated users can browse businesses and services.
**Acceptance Criteria:**
- Guest can view home feed, categories, and business list.
- Guest prompted to login only when booking.
**Priority:** P0

### 3. Business Search & Discovery
**Description:** Search by name, service, or keyword with filters.
**Acceptance Criteria:**
- Search returns relevant businesses.
- Filters for category, price, rating work.
- Empty state handled.
**Priority:** P0

### 4. Map-based Search
**Description:** View businesses on map with geolocation.
**Acceptance Criteria:**
- Map shows pins for businesses near user.
- Tap pin opens preview.
- Radius filter works.
**Priority:** P1

### 5. Business Detail View
**Description:** Show business info, services, staff, hours, reviews.
**Acceptance Criteria:**
- Displays images, description, address, contact.
- Lists services with prices and durations.
- Shows aggregate rating.
**Priority:** P0

### 6. Service Categories
**Description:** Hierarchical categories (e.g., Hair > Coloring).
**Acceptance Criteria:**
- Categories seeded and displayed.
- Selecting category filters businesses/services.
**Priority:** P1

### 7. Booking Flow
**Description:** Multi-step: select service, staff, date, slot, confirm.
**Acceptance Criteria:**
- User can complete booking if authenticated.
- Slot availability computed correctly.
- Confirmation shown and saved.
**Priority:** P0

### 8. Appointment Management
**Description:** User views upcoming/past appointments, reschedule/cancel.
**Acceptance Criteria:**
- List appointments with status.
- Cancel triggers notification and frees slot.
- Reschedule uses same booking logic.
**Priority:** P0

### 9. Favorites
**Description:** Users bookmark businesses.
**Acceptance Criteria:**
- Add/remove favorite.
- Favorites list accessible from profile.
**Priority:** P2

### 10. User Profile
**Description:** Manage personal info, payment methods, notifications settings.
**Acceptance Criteria:**
- Edit name, phone, avatar.
- View booking history.
**Priority:** P1

### 11. Availability & Slot Computation
**Description:** Compute free slots based on business hours, service duration, existing bookings, staff.
**Acceptance Criteria:**
- Returns slots in 15-min increments.
- Respects breaks and time off.
- Handles multiple staff.
**Priority:** P0

### 12. Shared Types & Design System
**Description:** Common TS types, UI components, theme.
**Acceptance Criteria:**
- Design system includes buttons, cards, colors.
- Types used across frontend/backend.
**Priority:** P1

### 13. Reviews & Ratings
**Description:** Users rate and review after appointment.
**Acceptance Criteria:**
- Submit star rating + text.
- Reviews shown on business detail.
- Prevent duplicate reviews.
**Priority:** P1

### 14. Payment Integration
**Description:** Stripe/PayPal for deposits or full payment.
**Acceptance Criteria:**
- Secure checkout.
- Payment status linked to booking.
- Refund handled for cancellations.
**Priority:** P0

### 15. Notifications
**Description:** Push/email/SMS for booking confirm, remind, cancel.
**Acceptance Criteria:**
- Triggered by events.
- User can opt out.
- Delivery logged.
**Priority:** P1

### 16. Provider / Business Owner Portal
**Description:** Businesses manage profile, services, staff, availability, bookings.
**Acceptance Criteria:**
- CRUD on services and staff.
- View calendar and accept/decline bookings.
- Dashboard with stats.
**Priority:** P0

### 17. Admin Dashboard
**Description:** Super admin manages users, businesses, categories, moderation.
**Acceptance Criteria:**
- Approve/reject business registrations.
- Disable accounts.
- View platform metrics.
**Priority:** P1

### 18. Background Jobs (BullMQ)
**Description:** Async jobs for notifications, slot cleanup, reminders.
**Acceptance Criteria:**
- Queue for sending notifications.
- Retry on failure.
- Monitor via Redis.
**Priority:** P1

## Priorities Summary
- P0: Core MVP (Auth, Browse, Search, Detail, Booking, Availability, Payment, Provider, Appointment)
- P1: Enhancements (Map, Categories, Profile, Design, Reviews, Notifications, Admin, Jobs)
- P2: Nice-to-have (Favorites)
