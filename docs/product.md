# Planity Clone - Product Specification

## 1. Overview

### 1.1 Product Vision
Planity Clone is a comprehensive appointment booking platform connecting customers with beauty, wellness, and health service providers. The platform enables seamless discovery, booking, and management of appointments while providing powerful tools for business owners to manage their operations.

### 1.2 Target Users
- **Customers (B2C)**: Individuals seeking to book beauty, wellness, and health appointments
- **Business Owners/Providers (B2B)**: Salons, spas, independent professionals managing their business
- **Platform Administrators**: Operations team managing the platform

### 1.3 Success Metrics
- Booking conversion rate > 15%
- Search-to-booking time < 3 minutes
- Provider onboarding completion > 80%
- Customer retention (30-day) > 40%

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority: P0 (Critical)**

#### Description
Secure authentication system supporting multiple login methods with role-based access control.

#### User Stories
- As a customer, I want to create an account quickly so I can book appointments
- As a business owner, I want to register my business so I can manage my services
- As a user, I want to reset my password so I can regain access to my account

#### Acceptance Criteria
- [ ] Users can register with email/password, Google OAuth, and Apple Sign-In
- [ ] Password must be minimum 8 characters with at least one uppercase, one lowercase, and one number
- [ ] Email verification required before first booking
- [ ] JWT tokens with refresh token rotation (7-day access, 30-day refresh)
- [ ] Rate limiting: 5 failed attempts triggers 15-minute lockout
- [ ] Role assignment: CUSTOMER, PROVIDER, ADMIN
- [ ] Social login accounts can add password for email/password login
- [ ] Session management: users can view and revoke active sessions

#### Technical Notes
- Use bcrypt with salt rounds 12
- Store refresh tokens hashed in database
- Implement CSRF protection for cookie-based auth

---

### 2.2 Guest Browse & Explore
**Priority: P0 (Critical)**

#### Description
Allow unauthenticated users to browse businesses and services without creating an account.

#### User Stories
- As a guest, I want to browse businesses so I can evaluate the platform before committing
- As a guest, I want to view business details so I can make informed decisions

#### Acceptance Criteria
- [ ] Guests can access search, browse categories, and view business profiles
- [ ] Guests can view service listings and pricing
- [ ] Guests can view reviews and ratings
- [ ] "Book Now" CTA prompts login/signup with return URL preservation
- [ ] Guest session data (favorites, search filters) persists for 24 hours via localStorage
- [ ] Converting to authenticated user merges guest data

---

### 2.3 Business Search & Discovery
**Priority: P0 (Critical)**

#### Description
Powerful search and filtering system to help customers find the right business.

#### User Stories
- As a customer, I want to search by business name, service, or location so I can find relevant providers
- As a customer, I want to filter results so I can narrow down my options

#### Acceptance Criteria
- [ ] Full-text search across business name, service names, and descriptions
- [ ] Filters: category, price range, rating (1-5 stars), distance, availability (today, this week)
- [ ] Sort options: relevance, rating, price (low-high, high-low), distance
- [ ] Auto-complete suggestions with recent searches
- [ ] Search results display: business image, name, rating, starting price, distance, next available slot
- [ ] Pagination: 20 results per page with infinite scroll option
- [ ] Search query debounced at 300ms
- [ ] Search results cached for 5 minutes

---

### 2.4 Map-based Search
**Priority: P1 (High)**

#### Description
Interactive map view showing business locations with clustering for dense areas.

#### User Stories
- As a customer, I want to see businesses on a map so I can choose by location
- As a customer, I want to explore an area so I can discover new businesses

#### Acceptance Criteria
- [ ] Interactive map with custom business markers
- [ ] Marker clustering for zoom levels showing >50 markers
- [ ] Clicking marker opens business card with key info and CTA
- [ ] Map bounds update search results in real-time
- [ ] User location detection with permission prompt
- [ ] "Near Me" button centers map on user location
- [ ] Mobile: swipe-up bottom sheet for business list, full-screen map
- [ ] Desktop: split view with map (60%) and list (40%)

---

### 2.5 Business Detail View
**Priority: P0 (Critical)**

#### Description
Comprehensive business profile page with all information needed to make a booking decision.

#### User Stories
- As a customer, I want to see all business details so I can evaluate if it's right for me
- PLANITY-101: Business detail view with services, reviews, and booking CTA

#### Acceptance Criteria
- [ ] Hero section: business name, rating, review count, favorite button, share button
- [ ] Image gallery: up to 10 images with lightbox viewer
- [ ] Business info: address (with directions link), phone, hours, website, social links
- [ ] Service list: categorized with name, duration, description, price
- [ ] Staff/professional profiles with photos and bios
- [ ] Reviews section: aggregate rating, rating distribution, recent reviews with pagination
- [ ] "Book Appointment" sticky CTA on mobile
- [ ] Breadcrumb navigation
- [ ] SEO-optimized with structured data (Schema.org LocalBusiness)

---

### 2.6 Service Categories
**Priority: P1 (High)**

#### Description
Hierarchical category system for organizing services and enabling discovery.

#### Acceptance Criteria
- [ ] Predefined category tree: Beauty > Hair, Nails, Makeup, etc.
- [ ] Each business can assign services to multiple categories
- [ ] Category icons and colors in design system
- [ ] Category pages with featured businesses and SEO content
- [ ] Admin can add/edit categories with slug-based URLs
- [ ] Category popularity tracking for homepage personalization

---

### 2.7 Booking Flow
**Priority: P0 (Critical)**

#### Description
Streamlined multi-step booking process minimizing friction and abandonment.

#### User Stories
- As a customer, I want to book an appointment in as few steps as possible
- As a customer, I want to see real-time availability so I can choose a convenient time

#### Acceptance Criteria
- [ ] Step 1: Select service (with optional staff preference)
- [ ] Step 2: Select date and time from available slots
- [ ] Step 3: Review booking details and add notes
- [ ] Step 4: Confirm booking (payment if required)
- [ ] Real-time slot availability with no double-booking (optimistic locking)
- [ ] Slot reservation: 10-minute hold during checkout
- [ ] Booking confirmation with calendar invite (ICS file) and email/SMS
- [ ] Guest checkout supported with account creation prompt post-booking
- [ ] Reschedule and cancel links in confirmation
- [ ] Booking modification allowed up to 24 hours before appointment

---

### 2.8 Appointment Management
**Priority: P0 (Critical)**

#### Description
Comprehensive appointment lifecycle management for customers and providers.

#### Customer Acceptance Criteria
- [ ] View upcoming and past appointments in list view
- [ ] Appointment details: service, provider, date/time, location, status, notes
- [ ] Reschedule: select new slot with same service constraints
- [ ] Cancel with reason selection (customer no-show, change of plans, etc.)
- [ ] Add to calendar (Google, Apple, Outlook)
- [ ] Rebook same service with one click

#### Provider Acceptance Criteria
- [ ] Calendar view (day/week/month) of all appointments
- [ ] Appointment status workflow: PENDING → CONFIRMED → CHECKED_IN → COMPLETED → NO_SHOW/CANCELLED
- [ ] Bulk actions: confirm, cancel, mark no-show
- [ ] Block time slots (breaks, vacations)
- [ ] Walk-in appointment creation
- [ ] Daily/weekly schedule export (PDF)

---

### 2.9 Favorites
**Priority: P1 (High)**

#### Description
Allow users to save and quickly access preferred businesses.

#### Acceptance Criteria
- [ ] Toggle favorite from business card or detail page
- [ ] Favorites list with quick book and remove actions
- [ ] Favorite count visible to business owners (anonymized)
- [ ] Sync favorites acrossjoys across devices for authenticated users
- [ ] Guest favorites prompt login with merge on authentication
- [ ] Push notification option for favorite business updates (new services, promotions)

---

### 2.10 User Profile
**Priority: P1 (High)**

#### Description
Customer profile management with preferences and history.

#### Acceptance Criteria
- [ ] Edit personal info: name, phone, email, profile photo
- [ ] Manage payment methods (add, remove, set default)
- [ ] Notification preferences: email, SMS, push (per type)
- [ ] Booking history with search and filter
- [ ] Privacy settings: profile visibility, data download, account deletion
- [ ] Loyalty/points program integration (future)
- [ ] Referral code and sharing

---

### 2.11 Availability & Slot Computation
**Priority: P0 (Critical)**

#### Description
Complex scheduling engine computing available slots based on multiple constraints.

#### Acceptance Criteria
- [ ] Define business hours per day with exceptions (holidays, special hours)
- [ ] Staff-specific schedules and service assignments
- [ ] Service duration + buffer time between appointments
- [ ] Concurrent booking limits (rooms, equipment)
- [ ] Slot generation: minimum 15-minute granularity
- [ ] Real-time availability with <2s response time
- [ ] Handle timezone correctly for businesses and customers
- [ ] Support recurring availability patterns
- [ ] Buffer zones: setup time, cleanup time, travel time (mobile services)

---

### 2.12 Shared Types & Design System
**Priority: P1 (High)**

#### Description
Consistent UI/UX across platforms with reusable components.

#### Acceptance Criteria
- [ ] Color palette: primary, secondary, semantic (success, warning, error, info)
- [ ] Typography: heading hierarchy, body text, captions
- [ ] Spacing system: 4px base grid
- [ ] Component library: buttons, inputs, cards, modals, date picker, time slot selector
- [ ] Form validation patterns and error messaging
- [ ] Loading states and skeleton screens
- [ ] Empty states for all list views
- [ ] Accessibility: WCAG 2.1 AA compliance, keyboard navigation, screen reader support
- [ ] Dark mode support
- [ ] Shared TypeScript types between frontend and API contracts

---

### 2.13 Reviews & Ratings
**Priority: P1 (High)**

#### Description
Social proof system for business quality and customer feedback.

#### Acceptance Criteria
- [ ] 5-star rating with optional text review
- [ ] Review eligibility: verified customers only (completed appointment)
- [ ] Review window: 7 days post-appointment, then closed
- [ ] Business owner response to reviews
- [ ] Review moderation: auto-flag for profanity, manual review queue
- [ ] Photo attachments (up to 5 per review)
- [ ] Helpful/not helpful voting on reviews
- [ ] Aggregate rating calculation with Bayesian average for new businesses
- [ ] Review analytics for business owners

---

### 2.14 Payment Integration
**Priority: P0 (Critical)**

#### Description
Secure payment processing for deposits, full payments, and no-show protection.

#### User Stories
- As a customer, I want to pay securely so I can confirm my booking
- As a business owner, I want to receive payments so I can operate my business

#### Acceptance Criteria
- [ ] Stripe integration for card payments
- [ ] Payment methods: credit/debit card, Apple Pay, Google Pay
- [ ] Payment types: full payment, deposit (configurable %), pay at venue
- [ ] Payment intent creation with 3D Secure support
- [ ] Automatic capture on appointment completion or manual capture by provider
- [ ] Refund processing with full and partial refund support
- [ ] Payment confirmation and receipt via email
- [ ] Failed payment retry with alternative method
- [ ] PCI compliance: never store raw card data (use Stripe tokens)
- [ ] Provider payout schedule: weekly to connected Stripe account
- [ ] Platform fee deduction (configurable %)

---

### 2.15 Notifications
**Priority: P1 (High)**

#### Description
Multi-channel notification system keeping users informed.

#### Acceptance Criteria
- [ ] Channels: email, SMS (Twilio), push notifications (Firebase)
- [ ] Triggered notifications:
  - Booking confirmation
  - 24-hour reminder
  - Same-day reminder
  - Reschedule/cancellation
  - Review request (post-appointment)
  - Payment confirmation
  - Provider: new booking, cancellation, low inventory
- [ ] Preference management per channel and notification type
- [ ] Template system with variable substitution
- [ ] Delivery tracking and bounce handling
- [ ] Notification history in app
- [ ] Quiet hours respect (configurable, default 10pm-8am)

---

### 2.16 Provider / Business Owner Portal
**Priority: P0 (Critical)**

#### Description
Comprehensive dashboard for business owners to manage their presence and operations.

#### Acceptance Criteria
- [ ] Dashboard: upcoming appointments, revenue summary, recent reviews, quick actions
- [ ] Business profile management: info, photos, hours, services, staff
- [ ] Service management: CRUD with pricing, duration, description, category assignment
- [ ] Staff management: profiles, schedules, service associations
- [ ] Appointment calendar with drag-and-drop rescheduling
- [ ] Customer database with visit history and notes
- [ ] Analytics: booking volume, revenue, popular services, no-show rate
- [ ] Settings: notification preferences, payment settings, integration settings
- [ ] Mobile-responsive design for on-the-go management

---

### 2.17 Admin Dashboard
**Priority: P2 (Medium)**

#### Description
Platform administration tools for operations and support teams.

#### Acceptance Criteria
- [ ] User management: search, view, suspend, impersonate
- [ ] Business verification and approval workflow
- [ ] Content moderation: review flagged content, handle disputes
- [ ] Financial overview: platform revenue, payouts, refunds
- [ ] Analytics: MAU, booking volume, churn, top categories
- [ ] System health: queue status, error rates, API performance
- [ ] Feature flags for gradual rollout
- [ ] Audit log of all admin actions

---

### 2.18 Background Jobs (BullMQ)
**Priority: P1 (High)**

#### Description
Reliable asynchronous job processing for time-consuming operations.

#### Acceptance Criteria
- [ ] Job types and priorities:
  - **High**: Payment processing, slot reservation expiry
  - **Medium**: Email sending, push notifications, SMS
  - **Low**: Analytics aggregation, report generation, data exports
- [ ] Retry logic: 3 attempts with exponential backoff
  - Dead letter queue for failed jobs after retries
- [ ] Job monitoring: queue depth, processing rate, failed jobs
- [ ] Scheduled jobs: daily reports, nightly data cleanup
- [ ] Job idempotency keys to prevent duplicate processing
- [ ] Rate limiting per job type
- [ ] Job progress tracking for long-running operations

---

## 3. Non-Functional Requirements

### 3.1 Performance
- Page load time < 2s (Lighthouse performance score > 90)
- API response time < 200ms (p95)
- Search results < 500ms
- Support 10,000 concurrent users

### 3.2 Security
- OWASP Top 10 compliance
- Data encryption at rest and in transit
- GDPR compliance: data portability, right to erasure
- Regular security audits

### 3.3 Reliability
- 99.9% uptime SLA
- Automated backups: daily with 30-day retention
- Disaster recovery: RPO < 1 hour, RTO < 4 hours

---

## 4. Release Phases

### Phase 1 (MVP) - Weeks 1-8
- User Authentication
- Guest Browse & Explore
- Business Search & Discovery
- Business Detail View
- Booking Flow
- Appointment Management (basic)
- Provider Portal (basic)
- Availability & Slot Computation
- Shared Types & Design System

### Phase 2 - Weeks 9-14
- Map-based Search
- Service Categories
- Favorites
- User Profile
- Reviews & Ratings
- Payment Integration
- Notifications

### Phase 3 - Weeks 15-20
- Admin Dashboard
- Background Jobs (full implementation)
- Advanced Analytics
- Mobile App (React Native)
- Performance Optimization

---

## 5. Appendix

### 5.1 Glossary
- **Slot**: A specific time period available for booking
- **Provider**: Business or individual offering services
- **Service**: A bookable offering with defined duration and price

### 5.2 Revision History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-01-15 | Alex (PO) | Initial specification |
