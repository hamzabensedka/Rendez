# Planity Clone - Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting clients with beauty & wellness businesses (salons, barbers, spas). It supports discovery, booking, payments, and management for clients, providers, and admins.

## 2. Feature Specifications

### 2.1 User Authentication
- Description: Sign up, login, social auth, password reset.
- Acceptance Criteria:
  - User can register with email/phone and password.
  - User can login with JWT token returned.
  - Social login (Google/Apple) works.
  - Password reset via email.
- Priority: P0

### 2.2 Guest Browse & Explore
- Description: Non-logged users can browse businesses and services.
- AC:
  - Guest can view business list and detail.
  - Guest can search but must login to book.
- Priority: P0

### 2.3 Business Search & Discovery
- Description: Search by name, category, filters (price, rating, distance).
- AC:
  - Search returns relevant results.
  - Filters apply correctly.
- Priority: P0

### 2.4 Map-based Search
- Description: Show businesses on map with geolocation.
- AC:
  - Map displays pins for businesses.
  - Tap pin shows summary card.
  - Radius filter works.
- Priority: P1

### 2.5 Business Detail View
- Description: Full info: photos, services, staff, reviews, hours.
- AC:
  - Displays all required sections.
  - Shows available slots for selected service.
- Priority: P0

### 2.6 Service Categories
- Description: Hierarchical categories (e.g., Hair > Coloring).
- AC:
  - Categories tree manageable by admin.
  - Businesses assign services to categories.
- Priority: P1

### 2.7 Booking Flow
- Description: Select service, staff, date, slot, confirm.
- AC:
  - Multi-step flow with validation.
  - Shows price and duration.
  - Confirmation creates appointment.
- Priority: P0

### 2.8 Appointment Management
- Description: View upcoming/past, reschedule, cancel.
- AC:
  - User can cancel with policy enforced.
  - Provider can accept/decline.
- Priority: P0

### 2.9 Favorites
- Description: Save businesses/services.
- AC:
  - User can favorite/unfavorite.
  - List view in profile.
- Priority: P2

### 2.10 User Profile
- Description: Personal info, addresses, payment methods.
- AC:
  - Edit name, phone, avatar.
  - Add default address.
- Priority: P1

### 2.11 Availability & Slot Computation
- Description: Compute free slots based on working hours, existing bookings, service duration.
- AC:
  - Accurate slot generation per staff.
  - Handles breaks and holidays.
- Priority: P0

### 2.12 Shared Types & Design System
- Description: Common TS types, UI components, theme.
- AC:
  - Reusable components documented.
  - Consistent styling across app.
- Priority: P1

### 2.13 Reviews & Ratings
- Description: Post-review after appointment, star ratings.
- AC:
  - Only verified clients can review.
  - Average rating computed.
- Priority: P1

### 2.14 Payment Integration
- Description: Stripe/PayPal for deposits/full payment.
- AC:
  - Secure checkout.
  - Refund handled on cancellation.
- Priority: P0

### 2.15 Notifications
- Description: Push/email/SMS for booking, reminders.
- AC:
  - Triggered on events.
  - User can opt-out.
- Priority: P1

### 2.16 Provider / Business Owner Portal
- Description: Manage business profile, services, staff, schedule, bookings.
- AC:
  - CRUD on services and availability.
  - View analytics dashboard.
- Priority: P0

### 2.17 Admin Dashboard
- Description: Platform-wide management: users, businesses, categories, moderation.
- AC:
  - Approve/reject business registrations.
  - Disable accounts.
- Priority: P1

### 2.18 Background Jobs (BullMQ)
- Description: Async tasks: reminders, slot cleanup, report generation.
- AC:
  - Jobs queued and processed reliably.
  - Failure retry logic.
- Priority: P1

## 3. Priorities Summary
- P0: Core MVP (Auth, Search, Booking, etc.)
- P1: Enhancements (Map, Provider, Admin)
- P2: Nice-to-have (Favorites)

## 4. Out of Scope
- Real-time video consultation.
- Multi-currency beyond EUR/USD.