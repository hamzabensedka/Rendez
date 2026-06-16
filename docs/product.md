# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first marketplace that connects consumers with local beauty, wellness, and health service providers. Users can discover businesses, view services, check real-time availability, and book appointments. Business owners manage their schedules, services, and staff through a dedicated portal. An admin dashboard oversees the platform.

## 2. Goals & KPIs

| Goal | KPI |
|------|-----|
| Seamless booking experience | Booking completion rate > 80% |
| Business acquisition | Active businesses > 500 in 6 months |
| User retention | 30-day retention > 25% |
| Platform reliability | Uptime > 99.5%, slot accuracy 100% |

## 3. Target Users

- **Consumers**: 18-55, mobile-first, seeking convenience in booking beauty/wellness services
- **Business Owners**: Salon/spa/clinic managers needing digital scheduling
- **Admin Staff**: Platform operators managing onboarding, disputes, and analytics

## 4. Feature Specifications

---

### 4.1 User Authentication

**Priority**: P0 (Critical)

**Description**: Secure, multi-method authentication for consumers and business owners.

**User Stories**:
- As a user, I want to sign up with email/password so I can create an account quickly.
- As a user, I want to log in with Google/Apple SSO so I don't need to remember another password.
- As a user, I want to reset my password via email so I can recover access.
- As a business owner, I want a separate onboarding flow so my business profile is properly set up.

**Acceptance Criteria**:
- [ ] Email sign-up validates format, enforces password (min 8 chars, 1 uppercase, 1 number, 1 special char)
- [ ] JWT access token (15 min expiry) + refresh token (7 days) with httpOnly cookies
- [ ] SSO integration for Google and Apple (Sign in with Apple)
- [ ] Password reset flow: request → email with 6-digit code → verify → set new password
- [ ] Rate limiting: 5 attempts per 15 minutes per IP
- [ ] Account lockout after 10 failed attempts, unlock via email
- [ ] Business owner flag set during onboarding triggers business profile creation

**Technical Notes**:
- Use `bcrypt` for password hashing (cost factor 12)
- Store refresh tokens hashed in database for revocation
- Implement token rotation on refresh

---

### 4.2 Guest Browse & Explore

**Priority**: P0 (Critical)

**Description**: Allow unauthenticated users to browse businesses and services to reduce friction.

**User Stories**:
- As a guest, I want to browse businesses without signing up so I can evaluate the platform.
- As a guest, I want to view business details and services so I know what's available.
- As a guest, I want to be prompted to sign up when attempting to book so the flow is clear.

**Acceptance Criteria**:
- [ ] Home/explore screen accessible without authentication
- [ ] Business listings, search, and detail views fully functional for guests
- [ ] "Book" CTA triggers auth modal with pre-filled context (business, service, time)
- [ ] Post-authentication, redirect user back to booking flow with state preserved
- [ ] Guest session data (favorites, recent views) merged upon account creation

**Technical Notes**:
- Use device ID + local storage for temporary guest session tracking
- Merge guest data to authenticated account via background job

---

### 4.3 Business Search & Discovery

**Priority**: P0 (Critical)

**Description**: Powerful search and filtering to help users find the right business.

**User Stories**:
- As a user, I want to search by business name, service, or keyword so I can find specific providers.
- As a user, I want to filter by category, price range, rating, and distance so I can narrow results.
- As a user, I want to see search results sorted by relevance, rating, or distance.

**Acceptance Criteria**:
- [ ] Full-text search across business name, service names, and descriptions
- [ ] Filters: category (multi-select), price range (min/max), minimum rating (1-5), distance (km/mi), availability (today, this week)
- [ ] Sort options: relevance (default), highest rated, nearest, price (low to high)
- [ ] Search results return within 500ms (p95)
- [ ] Pagination with cursor-based infinite scroll
- [ ] Recent searches stored locally (last 10)
- [ ] Suggested searches based on popular queries

**Technical Notes**:
- PostgreSQL full-text search with `tsvector` and GIN indexes
- Geospatial queries using PostGIS with spatial index
- Debounce search input at 300ms

---

### 4.4 Map-based Search

**Priority**: P0 (Critical)

**Description**: Visual map interface for geographic discovery of businesses.

**User Stories**:
- As a user, I want to see businesses on a map so I can choose by location.
- As a user, I want to pan and zoom the map to explore different areas.
- As a user, I want to see my current location and nearby businesses.

**Acceptance Criteria**:
- [ ] Interactive map with custom business pins (clustered at zoom levels)
- [ ] User geolocation with permission prompt; fallback to city center
- [ ] Map bounds query: fetch businesses within visible viewport
- [ ] Pin tap reveals business card with name, rating, price range, and next availability
- [ ] Smooth transition from map to list view with shared state
- [ ] Map loads within 2 seconds on 4G

**Technical Notes**:
- Mapbox or Google Maps SDK
- Clustering library for >100 pins
- Cache tile data for offline viewing

---

### 4.5 Business Detail View

**Priority**: P0 (Critical)

**Description**: Comprehensive business profile with all information needed to make a booking decision.

**User Stories**:
- As a user, I want to see business photos, description, hours, and contact info.
- As a user, I want to browse all services offered with prices and durations.
- As a user, I want to see staff/professionals and their specialties.
- As a user, I want to read reviews and see overall ratings.

**Acceptance Criteria**:
- [ ] Hero image carousel (up to 10 images), with pinch-to-zoom
- [ ] Business name, verified badge, category, address, phone, website link
- [ ] Operating hours with "Open Now" indicator and holiday exceptions
- [ ] Services list: name, description, duration, price, optional deposit amount
- [ ] Staff profiles: photo, name, bio, specialties, average rating
- [ ] Reviews section: overall rating (1-5), breakdown by star, recent reviews with photos
- [ ] "Book Now" CTA sticky at bottom
- [ ] Share business via native share sheet / copy link
- [ ] Report business option (inappropriate content)

**Technical Notes**:
- Lazy load images with blur placeholder
- Preload next image in carousel
- Reviews paginated (10 per page)

---

### 4.6 Service Categories

**Priority**: P0 (Critical)

**Description**: Hierarchical categorization of services for discovery and organization.

**User Stories**:
- As a user, I want to browse by category so I can discover new services.
- As a business owner, I want to assign categories to my services so customers can find them.

**Acceptance Criteria**:
- [ ] Two-level hierarchy: Parent Category → Subcategory
- [ ] Parent categories: Hair, Nails, Face & Body, Massage, Wellness, Medical Aesthetic
- [ ] Each parent has 4-10 subcategories (e.g., Hair → Cut, Color, Styling, Treatment)
- [ ] Category icons and color coding in UI
- [ ] Business can assign multiple categories to a service
- [ ] Category pages show featured businesses and trending services
- [ ] Admin can CRUD categories with icon upload

**Technical Notes**:
- Self-referencing table: `Category` with `parentId`
- Materialized path or closure table for efficient subtree queries
- Category slugs for SEO-friendly URLs

---

### 4.7 Booking Flow

**Priority**: P0 (Critical)

**Description**: Streamlined multi-step booking process with real-time availability.

**User Stories**:
- As a user, I want to select a service, choose a staff member, pick a time slot, and confirm my booking.
- As a user, I want to add notes or special requests to my booking.
- As a user, I want to pay a deposit or full amount to secure my appointment.

**Acceptance Criteria**:
- [ ] Step 1: Select service(s) — allow multi-service booking with automatic time stacking
- [ ] Step 2: Select staff member or "No preference" (any available)
- [ ] Step 3: Select date (calendar view) and time slot (horizontal scroll or grid)
- [ ] Step 4: Review booking summary with service, staff, time, location, price
- [ ] Step 5: Add notes (max 500 chars), apply promo code, select payment method
- [ ] Step 6: Confirm and pay (if required)
- [ ] Real-time slot availability with optimistic locking (hold slot for 10 minutes during checkout)
- [ ] Booking confirmation screen with calendar invite (.ics) and add-to-calendar options
- [ ] SMS and push confirmation immediately after booking

**Technical Notes**:
- Slot computation engine (see 4.11)
- Pessimistic lock on slot selection using Redis with TTL
- Idempotency key on booking creation to prevent duplicates
- Transactional email/SMS via BullMQ jobs

---

### 4.8 Appointment Management

**Priority**: P0 (Critical)

**Description**: Users can view, modify, and cancel their appointments.

**User Stories**:
- As a user, I want to see all my upcoming and past appointments.
- As a user, I want to reschedule or cancel an appointment if my plans change.
- As a user, I want to receive reminders before my appointment.

**Acceptance Criteria**:
- [ ] Appointments list: upcoming (sorted by date) and past (last 12 months)
- [ ] Appointment card: business name, service, staff, date/time, status, address with map
- [ ] Reschedule: return to slot selection with current booking held; new slot must be available
- [ ] Cancel: with reason selection (user no-show, found elsewhere, schedule conflict, other)
- [ ] Cancellation policy enforced: free cancellation >24h, 50% charge 4-24h, 100% charge <4h
- [ ] Push reminder: 24h, 2h, and 15min before appointment
- [ ] Rebook button for past appointments
- [ ] No-show marking by business affects user's future booking ability (3 strikes)

**Technical Notes**:
- Soft delete with cancellation reason and timestamp
- Refund logic integrated with payment service
- Reminder jobs scheduled via BullMQ

---

### 4.9 Favorites

**Priority**: P1 (High)

**Description**: Users can save favorite businesses for quick access.

**User Stories**:
- As a user, I want to favorite businesses so I can find them quickly later.
- As a user, I want to see my favorites list and remove items.

**Acceptance Criteria**:
- [ ] Heart icon on business card and detail view; toggles favorite status
- [ ] Favorites list in user profile, sorted by most recently added
- [ ] Favorite count displayed on business profile (public)
- [ ] Sync favorites across devices for logged-in users
- [ ] Guest favorites prompt account creation on app restart
- [ ] Batch remove from favorites

**Technical Notes**:
- Many-to-many join table: `UserFavorite` with `userId`, `businessId`, `createdAt`
- Optimistic UI update with rollback on error

---

### 4.10 User Profile

**Priority**: P1 (High)

**Description**: User-managed personal information and preferences.

**User Stories**:
- As a user, I want to manage my personal info, payment methods, and preferences.
- As a user, I want to see my booking history and spending.

**Acceptance Criteria**:
- [ ] Profile: name, email, phone, profile photo, date of birth (optional)
- [ ] Payment methods: add, set default, delete (with active booking check)
- [ ] Booking history: all appointments with filter by status and business
- [ ] Preferences: notification settings (push, email, SMS), language, distance unit (km/mi)
- [ ] Privacy: data download (GDPR), account deletion with 30-day grace period
- [ ] Loyalty/stamp card integration placeholder

**Technical Notes**:
- Profile photo upload to S3 with image optimization (WebP, 200x200 thumbnail)
- Soft delete for account deletion with reactivation email within 30 days

---

### 4.11 Availability & Slot Computation

**Priority**: P0 (Critical)

**Description**: Core engine that generates available time slots based on business hours, staff schedules, existing bookings, and buffer times.

**User Stories**:
- As a business owner, I want to set my weekly availability and exceptions.
- As a user, I want to see only truly available slots.

**Acceptance Criteria**:
- [ ] Weekly recurring schedule: day of week, start/end times, break periods
- [ ] Exception dates: holidays, time off, modified hours
- [ ] Staff-specific schedules override business default
- [ ] Service duration + buffer time (configurable per service) defines slot consumption
- [ ] Slot generation: 15-minute granularity, respecting all constraints
- [ ] Real-time updates: slot removed immediately upon booking start
- [ ] Timezone handling: all times stored in UTC, displayed in business timezone
- [ ] Performance: generate 30 days of slots for single staff in <100ms

**Technical Notes**:
- Pre-computed slot cache in Redis, invalidated on schedule change or booking
- Slot generation algorithm: iterate business hours, subtract breaks and existing bookings
- Edge case: cross-timezone bookings, daylight saving transitions
- BullMQ job to warm cache daily at midnight per timezone

---

### 4.12 Shared Types & Design System

**Priority**: P0 (Critical)

**Description**: Consistent UI/UX across all platforms via shared design system and type definitions.

**User Stories**:
- As a developer, I want reusable components and types so I can build features quickly.
- As a user, I want a consistent experience across iOS, Android, and web.

**Acceptance Criteria**:
- [ ] Design tokens: colors, typography, spacing, shadows, border-radius
- [ ] Component library: Button, Input, Card, Modal, Calendar, TimeSlot, Avatar, Rating, Badge
- [ ] Shared TypeScript types: all entities, DTOs, API responses shared between frontend and backend
- [ ] Theme support: light/dark mode with system preference detection
- [ ] Accessibility: WCAG 2.1 AA compliance, screen reader support, minimum touch target 44x44dp
- [ ] Animation standards: 200ms transitions, consistent easing curves

**Technical Notes**:
- Monorepo structure with `packages/ui` and `packages/types`
- Storybook for component documentation
- React Native + web shared via React Native Web or separate native components

---

### 4.13 Reviews & Ratings

**Priority**: P1 (High)

**Description**: User-generated reviews and ratings for businesses and staff.

**User Stories**:
- As a user, I want to leave a review after my appointment to share my experience.
- As a user, I want to read reviews to help me choose a business.
- As a business owner, I want to respond to reviews.

**Acceptance Criteria**:
- [ ] Review eligibility: only after completed appointment, within 14 days
- [ ] Rating: 1-5 stars, overall and optional sub-ratings (service, ambiance, staff)
- [ ] Review text: 10-1000 characters, profanity filter
- [ ] Photo upload: up to 5 images per review
- [ ] Business owner response: single response per review, editable within 30 days
- [ ] Review helpfulness voting (thumbs up/down)
- [ ] Report review for moderation
- [ ] Average rating recalculated in real-time; cached for performance

**Technical Notes**:
- Review moderation queue for reported content
- Sentiment analysis optional for auto-flagging
- Photo moderation via AWS Rekognition

---

### 4.14 Payment Integration

**Priority**: P0 (Critical)

**Description**: Secure payment processing for booking deposits and full payments.

**User Stories**:
- As a user, I want to pay with credit card, Apple Pay, or Google Pay.
- As a business owner, I want to receive payouts for bookings.
- As a user, I want to save my payment method for faster checkout.

**Acceptance Criteria**:
- [ ] Stripe integration: PaymentIntent for bookings, SetupIntent for saved methods
- [ ] Supported methods: Visa, Mastercard, Amex, Apple Pay, Google Pay
- [ ] 3D Secure for applicable cards
- [ ] Deposit vs. full payment configurable per business/service
- [ ] Refund processing: full, partial, or no refund based on cancellation policy
- [ ] Payouts to business owners: weekly automatic transfer, payout dashboard
- [ ] Invoice/receipt generation and email delivery
- [ ] PCI compliance: no card data stored locally, use Stripe Elements

**Technical Notes**:
- Webhook handling for payment events (payment_intent.succeeded, payment_intent.payment_failed, charge.dispute.created)
- Idempotency keys on all payment requests
- BullMQ job for payout batch processing

---

### 4.15 Notifications

**Priority**: P1 (High)

**Description**: Multi-channel notification system for user engagement and operational alerts.

**User Stories**:
- As a user, I want to receive timely notifications about my bookings.
- As a business owner, I want to be notified of new bookings and cancellations.

**Acceptance Criteria**:
- [ ] Push notifications: booking confirmed, reminder, rescheduled, cancelled, promotional
- [ ] SMS: booking confirmation, day-before reminder, same-day reminder
- [ ] Email: booking confirmation with .ics, receipt, account-related
- [ ] In-app notification center with read/unread status
- [ ] User preference controls: enable/disable per channel and type
- [ ] Business owner notifications: new booking, cancellation, review received, low inventory
- [ ] Notification templates editable by admin (content, not structure)
- [ ] Delivery tracking: sent, delivered, opened metrics

**Technical Notes**:
- Firebase Cloud Messaging for push
- Twilio for SMS
- SendGrid for email
- BullMQ queues per channel with retry logic and dead letter queue

---

### 4.16 Provider / Business Owner Portal

**Priority**: P0 (Critical)

**Description**: Web-based portal for business owners to manage their presence, services, staff, and appointments.

**User Stories**:
- As a business owner, I want to set up my business profile and services.
- As a business owner, I want to manage my staff and their schedules.
- As a business owner, I want to view and manage incoming bookings.
- As a business owner, I want to see analytics about my business performance.

**Acceptance Criteria**:
- [ ] Dashboard: upcoming appointments today, new bookings this week, revenue summary
- [ ] Business profile: edit name, description, photos, hours, contact info, social links
- [ ] Service management: CRUD services with name, description, duration, price, deposit, category
- [ ] Staff management: add staff (invite via email), set roles (admin, manager, staff), assign services, set schedules
- [ ] Schedule/calendar view: day/week/month views, drag to create/modify availability, block time off
- [ ] Booking management: view all bookings, filter by status, accept/decline (if approval required), check-in client
- [ ] Client management: view client list, notes, booking history, block client
- [ ] Analytics: appointments, revenue, cancellation rate, top services, new vs. returning clients
- [ ] Settings: notification preferences, payment account (Stripe Connect), team permissions

**Technical Notes**:
- Role-based access control (RBAC): owner, admin, manager, staff
- Stripe Connect onboarding for payouts
- Real-time updates via WebSocket for new bookings

---

### 4.17 Admin Dashboard

**Priority**: P1 (High)

**Description**: Platform administration for operations, support, and business intelligence.

**User Stories**:
- As an admin, I want to onboard and verify businesses.
- As an admin, I want to monitor platform health and handle disputes.
- As an admin, I want to view analytics and generate reports.

**Acceptance Criteria**:
- [ ] Business onboarding queue: review submissions, approve/reject with reason, request more info
- [ ] User management: search, view profiles, suspend/activate accounts
- [ ] Booking oversight: view all bookings, intervene in disputes, process manual refunds
- [ ] Content moderation: review reported businesses, reviews, photos; take action
- [ ] Category management: CRUD service categories, assign icons, set display order
- [ ] Promotions: create promo codes (percentage/fixed, usage limits, expiration, applicable businesses)
- [ ] Analytics: MAU, bookings, GMV, churn, top businesses, geographic distribution
- [ ] System health: queue depths, error rates, API latency, recent alerts
- [ ] Audit log: all admin actions with admin ID, timestamp, before/after state

**Technical Notes**:
- Separate admin API with stricter auth (MFA optional)
- Read replicas for heavy analytics queries
- Data export to CSV/Excel

---

### 4.18 Background Jobs (BullMQ)

**Priority**: P0 (Critical)

**Description**: Reliable, scalable background job processing for all asynchronous operations.

**User Stories**:
- As a developer, I want durable job queues so no operations are lost.
- As a user, I want my notifications and emails to be reliable.

**Acceptance Criteria**:
- [ ] Job queues defined: `notifications`, `emails`, `sms`, `payments`, `analytics`, `search-index`, `image-processing`, `slot-cache-warm`
- [ ] Retry policy: 3 attempts with exponential backoff (delay: 5s, 25s, 125s)
- [ ] Dead letter queue for failed jobs after max retries; admin alert on DLQ growth
- [ ] Job prioritization: critical (payments), normal (notifications), low (analytics)
- [ ] Job scheduling: delayed jobs for reminders, recurring jobs for reports
- [ ] Job idempotency: deduplication via job ID or payload hash
- [ ] Monitoring: queue depth, processing rate, failure rate, average job duration
- [ ] Graceful shutdown: finish in-progress jobs before process exit

**Technical Notes**:
- Redis-backed BullMQ with Redis Sentinel for HA
- Separate worker processes per queue type
- Job progress tracking for long-running tasks

---

## 5. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | API p95 < 200ms; page load < 2s on 4G |
| Scalability | Horizontal scaling via Kubernetes; auto-scale on CPU/memory |
| Security | OWASP Top 10 mitigation; dependency scanning; penetration testing annually |
| Privacy | GDPR/CCPA compliance; data retention policies; encryption at rest and in transit |
| Accessibility | WCAG 2.1 AA; screen reader support; keyboard navigation |
| i18n | English (default), French, Spanish, German; RTL support planned |

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.11, 4.12, 4.14, 4.16, 4.18 | Month 1-3 |
| v1.1 | 4.9, 4.10, 4.13, 4.15 | Month 4 |
| v1.2 | 4.17 (full), advanced analytics, referral program | Month 5-6 |

## 7. Open Questions

1. International expansion: which markets first?
2. Subscription model for businesses: tiers and pricing?
3. In-app messaging between users and businesses?
4. Loyalty program design and integration?

---

*Document version: 1.0*
*Last updated: 2024*
*Owner: Product Team*
