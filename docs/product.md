# Planity Clone — Product Specification

## 1. Overview

### 1.1 Product Vision
Planity Clone is a mobile-first appointment booking platform connecting customers with local beauty, wellness, and health service providers. Customers discover businesses, browse services, view real-time availability, and book appointments. Business owners manage their schedules, services, and client base through a dedicated portal.

### 1.2 Target Users
- **Customers (B2C)**: Individuals seeking to book beauty, wellness, and health appointments
- **Business Owners (B2B)**: Salons, barbershops, spas, clinics managing appointments and staff
- **Admin (Internal)**: Platform administrators overseeing users, businesses, and platform health

### 1.3 Platform
- iOS and Android mobile applications (React Native / Flutter)
- Responsive web application
- Business Owner Portal (web)
- Admin Dashboard (web)

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority:** P0 — Critical

**User Story:**
As a customer, I want to create an account and log in so that I can book appointments and manage my bookings securely.

**Acceptance Criteria:**
- [ ] User can register with email, password, phone number, and full name
- [roletor] User can register/login with Google OAuth 2.0
- [ ] User can register/login with Apple Sign-In (iOS only)
- [ ] User can log in with email and password
- [ ] Password must be minimum 8 characters with at least one uppercase, one lowercase, and one number
- [ ] User receives email verification link upon registration
- [ ] User can request password reset via email
- [ ] User can log out from any device
- [ ] JWT tokens are used for session management with refresh token rotation
- [ ] User sees clear error messages for invalid credentials
- [ ] Account lockout after 5 failed attempts for 30 minutes

**Technical Notes:**
- Access token TTL: 15 minutes
- Refresh token TTL: 7 days
- Store tokens securely using Keychain (iOS) and Keystore (Android)

---

### 2.2 Guest Browse & Explore
**Priority:** P0 — Critical

**User Story:**
As a guest user, I want to browse businesses and services without creating an account so that I can explore the platform before committing.

**Acceptance Criteria:**
- [ ] Guest can view business listings without authentication
- [ ] Guest can search businesses by name, service, or location
- [ ] Guest can view business detail pages with services, prices, and reviews
- [ ] Guest can view business photos and descriptions
- [ ] Guest is prompted to sign in when attempting to book an appointment
- [ ] Guest can view map with business locations
- [ ] Guest cannot access appointment management, favorites, or profile features
- [ ] Guest session is tracked; converting to registered user preserves browse history

---

### 2.3 Business Search & Discovery
**Priority:** P0 — Critical

**User Story:**
As a customer, I want to search and filter businesses so that I can find the right service provider for my needs.

**Acceptance Criteria:**
- [ ] User can search by business name, service name, or generic keyword
- [ ] User can filter by: service category, price range, rating (1-5 stars), availability (today, this week), distance
- [ ] User can sort by: relevance, distance, rating, price (low to high)
- [ ] Search results display business card with: name, thumbnail photo, average rating, review count, starting price, distance
- [ ] Search supports autocomplete with suggestions for business names and services
- [ ] Recent searches are saved and displayed
- [ ] Popular searches are shown for new users
- [ ] Empty state shown when no results match criteria
- [ ] Pagination with infinite scroll (20 results per page)
- [ ] Search results update within 500ms of filter change

---

### 2.4 Map-based Search
**Priority:** P0 — Critical

**User Story:**
As a customer, I want to view businesses on a map so that I can find providers near my preferred location.

**Acceptance Criteria:**
- [ ] Map displays business pins based on current viewport
- [ ] User can pan and zoom map to explore different areas
- [ ] Tapping a pin shows business card preview with name, rating, and starting price
- [ ] User can center map on current location with one tap
- [ ] User can enter a specific address to center the map
- [ ] Map clusters pins when zoomed out (cluster count visible)
- [ ] Map view and list view are toggleable
- [ ] Map respects search filters applied in list view
- [ ] Default zoom shows businesses within 5km radius
- [ ] Map loads within 2 seconds on 4G connection

---

### 2.5 Business Detail View
**Priority:** P0 — Critical

**User Story:**
As a customer, I want to view detailed information about a business so that I can make an informed booking decision.

**Acceptance Criteria:**
- [ ] Header displays: business name, average rating, review count, favorite toggle, share button
- [ ] Photo gallery with up to 20 images, swipeable with pinch-to-zoom
- [ ] Business description with up to 2000 characters
- [ ] Address with tap-to-open in native maps app
- [ ] Phone number with tap-to-call
- [ ] Business hours displayed by day
- [ ] List of services with: name, duration, price, description
- [ ] Staff/professional list with photos and specialties
- [ ] Customer reviews with star rating, text, date, and reviewer name
- [ ] "Book Now" CTA always visible (sticky bottom)
- [ ] Related/similar businesses section at bottom
- [ ] Deep link support for sharing business profile

---

### 2.6 Service Categories
**Priority:** P0 — Critical

**User Story:**
As a customer, I want to browse services by category so that I can quickly find the type of service I need.

**Acceptance Criteria:**
- [ ] Home screen displays horizontal scroll of service category icons
- [ ] Categories include: Hair, Barber, Nails, Face & Skin, Massage, Spa, Makeup, Tattoo & Piercing, Wellness, Medical Aesthetic
- [ ] Each category has unique icon and color
- [ ] Tapping category filters businesses to those offering that category
- [ ] Category filter persists when switching between list and map views
- [ ] Businesses can belong to multiple categories
- [ ] Category badge shown on business cards
- [ ] Admin can create, edit, and deactivate categories
- [ ] Categories support localization (FR, EN, ES, DE)

---

### 2.7 Booking Flow
**Priority:** P0 — Critical

**User Story:**
As a customer, I want to book an appointment with a few taps so that I can secure my preferred time slot easily.

**Acceptance Criteria:**
- [ ] Step 1: Select service(s) — single or multiple services allowed
- [ ] Step 2: Select staff member or "No preference"
- [ ] Step 3: Select date — calendar view with availability indicators
- [ ] Step 4: Select time slot — horizontal scroll of available slots
- [ ] Step 5: Review booking summary with all details
- [ ] Step 6: Add notes or special requests (optional, 500 char max)
- [ ] Step 7: Confirm booking (payment if required, see Payment Integration)
- [ ] Real-time slot availability shown (no overbooking)
- [ ] Slot computation respects: business hours, staff breaks, existing appointments, buffer time between appointments
- [ ] User receives booking confirmation screen with add-to-calendar option
- [ ] Booking confirmation email and push notification sent
- [ ] Booking can be cancelled within flow before final confirmation
- [ ] Guest checkout supported with email/phone collection
- [ ] Maximum booking window: 90 days in advance
- [ ] Minimum booking window: 2 hours before appointment start

---

### 2.8 Appointment Management
**Priority:** P0 — Critical

**User Story:**
As a customer, I want to view and manage my appointments so that I can keep track of my bookings.

**Acceptance Criteria:**
- [ ] "My Appointments" tab shows upcoming and past appointments
- [ ] Upcoming appointments sorted by date (nearest first)
- [ ] Past appointments sorted by date (most recent first)
- [ ] Appointment card shows: business name, service, date/time, status
- [ ] Tapping appointment shows full details
- [ ] User can cancel upcoming appointment (respecting cancellation policy)
- [ ] User can reschedule to new available slot
- [ ] User can add appointment to phone calendar
- [ ] User can call business directly from appointment detail
- [ ] User can get directions to business
- [ ] Cancelled appointments shown in history with "Cancelled" status
- [ ] Push notification reminder: 24 hours and 1 hour before appointment
- [ ] No-show policy displayed and enforced

---

### 2.9 Favorites
**Priority:** P1 — High

**User Story:**
As a customer, I want to save my favorite businesses so that I can quickly rebook with providers I trust.

**Acceptance Criteria:**
- [ ] Heart icon on business card and detail page to add/remove favorite
- [ ] "My Favorites" tab lists all saved businesses
- [ ] Favorites sorted by most recently added
- [ ] User can remove favorite with tap
- [ ] Favorites persist across sessions and devices
- [ ] Favorite count shown on business detail
- [ ] User receives notification when favorite business adds new service or promotion (optional, user-configurable)
- [ ] Maximum 200 favorites per user

---

### 2.10 User Profile
**Priority:** P1 — High

**User Story:**
As a customer, I want to manage my profile and preferences so that my experience is personalized.

**Acceptance Criteria:**
- [ ] Profile photo upload (crop to circle, max 5MB, JPG/PNG)
- [ ] Display name (required, 2-50 characters)
- [ ] Phone number with verification via SMS
- [ ] Email address with verification status
- [ ] Date of birth (optional, for birthday promotions)
- [ ] Preferred language selection
- [ ] Notification preferences: push, email, SMS — on/off per type
- [ ] Privacy settings: profile visibility, data download, account deletion
- [ ] Change password functionality
- [ ] View connected social accounts with disconnect option
- [ ] App version and legal links (ToS, Privacy Policy)
- [ ] Profile completion progress indicator

---

### 2.11 Availability & Slot Computation
**Priority:** P0 — Critical

**User Story:**
As a system, I need to accurately compute available time slots so that customers can book without conflicts and businesses are never double-booked.

**Acceptance Criteria:**
- [ ] System computes slots based on: business operating hours, staff schedule, existing appointments, service duration, buffer time
- [ ] Slot granularity: 15-minute intervals
- [ ] Real-time availability query responds in <200ms
- [ ] Slots respect staff lunch breaks and time off
- [ ] Slots account for service-specific duration (variable per service)
- [ ] Buffer time between appointments configurable per business (default 0, max 30 min)
- [ ] Concurrent booking protection via database row-level locking
- [ ] Slot cache invalidated on any schedule change
- [ ] Support for recurring availability patterns (weekly)
- [ ] Support for exception dates (holidays, closures)
- [ ] Overbooking flag for admin override (emergencies)
- [ ] Slot computation service exposed via API for client apps

---

### 2.12 Shared Types & Design System
**Priority:** P1 — High

**User Story:**
As a development team, we need a consistent design system and shared types so that the product is cohesive and maintainable.

**Acceptance Criteria:**
- [ ] Design system includes: color palette (primary, secondary, semantic colors), typography scale (6 sizes), spacing scale (4px base), border radius, shadows, elevation
- [ ] Component library: buttons, inputs, cards, modals, bottom sheets, loaders, empty states, error states
- [ ] Shared TypeScript types for all API entities: User, Business, Service, Appointment, Review, Category, Staff, Slot
- [ ] Type definitions versioned and published to internal package registry
- [ ] Dark mode support with automatic system preference detection
- [ ] Accessibility: minimum touch target 44x44dp, color contrast WCAG AA, screen reader labels
- [ ] Animation standards: 200ms transitions, spring physics for gestures
- [ ] Icon set: consistent 24x24dp line icons
- [ ] Illustration style: flat, friendly, inclusive
- [ ] Localization framework with i18n keys for all user-facing text

---

### 2.13 Reviews & Ratings
**Priority:** P1 — High

**User Story:**
As a customer, I want to read and write reviews so that I can share my experience and help others choose.

**Acceptance Criteria:**
- [ ] Verified customers can leave review after completed appointment
- [ ] Review includes: star rating (1-5), text (optional, 10-2000 chars), date
- [ ] Business can respond to reviews publicly
- [ ] Reviews sorted by most helpful or most recent (user toggle)
- [ ] Average rating and distribution (1-5 star breakdown) displayed on business
- [ ] User can edit or delete their own review within 30 days
- [ ] Report review functionality for inappropriate content
- [ ] Admin moderation queue for reported reviews
- [ ] Reviews with profanity auto-flagged for review
- [ ] Business owner cannot delete reviews, only respond
- [ ] Review prompt sent via push notification 2 hours after appointment

---

### 2.14 Payment Integration
**Priority:** P0 — Critical

**User Story:**
As a customer, I want to pay for my appointment securely so that my booking is confirmed.

**Acceptance Criteria:**
- [ ] Support payment methods: credit/debit card (Stripe), Apple Pay, Google Pay
- [ ] Payment can be required at booking or at appointment (business-configurable)
- [ ] Deposit/partial payment option (business-configurable)
- [ ] Secure card storage with PCI-DSS compliant tokenization
- [ ] Payment confirmation shown immediately
- [ ] Invoice/receipt emailed after successful payment
- [ ] Refund processing for cancelled appointments per cancellation policy
- [ ] Failed payment retry with alternative method
- [ ] Payment history in user profile
- [ ] Support for promotional codes and gift cards (future)
- [ ] Webhook handling for payment status updates
- [ ] 3D Secure authentication for applicable cards

---

### 2.15 Notifications
**Priority:** P1 — High

**User Story:**
As a user, I want to receive timely notifications so that I stay informed about my bookings and don't miss appointments.

**Acceptance Criteria:**
- [ ] Push notifications: booking confirmation, reminder (24h, 1h), cancellation, rescheduled, promotion from favorite
- [ ] Email notifications: welcome, booking confirmation, reminder (24h), cancellation, receipt, password reset
- [ ] SMS notifications: booking confirmation, reminder (1h) — optional, user-configurable
- [ ] In-app notification center with unread count badge
- [ ] User can customize notification preferences per channel
- [ ] Quiet hours respected (10pm - 8am local time, except urgent)
- [ ] Notification delivery tracking and retry logic
- [ ] Deep links from notifications to relevant screens
- [ ] Rate limiting to prevent notification spam
- [ ] A/B testing framework for notification copy and timing

---

### 2.16 Provider / Business Owner Portal
**Priority:** P0 — Critical

**User Story:**
As a business owner, I want to manage my business, services, staff, and appointments so that I can run my operations efficiently.

**Acceptance Criteria:**
- [ ] Secure login separate from customer app (same credentials, role-based access)
- [ ] Dashboard with: today's appointments, upcoming week overview, revenue summary, new reviews
- [ ] Calendar view: day, week, month with appointment blocks
- [ ] Appointment management: view details, confirm, cancel, reschedule, mark no-show
- [ ] Customer notes and history visible per appointment
- [ ] Service management: create, edit, price, duration, assign staff
- [ ] Staff management: add staff, set schedules, assign services, set breaks
- [ ] Business profile: edit description, hours, photos, contact info
- [ ] Availability settings: regular hours, exceptions, buffer time
- [ ] Notification settings for new bookings and cancellations
- [ ] Reporting: appointments, revenue, popular services, customer retention (basic)
- [ ] Multiple business support (future: franchise/chain)
- [ ] Role-based access: Owner, Manager, Staff (view-only own schedule)

---

### 2.17 Admin Dashboard
**Priority:** P1 — High

**User Story:**
As a platform admin, I want to oversee and manage the platform so that I can ensure quality and growth.

**Acceptance Criteria:**
- [ ] User management: search, view, suspend, delete accounts
- [ ] Business management: approve new registrations, verify, suspend, feature
- [ ] Content moderation: review reported reviews, photos, business info
- [ ] Analytics: MAU, bookings, revenue, churn, top categories, geographic distribution
- [ ] Financial overview: transaction volume, fees collected, payouts to businesses
- [ ] Support ticket management with assignment
- [ ] System health: API latency, error rates, queue depth
- [ ] Configuration: categories, fees, promotional campaigns
- [ ] Audit log of all admin actions
- [ ] Role-based admin access (Super Admin, Ops, Support)

---

### 2.18 Background Jobs (BullMQ)
**Priority:** P1 — High

**User Story:**
As a system, I need reliable background job processing so that heavy or time-sensitive tasks don't block user requests.

**Acceptance Criteria:**
- [ ] Job queue implemented with BullMQ and Redis
- [ ] Job types: send notification (push, email, SMS), process payment webhook, generate report, sync search index, cleanup old data, slot cache warm-up
- [ ] Retry policy: 3 attempts with exponential backoff (5s, 25s, 125s)
- [ ] Dead letter queue for failed jobs after retries exhausted
- [ ] Job monitoring dashboard with status, logs, and manual retry
- [ ] Priority queues: critical (payments), high (notifications), normal (reports), low (cleanup)
- [ ] Job concurrency limits per worker type
- [ ] Scheduled jobs using cron patterns
- [ ] Job idempotency keys to prevent duplicate processing
- [ ] Graceful shutdown: finish in-progress jobs before worker termination
- [ ] Alerting on queue depth threshold exceeded

---

## 3. Non-Functional Requirements

### 3.1 Performance
- App cold start < 3 seconds
- Screen transitions < 300ms
- API response time p95 < 200ms
- Search results < 500ms
- Image loading with progressive blur placeholder

### 3.2 Security
- HTTPS everywhere
- OWASP Mobile Top 10 compliance
- Sensitive data encrypted at rest
- Rate limiting on all public APIs
- Input validation and sanitization
- Regular dependency vulnerability scanning

### 3.3 Reliability
- 99.9% uptime SLA
- Database backups: daily with 30-day retention
- Feature flags for gradual rollout
- Circuit breakers on external service calls

### 3.4 Scalability
- Horizontal scaling of API servers
- Database read replicas for query load
- CDN for static assets and images
- Caching layer (Redis) for hot data

---

## 4. Analytics & Metrics

### 4.1 Key Metrics
- Monthly Active Users (MAU)
- Booking conversion rate (search → book)
- Cancellation rate
- Average booking value
- Customer retention (30, 60, 90 day)
- Business onboarding completion rate
- App store rating and review sentiment

### 4.2 Event Tracking
- Screen views, button taps, search queries, filter usage
- Booking funnel drop-off points
- Notification open rates
- Feature adoption rates

---

## 5. Release Phases

### Phase 1 — MVP (Months 1-3)
- User Authentication (email, social)
- Guest Browse & Explore
- Business Search & Discovery
- Map-based Search
- Business Detail View
- Service Categories
- Booking Flow (no payment)
- Appointment Management
- Business Owner Portal (basic)
- Availability & Slot Computation

### Phase 2 — Growth (Months 4-6)
- Payment Integration
- Reviews & Ratings
- Favorites
- Notifications (push, email)
- User Profile enhancements
- Admin Dashboard
- Background Jobs

### Phase 3 — Scale (Months 7-9)
- Advanced analytics
- Promotions and loyalty
- Multi-language expansion
- Performance optimizations
- Advanced business owner features

---

## 6. Open Questions

1. Geographic launch markets and localization priorities
2. Commission/fee structure for business owners
3. Insurance/liability coverage for bookings
4. Integration with existing salon management software
5. Subscription tiers for business owners

---

*Document Version: 1.0*
*Last Updated: 2024*
*Owner: Product Team*
