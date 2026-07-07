# Planity Clone - Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting clients with beauty & wellness businesses (salons, barbers, spas). It supports discovery, booking, payments, and management for clients, providers, and admins.

## 2. Feature Specifications

### 2.1 User Authentication (Priority: P0)
**Description:** Secure sign-up/login via email, phone, and OAuth (Google/Apple). JWT-based sessions.
**Acceptance Criteria:**
- User can register with email+password; receives verification email.
- User can login with phone OTP.
- OAuth providers redirect and create account.
- Password reset flow works.
- Token refresh handled securely.

### 2.2 Guest Browse & Explore (Priority: P0)
**Description:** Non-authenticated users can browse businesses and services.
**Acceptance Criteria:**
- Guest sees curated lists (popular, nearby, new).
- Guest can view business detail but booking prompts login.
- No personal data stored for guest.

### 2.3 Business Search & Discovery (Priority: P0)
**Description:** Text search with filters (category, price, rating, distance).
**Acceptance Criteria:**
- Search returns relevant businesses with debounce.
- Filters apply correctly and combine.
- Empty state shown when no results.

### 2.4 Map-based Search (Priority: P1)
**Description:** Interactive map showing business pins; tap to preview.
**Acceptance Criteria:**
- Map loads with user location permission.
- Pins reflect current filters.
- Selecting pin opens bottom sheet with summary.

### 2.5 Business Detail View (Priority: P0)
**Description:** Full profile: photos, services, staff, hours, reviews.
**Acceptance Criteria:**
- Displays all required info from API.
- Shows real-time availability slots.
- CTA to book or favorite.

### 2.6 Service Categories (Priority: P0)
**Description:** Taxonomy of services (Hair, Nails, Massage, etc.).
**Acceptance Criteria:**
- Categories hierarchical and seeded.
- Businesses assign services to categories.
- Navigation by category works.

### 2.7 Booking Flow (Priority: P0)
**Description:** Multi-step: select service, staff, slot, confirm, pay.
**Acceptance Criteria:**
- Only available slots selectable.
- Price calculated correctly (service + add-ons).
- Confirmation screen and email sent.
- Concurrent booking lock prevents double-book.

### 2.8 Appointment Management (Priority: P0)
**Description:** User sees upcoming/past appointments; can reschedule/cancel.
**Acceptance Criteria:**
- List synced with backend.
- Cancel respects business policy (free within X hours).
- Reschedule opens slot picker.

### 2.9 Favorites (Priority: P1)
**Description:** Save businesses/services for quick access.
**Acceptance Criteria:**
- Add/remove from detail view and list.
- Favorites list view accessible from profile.
- Persists across sessions.

### 2.10 User Profile (Priority: P0)
**Description:** Manage personal info, payment methods, notifications pref.
**Acceptance Criteria:**
- Edit name, phone, avatar.
- View booking history.
- Toggle notification settings.

### 2.11 Availability & Slot Computation (Priority: P0)
**Description:** Backend logic generating slots from business hours, service duration, staff shifts, and existing bookings.
**Acceptance Criteria:**
- Generates 15/30-min slots based on service length.
- Excludes breaks and booked times.
- Handles timezone correctly.
- Recalculates on any schedule change.

### 2.12 Shared Types & Design System (Priority: P0)
**Description:** Common TS types, UI components (buttons, cards, colors) for web/mobile.
**Acceptance Criteria:**
- Single source of truth for API models.
- Component library documented.
- Theme consistent across app.

### 2.13 Reviews & Ratings (Priority: P1)
**Description:** Post-visit reviews with star rating and text.
**Acceptance Criteria:**
- Only verified appointments can review.
- Average rating computed and shown.
- Moderation flag for inappropriate content.

### 2.14 Payment Integration (Priority: P0)
**Description:** Stripe/PayPal for booking deposit or full payment.
**Acceptance Criteria:**
- PCI-compliant checkout.
- Handles success/failure/refund.
- Receipt emailed.
- Provider payout scheduled.

### 2.15 Notifications (Priority: P1)
**Description:** Push (FCM/APN) and email for booking, reminders, promos.
**Acceptance Criteria:**
- Opt-in per type.
- Sent via background job.
- Localization supported.

### 2.16 Provider / Business Owner Portal (Priority: P1)
**Description:** Web dashboard for businesses to manage profile, services, staff, slots, bookings.
**Acceptance Criteria:**
- CRUD on services and availability.
- View upcoming appointments.
- Respond to reviews.
- Access analytics.

### 2.17 Admin Dashboard (Priority: P2)
**Description:** Super-admin to manage categories, users, businesses, flag content.
**Acceptance Criteria:**
- Approve/reject business registrations.
- Suspend users.
- View platform metrics.

### 2.18 Background Jobs (BullMQ) (Priority: P1)
**Description:** Queue for notifications, reminder emails, slot recompute, payouts.
**Acceptance Criteria:**
- Jobs retry with backoff.
- Failed jobs logged and alerted.
- Scales with Redis.

## 3. Prioritization Summary
- P0: Core MVP (Auth, Browse, Search, Detail, Categories, Booking, Appt, Profile, Availability, Types, Payment)
- P1: Enhancement (Map, Favorites, Reviews, Notifications, Provider Portal, BullMQ)
- P2: Admin (Admin Dashboard)

## 4. Success Metrics
- Booking conversion > 20%
- Weekly active bookers > 5k in 6 months
- Provider satisfaction > 4.2/5
