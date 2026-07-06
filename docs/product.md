# Planity Clone — Product Specification

## 1. Document Information

| Property | Value |
|----------|-------|
| Version | 1.0 |
| Status | Draft |
| Author | Alex, Product Owner |
| Date | 2024 |

---

## 2. Product Overview

Planity Clone is a mobile-first platform connecting consumers with beauty/wellness businesses for appointment booking. The product serves three user types: **Consumers** (book appointments), **Business Owners** (manage business, staff, availability), and **Admin** (platform governance).

---

## 3. User Personas

| ID | Persona | Needs |
|----|---------|-------|
| P1 | Consumer | Discover, compare, and book services quickly |
| P2 | Guest User | Browse without committing to account creation |
| P3 | Business Owner | Manage schedule, services, and grow revenue |
| P4 | Admin | Monitor platform health, resolve disputes |

---

## 4. Feature Specifications

### 4.1 User Authentication

**Priority:** P0 — Critical

| Attribute | Detail |
|-----------|--------|
| Description | Secure account creation, login, and session management |
| User Story | As a user, I want to authenticate so that my data and bookings are protected |

**Acceptance Criteria:**
- [ ] AC-1.1: Users can register with email/password, phone/SMS OTP, or OAuth (Google, Apple)
- [ ] AC-1.2: Passwords enforce minimum 8 characters, 1 uppercase, 1 number, 1 special character
- [ ] AC-1.3: JWT access token (15min expiry) + refresh token (7 days) with secure httpOnly cookie storage
- [ ] AC-1.4: Users receive email verification link; account restricted until verified
- [ ] AC-1.5: "Forgot Password" flow sends secure reset link (1-hour expiry)
- [ ] AC-1.6: Biometric login (Face ID / Touch ID / Fingerprint) available after initial authentication
- [ ] AC-1.7: Concurrent session limit: max 5 active sessions per user; oldest auto-terminated
- [ ] AC-1.8: Rate limiting: max 5 login attempts per 15 minutes before temporary lockout

**Technical Notes:**
- Use bcrypt with cost factor 12 for password hashing
- Implement device fingerprinting for security alerts

---

### 4.2 Guest Browse & Explore

**Priority:** P0 — Critical

| Attribute | Detail |
|-----------|--------|
| Description | Allow non-authenticated users to browse businesses and services |
| User Story | As a guest, I want to explore before committing to create an account |

**Acceptance Criteria:**
- [ ] AC-2.1: Guest users can view business listings, search results, and business details without login
- [ ] AC-2.2: Guest users can view service catalogs and pricing
- [ ] AC-2.3: Guest users CANNOT book appointments; prompted to sign up/login at booking initiation
- [ ] AC-2.4: Guest search history and filters persist in localStorage for 24 hours
- [ ] AC-2.5: Converting guest to registered user preserves localStorage data to account upon registration
- [ ] AC-2.6: Guest users see CTA banners encouraging account creation with value props (faster checkout, exclusive offers)

---

### 4.3 Business Search & Discovery

**Priority:** P0 — Critical

| Attribute | Detail |
|-----------|--------|
| Description | Find businesses through multiple search modalities |
| User Story | As a consumer, I want to find relevant businesses based on my criteria |

**Acceptance Criteria:**
- [ ] AC-3.1: Full-text search across business name, service names, and descriptions
- [ ] AC-3.2: Autocomplete suggestions within 200ms; max 10 suggestions displayed
- [ ] AC-3.3: Filter by: service category, price range, rating (1-5 stars), availability (today, this week), amenities
- [ ] AC-3.4: Sort options: relevance (default), distance, rating, price (low to high), newest
- [ ] AC-3.5: Recent searches persist (authenticated: server-side; guest: localStorage)
- [ ] AC-3.6: Trending searches and popular businesses featured on empty state
- [ ] AC-3.7: Search results pagination: 20 items per page, infinite scroll on mobile
- [ ] AC-3.8: Search radius: default 5km, adjustable to 1/5/10/25/50km or "any distance"

---

### 4.4 Map-based Search

**Priority:** P0 — Critical

| Attribute | Detail |
|-----------|--------|
| Description | Visual geographic discovery of businesses |
| User Story | As a consumer, I want to see businesses near me on a map to choose conveniently |

**Acceptance Criteria:**
- [ ] AC-4.1: Interactive map (Google Maps / Mapbox) with business markers clustered at zoom levels
- [ ] AC-4.2: User location auto-detected with permission; fallback to city center
- [ ] AC-4.3: Map and list views are synchronized; selecting marker opens business card preview
- [ ] AC-4.4: Map bounds trigger new search query; debounced 300ms
- [ ] AC-4.5: Marker color indicates: open (green), closed (gray), fully booked (red), promotion active (gold)
- [ ] AC-4.6: "Near Me" button re-centers map to current location with loading state
- [ ] AC-4.7: Directions link opens native maps app with pre-filled destination

---

### 4.5 Business Detail View

**Priority:** P0 — Critical

| Attribute | Detail |
|-----------|--------|
| Description | Comprehensive business information and service offerings |
| User Story | As a consumer, I want complete business info to make informed booking decisions |

**Acceptance Criteria:**
- [ ] AC-5.1: Display: business name, photos (min 1, max 10), description, address, phone, website, hours
- [ ] AC-5.2: Real-time open/closed status based on current time and business hours
- [ ] AC-5.3: Service catalog with expandable categories; each service shows name, duration, price, description
- [ ] AC-5.4: Staff/professional list with photos, bios, specialties, and individual ratings
- [ ] AC-5.5: Aggregate rating (1-5 stars) with review count; breakdown by star rating
- [ ] AC-5.6: "Book Now" CTA prominent; deep links to specific service selection
- [ ] AC-5.7: Photo gallery with pinch-to-zoom, swipe navigation, full-screen view
- [ ] AC-5.8: Share business via native share sheet or copy link
- [ ] AC-5.9: Report business for inappropriate content (submits to admin review)

---

### 4.6 Service Categories

**Priority:** P1 — High

| Attribute | Detail |
|-----------|--------|
| Description | Hierarchical classification of services for discovery and organization |
| User Story | As a consumer, I want to browse by category to discover new services |

**Acceptance Criteria:**
- [ ] AC-6.1: Predefined categories: Hair, Nails, Facial, Massage, Barber, Spa, Wellness, Medical Aesthetic, Tattoo, Other
- [ ] AC-6.2: Subcategories: 2-level depth (e.g., Hair > Coloring, Cutting, Styling, Treatments)
- [ ] AC-6.3: Category icons from design system; consistent across all surfaces
- [ ] AC-6.4: Businesses can assign multiple categories; primary category featured
- [ ] AC-6.5: Category trending: surface rising categories based on booking volume
- [ ] AC-6.6: Admin can CRUD categories; changes reflect in search indexing within 5 minutes

---

### 4.7 Booking Flow

**Priority:** P0 — Critical

| Attribute | Detail |
|-----------|--------|
| Description | End-to-end appointment reservation with real-time availability |
| User Story | As a consumer, I want to book an appointment in minimal steps with clear confirmation |

**Acceptance Criteria:**
- [ ] AC-7.1: Step 1 — Select service(s); multi-service booking supported with total duration calculation
- [ ] AC-7.2: Step 2 — Select staff (optional "any" option) or auto-assigned based on availability
- [ ] AC-7.3: Step 3 — Select date; calendar view with availability indicators (fully booked, limited, good)
- [ ] AC-7.4: Step 4 — Select time slot from available options; slots computed in real-time (see 4.11)
- [ ] AC-7.5: Step 5 — Review booking summary with service, staff, date/time, price, cancellation policy
- [ ] AC-7.6: Step 6 — Payment (if required) or confirm (if free/no-deposit)
- [ ] AC-7.7: Booking confirmation with unique booking reference (alphanumeric, 8 chars), added to calendar
- [ ] AC-7.8: Slot held for 10 minutes during payment; released if payment not completed
- [ ] AC-7.9: Support for guest checkout (collect name, phone, email) with account creation prompt post-booking
- [ ] AC-7.10: Booking modification allowed up to defined cutoff (see 4.8)

---

### 4.8 Appointment Management

**Priority:** P0 — Critical

| Attribute | Detail |
|-----------|-------|
| Description | Consumer and business views of appointments with lifecycle actions |
| User Story | As a user, I want to manage my appointments and receive timely updates |

**Acceptance Criteria:**
- [ ] AC-8.1: Consumer "My Appointments" view: upcoming (sorted chronologically) and past tabs
- [ ] AC-8.2: Appointment statuses: Pending → Confirmed → Checked-in → Completed → No-show / Cancelled
- [ ] AC-8.3: Consumer can reschedule: allowed up to 24 hours before appointment; new slot availability checked
- [ ] AC-8.4: Consumer can cancel: free cancellation up to 24 hours; within 24 hours per business policy (displayed at booking)
- [ ] AC-8.5: Business owner sees appointment in their dashboard with consumer details
- [ ] AC-8.6: Business can mark: confirmed, checked-in, completed, no-show, cancelled (with reason)
- [ ] AC-8.7: Appointment reminders: push notification + SMS 24 hours and 1 hour before (configurable)
- [ ] AC-8.8: Add to calendar: iCal/Google Calendar integration from confirmation

---

### 4.9 Favorites

**Priority:** P1 — High

| Attribute | Detail |
|-----------|--------|
| Description | Save preferred businesses for quick access |
| User Story | As a consumer, I want to save businesses I like for faster future booking |

**Acceptance Criteria:**
- [ ] AC-9.1: Heart icon on business card and detail view toggles favorite status
- [ ] AC-9.2: Favorites list accessible from main navigation; empty state with discovery CTA
- [ ] AC-9.3: Favorites persist server-side for authenticated users; sync across devices
- [ ] AC-9.4: Guest favorites stored locally; prompt to login to persist on app close
- [ ] AC-9.5: Favorite businesses surface first in search results when relevant (boost factor)
- [ ] AC-9.6: Users receive optional notifications for favorites: new services, promotions, availability opens

---

### 4.10 User Profile

**Priority:** P1 — High

| Attribute | Detail |
|-----------|--------|
| Description | Manage personal information and preferences |
| User Story | As a user, I want to control my profile and app experience |

**Acceptance Criteria:**
- [ ] AC-10.1: Editable fields: name, phone, email, profile photo, birthday (optional, for birthday offers)
- [ ] AC-10.2: Change password with current password verification
- [ ] AC-10.3: Notification preferences: push, email, SMS — per type (bookings, promotions, reminders)
- [ ] AC-10.4: Payment methods: add, remove, set default (PCI-compliant tokenization)
- [ ] AC-10.5: Booking history with reorder/rebook functionality
- [ ] AC-10.6: Data export: download personal data (GDPR compliance)
- [ ] AC-10.7: Account deletion: self-service with 30-day grace period and confirmation email

---

### 4.11 Availability & Slot Computation

**Priority:** P0 — Critical

| Attribute | Detail |
|-----------|--------|
| Description | Real-time calculation of bookable time slots |
| User Story | As a consumer, I see accurate availability; as a business, my schedule is protected |

**Acceptance Criteria:**
- [ ] AC-11.1: Business defines: operating hours per day, break times, special dates (holidays/closed days)
- [ ] AC-11.2: Service duration + buffer time (configurable, default 0 min) defines slot consumption
- [ ] AC-11.3: Existing appointments block availability; no double-booking permitted
- [ ] AC-11.4: Slot computation accounts for staff-specific schedules and service-staff eligibility
- [ ] AC-11.5: "Booked" slots display as unavailable within 2 seconds of reservation
- [ ] AC-11.6: Slot generation: minimum 15-minute granularity; configurable by business (15/30/60 min)
- [ ] AC-11.7: Same-day booking cutoff: configurable (default 2 hours before closing)
- [ ] AC-11.8: Advance booking window: default 30 days, configurable by business (7-90 days)
- [ ] AC-11.9: Performance: slot query returns in <500ms for 30-day range

---

### 4.12 Shared Types & Design System

**Priority:** P0 — Critical

| Attribute | Detail |
|-----------|--------|
| Description | Consistent UI/UX foundation and type safety across platforms |
| User Story | As a developer, I need reusable components and typed contracts for reliable delivery |

**Acceptance Criteria:**
- [ ] AC-12.1: Design tokens: colors, typography (font family, sizes, weights), spacing scale, border radius, shadows
- [ ] AC-12.2: Component library: buttons, inputs, cards, modals, date picker, time slot selector, loading states, empty states
- [ ] AC-12.3: Shared TypeScript types: User, Business, Service, Appointment, Slot, Review, Payment — shared between frontend and API
- [ ] AC-12.4: Responsive breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px)
- [ ] AC-12.5: Accessibility: WCAG 2.1 AA minimum; focus management, alt text, color contrast, screen reader support
- [ ] AC-12.6: Dark mode support with system preference detection and manual override
- [ ] AC-12.7: Animation standards: 200ms transitions, meaningful motion (not decorative only)

---

### 4.13 Reviews & Ratings

**Priority:** P1 — High

| Attribute | Detail |
|-----------|--------|
| Description | Post-appointment feedback system |
| User Story | As a consumer, I want to share and read honest feedback about businesses |

**Acceptance Criteria:**
- [ ] AC-13.1: Eligibility: only verified customers who completed appointment can review (prevents fake reviews)
- [ ] AC-13.2: Rating: 1-5 stars with optional text review (max 500 characters)
- [ ] AC-13.3: Review prompt: push notification 2 hours after appointment completion
- [ ] AC-13.4: Business owner can respond publicly to reviews; response marked with owner badge
- [ ] AC-13.5: Reviews display: reviewer first name, date, rating, text, business response (if any)
- [ ] AC-13.6: Report review for: inappropriate content, spam, conflict of interest; admin review queue
- [ ] AC-13.7: Aggregate rating recalculated in real-time; cached for performance

---

### 4.14 Payment Integration

**Priority:** P0 — Critical

| Attribute | Detail |
|-----------|--------|
| Description | Secure payment processing for deposits and full payments |
| User Story | As a consumer, I want flexible payment options; as a business, I want reliable payouts |

**Acceptance Criteria:**
- [ ] AC-14.1: Payment methods: credit/debit cards (Stripe), Apple Pay, Google Pay
- [ ] AC-14.2: Payment models: full payment, deposit (fixed or percentage), or pay at venue (no online payment)
- [ ] AC-14.3: Business configurable: which model, deposit amount, cancellation/refund policy
- [ ] AC-14.4: Payment held in escrow; released to business 24 hours after appointment completion (or immediately for pay-at-venue)
- [ ] AC-14.5: Refund processing: automatic for consumer-canceled within policy; manual for disputes
- [ ] AC-14.6: Receipt emailed with booking confirmation; accessible in profile
- [ ] AC-14.7: Failed payment handling: 3 retry attempts, then booking released
- [ ] AC-14.8: PCI compliance: no card data stored; use Stripe Elements / Payment Intents

---

### 4.15 Notifications

**Priority:** P1 — High

| Attribute | Detail |
|-----------|--------|
| Description | Multi-channel user communication |
| User Story | As a user, I want timely updates through my preferred channels |

**Acceptance Criteria:**
- [ ] AC-15.1: Channels: push (Firebase Cloud Messaging), SMS (Twilio), email (SendGrid)
- [ ] AC-15.2: Notification types: booking confirmation, reminder (24h, 1h), modification, cancellation, promotion, review request
- [ ] AC-15.3: User preference management: opt-in/out per channel and type
- [ ] AC-15.4: Rich push: deep link to relevant screen, action buttons (confirm, reschedule, cancel where applicable)
- [ ] AC-15.5: Notification history: in-app inbox with 90-day retention
- [ ] AC-15.6: Delivery tracking: failed notifications retry with exponential backoff; alert admin for systemic failures

---

### 4.16 Provider / Business Owner Portal

**Priority:** P0 — Critical

| Attribute | Detail |
|-----------|--------|
| Description | Complete business management interface |
| User Story | As a business owner, I want to manage my presence, schedule, and grow my clientele |

**Acceptance Criteria:**
- [ ] AC-16.1: Dashboard: today's appointments, upcoming week overview, revenue metrics, new review alerts
- [ ] AC-16.2: Business profile management: all fields in 4.5 plus SEO description, social links, booking URL
- [ ] AC-16.3: Service management: CRUD services with name, description, duration, price, category, staff eligibility
- [ ] AC-16.4: Staff management: add team members with profiles, services they perform, individual schedules
- [ ] AC-16.5: Schedule management: set weekly hours, breaks, time off, special hours
- [ ] AC-16.6: Appointment calendar: day/week/month views; drag-to-reschedule, click to view details
- [ ] AC-16.7: Client management: view client list, booking history, notes (internal only), block client
- [ ] AC-16.8: Revenue reports: daily/weekly/monthly/annual with export (CSV/PDF)
- [ ] AC-16.9: Promotions: create discount codes, percentage/fixed amount, expiry, usage limits
- [ ] AC-16.10: Multi-location support: switch between business locations with consolidated reporting

---

### 4.17 Admin Dashboard

**Priority:** P2 — Medium

| Attribute | Detail |
|-----------|--------|
| Description | Platform governance and operational oversight |
| User Story | As an admin, I need visibility and control over platform health |

**Acceptance Criteria:**
- [ ] AC-17.1: User management: search, view, suspend/activate accounts; view activity logs
- [ ] AC-17.2: Business onboarding: review and approve new business registrations
- [ ] AC-17.3: Content moderation: review queue for reported businesses, reviews, images
- [ ] AC-17.4: Analytics: MAU, booking volume, GMV, conversion funnel, top categories, churn rate
- [ ] AC-17.5: Financial: transaction monitoring, refund processing, payout management to businesses
- [ ] AC-17.6: System health: API latency, error rates, queue depths, database performance
- [ ] AC-17.7: Role-based access: super admin, support agent, finance, content moderator

---

### 4.18 Background Jobs (BullMQ)

**Priority:** P1 — High

| Attribute | Detail |
|-----------|--------|
| Description | Reliable asynchronous task processing |
| User Story | As a system, I need resilient background processing for reliability and performance |

**Acceptance Criteria:**
- [ ] AC-18.1: Job types and processors:
  - Email sending (booking confirmations, reminders, marketing)
  - SMS sending (reminders, OTP)
  - Push notification delivery
  - Payment processing webhooks
  - Slot cache warming and invalidation
  - Report generation (daily/weekly/monthly)
  - Data export compilation
  - Image processing (resize, optimize uploads)
- [ ] AC-18.2: Retry policy: 3 attempts with exponential backoff (5s, 25s, 125s); dead letter queue after failure
- [ ] AC-18.3: Job prioritization: critical (payment, OTP) > high (notifications) > normal (reports) > low (analytics)
-:/// [ ] AC-18.4: Job scheduling: cron-based for recurring (daily reports, cache warming)
- [ ] AC-18.5: Observability: job success/failure metrics, processing time, queue depth alerts
- [ ] AC-18.6: Idempotency: duplicate job detection via unique job IDs for financial operations
- [ ] AC-18.7: Rate limiting: respect external API limits (SMS, email providers)

---

## 5. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | P95 API response <200ms; P99 <500ms; page load <3s on 4G |
| Scalability | Support 10,000 concurrent users; horizontal pod autoscaling |
| Security | OWASP Top 10 mitigation; dependency scanning; SAST/DAST in CI |
| Compliance | GDPR (EU), CCPA (CA); data retention policies; DPA with vendors |
| Reliability | 99.9% uptime SLA; graceful degradation; circuit breakers for external services |
| Localization | French (primary), English; extensible to German, Spanish, Italian |

---

## 6. Success Metrics (KPIs)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Monthly Active Users (MAU) | Growth 15% MoM | Analytics |
| Booking Conversion Rate | >8% | Bookings / Appointments page views |
| Search-to-Book Time | <3 minutes | Funnel analytics |
| Business NPS | >50 | Quarterly survey |
| App Store Rating | >4.5 stars | App stores |
| Payment Success Rate | >99% | Payment provider data |
| Customer Support Tickets | <1% of transactions | Support system |

---

## 7. Out of Scope (Future Phorities)

- AI-powered style recommendations
- Subscription/membership plans
- Group bookings
- In-app messaging between consumer and business
- Loyalty/rewards program
- Marketplace (product sales)
- Video consultations

---

## 8. Dependencies & Assum4.18 Background Jobs (BullMQ)

**Priority:** P1 — High

| Attribute | Detail |
|-----------|--------|
| Description | Reliable asynchronous task processing |
| User Story | As a system, I need resilient background processing for reliability and performance |

**Acceptance Criteria:**
- [ ] AC-18.1: Job types and processors:
  - Email sending (booking confirmations, reminders, marketing)
  - SMS sending (reminders, OTP)
  - Push notification delivery
  - Payment processing webhooks
  - Slot cache warming and invalidation
  - Report generation (daily/weekly/monthly)
  - Data export compilation
  - Image processing (resize, optimize uploads)
- [ ] AC-18.2: Retry policy: 3 attempts with exponential backoff (5s, 25s, 125s); dead letter queue after failure
- [ ] AC-18.3: Job prioritization: critical (payment, OTP) > high (notifications) > normal (reports) > low (analytics)
- [ ] AC-18.4: Job scheduling: cron-based for recurring (daily reports, cache warming)
- [ ] AC-18.5: Observability: job success/failure metrics, processing time, queue depth alerts
- [ ] AC-18.6: Idempotency: duplicate job detection via unique job IDs for financial operations
- [ ] AC-18.7: Rate limiting: respect external API limits (SMS, email providers)

---

## 5. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | P95 API response <200ms; P99 <500ms; page load <3s on 4G |
| Scalability | Support 10,000 concurrent users; horizontal pod autoscaling |
| Security | OWASP Top 10 mitigation; dependency scanning; SAST/DAST in CI |
| Compliance | GDPR (EU), CCPA (CA); data retention policies; DPA with vendors |
| Reliability | 99.9% uptime SLA; graceful degradation; circuit breakers for external services |
| Localization | French (primary), English; extensible to German, Spanish, Italian |

---

## 6. Success Metrics (KPIs)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Monthly Active Users (MAU) | Growth 15% MoM | Analytics |
| Booking Conversion Rate | >8% | Bookings / Appointments page views |
| Search-to-Book Time | <3 minutes | Funnel analytics |
| Business NPS | >50 | Quarterly survey |
| App Store Rating | >4.5 stars | App stores |
| Payment Success Rate | >99% | Payment provider data |
| Customer Support Tickets | <1% of transactions | Support system |

---

## 7. Out of Scope (Future Phases)

- AI-powered style recommendations
- Subscription/membership plans
- Group bookings
- In-app messaging between consumer and business
- Loyalty/rewards program
- Marketplace (product sales)
- Video consultations

---

## 8. Dependencies & Assumptions

| ID | Dependency / Assumption |
|----|------------------------|
| D1 | Stripe account for payment processing |
| D2 | Twilio account for SMS |
| D3 | Firebase project for push notifications |
| D4 | Google Maps / Mapbox API key for maps |
| D5 | SendGrid / similar for transactional email |
| D6 | Cloud storage (S3/Cloudflare R2) for image/video |
| A1 | Businesses have reliable internet for real-time calendar updates |
| A2 | Consumers prefer mobile app over web for booking |
| A3 | Beauty/wellness market has sufficient business density per geography |

---

## 9. Release Phasing

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | 4.1-4.2, 4.3 (basic), 4.5, 4.7 (single service), 4.8 (basic), 4.10, 4.11, 4.12, 4.16 (basic) | 8-10 weeks |
| V1 | Full 4.3, 4.4, 4.6, 4.7 (multi-service), 4.9, 4.13, 4.14, 4.15, 4.16 (full), 4.18 | +6 weeks |
| V2 | 4.17, advanced analytics, 4.16 (multi-location, promotions) | +6 weeks |
| V3+ | Out of scope features | TBD |

---

## 10. Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | Alex | | |
| Engineering Lead | | | |
| Design Lead | | | |
| QA Lead | | | |
