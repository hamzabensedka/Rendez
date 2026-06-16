# Planity Clone — Product Specification

## 1. Overview

**Product Name:** Planity Clone  
**Platform:** Mobile-first (iOS & Android) + Web  
**Target Users:** Consumers booking beauty & wellness appointments; Business owners managing their salons; Platform administrators  
**MVP Goal:** Enable end-to-end appointment booking for beauty/wellness services with business discovery, real-time availability, and payment processing.

---

## 2. Personas

| ID | Persona | Goals | Pain Points |
|---|---|---|---|
| P1 | **Consumer (Marie)** | Find nearby salons, book appointments quickly, manage her schedule | Can't easily compare availability across multiple businesses |
| P2 | **Business Owner (Karim)** | Manage bookings, showcase services, grow clientele | Overbookings, no-shows, manual scheduling overhead |
| P3 | **Admin (Sophie)** | Monitor platform health, support users, ensure quality | Needs visibility into disputes, refunds, and business compliance |

---

## 3. Feature Specifications

### 3.1 User Authentication

| Attribute | Detail |
|---|---|
| **Priority** | P0 — Critical |
| **Description** | Secure user registration, login, and session management for consumers and business owners. |
| **Actors** | Consumer, Business Owner |

#### Acceptance Criteria
- [ ] AC-1.1: User can register with email/password, receiving verification email
- [ ] AC-1.2: User can login with email/password or OAuth (Google, Apple)
- [ ] AC-1.3: User can reset password via email flow
- [ ] AC-1.4: JWT tokens are issued with 15min access / 7-day refresh lifecycle
- [ ] AC-1.5: Biometric login (Face ID / Touch ID / Fingerprint) available on mobile
- [ ] AC-1.6: Business owner accounts require phone verification + business validation
- [ ] AC-1.7: Rate limiting: 5 failed attempts triggers 30-min lockout
- [ ] AC-1.8: Session invalidation on logout from all devices option

---

### 3.2 Guest Browse & Explore

| Attribute | Detail |
|---|---|
| **Priority** | P0 — Critical |
| **Description** | Allow unauthenticated users to browse businesses and services without booking. |
| **Actors** | Guest (unauthenticated) |

#### Acceptance Criteria
- [ ] AC-2.1: Guest can view business listings without account
- [ ] AC-2.2: Guest can search by category, location, and service type
- [ ] AC-2.3: Guest can view business details, photos, and reviews
- [ ] AC-2.4: Guest is prompted to sign up when attempting to book
- [ ] AC-2.5: Guest search history stored in localStorage for 7 days
- [ ] AC-2.6: Guest can share business profile via deep link

---

### 3.3 Business Search & Discovery

| Attribute | Detail |
|---|---|
| **Priority** | P0 — Critical |
| **Description** | Powerful search and filtering to help users discover relevant businesses. |
| **Actors** | Consumer, Guest |

#### Acceptance Criteria
- [ ] AC-3.1: Full-text search across business name, service name, and description
- [ ] AC-3.2: Filters: distance (1-50km), price range, rating (1-5 stars), availability today
- [ ] AC-3.3: Sort options: relevance, distance, rating, price (low-high)
- [ ] AC-3.4: Auto-complete suggestions with recent searches
- [ ] AC-3.5: Search results return within <500ms for cached queries
- [ ] AC-3.6: Pagination with 20 results per page, infinite scroll on mobile
- [ ] AC-3.7: "Near Me" uses GPS with fallback to IP geolocation
- [ ] AC-3.8: Search history saved for authenticated users (last 20 searches)

---

### 3.4 Map-based Search

| Attribute | Detail |
|---|---|
| **Priority** | P0 — Critical |
| **Description** | Visual map interface showing business locations with interactive pins. |
| **Actors** | Consumer, Guest |

#### Acceptance Criteria
- [ ] AC-4.1: Map displays business pins within viewport bounds
- [ ] AC-4.2: Pin clustering for dense areas (zoom-dependent)
- [ ] AC-4.3: Tap pin opens business preview card with photo, name, rating, next availability
- [ ] AC-4.4: User location dot with accuracy radius
- [ ] AC-4.5: Map bounds trigger new search query (debounced 300ms)
- [ ] AC-4.6: List/map toggle with synchronized state
- [ ] AC-4.7: Directions button opens native maps app (Google/Apple Maps)
- [ ] AC-4.8: Default zoom shows businesses within 5km radius

---

### 3.5 Business Detail View

| Attribute | Detail |
|---|---|
| **Priority** | P0 — Critical |
| **Description** | Comprehensive business profile with services, availability, and social proof. |
| **Actors** | Consumer, Guest |

#### Acceptance Criteria
- [ ] AC-5.1: Hero image carousel (up to 10 images), video support
- [ ] AC-5.2: Business info: name, address, phone, website, hours, description
- [ ] AC-5.3: Service menu with pricing, duration, and description per service
- [ ] AC-5.4: Real-time next availability displayed per service
- [ ] AC-5.5: Reviews section with average rating, total count, filter by rating
- [ ] AC-5.6: Staff/professional profiles with photos and specialties
- [ ] AC-5.7: "Book Now" CTA prominent, disabled if no availability
- [ ] AC-5.8: Share button generates deep link with preview metadata
- [ ] AC-5.9: Report business option for inappropriate content

---

### 3.6 Service Categories

| Attribute | Detail |
|---|---|
| **Priority** | P1 — High |
| **Description** | Hierarchical categorization of beauty/wellness services for discovery and filtering. |
| **Actors** | Consumer, Business Owner, Admin |

#### Acceptance Criteria
- [ ] AC-6.1: Top-level categories: Hair, Nails, Face, Body, Massage, Wellness, Medical Aesthetic
- [ ] AC-6.2: Sub-categories up to 3 levels deep (e.g., Hair > Coloring > Balayage)
- [ ] AC-6.3: Category icons and color coding in UI
- [ ] AC-6.4: Business can assign multiple categories to their profile
- [ ] AC-6.5: Admin can CRUD categories with icon upload
- [ ] AC-6.6: Category trending indicator based on booking volume
- [ ] AC-6.7: Category-based promotional banners on home screen

---

### 3.7 Booking Flow

| Attribute | Detail |
|---|---|
| **Priority** | P0 — Critical |
| **Description** | Seamless multi-step booking with real-time availability and confirmation. |
| **Actors** | Consumer |

#### Acceptance Criteria
- [ ] AC-7.1: Step 1: Select service(s) with optional add-ons
- [ ] AC-7.2: Step 2: Select staff member (or "No preference")
- [ ] AC-7.3: Step 3: Date/time picker with available slots (15-min granularity)
- [ ] AC-7.4: Slot availability computed in real-time considering staff schedules, existing bookings, and buffer time
- [ ] AC-7.5: Step 4: Review booking summary with total price, duration, cancellation policy
- [ ] AC-7.6: Step 5: Payment (if required) or confirm (if free/pay-at-venue)
- [ ] AC-7.7: Booking confirmation with calendar invite (.ics) and QR code
- [ ] AC-7.8: 10-minute hold on slot during checkout; auto-release on timeout/abandon
- [ ] AC-7.9: Support for group bookings (multiple services, same time slot)
- [ ] AC-7.10: Guest checkout option with email-only (no account required)

---

### 3.8 Appointment Management

| Attribute | Detail |
|---|---|
| **Priority** | P0 — Critical |
| **Description** | Users and business owners can view, modify, and cancel appointments. |
| **Actors** | Consumer, Business Owner |

#### Acceptance Criteria
- [ ] AC-8.1: Consumer sees upcoming and past appointments in chronological list
- [ ] AC-8.2: Appointment detail: service, staff, time, location, price, status, QR code
- [ ] AC-8.3: Consumer can reschedule up to 24h before (policy-configurable per business)
- [ ] AC-8.4: Consumer can cancel with refund logic based on cancellation policy
- [ ] AC-8.5: Business owner sees all appointments in day/week/month calendar views
- [ ] AC-8.6: Business owner can mark no-show, check-in, or complete status
- [ ] AC-8.7: Business owner can block time slots (breaks, vacation)
- [ ] AC-8.8: Push/email reminders: 24h, 2h, and 15min before appointment
- [ ] AC-8.9: Recurring appointment support (weekly/bi-weekly)

---

### 3.9 Favorites

| Attribute | Detail |
|---|---|
| **Priority** | P1 — High |
| **Description** | Users can save and quickly access preferred businesses. |
| **Actors** | Consumer |

#### Acceptance Criteria
- [ ] AC-9.1: Heart icon on business card and detail to toggle favorite
- [ ] AC-9.2: Favorites list accessible from profile tab
- [ ] AC-9.3: Favorites sync across devices for authenticated users
- [ ] AC-9.4: Push notification when favorite business adds new availability or promotion
- [ ] AC-9.5: Maximum 500 favorites per user
- [ ] AC-9.6: Quick re-book from favorites (pre-filled business/service)

---

### 3.10 User Profile

| Attribute | Detail |
|---|---|
| **Priority** | P1 — High |
| **Description** | Personal profile management with preferences and history. |
| **Actors** | Consumer, Business Owner |

#### Acceptance Criteria
- [ ] AC-10.1: Profile photo, name, phone, email, birthday (optional for birthday promos)
- [ ] AC-10.2: Notification preferences: push, email, SMS (granular per event type)
- [ ] AC-10.3: Saved payment methods (Stripe tokens)
- [ ] AC-10.4: Booking history with re-book shortcut
- [ ] AC-10.5: Preferred language and timezone
- [ ] AC-10.6: Data export (GDPR) and account deletion
- [ ] AC-10.7: Referral code and credits tracking

---

### 3.11 Availability & Slot Computation

| Attribute | Detail |
|---|---|
| **Priority** | P0 — Critical |
| **Description** | Core engine for calculating real-time available appointment slots. |
| **Actors** | System (background service) |

#### Acceptance Criteria
- [ ] AC-11.1: Input: staff working hours, service duration, existing bookings, buffer time, breaks
- [ ] AC-11.2: Output: available slots in 15-min increments for next 60 days
- [ ] AC-11.3: Slot computation completes in <200ms for single staff member
- [ ] AC-11.4: Handles concurrent booking requests with optimistic locking
- [ ] AC-11.5: Supports variable service durations and multi-service chains
- [ ] AC-11.6: Respects business timezone for slot display
- [ ] AC-11.7: Cache computed slots with 30-second TTL; invalidate on booking mutation
- [ ] AC-11.8: Bulk pre-computation via BullMQ for popular businesses every 5 minutes

---

### 3.12 Shared Types & Design System

| Attribute | Detail |
|---|---|
| **Priority** | P1 — High |
| **Description** | Consistent UI/UX patterns and TypeScript types across platforms. |
| **Actors** | Designers, Developers |

#### Acceptance Criteria
- [ ] AC-12.1: Design tokens: colors, typography, spacing, shadows in JSON format
- [ ] AC-12.2: Component library: buttons, inputs, cards, modals, date picker, time slots
- [ ] AC-12.3: Shared TypeScript types package (monorepo) for API contracts
- [ ] AC-12.4: Accessibility: WCAG 2.1 AA compliance, screen reader support
- [ ] AC-12.5: Dark mode support with system preference detection
- [ ] AC-12.6: RTL language support (Arabic, Hebrew)
- [ ] AC-12.7: Storybook documentation for all components

---

### 3.13 Reviews & Ratings

| Attribute | Detail |
|---|---|
| **Priority** | P1 — High |
| **Description** | Post-appointment feedback system for quality assurance and discovery. |
| **Actors** | Consumer, Business Owner, Admin |

#### Acceptance Criteria
- [ ] AC-13.1: Review prompt sent 2 hours after appointment completion
- [ ] AC-13.2: 1-5 star rating with optional text review (max 1000 chars)
- [ ] AC-13.3: Photo upload allowed (max 5 images)
- [ ] AC-13.4: Verified badge for customers who completed the booking
- [ ] AC-13.5: Business owner can respond publicly to reviews
- [ ] AC-13.6: Admin can moderate and remove inappropriate reviews
- [ ] AC-13.7: Review helpfulness voting (thumbs up/down)
- [ ] AC-13.8: Aggregate rating recalculated in real-time; cached for performance

---

### 3.14 Payment Integration

| Attribute | Detail |
|---|---|
| **Priority** | P0 — Critical |
| **Description** | Secure payment processing for bookings with multiple methods and refund support. |
| **Actors** | Consumer, Business Owner, System |

#### Acceptance Criteria
- [ ] AC-14.1: Stripe integration for card payments (Visa, Mastercard, Amex)
- [ ] AC-14.2: Apple Pay / Google Pay support on mobile
- [ ] AC-14.3: Payment intent created at booking initiation, confirmed on completion
- [ ] AC-14.4: Full refund, partial refund, and no-refund policies per business
- [ ] AC-14.5: Platform fee (configurable %) deducted before payout to business
- [ ] AC-14.6: Business owner sees payout schedule and transaction history
- [ ] AC-14.7: PCI compliance via Stripe Elements (no raw card data touch)
- [ ] AC-14.8: Failed payment retry with saved payment method
- [ ] AC-14.9: Invoice generation and email delivery

---

### 3.15 Notifications

| Attribute | Detail |
|---|---|
| **Priority** | P1 — High |
| **Description** | Multi-channel notification system for user engagement and operational alerts. |
| **Actors** | Consumer, Business Owner, Admin |

#### Acceptance Criteria
- [ ] AC-15.1: Push notifications via Firebase Cloud Messaging (iOS/Android)
- [ ] AC-15.2: Email notifications via SendGrid (transactional)
- [ ] AC-15.3: SMS notifications via Twilio (critical alerts only)
- [ ] AC-15.4: Notification types: booking confirmed, reminder, cancelled, rescheduled, promotional, review request
- [ ] AC-15.5: User preference controls per channel and type
- [ ] AC-15.6: Notification inbox in-app with read/unread status
- [ ] AC-15.7: Delivery tracking and retry logic for failed sends
- [ ] AC-15.8: Rate limiting: max 3 promotional push notifications per day

---

### 3.16 Provider / Business Owner Portal

| Attribute | Detail |
|---|---|
| **Priority** | P0 — Critical |
| **Description** | Web-based dashboard for business owners to manage their presence and operations. |
| **Actors** | Business Owner |

#### Acceptance Criteria
- [ ] AC-16.1: Dashboard with KPIs: today's bookings, revenue, occupancy rate, new reviews
- [ ] AC-16.2: Business profile editor: photos, description, hours, services, staff
- [ ] AC-16.3: Service management: CRUD with pricing, duration, buffer time, online booking toggle
- [ ] AC-16.4: Staff management: profiles, schedules, permissions (admin/staff roles)
- [ ] AC-16.5: Calendar view with drag-and-drop appointment management
- [ ] AC-16.6: Customer database with visit history and notes
- [ ] AC-16.7: Promotions and discount code creation
- [ ] AC-16.8: Payout settings and financial reports (monthly CSV export)
- [ ] AC-16.9: Multi-location support for franchise/chain businesses

---

### 3.17 Admin Dashboard

| Attribute | Detail |
|---|---|
| **Priority** | P1 — High |
| **Description** | Platform administration for user support, business verification, and analytics. |
| **Actors** | Admin |

#### Acceptance Criteria
- [ ] AC-17.1: User management: search, view, suspend, impersonate
- [ ] AC-17.2: Business verification workflow: pending, approved, rejected, documents
- [ ] AC-17.3: Content moderation: flagged reviews, reported businesses
- [ ] AC-17.4: Financial overview: GMV, platform fees, refunds, payouts pending
- [ ] AC-17.5: Analytics: DAU/MAU, booking conversion funnel, top categories, churn
- [ ] AC-17.6: System health: API latency, error rates, queue depth
- [ ] AC-17.7: Configurable platform settings: fees, cancellation policies, feature flags
- [ ] AC-17.8: Audit log of all admin actions

---

### 3.18 Background Jobs (BullMQ)

| Attribute | Detail |
|---|---|
| **Priority** | P1 — High |
| **Description** | Asynchronous job processing for reliability and performance. |
| **Actors** | System |

#### Acceptance Criteria
- [ ] AC-18.1: Job queue definitions with priorities: critical, high, normal, low
- [ ] AC-18.2: Retry policy: 3 attempts with exponential backoff
- [ ] AC-18.3: Dead letter queue for failed jobs after max retries
- [ ] AC-18.4: Job types and scheduling:
  - **Slot pre-computation**: Every 5 min for active businesses
  - **Reminder notifications**: 24h, 2h, 15min before appointment
  - **Review requests**: 2h after appointment completion
  - **Payout processing**: Daily at 06:00 UTC
  - **Data exports**: On-demand with email delivery
  - **Email campaigns**: Scheduled promotional sends
- [ ] AC-18.5: Job monitoring dashboard with status, progress, and logs
- [ ] AC-18.6: Rate limiting per job type to prevent API quota exhaustion
- [ ] AC-18.7: Job idempotency keys to prevent duplicate processing

---

## 4. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | API p95 latency <200ms; page load <2s on 3G |
| **Scalability** | Support 10,000 concurrent users; 1M bookings/month |
| **Security** | OWASP Top 10 mitigation; encryption at rest and in transit |
| **Compliance** | GDPR, CCPA, PCI-DSS Level 1 |
| **Reliability** | 99.9% uptime SLA; automated backups every 6 hours |
| **Localization** | French, English, Spanish, German at launch |

---

## 5. Success Metrics (KPIs)

| Metric | Target |
|---|---|
| Monthly Active Users (MAU) | 50,000 by month 6 |
| Booking Conversion Rate | >15% (search to confirmed booking) |
| No-show Rate | <10% |
| Business NPS | >50 |
| Consumer NPS | >60 |
| Average Booking Value | €45 |
| Platform Take Rate | 10-15% |

---

## 6. Release Phases

| Phase | Features | Timeline |
|---|---|---|
| **MVP** | Auth, Guest Browse, Search, Map, Business Detail, Booking Flow, Appointment Mgmt, Availability, Payment | Week 1-8 |
| **V1.1** | Favorites, Reviews, Notifications, User Profile | Week 9-12 |
| **V1.2** | Business Owner Portal, Admin Dashboard | Week 13-16 |
| **V1.3** | Background Jobs optimization, Analytics, Promotions | Week 17-20 |

---

## 7. Open Questions & Risks

| ID | Question/Risk | Mitigation |
|---|---|---|
| R1 | Stripe Connect onboarding complexity for business owners | Dedicated onboarding flow with document upload |
| R2 | Real-time slot computation at scale | Redis caching + BullMQ pre-computation |
| R3 | Calendar sync (Google/Outlook) | Post-MVP; iCal feed as interim |
| R4 | Multi-timezone edge cases | Use `date-fns-tz` with explicit timezone storage |

---

*Document Version: 1.0*  
*Last Updated: 2024*  
*Owner: Alex — Product Owner*
