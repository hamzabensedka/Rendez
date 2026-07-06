# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first appointment booking platform connecting customers with beauty, wellness, and service professionals. It serves three user segments: customers seeking and booking services, business owners managing their presence and appointments, and administrators overseeing platform health.

**Target Platforms:** iOS, Android, Web (responsive)
**Monetization:** Commission on bookings, subscription tiers for businesses, featured listings

---

## 2. User Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Customer** | Books appointments for personal services | Discover, compare, book, manage appointments |
| **Guest** | Unauthenticated browser | Explore without commitment |
| **Business Owner** | Manages salon/clinic/practice | Configure services, set availability, manage bookings |
| **Staff Member** | Employee of a business | View schedule, manage own availability |
| **Admin** | Platform operator | Monitor, moderate, support, analyze |

---

## 3. Feature Specifications

### 3.1 User Authentication

**Priority:** P0 | **Owner:** Backend/Frontend

| Aspect | Specification |
|--------|---------------|
| **Registration Methods** | Email/password, Google OAuth, Apple Sign-In |
| **Login** | JWT access + refresh tokens, biometric option (Face ID/Touch ID) |
| **Password Recovery** | Email reset link with 1-hour expiry |
| **Account Security** | Rate limiting on login attempts, suspicious activity detection |
| **Onboarding** | Post-registration flow: name, phone, optional profile photo, location permission request |

**Acceptance Criteria:**
- [ ] User can register with email in < 30 seconds
- [ ] OAuth flows complete without password prompt
- [ ] Biometric login works after initial setup
- [ ] Token refresh is seamless (no user-facing re-auth for 30 days)
- [ ] Account deletion available in settings (GDPR compliant)

---

### 3.2 Guest Browse & Explore

**Priority:** P0 | **Owner:** Frontend

| Aspect | Specification |
|--------|---------------|
| **Access Level** | No account required for browsing, search, and viewing business details |
| **Limitations** | Booking requires account creation (triggered at checkout) |
| **Conversion Path** | Persistent "Book" CTAs prompt signup; pre-filled data from guest session carried through |

**Acceptance Criteria:**
- [ ] Guest can view full business directory and detail pages
- [ ] Guest search history stored locally (cleared on logout)
- [ ] Transition to registered user preserves cart/session state
- [ ] App store compliance: core functionality visible without login

---

### 3.3 Business Search & Discovery

**Priority:** P0 | **Owner:** Backend/Frontend

| Aspect | Specification |
|--------|---------------|
| **Search Inputs** | Text query (business name, service name), filters (category, price range, rating, distance, availability today) |
| **Sorting Options** | Relevance, distance, rating, price (low to high), availability soonest |
| **Results Display** | Card list with: cover image, business name, rating, starting price, distance, next available slot |
| **Autocomplete** | Suggest businesses, services, neighborhoods; debounced 300ms |
| **Search History** | Store last 10 searches per user; allow clear |

**Acceptance Criteria:**
- [ ] Search returns results in < 500ms for cached indexes
- [ ] Empty state suggests popular categories nearby
- [ ] Filters combine with AND logic; can be reset individually
- [ ] Results update on map interaction (see 3.4)

---

### 3.4 Map-based Search

**Priority:** P0 | **Owner:** Frontend

| Aspect | Specification |
|--------|---------------|
| **Map Provider** | Mapbox or Google Maps (evaluate cost at scale) |
| **Default View** | User location with 5km radius; fallback to city center if denied |
| **Markers** | Clustered pins; color-coded by category; selected state highlight |
| **Interaction** | Pan/zoom triggers new search; bottom sheet with results list swipeable |
| **User Location** | Blue dot with accuracy ring; recenter button |

**Acceptance Criteria:**
- [ ] Map loads in < 2s on 4G
- [ ] Clustering handles 500+ businesses in dense areas
- [ ] Tapping marker opens preview card; second tap navigates to detail
- [ ] List and map states sync bidirectionally

---

### 3.5 Business Detail View

**Priority:** P0 | **Owner:** Frontend

| Aspect | Specification |
|--------|---------------|
| **Header** | Image carousel (up to 10), business name, category, rating/review count, favorite toggle |
| **Info Section** | Address with directions link, hours (today highlighted), phone, website, social links |
| **Services Tab** | Grouped by category, expandable, with duration and price |
| **Team Tab** | Staff profiles with photos, specialties, ratings |
| **Reviews Tab** | Rating distribution, review list with photos, owner responses |
| **Booking CTA** | Sticky bottom button; disabled if no available slots |

**Acceptance Criteria:**
- [ ] Page loads in < 1.5s (skeleton loading)
- [ ] Images lazy-loaded with blur placeholder
- [ ] Deep linking to any business works (shareable URL)
- [ ] "Closed" businesses show next open time

---

### 3.6 Service Categories

**Priority:** P0 | **Owner:** Backend/Frontend

| Aspect | Specification |
|--------|---------------|
| **Hierarchy** | Category → Subcategory → Service (e.g., Hair → Coloring → Balayage) |
| **Category Icons** | Custom icon set, consistent style |
| **Discovery** | Horizontal scroll on home; category landing pages with featured businesses |
| **Business Assignment** | Multiple categories per business; primary category for ranking |

**Acceptance Criteria:**
- [ ] 15+ seed categories at launch
- [ ] Category pages are SEO-optimized with static generation
- [ ] Business can self-categorize; admin moderation for changes

---

### 3.7 Booking Flow

**Priority:** P0 | **Owner:** Full Stack

| Step | Specification |
|------|---------------|
| **1. Service Selection** | Single or multiple services; duration and price cumulative |
| **2. Staff Preference** | "Any" or specific staff; filter slots by availability |
| **3. Date/Time** | Calendar view (next 60 days); time slots in 15-min increments; show timezone |
| **4. Add-ons** | Optional upsells (e.g., deep conditioning, product purchase) |
| **5. Customer Details** | Pre-filled for logged users; guest fields: name, phone, email, optional notes |
| **6. Payment** | See 3.14 |
| **7. Confirmation** | Booking reference, add to calendar, share option |

**Slot Rules:**
- Slots computed from business hours, staff schedules, existing bookings, buffer time
- Real-time availability (pessimistic locking for 10 min during checkout)
- Minimum booking notice (configurable by business, default 2 hours)

**Acceptance Criteria:**
- [ ] Complete booking in < 90 seconds (returning user)
- [ ] Slot held during checkout; released on timeout or abandon
- [ ] Clear error if slot taken during flow; suggest alternatives
- [ ] Booking confirmation email/SMS within 30 seconds

---

### 3.8 Appointment Management

**Priority:** P0 | **Owner:** Full Stack

| Aspect | Specification |
|--------|---------------|
| **Customer Views** | Upcoming (sorted by date), Past, Cancelled |
| **Actions** | Reschedule (same business, new slot selection), Cancel with reason, Rebook |
| **Details** | QR code for check-in, directions, contact business, add note |
| **Reminders** | Push + SMS 24h and 1h before (configurable) |

**Cancellation Policy:**
- Business-configurable: free until X hours before, then percentage fee or full charge
- Customer sees policy before confirming cancellation

**Acceptance Criteria:**
- [ ] Upcoming appointments sync across devices
- [ ] Cancellation updates all parties in real-time
- [ ] Reschedule maintains original payment (adjustment if price differs)
- [ ] No-show flagging for repeat offenders

---

### 3.9 Favorites

**Priority:** P1 | **Owner:** Frontend

| Aspect | Specification |
|--------|---------------|
| **Function** | Heart toggle on business cards/detail; saved to account |
| **List View** | Grid of favorited businesses with next available slot badge |
| **Notifications** | Optional: alert when favorite adds new availability or promotion |

**Acceptance Criteria:**
- [ ] Favorite/unfavorite is instant (optimistic UI, sync in background)
- [ ] Favorites persist across login sessions
- [ ] Maximum 500 favorites per user (performance guardrail)

---

### 3.10 User Profile

**Priority:** P1 | **Owner:** Frontend

| Section | Fields |
|---------|--------|
| **Personal Info** | Name, email, phone, profile photo, birthday (optional, for birthday offers) |
| **Preferences** | Notification settings (push, email, SMS), default search radius, language |
| **Payment Methods** | Saved cards (PCI-compliant tokenization), transaction history |
| **Security** | Password change, biometric toggle, active sessions, 2FA option |

**Acceptance Criteria:**
- [ ] Profile photo upload with crop/resize; max 5MB
- [ ] All fields editable except email (requires verification flow)
- [ ] Data export available (GDPR)

---

### 3.11 Availability & Slot Computation

**Priority:** P0 | **Owner:** Backend

| Aspect | Specification |
|--------|---------------|
| **Data Model** | Business hours (weekly template + exceptions), staff schedules, service durations, buffer between appointments |
| **Computation** | Generate available slots on-demand; cache for 5 minutes; invalidate on booking change |
| **Complex Rules** | Staff-specific services, concurrent room/equipment constraints, variable service durations |
| **Performance** | Slot query for 60 days returns in < 200ms |

**Algorithm Requirements:**
- Support recurring schedules with override dates (holidays, vacation)
- Handle DST transitions correctly
- Bulk availability update for business owners

**Acceptance Criteria:**
- [ ] Accurate slots reflect all constraints
- [ ] No double-bookings at any concurrency level
- [ ] Cache invalidation is reliable (no stale slots)
- [ ] Audit log for schedule changes

---

### 3.12 Shared Types & Design System

**Priority:** P0 | **Owner:** Design/Frontend

| Element | Specification |
|---------|---------------|
| **Design Tokens** | Colors, typography, spacing, shadows, border-radius in theme object |
| **Components** | Button, Input, Card, Modal, DatePicker, TimeSlot, Avatar, Rating, Badge |
| **Accessibility** | WCAG 2.1 AA: minimum contrast, screen reader labels, focus states, font scaling |
| **Platform Conventions** | iOS/Android native navigation patterns where appropriate |

**Acceptance Criteria:**
- [ ] All components in Storybook/ equivalent with usage docs
- [ ] Dark mode support
- [ ] RTL language ready
- [ ] Consistent loading, error, and empty states

---

### 3.13 Reviews & Ratings

**Priority:** P1 | **Owner:** Full Stack

| Aspect | Specification |
|--------|---------------|
| **Eligibility** | Only customers with completed appointments can review (verified purchase) |
| **Rating Dimensions** | Overall (1-5 stars), optional: service quality, ambiance, staff professionalism |
| **Content** | Text (500 char max), photos (up to 5), staff attribution |
| **Moderation** | Auto-approve; flag for review: profanity, competitor mention, dispute by business |
| **Response** | Business owner can reply publicly once per review |

**Acceptance Criteria:**
- [ ] Review prompt triggers 24h after appointment completion
- [ ] Average rating recalculates within 1 minute of new review
- [ ] Sortable by: most recent, most helpful, highest/lowest rated
- [ ] Reported reviews reviewed by admin within 24 hours

---

### 3.14 Payment Integration

**Priority:** P0 | **Owner:** Backend

| Aspect | Specification |
|--------|---------------|
| **Provider** | Stripe (primary), Adyen (Europe expansion) |
| **Methods** | Cards, Apple Pay, Google Pay, SEPA (EU), Klarna/Afterpay (BNPL) |
| **Flows** | Pay in full, deposit (configurable %), pay at business |
| **Pricing** | Transparent fee display: service price + platform fee (if any) + tax |
| **Security** | PCI DSS Level 1 via provider; never store raw card data |
| **Payouts** | Business receives net amount minus commission; weekly or monthly |

**Acceptance Criteria:**
- [ ] Payment intent created at checkout start; confirm on booking success
- [ ] Webhook handling for: success, failure, dispute, refund
- [ ] Refund processing in < 7 business days
- [ ] Invoice/receipt generation and email delivery

---

### 3.15 Notifications

**Priority:** P1 | **Owner:** Backend/Frontend

| Channel | Use Cases |
|---------|-----------|
| **Push** | Booking confirmation, reminders, cancellations, promotions, new availability at favorites |
| **SMS** | Critical: booking changes, day-before reminders; opt-in for marketing |
| **Email** | Receipts, account activity, monthly summaries, re-engagement |
| **In-App** | Notification center with read/unread state; deep link to relevant screen |

**Acceptance Criteria:**
- [ ] User controls per-channel, per-type preferences
- [ ] Delivery rate > 95% for push (tracked via FCM/APNs feedback)
- [ ] Respect quiet hours (default 22:00-08:00 local time)
- [ ] Unsubscribe compliance for marketing communications

---

### 3.16 Provider / Business Owner Portal

**Priority:** P0 | **Owner:** Full Stack (Web)

| Module | Features |
|--------|----------|
| **Dashboard** | Today's appointments, revenue this week, new reviews, quick actions |
| **Calendar** | Day/week/month views; drag-to-reschedule; color-coded by status |
| **Services** | CRUD services, pricing, duration, assignable staff, photos |
| **Staff** | Add members, set permissions, manage individual schedules |
| **Availability** | Set weekly hours, block dates, vacation, buffer times |
| **Bookings** | View all, filter by status, manual entry for walk-ins/phone bookings |
| **Customers** | CRM: visit history, notes, allergies/preferences, marketing consent |
| **Settings** | Business info, photos, cancellation policy, payment account, integrations |

**Acceptance Criteria:**
- [ ] Portal is responsive (desktop primary, tablet usable)
- [ ] Real-time calendar sync with customer-facing app
- [ ] Staff permissions: Owner > Manager > Staff (view-only own schedule)
- [ ] Export bookings to .ics / Google Calendar / Outlook

---

### 3.17 Admin Dashboard

**Priority:** P1 | **Owner:** Full Stack (Web)

| Module | Features |
|--------|----------|
| **Overview** | KPIs: bookings, GMV, new users, active businesses, churn |
| **User Management** | Search, view, suspend, impersonate; GDPR deletion requests |
| **Business Management** | Onboard, verify (KYB), feature, suspend, commission tier assignment |
| **Content Moderation** | Review queue for flagged businesses, reviews, photos |
| **Finance** | Transaction ledger, payout batches, dispute handling, invoice generation |
| **Support** | Ticket system integration, refund issuance, manual booking adjustment |
| **System** | Feature flags, announcement banners, maintenance mode |

**Acceptance Criteria:**
- [ ] Role-based access (Admin, Support Agent, Finance, Read-only)
- [ ] Audit log of all admin actions
- [ ] Data export for compliance requests

---

### 3.18 Background Jobs (BullMQ)

**Priority:** P0 | **Owner:** Backend

| Job Type | Description | Schedule/Trigger |
|----------|-------------|------------------|
| **Slot Cache Warm** | Pre-compute popular business slots | Every 15 min |
| **Reminder Dispatch** | Send push/SMS/email reminders | 24h, 1h before appointment |
| **Payment Capture** | Charge held payment intents post-appointment | Appointment end + configurable delay |
| **Payout Batch** | Compile and initiate business payouts | Weekly (configurable) |
| **Review Prompt** | Trigger review request to eligible customers | 24h post-appointment |
| **Data Export** | Generate GDPR export archives | On request, async |
| **Search Index Sync** | Update Elasticsearch/Algolia indexes | On business data change |
| **Notification Digest** | Compile and send daily/weekly digests | User preference schedule |
| **Cleanup** | Purge old logs, temporary files, expired tokens | Nightly |
| **Retry Failed Webhooks** | Reprocess failed payment webhooks | Exponential backoff |

**Acceptance Criteria:**
- [ ] All jobs idempotent (safe to run multiple times)
- [ ] Dead letter queue for failed jobs; alerting on > 5 failures/hour
- [ ] Job progress visible in admin for long-running tasks
- [ ] Graceful shutdown: finish in-progress jobs before process exit

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | App cold start < 2s; API p95 < 200ms; image loading < 1s |
| **Reliability** | 99.9% uptime SLA; zero-downtime deployments |
| **Security** | OWASP Top 10 mitigation; annual penetration testing |
| **Scalability** | Support 10,000 concurrent booking sessions |
| **Localization** | Launch: FR, EN, ES, DE; RTL: AR; currency per market |
| **Analytics** | Amplitude/Mixpanel for product; Grafana for ops |

---

## 5. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | 3.1-3.8, 3.11, 3.14, 3.16 (core), 3.18 | 12 weeks |
| **V1.1** | 3.9, 3.10, 3.13, 3.15, 3.16 (full) | +6 weeks |
| **V1.2** | 3.17, advanced analytics, referral program | +6 weeks |

---

## 6. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion (search → book) | > 8% |
| Day-7 retention | > 30% |
| NPS | > 50 |
| Business activation (profile complete + 1 booking) | > 70% of signups |
| Support tickets per 1000 bookings | < 5 |
| Average app store rating | > 4.5 ★ |

---

*Document Version: 1.0 | Last Updated: 2024 | Owner: Alex (Product Owner)*