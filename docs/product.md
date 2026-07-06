# Planity Clone - Product Specification

## 1. Overview

Planity Clone is a multi-platform appointment booking application connecting customers with beauty, wellness, and service professionals. The platform serves three user types: customers seeking appointments, business owners managing their operations, and administrators overseeing the ecosystem.

**Target Platforms:** iOS, Android, Web (Responsive)
**Monetization:** Commission on bookings, subscription tiers for businesses

---

## 2. User Personas

| Persona | Description | Goals |
|---------|-------------|-------|
| **Customer** | Seeks beauty/wellness services, values convenience and discovery | Book appointments quickly, find quality providers, manage schedule |
| **Guest** | Unregistered user exploring the platform | Browse services, understand offering before committing |
| **Business Owner** | Manages salon/clinic, wants to fill calendar efficiently | Reduce no-shows, attract customers, streamline operations |
| **Admin** | Platform operator ensuring quality and growth | Monitor health, resolve disputes, onboard businesses |

---

## 3. Feature Specifications

---

### 3.1 User Authentication
**Priority:** P0 | **Owner:** Platform Team

#### Description
Secure, frictionless authentication supporting multiple entry points with progressive profiling.

#### Acceptance Criteria
- [ ] Users can register via email/password with validation (8+ chars, 1 uppercase, 1 number)
- [ ] Users can register/login via Google OAuth 2.0 and Apple Sign-In
- [ ] Users can register/login via phone number with SMS OTP verification
- [ ] Password reset flow via email with secure token (24hr expiry)
- [ ] Biometric authentication (Face ID / Touch ID / Fingerprint) for returning sessions
- [ ] JWT access token (15min) + refresh token (7 days) with secure storage
- [ ] Account linking: merge accounts when same email used across methods
- [ ] Rate limiting: max 5 login attempts per 15 minutes
- [ ] Progressive profiling: collect name, phone, birthday post-registration
- [ ] Terms acceptance tracking with version history

#### Technical Notes
- Implement OAuth state parameter to prevent CSRF
- Store refresh tokens hashed in database
- Support account deletion (GDPR compliance)

---

### 3.2 Guest Browse & Explore
**Priority:** P0 | **Owner:** Growth Team

#### Description
Allow unauthenticated users to discover the platform's value before registration.

#### Acceptance Criteria
- [ ] Guest can view business listings with limited fields (no contact info, no exact addresses)
- [ ] Guest can browse service categories and subcategories
- [ ] Guest can search by city/region with approximate results
- [ ] Guest can view business detail with services and prices (no availability, no booking)
- [ ] "Book Now" and "Save" actions trigger registration prompt with pre-filled context
- [ ] Guest session tracked via device ID for 30 days to preserve search context post-registration
- [ ] Max 20 business detail views per guest session before registration required
- [ ] Guest cannot see reviews with author names (ratings aggregate only)

---

### 3.3 Business Search & Discovery
**Priority:** P0 | **Owner:** Core Experience Team

#### Description
Powerful, fast search enabling customers to find ideal service providers.

#### Acceptance Criteria
- [ ] Full-text search across business names, service names, descriptions
- [ ] Autocomplete suggestions within 200ms with typo tolerance (fuzzy matching)
- [ ] Search history: persist last 20 searches, allow clearing
- [ ] Trending searches section updated daily
- [ ] Filter by: service category, price range, rating (4.0+), distance, availability ("open now"), amenities
- [ ] Sort by: relevance, distance, rating, price (low-high), availability (next available)
- [ ] Voice search support (iOS SiriKit, Android Voice Actions)
- [ ] Recent searches sync across devices for authenticated users
- [ ] Empty state with suggested alternatives when no results
- [ ] Search analytics: track queries, zero-result rates, filter usage

---

### 3.4 Map-based Search
**Priority:** P0 | **Owner:** Core Experience Team

#### Description
Visual location discovery with interactive map integration.

#### Acceptance Criteria
- [ ] Map view with business pins clustered at zoom levels (MarkerClusterer)
- [ ] User location request with permission handling (coarse/fine granularity)
- [ ] Default radius: 5km, adjustable 1-50km slider
- [ ] Pin color coding: open (green), closing soon (orange), closed/unavailable (gray)
- [ ] Tap pin shows business card with photo, name, rating, next availability
- [ ] "List view" toggle for accessibility
- [ ] "Re-center to my location" floating action button
- [ ] Address search with geocoding (forward and reverse)
- [ ] Offline: cache last viewed map tiles for 7 days
- [ ] Accessibility: screen reader announces "X businesses found near [location]"

---

### 3.5 Business Detail View
**Priority:** P0 | **Owner:** Core Experience Team

#### Description
Comprehensive business profile driving conversion to booking.

####911.5 Business Detail View
#### Acceptance Criteria
- [ ] Hero image carousel (up to 10 images), video support (30 sec max)
- [ ] Business name, verified badge, overall rating, review count
- [ ] Address with "Get Directions" (deep link to native maps)
- [ ] Operating hours with current day highlighted, "Open Now" status
- [ ] Phone number with tap-to-call (authenticated users only)
- [ ] Service menu with expandable categories, prices, durations
- [ ] Team/staff section with photos, specialties, ratings
- [ ] Instagram feed integration (last 6 posts)
- [ ] COVID-19 safety measures badge
- [ ] "Book Now" CTA sticky at bottom
- [ ] Share business via deep link (universal link / app link)
- [ ] Report inaccurate information flow

---

### 3.6 Service Categories
**Priority:** P0 | **Owner:** Core Experience Team

#### Description
Hierarchical taxonomy for service discovery and business organization.

#### Acceptance Criteria
- [ ] Root categories: Hair, Nails, Face, Body, Massage, Medical Aesthetic, Tattoo, Barber, Spa, Fitness
- [ ] Each category has icon, color, and description
- [ ] Subcategories (2 levels deep): e.g., Hair > Coloring > Balayage
- [ ] Category pages with featured businesses, trending services, educational content
- [ ] Businesses can select up to 5 primary categories
- [ ] Category admin: ability to add, merge, deprecate with redirects
- [ ] SEO-optimized category landing pages on web
- [ ] Category popularity metrics for business owner insights

---

### 3.7 Booking Flow
**Priority:** P0 | **Owner:** Core Experience Team

#### Description
Seamless, trustworthy appointment reservation with minimal friction.

#### Acceptance Criteria
- [ ] Step 1: Select service(s) with optional staff preference or "no preference"
- [ ] Step 2: Calendar view with available slots (respects business timezone)
- [ ] Step 3: Time slot selection with duration confirmation
- [ ] Step 4: Review booking summary with cancellation policy
- [ ] Step 5: Payment method selection (or "Pay at venue" if enabled)
- [ ] Step 6: Confirmation with calendar invite (.ics), add to Apple/Google Calendar
- [ ] Real-time availability: slot disappears if another user completes booking (optimistic locking with 5-min hold)
- [ ] Waitlist option when fully booked
- [ ] Guest booking: collect minimal info (name, phone, email) with option to create account
- [ ] Booking modification: reschedule up to 2 hours before (configurable by business)
- [ ] Booking cancellation with automated refund per policy
- [ ] Booking confirmation SMS and push notification within 30 seconds

---

### 3.8 Appointment Management
**Priority:** P0 | **Owner:** Core Experience Team

#### Description
Central hub for customers to view and manage their appointments.

#### Acceptance Criteria
- [ ] Upcoming appointments tab with chronological list
- [ ] Past appointments tab with rebook action
- [ ] Appointment detail: service, staff, time, location, QR code for check-in
- [ ] Reschedule action with availability lookup
- [ ] Cancel with reason selection (feedback for business)
- [ ] Add to calendar button on each appointment
- [ ] Directions button with pre-filled destination
- [ ] Call business button
- [ ] Upcoming appointment reminder: push + SMS at 24h, 2h, 15min before
- [ ] No-show reporting by business (affects customer reliability score)

---

### 3.9 Favorites
**Priority:** P1 | **Owner:** Engagement Team

#### Acceptance Criteria
- [ ] Heart icon on business cards and detail pages
- [ ] Favorites list with offline access (cached)
- [ ] Favorite businesses sorted by: recently added, upcoming availability, alphabetical
- [ ] Quick rebook from favorites (last service pre-selected)
- [ ] Push notification when favorite business adds new service or promotion
- [ ] Sync favorites across devices
- [ ] Maximum 200 favorites per user (performance guardrail)
- [ ] Share favorites list (public or private link)

---

### 3.10 User Profile
**Priority:** P1 | **Owner:** Core Experience Team

#### Acceptance Criteria
- [ ] Profile photo upload (crop to circle, max 5MB, JPG/PNG)
- [ ] Display name, email, phone, birthday (optional for birthday offers)
- [ ] Notification preferences: push, SMS, email with granular controls
- [ ] Privacy settings: profile visibility, data download, account deletion
- [ ] Payment methods: add, default, delete (PCI-compliant via Stripe)
- [ ] Loyalty points balance and history (if program active)
- [ ] Referral code generation and sharing
- [ ] Language preference (app-wide, default from device)
- [ ] Accessibility preferences: reduce motion, larger text, high contrast
- [ ] Security: active sessions list, revoke any, change password, 2FA enable

---

### 3.11 Availability & Slot Computation
**Priority:** P0 | **Owner:** Platform Team

#### Description
Complex scheduling engine handling diverse business rules and real-time constraints.

#### Acceptance Criteria
- [ ] Business defines: working hours per day, slot duration per service, buffer time between appointments
- [ ] Staff-specific availability (overrides business default)
- [ ] Block time: recurring (lunch) or one-off (vacation, sick)
- [ ] Service combinations: allow/disallow concurrent services, required sequencing
- [ ] Slot computation accounts for: existing bookings, blocks, staff availability, service duration
- [ ] Timezone handling: store in UTC, display in business timezone, detect customer timezone
- [ ] DST transitions handled correctly (no ambiguous slots)
- [ ] Performance: compute 30-day availability in <200ms
- [ ] Cache invalidation on any booking/block change
- [ ] Edge cases: minimum advance notice (e.g., 2 hours), same-day cutoff, future booking window (e.g., 60 days)

---

### 3.12 Shared Types & Design System
**Priority:** P0 | **Owner:** Design System Team

#### Acceptance Criteria
- [ ] Design tokens: colors (primary #FF6B6B, secondary, semantic), typography (font families, sizes, weights), spacing scale, border radius, shadows
- [ ] Component library: buttons, inputs, cards, modals, toasts, loaders, empty states
- [ ] Cross-platform consistency: React Native components mirror web where feasible
- [ ] Dark mode support with automatic/system/manual toggle
- [ ] Accessibility: WCAG 2.1 AA minimum, focus indicators, screen reader labels
- [ ] Animation standards: 200ms default duration, ease-in-out, respect reduce-motion
- [ ] Icon set: custom or Lucide, consistent sizing (16, 20, 24, 32px)
- [ ] Error state patterns: inline, toast, full-page with recovery actions
- [ ] Loading state patterns: skeleton, spinner, progressive image loading
- [ ] Documentation: Storybook for web, equivalent for native

---

### 3.13 Reviews & Ratings
**Priority:** P1 | **Owner:** Trust Team

#### Acceptance Criteria
- [ ] Eligibility: can review after completed appointment (up to 30 days)
- [ ] Rating: 1-5 stars with half-star precision
- [ ] Review text: 10-1000 characters, profanity filter
- [ ] Categories: rate service, staff, ambiance, value separately
- [ ] Photo/video attachment (up to 5, max 10MB each)
- [ ] Business owner response capability
- [ ] Review helpfulness voting
- [ ] Flag inappropriate reviews for moderation
- [ ] Review sorting: most recent, most helpful, highest/lowest rated
- [ ] Aggregate display: overall rating, category breakdown, rating distribution histogram
- [ ] Review fraud detection: same-device reviews, unusual patterns

---

### 3.14 Payment Integration
**Priority:** P0 | **Owner:** Platform Team

#### Acceptance Criteria
- [ ] Stripe integration for card payments (Visa, Mastercard, Amex, Discover)
- [ ] Apple Pay and Google Pay support
- [ ] "Pay at venue" option (business configurable, may require card hold)
- [ ] Deposits: configurable percentage (0-100%) or fixed amount
- [ ] Full prepayment option
- [ ] Refund processing: automatic (policy-based) or manual (admin/business initiated)
- [ ] Receipt generation and email delivery
- [ ] Invoice support for B2B customers
- [ ] Failed payment retry with customer notification
- [ ] PCI compliance: never touch raw card data (Stripe Elements/Checkout)
- [ ] Multi-currency support with display currency preference
- [ ] Commission split: platform fee deducted before business payout

---

### 3.15 Notifications
**Priority:** P1 | **Owner:** Engagement Team

#### Acceptance Criteria
- [ ] Push notifications: booking confirmations, reminders, promotions, business messages
- [ ] SMS: critical only (booking, reminder, cancellation) with opt-out
- [ ] Email: receipts, marketing (configurable), account security
- [ ] In-app notification center with read/unread status
- [ ] Notification preferences per channel and type
- [ ] Rich push: images, action buttons (confirm, reschedule, cancel)
- [ ] Scheduled notifications via BullMQ with retry logic
- [ ] Quiet hours respect (default 22:00-08:00, user configurable)
- [ ] Notification analytics: delivery, open, conversion rates
- [ ] A/B testing framework for notification copy and timing

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0 | **Owner:** Business Team

#### Acceptance Criteria
- [ ] Dashboard: today's appointments, revenue this week, upcoming week preview
- [ ] Calendar view: day/week/month, drag-to-reschedule, block time
- [ ] Appointment management: view details, check-in customer, mark no-show, add notes
- [ ] Service management: CRUD services, set prices, durations, online booking availability
- [ ] Staff management: add team members, set permissions, manage individual schedules
- [ ] Customer database: view history, notes, contact info, booking frequency
- [ ] Analytics: bookings, revenue, no-show rate, popular services, peak hours
- [ ] Settings: business hours, cancellation policy, payment methods accepted, notification preferences
- [ ] Marketing tools: promotion creation, loyalty program configuration
- [ ] Multi-location support for chains
- [ ] Mobile-responsive web portal; native app planned P2

---

### 3.17 Admin Dashboard
**Priority:** P1 | **Owner:** Platform Team

#### Acceptance Criteria
- [ ] User management: search, view, suspend, impersonate (with audit log)
- [ ] Business onboarding: approval workflow, verification document review
- [ ] Content moderation: review flagged reviews, businesses, images
- [ ] Financial overview: GMV, commission revenue, payout management
- [ ] Dispute resolution: customer-business conflicts, refund authority
- [ ] System health: API latency, error rates, queue depths
- [ ] Feature flags: gradual rollout, kill switches
- [ ] Data exports: GDPR requests, business reports
- [ ] Role-based access: super admin, support agent, finance, marketing
- [ ] Audit logging: all admin actions with before/after state

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P0 | **Owner:** Platform Team

#### Acceptance Criteria
- [ ] Job queues: notifications, emails, SMS, payments, search index updates, analytics exports
- [ ] Retry policy: exponential backoff, max 5 attempts, dead letter queue
- [ ] Job prioritization: critical (payments), normal (notifications), low (exports)
- [ ] Job idempotency keys to prevent duplicate processing
- [ ] Scheduled jobs: daily reports, nightly aggregations, cleanup tasks
- [ ] Monitoring: queue depth, processing rate, failure rate, job duration
- [ ] Graceful shutdown: finish in-progress jobs before process exit
- [ ] Concurrency control per queue type
- [ ] Job cancellation for scheduled future jobs
- [ ] Stalled job detection and reprocessing

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | App launch <2s, screen load <1s, API response <200ms (p95) |
| **Availability** | 99.9% uptime, scheduled maintenance windows |
| **Security** | OWASP Top 10 mitigation, annual penetration testing |
| **Compliance** | GDPR, CCPA, PCI-DSS Level 1 |
| **Scalability** | Support 10M users, 100K businesses, 1M daily bookings |
| **Localization** | French (default), English, Spanish, German; RTL for Arabic (P2) |

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Monthly Active Users (MAU) | 500K by month 12 |
| Booking Conversion Rate | >15% from business detail view |
| Day-7 Retention | >30% |
| NPS Score | >50 |
| Customer Support Tickets | <2% of transactions |
| App Store Rating | >4.5 stars |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Search, Business Detail, Booking, Basic Profile, Business Portal | Month 1-2 |
| **V1.0** | + Map, Favorites, Reviews, Payments, Notifications | Month 3-4 |
| **V1.5** | + Admin, Advanced Analytics, Loyalty, Referrals | Month 5-6 |
| **V2.0** | + AI Recommendations, Subscription Tiers, Marketplace | Month 7-9 |

---

*Document Version: 1.0 | Last Updated: 2024 | Product Owner: Alex*