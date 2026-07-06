# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a multi-platform appointment booking marketplace connecting consumers with local service businesses (salons, barbers, spas, clinics). The platform serves three user segments: **Consumers** (book appointments), **Providers/Business Owners** (manage business, staff, and availability), and **Admin** (platform governance). This specification covers all features required for MVP and post-MVP phases.

---

## 2. Feature Specifications

### 2.1 User Authentication

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 — MVP |
| **Owner** | Consumer, Provider, Admin |

**Description:** Secure identity management across all user types with role-based access control.

**Acceptance Criteria:**
- [ ] Consumers can register with email/password, Google OAuth, or Apple Sign-In
- [ ] Providers register via dedicated onboarding flow with business verification
- [ ] Passwords enforce NIST guidelines (min 8 chars, complexity check, breach detection via Have I Been Pwned API)
- [ ] JWT access tokens (15-min expiry) with refresh token rotation
- [ ] Email verification required before booking; providers require manual admin approval
- [ ] Password reset flow: email link expires in 1 hour
- [ ] Account lockout after 5 failed attempts, 30-minute cooldown
- [ ] Multi-factor authentication optional for providers
- [ ] Session management: list active sessions, revoke remotely

---

### 2.2 Guest Browse & Explore

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 — MVP |
| **Owner** | Guest (unauthenticated) |

**Description:** Full discovery experience without registration barrier, with conversion points to authenticate at booking.

**Acceptance Criteria:**
- [ ] Homepage displays featured businesses, trending categories, promotional banners
- [ ] Location auto-detection via IP; manual city/zip override
- [ ] Guest can browse search results, view business profiles, see services and prices
- [ ] Guest can view real-time availability (read-only)
- [ ] "Book Now" CTA triggers authentication modal with pre-filled booking details
- [ ] Guest session data (selected services, time) persists through login
- [ ] No booking allowed without account; no favorites without account

---

### 2.3 Business Search & Discovery

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 — MVP |
| **Owner** | Consumer, Guest |

**Description:** Intelligent search with filtering, sorting, and personalization to match consumers with relevant businesses.

**Acceptance Criteria:**
- [ ] Full-text search across business name, service names, descriptions, staff names
- [ ] Autocomplete with suggestions: businesses, services, neighborhoods (debounced 200ms)
- [ ] Filters: category, price range, rating (min stars), distance radius, availability today/open now, gender of staff, amenities (parking, wheelchair accessible, etc.)
- [ ] Sort options: relevance (default), distance, rating, price (low-high), most reviewed
- [ ] Search result cards show: thumbnail, business name, rating, review count, starting price, distance, next available slot, "Book" CTA
- [ ] Pagination: 20 results per page, infinite scroll on mobile
- [ ] Recent searches persisted locally; tap to re-run
- [ ] Search analytics logged for personalization engine

---

### 2.4 Map-based Search

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 — MVP |
| **Owner** | Consumer, Guest |

**Description:** Visual geographic exploration with clustered markers and seamless list-map interaction.

**Acceptance Criteria:**
- [ ] Interactive map (Google Maps or Mapbox) with business markers
- [ ] Marker clustering for dense areas; cluster count displayed
- [ ] Tap marker: bottom sheet with business preview (name, rating, price, next availability)
- [ ] "Re-center to my location" button with permission handling
- [ ] Map bounds trigger dynamic result loading (debounced 300ms)
- [ ] Split view on tablet/desktop: list left, map right; synced scroll/highlight
- [ ] Map style matches app design system (custom POI filtering)
- [ ] Accessibility: screen reader announces marker count, business name on selection

---

### 2.5 Business Detail View

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 — MVP |
| **Owner** | Consumer, Guest |

**Description:** Comprehensive business profile designed to convert browsers into bookers.

**Acceptance Criteria:**
- [ ] Hero: image carousel (up to 10 photos), business name, verified badge, overall rating, favorite toggle
- [ ] Info section: address with directions link, hours (today's hours highlighted), phone, website, social links
- [ ] Services tab: categorized list with name, duration, description, price; "Book" per service
- [ ] Staff tab: profiles with photo, cascades to staff-specific booking
- [ ] Reviews tab: sortable (newest, highest, lowest), filter by service, photos, owner response
- [ ] About tab: business description, amenities list, COVID/safety protocols, languages spoken
- [ ] Sticky bottom bar with "Book Appointment" CTA
- [ ] Deep linking: `/business/:slug` shareable, SEO-optimized meta tags
- [ ] Page load < 2s; skeleton screens during fetch

---

### 2.6 Service Categories

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 — MVP |
| **Owner** | Consumer, Provider, Admin |

**Description:** Hierarchical classification system for services enabling discovery and business organization.

**Acceptance Criteria:**
- [ ] Admin-managed category tree: root categories (Hair, Nails, Spa, Medical, etc.) → subcategories (up to 3 levels)
- [ ] Each category has: name, slug, icon, description, SEO metadata
- [ ] Businesses assign services to categories; services inherit category for discovery
- [ ] Category pages: curated business lists, trending services, editorial content
- [ ] Category browsing from homepage with visual grid
- [ ] Category suggestions during business onboarding
- [ ] Analytics: popular categories, conversion by category

---

### 2.7 Booking Flow

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 — MVP |
| **Owner** | Consumer |

**Description:** Friction-reduced multi-step booking with real-time availability and clear confirmation.

**Acceptance Criteria:**
- [ ] Step 1 — Service Selection: pre-selected if from business page; multi-service booking supported
- [ ] Step 2 — Staff Selection: "Any available" or specific staff; show staff photos, ratings, next availability
- [ ] Step 3 — Date/Time: calendar view with available slots highlighted; slot granularity matches service duration; timezone handling
- [ ] Step 4 — Review: summary with service, staff, date/time, location, price breakdown (subtotal, tax, fees)
- [ ] Step 5 — Payment/Confirmation: payment method selection (if required), terms acceptance, book
- [ ] Real-time slot locking: 10-minute hold on selected slot, released if payment abandoned
- [ ] Booking confirmation: in-app, email, SMS; calendar invite (.ics) attachment
- [ ] Rescheduling: modify date/time/staff up to cutoff (business-defined, default 2 hours before)
- [ ] Cancellation: consumer-initiated with refund policy display; no-show tracking
- [ ] Guest checkout: email/phone capture, account creation offer post-booking

---

### 2.8 Appointment Management

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 — MVP |
| **Owner** | Consumer, Provider |

**Description:** Complete lifecycle management for appointments from both consumer and provider perspectives.

**Acceptance Criteria:**
- [ ] Consumer dashboard: upcoming (next 7 days highlighted), past, cancelled tabs
指向
- [ ] Appointment card: service, business, staff, date/time, status badge, actions (reschedule, cancel, rebook, review)
- [ ] Statuses: Pending → Confirmed → Checked-in → Completed → No-show → Cancelled
- [ ] Provider calendar: day/week/month views, drag-drop rescheduling, conflict detection
- [ ] Provider can: confirm pending bookings, mark no-show, add notes, apply discounts
- [ ] Waitlist: notify when preferred slot opens; auto-book option
- [ ] Bulk actions: provider can block time, set recurring unavailability
- [ ] Export: provider calendar sync (Google Calendar, Outlook)

---

### 2.9 Favorites

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 — Post-MVP |
| **Owner** | Consumer |

**Description:** Personal curation for quick re-booking and engagement.

**Acceptance Criteria:**
- [ ] Toggle favorite from business card, detail page, or post-appointment prompt
- [ ] Favorites list: sortable (recently added, name, nearest), searchable
- [ ] Favorite businesses show "Next available" slot inline
- [ ] Push notification: "Your favorite [Business] has availability tomorrow"
- [ ] Quick re-book: one-tap to previous service/staff
- [ ] Sync across devices; survive app reinstall (account-linked)
- [ ] Suggested favorites based on booking history

---

### 2.10 User Profile

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 — MVP |
| **Owner** | Consumer, Provider |

**Description:** Identity and preference hub for personalized experience.

**Acceptance Criteria:**
- [ ] Consumer profile: photo, name, phone, email, birthday (for offers), preferred notification channels
- [ ] Booking preferences: default reminder time, preferred staff (if any), payment methods
- [ ] Booking history: full list, filter by status/date/business, download receipts
- [ ] Loyalty: points balance, tier status, available rewards
- [ ] Provider profile: business info, team management, payout settings, notification preferences
- [ ] Data export: GDPR-compliant full data download
- [ ] Account deletion: self-service with 30-day grace period, confirmation required

---

### 2.11 Availability & Slot Computation

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 — MVP |
| **Owner** | System, Provider |

**Description:** Core scheduling engine computing bookable slots from complex business rules.

**Acceptance Criteria:**
- [ ] Business hours: recurring weekly schedule + exception dates (holidays, closures)
- [ ] Staff schedules: individual working hours, breaks, time off requests
- [ ] Service duration: base duration + buffer (cleanup, prep); variable durations supported
- [ ] Slot generation: compute intersections of business hours, staff availability, service duration, existing bookings
- [ ] Buffer rules: gap between appointments (0-30 min configurable), max advance booking (e.g., 3 months), min advance (e.g., 2 hours)
- [ ] Concurrent bookings: multiple staff, rooms, or equipment — resource conflict detection
- [ ] Performance: slot query < 200ms for 30-day window; cached with Redis, invalidated on schedule change
- [ ] Timezone: all stored in UTC; displayed in user's locale; DST handling
- [ ] Override: admin can manually create/block slots; audit logged

---

### 2.12 Shared Types & Design System

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 — MVP |
| **Owner** | Design, Engineering |

**Description:** Consistent visual language and type safety across platforms.

**Acceptance Criteria:**
- [ ] Design tokens: colors (semantic: primary, success, warning, error), typography (font family, 6 scale sizes), spacing (4px base grid), shadows, border radius
- [ ] Component library: buttons (6 variants), inputs, selects, modals, toasts, cards, calendars, time pickers, skeletons
- [ ] Shared TypeScript types: all API contracts, domain models, DTOs in shared package
- [ ] Zod schemas for runtime validation; mirror of TypeScript interfaces
- [ ] Responsive breakpoints: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)
- [ ] Dark mode support: full theme variant, system preference detection, manual toggle
- [ ] Accessibility: WCAG 2.1 AA minimum; focus management, ARIA labels, color contrast 4.5:1, reduced motion support
- [ ] Localization: i18n framework, RTL layout support, date/number/currency formatting

---

### 2.13 Reviews & Ratings

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 — Post-MVP |
| **Owner** | Consumer, Provider |

**Description:** Social proof system with moderation and business response capabilities.

**Acceptance Criteria:**
- [ ] Review eligibility: consumer can review after completed appointment; 14-day window
- [ ] Rating: 1-5 stars (overall), optional sub-ratings (cleanliness, service, value, atmosphere)
- [ ] content: text (max 500 chars), photo upload (up to 5, 5MB each)
- [ ] Moderation: auto-flag profanity, images; manual admin review queue; business can flag for re-review
- [ ] Business response: public reply, notification to reviewer; editable within 24 hours
- [ ] Review display: verified badge (completed booking), helpfulness voting, sorted by relevance (default) or recency
- [ ] Rating recalculation: weighted average, updated nightly or on new review
- [ ] Fake review detection: ML model flags suspicious patterns (same device, rapid reviews, text similarity)

---

### 2.14 Payment Integration

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 — MVP (deposit); P1 (full pre-pay) |
| **Owner** | Consumer, Provider, System |

**Acceptance Criteria:**
- [ ] Payment methods: credit/debit (Stripe), Apple Pay, Google Pay, PayPal
- [ ] Pricing models: free booking, deposit (fixed or percentage), full pre-payment
- [ ] Service fees: platform fee (configurable %), payment processing fee (pass-through or absorbed)
- [ ] Payouts: to provider bank account (Stripe Connect), weekly auto-payout or manual request
- [ ] Refunds: full/partial/no refund per business policy; admin override; automated for cancellations within policy
- [ ] Invoicing: itemized receipt, tax calculation, business VAT/GST support
- [ ] Failed payment: 3 retry attempts, consumer notification, booking held temporarily
- [ ] PCI compliance: no card data stored; Stripe Elements for card input

---

### 2.15 Notifications

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 — MVP (email, push); P1 (SMS, in-app) |
| **Owner** | Consumer, Provider |

**Acceptance Criteria:**
- [ ] Channels: email (SendGrid), push (Firebase Cloud Messaging), SMS (Twilio), in-app notification center
- [ ] Consumer triggers: booking confirmed, reminder (24h, 2h before), rescheduled, cancelled, review request, promotion from favorite, waitlist available
- [ ] Provider triggers: new booking, cancellation, review received, payout initiated, low inventory alert
- [ ] Preferences: granular opt-in/out per channel and trigger type
- [ ] Templates: brand-consistent, localized, variable substitution
- [ ] Delivery tracking: opened, clicked, bounced; retry logic for failures
- [ ] Rate limiting: max 1 SMS per 4 hours per user; digest mode for non-urgent

---

### 2.16 Provider / Business Owner Portal

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 — MVP |
| **Owner** | Provider |

**Description:** Comprehensive business management dashboard for operations and growth.

**Acceptance Criteria:**
- [ ] Dashboard: today's bookings, revenue this week/month, occupancy rate, new reviews, quick actions
- [ ] Calendar: drag-drop appointment management, staff view toggle, print view
- [ ] Services: CRUD services, pricing, duration, category assignment, pause/unpause
- [ ] Staff: add team members, set permissions (view only, manage own, full admin), schedule templates
- [ ] Clients: CRM with visit history, notes, allergies/preferences, marketing opt-in status
- [ ] Analytics: booking volume, revenue, no-show rate, popular services/staff, customer retention (cohort analysis)
- [ ] Settings: business info, hours, booking policies, cancellation rules, payment settings, integrations
- [ ] Mobile-responsive; native app companion (P1)

---

### 2.17 Admin Dashboard

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 — Post-MVP |
| **Owner** | Admin |

**Acceptance Criteria:**
- [ ] User management: consumer/provider search, suspend/activate, impersonation for support
- [ ] Business verification: review submitted documents (license, ID), approve/reject with notes
- [ ] Content moderation: flagged reviews, reported businesses, image content review
- [ ] Financial: transaction ledger, dispute handling, refund approval, provider payout monitoring
- [ ] Platform analytics: MAU, booking volume, GMV, churn, top categories/geographies
- [ ] Configuration: category management, fee structures, promotional campaigns, feature flags
- [ ] Audit log: all admin actions, immutable, searchable, exportable

---

### 2.18 Background Jobs (BullMQ)

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 — MVP |
| **Owner** | System |

**Description:** Reliable async processing for time-consuming or scheduled operations.

**Acceptance Criteria:**
- [ ] Job types: email sending, push notification delivery, SMS sending, slot cache warming, report generation, data export, image processing (resize, optimize), search index updates, recurring: daily summary emails, weekly provider reports, nightly analytics aggregation
- [ ] Retry policy: 3 attempts with exponential backoff; dead letter queue for failures
- [ ] Job priorities: critical (payments), high (notifications), normal (reports), low (analytics)
- [ ] Monitoring: job count, processing time, failure rate, queue depth alerts
- [ ] Concurrency: configurable workers per queue; rate limit sensitive operations (SMS, email)
- [ ] Scheduled jobs: cron syntax support, timezone-aware, daylight saving handling
- [ ] Job idempotency: deduplication key prevents duplicate processing

---

## 3. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | API p95 < 200ms; page load < 2s; 99.9% uptime SLA |
| **Security** | OWASP Top 10 mitigation; encryption at rest (AES-256) and in transit (TLS 1.3); quarterly penetration testing |
| **Scability** | Horizontal scaling via Kubernetes; auto-scaling on CPU/memory; CDN for static assets |
| **Compliance** | GDPR, CCPA, PCI-DSS Level 1; SOC 2 Type II target within 12 months |
| **Analytics** | Amplitude/Mixpanel for product analytics; Datadog for infrastructure monitoring |

---

## 4. Release Phases

| Phase | Features | Timeline |
|-------|--------|----------|
| **Alpha** | Auth, Guest Browse, Search, Business Detail, Booking Flow (basic), Provider Portal (basic) | Month 1-2 |
| **Beta** | Map Search, Appointment Mgmt, Favorites, Notifications, Payment (deposit) | Month 3 |
| **MVP Launch** | Full feature set P0, Reviews, Admin Dashboard v1 | Month 4-5 |
| **Post-MVP** | Loyalty, Native apps, Advanced analytics, Marketplace features | Month 6+ |

---

*Document version: 1.0 | Last updated: [Date] | Owner: Alex, Product Owner*