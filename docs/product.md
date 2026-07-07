# Planity Clone - Product Specification

## Overview
Platform for booking beauty & wellness appointments. Supports customers, providers, admins.

## Roles
- Customer
- Provider (Business Owner)
- Admin
- System (Background Jobs)

## Feature Specifications

### 1. User Authentication
**Priority:** P0
**Description:** Register/login for customers and providers via email, phone, social.
**Acceptance Criteria:**
- User registers with email and password; verification required.
- Login issues secure token.
- Password reset via email token.
- Role-based access (customer/provider/admin).
- Social login (Google/Apple) supported.

### 2. Guest Browse & Explore
**Priority:** P1
**Description:** Non-authenticated users can explore categories and featured businesses.
**Acceptance Criteria:**
- Guest sees home with featured listings and categories.
- Guest can view business details but booking prompts login.
- No personal data persisted for guest.

### 3. Business Search & Discovery
**Priority:** P0
**Description:** Text search with filters (category, price, rating, distance, availability).
**Acceptance Criteria:**
- Search returns matched businesses with pagination (20/page).
- Filters combine with query.
- Sort by relevance, distance, rating, price.
- Empty state displayed.

### 4. Map-based Search
**Priority:** P1
**Description:** Interactive map with business pins; viewport drives results.
**Acceptance Criteria:**
- Pins rendered for businesses in map view.
- Tap pin shows quick info; tap opens detail.
- Moving map triggers new search (debounced).
- Geolocation permission handled.

### 5. Business Detail View
**Priority:** P0
**Description:** Full business profile: photos, services, staff, hours, location, reviews, booking CTA.
**Acceptance Criteria:**
- Shows services with price/duration.
- Displays aggregate rating and review count.
- `Book` button starts booking or login.
- Shows next available slot.

### 6. Service Categories
**Priority:** P0
**Description:** Taxonomy of categories/subcategories.
**Acceptance Criteria:**
- Seeded via admin; CRUD in admin dashboard.
- Businesses assign categories.
- Users browse by category from home.

### 7. Booking Flow
**Priority:** P0
**Description:** Multi-step: service -> staff (optional) -> date/time -> confirm -> payment.
**Acceptance Criteria:**
- Only slots from availability engine shown.
- Summary displays price, duration.
- On confirm, appointment pending until payment success.
- Supports cancel/reschedule.

### 8. Appointment Management
**Priority:** P0
**Description:** Customers and providers view/manage appointments.
**Acceptance Criteria:**
- Lists upcoming/past with status.
- Cancel allowed per policy (e.g., 24h before).
- Reschedule reuses booking flow.
- Providers can manually add.

### 9. Favorites
**Priority:** P2
**Description:** Customers favorite businesses.
**Acceptance Criteria:**
- Toggle heart on card/detail.
- Favorites list in profile.
- Synced across devices.

### 10. User Profile
**Priority:** P1
**Description:** Manage personal info, payment methods, notification settings.
**Acceptance Criteria:**
- Edit name, phone, email.
- View history.
- Manage tokenized payment methods.
- Notification preferences respected.

### 11. Availability & Slot Computation
**Priority:** P0
**Description:** Engine computes slots per business/service/staff.
**Acceptance Criteria:**
- Considers working hours, breaks, holidays, existing bookings.
- Returns slots at 15-min interval.
- Prevents double booking.
- Exposes API for booking/map.

### 12. Shared Types & Design System
**Priority:** P1
**Description:** Common TS types, UI components, design tokens.
**Acceptance Criteria:**
- Shared lib with types (User, Business, Appointment).
- Component library (buttons, cards, inputs).
- Design tokens documented.

### 13. Reviews & Ratings
**Priority:** P1
**Description:** Post-appointment reviews with star rating and text.
**Acceptance Criteria:**
- Only verified appointments can review.
- Average rating cached.
- Paginated most recent first.
- Provider can reply.

### 14. Payment Integration
**Priority:** P0
**Description:** Stripe for cards/wallets; auth, capture, refund.
**Acceptance Criteria:**
- Payment sheet in booking.
- Appointment confirmed on success.
- Refund on cancel per policy.
- Tokenized, PCI compliant.

### 15. Notifications
**Priority:** P1
**Description:** Push + Email for transactional and reminders.
**Acceptance Criteria:**
- Queued sending.
- User opt-out per type.
- Provider alert on new booking.
- Reminder 24h before.

### 16. Provider / Business Owner Portal
**Priority:** P0
**Description:** Web dashboard for business management.
**Acceptance Criteria:**
- Provider login.
- CRUD profile, services, staff, schedule.
- Calendar of appointments, manual create.
- Reply to reviews.
- Basic analytics.

### 17. Admin Dashboard
**Priority:** P1
**Description:** Super admin platform management.
**Acceptance Criteria:**
- Admin role.
- Approve/reject businesses.
- Manage categories, users, flags.
- Global metrics view.

### 18. Background Jobs (BullMQ)
**Priority:** P1
**Description:** Redis-backed queues for async tasks.
**Acceptance Criteria:**
- BullMQ with queues: notify, reminder, expirePending, stats.
- Retry with backoff.
- Bull Board monitoring.

## Priority Legend
- P0: Must-have for MVP
- P1: Important post-MVP / parallel
- P2: Nice-to-have
- P3: Later
