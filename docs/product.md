# Planity Clone - Product Specification

## 1. Overview

A mobile-first platform connecting customers with beauty/wellness businesses for appointment booking. Dual-sided marketplace: consumer app + business owner portal.

---

## 2. User Personas

| Persona | Goals |
|---------|-------|
| **Customer** | Discover, book, manage appointments; find deals |
| **Business Owner** | Manage bookings, staff, services, grow clientele |
| **Admin** | Platform health, user management, business onboarding |

---

## 3. Feature Specifications

### 3.1 User Authentication
**Priority:** P0

| Item | Specification |
|------|---------------|
| Registration | Email/password, Google OAuth, Apple Sign-In |
| Login | JWT access + refresh tokens; biometric (Face ID/Touch ID) |
| Password Reset | Email link with 1-hour expiry |
| Phone Verification | SMS OTP required before first booking |
| Session | 30-day refresh token; auto-logout on security-sensitive actions |

**Acceptance Criteria:**
- AC1: User can register with email + password, receive verification email
- AC2: OAuth users auto-create account; merge with existing email if matched
- AC3: Biometric prompt shown after 3rd successful login
- AC4: Token refresh is transparent; user never sees auth errors mid-session
- AC5: Rate limit: 5 login attempts → 15-min lockout

---

### 3.2 Guest Browse & Explore
**Priority:** P0

| Item | Specification |
|------|---------------|
| Home Feed | Curated categories, nearby businesses, promotions |
| Location | Auto-detect or manual city/neighborhood selection |
| Deep Links | Guest can share business/service URLs; receiver sees preview |
| Conversion | Persistent banner prompting signup to book |

**Acceptance Criteria:**
- AC1: Guest sees full catalog; booking button triggers auth modal
- AC2: Location stored in session; persists 7 days
- AC3: Guest → registered user: cart/booking state preserved
- AC4: SEO-optimized public business pages crawlable

---

### 3.3 Business Search & Discovery
**Priority:** P0

| Item | Specification |
|------|---------------|
| Search | Full-text on business name, service name, staff name |
| Filters | Category, price range, rating (4+), availability (today/this week), distance, amenities |
| Sorting | Relevance, distance, rating, price (low/high) |
| Autocomplete | Debounced 300ms; max 10 suggestions |
| Recent Searches | Store last 10; clearable |

**Acceptance Criteria:**
- AC1: Search returns results in <300ms for 90th percentile
- AC2: Empty state shows trending categories near user
- AC3: Filter combination yields correct intersection (not union)
- AC4: Typo tolerance: Levenshtein distance ≤2

---

### 3.4 Map-based Search
**Priority:** P1

| Item | Specification |
|------|---------------|
| Map View | Toggle from list; cluster markers at zoom <12 |
| Business Pins | Price indicator, rating, open/closed status |
| Interaction | Tap pin → bottom sheet preview; tap preview → detail |
| Boundary Search | Pan/zoom triggers re-query with viewport bounds |
| User Location | Blue dot; accuracy ring; follow mode |

**Acceptance Criteria:**
- AC1: Map renders 500 markers without FPS drop (<16ms frame)
- AC2: Clustering groups pins within 50px at given zoom
- AC3: Viewport query returns businesses within visible bounds + 10% buffer
- AC4: Location permission denied → fallback to city center from profile

---

### 3.5 Business Detail View
**Priority:** P0

| Item | Specification |
|------|---------------|
| Header | Gallery (max 10 images), name, rating, category, favorite toggle |
| Info | Address, hours (today's hours + full schedule), phone, website |
| Services | Grouped by category; expandable; price + duration |
| Staff | Horizontal scroll; tap to filter services by staff |
| Reviews | Summary + paginated list; sort by recent/helpful |
| Actions | "Book" CTA sticky bottom; share, report |

**Acceptance Criteria:**
- AC1: Gallery supports pinch-zoom, swipe, video (max 30s)
- AC2: Hours show "Open now" / "Closes at X" / "Closed" dynamically
- AC3: Deep link to specific service pre-selects it in booking flow
- AC4: Report business → admin queue; auto-ack in 24h

---

### 3.6 Service Categories
**Priority:** P0

| Item | Specification |
|------|---------------|
| Hierarchy | 2-level: Category (e.g., Hair) → Subcategory (e.g., Coloring) |
| Icons | Custom SVG per category; fallback generic |
| Discovery | Trending, new, seasonal promotions |
| Business Assignment | Business selects from platform taxonomy; can request additions |

**Acceptance Criteria:**
- AC1: Category tree loaded at app start; stale after 7 days
- AC2: Business must select ≥1 category to appear in search
- AC3: Category change triggers re-indexing within 5 minutes

---

### 3.7 Booking Flow
**Priority:** P0

| Step | Action |
|------|--------|
| 1. Service Selection | Multi-select services; running total of price/time |
| 2. Staff Selection | "Any" or specific staff; show next available per staff |
| 3. Date/Time | Calendar view; slots computed from availability engine |
| 4. Options | Add-ons, notes, coupon code |
| 5. Review | Order summary; cancellation policy; payment method |
| 6. Confirmation | Booking ID; add to calendar; share |

**Acceptance Criteria:**
- AC1: Slot selection holds reservation for 10 minutes (distributed lock)
- AC2: Concurrent booking conflict: first commit wins; second sees "Just booked"
- AC3: Coupon validation: real-time; error if invalid/expired/usage exceeded
- AC4: Booking confirmation push + email within 5 seconds
- AC5: Partial failure (payment succeeds, booking fails) → automatic refund + alert

---

### 3.8 Appointment Management
**Priority:** P0

| Item | Specification |
|------|---------------|
| Customer View | Upcoming (sorted chronologically), past, cancelled tabs |
| Actions | Reschedule (same business, new slot), cancel with policy enforcement, rebook |
| Reminders | Push + SMS at T-24h, T-2h (configurable by business) |
| No-show | Customer marked after 15 min past start; business can flag |

**Acceptance Criteria:**
- AC1: Cancel within free window: instant, no penalty
- AC2: Cancel in fee window: payment processed per policy
- AC3: Reschedule: release old slot atomically, hold new slot
- AC4: Past appointments: prompt to review if unrated

---

### 3.9 Favorites
**Priority:** P1

| Item | Specification |
|------|---------------|
| Save | Heart toggle on business card, detail, search result |
| List View | Grid of saved businesses; sort by saved date, name |
| Notifications | Opt-in for deal alerts from favorited businesses |
| Sync | Cross-device; survive app reinstall via account |

**Acceptance Criteria:**
- AC1: Favorite/unfavorite is idempotent; debounce rapid toggles
- AC2: Limit 500 favorites per user; soft warning at 450
- AC3: Offline: queue toggle; sync on reconnect

---

### 3.10 User Profile
**Priority:** P1

| Item | Specification |
|------|---------------|
| Fields | Name, photo, phone, email, birthday (for deals), default city |
| Preferences | Notification settings, language, currency, accessibility |
| Payment Methods | Cards (Stripe), Apple Pay, Google Pay; default selection |
| History | All bookings; export to PDF (year-end tax) |
| Privacy | GDPR data export, account deletion (30-day grace) |

**Acceptance Criteria:**
- AC1: Profile completion percentage drives UI prompts
- AC2: Phone change triggers re-verification
- AC3: Account deletion: anonymize bookings, purge PII, retain financial records per law

---

### 3.11 Availability & Slot Computation
**Priority:** P0 (Critical Backend)

| Item | Specification |
|------|---------------|
| Business Rules | Operating hours, staff schedules, service durations, buffer time |
| Constraints | Staff vacation, concurrent booking limits, equipment |
| Computation | Generate slots in 15-min increments; respect service duration |
| Caching | Redis with 5-min TTL; invalidate on schedule change |
| Edge Cases | Cross-day service (e.g., 11pm start), DST transitions |

**Acceptance Criteria:**
- AC1: Slot query for single business + day returns in <100ms
- AC2: Double-booking impossible at database constraint level
- AC3: Schedule change by business invalidates cache within 30 seconds
- AC4: Overnight service correctly blocks subsequent morning slots

---

### 3.12 Shared Types & Design System
**Priority:** P1

| Item | Specification |
|------|---------------|
| Components | Buttons, inputs, cards, modals, bottom sheets, skeleton loaders |
| Theme | Light/dark mode; brand color injection per business (subtle) |
| Typography | Scale: 12 sizes; weights: regular, medium, semibold, bold |
| Spacing | 4px base grid; consistent across platforms |
| Accessibility | WCAG 2.1 AA; minimum 44pt touch targets; VoiceOver/TalkBack |

**Acceptance Criteria:**
- AC1: All new features use design system components; no custom one-offs
- AC2: Dark mode respects system setting; manual override persisted
- AC3: Accessibility audit: 0 critical, 0 serious issues

---

### 3.13 Reviews & Ratings
**Priority:** P1

| Item | Specification |
|------|---------------|
| Eligibility | Verified customers only; 14-day window post-appointment |
| Content | 1-5 stars, text (max 1000 chars), photo (max 5), staff rating |
| Moderation | Auto-approve + ML toxicity flag; human review queue |
| Response | Business owner can reply once; edit within 24h |
| Impact | Weighted by recency; flagged reviews excluded from average |

**Acceptance Criteria:**
- AC1: Review submission rate target: 30% of eligible appointments
- AC2: Toxic content flagged within 5 minutes; human review <4h
- AC3: Business average updates within 1 hour of new review
- AC4: Customer can edit own review within 48h; delete anytime

---

### 3.14 Payment Integration
**Priority:** P0

| Item | Specification |
|------|---------------|
| Processor | Stripe; PCI compliance via tokenization |
| Flow | Customer: authorize at booking, capture at appointment completion or per policy |
| Methods | Cards, Apple Pay, Google Pay, Klarna (BNPL) |
| Refunds | Full/partial; automated per cancellation policy; manual by business |
| Payouts | Business owners: weekly to connected bank; 2-day hold minimum |
| Fees | Platform fee: 15% + payment processing 2.9% + 30¢ |

**Acceptance Criteria:**
- AC1: Payment intent created client-side; confirm server-side with idempotency key
- AC2: Webhook handling: retry with exponential backoff; alert on failure
- AC3: Failed payment: graceful degradation, user retry, slot release after 10 min
- AC4: Payout reconciliation: automated daily; discrepancy alert

---

### 3.15 Notifications
**Priority:** P1

| Channel | Use Case |
|---------|----------|
| Push | Booking confirmations, reminders, promotions, chat |
| SMS | Critical: booking changes, 2FA; opt-in for marketing |
| Email | Receipts, summaries, account security |
| In-App | Activity feed; badge on profile tab |

**Acceptance Criteria:**
- AC1: User can toggle per-channel, per-type in preferences
- AC2: Quiet hours: no push 22:00-08:00 local time unless emergency
- AC3: Delivery tracking: log all sends; retry push via SMS fallback for critical
- AC4: Unsubscribe: one-tap in email; honored within 24h

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0

| Module | Features |
|--------|----------|
| Dashboard | Today's bookings, revenue this week, occupancy rate |
| Calendar | Day/week/month views; drag-drop reschedule; block time |
| Services | CRUD; pricing; duration; buffer; online visibility toggle |
| Staff | Profiles, schedules, permissions (view/book/admin) |
| Clients | CRM: notes, visit history, marketing opt-in status |
| Settings | Business hours, cancellation policy, payment account, integrations |
| Analytics | Booking volume, revenue, no-show rate, popular services, staff utilization |

**Acceptance Criteria:**
- AC1: Calendar supports multi-staff view; color-coded by status
- AC2: Staff permission: "view own" vs "view all" vs "manage business"
- AC3: Cancellation policy: configurable windows (e.g., free 24h, 50% 4-24h, 100% <4h)
- AC4: Export reports: CSV, PDF; scheduled monthly emails

---

### 3.17 Admin Dashboard
**Priority:** P2

| Module | Features |
|--------|----------|
| Businesses | Onboarding queue, verification, suspension, featured flag |
| Users | Search, view, suspend, impersonate (audit log) |
| Bookings | Dispute resolution, refund processing, fraud indicators |
| Content | Category management, featured curation, promotion creation |
| Finance | Platform fee reconciliation, payout monitoring, invoice generation |
| System | Webhook logs, job queue status, error rates, feature flags |

**Acceptance Criteria:**
- AC1: Business onboarding: document verification, manual approval, automated follow-up
- AC2: Impersonation: full audit trail; auto-logout after 30 min
- AC3: Dispute resolution: SLA 48h response; escalation workflow
- AC4: Real-time dashboard: 5-second refresh on critical metrics

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P1 (Infrastructure)

| Job | Trigger | Schedule |
|-----|---------|----------|
| Slot Pre-computation | Business hours change | On-demand + nightly |
| Reminder Notifications | Booking created | T-24h, T-2h calculated |
| Payment Capture | Appointment completed | Real-time webhook + hourly sweep |
| Payout Batch | Weekly | Every Monday 09:00 UTC |
| Review Prompt | Appointment past | 2 hours post-end time |
| Data Retention | Daily | 03:00 UTC; anonymize >2yr old |
| Search Re-index | Business/service change | Real-time + nightly full |
| Fraud Scoring | New booking/payment | Real-time + hourly re-eval |

**Acceptance Criteria:**
- AC1: All jobs have retry logic: 3 attempts, exponential backoff
- AC2: Dead letter queue: alert after 3 failures; manual inspection UI
- AC3: Job concurrency: configurable per queue; prevent resource starvation
- AC4: Monitoring: Grafana dashboard; P95 latency, error rate, queue depth

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | App cold start <2s; screen load <1s; API p95 <200ms |
| Reliability | 99.9% uptime; <0.1% booking failure rate |
| Security | OWASP Top 10; annual penetration test; SOC 2 Type II |
| Scalability | 10M MAU, 100K concurrent bookings/hour |
| Compliance | GDPR, CCPA, PCI-DSS Level 1 |

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Monthly Bookings | +15% MoM (ramp) |
| Booking Completion Rate | >70% (cart to confirmation) |
| NPS | >50 |
| Business Retention | >90% at 12 months |
| Customer Acquisition Cost | <$15 |
| Gross Merchandise Value | Track weekly |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Search, Business Detail, Booking, Owner Portal Basic | Month 1-2 |
| v1.0 | Payments, Notifications, Reviews, Favorites, Profile | Month 3 |
| v1.5 | Map Search, Admin Dashboard, Analytics, Promotions | Month 4 |
| v2.0 | Advanced Scheduling, Memberships, Gift Cards, API Partners | Month 5-6 |

---

*Document Version: 1.0*
*Last Updated: 2024*
*Owner: Alex, Product Owner*