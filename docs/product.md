# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first platform connecting customers with local beauty, wellness, and service businesses for appointment booking. The product serves three user segments: **Customers** (book appointments), **Providers** (manage businesses and services), and **Admin** (platform oversight).

---

## 2. Feature Specifications

### 2.1 User Authentication

**Priority:** P0 — Critical Path

**Description:** Secure, frictionless authentication supporting multiple entry points.

**User Stories:**
- As a customer, I want to create an account quickly so I can book appointments.
- As a returning user, I want to log in without friction.
- As a security-conscious user, I want password recovery options.

**Acceptance Criteria:**
- [ ] Email/password registration with validation (email format, password 8+ chars with uppercase, number, special char)
- [ ] Login with email/password returns JWT access token + refresh token
- [ ] OAuth 2.0 integration: Google, Apple Sign-In
- [ ] Password reset flow: email link expires in 1 hour
- [ ] Biometric authentication (Face ID/Touch ID) on supported devices after initial login
- [ ] Guest checkout option preserved — account creation prompted post-booking
- [ ] Session management: 30-day refresh token, explicit logout clears all tokens
- [ ] Rate limiting: 5 failed attempts triggers 15-minute lockout

**Technical Notes:**
- Use Supabase Auth or Firebase Auth
- Store tokens in secure keychain/keystore
- Implement token refresh interceptor on 401 responses

---

### 2.2 Guest Browse & Explore

**Priority:** P0 — Conversion Funnel Entry

**Description:** Unauthenticated users can browse businesses, view services, and explore availability before committing to account creation.

**User Stories:**
- As a new visitor, I want to see nearby businesses without creating an account.
- As a researcher, I want to compare prices and reviews before deciding.

**Acceptance Criteria:**
- [ ] Full search and discovery access without authentication
- [ ] Business detail views accessible including reviews, services, pricing
- [ ] Real-time availability preview (no booking without account)
- [ ] "Book Now" CTA triggers auth modal with pre-filled context
- [ ] Guest session persisted locally for 7 days; merging on account creation

---

### 2.3 Business Search & Discovery

**Priority:** P0 — Core Discovery

**Description:** Intelligent search with filtering, sorting, and personalized results.

**User Stories:**
- As a customer, I want to find businesses by name, service, or location.
- As a customer, I want to filter by criteria that matter to me.

**Acceptance Criteria:**
- [ ] Full-text search across: business name, service names, address, category tags
- [ ] Filters: distance (1-50km), price range, rating (4.0+), category, availability today, gender of staff
- [ ] Sort options: relevance, distance, rating, price (low to high), most reviewed
- [ ] Auto-complete suggestions after 2 characters with debounce 300ms
- [ ] Recent searches persisted locally, clearable
- [ ] Empty state with popular categories and "near me" prompt
- [ ] Pagination: 20 results per page, infinite scroll on mobile

---

### 2.4 Map-based Search

**Priority:** P0 — Geographic Discovery

**Description:** Visual map interface showing business locations with interactive clustering.

**User Stories:**
- As a customer, I want to see where businesses are located relative to me.
- As a customer, I want to explore a different neighborhood by panning the map.

**Acceptance Criteria:**
- [ ] Default viewport centers on user location with 5km radius
- [ ] Business pins color-coded by category; tap reveals card with name, rating, price indicator
- [ ] Clustering at zoom levels: <13 = cluster, 13-15 = de-cluster, >15 = individual pins
- [ ] "List view" toggle persists search context between map and list
- [ ] Map bounds trigger new search query; loading state on tile fetch
- [ ] Custom pin for user's current location with accuracy radius
- [ ] Directions integration: open native maps app (Google/Apple Maps)

---

### 2.5 Business Detail View

**Priority:** P0 — Conversion Decision Point

**Description:** Comprehensive business profile driving booking conversion.

**User Stories:**
- As a customer, I want all relevant business information in one place.
- As a customer, I want to see photos of the space and staff.

**Acceptance Criteria:**
- [ ] Header: business name, verified badge, favorite toggle, share button
- [ ] Image gallery: up to 10 photos, swipeable, pinch-to-zoom, hero image priority
- [ ] Key info: address (with copy, directions), phone (click-to-call), hours (today's + full weekly), website link
- [ ] Services tab: expandable list with name, duration, description, price; "Book" CTA per service
- [ ] Reviews tab: aggregate rating, rating distribution bar chart, sortable (newest, highest, lowest), photo reviews
- [ ] Team tab: staff profiles with photo, bio, specialties, average rating
- [ ] About: business description, amenities/payment methods, COVID/safety policies
- [ ] Sticky bottom bar: "Book Appointment" primary CTA

---

### 2.6 Service Categories

**Priority:** P0 — Browse Structure

**Description:** Hierarchical category system for business and service organization.

**User Stories:**
- As a customer, I want to browse by service type when I'm unsure which business to choose.
- As a provider, I want my services categorized correctly for discovery.

**Acceptance Criteria:**
- [ ] Category hierarchy: Level 1 (e.g., "Beauty") → Level 2 ("Hair") → Level 3 ("Haircut")
- [ ] Home screen category grid: 8-10 featured categories with iconography
- [ ] Category detail: description, popular services, trending businesses
- [ ] Multi-select: businesses can belong to multiple categories
- [ ] Category badges visible on business cards and detail views
- [ ] Admin-managed category taxonomy with ability to add/edit/archive

---

### 2.7 Booking Flow

**Priority:** P0 — Revenue Critical

**Description:** Streamlined multi-step booking minimizing abandonment.

**User Stories:**
- As a customer, I want to book an appointment in under 60 seconds.
- As a customer, I want to see all available slots clearly.

**Acceptance Criteria:**
- [ ] Step 1 — Service Selection: pre-selected if from business detail, else category → service picker
- [ ] Step 2 — Provider Selection: "Any available" or specific staff member with availability preview
- [ ] Step 3 — Date/Time: calendar view (7-day forward default, scrollable 90 days), slots shown as time buttons
- [ ] Step 4 — Confirmation: review all details, apply promo code, add notes, payment method selection
- [ ] Slot display: morning, afternoon, evening groupings; green = available, grey = unavailable, blue = selected
- [ ] Quick rebooking: one-tap "Rebook" from past appointments
- [ ] Guest checkout flow: collect name, phone, email; create account post-booking
- [ ] Booking confirmation screen with add-to-calendar, share, get directions
- [ ] Booking ID generated, confirmation email/SMS sent

**Edge Cases:**
- Slot taken during booking flow → error with next 3 available alternatives
- Payment failure → hold slot 10 minutes, retry or pay at venue

---

### 2.8 Appointment Management

**Priority:** P0 — Post-Booking Experience

**Description:** Full lifecycle management of customer appointments.

**User Stories:**
- As a customer, I want to see all my upcoming and past appointments.
- As a customer, I want to modify or cancel if plans change.

**Acceptance Criteria:**
- [ ] Appointments list: upcoming (chronological) and past (reverse chronological), pull-to-refresh
- [ ] Appointment card: business name, service, staff name, date/time, status badge, actions
- [ ] Statuses: confirmed, pending approval, checked-in, in-progress, completed, cancelled, no-show
- [ ] Reschedule: within 24 hours of original → select new slot, confirmation required
- [ ] Cancel: policy displayed (e.g., "Free cancellation until 2 hours before"), reason collection (optional)
- [ ] Late cancellation fee enforcement if policy violated (integrate with payment)
- [ ] Rebook action on past appointments
- [ ] Push notification 24h and 1h before appointment

---

### 2.9 Favorites

**Priority:** P1 — Engagement & Retention

**Description:** Save businesses and services for quick re-access.

**User Stories:**
- As a customer, I want to save businesses I like for future booking.
- As a customer, I want to get notified about deals from my favorites.

**Acceptance Criteria:**
- [ ] Heart toggle on business cards and detail view; haptic feedback on add
- [ ] Favorites screen: grid/list of saved businesses, last visited sort, search within favorites
- [ ] Empty state with "Discover businesses near you" CTA
- [ ] Sync across devices for authenticated users
- [ ] Optional: "Notify me of deals" toggle per favorite

---

### 2.10 User Profile

**Priority:** P1 — Account Management

**Description:** Central hub for user preferences and account settings.

**User Stories:**
- As a user, I want to manage my personal information and preferences.
- As a user, I want to control my notification settings.

**Acceptance Criteria:**
- [ ] Profile photo, name, phone, email (editable with verification for email/phone changes)
- [ ] Saved payment methods: add, delete, set default (Stripe/Payrix integration)
- [ ] Notification preferences: push, email, SMS — granular by type (bookings, promotions, reminders)
- [ ] Privacy settings: data download, account deletion with 30-day grace period
- [ ] Loyalty/points balance if applicable
- [ ] Referral code and sharing

---

### 2.11 Availability & Slot Computation

**Priority:** P0 — Technical Foundation

**Description:** Real-time, accurate availability computation handling complex business rules.

**User Stories:**
- As a provider, I want my availability to reflect my actual working patterns.
- As a customer, I want to see only genuinely bookable slots.

**Acceptance Criteria:**
- [ ] Business hours: recurring weekly schedule + exception dates (holidays, closures)
- [ ] Staff-level availability: working hours, break times, time off
- [ ] Service duration + buffer time between appointments (configurable)
- [ ] Concurrent booking limits per staff/service room
- [ ] Real-time slot computation: query returns available slots in <500ms
- [ ] Cache invalidation on booking/cancellation/schedule change
- [ ] Timezone handling: store in UTC, display in business local time
- [ ] Buffer zones: prevent last-minute bookings (e.g., no booking within 2 hours of start)

**Technical:**
- Pre-computed slot cache with Redis
- BullMQ for background slot recalculation on changes
- Conflict resolution: optimistic locking on slot selection

---

### 2.12 Shared Types & Design System

**Priority:** P1 — Engineering Efficiency

**Description:** Consistent UI/UX across platforms with reusable components.

**Acceptance Criteria:**
- [ ] Design tokens: colors (primary #FF6B6B, secondary, semantic states), typography scale, spacing scale, border radius, shadows
- [ ] Component library: buttons, inputs, cards, modals, date picker, time slot grid, loading skeletons
- [ ] Shared TypeScript types across frontend, backend, API contracts
- [ ] Accessibility: WCAG 2.1 AA minimum, screen reader support, minimum touch target 44x44dp
- [ ] Dark mode support
- [ ] Localization framework: i18n ready, initial languages EN, FR, DE
- [ ] Animation standards: 200-300ms transitions, consistent easing curves

---

### 2.13 Reviews & Ratings

**Priority:** P1 — Trust & Discovery

**Description:** Social proof system for business quality assessment.

**User Stories:**
- As a customer, I want to read honest reviews before booking.
- As a customer, I want to share my experience after a visit.

**Acceptance Criteria:**
- [ ] Eligibility: only verified customers who completed appointment can review (within 30 days)
- [ ] Rating: 1-5 stars, mandatory; review text optional, min 10 chars if provided
- [ ] Categories: service quality, staff, ambiance, value — optional sub-ratings
- [ ] Photo upload: up to 5 images, moderation queue
- [ ] Business response capability with notification to reviewer
- [ ] Report review functionality with admin moderation dashboard
- [ ] Review helpfulness voting
- [ ] Aggregate recalculation: weighted recent reviews more heavily (Bayesian average)

---

### 2.14 Payment Integration

**Priority:** P0 — Revenue Collection

**Description:** Secure, flexible payment handling for bookings.

**User Stories:**
- As a customer, I want to pay securely for my appointments.
- As a customer, I want flexibility in when and how I pay.

**Acceptance Criteria:**
- [ ] Full payment at booking (default) or deposit option (configurable by business)
- [ ] Pay at venue option (business-configurable, may require card hold)
- [ ] Payment methods: credit/debit (Stripe), Apple Pay, Google Pay, PayPal
- [ ] Refund processing: automatic for business-canceled, manual request flow for customer-initiated
- [ ] Invoice/receipt generation, email delivery, downloadable PDF
- [ ] Failed payment handling: retry ×3 with exponential backoff, notify user, auto-cancel if unresolved
- [ ] PCI DSS compliance: no card data stored, tokenization only

---

### 2.15 Notifications

**Priority:** P1 — Engagement & Operations

**Description:** Multi-channel notification system for timely, relevant communication.

**Acceptance Criteria:**
- [ ] Channels: push (primary), SMS (fallback, urgent), email (summary, receipts)
- [ ] Triggered notifications:
  - Booking confirmation (immediate)
  - Reminder: 24h, 1h before appointment
  - Change/cancellation by business or customer
  - Review request: 2h after appointment completion
  - Promotional: favorites deals, re-engagement (opt-in)
- [ ] Batch digest option: daily summary instead of individual pushes
- [ ] Deep linking: notification taps navigate to relevant screen
- [ ] Delivery tracking and retry logic for failed pushes
- [ ] User preference center with granular controls

---

### 2.16 Provider / Business Owner Portal

**Priority:** P0 — Supply Side

**Description:** Web-based portal for business and staff management.

**User Stories:**
- As a business owner, I want to manage my profile, services, and availability.
- As a business owner, I want to see and manage my appointments.

**Acceptance Criteria:**
- [ ] Dashboard: today's appointments, revenue snapshot, upcoming week overview
- [ ] Calendar view: day/week/month, drag-to-reschedule, color-coded by status
- [ ] Appointment actions: confirm pending, check-in, complete, cancel with reason, no-show mark
- [ ] Service management: CRUD services, set duration, price, description, category assignment
- [ ] Staff management: add staff profiles, set permissions (admin/reception/staff), manage schedules
- [ ] Availability rules: set recurring hours, add exceptions, block time off
- [ ] Customer notes: view past visit history, add internal notes
- [ ] Settings: business info, photos, cancellation policy, payment methods accepted
- [ ] Mobile-responsive web app; native app companion (P1)

---

### 2.17 Admin Dashboard

**Priority:** P1 — Platform Operations

**Description:** Internal tool for platform management and support.

**Acceptance Criteria:**
- [ ] User management: search, view profiles, suspend/activate, impersonate for support
- [ ] Business onboarding approval workflow
- [ ] Content moderation: review flagged reviews, photos, business claims
- [ ] Analytics: MAU, booking volume, GMV, conversion funnel, top categories, churn metrics
- [ ] Financial: transaction ledger, payout management to businesses, fee configuration
- [ ] System health: queue monitoring, error rates, API performance
- [ ] Role-based access: super admin, ops, support, finance

---

### 2.18 Background Jobs (BullMQ)

**Priority:** P1 — Scalability & Reliability

**Description:** Asynchronous job processing for performance and reliability.

**Acceptance Criteria:**
- [ ] Job types and queues:
  - `notifications`: push, SMS, email dispatch with priority (booking > promotional)
  - `slot-recalculation`: trigger on schedule/service/staff changes
  - `payments`: webhook processing, payout batching
  - `reports`: daily/weekly analytics aggregation
  - `media`: image optimization, thumbnail generation
  - `data-exports`: GDPR data package generation
- [ ] Retry policy: 3 attempts with exponential backoff, dead letter queue after failure
- [ ] Job idempotency: duplicate execution safe
- [ ] Monitoring: queue depth, processing rate, failure rate dashboards
- [ ] Scheduled jobs: cron patterns for recurring tasks (daily summaries, cleanup)

---

## 3. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | App cold start <2s; screen transitions <300ms; API response <200ms p95 |
| Availability | 99.9% uptime; scheduled maintenance windows communicated |
| Security | OWASP Top 10 mitigation; penetration testing annually; SOC 2 Type II roadmap |
| Scalability | Support 10,000 concurrent users initially; horizontal scaling path |
| Compliance | GDPR, CCPA ready; data residency options |

## 4. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion rate | >15% of app opens |
| Guest to registered conversion | >30% |
| Day-7 retention | >25% |
| NPS | >40 |
| Support tickets per 1000 bookings | <5 |

## 5. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Guest Browse, Search, Business Detail, Booking Flow, Appointment Mgmt, Provider Portal | 8 weeks |
| v1.1 | Map Search, Favorites, Reviews, Notifications | +4 weeks |
| v1.2 | Payments, Profile, Admin Dashboard | +4 weeks |
| v2.0 | Background Jobs optimization, Loyalty, Analytics | +8 weeks |
