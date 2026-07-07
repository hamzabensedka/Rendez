# Planity Clone - Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting clients with beauty and wellness professionals (salons, barbers, spas). It allows discovery, booking, payments, and management for clients, providers, and admins.

## 2. Goals
- Enable seamless booking of beauty services.
- Provide providers a portal to manage slots and appointments.
- Admin oversight of platform.

## 3. Personas
- Client (end-user)
- Provider (business owner)
- Admin

## 4. Feature Specifications

### 4.1 User Authentication
Description: Sign up/login via email, phone, social (Google/Apple). JWT-based.
Acceptance Criteria:
- AC1: User can register with email and password, receive verification email.
- AC2: User can login and receive JWT.
- AC3: Password reset flow works.
- AC4: Social login returns valid session.
Priority: Must

### 4.2 Guest Browse and Explore
Description: Non-logged users can browse categories and featured businesses.
Acceptance Criteria:
- AC1: Guest can view home with featured list.
- AC2: Guest prompted to login when attempting booking.
Priority: Must

### 4.3 Business Search and Discovery
Description: Search by name, service, filters (price, rating, distance).
Acceptance Criteria:
- AC1: Search returns relevant businesses.
- AC2: Filters apply correctly.
Priority: Must

### 4.4 Map-based Search
Description: Show businesses on map with geolocation.
Acceptance Criteria:
- AC1: Map displays pins for businesses in viewport.
- AC2: Tap pin opens preview.
Priority: Should

### 4.5 Business Detail View
Description: Show info: photos, services, staff, reviews, hours.
Acceptance Criteria:
- AC1: Displays all required info.
- AC2: Book button initiates flow.
Priority: Must

### 4.6 Service Categories
Description: Tree of categories (Hair, Nails, etc.) with subcategories.
Acceptance Criteria:
- AC1: Categories seeded and browsable.
- AC2: Selecting category filters businesses.
Priority: Must

### 4.7 Booking Flow
Description: Select service, staff, date, slot, confirm, pay.
Acceptance Criteria:
- AC1: User can complete booking in 5 steps or less.
- AC2: Slot availability checked real-time.
- AC3: Confirmation shown and saved.
Priority: Must

### 4.8 Appointment Management
Description: List upcoming/past appointments, reschedule, cancel.
Acceptance Criteria:
- AC1: Client sees appointments.
- AC2: Cancellation respects policy.
Priority: Must

### 4.9 Favorites
Description: Save businesses to favorites.
Acceptance Criteria:
- AC1: Add/remove favorite.
- AC2: Favorites list view.
Priority: Should

### 4.10 User Profile
Description: Edit personal info, payment methods, notifications pref.
Acceptance Criteria:
- AC1: Update name, phone.
- AC2: View booking history.
Priority: Must

### 4.11 Availability and Slot Computation
Description: Provider sets working hours, breaks, service duration; system computes free slots.
Acceptance Criteria:
- AC1: Correctly generate slots excluding breaks.
- AC2: Handle multiple staff.
Priority: Must

### 4.12 Shared Types and Design System
Description: Common TS types, UI components (buttons, cards) for consistency.
Acceptance Criteria:
- AC1: Design system documented.
- AC2: Used across app.
Priority: Must

### 4.13 Reviews and Ratings
Description: Clients rate after appointment; display aggregate.
Acceptance Criteria:
- AC1: Submit star and text review.
- AC2: Business shows average rating.
Priority: Should

### 4.14 Payment Integration
Description: Stripe/PayPal for booking deposit/full.
Acceptance Criteria:
- AC1: Successful charge.
- AC2: Refund on cancellation per policy.
Priority: Must

### 4.15 Notifications
Description: Push/email/SMS for booking confirm, reminders.
Acceptance Criteria:
- AC1: Send confirmation immediately.
- AC2: Reminder 24h before.
Priority: Must

### 4.16 Provider / Business Owner Portal
Description: Web dashboard for providers to manage profile, services, staff, slots, appointments.
Acceptance Criteria:
- AC1: CRUD on services.
- AC2: View appointment calendar.
- AC3: Set availability.
Priority: Must

### 4.17 Admin Dashboard
Description: Manage users, providers, categories, moderate reviews.
Acceptance Criteria:
- AC1: Suspend user.
- AC2: Create category.
Priority: Should

### 4.18 Background Jobs (BullMQ)
Description: Async jobs: send notifications, compute slots, sync payments.
Acceptance Criteria:
- AC1: Job queued and processed.
- AC2: Failure retry.
Priority: Must

## 5. Prioritization Summary
Must have: Authentication, Guest Browse, Search, Business Detail, Categories, Booking, Appointment, Profile, Availability, Design System, Payment, Notifications, Provider Portal, BullMQ.
Should have: Map Search, Favorites, Reviews, Admin Dashboard.