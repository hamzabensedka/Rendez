# Planity Clone - Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting clients with beauty & wellness businesses (salons, barbers, spas). It enables discovery, booking, payments, and management for clients, business owners, and admins.

## 2. Personas
- Client: books appointments, browses, pays.
- Business Owner: manages services, availability, appointments.
- Admin: oversees platform, manages categories, monitors jobs.

## 3. Feature Specifications

### 3.1 User Authentication
- Description: Sign up/login via email, phone, social (Google/Apple). JWT-based.
- Acceptance Criteria:
  - User can register with email and password; receives verification.
  - User can login and logout.
  - Password reset flow works.
  - Social login returns valid session.
- Priority: P0

### 3.2 Guest Browse & Explore
- Description: Non-authenticated users can explore businesses, categories, and deals.
- AC:
  - Guest can view home feed and business list.
  - Guest prompted to login when attempting to book.
- Priority: P1

### 3.3 Business Search & Discovery
- Description: Search by name, service, or keyword with filters (price, rating, distance).
- AC:
  - Search returns relevant businesses.
  - Filters apply correctly.
  - Empty state shown when no results.
- Priority: P0

### 3.4 Map-based Search
- Description: View businesses on map with geolocation; tap pin for preview.
- AC:
  - Map shows pins within viewport.
  - User can pan/zoom and results update.
  - Tap pin opens business preview sheet.
- Priority: P1

### 3.5 Business Detail View
- Description: Show info: photos, services, staff, hours, reviews, location.
- AC:
  - All sections render.
  - Book CTA visible.
  - Shows next available slot.
- Priority: P0

### 3.6 Service Categories
- Description: Taxonomy of categories (Hair, Nails, Massage) and sub-services.
- AC:
  - Categories displayed on home.
  - Selecting category filters businesses.
  - Admin can CRUD categories.
- Priority: P0

### 3.7 Booking Flow
- Description: Multi-step: select service -> staff -> date/time -> confirm -> pay.
- AC:
  - Only available slots selectable.
  - User can apply favorite payment.
  - Confirmation screen and notification sent.
- Priority: P0

### 3.8 Appointment Management
- Description: List upcoming/past appointments; reschedule, cancel.
- AC:
  - User sees status (confirmed, completed, cancelled).
  - Cancellation respects policy (e.g., 24h).
  - Reschedule opens slot picker.
- Priority: P0

### 3.9 Favorites
- Description: Save businesses or staff to favorites.
- AC:
  - Heart icon toggles state.
  - Favorites list accessible from profile.
  - Syncs across devices.
- Priority: P2

### 3.10 User Profile
- Description: Manage personal info, payment methods, notifications settings.
- AC:
  - Edit name, phone, avatar.
  - Add/remove card (tokenized).
  - Toggle push/email pref.
- Priority: P1

### 3.11 Availability & Slot Computation
- Description: Compute slots from business hours, staff shifts, service duration, existing bookings.
- AC:
  - Correctly excludes breaks and booked times.
  - Handles timezone.
  - Returns 15-min granularity slots.
- Priority: P0

### 3.12 Shared Types & Design System
- Description: Common UI components (buttons, cards) and TS types for consistency.
- AC:
  - Design system documented (Figma + code).
  - Types used across frontend/backend.
  - Theming supports light/dark.
- Priority: P1

### 3.13 Reviews & Ratings
- Description: Clients rate after appointment; display aggregate.
- AC:
  - 1-5 star + text, posted only for completed appt.
  - Business detail shows average and recent.
  - Owner can respond.
- Priority: P1

### 3.14 Payment Integration
- Description: Stripe/PayPal for booking deposit/full payment.
- AC:
  - Card saved via tokenization.
  - Payment success/failure handled.
  - Refund via admin/owner.
- Priority: P0

### 3.15 Notifications
- Description: Push (Firebase) + email for booking, reminders, promos.
- AC:
  - Reminder 24h before appointment.
  - Opt-out respected.
  - Localization supported.
- Priority: P1

### 3.16 Provider / Business Owner Portal
- Description: Web dashboard for owners to manage profile, services, staff, availability, appointments, reviews.
- AC:
  - Owner can add/edit services with prices/durations.
  - Set weekly hours and exceptions.
  - View calendar and export.
- Priority: P0

### 3.17 Admin Dashboard
- Description: Super admin manages users, businesses, categories, monitor jobs.
- AC:
  - Approve/reject business registrations.
  - Suspend users.
  - View analytics (bookings, revenue).
- Priority: P1

### 3.18 Background Jobs (BullMQ)
- Description: Async jobs: send notifications, compute availability cache, sync payments, cleanup.
- AC:
  - Job queue processes reliably with retries.
  - Failed jobs logged and alerted.
  - No duplicate notifications.
- Priority: P1

## 4. Prioritization Summary
- P0: Core MVP (Auth, Search, Detail, Categories, Booking, Appt, Availability, Payment, Owner Portal)
- P1: Enhancements (Guest, Map, Profile, Design, Reviews, Notifs, Admin, Jobs)
- P2: Nice-to-have (Favorites)

## 5. Open Questions
- Specific cancellation policy per business?
- Multi-language support scope?