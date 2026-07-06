# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first platform connecting customers with local service businesses (salons, barbers, spas, clinics) for appointment booking. The product serves three user types: **Customers** (book appointments), **Providers** (manage businesses and availability), and **Admins** (platform oversight).

**Goals:**
- Reduce no-shows through seamless booking + reminders
- Maximize business utilization via intelligent slot computation
- Build trust through reviews, ratings, and transparent pricing

**Success Metrics:**
- Booking conversion rate >15%
- Search-to-book time <3 minutes
- Provider onboarding <10 minutes

---

## 2. User Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Customer** | Busy individual seeking convenient booking | Find, compare, book services quickly |
| **Guest** | Unregistered user exploring the platform | Browse without commitment, convert to customer |
| **Provider** | Business owner/manager | Manage schedule, attract customers, reduce admin |
| **Staff** | Employee performing services | View schedule, manage own availability |
| **Admin** | Platform operator | Monitor health, resolve disputes, drive growth |

---

## 3. Feature Specifications

---

### 3.1 User Authentication
**Priority:** P0 | **Effort:** Medium

**Description:** Secure, frictionless authentication supporting multiple methods with role-based access control.

**User Stories:**
- As a customer, I want to sign up with my phone number or email so I can book quickly.
- As a provider, I want to register my business so I can start accepting bookings.
- As any user, I want to stay logged in securely so I don't re-authenticate frequently.

**Acceptance Criteria:**
- [ ] Support phone (SMS OTP) and email (magic link + password) registration
- [ ] OAuth 2.0: Google, Apple Sign-In
- [ ] JWT access tokens (15min expiry) + refresh tokens (7 days)
- [ ] Role assignment: `customer`, `provider`, `staff`, `admin` on registration
- [ ] Password requirements: min 8 chars, 1 uppercase, 1 number
- [ ] Account lockout after 5 failed attempts (30-min cooldown)
- [ ] Biometric authentication option on supported devices
- [ ] Session management: view and revoke active sessions

**Technical Notes:**
- Use Firebase Auth or Auth0 for OAuth; custom JWT for session
- Store refresh tokens hashed in Redis with TTL

---

### 3.2 Guest Browse & Explore
**Priority:** P0 | **Effort:** Medium

**Description:** Allow unauthenticated users to browse businesses and services, with clear conversion points to register.

**User Stories:**
- As a guest, I want to browse nearby salons so I can see what's available before committing.
- As a guest, I want to view business details and pricing so I can make informed decisions.

**Acceptance Criteria:**
- [ ] Full search and discovery access without login
- [ ] Business detail view accessible (photos, services, reviews, hours)
- [ ] "Book Now" CTA triggers auth modal with pre-filled context
- [ ] Guest booking data persisted for 24 hours post-registration
- [ ] Sticky banner: "Sign up to book — takes 30 seconds"
- [ ] Limit: max 5 business detail views before requiring registration (soft gate)

---

### 3.3 Business Search & Discovery
**Priority:** P0 | **Effort:** High

**Description:** Powerful, fast search with filtering, sorting, and personalization to help customers find ideal providers.

**User Stories:**
- As a customer, I want to search by service type, location, and availability so I find suitable businesses quickly.
- As a customer, I want to filter by price, rating, and distance to narrow results.

**Acceptance Criteria:**
- [ ] Text search: business name, service name, staff name (fuzzy matching)
- [ ] Filters: distance (1-50km), price range, rating (1-5 stars), availability ("book today"), service category, amenities
- [ ] Sort options: relevance, distance, rating, price (low-high), availability (soonest)
- [ ] Auto-complete suggestions with recent searches
- [ ] Search results: card view with photo, name, rating, price from, next available slot
- [ ] Pagination: 20 results per page, infinite scroll on mobile
- [ ] "No results" state with alternative suggestions (expand radius, similar categories)
- [ ] Save search criteria as alert (registered users)

**Technical Notes:**
- Elasticsearch or Algolia for full-text search
- Geospatial indexing for distance queries
- Cache popular searches (1 hour TTL)

---

### 3.4 Map-based Search
**Priority:** P0 | **Effort:** High

**Description:** Interactive map integration for geographic discovery of businesses.

**User Stories:**
- As a customer, I want to see businesses on a map so I understand their locations relative to me.
- As a customer, I want to explore a different neighborhood by panning the map.

**Acceptance Criteria:**
- [ ] Default map view: 5km radius around user location or search center
- [ ] Clustered markers for dense areas (cluster count visible)
- [ ] Marker tap: business name, rating, price from, photo thumbnail
- [ ] "List view" toggle button; sync state between map and list
- [ ] User location dot with accuracy ring
- [ ] Search this area: button appears on map pan/zoom
- [ ] Directions link to native maps app (Google/Apple Maps)
- [ ] Map style matches app design system (custom colors)

**Technical Notes:**
- Mapbox GL or Google Maps SDK
- Debounce map move events (300ms) before fetching new results
- Marker clustering using supercluster or native SDK

---

### 3.5 Business Detail View
**Priority:** P0 | **Effort:** High

**Description:** Comprehensive business profile serving as the primary conversion page.

**User Stories:**
- As a customer, I want to see all business information in one place so I can confidently book.
- As a customer, I want to see real availability before selecting a service.

**Acceptance Criteria:**
- [ ] Hero image carousel (max 10 photos), video support (30 sec max)
- [ ] Business name, verified badge, category, rating, review count
- [ ] Address with copy-to-clipboard, "Get directions"
- [ ] Operating hours with "Open now" / "Closes soon" indicators
- [ ] About section: description, amenities, languages spoken, COVID protocols
- [ ] Services tab: expandable list with name, duration, description, price
- [ ] Reviews tab: sortable (recent, highest, lowest), filter by rating, photos
- [ ] Team tab: staff profiles with photos, specialties, ratings
- [ ] "Book" CTA pinned to bottom; scrolls to service selection
- [ ] Share: native share sheet + copy link
- [ ] Report business option (inappropriate content)

---

### 3.6 Service Categories
**Priority:** P0 | **Effort:** Medium

**Description:** Hierarchical categorization system for organizing and discovering services.

**User Stories:**
- As a customer, I want to browse by category so I find relevant businesses intuitively.
- As a provider, I want to categorize my services so customers find me easily.

**Acceptance Criteria:**
- [ ] Top-level categories: Hair, Nails, Face & Skin, Massage, Wellness, Medical Aesthetic, Fitness, Other
- [ ] Sub-categories (2 levels deep): e.g., Hair > Cut, Color, Styling, Treatment
- [ ] Category icons from design system; consistent across app
- [ ] Trending/featured categories section on home
- [ ] Provider can assign multiple categories to business
- [ ] Admin can manage category tree (CRUD)
- [ ] Category analytics: search volume, conversion rate

---

### 3.7 Booking Flow
**Priority:** P0 | **Effort:** High

**Description:** Streamlined, multi-step booking minimizing abandonment while capturing necessary details.

**User Stories:**
- As a customer, I want to book an appointment in under 60 seconds so I can move on quickly.
- As a customer, I want to see real-time availability so I don't select unavailable slots.

**Acceptance Criteria:**
- [ ] Step 1: Select service(s) — allow multiple services, show total duration/price
- [ ] Step 2: Select staff (optional "no preference") or auto-assign
- [ ] Step 3: Select date (calendar view) and time slot (horizontal scroll or grid)
- [ ] Step 4: Review booking details, apply promo code, add notes
- [ ] Step 5: Confirm — summary with cancel/reschedule policy
- [ ] Payment step (if required): see Section 3.14
- [ ] Confirmation screen with add-to-calendar, share, directions
- [ ] Booking reference number (URL-friendly, unique)
- [ ] Guest checkout: collect name, phone, email; auto-create account
- [ ] Abandoned booking recovery: push notification + email at 1 hour, 24 hours

**State Management:**
- Optimistic UI for slot selection; lock slot for 5 minutes during checkout
- Release lock on timeout, cancellation, or successful booking

---

### 3.8 Appointment Management
**Priority:** P0 | **Effort:** High

**Description:** Complete lifecycle management for customer appointments with provider tools.

**Customer — Acceptance Criteria:**
- [ ] Upcoming appointments list: chronological, group by date
- [ ] Appointment detail: service, staff, time, location, directions, contact
- [ ] Reschedule: select new slot within business's policy (default: 24h before)
- [ ] Cancel: with reason selection (customer no-show protection), refund status
- [ ] Rebook: one-tap rebook same service/staff
- [ ] Add to calendar (iCal/ICS download)
- [ ] Appointment history: past appointments with rebook option

**Provider — Acceptance Criteria:**
- [ ] Daily/weekly calendar view (day, 3-day, week)
- [ ] Color-coded statuses: confirmed, checked-in, in-progress, completed, no-show, cancelled
- [ ] Drag-and-drop rescheduling
- [ ] Block time (breaks, time off)
- [ ] Check-in customer (QR scan or manual)
- [ ] Add walk-in appointment
- [ ] Appointment notes (internal, visible to staff)

---

### 3.9 Favorites
**Priority:** P1 | **Effort:** Low

**Description:** Bookmarking system for quick access to preferred businesses.

**Acceptance Criteria:**
- [ ] Heart icon on business cards and detail view; toggle with haptic feedback
- [ ] Favorites tab: grid/list view of saved businesses
- [ ] Quick book from favorite (skip search)
- [ ] Favorites sync across devices
- [ ] Push notification: "Your favorite [Business] has new availability"
- [ ] Maximum 200 favorites (soft limit with upgrade prompt)

---

### 3.10 User Profile
**Priority:** P1 | **Effort:** Medium

**Description:** Central hub for customer account management and preferences.

**Acceptance Criteria:**
- [ ] Profile photo, name, phone, email (editable with verification)
- [ ] Notification preferences: push, email, SMS — granular per type
- [ ] Payment methods: add, edit, delete, set default
- [ ] Addresses: home, work, other with geocoding
- [ ] Booking preferences: default reminder time, favorite staff
- [ ] Privacy settings: profile visibility, data download, account deletion
- [ ] Referral code and credits balance
- [ ] Support: FAQ, chat, email, call

---

### 3.11 Availability & Slot Computation
**Priority:** P0 | **Effort:** High

**Description:** Core scheduling engine computing real-time availability across complex business rules.

**Acceptance Criteria:**
- [ ] Business hours: recurring weekly schedule + exception dates (holidays, closures)
- [ ] Staff schedules: individual working hours, breaks, time off
- [ ] Service duration: base duration + buffer time (before/after)
- [ ] Slot generation: divide available time by service duration, respect buffers
- [ ] Concurrent bookings: support multiple staff, rooms, or stations
- [ ] Buffer rules: minimum gap between bookings, max advance booking (e.g., 60 days)
- [ ] Real-time availability: account for pending bookings (slot locks)
- [ ] Overbooking protection: strict or configurable (provider setting)
- [ ] Complex services: multi-part services requiring sequential staff or resources
- [ ] Performance: compute slots for 30-day window in <200ms

**Algorithm Requirements:**
- Pre-compute daily slot templates; adjust for actual bookings
- Cache individual staff availability (5-min TTL)
- Handle timezone correctly (business timezone stored, convert from user)

---

### 3.12 Shared Types & Design System
**Priority:** P0 | **Effort:** Medium

**Description:** Consistent visual language and reusable components ensuring cohesive experience.

**Design System — Acceptance Criteria:**
- [ ] Color palette: primary, secondary, semantic (success, warning, error, info), neutrals (8 grades)
- [ ] Typography: font families, sizes (12 levels), weights, line heights
- [ ] Spacing scale: 4px base unit (0, 4, 8, 12, 16, 24, 32, 48, 64)
- [ ] Border radius: 4px (small), 8px (medium), 16px (large), 24px (xl), full (pills)
- [ ] Shadow system: 3 elevations (rest, raised, overlay)
- [ ] Breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px)

**Component Library:**
- [ ] Buttons: primary, secondary, tertiary, ghost, danger; sizes sm/md/lg; states (default, hover, active, disabled, loading)
- [ ] Inputs: text, number, date/time, select, multiselect, textarea, search
- [ ] Cards: business, service, appointment, review variants
- [ ] Modals: alert, confirmation, form, bottom sheet (mobile)
- [ ] Navigation: tab bar, side nav (desktop), breadcrumbs
- [ ] Feedback: toast, banner, inline error, skeleton, empty state
- [ ] Data display: avatar, badge, chip, progress bar, rating stars, calendar

**Shared Types (TypeScript):**
- [ ] User, Business, Service, Staff, Appointment, Review, Payment, Notification entities
- [ ] API response wrappers: Success<T>, Error, Paginated<T>
- [ ] Enums: BookingStatus, PaymentStatus, NotificationType, DayOfWeek
- [ ] Utility types: Nullable<T>, DeepPartial<T>, APIErrorCode

---

### 3.13 Reviews & Ratings
**Priority:** P1 | **Effort:** Medium

**Description:** Trust-building through verified customer feedback.

**Acceptance Criteria:**
- [ ] Eligibility: can review after completed appointment (within 14 days)
- [ ] Rating: 1-5 stars, overall + optional sub-ratings (service, staff, value, atmosphere)
- [ ] Review text: 10-1000 characters, photo upload (max 5)
- [ ] Business reply: public response to any review
- [ ] Review moderation: auto-flag profanity, manual review queue
- [ ] Helpful/not helpful voting on reviews
- [ ] Sort: most relevant, newest, highest/lowest rating
- [ ] Aggregate: average rating, distribution histogram, total count
- [ ] Provider dashboard: review analytics, response rate, sentiment trends

---

### 3.14 Payment Integration
**Priority:** P0 | **Effort:** High

**Description:** Secure, flexible payment processing supporting multiple methods and business models.

**Acceptance Criteria:**
- [ ] Payment methods: credit/debit (Stripe), Apple Pay, Google Pay, PayPal
- [ ] Pricing models: free booking, deposit, full prepay, pay-at-venue
- [ ] Service fee: platform fee (configurable % or fixed), shown transparently
- [ ] Refund policy: full, partial, or no refund based on cancellation time
- [ ] Automatic refunds to original payment method
- [ ] Invoice generation: email + downloadable PDF
- [ ] Provider payout: weekly to connected account (Stripe Connect)
- [ ] Failed payment handling: retry logic, customer notification, booking hold
- [ ] PCI compliance: no card data stored; use Stripe Elements/tokenization

---

### 3.15 Notifications
**Priority:** P1 | **Effort:** Medium

**Description:** Multi-channel notification system for engagement and operational efficiency.

**Acceptance Criteria:**
- [ ] Channels: push (Firebase), email (SendGrid), SMS (Twilio) — configurable per user
- [ ] Trigger types:
  - Booking: confirmation, reminder (24h, 2h before), modification, cancellation
  - Marketing: promotional offers, new businesses, favorites availability
  - Operational: payment success/failure, review request, account security
- [ ] Provider notifications: new booking, cancellation, review posted, payout
- [ ] Rich push: deep links to relevant screens
- [ ] Notification center: in-app inbox with read/unread, delete, preferences link
- [ ] Quiet hours: respect timezone, default 22:00-08:00
- [ ] Delivery tracking: sent, delivered, opened metrics

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0 | **Effort:** High

**Description:** Comprehensive web dashboard for business management.

**Acceptance Criteria:**
- [ ] Onboarding wizard: needle, business info, services, staff, hours, payment setup
- [ ] Dashboard: today's bookings, revenue this week, upcoming week preview
- [ ] Calendar management: see 3.8
- [ ] Service management: CRUD services, pricing, duration, online/offline toggle
- [ ] Staff management: invite, permissions (view only, manage bookings, admin), schedules
- [ ] Customer management: view history, notes, marketing opt-in status
- [ ] Analytics: bookings, revenue, no-show rate, popular services, peak hours
- [ ] Settings: business profile, cancellation policy, notification preferences, integrations
- [ ] Mobile-responsive for on-the-go management

---

### 3.17 Admin Dashboard
**Priority:** P1 | **Effort:** High

**Description:** Platform oversight and operational tools for internal team.

**Acceptance Criteria:**
- [ ] User management: search, view, suspend, impersonate (audit logged)
- [ ] Business verification: review submissions, approve/reject with reason, badge management
- [ ] Content moderation: review flagged reviews, business reports, take action
- [ ] Financial oversight: transaction logs, dispute resolution, refund approval
- [ ] Analytics: MAU, booking volume, GMV, churn, CAC, top categories/cities
- [ ] System health: API latency, error rates, queue depths, third-party status
- [ ] Configuration: feature flags, global settings, category management
- [ ] Audit log: all admin actions with actor, timestamp, before/after state

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P0 | **Effort:** High

**Description:** Reliable, scalable job processing for asynchronous operations.

**Acceptance Criteria:**
- [ ] Job types and priorities:
  - **Critical (process immediately):** payment processing, slot locking, SMS OTP
  - **High:** booking confirmations, push notifications, email sends
  - **Normal:** review request emails, analytics aggregation, report generation
  - **Low:** data archiving, cleanup jobs, recommendation engine updates
- [ ] Retry policy: 3 attempts with exponential backoff (2^attempt * 1000ms)
- [ ] Dead letter queue: manual inspection and replay after max retries
- [ ] Job idempotency: unique job IDs, deduplication on business key
- [ ] Monitoring: queue depth, processing rate, failure rate, average latency
- [ ] Scheduled jobs: nightly aggregation, weekly provider reports
- [ ] Job cancellation: cancel pending jobs on user action (e.g., booking cancelled)

**Specific Jobs:**
- [ ] `send-notification`: dispatch to correct channel with fallback
- [ ] `process-payment`: idempotent charge, idempotency key from Stripe
- [ ] `compute-availability`: regenerate slot cache on schedule change
- [ ] `generate-invoice`: create and email PDF invoice
- [ ] `cleanup-expired-locks`: release stale slot locks
- [ ] `sync-search-index`: incremental Elasticsearch updates

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | App cold start <2s; API response <200ms (p95); image load <1s |
| Availability | 99.9% uptime; scheduled maintenance windows |
| Security | OWASP Top 10 compliance; annual penetration test; SOC 2 Type II target |
| Accessibility | WCAG 2.1 AA; screen reader support; minimum 44px touch targets |
| Localization | French (default), English; RTL support planned; date/time localization |
| Offline | View cached appointments; queue actions for sync |

---

## 5. Analytics & Measurement

| Metric | Target | Measurement |
|--------|--------|-------------|
| Search-to-book conversion | >15% | Funnel: search → detail → booking start → complete |
| Booking abandonment | <30% | Checkout initiated but not completed |
| Provider activation | >80% complete onboarding | Within 7 days of registration |
| Customer retention (30d) | >40% | Return booking within 30 days |
| NPS | >50 | In-app survey post-appointment |
| Support ticket volume | <2% of bookings | Categorized by issue type |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Guest browse, Search, Business detail, Categories, Booking, Basic availability, Provider portal (core) | Week 1-8 |
| **V1.0** | Map search, Appointment management, Favorites, Profile, Reviews, Payments, Notifications | Week 9-16 |
| **V1.5** | Advanced availability, Admin dashboard, Background jobs, Analytics, Design system hardening | Week 17-24 |
| **V2.0** | AI recommendations, Loyalty program, Marketplace features, International expansion | Week 25+ |

---

## 7. Open Questions

1. Regulatory requirements for health/wellness services (licensing verification)?
2. Insurance integration for liability coverage?
3. White-label / franchise multi-location support?
4. In-app messaging between customer and provider?
5. Subscription/membership model for providers?

---

*Document Version: 1.0*
*Last Updated: 2024*
*Owner: Alex, Product Owner*