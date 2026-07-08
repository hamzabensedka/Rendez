# Planity Clone - Product Specification

## 1. Overview
Planity Clone is a platform for discovering and booking beauty, hair, and wellness appointments. It supports customers (guests and authenticated users), business owners (providers), and admins. The product includes mobile-responsive web and backend services with background job processing.

## 2. Prioritization Legend
- P0: Must-have for MVP
- P1: Important, post-MVP or parallel
- P2: Nice-to-have / later phase

## 3. Feature Specifications

### 3.1 User Authentication
**Description:** Users can sign up, log in, logout, and reset password via email. Social login (Google/Apple) optional.
**Acceptance Criteria:**
- User can register with email + password; validation errors shown.
- Email verification sent; account active after verification.
- Login returns JWT token; persisted in secure storage.
- Password reset flow sends email with timed token.
- Social login (P1) works for Google/Apple.
**Priority:** P0

### 3.2 Guest Browse & Explore
**Description:** Non-authenticated users can explore featured businesses, categories, and limited search.
**Acceptance Criteria:**
- Guest can view home screen with featured listings and categories.
- Guest can open business detail but booking prompts login.
- No personal data stored for guest.
**Priority:** P0

### 3.3 Business Search & Discovery
**Description:** Search businesses by name, category, or keyword with filters (distance, rating, price).
**Acceptance Criteria:**
- Search returns paginated results matching query.
- Filters apply correctly and combine.
- Empty state shown when no results.
**Priority:** P0

### 3.4 Map-based Search
**Description:** Display businesses on map with clustering; tap pin shows summary card.
**Acceptance Criteria:**
- Map shows markers within viewport and updates on pan/zoom (debounced).
- Cluster markers when zoomed out.
- Selecting pin navigates to business detail.
**Priority:** P1

### 3.5 Business Detail View
**Description:** Shows business info: photos, services, staff, hours, location, reviews.
**Acceptance Criteria:**
- Displays all required fields from API.
- Shows available services with prices and durations.
- "Book" CTA initiates booking flow or login if guest.
**Priority:** P0

### 3.6 Service Categories
**Description:** Taxonomy of services (Hair, Nails, Spa, etc.) with subcategories.
**Acceptance Criteria:**
- Categories seeded and manageable via admin.
- Businesses assign services to categories.
- Navigation by category yields correct business list.
**Priority:** P0

### 3.7 Booking Flow
**Description:** Multi-step: select service, staff (optional), date, slot, confirm, pay.
**Acceptance Criteria:**
- Only available slots shown based on availability computation.
- User can select or skip staff.
- Summary shown before confirmation.
- On confirm, appointment created and confirmation sent.
**Priority:** P0

### 3.8 Appointment Management
**Description:** Users view upcoming/past appointments, reschedule, cancel.
**Acceptance Criteria:**
- List shows status (confirmed, cancelled, completed).
- Cancel respects business policy (e.g., 24h).
- Reschedule re-enters booking flow with prefilled data.
**Priority:** P0

### 3.9 Favorites
**Description:** Users can favorite businesses for quick access.
**Acceptance Criteria:**
- Heart toggle on business card/detail.
- Favorites list accessible from profile.
- Removing updates state instantly.
**Priority:** P1

### 3.10 User Profile
**Description:** Manage personal info, addresses, payment methods, notifications settings.
**Acceptance Criteria:**
- Editable name, phone, avatar.
- Shows loyalty stats (if any).
- Deletes account with confirmation (P2).
**Priority:** P0

### 3.11 Availability & Slot Computation
**Description:** Engine that computes free slots from business hours, service duration, staff schedules, and existing bookings.
**Acceptance Criteria:**
- Generates slots at defined intervals (e.g., 15 min).
- Excludes breaks and booked times.
- Handles multiple staff and concurrent capacity.
- Timezone aware.
**Priority:** P0

### 3.12 Shared Types & Design System
**Description:** Common TypeScript types, UI components, color palette, typography.
**Acceptance Criteria:**
- Repository exports types used by frontend/backend.
- Component library includes Button, Card, Input, Modal.
- Theme matches brand guidelines.
**Priority:** P0

### 3.13 Reviews & Ratings
**Description:** Users leave star rating + text after completed appointment; displayed on business.
**Acceptance Criteria:**
- Only verified appointments can review.
- Average rating computed and shown.
- Business can reply (P1).
- Inappropriate content flagged.
**Priority:** P1

### 3.14 Payment Integration
**Description:** Stripe (or similar) for card payments, saved cards, refunds.
**Acceptance Criteria:**
- User can pay with new or saved card.
- Deposit or full amount captured per business config.
- Webhook updates appointment status.
- Refund issued via admin/provider.
**Priority:** P0

### 3.15 Notifications
**Description:** Email and push notifications for booking confirm, remind, cancel.
**Acceptance Criteria:**
- Triggered on events via background jobs.
- User can opt-out in profile.
- Localization supported (P2).
**Priority:** P1

### 3.16 Provider / Business Owner Portal
**Description:** Web dashboard for businesses to manage profile, services, staff, availability, bookings.
**Acceptance Criteria:**
- CRUD operations on services, staff, hours.
- View calendar of appointments.
- Accept/decline bookings (if manual approval).
- Access controlled by role.
**Priority:** P0

### 3.17 Admin Dashboard
**Description:** Super admin manages categories, users, businesses, reviews, global settings.
**Acceptance Criteria:**
- Approve/reject business registrations.
- Suspend users or businesses.
- View analytics (bookings, revenue).
**Priority:** P1

### 3.18 Background Jobs (BullMQ)
**Description:** Queue system for notifications, slot cleanup, reminder emails, webhook retries.
**Acceptance Criteria:**
- Jobs enqueued with retry logic.
- Failed jobs logged and observable.
- Scales horizontally with Redis.
**Priority:** P0

## 4. Non-Functional Requirements
- Performance: search < 500ms p95.
- Security: JWT auth, role-based access, PCI compliance via Stripe.
- Accessibility: WCAG 2.1 AA.
- i18n: support EN/FR initially.

## 5. Milestones
- MVP: P0 features with core booking.
- Phase 2: P1 features (map, favorites, reviews, notifications, admin).
- Phase 3: P2 enhancements.
