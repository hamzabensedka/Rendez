# Planity Clone - Product Specification

## Overview
Goal: Build a marketplace app for beauty & wellness appointments (clone of Planity). Clients discover businesses, book services, manage appointments; providers manage listings; admin oversees platform.

## Feature Specifications

### 1. User Authentication
- Priority: P0
- Description: Users register, login, logout via email/phone and OAuth (Google, Apple).
- Acceptance Criteria:
  - AC1: User can register with email and password; receives verification email.
  - AC2: User can login with valid credentials; session persists via JWT.
  - AC3: OAuth providers redirect and create account if new.
  - AC4: Password reset flow works.
  - AC5: Protected routes require auth token.

### 2. Guest Browse & Explore
- Priority: P0
- Description: Non-authenticated users can explore homepage, featured businesses, categories.
- Acceptance Criteria:
  - AC1: Guest sees curated lists (Trending, Near Me placeholder).
  - AC2: Guest can view business detail but booking prompts login.
  - AC3: No personal data stored for guest.

### 3. Business Search & Discovery
- Priority: P0
- Description: Search by name, service, filter by date, price, rating.
- Acceptance Criteria:
  - AC1: Text search returns relevant businesses with debounce.
  - AC2: Filters apply correctly (category, price range, rating, availability).
  - AC3: Sort by distance, rating, price.

### 4. Map-based Search
- Priority: P0
- Description: Interactive map shows business pins; click pin shows preview.
- Acceptance Criteria:
  - AC1: Map renders with user location (permission) or default city.
  - AC2: Pins clustered at low zoom.
  - AC3: Selecting pin navigates to detail or preview card.
  - AC4: Map reflects active filters.

### 5. Business Detail View
- Priority: P0
- Description: Show info: photos, services, staff, hours, reviews, location.
- Acceptance Criteria:
  - AC1: Displays business profile, list of services with durations/prices.
  - AC2: Shows aggregate rating and recent reviews.
  - AC3: "Book" button initiates booking flow.
  - AC4: Shows next available slot.

### 6. Service Categories
- Priority: P0
- Description: Taxonomy of categories (Hair, Nails, Spa) with subcategories.
- Acceptance Criteria:
  - AC1: Categories seed data loaded.
  - AC2: Businesses assigned to categories; browse by category.
  - AC3: Category page shows businesses and filters.

### 7. Booking Flow
- Priority: P0
- Description: Multi-step: select service -> staff (optional) -> date/time -> confirm -> pay.
- Acceptance Criteria:
  - AC1: Only available slots shown based on availability computation.
  - AC2: User can select or auto-assign staff.
  - AC3: Summary shown with price and duration.
  - AC4: On confirm, appointment created and payment triggered.
  - AC5: Confirmation screen and notification sent.

### 8. Appointment Management
- Priority: P0
- Description: User views upcoming/past appointments, reschedule, cancel.
- Acceptance Criteria:
  - AC1: List grouped by upcoming/past.
  - AC2: Cancel respects policy (e.g., 24h free).
  - AC3: Reschedule opens booking flow with prefilled data.
  - AC4: Add to calendar option.

### 9. Favorites
- Priority: P1
- Description: Users bookmark businesses.
- Acceptance Criteria:
  - AC1: Heart icon toggles favorite.
  - AC2: Favorites list in profile.
  - AC3: Favorite businesses appear in recommendations.

### 10. User Profile
- Priority: P1
- Description: Manage personal info, payment methods, notification settings.
- Acceptance Criteria:
  - AC1: Edit name, phone, avatar.
  - AC2: View saved addresses.
  - AC3: Manage notification preferences.

### 11. Availability & Slot Computation
- Priority: P0
- Description: Compute free slots from business hours, staff schedules, appointments, service duration.
- Acceptance Criteria:
  - AC1: Given date, return slots at interval excluding breaks.
  - AC2: Handle multiple staff: aggregate capacity.
  - AC3: Consider buffer time per service.
  - AC4: Timezone aware.

### 12. Shared Types & Design System
- Priority: P0
- Description: Common TS types, UI components (Button, Card, Input, Modal) consistent with brand.
- Acceptance Criteria:
  - AC1: Design tokens (color, spacing) defined.
  - AC2: Component library documented.
  - AC3: Types for User, Business, Appointment shared across frontend/backend.

### 13. Reviews & Ratings
- Priority: P1
- Description: Users leave star rating + text after completed appointment.
- Acceptance Criteria:
  - AC1: Only verified customers can review.
  - AC2: Average rating computed and displayed.
  - AC3: Business owner can respond.
  - AC4: Moderation flags inappropriate content.

### 14. Payment Integration
- Priority: P0
- Description: Stripe for cards, maybe wallet.
- Acceptance Criteria:
  - AC1: User can add card, pay deposit/full.
  - AC2: Handle 3D Secure.
  - AC3: Refund/cancel triggers partial/full refund per policy.
  - AC4: Invoice email sent.

### 15. Notifications
- Priority: P1 (core P0 for booking confirm)
- Description: Email, push, SMS for booking, reminders, promotions.
- Acceptance Criteria:
  - AC1: Booking confirmation sent immediately.
  - AC2: Reminder 24h before appointment.
  - AC3: User can opt-out.
  - AC4: Provider gets new booking alert.

### 16. Provider / Business Owner Portal
- Priority: P1
- Description: Web dashboard for businesses to manage profile, services, staff, availability, appointments, reviews.
- Acceptance Criteria:
  - AC1: Login as provider.
  - AC2: Edit business info, photos, hours.
  - AC3: Add/edit services and categories.
  - AC4: Manage staff and their schedules.
  - AC5: View calendar of appointments, accept/decline.
  - AC6: View stats (revenue, bookings).

### 17. Admin Dashboard
- Priority: P1
- Description: Super admin manages users, businesses, categories, flag content.
- Acceptance Criteria:
  - AC1: Approve/reject business registrations.
  - AC2: Disable users/businesses.
  - AC3: Manage category taxonomy.
  - AC4: View platform metrics.

### 18. Background Jobs (BullMQ)
- Priority: P0
- Description: Async processing for notifications, slot caching, reminder emails, analytics.
- Acceptance Criteria:
  - AC1: Queue for sending emails/SMS with retry.
  - AC2: Cron job for daily reminder dispatch.
  - AC3: Worker computes availability cache for popular businesses.
  - AC4: Failed jobs logged and monitored.

## Priority Legend
- P0: MVP must-have
- P1: Important post-launch
- P2: Future enhancement (not detailed here)
