# Planity Clone — Product Specification

## 1. Overview

### 1.1 Product Vision
Build a comprehensive beauty and wellness booking platform connecting customers with local service providers (salons, barbers, spas, clinics) through seamless discovery, booking, and management experiences.

### 1.2 Target Users
- **Customers**: Individuals seeking beauty/wellness services, ages 18-55, mobile-first
- **Business Owners**: SMB service providers needing appointment management and client acquisition
- **Admins**: Platform operators managing marketplace health and disputes

### 1.3 Success Metrics
- Booking conversion rate >15%
- Search-to-book time <3 minutes
- Provider activation rate >70%
- App store rating >4.5

---

## 2. Feature Specifications

### 2.1 User Authentication (Priority: P0)

**User Story**: As a customer, I want to create an account and log in securely so that I can book appointments and manage my profile.

**Acceptance Criteria**:
- [ ] Support email/password registration with validation (email format, password 8+ chars with uppercase, number, special char)
- [ ] Social login: Google, Apple (iOS), Facebook
- [ ] Phone number verification via SMS OTP
- [ ] JWT access token (15min expiry) + refresh token (30 days) with secure httpOnly cookie storage
- [ ] Password reset via email link (1-hour expiry)
- [ ] Biometric login (Face ID/Touch ID) after initial setup
- [ ] Account deletion with 30-day grace period and data export
- [ ] Rate limiting: 5 failed attempts triggers 15-min lockout

**Business Rules**:
- Unique email and phone number constraints
- Minimum age: 16 years
- Terms acceptance required at registration

---

### 2.2 Guest Browse & Explore (Priority: P0)

**User Story**: As an unauthenticated user, I want to browse services and businesses so that I can evaluate the platform before committing.

**Acceptance Criteria**:
- [ ] Full access to search, discovery, and business detail views without login
- [ ] Prompt to authenticate only at booking initiation (with state preservation)
- [ ] Guest session tracked via anonymous ID; merge to account upon registration
- [ ] Limited favorites (stored locally, prompt to login at 3+ items)
- [ ] Geolocation permission request with clear value proposition

---

### 2.3 Business Search & Discovery (Priority: P0)

**User Story**: As a customer, I want to find relevant service providers quickly so that I can book the right service.

**Acceptance Criteria**:
- [ ] Full-text search across business name, service name, and description
- [ ] Auto-complete suggestions with recent searches and trending queries
- [ ] Filter by: service category, price range, rating (4.0+), availability ("book today"), gender of staff, amenities
- [ ] Sort by: relevance, distance, rating, price (low-high), availability
- [ ] Pagination with infinite scroll, 20 results per page
- [ ] Search history (last 10 queries), clearable
- [ ] "Near me" default with fallback to city center when location denied
- [ ] Result cards show: thumbnail, name, rating, distance, price from, next available slot
- [ ] Empty state with suggestions and category shortcuts

**Performance**: Search results <500ms; suggestions <100ms

---

### 2.4 Map-based Search (Priority: P0)

**User Story**: As a customer, I want to see businesses on a map so that I can choose based on location.

**Acceptance Criteria**:
- [ ] Interactive map (Google Maps / Mapbox) with business markers clustered at zoom levels
- [ ] Toggle between list and map views; persistent preference
- [ ] Marker color coding: open now (green), closed (gray), fully booked (red)
- [ ] Tap marker reveals preview card with key info and "Book" CTA
- [ ] Current location indicator with recenter button
- [ ] Map bounds search: update results as user pans/zooms (debounced 300ms)
- [ ] Default zoom: 15min walking radius; remember last map position

---

### 2.5 Business Detail View (Priority: P0)

**User Story**: As a customer, I want comprehensive business information so that I can make an informed booking decision.

**Acceptance Criteria**:
- [ ] Hero image carousel (up to 10 images), video support
- [ ] Business info: name, verified badge, rating, review count, address, phone, website
- [ ] Operating hours with "Open now" indicator and holiday exceptions
- [ ] Services tab: categorized list with prices, durations, descriptions
- [ ] Staff tab: profiles with photos, specialties, ratings
- [ ] Reviews tab: sortable, filterable by rating
- [ ] About tab: description, amenities, languages spoken, parking info
- [ ] "Book Now" sticky CTA; pre-selects first available service
- [ ] Share business via deep link, social, or QR code
- [ ] Report business for inaccurate info or policy violations

---

### 2.6 Service Categories (Priority: P0)

**User Story**: As a customer, I want to browse by service type so that I can discover providers for specific needs.

**Acceptance Criteria**:
- [ ] Hierarchical categories: Hair, Nails, Face, Body, Massage, Medical Aesthetic, Barbershop, etc.
- [ ] Iconography per category; consistent design system
- [ ] Category landing page with featured businesses, trending services, educational content
- [ ] Sub-categories (e.g., Hair > Cut, Color, Styling, Treatment)
- [ ] Cross-category search (e.g., "bridal package" spanning multiple categories)
- [ ] Category popularity ranking based on booking volume

---

### 2.7 Booking Flow (Priority: P0)

**User Story**: As a customer, I want to book appointments quickly and intuitively so that I can secure my preferred time slot.

**Acceptance Criteria**:
- [ ] Step 1: Select service(s) — single or multiple, with combo pricing
- [ ] Step 2: Select staff (specific, any, or no preference)
- [ ] Step 3: Select date — calendar view with availability indicators
- [ ] Step 4: Select time slot — horizontal scroll, grouped by morning/afternoon/evening
- [ ] Step 5: Review and confirm — service summary, price breakdown, cancellation policy
- [ ] Step 6: Payment (if required) or confirm (pay at venue)
- [ ] Real-time slot availability with 5-min hold during selection
- [ ] Add notes/allergies/preferences (500 char limit)
- [ ] Booking confirmation screen with add-to-calendar, directions, share
- [ ] SMS and push confirmation immediately upon success
- [ ] Support for recurring bookings (weekly/monthly)
- [ ] Group booking: invite others via link, each manages own payment

**Edge Cases**:
- Slot taken during selection: notify user, suggest nearest alternatives
- Provider goes offline mid-booking: graceful error with retry

---

### 2.8 Appointment Management (Priority: P0)

**User Story**: As a customer, I want to manage my appointments so that I can adapt to schedule changes.

**Acceptance Criteria**:
- [ ] Upcoming/past/cancelled tabs in appointment list
- [ ] Detail view: service, staff, time, location, directions, contact, receipt
- [ ] Reschedule: search new slots, preserve original service/staff preferences
- [ ] Cancel with reason selection; enforce provider cancellation policy
- [ ] Late cancellation fees displayed and charged if applicable
- [ ] No-show recording with impact on future bookings
- [ ] Rebook same service with one tap
- [ ] Add to personal calendar (Google, Apple, Outlook)
- [ ] Check-in QR code for contactless arrival

---

### 2.9 Favorites (Priority: P1)

**User Story**: As a customer, I want to save favorite businesses so that I can rebook quickly.

**Acceptance Criteria**:
- [ ] Heart toggle on business cards and detail pages
- [ ] Favorites list with search and filter
- [ ] Quick rebook from favorite (skips to slot selection)
- [ ] Favorite businesses highlighted in search results
- [ ] Push notification when favorite adds new service or promotion
- [ ] Sync across devices for authenticated users

---

### 2.10 User Profile (Priority: P1)

**User Story**: As a customer, I want to manage my personal information and preferences so that my experience is personalized.

**Acceptance Criteria**:
- [ ] Profile photo, name, email, phone, birthday (for birthday offers)
- [ ] Preferred language and notification settings
- [ ] Saved payment methods (PCI-compliant tokenization)
- [ ] Address book for home/work locations
- [ ] Booking preferences: default reminder time, preferred contact method
- [ ] Privacy settings: profile visibility, data sharing opt-outs
- [ ] GDPR data export and deletion requests
- [ ] Referral code and credits tracking

---

### 2.11 Availability & Slot Computation (Priority: P0)

**User Story**: As a system, I need accurate real-time availability so that double-bookings are prevented.

**Acceptance Criteria**:
- [ ] Compute available slots based on: staff schedules, existing bookings, service duration, buffer time, business hours
- [ ] Support variable service durations (e.g., 30-90 min hair coloring)
- [ ] Staff-specific availability (part-time, vacation, sick leave)
- [ ] Block time for internal use (training, cleaning)
- [ ] Optimistic locking: 5-minute hold on selected slot
- [ ] Cache frequently accessed schedules (Redis, 30-second TTL)
- [ ] Handle timezone correctly for cross-timezone bookings
- [ ] Overbooking protection with configurable thresholds
- [ ] Waitlist: notify when preferred slot becomes available

**Algorithm Requirements**:
- Slot generation: O(n) where n = schedule window days
- Real-time updates via WebSocket or SSE

---

### 2.12 Shared Types & Design System (Priority: P0)

**User Story**: As a team, we need consistent UI/UX patterns so that development is efficient and users have a cohesive experience.

**Acceptance Criteria**:
- [ ] Component library: buttons, inputs, cards, modals, toasts, skeletons, date/time pickers
- [ ] Color system: primary (brand), semantic (success, warning, error, info), neutrals
- [ ] Typography: 2-font system (display, body), 8-scale sizes
- [ ] Spacing: 4px base grid, 12 sizes
- [ ] Animation standards: 150ms micro-interactions, 300ms transitions
- [ ] Accessibility: WCAG 2.1 AA minimum, screen reader support, focus management
- [ ] Dark mode support with system preference detection
- [ ] Shared TypeScript types across frontend, backend, and API contracts
- [ ] Icon set: 200+ icons, consistent stroke width, 24px default

---

### 2.13 Reviews & Ratings (Priority: P1)

**User Story**: As a customer, I want to read and write reviews so that I can make informed choices and share my experience.

**Acceptance Criteria**:
- [ ] 5-star rating with half-star precision
- [ ] Review components: rating, text (optional, 10-1000 chars), photos (up to 5), service received, date, verified badge
- [ ] Reviews visible after 24-hour cooling period post-appointment
- [ ] Review response by business owner
- [] Flag inappropriate reviews for moderation
- [ ] Rating breakdown by category (service, staff, ambiance, value)
- [ ] Sort reviews: most relevant, newest, highest/lowest rating
- [ ] Filter by: verified only, with photos, specific service
- [ ] Review prompt: push notification 2 hours post-appointment
- [ ] Incentivize reviews with loyalty points (optional, configurable)

**Moderation**:
- Auto-approve with keyword filtering
- Human review queue for flagged content
- Appeal process for removed reviews

---

### 2.14 Payment Integration (Priority: P0)

**User Story**: As a customer, I want to pay securely so that my booking is confirmed.

**Acceptance Criteria**:
- [ ] Stripe integration: cards, Apple Pay, Google Pay, SEPA, Buy Now Pay Later (Klarna/Afterpay)
- [ ] Support "pay at venue" option (provider-configurable)
- [ ] Deposit/partial payment option
- [ ] Full refund, partial refund, and store credit workflows
- [ ] Receipt generation with tax breakdown
- [ ] Saved payment methods with 3D Secure for first use
- [ ] Failed payment retry with alternative method suggestion
- [ ] Subscription/membership payments for recurring clients
- [ ] Tip integration (pre-set percentages, custom amount)

**Security**: PCI DSS Level 1 compliance via Stripe; never store raw card data

---

### 2.15 Notifications (Priority: P1)

**User Story**: As a customer, I want timely updates so that I don't miss my appointments.

**Acceptance Criteria**:
- [ ] Push notifications: booking confirmed, 24-hour reminder, 1-hour reminder, check-in prompt, cancellation, rescheduled by provider
- [ ] SMS fallback for critical notifications when push disabled
- [ ] Email: booking confirmation, receipt, review request, marketing (opt-in)
- [ ] In-app notification center with unread badges
- [ ] Notification preferences: channel, frequency, quiet hours (22:00-08:00 default)
- [ ] Deep links from notifications to relevant screens
- [ ] Batch non-urgent notifications to avoid spam

---

### 2.16 Provider / Business Owner Portal (Priority: P0)

**User Story**: As a business owner, I want to manage my presence and bookings so that I can grow my client base efficiently.

**Acceptance Criteria**:
- [ ] Dashboard: today's appointments, revenue, new clients, occupancy rate
- [ ] Calendar view: day/week/month, drag-to-reschedule, color-coded by status
- [ ] Booking management: confirm, reschedule, cancel with customer notification
- [ ] Client database: profiles, visit history, preferences, notes (HIPAA-aware)
- [ ] Service management: CRUD services, pricing, duration, staff associations
- [ ] Staff management: schedules, permissions, commission tracking
- [ ] Settings: business hours, break times, cancellation policy, booking lead time
- [ ] Marketing: promotions, loyalty program, referral codes
- [ ] Reports: revenue, bookings by service/staff, no-show rate, peak hours
- [ ] Multi-location support with consolidated reporting
- [ ] Mobile-responsive web app; native app optional P2

---

### 2.17 Admin Dashboard (Priority: P1)

**User Story**: As a platform admin, I need oversight and control so that marketplace quality is maintained.

**Acceptance Criteria**:
- [ ] User management: search, view, suspend, impersonate
- [ ] Business verification workflow: document upload, manual review, approval/rejection with reason
- [ ] Content moderation: review flagged reviews, businesses, images
- [ ] Financial overview: GMV, revenue share, payouts to providers
- [ ] Dispute resolution: booking conflicts, refund requests, chargeback handling
- [ ] Analytics: cohort retention, conversion funnel, geographic distribution
- [ ] Feature flags and A/B test configuration
- [ ] System health: API latency, error rates, job queue depth
- [ ] Audit log for all admin actions

---

### 2.18 Background Jobs (BullMQ) (Priority: P0)

**User Story**: As a system, I need reliable background processing so that user-facing performance is not degraded.

**Acceptance Criteria**:
- [ ] Job types: notification dispatch, payment processing, report generation, data export, search index updates, image processing, reminder scheduling
- [ ] Retry policy: 3 attempts with exponential backoff (5min, 25min, 125min)
- [ ] Dead letter queue for failed jobs after retries exhausted
- [ ] Job priority: critical (payment), high (notifications), normal (reports), low (analytics)
- [ ] Scheduled jobs: daily reports, cleanup tasks, birthday promotions
- [ ] Job observability: dashboard with queue depth, processing rate, failure rate
- [ ] Rate limiting per job type to prevent external API throttling
- [ ] Job idempotency keys to prevent duplicate processing

---

## 3. Non-Functional Requirements

| Aspect | Requirement |
|--------|-------------|
| Performance | P95 API response <200ms; page load <2s |
| Scalability | Support 10k concurrent users; horizontal scaling |
| Security | OWASP Top 10 mitigation; annual penetration testing |
| Compliance | GDPR, CCPA, PCI DSS |
| Reliability | 99.9% uptime SLA; <0.1% booking failure rate |
| Localization | i18n ready; launch with EN, FR, DE, ES |

---

## 4. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Search, Business Detail, Booking, Payments, Provider Portal | 8 weeks |
| V1.1 | Map, Favorites, Reviews, Notifications, Appointments | 4 weeks |
| V1.2 | Admin, Background Jobs, Analytics, Marketing Tools | 4 weeks |
| V2.0 | AI Recommendations, Subscription, Marketplace | 8 weeks |

---

## 5. Open Questions

1. International expansion timeline and payment methods
2. Insurance/liability coverage for service disputes
3. Integration with existing salon management software (Salonist, Vagaro)
4. AI-powered features: chatbot, dynamic pricing, demand forecasting

---

*Document Version: 1.0*
*Last Updated: 2024*
*Owner: Alex, Product Owner*