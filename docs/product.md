# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first marketplace connecting consumers with local beauty/wellness businesses for appointment booking. The platform serves three user segments: **Consumers** (book appointments), **Providers** (manage businesses and schedules), and **Admin** (platform governance).

---

## 2. Feature Specifications

### 2.1 User Authentication

**Priority:** P0 — Critical Path

**Description:** Secure identity management for all user types with role-based access.

**Acceptance Criteria:**
- [ ] Consumers can register via email/password, Google OAuth, or Apple Sign-In
- [ ] Providers register via dedicated flow with business verification
- [ ] Password reset via secure email token (expires in 1 hour)
- [ ] JWT access tokens (15min expiry) with refresh token rotation
- [ ] Account lockout after 5 failed attempts; unlock via email
- [ ] Email verification required before booking
- [ ] Biometric login option on supported devices
- [ ] Session management: view and revoke active sessions

**Edge Cases:**
- Social auth linking to existing email account
- Re-authentication required for sensitive actions (payment, password change)

---

### 2.2 Guest Browse & Explore

**Priority:** P0 — Critical Path

**Description:** Unauthenticated discovery to drive conversion.

**Acceptance Criteria:**
- [ ] Guest users can browse businesses, services, and availability without login
- [ ] Guest checkout flow: prompt for auth at booking confirmation (not before)
- [ ] Guest session persists for 30 days via device ID
- [ ] Seamless account creation preserving guest browsing history and pending booking
- [ ] Location permission requested contextually (after showing value)

**Conversion Metrics:**
- Guest-to-registered conversion rate tracked
- Booking abandonment at auth step < 15%

---

### 2.3 Business Search & Discovery

**Priority:** P0 — Critical Path

**Description:** Intelligent search to match consumers with relevant businesses.

**Acceptance Criteria:**
- [ ] Full-text search across business name, service names, and descriptions
- [ ] Autocomplete with typo tolerance (fuzzy matching)
- [ ] Search filters: distance (1-50km), price range, rating, availability today, gender of staff
- [ ] Sort options: relevance, distance, rating, price (low-high)
- [ ] Recent searches stored (max 10, clearable)
- [ ] Popular searches and trending businesses surfaced
- [ ] Empty state with suggestions and category shortcuts
- [ ] Search result cards show: image, name, rating, distance, price from, next availability

**Performance:**
- Search results < 200ms
- Debounced input at 300ms

---

### 2.4 Map-based Search

**Priority:** P0 — Critical Path

**Description:** Visual geographic exploration with clustering and business density.

**Acceptigen Criteria:**
- [ ] Interactive map with business pins; cluster pins at zoomed-out levels
- [ ] User location dot with accuracy radius
- [ ] Tap pin shows business preview card; tap card navigates to detail
- [ ] List/map toggle with synchronized state
- [ ] Map bounds trigger search re-query (debounced)
- [ ] Custom markers for open/closed status and promotion badges
- [ ] Directions integration (external maps app)
- [ ] "Search this area" button on map pan

**Technical:**
- Max 100 pins rendered; clustering for performance
- Map tile caching for offline partial functionality

---

### 2.5 Business Detail View

**Priority:** P0 — Critical Path

**Description:** Comprehensive business information to drive booking decisions.

**Acceptance Criteria:**
- [ ] Image gallery (up to 10 photos), swipeable, pinch-to-zoom
- [ ] Business info: name, address, phone, website, hours, description
- [ ] Services tab: categorized list with prices and durations
- [ ] Team tab: staff profiles with photos, bios, specialties
- [ ] Reviews tab: aggregate rating, distribution histogram, review list
- [ ] Availability quick-view: next 3 available slots across all services
- [ ] "Book Now" CTA sticky at bottom
- [ ] Share business via deep link
- [ ] Report business functionality

**Analytics:**
- View-to-booking conversion tracked per business

---

### 2.6 Service Categories

**Priority:** P1 — Important

**Description:** Hierarchical classification for discovery and business organization.

**Acceptance Criteria:**
- [ ] Predefined category tree: Hair, Nails, Face, Body, Massage, Medical Aesthetic
- [ ] Subcategories: e.g., Hair > Cut, Color, Styling, Treatment
- [ ] Businesses can assign multiple categories and subcategories
- [ ] Category icons and color coding in UI
- [ ] Category-based browsing from home screen
- [ ] Trending categories dynamically surfaced
- [ ] Admin can add/edit categories without code change

---

### 2.7 Booking Flow

**Priority:** P0 — Critical Path

**Description:** Seamless appointment reservation with minimal friction.

**Acceptance Criteria:**
- [ ] Step 1: Select service(s) with optional staff preference
- [ ] Step 2: Calendar view with available slots (week view default, scroll 3 months)
- [ ] Step 3: Time slot selection with duration-aware blocking
- [ ] Step 4: Review booking summary with cancellation policy
- [ ] Step 5: Payment (if required) or confirm (pay at venue)
- [ ] Real-time slot availability with optimistic locking (5min hold on selection)
- [ ] Add to calendar (iCal/Google Calendar) post-booking
- [ ] Booking confirmation with QR code for check-in
- [ ] Reschedule/cancel within business policy (configurable)
- [ ] Waitlist option for fully booked preferred slots

**Business Rules:**
- Minimum booking notice: 2 hours (configurable per business)
- Maximum advance booking: 6 months

---

### 2.8 Appointment Management

**Priority:** P0 — Critical Path

**Description:** Lifecycle management for consumer appointments.

**Acceptance Criteria:**
- [ ] Upcoming appointments list with countdown and action buttons
- [ ] Past appointments with rebook shortcut
- [ ] Appointment detail: service, staff, time, location, QR code, notes
- [ ] Reschedule: suggest alternatives, preserve payment if applicable
- [ ] Cancel with reason selection; apply cancellation fee per policy
- [ ] No-show tracking and penalty enforcement
- [ ] Appointment notes (consumer-visible and internal)
- [ ] Receipt and invoice access

---

### 2.9 Favorites

**Priority:** P1 — Important

**Description:** Save businesses for quick rebooking and notifications.

**Acceptance Criteria:**
- [ ] One-tap favorite from business card or detail view
- [ ] Favorites list with availability status indicators
- [ ] Favorites sorted by: recently added, nearest, or alphabetical
- [ ] Push notification option: "New availability at [favorite]"
- [ ] Favorite businesses prioritized in search results (slight rank boost)
- [ ] Sync favorites across devices for logged-in users

---

### 2.10 User Profile

**Priority:** P1 — Important

**Description:** Consumer identity and preference management.

**Acceptance Criteria:**
- [ ] Editable: name, phone, email, profile photo, birthday (for birthday offers)
- [ ] Notification preferences: push, email, SMS (granular per type)
- [ ] Payment methods management (PCI-compliant tokenization)
- [ ] Booking history with filter and search
- [ ] Loyalty points/programs if applicable
- [ ] Data export (GDPR compliance)
- [ ] Account deletion with 30-day grace period
- [ ] Referral code and credits tracking

---

### 2.11 Availability & Slot Computation

**Priority:** P0 — Critical Path

**Description:** Core scheduling engine with complex business rule support.

**Acceptance Criteria:**
- [ ] Business defines: operating hours, break times, slot duration granularity
- [ ] Staff-specific schedules and time off
- [ ] Service duration and buffer time (cleanup, travel)
- [ ] Concurrent booking limits (rooms, chairs, equipment)
- [ ] Recurring unavailability (holidays, training)
- [ ] Slot computation accounts for all constraints in < 100ms
- [ ] Overbooking protection with configurable waitlist depth
- [ ] Last-minute availability push notifications to waitlist
- [ ] Timezone handling for cross-timezone bookings

**Algorithm:**
- Generate candidate slots from business rules
- Filter by staff availability and service constraints
- Apply booking conflicts and buffers
- Return paginated results with cache headers

---

### 2.12 Shared Types & Design System

**Priority:** P0 — Critical Path (Foundation)

**Description:** Consistent UI/UX and type safety across platforms.

**Acceptance Criteria:**
- [ ] TypeScript strict mode; shared types between API and clients
- [ ] Core entities: User, Business, Service, Staff, Appointment, Review, Payment
- [ ] Design tokens: colors, typography, spacing, shadows, radii
- [ ] Component library: buttons, inputs, cards, modals, loaders, empty states
- [ ] Dark mode support with system preference detection
- [ ] Accessibility: WCAG 2.1 AA minimum, screen reader support, focus management
- [ ] RTL language preparation
- [ ] Animation standards: 200ms transitions, meaningful motion

---

### 2.13 Reviews & Ratings

**Priority:** P1 — Important

**Description:** Social proof and quality feedback loop.

**Acceptance Criteria:**
- [ ] Post-appointment review prompt (24 hours after, configurable)
- [ ] Star rating (1-5) with optional text review (10-500 chars)
- [ ] Review categories: service quality, staff, ambiance, value
- [ ] Photo upload option (max 3, moderated)
- [ ] Business owner response capability
- [ ] Review helpfulness voting
- [ ] Flag inappropriate reviews with admin moderation queue
- [ ] Average rating recalculation on new review (weighted by recency)
- [ ] Eligibility: only verified customers can review

---

### 2.14 Payment Integration

**Priority:** P0 — Critical Path

**Description:** Secure, flexible payment processing.

**Acceptance Criteria:**
- [ ] Stripe integration: cards, Apple Pay, Google Pay
- [ ] Payment modes: full prepay, deposit, or pay at venue
- [ ] Split payments (deposit + balance)
- [ ] Refund processing with automatic policy application
- [ ] Invoice generation and email delivery
- [ ] Failed payment retry with dunning management
- [ ] Tax calculation based on business location
- [ ] Tip option (configurable percentage or custom)
- [ ] Payment receipt in-app and email

**Security:**
- No card data stored; tokens only
- 3D Secure for applicable transactions

---

### 2.15 Notifications

**Priority:** P1 — Important

**Description:** Multi-channel, preference-aware communication system.

**Acceptance Criteria:**
- [ ] Push notifications: booking confirmed, reminder (24h, 2h), cancelled, promoted waitlist
- [ ] Email: confirmations, receipts, marketing (opt-in), account security
- [ ] SMS: critical updates only (opt-in)
- [ ] In-app notification center with read/unread status
- [ ] Deep links from notifications to relevant screens
- [ ] Quiet hours respect (10pm-8am local time)
- [ ] Batch non-urgent notifications
- [ ] Delivery tracking and retry for failed pushes

---

### 2.16 Provider / Business Owner Portal

**Priority:** P0 — Critical Path

**Description:** Self-service management for business operations.

**Acceptance Criteria:**
- [ ] Dashboard: today's appointments, revenue, new reviews
- [ ] Calendar view: day/week/month with drag-to-reschedule
- [ ] Service management: CRUD with pricing, duration, online booking toggle
- [ ] Staff management: profiles, schedules, service assignments
- [ ] Booking rules: notice period, cancellation policy, buffer times
- [ ] Client management: notes, visit history, marketing consent
- [ ] Availability blocking (single or recurring)
- [ ] Revenue reports: daily, weekly, monthly with export
- [ ] Promotions and discount code creation
- [ ] Multi-location support with role-based access

---

### 2.17 Admin Dashboard

**Priority:** P1 — Important

**Description:** Platform oversight and operational support.

**Acceptance Criteria:**
- [ ] User management: search, suspend, impersonate (audit logged)
- [ ] Business verification workflow: pending, approved, rejected, documentation
- [ ] Content moderation: flagged reviews, reported businesses
- [ ] Financial overview: GMV, commissions, payouts, disputes
- [ ] Analytics: MAU, booking conversion, churn, top categories
- [ ] System health: job queue depth, error rates, API latency
- [ ] Feature flags for gradual rollout
- [ ] Support ticket integration
- [ ] Audit log of all admin actions

---

### 2.18 Background Jobs (BullMQ)

**Priority:** P0 — Critical Path (Infrastructure)

**Description:** Reliable async processing for scalability.

**Acceptance Criteria:**
- [ ] Job types: email send, push notification, payment capture, report generation, data export
- [ ] Retry policy: 3 attempts with exponential backoff
- [ ] Dead letter queue for failed jobs after retries exhausted
- [ ] Job scheduling: one-time and recurring (cron)
- [ ] Job progress tracking for long-running tasks
- [ ] Stalled job detection and reprocessing
- [ ] Queue monitoring dashboard (Bull Board or similar)
- [ ] Priority queues: critical > default > low
- [ ] Rate limiting for external API calls (email, SMS providers)

---

## 3. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | App cold start < 3s; screen transitions < 300ms |
| Availability | 99.9% uptime; scheduled maintenance windows |
| Security | OWASP Top 10 mitigation; annual penetration test |
| Compliance | GDPR, CCPA, PCI-DSS Level 1 |
| Localization | French (default), English; extensible |
| Offline | Browse cached data; queue actions for sync |

---

## 4. Success Metrics

| Metric | Target |
|--------|--------|
| Monthly Bookings | Growth 20% MoM |
| Booking Conversion | > 8% of app opens |
| NPS | > 50 |
| Provider Activation | > 70% complete profile, add services |
| Support Tickets | < 2% of transactions |

---

## 5. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Search, Business Detail, Booking, Provider Portal, Admin | Month 1-2 |
| V1.1 | Payments, Notifications, Reviews, Favorites | Month 3 |
| V1.2 | Map Search, Categories, Profile enhancements | Month 4 |
| V1.3 | Background Jobs optimization, Analytics, Loyalty | Month 5-6 |

---

*Document Version: 1.0*
*Last Updated: Product Team*