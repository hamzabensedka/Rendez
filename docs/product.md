# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a marketplace platform connecting customers with local service businesses (salons, barbershops, spas, clinics). Customers discover, book, and manage appointments; business owners manage their availability, services, and client base; administrators oversee platform health.

**Target Users:** Consumers seeking beauty/wellness services; small-to-medium service businesses; platform administrators.

**Platforms:** iOS, Android, Web (responsive).

---

## 2. Feature Specifications

### 2.1 User Authentication

**Priority:** P0 — Critical path for personalized features and bookings.

**Description:** Secure identity verification and session management for customers and business owners.

**Acceptance Criteria:**
- [ ] Users can register with email/password, Google OAuth, Apple Sign-In
- [ ] Passwords require minimum 8 characters, 1 uppercase, 1 number, 1 special character
- [ ] Email verification required before first booking
- [ ] Users can log in with any registered method
- [ ] Password reset via secure token link (expires 1 hour)
- [ ] JWT access token (15 min expiry) + refresh token (7 days) with rotation
- [ ] Biometric login option on mobile (Face ID / Touch ID / fingerprint)
- [ ] Users can log out from all devices
- [ ] Account lockout after 5 failed attempts (30-minute cooldown)
- [ ] GDPR-compliant account deletion with 30-day grace period
- [ ] Role-based access: `customer`, `business_owner`, `admin`

**Non-Functional:** Auth0 or custom OAuth2 implementation; rate limit login attempts.

---

### 2.2 Guest Browse & Explore

**Priority:** P0 — Drives acquisition; reduces friction.

**Description:** Unauthenticated users can browse businesses, services, and availability without registration.

**Acceptance Criteria:**
- [ ] Guest users can view business listings, search, filter, and see business profiles
- [ ] Guest users can view service menus and base prices
- [ ] Guest users can see real-time availability (slots) without booking capability
- [ ] "Book Now" CTA prompts registration/login with return URL preservation
- [ ] Guest session data (search filters, viewed businesses) persists for 24 hours via localStorage/cookies
- [ ] Post-login, guest data merges to authenticated account (favorites, viewed items)
- [ ] No personal data collection beyond IP-based geolocation

---

### 2.3 Business Search & Discovery

**Priority:** P0 — Core value proposition.

**Description:** Find businesses through multi-faceted search with intelligent ranking.

**Acceptance Criteria:**
- [ ] Full-text search across business name, service name, description, tags
- [ ] Autocomplete suggestions after 2 characters with debounce (300ms)
- [ ] Search history (last 10 queries), deletable per-item or clear all
- [ ] Trending searches section
- [ ] Filters: distance (km/mi), rating (≥ threshold), price range, open now, accepts online booking
- [ ] Sort options: relevance, distance, rating (highest), price (lowest to highest), most reviewed
- [ ] Pagination: 20 results per page, infinite scroll on mobile
- [ ] "Near Me" uses device GPS with fallback to IP geolocation; explicit permission request
- [ ] Search result cards show: thumbnail, name, rating, distance, price range, next available slot, "open now" badge
- [ ] Empty state with suggested nearby alternatives when no results

---

### 2.4 Map-based Search

**Priority:** P0 — Critical for location-driven discovery.

**Description:** Visual exploration of businesses on an interactive map.

**Acceptance Criteria:**
- [ ] Map view toggle on search results (list ↔ map)
- [ ] Interactive map with clustered markers (Mapbox or Google Maps)
- [ ] Marker clustering at zoom levels; auto-cluster/uncluster on zoom
- [ ] Tap marker shows bottom sheet with business summary (name, rating, image, next availability)
- [ ] Tap summary navigates to Business Detail View
- [ ] User location dot with accuracy radius; recenter button
- [ ] Map bounds filter search results dynamically
- [ ] Dark/light mode support for map tiles
- [ ] Accessibility: screen reader announces business count in viewport

---

### 2.5 Business Detail View

**Priority:** P0 — Conversion-critical page.

**Description:** Comprehensive business profile driving booking decisions.

**Acceptance Criteria:**
- [ ] Hero image carousel (up to 10 images), pinch-to-zoom
- [ ] Business name, verified badge, rating, review count, favorite toggle
- [ ] Address with "Get Directions" (opens native maps app)
- [ ] Operating hours with "Open Now" dynamic indicator; holiday hours support
- [ ] Phone number with tap-to-call; WhatsApp integration if configured
- [ ] "About" section with rich text description, establishment year, languages spoken
- [ ] Services tab: categorized list with name, duration, description, price; expandable details
- [ ] Reviews tab: rating distribution, sortable reviews, owner's response indicator
- [ ] Team tab: staff profiles with photos, specialties, selectable for booking
- [ ] Availability preview: next 3 available slots per service with "See More" to booking flow
- [ ] Share business via native share sheet (deep link)
- [ ] Report business functionality

---

### 2.6 Service Categories

**Priority:** P0 — Navigation and discovery structure.

**Description:** Hierarchical classification of services for browse and filter.

**Acceptance Criteria:**
- [ ] Admin-managed category tree: root categories → subcategories (2 levels max)
- [ ] Categories include: name, icon (SVG), color, description, active/inactive status
- [ ] Business can assign multiple categories to their profile
- [ ] Services belong to one category; category change audits service assignments
- [ ] Category browsing from homepage with visual grid
- [ ] Category pages show featured businesses, trending services
- [ ] SEO-friendly URLs with category slugs

**Root Categories (v1):** Hair, Barber, Nails, Face & Skin, Massage, Body, Medical Aesthetic, Tattoo & Piercing, Fitness & Wellness.

---

### 2.7 Booking Flow

**Priority:** P0 — Revenue-critical; must minimize abandonment.

**Description:** Multi-step reservation process with clear progress and flexibility.

**Acceptance Criteria:**
- [ ] Step 1 — Select Service: from business services or rebook from history; show duration, price, description
- [ ] Step 2 — Select Staff (optional): "Any available" default; show staff photos, ratings, next availability
- [ ] Step 3 — Select Date & Time: calendar view with available slots highlighted; timezone handling; show business timezone
- [ ] Step 4 — Add-ons & Options: upsell services, product purchases, special requests text field (500 char max)
- [ ] Step 5 — Review & Confirm: summary with cancellation policy, terms acceptance checkbox
- [ ] Step 6 — Payment (if required): see Payment Integration
- [ ] Confirmation screen with booking reference, add-to-calendar CTA, share booking
- [ ] Booking modification before confirmation; back navigation preserves state
- [ ] Guest checkout: collect minimal data (name, phone, email) with account creation prompt
- [ ] Abandoned booking recovery: email reminder after 1 hour with preserved cart
- [ ] Booking holds slot for 10 minutes during payment; release on timeout or cancellation

---

### 2.8 Appointment Management

**Priority:** P0 — Core user retention feature.

**Description:** Comprehensive lifecycle management of customer appointments.

**Acceptance Criteria:**
- [ ] Upcoming appointments list: chronological, grouped by date, with countdown to next
- [ ] Appointment card shows: business name, service, staff, date/time, status, QR code/check-in code
- [ ] Statuses: `pending`, `confirmed`, `checked_in`, `in_progress`, `completed`, `cancelled_by_customer`, `cancelled_by_business`, `no_show`
- [ ] Actions per status: reschedule (up to 2x, 24h before), cancel with reason selection, add to calendar
- [ ] Cancellation policy enforcement: free cancellation within business-defined window; fee otherwise
- [ ] Past appointments: rebook same service, leave review (within 14 days), view receipt
- [ ] Push notification and email confirmations for all status changes
- [ ] In-app messaging with business for appointment-specific communication
- [ ] Bulk actions: cancel all upcoming (e.g., vacation mode)

---

### 2.9 Favorites

**Priority:** P1 — Engagement and retention.

**Description:** Bookmark businesses for quick access and personalized recommendations.

**Acceptance Criteria:**
- [ ] Toggle favorite from business card, detail view, or post-booking
- [ ] Favorites list with sort: recently added, name, nearest, upcoming availability
- [ ] Favorite businesses show "New availability" badge when slots open
- [ ] Quick rebook from favorites (skip search)
- [ ] Share favorite list (public/private toggle)
- [ ] Import contacts to see friends' favorites (optional, privacy-controlled)
- [ ] Unfavorite with confirmation undo (5-second toast)
- [ ] Sync favorites across devices; handle merge conflicts (latest wins)

---

### 2.10 User Profile

**Priority:** P1 — Personalization and trust.

**Description:** Customer identity and preference management.

**Acceptance Criteria:**
- [ ] Profile photo upload (crop, 5MB max, JPG/PNG)
- [ ] Editable fields: display name, phone, email (verification on change), birthday (optional, for birthday offers)
- [ ] Notification preferences: push, email, SMS per category (bookings, promotions, reminders)
- [ ] Privacy settings: profile visibility, data sharing opt-outs
- [ ] Saved payment methods (see Payment Integration)
- [ ] Booking history with statistics: total appointments, favorite businesses, total spent
- [ ] Loyalty points display (if program active)
- [ ] Referral code generation and tracking

---

### 2.11 Availability & Slot Computation

**Priority:** P0 — Technical foundation for booking.

**Description:** Real-time calculation of bookable time slots considering all constraints.

**Acceptance Criteria:**
- [ ] Business defines weekly recurring schedule with exceptions (holidays, vacations)
- [ ] Staff-level schedules override business schedule; support part-time staff
- [ ] Service duration + buffer time (before/after) defines slot consumption
- [ ] Concurrent booking limits per staff/service room
- [ ] Slot generation algorithm accounts for: existing bookings, blocked times, staff breaks, service-specific preparation time
- [ ] Real-time availability query responds in <200ms (cached + computed)
- [ ] Timezone-aware: store in UTC, display in business timezone, detect customer timezone
- [ ] Business can set booking horizon (e.g., 60 days ahead) and minimum notice (e.g., 2 hours)
- [ ] Waitlist: notify when slot opens if preferred time unavailable
- [ ] Overbooking protection: pessimistic locking during slot selection

---

### 2.12 Shared Types & Design System

**Priority:** P0 — Development velocity and consistency.

**Description:** Reusable components, tokens, and type definitions across platforms.

**Acceptance Criteria:**
- [ ] Design tokens: colors (semantic: primary, success, warning, danger, info), typography scale (12 sizes), spacing scale (4px base), border radius, shadows, z-index layers
- [ ] Component library: buttons, inputs, selects, modals, bottom sheets, cards, avatars, skeleton loaders, empty states, error boundaries
- [ ] Theme support: light, dark, system-follow; business branding override (primary color, logo)
- [ ] TypeScript shared types package: User, Business, Service, Appointment, Payment, Review, Notification
- [ ] API contract types with Zod validation schemas
- [ ] Accessibility: WCAG 2.1 AA minimum; focus indicators, ARIA labels, reduced motion support
- [ ] Localization: i18n framework with English, French, Spanish, German for v1; RTL layout support
- [ ] Icon system: consistent 24px grid, semantic naming

---

### 2.13 Reviews & Ratings

**Priority:** P1 — Trust and quality signal.

**Description:** Post-appointment feedback system with moderation.

**Acceptance Criteria:**
- [ ] Eligibility: completed appointment, review window 14 days post-visit
- [ ] Rating: 1-5 stars, mandatory; review text: 10-1000 characters, optional
- [ ] Aspect ratings: service quality, staff professionalism, ambiance, value (optional v1, required v2)
- [ ] Photo upload: up to 5 images per review
- [ ] Business owner response: within 30 days, flagged as "Business Owner"
- [ ] Review helpfulness voting; report inappropriate content
- [ ] Moderation: auto-approve with keyword filter; manual queue for flagged reviews
- [ ] Average rating recalculation on new review; cache with 5-minute TTL
- [ ] Anonymous option: display "Verified Customer" instead of name
- [ ] Review incentive: loyalty points (configurable by admin)

---

### 2.14 Payment Integration

**Priority:** P0 — Revenue collection.

**Description:** Secure, flexible payment processing for bookings.

**Acceptance Criteria:**
- [ ] Payment methods: credit/debit cards (Stripe), Apple Pay, Google Pay, PayPal
- [ ] Business-configurable: full prepay, deposit (percentage or fixed), or pay-at-venue
- [ ] Stripe Connect for marketplace split: platform fee + business payout
- [ ] PCI DSS compliance: never store raw card data; use Stripe Elements
- [ ] Saved payment methods with 3D Secure for new cards
- [ ] Refund processing: full or partial, with reason logging; automatic for cancellations within policy
- [ ] Invoice generation: PDF download, email delivery
- [ ] Failed payment handling: retry with fallback method, booking hold extension
- [ ] Currency: business-configured, display in customer local with conversion note
- [ ] Tax calculation: automatic based on business location and service type

---

### 2.15 Notifications

**Priority:** P1 — Engagement and operational communication.

**Description:** Multi-channel, preference-aware notification system.

**Acceptance Criteria:**
- [ ] Channels: push (Firebase Cloud Messaging), email (SendGrid), SMS (Twilio), in-app inbox
- [ ] Trigger types: booking confirmation, reminder (24h, 2h before), modification, cancellation, promotional, system maintenance
- [ ] User preference controls per channel per category
- [ ] Rich push: deep links, action buttons (confirm, reschedule, cancel)
- [ ] Notification history: 90-day in-app inbox with unread indicators
- [ ] Delivery tracking: sent, delivered, opened metrics
- [ ] Rate limiting: max 3 promotional push/day; respect quiet hours (22:00-08:00 local)
- [ ] A/B testing framework for notification copy and timing

---

### 2.16 Provider / Business Owner Portal

**Priority:** P0 — Supply-side enablement.

**Description:** Web-based dashboard for business operations.

**Acceptance Criteria:**
- [ ] Dashboard: today's appointments, revenue snapshot, upcoming week preview
- [ ] Calendar view: day/week/month, drag-to-reschedule, click to view details
- [ ] Appointment actions: confirm, check-in, complete, cancel, reschedule, no-show mark
- [ ] Client management: CRM with visit history, notes, allergies/preferences, contact info
- [ ] Service management: CRUD services with pricing, duration, description, online booking toggle
- [ ] Staff management: add staff, set schedules, services assigned, commission tracking
- [ ] Availability management: recurring schedule, exceptions, time off requests
- [ ] Settings: business info, photos, cancellation policy, payment methods, notification preferences
- [ ] Reports: revenue, appointments, new clients, no-show rate, average booking value; date range export to CSV
- [ ] Multi-location support: switch location, aggregate reporting
- [ ] Role-based access: owner, manager, receptionist, staff (view own only)

---

### 2.17 Admin Dashboard

**Priority:** P1 — Platform operations.

**Description:** Internal tool for marketplace management.

**Acceptance Criteria:**
- [ ] Business onboarding: application review, document verification, approval workflow
- [ ] Business management: view, edit, suspend, delete; impersonation for support
- [ ] User management: search, view, suspend, delete; GDPR data export
- [ ] Content moderation: review flagged reviews, businesses, images
- [ ] Financial oversight: transaction logs, dispute resolution, payout scheduling
- [ ] Analytics: MAU, booking volume, GMV, conversion funnel, churn, top businesses/categories
- [ ] System configuration: feature flags, global settings, notification templates
- [ ] Audit logging: all admin actions with IP, timestamp, before/after values
- [ ] Support ticket integration

---

### 2.18 Background Jobs (BullMQ)

**Priority:** P0 — System reliability and performance.

**Description:** Asynchronous task processing with BullMQ on Redis.

**Acceptance Criteria:**
- [ ] Job definitions with typed payloads, priorities, retry policies, dead letter queues
- [ ] Scheduled jobs: daily/weekly reporting, data archival, cleanup tasks
- [ ] Event-driven jobs: payment webhooks, notification dispatch, search index updates, analytics events
- [ ] Retry logic: exponential backoff, max 5 attempts, manual retry from dashboard
- [ ] Monitoring: job success/failure rates, queue depth, processing latency dashboards
- [ ] Worker scaling: horizontal scaling with Redis lock for singleton jobs
- [ ] Critical jobs: booking confirmation (immediate), payment capture (within 5 min), reminder dispatch (scheduled)
- [ ] Job idempotency keys to prevent duplicate processing

---

## 3. Prioritization Matrix

| Feature | Priority | Sprint Target | Dependencies |
|---------|----------|---------------|--------------|
| User Authentication | P0 | S1 | — |
| Guest Browse & Explore | P0 | S1 | — |
| Business Search & Discovery | P0 | S1 | — |
| Map-based Search | P0 | S2 | Search |
| Business Detail View | P0 | S2 | — |
| Service Categories | P0 | S1 | — |
| Booking Flow | P0 | S3 | Auth, Availability, Payment |
| Appointment Management | P0 | S3 | Booking Flow |
| Availability & Slot Computation | P0 | S2 | — |
| Payment Integration | P0 | S3 | Booking Flow |
| Provider Portal | P0 | S4 | Booking, Appointments |
| Shared Types & Design System | P0 | S1-S2 | — |
| Favorites | P1 | S3 | Auth, Business Detail |
| User Profile | P1 | S3 | Auth |
| Reviews & Ratings | P1 | S4 | Appointments |
| Notifications | P1 | S3 | Booking, Appointments |
| Admin Dashboard | P1 | S5 | All above |
| Background Jobs | P0 | S2-S5 | Ongoing infrastructure |

---

## 4. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion rate | ≥ 8% |
| Search-to-detail rate | ≥ 25% |
| Day-7 retention | ≥ 30% |
| Business NPS | ≥ 50 |
| Payment success rate | ≥ 95% |
| Average booking value | Benchmark + 10% YoY |
| App store rating | ≥ 4.5 |

---

## 5. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Complex availability logic | Prototype with real business data; benchmark performance |
| Two-sided marketplace chicken-egg | Seed initial supply; customer waitlist for unserved areas |
| Payment disputes | Clear terms, automated receipts, human support escalation |
| No-show rates | Deposits, reminder cascade, penalty system |

---

*Document version: 1.0 | Last updated: 2024 | Owner: Alex, Product Owner*
