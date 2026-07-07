# Planity Clone - Product Specification

## Overview
Planity Clone is a mobile-first platform connecting clients with beauty & wellness businesses (salons, barbers, spas). This spec defines features, acceptance criteria, and priorities for v1.

## Feature List and Details

### 1. User Authentication
- Description: Sign up/login via email, phone OTP, Google/Apple.
- Acceptance Criteria:
  - User can register with email+password; receives verification email.
  - User can login with OTP sent to phone.
  - Social login returns valid session.
  - JWT stored securely; logout clears session.
  - Password reset flow works.
- Priority: P0

### 2. Guest Browse & Explore
- Description: Non-logged users can browse businesses and services.
- Acceptance Criteria:
  - Guest can view home feed of featured businesses.
  - Guest can view business detail and services but booking prompts login.
  - No personal data stored for guest.
- Priority: P0

### 3. Business Search & Discovery
- Description: Search by name, service, or keyword with filters.
- Acceptance Criteria:
  - Search returns relevant businesses with pagination.
  - Filters: category, price range, rating, distance.
  - Empty state shown when no results.
- Priority: P0

### 4. Map-based Search
- Description: View businesses on map with geolocation.
- Acceptance Criteria:
  - Map shows pins for businesses within viewport.
  - Tap pin opens mini detail sheet.
  - User can center on current location.
  - Filter map results using same filters as search.
- Priority: P1

### 5. Business Detail View
- Description: Full page with info, services, staff, photos, reviews.
- Acceptance Criteria:
  - Shows address, hours, contact, gallery.
  - Lists services with prices and durations.
  - Shows aggregate rating and review count.
  - Book CTA initiates booking flow.
- Priority: P0

### 6. Service Categories
- Description: Taxonomy of services (Hair, Nails, Spa, etc.).
- Acceptance Criteria:
  - Categories seeded in DB; hierarchical if needed.
  - Businesses assign services to categories.
  - Home shows category tiles linking to filtered search.
- Priority: P0

### 7. Booking Flow
- Description: Multi-step: select service, staff, date, slot, confirm.
- Acceptance Criteria:
  - Only available slots shown based on availability engine.
  - User can select or skip staff (any).
  - Shows price and duration summary.
  - On confirm, appointment created and payment triggered (if required).
  - Validation prevents double booking.
- Priority: P0

### 8. Appointment Management
- Description: User sees upcoming/past appointments; can reschedule/cancel.
- Acceptance Criteria:
  - List sorted by date; statuses: confirmed, completed, cancelled.
  - Cancel respects business policy (e.g., 24h).
  - Reschedule opens booking flow prefilled.
  - Push/email confirmation sent.
- Priority: P0

### 9. Favorites
- Description: Save businesses for quick access.
- Acceptance Criteria:
  - Heart icon toggles favorite; persisted per user.
  - Favorites list view accessible from profile.
  - Removing updates UI instantly.
- Priority: P1

### 10. User Profile
- Description: Manage personal info, payment methods, notifications settings.
- Acceptance Criteria:
  - Edit name, phone, email.
  - View saved addresses.
  - Manage notification preferences.
  - Delete account with confirmation.
- Priority: P1

### 11. Availability & Slot Computation
- Description: Engine computing open slots from business hours, staff schedules, existing bookings.
- Acceptance Criteria:
  - Generates slots at configurable intervals (e.g., 15/30 min).
  - Considers service duration and buffer.
  - Handles staff breaks and days off.
  - Exposes API used by booking and provider portal.
- Priority: P0

### 12. Shared Types & Design System
- Description: Common TS types, UI components, theme.
- Acceptance Criteria:
  - Monorepo package with Button, Input, Card, etc.
  - Consistent color typography per brand.
  - Types for User, Business, Appointment shared across apps.
- Priority: P0 (foundational)

### 13. Reviews & Ratings
- Description: Clients rate after appointment; display on business.
- Acceptance Criteria:
  - Only verified appointments can review.
  - Star rating 1-5 and text optional.
  - Average rating recalculated on new review.
  - Business can reply (provider portal).
- Priority: P1

### 14. Payment Integration
- Description: Stripe/Apple Pay for deposits or full payment.
- Acceptance Criteria:
  - Secure checkout with PCI compliance via Stripe.
  - Handles success/failure webhooks.
  - Refund initiated on cancel if applicable.
  - Payment history in profile.
- Priority: P0

### 15. Notifications
- Description: Push (Firebase), email, SMS for booking events.
- Acceptance Criteria:
  - Sends confirmation, reminder (24h before), cancelled.
  - User can opt-out per channel.
  - Provider gets new booking alert.
- Priority: P1

### 16. Provider / Business Owner Portal
- Description: Web app for businesses to manage profile, services, staff, slots, bookings.
- Acceptance Criteria:
  - Login as provider role.
  - CRUD business info, services, categories.
  - Manage staff schedules and availability.
  - View upcoming appointments, manually create.
  - Respond to reviews.
- Priority: P0

### 17. Admin Dashboard
- Description: Super admin manages users, businesses, categories, flags.
- Acceptance Criteria:
  - Approve/reject business registrations.
  - Disable users or businesses.
  - View platform metrics (bookings, revenue).
  - Manage service category taxonomy.
- Priority: P1

### 18. Background Jobs (BullMQ)
- Description: Queue for async tasks: reminders, slot computation, emails.
- Acceptance Criteria:
  - BullMQ workers process jobs with retry.
  - Job types: sendNotification, computeAvailability, exportReport.
  - Failed jobs logged and observable.
  - Scales horizontally.
- Priority: P1

## Priorities Summary
- P0: Core MVP (Auth, Browse, Search, Detail, Categories, Booking, Appt, Availability, Design System, Payment, Provider Portal)
- P1: Enhancements (Map, Favorites, Profile, Reviews, Notifications, Admin, Background Jobs)
- P2: Future (loyalty, multi-location, etc.) not in v1.