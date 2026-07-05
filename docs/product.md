# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first appointment booking platform connecting customers with local service businesses (salons, barbershops, spas, clinics). The platform serves three user types: **Customers** (book appointments), **Providers/Business Owners** (manage business, staff, and appointments), and **Admins** (platform oversight).

---

## 2. Feature Specifications

### 2.1 User Authentication

**Priority:** P0 (Critical)

**Description:** Secure identity verification for all user types with role-based access.

**Acceptance Criteria:**
- [ ] Customers can register with email, phone, or social login (Google, Apple)
- [ ] Providers register via dedicated flow with business verification
- [ ] Password reset via email/SMS with 15-minute expiration
- [ ] JWT access tokens (15 min) + refresh tokens (7 days)
- [ ] Biometric login support on mobile (Face ID / Fingerprint)
- [ ] Account lockout after 5 failed attempts
- [ ] Terms acceptance required at registration
- [ ] GDPR-compliant data handling consent

**Technical Notes:** Implement OAuth 2.0 + OpenID Connect. Store refresh tokens hashed. Rate limit: 5 attempts/minute.

---

### 2.2 Guest Browse & Explore

**Priority:** P0

**Description:** Pre-authentication discovery to convert visitors to registered users.

**Acceptance Criteria:**
- [ ] Unauthenticated users can browse businesses and services without account
- [ ] Guest users see full search, filters, and business profiles
- [ ] "Book Now" or "Add to Favorites" triggers authentication prompt
- [ ] Guest session data (search location, filters) persists post-login
- [ ] App store deep linking preserves guest context
- [ ] Guest browsing limited to 3 business detail views before soft login prompt

**Technical Notes:** Anonymous session ID with local storage fallback. Merge guest data on account creation.

---

### 2.3 Business Search & Discovery

**Priority:** P0

**Description:** Intelligent search with multi-factor filtering and ranking.

**Acceptance Criteria:**
- [ ] Text search across business name, service name, and description
- [ ] Autocomplete with typo tolerance (fuzzy matching, 2 edit distance)
- [ ] Filters: category, price range, rating (≥ threshold), availability ("open now"), distance, amenities
- [ ] Sort options: relevance, distance, rating, price (low-high), availability
- [ ] Recent searches stored (last 10), clearable by user
- [ ] Trending searches and suggested businesses in empty state
- [ ] Search results load in < 500ms for first 20 results
- [ ] Pagination: cursor-based, 20 results per page

**Technical Notes:** Elasticsearch or Algolia for search index. Geospatial queries with PostGIS. Cache popular queries 5 minutes.

---

### 2.4 Map-based Search

**Priority:** P0

**Description:** Visual geographic exploration with interactive clustering.

**Acceptance Criteria:**
- [ ] Full-screen map with business pins; tap to preview card
- [ ] Clustering at zoom levels > 50 pins visible
- [ ] User location dot with permission handling (allow/decline/ask each time)
- [ ] Search this area — manual map pan triggers re-query
- [ ] Business open/closed status shown on pin color (green/orange/red)
- [ ] Directions integration (Google Maps, Apple Maps, Waze)
- [ ] Default zoom: fit all results; single result: street level
- [ ] Map and list view toggle with state preservation

**Technical Notes:** Mapbox or Google Maps SDK. Debounce map move events 300ms. Cache tile data.

---

### 2.5 Business Detail View

**Priority:** P0

**Description:** Comprehensive business profile driving conversion.

**Acceptance Criteria:**
- [ ] Hero: business name, rating, review count, favorite toggle, share
- [ ] Photo gallery: up to 30 images, swipeable, pinch-to-zoom
- [ ] Services tab: categorized list with prices, durations, description
- [ ] Team tab: staff profiles with specialties, photos, ratings
- [ ] Reviews tab: aggregate rating, distribution histogram, recent reviews
- [ ] About tab: hours, location, amenities, payment methods, COVID policies
- [ ] CTA: "Book" button sticky at bottom
- [ ] Share: deep link, native share sheet, copy link
- [ ] Report business functionality

**Technical Notes:** Lazy load images. Preload next tab content. Track page view → booking conversion funnel.

---

### 2.6 Service Categories

**Priority:** P0

**Description:** Hierarchical classification for browse and SEO.

**Acceptance Criteria:**
- [ ] Top-level: Hair, Beauty, Wellness, Health, Fitness, Other (configurable)
- [ ] 2-level depth minimum (e.g., Hair > Coloring > Balayage)
- [ ] Category icons and hero images for each
- [ ] Category landing pages with featured businesses
- [ ] Services tagged to multiple categories where applicable
- [ ] Category admin: CRUD with slug, description, icon, parent, sort order
- [ ] Category analytics: search volume, conversion rate per category

**Technical Notes:** Adjacency list or nested set model. Cache category tree in Redis.

---

### 2.7 Booking Flow

**Priority:** P0

**Description:** Friction-reduced appointment reservation with real-time availability.

**Acceptance Criteria:**
- [ ] Step 1: Select service(s) — multi-select with total duration calculation
- [ ] Step 2: Select staff (specific, any, or no preference)
- [ ] Step 3: Select date → time slots displayed (15-min intervals, business-configurable)
- [ ] Step 4: Confirm details, apply promo code, select payment method
- [ ] Step 5: Booking confirmation with calendar invite (.ics), add to wallet
- [ ] Slot selection enforces buffer times between appointments
- [ ] Concurrent booking protection (optimistic locking, 5-min hold)
- [ ] Guest checkout option (collect minimal info: name, phone, email)
- [ ] Booking modification allowed up to business cancellation policy window
- [ ] Cancellation with reason capture; automatic refund per policy

**Technical Notes:** Slot computation service (see 2.11). WebSocket for real-time slot availability. Idempotency key for booking creation.

---

### 2.8 Appointment Management

**Priority:** P0

**Description:** Lifecycle management for customer appointments.

**Acceptance Criteria:**
- [ ] Upcoming/past/cancelled tabs in customer app
- [ ] Appointment detail: QR code for check-in, directions, contact business, reschedule, cancel
- [ ] Reschedule: re-enter booking flow pre-filled, new slot selection
- [ ] Cancel: reason selection, refund status, rebooking prompt
- [ ] No-show marking by provider (triggers customer notification + policy)
- [ ] Appointment notes (customer-visible and internal)
- [ ] Bulk actions for recurring appointments

**Technical Notes:** State machine: PENDING → CONFIRMED → CHECKED_IN → COMPLETED → NO_SHOW/CANCELLED. Audit log all transitions.

---

### 2.9 Favorites

**Priority:** P1

**Description:** Bookmarked businesses for quick re-access.

**Acceptance Criteria:**
- [ ] Toggle favorite from business card, detail, or post-appointment
- [ ] Favorites list with search and sort (recently added, alphabetical, nearest)
- [ ] Favorite count badge on profile tab
- [ ] Push notification for new availability at favorite business (opt-in)
- [ ] Sync across devices for logged-in users
- [ ] Suggest similar businesses based on favorites

**Technical Notes:** Many-to-many user-business. Soft delete to preserve for reactivation analytics.

---

### 2.10 User Profile

**Priority:** P1

**Description:** Customer identity and preference management.

**Acceptance Criteria:**
- [ ] Editable: name, phone, email, profile photo, birthday (for birthday offers)
- [ ] Preference center: notification types, marketing consent, language, currency
- [ ] Payment methods: add, edit, delete, set default (PCI-compliant tokenization)
- [ ] Appointment history with reorder/rebook
- [ ] Loyalty points balance and history (if program active)
- [ ] Data export (GDPR) and account deletion (30-day grace, 90-day purge)
- [ ] Referral code generation and tracking

**Technical Notes:** Profile completeness percentage to drive engagement. Segment integration for preference sync.

---

### 2.11 Availability & Slot Computation

**Priority:** P0 (Infrastructure)

**Description:** Core engine for accurate, performant availability calculation.

**Acceptance Criteria:**
- [ ] Business defines: operating hours per day, slot duration, buffer time, max advance booking, min advance notice
- [ ] Staff-specific schedules and blocked time (breaks, PTO)
- [ ] Service-staff qualification matrix (who can perform what)
- [ ] Recurring availability with exception overrides
- [ ] Slot computation accounts for existing appointments, blocks, and buffers
- [ ] Performance: < 200ms for 30-day range, single staff; < 500ms multi-staff
- [ ] Cache invalidation on booking mutation
- [ ] Support for multi-service sequential booking (back-to-back slots)

**Technical Notes:** Pre-computed availability cache in Redis, rebuilt on mutation. Consider calendar as time intervals, use interval tree for overlap detection.

---

### 2.12 Shared Types & Design System

**Priority:** P1 (Infrastructure)

**Description:** Consistent UI/UX across platforms with reusable components.

**Acceptance Criteria:**
- [ ] Design tokens: colors, typography, spacing, shadows, border-radius
- [ ] Component library: buttons, inputs, cards, modals, toasts, skeletons, empty states
- [ ] Accessibility: WCAG 2.1 AA minimum, screen reader support, focus management
- [ ] Dark mode support with system preference detection
- [ ] Localization: i18n framework, RTL support, date/time/currency formatting
- [ ] Animation standards: 200-300ms transitions, reduced motion respect
- [ ] Shared TypeScript types between frontend, backend, and mobile

**Technical Notes:** Storybook for web, separate native component set. Automated visual regression testing.

---

### 2.13 Reviews & Ratings

**Priority:** P1

**Description:** Social proof and quality feedback loop.

**Acceptance Criteria:**
- [ ] Post-appointment review prompt (24-hour delay, 3 reminders max)
- [ ] Rating: 1-5 stars, mandatory; review text: optional, max 500 chars
- [ ] Categories: service quality, staff, ambiance, value
- [ ] Photo upload (max 5, moderation queue)
- [ ] Business reply functionality
- [ ] Review helpfulness voting
- [ ] Flag inappropriate reviews (auto-hide after 3 flags, admin review)
- [ ] Verified purchase badge for completed appointments
- [ ] Review analytics: sentiment, trends, response rate

**Technical Notes:** Anti-fraud: one review per appointment, device fingerprinting, text similarity detection. Elasticsearch for review search.

---

### 2.14 Payment Integration

**Priority:** P0

**Description:** Secure, flexible payment processing with multi-provider support.

**Acceptance Criteria:**
- [ ] Stripe and Adyen as primary providers (configurable per market)
- [ ] Payment methods: cards, Apple Pay, Google Pay, PayPal, Klarna (BNPL)
- [ ] Full payment at booking vs. deposit vs. pay-at-business (business-configurable)
- [ ] Automatic capture X hours before appointment; void on cancellation per policy
- [ ] Refund: full, partial, or store credit; automated or manual approval
- [ ] Invoice generation for B2B
- [ ] PCI DSS compliance — no raw card data touch server
- [ ] Webhook handling for payment status updates with idempotency
- [ ] Failed payment retry with customer notification

**Technical Notes:** Vault tokens with provider. Idempotent payment creation (key: booking_id + attempt). Reconciliation report daily.

---

### 2.15 Notifications

**Priority:** P1

**Description:** Multi-channel, preference-aware communication.

**Acceptance Criteria:**
- [ ] Channels: push (iOS/Android), SMS, email, in-app
- [ ] Types: booking confirmation, reminder (24h, 2h before), modification, cancellation, promotional, re-engagement
- [ ] User preference controls per channel and type
- [ ] Rich push with deep links and actions (confirm, cancel, reschedule)
- [ ] Batch digest option for non-urgent notifications
- [ ] Delivery tracking and failure handling with fallback channels
- [ ] Quiet hours respect (default 22:00-08:00, user-configurable)
- [ ] A/B testing framework for notification copy and timing

**Technical Notes:** OneSignal or Braze for orchestration. BullMQ for queue processing (see 2.18). Template management system.

---

### 2.16 Provider / Business Owner Portal

**Priority:** P0

**Description:** Web-based management for business operations.

**Acceptance Criteria:**
- [ ] Dashboard: today's appointments, revenue, occupancy rate, new reviews
- [ ] Calendar view: day/week/month, drag-to-reschedule, quick block time
- [ ] Appointment actions: confirm, check-in, complete, no-show, cancel with reason
- [ ] Customer management: profiles, notes, visit history, marketing tags
- [ ] Staff management: profiles, schedules, services qualified, performance
- [ ] Service management: CRUD, pricing variants, duration, online booking enable/disable
- [ ] Business settings: hours, policies, payment methods, integrations
- [ ] Analytics: revenue, bookings by channel, staff utilization, no-show rate, customer retention
- [ ] Multi-location support with role-based access (owner, manager, staff)

**Technical Notes:** React SPA with real-time updates via WebSocket. Role-based access control (RBAC) with resource-level permissions.

---

### 2.17 Admin Dashboard

**Priority:** P1

**Description:** Platform oversight and operational support.

**Acceptance Criteria:**
- [ ] Business onboarding workflow: application, verification, approval, go-live
- [ ] User management: search, impersonate, suspend, delete
- [ ] Content moderation: review flagged businesses, reviews, images
- [ ] Financial: transaction monitoring, payout scheduling, dispute resolution
- [ ] Analytics: MAU, booking volume, GMV, churn, CAC, LTV by cohort
- [ ] System health: queue depths, error rates, API latency, third-party status
- [ ] Configuration: categories, promo campaigns, feature flags, rate limits
- [ ] Audit log: all admin actions with before/after state

**Technical Notes:** Separate admin service with stricter auth (MFA required). Read replicas for analytics queries.

---

### 2.18 Background Jobs (BullMQ)

**Priority:** P1 (Infrastructure)

**Description:** Reliable asynchronous job processing.

**Acceptance Criteria:**
- [ ] Job types: email send, SMS send, push notification, payment capture, report generation, data export, search index update, slot cache warm, review prompt, no-show detection
- [ ] Retry policy: exponential backoff, max 3 attempts, dead letter queue
- [ ] Job priority levels: critical, high, normal, low
- [ ] Job scheduling: delayed jobs, recurring jobs (cron), repeatable with timezone
- [ ] Monitoring: queue depth, processing rate, failure rate, job duration percentiles
- [ ] Graceful shutdown: finish in-progress, requeue incomplete
- [ ] Job idempotency keys for safety

**Technical Notes:** BullMQ with Redis. Separate queues per job type. Dashboard with bull-board or similar. Horizontal scaling via worker processes.

---

## 3. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | App cold start < 2s; API p99 < 500ms; search < 500ms |
| Availability | 99.9% uptime; scheduled maintenance windows communicated |
| Security | OWASP Top 10 mitigation; penetration testing annually; SOC 2 Type II |
| Scalability | Handle 10x traffic spike; auto-scaling enabled |
| Compliance | GDPR, CCPA, PCI DSS; data residency per market |

---

## 4. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion rate | > 15% of detail views |
| Search-to-booking | < 3 min median time |
| Provider NPS | > 50 |
| Customer NPS | > 40 |
| No-show rate | < 10% |
| App store rating | > 4.5 |

---

## 5. Roadmap Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | 2.1, 2.3-2.7, 2.11, 2.14, 2.16 | Month 1-3 |
| v1.1 | 2.2, 2.8-2.10, 2.12, 2.13, 2.15 | Month 4-5 |
| v1.2 | 2.17, 2.18, 2.4 enhancements | Month 6-7 |
| Scale | Performance, internationalization, integrations | Month 8+ |

---

*Document version: 1.0*
*Last updated: 2024*
*Owner: Product — Alex*