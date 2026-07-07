# Planity Clone – Product Specification

**Owner:** Alex (Product Owner)
**Goal:** Define complete feature specifications and acceptance criteria for Planity Clone, ensuring all user needs are captured and prioritized.

## Overview
Planity Clone is a mobile-first platform connecting clients with beauty and wellness service providers (salons, barbers, spas). It supports guest browsing, authenticated booking, provider management, and admin oversight.

## Feature Priorities
- P0 (MVP): User Authentication, Guest Browse & Explore, Business Search & Discovery, Business Detail View, Service Categories, Booking Flow, User Profile, Availability & Slot Computation, Shared Types & Design System, Provider Portal (basic), Background Jobs (BullMQ)
- P1: Map-based Search, Appointment Management, Favorites, Reviews & Ratings, Payment Integration, Notifications, Admin Dashboard, Provider Portal (advanced)
- P2: optional future enhancements (not detailed)

## Features

### 1. User Authentication
**Priority:** P0
**Description:** Users can sign up, log in, logout, reset password via email. Social login optional.
**Acceptance Criteria:**
- Given a new user, when they submit valid email and password, then account is created and verification email sent.
- Given registered user, when they log in with correct credentials, then they receive session token.
- Given logged-in user, when they request logout, then session invalidated.
- Password reset flow sends secure email link.

### 2. Guest Browse & Explore
**Priority:** P0
**Description:** Non-authenticated users can browse featured businesses, categories, and limited content.
**Acceptance Criteria:**
- Guest can view home screen with curated lists.
- Guest can open business detail but booking prompts login.
- Guest session tracked for analytics.

### 3. Business Search & Discovery
**Priority:** P0
**Description:** Search by name, category, filters (price, rating, distance).
**Acceptance Criteria:**
- User can enter query and see matching businesses sorted by relevance.
- Filters apply correctly and update results.
- Empty state shown when no results.

### 4. Map-based Search
**Priority:** P1
**Description:** Interactive map showing business pins; user can pan/zoom to discover.
**Acceptance Criteria:**
- Map renders pins for businesses in viewport.
- Tapping pin opens preview card.
- Filter changes reflect on map.

### 5. Business Detail View
**Priority:** P0
**Description:** Show business info, services, staff, photos, reviews, booking CTA.
**Acceptance Criteria:**
- Displays name, address, hours, gallery.
- Lists services with prices and durations.
- Shows aggregate rating and recent reviews.
- `Book` button initiates flow.

### 6. Service Categories
**Priority:** P0
**Description:** Taxonomy of categories (Hair, Nails, Spa) and sub-categories.
**Acceptance Criteria:**
- Categories seeded and manageable via admin.
- Businesses assigned to categories appear in category browse.
- User can navigate category tree.

### 7. Booking Flow
**Priority:** P0
**Description:** Multi-step: select service -> choose staff (optional) -> pick slot -> confirm -> payment.
**Acceptance Criteria:**
- Only available slots shown based on Availability engine.
- User can select or change selections before confirm.
- On confirm, appointment created with status pending payment.
- Guest redirected to auth if not logged in.

### 8. Appointment Management
**Priority:** P1
**Description:** Users view upcoming/past appointments, reschedule, cancel.
**Acceptance Criteria:**
- List shows date, time, business, service.
- Cancel respects policy (e.g., 24h).
- Reschedule opens slot picker for same business.

### 9. Favorites
**Priority:** P1
**Description:** Users can favorite businesses for quick access.
**Acceptance Criteria:**
- Heart icon toggles favorite state.
- Favorites list accessible from profile.
- Optional push notification for favorite promos.

### 10. User Profile
**Priority:** P0
**Description:** Manage personal info, addresses, payment methods, preferences.
**Acceptance Criteria:**
- User can edit name, phone, avatar.
- User can add default address.
- View booking history link.

### 11. Availability & Slot Computation
**Priority:** P0
**Description:** Compute available slots per business/staff/service considering working hours, breaks, existing appointments, service duration.
**Acceptance Criteria:**
- Given business hours 9-5, service 1h, no appointments, then slots at 9,10,11,12,13,14,15,16 if no break.
- Overlapping appointments removed.
- Timezone handled correctly.

### 12. Shared Types & Design System
**Priority:** P0
**Description:** Common TypeScript types, UI components (buttons, cards, inputs) consistent across app/web.
**Acceptance Criteria:**
- Design tokens (color, spacing) defined.
- Component library documented.
- Types used by frontend and backend to avoid mismatch.

### 13. Reviews & Ratings
**Priority:** P1
**Description:** Users leave star rating plus text after completed appointment; display on business.
**Acceptance Criteria:**
- Only verified customers can review.
- Average rating recalculated.
- Inappropriate content flagged to admin.

### 14. Payment Integration
**Priority:** P1
**Description:** Stripe/Apple Pay integration for booking deposits or full payment.
**Acceptance Criteria:**
- User can enter card or use wallet.
- Payment success marks appointment confirmed.
- Failed payment keeps appointment pending with retry.

### 15. Notifications
**Priority:** P1
**Description:** Email/push/SMS for booking confirm, reminder, cancel.
**Acceptance Criteria:**
- On booking, confirmation sent.
- 24h before, reminder sent via preferred channel.
- User can opt out in profile.

### 16. Provider / Business Owner Portal
**Priority:** P0 (basic), P1 (advanced)
**Description:** Business owners manage profile, services, staff, availability, view bookings.
**Acceptance Criteria (P0):**
- Owner logs in to dashboard.
- Can create/edit business info and services.
- Can set weekly hours.
- View list of appointments.
**Acceptance Criteria (P1):**
- Manage staff accounts.
- View analytics (revenue, utilization).
- Respond to reviews.

### 17. Admin Dashboard
**Priority:** P1
**Description:** Super admin manages categories, users, businesses, moderates content.
**Acceptance Criteria:**
- CRUD on categories and service taxonomy.
- Suspend user/business.
- View platform metrics.

### 18. Background Jobs (BullMQ)
**Priority:** P0
**Description:** Async processing for slot computation caching, notification dispatch, analytics.
**Acceptance Criteria:**
- Job queue defined for sending reminders.
- Failed jobs retried with backoff.
- Slot pre-computation runs nightly for popular businesses.

## Global Non-functional Requirements
- Mobile responsive, iOS/Android via React Native or Flutter.
- Performance: search results under 1s.
- Security: JWT auth, RBAC for provider/admin.
- Accessibility: WCAG AA.

## Summary
Prioritized feature specs enable building Planity Clone MVP with clear dev tasks.