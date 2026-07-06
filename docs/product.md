# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a marketplace platform connecting customers with beauty/wellness businesses for appointment booking. It serves three user segments: customers seeking services, business owners managing their operations, and platform administrators overseeing the ecosystem.

**Target Platforms:** iOS, Android, Web (responsive)
**Monetization:** Commission on bookings, premium business subscriptions
**Success Metrics:** Booking conversion rate, GMV, NPS, business retention

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority:** P0 — Critical Path

**Description:** Secure identity verification for all user types with role-based access.

| Aspect | Specification |
|--------|---------------|
| Registration methods | Email/password, Google OAuth, Apple Sign-In, Facebook Login |
| User roles | Customer, Business Owner, Admin |
| Security | JWT access + refresh tokens, OAuth 2.0, password strength enforcement (min 8 chars, 1 uppercase, 1 number) |
| Onboarding | Role selection → profile completion flow → contextual feature tour |
| Account recovery | Email verification link (24hr expiry), password reset via secure token |
| Session management | 30-day refresh token, biometric login option on mobile, force logout on password change |

**Acceptance Criteria:**
- [ ] New user can register with any supported method in < 60 seconds
- [ ] Returning user authenticates in < 10 seconds with biometric or saved credentials
- [ ] Token refresh is seamless and invisible to user
- [ ] Account lockout after 5 failed attempts with email notification
- [ ] GDPR-compliant account deletion with 30-day grace period and data export

---

### 2.2 Guest Browse & Explore
**Priority:** P0 — Discovery Funnel

**Description:** Unauthenticated access to browse businesses and services to reduce friction for new users.

| Aspect | Specification |
|--------|---------------|
| Accessible content | Business listings, service catalogs, reviews, pricing, availability (no booking) |
| Conversion prompt | Smart CTA appears after 3 page views or 2 minutes browsing: "Book faster — create free account" |
| Location handling | IP-based geolocation with manual override; prompt for precise location at booking attempt |
| Data persistence | Guest session stored locally; merge on registration |

**Acceptance Criteria:**
- [ ] Guest user sees identical searchekted search results as authenticated user for same location
- [ ] Attempting to book triggers auth modal with pre-filled context (business, service, time)
- [ ] Guest search history persists for 7 days or until registration
- [ ] No performance degradation vs. authenticated browsing

---

### 2.3 Business Search & Discovery
**Priority:** P0 — Core Value

**Description:** Intelligent search and filtering to match customers with relevant businesses.

| Aspect | Specification |
|--------|---------------|
| Search types | Full-text (business name, service), semantic ("relaxing massage near me"), category browse |
| Filters | Distance (1-50km), price range, rating (4.0+), availability (today, this week), amenities, open now |
| Sorting | Relevance (default), distance, rating, price (low-high), availability |
| Results display | Card view (image, name, rating, price from, next availability), list view toggle |
| Pagination | Cursor-based, 20 results per page, infinite scroll on mobile |
| Search history | Recent searches, saved searches with alert option |

**Acceptance Criteria:**
- [ ] Search returns results in < 500ms for 95th percentile queries
- [ ] Typo tolerance handles 1-2 character errors ("masage" → "massage")
- [ ] Empty states provide actionable next steps (broaden filters, browse categories)
- [ ] Saved search alerts trigger push/email when matching business has new availability

---

### 2.4 Map-based Search
**Priority:** P0 — Spatial Discovery

**Description:** Visual exploration of businesses by geographic distribution.

| Aspect | Specification |
|--------|---------------|
| Map provider | Mapbox (custom styling) with Google Maps fallback |
| Clustering | Auto-cluster at zoom < 12, individual pins at zoom ≥ 12 |
| Pin states | Default, selected (expanded card), favorited (star icon), promoted (slight animation) |
| User location | Blue dot with accuracy radius; follow mode option |
| Interaction | Tap pin → bottom sheet with preview; swipe up → full detail; directions CTA |
| Density heatmap | Optional layer showing booking activity (anonymized) |

**Acceptance Criteria:**
- [ ] Map initializes to user's current viewport in < 2 seconds
- [ ] Pin tap response time < 200ms
- [ ] Map search updates results without full re-render (smooth transition)
- [ ] Offline: cached tiles for previously viewed areas, sync on reconnect

---

### 2.5 Business Detail View
**Priority:** P0 — Conversion Page

**Description:** Comprehensive information display to convert browsers to bookers.

| Section | Content |
|---------|---------|
| Hero | Image carousel (max 10), business name, rating, review count, favorite toggle |
| Quick actions | Call, message, get directions, share, book now |
| About | Description, opening hours, amenities, COVID/safety measures |
| Services | Categorized list with prices, durations, descriptions; expandable for detail |
| Team | Staff profiles with specialties, ratings, book-by-staff option |
| Reviews | Aggregate score, distribution histogram, recent reviews with photos |
| Availability | Inline mini-calendar showing next 3 available slots; tap to full booking flow |
| Similar businesses | Algorithmic recommendations based on this business's category and location |

**Acceptance Criteria:**
- [ ] Page loads critical content in < 1.5 seconds (Lighthouse performance score ≥ 90)
- [ ] Image gallery supports pinch-zoom, swipe navigation, lazy loading
- [ ] "Book now" CTA is persistently visible (sticky on scroll)
- [ ] Deep linking: `/b/{slug}` resolves to correct business; share preview generated

---

### 2.6 Service Categories
**Priority:** P0 — Information Architecture

**Description:** Hierarchical classification system for services.

| Level | Examples |
|-------|----------|
| Category | Hair, Face, Body, Nails, Massage, Wellness |
| Subcategory | Haircut, Coloring, Styling; Facial, Makeup, Microblading |
| Service | Women's Haircut, Balayage, Bridal Makeup |

**Specifications:**
- Category icons: consistent SVG set, color-coded
- Category page: featured businesses, trending services, price guides
- Business can map services to multiple categories for discoverability
- Admin tools for category management: create, merge, deprecate with migration

**Acceptance Criteria:**
- [ ] Category tree loads in < 300ms; expandable without page reload
- [ ] Service search matches across all hierarchy levels
- [ ] Deprecated categories redirect to successor with 301-equivalent handling
- [ ] Analytics track category-to-booking conversion funnels

---

### 2.7 Booking Flow
**Priority:** P0 — Revenue Critical

**Description:** Optimized multi-step conversion flow for appointment reservation.

| Step | Action | Details |
|------|--------|---------|
| 1. Service selection | User chooses service(s) | Multi-select with time buffer validation |
| 2. Staff preference | Optional: specific staff or "no preference" | Shows staff availability, ratings |
| 3. Date & time | Calendar view with slot grid | Real-time availability; time zone handling |
| 4. Extras | Add-ons (e.g., deep conditioning, nail art) | Priced supplements, duration impact |
| 5. Review | Order summary with edit capability | Service, staff, time, price, cancellation policy |
| 6. Payment | Secure checkout (see Payment Integration) | Hold vs. charge, promo code entry |
| 7. Confirmation | Success state with calendar invite, directions, add-to-wallet | Immediate push + email receipt |

**Acceptance Criteria:**
- [ ] Complete flow achievable in < 90 seconds for returning user
- [ ] Each step has < 500ms transition; progress indicator shows current step
- [ ] Abandoned cart recovery: email reminder after 1 hour with direct resume link
- [ ] Concurrent booking protection: 5-minute hold on selected slot, released on timeout or cancellation
- [ ] Waitlist option when preferred slot unavailable; auto-book on cancellation

---

### 2.8 Appointment Management
**Priority:** P0 — Post-Booking Experience

**Description:** Lifecycle management for customer appointments.

| Status | Customer Actions | Business Actions |
|--------|----------------|-----------------|
| Confirmed | View details, reschedule (policy-dependent), cancel, add to calendar | View, prepare, mark arrived/no-show |
| Pending | View, cancel | Confirm or decline |
| Rescheduled | View new details, further reschedule (limits apply) | Initiate, propose alternatives |
| Completed | Review, rebook, tip (optional) | Mark complete, add notes |
| Cancelled | View history, rebook | View reason, block customer (abuse) |
| No-show | View policy, appeal (if charged) | Mark, apply fee per policy |

**Acceptance Criteria:**
- [ ] Customer can reschedule/cancel without contacting support for standard policies
- [ ] Real-time sync: business calendar updates visible to customer in < 5 seconds
- [ ] Reschedule limits enforced: max 2 times, not within 24 hours of appointment
- [ ] Cancellation policy clearly displayed: full refund > 24hrs, 50% 24-4hrs, no refund < 4hrs

---

### 2.9 Favorites
**Priority:** P1 — Engagement

**Description:** Bookmarking system for quick access and personalized recommendations.

| Feature | Specification |
|---------|---------------|
| Add favorite | Heart toggle on business card, detail page; haptic feedback on mobile |
| Collections | User-created lists ("Birthday prep", "Regular spots") with custom names |
| Notifications | Alert when favorite has new availability, promotion, or service |
| Privacy | Public/private collection toggle; shareable links for public collections |

**Acceptance Criteria:**
- [ ] Favorite/unfavorite action completes in < 200ms (optimistic UI)
- [ ] Favorites sync across devices within 5 seconds
- [ ] Maximum 500 favorites per user; nudge to organize into collections at 50+

---

### 2.10 User Profile
**Priority:** P1 — Personalization

**Description:** Customer identity and preference management.

| Section | Content |
|---------|---------|
| Personal info | Name, photo, phone, email, birthday (for rewards) |
| Preferences | Default location, notification settings, language, currency |
| Payment methods | Saved cards, default selection, billing address |
| Booking history | Past and upcoming appointments, receipts, rebook shortcuts |
| Loyalty | Points balance, tier status, reward history |
| Settings | Privacy controls, data download, account deletion |

**Acceptance Criteria:**
- [ ] Profile photo upload: crop, resize, max 5MB, supported formats (JPG, PNG, HEIC)
- [ ] Data export: GDPR-compliant ZIP with all personal data, delivered within 24 hours
- [ ] Account deletion: irreversible after 30-day grace, with confirmation at each stage

---

### 2.11 Availability & Slot Computation
**Priority:** P0 — Technical Foundation

**Description:** Real-time calculation of bookable time slots considering complex constraints.

| Input | Logic |
|-------|-------|
| Business hours | Weekly recurring schedule + exception dates (holidays, closures) |
| Staff schedules | Individual working hours, breaks, time off |
| Service duration | Base time + buffer + variable add-ons |
| Existing bookings | Blocked time from confirmed appointments |
| Buffer rules | Between appointments (cleanup, travel), before/after business hours |
| Parallel services | Multiple simultaneous bookings if resources (rooms, chairs) allow |

**Algorithm Requirements:**
- Compute next 30 days of availability in < 100ms for single staff query
- Batch compute for search results (100+ businesses) in < 300ms
- Cache invalidation: immediate on booking mutation, TTL 5 minutes
- Handle daylight saving transitions, business timezone changes

**Acceptance Criteria:**
- [ ] Slot displayed = slot bookable (no overbooking under normal conditions)
- [ ] Last-booked slot removed from availability within 1 second
- [ ] Complex scenario: 3-service package with 2 different staff members computes correctly
- [ ] Graceful degradation: if computation fails, show "Call to book" with business number

---

### 2.12 Shared Types & Design System
**Priority:** P0 — Engineering Foundation

**Description:** Consistent UI/UX patterns and type safety across platforms.

| Element | Specification |
|---------|---------------|
| Color system | Primary: #FF6B6B (coral), Secondary: #4ECDC4 (teal), Neutrals: slate scale, Semantic: green/red/amber |
| Typography | Inter (web), SF Pro (iOS), Roboto (Android); scale: 12px caption to 32px display |
| Spacing | 4px base grid; component spacing tokens (xs/sm/md/lg/xl) |
| Elevation | Shadow system for cards, modals, toasts; dark mode support |
| Components | Button variants (primary/secondary/ghost), inputs, cards, badges, skeleton loaders |
| Animation | 200ms standard transitions, spring physics for interactive elements, reduced motion respect |
| Icons | Lucide icon set, 24px default, 20px dense |

**TypeScript Shared Types:**
- Core entities: User, Business, Service, Appointment, Review, Payment
- API contracts: request/response interfaces for all endpoints
- Enums: BookingStatus, PaymentStatus, NotificationType, UserRole
- Utility types: Pagination, ApiResponse, Nullable<T>, Required<T>

**Acceptance Criteria:**
- [ ] 100% TypeScript coverage; no `any` types in shared package
- [ ] Design tokens consumed via CSS variables or equivalent; no hardcoded values
- [ ] Component documentation in Storybook with usage examples
- [ ] Accessibility: WCAG 2.1 AA minimum, focus indicators, screen reader labels

---

### 2.13 Reviews & Ratings
**Priority:** P1 — Trust & Discovery

**Description:** Social proof system for quality assurance.

| Aspect | Specification |
|--------|---------------|
| Eligibility | Verified customers only; 24-hour post-appointment window opens |
| Rating dimensions | Overall (1-5), service quality, ambiance, value, staff (optional) |
| Content | Text (max 1000 chars), photos (max 5), video (max 30s, optional) |
| Business response | Public reply, mark resolved, report for review |
| Moderation | Auto-flag profanity, spam, conflict indicators; human review queue |
| Display | Sort by relevant (default), recent, highest/lowest; verified badge |
| Impact | Weighted in search ranking; response rate visible on business profile |

**Acceptance Criteria:**
- [ ] Review submission in < 30 seconds; immediate confirmation
- [ ] Business notified of new review within 5 minutes; response within 72 hours highlighted
- [ ] Fake review detection: flag accounts with suspicious patterns (multiple same-day, no booking history)
- [ ] Review editing: 48-hour window, marked as "edited"; deletion only by platform (abuse)

---

### 2.14 Payment Integration
**Priority:** P0 — Revenue Collection

**Description:** Secure, flexible payment processing.

| Aspect | Specification |
|--------|---------------|
| Processor | Stripe (primary), Adyen (Europe fallback) |
| Methods | Cards (debit/credit), Apple Pay, Google Pay, PayPal, Klarna (BNPL) |
| Flows | Immediate charge, authorize-then-capture (24hr hold), subscription (premium business) |
| Security | PCI DSS Level 1 via tokenization; 3D Secure for flagged transactions; fraud rules |
| Refunds | Full/partial via admin or automatic per cancellation policy; original payment method default |
| Invoicing | Business-facing: monthly statements, commission breakdown, tax documentation |

**Acceptance Criteria:**
- [ ] Payment success rate > 95%; retry logic for declined cards with alternative method prompt
- [ ] Receipt delivered within 1 minute of successful charge
- [ ] Failed payment: clear error, no duplicate charges, idempotency key validation
- [ ] Dispute handling: automated evidence submission, business notification within 24 hours

---

### 2.15 Notifications
**Priority:** P1 — Retention

**Description:** Multi-channel communication for timely, relevant updates.

| Trigger | Channels | Timing |
|---------|----------|--------|
| Booking confirmation | Push, email, SMS | Immediate |
| 24-hour reminder | Push, email | 24 hours before |
| 1-hour reminder | Push, SMS | 1 hour before |
| Reschedule/cancel | Push, email, SMS | Immediate on action |
| Review prompt | Push, email | 2 hours post-appointment |
| Promotion (opt-in) | Push, email | Scheduled campaign |
| Favorite availability | Push | Real-time on slot release |

**Specifications:**
- Preference center: granular opt-in/out per channel and notification type
- Quiet hours: respect local time, batch non-urgent notifications
- Delivery tracking: confirm receipt, retry failed deliveries, fallback channel cascade

**Acceptance Criteria:**
- [ ] Notification delivery < 5 seconds for real-time triggers
- [ ] Unsubscribe honored within 24 hours; no sends to unsubscribed channels
- [ ] Rich push: deep link to relevant in-app screen, action buttons (confirm, reschedule)

---

### 2.16 Provider / Business Owner Portal
**Priority:** P0 — Supply Side

**Description:** Comprehensive toolset for business operations.

| Module | Features |
|--------|----------|
| Dashboard | Today's appointments, revenue snapshot, occupancy rate, recent reviews |
| Calendar | Day/week/month views, drag-drop reschedule, block time, multi-staff view |
| Services | CRUD services, pricing, duration, staff associations, category mapping |
| Staff | Profiles, schedules, permissions (admin/receptionist/stylist), commission tracking |
| Bookings | View, modify, cancel; customer notes, history, no-show tracking |
| Clients | CRM: profiles, visit history, preferences, marketing opt-in status |
| Analytics | Revenue trends, popular services, staff utilization, cancellation rate, comparison to benchmarks |
| Settings | Business info, hours, cancellation policy, payment methods, integrations (Google, Apple calendars) |
| Marketing | Promotions creation, featured listing management, review response |

**Acceptance Criteria:**
- [ ] Calendar supports 50+ concurrent staff without performance degradation
- [ ] Booking modification syncs to customer in < 5 seconds
- [ ] Export data: CSV/PDF reports for accounting, tax purposes
- [ ] Mobile-optimized: full feature parity on tablet for on-the-go management

---

### 2.17 Admin Dashboard
**Priority:** P1 — Platform Operations

**Description:** Internal tools for platform health and growth.

| Module | Features |
|--------|----------|
| User management | Search, view, suspend, impersonate (audit logged), role assignment |
| Business onboarding | Application review, document verification, approval workflow, rejection with reason |
| Content moderation | Review queue, dispute resolution, content takedown with appeal process |
| Financial | Transaction monitoring, payout scheduling, commission adjustment, refund approval |
| Analytics | MAU, booking volume, GMV, churn, CAC, LTV by cohort, geographic heatmaps |
| System health | API latency, error rates, queue depths, third-party service status |
| Marketing ops | Campaign creation, push/email blast, promo code generation, A/B test configuration |

**Acceptance Criteria:**
- [ ] Critical alerts (payment failure, service outage) reach on-call within 2 minutes
- [ ] Audit log: immutable, queryable, 7-year retention for compliance
- [ ] RBAC: role-based access with principle of least privilege

---

### 2.18 Background Jobs (BullMQ)
**Priority:** P0 — Infrastructure

**Description:** Asynchronous job processing for reliability and performance.	sy.

| Queue | Job Types | Priority | Retry Policy |
|-------|-----------|----------|--------------|
| `notifications` | Push, email, SMS dispatch | High | 3 attempts, 5s backoff |
| `payments` | Charge capture, refund, payout | Critical | 5 attempts, exponential backoff to 1hr |
| `search-index` | Business/service index updates, search ranking recalculation | Medium | 3 attempts, 10s backoff |
| `analytics` | Event aggregation, report generation, ML feature computation | Low | 2 attempts, 30s backoff |
| `media` | Image optimization, thumbnail generation, video transcoding | Low | 3 attempts, 60s backoff |
| `reminders` | Appointment reminder scheduling and dispatch | High | 3 attempts, 5s backoff |
| `exports` | Data export (GDPR), report PDF generation | Low | 2 attempts, 30s backoff |
| `webhooks` | Third-party integrations (calendar sync, CRM) | Medium | 5 attempts, exponential backoff |

**Specifications:**
- Job idempotency: deduplication via unique job IDs
- Dead letter queue: manual inspection and replay after max retries
- Monitoring: queue depth, processing rate, failure rate, job duration percentiles
- Scaling: horizontal worker scaling based on queue depth metrics

**Acceptance Criteria:**
- [ ] No job loss on worker crash; at-least-once delivery guaranteed
- [ ] Failed jobs visible in monitoring within 30 seconds
- [ ] Queue depth alerts at > 1000 pending jobs for > 5 minutes
- [ ] Job processing latency: 95th percentile < 5 seconds for high priority

---

## 3. Non-Functional Requirements

| Category | Target |
|----------|--------|
| Performance | P50 API response < 100ms, P95 < 500ms, P99 < 1s |
| Availability | 99.95% uptime; < 4 hours monthly planned maintenance |
| Security | OWASP Top 10 mitigation, annual penetration test, SOC 2 Type II |
| Scalability | Support 100K concurrent users, 10K bookings/minute peak |
| Compliance | GDPR, CCPA, PCI DSS; data residency options |

---

## 4. Release Milestones

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Guest browse, Search, Business detail, Booking, Payments, Basic business portal | 8 weeks |
| v1.0 | Map search, Reviews, Favorites, Notifications, Full business portal | +4 weeks |
| v1.5 | Admin dashboard, Advanced analytics, Loyalty program, Marketing tools | +6 weeks |
| v2.0 | AI recommendations, Waitlist, Group bookings, International expansion | +8 weeks |

---

## 5. Success Metrics

| KPI | Target | Measurement |
|-----|--------|-------------|
| Booking conversion | 15% search-to-booking | Funnel analytics |
| NPS | ≥ 50 | Quarterly survey |
| Business retention | 90% annual | Cohort analysis |
| Support tickets | < 2% of transactions | Zendesk integration |
| App store rating | ≥ 4.5 stars | Store monitoring |

---

*Document version: 1.0*
*Last updated: 2024*
*Owner: Alex, Product Owner*