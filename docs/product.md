# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a marketplace platform connecting customers with beauty/wellness businesses for appointment booking. The platform serves three user types: **Customers** (book appointments), **Business Owners** (manage their business and appointments), and **Admin** (platform oversight).

---

## 2. User Personas

| Persona | Goals | Pain Points |
|---------|-------|-------------|
| **Customer** | Find, compare, and book services quickly | No visibility into real-time availability |
| **Business Owner** | Fill calendar, reduce no-shows, manage online presence | Manual booking management, double-bookings |
| **Admin** | Ensure platform health, onboard businesses, resolve disputes | Fraud, quality control, payment issues |

---

## 3. Feature Specifications

### 3.1 User Authentication
**Priority:** P0 (Critical)

| Aspect | Specification |
|--------|---------------|
| **Description** | Secure identity verification for all user types |
| **Methods** | Email/password, Google OAuth, Apple Sign-In |
| **Flows** | Registration, login, password reset, email verification, logout |
| **Security** | JWT access + refresh tokens, HTTP-only cookies, rate limiting (5 attempts/15 min) |

**Acceptance Criteria:**
- [ ] New users can register with email (valid format, unique, password: min 8 chars, 1 uppercase, 1 number, 1 special char)
- [ ] OAuth users auto-register on first login; can link email/password later
- [ ] Password reset sends time-limited (1 hour) secure link via email
- [ ] Email verification required before booking; resend allowed every 60 seconds
- [ ] Tokens refresh automatically; users stay logged in for 30 days
- [ ] Concurrent session limit: 5 per user; oldest session invalidated
- [ ] Account lockout after 5 failed attempts, unlock via email or 24-hour auto-reset

---

### 3.2 Guest Browse & Explore
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Description** | Unauthenticated access to browse businesses and services |
| **Scope** | View business listings, search, filters, business profiles, reviews (read-only) |
| **Limitations** | Booking, favorites, and appointment management require authentication |

**Acceptance Criteria:**
- [ ] Guest users can access all browse and search functionality without login
- [ ] Guest users prompted to log in at booking initiation (with pre-filled data preserved post-auth)
- [ ] Guest search history stored in localStorage; merged to account upon login
- [ ] No personalized recommendations for guests; show trending/popular instead

---

### 3.3 Business Search & Discovery
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Description** | Find businesses via text search with intelligent matching |
| **Searchable Fields** | Business name, service names, descriptions, tags, address, provider names |
| **Algorithm** | PostgreSQL full-text search + trigram similarity; fallback to ILIKE for partial matches |
| **Ranking** | Relevance score: exact name match > service match > description match > tag match |

**Acceptance Criteria:**
- [ ] Search returns results within 500ms for queries under 50 characters
- [ ] Empty state shown with popular searches and nearby suggestions
- [ ] Typo tolerance: "hair saloon" matches "hair salon" (trigram similarity > 0.3)
- [ ] Recent searches stored (last 10), deletable by user
- [ ] Search suggestions appear after 2 characters with debounce 200ms

---

### 3.4 Map-based Search
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Description** | Visual geographic exploration of businesses |
| **Provider** | Mapbox GL JS |
| **Features** | Clustering at zoom < 12, individual pins at zoom >= 12, bounds-based fetching, user geolocation |

**Accept{{Acceptance Criteria:**
- [ ] Map initializes to user location (with permission) or city center; fallback to Paris
- [ ] Pins update within 300ms of map movement (debounced 300ms)
- [ ] Pin click opens bottom sheet with business name, rating, price range, next available slot
- [ ] Cluster click zooms to expand cluster; max cluster size displayed
- [ ] List view toggle available; syncs with map bounds
- [ ] Geolocation error handling: permission denied → manual search prompt; timeout → cached location

---

### 3.5 Business Detail View
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Description** | Comprehensive business profile with all booking-relevant information |
| **Sections** | Hero images, business info, services, availability, reviews, location, similar businesses |
| **Images** | Up to 10 per business; gallery with pinch-zoom, swipe navigation |

**Acceptance Criteria:**
- [ ] Page loads core content in < 1.5s; images lazy-loaded with blur placeholder
- [ ] "Book" CTA sticky at bottom on mobile; prominent on desktop
- [ ] Business hours displayed in user's timezone; closed days clearly marked
- [ ] Phone/email actions use native handlers (tel:, mailto:)
- [ ] Share functionality generates deep link with preview image
- [ ] Offline: cached business data viewable; booking CTA disabled with "Go online to book" message

---

### 3.6 Service Categories
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Description** | Hierarchical classification of services for discovery and filtering |
| **Hierarchy** | Category → Subcategory → Service (e.g., Hair → Coloring → Balayage) |
| **Attributes** | Name, description, duration, base price, variable pricing (by provider), category assignment |

**Acceptance Criteria:**
- [ ] Categories displayed as horizontal scroll on homepage; expandable on search
- [ ] Multi-select category filtering with OR logic
- [ ] Category badge shown on business cards and detail pages
- [ ] Services sortable by: popularity, price (low-high), duration, name
- [ ] Price display: "From €X" if variable pricing; exact if fixed

---

### 3.7 Booking Flow
**Priority:** P0 (Critical)

| Aspect | Specification |
|--------|---------------|
| **Description** | End-to-end appointment reservation with real-time availability |
| **Steps** | Select service → Select provider (optional) → Select date/time → Confirm details → Payment (if required) → Confirmation |
| **Constraints** | Respect business hours, provider schedules, buffer times, existing bookings |

**Acceptance Criteria:**
- [ ] Service selection shows duration, price, description; allows add-ons
- [ ] Provider selection: "Any available" or specific; shows ratings and next availability
- [ ] Date picker: defaults to earliest available; disabled dates = fully booked or closed
- [ ] Time slots: display in 15-min increments; show as disabled if unavailable
- [ ] Double-booking prevention: slot held for 10 minutes during checkout; released on timeout or navigation
- [ ] Booking confirmation: immediate for free bookings; pending for paid until payment succeeds
- [ ] Confirmation includes: booking reference, calendar invite (.ics), add-to-calendar buttons, cancellation policy
- [ ] Modification allowed up to cutoff time (business-configurable, default 24h before)

---

### 3.8 Appointment Management
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Description** | Customer view of all bookings with lifecycle actions |
| **Views** | Upcoming (default), Past, Cancelled; sort by date descending |
| **Actions** | View details, reschedule (same business), cancel, rebook, contact business |

**Acceptance Criteria:**
- [ ] Upcoming appointments show countdown to next visit; push notification 24h and 1h before
- [ ] Reschedule: new slot selection with same constraints as booking flow; original slot released immediately
- [ ] Cancellation: reason optional; refund policy displayed; immediate confirmation
- [ ] Past appointments: prompt to review (up to 30 days), rebook same service
- [ ] No-show handling: marked by business; customer notified; affects future booking privileges if pattern detected

---

### 3.9 Favorites
**Priority:** P1

| Aspect | Specification |
|--------|---------------|
| **Description** | Save businesses for quick re-access |
| **Sync** | Server-persisted; available across devices |
| **Limit** | 500 favorites per user |

**Acceptance Criteria:**
- [ ] Heart toggle on business card and detail page; immediate visual feedback
- [ ] Favorites list: sortable by name, date added, or next availability
- [ ] Batch remove from favorites
- [ ] Favorites with upcoming bookings pinned to top
- [ ] Push notification when favorite business adds new service or promotion

---

### 3.10 User Profile
**Priority:** P1

| Aspect | Specification |
|--------|---------------|
| **Description** | Customer account management and preferences |
| **Sections** | Personal info, profile photo, phone, preferences (notifications, language, currency), payment methods, booking history |

**Acceptance Criteria:**
- [ ] Profile photo: upload (JPG/PNG, max 5MB), crop to circle, delete option
- [ ] Notification preferences: granular control (email, push, SMS) per type (bookings, promotions, reminders)
- [ ] GDPR: data export (JSON download), account deletion (30-day grace period, anonymization)
- [ ] Phone verification via SMS for high-value bookings or business owner contact

---

### 3.11 Availability & Slot Computation
**Priority:** P0 (Critical)

| Aspect | Specification |
|--------|---------------|
| **Description** | Real-time calculation of bookable time slots considering all constraints |
| **Inputs** | Business hours, provider schedules, service duration, buffer time, existing appointments, blocked times |
| **Output** | Available slots per provider per day |

**Acceptance Criteria:**
- [ ] Slot computation completes in < 200ms for 30-day horizon
- [ ] Handles: split shifts, breaks, holidays, provider time-off, overlapping services
- [ ] Buffer time: configurable per business (default 0 min between appointments)
- [ ] Multi-service booking: consecutive slots if total duration fits available window
- [ ] Edge cases: service longer than any single available window → next available day shown; past dates excluded
- [ ] Cache computed slots with 5-minute TTL; invalidate on booking mutation

---

### 3.12 Shared Types & Design System
**Priority:** P1

| Aspect | Specification |
|--------|---------------|
| **Description** | Consistent UI/UX patterns and type safety across platforms |
| **Framework** | React Native (mobile) / React (web); shared TypeScript definitions |

**Acceptance Criteria:**
- [ ] Design tokens: colors, typography, spacing, shadows in centralized theme object
- [ ] Component library: Button, Input, Card, Modal, DatePicker, TimeSlot, Skeleton, ErrorBoundary
- [ ] Accessibility: WCAG 2.1 AA minimum; screen reader support, focus management, color contrast 4.5:1
- [ ] Dark mode support: system preference detection, manual override, persistent preference
- [ ] Type safety: strict TypeScript; no `any`; shared API types auto-generated from OpenAPI spec

---

### 3.13 Reviews & Ratings
**Priority:** P1

| Aspect | Specification |
|--------|---------------|
| **Description** | Post-appointment feedback system |
| **Eligibility** | Verified customers only; 30-day window after appointment |
| **Elements** | Overall rating (1-5), service-specific ratings, text review, photo upload (max 5) |

**Acceptance Criteria:**
- [ ] Review prompt: push notification + email 24h after appointment completion
- [ ] Rating breakdown: average, distribution histogram, recent vs. all-time filter
- [ ] Business response: public reply to any review; marked as "Business owner"
- [ ] Content moderation: auto-flag profanity, images screened for inappropriate content; human review queue for reported content
- [ ] Review helpfulness: users can mark helpful; sorted by helpfulness by default
- [ ] Fake review detection: ML model flags suspicious patterns (same device, rapid succession, text similarity); admin review

---

### 3.14 Payment Integration
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Description** | Secure payment processing for paid bookings |
| **Provider** | Stripe (primary), Adyen (fallback for EU) |
| **Flows** | Immediate charge, hold + capture (for flexible cancellation), deposits, full prepay |

**Acceptance Criteria:**
- [ ] Payment methods: cards (3D Secure), Apple Pay, Google Pay, SEPA (EU)
- [ ] PCI compliance: no card data touches servers; Stripe Elements/Apple Pay tokenization
- [ ] Receipt: emailed automatically; downloadable PDF in app
- [ ] Refunds: automatic per cancellation policy; manual partial refunds via business owner portal with admin approval for > 50%
- [ ] Failed payment: 3 retry attempts with exponential backoff; booking held for 30 minutes
- [ ] Payouts to businesses: weekly auto-transfer; manual on-demand available; dashboard shows pending/available balance

---

### 3.15 Notifications
**Priority:** P1

| Aspect | Specification |
|--------|---------------|
| **Description** | Multi-channel user communication |
| **Channels** | Push (Firebase Cloud Messaging), email (SendGrid), SMS (Twilio) |
| **Types** | Transactional (booking confirmations, reminders, changes), promotional (opt-in), system (maintenance, policy updates) |

**Acceptance Criteria:**
- [ ] Preference center: granular opt-in/out per channel and type; transactional cannot be disabled
- [ ] Delivery reliability: push notification delivery rate > 95%; fallback to SMS for critical alerts if push fails
- [ ] Rich push: deep link to relevant screen; action buttons ("Confirm", "Reschedule", "Cancel")
- [ ] Quiet hours: no promotional notifications 22:00-08:00 local time; transactional exempt
- [ ] Notification history: in-app inbox with 90-day retention; unread badge

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Description** | Web-based business management for owners and staff |
| **Roles** | Owner (full access), Manager (most access), Staff (own schedule only) |
| **Modules** | Dashboard, Calendar, Services, Staff, Bookings, Clients, Settings, Analytics |

**Acceptance Criteria:**
- [ ] Dashboard: today's appointments, revenue, occupancy rate, recent reviews, quick actions
- [ ] Calendar: day/week/month views; drag-to-reschedule; color-coded by status; block time feature
- [ ] Services: CRUD with pricing, duration, description, online booking enable/disable
- [ ] Staff: manage schedules, services performed, time-off requests; invite via email
- [ ] Bookings: view all, filter by status/date/staff; manual booking creation; check-in/check-out
- [ ] Clients: CRM view with visit history, notes, marketing consent; export to CSV
- [ ] Settings: business hours, cancellation policy, payment methods, notification preferences, team permissions
- [ ] Mobile-responsive: core functions usable on tablet; full feature on desktop

---

### 3.17 Admin Dashboard
**Priority:** P2

| Aspect | Specification |
|--------|---------------|
| **Description** | Platform oversight and operational tools |
| **Access** | Role-based (Super Admin, Ops, Support, Finance) |
| **Modules** | Businesses, Users, Bookings, Payments, Reviews, Content, Analytics, System |

**Acceptance Criteria:**
- [ ] Businesses: onboarding workflow, verification status, suspension/activation, featured placement
- [ ] Users: search, view, suspend, impersonate (with audit log); GDPR deletion requests queue
- [ ] Bookings: dispute resolution interface; refund processing; booking anomaly detection
- [ ] Payments: transaction monitoring, payout management, chargeback handling
- [ ] Reviews: moderation queue, appeal handling, bulk actions
- [ ] Analytics: MAU, booking volume, GMV, churn, top categories; exportable reports
- [ ] System: feature flags, rate limit adjustment, maintenance mode, broadcast notifications

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P1

| Aspect | Specification |
|--------|---------------|
| **Description** | Asynchronous task processing for reliability and performance |
| **Queue** | Redis-backed; separate queues by priority and type |

**Acceptance Criteria:**
- [ ] **Email queue**: transactional emails with retry (3 attempts, exponential backoff); dead letter after failure
- [ ] **SMS queue**: OTP and critical alerts; immediate priority
- [ ] **Push notification queue**: batch processing for marketing; immediate for transactional
- [ ] **Payment queue**: idempotent processing; webhook handling with signature verification
- [ ] **Search index queue**: incremental updates on business/service mutation; full reindex nightly
- [ ] **Analytics queue**: event batching to warehouse; 5-minute flush or 1000 events
- [ ] **Image processing queue**: upload → resize variants (thumbnail, card, full) → CDN invalidate → cleanup original
- [ ] **Reporting queue**: scheduled report generation; email delivery
- [ ] Job monitoring: Bull Board UI for queue status, job inspection, manual retry; alert on queue depth > 1000
- [ ] Job idempotency: deduplication key prevents duplicate execution; idempotency key from client for user-initiated actions

---

## 4. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | P99 API response < 500ms; page load < 2s; TTI < 3s |
| **Availability** | 99.9% uptime; scheduled maintenance windows announced 48h prior |
| **Security** | OWASP Top 10 mitigation; dependency scanning; annual penetration test |
| **Scalability** | Auto-scaling from 100 to 10,000 concurrent bookings; database read replicas |
| **Compliance** | GDPR, CCPA, PCI-DSS Level 1; data residency EU |

---

## 5. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Booking conversion rate | > 15% | Bookings / search sessions |
| Search-to-book time | < 5 minutes | Average duration |
| Business owner activation | > 80% | Complete profile + first booking within 14 days |
| Customer retention (30d) | > 40% | Return booking within 30 days |
| NPS | > 50 | Quarterly survey |
| Support tickets | < 2% of transactions | Monthly |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Guest browse, Search, Business detail, Booking flow, Appointment mgmt, Provider portal (basic) | Week 1-6 |
| **V1.0** | Map search, Favorites, Profile, Reviews, Payments, Notifications | Week 7-12 |
| **V1.1** | Admin dashboard, Analytics, Advanced scheduling, Marketing tools | Week 13-18 |
| **V1.2** | AI recommendations, Loyalty program, Marketplace (products) | Week 19-24 |

---

*Document version: 1.0 | Last updated: 2024 | Owner: Alex, Product Owner*