# Planity Clone - Product Specification

## Overview
Planity Clone is a mobile-first platform connecting clients with beauty and wellness businesses (salons, barbers, spas). It supports discovery, booking, payments, and management for clients, business owners, and admins.

## Feature List and Priorities

### 1. User Authentication
**Priority:** P0
**Description:** Secure signup/login via email, phone, social (Google/Apple). JWT-based sessions.
**Acceptance Criteria:**
- Given a new user, when they submit valid email/password, then account is created and verification email sent.
- Given a registered user, when they login with correct credentials, then they receive a JWT token.
- Passwords are hashed (bcrypt). Social login returns user profile.
- Logout invalidates token.

### 2. Guest Browse and Explore
**Priority:** P0
**Description:** Non-authenticated users can browse businesses, categories, and view details.
**Acceptance Criteria:**
- Guest can open app and see featured businesses and categories.
- Guest can view business detail and services but booking prompts login.
- No personal data stored for guest.

### 3. Business Search and Discovery
**Priority:** P0
**Description:** Text search with filters (category, price, rating, distance).
**Acceptance Criteria:**
- User can search by keyword and apply filters.
- Results paginated, sorted by relevance/distance.
- Empty state shown when no results.

### 4. Map-based Search
**Priority:** P1
**Description:** Interactive map showing business pins; tap to view summary.
**Acceptance Criteria:**
- Map displays businesses within viewport.
- Pin clustering for dense areas.
- Selecting pin opens bottom sheet with quick info and link to detail.

### 5. Business Detail View
**Priority:** P0
**Description:** Full profile: photos, services, staff, hours, reviews.
**Acceptance Criteria:**
- Shows cover image, list of services with prices/durations.
- Displays aggregate rating and recent reviews.
- Book button initiates booking flow.

### 6. Service Categories
**Priority:** P0
**Description:** Taxonomy of services (Hair, Nails, Spa, etc.) with subcategories.
**Acceptance Criteria:**
- Categories seeded from admin.
- Each business assigns offered categories/services.
- Client can browse by category from home.

### 7. Booking Flow
**Priority:** P0
**Description:** Multi-step: select service, staff (optional), date/time, confirm, pay.
**Acceptance Criteria:**
- Only available slots shown based on availability computation.
- User can select multiple services in one booking.
- On confirm, appointment created with pending payment status.
- Success screen with add-to-calendar option.

### 8. Appointment Management
**Priority:** P0
**Description:** User sees upcoming/past appointments; can reschedule/cancel per policy.
**Acceptance Criteria:**
- List grouped by upcoming/past.
- Cancel allowed up to X hours before; triggers notification to provider.
- Reschedule opens booking with pre-filled service.

### 9. Favorites
**Priority:** P1
**Description:** Users bookmark businesses.
**Acceptance Criteria:**
- Heart icon on business card/detail toggles favorite.
- Favorites list accessible from profile.
- Removing updates UI instantly.

### 10. User Profile
**Priority:** P0
**Description:** Manage personal info, payment methods, notifications settings.
**Acceptance Criteria:**
- User can edit name, phone, avatar.
- Can add/remove cards (Stripe tokenization).
- Can opt-in/out of push/email.

### 11. Availability and Slot Computation
**Priority:** P0
**Description:** Backend computes slots from business hours, service duration, staff shifts, existing bookings.
**Acceptance Criteria:**
- Given business open 9-17, service 60min, no bookings, then slots at 9,10,11,12,13,14,15,16.
- Buffer times respected.
- Closed days excluded.
- Concurrent bookings for multiple staff allowed.

### 12. Shared Types and Design System
**Priority:** P0
**Description:** Common TS types, UI components (buttons, cards, modals) for web/mobile.
**Acceptance Criteria:**
- Monorepo package with types (User, Business, Appointment, etc.).
- Component library documented (Storybook).
- Consistent theme tokens (color, spacing).

### 13. Reviews and Ratings
**Priority:** P1
**Description:** Clients rate visit (1-5 stars + text) after completed appointment.
**Acceptance Criteria:**
- Review prompt triggered post-appointment.
- Only verified clients can review.
- Business detail shows average and count.

### 14. Payment Integration
**Priority:** P0
**Description:** Stripe for cards, optional wallet; handles auth, capture, refund.
**Acceptance Criteria:**
- User can pay deposit or full amount.
- Failed payment leaves appointment pending; retry allowed.
- Refund via admin/provider triggers Stripe refund.

### 15. Notifications
**Priority:** P1 (core P0 for booking alerts)
**Description:** Push (FCM/APN), email for booking confirm, remind, cancel.
**Acceptance Criteria:**
- On booking, user and provider get push/email.
- Reminder sent 24h before via background job.
- User can disable marketing notifications.

### 16. Provider / Business Owner Portal
**Priority:** P1
**Description:** Web dashboard for businesses to manage profile, services, staff, slots, appointments.
**Acceptance Criteria:**
- Owner can edit business info, add services, set hours.
- View day/week calendar of appointments.
- Accept/decline bookings (if manual confirmation).

### 17. Admin Dashboard
**Priority:** P1
**Description:** Super admin manages categories, users, businesses, disputes.
**Acceptance Criteria:**
- CRUD for categories and service templates.
- Suspend user/business.
- View platform metrics (bookings, revenue).

### 18. Background Jobs (BullMQ)
**Priority:** P0
**Description:** Queue for slot generation, reminder emails, analytics, webhooks.
**Acceptance Criteria:**
- Job sendReminder scheduled 24h pre-appointment.
- Failed jobs retried with backoff.
- Queue dashboard for monitoring.

## Prioritization Summary
- P0 (MVP): 1,2,3,5,6,7,8,10,11,12,14,18
- P1: 4,9,13,15,16,17
- P2: future enhancements (loyalty, multi-location) out of scope.

## Success Metrics
- 80% booking completion rate.
- Less than 2s search latency.
- 4.5+ app store rating.