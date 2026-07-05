# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first appointment booking platform connecting consumers with beauty, wellness, and service professionals. Users discover businesses, view real-time availability, book appointments, and manage their bookings. Business owners manage their services, availability, and appointments through a dedicated portal.

**Target Platforms:** iOS, Android, Web (responsive)
**Primary User Types:** Consumers (seeking services), Business Owners/Providers, Platform Admins

---

## 2. Feature Specifications

### 2.1 User Authentication

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Owner** | Core Platform |

#### Description
Secure authentication system supporting multiple login methods with role-based access control.

#### Acceptance Criteria
- [ ] Users can register with email/password, phone number with OTP, or social providers (Google, Apple, Facebook)
- [ ] Passwords require minimum 8 characters with uppercase, lowercase, number, and special character
- [ ] OTP expires after 5 minutes; supports resend with 60-second cooldown
- [ ] JWT tokens with refresh token rotation; access token expires in 15 minutes
- [ ] Users can reset password via email link (expires in 1 hour)
- [ ] Account lockout after 5 failed attempts (30-minute lockout)
- [ ] Biometric authentication option enabled after first successful login
- [ ] Role selection during onboarding: "I'm looking for services" vs "I provide services"
- [ ] GDPR-compliant consent capture during registration
- [ ] Session management: view active sessions, remote logout capability

---

### 2.2 Guest Browse & Explore

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Owner** | Consumer Experience |

#### Description
Unauthenticated users can browse businesses, view basic information, and search with limited functionality to drive conversion.

#### Acceptance Criteria
- [ ] Guest users can browse business listings without account creation
- [ ] Guest search limited to 3 results per query; full results require authentication
- [ ] Business detail pages accessible with service list and pricing visible
- [ ] Real-time availability hidden behind login wall (shows "Login to see availability")
- [ ] "Save to favorites" and "Book" CTAs prompt authentication
- [ ] Guest session tracked via device ID for 30 days to preserve search context post-login
- [ ] Prominent "Create account" nudges after 2 minutes of browsing or 3 page views
- [ ] Deep links from shared business pages open directly even for guests

---

### 2.3 Business Search & Discovery

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Owner** | Consumer Experience |

#### Description
Comprehensive search and filtering to help users find relevant businesses.

#### Acceptance Criteria
- [ ] Full-text search across business name, service names, and descriptions
- [ ] Auto-complete suggestions with recent searches and trending queries
- [ ] Filter by: category, price range, rating (minimum stars), distance, availability today, gender of professional, languages spoken
- [ ] Sort by: relevance (default), distance, rating, price (low to high), availability soonest
- [ ] Search radius: 500m, 1km, 3km, 5km, 10km, 20km, or city-wide
- [ ] Recent searches persist for 30 days; can be cleared individually or all at once
- [ ] Search results display: business photo, name, rating, distance, price from, next available slot
- [ ] Empty state with suggestions: broaden filters, different category, different location
- [ ] Pagination with 20 results per page; infinite scroll on mobile
- [ ] Search analytics logged for trending queries and zero-result queries

---

### 2.4 Map-based Search

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Owner** | Consumer Experience |

#### Description
Interactive map visualization of search results with geospatial exploration.

#### Acceptance Criteria
- [ ] Toggle between list and map views; default follows user preference
- [ ] Map displays business pins color-coded by category
- [ ] Pin tap reveals business card with key info and "View" CTA
- [ ] User location dot with accuracy ring; follow-me mode with heading
- [ ] Map bounds trigger automatic result refresh (debounced 500ms)
- [ ] Clustering for dense areas; expands on zoom
- [ ] Directions integration (Google Maps, Apple Maps, Waze)
- [ ] Current location button with permission handling (denied, limited, authorized)
- [ ] Offline: cached map tiles for previously viewed areas; businesses list still accessible

---

### 2.5 Business Detail View

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Owner** | Consumer Experience |

#### Description
Rich business profile showcasing services, availability, reviews, and booking options.

#### Acceptance Criteria
- [ ] Hero image carousel (up to 10 images), pinch-to-zoom
- [ ] Business info: name, category, address with copy, phone with tap-to-call, website link
- [ ] Operating hours with "Open now" / "Closes at" / "Closed" status
- [ ] Services tab: categorized list with duration, price, description; expandable details
- [ ] Reviews tab: aggregate rating, rating distribution, sortable reviews with photos, owner responses
- [ ] Team tab: staff profiles with photos, specialties, languages, individual availability
- [ ] About tab: business description, amenities, COVID-19 protocols, accessibility features
- [ ] "Book Now" sticky button; pre-selects service if tapped from service card
- [ ] Share functionality: native share sheet, copy link, QR code
- [ ] Report business option for inappropriate content

---

### 2.6 Service Categories

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Owner** | Core Platform |

#### Description
Hierarchical category system for business and service classification.

#### Acceptance Criteria
- [ ] Top-level categories: Hair, Beauty, Wellness, Health, Fitness, Medical Aesthetic, Other
- [ ] Second-level subcategories (e.g., Hair > Cut, Color, Styling, Treatment)
- [ ] Businesses can select up to 3 primary categories; services map to one category
- [ ] Category icons and colors consistent across all surfaces
- [ ] Category browsing from home screen with featured and trending sections
- [ ] Admin-managed category tree; ability to merge, split, or deprecate categories with migration
- [ ] SEO-friendly category pages with structured data

---

### 2.7 Booking Flow

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Owner** | Consumer Experience |

#### Description
Seamless multi-step booking experience with real-time availability and confirmation.

#### Acceptance Criteria
- [ ] Step 1 — Select Service: choose from business services, see duration and price
- [ ] Step 2 — Select Professional: specific staff or "No preference" for fastest availability
- [ ] Step 3 — Select Date & Time: calendar view with available slots highlighted; slots computed in real-time
- [ ] Step 4 — Add-ons & Notes: optional extras, special requests, allergy/condition notes
- [ ] Step 5 — Review & Confirm: order summary with cancellation policy, payment method selection
- [ ] Real-time slot availability with 5-minute cache; optimistic locking with retry on conflict
- [ ] Hold slot for 10 minutes during checkout; release on timeout or abandonment
- [ ] Guest checkout supported with email/phone collection
- [ ] Booking confirmation screen with calendar invite, add to wallet, share appointment
- [ ] Post-booking: push notification, email confirmation, SMS reminder opt-in

---

### 2.8 Appointment Management

| immutableAttribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Owner** | Consumer Experience |

#### Description
Users can view, modify, and cancel their upcoming and past appointments.

#### Acceptance Criteria
- [ ] Upcoming tab: chronological list, grouped by date, with countdown to next appointment
- [ ] Past tab: history with rebook shortcut, review prompt for unrated appointments
- [ ] Appointment card: business, service, professional, date/time, status, actions
- [ ] Reschedule: same booking flow pre-populated, new slot selection, confirmation with new details
- [ ] Cancel: reason selection (mandatory), confirmation with refund policy disclosure
- [ ] No-show reporting by business triggers user notification and potential penalty
- [ ] Upcoming appointment reminders: 24 hours (email), 2 hours (push), 15 minutes (push)
- [ ] Calendar sync: bi-directional with Google Calendar, Apple Calendar, Outlook
- [ ] Export appointment details as PDF receipt

---

### 2.9 Favorites

| Attribute | Value |
|-----------|-------|
| **Priority** | P1 |
| **Owner** | Consumer Experience |

#### Acceptance Criteria
- [ ] Heart icon on business cards and detail pages; toggle with haptic feedback
- [ ] Favorites list with offline access; sync on reconnect
- [ ] Quick rebook from favorite business
- [ ] Push notification when favorite business adds new services or has last-minute availability
- [ ] Organize favorites into custom lists (e.g., "Regular Spots", "Want to Try")
- [ ] Share favorite list with friends via link

---

### 2.10 User Profile

| Attribute | Value |
|-----------|-------|
| **Priority** | P1 |
| **Owner** | Consumer Experience |

#### Acceptance Criteria
- [ ] Profile photo, name, phone, email, date of birth (for age-restricted services)
- [ ] Preferred language and notification preferences
- [ ] Saved payment methods with PCI-compliant tokenization
- [ ] Address book for home service bookings
- [ ] Loyalty program integration: points balance, tier status, history
- [ ] Privacy settings: profile visibility, data download, account deletion
- [ ] Referral code and sharing

---

### 2.11 Availability & Slot Computation

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Owner** | Core Platform |

#### Description
Real-time availability engine considering complex business rules and constraints.

#### Acceptance Criteria
- [ ] Business defines: operating hours, break times, slot duration per service, buffer between appointments
- [ ] Professional-level availability overrides (time off, modified hours)
- [ ] Service dependencies: some services require gap between (e.g., color and cut)
- [ ] Resource constraints: room, equipment, or chair requirements
- [ ] Concurrent booking limits for group services
- [ ] Slot computation: O(n) performance for 30-day lookahead, sub-200ms API response
- [ ] Cache invalidation on any schedule change with 5-second propagation
- [ ] Timezone handling: all slots displayed in user's detected timezone; stored in business timezone
- [ ] Daylight saving time transitions handled without ambiguity

---

### 2.12 Shared Types & Design System

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Owner** | Design / Engineering |

#### Acceptance Criteria
- [ ] Component library: buttons, inputs, cards, modals, bottom sheets, date picker, time grid
- [ ] Color tokens: primary (#FF6B6B), secondary, semantic (success, warning, error, info)
- [ ] Typography scale: 6 levels with responsive sizing
- [ ] Spacing system: 4px base unit
- [ ] Animation standards: 200ms default, ease-out; reduced motion respect
- [ ] Shared TypeScript types across frontend, backend, and API contracts
- [ ] Icon set: 200+ icons, consistent 24px default, 20px compact
- [ ] Dark mode support with automatic and manual toggle
- [ ] Accessibility: WCAG 2.1 AA minimum; screen reader optimized, minimum 44px touch targets

---

### 2.13 Reviews & Ratings

| Attribute | Value |
|-----------|-------|
| **Priority** | P1 |
| **Owner** | Consumer Experience |

#### Acceptance Criteria
- [ ] Eligibility: verified booking completion within past 90 days
- [ ] Rating: 1-5 stars with half-star precision
- [ ] Review text: 10-1000 characters, profanity filter, photo upload (max 5, 5MB each)
- [ ] Business owner can respond once; response editable
- [ ] Review helpfulness voting
- [ ] Flag inappropriate reviews for moderation
- [ ] Aggregate recalculation with outlier detection; suspicious patterns flagged to admin
- [ ] Review prompt: in-app 24 hours post-appointment, email fallback at 48 hours

---

### 2.14 Payment Integration

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Owner** | Core Platform |

#### Acceptance Criteria
- [ ] Stripe and PayPal as primary processors; regional methods (SEPA, iDEAL, etc.) phased by market
- [ ] Payment flows: pay in full, deposit, pay at venue, subscription/membership
- [ ] Saved cards with 3D Secure for first save
- [ ] Refund processing: full, partial, or credit; automatic for cancellations within policy
- [ ] Receipt generation and email delivery
- [ ] Failed payment retry with user notification
- [ ] Payout scheduling to business bank accounts (T+2 default)
- [ ] Platform fee: transparent deduction on business dashboard

---

### 2.15 Notifications

| Attribute | Value |
|-----------|-------|
| **Priority** | P1 |
| **Owner** | Core Platform |

#### Acceptance Criteria
- [ ] Channels: push (Firebase Cloud Messaging), email (SendGrid), SMS (Twilio), in-app inbox
- [ ] Notification types: booking confirmations, reminders, changes, promotions, system
- [ ] User preference controls per channel and category
- [ ] Rich push with deep links to relevant screens
- [ ] Notification history: 90 days retention, searchable
- [ ] Quiet hours: no push notifications 22:00-08:00 user local time
- [ ] Delivery tracking and retry for failed pushes

---

### 2.16 Provider / Business Owner Portal

| Attribute | Value |
|-----------|-------|
| **Priority** | P0 |
| **Owner** | Business Experience |

#### Acceptance Criteria
- [ ] Dashboard: today's appointments, revenue, occupancy rate, quick actions
- [ ] Calendar view: day, week, month; drag-and-drop rescheduling
- [ ] Service management: CRUD with pricing, duration, description, online booking toggle
- [ ] Staff management: profiles, permissions, schedules, time-off requests
- [ ] Availability rules: recurring patterns, exceptions, blackout dates
- [ ] Booking policies: cancellation window, no-show policy, deposit requirements
- [ ] Customer database: view history, notes, preferences, marketing opt-in status
- [ ] Reports: revenue, appointments by service, staff utilization, customer retention
- [ ] Mobile-optimized for on-the-go management
- [ ] Multi-location support with location switcher

---

### 2.17 Admin Dashboard

| Attribute | Value |
|-----------|-------|
| **Priority** | P2 |
| **Owner** | Platform Operations |

#### Acceptance Criteria
- [ ] Business onboarding approval workflow
- [ ] User management: search, view, suspend, impersonate
- [ ] Content moderation: review flagged content, take actions
- [ ] Financial oversight: transaction monitoring, dispute handling, payout reconciliation
- [ ] Analytics: MAU, booking volume, GMV, churn, CAC, LTV cohorts
- [ ] System health: API latency, error rates, queue depths
- [ ] Feature flags and A/B test configuration
- [ ] Audit log: all admin actions with before/after state

---

### 2.18 Background Jobs (BullMQ)

| Attribute | Value |
|-----------|-------|
| **Priority** | P1 |
| **Owner** | Core Platform |

#### Acceptance Criteria
- [ ] Job types: email dispatch, push notification, SMS, payment processing, report generation, data export, search index updates, image processing, slot cache warming
- [ ] Retry policy: 3 attempts with exponential backoff (delay 5s, 25s, 125s)
- [ ] Dead letter queue for failed jobs after max retries; admin alert
- [ ] Job priorities: critical (payment), high (notifications), normal, low (reports)
- [ ] Scheduled jobs: daily reports at 06:00, weekly summaries Monday 08:00
- [ ] Job observability: queue depth, processing rate, average duration, failure rate dashboards
- [ ] Rate limiting per job type to respect external API quotas
- [ ] Graceful shutdown: finish active jobs, requeue in-progress, 30-second timeout

---

## 3. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | App cold start < 2s; screen transition < 300ms; API p95 < 200ms |
| **Reliability** | 99.9% uptime; zero-downtime deployments |
| **Security** | OWASP Top 10 mitigation; annual penetration testing; SOC 2 Type II |
| **Scalability** | Support 100k concurrent users; 10M monthly bookings |
| **Localization** | French, English, Spanish, German, Italian launch; RTL for Arabic phase 2 |
| **Compliance** | GDPR, CCPA, PCI-DSS Level 1 |

---

## 4. Success Metrics

| Metric | Target |
|--------|--------|
| Monthly Active Users (MAU) | 500k year 1 |
| Booking Conversion Rate | 15% of searches |
| NPS | > 50 |
| Business Retention | 85% at 12 months |
| Customer Acquisition Cost | < €10 |
| Average Booking Value | €50 |

---

## 5. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Guest Browse, Search, Map, Business Detail, Booking, Appointments, Provider Portal | Month 1-3 |
| **V1.0** | +批次Payment, Reviews, Notifications, Favorites, Profile | Month 4-5 |
| **V1.5** | Admin Dashboard, Background Jobs, Analytics, Advanced Availability | Month 6-8 |
| **V2.0** | Loyalty, Referrals, Marketplace Features, International Expansion | Month 9-12 |

---

*Document Version: 1.0*
*Last Updated: 2024*
*Author: Alex, Product Owner*