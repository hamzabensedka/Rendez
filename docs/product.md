# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first appointment booking platform connecting customers with local service businesses (salons, barbershops, spas, clinics). Customers discover, book, and manage appointments. Business owners manage their availability, services, and bookings. Admins oversee the platform.

**Target Platforms:** iOS, Android, Web
**Release:** MVP → Growth → Scale

---

## 2. Feature Specifications

### 2.1 User Authentication

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Owner** | Customer, Business Owner, Admin |

**Description:** Secure identity verification and session management for all user types.

**Acceptance Criteria:**
- [ ] Users register with email, phone, or OAuth (Google, Apple, Facebook)
- [ ] Phone verification via SMS OTP
- [ ] Password reset via email link
- [ ] JWT access + refresh token pattern with secure storage
- [ ] Biometric login option after initial authentication
- [ ] Session expiry after 30 days inactivity; forced re-auth
- [ ] Rate limiting: 5 failed attempts triggers 15-minute lockout
- [ ] Business owner accounts require manual verification (KYC light: business registration, ID)

---

### 2.2 Guest Browse & Explore

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Owner** | Guest (unauthenticated user) |

**Description:** Allow non-logged users to browse businesses and services to reduce friction.

**Acceptance Criteria:**
- [ ] Guest can view business listings without account
- [ ] Guest can search by location, category, business name
- [ ] Guest can view business details, services, and reviews
- [ ] Guest can see available time slots (read-only)
- [ ] Booking action triggers auth modal with pre-filled context
- [ ] Guest session stored for 24 hours; converts to registered user on signup
- [ ] Guest favorites/bookings linked after account creation

---

### 2.3 Business Search & Discovery

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Owner** | Customer |

**Description:** Intelligent search and filtering to help customers find relevant businesses.

**Acceptance Criteria:**
- [ ] Full-text search across business name, service name, tags
- [ ] Filters: category, price range, rating, distance, availability today, gender (male/female/unisex)
- [ ] Sort options: relevance, distance, rating, price (low-high)
- [ ] Auto-complete with suggestions after 2 characters
- [ ] Recent searches stored locally (last 10)
- [ ] Search results display: image, name, rating, distance, next available slot, price from
- [ ] Empty state with category suggestions and "near me" prompt
- [ ] Pagination: 20 results per page, infinite scroll

---

### 2.4 Map-based Search

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Owner** | Customer |

**Description:** Visual geographic exploration of businesses with clustering and bounds-based loading.

**Acceptance Criteria:**
- [ ] Interactive map with business pins (Google Maps / Mapbox)
- [ ] User location dot with accuracy radius
- [ ] Pin tap reveals bottom sheet with business summary
- [ ] Clustering for dense areas (group pins when zoomed out)
- [ ] "List view" toggle from map; syncs filters
- [ ] "Recenter" button returns to user location
- [ ] Map bounds trigger new search query (debounced 300ms)
- [ ] Default zoom: 12, adjustable 8-18
- [ ] Dark mode support for map tiles

---

### 2.5 Business Detail View

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Owner** | Customer |

**Description:** Comprehensive business profile driving conversion to booking.

**Acceptance Criteria:**
- [ ] Hero image carousel (up to 10 images), pinch-to-zoom
- [ ] Business name, verified badge, rating, review count, favorite toggle
- [ ] Address with "Get Directions" (deep link to maps app)
- [ ] Phone number with tap-to-call
- [ ] Opening hours with "Open now" / "Closes at" indicator
- [ ] About/description text (expandable)
- [ ] Service list with expandable categories
- [ ] Staff/professional list with images and specialties
- [ ] Reviews section with rating distribution
- [ ] "Book Now" CTA sticky at bottom
- [ ] Share business via deep link / native share sheet
- [ ] Report business option (spam, closed, inaccurate)

---

### 2.6 Service Categories

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Owner** | Business Owner (managed), Customer (viewed) |

**Description:** Hierarchical organization of services for discovery and management.

**Acceptance Criteria:**
- [ ] Predefined root categories: Hair, Beauty, Wellness, Health, Fitness, Other
- [ ] Business owners create subcategories and custom services
- [ ] Each service: name, description, duration, price, category, image (optional)
- [ ] Service variants: e.g., "Haircut" → "Senior Stylist / Junior Stylist" with different prices
- [ ] Add-on services attachable to primary service (e.g., deep conditioning)
- [ ] Buffer time configurable between appointments
- [ ] Services can be disabled without deleting (archived)
- [ ] Customer view: services grouped by category, collapsible

---

### 2.7 Booking Flow

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Owner** | Customer |

**Description:** Seamless multi-step reservation process with real-time availability.

**Acceptance Criteria:**
- [ ] Step 1: Select service(s) — single or multiple services, order matters for duration calc
- [ ] Step 2: Select staff (specific, "any", or "no preference") — shows staff availability
- [ ] Step 3: Select date — calendar view with availability indicators (full, limited, empty)
- [ ] Step 4: Select time slot — horizontal scroll list, grouped by AM/PM/evening
- [ ] Step 5: Review — service summary, price breakdown, cancellation policy, business address
- [ ] Step 6: Payment (if required) or confirm (if free/pay at venue)
- [ ] Real-time slot lock: selected slot held for 10 minutes, released if not completed
- [ ] Booking confirmation with calendar invite (.ics), add to native calendar option
- [ ] Reschedule/cancel links in confirmation
- [ ] Guest checkout supported with email/phone capture

---

### 2.8 Appointment Management

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Owner** | Customer, Business Owner |

**Description:** Lifecycle management of appointments for both parties.

**Acceptance Criteria:**
- [ ] Customer: list view with tabs — Upcoming, Past, Cancelled
- [ ] Customer: appointment card shows business, service, date/time, status, actions
- [ ] Customer: reschedule to new slot (same business, same/different service) — old slot released
- [ ] Customer: cancel with reason selection (mandatory), refund policy displayed
- [ ] Customer: no-show policy displayed, penalty applied per business rules
- [ ] Business Owner: calendar view (day/week/month) and list view
- [ ] Business Owner: accept/decline/reject pending bookings (if confirmation required)
- [ ] Business Owner: block time (lunch, break, unavailable)
- [ ] Business Owner: mark complete, no-show, or cancelled with notes
- [ ] Auto-status transitions: pending → confirmed → completed / cancelled / no-show
- [ ] History log: who changed what, when (audit trail)

---

### 2.9 Favorites

| Attribute | Value |
|-----------|-------|
| **Priority** | P1 |
| **Owner** | Customer |

**Description:** Bookmark businesses for quick re-access.

**Acceptance Criteria:**
- [ ] Heart icon on business cards and detail view
- [ ] Favorites list with search and sort (recently added, alphabetical, nearest)
- [ ] Push notification option: "Notify me when [favorite] has availability"
- [ ] Quick re-book from favorite to booking flow with pre-selected business
- [ ] Sync across devices for logged-in users
- [ ] Guest favorites prompt account creation on app close

---

### 2.10 User Profile

| Attribute | Value |
|-----------|-------|
| **Priority** | P1 |
| **Owner** | Customer, Business Owner |

**Acceptance Criteria:**
- [ ] Avatar upload (camera/gallery), crop to circle, max 5MB
- [ ] Display name, email, phone (editable with re-verification)
- [ ] Password change with current password confirmation
- [ ] Notification preferences: push, email, SMS — per type (booking confirmation, reminders, promotions)
- [ ] Privacy settings: profile visibility to business owners
- [ ] Delete account: GDPR-compliant erasure, 30-day grace period, data export first
- [ ] Booking history export (PDF)
- [ ] Business Owner additional: business profile link, switch to business view

---

### 2.11 Availability & Slot Computation

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Owner** | System / Business Owner |

**Description:** Core engine generating accurate bookable slots from complex business rules.

**Acceptance Criteria:**
- [ ] Business defines: working hours per day (can vary), special hours (holidays), breaks
- [ ] Staff-specific schedules override business defaults
- [ ] Service duration + buffer time = slot consumption
- [ ] Concurrent bookings supported (multiple staff, multiple rooms)
- [ ] Slot generation: start at earliest possible, step by slot granularity (15 min default)
- [ ] Respect existing appointments, blocked times, staff unavailability
- [ ] Real-time computation: slot availability updates on every view, cached 5 seconds
- [ ] "Smart gaps": offer slots that fit service duration in available gaps
- [ ] Timezone handling: business timezone primary, customer sees converted time with original noted
- [ ] API: `/slots?businessId&staffId&serviceIds&date` returns available slots with staff assignment

---

### 2.12 Shared Types & Design System

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Owner** | Design / Engineering |

**Acceptance Criteria:**
- [ ] Design tokens: colors (primary #6C5CE7, semantic states), typography (Inter family, 6 sizes), spacing (4px grid), shadows, radii
- [ ] Component library: Button, Input, Card, Avatar, Badge, Modal, BottomSheet, Calendar, TimePicker, Skeleton, EmptyState, ErrorBoundary
- [ ] Shared TypeScript types: User, Business, Service, Appointment, Slot, Review, Payment, Notification
- [ ] API response standardization: `{ success: boolean, data?: T, error?: { code, message, details } }`
- [ ] Theme: light/dark/system, persisted preference
- [ ] Accessibility: minimum WCAG 2.1 AA, screen reader labels, focus management, reduced motion
- [ ] Localization: i18n framework, initial en/fr/de, RTL preparation

---

### 2.13 Reviews & Ratings

| Attribute | Value |
|-----------|-------|
| **Priority** | P1 |
| **Owner** | Customer |

**Acceptance Criteria:**
- [ ] Post-review eligibility: completed appointment, within 14 days, not already reviewed
- [ ] Rating: 1-5 stars, mandatory; review text: optional, max 1000 chars
- [ ] Categories: service quality, staff, ambiance, value (optional granular ratings)
- [ ] Photo attachments: up to 5 images
- [ ] Business owner can respond publicly once
- [ ] Reviews editable by customer for 48 hours; deletable
- [ ] Moderation: auto-flag profanity, manual review queue
- [ ] Sort reviews: most recent, highest/lowest rated, with photos
- [ ] Average rating recalculated nightly; cached on business object
- [ ] Anonymous option: display "Verified Customer" instead of name

---

### 2.14 Payment Integration

| Attribute | Value |
|-----------|-------|
| **Priority** | P1 |
| **Owner** | Customer, Business Owner |

**Acceptance Criteria:**
- [ ] Stripe Connect: platform marketplace, business owners onboarded as connected accounts
- [ ] Payment methods: cards (3D Secure), Apple Pay, Google Pay, SEPA (EU)
- [ ] Payment timing: pay now (full), deposit (partial), pay at venue
- [ ] Platform fee: configurable % + fixed fee, deducted automatically
- [ ] Payouts to business owners: daily/weekly/monthly, min threshold
- [ ] Refunds: full or partial, initiated by business owner or auto (cancellation policy)
- [ ] Receipt: email + in-app, with business VAT info if applicable
- [ ] Failed payment: retry logic, notify customer, release slot after final failure
- [ ] PCI compliance: never store raw card data, use Stripe Elements

---

### 2.15 Notifications

| Attribute | Value |
|-----------|-------|
| **Priority** | P1 |
| **Owner** | Customer, Business Owner |

**Acceptance Criteria:**
- [ ] Channels: push (OneSignal/Firebase), email (SendGrid), SMS (Twilio)
- [ ] Triggers: booking confirmation, reminder (24h, 1h before), cancellation, reschedule, review request, payment success/failure, promotional (opt-in)
- [ ] Business Owner: new booking alert, cancellation, daily digest
- [ ] In-app notification center with read/unread, deep links to relevant screens
- [ ] Quiet hours: no push 22:00-08:00 local time; queue for morning
- [ ] Unsubscribe per channel per type; global unsubscribe for marketing
- [ ] Delivery tracking: opened, clicked; retry failed with exponential backoff

---

### 2.16 Provider / Business Owner Portal

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Owner** | Business Owner |

**Acceptance Criteria:**
- [ ] Dashboard: today's appointments, revenue (today/this week/this month), occupancy rate
- [ ] Calendar management: drag-to-resize appointments, quick block time, copy weekly schedule
- [ ] Staff management: invite by email, set permissions (view only, manage bookings, admin), assign services
- [ ] Service management: CRUD services, set pricing tiers, toggle availability
- [ ] Customer database: view history, notes, contact; export CSV
- [ ] Settings: business info, photos, hours, cancellation policy, payment account
- [ ] Mobile-optimized web app; native app v2
- [ ] Multi-location support: switch between, aggregate reporting

---

### 2.17 Admin Dashboard

| Attribute | Value |
|-----------|-------|
| **Priority** | P2 |
| **Owner** | Platform Admin |

**Acceptance Criteria:**
- [ ] User management: search, view, suspend, impersonate
- [ ] Business verification queue: approve/reject with notes, document review
- [ ] Content moderation: flagged reviews, reported businesses, take action
- [ ] Analytics: MAU, bookings, GMV, churn, top categories, geographic heatmap
- [ ] Financial: transaction ledger, dispute handling, manual refunds
- [ ] System health: job queue depth, error rates, API latency
- [ ] Role-based access: super admin, support agent, finance, read-only
- [ ] Audit log: all admin actions with IP, timestamp, before/after state

---

### 2.18 Background Jobs (BullMQ)

| Attribute | Value |
|-----------|-------|
| **Priority** | P1 |
| **Owner** | System |

**Acceptance Criteria:**
- [ ] Job definitions with priorities, retries, dead-letter queue
- [ ] SendNotificationJob: dispatch push/email/SMS based on user preferences
- [ ] SlotReleaseJob: release held slots after timeout
- [ ] ReminderJob: queue appointment reminders at calculated times
- [ ] PayoutJob: calculate and trigger Stripe transfers to connected accounts
- [ ] ReviewRequestJob: send 24 hours after appointment completion
- [ ] AnalyticsAggregationJob: nightly rollup of metrics
- [ ] ImageProcessingJob: resize avatars, compress, generate thumbnails
- [ ] Retry policy: 3 attempts, exponential backoff, alert on final failure
- [ ] Monitoring: dashboard showing queue lengths, processing times, failure rates
- [ ] Staging: separate queues, idempotent job design

---

## 3. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | App launch < 2s; screen render < 100ms; API response < 200ms (p95) |
| **Scalability** | Support 10k concurrent users; 1M appointments/month at scale |
| **Security** | OWASP Top 10 mitigation; encryption at rest and in transit; SOC 2 roadmap |
| **Reliability** | 99.9% uptime SLA; automated backups; disaster recovery RPO 1h |
| **Compliance** | GDPR, CCPA, PSD2 (payments); cookie consent; terms acceptance |

---

## 4. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion rate | > 15% |
| Search-to-book time | < 5 minutes |
| Business owner activation | > 80% complete profile |
| Customer retention (30d) | > 40% |
| NPS | > 50 |
| Support tickets per 1000 bookings | < 5 |

---

## 5. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Guest Browse, Search, Map, Business Detail, Services, Booking, Appointment Mgmt, Slot Engine, Business Owner Portal | 3 months |
| **V1.1** | Favorites, Reviews, Payments, Notifications | +2 months |
| **V1.2** | Admin Dashboard, Background Jobs, Analytics | +2 months |
| **Scale** | Multi-location, AI recommendations, Loyalty program | +6 months |

---

*Document version: 1.0*
*Last updated: 2024*
*Author: Alex, Product Owner*