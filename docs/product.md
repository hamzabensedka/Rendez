# Planity Clone - Product Specification

## Overview
Planity Clone is a mobile-first platform connecting clients with beauty and wellness businesses (salons, barbers, spas). It supports discovery, booking, payments, and management for clients, providers, and admins.

## Feature Specifications

### 1. User Authentication
**Description:** Secure signup/login via email, phone (OTP), and social (Google/Apple). JWT-based sessions.
**Acceptance Criteria:**
- User can register with email+password; receive verification email.
- User can login with phone OTP; session persists.
- Social login works and creates account if absent.
- Password reset flow functional.
- Token refresh implemented.
**Priority:** P0

### 2. Guest Browse & Explore
**Description:** Non-logged-in users can browse businesses, categories, and view details.
**Acceptance Criteria:**
- Guest can open app and see featured businesses.
- Guest can view business detail but booking prompts login.
- No personal data stored for guest.
**Priority:** P1

### 3. Business Search & Discovery
**Description:** Text search with filters (category, price, rating, distance).
**Acceptance Criteria:**
- Search returns relevant businesses by name, service, or tag.
- Filters apply correctly and combine.
- Empty state shown when no results.
- Search history saved for logged-in users.
**Priority:** P0

### 4. Map-based Search
**Description:** Interactive map showing business pins; tap to preview.
**Acceptance Criteria:**
- Map loads with user location (permission handled).
- Pins reflect current filters.
- Tap pin shows bottom sheet with business summary and link to detail.
- Search this area updates results.
**Priority:** P1

### 5. Business Detail View
**Description:** Full profile: photos, services, staff, hours, reviews, booking CTA.
**Acceptance Criteria:**
- Displays cover image, logo, description, address, phone.
- Lists services with prices and durations.
- Shows next available slot.
- Reviews section with rating average.
**Priority:** P0

### 6. Service Categories
**Description:** Taxonomy of categories (Hair, Nails, Spa, etc.) with subcategories.
**Acceptance Criteria:**
- Categories seed data present.
- Businesses assigned to categories.
- Category landing page lists businesses and subcats.
**Priority:** P0

### 7. Booking Flow
**Description:** Multi-step: select service, staff (optional), date/time, confirm, pay.
**Acceptance Criteria:**
- Only available slots shown (from Availability engine).
- User can select multiple services in one cart.
- Confirmation screen with summary.
- On success, appointment created and notification sent.
**Priority:** P0

### 8. Appointment Management
**Description:** User views upcoming/past appointments; cancel/reschedule.
**Acceptance Criteria:**
- List grouped by upcoming/past.
- Cancel respects business policy (free cancel before X hrs).
- Reschedule opens booking with same business.
- Provider sees updates via portal.
**Priority:** P0

### 9. Favorites
**Description:** Users bookmark businesses or services.
**Acceptance Criteria:**
- Heart icon toggles favorite.
- Favorites list in profile.
- Push notification for favorite business promo (optional).
**Priority:** P2

### 10. User Profile
**Description:** Manage personal info, payment methods, notifications settings.
**Acceptance Criteria:**
- Edit name, phone, avatar.
- View booking history.
- Manage saved cards (tokenized).
**Priority:** P1

### 11. Availability & Slot Computation
**Description:** Engine computing open slots from business hours, staff shifts, service duration, existing bookings.
**Acceptance Criteria:**
- Given business+service+date, returns 15-min increment slots.
- Handles multiple staff and parallel capacity.
- Excludes breaks and holidays.
- Timezone aware.
**Priority:** P0

### 12. Shared Types & Design System
**Description:** Common TS types, UI components (buttons, cards, colors) for web/mobile.
**Acceptance Criteria:**
- Repo contains shared folder with types and component lib.
- Design tokens match brand guidelines.
- Used consistently across client and admin.
**Priority:** P1

### 13. Reviews & Ratings
**Description:** Clients rate (1-5) and review after completed appointment.
**Acceptance Criteria:**
- Review prompt post-appointment.
- Average rating computed and shown on detail.
- Business can respond to reviews.
- Moderation by admin for abuse.
**Priority:** P1

### 14. Payment Integration
**Description:** Stripe/PayPal for booking deposit or full payment.
**Acceptance Criteria:**
- Secure card entry (PCI compliant via tokenization).
- Handles 3DS.
- Refund/cancel logic integrated with appointments.
- Invoice email sent.
**Priority:** P0

### 15. Notifications
**Description:** Push (FCM/APNs) and email for booking confirm, remind, cancel, promos.
**Acceptance Criteria:**
- Opt-in preferences respected.
- Reminder 24h before appointment.
- Transactional emails sent via SES.
- Background job triggers sends.
**Priority:** P1

### 16. Provider / Business Owner Portal
**Description:** Web dashboard for businesses to manage profile, services, staff, availability, bookings.
**Acceptance Criteria:**
- Login as provider.
- CRUD services, staff, working hours.
- View calendar of appointments.
- Accept/decline bookings (if manual confirmation).
- View analytics (revenue, visits).
**Priority:** P0

### 17. Admin Dashboard
**Description:** Superadmin manages users, businesses, categories, reviews, payments.
**Acceptance Criteria:**
- Approve/reject business registrations.
- Disable users/businesses.
- Manage category tree.
- View platform metrics.
- Resolve disputes/refunds.
**Priority:** P1

### 18. Background Jobs (BullMQ)
**Description:** Queue system for async tasks: notifications, slot recompute, report generation, image processing.
**Acceptance Criteria:**
- BullMQ connected to Redis.
- Jobs retry with backoff.
- Failed jobs logged and alerted.
- Scalable workers.
**Priority:** P1

## Prioritization Summary
- P0: Core MVP (Auth, Search, Detail, Categories, Booking, Availability, Payment, Provider Portal)
- P1: Enhancements (Guest, Map, Profile, Reviews, Notifications, Design System, Admin, Jobs)
- P2: Nice-to-have (Favorites)

## Out of Scope (initial)
- Messaging chat
- Subscriptions
- Multi-language (future)