# Planity Clone — Product Specification

## 1. Overview

### 1.1 Product Vision
Planity Clone is a mobile-first marketplace connecting consumers with local service businesses (beauty, wellness, fitness, healthcare). Consumers discover, book, and manage appointments. Business owners manage their presence, availability, and client base. Admin oversees platform health and growth.

### 1.2 Target Users
- **Consumers**: 18-55, smartphone-native, value convenience and reviews
- **Business Owners**: SMB service providers, limited technical skills, need simple scheduling tools
- **Admin**: Platform operators, need visibility and control

### 1.3 Platform
- iOS & Android native apps (React Native/Flutter)
- Web app for Business Owner Portal and Admin Dashboard
- Shared backend (Node.js/PostgreSQL)

---

## 2. Feature Specifications

### 2.1 User Authentication (Priority: P0)

**User Story**: As a user, I want to create an account and log in securely so I can access personalized features.

**Acceptance Criteria**:
- [ ] User can register with email/password, phone number, or OAuth (Google, Apple, Facebook)
- [ ] Password minimum: 8 chars, 1 uppercase, 1 number, 1 special character
- [ ] Email verification required before booking
- [ ] Phone verification via SMS for high-trust actions (first booking, payment)
- [ ] JWT access token (15min) + refresh token (7 days) with secure storage
- [ ] Biometric login option (Face ID / Fingerprint) after initial setup
- [ ] "Remember me" extends session to 30 days
- [ ] Password reset via email with 1-hour expiry link
- [ ] Account deletion with 30-day grace period and data export
- [ ] Rate limiting: 5 failed login attempts triggers 30-min lockout + email alert

**Business Rules**:
- One account per email; phone number must be unique
- Guest checkout allowed for browsing; account required to book

---

### 2.2 Guest Browse & Explore (Priority: P0)

**User Story**: As an unregistered user, I want to browse businesses and services without creating an account.

**Acceptance Criteria**:
- [ ] Full search and filter access without login
- [ ] Business detail pages viewable
- [ ] Map view accessible with business pins
- [ ] Prompt to create account appears on "Book" action
- [ ] Guest session data (favorites, recent searches) persisted for 7 days via device ID
- [ ] On registration, guest data merges to new account

---

### 2.3 Business Search & Discovery (Priority: P0)

**User Story**: As a consumer, I want to find relevant service providers quickly.

**Acceptance Criteria**:
- [ ] Text search across: business name, service name, staff name, tags
- [ ] Autocomplete with suggestions after 2 characters, ranked by popularity
- - [ ] Recent searches stored (last 10), deletable
- [ ] Filters: category, subcategory, price range, rating (4.0+), distance, availability today, gender of staff, amenities
- [ ] Sort options: relevance, distance, rating, price (low-high), availability (soonest first)
- [ ] Results display: card with image, name, rating, distance, starting price, next available slot
- [ ] Pagination: 20 results per page, infinite scroll on mobile
- [ ] Empty state with "broaden search" suggestions
- [ ] Search history synced across devices for logged-in users

**Performance**: Search results < 500ms for 95th percentile

---

### 2.4 Map-based Search (Priority: P0)

**User Story**: As a consumer, I want to see businesses on a map to choose by location.

**Acceptance Criteria**:
- [ ] Toggle between list and map views on search results
- [ ] Map shows business pins with price indicator or category icon
- [ ] Clustering for dense areas (>10 pins within 50px)
- [ ] User location dot with accuracy radius
- [ ] Search this area button on map pan
- [ ] Pin tap reveals preview card with key info
- [ ] Directions button opens native maps app
- [ ] Default zoom shows businesses within 5km; adjust based on result density
- [ ] Offline: cache last viewed map tiles

---

### 2.5 Business Detail View (Priority: P0)

**User Story**: As a consumer, I want comprehensive business information to make informed booking decisions.

**Acceptance Criteria**:
- [ ] Hero image carousel (max 10 images, min 1)
- [ ] Business name, verified badge, category, rating, review count
- [ ] Address with copy and directions
- [ ] Hours: current day highlighted, expandable to full week
- [ ] "Open now" / "Closes at X" / "Closed" status indicator
- [ ] Phone number with tap-to-call, WhatsApp integration if configured
- [ ] Description (max 2000 chars), languages spoken, year established
- [ ] Services list with pricing, duration, description
- [ ] Staff profiles with photos, bios, specialties
- [ ] Reviews section (see 2.13)
- [ ] Similar businesses carousel
- [ ] Share button (deep link, native share sheet)
- [ ] Report business button (spam, inaccurate info)

---

### 2.6 Service Categories (Priority: P0)

**User Story**: As a platform, we need a structured category system for organization and discovery.

**Acceptance Criteria**:
- [ ] Hierarchical: Category > Subcategory > Service
- [ ] Categories: Hair, Beauty & Spa, Nails, Massage, Fitness, Medical Aesthetics, Tattoo, Pet Services, etc.
- [ ] Each category has icon, cover image, trending flag
- [ ] Admin-managed; new categories require approval
- [ ] Businesses can select up to 3 primary categories
- [ ] Services linked to categories for filtering accuracy
- [ ] Category landing page with featured businesses, trending services

---

### 2.7 Booking Flow (Priority: P0)

**User Story**: As a consumer, I want to book appointments with minimal friction.

**Acceptance Criteria**:
- [ ] Step 1: Select service(s) from business offerings
- [ ] Step 2: Select staff (specific or "no preference")
- [ ] Step 3: View available slots (see 2.11 for slot computation)
- [ ] Step 4: Confirm details, apply promo code, select payment method
- [ ] Step 5: Receive booking confirmation with calendar invite
- [ ] Multi-service booking: sequential or parallel scheduling based on staff/resource availability
- [ ] Guest booking: collect name, phone, email; auto-create account post-booking
- [ ] Booking modification: change time up to 2 hours before (business-configurable)
- [ ] Booking cancellation with refund policy display
- [ ] Waitlist option for fully booked preferred slots
- [ ] "Book again" one-tap from past appointments

**Edge Cases**:
- Slot taken during flow: offer next 3 alternatives
- Business closes mid-service: warn and block

---

### 2.8 Appointment Management (Priority: P0)

**User Story**: As a consumer, I want to view and manage my appointments.

**Acceptance Criteria**:
- [ ] Upcoming appointments list with countdown (today, tomorrow, future)
- [ ] Past appointments with rebook option
- [ ] Appointment detail: business, service, staff, time, location, QR code for check-in
- [ ] Reschedule: select new slot, confirm change, notify business
- [ ] Cancel with reason selection (mandatory), refund status
- [ ] Add to calendar (iCal/Google/Outlook)
- [ ] Rate and review prompt 2 hours post-appointment
- [ ] Push notification reminders: 24h, 2h, 15min before

---

### 2.9 Favorites (Priority: P1)

**User Story**: As a consumer, I want to save businesses for quick access.

**Acceptance Criteria**:
- [ ] Heart icon on business cards and detail page
- [ ] Favorites list with search and sort (recently added, name, distance)
- [ ] Quick book from favorites list
- [ ] Availability indicator (green dot = slots today)
- [ ] Sync across devices for logged-in users
- [ ] Share favorites list (optional, social feature)
- [ ] Limit: 200 favorites per user

---

### 2.10 User Profile (Priority: P1)

**User Story**: As a user, I want to manage my personal information and preferences.

**Acceptance Criteria**:
- [ ] Profile photo (camera/gallery upload, crop to circle)
- [ ] Name, phone, email (editable with re-verification)
- [ ] Birthday (optional, for birthday offers)
- [ ] Gender (optional, for service matching)
- [ ] Preferred language, notification preferences
- [ ] Payment methods management
- [ ] Booking history with filters (date, business, status)
- [ ] Loyalty points / rewards balance (if applicable)
- [ ] Referral code and sharing
- [ ] Privacy settings: profile visibility, data download, account deletion

---

### 2.11 Availability & Slot Computation (Priority: P0 — Core Engine)

**User Story**: As a platform, we need accurate, real-time availability computation.

**Acceptance Criteria**:
- [ ] Business defines: operating hours per day, break times, holidays
- [ ] Staff-level availability overrides business hours
- [ ] Service duration + buffer time = slot consumption
- [ ] Resource constraints: room, equipment, station
- [ ] Slot generation: 15-minute increments by default, business-configurable
- [ ] Real-time blocking on booking initiation (5-min hold, extendable)
- [ ] Release hold on payment failure or timeout
- [ ] Recurring appointment patterns supported
- [ ] Blackout dates for business/staff
- [ ] Overbooking protection: strict or waitlist mode
- [ ] Performance: compute 7-day availability for single staff < 100ms

**Algorithm Requirements**:
- Consider timezone (business, user, staff)
- Handle daylight saving transitions
- Cache daily availability, invalidate on change

---

### 2.12 Shared Types & Design System (Priority: P0 — Foundation)

**User Story**: As a development team, we need consistent UI/UX across platforms.

**Acceptance Criteria**:
- [ ] Design tokens: colors (primary, secondary, semantic), typography (font family, sizes, weights), spacing scale, border radius, shadows
- [ ] Component library: buttons, inputs, cards, modals, bottom sheets, lists, avatars, badges, skeleton loaders, empty states, error states
- [ ] Accessibility: minimum 4.5:1 contrast, touch targets 44x44dp, screen reader labels, dynamic type support
- [ ] Dark mode support
-(refresh indicator, haptic feedback on booking confirmation)
- [ ] Shared TypeScript types: User, Business, Service, Appointment, Review, Payment, Notification
- [ ] API response schemas with Zod validation
- [ ] Error handling patterns: user-friendly messages, retry actions, offline state

---

### 2.13 Reviews & Ratings (Priority: P1)

**User Story**: As a consumer, I want to read and write reviews to make informed choices.

**Acceptance Criteria**:
- [ ] 5-star rating with half-star precision
- [ ] Review components: overall rating, service-specific rating, staff rating (optional), text (min 10, max 1000 chars), photo upload (max 5)
- [ ] Verified badge: only post-appointment reviewers
- [ ] Review response by business owner
- [ ] Flag inappropriate reviews; admin moderation queue
- [ ] Review helpfulness voting
- [ ] Average rating recalculated daily; exclude reviews older than 2 years
- [ ] Sort reviews: most recent, highest rated, verified only
- [ ] Business cannot delete reviews; can respond publicly

---

### 2.14 Payment Integration (Priority: P0)

**User Story**: As a consumer, I want secure, flexible payment options.

**Acceptance Criteria**:
- [ ] Payment methods: credit/debit (Stripe), Apple Pay, Google Pay, PayPal
- [ ] Business-configurable: full prepay, deposit, or pay-at-venue
- [ ] Hold payment method without charge (for pay-at-venue)
- [ ] No-show protection: charge X% if missed (business policy, disclosed)
- [ ] Refund processing: automatic (cancellation policy) or manual (dispute)
- [ ] Promo codes: percentage, fixed amount, free service, first-time only
- [ ] Gift cards and credits balance
- [ ] Receipt emailed and in-app
- [ ] PCI compliance via tokenization; no raw card data stored

---

### 2.15 Notifications (Priority: P1)

**User Story**: As a user, I want timely, relevant notifications.

**Acceptance Criteria**:
- [ ] Channels: push, SMS, email, in-app
- [ ] Types: booking confirmation, reminder, modification, cancellation, promotion, review prompt, waitlist available, payment issues
- [ ] User preference: channel per type, quiet hours (default 22:00-08:00), frequency caps
- [ ] Rich push: action buttons (confirm, reschedule, cancel)
- [ ] Delivery tracking: sent, delivered, opened
- [ ] Unsubscribe per channel with one-tap re-enable
- [ ] Notification inbox with 30-day history

---

### 2.16 Provider / Business Owner Portal (Priority: P0)

**User Story**: As a business owner, I want to manage my presence and operations.

**Acceptance Criteria**:
- [ ] Dashboard: today's appointments, revenue, new clients, occupancy rate
- [ ] Calendar view: day, week, month; drag-to-reschedule
- [ ] Appointment actions: confirm, reschedule, cancel, mark no-show, add notes
- [ ] Client management: profiles, visit history, notes, marketing consent
- [ ] Staff management: profiles, schedules, permissions, commission tracking
- [ ] Service management: CRUD, pricing, duration, online booking toggle
- [ ] Availability rules: hours, breaks, time off
- [ ] Settings: cancellation policy, booking lead time, deposit requirements
- [ ] Analytics: bookings, revenue, cancellation rate, popular services, staff performance
- [ ] Messaging: respond to client inquiries, review responses
- [ ] Mobile-responsive web app; native app companion (P2)

---

### 2.17 Admin Dashboard (Priority: P1)

**User Story**: As platform admin, I need oversight and control tools.

**Acceptance Criteria**:
- [ ] Business onboarding approval workflow
- [ ] User management: search, view, suspend, impersonate
- [ ] Business management: verify, feature, suspend, analytics access
- [ ] Content moderation: review flags, dispute resolution
- [ ] Financial overview: GMV, revenue by category, payout management
- [ ] Promo campaign creation and tracking
- [ ] System health: error rates, API latency, queue depth
- [ ] Role-based access: super admin, support, finance, ops
- [ ] Audit log: all admin actions with before/after states

---

### 2.18 Background Jobs (BullMQ) (Priority: P0 — Infrastructure)

**User Story**: As a platform, we need reliable async processing.

**Acceptance Criteria**:
- [ ] Job types: email sending, SMS, push notification delivery, payment webhooks, slot cache warming, report generation, data exports, image processing, search index updates
- [ ] Retry policy: 3 attempts with exponential backoff (5s, 25s, 125s)
- [ ] Dead letter queue for failed jobs; admin alert after 3 failures
- [ ] Job priority: critical (payments), high (notifications), normal (emails), low (reports)
- [ ] Scheduled jobs: daily reports, nightly cache refresh
- [ ] Job progress tracking for long-running tasks
- [ ] Concurrency control per queue type
- [ ] Monitoring: queue depth, processing rate, failure rate, average duration

---

## 3. Non-Functional Requirements

| Aspect | Requirement |
|--------|-------------|
| Performance | App cold start < 3s; page load < 2s; API response < 200ms (p95) |
| Availability | 99.9% uptime; scheduled maintenance windows |
| Security | OWASP Top 10 compliance; annual penetration test |
| Privacy | GDPR, CCPA compliant; data retention policies |
| Scalability | Support 100k concurrent users; 10M appointments/month |
| Localization | FR, EN, DE, ES, IT launch; RTL for future |

## 4. Success Metrics

| Metric | Target |
|--------|--------|
| Monthly Active Users (MAU) | 500k by month 12 |
| Booking conversion rate | > 15% search-to-book |
| NPS | > 50 |
| Business retention | > 90% at 6 months |
| App store rating | > 4.5 |
| Support tickets | < 2% of monthly active |

## 5. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Guest Browse, Search, Business Detail, Booking, Appointments, Payment, Owner Portal basic | 8 weeks |
| V1 | Map, Favorites, Reviews, Notifications, Admin basic | +4 weeks |
| V2 | Waitlist, Loyalty, Analytics, Admin full, Background Jobs optimization | +6 weeks |
| V3 | Social features, AI recommendations, international expansion | +12 weeks |

---

*Document version: 1.0*
*Last updated: 2024*
*Owner: Alex, Product Owner*