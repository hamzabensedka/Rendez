# Planity Clone — Product Specification

## 1. Overview

**Product:** Planity Clone  
**Type:** Mobile-first appointment booking platform connecting customers with local service businesses (salons, barbershops, spas, clinics).  
**Target Users:** Consumers seeking beauty & wellness services; Business owners managing appointments; Platform administrators.  
**Platforms:** iOS, Android, Web (responsive), Provider Portal (web), Admin Dashboard (web).  

## 2. Goals & Success Metrics

| Goal | Metric |
|------|--------|
| Enable seamless appointment booking | Booking conversion rate > 15% |
| Reduce no-shows | Cancellation rate < 10% |
| Business owner efficiency | Average booking management time < 2 min |
| Platform growth | Monthly active users (MAU) growth 20% MoM |
| User satisfaction | App store rating > 4.5, NPS > 50 |

## 3. Feature Specifications

---

### 3.1 User Authentication
**Priority:** P0 — Critical  
**Owner:** Product / Engineering  

#### Description
Secure, frictionless authentication enabling users to create accounts, log in, and manage sessions across devices. Support both customer and business owner flows.

#### User Stories
- As a new customer, I want to sign up with my phone number or email so I can book appointments.
- As a returning user, I want to log in quickly with biometrics or a magic link so I don't need to remember passwords.
- As a business owner, I want to register my business and create an admin account during onboarding.

#### Acceptance Criteria
- [ ] Users can sign up via email/password, phone/SMS OTP, or OAuth (Google, Apple, Facebook)
- [ ] Passwords must be minimum 8 characters with 1 uppercase, 1 number, 1 special character
- [ ] JWT access tokens expire in 15 minutes; refresh tokens valid for 7 days
- [ ] Biometric login (Face ID / Touch ID / Fingerprint) available on supported devices
- [ ] Magic link login sent via email expires in 15 minutes
- [ ] Rate limiting: max 5 login attempts per 15 minutes per IP
- [ ] Account lockout after 5 failed attempts, unlock via email/SMS
- [ ] Users can log out from all devices
- [ ] Business owner onboarding triggers separate KYC flow

#### Technical Notes
- Use Firebase Auth or Auth0 for OAuth; custom JWT for session management
- Store refresh tokens in httpOnly cookies (web) or secure storage (mobile)
- Implement `AuthGuard` middleware for protected routes

---

### 3.2 Guest Browse & Explore
**Priority:** P0 — Critical  

#### Description
Allow unauthenticated users to browse businesses, view services, and explore the platform before committing to registration. Conversion funnel starts here.

#### User Stories
- As a guest, I want to see nearby businesses without creating an account so I can evaluate the platform.
- As a guest, I want to view business details and service prices so I can make informed decisions.

#### Acceptance Criteria
- [ ] Guest users can access home screen, search, and business listings
- [ ] Guest users can view business profiles, services, reviews, and availability (read-only)
- [ ] Booking action triggers authentication modal with option to continue as guest (email/phone capture)
- [ ] Guest checkout captures minimal info: name, phone, email; auto-creates account post-booking
- [ ] Guest session data (favorites, search filters) persists for 24 hours via local storage
- [ ] Prompt to create account appears after 3rd business view or 2nd search

---

### 3.3 Business Search & Discovery
**Priority:** P0 — Critical  

#### Description
Powerful search and filtering to help users find the right business based on location, service, price, rating, and availability.

#### User Stories
- As a customer, I want to search by business name, service type, or location so I can find relevant providers quickly.
- As a customer, I want to filter by price range, rating, distance, and availability so I can narrow results.

#### Acceptance Criteria
- [ ] Full-text search across business name, service names, and descriptions
- [ ] Autocomplete suggestions with typo tolerance (fuzzy matching, Levenshtein distance ≤ 2)
- [ ] Filters: distance (0.5km–50km), price range, rating (1–5 stars), category, availability (today, this week, specific date)
- [ ] Sort options: relevance, distance, rating (highest), price (low to high), most reviewed
- [ ] Search results display: business photo, name, rating, distance, starting price, next available slot
- [ ] Recent searches and trending searches persisted locally
- [ ] Search query debounced at 300ms; results load in < 500ms (95th percentile)
- [ ] Empty state with suggestions when no results found
- [ ] Pagination: 20 results per page, infinite scroll on mobile

---

### 3.4 Map-based Search
**Priority:** P0 — Critical  

#### Description
Interactive map visualization of businesses with clustering, boundary search, and location-based discovery.

#### User Stories
- As a customer, I want to see businesses on a map so I can choose based on location convenience.
- As a customer, I want to search within a specific area by panning/zooming the map.

#### Acceptance Criteria
- [ ] Map displays business pins with category-based color coding
- [ ] Pin clustering activates at zoom levels < 12; de-clusters on zoom
- [ ] Tap on pin opens bottom sheet with business preview (name, rating, photo, next slot)
- [ ] User location dot with accuracy radius; permission prompt on first use
- [ ] Map bounds query: fetch businesses within visible map area
- [ ] "Search this area" button appears after map pan; triggers re-query
- [ ] Default map view: 5km radius around user location or search center
- [ ] Support satellite and standard map tiles
- [ ] Accessibility: screen reader announces business count in viewport

---

### 3.5 Business Detail View
**Priority:** P0 — Critical  

#### Description
Comprehensive business profile page with all information needed to make a booking decision.

#### User Stories
- As a customer, I want to see photos, services, prices, and reviews so I can evaluate a business.
- As a customer, I want to see real-time availability so I know when I can book.

#### Acceptance Criteria
- [ ] Hero image carousel (up to 10 images), video support (max 30s)
- [ ] Business info: name, verified badge, address, phone, website link, hours (today + full week)
- [ ] Services list: name, duration, description, price, category badge
- [ ] Staff list with photos, bios, and individual ratings
- [ ] Reviews section: average rating, total count, rating distribution histogram, sort (newest, highest, lowest)
- [ ] "Book Now" CTA sticky at bottom; scrolls with page
- [ ] Share business via native share sheet (deep link)
- [ ] Report business option (inappropriate content, fake listing)
- [ ] Load time < 2s for full page (3G simulation)

---

### 3.6 Service Categories
**Priority:** P0 — Critical  

#### Description
Hierarchical categorization of services for discovery and business organization.

#### User Stories
- As a customer, I want to browse by category (hair, nails, massage) so I can discover new businesses.
- As a business owner, I want to assign categories to my services so customers can find me.

#### Acceptance Criteria
- [ ] Category hierarchy: 8–10 top-level categories, 3–5 subcategories each
- [ ] Top-level: Hair, Nails, Face & Skin, Massage, Body, Makeup, Barbershop, Medical Aesthetic, Tattoo & Piercing, Wellness
- [ ] Category icons and color coding consistent across app
- [ ] Business can assign multiple categories; primary category determines search ranking weight
- [ ] Category trending: show popular categories based on seasonality and location
- [ ] Admin can CRUD categories; changes reflect in-app within 5 minutes (cache invalidation)

---

### 3.7 Booking Flow
**Priority:** P0 — Critical  

#### Description
Streamlined multi-step booking process minimizing friction and abandonment.

#### User Stories
- As a customer, I want to book an appointment in as few steps as possible so I can secure my slot.
- As a customer, I want to add notes or preferences so the business can prepare.

#### Acceptance Criteria
- [ ] Step 1: Select service(s) — allow multi-service booking with compatibility check
- [ ] Step 2: Select staff (optional "no preference") or auto-assign based on availability
- [ ] Step 3: Select date and time from available slots (see 3.11 for slot computation)
- [ ] Step 4: Review booking details, add notes (max 500 chars), apply promo code
- [ ] Step 5: Confirm booking; payment if required (see 3.14)
- [ ] Booking confirmation screen with: booking reference, QR code, add to calendar, share
- [ ] Abandoned booking recovery: push notification/email after 1 hour if not completed
- [ ] Booking modification allowed up to 2 hours before appointment (configurable per business)
- [ ] Cancellation policy displayed pre-booking; enforce cancellation fees if configured
- [ ] Maximum booking window: 90 days in advance

---

### 3.8 Appointment Management
**Priority:** P0 — Critical  

#### Description
Comprehensive appointment lifecycle management for customers and business owners.

#### User Stories
- As a customer, I want to view, reschedule, or cancel my appointments so I can manage my schedule.
- As a business owner, I want to see all appointments and manage no-shows so I can optimize my calendar.

#### Acceptance Criteria
- [ ] Customer: Upcoming and past appointments list; filter by status (upcoming, completed, cancelled, no-show)
- [ ] Customer: Reschedule with 3-tap flow (select new slot, confirm, done)
- [ ] Customer: Cancel with reason selection; refund policy applied automatically
- [ ] Business owner: Daily/weekly calendar view; drag-and-drop rescheduling
- [ ] Business owner: Mark as completed, no-show, or cancelled with notes
- [ ] Business owner: Block time off (lunch, vacation) directly on calendar
- [ ] Automated status transitions: upcoming → in-progress → completed (based on check-in)
- [ ] Appointment reminders: 24h, 2h, and 15min before via push/SMS (configurable)
- [ ] Waitlist: notify customers if slot opens up due to cancellation

---

### 3.9 Favorites
**Priority:** P1 — High  

#### Description
Allow users to save and organize preferred businesses for quick rebooking.

#### User Stories
- As a customer, I want to favorite businesses so I can quickly rebook with providers I trust.

#### Acceptance Criteria
- [ ] Heart icon on business card and detail view; tap to toggle
- [ ] Favorites list with search and sort (recently added, alphabetical, nearest)
- [ ] Quick rebook from favorites: one-tap to pre-filled booking flow with same service/staff
- [ ] Favorites sync across devices for logged-in users
- [ ] Push notification when favorited business adds new service or promotion
- [ ] Maximum 500 favorites per user (soft limit with upgrade prompt)

---

### 3.10 User Profile
**Priority:** P1 — High  

#### Description
Customer profile management with preferences, history, and settings.

#### User Stories
- As a user, I want to manage my personal info and preferences so my experience is personalized.

#### Acceptance Criteria
- [ ] Profile photo, name, phone, email, date of birth (optional, for birthday promotions)
- [ ] Notification preferences: push, email, SMS — granular per type (bookings, promotions, reminders)
- [ ] Payment methods: view, add, delete, set default (see 3.14)
- [ ] Booking history: full list with search, filter, and rebook option
- [ ] Loyalty points / rewards balance and history (if enabled)
- [ ] Referral code generation and tracking
- [ ] Data export: download all personal data (GDPR compliance)
- [ ] Account deletion: full erasure with 30-day grace period

---

### 3.11 Availability & Slot Computation
**Priority:** P0 — Critical  

#### Description
Real-time, accurate availability computation considering business hours, staff schedules, service durations, buffers, and existing bookings.

#### User Stories
- As a customer, I want to see accurate real-time availability so I can book with confidence.
- As a business owner, I want my availability to update automatically so I don't get double-booked.

#### Acceptance Criteria
- [ ] Compute slots based on: business hours, staff working hours, service duration, inter-service buffer, existing appointments
- [ ] Support recurring schedules and one-off exceptions (holidays, time off)
- [ ] Slot granularity: 15, 30, or 60 minutes (configurable per business)
- [ ] Real-time updates: new booking blocks slot within < 2 seconds across all clients
- [ ] Handle multi-service bookings: sequential slot computation with buffer
- [ ] Overbooking protection: strict enforcement, no negative inventory
- [ ] Performance: slot computation for 30-day view completes in < 200ms
- [ ] Edge cases: daylight saving time transitions, timezone handling for cross-timezone bookings
- [ ] Background job (BullMQ) pre-computes popular time ranges; cache with Redis (TTL 5 minutes)

---

### 3.12 Shared Types & Design System
**Priority:** P1 — High astore  

#### Description
Consistent design language and reusable components across all platforms.

#### Acceptance Criteria
- [ ] Color palette: primary (#6C5CE7), secondary (#00D2D3), semantic colors (success, warning, error, info)
- [ ] Typography: Inter font family, 6 heading levels, body, caption, overline
- [ ] Spacing system: 4px base grid, 12 predefined scale values
- [ ] Component library: buttons, inputs, cards, modals, bottom sheets, date picker, time picker, skeleton loaders
- [ ] Animation standards: 200ms ease-in-out for micro-interactions, 300ms for page transitions
- [ ] Dark mode support with automatic system preference detection
- [ ] Accessibility: WCAG 2.1 AA minimum; minimum touch target 44x44dp
- [ ] Shared TypeScript types package consumed by frontend, backend, and mobile
- [ ] Storybook documentation for all components

---

### 3.13 Reviews & Ratings
**Priority:** P1 — High  

#### Description
Social proof system for businesses with verified reviews and moderation.

#### User Stories
- As a customer, I want to read honest reviews so I can choose quality businesses.
- As a customer, I want to leave feedback after my appointment to help others.

#### Acceptance Criteria
- [ ] 5-star rating system with optional text review (min 10, max 2000 chars)
- [ ] Verified badge: only post-appointment customers can review (within 14 days)
- [ ] Review categories: service quality, staff professionalism, ambiance, value for money
- [ ] Business owner can respond to reviews publicly
- [ ] Flag and report reviews; admin moderation queue
- [ ] Review helpfulness voting (thumbs up/down)
- [ ] Sort and filter reviews: newest, highest, lowest, verified only, with photos
- [ ] Photo/video attachments (max 5 photos, 1 video per review)
- [ ] Aggregate rating recalculated in real-time; cached with 5-minute TTL

---

### 3.14 Payment Integration
**Priority:** P0 — Critical  

#### Description
Secure, flexible payment processing supporting multiple methods and business models.

#### User Stories
- As a customer, I want to pay securely in-app so I don't need cash.
- As a business owner, I want to receive payouts and manage refunds easily.

#### Acceptance Criteria
- [ ] Payment methods: credit/debit cards (Stripe), Apple Pay, Google Pay, PayPal
- [ ] Support full prepayment, deposit, and pay-at-venue models
- [ ] Save payment methods for one-tap checkout; PCI compliance via tokenization
- [ ] Promo codes and gift cards support
- [ ] Automatic receipts emailed post-payment
- [ ] Business owner: payout dashboard, payout schedule (daily, weekly, monthly)
- [ ] Refund processing: full and partial with reason tracking
- [ ] Failed payment handling: retry logic, customer notification, booking hold for 15 minutes
- [ ] Currency support: EUR, USD, GBP with localization
- [ ] Transaction fees: transparent display to customer; configurable split to platform

---

### 3.15 Notifications
**Priority:** P1 — High  

#### Description
Multi-channel notification system keeping users informed at the right time.

#### Acceptance Criteria
- [ ] Channels: push (Firebase Cloud Messaging), email (SendGrid), SMS (Twilio), in-app inbox
- [ ] Notification types: booking confirmations, reminders, cancellations, promotions, system alerts
- [ ] User preference controls per channel and type
- [ ] Rich push: images, action buttons (confirm, reschedule, cancel)
- [ ] Notification scheduling: respect quiet hours (22:00–08:00 local time)
- [ ] Delivery tracking: opened, clicked, failed with retry logic
- [ ] In-app notification center with unread badge
- [ ] Bulk campaign creation for business owners (promotional notifications)

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0 — Critical  

#### Description
Web-based dashboard for business owners to manage their presence, schedule, and operations.

#### User Stories
- As a business owner, I want to manage my calendar and staff so I can run my business efficiently.
- As a business owner, I want to see analytics so I can grow my revenue.

#### Acceptance Criteria
- [ ] Dashboard: today's appointments, revenue snapshot, new reviews, upcoming week overview
- [ ] Calendar: day/week/month views; drag-and-drop appointment management
- [ ] Staff management: add staff, set schedules, assign services, manage permissions
- [ ] Service management: CRUD services, pricing, duration, buffers, categories
- [ ] Customer database: view history, notes, contact info; export to CSV
- [ ] Analytics: bookings, revenue, cancellation rate, no-show rate, peak hours, customer retention
- [ ] Marketing tools: promo code creation, notification campaigns
- [ ] Settings: business hours, cancellation policy, payment methods, integrations
- [ ] Multi-location support for chains

---

### 3.17 Admin Dashboard
**Priority:** P2 — Medium  

#### Description
Platform administration for user management, content moderation, and business operations.

#### Acceptance Criteria
- [ ] User management: search, view, suspend, impersonate users
- [ ] Business verification: review submitted documents, approve/reject with notes
- [ ] Content moderation: review flagged businesses, reviews, photos; take action
- [ ] Financial oversight: transaction monitoring, dispute resolution, payout management
- [ ] Analytics: platform-wide metrics, growth trends, churn analysis
- [ ] System health: API performance, error rates, queue depths
- [ ] Role-based access control (RBAC): super admin, support agent, finance, marketing
- [ ] Audit log: all admin actions with immutable record

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P1 — High  

#### Description
Reliable, scalable background job processing for asynchronous operations.

#### Acceptance Criteria
- [ ] Job types: email sending, SMS sending, push notifications, payment webhooks, report generation, data exports, slot pre-computation, cleanup tasks
- [ ] Queue priorities: critical, high, normal, low
- [ ] Retry policy: exponential backoff, max 5 attempts, dead letter queue after failure
- [ ] Job monitoring: Bull Board dashboard for queue status, job history, failed job inspection
- [ ] Scheduled jobs: cron-based for recurring tasks (daily reports, nightly cleanup)
- [ ] Rate limiting per job type to respect external API limits
- [ ] Job idempotency keys to prevent duplicate processing
- [ ] Horizontal scaling: multiple worker instances with Redis as broker

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | API p95 < 200ms; page load < 2s on 3G |
| Scalability | Support 100k concurrent users; 10M monthly bookings |
| Security | OWASP Top 10 compliance; annual penetration testing |
| Privacy | GDPR, CCPA compliant; data retention policies |
| Reliability | 99.99% uptime SLA; < 0.1% error rate |
| Accessibility | WCAG 2.1 AA; screen reader support |
| Internationalization | i18n framework; initial: EN, FR, ES, DE |

## 5. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Guest Browse, Search, Business Detail, Booking, Appointments, Payments, Provider Portal | Q1 |
| V1.1 | Map Search, Favorites, Reviews, Notifications | Q2 |
| V1.2 | Admin Dashboard, Analytics, Background Jobs optimization | Q3 |
| V2.0 | Loyalty Program, Referrals, AI Recommendations | Q4 |

## 6. Open Questions

1. Geographic launch sequence (France first? Multi-country from start?)
2. Commission structure: percentage per booking vs. subscription SaaS model
3. Insurance/liability coverage for no-shows and disputes
4. Integration with existing salon management software (Salonist, Vagaro)

---

*Document Version: 1.0*  
*Last Updated: 2024*  
 stakeholders: Engineering, Design, QA, Business Operations