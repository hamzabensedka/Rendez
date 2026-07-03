# Product Specification: Planity Clone

## 1. Document Control
- **Version:** 1.0
- **Author:** Alex (Product Owner)
- **Date:** 2025-03-20
- **Status:** Draft

## 2. Overview
Planity Clone is a mobile-first beauty & wellness booking platform connecting customers with salons, spas, and independent professionals. It enables seamless discovery, scheduling, payment, and management of appointments. A provider portal and admin dashboard support business operations and platform governance.

### 2.1 Vision
Become the most trusted and convenient way to book beauty and wellness services locally.

### 2.2 User Personas
- **Guest:** Unauthenticated browsing user.
- **Customer:** Registered user who searches, books, and manages appointments.
- **Provider/Business Owner:** Manages a listed business, services, staff, and schedules.
- **Admin:** Platform super-user overseeing operations, content, and analytics.

---

## 3. Features & Acceptance Criteria
All features are prioritized as P0 (must-have for MVP), P1 (should-have for v1.1), or P2 (nice-to-have for v2).

### 3.1 User Authentication
**Priority: P0**
Customers must register and sign in to book appointments. Social login and phone OTP are P1 enhancements.
- **Acceptance Criteria:**
  - User can sign up with email and password; email verification required before first booking.
  - User can log in with email/password; JWT access token issued (15 min) with refresh token (7 days).
  - Social login (Google, Apple) available on mobile (P1).
  - Password reset flow: request email → click link → set new password.
  - Guest can seamlessly upgrade to a full account during the booking flow (P0).
  - Logout clears tokens and redirects to home.

### 3.2 Guest Browse & Explore
**Priority: P0**
Unauthenticated users can explore the platform before committing.
- **Acceptance Criteria:**
  - Guest can view home feed with featured businesses, categories, and search bar.
  - Guest can search businesses, apply filters, and view business details including services and reviews.
  - Any attempt to book or favorite triggers a prompt to sign up/log in.
  - Location permissions requested to improve search relevance (optional).

### 3.3 Business Search & Discovery
**Priority: P0**
Powerful search with autocomplete, filters, and sorting.
- **Acceptance Criteria:**
  - Search bar supports free-text keyword search (business name, service, location).
  - Autocomplete suggests business names and services after 2 characters, with throttled API calls.
  - Filter chips: Category, Price range, Rating, Distance, Open Now, Availability (today/tomorrow).
  - Sort options: Relevance, Highest Rated, Nearest, Price Low/High.
  - Result list displays business card (cover photo, name, average rating, distance, next available slot).
  - Empty state with helpful suggestion (e.g., “Try expanding your search radius”).
  - Pagination (infinite scroll) loading 20 results per request.

### 3.4 Map-based Search
**Priority: P1**
Interactive map view as an alternative to list view.
- **Acceptance Criteria:**
  - Toggle between list and map view on search results screen.
  - Map displays business pins with clustering when zoomed out.
  - Tapping a pin shows a mini-card (name, rating, distance); “View” button opens business detail.
  - Pan/zoom updates the results based on visible region, respecting current filters.
  - User’s current location indicated with a blue dot (with permission).
  - Performance: map loads ≤2s on 4G.

### 3.5 Business Detail View
**Priority: P0**
Comprehensive profile to drive booking decisions.
- **Acceptance Criteria:**
  - Image carousel with up to 10 photos, lazy-loaded.
  - Business name, rating (stars + count), address with map preview, phone (tap to call), hours of operation.
  - Services tab: accordion list grouped by category, each showing name, duration, price.
  - Staff tab: grid of staff cards with photo, name, specialties, and next available slot.
  - Reviews tab: summary (rating distribution), paginated list of reviews with option to filter by rating.
  - Quick actions: Favorite toggle, share button, “Book” button always visible.
  - “Book” button directly opens booking flow with the business preselected.

### 3.6 Service Categories
**Priority: P0**
Hierarchical service taxonomy for organized browsing.
- **Acceptance Criteria:**
  - Predefined top-level categories (Hair, Nails, Spa, Massage, Skin Care, Barbershop, etc.) display as tappable cards on the home screen.
  - Tapping a category shows subcategories (e.g., Hair → Haircut, Coloring, Styling) and a list of businesses offering that service.
  - Admin can add/edit/remove categories and subcategories via Admin Dashboard (P0).
  - Providers map their services to existing categories during service creation.

### 3.7 Booking Flow
**Priority: P0**
Step-by-step wizard that converts browsing into confirmed appointments.
- **Acceptance Criteria:**
  - **Step 1 - Service Selection:** User selects one or more services (P0 single, P1 multiple). Summary panel updates with total price and duration.
  - **Step 2 - Staff Selection:** Chooses “Any” or specific staff member; staff list filtered to those who offer all selected services.
  - **Step 3 - Date & Time Slot:** Calendar picker with dates having availability highlighted. Time grid shows available slots computed by Availability Service (see 3.11). Slots adjust in real-time when changing staff.
  - **Step 4 - Confirmation & Payment:** Summary of services, staff, date/time, price breakdown (subtotal, taxes, fees). Promo code field. Customer info pre-filled from profile. Payment method selection (saved cards or add new). “Confirm and Pay” triggers payment.
  - **Step 5 - Confirmation Screen:** Success state with booking ID, calendar invite option, and prompt to add to favorites.
  - Error handling: Slot taken while filling form → display fallback slots; payment failure → retry option.
  - Slot reservation: After starting payment, slot is reserved for 10 minutes; if unpaid, released and user notified.

### 3.8 Appointment Management
**Priority: P0**
Central place for customers to view and modify their bookings.
- **Acceptance Criteria:**
  - “My Appointments” screen with two tabs: Upcoming and Past.
  - Upcoming list shows appointment cards with business name, date/time, service, staff, status (confirmed, pending, rescheduled).
  - Actions: Reschedule (opens booking flow pre-filled, only future slots allowed according to business policy, e.g., 24h min), Cancel (with cancellation reason and possible fee per policy).
  - Past list shows completed and cancelled appointments; actions: Rebook (pre-fills same business/service), Leave a Review if not already reviewed.
  - Changes trigger push/email notifications to customer and provider.
  - Pull-to-refresh and loading skeleton.

### 3.9 Favorites
**Priority: P1**
Bookmark businesses for quick access.
- **Acceptance Criteria:**
  - Favorite button (heart icon) on business cards and detail page.
  - “Favorites” tab on main navigation lists saved businesses with little preview (next available slot).
  - Unfavorite confirmation via toggle.
  - Favorites persist across sessions; synced with user account.

### 3.10 User Profile
**Priority: P0**
Manage personal information and preferences.
- **Acceptance Criteria:**
  - Edit name, email, phone number, profile photo.
  - Manage payment methods: view saved cards (last 4, brand), add new via Stripe Elements/Secure Fields, delete.
  - Notification preferences: push (by type: bookings, reminders, promos), email.
  - Appointment history (Quick access to appointment management).
  - Account actions: Change password, Delete account (confirm with re-authentication).
  - Email change triggers re-verification.

### 3.11 Availability & Slot Computation
**Priority: P0 (critical)**
Real-time engine that exposes bookable time slots.
- **Acceptance Criteria:**
  - Given a business ID, date, service(s), and optional staff ID, return a list of start times where duration can be accommodated without conflict.
  - Rules: working hours per staff (including breaks), existing bookings, buffer times between appointments (configurable per business), service duration, staff-service assignment.
  - Slots respect concurrent services (if multiple services selected, sum duration).
  - API response time <200ms for 95th percentile; caching via Redis with invalidation on relevant booking events.
  - Transactional slot reservation: When a user enters payment, the slot is temporarily reserved (10 min) via a BullMQ job that releases if payment not completed.
  - Slot display indicates “Only X left” when few remain to create urgency.
  - Provider changes (staff hours, service duration) trigger immediate cache invalidation and slot recalculation.

### 3.12 Shared Types & Design System
**Priority: P0**
Foundation for consistent UI and data contracts across platforms.
- **Acceptance Criteria:**
  - Design system documented in Storybook with reusable components: Button, Input, Card, Modal, Calendar, TimeGrid, RatingStars, etc. All responsive.
  - TypeScript interfaces and enums in a shared package for: User, Business, Service, Staff, Booking, Review, Notification, Slot, etc.
  - Components meet accessibility contrast ratios, support touch targets ≥48px.
  - All platform UIs strictly use these shared components; deviations require design review.

### 3.13 Reviews & Ratings
**Priority: P0**
Trust-building via customer feedback.
- **Acceptance Criteria:**
  - After appointment completion (status = completed), customer receives in-app prompt and push/email to leave a review.
  - Review form: 1–5 star rating, optional text (min 10 chars if provided), optional photo upload (max 3).
  - Reviews displayed on business detail page sorted by recent; business overall rating updated in real-time.
  - Provider can respond publicly to reviews (one response per review).
  - Admin can hide/delete reviews flagged as inappropriate.
  - User can edit/delete their own review within 48h; after that, only text edit allowed.

### 3.14 Payment Integration
**Priority: P0**
Secure, PCI-compliant payment processing.
- **Acceptance Criteria:**
  - Use Stripe as payment gateway; card details tokenized on client side (Stripe Elements/Mobile SDK).
  - Support credit/debit cards (Visa, MC, Amex) and digital wallets (Apple Pay, Google Pay – P1).
  - Business can configure booking policy: Prepayment required (full/partial) or Pay at venue.
  - Prepayment flow: Create PaymentIntent at booking confirmation; capture immediately if prepaid.
  - Refund logic: automatic full refund if cancelled within business’s free cancellation window; otherwise manual refund by provider or policy-based partial refund.
  - Webhook handling via background jobs for payment success/failure/dispute updates; idempotency keys prevent duplicate processing.
  - Payment history visible in customer’s profile and booking details.

### 3.15 Notifications
**Priority: P0**
Multi-channel communication to keep users engaged and informed.
- **Acceptance Criteria:**
  - Push notifications (via Firebase Cloud Messaging) for: booking confirmation, upcoming appointment reminder (24h and 1h before), reschedule/cancellation confirmation, review prompt, promotional messages.
  - Transactional emails (via SendGrid/Mailgun) for same events, plus receipts.
  - In-app notification center with list view and unread badge.
  - Notification preferences from user profile honored; no push if disabled.
  - Deep linking from notification to relevant screen (e.g., booking detail).
  - For providers: real-time push for new booking, cancellation, new review.
  - Admin can send bulk push/email to segmented customer groups (P2).
  - Reliable delivery via BullMQ jobs with retry logic.

### 3.16 Provider / Business Owner Portal
**Priority: P0**
Web-based dashboard empowering businesses to self-manage.
- **Acceptance Criteria:**
  - Provider registration (separate from customer) via invite or self-onboarding with business details.
  - Dashboard home: today’s bookings list, quick stats (upcoming count, revenue today), recent reviews.
  - Bookings management: calendar view (day/week/month), list view with filters (date, staff, status), ability to confirm, cancel, mark as no-show, add internal notes.
  - Services management: CRUD of services with name, description, duration, price, category, assign to staff.
  - Staff management: add/edit/remove staff, set working hours per day, buffer times, service assignments, upload photo.
  - Business profile: edit name, description, photos, contact, address, hours of operation, policies (cancellation window, prepayment requirement).
  - Reviews: list customer reviews with ability to respond.
  - Real-time sync: changes to services/staff/hours instantly reflected in customer-facing availability.
  - Access control: owner can create staff accounts with limited permissions (e.g., only view bookings).

### 3.17 Admin Dashboard
**Priority: P1 (minimal needed at launch, enhanced later)**
Central control for platform operations.
- **Acceptance Criteria:**
  - Admin authentication with role-based access (super admin, content moderator).
  - Business management: view all registered businesses, approve/reject listings, suspend/delete.
  - Category management: create, edit, delete service categories and subcategories.
  - Review moderation: list all reviews, filter by flagged, hide/unhide/delete.
  - User management: search customers and providers, view details, suspend/delete accounts.
  - Analytics dashboard: overview of total bookings, GMV, active users, new registrations over time (daily/weekly/monthly). Exportable reports (P2).
  - Configuration: set platform-wide settings (commission percentage, default cancellation window, etc.).
  - Audit log of admin actions.

### 3.18 Background Jobs (BullMQ)
**Priority: P0**
Asynchronous processing for reliability and performance.
- **Acceptance Criteria:**
  - Queue system built on Redis with BullMQ.
  - Job types: sendEmail, sendPush, processPaymentWebhook, recalcSlots (triggered after booking/cancellation/staff change), appointmentReminder (scheduled via cron-like repeatable jobs), generateReport, cleanupReservedSlots.
  - At-least-once delivery; idempotent handling for payment webhooks.
  - Retry with exponential backoff (max 5 attempts), dead letter queue for failed jobs after retries exhausted.
  - Dashboard for monitoring queue lengths, failures, latency (P2).
  - Graceful shutdown and concurrency control.

---

## 4. Non-Functional Requirements
- **Performance:** API response times <200ms (95th percentile), booking flow <3s end-to-end on mobile.
- **Scalability:** Support 100k concurrent users during peak; horizontal scaling for compute, caching layer for hot data.
- **Security:** HTTPS only, JWT with rotating refresh tokens, rate limiting on auth endpoints, input sanitization, data encryption at rest and in transit, PCI DSS compliance via Stripe.
- **Reliability:** 99.9% uptime SLA; graceful degradation if third-party services fail (e.g., map tiles).
- **Accessibility:** WCAG 2.1 AA for provider and admin portals; mobile app follow platform accessibility guidelines.
- **Localization:** Support English (default) and French (P1). All user-facing strings in i18n framework.
- **Offline Support (P2):** Cache home feed, business details, and appointment list for viewing offline; queue review submission.

---

## 5. Release Phasing & Priorities

### MVP (P0 – Launch)
- User Authentication (basic email)
- Guest Browse & Explore
- Business Search & Discovery (list view)
- Business Detail View
- Service Categories (flat hierarchy)
- Booking Flow (single service, single staff, prepay)
- Appointment Management (view, cancel, reschedule)
- User Profile (edit info, payment methods)
- Availability & Slot Computation
- Shared Types & Design System fundamentals
- Reviews & Ratings (basic)
- Payment Integration (Stripe card, prepay)
- Notifications (booking confirmations, reminders)
- Provider Portal (core: manage services, staff, bookings)
- Background Jobs for notifications and slot cleanup

### V1.1 (P1 – 2 months post-launch)
- Social login (Google/Apple)
- Map-based Search
- Favorites
- Multiple services in booking
- Review response by provider
- Admin Dashboard (basic moderation, analytics)
- Digital wallets (Apple/Google Pay)
- i18n French support

### V2 (P2 – roadmap)
- Advanced analytics with exports
- Loyalty/rewards program
- Marketing push campaigns
- Offline mode
- Multi-language expansion
- Waitlist for fully booked slots

---

## 6. Out of Scope
- In-app messaging chat
- Social feed or community features
- Staff-specific mobile app (v1 uses provider portal web)
- POS integration

## 7. Appendices
### 7.1 Technical Stack Recommendation
- **Frontend:** React Native (iOS/Android), React (Provider & Admin Web)
- **Backend:** NestJS (Node.js/TypeScript), GraphQL or REST with OpenAPI
- **Database:** PostgreSQL (primary), Redis (queues, cache, session store)
- **Message Queue:** BullMQ (based on Redis)
- **Payments:** Stripe Connect
- **Maps:** Mapbox
- **Notifications:** Firebase Cloud Messaging, SendGrid
- **Infrastructure:** Docker, Kubernetes, AWS/GCP

### 7.2 Key Metrics to Track
- Conversion from search to booking
- Booking abandonment at each step
- Slot reservation expiration rate
- Provider portal adoption (claimed businesses)
- Customer retention (repeat bookings within 30 days)
- NPS via post-appointment survey
