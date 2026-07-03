# Planity Clone Product Specification

## 1. Overview
Planity Clone is a mobile-first platform connecting customers with beauty and wellness businesses. It enables users to discover services, book appointments, manage schedules, and pay seamlessly. Business owners manage their offerings, staff, and bookings via a dedicated portal. An admin dashboard oversees platform health. The system uses background jobs for notifications, reminders, and slot computation.

## 2. User Roles
- **Guest**: Unauthenticated user who can browse businesses and services but cannot book.
- **Customer**: Authenticated user with full booking, favorites, profile, and payment capabilities.
- **Provider/Business Owner**: Manages business profile, services, staff, availability, and appointments.
- **Admin**: Superuser with access to all data, analytics, and moderation tools.

## 3. Features

### 3.1 User Authentication
**Description**: Secure sign-up, login, and session management for customers and providers. Supports email/password and social login (Google, Apple). Includes password reset and email verification.

**Acceptance Criteria**:
- Customer can register with email, password, first name, last name, and accept terms.
- Provider registration requires business name, address, and category; account is pending admin approval.
- Login returns JWT access and refresh tokens; access token expires in 15 min, refresh in 7 days.
- Social login (Google, Apple) creates or links account via email.
- Forgot password sends reset link; link expires in 1 hour.
- Email verification required before first booking; unverified users see prompt.
- Session persists across app restarts using secure storage.
- Logout clears tokens and local state.

**Priority**: P0 (Must-have)

### 3.2 Guest Browse & Explore
**Description**: Unauthenticated users can explore businesses, services, and reviews without signing up. Booking actions prompt login/signup.

**Acceptance Criteria**:
- Guest lands on home screen with featured businesses, categories, and search bar.
- Can view business detail, services, reviews, and map location.
- Tapping “Book” or “Add to Favorites” triggers login modal.
- No personalization or history stored.
- Guest can switch to login/signup from any screen.

**Priority**: P0

### 3.3 Business Search & Discovery
**Description**: Full-text search with filters and sorting to find businesses by name, service, location, rating, price, and availability.

**Acceptance Criteria**:
- Search bar with autocomplete suggestions (business names, service types).
- Filters: category (hair, nails, spa, etc.), rating (4+), price range ($-$$$), distance, open now, amenities (WiFi, parking).
- Sort by: relevance, rating, distance, price low-to-high/high-to-low.
- Results display business card: photo, name, rating, distance, price level, next available slot.
- Search uses geolocation (if permitted) to default to near me; manual location input supported.
- Empty state with suggestions when no results.
- Recent searches saved locally for logged-in users.

**Priority**: P0

### 3.4 Map-based Search
**Description**: Interactive map view showing business locations with clustering and tap-to-detail.

**Acceptance Criteria**:
- Map loads with user’s current location (if granted) or default city center.
- Business pins show rating and price level; tap opens info card.
- Clustering for dense areas; zooming in breaks clusters.
- “Search this area” button refreshes results as map moves.
- Toggle between list view and map view.
- Map respects active filters from search.
- Tap on info card navigates to business detail.

**Priority**: P1 (High)

### 3.5 Business Detail View
**Description**: Comprehensive business profile with services, staff, reviews, photos, location, and booking CTA.

**Acceptance Criteria**:
- Header: cover photo, business name, rating, review count, address, distance, open status.
- Action buttons: Favorite (heart), Share, Directions (opens maps).
- Tabbed sections: Services, About, Reviews, Photos.
- Services tab: list of services with name, duration, price; tap to start booking.
- About tab: description, amenities, business hours, payment methods.
- Reviews tab: summary rating distribution, individual reviews with photos, sort/filter.
- Photos tab: gallery grid with lightbox.
- Sticky bottom bar: “Book Now” button (shows next available slot if logged in).
- Provider can edit their own detail from provider portal.

**Priority**: P0

### 3.6 Service Categories
**Description**: Hierarchical category system for organizing businesses and services (e.g., Hair > Haircut, Coloring).

**Acceptance Criteria**:
- Predefined top-level categories: Hair, Nails, Spa, Massage, Skin Care, Barbershop, Makeup, Eyelashes, Hair Removal, Tattoo & Piercing.
- Subcategories configurable by admin; businesses can select multiple subcategories.
- Category browsing screen: grid of icons, tapping shows subcategories then businesses.
- Category filter in search uses this taxonomy.
- Admin can add/disable categories.

**Priority**: P1

### 3.7 Booking Flow
**Description**: Step-by-step appointment booking: select service, staff (optional), date/time, add-ons, confirm, and pay.

**Acceptance Criteria**:
- Flow initiated from service list or business detail.
- Step 1: Service selection (single service per booking; multiple services require separate bookings).
- Step 2: Staff selection (if business has multiple staff; “Any available” default).
- Step 3: Date picker (calendar with unavailable dates greyed out) and time slots (computed from availability).
- Step 4: Add-ons (optional extras like deep conditioning) with prices.
- Step 5: Review summary: business, service, staff, date, time, add-ons, total price, duration.
- Step 6: Payment (if required) via integrated Stripe; supports card, Apple/Google Pay.
- Booking confirmation screen with details and option to add to calendar.
- Concurrent slot holds: slot temporarily reserved for 10 minutes during booking; released if not completed.
- Error handling: if slot taken, show message and suggest alternatives.
- Guest users prompted to login/signup before payment; after login, booking flow resumes.

**Priority**: P0

### 3.8 Appointment Management
**Description**: Customers view, reschedule, cancel upcoming appointments; view history.

**Acceptance Criteria**:
- Upcoming tab: list of confirmed bookings with date, time, business, service, status.
- Statuses: Confirmed, Pending (if provider requires approval), Completed, Cancelled, No-show.
- Actions: Reschedule (opens modified booking flow with same service/staff), Cancel (with reason picker; cancellation policy enforced), Add to Calendar, Get Directions.
- Past tab: historical appointments with option to rebook or leave review.
- Cancellation policy: free cancellation up to X hours before (configurable per business); late cancellation may incur fee.
- Push notification reminders 24h and 1h before appointment.
- Reschedule updates slot availability in real-time.

**Priority**: P0

### 3.9 Favorites
**Description**: Save businesses to a favorites list for quick access.

**Acceptance Criteria**:
- Heart icon on business cards and detail page toggles favorite.
- Favorites screen: list/grid of saved businesses with next available slot.
- Syncs across user’s devices (stored server-side).
- Unfavorite removes from list with undo option.
- Requires authentication; guest tapping heart triggers login.

**Priority**: P1

### 3.10 User Profile
**Description**: Manage personal information, preferences, payment methods, and notification settings.

**Acceptance Criteria**:
- Edit profile: first name, last name, email, phone, profile photo.
- Saved payment methods: add/delete credit/debit cards (Stripe tokenization).
- Notification preferences: push, email, SMS toggles for reminders, promotions, etc.
- Booking preferences: default staff gender preference, favorite businesses.
- Account actions: change password, delete account (with data wipe confirmation).
- Linked social accounts display.

**Priority**: P1

### 3.11 Availability & Slot Computation
**Description**: Dynamic calculation of available time slots based on business hours, staff schedules, existing bookings, breaks, and service duration.

**Acceptance Criteria**:
- Business sets weekly recurring hours per staff (e.g., Mon-Fri 9-18, Sat 10-16).
- Staff can have custom date overrides (vacation, day off).
- Service duration used to generate slots at configurable intervals (default 15 min).
- Slot computation excludes buffer time between appointments (configurable per business).
- Real-time availability: when a slot is booked or held, it’s removed from available pool.
- Background job (BullMQ) recalculates availability cache on schedule changes.
- API returns available slots for a given date, service, staff (or all staff).
- Handles timezone: business timezone stored; slots displayed in user’s local time.
- Maximum advance booking days configurable (default 30).

**Priority**: P0

### 3.12 Shared Types & Design System
**Description**: Unified TypeScript types and UI components to ensure consistency across customer app, provider portal, and admin dashboard.

**Acceptance Criteria**:
- Shared types package: User, Business, Service, Staff, Appointment, Review, Category, etc.
- Design system with reusable components: Button, Input, Card, Modal, Badge, StarRating, Avatar, etc.
- Theming: colors, typography, spacing defined as tokens; supports light/dark mode.
- Responsive layouts for mobile (customer) and desktop (provider, admin).
- Accessibility: components meet WCAG 2.1 AA.
- Storybook documentation for all components.

**Priority**: P1

### 3.13 Reviews & Ratings
**Description**: Customers can leave star ratings and written reviews after a completed appointment. Reviews are public on business detail.

**Acceptance Criteria**:
- After appointment marked completed, prompt to review appears in app and via email.
- Rating: 1-5 stars; optional text review (min 10 chars) and photo upload.
- Review submission is moderated for profanity (automated filter); flagged reviews go to admin queue.
- Business detail shows average rating, total count, and rating distribution.
- Reviews list with most recent first; sort by highest/lowest rating, with photos.
- Business owner can respond to reviews publicly (response shown below review).
- User can edit/delete their own review within 48 hours.
- One review per appointment.

**Priority**: P1

### 3.14 Payment Integration
**Description**: Secure payment processing via Stripe for booking prepayment or no-show fees. Supports card and digital wallets.

**Acceptance Criteria**:
- Customer adds payment method in profile (Stripe SetupIntent).
- At booking, if business requires prepayment, Stripe PaymentIntent is created for total amount.
- Supports 3D Secure authentication.
- Receipt emailed after successful payment.
- Refunds for cancellations processed according to business policy (automatic if within free window).
- Provider sets payment settings: prepayment required (full/partial), cancellation fee amount.
- Platform fee (commission) deducted from provider payout; handled via Stripe Connect (separate project phase).
- PCI compliance: no raw card data touches our servers.

**Priority**: P0 (for booking completion)

### 3.15 Notifications
**Description**: Multi-channel notifications (push, email, SMS) for booking confirmations, reminders, cancellations, promotions, and provider alerts.

**Acceptance Criteria**:
- Push notifications via Firebase Cloud Messaging (FCM) for customer app.
- Email via SendGrid/Mailgun templates.
- SMS via Twilio for critical alerts (optional, opt-in).
- Triggers:
  - Booking confirmation (push + email)
  - Reminder 24h and 1h before (push)
  - Cancellation confirmation (push + email)
  - Reschedule confirmation (push + email)
  - Review request after appointment (push + email)
  - Provider: new booking, cancellation, reminder to update schedule.
- Notification preferences respected.
- In-app notification center with read/unread status.
- Background job (BullMQ) processes notification dispatch.

**Priority**: P0

### 3.16 Provider / Business Owner Portal
**Description**: Web-based dashboard for business owners to manage profile, services, staff, availability, bookings, and reviews.

**Acceptance Criteria**:
- Login with provider credentials (approved by admin).
- Dashboard overview: today’s appointments, revenue summary, upcoming bookings.
- Business profile management: edit name, description, photos, address, phone, business hours, amenities.
- Service management: CRUD services with name, duration, price, category, add-ons, description, image.
- Staff management: add/edit staff members with name, photo, bio, service assignments, working hours, breaks, time off.
- Availability: set recurring weekly hours per staff; override specific dates (holidays, sick days).
- Booking management: view upcoming/past appointments, accept/decline if manual approval enabled, reschedule, cancel, mark no-show.
- Review management: view reviews, respond publicly.
- Payment settings: prepayment requirement, cancellation policy, bank details for payouts.
- Notifications: in-portal alerts for new bookings, cancellations.
- Multi-location support: if owner has multiple businesses, switch between them.

**Priority**: P0

### 3.17 Admin Dashboard
**Description**: Super admin panel for platform management: users, businesses, bookings, categories, reviews moderation, analytics, and system config.

**Acceptance Criteria**:
- Secure login with admin role.
- Dashboard: KPIs (total users, businesses, bookings, revenue), charts (bookings over time, top categories).
- User management: list/search customers and providers; view details; suspend/delete accounts.
- Business management: approve new provider registrations; view/edit any business; suspend/delete.
- Booking management: view all bookings; filter by status, date, business; manual override (cancel, refund).
- Category management: add/edit/disable service categories and subcategories.
- Review moderation: queue of flagged reviews; approve/reject.
- System configuration: platform fee percentage, default cancellation window, max advance days, supported regions.
- Audit log of admin actions.
- Export data to CSV.

**Priority**: P1 (can be built incrementally)

### 3.18 Background Jobs (BullMQ)
**Description**: Asynchronous job processing for non-blocking operations: slot cache updates, notifications, reminders, review requests, data cleanup.

**Acceptance Criteria**:
- BullMQ with Redis for job queues.
- Jobs:
  - `slot-recalculation`: triggered on schedule change, new booking, cancellation; updates cached availability for affected date/staff.
  - `send-notification`: dispatches push/email/sms based on event.
  - `appointment-reminder`: scheduled 24h and 1h before appointment.
  - `review-request`: scheduled after appointment end time + 2 hours.
  - `release-held-slot`: releases slot if booking not completed within 10 min.
  - `data-cleanup`: anonymize deleted user data after grace period.
- Retry logic with exponential backoff for failed jobs.
- Dead letter queue for jobs exceeding max attempts.
- Monitoring via Bull Board UI (admin only).

**Priority**: P0 (core infrastructure)

## 4. Non-Functional Requirements
- **Performance**: API response < 200ms p95; slot computation < 500ms.
- **Scalability**: Support 100k concurrent users; horizontal scaling of services.
- **Security**: HTTPS, JWT with rotation, input sanitization, rate limiting, GDPR compliance.
- **Reliability**: 99.9% uptime; graceful degradation if third-party (Stripe, maps) down.
- **Localization**: Support multiple languages (English, French initially); date/time formats.

## 5. Release Phases
- **MVP (Phase 1)**: User Auth, Guest Browse, Search & Discovery, Business Detail, Booking Flow, Appointment Management, Availability & Slots, Payment, Notifications, Provider Portal basics, Background Jobs.
- **Phase 2**: Map Search, Favorites, User Profile, Reviews & Ratings, Service Categories, Admin Dashboard, Provider Portal enhancements (staff, multi-location).
- **Phase 3**: Advanced analytics, loyalty program, marketing tools, Stripe Connect payouts.

## 6. Glossary
- **Slot**: A bookable time interval for a service.
- **Hold**: Temporary reservation of a slot during booking.
- **Provider/Business Owner**: The merchant offering services.
- **Customer**: End-user booking services.
- **Add-ons**: Optional extra services added to a base service.
