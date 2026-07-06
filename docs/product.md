# Planity Clone — Product Specification

## 1. Overview

### 1.1 Product Vision
A mobile-first platform connecting beauty & wellness service seekers with local businesses, enabling seamless discovery, booking, and appointment management.

### 1.2 Target Users
- **Clients**: Consumers seeking beauty/wellness appointments
- **Providers**: Business owners and staff managing schedules
- **Admins**: Platform operators overseeing marketplace health

### 1.3 Success Metrics
- Booking conversion rate >15%
- Search-to-booking <3 minutes
- Provider activation rate >60%

---

## 2. Features & Acceptance Criteria

### 2.1 User Authentication (P0)

**User Story**: As a user, I want to create an account and log in securely so I can manage my bookings.

| Authored By | Status | Priority |
|-------------|--------|----------|
| Product | Draft | P0 |

**Acceptance Criteria**:
- [ ] Users can register with email, phone, or OAuth (Google, Apple)
- [ ] Phone verification via SMS OTP
- [ ] Password reset via email/SMS
- [ ] JWT access token (15min expiry) + refresh token (7 days)
- [ ] Biometric login (Face ID/Touch ID) after initial setup
- [ ] Session invalidation on logout from all devices option
- [ ] Rate limiting: 5 failed attempts triggers 30-min lockout

**Edge Cases**:
- Duplicate phone/email detection with merge flow
- OAuth email conflict resolution

---

### 2.2 Guest Browse & Explore (P0)

**User Story**: As an unauthenticated user, I want to browse services so I can decide to register.

**Acceptance Criteria**:
- [ ] Full search and discovery without account
- [ ] Business detail view accessible
- [ ] "Book Now" CTA triggers auth modal with pre-filled context
- [ ] Guest session persists in localStorage for 24 hours
- [ ] Post-booking prompt to create account to manage appointment

**Conversion Flow**:
Guest → Auth modal → Account creation → Redirect to booking continuation

---

### 2.3 Business Search & Discovery (P0)

**User Story**: As a client, I want to find businesses by various criteria so I can choose the right provider.

**Acceptance Criteria**:
- [ ] Full-text search across business name, service name, address
- [ ] Filters: distance (1-50km), rating (1-5), price range, open now, gender (male/female/unisex)
- [ ] Sort options: relevance, distance, rating, price (low-high)
- [ ] Auto-complete suggestions with recent searches
- [ ] Search history (last 10, deletable)
- [ ] Results skeleton loading state, empty state with CTA

**Technical**: Elasticsearch with fuzzy matching, typo tolerance

---

### 2.4 Map-based Search (P0)

**User Story**: As a client, I want to see businesses on a map so I can choose by location.

**Acceptance Criteria**:
- [ ] Toggle between list and map views
- [ ] Clustered pins at zoom levels (cluster count visible)
- [ ] Pin color: open=green, closing soon=orange, closed=gray
- [ ] Bottom sheet with business preview on pin tap
- [ ] "Re-center to my location" button
- [ ] Boundary search: drag map, tap "Search this area"
- [ ] Default zoom shows businesses within 5km radius

---

### 2.5 Business Detail View (P0)

**User Story**: As a client, I want comprehensive business information so I can make an informed booking decision.

**Acceptance Criteria**:
- [ ] Header: name, rating, review count, distance, favorite toggle
- [ ] Image gallery (up to 10 photos), video support
- [ ] Services tab: categorized list with prices and durations
- [ ] Team tab: staff profiles with specialties and ratings
- [ ] Reviews tab: sortable (recent, highest, lowest), with photos
- [ ] About tab: description, hours, amenities, payment methods, parking
- [ ] Sticky "Book" CTA with starting price
- [ ] Share business (deep link, native share sheet)

---

### 2.6 Service Categories (P1)

**User Story**: As a client, I want to browse by category so I can discover new services.

**Acceptance Criteria**:
- [ ] Hierarchical categories: Hair, Nails, Face, Body, Massage, Medical Aesthetic
- [ ] Subcategories: e.g., Hair > Cut, Color, Styling, Treatment
- [ ] Category icons with consistent visual treatment
- [ ] Trending/featured categories surfaced on home
- [ ] Category landing page with curated businesses

---

### 2.7 Booking Flow (P0)

**User Story**: As a client nail, I want to book an appointment with minimal friction.

**Acceptance Criteria**:
- [ ] Step 1: Select service(s) with optional staff preference
- [ ] Step 2: Date picker with availability visualization (green/orange/red density)
- [ ] Step 3: Time slot selection (15-min increments)
- [ ] Step 4: Confirm details, apply promo code, add notes
- [ ] Step 5: Payment selection and booking confirmation
- [ ] Multi-service booking with sequential or parallel scheduling
- [ ] Guest checkout with email/phone capture
- [ ] Booking held for 10 minutes during payment (inventory reservation)

**Error Handling**:
- Slot taken during flow: offer next 3 available slots
- Payment failure: retry or pay at venue option

---

### 2.8 Appointment Management (P0)

**User Story**: As a client, I want to manage my appointments so I can stay organized.

**Acceptance Criteria**:
- [ ] Upcoming/past/history tabs
- [ ] Reschedule: select new slot with same service/staff preference
- [ ] Cancel with reason selection (client data, no penalty for >24h)
- [ ] Add to calendar (iCal, Google Calendar)
- [ ] Directions to business (deep link to maps)
- [ ] Rebook same service with one tap
- [ ] No-show flagging (client-side warning, provider notification)

---

### 2.9 Favorites (P1)

**User Story**: As a client, I want to save favorite businesses for quick access.

**Acceptance Criteria**:
- [ ] Heart toggle on business cards and detail
- [ ] Favorites list with quick book CTA
- [ ] Push notification for new availability at favorited business
- [ ] Sync across devices for authenticated users

---

### 2.10 User Profile (P1)

**User Story**: As a user, I want to manage my personal information and preferences.

**Acceptance Criteria**:
- [ ] Profile photo, name, phone, email editable
- [ ] Notification preferences (push, SMS, email) per event type
- [ ] Payment methods management (cards, Apple Pay, Google Pay)
- [ ] Booking history with receipts
- [ ] Loyalty points/stamps if applicable
- [ ] Data export (GDPR) and account deletion

---

### 2.11 Availability & Slot Computation (P0)

**User Story**: As a system, I need accurate availability to prevent double-bookings.

**Acceptance Criteria**:
- [ ] Scheduler respects: business hours, staff schedules, service durations, buffer times
- [ ] Real-time availability with <500ms response
- [ ] Concurrent booking protection (optimistic locking)
- [ ] Recurring availability patterns with exception handling
- [ ] Block-out dates for holidays/staff time off
- [ ] Dynamic slot generation: 9:00, 9:15, 9:30... based on service duration
- [ ] Multi-staff parallel booking (e.g., mani-pedi simultaneous)

**Algorithm**: Generate slots → Filter booked → Return available

---

### 2.12 Shared Types & Design System (P0)

**User Story**: As a team, we need consistent UI/UX across platforms.

**Acceptance Criteria**:
- [ ] Design tokens: colors, typography, spacing, shadows
- [ ] Component library: buttons, inputs, cards, modals, skeletons
- [ ] Icon set (Lucide or custom)
- [ ] Responsive breakpoints: mobile <768px, tablet 768-1024, desktop >1024
- [ ] Accessibility: WCAG 2.1 AA, screen reader support, focus management
- [ ] Dark mode support
- [ ] RTL language preparation

---

### 2.13 Reviews & Ratings (P1)

**User Story**: As a client, I want to read and write reviews to make informed choices.

**Acceptance Criteria**:
- [ ] 5-star rating with half-star precision
- [ ] Review form: rating, text (min 20 chars), photo upload (max 5)
- [ ] Verified purchase badge (only post-appointment reviews)
- [ ] Review helpfulness voting
- [ ] Business response to reviews
- [ ] Report inappropriate content
- [ ] Review moderation queue for flagged items

---

### 2.14 Payment Integration (P0)

**User Story**: As a client, I want secure, flexible payment options.

**Acceptance Criteria**:
- [ ] Stripe/Paymill integration for card payments
- [ ] Apple Pay, Google Pay native flows
- [ ] "Pay at venue" option (business configurable)
- [ ] Deposit/partial payment support
- [ ] Full refund, partial refund, store credit flows
- [ ] Invoice generation for business accounts
- [ ] PCI compliance (tokenization, no raw card storage)

---

### 2.15 Notifications (P1)

**User Story**: As a user, I want timely notifications about my appointments.

**Acceptance Criteria**:
- [ ] Push, SMS, email channels with user preference
- [ ] Triggered events: booking confirmed, 24h reminder, 1h reminder, cancellation, modification
- [ ] Provider notifications: new booking, cancellation, no-show
- [ ] Marketing opt-in with granular controls
- [ ] Notification center in-app with read/unread state
- [ ] Deep links to relevant screens

---

### 2.16 Provider / Business Owner Portal (P0)

**User Story**: As a business owner, I want to manage my presence and appointments.

**Acceptance Criteria**:
- [ ] Dashboard: today's appointments, revenue, occupancy rate
- [ ] Calendar view: day/week/month with drag-to-reschedule
- [ ] Booking management: accept, decline, modify, mark no-show
- [ ] Service catalog: CRUD with pricing, duration, staff assignment
- [ ] Staff management: schedules, permissions, commission tracking
- [ ] Client database with visit history, notes, allergies
- [ ] Business profile: photos, description, hours, policies
- [ ] Analytics: booking volume, revenue, cancellation rate, popular services
- [ ] Payout account setup and transaction history

---

### 2.17 Admin Dashboard (P2)

**User Story**: As a platform admin, I need oversight and control tools.

**Acceptance Criteria**:
- [ ] User management: search, suspend, impersonate
- [ ] Business onboarding approval workflow
- [ ] Content moderation: reviews, photos, business claims
- [ ] Financial overview: GMV, commission, payouts
- [ ] Support ticket routing and resolution tracking
- [ ] Feature flags for gradual rollout
- [ ] System health monitoring

---

### 2.18 Background Jobs (BullMQ) (P0)

**User Story**: As a system, I need reliable async processing.

**Acceptance Criteria**:
- [ ] Job types: notifications, emails, SMS, payment webhooks, report generation, data exports
- [ ] Retry logic: 3 attempts with exponential backoff
- [ ] Dead letter queue for failed jobs
- [ ] Job priority levels (critical, high, normal, low)
- [ ] Scheduled jobs: daily reports, reminder batches
- [ ] Observability: job counts, processing time, failure rate
- [ ] Concurrency limits per queue type

---

## 3. Non-Functional Requirements

| Aspect | Requirement |
|--------|-------------|
| Performance | Page load <2s, API response <200ms (p95) |
| Availability | 99.9% uptime, scheduled maintenance windows |
| Security | OWASP Top 10 mitigation, encryption at rest/in transit |
| Scalability | Horizontal scaling, CDN for assets |
| Compliance | GDPR, CCPA, PCI DSS |

## 4. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Search, Business Detail, Booking, Payments, Provider Portal | 8 weeks |
| V1 | Map, Favorites, Reviews, Notifications, Appointments | +4 weeks |
| V2 | Admin, Analytics, Loyalty, Advanced Scheduling | +6 weeks |

## 5. Open Questions

1. Internationalization scope for launch?
2. Commission structure: flat fee or percentage?
3. Insurance/liability coverage for no-shows?

---
*Document Version: 1.0 | Last Updated: 2024*