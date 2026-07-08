# Planity Clone - Product Specification

## Overview
Planity Clone is a mobile-first platform connecting clients with beauty & wellness businesses (salons, barbers, spas). It supports discovery, booking, payments, and management for customers, business owners, and admins.

## Feature List and Specifications

### 1. User Authentication
**Priority:** P0
**Description:** Secure signup/login via email, phone (OTP), and social (Google/Apple). JWT-based sessions with refresh tokens.
**Acceptance Criteria:**
- User can register with email+password or phone OTP.
- Passwords hashed (bcrypt).
- JWT access + refresh tokens issued; refresh rotates.
- Social login returns verified email.
- Logout invalidates tokens.
- Error states shown for invalid credentials.

### 2. Guest Browse & Explore
**Priority:** P0
**Description:** Non-authenticated users can explore businesses, categories, and deals.
**Acceptance Criteria:**
- Guest can view home feed of featured businesses.
- Guest can open business detail but booking prompts login.
- No personal data stored for guest.

### 3. Business Search & Discovery
**Priority:** P0
**Description:** Text search with filters (category, price, rating, distance).
**Acceptance Criteria:**
- Search returns relevant businesses by name, service, or tag.
- Filters apply correctly and combine.
- Results paginated (20 per page).
- Empty state handled.

### 4. Map-based Search
**Priority:** P1
**Description:** Interactive map (Mapbox/Google) showing business pins.
**Acceptance Criteria:**
- Map shows pins within viewport.
- Tap pin opens preview card.
- "Search this area" updates results.
- User location permission handled gracefully.

### 5. Business Detail View
**Priority:** P0
**Description:** Comprehensive page with info, services, staff, hours, gallery, reviews.
**Acceptance Criteria:**
- Displays address, contact, hours, services list with prices.
- Shows aggregate rating and recent reviews.
- "Book" CTA initiates booking flow.
- Gallery images lazy-loaded.

### 6. Service Categories
**Priority:** P0
**Description:** Taxonomy of categories (Hair, Nails, Spa, etc.) and sub-services.
**Acceptance Criteria:**
- Categories seed data present.
- Each business assigns categories.
- Category page lists businesses offering it.
- Sub-services link to parent.

### 7. Booking Flow
**Priority:** P0
**Description:** Multi-step: select service -> staff -> date/time -> confirm -> pay.
**Acceptance Criteria:**
- Only available slots shown (from Availability module).
- User can select or skip staff.
- Summary shown before confirm.
- On confirm, appointment created and notification sent.
- If unpaid, hold slot for 10 min (via background job).

### 8. Appointment Management
**Priority:** P0
**Description:** Users view upcoming/past appointments, reschedule, cancel.
**Acceptance Criteria:**
- List sorted by date.
- Cancel respects business policy (free cancel >24h).
- Reschedule opens booking with prefilled data.
- Status synced with provider portal.

### 9. Favorites
**Priority:** P2
**Description:** Users bookmark businesses.
**Acceptance Criteria:**
- Heart icon toggles favorite.
- Favorites list accessible from profile.
- Removed if business deleted.

### 10. User Profile
**Priority:** P1
**Description:** Manage personal info, payment methods, notifications settings.
**Acceptance Criteria:**
- Edit name, phone, avatar.
- View saved cards (tokenized).
- Toggle push/email notifications.

### 11. Availability & Slot Computation
**Priority:** P0
**Description:** Algorithm computing open slots from business hours, staff shifts, existing bookings, and service duration.
**Acceptance Criteria:**
- Generates slots in 15-min increments.
- Excludes breaks and booked times.
- Handles multiple staff.
- Timezone aware (business local TZ).

### 12. Shared Types & Design System
**Priority:** P0
**Description:** Common TS types, UI components (buttons, cards, inputs) for web/mobile.
**Acceptance Criteria:**
- Repo package with typed interfaces (User, Business, Appointment).
- Storybook shows components.
- Consistent theme tokens (color, spacing).

### 13. Reviews & Ratings
**Priority:** P1
**Description:** Clients rate (1-5) and review after completed appointment.
**Acceptance Criteria:**
- Only verified appointments can review.
- Average rating recalculated.
- Reviews modifiable/deletable by author.
- Profanity filter applied.

### 14. Payment Integration
**Priority:** P0 (mock in MVP, real Stripe in P1)
**Description:** Stripe for cards, wallet; deposits or full payment.
**Acceptance Criteria:**
- Checkout uses Stripe PaymentIntent.
- Handles 3DS.
- Refund triggered on cancel per policy.
- PCI: no raw card data stored.

### 15. Notifications
**Priority:** P1
**Description:** Push (FCM/APNs), email, in-app for booking confirm, reminder, cancel.
**Acceptance Criteria:**
- Event-driven via background jobs.
- User can opt-out.
- Templates centralized.
- Delivery status logged.

### 16. Provider / Business Owner Portal
**Priority:** P1
**Description:** Web dashboard for businesses to manage profile, services, staff, availability, appointments.
**Acceptance Criteria:**
- Owner can edit business info and hours.
- Add/edit services with duration/price.
- Manage staff accounts and shifts.
- View day/week calendar of appointments.
- Accept/decline bookings (if manual confirm).

### 17. Admin Dashboard
**Priority:** P1
**Description:** Super admin manages categories, users, businesses, disputes.
**Acceptance Criteria:**
- CRUD on categories and businesses.
- Suspend users/businesses.
- View platform metrics (bookings, revenue).
- Access audit logs.

### 18. Background Jobs (BullMQ)
**Priority:** P0
**Description:** Redis-backed queue for async tasks: slot hold release, reminders, email, analytics.
**Acceptance Criteria:**
- Job types: sendNotification, releaseHold, syncCalendar.
- Retry with exponential backoff.
- Dead-letter queue for failures.
- Dashboard (Bull Board) for monitoring.

## Prioritization Summary
- P0 (MVP): 1,2,3,5,6,7,8,11,12,14(mock),18
- P1: 4,10,13,15,16,17
- P2: 9

## Success Metrics
- Booking conversion >30%
- Weekly active bookers >5k in 3 months
- Provider satisfaction >4.2/5