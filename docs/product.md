# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a platform connecting customers with local service businesses (beauty, wellness, health) for online appointment booking. Two-sided marketplace: consumer mobile app + web portal for business owners and administrators.

**Target Users:** Consumers seeking appointments; Business owners managing bookings; Platform administrators.

---

## 2. Feature Specifications

### 2.1 User Authentication

**Priority:** P0
**Description:** Secure identity management for all platform users.

| Aspect | Specification |
|--------|---------------|
| Consumer Auth | Email/password, Google OAuth, Apple Sign-In |
| Business Owner Auth | Email/password with additional KYC verification |
| Admin Auth | SSO-only, restricted IP ranges |
| Security | JWT access tokens (15min), refresh tokens (7d), biometric unlock on mobile |
| Session Mgmt | Concurrent session limit (3), force logout from all devices |

**Acceptance Criteria:**
- AC1: User can register with email, receive verification link, and activate account within 24 hours
- AC2: OAuth users auto-merge with existing email accounts via matching email
- AC3: 5 failed login attempts triggers 30-minute lockout with email notification
- AC4: Password reset link expires in 1 hour, single-use only
- AC5: Biometric prompt appears after 5 minutes of inactivity (mobile)

---

### 2.2 Guest Browse & Explore

**Priority:** P0
**Description:** Pre-authentication discovery to drive conversion.

| Aspect | Specification |
|--------|---------------|
| Access | No login required for browsing, search, viewing business profiles |
| Limitations | Booking, favorites, reviews require authentication |
| Conversion | Persistent prompts to sign in at booking CTA, with 1-tap guest checkout option |
| Data Capture | Anonymous session ID for attribution, prompt to create account after 3rd visit |

**Acceptance Criteria:**
- AC1: Guest user sees full search results and business details without login barrier
- AC2: Attempting to book triggers auth modal with "Continue as Guest" option
- AC3: Guest checkout captures minimal info (name, phone, email); account auto-created post-booking
- AC4: Guest sessions convert to authenticated sessions upon registration with data preserved

---

### 2.3 Business Search & Discovery

**Priority:** P0
**Description:** Core discovery engine for finding service providers.

| Aspect | Specification |
|--------|---------------|
| Search Inputs | Free text (business name, service), filters (category, price range, rating, availability date) |
| Sorting | Relevance, distance, rating, price (low/high), availability (next available) |
| Results Display | Card list with photo, name, rating, starting price, next available slot |
| Pagination | Cursor-based, 20 results per page |
| Auto-complete | Business names, services, locations indexed for <100ms suggestions |

**Acceptance Criteria:**
- AC1: Search returns relevant results in <300ms for 95th percentile
- AC2: Empty states suggest nearby alternatives and popular categories
- AC3: Active filters display as removable chips with result count
- AC4: Search history persists across sessions for authenticated users
- AC5: Typo-tolerance handles 1-2 character deviations in business names

---

### 2.4 Map-based Search

**Priority:** P0
**Description:** Visual geographic discovery with spatial clustering.

| Aspect | Specification |
|--------|---------------|
| Map Provider | Mapbox GL JS / native SDK |
| Markers | Price-based color coding, cluster aggregation at zoom levels |
| Interaction | Tap marker → bottom sheet preview; swipe up for full detail |
| Geolocation | Real-time position with permission fallback to manual city selection |
| Boundaries | Search results update on map pan/zoom with debounce (300ms) |

**Acceptance Criteria:**
- AC1: Map initializes to user location within 3 seconds (with permission)
- AC2: Clusters decompose smoothly at zoom threshold (default: zoom ≥ 12)
- AC3: Map and list views synchronize selection state bidirectionally
- AC4: Offline: cached map tiles display with "connect for live results" banner
- AC5: Accessibility: screen reader announces "X businesses found in this area"

---

### 2.5 Business Detail View

**Priority:** P0
**Description:** Comprehensive business profile driving booking conversion.

| Section | Content |
|---------|---------|
| Hero | Photo gallery (max 10), business name, verified badge, overall rating |
| Quick Actions | Favorite, Share, Call, Get Directions |
| Services | Expandable categories with duration, description, price |
| Team | Staff profiles with specialties, photos, individual ratings |
| Hours | Weekly schedule with "Open Now" indicator, holiday exceptions |
| Reviews | Filterable (rating, date, with photos), paginated |
| Location | Embedded mini-map, address, public transit info |

**Acceptance Criteria:**
- AC1: Photo gallery supports pinch-zoom, swipe navigation, full-screen mode
- AC2: "Book" button sticky at bottom, scrolls with user
- AC3: Deep linking to specific business opens correct view with back navigation to search
- AC4: Share generates preview image with business photo, name, and app download CTA
- AC5: Business hours reflect timezone correctly; closed days grayed out in booking calendar

---

### 2.6 Service Categories

**Priority:** P0
**Description:** Hierarchical classification for discovery and business organization.

| Level | Examples |
|-------|----------|
| Root | Hair, Face, Body, Nails, Wellness, Medical Aesthetics |
| Subcategory | Hair: Cut, Color, Styling, Treatment |
| Service | Balayage, Root Touch-up, Full Highlights |

**Acceptance Criteria:**
- AC1: Business can assign services to multiple categories
- AC2: Category pages show featured businesses, trending services, educational content
- AC3: Category icons consistent across search, filters, and business profiles
- AC4: Admin can create, merge, deprecate categories with migration path for existing services

---

### 2.7 Booking Flow

**Priority:** P0
**Description:** Friction-reduced appointment reservation.

| Step | Action |
|------|--------|
| 1. Service Selection | Choose service, optional staff preference, add-ons |
| 2. Date/Time | Calendar view with available slots; earliest first default |
| 3. Confirmation | Review details, apply promo code, select payment method |
| 4. Booking | Atomic reservation with optimistic UI, rollback on failure |\n| State | Description |
|-------|-------------|
| Pending | Awaiting business confirmation (configurable per business) |
| Confirmed | Default auto-confirm; calendar hold released on timeout |
| Cancelled | By user (policy-enforced) or business |
| Completed | Post-appointment, triggers review prompt |
| No-show | Marked by business, affects user reliability score |

**Acceptance Criteria:**
- AC1: Slot selection prevents double-booking via pessimistic locking (5-minute cart hold)
- AC2: Booking completes end-to-end in <10 seconds on 4G
- AC3: Partial failure (payment succeeded, booking failed) triggers automatic reconciliation
- AC4: Cancellation policy displayed pre-booking; enforced with automated refund logic
- AC5: Rescheduling preserves original payment, adjusts for price differences

---

### 2.8 Appointment Management

**Priority:** P0
**Description:** Post-booking lifecycle for consumers and businesses.

**Consumer View:**
- Upcoming/past tabs, chronological sort
- Action buttons: Reschedule (policy-permitting), Cancel, Add to Calendar, Get Directions
- Real-time status updates via push/SMS

**Business Owner View:**
- Daily/weekly/monthly calendar views
- Drag-to-reschedule, block time, mark no-show
- Customer notes and history accessible per appointment

**Acceptance Criteria:**
- AC1: Calendar sync exports to Google/Apple Calendar with cancellation links
- AC2: Reschedule within 2 hours of appointment requires business approval
- AC3: Push notification delivers status change in <5 seconds
- AC4: Business can bulk-select and message customers for schedule changes
- AC5: Audit log tracks all appointment state changes with actor and timestamp

---

### 2.9 Favorites

**Priority:** P1
**Description:** Saved businesses for quick re-access.

| Aspect | Specification |
|--------|---------------|
| Storage | Server-synced with offline fallback |
| Organization | Default list only (MVP); custom lists post-MVP |
| Notifications | Opt-in alerts for new availability, promotions from favorited businesses |
| Social | Share favorite list (future) |

**Acceptance Criteria:**
- AC1: Heart toggle on any business card/detail, immediate visual feedback
- AC2: Favorites accessible offline, sync queue for actions taken without connectivity
- AC3: Unfavoriting triggers confirmation if upcoming bookings exist
- AC4: Maximum 500 favorites per user with graceful handling

---

### 2.10 User Profile

**Priority:** P1
**Description:** Centralized user data and preferences.

| Section | Content |
|---------|---------|
| Personal Info | Name, phone, email, profile photo, birthday (for offers) |
| Preferences | Notification settings, default payment method, privacy controls |
| Activity | Booking history, reviews written, favorites |
| Loyalty | Points balance, tier status, available rewards |

**Acceptance Criteria:**
- AC1: GDPR-compliant data export (machine-readable, <30 days)
- AC2: Account deletion anonymizes bookings, removes PII, retains financial records per regulation
- AC3: Profile photo upload validates format (JPG/PNG), size (<5MB), moderates content
- AC4: Phone change triggers re-verification via SMS

---

### 2.11 Availability & Slot Computation

**Priority:** P0
**Description:** Core scheduling engine generating bookable time slots.

| Input | Logic |
|-------|-------|
| Business Hours | Weekly template + exceptions (holidays, temporary closures) |
| Staff Schedules | Individual working hours, breaks, time off |
| Service Duration | Base duration + buffer + setup/cleanup |
| Existing Bookings | Blocked time from confirmed appointments |
| Buffer Rules | Minimum notice (e.g., 2 hours ahead), gap filling preference |

**Computation:**
- Generate candidate slots from business open to close
- Subtract staff unavailability, existing bookings, buffer periods
- Apply business rules: max advance booking, min staff rest between appointments

**Acceptance Criteria:**
- AC1: Slot query for single business returns in <200ms
- AC2: Concurrent slot requests for same staff/service serialize correctly (no overbooking)
- AC3: Timezone handling correct for cross-timezone bookings
- AC4: Cache invalidation on any schedule change within 5 seconds
- AC5: Fallback: if computation service down, serve cached slots with stale warning

---

### 2.12 Shared Types & Design System

**Priority:** P0
**Description:** Reusable components ensuring consistency.

| Layer | Elements |
|-------|----------|
| Foundation | Colors (primary: #6B46C1, semantic: success/error/warning), typography (Inter), spacing (4px grid), elevation |
| Components | Buttons, inputs, cards, modals, toasts, loading states, empty states |
| Patterns | Navigation (tab bar, top bar), search/filter, forms, lists, calendars |
| Tokens | Design tokens in JSON, consumed by web (Tailwind) and mobile (StyleSheet) |

**Acceptance Criteria:**
- AC1: All UI components documented in Storybook with interactive variants
- AC2: Dark mode support with automatic system preference detection
- AC3: Accessibility: WCAG 2.1 AA minimum, focus indicators, screen reader labels
- AC4: RTL language layout support verified
- AC5: Component usage tracked; deprecated components flagged in CI

---

### 2.13 Reviews & Ratings

**Priority:** P1
**Description:** Social proof and quality feedback loop.

| Aspect | Specification |
|--------|---------------|
| Eligibility | Verified customers only (completed appointment within 30 days) |
| Rating | 1-5 stars, mandatory with optional detailed review |
| Content | Text (max 2000 chars), photos (max 5), business response |
| Moderation | Auto-flag profanity, images; human review queue for disputes |
| Display | Weighted recency (recent reviews weighted higher), verified badge |

**Acceptance Criteria:**
- AC1: Review prompt triggers 2 hours post-appointment via push notification
- AC2: Business owner can respond publicly; response editable within 24 hours
- AC3: User can edit review within 48 hours, delete anytime
- AC4: Aggregate rating updates within 5 minutes of new review
- AC5: Reported reviews hidden pending review, reporter notified of outcome

---

### 2.14 Payment Integration

**Priority:** P0
**Description:** Secure, flexible transaction handling.

| Feature | Specification |
|---------|-------------|
| Methods | Cards (Stripe), Apple Pay, Google Pay, PayPal (regional) |
| Flows | Pay at booking, pay at venue, deposit + balance, subscription packages |
| Security | PCI-DSS Level 1 via Stripe Elements; no raw card data touches servers |
| Receipts | Auto-generated PDF, email delivery, in-app archive |
| Refunds | Automated per cancellation policy; manual override by business with audit |

**Acceptance Criteria:**
- AC1: Payment intent created client-side, confirmed server-side with idempotency key
- AC2: 3D Secure challenge handled inline without app restart
- AC3: Failed payment surfaces specific error (insufficient funds, expired card) with retry
- AC4: Webhook handling idempotent, duplicate events safely ignored
- AC5: Financial reconciliation report matches Stripe dashboard daily

---

### 2.15 Notifications

**Priority:** P1
**Description:** Multi-channel, preference-aware communication.

| Channel | Use Cases |
|---------|-----------|
| Push | Booking confirmations, reminders (24h, 2h before), status changes, promotions |
| SMS | Critical: same-day changes, verification codes; backup when push disabled |
| Email | Receipts, account activity, marketing (opt-in) |
| In-App | Notification center with unread badge, persistent history |

**Acceptance Criteria:**
- AC1: User controls channel preferences per notification type
- AC2: Quiet hours respected (default 22:00-08:00, user-configurable); urgent bypasses
- AC3: Delivery tracking: push receipt confirmed, fallback to SMS if not acknowledged in 5 min
- AC4: Notification deep-links to relevant in-app screen
- AC5: Batch marketing notifications respect frequency caps and unsubscribe

---

### 2.16 Provider / Business Owner Portal

**Priority:** P0
**Description:** Web-based management for business operations.

| Module | Functionality |
|--------|---------------|
| Dashboard | Today's appointments, revenue snapshot, recent reviews |
| Calendar | Day/week views, appointment details, quick actions |
| Services | CRUD services, pricing, duration, staff associations |
| Staff | Manage team members, permissions, schedules |
| Clients | CRM view: history, notes, preferences, booking patterns |
| Settings | Business profile, hours, policies, integrations |
| Analytics | Booking volume, revenue, cancellation rate, peak times |

**Acceptance Criteria:**
- AC1: Role-based access: Owner (full), Manager (most), Staff (calendar only)
- AC2: Calendar supports recurring block patterns (lunch breaks, admin time)
- AC3: Client communication: bulk SMS/email for schedule changes
- AC4: Export bookings to CSV/ICS for external calendar systems
- AC5: Mobile-responsive for on-the-go management

---

### 2.17 Admin Dashboard

**Priority:** P1
**Description:** Platform oversight and operational tools.

| Module | Functionality |
|--------|---------------|
| User Management | Search, suspend, impersonate (with audit) |
| Business Onboarding | Verification queue, document review, approval workflow |
| Content Moderation | Review reports, business profile changes, user-generated content |
| Financial | Transaction monitoring, payout scheduling, dispute handling |
| Analytics | MAU, booking volume, GMV, churn, cohort retention |
| System Health | Service status, error rates, queue depths, alert configuration |

**Acceptance Criteria:**
- AC1: All admin actions logged with before/after state for compliance
- AC2: Impersonation requires secondary approval, auto-terminates after 30 minutes
- AC3: Business approval SLA: 95% within 24 hours of complete submission
- AC4: Real-time dashboard auto-refreshes; exportable reports
- AC5: Role-based access with least-privilege default

---

### 2.18 Background Jobs (BullMQ)

**Priority:** P0
**Description:** Asynchronous processing for reliability and scale.

| Queue | Jobs | Priority |
|-------|--------|----------|
| notifications | Push/SMS/email dispatch, retry with exponential backoff | Normal |
| payments | Webhook processing, payout batches, refund execution | High |
| search-index | Business/service index updates, search suggestion rebuild | Low |
| reports | Daily/weekly analytics generation, data exports | Lowest |
| cleanup | Session expiry, old log archival, temporary file removal | Low |

**Acceptance Criteria:**
- AC1: Failed jobs retry 3x with jitter, then dead-letter for manual inspection
- AC2: Job progress trackable via dashboard; stalled jobs auto-restarted
- AC3: Queue depth alerts trigger at >1000 pending jobs
- AC4: Idempotency keys prevent duplicate processing
- AC5: Graceful shutdown: in-progress jobs complete, new jobs rejected during deploy

---

## 3. Non-Functional Requirements

| Area | Target |
|------|--------|
| Performance | P99 API response <500ms; page load <2s (3G) |
| Availability | 99.9% uptime; <4 hours planned maintenance/month |
| Security | OWASP Top 10 mitigated; annual penetration test |
| Compliance | GDPR, CCPA, PCI-DSS; data residency per region |
| Scalability | Handle 10x traffic spike without manual intervention |

---

## 4. Success Metrics

| Metric | Target |
|--------|--------|
| Booking Conversion (guest → booked) | >15% |
| Booking Conversion (authed → booked) | >35% |
| Day-7 Retention | >25% |
| Business Owner NPS | >50 |
| Customer Support Tickets/1000 Bookings | <5 |
| Payment Success Rate | >98% |

---

## 5. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Guest Browse, Search, Map, Business Detail, Booking Flow, Appointment Mgmt, Slot Computation, Payments, Owner Portal | 12 weeks |
| V1 | Favorites, Profile, Reviews, Notifications, Admin Dashboard | 6 weeks |
| V2 | Loyalty, Subscriptions, Advanced Analytics, API Partners | Post-launch |
