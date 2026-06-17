# Planity Clone — Product Specification

## 1. Overview

### 1.1 Product Vision
Build a comprehensive beauty and wellness booking platform that connects customers with local salons, spas, and independent professionals. The platform serves three primary user groups: customers seeking beauty services, business owners managing their operations, and administrators overseeing the platform.

### 1.2 Target Users
- **Customers**: Individuals aged 18-55, primarily women, seeking beauty and wellness services
- **Business Owners**: Salon/spa owners and independent beauty professionals
- **Administrators**: Platform operators managing the marketplace

### 1.3 Success Metrics
- User registration rate > 60% of app installs
- Booking conversion rate > 15% of search sessions
- Business onboarding rate > 40% of leads
- Customer retention (30-day) > 35%
- NPS score > 50

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority**: High | **Story Points**: 8

#### Description
Secure user authentication system supporting multiple login methods with role-based access control.

#### Acceptance Criteria
- **AC-1**: Users can register with email/password, Google OAuth, Apple Sign-In, and Facebook Login
- **AC-2**: Password requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
- **AC-3**: Email verification required before account activation; verification link expires in 24 hours
- **AC-4**: JWT-based authentication with access token (15 min) and refresh token (7 days)
- **AC-5**: Password reset via email with secure token (expires in 1 hour)
- **AC-6**: Biometric authentication support (Face ID, Touch ID, Fingerprint) on mobile
- **AC-7**: Account lockout after 5 failed attempts, unlock via email or 30-minute timeout
- **AC-8**: Role-based access: Customer, Business Owner, Admin, Staff

#### Technical Notes
- Implement rate limiting: 5 requests/minute per IP for auth endpoints
- Store passwords with bcrypt (cost factor 12)
- Support OAuth 2.0 + OpenID Connect

---

### 2.2 Guest Browse & Explore
**Priority**: High | **Story Points**: 5

#### Description
Allow unauthenticated users to browse businesses, services, and availability without registration.

#### Acceptance Criteria
- **AC-1**: Guest users can view business listings, service catalogs, and general availability
- **AC-2**: Guest users can search by location, service category, and business name
- **AC-3**: Guest users can view business details, photos, reviews, and pricing
- **AC-4**: Booking action triggers authentication prompt with pre-filled context
- **AC-5**: Guest session data (search filters, viewed businesses) persists for 7 days via local storage
- **AC-6**: Prompt to create account after 3 business detail views or 5 minutes of browsing

---

### 2.3 Business Search & Discovery
**Priority**: High | **Story Points**: 13

#### Description
Powerful search and discovery engine for finding businesses based on multiple criteria.

#### Acceptance Criteria
- **AC-1**: Full-text search across business name, service names, and descriptions
- **AC-2**: Filter by: service category, price range, rating (1-5 stars), distance, availability (today, this week), amenities
- **AC-3**: Sort options: relevance, rating, price (low-high, high-low), distance, most reviewed
- **AC-4**: Auto-complete suggestions with recent searches and trending businesses
- **AC-5**: Search results display: business photo, name, rating, starting price, distance, next available slot
- **AC-6**: Pagination with 20 results per page, infinite scroll on mobile
- **AC-7**: Search history saved for authenticated users (last 20 searches)
- **AC-8**: "Near Me" search using GPS with configurable radius (default 5km, max 50km)

---

### 2.4 Map-based Search
**Priority**: High | **Story Points**: 8

#### Description
Interactive map view for geographic discovery of businesses.

#### Acceptance Criteria
- **AC-1**: Map displays business markers clustered by density; clusters break apart on zoom
- **AC-2**: Marker color indicates availability: green (available today), yellow (available this week), gray (limited availability)
- **AC-3**: Tap marker shows business card preview with photo, name, rating, and next available slot
- **AC-4**: Map bounds update search results in real-time; debounced at 300ms
- **AC-5**: User location dot with accuracy ring; follow mode option
- **AC-6**: List view toggle with synchronized state between map and list
- **AC-7**: Support for satellite and standard map styles
- **AC-8**: Offline cache of viewed map tiles (last 30 days)

---

### 2.5 Business Detail View
**Priority**: High | **Story Points**: 8

#### Description
Comprehensive business profile page with all information needed to make a booking decision.

#### Acceptance Criteria
- **AC-1**: Hero section: business name, cover photo, profile photo, rating, review count, favorite button, share button
- **AC-2**: Photo gallery: up to 50 photos, swipeable carousel, full-screen viewer with pinch-to-zoom
- **AC-3**: Services tab: categorized service list with name, duration, description, price; expandable details
- **AC-4**: Reviews tab: overall rating breakdown (5-star distribution), sortable reviews (newest, highest, lowest), owner responses
- **AC-5**: About tab: description, amenities list, business hours, contact info, website link, social media links
- **AC-6**: Team tab: staff profiles with photos, bios, specialties, and individual ratings
- **AC-7**: Sticky "Book Now" CTA button always visible on scroll
- **AC-8**: Deep linking support for sharing specific business pages

---

### 2.6 Service Categories
**Priority**: High | **Story Points**: 5

#### Description
Hierarchical categorization system for organizing beauty and wellness services.

#### Acceptance Criteria
- **AC-1**: Top-level categories: Hair, Nails, Face, Body, Massage, Makeup, Barber, Spa, Wellness, Medical Aesthetics
- **AC-2**: Each category has subcategories (e.g., Hair > Cut, Color, Styling, Treatment)
- **AC-3**: Category icons and colors consistent across app (shared design system)
- **AC-4**: Category browsing from home screen with visual grid
- **AC-5**: Trending and popular services highlighted per category
- **AC-6**: Businesses can assign multiple categories and subcategories to their services
- **AC-7**: Category-based filtering in search with multi-select support

---

### 2.7 Booking Flow
**Priority**: High | **Story Points**: 13

#### Description
Seamless multi-step booking process from service selection to confirmation.

#### Acceptance Criteria
- **AC-1**: Step 1 — Service Selection: user selects service(s), sees duration and price; can add multiple services
- **AC-2**: Step 2 — Staff Selection: user chooses specific staff member or "No preference"; sees staff availability
- **AC-3**: Step 3 — Date & Time: calendar view with available slots; slots update based on staff and service duration
- **AC-4**: Step 4 — Review & Confirm: order summary with service details, staff, date/time, price breakdown, cancellation policy
- **AC-5**: Step 5 — Payment: secure payment processing with saved methods; supports cards, Apple Pay, Google Pay
- **AC-6**: Step 6 — Confirmation: booking reference, add to calendar option, share booking, directions to business
- **AC-7**: Real-time slot availability with 5-minute hold during booking process
- **AC-8**: Booking modification allowed up to 2 hours before appointment (same flow)
- **AC-9**: Guest checkout supported with email collection for confirmation

---

### 2.8 Appointment Management
**Priority**: High | **Story Points**: 8

#### Description
Comprehensive appointment lifecycle management for customers and business owners.

#### Acceptance Criteria
- **AC-1**: Customer "My Bookings" view: upcoming and past appointments, filterable by status
- **AC-2**: Appointment card shows: business photo, service name, staff name, date/time, status, price, booking reference
- **AC-3**: Actions per appointment: reschedule (up to 2h before), cancel with reason selection, rebook, contact business
- **AC-4**: Cancellation policy displayed: free cancellation up to 24h, 50% charge 2-24h, 100% charge < 2h
- **AC-5**: Push notification and email reminders: 24 hours, 2 hours, and 15 minutes before appointment
- **AC-6**: Business owner calendar view: day, week, month views; color-coded by status
- **AC-7**: Business owner can: confirm, reschedule, cancel, mark no-show, mark complete, add notes
- **AC-8**: Walk-in appointments can be added manually by business owner

---

### 2.9 Favorites
**Priority**: Medium | **Story Points**: 3

#### Description
Save and organize favorite businesses for quick rebooking.

#### Acceptance Criteria
- **AC-1**: Heart icon on business cards and detail pages toggles favorite status
- **AC-2**: Favorites list accessible from profile tab; shows business photo, name, rating, next availability
- **AC-3**: Favorites synced across devices for authenticated users
- **AC-4**: Push notification when favorite business has new availability or promotion
- **AC-5**: Maximum 200 favorites per user; oldest auto-removed when limit reached
- **AC-6**: Quick rebook from favorites: one-tap to booking flow with pre-selected business

---

### 2.10 User Profile
**Priority**: Medium | **Story Points**: 5

#### Description
Customer profile management with preferences and history.

#### Acceptance Criteria
- **AC-1**: Profile photo, name, phone, email, date of birth (for birthday offers), gender
- **AC-2**: Saved payment methods with default selection; PCI-compliant tokenization
- **AC-3**: Notification preferences: push, email, SMS — per event type (bookings, promotions, reminders)
- **AC-4**: Privacy settings: profile visibility, data download, account deletion (GDPR right to erasure)
- **AC-5**: Booking history with search and filter; ability to rebook past appointments
- **AC-6**: Loyalty points and rewards status (if applicable)
- **AC-7**: Referral code generation and tracking

---

### 2.11 Availability & Slot Computation
**Priority**: High | **Story Points**: 13

#### Description
Real-time availability engine computing bookable slots based on complex business rules.

#### Acceptance Criteria
- **AC-1**: Business sets working hours per day with support for split shifts (e.g., 9-12, 14-18)
- **AC-2**: Staff-specific schedules with override capability for time off and holidays
- **AC-3**: Service duration and buffer time (prep/cleanup) configurable per service
- **AC-4**: Slot computation considers: staff availability, service duration, existing bookings, buffers, business hours
- **AC-5**: Support for concurrent bookings if business has multiple rooms/stations
- **AC-6**: Real-time updates: slots marked unavailable within 2 seconds of booking
- **AC-7**: Last-minute availability: slots within 2 hours hidden unless explicitly enabled by business
- **AC-8**: Buffer rules: minimum 15 min between appointmentsellig appointments, configurable
- **AC-9**: Cache computed slots with 30-second TTL; invalidate on booking changes

---

### 2.12 Shared Types & Design System
**Priority**: High | **Story Points**: 5

#### Description
Consistent design language and reusable components across the platform.

#### Acceptance Criteria
- **AC-1**: Color palette: primary (#FF6B6B), secondary (#4ECDC4), success (#51CF66), warning (#FFD43B), error (#FF6B6B), neutral grays
- **AC-2**: Typography: Inter font family, scale from XS (12px) to 4XL (48px)
- **AC-3**: Spacing system: 4px base unit (4, 8, 12, 16, 24, 32, 48, 64)
- **AC-4**: Component library: buttons, inputs, cards, modals, toasts, loaders, avatars, badges
- **AC-5**: Shared TypeScript types across frontend and backend (monorepo)
- **AC-6**: Accessibility: WCAG 2.1 AA compliance, minimum touch target 44x44px, screen reader support
- **AC-7**: Dark mode support with automatic system preference detection
- **AC-8**: Animation standards: 200ms transitions, ease-in-out, reduced motion support

---

### 2.13 Reviews & Ratings
**Priority**: Medium | **Story Points**: 5

#### Description
Customer feedback system for businesses and services.

#### Acceptance Criteria
- **AC-1**: Eligibility: customers can review after completed appointment; one review per appointment
- **AC-2**: Rating: 1-5 stars with half-star precision; mandatory rating, optional text review (min 20, max 1000 chars)
- **AC-3**: Review categories: service quality, staff professionalism, ambiance, value for money
- **AC-4**: Photo upload: up to 5 photos per review
- **AC-5**: Business owner response: can reply once per review; reply editable within 24 hours
- **AC-6**: Review moderation: auto-flag for profanity, manual review for reported content
- **AC-7**: Sorting: most helpful, newest, highest, lowest; helpfulness voting
- **AC-8**: Aggregate rating displayed as average with total count; updated in real-time

---

### 2.14 Payment Integration
**Priority**: High | **Story Points**: 13

#### Description
Secure payment processing for bookings with multiple payment methods.

#### Acceptance Criteria
- **AC-1**: Payment methods: credit/debit cards (Visa, Mastercard, Amex), Apple Pay, Google Pay, PayPal
- **AC-2**: Payment flow: Stripe Payment Intents with 3D Secure support
- **AC-3**: Pricing: service price + platform fee (configurable %) + applicable tax
- **AC-4**: Hold vs. charge: option to hold payment at booking, charge on completion; or charge immediately
- **AC-5**: Refund policy: full refund > 24h, 50% refund 2-24h, no refund < 2h; configurable by business
- **AC-6**: Receipt generation: email receipt with itemized breakdown; downloadable PDF
- **AC-7**: Failed payment handling: retry logic, customer notification, grace period of 1 hour
- **AC-8**: Payout to business: weekly automated transfers to connected bank account
- **AC-9**: PCI compliance: no card data stored on our servers; tokenization only

---

### 2.15 Notifications
**Priority**: Medium | **Story Points**: 8

#### Description
Multi-channel notification system for timely user communication.

#### Acceptance Criteria
- **AC-1**: Channels: push notifications (Firebase Cloud Messaging), email (SendGrid), SMS (Twilio)
- **AC-2**: Notification types: booking confirmations, reminders, cancellations, promotions, review requests, system updates
- **AC-3**: User preference controls: per-channel and per-type opt-in/opt-out
- **AC-4**: Rich push notifications with deep links to relevant app screens
- **AC-5**: Notification history accessible in-app with unread indicators
- **AC-6**: Quiet hours: no non-urgent notifications between 22:00 and 08:00 local time
- **AC-7**: Batch digest option: daily summary instead of individual notifications
- **AC-8**: Delivery tracking: log delivery status, retries for failed deliveries

---

### 2.16 Provider / Business Owner Portal
**Priority**: High | **Story Points**: 13

#### Description
Dedicated web portal for business owners to manage their presence and operations.

#### Acceptance Criteria
- **AC-1**: Separate login portal at /business with role-based access
- **AC-2**: Dashboard: upcoming appointments, revenue today/this week/this month, new reviews, quick actions
- **AC-3**: Business profile management: photos, description, services, staff, hours, amenities
- **AC-4**: Service management: add/edit/delete services, set pricing, duration, buffers, staff associations
- **AC-5**: Staff management: add staff profiles, set schedules, assign services, manage permissions
- **AC-6**: Calendar & bookings: view, confirm, reschedule, cancel appointments; block time slots
- **AC-7**: Client management: client list, booking history, notes, contact info
- **AC-8**: Analytics: revenue trends, booking volume, popular services, client retention, no-show rate
- **AC-9**: Settings: payment info, notification preferences, integration settings (Google Calendar, etc.)

---

### 2.17 Admin Dashboard
**Priority**: Medium | **Story Points**: 8

#### Description
Platform administration interface for managing the marketplace.

#### Acceptance Criteria
- **AC-1**: Secure login with 2FA required for admin accounts
- **AC-2**: Overview dashboard: KPIs, active users, bookings today, revenue, new businesses
- **AC-3**: User management: search, view, suspend, delete users; export user data
- **AC-4**: Business management: approve/reject new businesses, feature businesses, handle disputes
- **AC-5**: Content moderation: review flagged reviews, photos, business descriptions
- **AC-6**: Financial oversight: transaction logs, refunds, payouts, commission reports
- **AC-7**: Support tickets: view, assign, respond to customer and business inquiries
- **AC-8**: Platform settings: commission rates, promotional campaigns, notification templates
- **AC-9**: Audit logs: track all admin actions with timestamp and IP address

---

### 2.18 Background Jobs (BullMQ)
**Priority**: High | **Story Points**: 8

#### Description
Reliable background job processing for asynchronous operations.

#### Acceptance Criteria
- **AC-1**: Job types and scheduling:
  - Appointment reminders: 24h, 2h, 15min before (cron + delayed jobs)
  - Review requests: 2 hours after appointment completion
  - Payment processing: charge holds, process payouts (daily)
  - Notification delivery: push, email, SMS queue processing
  - Analytics aggregation: hourly, daily, weekly reports
  - Data cleanup: purge old logs, expired tokens (nightly)
- **AC-2**: Retry policy: 3 attempts with exponential backoff (5s, 25s, 125s)
- **AC-3**: Dead letter queue for failed jobs after max retries; manual retry interface
- **AC-4**: Job progress tracking and real-time status updates for long-running jobs
- **AC-5**: Concurrency control: max 5 workers per queue, priority levels (high, normal, low)
- **AC-6**: Monitoring: job completion rate, average processing time, queue depth alerts
- **AC-7**: Idempotency: jobs include idempotency key; duplicate jobs within 24h deduplicated

---

## 3. Data Model (High-Level)

### Core Entities
- **User**: id, email, phone, password_hash, role, profile_photo, created_at, updated_at
- **Business**: id, owner_id, name, slug, description, address, location (lat/lng), phone, email, website, photos, status, created_at
- **Service**: id, business_id, category_id, name, description, duration, buffer_time, price, status
- **Staff**: id, business_id, name, email, phone, photo, bio, status
- **Appointment**: id, user_id, business_id, service_id, staff_id, start_time, end_time, status, price, notes, created_at
- **Review**: id, user_id, business_id, appointment_id, rating, comment, photos, status, created_at
- **Payment**: id, appointment_id, user_id, amount, currency, status, payment_method, transaction_id, created_at
- **Notification**: id, user_id, type, channel, title, body, data, status, sent_at, read_at

---

## 4. API Design Principles

- RESTful API with JSON payloads
- Versioning: /api/v1/ prefix
- Pagination: cursor-based for lists, max 100 items per page
- Rate limiting: 100 requests/minute per user, 1000 requests/minute per API key
- Error format: { "error": { "code": "string", "message": "string", "details": {} } }
- Authentication: Bearer token in Authorization header

---

## 5. Security Requirements

- HTTPS only, HSTS enabled
- SQL injection prevention via parameterized queries (Prisma)
- XSS protection with Content Security Policy
- CSRF tokens for state-changing operations
- Input validation on all endpoints (Zod schemas)
- Sensitive data encryption at rest (AES-256)
- Audit logging for authentication and payment events
- Regular dependency vulnerability scanning

---

## 6. Performance Targets

- API response time: p50 < 100ms, p95 < 300ms, p99 < 500ms
- Page load time: initial < 2s, subsequent < 1s
- Search results: < 500ms for complex queries
- Map marker rendering: < 100ms for 100 markers
- Image loading: progressive loading, WebP format, lazy loading

---

## 7. Accessibility Requirements

- WCAG 2.1 Level AA compliance
- Screen reader compatibility (ARIA labels, roles)
- Keyboard navigation support
- Color contrast ratio ≥ 4.5:1 for text
- Focus indicators visible
- Alternative text for all images
- Form validation with clear error messages

---

## 8. Analytics & Tracking

- Event tracking: search, view_business, view_service, start_booking, complete_booking, cancel_booking, write_review
- Funnel analysis: search → view → start_booking → complete_booking
- Cohort retention: D1, D7, D30, D90
- Business metrics: booking volume, revenue, conversion rate, no-show rate
- User segmentation: new vs. returning, high-value customers, churn risk

---

## 9. Third-Party Integrations

- **Maps**: Google Maps Platform (Places API, Maps JavaScript API, Geocoding API)
- **Payments**: Stripe (Payments, Connect for payouts)
- **Auth**: Firebase Authentication (OAuth providers)
- **Push Notifications**: Firebase Cloud Messaging
- **Email**: SendGrid
- **SMS**: Twilio
- **Analytics**: Mixpanel, Google Analytics
- **Error Tracking**: Sentry
- **Monitoring**: Datadog or New Relic

---

## 10. Release Criteria

### MVP (Phase 1)
- User Authentication (email, Google, Apple)
- Guest Browse & Explore
- Business Search & Discovery (text + map)
- Business Detail View
- Service Categories
- Booking Flow (single service, single staff)
- Appointment Management (customer view)
- Availability & Slot Computation
- Payment Integration (cards only)
- Notifications (push + email)
- Reviews & Ratings (post-booking)
- User Profile
- Favorites
- Business Owner Portal (basic)
- Admin Dashboard (basic)
- Background Jobs

### Phase 2
- Multi-service bookings
- Package deals and gift cards
- Loyalty program
- Group bookings
- Advanced analytics
- Marketing tools for businesses
- Mobile apps (iOS/Android native)

---

*Document Version: 1.0*
*Last Updated: 2024*
*Owner: Product Team*