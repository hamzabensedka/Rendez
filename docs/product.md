# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first platform connecting customers with beauty, wellness, and service professionals for appointment booking. The product serves three user segments: **Customers** (book appointments), **Providers/Business Owners** (manage availability and bookings), and **Admin** (platform oversight).

## 2. Design Principles

- **Friction-first reduction**: Minimize taps to book
- **Trust through transparency**: Reviews, real-time availability, clear pricing
- **Mobile-native**: Touch-optimized, gesture-based, offline-aware
- **Accessibility**: WCAG 2.1 AA compliance for all interfaces

---

## 3. Feature Specifications

### 3.1 User Authentication

**Priority**: P0 — Critical Path

**Description**: Secure, multi-method authentication with persistent sessions.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| AUTH-001 | Email/password registration | Valid email format, password ≥8 chars with 1 uppercase, 1 number, 1 special char; email verification required before booking |
| AUTH-002 | Social login (Google, Apple) | OAuth 2.0 + Apple Sign-In; account linking if email matches existing account |
| AUTH-003 | Phone number authentication | SMS OTP with 60s resend cooldown; max 3 attempts per hour |
| AUTH-004 | Biometric login (Face ID/Touch ID) | Offer after first successful password login; fallback to PIN/password |
| AUTH-005 | Persistent sessions | Refresh token rotation; force re-auth after 30 days idle |
| AUTH-006 | Password recovery | Secure token via email, 1-hour expiry; invalidate previous tokens on new request |
| AUTH-007 | Account deletion (GDPR) | Self-service deletion with 30-day grace period; data purge confirmation email |

**Non-functional**: JWT access tokens (15min expiry), httpOnly cookies for web; Secure Enclave/Keychain for mobile tokens.

---

### 3.2 Guest Browse & Explore

**Priority**: P0 — Critical Path

**Description**: Unauthenticated discovery to reduce barrier to entry and improve SEO.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| GBR-001 | Browse without login | View businesses, services, reviews, and availability without account |
| GBR-002 | Booking prompt at conversion point | Interstitial login modal triggered on "Book" tap; preserve booking context post-auth |
| GBR-003 | Location-based defaulting | IP geolocation with permission fallback; manual city selector |
| GBR-004 | Deep link preservation | Guest URLs with booking intent redirect to completed flow post-authentication |

---

### 3.3 Business Search & Discovery

**Priority**: P0 — Critical Path

**Description**: Multi-faceted search with intelligent ranking and filtering.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| SEA-001 | Text search | Search by business name, service name, or professional name; typo tolerance (fuzzy matching); autocomplete <200ms |
| SEA-002 | Filter: Service category | Hierarchical categories (Hair, Nails, Massage, etc.) with subcategory drill-down |
| SEA-003 | Filter: Price range | Min/max slider; respect service-level pricing |
| SEA-004 | Filter: Availability | "Available today/this week" toggle; respects real-time slot data |
| SEA-005 | Filter: Rating | Minimum star threshold (4.0+, 4.5+) |
| SEA-006 | Filter: Distance | Radius selector (1km–50km); default 5km |
| SEA-007 | Sort options | Relevance, distance, rating, price (low-high), availability (soonest) |
| SEA-008 | Search history | Persist last 10 searches; suggest recent on tap |
| SEA-009 | Trending searches | Admin-curated or algorithmic trending queries |

**Algorithm**: Elasticsearch/OpenSearch with custom scoring: availability weight + rating decay + proximity boost + completion rate.

---

### 3.4 Map-based Search

**Priority**: P0 — Critical Path

**Description**: Visual spatial exploration with seamless list/map toggle.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| MAP-001 | Interactive map | Google Maps/Mapbox; custom pins colored by category; cluster at zoom <12 |
| MAP-002 | User location | Blue dot with accuracy ring; follow mode option |
| MAP-003 | Business pins | Tap to show card preview (name, rating, price from, next availability); tap card → detail |
| MAP-004 | Boundary search | Pan/zoom triggers re-query; debounce 300ms |
| MAP-005 | List overlay | Bottom sheet with swipeable list; peek height shows 3 items; expand to full |
| MAP-006 | Directions | Native maps app deep link (Google Maps, Apple Maps, Waze) |

---

### 3.5 Business Detail View

**Priority**: P0 — Critical Path

**Description**: Comprehensive business profile driving conversion.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| BDV-001 | Hero section | Cover image carousel (max 10); business name, verified badge, overall rating, review count |
| BDV-002 | Quick actions | Call, message, share, save to favorites, get directions |
| BDV-003 | Service menu | Grouped by category; expandable items show description, duration, price, practitioner if applicable |
| BDV-004 | Availability preview | "Next available: Today at 2:30 PM" or date picker for specific day |
| BDV-005 | Team section | Staff profiles with photos, specialties, ratings; filter services by practitioner |
| BDV-006 | Business info | Address, hours (with live open/closed status), amenities, COVID protocols, parking info |
| BDV-007 | Reviews summary | Aggregate rating, distribution histogram, keyword tags ("clean", "professional", "wait time") |
| BDV-008 | Similar businesses | "You may also like" carousel based on category + proximity |

---

### 3.6 Service Categories

**Priority**: P0 — Critical Path

**Description**: Hierarchical taxonomy for discoverability and business organization.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| CAT-001 | Category hierarchy | 3-level max: Domain (Beauty) → Category (Hair) → Subcategory (Coloring) |
| CAT-002 | Category icons | Consistent iconography per category; SVG, themeable |
| CAT-003 | Business category assignment | Business can have 1 primary + up to 3 secondary categories |
| CAT-004 | Service-to-category mapping | Each service maps to exactly one subcategory; inherits category icon |
| CAT-005 | Category landing pages | SEO-optimized pages for top categories; featured businesses, trending services |
| CAT-006 | Admin category management | CRUD with icon upload; merge/split with migration tools |

**Initial categories**: Hair, Nails, Face & Skin, Massage, Body, Makeup, Tattoos & Piercing, Barbershop, Spa & Wellness, Medical Aesthetic.

---

### 3.7 Booking Flow

**Priority**: P0 — Critical Path

**Description**: Streamlined multi-step reservation with minimal abandonment.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| BOK-001 | Service selection | Tap service from menu; show variants (e.g., "Short Hair", "Long Hair") if_optional |
| BOK-002 | Practitioner selection | "Any available" default; list staff with next availability; show staff calendar |
| BOK-003 | Date/time selection | Horizontal date strip (7 days forward); time slots in grid; scroll to load more dates |
| BOK-004 | Slot display | Show duration; buffer time hidden from user; grey out unavailable; highlight preferred times (morning/afternoon/evening) |
| BOK-005 | Guest information | Name, phone, email (pre-filled if logged in); optional notes field (max 500 chars) |
| BOK-006 | Add-ons/upsells | Optional extras (e.g., deep conditioning, nail art) with price; tap to add |
| BOK-007 | Promo code | Input field; validate in real-time; show discount breakdown |
| BOK-008 | Payment selection | Stored cards, new card, Apple Pay/Google Pay, pay in person (if business allows) |
| BOK-009 | Booking confirmation | Summary screen with cancel/edit policy; tap to confirm; immediate confirmation number |
| BOK-010 | Confirmation screen | Success animation; add to calendar; share; directions; "Manage booking" CTA |

**Flow optimization**: <4 taps from service selection to confirmation for returning users with saved payment.

---

### 3.8 Appointment Management

**Priority**: P0 — Critical Path

**Description**: Lifecycle management for customer bookings.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| APT-001 | Upcoming appointments | List view with date grouping; swipe actions (reschedule, cancel) |
| APT-002 | Appointment detail | Full info: QR code for check-in, directions, contact, cancel/reschedule buttons |
| APT-003 | Reschedule | Same business/service; show available slots; old slot released only after new confirmed |
| APT-004 | Cancellation | Policy check (e.g., 24hr minimum); refund flow if prepaid; push notification confirmations |
| APT-005 | Past appointments | History with rebook CTA; prompt review if unrated |
| APT-006 | No-show handling | Business marks no-show; customer notified; strike policy (3 strikes = deposit required) |
| APT-007 | Waitlist | Join waitlist for full slots; auto-book on cancellation with 15-min confirmation window |

---

### 3.9 Favorites

**Priority**: P1 — High

**Description**: Save and organize preferred businesses for quick rebooking.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| FAV-001 | Save/unsave | Heart toggle on business card and detail; haptic feedback |
| FAV-002 | Favorites list | Grid/list view; sort by recently saved, name, or next availability |
| FAV-003 | Quick rebook | "Book again" button using last service/practitioner; pre-fill preferences |
| FAV-004 | Availability notifications | Opt-in alert when favorite has new availability in next 48h |
| FAV-005 | Sync | Cross-device favorites; handle business deletion gracefully |

---

### 3.10 User Profile

**Priority**: P1 — High

**Description**: Customer identity, preferences, and account management.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| PRF-001 | Profile basics | Photo, name, phone, email; editable with verification for email/phone changes |
| PRF-002 | Saved payment methods | PCI-compliant token storage; default payment method; expiry alerts |
| PRF-003 | Notification preferences | Push, SMS, email toggles per type (bookings, promotions, reminders) |
| PRF-004 | Privacy settings | Profile visibility (public/private review name); data download request |
| PRF-005 | Dependents/family | Add profiles for children/spouse; book on their behalf; separate notification routing |
| PRF-006 | Loyalty/rewards | Points balance, tier status, transaction history, available rewards |
| PRF-007 | Referral program | Unique code, share sheet, track referrals, reward redemption |

---

### 3.11 Availability & Slot Computation

**Priority**: P0 — Critical Path

**Description**: Real-time, accurate availability engine powering all booking surfaces.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| SLT-001 | Business hours | Weekly recurring schedule + exceptions (holidays, closures) |
| SLT-002 | Staff schedules | Individual availability, breaks, time off; override business hours |
| SLT-003 | Service duration | Base duration + variable add-ons; buffer between appointments (configurable) |
| SLT-004 | Slot generation | Compute available start times respecting: staff schedule, existing bookings, service duration, buffers, concurrent service limits |
| SLT-005 | Real-time updates | Slot availability invalidates and refreshes within 3 seconds of booking/cancellation |
| SLT-006 | Timezone handling | All times stored in UTC; display in business timezone; handle DST transitions |
| SLT-007 | Complex rules | Support: double-booking prevention, equipment constraints, service chaining (e.g., color + cut), room allocation |
| SLT-008 | Cache strategy | Redis cache with TTL; stale-while-revalidate for high-traffic businesses |

**Algorithm**: Interval tree or bitmap-based slot computation; pre-compute next 7 days, on-demand beyond.

---

### 3.12 Shared Types & Design System

**Priority**: P0 — Enabler

**Description**: Consistent, reusable components and type definitions across platforms.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| DS-001 | Design tokens | Colors, typography (font family, sizes, weights), spacing scale, border radius, shadows |
| DS-002 | Component library | Buttons, inputs, cards, modals, bottom sheets, date pickers, loading states, empty states, error states |
| DS-003 | Platform parity | iOS, Android, Web share 95%+ component logic; platform-appropriate adaptations (e.g., Android back button) |
| DS-004 | TypeScript definitions | Shared package for API contracts, domain models, validation schemas (Zod) |
| DS-005 | Theme support | Light/dark mode; brand color injection for white-label |
| DS-006 | Accessibility | Minimum 44x44pt touch targets; screen reader labels; color contrast 4.5:1 minimum |
| DS-007 | Animation standards | 200ms default transitions; spring physics for gestures; reduce motion respect |

---

### 3.13 Reviews & Ratings

**Priority**: P1 — High

**Description**: Social proof system with integrity controls.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| REV-001 | Review eligibility | Only verified customers (completed appointment) can review; 14-day window post-appointment |
| REV-002 | Rating breakdown | 1–5 stars; mandatory for review; optional per-category ratings (cleanliness, service, value) |
| REV-003 | Review content | Text (max 1000 chars), photos (max 5); profanity filter; photo moderation queue |
| REV-004 | Business response | Public reply capability; notification to reviewer |
| REV-005 | Review helpfulness | Mark helpful/not helpful; sort by helpfulness or recency |
| REV-006 | Dispute process | Business can flag review for moderation; admin adjudication |
| REV-007 | Review aggregation | Overall rating = weighted average (recency-weighted, minimum 5 reviews for precision) |
| REV-008 | Incentivization | Prompt review with gentle nudge; prohibit quid pro quo (monitored) |

---

### 3.14 Payment Integration

**Priority**: P0 — Critical Path

**Description**: Secure, flexible payment processing with multi-provider support.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| PAY-001 | Payment methods | Cards (Visa, MC, Amex), Apple Pay, Google Pay, PayPal; SEPA for EU |
| PAY-002 | Payment timing | Pay in full, deposit (configurable %), or pay at business (business-configurable) |
| PAY-003 | Split payments | Multiple services across providers in single transaction |
| PAY-004 | Refunds | Full/partial refunds; automatic per cancellation policy; manual admin override |
| PAY-005 | Payouts | Daily/weekly/monthly to business bank account; payout dashboard for providers |
| PAY-006 | Fees | Transparent fee display; platform fee + payment processing fee |
| PAY-/script-007 | PCI compliance | No raw card data touches servers; Stripe Elements or equivalent |
| PAY-008 | Invoice/receipt | Email receipt; VAT/GST compliant invoice on request |

**Providers**: Stripe primary; Adyen for EU expansion; PayPal optional.

---

### 3.15 Notifications

**Priority**: P1 — High

**Description**: Multi-channel, preference-respectful communication system.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| NOT-001 | Push notifications | Booking confirmations, reminders (24h, 1h before), cancellations, waitlist offers, promotions |
| NOT-002 | SMS fallback | For critical alerts if push not delivered within 5 minutes; configurable opt-in |
| NOT-003 | Email | Rich HTML for confirmations; plain text for receipts; digest for promotions |
| NOT-004 | In-app inbox | Persistent notification history; unread badge; deep link to relevant screen |
| NOT-005 | Preference management | Granular opt-in/opt-out per channel and category |
| NOT-006 | Delivery reliability | Idempotent notification creation; retry with exponential backoff; delivery tracking |
| NOT-007 | Rich push | Images, action buttons ("Confirm", "Reschedule", "Cancel") on iOS and Android |

---

### 3.16 Provider / Business Owner Portal

**Priority**: P0 — Critical Path

**Description**: Comprehensive business management web app.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| POR-001 | Dashboard | Today's appointments, revenue snapshot, occupancy rate, upcoming week preview |
| POR-002 | Calendar view | Day/week/month views; drag-to-reschedule; color-coded by status; conflict warnings |
| POR-003 | Appointment actions | Confirm, reschedule, cancel, mark no-show, add walk-in; bulk actions |
| POR-004 | Service management | CRUD services with variants, pricing, duration, description, photos |
| POR-005 | Staff management | Add staff, set schedules, assign services, manage permissions (owner/manager/staff) |
| POR-006 | Availability rules | Set weekly hours, breaks, time off; recurring and one-time exceptions |
| POR-007 | Client database | Searchable CRM; notes, visit history, preferences, contact; exportable |
| POR-008 | Revenue reporting | Daily/weekly/monthly revenue; by service, staff, payment method; CSV export |
| POR-009 | Settings | Business info, photos, cancellation policy, payment preferences, integrations |
| POR-010 | Mobile companion app | Core functions: calendar, notifications, quick client add |

---

### 3.17 Admin Dashboard

**Priority**: P1 — High

**Description**: Platform oversight and operational management.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| ADM-001 | Business onboarding | KYC verification workflow; document upload; approval/rejection with notes |
| ADM-002 | Business management | Search, filter, suspend, feature, or remove businesses |
| ADM-003 | User management | Customer search, account actions (suspend, delete), support impersonation (audit logged) |
| ADM-004 | Content moderation | Review flagged reviews, business photos, user-generated content; moderation queue with SLA |
| ADM-005 | Financial oversight | Transaction monitoring, dispute resolution, refund approval, payout tracking |
| ADM-006 | Analytics | MAU, booking volume, GMV, conversion funnel, churn rate; cohort analysis |
| ADM-007 | System health | Queue depths, error rates, API latency; alerting thresholds |
| ADM-008 | Promotions | Create coupon codes, featured placement, push campaign targeting |

---

### 3.18 Background Jobs (BullMQ)

**Priority**: P1 — High

**Description**: Reliable, observable asynchronous job processing.

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| JOB-001 | Job types | Reminder notifications, email sends, payment webhooks, report generation, data exports, search index updates, image processing |
| JOB-002 | Queue organization | Separate queues by priority and type; named queues for observability |
| JOB-003 | Retry policy | Exponential backoff (1min, 2min, 4min, 8min, 16min); max 5 attempts; dead letter queue |
| JOB-004 | Job scheduling | Cron-based recurring jobs; delayed jobs for future execution |
| JOB-005 | Concurrency control | Rate-limited workers; job-specific concurrency settings |
| JOB-006 | Observability | Job success/failure metrics in monitoring dashboard; error alerting; job tracing |
| JOB-007 | Idempotency | Duplicate job detection via idempotency keys; safe re-execution |
| JOB-008 | Stalled job recovery | Automatic detection and re-queue of stalled jobs after timeout |

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | App cold start <2s; screen transition <100ms; API p95 <200ms; search <300ms |
| Availability | 99.9% uptime; scheduled maintenance windows with advance notice |
| Security | OWASP Top 10 mitigation; annual penetration testing; SOC 2 Type II target |
| Privacy | GDPR/CCPA compliant; data processing agreements; cookie consent |
| Scalability | Horizontal scaling; database read replicas; CDN for assets |
| Localization | Phase 1: EN, FR, ES, DE; RTL support planned; currency and date localization |

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion (visit → book) | >8% |
| Search-to-book time | <3 minutes |
| App store rating | >4.5 stars |
| Day-7 retention | >30% |
| Business NPS | >50 |
| Customer support tickets per 1000 bookings | <5 |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Guest browse, Search, Map, Business detail, Service categories, Booking flow, Appointment mgmt, Slot computation, Design system, Payment, Provider portal basics | Month 1–3 |
| V1 | Favorites, Profile, Reviews, Notifications, Background jobs | Month 4–5 |
| V2 | Admin dashboard, Loyalty,feed, Waitlist, Advanced analytics, i18n expansion | Month 6–8 |

---

*Document version: 1.0*
*Last updated: [Current Date]*
*Owner: Alex, Product Owner*