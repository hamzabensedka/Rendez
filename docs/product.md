# Planity Clone - Product Specification

## 1. Overview

Planity Clone is a marketplace platform connecting customers with beauty, wellness, and service providers for online booking. The platform serves three user segments: customers seeking appointments, business owners managing their operations, and administrators overseeing the platform.

**Target Platforms:** iOS, Android, Web (responsive)
**Monetization:** Commission on bookings, subscription tiers for businesses

---

## 2. Feature Specifications

### 2.1 User Authentication

**Priority:** P0 - Critical

**Description:** Secure identity verification and session management for all user types.

**User Stories:**
- As a customer, I want to create an account so I can book appointments and manage my history.
- As a business owner, I want to register my business so I can manage my services and availability.
- As any user, I want to log in securely so my data is protected.

**Acceptance Criteria:**
- [ ] Email/password registration with validation (format, uniqueness, min 8 chars with uppercase, number, special char)
- [ ] Login returns JWT access token (15 min expiry) and refresh token (7 days)
- [ ] OAuth 2.0 integration: Google, Apple, Facebook
- [ ] Password reset via secure email link (expires in 1 hour)
- [ ] Email verification required before booking
- [ ] Role-based access: `customer`, `business_owner`, anytime `admin`
- [ ] Rate limiting: 5 failed attempts triggers 30-minute lockout
- [ ] Biometric login support on mobile (Face ID, fingerprint)
- [ ] Session management: list active sessions, revoke any device

**Technical Notes:**
- Use bcrypt for password hashing (cost factor 12)
- Store refresh tokens hashed in database for revocation
- Implement CSRF protection for cookie-based sessions

---

### 2.2 Guest Browse & Explore

**Priority:** P0 - Critical

**Description:** Allow unauthenticated users to discover businesses and services before committing to registration.

**User Stories:**
- As a visitor, I want to browse businesses without creating an account so I can evaluate the platform.
- As a visitor, I want to see service prices so I can compare options.

**Acceptance Criteria:**
- [ ] Full search and browse functionality accessible without login
- [ ] Business detail pages viewable by guests
- [ ] Service listings and pricing visible
- [ ] Reviews and ratings readable
- [ ] "Book" CTA prompts login/signup (modal, not redirect)
- [ ] Guest session persists for 24 hours (localStorage for location prefs)
- [ ] Upon registration, merge guest browsing history to new account

**Business Rules:**
- Booking action is the only gated functionality
- No limit on browse depth or duration

---

### 2.3 Business Search & Discovery

**Priority:** P0 - Critical

**Description:** Intelligent search with filtering to help customers find relevant providers.

**User Stories:**
- As a customer, I want to search by business name, service, or treatment so I can find what I need.
- As a customer, I want to filter results so I can narrow options efficiently.

**Acceptance Criteria:**
- [ ] Full-text search across: business name, service names, treatment names, tags
- [ ] Autocomplete suggestions after 2 characters, with debounce 300ms
- [ ] Filters: distance (1-50km), price range, rating (4.0+), availability (today, this week), category, amenities
- [ ] Sort options: relevance (default), distance, rating, price (low-high), most reviewed
- [ ] Search history stored (last 10 searches), clearable
- [ ] Saved searches with optional push notification for new matching businesses
- [ ] Results pagination: 20 items per page, cursor-based for performance
- [ ] Empty state with suggested alternatives (nearby categories, popular searches)
- [ ] "Near me" uses GPS with fallback to selected city/zip

**Performance:**
- Search response < 200ms for first page
- Autocomplete < 100ms

---

### 2.4 Map-based Search

**Priority:** P0 - Critical

**Description:** Visual geographic exploration of available businesses.

**User Stories:**
- As a customer, I want to see businesses on a map so I can choose by location convenience.

**Acceptance Criteria:**
- [ ] Interactive map (Google Maps or Mapbox) with business markers
- [ ] Clustering for dense areas (zoom-dependent, max 50 markers unclustered)
- [ ] Marker color coding: open (green), closing soon (orange), closed (gray), fully booked (red)
- [ ] Tap marker shows business card preview: name, rating, price range, next available slot
- [ ] "List view" toggle for accessibility
- [ ] Current location button with permission handling
- [ ] Map bounds update triggers new search (debounced 500ms)
- [ ] Deep link to native maps for directions
- [ ] Offline: cache last viewed map tiles (512MB limit)

---

### 2.5 Business Detail View

**Priority:** P0 - Critical

**Description:** Comprehensive information page for a single business.

**User Stories:**
- As a customer, I want to see all business details so I can make an informed booking decision.

**Acceptance Criteria:**
- [ ] Header: business name, verified badge, favorite toggle, share button
- [ ] Photo gallery: up to 30 images, swipeable, full-screen viewer, pinch zoom
- [ ] Key info: address (with map thumbnail), phone, website, hours (today + full week), COVID policies
- [ ] Service menu: categorized, with prices, durations, descriptions
- [ ] Staff profiles: photo, name, bio, specialties, average rating
- [ ] Reviews section: aggregate rating (1 decimal), distribution bar chart, sortable (recent, highest, lowest), photos in reviews
- [ ] "Book Now" sticky CTA, scroll-aware
- [ ] Similar businesses carousel (same category, nearby)
- [ ] Report business button (inappropriate content, closed, etc.)

**Performance:**
- Initial paint < 1.5s
- Lazy load images below fold

---

### 2.6 Service Categories

**Priority:** P0 - Critical

**Description:** Hierarchical classification for service discovery and business organization.

**Acceptance Criteria:**
- [ ] Predefined category tree: Beauty > Hair > Haircut, Coloring, Styling; Wellness > Massage, Spa, etc.
- [ ] Maximum 4 levels deep
- [ ] Business can select up to 5 primary categories
- [ ] Each service assigned to one category leaf node
- [ ] Category icons and cover images for browse UI
- [ ] Trending categories section (algorithm: booking volume last 30 days)
- [ ] Category SEO pages with structured data
- [ ] Admin ability to add/edit/disable categories (soft delete)

---

### 2.7 Booking Flow

**Priority:** P0 - Critical

**Description:** Core conversion funnel for appointment scheduling.

**User Stories:**
- As a customer, I want to book an appointment in minimal steps so I can secure my preferred time.

**Acceptance Criteria:**
- [ ] Step 1 - Select service(s): single or multiple, shows total duration and price
- [ ] Step 2 - Select staff (optional "no preference"), shows staff availability
- [ ] Step 3 - Select date and time: calendar view with available slots highlighted
- [ ] Step 4 - Add-ons/notes: special requests, allergies, first visit checkbox
- [ ] Step 5 - Review and confirm: all details, cancellation policy, total with breakdown
- [ ] Payment step (if required by business): see Payment Integration
- [ ] Confirmation screen with: booking reference, calendar invite (.ics), add to Google/Apple calendar, share
- [ ] Guest checkout option (email + phone), account creation prompt post-booking
- [ ] Abandoned booking recovery: email reminder after 1 hour if not completed
- [ ] Modify booking before confirmation (back navigation preserves state)

**Business Rules:**
- Booking window: minimum 2 hours before appointment (configurable by business)
- Maximum future booking: 3 months
- Hold slot for 10 minutes during checkout (distributed lock)

---

### 2.8 Appointment Management

**Priority:** P0 - Critical

**Description:** Post-booking lifecycle for customers and business owners.

**Customer Acceptance Criteria:**
- [ ] Upcoming appointments list, sortable by date
- [ ] Appointment detail: QR code for check-in, directions, contact business, cancel/reschedule
- [ ] Reschedule: search new slots, no penalty if >24h before, otherwise business policy applies
- [ ] Cancel with reason selection (required), refund status if paid
- [ ] Past appointments: rebook same service, review prompt (after 24h)
- [ ] Add to personal calendar (Google, Apple, Outlook)

**Business Owner Acceptance Criteria:**
- [ ] Daily/weekly calendar view (agenda, day, week, month)
- [ ] Appointment statuses: pending, confirmed, checked-in, in-progress, completed, no-show, cancelled
- [ ] Status transitions with timestamps and actor
- [ ] Check-in via QR scan or manual confirmation
- [ ] Block time (break, meeting) with reason
- [ ] Override: book outside normal hours, double-book (warn)
- [ ] Print daily schedule

---

### 2.9 Favorites

**Priority:** P1 - High

**Description:** Personal saved list for quick access to preferred businesses.

**Acceptance Criteria:**
- [ ] Toggle favorite from business card, detail page, or post-appointment
- [ ] Favorites list: sortable (recently added, alphabetical, nearest), searchable
- [ ] Quick rebook from favorite (jumps to booking flow with pre-selected business)
- [ ] Push notification: "Your favorite [Business] has new availability this week"
- [ ] Sync across devices (if logged in)
- [ ] Maximum 200 favorites (soft limit, warn at 180)
- [ ] Share favorite list (read-only link)

---

### 2.10 User Profile

**Priority:** P1 - High

**Description:** Customer identity and preference management.

**Acceptance Criteria:**
- [ ] Profile photo (camera/gallery, crop to circle, max 5MB)
- [ ] Display name, email, phone, birthday (optional, for birthday offers)
- [ ] Notification preferences: push, email, SMS (granular per type)
- [ ] Privacy: profile visibility (public, friends only, private)
- [ ] Linked accounts (social logins)
- [ ] Delete account: GDPR-compliant, 30-day grace period, data export GDPR export
- [ ] Booking history: searchable, filterable by date, business, service
- [ ] Loyalty points if applicable
- [ ] Preferred language and currency

---

### 2.11 Availability & Slot Computation

**Priority:** P0 - Critical

**Description:** Real-time calculation of bookable time slots.

**Acceptance Criteria:**
- [ ] Business defines: operating hours per day, slot duration (or variable by service), buffer between appointments
- [ ] Staff-specific schedules override business default
- [ ] Blackout dates (holidays, vacation)
- [ ] Recurring unavailability (e.g., every Wednesday afternoon)
- [ ] Slot computation accounts for: existing bookings, staff breaks, service duration, travel time (mobile services)
- [ ] Real-time availability API: < 100ms response
- [ ] Cache invalidation on booking change (event-driven)
- [ ] Overbooking protection: pessimistic locking at database level
- [ ] Timezone handling: store in UTC, display in business timezone
- [ ] Edge cases: DST transitions, leap year

**Algorithm:**
- Generate candidate slots from business hours
- Subtract blocked times
- Subtract existing confirmed appointments
- Apply buffer rules
- Return remaining slots grouped by staff

---

### 2.12 Shared Types & Design System

**Priority:** P1 - High

**Description:** Consistent UI/UX foundation across all platforms.

**Acceptance Criteria:**
- [ ] Component library: buttons, inputs, cards, modals, toasts, skeletons, empty states
- [ ] Color system: primary (#FF6B6B), secondary, semantic (success, warning, error, info), dark mode support
- [ ] Typography: Inter for body, Playfair Display for headings, 8px base grid
- [ ] Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64px
- [ ] Animation specs: 200ms ease-in-out standard, 300ms for page transitions
- [ ] Accessibility: WCAG 2.1 AA minimum, focus indicators, screen reader labels, minimum 44px touch targets
- [ ] Shared TypeScript types: published as `@planity-clone/types` package
- [ ] Design tokens in JSON for cross-platform consumption
- [ ] Storybook for web component documentation

---

### 2.13 Reviews & Ratings

**Priority:** P1 - High

**Description:** Social proof and quality feedback system.

**Acceptance Criteria:**
- [ ] Eligible to review: completed appointment, within 30 days, one review per appointment
- [ ] Rating: 1-5 stars, required
- [ ] Review text: 10-2000 characters, optional
- [ ] Photo upload: up to 5 images, moderation required
- [ ] Business owner response: within 30 days of review, editable once
- [ ] Review helpfulness voting (thumbs up/down)
- [ ] Report review for: inappropriate content, fake, conflict of interest
- [ ] Moderation queue: auto-approve if no flags, human review for reports
- [ ] Aggregate: average, total count, distribution, recent trend
- [ ] Sort: most relevant, newest, highest/lowest rating
- [ ] Filter: with photos, verified visits only, responded by business

---

### 2.14 Payment Integration

**Priority:** P0 - Critical

**Description:** Secure transaction processing for bookings.

**Acceptance Criteria:**
- [ ] Payment methods: credit/debit (Stripe), Apple Pay, Google Pay, PayPal
- [ ] Payment timing options: full upfront, deposit (configurable %), pay at venue
- [ ] No-show protection: hold on card, charge if no-show (business policy)
- [ ] Refund processing: automatic (if >24h cancel), manual approval, partial refunds
- [ ] Receipt: email + in-app, with business VAT info
- [ ] Invoice generation for B2B
- [ ] Payment failure handling: retry x3, notify customer and business, auto-cancel if unresolved in 24h
- [ ] PCI compliance: never store raw card data (Stripe tokens)
- [ ] Currency: display in customer preference, settle in business currency (Stripe conversion)
- [ ] Payout schedule to business: weekly, configurable

---

### 2.15 Notifications

**Priority:** P1 - High

**Description:** Multi-channel communication for booking lifecycle and engagement.

**Acceptance Criteria:**
- [ ] Channels: push (FCM/APNs), email (SendGrid), SMS (Twilio), in-app inbox
- [ ] Triggered notifications:
  - Booking confirmed (immediate)
  - Reminder: 24h before, 2h before
  - Change/cancellation by business
  - Request to review (24h after appointment)
  - Promotional (opt-in): favorite business new availability, price drop
- [ ] Preference management: granular opt-in/out per channel and category
- [ ] Quiet hours: respect local timezone, default 10pm-8am
- [ ] Inbox: persistent notification history, mark read/unread, 90-day retention
- [ ] Deep links: notification taps navigate to relevant screen
- [ ] Delivery tracking: retry failed pushes, fallback to SMS for critical

---

### 2.16 Provider / Business Owner Portal

**Priority:** P0 - Critical

**Description:** Dedicated interface for business management.

**Acceptance Criteria:**
- [ ] Dashboard: today's appointments, revenue this week, new reviews, quick actions
- [ ] Business profile editor: all fields from detail view, photos, services, staff
- [ ] Service management: CRUD, pricing, duration, staff assignment, online booking toggle
- [ ] Staff management: profiles, schedules, permissions (view only, manage bookings, admin)
- [ ] Calendar: see Appointment Management (business owner)
- [ ] Client list: searchable, notes, visit history, marketing tags
- [ ] Analytics: bookings, revenue, no-shows, popular services, peak hours (export to CSV)
- [ ] Settings: booking policies, cancellation rules, payment methods, integrations
- [ ] Mobile-responsive web (dedicated app v2)

---

### 2.17 Admin Dashboard

**Priority:** P1 - High

**Description:** Platform oversight and operations.

**Acceptance Criteria:**
- [ ] User management: search, view, suspend, impersonate (audit log)
- [ ] Business onboarding: verification workflow, document review, approve/reject with reason
- [ ] Content moderation: reported reviews, businesses, images; approve/reject/escalate
- [ ] Financial: transaction monitoring, dispute handling, payout management
- [ ] Analytics: MAU, booking volume, GMV, churn, top categories, geographic heatmap
- [ ] System health: API latency, error rates, queue depth
- [ ] Role-based access: super_admin, support, finance, moderator
- [ ] Audit log: all admin actions, immutable, searchable 2 years

---

### 2.18 Background Jobs (BullMQ)

**Priority:** P1 - High

**Description:** Asynchronous task processing for reliability and performance.

**Acceptance Criteria:**
- [ ] Job types and queues:
  - `notifications`: all outbound communications
  - `payments`: charge processing, payouts, reconciliation
  - `search-index`: update Elasticsearch on data changes
  - `reports`: scheduled analytics generation
  - `cleanup`: GDPR data purging, log rotation
  - `imports`: bulk data operations
- [ ] Retry policy: exponential backoff, max 5 attempts, dead letter queue
- [ ] Job idempotency: deduplication by unique job ID
- [ ] Monitoring: queue depth, processing rate, failed jobs, alerting threshold
- [ ] Priority levels: critical (payment failure), high (booking confirmation), normal, low (reports)
- [ ] Scheduled jobs: cron syntax, timezone-aware
- [ ] Job progress tracking for long-running operations
- [ ] Graceful shutdown: finish current jobs, no new pickups

---

## 3. Non-Functional Requirements

| Aspect | Requirement |
|--------|-------------|
| Performance | P95 API response < 300ms; page load < 2s |
| Availability | 99.9% uptime; < 4h planned maintenance/month |
| Security | OWASP Top 10 mitigation; annual penetration test |
| Scalability | Support 10k concurrent users; 1M bookings/month |
| Compliance | GDPR, CCPA, PCI-DSS Level 1 |
| Localization | EN, FR, DE, ES launch; RTL for future |

---

## 4. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion rate | > 15% (search to confirmed) |
| App install to first booking | < 7 days |
| Business NPS | > 50 |
| Customer NPS | > 60 |
| Monthly churn (businesses) | < 5% |
| Support ticket volume | < 2% of bookings |

---

## 5. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Guest Browse, Search, Business Detail, Booking, Appointments, Payments | Month 1-2 |
| V1 | Map, Favorites, Profile, Reviews, Notifications, Business Portal | Month 3-4 |
| V2 | Admin Dashboard, Analytics, Background Jobs optimization, i18n expansion | Month 5-6 |

---

*Document Version: 1.0*
*Last Updated: 2024*
*Owner: Alex, Product Owner*