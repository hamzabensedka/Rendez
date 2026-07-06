# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a multi-platform application connecting customers with local service businesses (beauty, wellness, health). The platform enables discovery, booking, and management of appointments while providing business owners with tools to manage their operations.

**Target Users:** Customers seeking appointments, business owners managing services, administrators overseeing the platform.

---

## 2. Feature Specifications

### 2.1 User Authentication

**Priority:** P0 (Critical)

**Description:** Secure identity management for all user types (customers, business owners, admins).

**Requirements:**
- Email/password registration with validation
- Login with email/password
- Password reset via email
- JWT-based session management with refresh tokens
- Role-based access control (customer, business_owner, admin)
- Social login (Google, Apple) — P1
- Account verification email — P1

**Acceptance Criteria:**
- [ ] User can register with valid email, password, first name, last name
- [ ] Password minimum: 8 characters, 1 uppercase, 1 number, 1 special character
- [ ] System rejects duplicate email registration
- [ ] User receives verification email upon registration
- [ ] User can log in with valid credentials and receives access + refresh tokens
- [ ] Token refresh occurs automatically before expiry
- [ ] User can request password reset and complete via secure link
- [ ] Unauthenticated users receive 401 on protected endpoints
- [ ] Role middleware restricts endpoint access appropriately

---

### 2.2 Guest Browse & Explore

**Priority:** P0 (Critical)

**Description:** Allow unauthenticated users to browse businesses and services without creating an account.

**Requirements:**
- Browse businesses without login
- View business details and services
- View available time slots (without booking)
- Prompt to authenticate when attempting to book
- Session-persisted guest preferences (local storage)

**Acceptance Criteria:**
- [ ] Guest can access search and browse without authentication
- [ ] Guest sees "Sign in to book" CTA on business pages
- [ ] Guest can view business profiles, services, and pricing
- [ ] Guest sees available slots but cannot proceed past booking initiation
- [ ] Upon login, guest preferences (selected business/service) are preserved
- [ ] Guest browsing data optionally linked to account upon registration

---

### 2.3 Business Search & Discovery

**Priority:** P0 (Critical)

**Description:** Comprehensive search and filtering to help users find relevant businesses.

**Requirements:**
- Full-text search across business name, description, services
- Filter by: category, location (city/zip), price range, rating, availability
- Sort by: relevance, rating, distance, price (low/high)
- Pagination (20 results default)
- Recent searches and trending businesses
- Auto-complete search suggestions

**Acceptance Criteria:**
- [ ] Search returns results matching name, description, or service names
- [ ] Filters combine with AND logic; empty result set handled gracefully
- [ ] Distance calculation accurate within 500m using Haversine formula
- [ ] Results display within 2 seconds for 95th percentile queries
- [ ] Pagination supports cursor-based for performance
- [ ] Empty state provides guidance to refine search
- [ ] Recent searches persist across sessions for authenticated users

---

### 2.4 Map-based Search

**Priority:** P1 (High)

**Description:** Visual exploration of businesses on an interactive map.

**Requirements:**
- Interactive map with business markers
- Cluster markers for dense areas
- Map bounds trigger result update
- User geolocation with permission handling
- Directions integration (external maps app)
- Toggle between list and map views

**Acceptance Criteria:**
- [ ] Map initializes centered on user location or default city
- [ ] Business markers display on map; clicking shows preview card
- [ ] Map pan/zoom fetches businesses in visible bounds
- [ ] Clustering groups markers when zoomed out
- [ ] User can trigger current location; denied gracefully with fallback
- [ ] "Get directions" opens native maps with business address
- [ ] Map maintains state when switching between list and map views

---

### 2.5 Business Detail View

**Priority:** P0 (Critical)

**Description:** Comprehensive business profile showcasing services, availability, and social proof.

**Requirements:**
- Business info: name, description, photos, address, contact, hours
- Service menu with pricing and duration
- Team/staff profiles
- Reviews summary and detail
- Real-time availability preview
- Share business profile

**Acceptance Criteria:**
- [ ] Business detail loads with all core information within 1.5s
- [ ] Photo gallery supports swipe/carousel with pinch-to-zoom
- [ ] Services display name, description, duration, price
- [ ] Operating hours show current day status (open/closed)
- [ ] Staff list links to individual staff profiles and availability
- [ ] Average rating and review count prominently displayed
- [ ] Deep link support for sharing business profile URL

---

### 2.6 Service Categories

**Priority:** P0 (Critical)

**Description:** Hierarchical categorization of services for discovery and organization.

**Requirements:**
- Predefined category taxonomy (Hair, Nails, Spa, Massage, etc.)
- Subcategories for granular classification
- Business can map services to multiple categories
- Category icons and descriptions
- Category-based browsing and filtering

**Acceptance Criteria:**
- [ ] Category list displays with icons and business counts
- [ ] Subcategories expand/collapse or navigate to dedicated view
- [ ] Business services correctly associated with categories
- [ ] Category pages SEO-friendly with proper URL structure
- [ ] Uncategorized services appear in "Other" with admin flag

---

### 2.7 Booking Flow

**Priority:** P0 (Critical)

**Description:** End-to-end appointment reservation from selection to confirmation.

**Requirements:**
- Select service → select staff (optional) → select date/time → confirm details → payment (if required) → confirmation
- Real-time slot availability
- Guest checkout option (with account creation prompt)
- Booking notes/special requests
- Cancellation policy acknowledgment
- Booking confirmation with calendar invite

**Acceptance Criteria:**
- [ ] User selects service; only relevant staff and slots shown
- [ ] Calendar view shows available dates; unavailable dates disabled
- [ ] Time slots update based on staff and service duration
- [ ] Double-booking prevented via optimistic locking
- [ ] Booking holds slot for 10 minutes during payment
- [ ] Confirmation displays: business, service, staff, datetime, location, reference code
- [ ] Calendar invite (.ics) sent via email
- [ ] SMS confirmation option — P1

---

### 2.8 Appointment Management

**Priority:** P0 (Critical)

**Description:** Users and providers can view, modify, and cancel appointments.

**Requirements:**
- Customer: view upcoming/past appointments, reschedule, cancel
- Business: view all bookings, check-in, mark no-show, add notes
- Cancellation with policy enforcement (e.g., 24h notice)
- Reschedule within constraints
- Appointment status lifecycle: pending → confirmed → checked-in → completed → cancelled/no-show

**Acceptance Criteria:**
- [ ] Customer sees chronological list with status indicators
- [ ] Cancel action shows refund/payment policy and requires confirmation
- [ ] Reschedule presents new slot selection; original slot released
- [ ] Business dashboard shows daily schedule view
- [ ] Status updates trigger notifications (see 2.15)
- [ ] Past appointments accessible for 2 years; then archived

---

### 2.9 Favorites

**Priority:** P1 (High)

**Description:** Users save preferred businesses for quick access.

**Requirements:**
- Toggle favorite from business card or detail
- Favorites list with quick booking
- Favorite count visible to business
- Sync across devices for authenticated users

**Acceptance Criteria:**
- [ ] Heart icon toggles favorite with haptic/visual feedback
- [ ] Favorites persist in database for authenticated users
- [ ] Guest favorites stored locally; prompt to login to sync
- [ ] Favorites page shows empty state with discovery CTA
- [ ] Favorite businesses surface in personalized recommendations

---

### 2.10 User Profile

**Priority:** P1 (High)

**Description:** Customer account management and preferences.

**Requirements:**
- Personal info: name, phone, email, photo
- Notification preferences (email, push, SMS)
- Payment methods management
- Appointment history
- Privacy settings and data export
- Account deletion (GDPR)

**Acceptance Criteria:**
- [ ] Profile displays current information with edit capability
- [ ] Photo upload with crop and size validation (max 5MB)
- [ ] Notification preferences granular by type (bookings, promotions, reminders)
- [ ] Payment methods: add, delete, set default (PCI-compliant via Stripe)
- [ ] Data export produces downloadable file within 24 hours
- [ ] Account deletion confirms identity, anonymizes data, completes in 30 days

---

### 2.11 Availability & Slot Computation

**Priority:** P0 (Critical)

**Description:** Core engine calculating real-time available appointment slots.

**Requirements:**
- Business defines: operating hours, break times, holidays
- Staff-specific schedules and time off
- Service duration and buffer time between appointments
- Concurrent booking limits (rooms, chairs)
- Slot generation based on above constraints
- Cache with invalidation on schedule changes

**Acceptance Criteria:**
- [ ] Slots generated only within business operating hours
- [ ] Staff time-off blocks slots for that staff
- [ ] Service duration + buffer accounted between consecutive bookings
- [ ] Resource constraints (e.g., room availability) enforced
- [ ] Slot computation completes in <200ms for 30-day window
- [ ] Cache invalidated on any schedule/booking change
- [ ] Edge cases handled: midnight crossing, DST changes, leap year

---

### 2.12 Shared Types & Design System

**Priority:** P0 (Critical)

**Description:** Consistent UI/UX foundation across platforms.

**Requirements:**
- Component library (React Native / React)
- Typography, color palette, spacing scale
- Form elements, buttons, cards, modals
- Loading states and skeleton screens
- Error states and empty states
- Accessibility: WCAG 2.1 AA minimum

**Acceptance Criteria:**
- [ ] All UI components documented in Storybook
- [ ] Color contrast ratios meet WCAG AA standards
- [ ] Touch targets minimum 44x44dp (mobile)
- [ ] Screen reader labels on all interactive elements
- [ ] Consistent loading skeletons for async content
- [ ] Error boundaries catch and log runtime errors gracefully
- [ ] Dark mode support — P2

---

### 2.13 Reviews & Ratings

**Priority:** P1 (High)

**Description:** Customer feedback system for businesses and services.

**Requirements:**
- Post-review after completed appointment
- 1-5 star rating with optional text review
- Business owner response
- Review helpfulness voting
- Moderation flagging
- Review summary statistics

**Acceptance Criteria:**
- [ ] Review invitation sent 24 hours after appointment completion
- [ ] Only verified customers (completed appointment) can review
- [ ] One review per appointment; editable for 30 days
- [ ] Business owner can respond once; response editable
- [ ] Inappropriate reviews flagged for admin review
- [ ] Rating distribution displayed as histogram
- [ ] Reviews sortable by: newest, highest, lowest, most helpful

---

### 2.14 Payment Integration

**Priority:** P1 (High)

**Description:** Secure processing of payments for appointments.

**Requirements:**
- Stripe integration for card payments
- Support for: card payments, Apple Pay, Google Pay
- Deposit vs. full payment options (business-configurable)
- No-show fees with pre-authorization
- Refund processing with policy enforcement
- Invoice and receipt generation

**Acceptance Criteria:**
- [ ] PCI compliance via Stripe Elements; no card data touches servers
- [ ] Payment intent created at booking; captured per business rules
- [ ] Failed payment provides clear error and retry option
- [ ] Refunds processed through dashboard; customer notified
- [ ] Receipts emailed with business branding
- [ ] Webhook handling for payment status updates
- [ ] Payout scheduling to business bank accounts — P2

---

### 2.15 Notifications

**Priority:** P1 (High)

**Description:** Multi-channel communication for booking lifecycle and marketing.

**Requirements:**
- Channels: push (mobile), email, SMS
- Triggered by: booking confirmation, reminder (24h, 1h), modification, cancellation, promotion
- User preference management per channel
- Template management with variable substitution
- Delivery tracking and retry logic

**Acceptance Criteria:**
- [ ] Booking confirmation delivers within 5 seconds via preferred channel
- [ ] Reminder notifications respect user timezone
- [ ] Unsubscribe honored immediately for marketing communications
- [ ] Transactional notifications (booking-related) cannot be disabled
- [ ] Failed push falls back to SMS for critical notifications
- [ ] Notification history viewable in app

---

### 2.16 Provider / Business Owner Portal

**Priority:** P0 (Critical)

**Description:** Dedicated interface for business owners to manage their presence and operations.

**Requirements:**
- Dashboard: upcoming appointments, revenue summary, quick actions
- Schedule management: set hours, breaks, time off
- Service catalog: CRUD services with pricing, duration, description
- Staff management: add staff, set schedules, assign services
- Booking management: view, modify, cancel customer appointments
- Customer database with visit history
- Settings: business info, photos, policies, payment settings

**Acceptance Criteria:**
- [ ] Dashboard loads key metrics within 2 seconds
- [ ] Schedule changes reflect immediately in customer-facing availability
- [ ] Service creation enforces required fields and validates pricing
- [ ] Staff can have individual login with role-based permissions
- [ ] Booking modifications notify affected customers automatically
- [ ] Export reports: appointments, revenue, customers (CSV/PDF)

---

### 2.17 Admin Dashboard

**Priority:** P1 (High)

**Description:** Platform administration and oversight.

**Requirements:**
- User management: search, view, suspend, impersonate
- Business onboarding and verification
- Content moderation: reviews, reported content
- Platform analytics: MAU, bookings, revenue, churn
- Configuration: categories, fees, feature flags
- Support ticket routing

**Acceptance Criteria:**
- [ ] Admin actions audited with immutable log
- [ ] Business approval workflow: submitted → under review → approved/rejected
- [ ] Flagged content reviewed within 24 hours per SLA
- [ ] Analytics dashboards refresh every 15 minutes
- [ ] Role-based admin access (super_admin, support, finance)
- [ ] Bulk operations with confirmation and undo window

---

### 2.18 Background Jobs (BullMQ)

**Priority:** P1 (High)

**Description:** Asynchronous job processing for reliability and performance.

**Requirements:**
- Job queues: notifications, payments, reports, data exports, search indexing
- Retry with exponential backoff
- Dead letter queue for failed jobs
- Job monitoring and manual retry
- Scheduled/recurring jobs

**Acceptance Criteria:**
- [ ] Notification jobs process within 30 seconds of trigger
- [ ] Failed jobs retry 3 times with 5min, 25min, 125min delays
- [ ] Dead letter queue accessible for admin review
- [ ] Job completion/failure metrics visible in monitoring
- [ ] Recurring jobs: daily reports, nightly data cleanup
- [ ] Queue depth alerts trigger at >1000 pending jobs

---

## 3. Non-Functional Requirements

| Aspect | Requirement |
|--------|-------------|
| Performance | API p95 < 500ms; page load < 2s |
| Availability | 99.9% uptime SLA |
| Security | OWASP Top 10 mitigated; annual penetration test |
| Scalability | Support 10,000 concurrent bookings |
| Compliance | GDPR, PCI-DSS (via Stripe), CCPA |

## 4. Success Metrics

- Monthly Active Users (MAU)
- Booking conversion rate (browse → book)
- Business retention rate
- Customer NPS
- Average booking value
- Platform gross merchandise value (GMV)

## 5. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | 2.1, 2.2, 2.3, 2.5, 2.6, 2.7, 2.8, 2.11, 2.12, 2.16 | Month 1-2 |
| V1.1 | 2.4, 2.9, 2.10, 2.13, 2.15, 2.18 | Month 3 |
| V1.2 | 2.14, 2.17, Social Login, Dark Mode | Month 4 |

---
*Document Version: 1.0*
*Last Updated: 2024*