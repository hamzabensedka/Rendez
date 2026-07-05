# Planity Clone — Product Specification

## 1. Overview

### 1.1 Product Vision
Planity Clone is a mobile-first appointment booking platform connecting consumers with beauty, wellness, and health service providers. It enables seamless discovery, booking, and management of appointments while empowering businesses to manage their schedules, services, and client relationships.

### 1.2 Target Users
- **Consumers**: Individuals seeking to book beauty, wellness, and health services
- **Business Owners/Providers**: Salons, spas, barbershops, independent professionals managing their practice
- **Administrators**: Platform operators managing the ecosystem

### 1.3 Platform Support
- iOS and Android native apps (React Native/Flutter)
- Responsive web for business owner portal and admin dashboard

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority: P0**

**Description**: Secure, frictionless authentication enabling users to access personalized features and manage their accounts.

**User Stories**:
- As a new user, I want to register with my phone number or email so I can create an account quickly
- As a returning user, I want to log in with biometrics or password so I can access my account securely
- As a user, I want to reset my password so I can recover access to my account

**Acceptance Criteria**:
- [ ] User can register via phone (SMS OTP) or email (verification link)
- [ ] Password must be minimum 8 characters with at least one uppercase, one lowercase, one number
- [ ] Support Face ID/Touch ID/fingerprint login after initial authentication
- [ ] JWT token refresh mechanism with secure storage (Keychain/Keystore)
- [ ] Social login supported: Google, Apple Sign-In, Facebook
- [ ] Session expires after 30 days of inactivity
- [ ] Rate limiting: max 5 OTP requests per hour per phone number
- [ ] Account lockout after 5 failed password attempts (30-minute cooldown)

---

### 2.2 Guest Browse & Explore
**Priority: P0**

**Description**: Allow unauthenticated users to browse businesses and services, reducing friction for new user acquisition.

**User Stories**:
- As a guest, I want to browse businesses without creating an account so I can evaluate the platform
- As a guest, I want to see business details and available services so I can make informed decisions

**Acceptance Criteria**:
- [ ] Guest can access home screen, search, and business listings without authentication
- [ ] Guest can view business profiles, services, and reviews (read-only)
- [ ] "Book" CTA triggers authentication prompt with option to continue as guest booking (phone capture)
- [ ] Guest browsing data persisted locally; prompt to create account after 3rd session or at booking
- [ ] Deep links from shared business pages work for guests

---

### 2.3 Business Search & Discovery
**Priority: P0**

**Description**: Powerful search and filtering to help users find the right service provider.

**User Stories**:
- As a user, I want to search by business name, service type, or treatment so I can find relevant providers
- As a user, I want to filter by price, distance, rating, and availability so I can narrow results

**Acceptance Criteria**:
- [ ] Full-text search across business name, service name, and description
- [ ] Filters: distance (km/mi), price range, rating (1-5 stars), availability (today, this week, specific date), category, amenities
- [ ] Sort options: recommended (default), nearest, highest rated, most reviewed, price (low-high, high-low)
- [ ] Search results display: business image, name, rating, distance, starting price, next available slot
- [ ] Recent searches saved (last 10), trending searches surfaced
- [ ] Search debounce: 300ms to reduce API calls
- [ ] Empty state with suggestions and category quick links
- [ ] Pagination: 20 results per page, infinite scroll

---

### 2.4 Map-based Search
**Priority: P0**

**Description**: Visual location-based exploration of businesses.

**User Stories**:
- As a user, I want to see businesses on a map so I can choose based on location convenience
- As a user, I want to explore a different area by panning the map so I can plan ahead

**Acceptance Criteria**:
- [ ] Toggle between list and map view on search results
- [ ] Map displays business pins with price indicator or category icon
- [ ] Cluster pins when zoomed out (cluster count visible)
- [ ] User location dot with accuracy radius
- [ ] Search this area button appears after map pan
- [ ] Business card preview on pin tap with key info and CTA
- [ ] Default zoom: 15km radius; adjustable
- [ ] Offline: cache last viewed map tiles for 24 hours

---

### 2.5 Business Detail View
**Priority: P0**

**Description**: Comprehensive business profile enabling informed booking decisions.

**User Stories**:
- As a user, I want to see all relevant business information so I can decide to book
- As a user, I want to see photos, services, and reviews in one place so I can evaluate quality

**Acceptance Criteria**:
- [ ] Header: business name, verified badge, rating, review count, favorite toggle
- [ ] Image gallery: up to 10 photos, swipeable, pinch-to-zoom
- [ ] Info section: address (with map preview), phone, hours, website, social links
- [ ] Services tab: categorized list with descriptions, durations, prices, book button
- [ ] Reviews tab: rating distribution, recent reviews, photos in reviews
- [ ] Team tab: staff profiles with photos, specialties, ratings
- [ ] About tab: business description, amenities, COVID protocols, languages spoken
- [ ] Sticky bottom CTA: "Book Appointment" with next available slot highlighted
- [ ] Share functionality: native share sheet with deep link
- [ ] Report business option (inappropriate content)

---

### 2.6 Service Categories
**Priority: P0**

**Description**: Hierarchical categorization of services for discovery and business management.

**User Stories**:
- As a user, I want to browse by category so I can discover new services
- As a business owner, I want to categorize my services so customers can find them

**Acceptance Criteria**:
- [ ] Top-level categories: Hair, Nails, Face & Skin, Body & Massage, Hair Removal, Makeup, Wellness, Medical Aesthetics, Fitness
- [ ] Subcategories (2-3 levels deep): e.g., Hair > Coloring > Balayage
- [ ] Category icons and color coding consistent across app
- [ ] Category landing page with featured businesses, trending services, educational content
- [ ] Business can assign multiple categories to services
- [ ] Category-based search suggestions
- [ ] Admin-managed category taxonomy with ability to add/edit/archive

---

### 2.7 Booking Flow
**Priority: P0**

**Description**: Streamlined multi-step appointment booking with minimal friction.

**User Stories**:
- As a user, I want to book an appointment in a few taps so I can secure my preferred time
- As a user, I want to see real-time availability so I know what's actually bookable

**Acceptance Criteria**:
- [ ] Step 1: Select service(s) — single or multiple services, with combo suggestions
- [ ] Step 2: Select staff (specific person or "no preference") with staff availability preview
- [ ] Step 3: Select date and time — calendar view with available slots highlighted
- [ ] Step 4: Review and confirm — service details, price, duration, business policies
- [ ] Step 5: Payment (if required) or confirm (pay at venue)
- [ ] Real-time slot availability with optimistic locking (hold slot for 5 minutes during booking)
- [ ] Guest checkout: capture name, phone, email; offer account creation post-booking
- [ ] Booking confirmation screen with calendar add, directions, share
- [ ] Reschedule and cancel options accessible from confirmation
- [ ] Support for recurring bookings (weekly, bi-weekly, monthly)

---

### 2.8 Appointment Management
**Priority: P0**

**Description**: Centralized hub for users to track and manage their bookings.

**User Stories**:
- As a user, I want to see all my appointments so I can plan my schedule
- As a user, I want to reschedule or cancel easily so I have flexibility

**Acceptance Criteria**:
- [ ] Upcoming appointments tab with chronological list
- [ ] Past appointments tab with option to rebook
- [ ] Appointment card: business name, service, staff, date/time, status, actions
- [ ] Statuses: confirmed, pending, completed, cancelled, no-show, in-progress
- [ ] Reschedule: redirect to booking flow with current selection pre-filled
- [ ] Cancel with reason selection (user-initiated); enforce business cancellation policy
- [ ] Add to calendar (iCal/Google Calendar) from any appointment
- [ ] Push notification reminders: 24 hours, 2 hours, and 15 minutes before
- [ ] Contact business directly from appointment detail

---

### 2.9 Favorites
**Priority: P1**

**Description**: Allow users to save preferred businesses for quick rebooking.

**User Stories**:
- As a user, I want to favorite businesses so I can find them quickly later
- As a user, I want to get notified about favorites' availability and promotions

**Acceptance Criteria**:
- [ ] Heart toggle on business card, detail header, and search results
- [ ] Favorites list in user profile with quick rebook CTA
- [ ] Favorite businesses sorted by recency added, with manual reorder option
- [ ] Option to receive push notifications for new availability at favorite businesses
- [ ] Sync favorites across devices for logged-in users
- [ ] Suggest similar businesses based on favorites

---

### 2.10 User Profile
**Priority: P1**

**Description**: Personal account management and preference center.

**User Stories**:
- As a user, I want to manage my personal information so my bookings are accurate
- As a user, I want to set preferences so my experience is personalized

**Acceptance Criteria**:
- [ ] Profile photo, name, phone, email, birthday (for birthday offers)
- [ ] Password and security settings (change password, 2FA option)
- [ ] Notification preferences: push, email, SMS — granular by type (bookings, promotions, favorites)
- [ ] Payment methods: add, remove, set default (cards, Apple Pay, Google Pay)
- [ ] Addresses: home, work, other — for location-based features
- [ ] Booking history with analytics (total appointments, favorite categories)
- [ ] Loyalty points or rewards balance (if applicable)
- [ ] Data export and account deletion (GDPR compliance)

---

### 2.11 Availability & Slot Computation
**Priority: P0**

**Description**: Core scheduling engine managing real-time availability across businesses, staff, and services.

**User Stories**:
- As a business owner, I want to define my availability so customers can book accurately
- As a user, I want to see only truly available slots so I don't book conflicts

**Acceptance Criteria**:
- [ ] Business defines: weekly recurring hours, exception dates (holidays, closures)
- [ ] Staff-specific schedules with override capability
- [ ] Service duration and buffer time (prep, cleanup between appointments)
- [ ] Slot computation considers: staff availability, existing bookings, service duration, concurrent service capacity, business rules
- [ ] Support for split shifts and breaks
- [ ] Real-time availability API with <200ms response time
- [ ] Handle timezone correctly for businesses and users
- [ ] Buffer configuration: minimum notice for booking (e.g., 2 hours in advance), maximum advance booking (e.g., 3 months)
- [ ] Double-booking prevention at database level with transaction locks

---

### 2.12 Shared Types & Design System
**Priority: P0**

**Description**: Consistent UI/UX foundation ensuring cohesive experience across platforms.

**User Stories**:
- As a user, I want a consistent experience so the app feels polished and intuitive
- As a developer, I want reusable components so I can build efficiently

**Acceptance Criteria**:
- [ ] Design tokens: colors, typography, spacing, shadows, border radius defined and documented
- [ ] Component library: buttons, inputs, cards, modals, bottom sheets, lists, avatars, badges, skeleton loaders
- [ ] Color system: primary brand color, semantic colors (success, warning, error, info), dark mode support
- [ ] Typography: 6-level hierarchy (display, h1-h4, body, caption)
- [ ] Spacing: 4px base grid system
- [ ] Animation standards: 200ms default transition, spring physics for interactive elements
- [ ] Accessibility: minimum 44x44dp touch targets, color contrast 4.5:1, screen reader support
- [ ] Cross-platform parity: iOS, Android, web share 95%+ component reuse
- [ ] Icon system: consistent iconography, 24px default, 20px compact variant

---

### 2.13 Reviews & Ratings
**Priority: P1**

**Description**: Social proof system enabling user feedback and business quality signals.

**User Stories**:
- As a user, I want to read honest reviews so I can choose quality providers
- As a user, I want to share my experience so others benefit

**Acceptance Criteria**:
- [ ] 5-star rating system with half-star precision
- [ ] Review components: overall rating, service-specific rating, staff rating, written review, photo upload (up to 5)
- [ ] Verified booking badge for reviews from actual customers
- [ ] Review eligibility: only post-appointment, within 30 days of service
- [ ] Business owner response capability
- [ ] Review helpfulness voting
- [ ] Flag and moderation system for inappropriate reviews
- [ ] Average rating recalculation weighted by recency (recent reviews weighted more)
- [ ] Review summary: rating distribution, common themes (AI-extracted pros/cons)
- [ ] Prompt for review: push notification 2 hours after appointment completion

---

### 2.14 Payment Integration
**Priority: P0**

**Description**: Secure, flexible payment processing for bookings.

**User Stories**:
- As a user, I want to pay securely in-app so I can confirm my booking
- As a business owner, I want to receive payments reliably so I can operate smoothly

**Acceptance Criteria**:
- [ ] Payment methods: credit/debit cards (PCI-compliant tokenization), Apple Pay, Google Pay, PayPal
- [ ] Payment timing options: pay in full at booking, pay deposit, pay at venue
- [ ] Cancellation refund policy: full refund if cancelled within business-defined window, partial or no refund otherwise
- [ ] Payment confirmation with receipt (email and in-app)
- [ ] Failed payment handling: retry logic, user notification, booking held temporarily
- [ ] Tip option post-service (configurable by business)
- [ ] Payout to business: weekly or monthly, with dashboard visibility
- [ ] Transaction history filterable and exportable
- [ ] Dispute handling workflow

---

### 2.15 Notifications
**Priority: P1**

**Description**: Multi-channel communication keeping users informed and engaged.

**User Stories**:
- As a user, I want timely notifications so I don't miss appointments
- As a user, I want to control what I receive so I'm not overwhelmed

**Acceptance Criteria**:
- [ ] Push notifications: booking confirmations, reminders, cancellations, reschedules, promotions, favorites availability
- [ ] SMS: critical alerts (booking confirmation, same-day reminder) for users who opt in
- [ ] Email: booking receipts, weekly digest, marketing (opt-in)
- [ ] In-app notification center with read/unread status, deep links
- [ ] Notification preferences: granular control per channel and type
- [ ] Quiet hours: no non-critical notifications 10pm-8am local time
- [ ] Rich push: images, action buttons (confirm, reschedule, cancel)
- [ ] Notification analytics: delivery, open rates, conversion

---

### 2.16 Provider / Business Owner Portal
**Priority: P0**

**Description**: Comprehensive web-based dashboard for businesses to manage their presence, services, and operations.

**User Stories**:
- As a business owner, I want to manage my profile and services so customers see accurate information
- As a business owner, I want to view and manage bookings so I can run my schedule efficiently

**Acceptance Criteria**:
- [ ] Dashboard: today's bookings, revenue snapshot, occupancy rate, upcoming week preview
- [ ] Calendar view: day, week, month views; drag-to-reschedule; color-coded by status
- [ ] Booking management: view details, confirm, cancel, mark no-show, add notes
- [ ] Service management: CRUD services, set duration, price, description, category, staff assignment
- [ ] Staff management: add team members, set permissions, manage individual schedules
- [ ] Client management: client list, visit history, notes, contact info, booking history
- [ ] Availability settings: business hours, breaks, time off, booking rules
- [ ] Profile settings: business info, photos, amenities, policies (cancellation, late arrival)
- [ ] Analytics: booking volume, revenue, popular services, staff performance, client retention
- [ ] Marketing tools: promotions, loyalty program, referral codes
- [ ] Multi-location support for chains
- [ ] Mobile-responsive for on-the-go management

---

### 2.17 Admin Dashboard
**Priority: P1**

**Description**: Platform administration and oversight tools.

**User Stories**:
- As an admin, I want to monitor platform health so I can ensure quality service
- As an admin, I want to manage businesses and users so I can maintain platform integrity

**Acceptance Criteria**:
- [ ] Overview metrics: total users, active businesses, daily bookings, GMV, churn rate
- [ ] User management: search, view, suspend, delete accounts; view activity logs
- [ ] Business management: onboarding workflow, verification status, feature flags, commission settings
- [ ] Content moderation: review flagged reviews, businesses, images; take action
- [ ] Financial oversight: transaction monitoring, payout management, dispute resolution
- [ ] Support ticket integration: view, assign, resolve customer and business issues
- [ ] System health: API latency, error rates, queue depths, database performance
- [ ] Role-based access: super admin, support agent, finance, marketing roles
- [ ] Audit logging: all admin actions logged with before/after state
- [ ] Data export and reporting for business intelligence

---

### 2.18 Background Jobs (BullMQ)
**Priority: P1**

**Description**: Reliable asynchronous job processing for non-blocking operations.

**User Stories**:
- As a system, I want to process heavy tasks asynchronously so user experience remains responsive
- As a user, I want reliable delivery of notifications and emails so I stay informed

**Acceptance Criteria**:
- [ ] Job queues defined: email-sending, push-notification, sms-sending, payment-processing, report-generation, data-export, image-processing, search-index-updates, analytics-aggregation
- [ ] Retry policy: 3 attempts with exponential backoff (5s, 25s, 125s)
- [ ] Dead letter queue for failed jobs after retries exhausted; admin alert
- [ ] Job priority levels: critical (payment, booking confirmations), high (notifications), normal (reports), low (analytics)
- [ ] Job scheduling: support for delayed jobs, recurring jobs (cron syntax)
- [ ] Concurrency control: per-queue worker limits to prevent resource exhaustion
- [ ] Job progress tracking and status visibility in admin dashboard
- [ ] Stalled job detection and reprocessing
- [ ] Graceful shutdown: finish in-progress jobs before worker termination
- [ ] Monitoring: queue depth, processing rate, failure rate, average job duration

---

## 3. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | App cold start <2s; screen load <1s; API response <200ms (p95) |
| Availability | 99.9% uptime; scheduled maintenance windows communicated |
| Security | OWASP Top 10 compliance; encryption at rest and in transit; annual penetration testing |
| Scalability | Auto-scaling to handle 10x traffic spikes; horizontal scaling of stateless services |
| Compliance | GDPR, CCPA, PCI-DSS (Level 1); data residency options |
| Localization | Launch: French, English, Spanish, German, Italian; RTL support planned |
| Offline | Cache last viewed content; queue actions for sync when online |

---

## 4. Analytics & Success Metrics

| Metric | Target |
|--------|--------|
| Monthly Active Users (MAU) | Growth 15% MoM |
| Booking Conversion Rate | >8% of app opens |
| Search-to-Book Time | <3 minutes median |
| Business Retention Rate | >85% at 12 months |
| User Retention (D30) | >30% |
| App Store Rating | >4.5 stars |
| Support Ticket Volume | <2% of monthly active users |
| Payment Success Rate | >98% |

---

## 5. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Guest Browse, Search, Business Detail, Booking Flow, Appointment Management, Basic Business Portal | Month 1-2 |
| v1.0 | Map Search, Favorites, Reviews, Payments, Notifications | Month 3-4 |
| v1.5 | Provider Portal v2, Admin Dashboard, Analytics, Background Jobs | Month 5-6 |
| v2.0 | AI Recommendations, Loyalty Program, Marketplace Features | Month 7-9 |

---

*Document Version: 1.0*
*Last Updated: 2024*
*Owner: Product Team*