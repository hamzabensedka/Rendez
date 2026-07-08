# Planity Clone - Product Specification

## Introduction
Planity Clone is a mobile-first marketplace for booking beauty and wellness appointments. This document defines features, acceptance criteria, and priorities.

## Feature List

### 1. User Authentication
**Priority:** P0
**Goal:** Secure access for clients.
**Acceptance Criteria:**
- Users can sign up with email or phone number.
- OTP or email verification required.
- Login with JWT refresh tokens.
- Password reset flow works.
- Social login (Google/Apple) supported.
- Roles: client, provider, admin.

### 2. Guest Browse & Explore
**Priority:** P1
**Goal:** Allow discovery without account.
**Acceptance Criteria:**
- Guests can view home, categories, business lists.
- Guests can open business detail but booking prompts login.
- No personal data stored for guests.

### 3. Business Search & Discovery
**Priority:** P0
**Goal:** Find businesses easily.
**Acceptance Criteria:**
- Search by name, service, or keyword.
- Filters: category, price, rating, distance.
- Results paginated, sorted by relevance.
- Search history for logged-in users.

### 4. Map-based Search
**Priority:** P1
**Goal:** Geolocation discovery.
**Acceptance Criteria:**
- Interactive map shows business markers.
- User can set radius (1-20 km).
- Tapping marker opens preview card.
- Uses device location with permission prompt.

### 5. Business Detail View
**Priority:** P0
**Goal:** Show full business info.
**Acceptance Criteria:**
- Cover image, gallery, description.
- List of services with prices/durations.
- Staff list if applicable.
- Reviews summary and booking button.
- Display address, hours, contact.

### 6. Service Categories
**Priority:** P0
**Goal:** Organize offerings.
**Acceptance Criteria:**
- Hierarchical categories (e.g., Hair > Coloring).
- Seeded from admin.
- Each business assigns services to categories.
- Category icons in design system.

### 7. Booking Flow
**Priority:** P0
**Goal:** Reserve appointment.
**Acceptance Criteria:**
- Select business, service, staff (optional), date, slot.
- Show price and duration.
- Login required at confirmation.
- Support multiple services in one cart.
- Confirmation screen with summary.

### 8. Appointment Management
**Priority:** P0
**Goal:** Manage user bookings.
**Acceptance Criteria:**
- List upcoming and past appointments.
- Cancel with policy check (free/penalty).
- Reschedule redirects to slot picker.
- Status: confirmed, completed, cancelled.

### 9. Favorites
**Priority:** P2
**Goal:** Save businesses.
**Acceptance Criteria:**
- Heart icon on cards and detail.
- Favorites list in profile.
- Push notification for favorite's promo (optional).

### 10. User Profile
**Priority:** P1
**Goal:** Manage personal data.
**Acceptance Criteria:**
- Edit name, photo, phone, preferences.
- View booking history, reviews given.
- Delete account with data purge.

### 11. Availability & Slot Computation
**Priority:** P0
**Goal:** Generate bookable slots.
**Acceptance Criteria:**
- Based on business hours, service duration, breaks.
- Exclude already booked slots.
- Handle multiple staff with individual calendars.
- Timezone aware.
- Recompute on changes via background job.

### 12. Shared Types & Design System
**Priority:** P1
**Goal:** Consistency across app.
**Acceptance Criteria:**
- TypeScript types for User, Business, Booking, etc.
- Reusable UI components: Button, Card, Modal.
- Theme tokens: color, spacing, typography.
- Used by mobile and web.

### 13. Reviews & Ratings
**Priority:** P1
**Goal:** Build trust.
**Acceptance Criteria:**
- Clients rate 1-5 stars after completed appointment.
- Text review optional, max 500 chars.
- Business can reply.
- Admin can hide inappropriate content.
- Average rating shown on detail.

### 14. Payment Integration
**Priority:** P0
**Goal:** Collect payments.
**Acceptance Criteria:**
- Stripe integration for cards.
- Support full pay or deposit.
- Webhook for payment status.
- Refund/cancel logic per policy.
- PCI compliant, no raw card data stored.

### 15. Notifications
**Priority:** P1
**Goal:** Engage and remind.
**Acceptance Criteria:**
- Email on booking confirm.
- Push via Firebase for reminders 24h before.
- SMS OTP for auth.
- User can toggle preferences.

### 16. Provider / Business Owner Portal
**Priority:** P0
**Goal:** Empower businesses.
**Acceptance Criteria:**
- Onboard business profile, locations.
- Manage services, staff, working hours.
- View calendar of appointments.
- Accept/decline bookings (if manual).
- Payout dashboard.

### 17. Admin Dashboard
**Priority:** P1
**Goal:** Platform oversight.
**Acceptance Criteria:**
- Manage users, providers, categories.
- Moderate reviews, flag content.
- View analytics: bookings, revenue.
- Impersonate for support.

### 18. Background Jobs (BullMQ)
**Priority:** P1
**Goal:** Async processing.
**Acceptance Criteria:**
- Queue for sending notifications.
- Slot recomputation on schedule change.
- Retry with exponential backoff.
- Dead letter queue for failures.
- Monitor via Redis insights.

## Priorities Summary
P0: Must-have for MVP. P1: Important post-MVP. P2: Nice-to-have.

## Out of Scope
- Real-time video consultations.
- Multi-language support (future).