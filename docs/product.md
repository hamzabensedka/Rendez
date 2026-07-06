# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first marketplace connecting consumers with beauty, wellness, and service professionals for appointment booking. The platform serves two primary user segments: **Consumers** (booking appointments) and **Providers/Business Owners** (managing schedules and services). An **Admin Dashboard** oversees platform health and operations.

---

## 2. Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Consumer** | Seeks beauty/wellness services, values convenience and discovery | Find, book, and manage appointments effortlessly |
| **Guest User** | Unregistered visitor exploring the platform | Browse services without commitment |
| **Provider** | Salon owner, independent professional, or business manager | Manage calendar, services, staff, and grow clientele |
| **Admin** | Platform operator | Monitor, moderate, and optimize marketplace |

---

## 3. Feature Specifications

### 3.1 User Authentication

**Priority:** P0 (Critical)

**Description:** Secure identity management for consumers and providers.

| Item | Specification |
|------|---------------|
| Registration | Email/password, Google OAuth, Apple Sign-In |
| Login | JWT-based session with refresh token rotation |
| Password Recovery | Email-based reset with 1-hour expiry link |
| Phone Verification | Optional SMS verification for booking security |
| Role Assignment | `consumer`, `provider`, `admin` roles at registration |
| Session Security | Auto-logout after 30 days; biometric unlock optional |

**Acceptance Criteria:**
- [ ] User can register with email, password, and role selection
- [ ] OAuth flows complete with profile pre-fill
- [ ] Password must be 8+ chars with uppercase, lowercase, number
- [ ] Refresh token rotation prevents replay attacks
- [ ] Users receive verification email; unverified accounts can browse but not book

---

### 3.2 Guest Browse & Explore

**Priority:** P0

**Description:** Unauthenticated discovery experience to reduce friction.

| Item | Specification |
|------|---------------|
| Access | Full browse, search, and business detail view |
| Limitations | Cannot book, favorite, or leave reviews |
| Prompts | Smart CTAs at conversion points ("Book — Sign in to continue") |
| Data Persistence | Guest session stored locally; prompt to transfer on signup |

**Acceptance Criteria:**
- [ ] Guest can view business listings, services, and reviews
- [ ] Guest sees persistent "Sign in to book" CTA on business pages
- [ ] Converting guest to registered user preserves search history and viewed businesses

---

### 3.3 Business Search & Discovery

**Priority:** P0

**Description:** Core discovery engine with filtering and ranking.

| Item | Specification |
|------|---------------|
| Search Inputs | Free text (business name, service), location, date/time |
| Filters | Category, price range, rating, distance, availability, gender of staff, amenities |
| Sorting | Relevance, distance, rating, price (low-high), availability |
| Results Display | Card-based list with thumbnail, rating, price from, next available slot |
| Auto-complete | Business names, services, locations |
| Recent Searches | Persist last 10 searches per user |

**Acceptance Criteria:**
- [ ] Search returns results in <500ms for 90th percentile queries
- [ ] Empty states guide users to broaden filters
- [ ] "Near me" uses geolocation with permission fallback to typed location
- [ ] Results update dynamically as filters change

---

### 3.4 Map-based Search

**Priority:** P1 (High)

**Description:** Visual geographic discovery with interactive map.

| Item | Specification |
|------|---------------|
| Map Provider | Mapbox or Google Maps |
| Markers | Clustered pins; color-coded by category |
| Interaction | Tap marker → bottom sheet with business preview; tap preview → detail |
| Bound Search | Results update to visible map bounds on pan/zoom |
| User Location | Blue dot with accuracy ring; re-center button |
| List/Map Toggle | Persistent toggle; remember user preference |

**Acceptance Criteria:**
- [ ] Map loads within 3 seconds on 4G
- [ ] Clustering handles 500+ businesses in dense areas
- [ ] Tapping cluster zooms to expand
- [ ] Business cards in bottom sheet match list view data

---

### 3.5 Business Detail View

**Priority:** P0

**Description:** Comprehensive business profile driving conversion.

| Section | Content |
|---------|---------|
| Hero | Cover image carousel, business name, rating, review count, favorite toggle |
| Info | Address, hours, phone, website, social links |
| Services | Categorized list with prices, durations, descriptions; expandable |
| Team | Staff profiles with photos, bios, specialties |
| Reviews | Rating breakdown, filterable reviews |
| Availability | Inline mini-calendar showing next 7 days' availability |
| Location | Embedded mini-map with directions CTA |

**Acceptance Criteria:**
- [ ] Page loads in <2 seconds
- [ ] Image gallery supports pinch-zoom and swipe
- [ ] "Book" CTA floats and remains visible on scroll
- [ ] Hours display dynamically shows "Open now" / "Closes at X" / "Closed"

---

### 3.6 Service Categories

**Priority:** P1

**Description:** Hierarchical classification for browse and SEO.

| Item | Specification |
|------|---------------|
| Hierarchy | Category → Subcategory → Service (3 levels) |
| Examples | Hair > Color > Balayage; Wellness > Massage > Deep Tissue |
| Assignment | Businesses assign services to categories; admin manages taxonomy |
| Discovery | Category pills on home; category landing pages |
| Icons | Custom icon set per category for visual recognition |

**Acceptance Criteria:**
- [ ] Category tree is navigable in 3 taps maximum
- [ ] Services can belong to multiple categories (cross-listing)
- [ ] Category changes reflect in search within 5 minutes

---

### 3.7 Booking Flow

**Priority:** P0

**Description:** Streamlined multi-step reservation process.

| Step | Actions |
|------|---------|
1. **Service Selection** | Choose service, optionally select staff member |
2. **Date/Time** | Calendar view with available slots; slot computation engine |
3. **Confirmation** | Review details, apply promo code, add notes |
4. **Payment** | Select payment method, pre-authorize or charge |
5. **Success** | Confirmation screen with add-to-calendar, share |

| Item | Specification |
|------|---------------|
| Guest Booking | Allowed with phone + email capture; prompt account creation post-booking |
| Modifications | Reschedule or cancel per business policy |
| Waitlist | Option to join waitlist for fully booked preferred slots |
| Group Bookings | Book multiple services in single transaction (up to 4) |

**Acceptance Criteria:**
- [ ] Booking completes in <4 steps, <60 seconds for returning users
- [ ] Slot selection prevents double-booking via pessimistic locking
- [ ] Cancellation policy displayed pre-commit; enforced automatically
- [ ] Confirmation email/SMS sent within 30 seconds

---

### 3.8 Appointment Management

**Priority:** P0

**Description:** Consumer and provider views of scheduled appointments.

**Consumer View:**
- Upcoming/past appointments list
- Detail: service, provider, location, time, QR code check-in
- Actions: reschedule (if policy allows), cancel, rebook, contact business
- Add to native calendar (iOS/Android)

**Provider View:**
- Daily/weekly calendar (see Provider Portal)
- Customer arrival status: booked → confirmed → checked-in → completed → no-show

**Acceptance Criteria:**
- [ ] Consumers receive reminder 24h and 2h before appointment
- [ ] Reschedule offers only valid future slots respecting cancellation window
- [ ] No-show automatically marked if not checked in within 15 min of start

---

### 3.9 Favorites

**Priority:** P1

**Description:** Save businesses for quick re-access.

| Item | Specification |
|------|---------------|
| Save/Unsave | Heart toggle on business card and detail page |
| List View | Grid of favorited businesses with quick-book CTA |
| Notifications | Opt-in alerts for new availability or promotions from favorites |
| Sync | Cross-device via account; guest favorites prompt signup |

**Acceptance Criteria:**
- [ ] Favorite action provides haptic feedback
- [ ] Unfavorite requires confirmation if upcoming booking exists
- [ ] Favorites load in <1 second for users with <50 favorites

---

### 3.10 User Profile

**Priority:** P1

**Description:** Personal settings and history management.

| Section | Content |
|---------|---------|
| Personal Info | Name, email, phone, profile photo, birthday (for birthday promos) |
| Preferences | Notification settings, default location, preferred payment |
| History | Past appointments with rebook, review, and receipt access |
| Payment Methods | Saved cards (tokenized), Apple Pay, Google Pay |
| Security | Password change, 2FA, active sessions |
| Data | Download personal data, delete account (GDPR/CCPA) |

**Acceptance Criteria:**
- [ ] Profile photo upload supports crop and compress to <2MB
- [ ] Account deletion initiates 30-day grace period with recovery option
- [ ] Data export completes within 24 hours via email link

---

### 3.11 Availability & Slot Computation

**Priority:** P0

**Description:** Real-time availability engine — core platform differentiator.

**Inputs:**
- Business operating hours (weekly template + exceptions)
- Staff schedules and assigned services
- Service durations + buffer time between appointments
- Existing bookings (confirmed, tentative holds)
- Blocked time (lunch breaks, admin time)

**Algorithm:**
- Generate candidate slots from business hours minus conflicts
- Respect staff-service competency matrix
- Apply business rules: max advance booking, min notice, slot granularity
- Hold tentative slots for 10 minutes during booking flow

**Performance:**
- Pre-compute next 30 days nightly; real-time compute for current day
- Cache per-business availability with 5-minute TTL

**Acceptance Criteria:**
- [ ] Slot query returns in <200ms
- [ ] No double-bookings occur under concurrent load (tested at 100 req/s)
- [ ] Tentative holds expire and release automatically
- [ ] Timezone handling correct for cross-timezone bookings

---

### 3.12 Shared Types & Design System

**Priority:** P0 (Infrastructure)

**Description:** Consistent UI/UX foundation across platforms.

| Element | Specification |
|---------|---------------|
| Typography | Inter (body), Playfair Display (headings); 6-level scale |
| Color | Primary #6C5CE7, Secondary #00B894, Semantic (success/error/warning) |
| Spacing | 8px base grid; consistent padding/margin tokens |
| Components | Button, Input, Card, Modal, Toast, Skeleton, DatePicker, TimeSlot |
| Animation | 200ms ease-in-out; reduced motion respect |
| Accessibility | WCAG 2.1 AA; minimum 44pt touch targets; screen reader labels |
| Dark Mode | Supported via CSS variables; follows system preference |

**Acceptance Criteria:**
- [ ] All UI components documented in Storybook
- [ ] No color contrast ratio below 4.5:1 for text
- [ ] Design tokens published as npm package for web/mobile sync

---

### 3.13 Reviews & Ratings

**Priority:** P1

**Description:** Social proof and quality assurance system.

| Item | Specification |
|------|---------------|
| Eligibility | Only verified customers who completed appointment |
| Rating | 1-5 stars, mandatory; review text optional, 10-500 chars |
| Categories | Optional tags: cleanliness, professionalism, value, ambiance |
| Response | Business owner can reply once; consumer can update review |
| Moderation | Auto-flag profanity; manual review queue for reported content |
| Sorting | Most recent, highest rated, most helpful |
| Aggregation | Overall rating, category breakdown, rating trend (6 months) |

**Acceptance Criteria:**
- [ ] Review prompt sent 2 hours post-appointment via push + email
- [ ] Reviews appear after 5-minute delay (anti-spam)
- [ ] Business cannot delete reviews; can flag for admin review
- [ ] Fake review detection flags anomalies (same IP, burst pattern)

---

### 3.14 Payment Integration

**Priority:** P0

**Description:** Secure, multi-provider payment processing.

| Item | Specification |
|------|---------------|
| Providers | Stripe (primary), PayPal (secondary) |
| Methods | Cards, Apple Pay, Google Pay, Buy Now Pay Later (Klarna) |
| Flow | Customer pays platform; platform settles to provider (marketplace model) |
| Pricing | Service fee (platform) + payment processing fee; transparent at checkout |
| Refunds | Automated per cancellation policy; manual override by admin |
| Invoicing | VAT invoice generation for B2B providers |

**Acceptance Criteria:**
- [ ] PCI DSS compliance via tokenization; no raw card data stored
- [ ] 3D Secure enforced for transactions >€30
- [ ] Webhook handling idempotent for payment status updates
- [ ] Failed payments retry with customer notification; 24-hour hold on slot

---

### 3.15 Notifications

**Priority:** P1

**Description:** Multi-channel user engagement and operational alerts.

| Type | Channels | Triggers |
|------|----------|----------|
| Transactional | Push, SMS, Email | Booking confirmed, modified, cancelled; reminder 24h, 2h |
| Marketing | Push, Email | Promotions, favorites availability, re-engagement |
| Operational | Push, Email | Payment issues, policy updates, security alerts |
| Provider | Push, Email, SMS | New booking, cancellation, review received |

**Preferences:** Granular opt-in per channel and type; respect DND hours.

**Acceptance Criteria:**
- [ ] Notification delivery tracked; <1% failure rate for transactional
- [ ] Unsubscribe honored within 24 hours
- [ ] Rich push includes deep links to relevant app screens
- [ ] SMS fallback for critical alerts when push disabled

---

### 3.16 Provider / Business Owner Portal

**Priority:** P0

**Description:** Web-based management hub for service providers.

**Modules:**

| Module | Features |
|--------|----------|
| Dashboard | Today's bookings, revenue this week, upcoming week preview |
| Calendar | Day/week/month views; drag-drop reschedule; block time |
| Services | CRUD services, pricing, duration, staff assignment |
| Staff | Add team members, set permissions, manage schedules |
| Clients | CRM view: history, notes, preferences, no-show count |
| Bookings | List view with filters; manual booking entry; check-in |
| Reviews | Monitor, respond, flag; sentiment overview |
| Settings | Business hours, cancellation policy, payment account, integrations |
| Analytics | Occupancy rate, revenue trends, popular services, client retention |

**Acceptance Criteria:**
- [ ] Calendar supports multi-staff view with color coding
- [ ] Manual bookings send confirmation to client automatically
- [ ] Staff permissions restrict access (e.g., receptionist vs owner)
- [ ] Export data to CSV/Excel for accounting

---

### 3.17 Admin Dashboard

**Priority:** P2

**Description:** Platform operations and governance.

| Module | Features |
|--------|----------|
| Overview | MAU, bookings, GMV, top categories, geographic heatmap |
| Users | Search, suspend, impersonate; KYC review for providers |
| Businesses | Approve new registrations, feature/promote, investigate |
| Content | Moderate reviews, manage categories, handle disputes |
| Finance | Payout management, fee adjustment, refund approval |
| System | Webhook logs, job queue status, feature flags |

**Acceptance Criteria:**
- [ ] Critical alerts (payment failures, abuse spikes) surface in real-time
- [ ] Audit log immutable for all admin actions
- [ ] Data export for regulatory compliance

---

### 3.18 Background Jobs (BullMQ)

**Priority:** P1 (Infrastructure)

**Description:** Asynchronous task processing for reliability and scale.

| Queue | Jobs | Priority | Retry |
|-------|------|----------|-------|
| `notifications` | Send push, email, SMS | High | 3x exponential |
| `payments` | Process charges, webhooks, payouts | Critical | 5x with alert |
| `bookings` | Slot hold expiry, waitlist fulfillment, no-show marking | High | 3x |
| `search` | Index updates, availability cache warm | Medium | 2x |
| `reports` | Nightly aggregations, email digests | Low | 2x |
| `media` | Image resize, video transcode | Low | 3x |

**Acceptance Criteria:**
- [ ] Job processing latency <5 seconds for critical queues
- [ ] Dead letter queue for failed jobs; manual retry UI
- [ ] Queue depth alerts at >1000 pending jobs
- [ ] Job idempotency enforced via unique job IDs

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | App cold start <3s; page load <2s; API p95 <500ms |
| Scalability | Support 10k concurrent users; 100k daily bookings |
| Security | OWASP Top 10 mitigation; annual penetration test |
| Compliance | GDPR, CCPA, PCI DSS Level 1 |
| Reliability | 99.9% uptime; <0.1% error rate for critical paths |
| Localization | EN, FR, DE, ES at launch; RTL support planned |

---

## 5. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Guest Browse, Search, Business Detail, Booking, Appointments, Payments, Provider Portal | Month 1-2 |
| V1.1 | Map Search, Favorites, Reviews, Notifications | Month 3 |
| V1.2 | Categories, Waitlist, Group Booking, Analytics | Month 4 |
| V2 | Admin Dashboard, Marketing Tools, API Partners | Month 5-6 |

---

## 6. Success Metrics

| Metric | Target |
|--------|--------|
| Booking Conversion Rate | >15% from search to confirmed |
| Guest to Registered Conversion | >30% |
| Provider Activation | >80% complete profile; >50% receive first booking in 7 days |
| NPS | >50 for consumers; >40 for providers |
| Monthly Churn | <5% consumers; <3% providers |

---

*Document Version: 1.0*
*Last Updated: 2024*
*Owner: Alex, Product Owner*