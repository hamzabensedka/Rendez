# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first appointment booking platform connecting customers with local service businesses (salons, barbershops, clinics, spas). The platform serves three user types: **Customers** (book appointments), **Business Owners** (manage business, staff, and appointments), and **Admin** (platform oversight).

---

## 2. User Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Customer** | End-user seeking to book services | Find, compare, and book appointments quickly |
| **Guest** | Unregistered browser exploring the platform | Discover businesses without commitment |
| **Business Owner** | Manages one or more service businesses | Maximize bookings, manage schedule, grow revenue |
| **Staff Member** | Employee of a business | View and manage their appointment schedule |
| **Admin** | Platform operator | Monitor health, resolve disputes, drive growth |

---

## 3. Feature Specifications

### 3.1 User Authentication

**Priority:** P0 (Critical)

**Description:** Secure identity system for all user types with role-based access.

**Acceptance Criteria:**
- [ ] Users can register via email/password with validation (email format, password ≥8 chars, 1 uppercase, 1 number)
- [ ] Users can register/login via OAuth 2.0 (Google, Apple)
- [ ] Users can login with email/password
- [ ] Password reset flow via email link (expires in 1 hour)
- [ ] JWT access token (15 min expiry) + refresh token (7 days) with secure httpOnly cookie storage
- [ ] Role assignment on registration: `customer` (default), `business_owner` (via onboarding), `admin` (manual)
- [ ] Account lockout after 5 failed attempts (30 min cooldown)
- [ ] Email verification required before booking (can browse as guest)
- [ ] Biometric login option on mobile (Face ID / fingerprint) after initial authentication

**Edge Cases:**
- Duplicate email registration attempt → return generic error, send "already registered" email
- Expired verification link → prompt to resend with rate limit (max 3 per hour)

---

### 3.2 Guest Browse & Explore

**Priority:** P0

**Description:** Unauthenticated users can discover businesses and services without registration friction.

**Acceptance Criteria:**
- [ ] Guest users can view business listings, search, and filter without login
- [ ] Guest users can view business detail pages with services, prices, and reviews
- [ ] Guest users CANNOT book appointments; CTA prompts login/signup
- [ ] Guest search history stored in localStorage; prompts to persist on login
- [ ] Deep links to businesses work for guests (e.g., shared URL)
- [ ] "Continue as Guest" option on app launch with clear value proposition for registration

**Conversion Optimization:**
- After 3 business views or 2 minutes browsing, show gentle registration prompt
- Pre-fill registration with any guest-provided data (location, selected services)

---

### 3.3 Business Search & Discovery

**Priority:** P0

**Description:** Core discovery engine for customers to find relevant businesses.

**Acceptance Criteria:**
- [ ] Full-text search across: business name, service names, staff names, location
- [ ] Search suggestions with autocomplete (debounced 300ms, min 2 chars)
- [ ] Recent searches stored (max 10), deletable individually or clear all
- [ ] Trending searches section on empty state
- [ ] Filters: category, price range, rating (≥), distance, availability ("open now", "available today"), amenities
- [ ] Sort options: relevance (default), rating, distance, price (low-high), most reviewed
- [ ] Pagination: 20 results per page, infinite scroll on mobile
- [ ] Result cards show: thumbnail, name, rating, distance, starting price, next available slot, category badges
- [ ] "Near me" detection with permission prompt; fallback to city/zip input
- [ ] Saved searches with push notification for new availability

**Performance:** Search response < 500ms for 95th percentile.

---

### 3.4 Map-based Search

**Priority:** P1 (High)

**Description:** Visual location exploration with interactive map.

**Acceptance Criteria:**
- [ ] Toggle between list and map views; persistent user preference
- [ ] Interactive map (Mapbox/Google Maps) with business pin clustering
- [ ] Pins color-coded by category; tap to show preview card
- [ ] Map bounds update results dynamically (debounced 500ms)
- [ ] User location dot with accuracy ring
- [ ] "Re-center" button after panning
- [ ] Business detail opens as bottom sheet (mobile) or sidebar (desktop)
- [ ] Directions integration (open native maps app)
- [ ] Heatmap layer for popular booking times (optional toggle)

---

### 3.5 Business Detail View

**Priority:** P0

**Description:** Comprehensive business profile driving conversion.

**Acceptance Criteria:**
- [ ] Hero: cover image carousel (up to 10), business name, verified badge, favorite toggle
- [ ] Quick actions: call, directions, share, website link
- [ ] Tab navigation: Services, Reviews, About, Team
- [ ] **Services tab:** categorized service list with prices, durations, description; expandable for details
- [ ] **Reviews tab:** rating breakdown (1-5 stars), review list with photos, owner responses, helpful votes
- [ ] **About tab:** description, hours (with "open now" indicator), amenities, parking info, accessibility
- [ ] **Team tab:** staff profiles with photos, specialties, ratings
- [ ] Sticky "Book" CTA with starting price; scrolls to services on tap
- [ ] Business hours with special hours / holiday closures
- [ ] Social proof: total bookings, "trending" badge if >10 bookings this week

---

### 3.6 Service Categories

**Priority:** P1

**Description:** Hierarchical categorization for discovery and business organization.

**Acceptance Criteria:**
- [ ] Predefined category tree (3 levels): e.g., Beauty > Hair > Haircut, Coloring, Styling
- [ ] Businesses can select multiple categories; primary category for discovery
- [ ] Category icons and cover images for visual recognition
- [ ] Trending categories section on home screen
- [ ] Category-specific filters (e.g., Hair: by gender, length; Massage: by pressure, duration)
- [ ] Admin-managed category taxonomy with ability to add/edit/archive

---

### 3.7 Booking Flow

**Priority:** P0

**Description:** Frictionless multi-step appointment reservation.

**Acceptance Criteria:**
- [ ] **Step 1 — Service Selection:** Select service(s); show duration and price total; allow add-ons
- [ ] **Step 2 — Staff Selection:** "Any available" default; or choose specific staff with their calendar preview
- [ ] **Step 3 — Date/Time:** Calendar view with available slots highlighted; time slot grid below
- [ ] **Step 4 — Review:** Summary with business, services, staff, time, price; special requests field (500 chars)
- [ ] **Step 5 — Payment:** See 3.14; or "Pay at venue" option if business allows
- [ ] **Step 6 — Confirmation:** Booking reference, add to calendar, share, directions
- [ ] Real-time slot availability with optimistic locking (hold slot 10 min during checkout)
- [ ] Guest checkout: collect name, phone, email; auto-create account post-booking
- [ ] Reschedule/cancel links in confirmation (before policy deadlines)

**Booking Policies:**
- Cancellation: configurable by business (default: 24h before, no refund; or flexible)
- Reschedule: up to 2 times, not within 4h of appointment
- No-show: auto-marked after 15 min past start; affects future booking privileges

---

### 3.8 Appointment Management

**Priority:** P0

**Description:** Customer and business views for appointment lifecycle.

**Customer — My Appointments:**
- [ ] Upcoming / Past / Cancelled tabs
- [ ] Card: business, services, date/time, status, actions (reschedule, cancel, rebook, review)
- [ ] Countdown to next appointment on home screen
- [ ] Check-in button (arrived at venue) — optional QR code verification

**Business Owner — Calendar & Appointments:**
- [ ] Day/week/month calendar views
- [ ] Filter by staff member or service
- [ ] Drag-and-drop rescheduling
- [ ] Status actions: confirm, complete, no-show, cancel with reason
- [ ] Block time (lunch, vacation) with recurring option
- [ ] Walk-in appointment creation
- [ ] Daily/weekly capacity utilization dashboard

---

### 3.9 Favorites

**Priority:** P1

**Description:** Bookmark businesses for quick access and notifications.

**Acceptance Criteria:**
- [ ] Heart toggle on any business; animation feedback
- [ ] Favorites list with sorting (recently added, alphabetical, nearest)
- [ ] Push notification when favorited business has new availability or promotion
- [ ] Suggest similar businesses based on favorites
- [ ] Import from contacts/social (optional)

---

### 3.10 User Profile

**Priority:** P1

**Description:** Customer identity and preference management.

**Acceptance Criteria:**
- [ ] Editable: name, phone, email (with re-verification), profile photo, birthday
- [ ] Preferences: notification settings, default payment method, preferred staff
- [ ] Address book for home/work locations
- [ ] Booking history with analytics (total spent, visits, favorite categories)
- [ ] Privacy: data export (GDPR), account deletion with 30-day grace period
- [ ] Referral code and credits tracking

---

### 3.11 Availability & Slot Computation

**Priority:** P0

**Description:** Core scheduling engine determining bookable slots.

**Acceptance Criteria:**
- [ ] Business defines: operating hours, service durations, buffer time between appointments, staff assignments
- [ ] Slot generation: divide operating hours by (service duration + buffer), respecting existing bookings
- [ ] Multi-staff parallel booking: same time slot available if multiple staff free
- [ ] Service chaining: consecutive services with same staff auto-combined; different staff require coordination
- [ ] Real-time availability updates on booking/cancellation
- [ ] Override rules: early/late openings, staff time-off, holiday closures
- [ ] Buffer zones: configurable (e.g., 15 min cleanup, 5 min prep)
- [ ] Last-bookable-time: prevent bookings starting within X minutes of current time

**Algorithm Requirements:**
- Pre-compute next 30 days nightly; real-time for today + next 2 days
- Cache invalidation on any schedule change

---

### 3.12 Shared Types & Design System

**Priority:** P0 (Foundation)

**Description:** Consistent UI/UX across all platforms.

**Acceptance Criteria:**
- [ ] Design tokens: colors (primary, secondary, semantic states), typography (scale, weights), spacing (4px grid), shadows, border-radius
- [ ] Component library: buttons, inputs, cards, modals, toasts, loaders, empty states, error boundaries
- [ ] Shared TypeScript types: User, Business, Service, Appointment, Review, Payment, Notification
- [ ] API response standardization: { success, data, error, meta }
- [ ] Accessibility: WCAG 2.1 AA minimum; screen reader support, focus management, color contrast
- [ ] Dark mode support with system preference detection
- [ ] Localization framework (i18n): French default, English; RTL-ready
- [ ] Animation standards: 200ms transitions, 300ms modals, no motion if `prefers-reduced-motion`

---

### 3.13 Reviews & Ratings

**Priority:** P1

**Description:** Social proof and quality feedback loop.

**Acceptance Criteria:**
- [ ] Eligible to review after completed appointment (within 30 days)
- [ ] Rating: 1-5 stars, overall + category ratings (service, cleanliness, value, atmosphere)
- [ ] Review: text (10-1000 chars), photo upload (max 5, 5MB each)
- [ ] Business owner can respond publicly; edit response within 24h
- [ ] Flag inappropriate reviews; admin moderation queue
- [ ] Review helpfulness voting
- [ ] Average rating recalculated nightly; weight recent reviews higher
- [ ] Incentivize reviews: small discount on next booking (optional business setting)

---

### 3.14 Payment Integration

**Priority:** P0

**Description:** Secure, flexible payment processing.

**Acceptance Criteria:**
- [ ] Stripe integration: cards, Apple Pay, Google Pay, SEPA (Europe)
- [ ] Payment flow: client secret → confirm → webhook handling
- [ ] Business-configurable: full prepay, deposit (fixed or %), or pay-at-venue
- [ ] Refund processing: automatic (per policy) or manual (business owner)
- [ ] Receipts: email and in-app; downloadable PDF
- [ ] Failed payment handling: retry x3, notify user, release hold after final failure
- [ ] Tip option: pre-configured % or custom, split if multiple staff
- [ ] Payouts to business: weekly automatic to connected Stripe account; dashboard with pending/available

---

### 3.15 Notifications

**Priority:** P1

**Description:** Multi-channel, timely communication.

**Acceptance Criteria:**
- [ ] Channels: push (Firebase), SMS (Twilio), email (SendGrid), in-app
- [ ] Preference management per channel and event type
- [ ] **Customer events:** booking confirmed, 24h reminder, 1h reminder, rescheduled, cancelled, review prompt, promotion from favorite
- [ ] **Business events:** new booking, cancellation, no-show alert, daily summary
- [ ] **Platform events:** account security, policy updates
- [ ] Notification history in-app (30 days)
- [ ] Deep linking: tap notification opens relevant screen
- [ ] Batch digest option for non-urgent notifications

---

### 3.16 Provider / Business Owner Portal

**Priority:** P0

**Description:** Web-based management for business operations.

**Acceptance Criteria:**
- [ ] **Dashboard:** today's appointments, revenue this week/month, occupancy rate, new vs. returning customers
- [ ] **Business Profile:** edit all details, upload photos, manage hours, set policies
- [ ] **Services:** CRUD services, pricing, duration, staff associations
- [ ] **Staff Management:** add staff (invite via email), set permissions (view only, manage schedule, admin), assign services
- [ ] **Calendar:** see 3.8
- [ ] **Clients:** CRM view — booking history, notes, preferences, spending; export to CSV
- [ ] **Promotions:** create discount codes, flash sales, loyalty program
- [ ] **Settings:** payout account, notification preferences, integration settings (Google Business, Instagram)

---

### 3.17 Admin Dashboard

**Priority:** P2 (Medium)

**Description:** Platform oversight and operational tools.

**Acceptance Criteria:**
- [ ] User management: search, view, suspend, impersonate (audit logged)
- [ ] Business onboarding approval workflow (if required)
- [ ] Content moderation: review flagged reviews, businesses, photos
- [ ] Analytics: MAU, booking volume, GMV, churn, top categories, geographic distribution
- [ ] Financial: transaction monitoring, dispute resolution, refund approval
- [ ] System health: error rates, API latency, job queue depth
- [ ] Feature flags and A/B test configuration
- [ ] Audit log: all admin actions with before/after state

---

### 3.18 Background Jobs (BullMQ)

**Priority:** P1

**Description:** Asynchronous task processing for reliability and performance.

**Acceptance Criteria:**
- [ ] **Job Definitions:**
  - `send-notification`: email, SMS, push dispatch with retry (exponential backoff, max 5)
  - `slot-cache-warm`: nightly pre-computation of availability
  - `payment-process`: idempotent charge handling
  - `review-eligibility-check`: mark appointments eligible for review
  - `analytics-aggregation`: nightly rollups
  - `reminder-dispatch`: 24h and 1h before appointments
  - `no-show-process`: auto-mark past appointments
  - `payout-schedule`: weekly business payouts
- [ ] Job monitoring: BullMQ dashboard, failed job alerting, manual retry/dead letter queue
- [ ] Concurrency limits per queue to prevent resource exhaustion
- [ ] Job priorities: payment > notification > analytics
- [ ] Scheduled jobs: cron syntax, timezone-aware for business-local execution

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | App launch < 2s; page transitions < 300ms; API response < 200ms (p50), < 500ms (p95) |
| **Reliability** | 99.9% uptime; graceful degradation when services unavailable |
| **Security** | OWASP Top 10 mitigation; encryption at rest and in transit; PCI-DSS for payments |
| **Scalability** | Support 10,000 concurrent users; horizontal scaling of stateless services |
| **Compliance** | GDPR, CCPA; data retention policies; right to erasure |

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Guest-to-registered conversion | > 15% |
| Booking completion rate | > 70% (start to finish) |
| Search-to-booking conversion | > 10% |
| No-show rate | < 10% |
| App store rating | > 4.5 |
| NPS | > 50 |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Guest browse, Search, Business detail, Booking flow (pay at venue), Appointment mgmt, Business owner portal | 8 weeks |
| **V1.1** | Payments, Reviews, Notifications, Favorites | +4 weeks |
| **V1.2** | Map search, Service categories, Profile enhancements | +4 weeks |
| **V2.0** | Admin dashboard, Analytics, Background jobs optimization, Promotions | +6 weeks |

---

*Document version: 1.0 | Last updated: 2024 | Owner: Alex, Product Owner*