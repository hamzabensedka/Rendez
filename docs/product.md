# Planity Clone — Product Specification

## 1. Overview

A mobile-first platform connecting customers with beauty & wellness businesses for appointment booking. Two-sided marketplace: consumer app for discovery/booking, provider portal for business management, admin dashboard for platform operations.

---

## 2. Product Vision & Goals

| Goal | Metric |
|------|--------|
| Reduce booking friction | < 3 taps to book from search |
| Maximize provider utilization | > 80% slot fill rate |
| Build trust & retention | > 4.5★ avg rating, > 30% monthly retention |

---

## 3. Feature Specifications

### 3.1 User Authentication
**Priority:** P0

| Item | Specification |
|------|---------------|
| Methods | Phone (SMS OTP), Email+Password, Google OAuth, Apple Sign-In |
| Onboarding | Post-auth: name, profile photo, notification prefs, location permission |
| Security | JWT access (15min) + refresh (7d), biometric unlock option |
| Guest Support | Full browse enabled; auth gate only at booking attempt |

**Acceptance Criteria:**
- [ ] OTP delivers in < 10s (95th percentile)
- [ ] Token refresh seamless, no UX interruption
- [ ] Account deletion flows to 30-day soft-delete then hard purge
- [ ] Rate limit: 3 OTP requests/hour per phone

---

### 3.2 Guest Browse & Explore
**Priority:** P0

| Item | Specification |
|------|---------------|
| Home Feed | Curated: trending near me, new openings, last-minute availability |
| Personalization | Post-auth: past bookings, favorites, time-of-day preferences |
| Location | IP-geolocation fallback, explicit city selector, GPS with radius |

**Acceptance Criteria:**
- [ ] Renders < 2s on 3G
- [ ] Cache 50 nearest businesses for offline skeleton
- [ ] Empty state with "Enable location" CTA if permission denied

---

### 3.3 Business Search & Discovery
**Priority:** P0

| Item | Specification |
|------|---------------|
| Search | Full-text (business name, service, staff name); autocomplete in < 150ms |
| Filters | Distance (1-50km), price range, rating (4.0+), open now, service category, gender of staff, accessibility |
| Sorting | Relevance, distance, rating, price (low-high), availability (next slot soonest) |
| Results | Card: photo, name, rating, distance, price from, next available slot |

**Acceptance Criteria:**
- [ ] Typo-tolerant search (fuzzy match, 2 edit distance)
- [ ] Filter combination returns in < 500ms
- [ ] "No results" suggests expanding radius or alternate categories

---

### 3.4 Map-based Search
**Priority:** P0

| Item | Specification |
|------|---------------|
| Map Provider | Mapbox or Google Maps (cost/performance TBD) |
| Clusters | Auto-cluster at < zoom 12; expand on tap |
| Pins | Color by category; badge if open now + has availability today |
| Interaction | Pan/zoom updates results; tap pin → bottom sheet preview; "List" toggle |
| Directions | Native maps app deep-link with pre-filled destination |

**Acceptance Criteria:**
- [ ] 500 pins render at 60fps
- [ ] Bottom sheet swipes up to full business detail
- [ ] Map state persists on back navigation

---

### 3.5 Business Detail View
**Priority:** P0

| Section | Content |
|---------|---------|
| Hero | Gallery (swipeable, 5-15 images), bookmark CTA, share |
| Info | Name, rating/review count, address, hours, phone, website |
| Services | Expandable by category; each: name, duration, description, price, "Book" |
| Team | Staff profiles with photo, specialty, rating; filter services by staff |
| Reviews | Sortable (recent, highest, lowest); merchant response visible |
| Availability | Inline mini-calendar → slot grid for selected service+staff |

**Acceptance Criteria:**
- [ ] Page loads < 1.5s; images lazy-loaded with blur placeholder
- [ ] "Book" pre-selects service+staff, jumps to booking flow
- [ ] Share generates deep-link with preview image

---

### 3.6 Service Categories
**Priority:** P0

| Item | Specification |
|------|---------------|
| Taxonomy | Hair, Nails, Face/Skin, Body/Massage, Hair Removal, Makeup, Medical Aesthetic, Wellness (8 top-level) |
| Hierarchy | 2-3 levels max; leaf nodes map to provider-defined services |
| Discovery | Category icons on home; category landing with featured, trending, new |

**Acceptance Criteria:**
- [ ] Category change reflects in search index within 5 minutes
- [ ] Providers can multi-select categories; primary category determines placement

---

### 3.7 Booking Flow
**Priority:** P0

| Step | Action |
|------|--------|
1. Select Service | From business detail or re-book from history
2. Select Staff | "Any" option for first available; shows staff availability
3. Select Date | Calendar with availability indicators (full, limited, none)
4. Select Time | Slot grid: morning/afternoon/evening; shows duration conflict prevention
5. Add-ons | Upsell: extra service, product, gift card
6. Confirm | Service, staff, time, location, price, cancellation policy, payment method
7. Pay/Hold | Full pay or deposit (configurable by business)
8. Confirmation | Booking reference, add to calendar, share, directions

**Acceptance Criteria:**
- [ ] Abandoned cart: save state 24h, push reminder after 1h
- [ ] Double-booking prevented via optimistic lock + DB unique constraint
- [ ] 10-min hold on slot during checkout; release on timeout/abandon
- [ ] Guest checkout: collect name, phone, email; auto-create account post-booking

---

### 3.8 Appointment Management
**Priority:** P0

| View | Content |
|------|---------|
| Upcoming | Sort by date; card: business, service, staff, time, actions (reschedule, cancel, add to calendar) |
| Past | Rebook CTA, leave review (if > 24h after), receipt |
| Detail | Full info, directions, contact, cancel/reschedule per policy |

**Acceptance Criteria:**
- [ ] Reschedule: same business, any future slot; original slot releases immediately
- [ ] Cancel: enforce business policy (free until X hours); refund processed automatically
- [ ] Push + SMS reminders: 24h, 2h, 15min before

---

### 3.9 Favorites
**Priority:** P1

| Item | Specification |
|------|---------------|
| Save | Heart toggle on business card/detail |
| List | Grid/map toggle; same filters as search |
| Alerts | Notify when favorite has new availability (opt-in) |

**Acceptance Criteria:**
- [ ] Sync across devices; survive re-install via account
- [ ] Batch unfavorite with multi-select

---

### 3.10 User Profile
**Priority:** P1

| Section | Content |
|---------|---------|
| Personal | Photo, name, phone, email, birthday (for offers), gender |
| Preferences | Default radius, notification channels, currency, language |
| Payment | Saved cards (PCI-compliant tokenization), Apple/Google Pay default |
| History | All bookings with filter/search; export receipts |
| Settings | Privacy, terms, support chat, delete account |

**Acceptance Criteria:**
- [ ] Profile completion % gamified for engagement
- [ ] GDPR/CCPA export: full data ZIP in < 24h

---

### 3.11 Availability & Slot Computation
**Priority:** P0 — Core Engine

| Component | Specification |
|-----------|---------------|
| Business Hours | Weekly template + exception dates (holidays, closures) |
| Staff Schedules | Individual hours, break rules, concurrent service limits |
| Slot Generation | Real-time based on: business hours - breaks - existing bookings - staff unavailability - service duration - buffer between appointments |
| Buffer Types | Pre (prep), post (clean), between (any service), same-service chain |
| Optimization | Cache slot grids (Redis, 5min TTL); invalidate on booking mutation |

**Acceptance Criteria:**
- [ ] Generate 30-day slot matrix for 5 staff in < 200ms
- [ ] Handle DST transitions, timezone per business
- [ ] Overbooking: 0 tolerance; race condition tested at 1000 concurrent
- [ ] "Waitlist": notify when preferred slot opens due to cancellation

---

### 3.12 Shared Types & Design System
**Priority:** P0 (Enabler)

| Layer | Specification |
|-------|---------------|
| Tokens | Colors (primary #FF6B6B, semantic palette), typography (Inter), spacing (4px grid), shadows, radii |
| Components | Button variants, inputs, cards, modals, bottom sheets, calendar, time picker, skeleton loaders |
| Icons | Phosphor Icons; consistent 24px touch target |
| Accessibility | WCAG 2.1 AA; screen reader labels, focus traps, color contrast |
| Cross-platform | React Native (mobile) + React (web) shared via Storybook |

**Acceptance Criteria:**
- [ ] Component library documented with usage examples
- [ ] Dark mode support
- [ ] RTL language ready

---

### 3.13 Reviews & Ratings
**Priority:** P1

| Item | Specification |
|------|---------------|
| Eligibility | Post-appointment, 24h cooldown, 30-day window |
| Dimensions | Overall (1-5★), service quality, staff, ambiance, value (optional) |
| Content | Text (500 max), photos (5 max), staff attribution |
| Moderation | Auto-flag profanity; manual queue for disputes |
| Response | Business owner reply; marked as "Owner Response" |

**Acceptance Criteria:**
- [ ] Verified badge: "Verified booking" for completed appointments
- [ ] Reviewer anonymity option: display "Alex B." or "Verified Customer"
- [ ] Aggregate recalculates within 5min of new review

---

### 3.14 Payment Integration
**Priority:** P0

| Item | Specification |
|------|---------------|
| Processor | Stripe (primary); Adyen (EU expansion) |
| Methods | Cards, Apple Pay, Google Pay, PayPal, Klarna (BNPL) |
| Flows | Immediate charge, deposit + balance, hold + capture, subscription (packages) |
| Split | Platform fee auto-deducted; net to business on configurable schedule (daily/weekly/monthly) |
| Refunds | Full, partial, no-show (per business policy); auto-processed via admin override |

**Acceptance Criteria:**
- [ ] PCI compliance: never touch raw card data
- [ ] 3D Secure handled natively
- [ ] Receipt email + in-app within 30s of success
- [ ] Failed payment: 3 retry attempts with user notification

---

### 3.15 Notifications
**Priority:** P1

| Channel | Triggers |
|---------|---------|
| Push | Booking confirmed, reminder (24h/2h/15min), rescheduled, cancelled, promotion from favorite, waitlist available |
| SMS | Backup for critical: confirmation, same-day reminder, cancellation |
| Email | Receipt, review request, marketing (opt-in), account security |
| In-App | Notification center with unread badge; deep-link to relevant screen |

**Acceptance Criteria:**
- [ ] Preference center: granular opt-out per channel/type
- [ ] Delivery rate: push > 95%, SMS > 99%, email > 98%
- [ ] Quiet hours: no push 22:00-08:00 local time

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0

| Module | Features |
|--------|----------|
| Dashboard | Today's appointments, revenue today/this week, occupancy %, pending reviews |
| Calendar | Day/week/month views; drag to reschedule; block time; staff filter |
| Services | CRUD services: name, category, duration, price, description, buffer rules, online booking enabled |
| Staff | Profiles, schedules, services assigned, commission tracking |
| Clients | CRM: notes, visit history, preferences, marketing consent |
| Bookings | All status filter; manual booking (walk-in/phone); cancel with reason |
| Availability | Set recurring hours, time off, closures; override specific dates |
| Payments | Payout schedule, transaction history, invoices, tax documents |
| Reviews | Respond, report, aggregate analytics |
| Settings | Business info, photos, policies (cancellation, no-show), integrations (Google Business, POS) |

**Acceptance Criteria:**
- [ ] Mobile-responsive web app; native app optional P2
- [ ] Role-based access: Owner, Manager, Staff (view own only)
- [ ] Real-time sync: booking appears in < 3s across all staff devices

---

### 3.17 Admin Dashboard
**Priority:** P1

| Module | Features |
|--------|---------|
| Overview | KPIs: GMV, bookings, active users, churn, top categories, geographic heatmap |
| Businesses | Onboard, verify (KYB), suspend, feature, search/filter by status |
| Users | Search, view, suspend, impersonate (audit log), export |
| Bookings | Full visibility; intervene (cancel, refund, reassign) |
| Reviews | Moderate, remove, dispute resolution |
| Finance | Reconcile transactions, manage payouts, handle chargebacks, promo codes |
| Support | Ticket system, live chat integration, canned responses |
| System | Feature flags, announcement banners, rate limits, maintenance mode |

**Acceptance Criteria:**
- [ ] Audit log: immutable, queryable, 7-year retention
- [ ] RBAC: Super Admin, Ops, Finance, Support roles
- [ ] All destructive actions require MFA + justification

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P0 (Infrastructure)

| Queue | Jobs | Priority |
|-------|------|----------|
| `notifications` | Push/SMS/email dispatch, batch digest | High |
| `bookings` | Slot hold expiration, waitlist notification, no-show check-in | Critical |
| `payments` | Payout calculation, retry failed charges, invoice generation | High |
| `search` | Index updates, suggestion rebuild | Medium |
| `reports` | Daily/weekly/monthly aggregated reports, export generation | Low |
| `cleanup` | Soft-delete purge, log archival, temp file removal | Low |

**Acceptance Criteria:**
- [ ] Job retry: exponential backoff, max 5 attempts, dead-letter queue
- [ ] Observability: job success/failure rate, latency percentiles, queue depth alerts
- [ ] Stalled job detection; manual requeue capability
- [ ] Horizontal scaling: workers per queue independent

---

## 4. Non-Functional Requirements

| Area | Target |
|------|--------|
| Performance | P95 API < 200ms; page load < 1.5s; TTI < 3s |
| Availability | 99.9% uptime; scheduled maintenance < 1h/month |
| Security | OWASP Top 10; annual penetration test; SOC 2 Type II roadmap |
| Compliance | GDPR, CCPA, PCI-DSS (Level 1 if > 6M transactions) |
| Localization | EN, FR, DE, ES, IT (Phase 1); RTL (Phase 2) |

---

## 5. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Search, Business Detail, Booking, Provider Portal (basic), Payments | 8 weeks |
| v1.0 | Map, Favorites, Reviews, Notifications, Appointments, Admin Dashboard | +6 weeks |
| v1.5 | Waitlist, Packages/Subscriptions, Staff-specific flows, Advanced Analytics | +8 weeks |
| v2.0 | Marketplace (product sales), AI recommendations, International expansion | +12 weeks |

---

## 6. Success Metrics

| Metric | Target |
|--------|--------|
| Monthly Bookings | 10% MoM growth |
| NPS | > 50 |
| Booking Completion Rate | > 85% (cart → confirm) |
| Provider Activation | > 70% complete profile, > 50% first booking in 7 days |
| Customer Acquisition Cost | < 20% LTV |
| Support Tickets | < 2% of bookings |

---

*Last updated: 2024 | Owner: Alex (Product) | Review cycle: Bi-weekly*
