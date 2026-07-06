# Planity Clone — Product Specification

## 1. Document Information
| Attribute | Value |
|-----------|-------|
| Version | 1.0 |
| Status | Draft |
| Author | Alex — Product Owner |
| Date | 2024 |

## 2. Product Vision
A mobile-first platform connecting customers with beauty/wellness businesses for seamless appointment booking. Two-sided marketplace: consumers discover and book services; business owners manage their schedule, staff, and online presence.

## 3. Target Users
- **Consumers**: 18-55, smartphone-first, value convenience and reviews
- **Business Owners**: Salons, barbershops, spas, independent professionals
- **Admins**: Platform operators managing onboarding and quality

## 4. Feature Specifications

### 4.1 User Authentication
**Priority**: P0 | **Effort**: M

| Aspect | Specification |
|--------|-------------|
| **Description** | Secure account creation and access for all user types |
| **User Story** | As a user, I want to authenticate quickly so I can access personalized features |

**Acceptance Criteria:**
- [ ] Email/password registration with validation (email format, password ≥8 chars, uppercase, number, special char)
- [ ] Email verification via OTP/code with 24h expiry
- [ ] Login with email/password, JWT access (15min) + refresh (7d) tokens
- [ ] OAuth 2.0: Google, Apple Sign-In
- [ ] "Continue as Guest" with limited feature access (browse only, no booking)
- [ ] Password reset via secure email link (1h expiry)
- [ ] Biometric login (Face ID/Touch ID) after initial authentication
- [ ] Account lockout after 5 failed attempts, 30-min cooldown
- [ ] Session management: show active devices, allow remote logout
- [ ] Role-based access: `customer`, `business_owner`, `admin`

**Error States**: Invalid credentials, unverified email, expired session, network failure

---

### 4.2 Guest Browse & Explore
**Priority**: P0 | **Effort**: M

| Aspect | Specification |
|--------|-------------|
| **Description** | Pre-authentication discovery to drive conversion |
| **User Story** | As a guest, I want to browse businesses before committing to create an account |

**Acceptance Criteria:**
- [ ] View featured businesses carousel on home screen
- [ ] Browse by service category with icon grid
- [ ] See business cards with: name, rating, starting price, distance, next available slot
- [ ] Search by business name or service (debounced 300ms)
- [ ] Apply filters: distance radius, price range, rating threshold
- [ ] View business detail page (read-only, booking CTA prompts login)
- [ ] Persistent "Sign up to book" sticky banner on detail page
- [ ] Guest state stored locally; merge to account upon registration

**Conversion Trigger**: After 3 business views or 60s on detail page, show soft login prompt

---

### 4.3 Business Search & Discovery
**Priority**: P0 | **Effort**: L

| Aspect | Specification |
|--------|-------------|
| **Description** | Powerful, fast search across businesses and services |
| **User Story** | As a customer, I want to find the right business quickly based on my criteria |

**Acceptance Criteria:**
- [ ] Full-text search indexed on: business name, service names, staff names, description
- [ ] Autocomplete suggestions with typo tolerance (fuzzy matching, Levenshtein distance ≤2)
- [ ] Recent searches persistence (last 10, clearable)
- [ ] Trending searches section
- [ ] Search results sort: relevance (default), distance, rating, price (low/high)
- [ ] Active filter pills with quick remove
- [ ] Empty state with suggestions and "broaden search" CTA
- [ ] Search analytics: track queries, zero-result rates, filter usage

**Performance**: <200ms search response, <50ms debounce

---

### 4.4 Map-based Search
**Priority**: P0 | **Effort**: L

| Aspect | Specification |
|--------|-------------|
| **Description** | Visual geographic exploration of businesses |
| **User Story** | As a customer, I want to see businesses near me on a map to choose by location |

**Acceptance Criteria:**
- [ ] Default to user location (with permission); fallback to city center
- [ ] Clustered markers at zoom levels; individual markers on zoom in
- [ ] Marker color: green (available today), orange (available this week), gray (limited availability)
- [ ] Tap marker → bottom sheet with business preview card
- [ ] List/map toggle with state persistence
- [ ] "Search this area" button on map pan
- [ ] Current location button with recenter animation
- [ ] Custom marker for user's selected address

**Map Provider**: Mapbox or Google Maps with custom styling aligned to design system

---

### 4.5 Business Detail View
**Priority**: P0 | **Effort**: M

| Aspect | Specification |
|--------|-------------|
| **Description** | Comprehensive business information to drive booking decision |
| **User Story** | As a customer, I want complete business information to make an informed booking |

**Acceptance Criteria:**
- [ ] Hero: cover image carousel (up to 10), business name, verified badge, rating, review count
- [ ] Quick actions: favorite, share (deep link), call, get directions
- [ ] Tab navigation: Services, Reviews, About, Availability
- [ ] Services tab: grouped by category, expandable, with duration and price
- [ ] Reviews tab: rating distribution, filter by rating, photos, owner responses
- [ ] About tab: description, amenities tags, business hours, staff profiles
- [ ] Availability tab: mini calendar with next 7 days, earliest slots per day
- [ ] Sticky "Book Now" CTA when scrolled past services
- [ ] Similar businesses carousel at bottom

**Image Handling**: Lazy loading, placeholder shimmer, pinch-to-zoom on tap

---

### 4.6 Service Categories
**Priority**: P0 | **Effort**: M

| Aspect | Specification |
|--------|-------------|
| **Description** | Hierarchical classification of wellness/beauty services |
| **User Story** | As a customer, I want to browse by service type to find relevant businesses |

**Acceptance Criteria:**
- [ ] Category hierarchy: Level 1 (e.g., Hair, Nails, Spa) → Level 2 (e.g., Haircut, Coloring, Styling)
- [ ] Category icons from design system icon library
- [ ] Popular categories surfaced based on user behavior and trends
- [ ] Category landing page with featured businesses and subcategory grid
- [ ] SEO-friendly category URLs and metadata
- [ ] Admin-configurable: add, edit, deactivate categories; reorder display

**Initial Categories**: Hair, Barber, Nails, Face & Skin, Massage, Makeup, Tattoo & Piercing, Spa & Wellness, Fitness, Medical Aesthetic

---

### 4.7 Booking Flow
**Priority**: P0 | **Effort**: XL

| Aspect | Specification |
|--------|-------------|
| **Description** | Seamless multi-step appointment reservation |
| **User Story** | As a customer, I want to book an appointment in minimal steps with clear confirmation |

**Acceptance Criteria:**
- [ ] Step 1 — Service Selection: single or multiple services (cart), show total duration/price
- [ ] Step 2 — Staff Selection: "Any available" or specific staff with profile cards
- [ ] Step 3 — Date/Time: calendar view with available slots, timezone handling
- [ ] Step 4 — Confirm: review details, apply promo code, add notes, cancellation policy
- [ ] Step 5 — Payment (if required) or direct confirmation (pay at venue)
- [ ] Confirmation screen with booking reference, add to calendar, share
- [ ] Booking modification: reschedule or cancel per business policy (24h default)
- [ ] Waitlist: option to join if slot unavailable, auto-notify on cancellation
- [ ] Guest checkout: collect minimal info (name, phone, email), prompt account creation post-booking

**Slot Selection Rules**: Respect staff availability, service duration, buffer time, existing bookings

---

### 4.8 Appointment Management
**Priority**: P0 | **Effort**: M

| Aspect | Specification |
|--------|-------------|
| **Description** | Customer view of past and upcoming appointments |
| **User Story** | As a customer, I want to manage my bookings and have relevant details at hand |

**Acceptance Criteria:**
- [ ] Upcoming appointments list with status: confirmed, pending, completed, cancelled, no-show
- [ ] Appointment card: business info, services, staff, date/time, location, QR code/check-in code
- [ ] Detail view with full info, directions, contact, reschedule/cancel actions
- [ ] Action availability based on business cancellation policy (e.g., >24h free, <24h charge)
- [ ] Push notification 24h and 1h before appointment
- [ ] Rebook CTA for completed appointments
- [ ] Empty states for no upcoming/past appointments

---

### 4.9 Favorites
**Priority**: P1 | **Effort**: S

| Aspect | Specification |
|--------|-------------|
| **Description** | Save preferred businesses for quick access |
| **User Story** | As a customer, I want to save businesses I like for faster future booking |

**Acceptance Criteria:**
- [ ] Toggle favorite from business card, detail page, or after booking
- [ ] Favorites list with search and sort (recently added, name, nearest)
- [ ] Availability indicator: next available slot on favorite card
- [ ] Quick book button from favorite card
- [ ] Sync across devices for logged-in users
- [ ] Guest favorites stored locally, prompt login on app reinstall
- [ ] Unfavorite with undo toast (5s)

---

### 4.10 User Profile
**Priority**: P1 | **Effort**: M

| Aspect | Specification |
|--------|-------------|
| **Description** | Customer account management and preferences |
| **User Story** | As a user, I want to manage my personal information and preferences |

**Acceptance Criteria:**
- [ ] Profile: name, photo, phone, email (editable with verification for email/phone changes)
- [ ] Saved addresses: home, work, custom with map pin placement
- [ ] Payment methods: add, set default, delete (Stripe/Payrix tokens)
- [ ] Notification preferences: push, email, SMS per type (bookings, promotions, reminders)
- [ ] Privacy settings: profile visibility, data download, account deletion (GDPR)
- [ ] Booking history with invoice/receipt access
- [ ] Loyalty points/balance display (if applicable)
- [ ] Referral code and sharing

---

### 4.11 Availability & Slot Computation
**Priority**: P0 | **Effort**: XL

| Aspect | Specification |
|--------|-------------|
| **Description** | Real-time calculation of bookable time slots |
| **User Story** | As a business, I want accurate availability; as a customer, I want to see real openings |

**Acceptance Criteria:**
- [ ] Business defines: operating hours per day, staff schedules, break times
- [ ] Service definitions: duration, buffer before/after, concurrent capacity (rooms/chairs)
- [ ] Staff assignment: services each staff can perform
- [ ] Slot computation engine: generate available slots respecting all constraints
- [ ] Handle recurring availability and one-off exceptions (time off, holidays)
- [ ] Real-time availability with optimistic locking; hold slot 10min during checkout
- [ ] Overbooking protection; configurable waitlist depth
- [ ] Performance: compute 7-day view for single staff in <100ms

**Algorithm**: Generate candidate slots from business hours → subtract staff breaks → subtract existing bookings → apply service duration → filter by staff-service mapping → return sorted slots

---

### 4.12 Shared Types & Design System
**Priority**: P0 | **Effort**: M

| Aspect | Specification |
|--------|-------------|
| **Description** | Consistent UI/UX foundation across platforms |
| **User Story** | As a user, I want a familiar, predictable interface |

**Acceptance Criteria:**
- [ ] Design tokens: colors (primary #6C5CE7, semantic states), typography (Inter), spacing (8px grid), shadows, radii
- [ ] Component library: Button, Input, Card, Modal, BottomSheet, Calendar, TimePicker, Avatar, Badge, Skeleton, Toast
- [ ] Shared TypeScript types: User, Business, Service, Appointment, Slot, Review, Payment
- [ ] Zod schemas for runtime validation matching API contracts
- [ ] Responsive breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px)
- [ ] Dark mode support with system preference detection
- [ ] Accessibility: WCAG 2.1 AA minimum, screen reader support, focus management, reduced motion
- [ ] i18n framework with English, French, German, Spanish initial; RTL preparation

---

### 4.13 Reviews & Ratings
**Priority**: P1 | **Effort**: M

| Aspect | Specification |
|--------|-------------|
| **Description** | Social proof through verified customer feedback |
| **User Story** | As a customer, I want honest reviews; as a business, I want to build reputation |

**Acceptance Criteria:**
- [ ] Review eligibility: verified booking completion; 14-day window post-appointment
- [ ] Rating: 1-5 stars with half-star precision
- [ ] Review content: text (10-500 chars), photo upload (up to 5, 5MB each)
- [ ] Business owner response with notification to reviewer
- [ ] Review moderation: auto-flag profanity, manual admin review for disputes
- [ ] Rating breakdown by category: service quality, staff, ambiance, value
- [ ] Sort reviews: most recent, highest/lowest rating, with photos
- [ ] Aggregate score calculation with Bayesian average for low-review businesses
- [ ] Report review for policy violation

---

### 4.14 Payment Integration
**Priority**: P1 | **Effort**: L

| Aspect | Specification |
|--------|-------------|
| **Description** | Secure, flexible payment processing |
| **User Story** | As a customer, I want to pay conveniently; as a business, I want reliable payouts |

**Acceptance Criteria:**
- [ ] Payment methods: credit/debit (Stripe), Apple Pay, Google Pay, PayPal
- [ ] Business-configurable: full prepay, deposit, or pay at venue
- [ ] Deposit amount: fixed or percentage of service price
- [ ] Split payments: deposit online, remainder at venue
- [ ] Cancellation refund policy: full, partial, or none based on timing
- [ ] Invoice generation and email delivery
- [ ] Business payout: weekly to connected account, dashboard reporting
- [ ] Failed payment handling: retry logic, grace period, booking hold release
- [ ] PCI DSS compliance via tokenization; no raw card storage

---

### 4.15 Notifications
**Priority**: P1 | **Effort**: M

| Aspect | Specification |
|--------|-------------|
| **Description** | Multi-channel user engagement and operational alerts |
| **User Story** | As a user, I want timely, relevant updates about my bookings |

**Acceptance Criteria:**
- [ ] Push notifications: booking confirmed, reminder (24h, 1h), cancelled, rescheduled, waitlist available, review request
- [ ] Email: confirmation, receipt, policy reminders, marketing (opt-in)
- [ ] SMS: critical updates for users who opt in
- [ ] In-app notification center with read/unread, deep links
- [ ] Rich push with actions (confirm, cancel, reschedule without opening app)
- [ ] Notification preferences granular control per channel and type
- [ ] Delivery tracking: sent, delivered, opened metrics
- [ ] Fallback chain: push → SMS → email for critical notifications

---

### 4.16 Provider / Business Owner Portal
**Priority**: P0 | **Effort**: XL

| Aspect | Specification |
|--------|-------------|
| **Description** | Complete business management web application |
| **User Story** | As a business owner, I want to manage my presence, schedule, and clients efficiently |

**Acceptance Criteria:**
- [ ] **Dashboard**: today's appointments, revenue this week, occupancy rate, new clients
- [ ] **Calendar View**: day/week/month views, drag-to-reschedule, color-coded by status
- [ ] **Appointment Management granular control**: create, edit, cancel with customer notification
- [ ] **Staff Management**: add staff profiles, set services, schedules, time off
- [ ] **Services**: create, edit, price, duration, description, photos; category assignment
- [ ] **Availability**: set recurring hours, add exceptions, block time
- [ ] **Client Database**: view history, notes, contact; export capability
- [ ] **Business Profile**: photos, description, amenities, social links; preview as customer sees
- [ ] **Settings**: cancellation policy, booking lead time, payment preferences, notification settings
- [ ] **Analytics**: bookings, revenue, no-show rate, popular services, peak hours
- [ ] **Multi-location support** for chains

---

### 4.17 Admin Dashboard
**Priority**: P1 | **Effort**: L

| Aspect | Specification |
|--------|-------------|
| **Description** | Platform operations and governance |
| **User Story** | As an admin, I want to oversee and manage the marketplace health |

**Acceptance Criteria:**
- [ ] Business onboarding workflow: application review, document verification, approval/rejection with notes
- [ ] Business management: view all, search, filter by status, suspend, feature
- [ ] User management: search, view activity, suspend, impersonate (audit logged)
- [ ] Content moderation: review flagged reviews, photos, business info; take action
- [ ] Category management: CRUD, ordering, icon assignment
- [ ] Promotions: create coupon codes, set validity, usage limits, target segments
- [ ] Financial overview: GMV, transaction volume, commission, payouts due
- [ ] System health: error rates, API latency, job queue depth
- [ ] Role-based admin access: super_admin, support, finance, operations

---

### 4.18 Background Jobs (BullMQ)
**Priority**: P1 | **Effort**: M

| Aspect | Specification |
|--------|-------------|
| **Description** | Reliable asynchronous task processing |
| **User Story** | As a system, I want to handle heavy or time-sensitive tasks without blocking user requests |

**Acceptance Criteria:**
- [ ] **Job Definitions**:
  - `send-notification`: push, email, SMS delivery with provider fallback
  - `process-payment`: idempotent payment capture with retry
  - `generate-invoice`: PDF creation and email attachment
  - `sync-search-index`: update Elasticsearch/Algolia on business data changes
  - `cleanup-expired-holds`: release slot holds past expiration
  - `reminder-dispatch`: 24h and 1h appointment reminders
  - `review-request`: post-appointment review prompt (24h delay)
  - `analytics-aggregation`: daily rollups for dashboards
  - `image-processing`: resize uploads to variants (thumbnail, standard, full)
- [ ] Queue configuration: priority levels, concurrency limits, stall detection
- [ ] Dead letter queue for failed jobs after max retries (3)
- [ ] Job observability: dashboard with queue depth, processing rate, failure rate
- [ ] Scheduled jobs: cron expressions for recurring tasks
- [ ] Rate limiting per job type and per-user where applicable

---

## 5. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | App launch <2s; page load <1s; API response p95 <200ms |
| **Scalability** | Horizontal scaling, stateless services, CDN for static assets |
| **Security** | OWASP Top 10 mitigation, encryption at rest and in transit, audit logging |
| **Compliance** | GDPR, CCPA data handling; PCI DSS for payments |
| **Reliability** | 99.9% uptime target; graceful degradation |

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Guest Browse, Search, Business Detail, Categories, Booking Flow, Appointment Mgmt, Slot Computation, Business Portal | Q1 |
| **V1.1** | Map Search, Favorites, Reviews, Profile, Notifications | Q2 |
| **V1.2** | Payments, Admin Dashboard, Background Jobs, Analytics | Q2-Q3 |
| **V1.3** | Loyalty, Referrals, Multi-location, Advanced Marketing | Q4 |

## 7. Success Metrics
- Monthly Bookings (target: 10K by month 6)
- Booking Conversion Rate (target: >15% detail→book)
- Business Activation Rate (target: >80% complete profile)
- Customer Retention (target: 30% book again within 60 days)
- NPS (target: >50)

## 8. Open Questions
- Preferred payment provider (Stripe vs. Adyen vs. local)?
- Commission structure: percentage per booking or SaaS subscription?
- Geographic launch sequence?
- White-label or branded app strategy?