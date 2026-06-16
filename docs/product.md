# Planity Clone — Product Specification

## 1. Overview

**Product Name:** Planity Clone  
**Platform:** Mobile-first (iOS & Android via React Native), Web (responsive)  
**Target Audience:** Consumers booking beauty & wellness appointments; Business owners managing salons/spas; Platform administrators  
**MVP Goal:** Enable end-to-end appointment booking between consumers and beauty/wellness businesses with a seamless, map-first discovery experience.

---

## 2. Feature Specifications

### 2.1 User Authentication

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **Description** | Allow users to create accounts, log in, and manage sessions securely. |
| **User Stories** | As a user, I want to sign up with email/phone so that I can book appointments. As a user, I want to log in with social accounts so that I can access my account quickly. |

**Acceptance Criteria:**
- [ ] Users can register with email, phone number, or OAuth (Google, Apple, Facebook)
- [ ] Passwords must be hashed with bcrypt (min 8 chars, 1 uppercase, 1 number, 1 special char)
- [ ] JWT access token (15 min expiry) + refresh token (7 days) issued on login
- [ ] Phone verification via SMS OTP (Twilio) required before first booking
- [ ] Users can reset password via email link (expires in 1 hour)
- [ ] Biometric login (Face ID / Touch ID / Fingerprint) supported on mobile
- [ ] Session invalidation on logout from all devices option
- [ ] Rate limiting: 5 failed login attempts triggers 30-minute lockout

---

### 2.2 Guest Browse & Explore

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **Description** | Allow unauthenticated users to browse businesses and services without booking. |
| **User Stories** | As a guest, I want to browse nearby salons so that I can decide whether to sign up. |

**Acceptance Criteria:**
- [ ] Guest users can view business listings, search, and filter without login
- [ ] Guest users can view business details, services, and reviews
- [ ] "Book Now" CTA prompts login/signup with return URL preservation
- [ ] Guest session tracked via anonymous ID for analytics; merged on signup
- [ ] Maximum 10 business detail views per guest session before login prompt

---

### 2.3 Business Search & Discovery

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **Description** | Enable users to find businesses through text search, filters, and recommendations. |
| **User Stories** | As a user, I want to search for "haircut near me" so that I can find available salons. |

**Acceptance Criteria:**
- [ ] Full-text search across business name, service name, and description
- [ ] Autocomplete suggestions with debounce (300ms) and typo tolerance
- [ ] Filters: distance (1-50km), rating (1-5 stars), price range, open now, category, amenities
- [ ] Sort options: relevance, distance, rating, price (low to high)
- [ ] Search history stored locally, clearable by user
- [ ] Recent searches sync across devices for logged-in users
- [ ] Empty state with popular searches and nearby suggestions
- [ ] Search results pagination: 20 items per page, infinite scroll on mobile

---

### 2.4 Map-based Search

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **Description** | Visual discovery of businesses on an interactive map. |
| **User Stories** | As a user, I want to see salons on a map so that I can choose by location. |

**Acceptance Criteria:**
- [ ] Interactive map (Google Maps / Mapbox) with business pins
- [ ] Clustering for dense areas; expand on zoom
- [ ] User location dot with accuracy radius
- [ ] Pin tap reveals business card with name, rating, price range, next availability
- [ ] "Re-center to my location" button
- [ ] Map and list view toggle with state persistence
- [ ] Boundary search: pan/zoom map updates results without full reload
- [ ] Offline: cache last viewed map tiles and business pins for 24 hours

---

### 2.5 Business Detail View

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **Description** | Comprehensive page showing all business information to drive booking decisions. |
| **User Stories** | As a user, I want to see photos, services, and reviews so that I can choose a salon. |

**Acceptance Criteria:**
- [ ] Hero image carousel (up to 10 images), pinch-to-zoom on mobile
- [ ] Business name, verified badge, average rating, review count, category tags
- [ ] Address with "Get Directions" (opens native maps app)
- [ ] Phone number with tap-to-call, website link, social media links
- [ ] Operating hours with "Open Now" / "Closes at X" indicator
- [ ] Services list with name, duration, description, price; expandable for details
- [ ] Staff/professional list with photos, specialties, and ratings
- [ ] Reviews section: sort by newest, highest, lowest; filter by service
- [ ] "Book Now" sticky CTA, scroll-aware
- [ ] Share business via native share sheet / copy link

---

### 2.6 Service Categories

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **Description** | Hierarchical categorization of services for discovery and filtering. |
| **User Stories** | As a user, I want to browse "Hair" services so that I can find what I need. |

**Acceptance Criteria:**
- [ ] Category hierarchy: 2 levels (e.g., Hair > Cut, Hair > Color, Nails > Manicure)
- [ ] Category icons and color coding in UI
- [ ] Trending / popular categories surfaced on home screen
- [ ] Businesses can assign multiple categories and subcategories
- [ ] Category pages with featured businesses and promotional banners
- [ ] Admin-managed category tree with ability to add, edit, deactivate categories

---

### 2.7 Booking Flow

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **Description** | Core conversion flow for reserving appointments. |
| **User Stories** | As a user, I want to book a haircut for tomorrow at 3pm so that I can plan my schedule. |

**Acceptance Criteria:**
- [ ] Step 1: Select service (with upsell suggestions: "Add blow-dry for $20")
- [ ] Step 2: Select staff member or "No preference"
- [ ] Step 3: Date picker with availability calendar; unavailable dates disabled
- [ ] Step 4: Time slot selection; slots update in real-time via WebSocket
- [ ] Step 5: Review booking summary with service, staff, date/time, price, cancellation policy
- [ ] Step 6: Apply promo code (validates in real-time)
- [ ] Step 7: Select payment method (card on file, new card, Apple Pay, Google Pay)
- [ ] Step 8: Confirm booking; trigger payment authorization (capture on completion or full charge per business config)
- [ ] Booking confirmation screen with calendar invite (.ics), add to native calendar
- [ ] Booking details sent via push, email, and SMS
- [ ] 10-minute hold on slot during checkout; release if payment fails or user abandons
- [ ] Support for group bookings (multiple services, same time slot)
- [ ] Guest checkout option with email/phone collection

---

### 2.8 Appointment Management

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **Description** | Users and businesses can view, modify, and cancel appointments. |
| **User Stories** | As a user, I want to reschedule my appointment so that I can adapt to changes. |

**Acceptance Criteria:**
- [ ] Upcoming appointments list with countdown ("In 2 days")
- [ ] Appointment detail: service, staff, time, location, directions, contact, notes
- [ ] Reschedule: select new date/time within business cancellation policy window
- [ ] Cancel with reason selection; refund processed per cancellation policy
- [ ] No-show reporting by business; affects user's account standing
- [ ] Rebook previous service with one tap
- [ ] Appointment history with invoice/receipt download (PDF)
- [ ] Push reminder: 24 hours, 2 hours, and 15 minutes before appointment
- [ ] Business can add internal notes visible only to staff

---

### 2.9 Favorites

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **Description** | Users can save preferred businesses for quick access. |
| **User Stories** | As a user, I want to favorite my regular salon so that I can book quickly. |

**Acceptance Criteria:**
- [ ] Heart icon on business card and detail page; tap to add/remove
- [ ] Favorites list with search and sort (recently added, alphabetical, nearest)
- [ ] Favorites sync across devices for logged-in users
- [ ] Push notification when favorited business has new availability or promotion
- [ ] Suggested favorites based on booking history
- [ ] Maximum 200 favorites per user

---

### 2.10 User Profile

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **Description** | Central hub for user account management and preferences. |
| **User Stories** | As a user, I want to update my profile so that businesses have accurate information. |

**Acceptance Criteria:**
- [ ] Profile photo upload (crop to circle, max 5MB, JPG/PNG)
- [ ] Name, phone, email, date of birth (for birthday promotions)
- [ ] Saved addresses (home, work, other) with geocoding
- [ ] Payment methods: add, set default, delete (PCI-compliant via Stripe)
- [ ] Notification preferences: push, email, SMS — per type (bookings, promotions, reminders)
- [ ] Privacy settings: profile visibility, data download, account deletion (GDPR)
- [ ] Booking history with search and filter
- [ ] Loyalty points / rewards balance and transaction history
- [ ] Referral code generation and sharing

---

### 2.11 Availability & Slot Computation

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **Description** | Real-time calculation of bookable time slots based on complex business rules. |
| **User Stories** | As a business, I want my availability to update automatically so that I don't get double-booked. |

**Acceptance Criteria:**
- [ ] Business defines: operating hours per day, break times, holidays
- [ ] Staff-specific schedules and time-off requests
- [ ] Service duration + buffer time (e.g., 30 min service + 15 min cleanup)
- [ ] Slot computation considers: staff availability, room/equipment availability, existing bookings
- [ ] Real-time slot availability via API (< 200ms response)
- [ ] WebSocket broadcast when slots change (new booking, cancellation, business update)
- [ ] Support for recurring availability patterns and exceptions
- [ ] Overbooking protection: pessimistic locking on slot selection
- [ ] Timezone handling: all slots stored in UTC, displayed in business timezone
- [ ] Buffer for "last minute" bookings (e.g., no bookings within 2 hours of start time)

---

### 2.12 Shared Types & Design System

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **Description** | Consistent UI/UX patterns and type definitions across platforms. |
| **User Stories** | As a developer, I want reusable components so that I can build features quickly. |

**Acceptance Criteria:**
- [ ] Design tokens: colors, typography, spacing, shadows, border-radius in JSON
- [ ] Component library: buttons, inputs, cards, modals, date pickers, loading states
- [ ] Shared TypeScript types between backend and frontend (monorepo)
- [ ] Accessibility: WCAG 2.1 AA compliance, screen reader support, minimum 44x44pt touch targets
- [ ] Dark mode support with system preference detection
- [ ] Localization framework (i18n): English, French, Spanish for MVP
- [ ] RTL layout support for future expansion
- [ ] Animation standards: 200ms transitions, spring physics for mobile gestures

---

### 2.13 Reviews & Ratings

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **Description** | Post-appointment feedback system to build trust and quality signals. |
| **User Stories** | As a user, I want to read honest reviews so that I can choose a quality salon. |

**Acceptance Criteria:**
- [ ] Review prompt sent 2 hours after appointment completion (push + email)
- [ ] Star rating (1-5) + optional text review (max 1000 chars) + photo upload (max 5)
- [ ] Verified purchase badge for completed bookings
- [ ] Business can respond to reviews publicly
- [ ] Flag inappropriate content; admin moderation queue
- [ ] Review helpfulness voting (thumbs up/down)
- [ ] Average rating recalculated in real-time; cached for performance
- [ ] Users can edit or delete their own reviews within 30 days
- [ ] Business cannot delete reviews; can appeal to admin

---

### 2.14 Payment Integration

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **Description** | Secure, flexible payment processing for bookings. |
| **User Stories** | As a user, I want to pay securely so that my booking is confirmed. |

**Acceptance Criteria:**
- [ ] Stripe integration: Payment Intents, Setup Intents, Customers, Refunds
- [ ] Support for: credit/debit cards, Apple Pay, Google Pay, SEPA (EU)
- [ ] Payment flow: authorize on booking, capture on completion OR full charge at booking (business-configurable)
- [ ] Deposit/partial payment option (e.g., 20% non-refundable)
- [ ] Promo code and gift card redemption
- [ ] Automatic receipt emailed on successful payment
- [ ] Failed payment retry with saved payment method or new method
- [ ] Refund processing: full, partial, or store credit per cancellation policy
- [ ] PCI compliance: no card data stored locally; all via Stripe tokens
- [ ] Webhook handling for payment status updates (idempotent processing)
- [ ] Payout to businesses: weekly transfer to connected Stripe account

---

### 2.15 Notifications

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **Description** | Multi-channel communication to keep users informed. |
| **User Stories** | As a user, I want reminders so that I don't miss my appointment. |

**Acceptance Criteria:**
- [ ] Push notifications: Firebase Cloud Messaging (iOS + Android)
- [ ] Email notifications: SendGrid / AWS SES with HTML templates
- [ ] SMS notifications: Twilio for critical alerts (booking confirmation, reminders)
- [ ] Notification types: booking confirmed, rescheduled, cancelled, reminder, promotion, review request, payment issue
- [ ] User preference controls per channel and type
- [ ] Rich push: deep links to relevant in-app screens
- [ ] Notification history in-app with unread badges
- [ ] Batch digest option for non-urgent notifications (daily summary)
- [ ] Delivery tracking and retry logic for failed sends

---

### 2.16 Provider / Business Owner Portal

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 |
| **Description** | Web-based dashboard for businesses to manage their presence, schedule, and operations. |
| **User Stories** | As a salon owner, I want to manage my bookings so that I can run my business efficiently. |

**Acceptance Criteria:**
- [ ] Dashboard: today's appointments, revenue, new reviews, occupancy rate
- [ ] Calendar view: day, week, month; drag-to-reschedule, click for details
- [ ] Appointment actions: confirm, reschedule, cancel, mark no-show, add notes
- [ ] Service management: CRUD services with name, description, duration, price, category, photo
- [ ] Staff management: add team members, set schedules, assign services, set commission rates
- [ ] Availability management: set hours, breaks, time off, recurring patterns
- [ ] Client database: view history, contact info, notes, loyalty status
- [ ] Reviews: respond to reviews, view analytics
- [ ] Promotions: create discount codes, flash sales, package deals
- [ ] Reports: revenue, bookings by service, staff performance, cancellation rate (export to CSV/PDF)
- [ ] Settings: business info, photos, policies (cancellation, late arrival), payment account
- [ ] Multi-location support for franchise/chain businesses
- [ ] Role-based access: owner, manager, receptionist, staff (view-only)

---

### 2.17 Admin Dashboard

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **Description** | Platform administration and oversight tools. |
| **User Stories** | As an admin, I want to monitor platform health so that I can ensure quality. |

**Acceptance Criteria:**
- [ ] User management: search, view, suspend, delete accounts; impersonate for support
- [ ] Business management: approve new registrations, verify documents, suspend, feature
- [ ] Content moderation: review flagged reviews, photos, business descriptions
- [ ] Category management: CRUD service categories, assign icons, set display order
- [ ] Promotions: platform-wide campaigns, featured business slots
- [ ] Analytics: MAU, DAU, booking volume, GMV, churn rate, top categories, geographic heatmap
- [ ] Financial: transaction monitoring, refund approval, payout scheduling, commission tracking
- [ ] Support tickets: acheivement: view, assign, resolve with SLA tracking
- [ ] System health: API latency, error rates, queue depth, database performance
- [ ] Audit log: all admin actions with timestamp and admin ID
- [ ] Role-based access: super admin, ops manager, support agent, finance

---

### 2.18 Background Jobs (BullMQ)

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 |
| **Description** | Asynchronous job processing for reliability and scalability. |
| **User Stories** | As a developer, I want reliable background processing so that user-facing performance isn't degraded. |

**Acceptance Criteria:**
- [ ] Job queue: BullMQ with Redis, separate queues per job type
- [ ] Scheduled jobs: appointment reminders (24h, 2h, 15min), review prompts, daily digest emails
- [ ] Retry policy: exponential backoff, max 5 attempts, dead letter queue after failure
- [ ] Job types and priorities:
  - **High**: payment processing, slot hold/release, real-time notifications
  - **Medium**: email sends, SMS sends, push notifications
  - **Low**: report generation, data exports, analytics aggregation, image processing
- [ ] Job monitoring: Bull Board UI for queue inspection, retry, and cleanup
- [ ] Idempotency: jobs can be safely retried without side effects
- [ ] Concurrency control: limit parallel workers per queue type
- [ ] Graceful shutdown: finish in-progress jobs before process exit
- [ ] Job completion webhooks for cross-service coordination

---

## 3. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | API p95 < 200ms; map tile load < 1s; app cold start < 3s |
| **Scalability** | Support 10,000 concurrent users; 1M bookings/month target |
| **Security** | OWASP Top 10 mitigation; encryption at rest and in transit; SOC 2 Type II roadmap |
| **Reliability** | 99.9% uptime SLA; automated backups; RPO < 1 hour, RTO < 4 hours |
| **Compliance** | GDPR (EU), CCPA (California), PCI-DSS for payments |
| **Accessibility** | WCAG 2.1 AA; VoiceOver/TalkBack support; dynamic type sizing |

---

## 4. Prioritization Matrix

| Feature | Priority | Sprint Target | Dependencies |
|---------|--------|-------------|--------------|
| User Authentication | P0 | Sprint 1 | — |
| Guest Browse & Explore | P0 | Sprint 1 | — |
| Business Search & Discovery | P0 | Sprint 1 | — |
| Map-based Search | P0 | Sprint 2 | Business Search |
| Business Detail View | P0 | Sprint 2 | — |
| Service Categories | P1 | Sprint 3 | — |
| Booking Flow | P0 | Sprint 3-4 | Auth, Availability, Payment |
| Appointment Management | P0 | Sprint 4 | Booking Flow |
| Favorites | P1 | Sprint 5 | Auth |
| User Profile | P1 | Sprint 5 | Auth |
| Availability & Slot Computation | P0 | Sprint 2-3 | — |
| Shared Types & Design System | P0 | Sprint 1 (ongoing) | — |
| Reviews & Ratings | P1 | Sprint 5 | Booking Flow |
| Payment Integration | P0 | Sprint 4 | Booking Flow |
| Notifications | P1 | Sprint 4-5 | Booking Flow |
| Provider / Business Owner Portal | P0 | Sprint 3-5 | Auth, Booking Flow |
| Admin Dashboard | P1 | Sprint 6 | Business Owner Portal |
| Background Jobs (BullMQ) | P1 | Sprint 2 (ongoing) | Notifications, Reports |

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Monthly Active Users (MAU) | 50,000 by Month 6 |
| Booking Conversion Rate | > 15% of app opens |
| Search-to-Book Time | < 3 minutes average |
| Business NPS | > 50 |
| Consumer NPS | > 60 |
| App Store Rating | > 4.5 stars |
| Crash-Free Sessions | > 99.5% |
| Payment Success Rate | > 98% |

---

## 6. Open Questions & Risks

| Risk | Mitigation |
|------|------------|
| Stripe Connect onboarding friction for businesses | Simplified flow, dedicated support, video guides |
| Real-time slot contention at scale | Optimistic locking with retry, Redis for fast state |
| Map API costs at scale | Caching strategy, rate limiting, evaluate Mapbox vs Google |
| Regulatory changes (EU) | Legal review, flexible architecture for compliance |
| Marketplace chicken-and-egg | Seed launch markets with anchor businesses, consumer incentives |

---

*Document Version: 1.0*  
*Last Updated: 2024*  
*Owner: Product Team*