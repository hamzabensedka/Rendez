# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first appointment booking platform connecting customers with local beauty, wellness, and health service providers. The platform serves three user types: **Customers** (book appointments), **Providers/Business Owners** (manage business and availability), and **Admins** (platform oversight).

---

## 2. Feature Specifications

### 2.1 User Authentication

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 — Critical |
| **User Story** | As a user, I want to authenticate so I can book appointments and manage my profile. |

**Acceptance Criteria:**
- [ ] Users can register with email, password, phone number, and full name
- [ ] Users can log in with email/password
- [ ] OAuth 2.0 social login (Google, Apple) supported
- [ ] Password reset via email with secure token (expires in 1 hour)
- [ ] JWT access token (15 min expiry) + refresh token (7 days) pattern
- [ ] Phone number verification via SMS OTP
- [ ] Biometric login (Face ID / Touch ID) on supported devices
- [ ] Guest checkout allowed with option to create account post-booking
- [ ] Account linking: merge guest bookings upon registration
- [ ] Rate limiting: 5 failed login attempts triggers 15-minute lockout

---

### 2.2 Guest Browse & Explore

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 — Critical |
| **User Story** | As an unauthenticated user, I want to browse services so I can discover providers before committing. |

**Acceptance Criteria:**
- [ ] Full browse access without authentication
- [ ] Persistent guest session with local storage for 30 days
- [ ] Prompt to create account only at booking initiation
- [ ] Guest can view business details, services, reviews, and availability
- [ ] Guest location permission request for nearby results
- [ ] Conversion tracking: guest → registered user funnel

---

### 2.3 Business Search & Discovery

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 — Critical |
| **User Story** | As a customer, I want to find relevant businesses so I can book the right service. |

**Acceptance Criteria:**
- [ ] Full-text search across business name, service name, and description
- [ ] Autocomplete suggestions with typo tolerance (fuzzy matching)
- [ ] Recent searches persisted locally (last 10)
- [ ] Trending searches displayed on empty state
- [ ] Search results sorted by relevance, distance, rating, or price
- [ ] Filter by: category, price range, ratingi, availability today, gender of staff
- [ ] Pagination with infinite scroll (20 results per page)
- [ ] Search analytics logged for optimization
- [ ] Elasticsearch or equivalent for sub-100ms query response

---

### 2.4 Map-based Search

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 — Critical |
| **User Story** | As a customer, I want to see businesses on a map so I can choose by location. |

**Acceptance Criteria:**
- [ ] Interactive map with business markers (clustered at zoom levels)
- [ ] User location dot with accuracy radius
- [ ] Map/list toggle with synchronized state
- [ ] Marker selected state shows business card preview
- [ ] Directions integration (Apple Maps, Google Maps, Waze)
- [ ] Geohash-based spatial indexing for efficient queries
- [ ] Default radius: 5km, adjustable to 1-50km
- [ ] Map bounds trigger new search query

---

### 2.5 Business Detail View

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 — Critical |
| **User Story** | As a customer, I want to see complete business information so I can make an informed booking decision. |

**Acceptance Criteria:**
- [ ] Hero image carousel (up to 10 images)
- [ ] Business name, rating, review count, category badges
- [ ] Address with copy and directions actions
- [ ] Operating hours with "Open Now" indicator
- [ ] Phone, website, social links (clickable)
- [ ] Service menu with pricing and duration
- [ ] Staff/professional list with specialties
- [ ] Amenities and business policies (cancellation, late arrival)
- [ ] "Book Now" CTA sticky at bottom
- [ ] Share business via deep link
- [ ] Report inaccurate information

---

### 2.6 Service Categories

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 — Critical |
| **User Story** | As a customer, I want to browse by category so I can discover new services. |

**Acceptance Criteria:**
- [ ] Hierarchical category tree (e.g., Beauty > Hair > Coloring)
- [ ] Iconography for each top-level category
- [ ] Category landing page with featured businesses
- [ ] Subcategory filter within search
- [ ] Category popularity trending
- [ ] Admin-managed category taxonomy
- [ ] SEO-optimized category pages

---

### 2.7 Booking Flow

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 — Critical |
| **User Story** | As a customer, I want to book an appointment with minimal friction so I can secure my preferred time. |

**Acceptance Criteria:**
- [ ] Step 1: Select service(s) with optional add-ons
- [ ] Step 2: Select staff member or "no preference"
- [ ] Step 3: Date picker with available days highlighted
- [ ] Step 4: Time slot grid (morning/afternoon/evening groupings)
- [ ] Step 5: Confirm details with order summary
- [ ] Step 6: Apply promo code (optional)
- [ ] Step 7: Payment (if required) or confirm booking
- [ ] Real-time slot availability with optimistic locking (5-minute hold)
- [ ] Booking confirmation with calendar invite (.ics) and QR code
- [ ] Reschedule or cancel within business policy
- [ ] Waitlist option for fully booked preferred slots
- [ ] Group booking support (multiple services, one time slot)

---

### 2.8 Appointment Management

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 — Critical |
| **User Story** | As a customer, I want to manage my appointments so I can stay organized. |

**Acceptance Criteria:**
- [ ] Upcoming appointments list with chronological sort
- [ ] Past appointments with rebook action
- [ ] Appointment detail: service, staff, time, location, QR code
- [ ] Reschedule: suggest 3 nearest alternative slots
- [ ] Cancel with reason selection; enforce cancellation policy
- [ ] Add to calendar (iOS/Android native)
- [ ] Get directions at appointment time
- [ ] No-show tracking and consequences

---

### 2.9 Favorites

| Attribute | Value |
|-----------|-------|
| **Priority** | P1 — High |
| **User Story** | As a customer, I want to save favorite businesses so I can rebook quickly. |

**Acceptance Criteria:**
- [ ] Heart toggle on business card and detail view
- [ ] Favorites list with quick rebook
- [ ] Push notification when favorite adds new availability
- [ ] Sync favorites across devices (authenticated users)
- [ ] Local-only favorites for guests (prompt to register for sync)
- [ ] Maximum 200 favorites per user

---

### 2.10 User Profile

| Attribute | Value |
|-----------|-------|
| **Priority** | P1 — High |
| **User Story** | As a user, I want to manage my personal information so my bookings are accurate. |

**Acceptance Criteria:**
- [ ] Edit name, phone, email (with re-verification)
- [ ] Profile photo upload (crop, 5MB max)
- [ ] Default notification preferences (push, SMS, email)
- [ ] Saved payment methods (PCI-compliant tokenization)
- [ ] Booking history with invoice download
- [ ] Loyalty points / rewards balance (if applicable)
- [ ] Data export (GDPR compliance)
- [ ] Account deletion with 30-day grace period

---

### 2.11 Availability & Slot Computation

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 — Critical |
| **User Story** | As a system, I need to compute accurate availability so bookings don't conflict. |

**Acceptance Criteria:**
- [ ] Business defines weekly recurring hours + exceptions
- [ ] Staff-level availability overrides business hours
- [ ] Service duration + buffer time between appointments
- [ ] Block out breaks, lunches, time off
- [ ] Real-time slot calculation with caching (Redis, 30s TTL)
- [ ] Handle timezone correctly (business timezone stored, displayed in user timezone)
- [ ] Double-booking prevention at database level (unique constraint)
- [ ] Slot generation: 15-minute intervals, respecting service duration
- [ ] Overbooking protection with configurable buffer
- [ ] Bulk slot generation via BullMQ background jobs

---

### 2.12 Shared Types & Design System

| Attribute | Value |
|-----------|-------|
| **Priority** | P1 — High |
| **User Story** | As a developer, I need consistent components so the app feels cohesive. |

**Acceptance Criteria:**
- [ ] Design tokens: colors, typography, spacing, shadows
- [ ] Component library: buttons, inputs, cards, modals, bottom sheets
- [ ] Shared TypeScript interfaces across frontend and API contracts
- [ ] Accessibility: WCAG 2.1 AA minimum, screen reader support
- [ ] Dark mode support
- [ ] RTL language support architecture
- [ ] Animation standards (300ms transitions)
- [ ] Error state and empty state patterns
- [ ] Loading skeletons for async content

---

### 2.13 Reviews & Ratings

| Attribute | Value |
|-----------|-------|
| **Priority** | P1 — High |
| **User Story** | As a customer, I want to read and leave reviews so I can trust the quality of service. |

**Acceptance Criteria:**
- [ ] 5-star rating with half-star precision
- [ ] Review text (10-2000 characters) with profanity filter
- [ ] Photo upload (up to 5 images per review)
- [ ] Verified purchase badge (only post-appointment reviews)
- [ ] Business owner response capability
- [ ] Report review for moderation
- [ ] Sort reviews by: most recent, highest/lowest rated, verified only
- [ ] Rating distribution histogram
- [ ] Review prompt: 24 hours post-appointment via push

---

### 2.14 Payment Integration

| Attribute | Value |
|-----------|-------|
| **Priority** | P1 — High |
| **User Story** | As a customer, I want to pay securely so my booking is confirmed. |

**Acceptance Criteria:**
- [ ] Stripe/PayPal integration for card payments
- [ ] Apple Pay / Google Pay native checkout
- [ ] SCA/3D Secure compliance for EU
- [ ] Deposit vs. full payment options (configurable by business)
- [ ] Refund processing with automated calculation per policy
- [ ] Payment receipt via email and in-app
- [ ] Failed payment retry with alternative method
- [ ] No-show charge automation
- [ ] PCI DSS Level 1 compliance (no card data stored)

---

### 2.15 Notifications

| Attribute | Value |
|-----------|-------|
| **Priority** | P1 — High |
| **User Story** | As a user, I want timely notifications so I don't miss my appointments. |

**Acceptance Criteria:**
- [ ] Push notifications via Firebase/APNs
- [ ] Booking confirmation, reminder (24h, 2h, 15min before)
- [ ] Reschedule/cancellation alerts
- [ ] Promotional notifications (opt-in)
- [ ] SMS fallback for critical alerts
- [ ] Email notifications with rich formatting
- [ ] Notification preference center
- [ ] Quiet hours respect (no pushes 10pm-8am unless emergency)
- [ ] Notification analytics: delivery, open, conversion rates

---

### 2.16 Provider / Business Owner Portal

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 — Critical |
| **User Story** | As a business owner, I want to manage my business so customers can book with me. |

**Acceptance Criteria:**
- [ ] Dashboard: today's appointments, revenue, new bookings
- [ ] Calendar view: day/week/month with drag-to-reschedule
- [ ] Service management: CRUD with pricing, duration, description
- [ ] Staff management: profiles, schedules, permissions
- [ ] Availability configuration: hours, breaks, time off
- [ ] Booking rules: lead time, cancellation policy, buffer time
- [ ] Customer database with booking history
- [ ] Revenue reporting with date range export
- [ ] Review management and response
- [ ] Multiple location support
- [ ] Mobile-responsive web portal

---

### 2.17 Admin Dashboard

| Attribute | Value |
|-----------|-------|
| **Priority** | P2 — Medium |
| **User Story** | As a platform admin, I want oversight so the marketplace operates smoothly. |

**Acceptance Criteria:**
- [ ] User management: search, suspend, impersonate
- [ ] Business onboarding workflow and verification
- [ ] Content moderation: review flagged reviews and images
- [ ] Transaction monitoring and dispute handling
- [ ] Platform analytics: MAU, bookings, GMV, churn
- [ ] Promo code creation and campaign management
- [ ] Feature flags for gradual rollout
- [ ] Audit log of all admin actions
- [ ] SLA monitoring and alerting

---

### 2.18 Background Jobs (BullMQ)

| Attribute | Value |
|-----------|-------|
| **Priority** | P1 — High |
| **User Story** | As a system, I need reliable background processing so operations don't block user requests. |

**Acceptance Criteria:**
- [ ] Job queues: notifications, emails, slot regeneration, reports, data exports
- [ ] Retry logic: 3 attempts with exponential backoff
- [ ] Dead letter queue for failed jobs after retries
- [ ] Job priority levels: critical, high, normal, low
- [ ] Scheduled jobs: daily reports, nightly slot generation
- [ ] Job observability: dashboard with queue depth, processing rate, failures
- [ ] Idempotency keys to prevent duplicate processing
- [ ] Rate limiting per job type
- [ ] Graceful shutdown: finish active jobs before process exit

---

## 3. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | App launch < 2s; screen transitions < 300ms; API response < 200ms (p95) |
| **Scalability** | Support 10,000 concurrent users; 1M bookings/month |
| **Security** | OWASP Top 10 mitigation; encryption at rest and in transit |
| **Compliance** | GDPR, CCPA, PCI DSS |
| **Reliability** | 99.9% uptime; automated backups; disaster recovery < 4h RTO |

---

## 4. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion rate | > 15% |
| Guest to registered user | > 30% |
| App store rating | > 4.5 stars |
| Customer NPS | > 50 |
| Provider retention (12mo) | > 80% |

---

*Document version: 1.0 | Last updated: Product Owner review | Next review: Sprint 4*