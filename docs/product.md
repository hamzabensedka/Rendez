# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first platform connecting consumers with beauty/wellness businesses for appointment booking. The product serves three user types: **Consumers** (book appointments), **Providers/Business Owners** (manage business, staff, and bookings), and **Admins** (platform governance).

---

## 2. Feature Specifications

### 2.1 User Authentication

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User Story** | As a user, I want to authenticate securely so I can access personalized features and manage my bookings. |

**Acceptance Criteria:**
- [ ] Users can register with email, password, and phone number
- [ ] Users can register/login via OAuth (Google, Apple)
- [ ] Password reset via email with secure token (24hr expiry)
- [ ] JWT access token (15min expiry) + refresh token (7 days) pattern
- [ ] Phone number verification via SMS OTP
- [ ] Biometric authentication option (Face ID/Touch ID) post-login
- [ ] Account lockout after 5 failed attempts (30-min cooldown)
- [ ] "Remember me" option extends session to 30 days
- [ ] Guest users prompted to authenticate at booking confirmation

---

### 2.2 Guest Browse & Explore

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User Story** | As an unauthenticated user, I want to browse businesses and services without creating an account. |

**Acceptance Criteria:**
- [ ] Full access to search, discovery, and business detail views
- [ ] Persistent guest session with local storage of viewed businesses
- [ ] "Continue as guest" option at every auth prompt
- [ ] Guest-to-authenticated user migration preserves browsing history and favorites
- [ ] Booking flow blocked at final confirmation; graceful auth prompt with context preservation
- [ ] Guest data merged upon account creation (not lost)

---

### 2.3 Business Search & Discovery

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User Story** | As a consumer, I want to find relevant businesses quickly using multiple search criteria. |

**Acceptance Criteria:**
- [ ] Full-text search across business name, service names, and description
- [ ] Autocomplete suggestions with typo tolerance (fuzzy matching, Levenshtein distance ≤ 2)
- [ ] Search history (last 10 searches, deletable)
- [ ] Trending searches and popular businesses in empty state
- [ ] Voice search capability
- [ ] Recent searches sync across devices for authenticated users
- [ ] Search debounced at 300ms to reduce API load
- [ ] Empty state with helpful suggestions when no results found

---

### 2.4 Map-based Search

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User Story** | As a consumer, I want to see businesses on a map to find convenient locations. |

**Acceptance Criteria:**
- [ ] Interactive map with business pins (clustered at zoom levels > 50 visible markers)
- [ ] User location detection with permission prompt (explain value proposition)
- [ ] "Near me" default sort with distance calculation
- [ ] Custom location search (address, neighborhood, city)
- [ ] Radius filter: 1km, 3km, 5km, 10km, 20km, any
- [ ] Map/list toggle with synchronized state
- [ ] Pin tap reveals business card with key info (name, rating, open status, next available slot)
- [ ] Directions integration (Google Maps, Apple Maps, Waze)
- [ ] Offline: cached map tiles for previously viewed areas

---

### 2.5 Business Detail View

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User Story** | As a consumer, I want comprehensive business information to make informed booking decisions. |

**Acceptance Criteria:**
- [ ] Hero: business name, verified badge, rating, review count, favorite toggle
- [ ] Photo gallery (up to 20 images, pinch-to-zoom, carousel)
- [ ] Operating hours with "Open Now" / "Closes soon" / "Closed" dynamic status
- [ ] Complete address with copy-to-clipboard and directions
- [ ] Phone number with one-tap dial
- [ ] Website link (in-app browser)
- [ ] Social media links
- [ ] Business description (up to 2000 chars)
- [ ] Amenities/tags (WiFi, parking, wheelchair accessible, etc.)
- [ ] COVID-19 safety measures (if applicable)
- [ ] "Book Now" CTA sticky at bottom
- [ ] Share business via native share sheet (deep link)
- [ ] Report inaccurate information

---

### 2.6 Service Categories

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User Story** | As a consumer, I want to browse services by category to find what I need. |

**Acceptance Criteria:**
- [ ] Hierarchical category system: Category → Subcategory → Services
- [ ] Primary categories: Hair, Nails, Face, Body, Massage, Spa, Medical Aesthetic, Barber, Tattoo/Piercing
- [ ] Category icons with consistent visual language
- [ ] Category browsing with business count per category
- [ ] Multiple category selection (OR logic)
- [ ] Service-level details: name, description, duration, price range, deposit requirement
- [ ] "Popular in [Category]" section on homepage
- [ ] Category-specific filters (e.g., hair length, nail type)

---

### 2.7 Booking Flow

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User Story** | As a consumer, I want to book appointments with minimal friction and clear confirmation. |

**Acceptance Criteria:**
- [ ] Step 1: Select service(s) — single or multiple (cart-style, max 5 per booking)
- [ ] Step 2: Select staff member (or "No preference") with profile photos
- [ ] Step 3: Date picker with availability visualization (green/yellow/red density)
- [ ] Step 4: Time slot selection (15-min increments, grouped by morning/afternoon/evening)
- [ ] Step 5: Review booking summary with editable details
- [ ] Step 6: Apply promo code (validated in real-time)
- [ ] Step 7: Payment (if deposit/full prepayment required) or confirm (pay-at-venue)
- [ ] Booking confirmation with calendar invite (.ics), QR code, and add-to-wallet option
- [ ] Booking modification allowed until cutoff (default: 2 hours before, configurable by business)
- [ ] Cancellation with reason selection; refund policy clearly displayed
- [ ] Waitlist option when fully booked
- [ ] Guest checkout with email/phone (account created implicitly)
- [ ] Booking flow < 60 seconds for returning users with saved preferences

---

### 2.8 Appointment Management

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User Story** | As a consumer, I want to view and manage my appointments in one place. |

**Acceptance Criteria:**
- [ ] Upcoming/past/cancelled tabs
- [ ] Appointment card: service, business, staff, datetime, status, QR code
- [ ] Reschedule action (re-enters booking flow with pre-filled selections)
- [ ] Cancel with automated refund processing per business policy
- [ ] Rebook same service with one tap
- [ ] Add to personal calendar (Google, Apple, Outlook)
- [ ] Get directions to business
- [ ] Contact business directly from appointment
- [ ] Arrival check-in (geofenced or manual)
- [ ] Post-appointment: prompt to review, rebook, or save to favorites

---

### 2.9 Favorites

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **User Story** | As a consumer, I want to save favorite businesses for quick rebooking. |

**Acceptance Criteria:**
- [ ] Toggle favorite from business card, detail view, or search results
- [ ] Favorites list with sort (recently added, alphabetical, distance)
- [ ] Quick actions: Book, Call, Directions from favorites list
- [ ] Push notification for new availability or promotions from favorites
- [ ] Sync across devices for authenticated users
- [ ] Suggest similar businesses based on favorite patterns
- [ ] Maximum 200 favorites (performance guardrail)

---

### 2.10 User Profile

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **User Story** | As a consumer, I want to manage my personal information and preferences. |

**Acceptance Criteria:**
- [ ] Profile photo upload (crop to square, max 5MB, auto-compress)
- [ ] Name, email, phone (with verification status)
- [ ] Birthday (optional, for birthday promotions)
- [ ] Default notification preferences (push, email, SMS granular controls)
- [ ] Saved payment methods (PCI-compliant tokenization)
- [ ] Booking preferences: default reminder time (15/30/60 min), preferred staff auto-select
- [ ] Privacy settings: profile visibility, data download, account deletion (GDPR/CCPA)
- [ ] Referral code and rewards tracking

---

### 2.11 Availability & Slot Computation

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User Story** | As a system, I need accurate real-time availability to prevent double-bookings. |

**Acceptance Criteria:**
- [ ] Staff-level availability with recurring schedules and exception dates
- [ ] Service duration + buffer time (pre/post) computed for slot generation
- [ ] Concurrent booking prevention via optimistic locking (row-level with retry)
- [ ] Slot caching with 5-second TTL; cache invalidation on booking mutation
- [ ] Timezone-aware for all datetime operations (business timezone stored, user timezone dynamic)
- [ ] Complex rules: staff breaks, lunch, time-off, overlapping services
- [ ] Slot generation algorithm: O(n) performance for 30-day window
- [ ] Real-time slot updates via WebSocket for active booking sessions
- [ ] Overbooking configuration (emergency/admin override with audit log)

---

### 2.12 Shared Types & Design System

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **User Story** | As a developer, I need consistent design patterns and type safety across the platform. |

**Acceptance Criteria:**
- [ ] Comprehensive TypeScript type definitions for all entities (User, Business, Service, Booking, etc.)
- [ ] Design tokens: colors, typography, spacing, shadows, border-radius
- [ ] Component library: buttons, inputs, cards, modals, date pickers, skeleton loaders
- [ ] Accessibility: WCAG 2.1 AA minimum, screen reader support, focus management, color contrast ≥ 4.5:1
- [ ] Dark mode support with system preference detection
- [ ] RTL language support architecture
- [ ] Animation standards: 200ms transitions, 60fps targets
- [ ] Error state patterns and retry mechanisms
- [ ] Loading state patterns (skeleton > spinner)

---

### 2.13 Reviews & Ratings

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **User Story** | As a consumer, I want to read and write reviews to make informed decisions and share experiences.

**Acceptance Criteria:**
- [ ] 5-star rating with half-star precision
- [ ] Review components: rating, text (10-1000 chars), photos (max 5), service received, date
- [ ] Verified purchase badge (only post-appointment reviews)
- [ ] Business owner response capability
- [ ] Review helpfulness voting
- [ ] Report review for moderation
- [ ] Sort: most recent, most helpful, highest/lowest rated
- [ ] Filter by rating, verified status, service type
- [ ] Average rating recalculation with outlier detection (Winsorization)
- [ ] Review solicitation: push notification 2 hours post-appointment, email fallback at 24 hours
- [ ] Moderation queue for flagged content (< 2 hour SLA)

---

### 2.14 Payment Integration

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User Story** | As a consumer, I want secure, flexible payment options. As a business, I want reliable payout processing. |

**Acceptance Criteria:**
- [ ] Stripe integration for card payments (Visa, Mastercard, Amex, Discover)
- [ ] Apple Pay / Google Pay support
- [ ] PayPal option
- [ ] SCA-compliant 3D Secure for European cards
- [ ] Payment intents: authorize vs. capture for deposits
- [ ] Split payments: platform fee, business payout, tax (automated)
- [ ] Refund processing: full, partial, or credit (business-configurable policy)
- [ ] Failed payment retry with saved method or new method
- [ ] Invoice/receipt generation and email delivery
- [ ] Payout schedule: daily, weekly, monthly (business choice)
- [ ] Financial dashboard for business owners (transaction history, pending payouts)

---

### 2.15 Notifications

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **User Story** | As a user, I want timely, relevant notifications about my bookings and discoveries. |

**Acceptance Criteria:**
- [ ] Push notifications: booking confirmed, reminder (configurable), modified, cancelled, upcoming (day before, 2 hours before)
- [ ] SMS fallback for critical notifications (booking changes within 24 hours)
- [ ] Email: confirmation, reminder, receipt, marketing (opt-in)
- [ ] In-app notification center with read/unread status
- [ ] Quiet hours respect (default 22:00-08:00, user-configurable)
- [ ] Deep links to relevant app screens
- [ ] Notification preferences granular per channel
- [ ] A/B testing infrastructure for notification copy/timing
- [ ] Delivery tracking and retry for failed pushes

---

### 2.16 Provider / Business Owner Portal

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User Story** | As a business owner, I want to manage my business, staff, services, and bookings efficiently. |

**Acceptance Criteria:**
- [ ] Dashboard: today's bookings, revenue, occupancy rate, new reviews
- [ ] Business profile management: all consumer-facing fields editable
- [ ] Staff management: add/remove staff, set schedules, assign services, set commission rates
- [ ] Service management: CRUD services, pricing, duration, buffer time, online booking availability
- [ ] Booking calendar: day.Dot, week, month views; drag-to-reschedule
- [ ] Booking actions: confirm, reschedule, cancel, mark no-show, add walk-in
- [ ] Client management: view history, notes, contact info, booking patterns
- [ ] Availability exceptions: holidays, staff time-off, special hours
- [ ] Promotion creation: discount codes, flash sales, package deals
- [ ] Revenue reporting: daily, weekly, monthly, custom range; export to CSV/PDF
- [ ] Multi-location support for chains
- [ ] Role-based access: Owner, Manager, Staff (view-only vs. edit permissions)
- [ ] Mobile-responsive web app (dedicated native app v2)

---

### 2.17 Admin Dashboard

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **User Story** | As a platform admin, I need oversight and control tools to ensure platform health and quality. |

**Acceptance Criteria:**
- [ ] User management: search, view, suspend, impersonate (with audit log)
- [ ] Business onboarding workflow: application review, verification, approval/rejection with reason
- [ ] Business management: edit, feature, hide, suspend, delete
- [ ] Content moderation: review flagged reviews, businesses, images
- [ ] Financial oversight: transaction monitoring, dispute resolution, refund approval
- [ ] Analytics: MAU, booking volume, GMV, churn, top categories, geographic distribution
- [ ] System health: API latency, error rates, queue depths
- [ ] Configuration: platform fees, feature flags, notification templates
- [ ] Audit logging: all admin actions with before/after state, non-deletable
- [ ] Data export for compliance requests

---

### 2.18 Background Jobs (BullMQ)

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **User Story** | As a system, I need reliable asynchronous processing for scalable operations. |

**Acceptance Criteria:**
- [ ] Job queues defined with clear priorities: critical, high, normal, low
- [ ] Retry policy: immediate, exponential backoff (2^n * 1s, max 5 retries), dead letter queue
- [ ] Job types and processors:
  - **Email delivery** (SendGrid/Mailgun integration)
  - **SMS delivery** (Twilio integration)
  - **Push notification dispatch** (Firebase/OneSignal)
  - **Payment processing webhooks** (idempotent handling)
  - **Calendar sync** (.ics generation, Google/Outlook API)
  - **Search index updates** (Elasticsearch/Algolia)
  - **Image processing** (resize, compress, generate thumbnails)
  - **Report generation** (async, notify on completion)
  - **Data exports** (GDPR requests, large datasets)
  - **Slot cache warming** (pre-compute popular business/date combinations)
  - **Review solicitation** (scheduled post-appointment)
- [ ] Job monitoring dashboard: pending, active, completed, failed counts; retry failed jobs
- [ ] Stalled job detection and recovery
- [ ] Rate limiting per external API (Twilio, SendGrid quotas)
- [ ] Job progress tracking for long-running operations

---

## 3. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | App launch < 2s; screen transitions < 300ms; API response < 200ms (p95) |
| **Reliability** | 99.9% uptime; booking transaction success rate > 99.95% |
| **Security** | OWASP Top 10 mitigation; encryption at rest and in transit; annual penetration testing |
| **Scalability** | Support 10,000 concurrent booking sessions; horizontal scaling architecture |
| **Compliance** | GDPR, CCPA, PCI-DSS Level 1; data residency options |

---

## 4. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion rate | > 15% |
| Search-to-booking | > 8% |
| App retention (D7) | > 40% |
| NPS | > 50 |
| Business satisfaction | > 4.2/5 |
| Support ticket volume | < 2% of monthly active users |

---

## 5. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Guest Browse, Search, Map, Business Detail, Categories, Booking Flow, Appointment Mgmt, Payments, Provider Portal (basic) | 8 weeks |
| **v1.1** | Favorites, Profile, Reviews, Notifications, Admin Dashboard | 4 weeks |
| **v1.2** | Availability optimization, Background Jobs, Analytics, Design System hardening | 4 weeks |
| **v2.0** | AI recommendations, Loyalty program, Consumer native app, Provider native app | 12 weeks |