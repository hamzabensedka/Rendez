# Planity Clone — Product Specification

> **Version:** 1.0.0  
> **Author:** Alex (Product Owner)  
> **Date:** 2024-01-15  
> **Status:** Draft → Ready for Development  

---

## 1. Overview

### 1.1 Product Vision
Build a scalable, modern clone of Planity — a platform connecting customers with local service businesses (beauty, wellness, health) for online appointment booking. The product serves three primary user segments: **Customers** (end users booking services), **Providers** (business owners managing their establishments), and **Admins** (platform operators).

### 1.2 Target Users
| Segment | Description | Primary Goals |
|---------|-------------|---------------|
| **Customers** | End users seeking to book appointments | Discover, compare, and book services effortlessly |
| **Providers** | Business owners and staff | Manage availability, services, and appointments |
| **Admins** | Platform operators | Monitor, moderate, and optimize the marketplace |

### 1.3 Success Metrics
- **Booking Conversion Rate** > 15%
- **Search-to-Book Latency** < 3 minutes
- **Provider Activation** (complete profile + add services) > 70%
- **Customer Retention** (30-day rebooking) > 40%
- **Platform NPS** > 50

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority:** P0 (Critical)  
**Owner:** Alex  
**Story:** As a user, I want to securely create an account and log in so that my personal data and bookings are protected.

#### Acceptance Criteria
- [ ] Users can register with email/password, receiving a verification email
- [ ] Users can register/login via OAuth 2.0 (Google, Apple)
- [ ] Passwords must be hashed (bcrypt) with minimum complexity: 8 chars, 1 uppercase, 1 number, 1 special char
- [ ] JWT access token (15 min expiry) + refresh token (7 days) rotation implemented
- [ ] Users can request password reset via secure email link (expires in 1 hour)
- [ ] Rate limiting: 5 failed attempts triggers 15-minute lockout
- [ ] Role-based access: `CUSTOMER`, `PROVIDER`, `ADMIN`
- [ ] Session invalidation on logout (refresh token blacklisting)
- [ ] Social login accounts can link/unlink email/password

#### Technical Notes
- Use `passport` + `passport-jwt` for NestJS backend
- Store tokens in httpOnly cookies (web) and secure storage (mobile)
- Implement `AuthGuard` with role decorators (`@Roles(Role.PROVIDER)`)

---

### 2.2 Guest Browse & Explore
**Priority:** P0 (Critical)  
**Owner:** Alex  
**Story:** As an unauthenticated visitor, I want to browse businesses and services without creating an account so that I can evaluate the platform before committing.

#### Acceptance Criteria
- [ ] Guest users can view business listings, search, and filter results
- [ ] Guest users can view business detail pages with services, prices, and reviews
- [ ] Guest users can view availability slots (read-only, no booking)
- [ ] Attempting to book triggers a modal prompting login/registration
- [ ] Guest session data (search filters, viewed businesses) persists for 24 hours via localStorage
- [ ] Upon registration, guest session data merges into authenticated account

---

2.3 Business Search & Discovery
Priority: P0 (Critical)
Owner: Alex
Story: As a customer, I want to find relevant businesses quickly so that I can book the service I need.

Acceptance Criteria
- [ ] Full-text search across business name, service name, and description
- [ ] Filters: category, price range, rating (1-5 stars), availability (today, this week), distance
- [ ] Sort options: relevance, rating, price (low-high), distance, most reviewed
- [ ] Auto-complete suggestions with debounce (300ms)
- [ ] Search history saved for authenticated users (last 10 searches)
- [ ] Results pagination: 20 items per page with cursor-based pagination
- [ ] Empty state with suggested categories and popular businesses
- [ ] Search analytics logged for admin dashboard

---

### 2.4 Map-based Search
**Priority:** P0 (Critical)  
**Owner:** Alex  
**Story:** As a customer, I want to see businesses on a map so that I can choose one conveniently located near me.

#### Acceptance Criteria
- [ ] Interactive map (Mapbox/Google Maps) with business markers clustered at zoom levels
- [ ] User geolocation with permission prompt; fallback to IP-based city center
- [ ] Map bounds trigger dynamic search (debounced 500ms)
- [ ] Marker popover shows: business name, rating, starting price, next available slot
- [ ] List/map toggle with synchronized state
- [ ] Radius filter: 1km, 3km, 5km, 10km, 20km
- [ ] Mobile: full-screen map with bottom sheet for results

---

### 2.5 Business Detail View
**Priority:** P0 (Critical)  
**Owner:** Alex  
**Story:** As a customer, I want comprehensive business information so that I can make an informed booking decision.

#### Acceptance Criteria
- [ ] Display: name, photos (up to 10), description, address, phone, website link
- [ ] Operating hours with current day highlighted; closed days clearly marked
- [ ] Service menu with categories, individual service cards (name, duration, price, description)
- [ ] Average rating and total review count prominently displayed
- [ ] Staff/professional list with bios and specialties
- [ ] "Book Now" CTA sticky on mobile, prominent on desktop
- [ ] Share button generates deep link with preview image
- [ ] Report business functionality (inappropriate content)

---

### 2.6 Service Categories
**Priority:** P0 (Critical)  
**Owner:** Alex  
**Story:** As a platform, we need a structured category system so that businesses and services are organized and discoverable.

#### Acceptance Criteria
- [ ] Hierarchical categories: 1 root → N subcategories (e.g., Beauty → Hair → Coloring)
- [ ] Category icons and cover images for visual identification
- [ ] Each business can be assigned 1 primary + up to 3 secondary categories
- [ ] Category pages with featured businesses and SEO-optimized content
- [ ] Admin can undeleteable seed categories; providers can request new categories
- [ ] Category analytics: search volume, booking conversion by category

---

### 2.7 Booking Flow
**Priority:** P0 (Critical)  
**Owner:** Alex  
**Story:** As a customer, I want to book an appointment in as few steps as possible so that I can secure my preferred time slot.

#### Acceptance Criteria
- [ ] Step 1: Select service(s) with multi-selective capability (bundle booking)
- [ ] Step 2: Select staff member or "No preference"
- [ ] Step 3: Date picker with available slots highlighted; time slot grid (15-min increments)
- [ ] Step 4: Review booking summary with cancellation policy
- [ ] Step 5: Payment (if required) or confirm (if free/no-card-required)
- [ ] Booking confirmation screen with calendar invite (.ics) and add-to-calendar options
- [ ] SMS/email confirmation sent within 30 seconds
- [ ] Booking holds slot for 10 minutes during payment; released on timeout/failure
- [ ] Support for guest checkout (collect name, phone, email)

---

### 2.8 Appointment Management
**Priority:** P0 (Critical)  
**Owner:** Alex  
**Story:** As a customer or provider, I want to manage appointments so that schedules remain organized and conflicts are avoided.

#### Acceptance Criteria (Customer)
- [ ] View upcoming and past appointments in list/calendar view
- [ ] Reschedule up to 24 hours before appointment (configurable per business)
- [ ] Cancel with reason selection; cancellation policy enforcement with fees if applicable
- [ ] Receive reminders: 24h, 2h before via push/SMS/email (configurable)
- [ ] Add appointment to personal calendar (Google/Apple/Outlook)

#### Acceptance Criteria (Provider)
- [ ] Calendar view (day/week/month) with color-coded status
- [ ] Create, edit, block, or cancel appointments
- [ ] Mark no-shows and record notes
- [ ] Export appointments to CSV/iCal
- [ ] Bulk actions: confirm, cancel, send message to selected appointments

---

### 2.9 Favorites
**Priority:** P1 (High)  
**Owner:** Alex  
**Story:** As a customer, I want to save favorite businesses so that I can quickly rebook with providers I trust.

#### Acceptance Criteria
- [ ] Heart icon on business cards and detail pages toggles favorite status
- [ ] Favorites page with grid/list view, sorted by recently added
- [ ] Favorite businesses show next available slot badge
- [ ] Push notification when favorite business adds new service or promotion
- [ ] Maximum 200 favorites per user; prompt to clean up when approaching limit
- [ ] Favorites sync across devices within 5 seconds

---

### 2.10 User Profile
**Priority:** P1 (High)  
**Owner:** Alex  
**Story:** As a user, I want to manage my personal information and preferences so that my experience is personalized.

#### Acceptance Criteria
- [ ] Edit: name, phone, email (requires re-verification), profile photo, birthday
- [ ] Notification preferences: push, email, SMS — per event type (bookings, promotions, reminders)
- [ ] Privacy settings: profile visibility, data download, account deletion (GDPR)
- [ ] Payment methods management (add, delete, set default)
- [ ] Booking history with reorder/rebook functionality
- [ ] Loyalty/points balance display (if applicable)

---

### 2.11 Availability & Slot Computation
**Priority:** P0 (Critical)  
**Owner:** Alex  
**Story:** As a platform, we need accurate, real-time availability so that double-bookings never occur.

#### Acceptance Criteria
- [ ] Business defines: operating hours, break times, special hours (holidays)
- [ ] Staff-level availability overrides business defaults
- [ ] Service duration + buffer time (configurable) defines slot occupancy
- [ ] Real-time slot computation accounts for existing bookings and blocks
- [ ] Optimistic locking on slot selection; 10-minute hold during checkout
- [ ] Timezone-aware throughout; all stored in UTC, displayed in local
- [ ] Performance: slot query for 30 days returns in < 200ms
- [ ] Support for recurring availability patterns and exceptions

---

### 2.12 Shared Types & Design System
**Priority:** P0 (Critical)  
**Owner:** Alex  
**Story:** As a development team, we need consistent UI/UX patterns so that the product feels cohesive and development is efficient.

#### Acceptance Criteria
- [ ] Component library: buttons, inputs, cards, modals, date pickers, time grids, loaders
- [ ] Color system: primary, secondary, semantic (success, warning, error, info) with dark mode support
- [ ] Typography scale: 12 levels from display to caption
- [ ] Spacing system: 4px base grid (4, 8, 12, 16, 24, 32, 48, 64)
- [ ] Shared TypeScript types auto-generated from Prisma schema (`prisma-client-js` with extensions)
- [ ] API response standardization: `{ success: boolean, data?: T, error?: { code, message, details } }`
- [ ] Accessibility: WCAG 2.1 AA minimum; keyboard navigation, screen reader labels, focus management
- [ ] Mobile-first responsive breakpoints: 320px, 768px, 1024px, 1440px

---

### 2.13 Reviews & Ratings
**Priority:** P1 (High)  
**Owner:** Alex  
**Story:** As a customer, I want to read and write reviews so that I can make informed decisions and share my experience.

#### Acceptance Criteria
- [ ] 5-star rating + optional text review (10-2000 chars), photo upload (up to 5)
- [ ] Review eligibility: only verified customers who completed the service
- [ ] Review window: 7 days after appointment; reminder sent on day 3
- [ ] Provider can respond to reviews publicly
- [ ] Flag/report review for moderation; admin dashboard for approval/removal
- [ ] Review summary: average rating, rating distribution histogram, recent highlights
- [ ] Sort reviews: most recent, most helpful, highest/lowest rating
- [ ] Reviews impact search ranking (engagement signal)

---

### 2.14 Payment Integration
**Priority:** P0 (Critical)  
**Owner:** Alex  
**Story:** As a customer, I want to pay securely for services so that my booking is confirmed.

#### Acceptance Criteria
- [ ] Stripe integration: card payments, Apple Pay, Google Pay, SEPA (EU)
- [ ] Payment intents: authorize and capture, or immediate charge
- [ ] Support for deposits (partial payment) and full prepayment
- [ ] Save payment methods for future use (Stripe Customer + PaymentMethod)
- [ ] Refund processing: full and partial with reason logging
- [ ] Invoice generation (PDF) with business details and VAT
- [ ] Webhook handling: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.dispute.created`
- [ ] PCI compliance: never store raw card data; use Stripe Elements
- [ ] Currency support: EUR, USD, GBP with automatic conversion display

---

### 2.15 Notifications
**Priority:** P1 (High)  
**Owner:** Alex  
**Story:** As a user, I want timely notifications so that I stay informed about my bookings and platform activity.

#### Acceptance Criteria
- [ ] Channels: push (Firebase Cloud Messaging), email (SendGrid/Postmark), SMS (Twilio)
- [ ] Event types: booking confirmed, reminder, cancelled, rescheduled, review request, promotion
- [ ] User preference controls: channel and frequency per event type
- [ ] Notification inbox in-app with read/unread status and persistent history (90 days)
- [ ] Deep links from push notifications navigate to relevant screen
- [ ] Batch digest emails for non-urgent notifications (daily/weekly option)
- [ ] Delivery tracking: opened, clicked, failed with retry logic

---

### 2.16 Provider / Business Owner Portal
**Priority:** P0 (Critical)  
**Owner:** Alex  
**Story:** As a business owner, I want to manage my presence and appointments so that I can grow my customer base efficiently.

#### Acceptance Criteria
- [ ] Onboarding wizard: business info, location, hours, services, staff, photos
- [ ] Dashboard: upcoming appointments, revenue this week/month, new customers, rating trend
- [ ] Service management: CRUD services with variants (e.g., haircut + beard)
- [ ] Staff management: invite by email, set permissions, manage individual schedules
- [ ] Availability calendar with drag-to-block, recurring patterns, holiday closures
- [ ] Customer database: view history, notes, contact; export to CSV
- [ ] Settings: cancellation policy, booking lead time, buffer between appointments, payment settings
- [ ] Marketing tools: promotion codes, featured listing bids (if marketplace model)

---

### 2.17 Admin Dashboard
**Priority:** P1 (High)  
**Owner:** Alex  
**Story:** As a platform admin, I want oversight and control so that the marketplace operates safely and effectively.

#### Acceptance Criteria
- [ ] User management: search, view, suspend, impersonate, delete accounts
- [ ] Business verification: review submitted documents, approve/reject with feedback
- [ ] Content moderation: flagged reviews, reported businesses, image moderation
- [ ] Analytics: MAU, bookings, GMV, churn, top categories, geographic heatmap
- [ ] Financial overview: transaction volume, fees collected, refunds, payouts to providers
- [ ] System health: API latency, error rates, queue depths, database performance
- [ ] Role-based admin access: `SUPER_ADMIN`, `SUPPORT`, `FINANCE`, `MODERATOR`
- [ ] Audit log: all admin actions with timestamp, actor, before/after state

---

### 2.18 Background Jobs (BullMQ)
**Priority:** P0 (Critical)  
**Owner:** Alex  
**Story:** As a platform, we need reliable background processing so that user-facing performance remains fast and operations are dependable.

#### Acceptance Criteria
- [ ] Job queues: `notifications`, `payments`, `emails`, `reports`, `search-indexing`, `image-processing`
- [ ] Retry policy: 3 attempts with exponential backoff (5s, 25s, 125s)
- [ ] Dead letter queue for failed jobs after max retries; admin alert on DLP growth
- [ ] Scheduled jobs: daily reports, weekly digests, nightly data cleanup
- [ ] Job progress tracking and cancellation capability for long-running tasks
- [ ] Rate limiting on external API calls (Stripe, Twilio, SendGrid)
- [ ] Monitoring: queue depth, processing time, failure rate dashboards (Grafana/Bull Board)
- [ ] Idempotency keys prevent duplicate processing of payment and notification jobs

---

## 3. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | P95 API response < 500ms; page load < 2s (3G) |
| **Scalability** | Support 10,000 concurrent users; horizontal pod autoscaling |
| **Security** | OWASP Top 10 mitigation; dependency scanning; secrets management |
| **Compliance** | GDPR, CCPA, PCI-DSS (Level 1 service provider via Stripe) |
| **Reliability** | 99.9% uptime SLA; automated backups (point-in-time recovery) |
| **Monitoring** | Structured logging (Pino); distributed tracing (OpenTelemetry); alerting (PagerDuty) |

---

## 4. Release Phases

| Phase | Features | Target |
|-------|----------|--------|
| **MVP** | Auth, Guest Browse, Search, Business Detail, Booking Flow, Appointment Mgmt, Provider Portal, Payments, Background Jobs | Q1 2024 |
| **V1.1** | Map Search, Favorites, Reviews, Notifications | Q2 202RU 2024 |
| **V1.2** | Admin Dashboard, Analytics, Marketing Tools | Q3 2024 |
| **V2.0** | Mobile Apps (iOS/Android), AI Recommendations, Loyalty Program | Q4 2024 |

---

## 5. Open Questions & Risks

1. **Geographic Scope:** Initial launch market (France vs. multi-country) affects payment methods and compliance requirements.
2. **Commission Model:** Percentage fee vs. subscription for providers — impacts payment flow and provider onboarding.
3. **Third-Party Integrations:** Calendar sync (Google/Outlook) scope for MVP vs. later phase.
4. **Risk:** Provider adoption rate; mitigation: zero onboarding friction, dedicated success team.

---

*End of Product Specification*
