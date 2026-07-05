# Planity Clone - Product Specification

## Document Control
- **Version:** 1.0
- **Status:** Draft
- **Author:** Alex, Product Owner
- **Last Updated:** 2024

---

## 1. Product Vision

Build a seamless appointment booking platform connecting customers with beauty, wellness, and healthcare service providers. The platform enables discovery, instant booking, and appointment management while empowering businesses with tools to manage their operations.

---

## 2 ZEND-OF-LIFE STRATEGY

### Platform: Web (Responsive), iOS, Android
### Target Users: Consumers seeking beauty/wellness services; Service providers; Platform administrators

---

## 3. Feature Specifications

### 3.1 User Authentication
**Priority:** P0 - Critical

| Field | Description |
|-------|-------------|
| **Feature** | Secure user registration and authentication system |
| **As a** | User (customer or business owner) |
| **I want to** | Create an account, log in, and manage my authentication state |
| **So that** | My data is secure and personalized to me |

**Acceptance Criteria:**
- [ ] Users can register with email/password, phone number, or OAuth (Google, Apple, Facebook)
- [ ] Password requirements: min 8 chars, uppercase, lowercase, number, special character
- [ ] Email verification required before account activation
- [ ] JWT tokens with refresh token rotation; access token expiry: 15 minutes
- [ ] Password reset via secure email link (24h expiry)
- [ ] Biometric login support on mobile (Face ID, fingerprint)
- [ ] "Remember me" option extends session to 30 days
- [ ] Account lockout after 5 failed attempts (30-minute cooldown)
- [ ] Users can delete account with 30-day data retention period
- [ ] GDPR-compliant data export upon request

**Technical Notes:**
- Single sign-on across web and mobile; session sync
- Rate limiting: 10 login attempts per minute per IP

---

### 3.2 Guest Browse & Explore
**Priority:** P0 - Critical

| Field | Description |
|-------|-------------|
| **Feature** | Unauthenticated browsing and discovery |
| **As a** | Guest user |
| **I want to** | Browse services and businesses without creating an account |
| **So that** | I can evaluate the platform before committing |

**Acceptance Criteria:**
- [ ] Full search and filter access without login
- [ ] Business profiles, services, prices, and reviews visible
- [ ] "Book Now" or "Favorite" actions prompt login modal
- [ ] Guest session data (filters, location) persisted post-login via merge prompt
- [ ] Maximum 10 business detail views per day before soft login wall
- [ ] Deep links from shared URLs work without authentication

---

### 3.3 Business Search & Discovery
**Priority:** P0 - Critical

| Field | Description |
|-------|-------------|
| **Feature** | Powerful search and filtering to find businesses |
| **As a** | Customer |
| **I want to** | Find relevant businesses based on my criteria |
| **So that** | I can book the right service efficiently |

**Acceptance Criteria:**
- [ ] Full-text search across business name, service name, and description
- [ ] Auto-complete with suggestion ranking; debounce: 300ms
- [ ] Filters: category, price range, rating (1-5 stars), distance, availability ("open now"), amenities
- [ ] Sort options: relevance, distance, rating, price (low to high)
- [ ] "Search near me" using geolocation; fallback to manual city/zip input
- [ ] Search results per-page: 20; infinite scroll
- [ ] Recent searches stored locally (max 10); clearable
- [ ] Popular/trending searches displayed when search bar focused
- [ ] Spell correction and "Did you mean?" suggestions
- [ ] Business closed for vacation: show return date, allow waitlist signup

---

### 3.4 Map-based Search
**Priority:** P0 - Critical

| Field | Description |
|-------|-------------|
| **Feature** | Interactive map view of search results |
| **As a** | Customer |
| **I want to** | Visualize business locations geographically |
| **So that** | I can choose conveniently located businesses |

**Acceptance Criteria:**
- [ ] Toggle between list and map view; persist user preference
- [ ] Pin clustering for dense areas; cluster count display
- [ ] Dynamic result update as map bounds change (debounced: 500ms)
- [ ] Custom pins: open (green), closed (gray), fully booked (red), promoted (star)
- [ ] Tap pin reveals business name, rating, price range, next available slot
- [ ] "Recenter on me" button; animate to user location
- [ ] Satellite and standard map tiles; persist preference
- [ ] Map zoom range: city level (10km) to street level (100m)
- [ ] Route planning with estimated travel time from current location
- [ ] Offline: cache last viewed map tiles (500MB limit)

---

### 3.5 Business Detail View
**Priority:** P0 - Critical

| Field | Description |
|-------|-------------|
|** Feature** | Comprehensive business information page |
| **As a** | Customer |
| **I want to** | Evaluate a business before booking |
| **So that** | I make informed decisions |

**Acceptance Criteria:**
- [ ] Hero: gallery of 10 images max, video support; swipeable
- [ ] Business name, verified badge, rating, review count, category tags
- [ ] Full address with copy to clipboard and "Open in Maps"
- [ ] Operating hours with live "Open Now" indicator
- [ ] About section: description, founding year, team size, languages spoken
- [ ] Services tab: all offered services with pricing, duration, description
- [ ] Team/professionals tab: bios, photos, specializations, individual availability
- [ ] Reviews tab: sortable, filterable; overall sentiment summary
- [ ] "Book Now" CTA sticky at bottom; pre-selects service if from search
- [ ] Share business profile via link, QR code, or native share sheet
- [ ] Report business for inappropriate content; human review within 24h
- [ ] Similar businesses carousel below fold

---

### 3.6 Service Categories
**Priority:** P0 - Critical

| Field | Description |
|-------|-------------|
| **Feature** | Hierarchical category system for services |
| **As a** | Platform |
| **I want to** | Organize services in intuitive categories |
| **So that** | Customers can discover relevant offerings |

**Acceptance Criteria:**
- [ ] Top-level categories: Hair, Nails, Face, Body, Massage, Wellness, Medical Aesthetic, Barbershop
- [ ] Each category has icon, color, and hero image
- [ ] 2-level hierarchy: Hair > Coloring, Cutting, Styling, Treatment
- [ ] Category landing page with featured businesses, trending services
- [ ] Businesses can select up to 5 categories; primary category drives ranking
- [ ] Category-based promotional campaigns and badges
- [ ] Admin-configurable: add, edit, deactivate categories without code change

---

### 3.7 Booking Flow
**Priority:** P0 - Critical

| Field | Description |
|-------|-------------|
| **Feature** | End-to-end service reservation system |
| **As a** | Customer |
| **I want to** | Book appointments quickly with minimal friction |
| **So that** | I secure my preferred time slot |

**Acceptance Criteria:**
- [ ] Step 1 (Service): Select service, optionally specific professional, or "no preference"
- [ ] Step 2 (Time): Calendar view with available slots highlighted; horizontal date selector, 2-week lookahead default
- [ ] Step 3 (Details): Confirm details, add notes for provider, apply promo code
- [ ] Step 4 (Payment): Select saved card or new payment; show total breakdown
- [ ] Step 5 (Confirmation): Success screen with appointment details, add to calendar, share
- [ ] Slot holds reserved for 10 minutes during booking; countdown timer visible
- [ ] AB test: single-page vs. multi-step flow; optimize for completion rate
- [ ] Guest checkout: collect minimal info (name, phone, email); prompt to create account post-booking
- [ ] Booking for others: add participant name, optional account linking
- [ ] Waitlist: join if fully booked; auto-booking when slot opens (user preference)

---

### 3.8 Appointment Management
**Priority:** P0 - Critical

| Field | Description |
|-------|-------------|
| **Feature** | View, modify, and cancel bookings |
| **As a** | Customer |
| **I want to** | Manage my scheduled appointments |
| **So that** | I can adapt to changes in my schedule |

**Acceptance Criteria:**
- [ ] Tabbed view: Upcoming, Past, Cancelled
- [ ] Upcoming: sort by date; card shows business, service, professional, datetime, duration, status
- [ ] Reschedule: show available slots for same service; preserve original price if applicable
- [ ] Cancel with reason selection (required); immediate confirmation or pending if within policy
- [ ] Cancellation policy display: free within 24h, 50% charge within 4h, non-refundable within 2h
- [ ] Push, email, and SMS reminders: 24h, 2h, and 15min before appointment
- [ ] Post-appointment: prompt to rate and review (48h window)
- [ ] Rebooking: one-tap rebook same service from past appointments

---

### 3.9 Favorites
**Priority:** P1 - High

| Field | Description |
|-------|-------------|
| **Feature** | Save and organize preferred businesses |
| **As a** | Customer |
| **I want to** | Bookmark businesses for quick access |
| **So that** | I can easily return to providers I like |

**Acceptance Criteria:**
- [ ] Heart icon toggle on business cards and detail pages
- [ ] Favorites list: sortable by recently added, name, or last visit
- [ ] Create custom lists (e.g., "Nails in Paris", "Mom's favorites")
- [ ] Unfavorited businesses remain in history for 30 days
- [ ] Users can set availability alerts for favorite businesses ("notify me when next available")
- [ ] Pull to refresh; offline access to saved business basic info

---

### 3.10 User Profile
**Priority:** P1 - High

| Field | Description |
|-------|-------------|
| **Feature** | Customer account and preference management |
| **As a** | Customer |
| **I want to** | Manage personal information and preferences |
| **So that** | My experience is personalized and my data is accurate |

**Acceptance Criteria:**
- [ ] Profile photo storefronts: personal info, photo, email, phone, birthday (with promo eligibility)
- [ ] Preference center: default notification settings, preferred contact method, language, currency
- [ ] Saved payment methods: add, set default, delete; PCI-compliant, never expose full details
- [ ] Address book: home, work, other with geocoded coordinates
- [ ] Appointment history with searchable filter (date range, business, service)
- [ ] Loyalty program integration: point balance, tier status, reward history
- [ ] Referral code: share for credits; track invite status, earnings

---

### 3.11 Availability & Slot Computation
**Priority:** P0 - Critical

| Field | Description |
|-------|-------------|
| **Feature** | Real-time availability engine with complex business rules |
| **As a** | Platform |
| **I want to** | Accurately display and manage appointment slots |
| **So that** | Customers book valid times and businesses operate efficiently |

**Acceptance Criteria:**
- [ ] Core computation: business hours, professional schedules, service duration, buffer times
- [ ] Slot generation: service duration + cleanup buffer (configurable, default 15 min)
- [ ] Multi-resource conflicts: room, equipment, professional availability synced
- [ ] Variable duration support: "from X min" with final price adjustment at checkout
- [ ] Recurring blocked time: holidays, staff breaks, maintenance
- [ ] Overbooking protection: configurable max simultaneous bookings per resource
- [ ] Last-online-slot: minimum notice (default 2h, customizable by business)
- [ ] Dynamic pricing: peak/off-peak, demand-based, promotional overrides
- [ ] Cashed on server for performance: invalidate on schedule change, TTL 5 minutes
- Real-time notifications: widget, in-app for affected upcoming bookings
- [ ] Timezone handling: all slots in business local time; display in user preference with clear indication
- [ ] Batch operations: opening exceptions ("open Sunday this once"), recurring pattern exceptions

---

### 3.12 Shared Types & Design System
**Priority:** P0 - Critical

| Field | Description |
|-------|-------------|
| **Feature** | Unified component library and design tokens |
| **As a** | Development team |
| **I want to** | Build consistent, accessible interfaces efficiently |
| **So that** | User experience is cohesive and development velocity is high |

**Acceptance Criteria:**
- [ ] Design tokens: colors (semantic: primary, success, warning, error), typography scale, spacing scale, border radius, shadows
- [ ] Cross-platform component set: Button, Input, Select, Card, Modal, Toast, DatePicker, TimeSlot, Avatar, Badge, Skeleton, EmptyState
- [ ] Accessibility: WCAG 2.1 AA minimum, screen reader support, focus management, color contrast 4.5:1
- [ ] Dark mode support: automatic by system or manual toggle; persistent preference
- [ ] Animation standards: 200ms default, ease-in-out; reduced motion respected
- [ ] Localization framework: i18n ready, date/time/currency formatting, RTL support for Arabic
- [ ] Icon library: custom set, 24x24 default, 20x20 compact
- [ ] Shared types: TypeScript interfaces for all API contracts, auto-generated from OpenAPI if possible
- [ ] Documentation: Storybook, usage examples, do/don't guidance
- [ ] Breaking change policy: major version bump with 4-week migration window minimum

---

### 3.13 Reviews & Ratings
**Priority:** P1 - High

| Field | Description |
|-------|-------------|
| **Feature** | Customer feedback system for businesses and services |
| **As a** | Customer |
| **I want to** | Share and read authentic experiences |
| **So that** | I trust the quality information and businesses improve |

**Acceptance Criteria:**
- [ ] Eligibility: verified booked customer; review window 48h-30d post-appointment
- [ ] Rating components: overall 1-5 stars, plus optional category ratings (service, cleanliness, value, atmosphere)
- [ ] Review content: text (500 chars max), photo upload (5 max), optional professional tagging
- [ ] Business response: public reply option; notification to reviewer
- [ ] Moderation: auto-flag for inappropriate content; human escalation path
- [ ] Helpful vote system; sort reviews by relevant, recent, highest rated
- [ ] Aggregate display: average rating, distribution histogram, trend over last 3 months
- [ ] Review dispute: business can flag for factual inaccuracy; mediation process
- [ ] Incentivization policy: no direct review-for-discount; loyalty points for any feedback optional

---

### atenção3.14 Payment Integration
**Priority:** P0 - Critical

| Field | Description |
|-------|-------------|
| **Feature** | Secure, flexible payment processing |
| **As a** | Customer and business owner |
| **I want to** | Pay and get paid reliably with multiple options |
| **So that** | Transactions are frictionless and trustworthy |

**Acceptance Criteria:**
- [ ] Prepayment (full at booking), deposit (partial), or pay-at-venue selectable by business
- [ ] Payment methods: cards (Visa, MC, Amex), digital wallets (Apple Pay, Google Pay), PayPal, Klarna (installments for £50+)
- [ ] 100% PCI-DSS compliant; never store raw card data
- [ ] Payment intent pattern: authorize at booking, capture 24h before or on venue arrival
- [ ] Failed payment handling: auto-retry with saved method, notify user, 24h grace with slot hold
- [ ] Refund policy: full, partial, or store credit per cancellation policy or business override
- [ ] Digital wallet pass: QR/barcode for in-store verification of prepaid booking
- [ ] Invoice generation: PDF email for all transactions; business settings for auto-send
- [ ] Commission structure: configurable per category, tiered by business volume; transparent dashboard for business
- [ ] Payout schedule: weekly default, instant payout option (fee applies)

---

### 3.15 Notifications
**Priority:** P1 - High

| Field | Description |
|-------|-------------|
| **Feature** | Multi-channel user communication |
| **As a** | Customer and business owner |
| **I want to** | Receive timely, relevant updates |
| **So that** | I never miss important information |

**Acceptance Criteria:**
- [ ] Channels: in-app, push (APNs/FCM), SMS, email; user-selectable per notification type
- [ ] Notification types:
  | Type | Trigger |
  |------|---------|
  | Booking confirmed | Payment success |
  | Booking reminder | 24h, 2h, 15min before |
  | Booking modified | Reschedule by either party |
  | Booking cancelled | Cancellation complete |
  | Promotion | Active coupon, favorite business deal |
  | Review prompt | 48h post-appointment |
  | Waitlist slot | Slot becomes available |
  | Payment issue | Failed charge |
  | Account security | New login, password change |
- [ ] Rich push: deep link to relevant screen, action buttons (confirm, reschedule, dismiss)
- [ ] Notification center: in-app inbox with unread badges, category filters, mark as read
- [ ] Batch digest: optional daily/weekly summary instead of instant notifications
- [ ] Quiet hours respect: configurable DND period; emergency bookings excepted
- [ ] Unsubscribe: email has one-click; push via OS settings; in-app preference toggles

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0 - Critical

| Field | Description |
|-------|-------------|
| **Feature** | Comprehensive business management interface |
| **As a** | Business owner/staff |
| **I want to** | Manage my presence, services, and operations |
| **So that** | I maximize bookings and run efficiently |

**Acceptance Criteria:**
- [ ] Dashboard: today's appointments, revenue summary, pending actions, recent reviews
- [ ] Calendar view: day, week, month; drag to reschedule; color-coded by status, professional
- [ ] Appointment management: view details, confirm/cancel (with auto-customer notification), check-in, no-show mark
- [ ] Schedule configuration: recurring weekly hours, exceptions, professional availability rules
- [ ] Service management: CRUD services with name, description, duration, price, category, professional assignees
- [ ] Product/inventory add-ons: retail products for sale with booking
- [ ] Staff management: invite, role assignment (owner, manager, professional), schedule per professional
- [ ] Customer management: view history, notes, contact info; marketing consent tracking
- [ ] Review response: view, respond, flag; sentiment dashboard
- [ ] Analytics: booking volume, revenue, no-show rate, popular services, peak hours; exportable CSV
- [ ] Settings: business profile, photos, cancellation policy, payment methods, notification preferences
- [ ] Mobile-optimized: core functions accessible on phone for on-the-go management

---

### 3.17 Admin Dashboard
**Priority:** P1 - High

| Field | Description |
|-------|-------------|
| **Feature** | Platform administration and oversight |
| **As a** | Platform administrator |
| **I want to** | Monitor, support, and grow the marketplace |
| **So that** | I ensure quality, safety, and business health |

**Acceptance Criteria:**
- [ ] Business management: onboarding queue, verification status, approve/reject with reason
- [ ] User management: search, view, suspend, impersonate for support
- [ ] Content moderation: flagged reviews, reported businesses, spam detection; queue with assign, resolve, escalate
- [ ] Transaction monitoring: search, refund, resolve disputes; chargeback tracking
- [ ] Promotional tools: create campaigns, target segments, track redemption; A/B test setup
- [ ] Platform analytics: MAU, booking volume, GMV, churn, conversion funnel; cohort analysis
- [ ] System health: API latency, error rates, job queue depth, third-party status; alert thresholds
- [ ] Communication: broadcast push/email to segments; in-app maintenance mode messaging
- [ ] Audit logging: all admin actions with timestamp, actor, before/after state; 7-year retention
- [ ] RBAC: super admin, operations, support, finance, marketing roles with granular permissions

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P1 - High

| Field | Description |
|-------|-------------|
| **Feature** | Reliable asynchronous job processing |
| **As a** | Platform |
| **I want to** | Handle non-critical operations without blocking user requests |
| **So that** | System remains responsive and tasks complete reliably |

**Acceptance Criteria:**
- [ ] Core job types and configurations:
  | Job Type | Trigger | Priority | Retries | Timeout |
  |----------|---------|----------|---------|---------|
  | Send notification | Event pub/sub | Normal | 3, backoff 2^x | 30s |
  | Process payment | Booking SLA | High | immediate alt method | 60s |
  | Generate report | Admin request | Low | 2 in 24h | 5 min |
  | Image optimization | Upload event | Low | 2 | 2 min |
  | Search index update | Data change | Normal | 3 | 30s |
  | Expire slot holds | Cron: every min | High | immediate | 10s |
  | Nightly analytics | Cron: 2 AM UTC | Low | alert on failure | 30 min |
  | Data export (GDPR) | User request | Normal | 1 | 10 min |
- [ ] Dead letter queue: manual inspection, requeue, or discard after max retries
- [ ] Job idempotency: duplicate detection via unique keys; safe re-execution
- [ ] Monitoring: queue depth, processing rate, failure rate, average wait time; dashboard + PagerDuty alerts
- [ ] Rate limiting: per-job-type concurrency caps; priority queue allocation under load
- [ ] Scheduled jobs: cron syntax support, timezone-aware, holiday skip options
- [ ] Graceful shutdown: finish in-progress, stop accepting new, requeue or wait for drain

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | 2s time to interactive; <200ms API p95; 99.9% uptime |
| **Security** | OWASP Top 10 mitigation, penetration testing annually, SOC 2 Type II |
| **Scalability** | Horizontal auto-scaling, 10x burst capacity, multi-region standby |
| **Privacy** | GDPR, CCPA compliant; consent management; data minimization |
| **Compatibility** | Last 2 major versions of browsers; iOS 14+; Android 10+ |

---

## 5. Release Milestones

| Phase | Features | Target |
|-------|----------|--------|
| MVP | Auth, Guest Browse, Search, Business Detail, Categories, Booking, Appointments | Q1 |
| v1.1 | Map Search, Favorites, Profile, Reviews, Payments | Q2 |
| v1.2 | Provider Portal, Notifications, Design System polish | Q3 |
| v1.3 | Admin Dashboard, Background Jobs, Advanced Analytics, Loyalty | Q4 |

---

## 6. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion rate | >15% |
| Search-to-detail rate | >40% |
| App install to first booking | <7 days median |
| Business NPS | >50 |
| Customer NPS | >60 |
| Monthly booking volume | +20% MoM (Year 1) |
| Support tickets per 1000 bookings | <5 |

---

*End of Product Specification*