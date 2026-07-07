# Planity Clone – Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting clients with local beauty & wellness businesses (salons, barbers, spas). It allows browsing, searching, booking appointments, and managing them, with a provider portal and admin oversight.

## 2. Goals & Non-Goals
- Goals: seamless booking, real-time availability, intuitive discovery.
- Non-Goals: full POS, inventory management (future).

## 3. Feature Specifications

### 3.1 User Authentication
**Priority:** P0
**Description:** Email/phone OTP, social login, session management.
**Acceptance Criteria:**
- User can sign up with email or phone; receives OTP.
- Password reset flow works.
- JWT stored securely; logout invalidates.
- Social login (Google/Apple) returns profile.

### 3.2 Guest Browse & Explore
**Priority:** P0
**Description:** Non-logged users can explore businesses, categories, and deals.
**Acceptance Criteria:**
- Guest can view home feed, categories, business list.
- Attempt to book redirects to auth.
- Guest session tracked for conversion analytics.

### 3.3 Business Search & Discovery
**Priority:** P0
**Description:** Text search with filters (category, rating, distance, price).
**Acceptance Criteria:**
- Search returns relevant businesses by name, service, location.
- Filters apply correctly; results paginated.
- Empty state handled.

### 3.4 Map-based Search
**Priority:** P0
**Description:** Interactive map showing business pins.
**Acceptance Criteria:**
- Map loads with user location (permission handled).
- Pins reflect current filters.
- Tap pin opens preview sheet.

### 3.5 Business Detail View
**Priority:** P0
**Description:** Show info, services, staff, photos, reviews, booking CTA.
**Acceptance Criteria:**
- Displays address, hours, phone, gallery.
- Lists services with prices/durations.
- 'Book' button initiates flow.

### 3.6 Service Categories
**Priority:** P0
**Description:** Taxonomy of services (Hair, Nails, Spa, etc.).
**Acceptance Criteria:**
- Categories seeded; each business maps to subcategories.
- Category landing page lists businesses.

### 3.7 Booking Flow
**Priority:** P0
**Description:** Select service, staff, date, slot, confirm.
**Acceptance Criteria:**
- Stepwise UI: service -> professional -> time -> details -> pay.
- Validation of required fields.
- Confirmation screen with summary.

### 3.8 Appointment Management
**Priority:** P0
**Description:** User sees upcoming/past appointments, can reschedule/cancel.
**Acceptance Criteria:**
- List sorted by date.
- Cancel respects business policy (free within X hours).
- Reschedule opens same booking flow prefilled.

### 3.9 Favorites
**Priority:** P2
**Description:** Save businesses/services.
**Acceptance Criteria:**
- Heart toggle on detail/view.
- Favorites list in profile.
- Push notification for favorite promo (optional).

### 3.10 User Profile
**Priority:** P1
**Description:** Manage personal info, payment methods, notifications settings.
**Acceptance Criteria:**
- Edit name, phone, avatar.
- View saved cards (tokenized).
- Toggle notification preferences.

### 3.11 Availability & Slot Computation
**Priority:** P0
**Description:** Generate available slots from business hours, service duration, existing bookings, staff schedules.
**Acceptance Criteria:**
- Correctly excludes booked intervals.
- Handles multiple staff with different hours.
- Timezone aware.

### 3.12 Shared Types & Design System
**Priority:** P0
**Description:** Common TS types, UI components, color palette, typography.
**Acceptance Criteria:**
- Repo has /shared with types, constants.
- Component library used across apps.
- Dark/light theme tokens.

### 3.13 Reviews & Ratings
**Priority:** P1
**Description:** Clients rate after appointment; display aggregated.
**Acceptance Criteria:**
- 1-5 stars + text, only for completed visits.
- Business detail shows average and recent.
- Flagging inappropriate content.

### 3.14 Payment Integration
**Priority:** P0
**Description:** Stripe/Apple Pay for deposits or full prepay.
**Acceptance Criteria:**
- Add card via Stripe Elements.
- Charge occurs on booking confirm if required.
- Refund on cancel per policy.

### 3.15 Notifications
**Priority:** P1 (P0 for booking confirmations)
**Description:** Push (FCM/APN) and email for booking, reminders, promos.
**Acceptance Criteria:**
- On booking, immediate confirmation push/email.
- Reminder 24h before.
- User can opt-out.

### 3.16 Provider / Business Owner Portal
**Priority:** P0 (basic), P1 (advanced)
**Description:** Web dashboard for businesses to manage profile, services, staff, availability, bookings.
**Acceptance Criteria:**
- Login as provider.
- Edit business info, upload photos.
- Create services, assign staff.
- View calendar, accept/decline bookings.
- Basic analytics (views, bookings).

### 3.17 Admin Dashboard
**Priority:** P1
**Description:** Super admin manages users, businesses, categories, moderation.
**Acceptance Criteria:**
- Approve/reject business registrations.
- Disable accounts.
- Edit global categories.
- View platform metrics.

### 3.18 Background Jobs (BullMQ)
**Priority:** P1
**Description:** Queue for notifications, reminder emails, slot recomputation, analytics.
**Acceptance Criteria:**
- BullMQ workers process jobs reliably.
- Failed jobs retry with backoff.
- Monitoring endpoint.

## 4. Prioritization Summary
- P0 (MVP): Auth, Guest Browse, Search, Map, Detail, Categories, Booking, Appointments, Availability, Shared Types, Payment, Provider basic.
- P1: Profile, Reviews, Notifications, Admin, Background Jobs, Provider advanced.
- P2: Favorites.

## 5. Success Metrics
- Booking conversion > 20% from detail view.
- App crash-free sessions > 99%.
- Provider onboarding < 15 min.
