# Planity Clone – Product Specification

## 1. Introduction
Planity Clone is a mobile-first platform connecting clients with beauty & wellness businesses (salons, barbers, spas) for discovery, booking, and management. This document defines features, acceptance criteria, and priorities.

## 2. Global Priorities
- P0: Core booking path (Auth, Search, Detail, Slots, Booking, Payments, Notifications)
- P1: Engagement (Favorites, Reviews, Profile, Map, Guest browse)
- P2: Provider portal, Admin, Background jobs, Design system governance

## 3. Feature Specifications

### 3.1 User Authentication
**Description:** Secure signup/login via email, phone OTP, Google/Apple.
**Acceptance Criteria:**
- User can register with email+password; email verification required.
- User can login with OTP sent to phone.
- Social login returns valid JWT.
- Passwords hashed (bcrypt).
- Session persists via refresh token.
**Priority:** P0

### 3.2 Guest Browse & Explore
**Description:** Non-logged users can view businesses, categories, and deals.
**AC:**
- Guest can open home, list businesses, view detail (read-only).
- Prompt to login appears when attempting to book.
**Priority:** P1

### 3.3 Business Search & Discovery
**Description:** Text search, filter by category, price, rating, distance.
**AC:**
- Search returns relevant businesses by name/services.
- Filters apply correctly and combine.
- Empty state shown when no results.
**Priority:** P0

### 3.4 Map-based Search
**Description:** Display businesses on map with clustering; tap pin opens preview.
**AC:**
- Map shows pins within viewport.
- User can drag map to reload results (debounced).
- Pin click shows bottom sheet with business summary.
**Priority:** P1

### 3.5 Business Detail View
**Description:** Full profile: photos, services, staff, hours, reviews.
**AC:**
- Shows cover image, list of services with prices/durations.
- Displays next available slot.
- Shows aggregate rating and recent reviews.
**Priority:** P0

### 3.6 Service Categories
**Description:** Taxonomy of services (Hair, Nails, Massage, etc.).
**AC:**
- Categories seeded and manageable via admin.
- Each business maps to categories.
- Category landing page lists businesses.
**Priority:** P1

### 3.7 Booking Flow
**Description:** Select service, staff, date, slot, confirm.
**AC:**
- User can select multiple services in one cart.
- Slot computation respects availability.
- Confirmation screen with summary and cancel policy.
- Booking creates appointment and triggers notification.
**Priority:** P0

### 3.8 Appointment Management
**Description:** User views upcoming/past appointments, reschedules/cancels.
**AC:**
- List sorted by date.
- Cancel allowed per business rules (e.g., 24h).
- Reschedule opens slot picker.
**Priority:** P0

### 3.9 Favorites
**Description:** Save businesses/services to favorites.
**AC:**
- Heart toggle on detail and list.
- Favorites tab lists saved items.
- Sync across devices.
**Priority:** P1

### 3.10 User Profile
**Description:** Manage personal info, payment methods, addresses.
**AC:**
- Edit name, phone, avatar.
- View booking history.
- Delete account with confirmation.
**Priority:** P1

### 3.11 Availability & Slot Computation
**Description:** Algorithm computing free slots from business hours, staff shifts, existing bookings, service duration.
**AC:**
- Generates slots in 15-min increments.
- Excludes breaks and booked times.
- Handles multiple staff and parallel capacity.
- Timezone aware.
**Priority:** P0

### 3.12 Shared Types & Design System
**Description:** Common TS types, UI components, color palette, spacing.
**AC:**
- Monorepo package with Button, Card, Input, etc.
- Theme tokens defined.
- Used by mobile (React Native) and web.
**Priority:** P2

### 3.13 Reviews & Ratings
**Description:** Clients rate after appointment; display on business.
**AC:**
- 1-5 star with comment, attached to completed booking.
- Business can reply.
- Average rating recalculated.
- Fraud prevention: only booked users can review.
**Priority:** P1

### 3.14 Payment Integration
**Description:** Stripe/PayPal for cards, wallets; deposits or full prepay.
**AC:**
- Secure PCI-compliant checkout.
- Handles refund/cancel logic.
- Invoice emailed.
- Failed payment blocks booking confirmation.
**Priority:** P0

### 3.15 Notifications
**Description:** Push (FCM/APNs), email, SMS for booking confirm, remind, cancel.
**AC:**
- Opt-in preferences respected.
- Template system for messages.
- Delivery status logged.
**Priority:** P0

### 3.16 Provider / Business Owner Portal
**Description:** Web dashboard for businesses to manage profile, services, staff, availability, bookings.
**AC:**
- Owner can edit business info, add services, set hours.
- View calendar of appointments.
- Accept/decline bookings (if manual).
- Payout reports.
**Priority:** P2

### 3.17 Admin Dashboard
**Description:** Super-admin manages categories, users, businesses, content.
**AC:**
- CRUD for categories, flags inappropriate reviews.
- Impersonate business owner.
- View platform metrics.
**Priority:** P2

### 3.18 Background Jobs (BullMQ)
**Description:** Async workers for notifications, slot cache, reminders, analytics.
**AC:**
- Queue for sending reminders 24h before appointment.
- Retry with exponential backoff.
- Dead-letter queue monitored.
- Dashboard for job status.
**Priority:** P2

## 4. Success Metrics
- Booking conversion > 30%
- Weekly active bookers
- Provider retention

## 5. Open Questions
- Which payment provider per region?
- Localization needs?