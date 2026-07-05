# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first appointment booking platform connecting customers with local service businesses (salons, barbershops, spas, clinics). The platform serves three user types: **Customers** (book appointments), **Business Owners/Providers** (manage schedules and services), and **Admins** (platform oversight). This specification defines features, acceptance criteria, and priorities for MVP and post-MVP phases.

---

## 2. User Personas

| ID | Persona | Goals | Pain Points |
|---|---|---|---|
| P1 | Busy Customer | Book appointments quickly, anytime | No time to call, uncertainty about availability |
| P2 | Discovery Seeker | Find new businesses, compare options | Scattered information, no trusted reviews |
| P3 | Business Owner | Fill empty slots, reduce no-shows | Manual booking overhead, last-minute cancellations |
| P4 | Admin | Platform growth, quality assurance | Fraud, dispute resolution, content moderation |

---

## 3. Feature Specifications

### 3.1 User Authentication

**Description:** Secure identity management for all user types with role-based access.

| Attribute | Value |
|---|---|
| Priority | P0 (Critical) |
| User Story | As a customer, I want to create an account and log in so that I can book appointments and manage my history. |

**Acceptance Criteria:**
- [ ] Users can register via email/password with validation (email format, password ≥8 chars with uppercase, number, special char)
- [ ] Users can register/login via OAuth 2.0 (Google, Apple)
- [ ] Users can log in with email/password; receive JWT access token (15min) + refresh token (7 days)
- [ ] Users can request password reset via email link (expires in 1 hour)
- [ ] Users can log out with token invalidation on server
- [ ] Business owners complete additional onboarding (business name, category, address, phone verification)
- [ ] Admin accounts are created only via internal invitation flow
- [ ] Rate limiting: 5 failed login attempts triggers 15-minute lockout
- [ ] Device tracking: users can view and revoke active sessions

**Post-MVP:** Biometric login (Face ID/Touch ID), social login (Facebook), two-factor authentication.

---

### 3.2 Guest Browse & Explore

**Description:** Pre-authentication discovery experience to reduce friction and drive conversion.

| Attribute | Value |
|---|---|
| Priority | P0 |
| User Story | As a guest, I want to browse businesses without creating an account so that I can evaluate the platform before committing. |

**Acceptance Criteria:**
- [ ] Guest users can view business listings, search results, and business detail pages
- [ ] Guest users can view service categories and filter by them
- [ ] Guest users can view reviews and ratings
- [ ] Booking action prompts account creation with preserved context (redirect to original intent post-auth)
- [ ] Guest session data (search filters, viewed businesses) persists for 24 hours via local storage
- [ ] "Continue as Guest" option available at auth prompt with clear value proposition for registration

---

### 3.3 Business Search & Discovery

**Description:** Intelligent search to help users find relevant businesses efficiently.

| Attribute | Value |
|---|---|
| Priority | P0 |
| User Story | As a customer, I want to search for businesses by name, service, or location so that I can find what I need quickly. |

**Acceptance Criteria:**
- [ ] Full-text search across business name, service names, and descriptions
- [ ] Autocomplete suggestions with typo tolerance (fuzzy matching, Levenshtein distance ≤2)
- [ ] Search results ranked by: relevance score, distance, rating, availability within 48 hours
- [ ] Recent searches stored (last 10) with one-tap re-execution
- [ ] Popular searches surfaced for new users
- [ ] Empty state with suggested alternatives when no results found
- [ ] Search debounced at 300ms to reduce server load

**Post-MVP:** Voice search, AI-powered natural language queries ("nail salon open Saturday morning near me").

---

### 3.4 Map-based Search

**Description:** Visual geographic exploration of available businesses.

| Attribute | Value |
|---|---|
| Priority | P0 |
| User Story | As a customer, I want to see businesses on a map so that I can choose conveniently located options. |

**Acceptance Criteria:**
- [ ] Interactive map (Google Maps or Mapbox) with business pins
- [ ] User location detection with permission prompt; fallback to IP-based approximate location
- [ ] Map and list views are synchronized; selecting pin scrolls list to corresponding business
- [ ] Pin clustering for dense areas (cluster splits at zoom level ≥13)
- [ ] Business cards on pin tap show: name, rating, price range, next available slot
- [ ] "Search this area" button triggers re-query on map pan/zoom
- [ ] Default zoom shows businesses within 5km; adjustable radius 1-50km
- [ ] Accessibility: pins have alt text, map is keyboard navigable

---

### 3.5 Business Detail View

**Description:** Comprehensive business information to support booking decisions.

| Attribute | Value |
|---|---|
| Priority | P0 |
| User Story | As a customer, browse all relevant information about a business to decide if it meets my needs. |

**Acceptance Criteria:**
- [ ] Header: business name, verified badge, average rating (1-5 stars, 0.5 increments), review count
- [ ] Image gallery: up to 10 images, swipeable, pinch-to-zoom, alt text for each
- [ ] Services list: name, duration, price, description; collapsible by category
- [ ] Staff/professional list with photos, bios, specialties, individual ratings
- [ ] Operating hours with "Open Now" / "Closes at X" / "Closed" status
- [ ] Contact: address with directions link, phone (tap to call), website link
- [ ] Amenities/tags displayed as chips (WiFi, parking, wheelchair accessible, etc.)
- [ ] "Book Now" CTA sticky at bottom; disabled if no available slots in next 30 days
- [ ] Share functionality (deep link, native share sheet)
- [ ] Report business option for inappropriate content

---

### 3.6 Service Categories

**Description:** Hierarchical classification for browse and filter experiences.

| Attribute | Value |
|---|---|
| Priority | P0 |
| User Story | As a customer, I want to browse by category so that I can discover businesses even without a specific search term. |

**Acceptance Criteria:**
- [ ] Category tree: 8-10 top-level categories (Hair, Nails, Beauty & Spa, Barber, Massage, Wellness, Medical Aesthetic, Tattoos & Piercing, Pet Services, Other)
- [ ] Each category has icon, display name, and optional subcategories (2-4 levels deep)
- [ ] Businesses can be assigned multiple categories and subcategories
- [ ] Category pages show featured businesses, trending services, and new arrivals
- [ ] Category filtering combines with other filters (location, price, rating, availability)
- [ ] Admin can manage category tree: add, edit, merge, deprecate with business reassignment

---

### 3.7 Booking Flow

**Description:** Core conversion funnel for appointment reservation.

| Attribute | Value |
|---|---|
| Priority | P0 |
| User Story | As a customer, I want to book an appointment in a few taps so that I can secure my preferred time slot. |

**Acceptance Criteria:**
- [ ] Step 1 — Service Selection: user selects service(s); multi-service booking supported (up to 3 per appointment)
- [ ] Step 2 — Professional Selection: "Any available" or specific professional; show professional availability
- [ ] Step 3 — Date/Time: calendar view with available slots highlighted; slot granularity matches business settings (15/30/60 min)
- [ ] Step 4 — Review: summary of selections, cancellation policy, total price, estimated duration
- [ ] Step 5 — Payment: see 3.14 Payment Integration
- [ ] Step 6 — Confirmation: booking reference, add to calendar, option to set reminder
- [ ] Flow progress indicator with ability to navigate back and edit previous steps
- [ ] Slot holds: selected slot held for 10 minutes during booking; released on timeout or abandonment
- [ ] Guest checkout supported with account creation post-payment
- [ ] Booking constraints enforced: minimum lead time (default 2 hours), maximum advance booking (default 90 days)

**Error Handling:**
- Slot taken during hold: notify user, suggest next available, return to slot selection
- Payment failure: preserve booking intent, allow retry with different method

---

### 3.8 Appointment Management

**Description:** Lifecycle management of customer appointments.

| Attribute | Value |
|---|---|
| Priority | P0 |
| User Story | As a customer, I want to view and manage my appointments so that I can stay organized. |

**Acceptance Criteria:**
- [ ] Upcoming appointments list: sorted by date, grouped by month
- [ ] Appointment detail: service, business, professional, date/time, price, status, directions, contact
- [ ] Statuses: Pending, Confirmed, Checked-in, Completed, Cancelled, No-show, Rescheduled
- [ ] Customer can cancel up to business's cancellation deadline (default 24 hours before)
- [ ] Customer can reschedule to another available slot; original slot released immediately
- [ ] Push notification and email reminders: 24 hours, 2 hours, and 15 minutes before appointment
- [ ] Appointment history with ability to rebook same service/professional
- [ ] No-show policy displayed; repeat no-shows may trigger account review

---

### 3.9 Favorites

**Description:** Bookmarking system for quick access to preferred businesses.

| Attribute | Value |
|---|---|
| Priority | P1 (High) |
| User Story | As a customer, I want to save favorite businesses so that I can book with them again easily. |

**Acceptance Criteria:**
- [ ] Heart icon toggles favorite status on business card and detail page
- [ ] Favorites list accessible from main navigation; sortable by name, recently added, or next availability
- [ ] Favorite businesses surface push notifications for new availability or promotions (opt-in)
- [ ] Maximum 200 favorites per user; prompt to manage when approaching limit
- [ ] Favorites sync across devices for authenticated users
- [ ] Suggested favorites based on booking history and category affinity

---

### 3.10 User Profile

**Description:** Customer identity and preference management.

| Attribute | Value |
|---|---|
| Priority | P1 |
| User Story | As a customer, I want to manage my profile so that my booking experience is personalized. |

**Acceptance Criteria:**
- [ ] Profile fields: name, email, phone, profile photo, date of birth (optional, for birthday promotions)
- [ ] Notification preferences: push, email, SMS toggles by type (booking, marketing, reminders)
- [ ] Payment methods: view, add, delete; set default
- [ ] Privacy settings: profile visibility, data download, account deletion (GDPR/CCPA compliant)
- [ ] Booking preferences: default reminder times, preferred professionals, service preferences
- [ ] Referral code generation and tracking

---

### 3.11 Availability & Slot Computation

**Description:** Core scheduling engine ensuring accurate, real-time availability.

| Attribute | Value |
|---|---|
| Priority | P0 |
| User Story | As a business owner, I want my availability accurately reflected so that customers can only book genuine open slots. |

**Acceptance Criteria:**
- [ ] Business defines weekly recurring schedule with day-level granularity
- [ ] Exception dates: holidays, vacation closures, special extended hours
- [ ] Service duration defines slot consumption; buffer time between appointments configurable
- [ ] Professional-level availability: each staff member has independent schedule
- [ ] Real-time slot computation accounts for: existing bookings, holds (in-progress bookings), blocked times, professional availability
- [ ] Slot computation API responds in <200ms for 30-day window
- [ ] Caching strategy: Redis with invalidation on booking creation/cancellation/modification
- [ ] Overbooking prevention: database-level constraint with application-level double-check
- [ ] Complex rules supported: split shifts, lunch breaks, variable service durations by professional

**Edge Cases:**
- Concurrent booking requests: first to complete payment wins; others receive "slot no longer available"
- Service overrun: next slot auto-adjusted or flagged for manual resolution

---

### 3.12 Shared Types & Design System

**Description:** Consistent UI/UX foundation across platforms.

| Attribute | Value |
|---|---|
| Priority | P0 (Enabler) |
| User Story | As a developer, I want reusable components and typed contracts so that I can build features quickly and consistently. |

**Acceptance Criteria:**
- [ ] Design system: color palette (primary, secondary, semantic colors), typography scale (6 sizes), spacing grid (4px base), elevation/shadows, border radius, animation timings
- [ ] Component library: Button, Input, Select, DatePicker, TimeSlot, Card, Modal, Toast, Skeleton, EmptyState
- [ ] Shared TypeScript types: User, Business, Service, Professional, Appointment, Slot, Payment, Notification interfaces
- [ ] API response schemas with Zod validation; shared between frontend and backend
- [ ] Theme support: light/dark mode with system preference detection
- [ ] Accessibility: WCAG 2.1 AA compliance minimum; focus management, screen reader labels, color contrast ≥4.5:1
- [ ] Responsive breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px)
- [ ] Localization framework: i18n with English and French as initial languages; RTL support planned

---

### 3.13 Reviews & Ratings

**Description:** Social proof system to build trust and quality feedback loop.

| Attribute | Value |
|---|---|
| Priority | P1 |
| User Story | As a customer, I want to read and write reviews so that I can make informed decisions and share my experience. |

**Acceptance Criteria:**
- [ ] Verified reviews only: customer must have completed appointment to review
- [ ] Rating dimensions: overall (1-5 stars), service quality, punctuality, cleanliness, value for money
- [ ] Review content: text (10-1000 chars), optional photo upload (max 5, 5MB each)
- [ ] Business owner can respond to reviews publicly
- [ ] Review helpfulness voting; flag for inappropriate content
- [ ] Reviews sorted by: most relevant (default), most recent, highest/lowest rating
- [ ] Aggregate statistics: average rating, rating distribution histogram, trend over time
- [ ] Moderation: auto-approve with post-hoc review; trigger manual review for flagged content
- [ ] Customer can edit review within 48 hours; delete anytime

---

### 3.14 Payment Integration

**Description:** Secure, flexible payment processing for bookings.

| Attribute | Value |
|---|---|
| Priority | P0 |
| User Story | As a customer, I want to pay securely so that my booking is confirmed immediately. |

**Acceptance Criteria:**
- [ ] Payment methods: credit/debit card (Stripe), Apple Pay, Google Pay
- [ ] Payment flow: client-side tokenization, server-side charge creation with idempotency key
- [ ] Pricing: service price + platform fee (configurable %) + applicable tax
- [ ] Hold vs. Charge: option to pay deposit (default 20%) or full amount at booking
- [ ] Refund processing: full refund if cancelled within policy; partial or no refund per business settings
- [ ] Failed payment handling: 3 retry attempts with customer notification; booking auto-cancelled after final failure
- [ ] Receipt generation: email and in-app; downloadable PDF
- [ ] Payout to business owners: weekly batch to connected Stripe account; dashboard shows pending/available balance

**Security:**
- PCI DSS compliance via Stripe Elements (no card data touches our servers)
- 3D Secure authentication for applicable transactions

---

### 3.15 Notifications

**Description:** Multi-channel communication for engagement and operational efficiency.

| Attribute | Value |
|---|---|
| Priority | P1 |
| User Story | As a user, I want timely notifications so that I don't miss my appointments or important updates. |

**Acceptance Criteria:**
- [ ] Push notifications: Firebase Cloud Messaging for iOS/Android; rich notifications with actions (confirm, reschedule, cancel)
- [ ] Email notifications: SendGrid integration; transactional templates for booking confirmation, reminder, cancellation, receipt
- [ ] SMS notifications: Twilio for critical alerts (booking confirmation, same-day reminder, urgent cancellation)
- [ ] In-app notification center: persistent feed of all notifications; unread badge
- [ ] Notification preferences: granular toggles by channel and category
- [ ] Delivery tracking: delivery status, open rates, bounce handling
- [ ] Quiet hours: no push notifications 22:00-08:00 local time unless emergency
- [ ] Notification batching: digest mode for non-urgent updates (daily summary option)

---

### 3.16 Provider / Business Owner Portal

**Description:** Dedicated interface for business operations management.

| Attribute | Value |
|---|---|
| Priority | P0 |
| User Story | As a business owner, I want to manage my business, services, and appointments so that I can operate efficiently. |

**Acceptance Criteria:**
- [ ] Dashboard: today's appointments, revenue summary, occupancy rate, upcoming week preview
- [ ] Calendar view: day/week/month; drag-to-reschedule; color-coded by status
- [ ] Appointment actions: confirm, check-in, complete, cancel, reschedule; with customer notification triggers
- [ ] Service management: CRUD services with name, description, duration, price, category, buffer time, online booking enabled/disabled
- [ ] Professional management: add staff, set individual schedules, assign services, deactivate
- [ ] Availability rules: set recurring schedule, add exceptions, block time off
- [ ] Customer management: view customer list, booking history, notes, contact info
- [ ] Settings: business info, cancellation policy, notification preferences, payment account connection
- [ ] Analytics: revenue trends, booking volume, popular services, no-show rate, customer acquisition
- [ ] Mobile-responsive web app; native app parity planned post-MVP

---

### 3.17 Admin Dashboard

**Description:** Platform oversight and operational control.

| Attribute | Value |
|---|---|
| Priority | P1 |
| User Story | As an admin, I want to monitor and manage the platform so that I can ensure quality and growth. |

**Acceptance Criteria:**
- [ ] Business onboarding queue: review and approve new business registrations
- [ ] User management: search, view, suspend, delete accounts; handle complaints
- [ ] Business management: edit listings, feature businesses, suspend for violations
- [ ] Content moderation: review flagged reviews, images, business descriptions
- [ ] Financial overview: platform revenue, transaction volume, payout status, refund monitoring
- [ ] Analytics: MAU, booking conversion funnel, retention cohorts, top categories/geographies
- [ ] System health: API latency, error rates, job queue depth, notification delivery rates
- [ ] Role-based access: super admin, support agent, finance viewer roles with permission granularity

---

### 3.18 Background Jobs (BullMQ)

**Description:** Asynchronous task processing for reliability and performance.

| Attribute | Value |
|---|---|
| Priority | P0 (Enabler) |
| User Story | As a system, I want reliable background processing so that user-facing performance remains fast and operations are dependable. |

**Acceptance Criteria:**
- [ ] Job types defined: notification delivery, email sending, payment processing, slot hold expiration, report generation, data exports, search index updates, image processing
- [ ] Queue configuration: separate queues by priority and job type; concurrency limits per worker
- [ ] Retry policy: exponential backoff, max 5 attempts; dead letter queue for failed jobs
- [ ] Job idempotency: duplicate job detection via unique job ID
- [ ] Monitoring: job count, processing time, failure rate, queue depth dashboards
- [ ] Scheduled jobs: daily/weekly recurring tasks (payouts, reports, cleanup)
- [ ] Graceful shutdown: finish in-progress jobs before worker termination
- [ ] Job progress tracking for long-running operations (data exports)

---

## 4. Non-Functional Requirements

| Area | Requirement |
|---|---|
| Performance | App launch <2s; page load <1s; API response <200ms (p99) |
| Availability | 99.9% uptime; planned maintenance windows communicated |
| Security | OWASP Top 10 mitigation; annual penetration testing |
| Scalability | Support 10,000 concurrent users; 100,000 daily bookings |
| Compliance | GDPR, CCPA, PCI DSS (via Stripe) |

---

## 5. Prioritization Summary

| Priority | Features |
|---|---|
| P0 (Critical) | 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.11, 3.12, 3.14, 3.16, 3.18 |
| P1 (High) | 3.9, 3.10, 3.13, 3.15, 3.17 |
| P2 (Medium) | Post-MVP items noted in individual sections |

---

## 6. Success Metrics

| Metric | Target |
|---|---|
| Booking conversion rate | >15% |
| Guest to registered user conversion | >30% |
| App store rating | >4.5 stars |
| Customer retention (30-day) | >40% |
| Business owner NPS | >50 |
| Support ticket volume | <2% of active users/month |

---

*Document version: 1.0*
*Last updated: 2024*
*Owner: Product — Alex*