# Planity Clone — Product Specification

## 1. Overview

**Product Name:** Planity Clone  
**Version:** 1.0.0  
**Date:** 2024-01-15  
**Author:** Alex — Product Owner  

Planity Clone is a comprehensive appointment booking platform connecting customers with local service businesses (salons, barbershops, spas, clinics, etc.). The platform enables users to discover businesses, view services, check real-time availability, and book appointments seamlessly.

---

## 2. Personas

| Persona | Description | Goals |
|---------|-------------|-------|
| **Customer** | End-user seeking to book appointments | Find, compare, and book services quickly |
| **Business Owner** | Manages a service business | Accept bookings, manage schedule, grow business |
| **Staff Member** | Employee performing services | View schedule, manage availability |
| **Admin** | Platform administrator | Monitor platform, support users, ensure quality |

---

## 3. Feature Specifications

---

### 3.1 User Authentication

**Priority:** P0 (Critical)  
**Owner:** Backend / Mobile Team

#### Description
Secure authentication system enabling customers and business owners to create accounts, log in, and manage their sessions across devices.

#### User Stories
- As a customer, I want to create an account so I can book appointments and manage my bookings.
- As a returning user, I want to log in quickly so I can access my account.
- As a user, I want to reset my password if I forget it.

#### Acceptance Criteria
- [ ] Users can register with email/password or social login (Google, Apple)
- [ ] Passwords must be at least 8 characters with 1 uppercase, 1 number, 1 special character
- [ ] Email verification required before first booking
- [ ] JWT tokens with refresh token rotation
- [ ] Session timeout after 30 days of inactivity
- [ ] Rate limiting: 5 failed login attempts triggers 15-minute lockout
- [ ] OAuth 2.0 integration for social providers
- [ ] Phone number verification optional but recommended

#### API Endpoints
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/verify-email`
- `POST /auth/resend-verification`

---

### 3.2 Guest Browse & Explore

**Priority:** P0 (Critical)  
**Owner:** Mobile / Web Frontend

#### Description
Allow unauthenticated users to browse businesses, view services, and explore the platform without creating an account. Prompt for authentication only at booking time.

#### User Stories
- As a guest, I want to browse nearby businesses without creating an account.
- As a guest, I want to view business details and services before committing.
- As a guest, I want to be prompted to log in only when I try to book.

#### Acceptance Criteria
- [ ] Guest users can access search, discovery, and business detail screens
- [ ] Guest users can view business photos, services, prices, and reviews
- [ ] "Book Now" CTA triggers authentication modal with option to continue as guest (email capture)
- [ ] Guest booking requires email and phone number; account auto-created post-booking
- [ ] Guest session persisted via local storage with 7-day expiry
- [ ] Guest favorites stored locally; merge with account upon registration

---

### 3.3 Business Search & Discovery

**Priority:** P0 (Critical)  
**Owner:** Backend / Search Team

#### Description
Powerful search and discovery engine enabling users to find businesses by name, service, location, availability, and ratings.

#### User Stories
- As a customer, I want to search for "haircut near me" and see relevant results.
- As a customer, I want to filter by price, rating, distance, and availability.
- As a customer, I want to see trending and recommended businesses.

#### Acceptance Criteria
- [ ] Full-text search across business name, service names, and descriptions
- [ ] Autocomplete with typo tolerance (fuzzy matching, Levenshtein distance ≤ 2)
- [ ] Filters: distance (1-50km), price range, rating (1-5 stars), availability (today, this week), category, amenities
- [ ] Sort options: relevance, distance, rating, price (low to high), most reviewed
- [ ] Search results return within 500ms (p95)
- [ ] Pagination: 20 results per page, cursor-based
- [ ] Elasticsearch or PostgreSQL full-text search with trigram indexes
- [ ] Search analytics logged for personalization

#### API Endpoints
- `GET /businesses/search?q={query}&lat={lat}&lng={lng}&filters={filters}&sort={sort}&page={page}`
- `GET /businesses/autocomplete?q={query}`
- `GET /businesses/trending?lat={lat}&lng={lng}`
- `GET /businesses/recommended?lat={lat}&lng={lng}`

---

### 3.4 Map-based Search

**Priority:** P0 (Critical)  
**Owner:** Mobile / Web Frontend

#### Description
Interactive map view showing business locations with clustering, allowing users to visually explore options in their area.

#### User Stories
- As a customer, I want to see businesses on a map to choose by location.
- As a customer, I want to tap a map pin to see quick business info.

#### Acceptance Criteria
- [ ] Interactive map using Mapbox or Google Maps
- [ ] Marker clustering for dense areas (cluster breaks at zoom level 12, 14, 16)
- [ ] Custom business category icons (scissors, spa, medical, etc.)
- [ ] Tap marker shows bottom sheet with: name, rating, photo, starting price, next availability
- [ ] Map bounds query fetches businesses within visible area
- [ ] User location dot with accuracy radius
- [ ] "Recenter to my location" button
- [ ] Dark/light mode map styles matching app theme

---

### 3.5 Business Detail View

**Priority:** P0 (Critical)  
**Owner:** Mobile / Web Frontend

#### Description
Comprehensive business profile page showcasing all information needed for a booking decision.

#### User Stories
- As a customer, I want to see photos, services, prices, and reviews before booking.
- As a customer, I want to know the business hours and location details.

#### Acceptance Criteria
- [ ] Hero image carousel (up to 10 images), video support
- [ ] Business name, verified badge, category, rating, review count
- [ ] "About" section with description, amenities, languages spoken
- [ ] Services list with: name, duration, price, description, online booking availability
- [ ] Staff profiles with photos, bios, specialties
- [ ] Business hours with "Open Now" indicator
- [ ] Address with directions link (deep link to maps app)
- [ ] Phone number with tap-to-call
- [ ] Social media links
- [ ] Share business (deep link / QR code)
- [ ] Report business button

#### API Endpoints
- `GET /businesses/:id`
- `GET /businesses/:id/services`
- `GET /businesses/:id/staff`
- `GET /businesses/:id/reviews`
- `GET /businesses/:id/availability`

---

### 3.6 Service Categories

**Priority:** P0 (Critical)  
**Owner:** Backend / Content Team

#### Description
Hierarchical category system organizing services into browsable and searchable taxonomies.

#### Acceptance Criteria
- [ ] Top-level categories: Hair, Beauty, Wellness, Health, Fitness, Other
- [ ] Sub-categories (2 levels deep): e.g., Hair > Cut, Color, Styling, Treatment
- [ ] Category icons and cover images
- [ ] Category-based discovery: "Trending in Hair"
- [ ] Businesses can assign multiple categories
- [ ] Category admin: create, edit, merge, deprecate with migration path
- [ ] Category popularity metrics for ranking

---

### 3.7 Booking Flow

**Priority:** P0 (Critical)  
**Owner:** Full Stack — Core Feature

#### Description
Seamless multi-step booking flow allowing customers to select service, provider, date/time, and complete reservation.

#### User Stories
- As a customer, I want to book an appointment in under 60 seconds.
- As a customer, I want to see real-time availability to pick a convenient slot.
- As a customer, I want to add notes or preferences to my booking.

#### Acceptance Criteria — Step by Step

**Step 1: Service Selection**
- [ ] Display services with price, duration, description
- [ ] Multi-service booking support (up to 3 services)
- [ ] Service duration auto-calculates total time

**Step 2: Provider Selection**
- [ ] "Any available" or specific staff member
- [ ] Show staff availability calendar preview

**Step 3: Date & Time Selection**
- [ ] Calendar view with availability indicators
- [ ] Time slots in 15-minute increments
- [ ] Show next 7 days, expandable to 60 days
- [ ] Real-time slot availability (no stale data > 30 seconds)

**Step 4: Confirmation**
- [ ] Booking summary with all details
- [ ] Add notes (max 500 characters)
- [ ] Cancellation policy display
- [ ] Payment method selection (if applicable)

**Step 5: Booking Confirmation**
- [ ] Success screen with booking reference, add to calendar
- [ ] Share booking details
- [ ] Directions to business

#### Business Rules
- [ ] Minimum booking notice: 2 hours (configurable per business)
- [ ] Maximum advance booking: 90 days
- [ ] Buffer time between appointments: 0-30 minutes (configurable)
- [ ] Slot holds: 10-minute temporary hold during booking flow

#### API Endpoints
- `POST /bookings` — create booking
- `POST /bookings/hold` — hold slot
- `DELETE /bookings/hold/:id` — release hold
- `GET /availability` — get available slots

---

### 3.8 Appointment Management

**Priority:** P0 (Critical)  
**Owner:** Full Stack

#### Description
Comprehensive appointment lifecycle management for customers and business owners.

#### Customer Acceptance Criteria
- [ ] View upcoming and past appointments
- [ ] Reschedule up to 2 hours before (configurable)
- [ ] Cancel with reason selection; apply cancellation policy
- [ ] Rebook favorite appointments
- [ ] Add to native calendar (iOS/Android)

#### Business Owner Acceptance Criteria
- [ ] Calendar view: day, week, month
- [ ] Accept/decline pending bookings (if approval required)
- [ ] Block time slots (breaks, unavailability)
- [ ] Mark no-show
- [ ] Add walk-in appointments
- [ ] View customer history and notes
- [ ] Bulk actions on appointments

#### API Endpoints
- `GET /bookings` (customer and business variants)
- `PATCH /bookings/:id` — reschedule
- `DELETE /bookings/:id` — cancel
- `POST /bookings/:id/no-show`
- `POST /availability/block` — block slots

---

### 3.9 Favorites

**Priority:** P1 (High)  
**Owner:** Mobile / Backend

#### Description
Allow users to save favorite businesses for quick access and rebooking.

#### Acceptance Criteria
- [ ] Heart icon on business cards and detail view
- [ ] Favorites tab in user profile
- [ ] Push notification when favorite business has promotion or new availability
- [ ] Sync favorites across devices
- [ ] Maximum 500 favorites per user
- [ ] Guest favorites stored locally, prompt to register to persist

---

### 3.10 User Profile

**Priority:** P1 (High)  
**Owner:** Full Stack

#### Description
User account management with personal information, preferences, and history.

#### Acceptance Criteria
- [ ] Profile photo upload (max 5MB, JPG/PNG)
- [ ] Name, email, phone, birthday (optional for birthday offers)
- [ ] Preferred language and notification settings
- [ ] Saved payment methods (PCI-compliant tokenization)
- [ ] Booking history with reorder/rebook
- [ ] Loyalty points / rewards balance (if applicable)
- [ ] Data export (GDPR compliance)
- [ ] Account deletion with 30-day grace period

#### API Endpoints
- `GET /users/me`
- `PATCH /users/me`
- `DELETE /users/me`
- `GET /users/me/bookings`
- `GET /users/me/favorites`

---

### 3.11 Availability & Slot Computation

**Priority:** P0 (Critical)  
**Owner:** Backend — Core Algorithm

#### Description
Real-time availability engine computing bookable slots based on business hours, staff schedules, existing bookings, buffers, and rules.

#### Acceptance Criteria
- [ ] Compute slots for single or multiple staff members
- [ ] Respect business hours, staff working hours, breaks
- [ ] Account for service duration, buffer times, setup/cleanup
- [ ] Handle recurring schedules and one-off exceptions
- [ ] Support split shifts (e.g., 9-12, 14-18)
- [ ] Real-time updates when bookings are made/cancelled
- [ ] Cache computed slots with 30-second TTL
- [ ] Precompute next 7 days nightly; on-demand beyond
- [ ] Handle timezone correctly (business timezone, user timezone display)

#### Algorithm Requirements
- [ ] Time complexity: O(n) where n = number of existing appointments
- [ ] Support concurrent slot queries (1000 QPS target)
- [ ] BullMQ job queue for heavy recomputation

#### API Endpoints
- `GET /availability?businessId={id}&staffId={id}&serviceIds={ids}&dateFrom={date}&dateTo={date}`

---

### 3.12 Shared Types & Design System

**Priority:** P0 (Critical)  
**Owner:** Design / Frontend Lead

#### Description
Consistent design language and reusable components across all platforms.

#### Acceptance Criteria
- [ ] Color palette: primary, secondary, semantic (success, warning, error, info)
- [ ] Typography: heading sizes, body text, captions with accessibility compliance (WCAG 2.1 AA)
- [ ] Spacing system: 4px base grid
- [ ] Component library: buttons, inputs, cards, modals, bottom sheets, lists, avatars, badges, skeleton loaders
- [ ] Animation standards: 200ms default, ease-in-out
- [ ] Dark mode support
- [ ] Accessibility: minimum touch target 44x44dp, screen reader labels, focus indicators
- [ ] Shared TypeScript types package (`@planity-clone/types`)
- [ ] Storybook documentation for all components

---

### 3.13 Reviews & Ratings

**Priority:** P1 (High)  
**Owner:** Full Stack

#### Description
Customer feedback system for businesses with moderation and response capabilities.

#### Acceptance Criteria
- [ ] 5-star rating with optional text review (10-2000 characters)
- [ ] Review eligibility: only post-appointment customers
- [ ] Review window: 7 days after appointment
- [ ] Business owner can respond publicly
- [ ] Flag inappropriate reviews for admin moderation
- [ ] Review helpfulness voting
- [ ] Average rating and distribution displayed on business
- [ ] Photo attachments (up to 5 images)
- [ ] Moderation queue for reviews with reported content

#### API Endpoints
- `POST /reviews`
- `GET /businesses/:id/reviews`
- `POST /reviews/:id/response` (business owner)
- `POST /reviews/:id/report`
- `POST /reviews/:id/helpful`

---

### 3.14 Payment Integration

**Priority:** P0 (Critical)  
**Owner:** Backend / Payment Team

#### Description
Secure payment processing for appointment deposits, full payments, and in-app purchases.

#### Acceptance Criteria
- [ ] Stripe integration for card payments
- [ ] Payment methods: credit/debit, Apple Pay, Google Pay
- [ ] Payment types: full payment, deposit (percentage or fixed), no payment
- [ ] Configurable per business
- [ ] Automatic refunds per cancellation policy
- [ ] Payment confirmation email/receipt
- [ ] PCI compliance — no raw card data stored
- [ ] Webhook handling for payment status updates
- [ ] Failed payment retry with notification
- [ ] Payout to business owners (weekly/monthly)

#### API Endpoints (from existing DTOs)
- `POST /payments/intent` — create payment intent
- `POST /payments/confirm` — confirm payment
- `POST /payments/refund` — process refund
- `POST /payments/methods` — save payment method
- `GET /payments/methods` — list saved methods
- `DELETE /payments/methods/:id` — remove method

---

### 3.15 Notifications

**Priority:** P1 (High)  
**Owner:** Backend / Mobile Team

#### Description
Multi-channel notification system keeping users informed of booking events and promotions.

#### Acceptance Criteria
- [ ] Push notifications (Firebase Cloud Messaging / OneSignal)
- [ ] Email notifications (SendGrid / AWS SES)
- [ ] SMS for critical alerts (Twilio)
- [ ] In-app notification center

#### Notification Triggers
| Event | Customer | Business |
|-------|----------|----------|
| Booking confirmed | Push + Email | Push + Email |
| Booking reminder (24h, 2h) | Push + SMS | — |
| Booking cancelled | Push + Email | Push + Email |
| Booking rescheduled | Push + Email | Push + Email |
| Review received | — | Push + Email |
| Promotion from favorite | Push | — |
| Payment failed | Push + Email | — |
| New message | Push | Push |

- [ ] User preference controls for each channel
- [ ] Quiet hours: no push notifications 22:00-08:00
- [ ] Notification analytics: delivery, open, click rates

---

### 3.16 Provider / Business Owner Portal

**Priority:** P0 (Critical)  
**Owner:** Full Stack — Web Application

#### Description
Dedicated web application for business owners to manage their presence, services, staff, and appointments.

#### Acceptance Criteria

**Dashboard**
- [ ] KPI cards: today's bookings, revenue, new customers, no-show rate
- [ ] Weekly booking trend chart
- [ ] Upcoming appointments list
- [ ] Action items: pending reviews, low inventory alerts

**Business Profile Management**
- [ ] Edit business details, photos, description
- [ ] Manage business hours and exceptions (holidays)
- [ ] Service catalog: add, edit, archive services
- [ ] Staff management: add members, set permissions, manage schedules

**Appointment Calendar**
- [ ] Full-featured calendar (see 3.8)
- [ ] Color-coded by status: confirmed, pending, completed, cancelled, no-show

**Customer Management**
- [ ] Customer database with booking history
- [ ] Notes and tags per customer
- [ ] Marketing: send promotions to segments

**Settings**
- [ ] Booking rules (notice period, cancellation policy)
- [ ] Payment settings
- [ ] Notification preferences
- [ ] Integrations (Google Calendar sync, POS)

---

### 3.17 Admin Dashboard

**Priority:** P1 (High)  
**Owner:** Full Stack — Internal Tool

#### Description
Internal tool for platform administrators to manage users, businesses, content, and monitor platform health.

#### Acceptance Criteria

**User Management**
- [ ] Search, filter, view all customer and business accounts
- [ ] Suspend/activate accounts
- [ ] Impersonate user for support
- [ ] View user activity log

**Business Management**
- [ ] Approve new business registrations
- [ ] Verify business documents (KYC)
- [ ] Feature/unfeature businesses
- [ ] Manage business categories

**Content Moderation**
- [ ] Review queue for reported reviews and business listings
- [ ] Approve/reject with reason
- [ ] Bulk moderation actions

**Analytics**
- [ ] Platform metrics: MAU, bookings, GMV, conversion funnel
- [ ] Business health metrics
- [ ] Revenue and commission reports

**System**
- [ ] Monitor background job queues
- [ ] View error logs and alerts
- [ ] Configuration management

---

### 3.18 Background Jobs (BullMQ)

**Priority:** P0 (Critical)  
**Owner:** Backend — Infrastructure

#### Description
Robust job queue system for asynchronous processing using BullMQ with Redis.

#### Job Definitions

| Job | Priority | Schedule | Description |
|-----|----------|----------|-------------|
| `send-notification` | High | Immediate | Dispatch push/email/SMS |
| `process-payment` | High | Immediate | Handle Stripe webhooks, retries |
| `compute-availability` | High | On-demand / Scheduled | Precompute slot availability |
| `booking-reminder` | Medium | Scheduled (24h, 2h before) | Send reminder notifications |
| `sync-calendar` | Medium | Immediate | Google Calendar two-way sync |
| `generate-reports` | Low | Daily at 06:00 | Business and admin reports |
| `cleanup-expired-holds` | Low | Every 5 minutes | Release expired slot holds |
| `archive-old-data` | Low | Monthly | Archive bookings > 2 years |
| `send-marketing-emails` | Low | Weekly | Promotional campaigns |

#### Acceptance Criteria
- [ ] Redis-backed BullMQ with separate queues by priority
- [ ] Job retry with exponential backoff (max 5 attempts)
- [ ] Dead letter queue for failed jobs
- [ ] Job progress tracking and cancellation
- [ ] Dashboard for monitoring queue depth, processing times, failures
- [ ] Graceful shutdown: finish in-progress jobs before stopping
- [ ] Concurrency limits per queue type
- [ ] Job idempotency keys to prevent duplicates

---

## 4. Non-Functional Requirements

### Performance
- API response time: p95 < 200ms for cached, < 500ms for computed
- App launch time: < 3 seconds
- Image loading: progressive loading, WebP format

### Security
- OWASP Top 10 compliance
- Rate limiting on all public endpoints
- Input validation and sanitization
- SQL injection prevention (Prisma parameterized queries)
- XSS protection
- CSRF tokens for web

### Scalability
- Horizontal scaling with load balancers
- Database read replicas for search queries
- CDN for static assets and images
- Caching strategy: Redis for sessions, availability, popular queries

### Compliance
- GDPR: data portability, right to erasure, consent management
- CCPA: consumer rights
- PCI-DSS Level 1 for payment processing

---

## 5. Success Metrics (KPIs)

| Metric | Target |
|--------|--------|
| Monthly Active Users (MAU) | 100K by month 6 |
| Booking Conversion Rate | > 15% of app opens |
| Search-to-Book Time | < 3 minutes median |
| Business Onboarding | < 48 hours from signup to first booking |
| App Store Rating | > 4.5 stars |
| Customer Support Tickets | < 2% of bookings |
| Payment Success Rate | > 98% |
| Notification Delivery Rate | > 99% |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Guest Browse, Search, Business Detail, Booking Flow, Availability, Basic Profile, Business Owner Portal | Month 1-2 |
| **V1.1** | Map Search, Favorites, Reviews, Notifications, Payment | Month 3 |
| **V1.2** | Admin Dashboard, Advanced Analytics, Marketing Tools | Month 4 |
| **V1.3** | Loyalty Program, Referrals, AI Recommendations | Month 5-6 |

---

## 7. Open Questions

1. Internationalization scope for MVP (start with FR/EN/DE/ES?)
2. Commission model: percentage per booking or SaaS subscription for businesses?
3. Insurance/liability coverage for bookings
4. White-label option for enterprise chains

---

*Document Version: 1.0.0*  
*Last Updated: 2024-01-15*  
*Next Review: 2024-02-01*
