# Planity Clone – Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specifications and acceptance criteria for Planity Clone, ensuring all user needs are captured and prioritized.

## Overview
Planity Clone is a mobile-first platform connecting clients with beauty and wellness businesses (salons, barbers, spas). It supports guest browsing, authenticated booking, provider management, and admin oversight.

## Feature Specifications

### 1. User Authentication
**Priority:** P0
**Description:** Secure signup/login via email, phone, and social (Google/Apple). JWT-based sessions.
**Acceptance Criteria:**
- User can register with email and password; receives verification email.
- User can login with phone OTP.
- Social login returns valid token and creates account if absent.
- Password reset flow works.
- Sessions persist across app restarts.

### 2. Guest Browse & Explore
**Priority:** P0
**Description:** Non-authenticated users can explore businesses, categories, and deals.
**Acceptance Criteria:**
- Guest can view home feed with featured businesses.
- Guest can open business detail and see services but cannot book.
- Prompt to login appears when attempting booking.

### 3. Business Search & Discovery
**Priority:** P0
**Description:** Text search with filters (category, price, rating, distance).
**Acceptance Criteria:**
- Search returns relevant businesses by name, service, or tag.
- Filters apply correctly and combine.
- Empty state shown when no results.
- Search history saved for logged-in users.

### 4. Map-based Search
**Priority:** P1
**Description:** Interactive map showing business pins; tap to preview.
**Acceptance Criteria:**
- Map loads with user location (with permission) or default city.
- Pins reflect current filters.
- Tap pin shows bottom-sheet with business summary and CTA.
- List/Map toggle works.

### 5. Business Detail View
**Priority:** P0
**Description:** Comprehensive page: gallery, services, staff, hours, reviews.
**Acceptance Criteria:**
- Displays cover image, logo, address, contact.
- Lists services with durations and prices.
- Shows staff members and their bios.
- Shows aggregated rating and review snippets.
- Book button initiates flow.

### 6. Service Categories
**Priority:** P1
**Description:** Hierarchical categories (e.g., Hair > Coloring).
**Acceptance Criteria:**
- Categories seeded from admin.
- Businesses assign services to leaf categories.
- Category landing page lists businesses offering that service.

### 7. Booking Flow
**Priority:** P0
**Description:** Multi-step: select service, staff, date, slot, confirm, pay.
**Acceptance Criteria:**
- Only available slots shown based on staff availability.
- User can select multiple services in one booking.
- Confirmation screen shows summary and total.
- Booking created with status pending until payment.

### 8. Appointment Management
**Priority:** P0
**Description:** User views upcoming/past appointments; cancel/reschedule.
**Acceptance Criteria:**
- List sorted by date.
- Cancel triggers refund policy check.
- Reschedule opens same booking flow with prefilled data.
- Push notification on status change.

### 9. Favorites
**Priority:** P2
**Description:** Users bookmark businesses or services.
**Acceptance Criteria:**
- Heart icon toggles favorite.
- Favorites list accessible from profile.
- Guest favorites stored locally, merged on login.

### 10. User Profile
**Priority:** P1
**Description:** Manage personal info, payment methods, notifications settings.
**Acceptance Criteria:**
- Edit name, phone, avatar.
- Add/remove cards (tokenized).
- Toggle email/SMS/push preferences.

### 11. Availability & Slot Computation
**Priority:** P0
**Description:** Backend logic computing free slots from working hours, breaks, existing bookings.
**Acceptance Criteria:**
- Respects business hours and staff shifts.
- Excludes slots overlapping existing appointments.
- Accounts for service duration and buffer.
- Timezone correct per business.

### 12. Shared Types & Design System
**Priority:** P1
**Description:** Common TS types, UI components, color tokens.
**Acceptance Criteria:**
- Monorepo package with Button, Card, Input, etc.
- Theme supports light/dark.
- Types used across mobile, web, API.

### 13. Reviews & Ratings
**Priority:** P1
**Description:** Post-visit reviews with star rating and text.
**Acceptance Criteria:**
- Only users with completed booking can review.
- Average rating updates in real-time.
- Business owner can respond.
- Inappropriate content flagged.

### 14. Payment Integration
**Priority:** P0
**Description:** Stripe/Apple Pay/Google Pay for deposits or full.
**Acceptance Criteria:**
- PCI-compliant tokenization.
- Handles partial deposit as per business rule.
- Failed payment leaves booking unpaid.
- Receipt emailed.

### 15. Notifications
**Priority:** P1
**Description:** Push (Firebase), email, SMS for booking, reminders, promos.
**Acceptance Criteria:**
- Opt-in push permission requested post-login.
- Reminder sent 24h before appointment.
- Notification center in app.
- Respect user preferences.

### 16. Provider / Business Owner Portal
**Priority:** P0
**Description:** Web dashboard for businesses to manage profile, services, staff, slots, bookings.
**Acceptance Criteria:**
- Login as provider role.
- CRUD services, staff, working hours.
- View calendar of bookings.
- Accept/decline or block slots.
- View basic analytics.

### 17. Admin Dashboard
**Priority:** P1
**Description:** Super-admin manages categories, users, businesses, moderation.
**Acceptance Criteria:**
- Approve/reject business registrations.
- Disable users or businesses.
- Manage category tree.
- View platform metrics.

### 18. Background Jobs (BullMQ)
**Priority:** P1
**Description:** Queue for async tasks: reminders, report generation, image processing.
**Acceptance Criteria:**
- Job for sending reminders at scheduled time.
- Retry on failure with backoff.
- Dashboard to monitor queues.
- Idempotent processing.

## Priorities Summary
- P0: Core MVP (Auth, Browse, Search, Detail, Booking, Availability, Payment, Provider Portal, Appointment)
- P1: Enhancement (Map, Categories, Profile, Design System, Reviews, Notifications, Admin, Jobs)
- P2: Nice-to-have (Favorites)

## Success Metrics
- 80% booking completion rate.
- Under 2s search response.
- 4.5+ app store rating.