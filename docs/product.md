# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a marketplace platform connecting customers with local service businesses (salons, barbershops, spas, clinics). Customers discover, book, and manage appointments. Business owners manage their availability, services, and bookings. Administrators oversee platform health and user management.

**Target Users:**
- **Customers:** End-users seeking to book appointments
- **Business Owners:** Service providers managing their business presence and appointments
- **Administrators:** Platform operators ensuring quality and compliance

---

## 2. Feature Specifications

### 2.1 User Authentication

**Priority:** P0 — Critical

**Description:** Secure identity verification and session management for all user types.

**Acceptance Criteria:**
- [ ] Users can register with email/password, phone number, or OAuth (Google, Apple)
- [ ] Passwords enforce minimum 8 characters with mixed case, number, and special character
- [ ] Email verification required before first booking
- [ ] Phone verification via SMS OTP for high-value actions
- [ ] JWT-based session management with refresh token rotation
- [ ] Password reset via secure email link (expires in 1 hour)
- [ ] Social login accounts linkable to existing email accounts
- [ ] Rate limiting: 5 failed login attempts triggers 15-minute lockout
- [ ] Session termination from any device via account settings
- [ ] Biometric authentication option on supported mobile devices

**Business Rules:**
- Single account per verified email/phone
- OAuth users without email in scope prompted for email completion

---

### 2.2 Guest Browse & Explore

**Priority:** P0 — Critical

**Description:** Unauthenticated users can browse businesses and services to reduce friction before commitment.

**Acceptance Criteria:**
- [ ] Guest users can view business listings without registration
- [ ] Guest users can search by location, category, and keyword
- [ ] Guest users can view business profiles, services, and reviews
- [ ] Guest users can see real-time availability (read-only)
- [ ] Booking action triggers registration prompt with pre-filled context
- [ ] Guest session persists for 30 days via local storage (device-specific)
- [ ] Converting to registered user preserves guest browsing history

**Business Rules:**
- No PII collection beyond analytics identifiers for guests
- Guest-to-user conversion must not lose in-progress booking data

---

### 2.3 Business Search & Discovery

**Priority:** P0 — Critical

**Description:** Intelligent search and filtering to help customers find relevant businesses.

**Acceptance Criteria:**
- [ ] Full-text search across business name, service name, and description
- [ ] Autocomplete suggestions after 3 characters with debounce (300ms)
- [ ] Filters: category, price range, rating, distance, availability today, amenities
- [ ] Sort options: relevance, distance, rating, price (low to high)
- [ ] Search results display: thumbnail, name, rating, distance, next available slot, price from
- [ ] Recent searches stored (up to 10, user-deletable)
- [ ] Popular searches and trending businesses surfaced on empty state
- [ ] Search history syncs across devices for authenticated users
- [ ] Voice search capability on mobile apps

**Technical Notes:**
- Elasticsearch or PostgreSQL full-text search with trigram indexing
- Location geocoding cached for 24 hours

---

### 2.4 Map-based Search

**Priority:** P1 — High

**Description:** Visual exploration of businesses by geographic distribution.

**Acceptance Criteria:**
- [ ] Interactive map with business markers clustered at zoom levels
- [ ] User location detection with permission prompt
- [ ] Map and list views toggleable; state synchronized
- [ ] Marker tap reveals business card with key info and CTA
- [ ] Boundary search: adjust map viewport to search within visible area
- [ ] Walking/driving directions to business via external maps app
- [ ] Public transit and parking information where available
- [ ] Satellite and standard map layer options

**Performance:**
- Cluster rendering: <100ms for 500 markers
- Lazy fetch additional details on marker interaction

---

### 2.5 Business Detail View

**Priority:** P0 — Critical

**Description:** Comprehensive business profile driving conversion to booking.

**Acceptance Criteria:**
- [ ] Hero image gallery (up to 10 images, swipeable)
- [ ] Business name, verified badge, rating, review count, favorite toggle
- [ ] Operating hours with current day highlighted and open/closed status
- [ ] Full address with copy and directions actions
- [ ] Phone number with tap-to-call
- [ ] Website link (external browser)
- [ ] Social media links
- [ ] Business description (expandable, max 2000 chars)
- [ ] COVID-19 protocols and safety badges
- [ ] Languages spoken by staff
- [ ] Amenities checklist (WiFi, parking, wheelchair accessible, etc.)
- [ ] Staff/member profiles with photos and specialties
- [ ] "Book Now" CTA sticky at bottom

---

### 2.6 Service Categories

**Priority:** P1 — High

**Description:** Hierarchical classification enabling discovery and business organization.

**Acceptance Criteria:**
- [ ] Predefined category tree: Hair, Beauty, Wellness, Health, Fitness, Other
- [ ] Subcategories: e.g., Hair > Cut, Color, Styling, Treatments
- [ ] Businesses can assign primary and secondary categories
- [ ] Services linked to categories for filtering and pricing
- [ ] Category icons and color coding in UI
- [ ] Trending and seasonal categories promoted in discovery
- [ ] Admin-managed category taxonomy with ability to add/edit/archive

**Data Model:**
- Category: id, name, slug, parentId, icon, color, sortOrder, isActive

---

### 2.7 Booking Flow

**Priority:** P0 — Critical

**Description:** Frictionless multi-step appointment reservation.

**Acceptance Criteria:**
- [ ] Step 1: Service selection (with duration and price display)
- [ ] Step 2: Staff selection (optional "no preference" or specific provider)
- [ ] Step 3: Date and time selection from computed availability
- [ ] Step 4: Review and confirm with cancellation policy
- [ ] Step 5: Payment (if required) or instant confirmation
- [ ] Real-time slot availability with optimistic locking (5-minute hold on selection)
- [ ] Add-on services offered during flow
- [ ] Guest checkout supported with minimal data collection
- [ ] Booking confirmation screen with calendar invite, directions, and share
- [ ] Rescheduling and cancellation links in confirmation

**Edge Cases:**
- Slot taken during selection: graceful error with nearest alternatives
- Business closed on selected date: prevent selection, show next available

---

### 2.8 Appointment Management

**Priority:** P0 — Critical

**Description:** Customer and business views for tracking and modifying appointments.

**Customer-side:**
- [ ] Upcoming and past appointments list with status badges
- [ ] Appointment detail: service, staff, time, location, instructions, QR code
- [ ] Reschedule: restart from slot selection, preserve original where possible
- [ ] Cancel with reason selection and refund policy application
- [ ] Rebook previous service with one tap
- [ ] Add to native calendar (iCal/ICS)

**Business-side:**
- [ ] Daily/weekly calendar view with appointment blocks
- [ ] Status transitions: confirmed, checked-in, in-progress, completed, no-show, cancelled
- [ ] Walk-in appointment creation
- [ ] Block time (breaks, unavailability)
- [ ] Customer notes and appointment history visible

---

### 2.9 Favorites

**Priority:** P2 — Medium

**Description:** Bookmark businesses for quick re-access and personalized experience.

**Acceptance Criteria:**
- [ ] Toggle favorite from business card, detail view, or post-booking
- [ ] Favorites list with search and sort (recently added, alphabetical, nearest)
- [ ] Push notification for new availability or promotions from favorited businesses
- [ ] Favorite count visible to business owners (aggregated, not individual)
- [ ] Sync across devices for authenticated users
- [ ] Import favorites on account creation from device contacts (opt-in)

---

### 2.10 User Profile

**Priority:** P1 — High

**Description:** Customer identity and preference management.

**Acceptance Criteria:**
- [ ] Editable: name, phone, email, profile photo, birthday (for birthday offers)
- [ ] Notification preferences: push, email, SMS per channel type
- [ ] Payment methods management (add, remove, set default)
- [ ] Privacy settings: profile visibility, data download, account deletion
- [ ] Booking history with search and filter
- [ ] Loyalty points or credits balance (if applicable)
- [ ] Referral code generation and tracking
- [ ] Accessibility preferences (screen reader, reduced motion)

---

### 2.11 Availability & Slot Computation

**Priority:** P0 — Critical

**Description:** Core engine determining bookable time slots from business rules and existing appointments.

**Acceptance Criteria:**
- [ ] Business defines: operating hours per day, service durations, buffer time between appointments
- [ ] Staff-specific schedules and exceptions (time off, holidays)
- [ ] Service-staff eligibility matrix (who can perform what)
- [ ] Concurrent appointment support (multiple rooms, chairs)
- [ ] Recurring availability patterns with override capability
- [ ] Slot computation accounts for timezone (business location-based)
- [ ] Cache invalidation on schedule change or booking mutation
- [ ] Query performance: <200ms for 30-day slot generation
- [ ] Edge case: split shifts, overnight services

**Algorithm:**
- Input: businessId, staffId(s), serviceId(s), date range
- Output: available slot arrays per date
- Constraints: existing bookings, blocks, business rules

---

### 2.12 Shared Types & Design System

**Priority:** P1 — High

**Description:** Consistent UI/UX foundation across platforms.

**Acceptance Criteria:**
- [ ] Design tokens: colors (primary, secondary, semantic states), typography scales, spacing, shadows, radii
- [ ] Component library: buttons, inputs, cards, modals, toasts, skeletons, date pickers, time grids
- [ ] Shared TypeScript types for API contracts, entities, and DTOs
- [ ] Responsive breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px)
- [ ] Dark mode support with system preference detection
- [ ] Accessibility: WCAG 2.1 AA minimum, focus management, ARIA labels
- [ ] Animation standards: 200ms transitions, meaningful motion only
- [ ] Icon set: consistent stroke width, 24px default, 20px compact

---

### 2.13 Reviews & Ratings

**Priority:** P1 — High

**Description:** Social proof and quality feedback loop.

**Acceptance Criteria:**
- [ ] Verified reviews: only post-completed-appointment customers can review
- [ ] Rating: 1-5 stars with half-star precision
- [ ] Review components: overall rating, staff-specific rating, text, photos (up to 5)
- [ ] Business owner response capability
- [ ] Review helpfulness voting and abuse reporting
- [ ] Sort and filter reviews (recent, highest, lowest, with photos)
- [ ] Aggregate rating calculation with recency weighting
- [ ] Review invitation: automated prompt 24 hours post-appointment
- [ ] Moderation queue for reported content

---

### 2.14 Payment Integration

**Priority:** P0 — Critical

**Description:** Secure, flexible payment processing for bookings.

**Acceptance Criteria:**
- [ ] Payment methods: credit/debit cards, digital wallets (Apple Pay, Google Pay), buy-now-pay-later (Klarna, Afterpay)
- [ ] Payment timing: full upfront, deposit, or pay-at-venue
- [ ] Cancellation refund policy: configurable by business (full, partial, none)
- [ ] Automatic payment capture on booking confirmation
- [ ] Receipt generation and email delivery
- [ ] Failed payment handling with retry and alternative method prompt
- [ ] PCI-DSS compliance via tokenization (Stripe/PayPal Vault)
- [ ] Payout scheduling and reporting for business owners
- [ ] Platform fee calculation and transparent display

---

### 2.15 Notifications

**Priority:** P1 — High

**Description:** Multi-channel, timely communication driving engagement and reducing no-shows.

**Acceptance Criteria:**
- [ ] Channels: push (mobile), in-app, email, SMS
- [ ] Trigger types: booking confirmation, reminder (24h, 1h before), modification, cancellation, review request, promotional
- [ ] User preference management per channel and type
- [ ] Rich push with deep links to relevant app screens
- [ ] SMS fallback for critical reminders when push disabled
- [ ] Notification history in-app with unread indicators
- [ ] Quiet hours respect (default 10pm-8am, user-configurable)
- [ ] A/B testable copy and timing

---

### 2.16 Provider / Business Owner Portal

**Priority:** P0 — Critical

**Description:** Dedicated interface for business operations management.

**Acceptance Criteria:**
- [ ] Dashboard: today's overview, upcoming appointments, revenue snapshot, quick actions
- [ ] Calendar management: drag-and-drop scheduling, multi-staff view, color-coded statuses
- [ ] Service catalog: CRUD services with pricing, duration, description, photos
- [ ] Staff management: profiles, schedules, permissions, performance metrics
- [ ] Customer database: searchable, with visit history and notes
- [ ] Availability rules: set once, apply broadly, with granular exceptions
- [ ] Booking policies: cancellation window, no-show policy, deposit requirements
- [ ] Promotions: create discount codes, flash sales, loyalty rewards
- [ ] Reporting: appointments, revenue, occupancy rate, customer retention, staff utilization
- [ ] Settings: business info, payment methods, integrations (Google Business, social)

---

### 2.17 Admin Dashboard

**Priority:** P1 — High

**Description:** Platform governance and operational oversight.

**Acceptance Criteria:**
- [ ] User management: search, view, suspend, impersonate customers and businesses
- [ ] Business onboarding: verification workflow, document review, approval/rejection
- [ ] Content moderation: review flagged reviews, business images, descriptions
- [ ] Financial oversight: transaction monitoring, dispute handling, refund approval
- [ ] Analytics: MAU, booking volume, GMV, churn, top categories, geographic distribution
- [ ] System health: queue monitoring, error rates, API performance
- [ ] Configuration: global settings, feature flags, category management
- [ ] Audit log: all admin actions with actor, timestamp, before/after state
- [ ] Data export and reporting for compliance

---

### 2.18 Background Jobs (BullMQ)

**Priority:** P1 — High

**Description:** Asynchronous task processing for reliability and performance.

**Acceptance Criteria:**
- [ ] Job types: email dispatch, SMS delivery, push notification, payment processing, search index updates, report generation, data exports, image processing, reminder scheduling
- [ ] Retry logic: exponential backoff, max 5 attempts, dead-letter queue for failures
- [ ] Job prioritization: critical (payment), high (notifications), normal (indexing), low (reports)
- [ ] Scheduled jobs: cron-based for daily summaries, periodic cleanup
- [ ] Job observability: dashboard with queue depth, processing rate, failure rate
- [ ] Idempotency keys prevent duplicate processing
- [ ] Graceful shutdown: finish in-progress jobs before process termination
- [ ] Rate limiting per external API (email provider, SMS gateway)

---

## 3. Non-Functional Requirements

| Aspect | Requirement |
|--------|-------------|
| Performance | P95 API response <500ms; page load <2s |
| Availability | 99.9% uptime; scheduled maintenance windows |
| Security | OWASP Top 10 mitigation; annual penetration testing |
| Scalability | Horizontal scaling; handle 10x traffic spikes |
| Compliance | GDPR, CCPA, PCI-DSS; data retention policies |
| Accessibility | WCAG 2.1 AA; screen reader tested |

---

## 4. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Guest Browse, Search, Business Detail, Booking, Appointment Mgmt, Availability, Payments, Owner Portal | Month 1-3 |
| V1.1 | Map Search, Favorites, Reviews, Notifications | Month 4 |
| V1.2 | Admin Dashboard, Background Jobs, Analytics | Month 5 |
| V1.3 | Design System polish, Accessibility audit, Performance optimization | Month 6 |

---

## 5. Success Metrics

- **Acquisition:** Monthly new registrations, app store conversion rate
- **Activation:** First booking completion rate, time to first booking
- **Engagement:** Monthly bookings per user, session frequency
- **Retention:** 30/60/90-day booking retention
- **Revenue:** GMV, take rate, average booking value
- **Satisfaction:** NPS, app store rating, support ticket volume

---

*Document Version: 1.0*
*Last Updated: 2024*
*Owner: Product — Alex*