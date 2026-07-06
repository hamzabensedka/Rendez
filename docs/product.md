# Planity Clone - Product Specification

## 1. Overview

Planity Clone is a mobile-first platform connecting customers with beauty/wellness service providers for appointment booking. The platform serves three user types: customers seeking services, business owners managing their operations, and administrators overseeing the marketplace.

---

## 2. Features & Acceptance Criteria

### 2.1 User Authentication (Priority: P0)

**User Story:** As a user, I want to create an account and log in securely so that I can access personalized features.

**Acceptance Criteria:**
- [ ] Users can register with email/password, phone number, or social providers (Google, Apple)
- [ ] Password must be minimum 8 characters with 1 uppercase, 1 lowercase, 1 number
- [ ] Email verification required before full account activation
- [ ] Phone verification via SMS OTP for phone-based registration
- [ ] JWT access tokens (15min expiry) with refresh token rotation
- [ ] Biometric login option after initial password setup (mobile)
- [ ] "Forgot Password" flow with secure token-based reset (24hr expiry)
- [ ] Account lockout after 5 failed attempts (30-min cooldown)
- [ ] Users can delete account with 30-day grace period and data export
- [ ] Session management: view active devices, remote logout

**Technical Notes:** OAuth 2.0 + PKCE for mobile; rate limiting 5 req/min on auth endpoints.

---

### 2.2 Guest Browse & Explore (Priority: P0)

**User Story:** As an unauthenticated user, I want to browse services without registering so that I can evaluate the platform before committing.

**Acceptance Criteria:**
- [ ] Full search and discovery functionality available without login
- [ ] Business listings, detail views, and reviews visible to guests
- [ ] Booking flow initiates login prompt at checkout (not before)
- [ ] Guest session persisted via anonymous ID; merges to account upon registration
- [ ] Location-based results use device geolocation or IP fallback
- [ ] Maximum 3 booking attempts per guest session to prevent abuse
- [ ] Guest data retained 7 days; prompt to register preserves selections

---

### 2.3 Business Search & Discovery (Priority: P0)

**User Story:** As a customer, I want to find relevant businesses so that I can book the right service.

**Acceptance Criteria:**
- [ ] Text search across business name, service names, descriptions with typo tolerance
- [ ] Autocomplete suggestions within 200ms; debounced at 300ms
- [ ] Filters: distance (1-50km), price range, rating (4.0+), availability today, open now
- [ ] Sort options: relevance, distance, rating, price (low-high), availability
- [ ] Search history saved (last 10 queries) for authenticated users
- [ ] Trending searches and popular businesses surfaced on empty state
- [ ] Results load in <2s on 3G; skeleton loaders during fetch
- [ ] Pagination: 20 results per page, infinite scroll on mobile
- [ ] "No results" state with suggestions to broaden search

---

### 2.4 Map-based Search (Priority: P0)

**User Story:** As a customer, I want to see businesses on a map so that I can choose by location.

**Acceptance Criteria:**
- [ ] Interactive map (Google Maps/Mapbox) with business pins
- [ ] Clustering for dense areas; auto-zoom to fit results
- [ ] User location dot with accuracy radius indicator
- [ ] Tap pin shows business card preview with photo, rating, next availability
- [ ] "Search this area" button on map pan/zoom
- [ ] List/map toggle with synchronized state
- [ ] Directions integration (open native maps app)
- [ ] Map bounds filter applied to list results automatically
- [ ] Offline: cache last viewed map tiles (up to 5MB)

---

### 2.5 Business Detail View (Priority: P0)

**User Story:** As a customer, I want comprehensive business information so that I can make informed booking decisions.

**Acceptance Criteria:**
- [ ] Hero: business name, photos (up to 10, swipeable gallery), verified badge
- [ ] Key info: address (clickable for directions), phone, website link, hours
- [ ] Services list with prices, durations, descriptions; expandable details
-• [ ] Staff profiles with photos, bios, specialties, ratings
- [ ] Reviews summary (average, distribution, total count) and recent reviews
- [ ] "Book Now" CTA sticky on scroll; pre-selects tapped service
- [ ] Share business via native share sheet (deep link)
- [ ] Report inaccurate information (flag to admin)
- [ ] Photos: pinch-zoom, full-screen gallery with captions

---

### 2.6 Service Categories (Priority: P0)

**User Story:** As a customer, I want to browse by category so that I can discover services intuitively.

**Acceptance Criteria:**
- [ ] Hierarchical categories: Hair, Nails, Face, Body, Massage, Medical Aesthetic
- [ ] Subcategories: e.g., Hair > Cut, Color, Styling, Treatment
- [ ] Category icons with consistent visual design system
- [ ] Category landing page with featured businesses and trending services
- [ ] Multi-select category filter in search
- [ ] Admin-configurable category display order and featured status
- [ ] Category suggestions based on user booking history

---

### 2.7 Booking Flow (Priority: P0)

**User Story:** As a customer, I want to book appointments seamlessly so that I can secure my preferred time.

**Acceptance Criteria:**
- [ ] Step 1: Select service(s) — support multi-service booking with dependency validation
- [ ] Step 2: Select staff (optional "no preference") or auto-assigned based on availability
- [ ] Step 3: Date picker with calendar view; highlight days with availability
- [ ] Step 4: Time slot selection — morning/afternoon/evening groupings
- [ ] Step 5: Review booking summary with cancellation policy
- [ ] Step 6: Payment (if required) or confirm (if pay-at-venue)
- [ ] Booking confirmation with calendar invite (.ics) and add-to-calendar options
- [ ] Booking reference number; QR code for check-in
- [ ] Modify booking within business cancellation window
- [ ] Guest booking: collect name, phone, email; send confirmation via SMS+email

**Edge Cases:** Handle timezone changes, DST transitions, business holiday closures.

---

### 2.8 Appointment Management (Priority: P0)

**User Story:** As a customer, I want to manage my appointments so that I can stay organized.

**Acceptance Criteria:**
- [ ] Upcoming/past/cancelled tabs; Pagination for history (50 per page)
- [ ] Reschedule: select new slot, validate against cancellation policy
- [ ] Cancel with reason selection (required); automatic refund trigger if applicable
- [ ] Rebook: one-tap repeat of previous appointment configuration
- [ ] Add to personal calendar (Google, Apple, Outlook) with reminder
- [ ] Push notification reminders: 24h, 2h, and 15min before appointment
- [ ] Check-in button (geo-fenced, 500m radius) or manual confirm arrival
- [ ] No-show handling: mark after 15min past start time, penalty per business policy

---

### 2.9 Favorites (Priority: P1)

**User Story:** As a customer, I want to save favorite businesses so that I can rebook quickly.

**Acceptance Criteria:**
- [ ] Heart icon on business card and detail; toggle with haptic feedback
- [ ] Favorites list with search and sort (recently added, name, distance)
- [ ] Quick-book from favorite: jump to booking with pre-filled business
- [ ] Push notification when favorite business has new availability or promotion
- [ ] Sync across devices; survive app reinstall via cloud account
- [ ] Maximum 200 favorites; prompt to clean up at limit

---

### 2.10 User Profile (Priority: P1)

**User Story:** As a user, I want to manage my profile so that my experience is personalized.

**Acceptance Criteria:**
- [ ] Editable: name, phone, email, profile photo (crop to 1:1, max 5MB)
- [ ] Preferred notification channels (push, SMS, email) per event type
- [ ] Saved payment methods with PCI-compliant tokenization (Stripe)
- [ ] Loyalty/points balance if applicable
- [ ] Booking preferences: default reminder times, favorite staff
- [ ] Data export (GDPR): JSON download of all personal data
- [ ] Account deletion: confirmation flow, 30-day grace period, data purge

---

### 2.11 Availability & Slot Computation (Priority: P0)

**User Story:** As a system, I need accurate availability so that double-bookings never occur.

**Acceptance Criteria:**
- [ ] Business defines: operating hours per day, break times, slot duration granularity
- [ ] Staff-level availability overrides business defaults
- [ ] Service duration + buffer time = slot occupancy
- [ ] Concurrent booking prevention via database row-level locking
- [ ] Real-time slot cache with 5-second TTL; invalidate on booking mutation
- [ ] Slot computation accounts for: existing bookings, staff breaks, time off
- [ ] "Next available" API returns first slot across next 30 days
- [ ] Batch slot generation: pre-compute 90 days ahead, nightly regeneration
- [ ] Timezone-aware throughout; store all times in UTC, display in local

---

### 2.12 Shared Types & Design System (Priority: P0)

**User Story:** As a developer, I need consistent design patterns so that the product is cohesive.

**Acceptance Criteria:**
- [ ] Design tokens: colors (primary, secondary, semantic states), typography (font family, 6 sizes), spacing (4px base grid), radii, shadows
- [ ] Component library: buttons (5 variants), inputs, cards, modals, toasts, loaders
- [ ] Accessibility: WCAG 2.1 AA minimum; focus states, alt text, screen reader labels
- [ ] Dark mode support with system preference detection
- [ ] Shared TypeScript types across web/mobile/API boundaries
- [ ] Storybook documentation for all components
- [ ] Responsive breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px)

---

### 2.13 Reviews & Ratings (Priority: P1)

**User Story:** As a customer, I want to read and write reviews so that I can share and evaluate quality.

**Acceptance Criteria:**
- [ ] Verified purchase badge: only post-review after completed appointment
- [ ] Review components: 1-5 star rating, optional text (10-1000 chars), photo upload (max 5)
- [ ] Business owner response capability; mark as responded
- [ ] Review helpfulness voting; report for moderation
- [ ] Sort reviews: most recent, highest/lowest rating, most helpful
- [ ] Aggregate rating recalculation on new review (weighted average, minimum 10 reviews for precision)
- [ ] Review prompt: push notification 2 hours post-appointment
- [ ] Moderation queue for flagged content; auto-approve with keyword filter

---

### 2.14 Payment Integration (Priority: P0)

**User Story:** As a customer, I want secure payment so that I can confirm bookings confidently.

**Acceptance Criteria:**
- [ ] Stripe integration: cards, Apple Pay, Google Pay, SEPA (EU)
- [ ] Payment flows: full prepay, deposit (percentage), pay-at-venue
- [ ] 3D Secure for card authentication; fallback to SMS code
- [ ] Save card for future use with customer payment method ID
- [ ] Refund processing: automatic (cancellation within policy) or manual (admin)
- [ ] Receipt generation: email + in-app; itemized with VAT/tax
- [ ] Failed payment retry: 3 attempts with exponential backoff, notify user
- [ ] PCI compliance: never store raw card data; use Stripe Elements

---

### 2.15 Notifications (Priority: P1)

**User Story:** As a user, I want timely notifications so that I don't miss appointments.

**Acceptance Criteria:**
- [ ] Push notifications: Firebase Cloud Messaging with APNs fallback
- [ ] In-app notification center with unread count badge
- [ ] Notification types: booking confirmed, reminder, cancelled, modified, promotion, review request
- [ ] User preference management per channel and type
- [ ] SMS fallback for critical alerts if push not delivered in 5 minutes
- [ ] Email: transactional (required) and marketing (opt-in)
- [ ] Deep links from notification to relevant app screen
- [ ] Notification analytics: delivery rate, open rate, conversion

---

### 2.16 Provider / Business Owner Portal (Priority: P0)

**User Story:** As a business owner, I want to manage my business so that I can operate efficiently.

**Acceptance Criteria:**
- [ ] Dashboard: today's appointments, revenue, occupancy rate, upcoming week preview
- [ ] Calendar view: day/week/month, drag-to-reschedule, click to view details
- [ ] Appointment actions: confirm, cancel (with reason), mark no-show, add notes
- [ ] Service management: CRUD services with pricing, duration, description, photos
- [ ] Staff management: add staff, set schedules, assign services, deactivate
- [ ] Availability rules: recurring weekly hours, exceptions (holidays, time off)
- [ ] Client database: view history, contact info, notes (privacy-compliant)
- [ ] Revenue reports: daily/weekly/monthly, export to CSV
- [ ] Settings: business info, cancellation policy, notification preferences
- [ ] Role-based access: owner (full), manager (most), staff (own calendar only)

---

### 2.17 Admin Dashboard (Priority: P1)

**User Story:** As a platform admin, I want oversight tools so that I can maintain quality.

**Acceptance Criteria:**
- [ ] Business onboarding: approval workflow, document verification, status tracking
- [ ] User management: search, view, suspend, impersonate (audit logged)
- [ ] Content moderation: review flagged content, take action (hide, warn, ban)
- [ ] Analytics: MAU, booking volume, GMV, churn rate, top categories
- [ ] Financial: commission calculation, payout scheduling, dispute handling
- [ ] System health: API latency, error rates, queue depth monitoring
- [ ] Configurable platform settings: categories, fees, featured content

---

### 2.18 Background Jobs (BullMQ) (Priority: P0)

**User Story:** As a system, I need reliable background processing so that operations are scalable.

**Acceptance Criteria:**
- [ ] Job types: notification dispatch, slot cache warm, report generation, payment webhooks, data exports
- [ ] Queue priorities: critical (payments), normal (notifications), low (reports)
- [ ] Retry policy: 3 attempts with exponential backoff, dead-letter queue after failure
- [ ] Job idempotency: deduplication via unique job IDs
- [ ] Monitoring: queue depth, processing rate, failed job dashboard
- [ ] Scheduled jobs: nightly slot generation, weekly reports, data retention cleanup
- [ ] Rate limiting per job type to prevent external API quota exhaustion

---

## 3. Non-Functional Requirements

| Aspect | Requirement |
|--------|-------------|
| Performance | P95 API response <200ms; page load <2s on 4G |
| Availability | 99.9% uptime; <4hr recovery time |
| Security | OWASP Top 10 mitigation; annual penetration test |
| Scalability | Support 10M users, 100K concurrent bookings |
| Compliance | GDPR, CCPA, PCI-DSS Level 1 |

## 4. Success Metrics

- Monthly Bookings (target: 100K in Year 1)
- Booking Completion Rate (target: >70%)
- User Retention D30 (target: >25%)
- NPS Score (target: >50)
- Business Activation Rate (target: >80% complete profiles)

---

*Document Version: 1.0 | Last Updated: 2024 | Owner: Alex, Product Owner*