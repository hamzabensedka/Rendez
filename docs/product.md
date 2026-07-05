# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first platform connecting customers with beauty/wellness businesses for appointment booking. The product serves three user segments: **Customers** (book appointments), **Business Owners** (manage their business), and **Admins** (platform governance).

---

## 2. User Personas

| Persona | Description | Primary Goal |
|---------|-------------|--------------|
| **Customer** | End user seeking beauty/wellness services | Find, book, and manage appointments |
| **Guest** | Unregistered visitor | Browse businesses and services without commitment |
| **Business Owner** | Salon/spa/clinic owner or manager | Manage schedule, services, and clientele |
| **Admin** | Platform operator | Oversee platform health and user management |

---

## 3. Feature Specifications

### 3.1 User Authentication

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User** | Customer, Business Owner |

**Description:** Secure identity verification and session management for all registered users.

**Acceptance Criteria:**
- [ ] User can register with email, phone, or OAuth (Google, Apple, Facebook)
- [ ] Password must be minimum 8 characters with one uppercase, one number, one special character
- [ ] Phone verification via SMS OTP with 60-second resend capability
- [ ] JWT access token (15 min expiry) + refresh token (30 day expiry) with secure httpOnly cookie storage
- [ ] Password reset via email with secure token (1-hour expiry)
- [ ] Biometric login (Face ID / Touch ID / Fingerprint) supported on iOS and Android
- [ ] Session invalidation on logout from all devices option
- [ ] Rate limiting: 5 failed login attempts triggers 30-minute lockout
- [ ] Social login accounts can add password and email for dual authentication

---

### 3.2 Guest Browse & Explore

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User** | Guest, Customer |

**Description:** Unauthenticated access to browse businesses, view services, and explore availability without booking capability.

**Acceptance Criteria:**
- [ ] Guest can access search, categories, and business listings without login
- [ ] Guest can view business profiles, services, and real-time availability
- [ ] "Book Now" CTA prompts login/signup modal with preserved context (business, service, time pre-selected)
- [ ] Guest searches and filters stored in localStorage for 7 days; applied automatically post-login
- [ ] Maximum 10 business detail views per session before soft-login prompt
- [ ] Deep links from external sources (SMS, email, social) resolve correctly for guests

---

### 3.3 Business Search & Discovery

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User** | Customer, Guest |

**Description:** Intelligent search and filtering to help users find relevant businesses.

**Acceptance Criteria:**
- [ ] Full-text search across business name, service name, and description with typo tolerance (fuzzy matching, 2 edit distance)
- [ ] Autocomplete suggestions within 200ms with debounced input (300ms)
- [ ] Filters: category, price range, rating (minimum stars), distance (km/mi), availability (today, this week), amenities, gender (male/female/unisex)
- [ ] Sort options: relevance, distance, rating, price (low-high), availability (soonest)
- [ ] Search history saved for logged-in users (last 20 queries), deletable
- [ ] Popular/trending searches displayed when search input focused
- [ ] Results pagination: 20 items per page with infinite scroll on mobile
- [ ] Empty state with suggested alternatives when no results found
- [ ] Search analytics logged for business insights (anonymized)

---

### 3.4 Map-based Search

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User** | Customer, Guest |

**Description:** Geographic visualization of businesses with interactive exploration.

**Acceptance Criteria:**
- [ ] Map renders with user location as default center (with permission) or city center fallback
- [ ] Business markers cluster at zoom levels >10, individual markers at <=10
- [ ] Marker color indicates open (green), closing soon (orange), closed (gray), fully booked (red)
- [ ] Tap marker reveals business card with photo, name, rating, next available slot, and CTA
- [ ] User can drag map to explore; results list updates to visible bounds with 500ms debounce
- [ ] "Re-center to my location" button with permission re-request after denial
- [ ] Map and list views toggleable; preference persisted per user
- [ ] Directions integration (Google Maps, Apple Maps, Waze) for navigation to business
- [ ] Offline: cached map tiles for last viewed area, businesses still listable

---

### 3.5 Business Detail View

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User** | Customer, Guest |

**Description:** Comprehensive business profile with all information needed to make booking decision.

**Acceptance Criteria:**
- [ ] Hero section: business name, photos (up to 10, swipeable gallery), verified badge, favorite toggle
- [ ] Key info: address (with copy, directions), phone (with tap-to-call), hours (today + full week), website link
- [ ] Service menu organized by category with name, duration, description, and price
- [ ] Staff/professional list with photos, specialties, and individual availability
- [ ] Reviews summary (average, count, distribution) with 5 most recent reviews
- [ ] "Book" CTA pinned to bottom; opens service selection if not pre-selected
- [ ] Share functionality: native share sheet, copy link, or QR code
- [ ] Report business option for inappropriate content
- [ ] Page load time < 2s on 3G; skeleton loaders during fetch

---

### 3.6 Service Categories

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User** | Customer, Guest, Business Owner, Admin |

**Description:** Hierarchical classification system for services across the platform.

**Acceptance Criteria:**
- [ ] Two-level hierarchy: Category (e.g., Hair, Nails, Spa) → Subcategory (e.g., Haircut, Coloring, Styling)
- [ ] 15+ predefined categories with icons; admin can add custom categories
- [ ] Each business assigns services to at least one category/subcategory
- [ ] Category browsing from homepage with visual grid and search
- [ ] Category pages show featured businesses, trending services, and educational content
- [ ] SEO-optimized URLs and metadata for each category
- [ ] Category popularity metrics visible to admin for trend analysis

---

### 3.7 Booking Flow

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User** | Customer |

**Description:** Seamless multi-step process to reserve an appointment with a business.

**Acceptance Criteria:**
- [ ] **Step 1 — Service Selection:** User selects service(s); multi-service booking supported with automatic duration calculation and compatibility check
- [ ] **Step 2 — Professional Selection:** "Any available" or specific professional; shows next available per professional
- [ ] **Step 3 — Date & Time:** Calendar view with available slots highlighted; slot granularity matches business settings (15/30/60 min); timezone handled per business
- [ ] **Step 4 — Review & Confirm:** Summary of selections, price breakdown, cancellation policy, and terms acceptance
- [ ] **Step 5 — Payment:** See Payment Integration (3.14)
- [ ] Booking confirmation screen with calendar invite (.ics), add to phone calendar, and share options
- [ ] Booking held for 10 minutes during payment; released if payment fails or times out
- [ ] Guest checkout supported with email/phone collection; account auto-created post-booking with temp password
- [ ] All steps navigable back/forward with state preservation; abandoned cart recovery email after 1 hour
- [ ] Maximum booking window: 90 days in advance; minimum: 2 hours before (business-configurable)

---

### 3.8 Appointment Management

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User** | Customer, Business Owner |

**Description:** Lifecycle management of appointments from both customer and business perspectives.

**Customer Acceptance Criteria:**
- [ ] "My Appointments" list: upcoming (sorted by date) and past tabs
- [ ] Appointment card shows: business, service, professional, date/time, status, price, actions
- [ ] Actions per status: upcoming → reschedule, cancel (with policy display), add to calendar, get directions; past → rebook, review
- [ ] Reschedule: same flow as booking with original details pre-filled; new slot confirmed before original released
- [ ] Cancellation: reason collected (optional); refund processed per policy; instant notification to business
- [ ] Push and email reminders: 24 hours, 2 hours, and 15 minutes before appointment

**Business Owner Acceptance Criteria:**
- [ ] Calendar view (day/week/month) with appointment blocks
- [ ] Actions: confirm, decline (with reason), reschedule, mark no-show, mark complete, add notes
- [ ] Block time functionality for breaks, meetings, or unavailability
- [ ] Walk-in appointment creation for phone/in-person bookings
- [ ] Daily/weekly schedule export (PDF, CSV)

---

### 3.9 Favorites

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **User** | Customer |

**Description:** Save preferred businesses for quick access and personalized recommendations.

**Acceptance Criteria:**
- [ ] Heart icon toggles favorite status from any business card or detail page
- [ ] Favorites list accessible from profile; sortable by name, distance, or recently added
- [ ] Push notification when favorite business has new availability or promotion
- [ ] Favorite businesses prioritized in search results when relevant
- [ ] Sync across devices for logged-in users
- [ ] Maximum 200 favorites; prompt to organize/remove when approaching limit

---

### 3.10 User Profile

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **User** | Customer |

**Description:** Centralized user information and preferences management.

**Acceptance Criteria:**
- [ ] Profile photo, name, phone, email, date of birth, gender (optional)
- [ ] Notification preferences: push, email, SMS with granular controls (bookings, promotions, reminders)
- [ ] Payment methods: add, delete, set default; PCI-compliant tokenization only
- [ ] Addresses: home, work, other with geocoded coordinates
- [ ] Privacy settings: profile visibility, data download, account deletion (GDPR compliance)
- [ ] Referral code and credits tracking
- [ ] Booking history with filter by status, business, date range
- [ ] Loyalty program integration (stamps, points, tiers)

---

### 3.11 Availability & Slot Computation

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User** | System, Business Owner |

**Description:** Real-time calculation of bookable time slots based on complex business rules.

**Acceptance Criteria:**
- [ ] Business defines: operating hours per day, service durations, buffer time between appointments, slot intervals
- [ ] Professional-level availability overrides business defaults
- [ ] Existing appointments, blocked times, and recurring unavailability excluded from available slots
- [ ] Concurrent booking prevention via optimistic locking with Redis; race condition handling
- [ ] Slot computation API responds < 100ms for 30-day range
- [ ] Cache invalidation on any availability change (appointment created/cancelled, hours updated)
- [ ] Support for complex scenarios: multiple professionals, room/resources, service chaining
- [ ] Business can set: max advance booking window, min notice required, same-day booking cutoff
- [ ] Timezone-aware; handles daylight saving transitions correctly

---

### 3.12 Shared Types & Design System

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User** | Developers, Designers |

**Description:** Consistent visual language and reusable components across all platforms.

**Acceptance Criteria:**
- [ ] Design tokens: colors (primary #6C5CE7, secondary #00D2D3, semantic states), typography (Inter font family, 8-scale), spacing (4px grid), shadows, border-radius
- [ ] Component library: buttons, inputs, cards, modals, toasts, loaders, empty states, error boundaries
- [ ] Shared TypeScript types: User, Business, Service, Appointment, Slot, Payment, Review with strict null checks
- [ ] Responsive breakpoints: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)
- [ ] Accessibility: WCAG 2.1 AA minimum; screen reader support; keyboard navigation; focus management
- [ ] Dark mode support with system preference detection and manual toggle
- [ ] Animation standards: 200ms transitions, meaningful motion (not decorative), reduced-motion respect
- [ ] Icon system: consistent 24px base, stroke 2px, monochrome with color override capability

---

### 3.13 Reviews & Ratings

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **User** | Customer, Business Owner |

**Description:** Social proof system for service quality and business reputation.

**Acceptance Criteria:**
- [ ] Eligibility: only customers with completed appointments can review; 14-day window post-appointment
- [ ] Rating: 1-5 stars with half-star granularity; mandatory with optional text review (10-1000 characters)
- [ ] Categories: service quality, ambiance, value, punctuality (each 1-5)
- [ ] Photo/video attachments (up to 5, 10MB each); moderation queue for media
- [ ] Business owner response capability with notification to reviewer
- [ ] Review helpfulness voting; report for inappropriate content
- [ ] Average recalculated in real-time; weighted by recency (last 12 months weighted 2x)
- [ ] Sort reviews by: most relevant, newest, highest/lowest rating
- [ ] Fake review detection: velocity checks, pattern analysis, manual review queue

---

### 3.14 Payment Integration

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User** | Customer, Business Owner, Admin |

**Description:** Secure, multi-provider payment processing for appointments.

**Acceptance Criteria:**
- [ ] Providers: Stripe (primary), PayPal, Apple Pay, Google Pay; modular architecture for additional providers
- [ ] Payment flows: immediate charge, authorize-then-capture (24h default), deposit with balance due
- [ ] Full refund, partial refund, and no-show charge (configurable percentage) supported
- [ ] Receipts: email and in-app with transaction ID, breakdown, and business details
- [ ] Failed payment: 3 retry attempts with user notification; booking released after final failure
- [ ] PCI compliance: no card data stored; tokenization only
- [ ] Business payout: weekly to connected Stripe account with dashboard visibility
- [ ] Platform fee: configurable percentage deducted per transaction; visible to admin

---

### 3.15 Notifications

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **User** | Customer, Business Owner |

**Description:** Multi-channel communication for appointment lifecycle and engagement.

**Acceptance Criteria:**
- [ ] Channels: push (Firebase Cloud Messaging), SMS (Twilio), email (SendGrid), in-app inbox
- [ ] Triggered notifications: booking confirmed, reminder (24h, 2h, 15min), modified, cancelled, completed, review request
- [ ] Marketing: promotional offers, new services from favorites, re-engagement (30/60/90 day inactive)
- [ ] Business notifications: new booking, cancellation, review received, low availability warning
- [ ] User-controlled preferences per channel and category; global unsubscribe for marketing
- [ ] Notification history: 90 days in-app; deep link to relevant content
- [ ] Delivery tracking: sent, delivered, opened metrics; retry logic for failed deliveries
- [ ] Localization: content translated per user locale; time formatted to user timezone

---

### 3.16 Provider / Business Owner Portal

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User** | Business Owner |

**Description:** Dedicated interface for business management and operations.

**Acceptance Criteria:**
- [ ] Dashboard: today's appointments, revenue (today/this week/this month), occupancy rate, new reviews, quick actions
- [ ] Business profile management: photos, description, hours, services, staff, policies
- [ ] Service management: CRUD with pricing, duration, description, online booking toggle
- [ ] Staff management: invite by email, role assignment (owner, manager, staff), permission levels, individual schedules
- [ ] Client management: customer database with visit history, notes, contact info; import/export CSV
- [ ] Analytics: appointment volume, revenue trends, cancellation rate, popular services, peak hours; date range filter; exportable
- [ ] Settings: payment account connection, notification preferences, booking rules, cancellation policy, integrations
- [ ] Mobile-responsive web app; native app feature parity where applicable

---

### 3.17 Admin Dashboard

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **User** | Admin |

**Description:** Platform governance and operational oversight.

**Acceptance Criteria:**
- [ ] User management: search, view, suspend, delete; filter by role, status, registration date
- [ ] Business management: onboarding workflow, verification status, feature flags, suspension, deletion
- [ ] Content moderation: review queue for reported content; bulk actions; audit log
- [ ] Financial overview: platform revenue, transaction volume, payout status, refund tracking
- [ ] Analytics: MAU, booking conversion funnel, retention cohorts, geographic distribution
- [ ] System health: API latency, error rates, queue depth, database performance; alerting thresholds
- [ ] Role-based access control (RBAC): super admin, support agent, finance, marketing with granular permissions
- [ ] Audit logging: all admin actions timestamped with before/after state

---

### 3.18 Background Jobs (BullMQ)

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **User** | System |

**Description:** Reliable asynchronous processing for time-consuming or scheduled operations.

**Acceptance Criteria:**
- [ ] Job types and priorities:
  - **High:** Payment processing, booking confirmation (critical path)
  - **Medium:** Notification delivery, email sending, SMS dispatch
  - **Low:** Analytics aggregation, report generation, data exports, image optimization
- [ ] Retry policy: immediate retry ×3, then exponential backoff (5 min, 15 min, 1 hour, 4 hours, max 5 attempts); dead letter queue after exhaustion
- [ ] Job scheduling: cron patterns for daily reports, weekly digests, data cleanup
- [ ] Monitoring: job completion rate, average processing time, failed job count with alerting
- [ ] Concurrency control: per-queue worker limits; priority queue preemption
- [ ] Idempotency: duplicate job detection via unique job IDs; safe re-execution
- [ ] Redis-backed with persistence; graceful shutdown with in-progress job completion

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | API p95 < 200ms; page load < 2s on 3G; 99.9% uptime SLA |
| **Security** | OWASP Top 10 mitigation; encryption at rest and in transit; annual penetration testing |
| **Scalability** | Horizontal scaling to 10M users; database sharding strategy; CDN for static assets |
| **Compliance** | GDPR, CCPA, PCI-DSS Level 1; SOC 2 Type II roadmap |
| **Accessibility** | WCAG 2.1 AA; screen reader tested; keyboard-only navigation verified |

---

## 5. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Guest Browse, Search, Map, Business Detail, Booking Flow, Appointment Mgmt, Availability, Payments, Business Portal | Q1 |
| **V1.1** | Favorites, Reviews, Notifications, User Profile | Q2 |
| **V1.2** | Admin Dashboard, Analytics, Background Jobs optimization | Q2-Q3 |
| **V2.0** | AI recommendations, loyalty program, marketplace expansions | Q4 |

---

## 6. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion rate | > 15% |
| Search-to-booking | > 8% |
| Monthly active users (MAU) | Growth 20% MoM |
| Business retention | > 90% at 6 months |
| App store rating | > 4.5 stars |
| Customer support tickets | < 2% of bookings |
| Payment success rate | > 98% |

---

*Document version: 1.0*
*Last updated: 2024*
*Owner: Alex, Product Owner*