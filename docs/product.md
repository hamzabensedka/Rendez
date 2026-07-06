# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first platform connecting customers with beauty/wellness businesses for appointment booking. It serves three user segments: **Customers** (book appointments), **Providers** (manage businesses), and **Admin** (platform oversight).

---

## 2. User Personas

| Persona | Goals | Pain Points |
|---------|-------|-------------|
| **Customer** | Find, compare, book services quickly | No walk-in availability, unclear pricing |
| **Guest** | Browse without commitment | Forced registration too early |
| **Provider** | Fill calendar, reduce no-shows | Complex scheduling, manual reminders |
| **Admin** | Monitor growth, ensure quality | Fraud, disputes, content moderation |

---

## 3. Feature Specifications

### 3.1 User Authentication (P0)

**User Stories:**
- As a customer, I want to register with email/phone so I can book appointments.
- As a returning user, I want to log in with biometrics so I can access my account quickly.
- As a user, I want to reset my password so I can recover access.

**Acceptance Criteria:**
- [ ] Registration via email + password, phone + OTP, or OAuth (Google, Apple, Facebook)
- [ ] Password requirements: min 8 chars, 1 uppercase, 1 number, 1 special character
- [ ] Email verification required before booking; phone verification as fallback
- [ ] JWT access token (15 min expiry) + refresh token (7 days) with secure httpOnly cookies
- [ ] Biometric login (Face ID/Touch ID) on supported devices
- [ ] Rate limiting: 5 failed attempts triggers 30-minute lockout
- [ ] Session management: show active sessions, allow remote logout
- [ ] Social auth accounts linkable to email accounts

**Technical Notes:**
- Use Firebase Auth or Auth0 for social providers
- Store password hashes with bcrypt (cost factor 12)

---

### 3.2 Guest Browse & Explore (P0)

**User Stories:**
- As a guest, I want to browse businesses without registering so I can evaluate the platform.
- As a guest, I want to see service details so I can make informed decisions.

**Acceptance Criteria:**
- [ ] Home screen, search, business listings, and detail views accessible without login
- [ ] "Book Now" CTA triggers auth modal with option to continue as guest (phone capture)
- [ ] Guest checkout: collect name, phone, email at booking; auto-create account post-booking
- [ ] Guest session persisted via localStorage; prompt to register after 3rd visit
- [ ] Limited to 3 searches/day without account (soft prompt, not hard block)

---

### 3.3 Business Search & Discovery (P0)

**User Stories:**
- As a customer, I want to search by service, business name, or location so I can find relevant providers.
- As a customer, I want to filter results so I can narrow options efficiently.

**Acceptance Criteria:**
- [ ] Search input with autocomplete (debounced 300ms, min 2 chars)
- [ ] Search across: business name, service name, provider name, address
- [ ] Filters: distance (1-50km), price range, rating (4.0+), availability (today, this week), service category, amenities
- [ ] Sort options: relevance, distance, rating, price (low-high)
- [ ] Results display as list or grid; show photo, name, rating, distance, price from, next availability
- [ ] Empty state with suggestions and "expand search radius" option
- [ ] Search history saved (last 10), clearable
- [ ] Trending searches and popular nearby businesses on empty search

**Performance:**
- Search results < 500ms (p95)
- Pagination: 20 results per page, infinite scroll on mobile

---

### 3.4 Map-based Search (P0)

**User Stories:**
- As a customer, I want to see businesses on a map so I can choose by location.
- As a customer, I want to explore an area so I can discover new providers.

**Acceptance Criteria:**
- [ ] Toggle between list and map views; default based on user last preference
- [ ] Map shows business pins with price or rating badge; cluster pins at zoomed-out levels
- [ ] Tap pin opens bottom sheet with business summary; tap summary navigates to detail
- [ ] Current location button with permission prompt; fallback to city center
- [ ] Search this area: re-query on map pan/zoom with debounce (500ms)
- [ ] Custom pin colors by category; dark mode support
- [ ] Accessibility: screen reader announces "5 businesses found near [area]"

**Technical:**
- Google Maps SDK (iOS/Android) or Mapbox
- Custom tile caching for offline map rendering

---

### 3.5 Business Detail View (P0)

**User Stories:**
- As a customer, I want to see all business information so I can decide to book.

**Acceptance Criteria:**
- [ ] Hero: business name, photos (carousel, up to 10), rating, review count, favorite toggle
- [ ] Info: address (with directions link), hours (today's hours highlighted), phone, website
- [ ] Services: expandable list with name, duration, description, price; "Book" CTA per service
- [ ] Team: provider photos, names, specialties; tap to see provider-specific availability
- [ ] Reviews: aggregate rating, rating distribution, 3 latest reviews, "See all" link
- [ ] About: description, amenities (free WiFi, parking, etc.), languages spoken, COVID protocols
- [ ] Share: native share sheet with deep link
- [ ] Report business button (content violations)

---

### 3.6 Service Categories (P0)

**User Stories:**
- As a customer, I want to browse by category so I can find what I need.
- As a provider, I want to categorize my services so customers can find me.

**Acceptance Criteria:**
- [ ] Hierarchical categories: Beauty > Hair > Haircut; Wellness > Massage > Swedish
- [ ] Category icons, color coding; admin-managed taxonomy
- [ ] Category landing pages with featured businesses, trending services
- [ ] Provider can select up to 3 primary categories; unlimited subcategories
- [ ] Category-based search boosting: exact match > parent category > related
- [ ] Analytics: track category popularity, conversion rates

---

### 3.7 Booking Flow (P0)

**User Stories:**
- As a customer, I want to book an appointment in minimal steps so I can secure my slot.

**Acceptance Criteria:**
- [ ] Step 1: Select service (or bundle multiple services)
- [ ] Step 2: Select provider or "No preference" (assigns based on availability)
- [ ] Step 3: Select date (calendar view with availability indicators) and time slot
- [ ] Step 4: Review booking summary with price breakdown
- [ ] Step 5: Apply promo code (optional)
- [ ] Step 6: Confirm booking; payment if required (see 3.14)
- [ ] Confirmation screen with add-to-calendar, share, modify links
- [ ] Booking held for 10 minutes during payment; auto-release on timeout
- [ ] Rescheduling: available up to 2 hours before appointment; same flow, pre-filled
- [ ] Cancellation: customer-initiated up to policy threshold; refund per policy

**Edge Cases:**
- Slot taken during booking: show next available, offer waitlist
- Provider unavailable: suggest alternatives, notify when available

---

### 3.8 Appointment Management (P0)

**User Stories:**
- As a customer, I want to see my appointments so I can manage my schedule.
- As a provider, I want to manage my calendar so I can optimize my time.

**Acceptance Criteria (Customer):**
- [ ] Upcoming/past tabs; upcoming sorted by date
- [ ] Card: service, business, provider, date/time, status, actions (reschedule, cancel, rebook)
- [ ] Push notification 24h and 1h before appointment
- [ ] Check-in: QR code or button at appointment time; triggers provider notification

**Acceptance Criteria (Provider):**
- [ ] Calendar view (day/week/month) with appointment blocks
- [ ] Color-coded by status: confirmed, checked-in, completed, no-show, cancelled
- [ ] Drag to reschedule; click to view details, add notes
- [ ] Block time: recurring or one-off unavailability
- [ ] Walk-in support: add ad-hoc appointment
- [ ] Daily/weekly capacity view; overbooking warnings

---

### 3.9 Favorites (P1)

**User Stories:**
- As a customer, I want to save favorite businesses so I can rebook easily.

**Acceptance Criteria:**
- [ ] Heart toggle on business card and detail view; haptic feedback
- [ ] Favorites list with search, sort (recently added, name, distance)
- [ ] Quick rebook: tap to see next availability, one-tap book same service
- [ ] Push notification: "Your favorite [Business] has new availability this week"
- [ ] Sync across devices; survive app reinstall via account
- [ ] Suggest similar businesses based on favorites

---

### 3.10 User Profile (P1)

**User Stories:**
- As a user, I want to manage my profile so my experience is personalized.

**Acceptance Criteria:**
- [ ] Profile photo, name, phone, email, birthday (for birthday offers)
- [ ] Notification preferences: push, email, SMS; per-type toggles
- [ ] Payment methods: add, remove, set default
- [ ] Booking history with receipts, rebook option
- [ ] Loyalty/points balance (if applicable)
- [ ] Privacy: data download, account deletion (GDPR/CCPA)
- [ ] Referral code and credits tracking

---

### 3.11 Availability & Slot Computation (P0)

**User Stories:**
- As a provider, I want accurate availability so I don't get double-booked.
- As a customer, I want real-time slots so I can book confidently.

**Acceptance Criteria:**
- [ ] Business hours: define weekly schedule with breaks, timezone-aware
- [ ] Service duration: base duration + buffer (cleanup, travel between rooms)
- [ ] Provider-specific availability: override business hours, vacation days
- [ ] Slot generation: compute available slots given bookings, blocks, service duration
- [ ] Buffer rules: min advance booking (e.g., 2 hours), max advance (e.g., 60 days)
- [ ] Concurrent bookings: if provider has multiple rooms/stations
- [ ] Real-time updates via WebSocket; optimistic locking on slot selection
- [ ] Timezone handling: store UTC, display local; handle DST transitions
- [ ] Cache computed slots for 5 minutes; invalidate on booking change

**Algorithm Requirements:**
- Support complex rules: "haircut + color" bundle takes consecutive slots
- Waitlist: notify when preferred slot opens

---

### 3.12 Shared Types & Design System (P0)

**User Stories:**
- As a developer, I want consistent components so the app feels cohesive.

**Acceptance Criteria:**
- [ ] Design tokens: colors, typography, spacing, shadows in theme object
- [ ] Component library: Button, Input, Card, Modal, DatePicker, TimeSlot, Avatar, Rating, Skeleton
- [ ] Shared types: User, Business, Service, Appointment, Review, Payment (TypeScript)
- [ ] Responsive breakpoints: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)
- [ ] Accessibility: WCAG 2.1 AA; focus states, ARIA labels, color contrast 4.5:1
- [ ] Dark mode: system preference + manual toggle
- [ ] Localization: i18n framework, RTL support, date/number formatting
- [ ] Animation standards: 200ms ease-in-out, reduced motion support

---

### 3.13 Reviews & Ratings (P1)

**User Stories:**
- As a customer, I want to read reviews so I can choose quality providers.
- As a provider, I want to respond to reviews so I can manage my reputation.

**Acceptance Criteria:**
- [ ] 5-star rating; mandatory after completed appointment; optional text (min 10 chars)
- [ ] Review prompt: push notification 2 hours post-appointment; in-app reminder if dismissed
- [ ] Display: aggregate rating, distribution histogram, verified booking badge
- [ ] Provider response: public reply, notification to reviewer
- [ ] Flag inappropriate reviews; admin moderation queue
- [ ] Sort reviews: most helpful, most recent, highest/lowest rating
- [ ] Review helpfulness: upvote/downvote; reviewer reputation score
- [ ] Photos in reviews: up to 5 per review
- [ ] Aggregate tags from reviews: "great atmosphere", "professional staff"

---

### 3.14 Payment Integration (P0)

**User Stories:**
- As a customer, I want to pay securely so I can confirm my booking.
- As a provider, I want to receive payments so I can run my business.

**Acceptance Criteria:**
- [ ] Payment methods: credit/debit (Stripe), Apple Pay, Google Pay, PayPal
- [ ] Payment timing: pay at booking, pay at appointment, or deposit + balance
- [ ] Provider-configurable cancellation policy: flexible, moderate, strict
- [ ] Refunds: automatic per policy; manual override by admin
- [ ] Receipts: email and in-app; downloadable PDF
- [ ] Tips: optional, pre-set amounts or custom, 100% to provider
- [ ] Payouts to providers: weekly/bi-weekly to connected bank account (Stripe Connect)
- [ ] Platform fee: configurable percentage, deducted from provider payout
- [ ] Failed payment: retry logic, notify customer, auto-cancel if unresolved in 24h
- [ ] PCI compliance: never store raw card data; use Stripe Elements

---

### 3.15 Notifications (P1)

**User Stories:**
- As a user, I want timely notifications so I don't miss appointments.

**Acceptance Criteria:**
- [ ] Channels: push (OneSignal/Firebase), SMS (Twilio), email (SendGrid)
- [ ] Types: booking confirmed, reminder (24h, 1h), modified, cancelled, promotional
- [ ] Provider notifications: new booking, cancellation, review received, payout
- [ ] Preference management: per-channel, per-type toggles
- [ ] Rich push: action buttons (confirm, reschedule, cancel)
- [ ] Delivery tracking: mark as read, in-app notification center
- [ ] Unsubscribe: one-click for marketing; transactional always on
- [ ] Rate limiting: max 3 promotional push/day per user

---

### 3.16 Provider / Business Owner Portal (P0)

**User Stories:**
- As a provider, I want to manage my business so I can attract and serve customers.

**Acceptance Criteria:**
- [ ] Onboarding: business info, services, team, hours, photos, payment setup
- [ ] Dashboard: upcoming appointments, revenue this week, new reviews, occupancy rate
- [ ] Service management: CRUD services, pricing, duration, description, photos
- [ ] Team management: add providers with individual accounts, permissions, schedules
- [ ] Booking settings: cancellation policy, buffer times, online booking on/off
- [ ] Client management: view history, notes, contact; export CSV
- [ ] Marketing: promotions, featured placement bids, respond to reviews
- [ ] Analytics: bookings, revenue, no-show rate, popular services, peak hours
- [ ] Multi-location support: switch between, aggregate reporting

---

### 3.17 Admin Dashboard (P1)

**User Stories:**
- As an admin, I want to oversee the platform so I can ensure quality and growth.

**Acceptance Criteria:**
- [ ] User management: search, view, suspend, impersonate; filter by role, status
- [ ] Business verification: review submitted docs, approve/reject with reason
- [ ] Content moderation: flagged reviews, businesses, images; bulk actions
- [ ] Financial oversight: transaction logs, disputes, refunds, payout status
- [ ] Analytics: MAU, bookings, GMV, churn, top categories, cohort retention
- [ ] Promotions: create coupon codes, featured placements, push campaigns
- [ ] System health: API latency, error rates, job queue depth, recent deploys
- [ ] Audit log: all admin actions with timestamp, IP, before/after state

---

### 3.18 Background Jobs (BullMQ) (P0)

**User Stories:**
- As a system, I want reliable background processing so operations don't block users.

**Acceptance Criteria:**
- [ ] Job types: email, SMS, push, payment webhooks, report generation, data exports
- [ ] Retry policy: exponential backoff, max 5 attempts, dead letter queue
- [ ] Job priorities: critical (payments), normal (notifications), low (reports)
- [ ] Scheduling: cron for daily summaries, weekly payouts
- [ ] Monitoring: job success/failure rate, queue depth, processing time dashboards
- [ ] Idempotency: duplicate job detection via unique job IDs
- [ ] Concurrency: configurable workers per queue; rate-limited external APIs

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | App launch < 2s; screen load < 1s; API p95 < 200ms |
| **Availability** | 99.9% uptime; scheduled maintenance windows |
| **Security** | OWASP Top 10; encryption in transit (TLS 1.3) and at rest (AES-256) |
| **Scalability** | Auto-scaling; handle 10x traffic spikes |
| **Compliance** | GDPR, CCPA, PCI-DSS Level 1 |
| **Accessibility** | WCAG 2.1 AA; VoiceOver/TalkBack tested |

---

## 5. Prioritization

| Priority | Features |
|----------|----------|
| **P0 (MVP)** | Auth, Guest Browse, Search, Map, Business Detail, Service Categories, Booking Flow, Appointment Mgmt, Availability, Payments, Provider Portal, Background Jobs, Design System |
| **P1** | Favorites, User Profile, Reviews, Notifications, Admin Dashboard |
| **P2** | Loyalty Program, Referrals, AI Recommendations, Group Bookings |

---

## 6. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion rate | > 15% |
| Search-to-book time | < 5 minutes |
| Provider calendar utilization | > 70% |
| NPS (Customers) | > 50 |
| NPS (Providers) | > 40 |
| Monthly churn | < 5% |

---

## 7. Release Plan

| Phase | Duration | Deliverables |
|-------|----------|------------|
| Alpha | 6 weeks | P0 features, internal testing |
| Beta | 4 weeks | P0 hardening, 100 beta users |
| v1.0 | 2 weeks | App store launch, 10 businesses |
| v1.1 | 4 weeks | P1 features, scale to 100 businesses |

---

*Document version: 1.0 | Last updated: 2024 | Owner: Alex (Product)*