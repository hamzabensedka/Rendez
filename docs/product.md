# Planity Clone - Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting clients with beauty & wellness businesses (salons, barbers, spas). It supports discovery, booking, payments, and management for clients, business owners, and admins.

## 2. Feature Specifications

### 2.1 User Authentication
**Priority:** P0
**Description:** Secure signup/login for clients via email, phone OTP, and social.
**Acceptance Criteria:**
- User can register with email+password, phone OTP, Google/Apple.
- JWT-based sessions with refresh token.
- Password reset flow.
- Profile data minimal at signup.

### 2.2 Guest Browse & Explore
**Priority:** P0
**Description:** Non-logged-in users can explore businesses and services.
**Acceptance Criteria:**
- Guest can view home feed, categories, business list.
- Prompt to login only when attempting booking or favorite.

### 2.3 Business Search & Discovery
**Priority:** P0
**Description:** Text search with filters (category, rating, price, distance).
**Acceptance Criteria:**
- Search bar returns relevant businesses.
- Filters apply correctly.
- Sort by relevance, distance, rating.

### 2.4 Map-based Search
**Priority:** P1
**Description:** Interactive map showing business pins.
**Acceptance Criteria:**
- Map shows pins within viewport.
- Tap pin opens preview card.
- `Search this area` updates results.

### 2.5 Business Detail View
**Priority:** P0
**Description:** Full page with info, services, staff, reviews, booking CTA.
**Acceptance Criteria:**
- Displays address, hours, gallery, services list.
- Shows aggregated rating.
- `Book` button initiates flow.

### 2.6 Service Categories
**Priority:** P0
**Description:** Taxonomy of services (Hair, Nails, Spa, etc.).
**Acceptance Criteria:**
- Categories hierarchical.
- Each business assigns categories.
- Browse by category from home.

### 2.7 Booking Flow
**Priority:** P0
**Description:** Multi-step: select service, staff, date, slot, confirm.
**Acceptance Criteria:**
- Real-time slot availability from computation.
- User can apply promo.
- Confirmation screen + notification.

### 2.8 Appointment Management
**Priority:** P0
**Description:** Client views upcoming/past appointments, reschedule/cancel.
**Acceptance Criteria:**
- List with status.
- Cancel up to 24h before (configurable).
- Reschedule uses same flow.

### 2.9 Favorites
**Priority:** P1
**Description:** Save businesses/services.
**Acceptance Criteria:**
- Heart icon toggles favorite.
- Favorites list in profile.
- Sync across devices.

### 2.10 User Profile
**Priority:** P0
**Description:** Manage personal info, payment methods, notifications settings.
**Acceptance Criteria:**
- Edit name, phone, avatar.
- View booking history.
- Manage saved cards (via Payment Integration).

### 2.11 Availability & Slot Computation
**Priority:** P0
**Description:** Engine computing free slots based on business hours, service duration, staff shifts, existing bookings.
**Acceptance Criteria:**
- Returns slots in 15-min increments.
- Respects buffer times.
- Handles recurring closures.

### 2.12 Shared Types & Design System
**Priority:** P0
**Description:** Common TS types, UI components, theme tokens.
**Acceptance Criteria:**
- Repo has /shared with types, buttons, inputs.
- Consistent spacing/color across apps.
- Used by mobile, provider, admin.

### 2.13 Reviews & Ratings
**Priority:** P1
**Description:** Clients rate after appointment; display on business.
**Acceptance Criteria:**
- 1-5 stars + text.
- Only verified bookings can review.
- Average rating computed.

### 2.14 Payment Integration
**Priority:** P0
**Description:** Stripe/PayPal for card payments, deposits.
**Acceptance Criteria:**
- Save card for future.
- Handle 3DS.
- Refund via admin/provider.

### 2.15 Notifications
**Priority:** P1
**Description:** Push (FCM/APNs) + email for booking confirm, remind, cancel.
**Acceptance Criteria:**
- Opt-in settings.
- Localized templates.
- Delivery via Background Jobs.

### 2.16 Provider / Business Owner Portal
**Priority:** P1
**Description:** Web dashboard for businesses to manage profile, services, staff, slots, appointments.
**Acceptance Criteria:**
- CRUD business info, services, staff.
- View calendar, manually book.
- Respond to reviews.

### 2.17 Admin Dashboard
**Priority:** P2
**Description:** Super admin manage categories, users, businesses, disputes.
**Acceptance Criteria:**
- Approve/reject business signup.
- Global config (cancellation policy).
- View analytics.

### 2.18 Background Jobs (BullMQ)
**Priority:** P1
**Description:** Queue for notifications, slot cleanup, reminder emails.
**Acceptance Criteria:**
- Job types: sendNotification, expirePending, syncAvailability.
- Retry with backoff.
- Monitor via Redis.

## 3. Prioritization Summary
- P0 (MVP): Auth, Guest, Search, Detail, Categories, Booking, Appt Mgmt, Profile, Slot Engine, Shared Types, Payment.
- P1: Map, Favorites, Reviews, Notifications, Provider Portal, BullMQ.
- P2: Admin Dashboard.

## 4. Open Questions
- Exact cancellation window per business?
- Localization requirements?