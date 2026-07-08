# Planity Clone - Product Specification

## 1. Goal & Scope
Planity Clone is a mobile-first marketplace for beauty and wellness appointments. It allows customers to discover businesses, view services, book time slots, pay, and review. Business owners manage their listings and appointments. Admins oversee platform health.

## 2. Personas
- Guest: browses without account.
- Customer: books and manages appointments.
- Business Owner: manages listing and availability.
- Admin: platform governance.

## 3. Feature Specifications

### 3.1 User Authentication
Description: Secure registration and login for customers and owners.
Acceptance Criteria:
- User can sign up with email and password, or OAuth (Google/Apple).
- Email verification required before first booking.
- Login returns JWT; refresh token rotation works.
- Password reset via email link.
- Session persists across app restart.
Priority: P0

### 3.2 Guest Browse & Explore
Description: Landing page, featured businesses, category tiles accessible without auth.
Acceptance Criteria:
- Home loads with curated lists (Popular, Near Me, New).
- Guest can open business detail read-only.
- Booking action triggers login/registration modal.
Priority: P0

### 3.3 Business Search & Discovery
Description: Text search and filtered discovery of businesses.
Acceptance Criteria:
- Search by name, service, or category with debounce.
- Filters: distance, price range, rating, available today.
- Results paginated; sort by relevance/distance/rating.
- Empty state with suggestions.
Priority: P0

### 3.4 Map-based Search
Description: Geolocation map with business pins and preview cards.
Acceptance Criteria:
- Map shows user location after permission grant.
- Pins reflect current filters; clustering for dense areas.
- Tap pin shows mini detail with CTA to full view.
- List-map toggle on mobile.
Priority: P1

### 3.5 Business Detail View
Description: Comprehensive page for a business.
Acceptance Criteria:
- Hero gallery, name, rating, address, contact.
- Tabs: Services, Staff, Reviews, Info.
- Real-time availability summary.
- Actions: Book, Favorite, Share, Call.
Priority: P0

### 3.6 Service Categories
Description: Taxonomy of beauty/wellness categories and sub-categories.
Acceptance Criteria:
- Seed data: Hair, Nails, Spa, Barber, Makeup, etc.
- Each business assigned to primary and secondary categories.
- Category landing page lists businesses and filters.
Priority: P0

### 3.7 Booking Flow
Description: Multi-step flow to reserve an appointment.
Acceptance Criteria:
- Steps: Service -> Staff (optional) -> Date -> Slot -> Confirm -> Pay.
- Show price and duration clearly.
- Prevent double booking via locking slot.
- On success: confirmation screen, notification, calendar sync.
Priority: P0

### 3.8 Appointment Management
Description: User and provider views of bookings.
Acceptance Criteria:
- Customer list: Upcoming, Past, Cancelled.
- Cancel/reschedule respecting policy (e.g., 24h).
- Provider calendar updates instantly.
- History includes payment and review status.
Priority: P0

### 3.9 Favorites
Description: Save businesses for quick access.
Acceptance Criteria:
- Add/remove from detail or search card.
- Favorites list in profile.
- Push notification for favorite promo (optional).
Priority: P1

### 3.10 User Profile
Description: Manage personal info and preferences.
Acceptance Criteria:
- Edit name, phone, avatar, address.
- Manage saved payment methods.
- Notification preferences (email/SMS/push).
- Delete account with data erasure.
Priority: P1

### 3.11 Availability & Slot Computation
Description: Engine to generate bookable slots based on rules.
Acceptance Criteria:
- Owner sets weekly hours, breaks, holidays.
- Service duration + buffer used for slot sizing.
- Concurrent bookings per staff considered.
- Timezone correct; overrides for special days.
- Exposed as API consumed by booking flow.
Priority: P0

### 3.12 Shared Types & Design System
Description: Common TypeScript types and UI kit.
Acceptance Criteria:
- Repo package with Button, Input, Card, Modal, etc.
- Theme tokens: color, spacing, typography.
- Shared interfaces: User, Business, Booking, Slot.
- Storybook or docs for components.
Priority: P0

### 3.13 Reviews & Ratings
Description: Post-appointment feedback system.
Acceptance Criteria:
- Only customers with completed appointment can review.
- Star rating 1-5 and text; editable within 7 days.
- Aggregate rating shown on business.
- Owner can reply; admin can moderate.
Priority: P1

### 3.14 Payment Integration
Description: Secure card payments and refunds via Stripe.
Acceptance Criteria:
- Save card with PCI-compliant elements.
- Charge at booking or no-show policy.
- Webhooks update booking status.
- Refund partial/full with reason.
- Handle 3DS and failed payments gracefully.
Priority: P0

### 3.15 Notifications
Description: Transactional and marketing messaging.
Acceptance Criteria:
- Email and SMS for confirm, remind (24h), cancel.
- Push via Firebase for app users.
- Templates centralized; unsubscribe links.
- Sent via background jobs, not blocking requests.
Priority: P1

### 3.16 Provider / Business Owner Portal
Description: Web dashboard for businesses.
Acceptance Criteria:
- Auth with role business.
- Manage profile, photos, services, staff.
- Set availability and view bookings calendar.
- Basic analytics: revenue, utilization.
- Accept/decline booking requests if manual mode.
Priority: P0

### 3.17 Admin Dashboard
Description: Superuser control panel.
Acceptance Criteria:
- Manage users, businesses, categories, reviews.
- Suspend/activate accounts.
- Feature businesses on home.
- View platform metrics and job queues.
- Audit log of admin actions.
Priority: P1

### 3.18 Background Jobs (BullMQ)
Description: Async processing for heavy or delayed tasks.
Acceptance Criteria:
- Queues: notifications, reminders, slot-cleanup, analytics.
- Retry with exponential backoff.
- Dead-letter queue for failures.
- Redis-backed; dashboard to inspect.
- Idempotent job handlers.
Priority: P1

## 4. Prioritization Summary
- P0 (MVP): Auth, Guest Browse, Search, Detail, Categories, Booking, Appointment, Availability, Design System, Payment, Provider Portal.
- P1 (Fast Follow): Map Search, Favorites, Profile, Reviews, Notifications, Admin, Background Jobs.
- P2 (Later): Loyalty program, Multi-language, AI recommendations.

## 5. Success Metrics
- Booking conversion > 20% from detail view.
- Provider onboarding < 15 min.
- Crash-free sessions > 99%.