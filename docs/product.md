# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first appointment booking platform connecting customers with beauty, wellness, and service professionals. The platform serves three user segments: customers seeking appointments, business owners managing their operations, and administrators overseeing the marketplace.

---

## 2. User Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Customer** | Seeks beauty/wellness services, values convenience and discovery | Book appointments, manage bookings, discover providers |
| **Guest** | Unregistered user exploring the platform | Browse services, understand offerings before committing |
| **Business Owner** | Manages salon/clinic, wants to fill calendar efficiently | Manage availability, accept bookings, grow business |
| **Admin** | Platform operator ensuring quality and growth | Monitor marketplace health, resolve disputes, manage onboarding |

---

## 3. Feature Specifications

### 3.1 User Authentication

**Priority:** P0 (Critical)

**Description:** Secure identity management for all user types with role-based access.

**Acceptance Criteria:**
- [ ] Customers can register with email/password, phone number, or OAuth (Google, Apple, Facebook)
- [ ] Business owners register via dedicated flow with additional verification (business email, SIRET/tax ID)
- [ ] JWT-based session management with refresh token rotation
- [ ] Password reset via email with secure token (expires in 1 hour)
- [ ] Account verification via SMS or email before booking completion
- [ ] Biometric login support (Face ID, Touch ID, fingerprint) on supported devices
- [ ] Session timeout after 30 days of inactivity
- [ ] Concurrent session limit: 5 per user, with ability to revoke sessions

**Technical Notes:** Implement rate limiting on auth endpoints (5 attempts per 15 minutes).

---

### 3.2 Guest Browse & Explore

**Priority:** P0

**Description:** Pre-authentication discovery experience to convert visitors into registered users.

**Acceptance Criteria:**
- [ ] Guest users can browse business listings without registration
- [ ] Guest users can view business details, services, and availability (read-only)
- [ ] Guest users can search and filter businesses
- [ ] Prompt for registration appears when attempting to: book appointment, favorite business, or view full review details
- [ ] Guest session data (search filters, viewed businesses) persists for 7 days via local storage
- [ ] Conversion funnel tracking: guest → registration → first booking

---

### 3.3 Business Search & Discovery

**Priority:** P0

**Description:** Intelligent search and filtering to help customers find suitable providers.

**Acceptance Criteria:**
- [ ] Full-text search across business name, service names, and descriptions
- [ ] Autocomplete with suggestions after 3 characters, ranked by popularity
- [ ] Filter by: service category, price range, rating (minimum stars), availability (today, this week), distance, gender of professional, amenities
- [ ] Sort options: relevance (default), distance, rating, price (low to high), availability (soonest)
- [ ] Recent searches stored (last 10), clearable by user
- [ ] Popular searches displayed when search field is focused
- [ ] Search results display: business image, name, rating, starting price, distance, next available slot
- [ ] Empty state with suggested alternatives when no results match
- [ ] Pagination with 20 results per page, infinite scroll on mobile

---

### 3.4 Map-based Search

**Priority:** P0

**Description:** Geographic visualization of businesses with interactive exploration.

**Acceptance Criteria:**
- [ ] Interactive map with business markers clustered at zoom levels
- [ ] User geolocation with permission prompt; fallback to IP-based city center
- [ ] Search radius adjustable: 1km, 2km, 5km, 10km, 20km, 50km
- [ ] Map/list view toggle with synchronized state
- [ ] Marker tap reveals business card with key info and CTA
- [ ] "Search this area" button when map is panned/zoomed
- [ ] Directions integration (Google Maps, Apple Maps, Waze)
- [ ] Default map view centers on user's saved address or current location

---

### 3.5 Business Detail View

**Priority:** P0

**Description:** Comprehensive business profile converting interest into bookings.

**Acceptance Criteria:**
- [ ] Hero image carousel (up to 10 images), with video support
- [ ] Business info: name, verified badge, rating, review count, address, phone, website
- [ ] Operating hours with current day highlighted; closed status in real-time
- [ ] Service menu with categories, pricing, duration, description
- [ ] Team/professional listing with photos, specialties, ratings
- [ ] "Book Now" CTA sticky at bottom on mobile
- [ ] Share functionality (deep link, social, copy link)
- [ ] Report business option for inappropriate content
- [ ] Similar businesses carousel at bottom

---

### 3.6 Service Categories

**Priority:** P0

**Description:** Hierarchical categorization for discoverability and business organization.

**Acceptance Criteria:**
- [ ] Pre5 categories: Hair, Barbershop, Beauty, Wellness, Nails, Spa, Massage, Tattoos, Piercing, Medical Aesthetic
- [ ] Each category has icon, description, and subcategories (2 levels deep)
- [ ] Business can assign up to 3 primary categories
- [ ] Services tagged with category for filtering
- [ ] Trending categories surfaced on home screen based on seasonality and user behavior
- [ ] Category pages with featured businesses and editorial content

---

### 3.7 Booking Flow

**Priority:** P0

**Description:** Friction-reduced appointment reservation with clear confirmation.

**Acceptance Criteria:**
- [ ] Step 1: Select service (or multiple services for combo booking)
- [ ] Step 2: Select professional (specific or "no preference")
- [ ] Step 3: Select date and time from available slots
- [ ] Step 4: Review booking details, apply promo code, add notes
- [ ] Step 5: Confirm payment method and complete booking
- [ ] Real-time slot availability with optimistic locking (hold slot for 10 minutes during checkout)
- [ ] Guest checkout option with email/phone capture
- [ ] Booking confirmation screen with calendar invite, add to wallet, share
- [ ] SMS and push confirmation immediately upon success
- [ ] Reschedule and cancel options accessible from confirmation
- [ ] Booking modification allowed up to defined cancellation window

---

### 3.8 Appointment Management

**Priority:** P0

**Description:** Lifecycle management of customer appointments.

**Acceptance Criteria:**
- [ ] Upcoming appointments list with chronological sort
- [ ] Past appointments history with rebook option
- [ ] Appointment detail: service, professional, time, location, directions, contact
- [ ] Statuses: pending → confirmed → checked-in → in-progress → completed → cancelled → no-show
- [ ] Reschedule: select new slot, subject to business policy and availability
- [ ] Cancel with reason selection; enforce cancellation policy (e.g., 24h notice)
- [ ] Late arrival notification option ("I'm running late" with ETA)
- [ ] Receipt and invoice access post-completion

---

### 3.9 Favorites

**Priority:** P1 (High)

**Description:** Bookmarking system for user retention and repeat business.

**Acceptance Criteria:**
- [ ] One-tap favorite from business card or detail view
- [ ] Favorites list with quick book CTA, sorted by recency of addition
- [ ] Favorite count badge on tab icon
- [ ] Push notification when favorited business has new availability or promotion
- [ ] Sync favorites across devices for logged-in users
- [ ] Suggest similar businesses based on favorites profile

---

### 3.10 User Profile

**Priority:** P1

**Description:** Customer identity and preference management.

**Acceptance Criteria:**
- [ ] Profile photo, name, phone, email, date of birth (for age-restricted services)
- [ ] Multiple saved addresses (home, work, other) with default selection
- [ ] Payment methods management (cards, Apple Pay, Google Pay)
- [ ] Notification preferences: push, SMS, email, with granular controls
- [ ] Privacy settings: profile visibility, data download, account deletion
- [ ] Booking preferences: default reminders, favorite professionals
- [ ] Referral code and credits tracking

---

### 3.11 Availability & Slot Computation

**Priority:** P0

**Description:** Core scheduling engine ensuring accurate, real-time availability.

**Acceptance Criteria:**
- [ ] Business defines: operating hours, break times, slot duration per service
- [ ] Professional-level availability overrides business defaults
- [ ] Buffer time between appointments configurable
- [ ] Support for recurring unavailability (lunch breaks, recurring meetings)
- [ ] Slot computation accounts for: existing bookings, blocked times, service duration, professional assignment
- [ ] Real-time cache invalidation on booking changes
- [ ] Handle timezone correctly for businesses and customers in different zones
- [ ] Edge case: back-to-back same-professional bookings with no gap
- [ ] Performance: slot query <200ms for 30-day window

---

### 3.12 Shared Types & Design System

**Priority:** P0 (Infrastructure)

**Description:** Consistent UI/UX foundation across platforms.

**Acceptance Criteria:**
- [ ] Component library: buttons, inputs, cards, modals, date picker, time slot grid
- [ ] Color system: primary brand, semantic (success, warning, error, info), neutrals
- [ ] Typography scale: 6 levels with mobile/desktop variants
- [ ] Spacing system: 4px base grid
- [ ] Icon set: 200+ icons covering app needs
- [ ] Animation standards: transitions, loading states, micro-interactions
- [ ] Accessibility: WCAG 2.1 AA minimum, screen reader support, minimum touch target 44px
- [ ] Dark mode support with system preference detection
- [ ] Localization framework: French (default), English, Spanish, Italian, German

---

### 3.13 Reviews & Ratings

**Priority:** P1

**Description:** Social proof system driving trust and quality improvement.

**Acceptance Criteria:**
- [ ] Verified reviews only (post-appointment, confirmed completion)
- [ ] Rating: 1-5 stars with half-star precision
- [ ] Review components: overall rating, service-specific rating, text comment, photo upload (up to 5)
- [ ] Business owner response capability
- [ ] Review helpfulness voting and report inappropriate content
- [ ] Aggregate statistics: average rating, distribution histogram, trend over time
- [ ] Review prompt: 24 hours post-appointment via push/email
- [ ] Sort reviews: most relevant, newest, highest/lowest rating

---

### 3.14 Payment Integration

**Priority:** P0

**Description:** Secure, flexible payment processing for bookings.

**Acceptance Criteria:**
- [ ] Full payment at booking or deposit with balance at appointment
- [ ] Payment methods: credit/debit cards (Stripe), Apple Pay, Google Pay, PayPal
- [ ] Secure PCI-DSS compliant tokenization; no raw card data stored
- [ ] Refund processing with automated calculation based on cancellation policy
- [ ] Invoice generation with business VAT/tax details
- [ ] Failed payment handling with retry logic and user notification
- [ ] Payout scheduling to business owners (weekly/bi-weekly/monthly)
- [ ] Platform fee transparency: clear commission display at checkout

---

### 3.15 Notifications

**Priority:** P1

**Description:** Multi-channel communication keeping users informed and engaged.

**Acceptance Criteria:**
- [ ] Push notifications: booking confirmed, reminder (24h, 2h before), cancelled, modified, promotional
- [ ] SMS fallback for critical alerts when push not enabled
- [ ] Email: confirmations, receipts, marketing (opt-in), account security
- [ ] In-app notification center with read/unread status
- [ ] Smart delivery: no duplicate notifications across channels within 5 minutes
- [ ] Quiet hours respect (configurable, default 22:00-08:00)
- [ ] Deep linking from all notification types to relevant screen

---

### 3.16 Provider / Business Owner Portal

**Priority:** P0

**Description:** Self-service management for business operations.

**Acceptance Criteria:**
- [ ] Dashboard: today's appointments, revenue this week, upcoming week preview
- [ ] Calendar view: day/week/month with drag-and-drop rescheduling
- [ ] Availability management: set recurring hours, add exceptions, block time off
- [ ] Service management: CRUD services, set pricing, duration, description, online booking enablement
- [ ] Team management: add professionals, set their services and schedules
- [ ] Booking management: view, confirm, modify, cancel customer appointments
- [ ] Customer database: view history, notes, contact info
- [ ] Settings: business info, photos, cancellation policy, notification preferences
- [ ] Mobile-responsive web app; native app companion planned P2

---

### 3.17 Admin Dashboard

**Priority:** P1

**Description:** Platform governance and business intelligence.

**Acceptance Criteria:**
- [ ] Business onboarding workflow: application review, verification, approval/rejection
- [ ] User management: search, view, suspend, impersonate for support
- [ ] Business management: edit, feature, suspend, view analytics
- [ ] Content moderation: review flagged reviews, businesses, images
- [ ] Financial overview: transaction volume, platform revenue, payout status
- [ ] Promotional tools: create and manage promo codes, featured placements
- [ ] System health: error rates, API performance, queue depths
- [ ] Role-based access: super admin, support agent, finance, marketing

---

### 3.18 Background Jobs (BullMQ)

**Priority:** P1 (Infrastructure)

**Description:** As warrantied asynchronous processing for scalability and reliability.

**Acceptance Criteria:**
- [ ] Job types: email sending, SMS sending, push notification delivery, payment processing, report generation, data exports, search index updates, image processing
- [ ] Retry logic: exponential backoff, max 5 attempts, dead letter queue for failures
- [ ] Job priorities: critical (payment), high (notifications), normal (emails), low (reports)
- [ ] Scheduled jobs: daily reports, weekly digests, data cleanup
- [ ] Monitoring: job success/failure rates, average processing time, queue depth alerts
- [ ] Idempotency keys to prevent duplicate processing
- [ ] Job cancellation support for obsolete operations (e.g., reminder for cancelled appointment)

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | App cold start <3s; screen load <1.5s; API response <200ms (p95) |
| **Reliability** | 99.9% uptime; graceful degradation of non-critical features |
| **Security** | OWASP compliance, encrypted data at rest and in transit, audit logging |
| **Scalability** | Support 100k concurrent users, 10M appointments/month |
| **Compliance** | GDPR, PCI-DSS, French data localization where required |

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Monthly Active Users (MAU) | 50k by month 6 |
| Booking conversion rate | >15% from app open to completed booking |
| Guest to registered conversion | >30% |
| Business owner NPS | >50 |
| Customer NPS | >60 |
| App store rating | >4.5 stars |
| Support ticket volume | <2% of active users |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | 3.1-3.5, 3.7, 3.11, 3.12, 3.14, 3.16 (core) | 8 weeks |
| **V1.0** | All P0 features | +4 weeks |
| **V1.1** | All P1 features, reviews, favorites, notifications, admin | +6 weeks |
| **V1.2** | Advanced features, loyalty program, subscriptions | +8 weeks |

---

*Document version: 1.0*
*Last updated: 2024*
*Owner: Alex, Product Owner*