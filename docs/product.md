# Planity Clone - Product Specification

## Overview
Planity Clone is a mobile-first platform connecting clients with beauty & wellness businesses (salons, barbers, spas). It supports discovery, booking, payments, and management for customers, providers, and admins.

## Feature Specifications

### 1. User Authentication
- Description: Secure signup/login via email, phone, Google/Apple.
- Acceptance Criteria:
  - User can register with email+password; receive verification email.
  - User can login with OAuth providers.
  - JWT stored securely; session persists.
  - Password reset flow works.
- Priority: P0

### 2. Guest Browse & Explore
- Description: Non-logged-in users can explore businesses and services.
- AC:
  - Guest can view home feed of featured businesses.
  - Guest can view business detail but booking prompts login.
  - No personal data stored for guest.
- Priority: P1

### 3. Business Search & Discovery
- Description: Search by name, service, or category with filters.
- AC:
  - Search returns relevant businesses with pagination.
  - Filters: category, price, rating, distance.
  - Sorting by relevance, distance, rating.
- Priority: P0

### 4. Map-based Search
- Description: View businesses on map with geolocation.
- AC:
  - Map shows pins for businesses in viewport.
  - Tap pin opens preview card.
  - User can center map on current location.
- Priority: P1

### 5. Business Detail View
- Description: Full info: photos, services, staff, hours, reviews.
- AC:
  - Displays business profile, list of services with prices/durations.
  - Shows available slots for selected service.
  - Shows aggregate rating and review snippets.
- Priority: P0

### 6. Service Categories
- Description: Taxonomy of services (Hair, Nails, Spa, etc.).
- AC:
  - Categories seeded; businesses assign services to categories.
  - Category page lists businesses offering that service.
- Priority: P1

### 7. Booking Flow
- Description: Multi-step booking: select service, staff, slot, confirm.
- AC:
  - User selects service and optional staff.
  - System shows computed available slots.
  - User confirms; appointment created with status pending payment.
  - Guest redirected to login/signup before confirm.
- Priority: P0

### 8. Appointment Management
- Description: View upcoming/past appointments; cancel/reschedule.
- AC:
  - User sees list with statuses.
  - Cancel triggers refund policy check.
  - Reschedule opens slot picker.
  - Provider can accept/decline.
- Priority: P0

### 9. Favorites
- Description: Save businesses or services.
- AC:
  - User can favorite/unfavorite from list or detail.
  - Favorites tab shows saved items.
  - Syncs across devices.
- Priority: P2

### 10. User Profile
- Description: Manage personal info, payment methods, addresses.
- AC:
  - Edit name, phone, avatar.
  - View booking history.
  - Manage saved cards (tokenized).
- Priority: P1

### 11. Availability & Slot Computation
- Description: Engine computing free slots from business hours, staff shifts, existing bookings.
- AC:
  - Given service duration, returns slots at 15-min granularity.
  - Respects breaks and time-off.
  - Handles multiple staff.
- Priority: P0

### 12. Shared Types & Design System
- Description: Common TS types, UI components, theme.
- AC:
  - Repository has shared package with Button, Card, Input.
  - Types for User, Business, Appointment consistent across apps.
  - Dark/light theme tokens.
- Priority: P1

### 13. Reviews & Ratings
- Description: Post-visit reviews with star rating and text.
- AC:
  - User can submit review after completed appointment.
  - Business displays average rating.
  - Flagging inappropriate content.
- Priority: P1

### 14. Payment Integration
- Description: Stripe/PayPal for booking deposits or full payment.
- AC:
  - Secure checkout with PCI compliance via tokenization.
  - Supports refund/cancel.
  - Receipt emailed.
- Priority: P0

### 15. Notifications
- Description: Push, email, SMS for booking confirmations, reminders.
- AC:
  - User receives push on booking confirm.
  - Reminder 24h before appointment.
  - Provider gets new booking alert.
- Priority: P1

### 16. Provider / Business Owner Portal
- Description: Web dashboard for businesses to manage profile, services, staff, slots, bookings.
- AC:
  - CRUD on services, staff, working hours.
  - View calendar of appointments.
  - Respond to reviews.
  - Payout reports.
- Priority: P0

### 17. Admin Dashboard
- Description: Super admin manages categories, users, businesses, moderation.
- AC:
  - Approve/reject business registrations.
  - Disable users or content.
  - View platform metrics.
- Priority: P1

### 18. Background Jobs (BullMQ)
- Description: Async processing for notifications, slot updates, reminders.
- AC:
  - BullMQ queues for email/sms, reminder jobs.
  - Retry on failure with dead-letter.
  - Monitor via Redis insight.
- Priority: P1

## Priorities Summary
- P0: Core MVP (Auth, Search, Detail, Booking, Availability, Payment, Provider, Appt)
- P1: Enhancement (Guest, Map, Categories, Profile, Design, Reviews, Notifications, Admin, Jobs)
- P2: Nice-to-have (Favorites)

## Acceptance Criteria Notes
All features must be mobile-responsive, accessible (WCAG AA), and instrumented with analytics.