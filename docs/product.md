# Planity Clone - Product Specification

## Overview
Planity Clone is a mobile-first platform connecting clients with beauty & wellness businesses (salons, barbers, spas). It supports discovery, booking, payments, and management for clients, providers, and admins.

## Feature Specifications

### 1. User Authentication
**Priority:** P0
**Description:** Secure signup/login via email, phone, social (Google/Apple). JWT-based sessions.
**Acceptance Criteria:**
- User can register with email+password; receives verification email.
- User can login with correct credentials; gets JWT.
- Invalid credentials show error.
- Passwords hashed (bcrypt).
- Social login returns user profile.

### 2. Guest Browse & Explore
**Priority:** P0
**Description:** Non-authenticated users can browse businesses, categories, and deals.
**Acceptance Criteria:**
- Guest can view home feed of featured businesses.
- Guest can view business detail and services without booking.
- Attempt to book redirects to login.

### 3. Business Search & Discovery
**Priority:** P0
**Description:** Text search with filters (category, price, rating, distance).
**Acceptance Criteria:**
- Search returns relevant businesses by name, service, or tag.
- Filters apply correctly and update results.
- Empty state shown when no results.

### 4. Map-based Search
**Priority:** P1
**Description:** Display businesses on map with geolocation; tap pin for preview.
**Acceptance Criteria:**
- Map shows pins within viewport based on search.
- User can pan/zoom to reload results (debounced).
- Pin click opens bottom sheet with business summary.

### 5. Business Detail View
**Priority:** P0
**Description:** Full profile: photos, services, staff, hours, reviews.
**Acceptance Criteria:**
- Shows cover image, description, list of services with prices.
- Displays working hours and next available slot.
- Shows aggregate rating and recent reviews.

### 6. Service Categories
**Priority:** P0
**Description:** Hierarchical categories (e.g., Hair > Coloring).
**Acceptance Criteria:**
- Categories seeded and editable via admin.
- Businesses assign services to leaf categories.
- Browse by category returns correct businesses.

### 7. Booking Flow
**Priority:** P0
**Description:** Select service, staff, date, slot, confirm, pay.
**Acceptance Criteria:**
- User selects service; system shows available slots from availability engine.
- User can pick alternative staff if available.
- On confirm, appointment created with pending payment status.
- Success returns confirmation and notification sent.

### 8. Appointment Management
**Priority:** P0
**Description:** List upcoming/past appointments; cancel/reschedule.
**Acceptance Criteria:**
- User sees appointments sorted by date.
- Cancel frees slot and notifies provider.
- Reschedule uses same booking flow with prior context.

### 9. Favorites
**Priority:** P1
**Description:** Save businesses or services to favorites.
**Acceptance Criteria:**
- Heart icon toggles favorite state.
- Favorites list view accessible from profile.
- Favorites persist across sessions.

### 10. User Profile
**Priority:** P1
**Description:** Manage personal info, payment methods, notifications settings.
**Acceptance Criteria:**
- User can update name, phone, avatar.
- User can add/remove card (tokenized).
- User can toggle push/email notifications.

### 11. Availability & Slot Computation
**Priority:** P0
**Description:** Compute slots from business hours, service duration, staff shifts, existing bookings.
**Acceptance Criteria:**
- Engine returns 15/30-min slots excluding breaks and booked times.
- Handles multiple staff with different schedules.
- Timezone aware per business.

### 12. Shared Types & Design System
**Priority:** P0
**Description:** Common TS types, UI components (buttons, cards, colors) for web/mobile.
**Acceptance Criteria:**
- Monorepo package exports types and components.
- Storybook shows components.
- Consistent spacing/typography across screens.

### 13. Reviews & Ratings
**Priority:** P1
**Description:** Post-visit reviews with star rating and text.
**Acceptance Criteria:**
- User can submit review only for completed appointments.
- Average rating recalculated on new review.
- Provider can respond to reviews.

### 14. Payment Integration
**Priority:** P0
**Description:** Stripe/PayPal for cards, wallets; handle refunds.
**Acceptance Criteria:**
- Secure card entry via PCI-compliant SDK.
- Payment success marks appointment confirmed.
- Failed payment keeps appointment pending with retry.
- Refund issued from admin/provider triggers Stripe refund.

### 15. Notifications
**Priority:** P1 (core P0 for booking)
**Description:** Push (FCM/APNs), email for booking, reminders, marketing.
**Acceptance Criteria:**
- Booking confirmation sent immediately.
- Reminder sent 24h before via background job.
- User can opt-out per channel.

### 16. Provider / Business Owner Portal
**Priority:** P1
**Description:** Manage business profile, services, staff, availability, appointments.
**Acceptance Criteria:**
- Owner can edit business info and photos.
- Owner can add staff and set weekly schedules.
- Owner can view day/week calendar and manually book.
- Owner can see basic stats (bookings, revenue).

### 17. Admin Dashboard
**Priority:** P1
**Description:** Platform-wide management: users, businesses, categories, moderations.
**Acceptance Criteria:**
- Admin can approve/reject business registrations.
- Admin can edit global categories and service templates.
- Admin can suspend users/businesses.
- Admin can view aggregated metrics.

### 18. Background Jobs (BullMQ)
**Priority:** P0
**Description:** Queue for slot caching, reminder emails, analytics, webhooks.
**Acceptance Criteria:**
- Job for sending reminders runs daily.
- Failed jobs retry with backoff.
- Queue dashboard shows metrics.
- Slot computation triggered on availability change.

## Prioritization Summary
- P0 (MVP): 1,2,3,5,6,7,8,11,12,14,18
- P1 (V1.1): 4,9,10,13,15,16,17
- P2 (Later): advanced analytics, loyalty, multi-location.