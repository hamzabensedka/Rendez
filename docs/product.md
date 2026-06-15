# Planity Clone — Product Specification

## 1. Overview

**Product Name:** Planity Clone  
**Platform:** Web (Responsive), iOS, Android  
**Target Audience:** Consumers seeking beauty & wellness appointments; Business owners managing bookings  
**Monetization:** SaaS subscription for businesses; Commission on bookings  

## 2. Goals & Objectives

| Goal | Success Metric |
|------|---------------|
| Enable seamless appointment booking | < 3 min to complete a booking |
| Help businesses manage their calendar | 99.9% uptime, < 1s slot computation |
| Drive discovery of local services | 50% of users discover new businesses |
| Reduce no-shows | < 5% no-show rate via notifications |

## 3. Feature Specifications

---

### 3.1 User Authentication
**Priority:** P0  
**Owner:** Product / Engineering  

#### Description
Allow users to create accounts, log in, and manage their identity across the platform. Support both consumer and business owner roles.

#### Acceptance Criteria
- [ ] User can register with email, password, and phone number
- [ ] User can register/login with Google OAuth
- [ ] User can register/login with Apple Sign-In
- [ ] Password must be min 8 chars, 1 uppercase, 1 number, 1 special character
- [ ] Email verification required before booking
- [ ] User can request password reset via email
- [ ] JWT tokens with refresh token rotation
- [ ] Token expiry: access 15min, refresh 7 days
- [ ] Rate limit: 5 login attempts per 15 min
- [ ] Role selection: Consumer vs Business Owner during onboarding

#### Edge Cases
- Duplicate email registration attempt → clear error message
- Unverified email user tries to book → redirect to verification flow
- OAuth account linking with existing email → merge or prompt

---

### 3.2 Guest Browse & Explore
**Priority:** P0  

#### Description
Allow unauthenticated users to browse businesses, view services, and search before committing to registration.

#### Acceptance Criteria
- [ ] Guest can view business listings without login
- [ ] Guest can search by location, service, business name
- [ ] Guest can view business details and service menus
- [ ] Guest can view reviews and ratings
- [ ] Guest CANNOT book without creating an account
- [ ] Prompt for login appears at booking initiation (not before)
- [ ] Guest's search context preserved post-login

---

### 3.3 Business Search & Discovery
**Priority:** P0  

#### Description
Powerful search and filtering to help users find the right business.

#### Acceptance Criteria
- [ ] Full-text search on business name, service name, description
- [ ] Filters: distance (km/mi), price range, rating, availability today
- [ ] Sort options: relevance, distance, rating, price (low-high)
- [ ] Auto-complete suggestions after 3 characters
- [ ] Search history saved for logged-in users
- [ ] Popular searches displayed on empty state
- [ ] Results per page: 20, with infinite scroll
- [ ] Geolocation auto-detect with permission prompt
- [ ] Fallback to manual city/zip input if geolocation denied

---

### 3.4 Map-based Search
**Priority:** P0  

#### Description
Visual map interface showing business locations with interactive pins.

#### Acceptance Criteria
- [ ] Map view toggle on search results page
- [ ] Clustered pins for dense areas (zoom-dependent)
- [ ] Pin click reveals business card with name, rating, price from
- [ ] Card click navigates to business detail
- [ ] User location dot with accuracy radius
- [ ] "Search this area" button on map pan
- [ ] Default zoom: fit all results; min zoom: street level
- [ ] Map style matches app design system (light/dark mode)

---

### 3.5 Business Detail View
**Priority:** P0  

#### Description
Comprehensive page showing all business information to drive booking decisions.

#### Acceptance Criteria
- [ ] Hero: business name, images (carousel), rating, review count
- [ ] Address with copy and "Get directions" (external maps)
- [ ] Phone number with tap-to-call
- [ ] Business hours (current day highlighted, open/closed status)
- [ ] Description, amenities, COVID/safety policies
- [ ] Service menu with prices and durations
- [ ] Team/staff list with individual profiles
- [ ] Reviews section (paginated, sortable)
- [ ] "Book Now" CTA sticky at bottom
- [ ] Share business via native share sheet
- [ ] Report business option

---

### 3.6 Service Categories
**Priority:** P0  

#### Description
Hierarchical categorization of services for discovery and business management.

#### Acceptance Criteria
- [ ] Predefined categories: Hair, Nails, Face, Body, Massage, Spa, Medical Aesthetic, Fitness
- [ ] Sub-categories (e.g., Hair > Cut, Color, Styling, Treatment)
- [ ] Businesses can assign services to multiple categories
- [ ] Category icons from design system
- [ ] Category browsing from home screen
- [ ] Trending/featured categories section

---

### 3.7 Booking Flow
**Priority:** P0  

#### Description
Core conversion flow for scheduling appointments.

#### Acceptance Criteria
- [ ] Step 1: Select service (or multiple services)
- [ ] Step 2: Select staff member (or "No preference")
- [ ] Step 3: Select date → view available slots
- [ ] Step 4: Select time slot
- [ ] Step 5: Review booking details
- [ ] Step 6: Add notes/special requests (optional, max 500 chars)
- [ ] Step 7: Select payment method (card on file, new card, pay in person)
- [ ] Step 8: Confirm booking → receive confirmation
- [ ] Each step shows progress indicator
- [ ] Back navigation preserves selections
- [ ] Slot availability computed in real-time (< 1s response)
- [ ] Hold slot for 10 min during checkout (optimistic lock)
- [ ] Release hold if payment fails or timeout
- [ ] Booking confirmation: in-app, email, push notification

---

### 3.8 Appointment Management
**Priority:** P0  

#### Description
Users can view, modify, and cancel their appointments.

#### Acceptance Criteria
- [ ] Upcoming appointments list (sorted by date, nearest first)
- [ ] Past appointments history
- [ ] Appointment detail: service, staff, time, location, QR code
- [ ] Reschedule: restart booking flow with pre-filled selections
- [ ] Cancel with reason selection (user no-show prediction data)
- [ ] Cancellation policy displayed (e.g., free until 24h before)
- [ ] Late cancellation fee applied per business policy
- [ ] Add to calendar (iCal / Google Calendar)
- [ ] Rebook same service with one tap

---

### 3.9 Favorites
**Priority:** P1  

#### Acceptance Criteria
- [ ] Heart icon on business cards and detail pages
- [ ] Favorites list accessible from profile
- [ ] Push notification for new availability at favorited businesses (opt-in)
- [ ] Sync favorites across devices

---

### 3.10 User Profile
**Priority:** P0  

#### Acceptance Criteria
- [ ] Profile photo, name, phone, email (editable)
- [ ] Saved payment methods (Stripe PaymentMethod)
- [ ] Notification preferences (push, email, SMS)
- [ ] Privacy settings (profile visibility)
- [ ] Delete account (GDPR compliance, 30-day soft delete)
- [ ] Booking history with receipts
- [ ] Loyalty/points (if applicable)

---

### 3.11 Availability & Slot Computation
**Priority:** P0 — Critical Backend Feature  

#### Description
Real-time calculation of available booking slots based on complex business rules.

#### Acceptance Criteria
- [ ] Define business hours per day (can vary Mon-Sun)
- [ ] Define staff working hours (can differ from business)
- [ ] Service duration + buffer time between appointments
- [ ] Block out existing appointments
- [ ] Block out staff breaks
- [ ] Block out time-off / vacation
- [ ] Support recurring and one-off unavailability
- [ ] Concurrent booking prevention (race condition handling)
- [ ] Slot computation API < 1s for 30-day window
- [ ] Cache frequently requested slots (Redis, 5 min TTL)
- [ ] Handle timezone correctly (business timezone, user timezone display)

---

### 3.12 Shared Types & Design System
**Priority:** P0  

#### Acceptance Criteria
- [ ] TypeScript types shared between frontend and backend (monorepo)
- [ ] Component library: buttons, inputs, cards, modals, date picker, time slot grid
- [ ] Color tokens: primary (#FF6B6B), secondary, success, warning, error
- [ ] Typography scale: display, heading, body, caption
- [ ] Spacing scale: 4px base unit
- [ ] Dark mode support
- [ ] Accessibility: WCAG 2.1 AA minimum
- [ ] RTL language support (future)

---

### 3.13 Reviews & Ratings
**Priority:** P1  

#### Acceptance Criteria
- [ ] 5-star rating with half-star precision
- [ ] Written review optional, max 2000 chars
- [ ] Review prompts post-appointment (24h after)
- [ ] Business owner can respond to reviews
- [ ] Flag inappropriate reviews
- [ ] Verified booking badge on reviews
- [ ] Aggregate rating displayed with distribution histogram
- [ ] Sort reviews: most recent, most helpful, highest/lowest rating

---

### 3.14 Payment Integration
**Priority:** P0  

#### Acceptance Criteria
- [ ] Stripe integration for card payments
- [ ] Support: Visa, Mastercard, Amex, Apple Pay, Google Pay
- [ ] Save payment methods for future use
- [ ] Pre-authorization for no-show protection (configurable)
- [ ] Full payment at booking vs. pay in person (business configurable)
- [ ] Refund processing with reason tracking
- [ ] Invoice/receipt generation (PDF)
- [ ] PCI compliance via Stripe Elements (no raw card data)
- [ ] Webhook handling for payment status updates
- [ ] Failed payment retry with user notification

---

### 3.15 Notifications
**Priority:** P1  

#### Acceptance Criteria
- [ ] Push notifications: booking confirmed, reminder (24h, 1h), cancelled, modified
- [ ] Email notifications: same events + marketing (opt-in)
- [ ] SMS: critical updates only (opt-in)
- [ ] In-app notification center
- [ ] Notification preferences granular control
- [ ] Deep links from notifications to relevant screens
- [ ] Notification scheduling via BullMQ

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0  

#### Acceptance Criteria
- [ ] Dashboard: today's appointments, revenue, occupancy rate
- [ ] Calendar view: day, week, month; drag-to-reschedule
- [ ] Service management: CRUD services, pricing, duration
- [ ] Staff management: profiles, schedules, permissions
- [ ] Customer management: view history, notes, contact
- [ ] Booking rules: cancellation policy, deposit requirements
- [ ] Availability management: set hours, breaks, time-off
- [ ] Reports: revenue, bookings by service, staff performance
- [ ] Review management: respond, report
- [ ] Multiple location support (future)

---

### 3.17 Admin Dashboard
**Priority:** P1  

#### Acceptance Criteria
- [ ] User management: search, view, suspend, delete
- [ ] Business verification and approval workflow
- [ ] Content moderation: review flagged businesses/reviews
- [ ] Platform analytics: MAU, bookings, GMV, churn
- [ ] Financial reconciliation
- [ ] Support ticket integration
- [ ] Feature flags and configuration
- [ ] Audit log for all admin actions

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P0 — Infrastructure  

#### Acceptance Criteria
- [ ] Reminder notifications: 24h and 1h before appointment
- [ ] Follow-up review request: 24h after appointment
- [ ] Payment processing webhooks
- [ ] Email delivery queue with retry (exponential backoff)
- [ ] SMS delivery queue
- [ ] Slot cache warming for popular businesses
- [ ] Daily/weekly analytics aggregation
- [ ] Failed job monitoring and alerting
- [ ] Job idempotency keys to prevent duplicates
- [ ] Dead letter queue for unprocessable jobs

## 4. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | Page load < 2s; API response < 200ms (p95) |
| Scalability | Support 10k concurrent users |
| Security | OWASP Top 10 mitigation; encryption at rest and in transit |
| Compliance | GDPR, CCPA, PCI-DSS |
| Accessibility | WCAG 2.1 AA |
| Browser Support | Last 2 versions of Chrome, Firefox, Safari, Edge |

## 5. Analytics & Tracking

- Funnel: search → business view → booking start → complete
- Feature usage: map vs list view, filter usage
- Booking conversion by platform (iOS, Android, Web)
- Churn and retention cohorts
- Business owner engagement metrics

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Search, Business Detail, Booking, Appointments, Payments, Provider Portal | Month 1-2 |
| v1.1 | Map, Favorites, Reviews, Notifications | Month 3 |
| v1.2 | Admin Dashboard, Analytics, Background Jobs optimization | Month 4 |
| v2.0 | Mobile apps, advanced scheduling, loyalty | Month 6 |

---
*Document Version: 1.0*  
*Last Updated: 2024*  
*Owner: Alex, Product Owner*
