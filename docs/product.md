# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first platform connecting customers with beauty, wellness, and service professionals for appointment booking. The platform serves three user types: customers seeking services, business owners managing their operations, and administrators overseeing the marketplace.

**Goals:**
- Enable seamless discovery and booking of local service appointments
- Provide business owners with tools to manage availability, services, and clientele
- Build a trusted marketplace through reviews and ratings
- Support scalable operations across multiple cities and service categories

---

## 2. User Personas

| Persona | Description | Primary Needs |
|---------|-------------|---------------|
| **Customer** | Seeks beauty/wellness services, values convenience and trust | Easy search, quick booking, reminders, flexibility |
| **Guest** | Unregistered user exploring the platform | Browse without commitment, convert to registered user |
| **Business Owner** | Manages salon/spa/clinic, wants to fill calendar efficiently | Simple scheduling, client management, revenue tracking |
| **Admin** | Platform operator ensuring quality and growth | Oversight, support tools, fraud prevention, analytics |

---

## 3. Feature Specifications

### 3.1 User Authentication

**Priority:** P0 — Critical

**Description:** Secure, frictionless registration and login for customers and business owners.

**User Stories:**
- As a customer, I want to register with my phone number or email so I can book appointments
- As a user, I want to log in with biometrics for convenience
- As a user, I want to reset my password securely if I forget it
- As a business owner, I want a separate onboarding flow with verification

**Acceptance Criteria:**
- [ ] Registration via email (magic link + password) and phone (SMS OTP)
- [ ] Social login: Google, Apple (iOS), Facebook
- [ ] Biometric authentication (Face ID / Touch ID / Fingerprint) after initial login
- [ ] JWT access token + refresh token pattern with secure storage
- [ ] Password reset via verified email/SMS with 15-minute expiry
- [ ] Account lockout after 5 failed attempts, 30-minute cooldown
- [ ] Business owner accounts require phone verification + business documentation review
- [ ] GDPR-compliant consent capture during registration

**Technical Notes:**
- OAuth 2.0 + OpenID Connect for social providers
- Rate limiting: 5 requests/minute per IP for auth endpoints

---

### 3.2 Guest Browse & Explore

**Priority:** P0 — Critical

**Description:** Allow unauthenticated users to discover businesses and services, driving conversion.

**User Stories:**
- As a guest, I want to browse businesses without creating an account
- As a guest, I want to see service prices and availability before committing
- As a guest, I want the app to remember my location preferences

**Acceptance Criteria:**
- [ ] Full search and browse functionality accessible without login
- [ ] Business detail pages viewable by guests
- [ ] Service catalog and pricing visible without authentication
- [ ] "Book Now" prompts login/signup at booking initiation (not before)
- [ ] Guest session data (location, recent searches) persisted locally, merged on registration
- [ ] Maximum 3 business detail views before soft prompt to register

---

### 3.3 Business Search & Discovery

**Priority:** P0 — Critical

**Description:** Intelligent search and filtering to help customers find the right business.

**User Stories:**
- As a customer, I want to search by business name, service type, or treatment
- As a customer, I want to filter by price, rating, distance, and availability
- As a customer, I want to see trending and recommended businesses

**Acceptance Criteria:**
- [ ] Full-text search across business names, services, staff names
- [ ] Autocomplete with suggestions in <200ms
- [ ] Filters: distance (km/mi), price range, rating (1-5 stars), availability (today, this week), gender of staff, languages spoken
- [ ] Sort options: relevance, distance, rating, price (low-high), most reviewed
- [ ] Search history saved for authenticated users (last 20 searches)
- [ ] "Near me" uses GPS with fallback to manual location entry
- [ ] Results pagination: 20 items per page, infinite scroll on mobile
- [ ] Empty state with suggestions when no results found

---

### 3.4 Map-based Search

**Priority:** P0 — Critical

**Description:** Visual exploration of businesses on an interactive map.

**User Stories:**
- As a customer, I want to see businesses on a map to understand proximity
- As a customer, I want to adjust the map area and see updated results
- As a customer, I want to see business density and cluster markers

**Acceptance Criteria:**
- [ ] Toggle between list and map views on search results
- [ ] Interactive map with custom business pins (open/closed status, rating snapshot)
- [ ] Clustering for dense areas (grouped by proximity, count displayed)
- [ ] Map bounds trigger new search query (debounced 300ms)
- [ ] Business cards appear on pin tap with key info and CTA
- [ ] "Re-center to my location" button
- [ ] Default zoom shows ~5km radius; adjustable
- [ ] Offline: cache last viewed map tiles for 7 days

---

### 3.5 Business Detail View

**Priority:** P0 — Critical

**Description:** Comprehensive business profile with all information needed to make a booking decision.

**User Stories:**
- As a customer, I want to see photos, services, prices, and reviews
- As a customer, I want to know opening hours and location details
- As a customer, I want to see staff profiles and their specialties

**Acceptance Criteria:**
- [ ] Hero image gallery (up to 10 images), swipeable, pinch-to-zoom
- [ ] Business name, verified badge, average rating, review count
- [ ] Address with "Get Directions" (deep link to native maps)
- [ ] Phone number with tap-to-call (hidden until booked, for privacy)
- [ ] Opening hours with "Open Now" / "Closes soon" indicators
- [ ] Full services list with descriptions, durations, prices
- [ ] Staff profiles: photo, name, bio, specialties, customer rating
- [ ] Instagram/social media integration (optional, business-configured)
- [ ] COVID-19 safety measures (configurable)
- [ ] "Add to Favorites" and "Share" actions
- [ ] Similar businesses carousel at bottom

---

### 3.6 Service Categories

**Priority:** P0 — Critical

**Description:** Hierarchical categorization of services for discovery and business organization.

**User Stories:**
- As a customer, I want to browse by category (hair, nails, massage, etc.)
- As a business owner, I want to categorize my services for discoverability
- As an admin, I want to manage the category taxonomy

**Acceptance Criteria:**
- [ ] Two-level hierarchy: Category > Subcategory (e.g., Hair > Coloring, Hair > Cutting)
- [ ] Categories: Hair, Face, Body, Hands & Feet, Medical Aesthetic, Wellness, Fitness, Other
- [ ] Category icons and color coding in UI
- [ ] Business can assign services to multiple categories
- [ ] Trending categories surfaced on home screen
- [ ] Admin can add, edit, deactivate categories without code deploy
- [ ] Category slugs for SEO-friendly URLs

---

### 3.7 Booking Flow

**Priority:** P0 — Critical

**Description:** Seamless, multi-step appointment booking with real-time availability.

**User Stories:**
- As a customer, I want to select a service, staff, and time slot easily
- As a customer, I want to see my booking summary before confirming
- As a customer, I want to receive confirmation immediately

**Acceptance Criteria:**
- [ ] Step 1: Select service(s) — multi-select supported, duration auto-calculated
- [ ] Step 2: Select staff member or "No preference" (assigns to any available)
- [ ] Step 3: Select date (calendar view) and time slot
- [ ] Step 4: Review booking — service, staff, time, location, price, cancellation policy
- [ ] Step 5: Payment (if required) or confirm (pay at venue)
- [ ] Real-time slot availability with no overbooking (pessimistic locking, 5-min hold)\n- [ ] Guest checkout supported (email + phone required)
- [ ] Booking confirmation screen with add-to-calendar option
- [ ] Confirmation email and push notification within 5 seconds
- [ ] Support for recurring bookings (weekly/monthly, up to 6 months)
- [ ] Waitlist option when no slots available (notify when opens)

---

### 3.8 Appointment Management

**Priority:** P0 — Critical

**Description:** Full lifecycle management of appointments for customers and business owners.

**Customer Acceptance Criteria:**
- [ ] View upcoming and past appointments in list view
- [ ] Reschedule: select new slot, subject to business cancellation policy
- [ ] Cancel: with reason selection, refund status displayed
- [ ] Add to native calendar (iOS Calendar / Google Calendar)
- [ ] Directions to business at appointment time
- [ ] Rebook same service with one tap
- [ ] Rate and review after appointment completion

**Business Owner Acceptance Criteria:**
- [ ] Calendar view (day/week/month) of all appointments
- [ ] Color-coded by status: confirmed, checked-in, completed, cancelled, no-show
- [ ] Block time (breaks, unavailability)
- [ ] Accept/decline booking requests (if approval required)
- [ ] Check-in customer on arrival
- [ ] Add notes to appointment (internal, customer-invisible)
- [ ] View customer history and preferences

**Policy Engine:**
- [ ] Configurable cancellation window (default: 24h before, business can customize)
- [ ] Late cancellation fees (configurable, integrated with payments)
- [ ] No-show tracking and automated flagging

---

### 3.9 Favorites

**Priority:** P1 — High

**Description:** Save and quickly access preferred businesses and services.

**Acceptance Criteria:**
- [ ] Toggle favorite from business detail, search results, or after booking
- [ ] Favorites list with quick-book option
- [ ] Favorites sync across devices for logged-in users
- [ ] Push notification when favorite business has new availability or promotion
- [ ] Suggested favorites based on booking history
- [ ] Maximum 200 favorites per user (soft limit, expandable)

---

### 3.10 User Profile

**Priority:** P1 — High

**Description:** Customer-facing profile management and preferences.

**Acceptance Criteria:**
- [ ] Profile photo, name, phone, email (editable with verification)
- [ ] Notification preferences: push, email, SMS (granular per type)
- [ ] Payment methods management (cards, Apple Pay, Google Pay)
- [ ] Booking history with receipts/invoices
- [ ] Loyalty points balance (if program active)
- [ ] Referral code and credits tracking
- [ ] Account deletion (GDPR right to be forgotten, 30-day grace)
- [ ] Dark/light mode preference
- [ ] Language selection (i18n support: FR, EN, ES, DE initial)

---

### 3.11 Availability & Slot Computation

**Priority:** P0 — Critical

**Description:** Core engine for calculating and serving real-time booking slots.

**Acceptance Criteria:**
- [ ] Business defines: operating hours per day, staff schedules, service durations, buffer times between appointments
- [ ] Slot generation accounts for: existing bookings, blocked times, staff breaks, service-specific duration
- [ ] Real-time availability query with <100ms response (cached + invalidation)
- [ ] Timezone-aware (business timezone, display in customer timezone if different)
- [ ] Support for complex rules: split shifts, rotating staff, variable service durations
- [ ] Overbooking prevention via database-level constraints
- [ ] Slot hold: 5 minutes during booking flow, released on abandonment or timeout
- [ ] Bulk slot generation for next 60 days, regenerated nightly
- [ ] Handle daylight saving time transitions gracefully

---

### 3.12 Shared Types & Design System

**Priority:** P0 — Critical (enabler)

**Description:** Consistent UI/UX foundation across all platforms.

**Acceptance Criteria:**
- [ ] Component library: buttons, inputs, cards, modals, date/time pickers, loading states
- [ ] Color palette: primary (brand), semantic (success, warning, error, info), neutrals
- [ ] Typography: scale for mobile readability (minimum 14px body, 24px headers)
- [ ] Spacing system: 4px base grid
- [ ] Animation standards: 200ms transitions, native-feel gestures
- [ ] Accessibility: WCAG 2.1 AA, screen reader support, minimum touch target 44x44dp
- [ ] Dark mode support with full theme specification
- [ ] Shared TypeScript types across frontend, backend, and API contracts
- [ ] Icon set: custom + Material Design / SF Symbols hybrid

---

### 3.13 Reviews & Ratings

**Priority:** P1 — High

**Description:** Trust-building through verified customer feedback.

**Acceptance Criteria:**
- [ ] Eligibility: only customers with completed appointments can review
- [ ] Rating: 1-5 stars, overall + optional category ratings (service, cleanliness, value, atmosphere)
- [ ] Review text: 10-1000 characters, profanity filter
- [ ] Photo upload optional (max 5, moderation queue)
- [ ] Business owner response capability
- [ ] Review helpfulness voting
- [ ] Sorting: most recent, highest/lowest rated, most helpful
- [ ] Flag inappropriate content (triggers admin review)
- [ ] Aggregate rating recalculated with Bayesian average to prevent manipulation
- [ ] Review solicitation: push notification 2 hours after appointment

---

### 3.14 Payment Integration

**Priority:** P1 — High

**Description:** Secure, flexible payment processing for bookings.

**Acceptance Criteria:**
- [ ] Payment methods: credit/debit cards (Stripe), Apple Pay, Google Pay, PayPal
- [ ] Payment timing: pay now (full), pay deposit, pay at venue
- [ ] Split payments: deposit online + remainder at venue
- [ ] Automatic refunds per cancellation policy
- [ ] Invoice generation and email delivery
- [ ] Payment receipt in app and email
- [ ] Failed payment retry with notification
- [ ] PCI DSS compliance (Stripe Elements / native SDKs, no card data touch)
- [ ] Currency display based on business location
- [ ] Revenue dashboard for business owners (daily, weekly, monthly)

---

### 3.15 Notifications

**Priority:** P1 — High

**Description:** Multi-channel, timely communication to users.

**Acceptance Criteria:**
- [ ] Push notifications: booking confirmed, reminder (24h, 2h before), cancelled, modified, promotional
- [ ] Email: confirmations, receipts, marketing (opt-in), account security
- [ ] SMS: booking confirmations, urgent updates, 2FA
- [ ] In-app notification center with read/unread status
- [ ] Preference management: channel and frequency per notification type
- [ ] Quiet hours respect (default 22:00-08:00, user configurable)
- [ ] Notification templates editable by admin (localization support)
- [ ] Delivery tracking and retry logic for failed sends
- [ ] Rich push with deep links to relevant app screens

---

### 3.16 Provider / Business Owner Portal

**Priority:** P0 — Critical

**Description:** Web-based dashboard for business operations management.

**Acceptance Criteria:**
- [ ] Authentication separate from customer app (unified account, different entry)
- [ ] Dashboard: today's bookings, revenue, new customers, occupancy rate
- [ ] Calendar management: drag-and-drop scheduling, recurring patterns
- [ ] Service management: CRUD services, pricing, duration, staff associations
- [ ] Staff management: profiles, schedules, permissions (admin/staff levels)
- [ ] Customer database: profiles, visit history, notes, marketing consent
- [ ] Settings: business hours, cancellation policy, payment preferences
- [ ] Reports: revenue, bookings by service/staff, customer retention, no-show rate
- [ ] Export data (CSV/Excel)
- [ ] Multi-location support for chains
- [ ] Mobile-responsive for on-the-go management

---

### 3.17 Admin Dashboard

**Priority:** P2 — Medium

**Description:** Platform administration and oversight tools.

**Acceptance Criteria:**
- [ ] User management: search, view, suspend, impersonate (with audit log)
- [ ] Business verification: review submitted documents, approve/reject with notes
- [ ] Content moderation: review flagged reviews/photos, take action
- [ ] Category management: add, edit, reorder, deactivate
- [ ] Promotions and campaigns: create, target, schedule, track
- [ ] Analytics: MAU, bookings, GMV, churn, top categories, geographic heatmap
- [ ] Support tools: view customer/business conversations, issue refunds
- [ ] System health: job queues, error rates, API performance
- [ ] Role-based access control (super admin, support, finance, marketing)

---

### 3.18 Background Jobs (BullMQ)

**Priority:** P0 — Critical (infrastructure)

**Description:** Reliable, scalable asynchronous job processing.

**Acceptance Criteria:**
- [ ] Job types and scheduling:
  - Slot generation: nightly for next 60 days
  - Notification delivery: immediate and scheduled (reminders)
  - Email campaigns: batched per campaign schedule
  - Report generation: daily/weekly/monthly, emailed to recipients
  - Data cleanup: anonymize deleted accounts after 30-day grace
  - Search index updates: on business/service changes
  - Payment reconciliation: hourly with Stripe
- [ ] Retry policy: 3 attempts with exponential backoff, dead letter queue after failure
- [ ] Job prioritization: critical (payments), high (notifications), normal (reports), low (analytics)
- [ ] Monitoring: queue depth, processing rate, failure rate, job duration
- [ ] Stalling detection and recovery
- [ ] Rate limiting for external APIs (SMS, email providers)

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | App cold start <2s; page loads <1s; API response <200ms (p95) |
| Scalability | Support 10,000 concurrent users, 1M bookings/month initially |
| Security | OWASP Top 10 mitigation, penetration testing quarterly |
| Compliance | GDPR, CCPA, PCI DSS (via Stripe) |
| Reliability | 99.9% uptime SLA; database backups every 4 hours |
| Localization | FR, EN, ES, DE at launch; extensible architecture |

---

## 5. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Guest Browse, Search, Business Detail, Booking, Appointments, Slot Engine, Business Owner Portal | Month 1-2 |
| V1.1 | Map Search, Favorites, Reviews, Notifications, Payments | Month 3 |
| V1.2 | Admin Dashboard, Background Jobs, Analytics, Promotions | Month 4 |
| V2.0 | Loyalty Program, Subscriptions, AI Recommendations | Month 6+ |

---

## 6. Success Metrics

| Metric | Target |
|--------|--------|
- Monthly Active Users (MAU) | 50K by month 6 |
- Booking Conversion Rate | >15% of searchers to bookers |
- Guest to Registered Conversion | >30% |
- Business Owner Retention | >80% monthly |
- Customer NPS | >50 |
- App Store Rating | >4.5 stars |
- Average Booking Time | <3 minutes |

---

*Document Version: 1.0*
*Last Updated: 2024*
*Owner: Alex, Product Owner*