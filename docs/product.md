# Planity Clone — Product Specification

## 1. Overview

### 1.1 Product Vision
Build a comprehensive beauty and wellness booking platform that connects customers with local businesses (salons, barbershops, spas, clinics). The platform serves three primary user groups: **Customers** (booking appointments), **Business Owners** (managing their presence and appointments), and **Platform Admins** (overseeing operations).

### 1.2 Target Users
- **Customers**: Individuals seeking beauty/wellness services, ages 18-55, mobile-first
- **Business Owners**: Salon/spa/clinic managers and independent professionals
- **Platform Admins**: Internal operations team

### 1.3 Success Metrics
- Booking conversion rate > 15%
- Search-to-book time < 3 minutes
- Business owner onboarding completion > 70%
- Customer retention (30-day) > 40%

---

## 2. Feature Specifications

### 2.1 User Authentication

**Priority:** P0 (Critical)

**Description:** Secure identity management for all user types with role-based access control.

**User Stories:**
- As a customer, I want to register with email/password or social login so I can book appointments
- As a business owner, I want to register my business account so I can manage my services
- As a user, I want to reset my password so I can regain access to my account
- As a user, I want to stay logged in with refresh tokens so I don't have to log in repeatedly

**Acceptance Criteria:**
- [ ] Users can register with email, password, first name, last name, phone number
- [ ] Password minimum requirements: 8 chars, 1 uppercase, 1 lowercase, 1 number
- [ ] Email verification required before account activation
- [ ] Social login supported: Google, Apple, Facebook
- [ ] JWT access tokens expire in 15 minutes; refresh tokens expire in 7 days
- [ ] Role-based access: `CUSTOMER`, `BUSINESS_OWNER`, `ADMIN`
- [ ] Password reset flow via email with 1-hour expiry token
- [ ] Rate limiting: 5 login attempts per 15 minutes per IP
- [ ] Account lockout after 5 failed attempts (30-minute lockout)

**API Endpoints:**
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/verify-email`
- `GET /auth/me`

---

### 2.2 Guest Browse & Explore

**Priority:** P0 (Critical)

**Description:** Allow unauthenticated users to browse businesses and services without registration friction.

**User Stories:**
- As a guest, I want to browse businesses without creating an account
- As a guest, I want to view business details and services
- As a guest, I want to be prompted to register when attempting to book

**Acceptance Criteria:**
- [ ] Guest users can access search, discovery, and business detail views
- [ ] Guest session tracked via anonymous ID for analytics
- [ ] Booking action triggers authentication modal with pre-filled context
- [ ] Post-authentication, guest is redirected back to their intended action
- [ ] Guest favorites stored in localStorage; merged on registration
- [ ] No personal data collection from guests beyond analytics (anonymized)

---

### 2.3 Business Search & Discovery

**Priority:** P0 (Critical)

**Description:** Intelligent search and discovery to help customers find the right business.

**User Stories:**
- As a customer, I want to search by business name, service, or location
- As a customer, I want to filter results by rating, price, availability, and distance
- As a customer, I want to see trending and recommended businesses

**Acceptance Criteria:**
- [ ] Full-text search across business name, service names, and descriptions
- [ ] Autocomplete suggestions with debounce (300ms)
- [ ] Search history stored for authenticated users (last 10 searches)
- [ ] Filters: distance (1-50km), rating (1-5 stars), price range, category, availability (today, this week)
- [ ] Sort options: relevance, rating, distance, price (low to high)
- [ ] Pagination: 20 results per page with cursor-based pagination
- [ ] "Near me" geolocation with permission prompt
- [ ] Empty state with suggestions when no results found
- [ ] Search analytics logged for business insights

**Search Response Time:** < 200ms for cached results, < 500ms for uncached

---

### 2.4 Map-based Search

**Priority:** P0 (Critical)

**Description:** Visual map interface for geographic discovery of businesses.

**User Stories:**
- As a customer, I want to see businesses on a map to find convenient locations
- As a customer, I want to explore an area by panning and zooming the map
- As a customer, I want to see business clusters when zoomed out

**Acceptance Criteria:**
- [ ] Interactive map with custom business markers
- [ ] Marker clustering for dense areas (zoom-dependent)
- [ ] Business cards appear on marker click with key info
- [ ] Map bounds trigger new search query (debounced 500ms)
- [ ] User location dot with accuracy circle
- [ ] "List view" toggle alongside map view
- [ ] Map style matches app design system
- [ ] Fallback to default location if geolocation denied
- [ ] Mobile: bottom sheet for business details, full-screen map

**Map Provider:** Mapbox or Google Maps (configurable)

---

### 2.5 Business Detail View

**Priority:** P0 (Critical)

**Description:** Comprehensive business profile page with all information needed to make a booking decision.

**User Stories:**
- As a customer, I want to see business photos, description, and contact info
- As a customer, I want to view the service menu with prices and durations
- As a customer, I want to see available time slots for booking
- As a customer, I want to read reviews from other customers

**Acceptance Criteria:**
- [ ] Hero image gallery with up to 10 photos, swipeable on mobile
- [ ] Business info: name, address, phone, website, hours, description
- [ ] Service menu with name, description, duration, price, and category
- [ ] Real-time availability calendar showing next 7 days
- [ ] Reviews section with rating breakdown (1-5 stars)
- [ ] "Book Now" CTA prominently displayed
- [ ] Share functionality (deep link)
- [ ] Report business option for inappropriate content
- [ ] Similar businesses carousel at bottom

---

### 2.6 Service Categories

**Priority:** P0 (Critical)

**Description:** Hierarchical categorization system for organizing services and discovery.

**User Stories:**
- As a customer, I want to browse by category (hair, nails, spa, etc.)
- As a business owner, I want to categorize my services for better discovery
- As an admin, I want to manage the category taxonomy

**Acceptance Criteria:**
- [ ] Two-level hierarchy: Category > Subcategory
- [ ] Primary categories: Hair, Nails, Face, Body, Massage, Wellness, Medical Aesthetic, Barber
- [ ] Each category has icon, name, and description
- [ ] Services can belong to multiple categories (many-to-many)
- [ ] Category pages show featured businesses and popular services
- [ ] SEO-friendly URLs: `/categories/hair` and `/categories/hair/coloring`
- [ ] Category management in admin dashboard (CRUD)
- [ ] Category popularity analytics

---

### 2.7 Booking Flow

**Priority:** P0 (Critical)

**Description:** Seamless, multi-step booking experience from service selection to confirmation.

**User Stories:**
- As a customer, I want to select a service, date, and time for my appointment
- As a customer, I want to choose a specific staff member or accept any available
- As a customer, I want to add special requests or notes to my booking
- As a customer, I want to receive immediate confirmation of my booking

**Acceptance Criteria:**
- [ ] Step 1: Select service(s) with multi-select support for packages
- [ ] Step 2: Select staff member (optional, "Any" default) with staff profiles
- [ ] Step 3: Select widow shopping — calendar view with available slots highlighted
- [ ] Step 4: Select time slot (15/30/60 min increments based on service)
- [ ] Step 5: Review booking details, add notes, apply promo code
- [ ] Step 6: Payment (if required) or confirm (if pay-at-venue)
- [ ] Booking confirmation screen with calendar invite (.ics) and add-to-calendar options
- [ ] Booking held for 10 minutes during payment; released if payment fails
- [ ] Support for guest checkout with email/phone collection
- [ ] Booking modification allowed up to 2 hours before appointment

**Booking States:** `PENDING` → `CONFIRMED` → `COMPLETED` | `CANCELLED` | `NO_SHOW`

---

### 2.8 Appointment Management

**Priority:** P0 (Critical)

**Description:** Full lifecycle management of appointments for customers and business owners.

**User Stories:**
- As a customer, I want to view all my upcoming and past appointments
- As a customer, I want to reschedule or cancel my appointment
- As a business owner, I want to see my daily/weekly appointment schedule
- As a business owner, I want to block time slots or mark unavailability

**Acceptance Criteria:**
- [ ] Customer appointment list: upcoming first, then past (grouped by month)
- [ ] Appointment detail view with all info and actions
- [ ] Reschedule: select new slot based on current availability
- [ ] Cancel with reason selection; cancellation policy displayed
- [ ] Business owner calendar view: day, week, month views
- [ ] Business owner can: confirm, decline, mark complete, mark no-show
- [ ] Business owner can add manual bookings (walk-ins, phone bookings)
- [ ] Business owner can set recurring unavailability (lunch breaks, vacations)
- [ ] Conflict prevention: double-booking not allowed at slot level
- [ ] Cancellation policy enforcement (free until X hours before)

---

### 2.9 Favorites

**Priority:** P1 (High)

**Description:** Allow customers to save and quickly access preferred businesses.

**User Stories:**
- As a customer, I want to save businesses to my favorites
- As a customer, I want to receive notifications about my favorite businesses' offers
- As a customer, I want to see my favorites organized for quick rebooking

**Acceptance Criteria:**
- [ ] Heart icon toggle on business cards and detail pages
- [ ] Favorites list accessible from profile
- [ ] Favorites synced across devices for authenticated users
- [ ] Guest favorites stored locally, prompt to merge on login
- [ ] Push notification option for favorite business updates (new services, promotions)
- [ ] Quick rebooking from favorites (one-tap to previous service)
- [ ] Maximum 200 favorites per user

---

### 2.10 User Profile

**Priority:** P1 (High)

**Description:** Customer profile management with preferences and history.

**User Stories:**
- As a customer, I want to manage my personal information
- As a customer, I want to view my booking history and spending
- As a customer, I want to manage my notification preferences
- As a customer, I want to add and manage payment methods

**Acceptance Criteria:**
- [ ] Profile fields: photo, first name, last name, email, phone, birthday (optional, for birthday offers)
- [ ] Booking history with filtering (upcoming, completed, cancelled)
- [ ] Spending summary (total bookings, favorite categories)
- [ ] Notification preferences: email, SMS, push (granular per type)
- [ ] Saved payment methods (Stripe PaymentMethod integration)
- [ ] Default booking preferences: reminder time, preferred staff
- [ ] Data export (GDPR compliance)
- [ ] Account deletion with 30-day grace period

---

### 2.11 Availability & Slot Computation

**Priority:** P0 (Critical)

**Description:** Core scheduling engine that computes available time slots considering all constraints.

**User Stories:**
- As a business owner, I want to define my working hours and breaks
- As a business owner, I want to set different availability per staff member
- As a customer, I want to see only truly available slots

**Acceptance Criteria:**
- [ ] Business-level default working hours (per day of week)
- [ ] Staff-level override of working hours
- [ ] Break and lunch slot blocking
- [ ] Service duration and buffer time (prep/cleanup) configuration
- [ ] Slot computation considers: staff availability, existing bookings, breaks, service duration
- [ ] Support for concurrent bookings (multiple chairs/rooms)
- [ ] Real-time slot availability (no stale data > 30 seconds)
- [ ] Timezone-aware scheduling (business timezone primary, customer timezone display)
- [ ] Slot generation API: `GET /availability?businessId=&staffId=&serviceIds=&dateFrom=&dateTo=`
- [ ] Cache invalidation on booking changes

**Algorithm Requirements:**
- Generate slots in configurable increments (default 15 min)
- Respect staff-specific service assignments
- Handle multi-service bookings (sequential slot allocation)
- Block slots for pending bookings (10-minute hold)

---

### 2.12 Shared Types & Design System

**Priority:** P0 (Critical)

**Description:** Consistent design language and reusable components across all platforms.

**User Stories:**
- As a developer, I want documented design tokens and components
- As a user, I want a consistent experience across web and mobile

**Acceptance Criteria:**
- [ ] Design tokens: colors, typography, spacing, shadows, border-radius
- [ ] Color palette: primary (brand), secondary, semantic (success, warning, error, info), neutrals
- [ ] Typography scale: 12 sizes from caption to display
- [ ] Spacing scale: 4px base unit (4, 8, 12, 16, 24, 32, 48, 64)
- [ ] Component library: buttons, inputs, cards, modals, toasts, loaders, empty states
- [ ] Dark mode support with automatic/system/manual toggle
- [ ] Accessibility: WCAG 2.1 AA minimum (contrast, focus states, screen reader labels)
- [ ] Animation standards: 200ms default transitions, easing curves
- [ ] Icon set: consistent style, 24px default, 20px compact
- [ ] Shared TypeScript types across frontend and backend (monorepo)

---

### 2.13 Reviews & Ratings

**Priority:** P1 (High)

**Description:** Customer feedback system for businesses and services.

**User Stories:**
- As a customer, I want to leave a review after my appointment
- As a customer, I want to see honest reviews from verified customers
- As a business owner, I want to respond to reviews

**Acceptance Criteria:**
- [ ] Review eligibility: completed appointment, within 30 days of service
- [ ] Rating: 1-5 stars with half-star support
- [ ] Review components: rating, title (optional), body, photos (up to 5), service tagged
- [ ] Verified badge for customers who completed the booked service
- [ ] Business owner response with notification to reviewer
- [ ] Review moderation: auto-flag for profanity, manual admin review queue
- [ ] Review helpfulness voting (thumbs up/down)
- [ ] Average rating recalculated in real-time
- [ ] Reviews sortable: most recent, most helpful, highest/lowest rating
- [ ] Report review option for inappropriate content

---

### 2.14 Payment Integration

**Priority:** P0 (Critical)

**Description:** Secure payment processing for bookings with multiple methods and flows.

**User Stories:**
- As a customer, I want to pay securely with my credit card
- As a customer, I want to save my card for faster checkout
- As a business owner, I want to receive payouts for my services
- As a customer, I want to pay at the venue instead of online

**Acceptance Criteria:**
- [ ] Payment provider: Stripe (primary)
- [ ] Payment methods: credit/debit cards, Apple Pay, Google Pay
- [ ] Payment flows: pay in full, deposit (partial), pay at venue
- [ ] Saved payment methods with Stripe PaymentMethod API
- [ ] 3D Secure support for card authentication
- [ ] Refund processing: full and partial refunds
- [ ] Payout to business owners (Stripe Connect: Express/Custom accounts)
- [ ] Platform fee deduction (configurable percentage)
- [ ] Payment receipt emailed to customer
- [ ] Failed payment handling: retry logic, customer notification
- [ ] PCI compliance: no raw card data stored, use Stripe Elements

**Payment States:** `PENDING` → `REQUIRES_ACTION` → `SUCCEEDED` | `FAILED` | `REFUNDED` | `PARTIALLY_REFUNDED`

---

### 2.15 Notifications

**Priority:** P1 (High)

**Description:** Multi-channel notification system for timely user communication.

**User Stories:**
- As a customer, I want to receive booking confirmations and reminders
- As a business owner, I want to be notified of new bookings
- As a user, I want to control which notifications I receive

**Acceptance Criteria:**
- [ ] Channels: push (mobile), email, SMS
- [ ] Notification types:
  - Booking: confirmation, reminder (24h, 2h before), modification, cancellation
  - Marketing: promotions, new services, re-engagement
  - System: password reset, verification, security alerts
- [ ] User preference management per channel and type
- [ ] Rich push with deep links to relevant screens
- [ ] Notification inbox in-app for history
- [ ] Delivery tracking and retry logic for failed sends
- [ ] Template management in admin dashboard
- [ ] Rate limiting to prevent notification fatigue
- [ ] Unsubscribe handling for email/SMS (compliance)

---

### 2.16 Provider / Business Owner Portal

**Priority:** P0 (Critical)

**Description:** Dedicated interface for business owners to manage their presence, services, and operations.

**User Stories:**
- As a business owner, I want to set up and customize my business profile
- As a business owner, I want to manage my services, staff, and pricing
- As a business owner, I want to view my appointment calendar and customer list
- As a business owner, I want to see business analytics and revenue reports

**Acceptance Criteria:**
- [ ] Business profile: logo, photos (up to 10), description, contact, hours, social links
- [ ] Service management: CRUD with name, description, duration, price, category, staff assignment
- [ ] Staff management: profiles, services they perform, working hours, time-off
- [ ] Appointment calendar with day/week/month views
- [ ] Customer database with visit history and notes
- [ ] Revenue dashboard: daily, weekly, monthly, yearly views
- [ ] Booking analytics: conversion rate, cancellation rate, no-show rate
- [ ] Review management: view and respond to customer reviews
- [ ] Settings: notification preferences, payment settings, cancellation policy
- [ ] Multi-location support for business chains

---

### 2.17 Admin Dashboard

**Priority:** P1 (High)

**Description:** Platform administration interface for operational oversight and management.

**User Stories:**
- As an admin, I want to manage businesses and their onboarding status
- As an admin, I want to view platform-wide analytics and KPIs
- As an admin, I want to handle user disputes and content moderation
- As an admin, I want to manage categories, promotions, and platform settings

**Acceptance Criteria:**
- [ ] User management: search, view, suspend, impersonate (with audit log)
- [ ] Business management: approve, reject, feature, suspend
- [ ] Content moderation: review reports, remove inappropriate content
- [ ] Analytics dashboard: MAU, bookings, revenue, churn, top businesses/categories
- [ ] Financial overview: platform fees, payouts, refunds
- [ ] Category management: create, edit, reorder, deactivate
- [ ] Promo code management: create, edit, deactivate, usage tracking
- [ ] System settings: platform fee %, feature flags, maintenance mode
- [ ] Audit log: all admin actions with timestamp and admin identity
- [ ] Export functionality for all data tables (CSV, Excel)

---

### 2.18 Background Jobs (BullMQ)

**Priority:** P1 (High)

**Description:** Reliable asynchronous job processing for non-blocking operations.

**User Stories:**
- As a developer, I want to offload heavy operations to background jobs
- As a user, I want my experience to be fast even when complex operations happen
- As a system, I want to retry failed jobs automatically

**Acceptance Criteria:**
- [ ] Job queue infrastructure with BullMQ + Redis
- [ ] Job types and use cases:
  - **Email sending**: booking confirmations, reminders, marketing (bulk)
  - **Push notifications**: scheduled and triggered
  - **SMS sending**: via Twilio or similar provider
  - **Image processing**: resize, optimize uploaded business photos
  - **Search index updates**: reindex on business/service changes
  - **Analytics aggregation**: daily/weekly rollup computations
  - **Payment webhooks**: idempotent processing of Stripe events
  - **Data exports**: large CSV/Excel generation
  - **Cleanup jobs**: expired token deletion, old log archival
- [ ] Job retry policy: 3 attempts with exponential backoff (delay: 5s, 25s, 125s)
- [ ] Dead letter queue for permanently failed jobs
- [ ] Job monitoring dashboard (Bull Board or custom UI)
- [ ] Job prioritization: critical, high, normal, low
- [ ] Concurrency control per queue type
- [ ] Scheduled jobs (cron) for recurring tasks

---

## 3. Non-Functional Requirements

### 3.1 Performance
- Page load time < 2s (Lighthouse performance score > 80)
- API response time: p95 < 500ms, p99 < 1s
- Image optimization: WebP, responsive sizes, lazy loading
- CDN for static assets

### 3.2 Security
- HTTPS everywhere
- OWASP Top 10 mitigation
- Rate limiting on all public endpoints
- Input validation and sanitization
- SQL injection prevention (Prisma ORM parameterized queries)
- XSS protection (Content Security Policy)
- CORS properly configured

### 3.3 Scalability
- Stateless API design for horizontal scaling
- Database connection pooling
- Redis for caching and sessions
- Read replicas for read-heavy workloads

### 3.4 Compliance
- GDPR: data portability, right to erasure, consent management
- PCI DSS: Level 1 via Stripe (no card data storage)
- Accessibility: WCAG 2.1 AA

---

## 4. Prioritization Matrix

| Feature | Priority | Sprint Target | Dependencies |
|---------|----------|---------------|--------------|
| User Authentication | P0 | Sprint 1 | - |
| Guest Browse & Explore | P0 | Sprint 1 | - |
| Business Search & Discovery | P0 | Sprint 1 | - |
| Map-based Search | P0 | Sprint 2 | Search |
| Business Detail View | P0 | Sprint 2 | - |
| Service Categories | P0 | Sprint 2 | - |
| Booking Flow | P0 | Sprint 3 | Auth, Availability |
| Appointment Management | P0 | Sprint 3 | Booking |
| Availability & Slot Computation | P0 | Sprint 3 | - |
| Payment Integration | P0 | Sprint 4 | Booking |
| Provider / Business Owner Portal | P0 | Sprint 4-5 | Auth, Booking |
| User Profile | P1 | Sprint 5 | Auth |
| Favorites | P1 | Sprint 5 | Auth, Business |
| Reviews & Ratings | P1 | Sprint 6 | Booking, Profile |
| Notifications | P1 | Sprint 6 | Booking, Background Jobs |
| Admin Dashboard | P1 | Sprint 7 | All above |
| Background Jobs (BullMQ) | P1 | Sprint 3-4 | Redis |
| Shared Types & Design System | P0 | Ongoing | - |

---

## 5. Definition of Done

- [ ] Feature implemented according to acceptance criteria
- [ ] Unit tests > 80% coverage
- [ ] Integration tests for API endpoints
- [ ] Frontend component tests (Storybook + testing-library)
- [ ] Design review passed
- [ ] Accessibility audit passed
- [ ] Performance budget met
- [ ] Security review passed
- [ ] Documentation updated
- [ ] Deployed to staging and QA verified

---

## 6. Appendix

### 6.1 Glossary
- **Slot**: A specific time period available for booking
- **Buffer time**: Extra time before/after service for preparation
- **Hold**: Temporary reservation of a slot during checkout
- **Payout**: Transfer of funds to business owner

### 6.2 Revision History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-01-15 | Alex (PO) | Initial specification |
