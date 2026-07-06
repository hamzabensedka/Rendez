# Planity Clone — Product Specification

## 1. Overview

A mobile-first platform connecting clients with local beauty & wellness businesses for appointment booking. Two-sided marketplace: consumers discover and book services; business owners manage their calendar, services, and presence.

---

## 2. Personas

| Persona | Goals | Pain Points |
|---------|-------|-------------|
| **Client** | Find, compare, and book appointments quickly | No visibility into real-time availability; phone tag with salons |
| **Business Owner** | Fill empty slots; reduce no-shows; manage schedule | Overbooked managing calls; fragmented tools |
| **Admin** | Platform health, fraud detection, support | Manual intervention on disputes |

---

## 3. Feature Specifications

### 3.1 User Authentication

**Priority:** P0 — Critical Path

**Description:** Secure identity system supporting multiple entry points with progressive profiling.

**Acceptance Criteria:**
- [ ] User can register with email + password, phone + OTP, or OAuth (Google, Apple)
- [ ] Password must enforce: 8+ chars, 1 uppercase, 1 number, 1 special character
- [ ] Email verification required before booking; phone verification acceptable for browsing
- [ ] JWT access token (15min expiry) + refresh token (7 days) with secure httpOnly cookie storage
- [ ] Rate limit: 5 login attempts per IP per 15 minutes
- [ ] Account lockout after 3 failed OTP attempts
- [ ] "Continue as Guest" option available on all entry points; guest session stored for 24 hours
- [ ] Progressive profiling: collect birthday, preferred categories post-registration
- [ ] Biometric login (Face ID/Touch ID) enabled after first successful password login
- [ ] Account deletion flow compliant with GDPR/CCPA (30-day soft delete, then hard delete)

**Out of Scope:** Social graph, referral codes (v2)

---

### 3.2 Guest Browse & Explore

**Priority:** P0 — Discovery Funnel

**Description:** Unauthenticated users can explore the platform to reduce friction before commitment.

**Acceptance Criteria:**
- [ ] Guest can view business listings, search, filter, and see business details without login
- [ ] Guest can view service menus, pricing, and availability (but not book)
- [ ] Guest sees persistent banner: "Sign in to book" with CTA
- [ ] Guest's search parameters and viewed businesses retained for 24 hours post-session
- [ ] Upon registration, guest history merged to authenticated account
- [ ] Guest cannot: leave reviews, favorite businesses, or access booking flow beyond slot viewing
- [ ] App store compliance: guest flow must demonstrate core functionality without account creation

---

### 3.3 Business Search & Discovery

**Priority:** P0 — Core Value Proposition

**Description:** Intelligent search with multi-dimensional filtering and ranking.

**Acceptance Criteria:**
- [ ] Text search across: business name, service name, staff name, address keywords
- [ ] Auto-complete with typo tolerance (fuzzy matching, Levenshtein distance ≤ 2)
- [ ] Search results ranked by: relevance score, proximity, rating, availability within 48hrs, promoted status
- [ ] Filters: category (multi-select), price range, rating (4.0+, 4.5+), availability (today, this week), gender (if applicable), accessibility
- [ ] Sort options: Recommended (default), Distance, Rating, Price (low-high), Most Reviewed
- [ ] Empty state with suggested nearby alternatives when no results match
- [ ] Recent searches stored (last 10); trending searches surfaced to new users
- [ ] Search debounced at 300ms; results loaded in < 500ms (p95)

---

### 3.4 Map-based Search

**Priority:** P0 — Spatial Discovery

**Description:** Interactive map interface for geographic exploration of businesses.

**Acceptance Criteria:**
- [ ] Map defaults to user's current location (with permission) or last searched location
- [ ] Business pins clustered at zoom levels; individual pins at street level
- [ ] Pin color coding: open now (green), closed (gray), fully booked today (orange), promoted (star icon)
- [ ] Bottom sheet with list view syncs with visible map bounds
- [ ] User can drag map to search "this area"; explicit button to re-center on current location
- [ ] Tap pin reveals business card with: photo, name, rating, next available slot, distance
- [ ] Card tap navigates to Business Detail View
- [ ] Map style: light mode default, follows app theme setting
- [ ] Accessibility: pins have alt text; screen reader announces cluster count

---

### 3.5 Business Detail View

**Priority:** P0 — Conversion Page

**Description:** Comprehensive business profile driving booking conversion.

**Acceptance Criteria:**
- [ ] Hero: up to 10 photos/videos in swipeable carousel; business name, category, rating, review count
- [ ] Quick actions: Call, Directions (deep link to maps), Share, Favorite
- [ ] Operating hours with "Open now" / "Closes at X" / "Closed" status
- [ ] About section: description, amenities, languages spoken, COVID/safety protocols
- [ ] Services tab: grouped by category, each with duration, price, description, selectable for booking
- [ ] Team tab: staff profiles with photos, specialties, ratings
- [ ] Reviews tab: sortable (newest, highest, lowest), filterable (with photos, verified visits)
- [ ] Availability preview: next 3 available slots across next 7 days
- [ ] "Book Now" CTA sticky at bottom; disabled if no availability in next 30 days
- [ ] Similar businesses carousel at bottom

---

### 3.6 Service Categories

**Priority:** P0 — Taxonomy Foundation

**Description:** Hierarchical classification system for services and businesses.

**Acceptance Criteria:**
- [ ] Top-level categories: Hair, Nails, Face, Body, Massage, Wellness, Medical Aesthetics, Fitness
- [ ] Each category has: icon, display name, slug, description, SEO metadata
- [ ] Subcategories (2 levels deep): e.g., Hair > Coloring > Balayage
- [ ] Business can be tagged with multiple categories; primary category determines main listing
- [ ] Category pages: featured businesses, trending services, educational content
- [ ] Admin-configurable: category visibility, sort order, promotional badges
- [ ] Category analytics: search volume, conversion rate, supply-demand gap

---

### 3.7 Booking Flow

**Priority:** P0 — Revenue Critical

**Description:** Streamlined multi-step reservation process minimizing abandonment.

**Acceptance Criteria:**
- [ ] Step 1 — Service Selection: user selects service(s); multi-service booking supported; duration auto-calculated
- [ ] Step 2 — Staff Selection: "No preference" or specific staff; shows staff availability; staff-specific pricing if applicable
- [ ] Step 3 — Date/Time: calendar view (7-day rolling); time slots in 15-min increments; slots filtered by business hours and existing bookings
- [ ] Step 4 — Review: summary of selections, cancellation policy, price breakdown
- [ ] Step 5 — Payment/Confirmation: see Payment Integration; booking confirmed only after successful hold/charge
- [ ] Post-booking: calendar invite (.ics), add to native calendar option, share booking details
- [ ] Booking modification allowed up to defined cutoff (business-configurable, default 24hrs)
- [ ] Abandoned booking recovery: push notification at 1hr, 24hr if items in cart
- [ ] Flow completion rate target: > 70%

---

### 3.8 Appointment Management

**Priority:** P0 — Post-Booking Experience

**Description:** Full lifecycle management of client appointments.

**Acceptance Criteria:**
- [ ] Upcoming appointments: chronological list, grouped by date, with countdown to next appointment
- [ ] Appointment card shows: business name, service, staff, time, status, actions (reschedule, cancel)
- [ ] Statuses: Confirmed, Pending (payment), Checked-in, In-Progress, Completed, Cancelled, No-show
- [ ] Reschedule: re-enters booking flow with pre-filled selections; new slot availability checked in real-time
- [ ] Cancel: reason capture (required); refund policy applied automatically; notification to business
- [ ] Rebook: one-tap rebooking of same service with any available staff
- [ ] Appointment history: searchable, filterable by status, date range
- [ ] Receipt/invoice generation for completed appointments; downloadable PDF
- [ ] Late arrival policy: auto-notify business if user indicates delay via app

---

### 3.9 Favorites

**Priority:** P1 — Engagement & Retention

**Description:** Save and organize preferred businesses for quick re-access.

**Acceptance Criteria:**
- [ ] Heart icon on business cards, detail view, and search results; toggles favorite state
- [ ] Favorites list: grid/list view, sortable (recently added, alphabetical, nearest)
- [ ] Favorite businesses surface first in search results when relevance is tied
- [ ] Push notification when favorited business has: new availability, price change, or promotion
- [ ] Collections: user-created named lists (e.g., "Hair coloring options", "Weekend spas")
- [ ] Maximum 500 favorites per user; unlimited collections
- [ ] Sync favorites across devices; handle merge conflicts (latest timestamp wins)

---

### 3.10 User Profile

**Priority:** P1 — Personalization

**Description:** Central hub for user identity, preferences, and account management.

**Acceptance Criteria:**
- [ ] Profile photo, name, phone, email, birthday (for birthday offers)
- [ ] Preferred notification channels: push, SMS, email (granular per type)
- [ ] Preferred language, currency (if multi-region), distance unit
- [ ] Accessibility preferences: reduce motion, high contrast, screen reader optimizations
- [ ] Privacy settings: profile visibility (public/private), data download, account deletion
- [ ] Referral code and sharing
- [ ] Linked payment methods management
- [ ] Activity summary: total bookings, favorite categories, money saved (vs walk-in)

---

### 3.11 Availability & Slot Computation

**Priority:** P0 — Technical Foundation

**Description:** Real-time, accurate availability calculation supporting complex business rules.

**Acceptance Criteria:**
- [ ] Slot generation based on: business hours, staff schedules, service duration, buffer time, existing bookings
- [ ] Staff can have: recurring weekly schedule, exceptions (time off), blockouts, reduced hours
- [ ] Service dependencies: some services require specific staff certification or equipment
- [ ] Concurrent booking limits: room-based, equipment-based, or staff-based constraints
- [ ] Buffer time: configurable between appointments (default 0, 5, 10, 15 min)
- [ ] Slot caching: Redis with 5-second TTL; invalidation on any schedule change
- [ ] Last-slot cutoff: prevent bookings within X hours of appointment start (business-configurable)
- [ ] Timezone handling: all storage in UTC; display in business-local timezone; handle DST transitions
- [ ] Performance: slot query for 30-day window returns in < 100ms

---

### 3.12 Shared Types & Design System

**Priority:** P0 — Engineering Efficiency

**Description:** Consistent UI/UX primitives and type-safe shared definitions.

**Acceptance Criteria:**
- [ ] Design tokens: colors (semantic: primary, success, warning, danger, neutral scale), typography (font families, sizes, weights), spacing (4px grid), shadows, border-radius
- [ ] Component library: Button, Input, Select, DatePicker, TimeSlot, BusinessCard, Avatar, Rating, Badge, Skeleton, EmptyState, ErrorBoundary
- [ ] Theme support: light, dark, system-follow; persisted preference
- [ ] Shared TypeScript types: Business, Service, Staff, Appointment, User, Payment, Review — versioned in shared package
- [ ] API contract types: request/response schemas shared between frontend and backend
- [ ] Icon system: Lucide-based, consistent sizing (16, 20, 24, 32), color inheritance
- [ ] Animation standards: 200ms default duration, ease-out for entrances, ease-in for exits

---

### 3.13 Reviews & Ratings

**Priority:** P1 — Trust & Discovery

**Description:** Authenticated feedback system driving quality assurance.

**Acceptance Criteria:**
- [ ] Eligibility: only verified clients (completed appointment) can review; review window: 7 days post-appointment
- [ ] Rating dimensions: Overall (1-5), Service Quality, Ambiance, Staff Professionalism, Value for Money
- [ ] Review content: text (10-1000 chars), up to 5 photos; AI content moderation for policy violations
- [ ] Business owner response: within 30 days; response editable; notification to reviewer
- [ ] Review helpfulness: upvote/downvote; sorted by helpfulness
- [ ] Flag system: users can flag inappropriate reviews; admin queue for review
- [ ] Aggregate metrics: average per dimension, distribution histogram, trend over time
- [ ] Review incentive: optional small discount on next booking (business-funded, admin-configurable)
- [ ] Anti-gaming: velocity limits (max 1 review per business per 30 days), device fingerprinting, pattern detection

---

### 3.14 Payment Integration

**Priority:** P0 — Revenue Collection

**Description:** Secure, flexible payment processing with multi-provider support.

**Acceptance Criteria:**
- [ ] Supported methods: credit/debit cards (Stripe), Apple Pay, Google Pay, PayPal; region-specific methods (SEPA, iDEAL) in v2
- [ ] Payment flows: pay in full, deposit (partial payment), pay at venue (no pre-payment)
- [ ] Business-configurable: which methods accepted, cancellation/refund policy, no-show fee
- [ ] Strong Customer Authentication (SCA) compliance for EU; 3D Secure triggered appropriately
- [ ] Receipt: email + in-app; includes business VAT info if applicable
- [ ] Refund processing: automatic (per policy) or manual (admin/business initiated); partial refunds supported
- [ ] Failed payment handling: 3 retry attempts with exponential backoff; notify user and business
- [ ] Payout scheduling: business receives funds T+2 (configurable: daily, weekly, monthly)
- [ ] PCI compliance: no card data stored; tokenization via Stripe; annual audit

---

### 3.15 Notifications

**Priority:** P1 — Engagement & Operations

**Description:** Multi-channel, preference-aware communication system.

**Acceptance Criteria:**
- [ ] Channels: push (Firebase/OneSignal), SMS (Twilio), email (SendGrid), in-app inbox
- [ ] Categories: booking confirmations, reminders (24hr, 1hr), changes, promotions, system
- [ ] User preference controls: per-channel opt-in/out, per-category muting, quiet hours (default 22:00-08:00)
- [ ] Rich push: deep links to relevant screens; action buttons (confirm, reschedule, cancel)
- [ ] Reminder logic: timezone-aware; if user has checked in, suppress reminder
- [ ] Delivery tracking: sent, delivered, opened metrics; retry failed deliveries
- [ ] Rate limiting: max 3 promotional notifications per user per day
- [ ] Preference update API: real-time sync across devices

---

### 3.16 Provider / Business Owner Portal

**Priority:** P0 — Supply Side

**Description:** Comprehensive web-based tool for business operations management.

**Acceptance Criteria:**
- [ ] Dashboard: today's bookings, revenue snapshot, occupancy rate, upcoming week preview
- [ ] Calendar view: day/week/month; drag-to-reschedule; color-coded by status
- [ ] Service management: CRUD services, pricing, duration, buffer, online booking visibility
- [ ] Staff management: profiles, schedules, permissions (admin, scheduler, read-only), commission tracking
- [ ] Client management: client list, visit history, notes (HIPAA-aware), marketing opt-in status
- [ ] Booking rules: cancellation policy, lead time, max advance booking, waitlist settings
- [ ] Promotions: create discount codes, flash sales, package deals
- [ ] Reports: revenue, bookings by service/staff, no-show rate, new vs. returning clients; CSV export
CSV export
- [ ] Mobile-responsive: core functions usable on tablet/phone

---

### 3.17 Admin Dashboard

**Priority:** P1 — Platform Operations

**Description:** Internal tool for marketplace health, support, and governance.

**Acceptance Criteria:**
- [ ] Business onboarding: application review, document verification, approval workflow
- [ ] User support: search users, view booking history, issue refunds, impersonate (with audit log)
- [ ] Content moderation: review flagged reviews, businesses, photos; takedown with reason
- [ ] Fraud detection: anomaly alerts (booking patterns, payment disputes, review manipulation)
- [ ] Financial oversight: transaction ledger, payout status, dispute management, chargeback tracking
- [ ] Analytics: MAU, booking volume, GMV, CAC, LTV, churn rate, category performance
- [ ] System health: API latency, error rates, queue depths, third-party service status
- [ ] Role-based access: super admin, support agent, finance, read-only analyst

---

### 3.18 Background Jobs (BullMQ)

**Priority:** P0 — System Reliability

**Description:** Asynchronous task processing for scalability and reliability.

**Acceptance Criteria:**
- [ ] Job types: notification dispatch, email sending, SMS sending, payment webhooks, report generation, data exports, search index updates, image processing, cleanup tasks
- [ ] Queue configuration: Redis-backed; separate queues by priority and type; named queues for observability
- [ ] Retry policy: exponential backoff, max 3 attempts for most jobs; dead letter queue for failures
- [ ] Job idempotency: unique job IDs; duplicate detection and rejection
- [ ] Scheduling: cron-based for recurring (daily reports, nightly cleanup); delayed jobs for future events (appointment reminders)
- [ ] Concurrency limits: per-queue worker count configurable; rate limiting for external APIs (SMS, email)
- [ ] Monitoring: job completion rate, average duration, failure rate, queue depth; alerting on anomalies
- [ ] Graceful shutdown: finish in-progress jobs before worker termination; SIGTERM handling

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | App cold start < 3s; screen load < 1.5s; API p95 < 200ms |
| Availability | 99.9% uptime; maintenance windows announced 48hrs ahead |
| Security | OWASP Top 10 mitigation; annual penetration test; bug bounty program |
| Compliance | GDPR, CCPA, PCI-DSS Level 1 |
| Accessibility | WCAG 2.1 AA; screen reader support; minimum touch target 44x44dp |
| Localization | French (default), English, Spanish, German; RTL in v2 |

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Monthly Bookings | Growth 20% MoM (first 6 months) |
| Booking Conversion | > 15% search-to-book |
| NPS | > 50 for clients, > 40 for businesses |
| App Store Rating | > 4.5 stars |
| Support Tickets | < 2% of transactions |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | 3.1-3.5, 3.7, 3.11, 3.12, 3.14, 3.16, 3.18 | Month 1-2 |
| v1.1 | 3.6, 3.8, 3.9, 3.10, 3.13, 3.15 | Month 3 |
| v1.2 | 3.17, analytics, promotions engine | Month 4 |
| v2.0 | Multi-region, subscriptions, loyalty program | Month 6 |

---

*Document version: 1.0 | Last updated: 2024 | Owner: Alex (Product)*