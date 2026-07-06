# Planity Clone — Product Specification

## 1. Overview

### 1.1 Product Vision
Build a marketplace platform connecting customers with beauty/wellness service providers, enabling seamless discovery, booking, and appointment management.

### 1.2 Target Users
- **Customers**: Book beauty/wellness appointments
- **Providers/Business Owners**: Manage schedules, services, and staff
- **Admins**: Platform oversight and support

### 1.3 Success Metrics
- Booking conversion rate >15%
- Search-to-book time <3 minutes
- Provider onboarding <10 minutes
- No-show rate <5%

---

## 2. Feature Specifications

### 2.1 User Authentication [P0]

**User Stories**
- As a customer, I want to register/login so I can book appointments
- As a provider, I want secure access to my business portal

**Acceptance Criteria**
- [ ] Email/password registration with validation (8+ chars, 1 uppercase, 1 number)
- [ ] Login with email/password or magic link
- [ ] OAuth 2.0: Google, Apple, Facebook
- [ ] JWT tokens with 7-day refresh rotation
- [ ] Password reset via email (expires in 1 hour)
- [ ] Role-based access: customer, provider, admin
- [ ] Account lockout after 5 failed attempts (30 min)
- [ ] Session management: max 5 concurrent sessions

**Edge Cases**
- Social account email conflicts with existing email account
- Token expiry mid-booking flow (grace period 5 min)

---

### 2.2 Guest Browse & Explore [P0]

**User Stories**
- As an unauthenticated user, I want to browse businesses without registering

**Acceptance Criteria**
- [ ] Full search and discovery without login
- [ ] View business details, services, reviews, availability
- [ ] Prompt login at booking initiation (not before)
- [ ] Persist guest session data for 24 hours post-login conversion
- [ ] Guest session merges with account on registration

**Analytics**
- Track guest-to-registered conversion funnel
- A/B test login prompt timing

---

### 2.3 Business Search & Discovery [P0]

**User Stories**
- As a customer, I want to find businesses by name, service, or location

**Acceptance Criteria**
- [ ] Full-text search across: business name, service names, provider names, category tags
- [ ] Autocomplete with suggestions in <200ms
- [ ] Recent searches (last 10, deletable)
- [ ] Trending searches section
- [ ] Search history sync across devices (when logged in)
- [ ] Empty state with popular categories
- [ ] Typo tolerance (Levenshtein distance ≤2)
- [ ] Results ranking: relevance score = text match × proximity × rating × booking velocity

**Filters**
- [ ] Category (multi-select)
- [ ] Price range (min/max)
- [ ] Rating (4+, 4.5+)
- [ ] Distance (km/mi toggle)
- [ ] Availability today/this week
- [ ] Gender of service provider (if applicable)
- [ ] Amenities (parking, wheelchair accessible, etc.)

**Sorting**
- [ ] Relevance (default)
- [ ] Distance
- [ ] Rating (highest first)
- [ ] Price (lowest first)
- [ ] Most reviewed

---

### 2.4 Map-based Search [P0]

**User Stories**
- As a customer, I want to see businesses on a map to choose by location

**Acceptance Criteria**
- [ ] Interactive map with business pins (clustering at zoom levels)
- [ ] Current location detection (with permission prompt)
- [ ] Search by address, city, or "near me"
- [ ] Map/list view toggle with synchronized state
- [ ] Pin tap reveals business card preview
- [ ] Custom map markers by category
- [ ] Boundary search: drag map to search visible area
- [ ] Default zoom: 12km radius, adjustable

**Performance**
- [ ] Map tile loading <2s on 3LTE
- [ ] Pin rendering: virtualized for >100 results

---

### 2.5 Business Detail View [P0]

**User Stories**
- As a customer, I want comprehensive business information to make a booking decision

**Acceptance Criteria**
- [ ] Header: business name, rating, review count, favorite toggle, share
- [ ] Photo gallery: up to 20 images, swipeable, full-screen viewer
- [ ] Business info: address (with directions), phone, hours, website
- [ ] Service menu with pricing and duration
- [ ] Staff/professional profiles with photos and specialties
- [ ] Real-time availability calendar preview
- [ ] Reviews summary and breakdown (1-5 stars)
- [ ] "Book Now" CTA sticky on scroll
- [ ] Similar businesses carousel

**Share Functionality**
- [ ] Deep link generation
- [ ] Native share sheet (iOS/Android)
- [ ] Copy link to clipboard

---

### 2.6 Service Categories [P0]

**User Stories**
- As a customer, I want to browse by category to discover services

**Acceptance Criteria**
- [ ] Hierarchical categories: Hair, Nails, Spa, Massage, Barber, etc.
- [ ] Category icons and color coding
- [ ] Subcategories: Hair > Cut, Color, Styling, Treatment
- [ ] Category landing page with featured businesses
- [ ] Trending services per category
- [ ] Category-based SEO pages

**Admin Configurable**
- [ ] Add/edit/disable categories
- [ ] Assign businesses to multiple categories
- [ ] Category-specific attributes (e.g., hair length for cuts)

---

### 2.7 Booking Flow [P0]

**User Stories**
- As a customer, I want to book an appointment in minimal steps

**Acceptance Criteria**
- [ ] Step 1: Select service(s) with optional add-ons
- [ ] Step 2: Select provider or "no preference"
- [ ] Step 3: Select date/time from available slots
- [ ] Step 4: Confirm details, apply promo code
- [ ] Step 5: Payment (if required) or confirm
- [ ] Booking confirmation with calendar invite (.ics)
- [ ] Booking reference number (unique, 8 chars)

**Slot Selection**
- [ ] Horizontal date picker (7 days forward, scrollable to 60 days)
- [ ] Time slots shown in local timezone
- [ ] Highlight preferred times (morning/afternoon/evening)
- [ ] "First available" shortcut

**Validation**
- [ ] Prevent double-booking (optimistic locking with retry)
- [ ] Minimum booking notice (configurable per business, default 2 hours)
- [ ] Maximum advance booking (configurable, default 90 days)
- [ ] Service duration + buffer time enforcement

**Edge Cases**
- [ ] Slot taken during selection: refresh with notification
- [ ] Provider becomes unavailable: suggest alternatives
- [ ] Multiple services: validate sequential availability

---

### 2.8 Appointment Management [P0]

**Customer Actions**
- [ ] View upcoming and past appointments
- [ ] Reschedule (up to configured cutoff, default 24h before)
- [ ] Cancel with reason selection
- [ ] Add to calendar (Google, Apple, Outlook)
- [ ] Rebook same service with one tap
- [ ] Arrival check-in (QR or button)

**Provider Actions**
- [ ] Daily/weekly calendar view
- [ ] Confirm, reschedule, cancel appointments
- [ ] Mark no-show
- [ ] Add walk-in appointments
- [ ] Block time slots (breaks, unavailability)
- [ ] Set recurring availability patterns

**Status States**
- pending → confirmed → checked-in → in-progress → completed → reviewed
- pending → cancelled (by customer/provider/system)
- confirmed → no-show

---

### 2.9 Favorites [P1]

**User Stories**
- As a customer, I want to save favorite businesses for quick access

**Acceptance Criteria**
- [ ] Toggle favorite from business card or detail
- [ ] Favorites list with quick book action
- [ ] Favorite count on business (public)
- [ ] Push notification for new availability or promotions from favorites
- [ ] Sync across devices
- [ ] Maximum 200 favorites per user

---

### 2.10 User Profile [P1]

**Customer Profile**
- [ ] Avatar, name, phone, email (editable)
- [ ] Preferred location (for search defaults)
- [ ] Notification preferences (push, email, SMS granular)
- [ ] Payment methods (tokenized)
- [ ] Booking history with receipts
- [ ] Loyalty/points balance (if applicable)

**Data Management**
- [ ] Export personal data (GDPR)
- [ ] Account deletion with 30-day grace period
- [ ] Marketing consent toggle

---

### 2.11 Availability & Slot Computation [P0]

**Architecture**
- [ ] Pre-computed slot index updated on any availability change
- [ ] Real-time slot validation at booking time

**Rules Engine**
- [ ] Working hours (per day, with exceptions)
- [ ] Break blocks (recurring and one-off)
- [ ] Existing appointments (respect duration + buffer)
- [ ] Service duration + inter-service buffer
- [ ] Staff-specific availability
- [ ] Business holidays

**Slot Generation**
- [ ] Generate in 15-minute increments
- [ ] Respect minimum booking notice
- [ ] Maximum look-ahead window
- [ ] Batch compute for next 90 days, update incrementally

**Performance**
- [ ] Slot query <100ms for single business
- [ ] Slot query <500ms for search results (batch)

---

### 2.12 Shared Types & Design System [P0]

**Design System**
- [ ] Component library: buttons, inputs, cards, modals, toasts
- [ ] Color palette: primary, secondary, semantic (success, warning, error)
- [ ] Typography scale: 6 levels
- [ ] Spacing system: 4px base grid
- [ ] Animation standards: 200ms ease-in-out
- [ ] Dark mode support

**Shared Types (TypeScript)**
- [ ] User, Business, Service, Appointment, Slot, Review entities
- [ ] API request/response contracts
- [ ] Enums for statuses, roles, categories
- [ ] Zod schemas for runtime validation

**Accessibility**
- [ ] WCAG 2.1 AA compliance
- [ ] Screen reader labels
- [ ] Focus management
- [ ] Minimum touch target 44x44dp

---

### 2.13 Reviews & Ratings [P1]

**User Stories**
- As a customer, I want to read and write reviews to make informed choices

**Acceptance Criteria**
- [ ] 5-star rating with optional text review (min 10 chars)
- [ ] Review after completed appointment (prompt 24h post)
- [ ] Photo attachments (max 5, 5MB each)
- [ ] Business response to reviews
- [ ] Mark as verified booking
- [ ] Report inappropriate content
- [ ] Review helpfulness voting
- [ ] Average ratingiums and filters (most recent, highest, lowest, verified only)

**Moderation**
- [ ] Auto-flag: profanity, all-caps, links
- [ ] Admin review queue for flagged content
- [ ] Appeal process for rejected reviews

---

### 2.14 Payment Integration [P0]

**Supported Methods**
- [ ] Credit/Debit cards (Stripe)
- [ ] Apple Pay / Google Pay
- [ ] PayPal
- [ ] Buy Now, Pay Later (Kl, Afterpay - future)

**Flows**
- [ ] Full payment at booking
- [ ] Deposit + balance at appointment
- [ ] Pay at venue (no pre-payment)
- [ ] Gift card redemption

**Security**
- [ ] PCI DSS compliant (Stripe Elements)
- [ ] 3D Secure for applicable transactions
- [ ] Idempotency keys for retry safety

**Business Model**
- [ ] Platform fee: configurable % per transaction
- [ ] Provider payout: weekly to linked bank account
- [ ] Refund policy: full, partial, or credit (business configurable)

---

### 2.15 Notifications [P1]

**Channels**
- [ ] Push (Firebase Cloud Messaging)
- [ ] Email (SendGrid/Postmark)
- [ ] SMS (Twilio)

**Triggers**
| Event | Timing | Channels |
|-------|--------|----------|
| Booking confirmed | Immediate | Push + Email |
| Appointment reminder | 24h, 2h before | Push + SMS |
| Reschedule/cancel | Immediate | All |
| Review request | 24h post-appointment | Push + Email |
| Promotion from favorite | On business action | Push |
| Payment receipt | Immediate | Email |

**Preferences**
- [ ] Granular opt-in per channel per event type
- [ ] Quiet hours (no push 22:00-08:00 local time)
- [ ] Frequency caps for marketing

---

### 2.16 Provider / Business Owner Portal [P0]

**Onboarding**
- [ ] Business registration form
- [ ] Document verification (ID, business license)
- [ ] Stripe Connect account setup
- [ ] Tutorial walkthrough (skippable, replayable)

**Dashboard**
- [ ] Today's appointments with status
- [ ] Revenue summary (day/week/month)
- [ ] New bookings vs. cancellations
- [ ] Customer acquisition metrics

**Business Settings**
- [ ] Profile info, photos, description
- [ ] Service menu: add, edit, price, duration, assign staff
- [ ] Staff management: invite, permissions, schedule
- [ ] Availability calendar
- [ ] Booking policies: cancellation, no-show, notice period
- [ ] Notification preferences

**Customer Management**
- [ ] Customer database with visit history
- [ ] Notes per customer (private to business)
- [ ] Marketing tools: promotions, re-engagement campaigns

---

### 2.17 Admin Dashboard [P1]

**Overview**
- [ ] Platform metrics: users, bookings, revenue, growth
- [ ] Real-time activity feed
- [ ] Alert system for anomalies

**Business Management**
- [ ] Business list with status (pending, active, suspended)
- [ ] Verification workflow
- [ ] Featured business curation
- [ ] Commission rate configuration

**User Management**
- [ ] Customer search and profile view
- [ ] Provider account actions
- [ ] Role assignment

**Content Moderation**
- [ ] Review queue for flagged content
- [ ] Business photo approval
- [ ] Dispute resolution tools

**System**
- [ ] Category and configuration management
- [ ] Feature flags for gradual rollout
- [ ] Audit logs for all admin actions

---

### 2.18 Background Jobs (BullMQ) [P0]

**Job Definitions**

| Queue | Job | Priority | Schedule |
|-------|-----|----------|----------|
| `notifications` | Send push/email/SMS | High | On event |
| `slot-computation` | Recalculate availability | High | On change + nightly |
| `payments` | Process payout | High | Daily |
| `reports` | Generate analytics | Medium | Daily/weekly |
| `data-exports` | GDPR data export | Low | On request |
| `cleanup` | Purge old data | Low | Nightly |
| `reminders` | Appointment reminders | High | Configured before appt |

**Requirements**
- [ ] Retry with exponential backoff (max 5 attempts)
- [ ] Dead letter queue for failed jobs
- [ ] Job progress tracking for long-running tasks
- [ ] Rate limiting for external APIs
- [ ] Monitoring: queue depth, processing time, failure rate

---

## 3. Non-Functional Requirements

### 3.1 Performance
- App launch <3s on mid-tier device
- API response <200ms (p95)
- Image loading with progressive blur-up
- Offline mode: view cached appointments, queue actions

### 3.2 Security
- OWASP Mobile Top 10 compliance
- Certificate pinning
- Biometric authentication option
- Data encryption at rest and in transit

### 3.3 Compliance
- GDPR data handling
- CCPA compliance
- PCI DSS for payments
- Accessibility: WCAG 2.1 AA

---

## 4. Release Criteria

| Feature | MVP | V1 | V2 |
|---------|-----|----|----|
| User Authentication | ✅ | | |
| Guest Browse | ✅ | | |
| Search & Discovery | ✅ | | |
| Map Search | ✅ | | |
| Business Detail | ✅ | | |
| Service Categories | ✅ | | |
| Booking Flow | ✅ | | |
| Appointment Mgmt | ✅ | | |
| Availability Engine | ✅ | | |
| Payment (Stripe) | ✅ | | |
| Background Jobs | ✅ | | |
| Shared Types/Design | ✅ | | |
| Favorites | | ✅ | |
| User Profile | | ✅ | |
| Reviews & Ratings | | ✅ | |
| Notifications | | ✅ | |
| Provider Portal | | ✅ | |
| Admin Dashboard | | | ✅ |
| Advanced Payments | | | ✅ |

---

## 5. Open Questions

1. Internationalization scope (languages, currencies)?
2. Subscription model for providers (SaaS) or commission-only?
3. In-app messaging between customer and provider?
4. Waitlist for fully booked preferred slots?
5. Group/booking for multiple people?

---

*Document Version: 1.0*
*Last Updated: 2024*
*Owner: Alex (Product Owner)*