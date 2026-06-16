# Planity Clone — Product Specification

## 1. Overview

### 1.1 Product Vision
Build a comprehensive beauty and wellness appointment booking platform that connects customers with local businesses (salons, barbershops, spas, clinics). The platform serves three primary user types: customers seeking to discover and book services, business owners managing their operations and appointments, and administrators overseeing the platform.

### 1.2 Target Users
- **Customers**: Individuals looking to discover, compare, and book beauty/wellness services
- **Business Owners/Providers**: Salon owners, independent professionals, clinic managers
- **Administrators**: Platform operators managing the marketplace

### 1.3 Success Metrics
- Booking conversion rate > 15%
- Search-to-booking funnel completion > 20%
- Business owner adoption rate
- Customer retention (30-day return rate)
- Average booking value

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority: P0**

#### Description
Secure authentication system supporting multiple login methods with role-based access control.

#### User Stories
- As a customer, I want to create an account so I can book appointments and manage my bookings
- As a business owner, I want to register my business so I can manage my services and appointments
- As a user, I want to log in with my email/password or social accounts for convenience
- As a user, I want to reset my password when I forget it

#### Acceptance Criteria
- [ ] Users can register with email, password, first name, last name, phone number
- [ ] Password must be minimum 8 characters with at least one uppercase, one lowercase, one number
- [ ] Users can log in with email and password
- [ ] Users can log in with Google OAuth
- [ ] Users can log in with Apple OAuth (iOS)
- [ ] JWT tokens are issued with 15-minute access and 7-day refresh expiration
- [ ] Users can request password reset via email with 1-hour expiration link
- [ ] Users can log out and have their refresh token invalidated
- [ ] Account lockout after 5 failed login attempts for 30 minutes
- [ ] Email verification required before first booking

#### Technical Notes
- Use bcrypt for password hashing (cost factor 12)
- Implement rate limiting on auth endpoints
- Store refresh tokens in httpOnly cookies

---

### 2.2 Guest Browse & Explore
**Priority: P0**

#### Description
Allow unauthenticated users to browse businesses, view services, and explore the platform before committing to registration.

#### User Stories
- As a guest, I want to browse businesses without creating an account
- As a guest, I want to view business details and services
- As a guest, I want to see available time slots to understand booking possibilities
- As a guest, I want to be prompted to log in/register when attempting to book

#### Acceptance Criteria
- [ ] Guests can access home page, search, and business listings without authentication
- [ ] Guests can view business profiles, services, and reviews
- [ ] Guests can see available slots but cannot complete booking
- [ ] Attempting to book redirects to login with return URL preserved
- [ ] Guest search preferences are persisted in session for post-login continuation
- [ ] Guest can convert to registered user while preserving cart/session data

---

### 2.3 Business Search & Discovery
**Priority: P0**

#### Description
Powerful search and filtering system to help customers find relevant businesses based on location, service, availability, and ratings.

#### User Stories
- As a customer, I want to search for businesses by name, service, or location
- As a customer, I want to filter results by service category, price range, rating, and availability
- As a customer, I want to see search results sorted by relevance, rating, or distance
- As a customer, I want to see businesses that are currently open

#### Acceptance Criteria
- [ ] Full-text search across business name, description, and service names
- [ ] Auto-complete suggestions with debounce (300ms)
- [ ] Filter by: service category, price range (min/max), rating (1-5 stars), availability (today, this week, specific date)
- [ ] Sort by: relevance (default), highest rated, most reviewed, nearest, price (low to high)
- [ ] Pagination with 20 results per page
- [ ] Search results display: business image, name, rating, starting price, distance, next available slot
- [ ] Recent searches stored locally (last 10)
- [ ] Search query and filters reflected in URL for shareability

---

### 2.4 Map-based Search
**Priority: P0**

#### Description
Interactive map integration showing business locations with clustering, allowing geographic exploration of available services.

#### User Stories
- As a customer, I want to see businesses on a map to understand their locations
- As a customer, I want to explore a specific area by panning and zooming the map
- As a customer, I want to see business details by tapping a map marker

#### Acceptance Criteria
- [ ] Map displays business markers based on current search/filter criteria
- [ ] Marker clustering for dense areas (cluster count visible)
- [ ] Clicking marker opens business card with key info and link to detail
- [ ] Map bounds update search results in real-time (debounced 500ms)
- [ ] User location detection with permission prompt
- [ ] Default map center based on user location or search location
- [ ] Support for satellite and standard map views
- [ ] Mobile: bottom sheet for business list with draggable handle

---

### 2.5 Business Detail View
**Priority: P0**

#### Description
Comprehensive business profile page displaying all information needed for a customer to make a booking decision.

#### User Stories
- As a customer, I want to see business photos, description, and contact information
- As a customer, I want to browse all services offered with prices and durations
- As a customer, I want to see staff/professional profiles
- As a customer, I want to read reviews and ratings
- As a customer, I want to see business hours and location details

#### Acceptance Criteria
- [ ] Hero image gallery with up to 10 photos, swipeable on mobile
- [ ] Business name, rating, review count, category badges
- [ ] Full address with "Get Directions" link (external maps app)
- [ ] Phone number with tap-to-call on mobile
- [ ] Business description (max 2000 characters)
- [ ] Services list with: name, description, duration, price, booking button
- [ ] Staff section with photos, names, specialties, and ratings
- [ ] Business hours table (weekly view)
- [ ] Reviews summary (average rating, rating distribution, total count)
- [ ] "Add to Favorites" button with heart icon
- [ ] Share button generating deep link

---

### 2.6 Service Categories
**Priority: P0**

#### Description
Hierarchical categorization system organizing service types for discovery and business organization.

#### despcription
- As a customer, I want to browse by category (Hair, Nails, Spa, Barber base, etc.)
- As a business owner, I want to categorize my services for better discovery

#### Acceptance Criteria
- [ ] Predefined category hierarchy: Hair, Nails, Face, Body, Massage, Wellness, Medical Aesthetic, Barber
- [ ] Sub-categories up to 2 levels deep (e.g., Hair > Coloring > Balayage)
- [ ] Category icons and color coding in UI
- [ ] Businesses can be tagged with multiple categories
- [ ] Services belong to exactly one sub-category
- [ ] Category pages showing featured businesses and popular services
- [ ] Category trending searches

---

### 2.7 Booking Flow
**Priority: P0**

#### Description
Seamless multi-step booking process guiding customers from service selection to confirmation.

#### User Stories
- As a customer, I want to select a service and see available time slots
- As a customer, I want to choose my preferred staff member or let the system assign
- As a customer, I want to book multiple services in one appointment
- As a customer, I want to add special requests or notes
- As a customer, I want to securely pay for my booking
- As a customer, I want to receive immediate confirmation

#### Acceptance Criteria
- [ ] Step 1: Service selection with duration and price display
- [ ] Step 2: Staff selection (optional "No preference" option)
- [ ] Step 3: Date and time selection with real-time availability
- [ ] Step 4: Review booking details with editable notes (max 500 chars)
- [ ] Step 5: Payment (if required) or confirmation (if pay-at-venue)
- [ ] Real-time slot availability with no double-booking (pessimistic locking)
- [ ] Slot hold for 10 minutes during checkout (Redis-based)
- [ ] Support for recurring bookings (weekly, bi-weekly, monthly)
- [ ] Guest booking option (email + phone required)
- [ ] Booking confirmation with calendar invite (.ics) and QR code
- [ ] Cancellation policy displayed before confirmation

---

### 2.8 Appointment Management
**Priority: P0**

#### Description
Comprehensive appointment lifecycle management for customers and business owners.

#### User Stories
- As a customer, I want to view all my upcoming and past appointments
- As a customer, I want to reschedule or cancel my appointments
- As a business owner, I want to view and manage my daily schedule
- As a business owner, I want to block time slots or mark unavailability

#### Acceptance Criteria
- [ ] Customer appointment list: upcoming (sorted by date) and past (last 12 months)
- [ ] Appointment detail view with all booking information
- [ ] Reschedule: select new slot, subject to availability and cancellation policy
- [ ] Cancel with reason selection, refund per cancellation policy
- [ ] Business owner calendar view: daily, weekly, monthly
- [ ] Color-coded appointments by status (confirmed, pending, completed, cancelled, no-show)
- [ ] Drag-and-drop rescheduling in calendar view
- [ ] Time blocking: recurring or one-off unavailability
- [ ] Appointment status transitions with audit log
- [ ] Bulk actions: confirm multiple pending appointments

---

### 2.9 Favorites
**Priority: P1**

#### Description
Allow customers to save and quickly access preferred businesses.

#### User Stories
- As a customer, I want to save businesses to my favorites
- As a customer, I want to quickly access my favorite businesses
- As a customer, I want to receive notifications about my favorites (new services, promotions)

#### Acceptance Criteria
- [ ] Toggle favorite from business card or detail page
- [ ] Favorites list accessible from profile
- [ ] Favorite businesses sorted by most recently added
- [ ] Quick rebook from favorites (pre-selects business)
- [ ] Option to enable/disable promotional notifications per favorite
- [ ] Maximum 200 favorites per user
- [ ] Sync favorites across devices

---

### 2.10 User Profile
**Priority: P0**

#### Description
Customer profile management for personal information, preferences, and account settings.

#### User Stories
- As a customer, I want to manage my personal information
- As a customer, I want to manage my payment methods
- As a customer, I want to set my preferences (notifications, language)
- As a customer, I want to view my booking history and spending

#### Acceptance Criteria
- [ ] Profile photo upload (JPEG/PNG, max 5MB, cropped to square)
- [ ] Editable fields: first name, last name, phone, email (with re-verification)
- [ ] Password change with current password verification
- [ ] Saved payment methods (Stripe Customer integration)
- [ ] Notification preferences: email, push, SMS (per type)
- [ ] Booking history with filtering and search
- [ ] Spending summary (monthly, yearly)
- [ ] Account deletion with 30-day grace period and data export
- [ ] Privacy settings: profile visibility, marketing consent

---

### 2.11 Availability & Slot Computation
**Priority: P0**

#### Description
Core scheduling engine computing real-time availability based on business hours, staff schedules, existing bookings, and buffer times.

#### User Stories
- As a business owner, I want to define my operating hours and breaks
- As a business owner, I want to set different hours for different days
- As a business owner, I want to define service durations and buffer times between appointments
- As a customer, I want to see accurate real-time availability

#### Acceptance Criteria
- [ ] Weekly schedule template with day-level enable/disable
- [ ] Multiple time ranges per day (e.g., 9-12, 14-18)
- [ ] Special hours for specific dates (holidays, events)
- [ ] Service duration configuration with optional variable duration
- [ ] Buffer time before/after appointments (configurable per service)
- [ ] Staff-specific schedules overriding business defaults
- [ ] Slot computation accounts for: business hours, staff availability, existing bookings, buffers, time-off
- [ ] Slot granularity: 15, 30, or 60 minutes (business configurable)
- [ ] API response time for slot query < 200ms (cached)
- [ ] Handle timezone correctly (business timezone stored, converted for customer)

---

### 2.12 Shared Types & Design System
**Priority: P0**

#### Description
Consistent design language and reusable components across all platforms.

#### Acceptance Criteria
- [ ] Color palette: primary (#FF6B6B), secondary (#4ECDC4), neutral grays, semantic colors (success, warning, error)
- [ ] Typography: Inter for body, Playfair Display for headings
- [ ] Spacing system: 4px base unit (4, 8, 12, 16, 24, 32, 48, 64)
- [ ] Border radius: 4px (small), 8px (medium), 16px (large), 24px (xl)
- [ ] Shadow system: 3 elevations for cards, modals, floating elements
- [ ] Component library: Button, Input, Select, DatePicker, TimeSlot, Card, Modal, Toast, Skeleton
- [ ] Responsive breakpoints: mobile (< 640px), tablet (640-1024px), desktop (> 1024px)
- [ ] Dark mode support with system preference detection
- [ ] Accessibility: WCAG 2.1 AA compliance, focus indicators, ARIA labels
- [ ] Animation standards: 200ms transitions, ease-in-out, reduced motion support

---

### 2.13 Reviews & Ratings
**Priority: P1**

#### Description
Customer feedback system for businesses and services with moderation capabilities.

#### User Stories
- As a customer, I want to rate and review businesses after my appointment
- As a customer, I want to read reviews before booking
- As a business owner, I want to respond to reviews
- As a business owner, I want to report inappropriate reviews

#### Acceptance Criteria
- [ ] Review eligibility: verified customers who completed appointment
- [ ] Rating: 1-5 stars with half-star precision
- [ ] Review text: 10-1000 characters
- [ ] Optional categories: service quality, ambiance, staff professionalism, value for money
- [ ] Photo upload (max 5 images, 10MB each)
- [ ] Business owner response within 30 days of review
- [ ] Review helpfulness voting
- [ ] Sort reviews by: most recent, most helpful, highest/lowest rating
- [ ] Filter reviews by rating, with photos, verified only
- [ ] Moderation: auto-flag profanity, manual review for reported content
- [ ] Review editing within 14 days, deletion by author or admin

---

### 2.14 Payment Integration
**Priority: P0**

#### Description
Secure payment processing supporting multiple methods with split payments to business owners.

#### User Stories
- As a customer, I want to pay securely with my credit card
- As a customer, I want to save my payment method for faster checkout
- As a customer, I want to receive refunds when applicable
- As a business owner, I want to receive payouts for my services

#### Acceptance Criteria
- [ ] Stripe integration for card payments (PCI DSS compliant, Stripe Elements)
- [ ] Payment methods: credit/debit card, Apple Pay, Google Pay
- [ ] Save payment method for future use (Stripe SetupIntent)
- [ ] Full payment at booking or deposit with balance at appointment
- [ ] Platform fee deduction before payout to business
- [ ] Automatic payouts to business owner bank account (weekly)
- [ ] Refund processing: full refund within cancellation window, partial per policy
- [ ] Payment receipt emailed and available in app
- [ ] Failed payment handling with retry logic and customer notification
- [ ] Invoice generation for business customers

---

### 2.15 Notifications
**Priority: P1**

#### Description
Multi-channel notification system keeping users informed about bookings, promotions, and account activity.

#### User Stories
- As a customer, I want to receive booking confirmations and reminders
- As a customer, I want to be notified of schedule changes
- As a business owner, I want to be notified of new bookings
- As a user, I want to control which notifications I receive

#### Acceptance Criteria
- [ ] Push notifications via Firebase Cloud Messaging (iOS/Android)
- [ ] Email notifications via SendGrid
- [ ] SMS notifications via Twilio for critical alerts
- [ ] Notification types: booking confirmed, reminder (24h, 1h before), cancelled, rescheduled, promotional, account security
- [ ] In-app notification center with read/unread status
- [ ] Deep linking from notifications to relevant screens
- [ ] Notification preferences: enable/disable per channel per type
- [ ] Quiet hours: no push notifications 22:00-08:00 user local time
- [ ] Notification analytics: delivery, open rates

---

### 2.16 Provider / Business Owner Portal
**Priority: P0**

#### Description
Dedicated web interface for business owners to manage their profile, services, staff, and appointments.

#### User Stories
- As a business owner, I want to set up and customize my business profile
- As a business owner, I want to manage my services and pricing
- As a business owner, I want to add and manage staff members
- As a business owner, I want to view my schedule and manage appointments
- As a business owner, I want to see my earnings and payout history

#### Acceptance Criteria
- [ ] Business profile setup wizard: basic info, photos, description, contact
- [ ] Service management: CRUD operations, pricing, duration, category assignment
- [ ] Staff management: add staff with email invite, set permissions, manage schedules
- [ ] Appointment calendar with filtering by staff member
- [ ] Customer management: view customer history, notes, contact
- [ ] Analytics dashboard: bookings, revenue, occupancy rate, popular services, customer retention
- [ ] Settings: business hours, cancellation policy, booking rules (lead time, max future booking)
- [ ] Multi-location support for chain businesses
- [ ] Role-based access: Owner, Manager, Staff (view-only own schedule)

---

### 2.17 Admin Dashboard
**Priority: P1**

#### Description
Platform administration interface for managing users, businesses, content moderation, and platform analytics.

#### User Stories
- As an admin, I want to manage user and business accounts
- As an admin, I want to moderate reviews and reported content
- As an admin, I want to view platform-wide analytics
- As an admin, I want to manage categories and featured content

#### Acceptance Criteria
- [ ] User management: search, filter, suspend, impersonate
- [ ] Business onboarding approval workflow
- [ ] Business verification status management
- [ ] Review moderation queue with approve/reject/escalate
- [ ] Content moderation: business photos, descriptions, service names
- [ ] Platform analytics: MAU, bookings, revenue, churn, top businesses/categories
- [ ] Financial overview: platform fees, payouts, refunds, disputes
- [ ] Category management: add, edit, merge, deprecate
- [ ] Promotional tools: featured business placement, banner management
- [ ] Audit log for all admin actions
- [ ] Role-based admin access (Super Admin, Support, Finance, Content)

---

### 2.18 Background Jobs (BullMQ)
**Priority: P1**

#### Description
Reliable background job processing for asynchronous tasks ensuring system responsiveness.

#### User Stories
- As a system, I want to process heavy tasks asynchronously
- As a system, I want to retry failed jobs automatically
- As a system, I want to schedule jobs for future execution

#### Acceptance Criteria
- [ ] Job queue implementation with BullMQ and Redis
- [ ] Job types and their triggers:
  - **Email sending**: triggered by user actions, booking events
  - **Push notification delivery**: triggered by booking events, reminders
  - **SMS sending**: triggered by critical alerts, 2FA
  - **Payment processing**: triggered by booking confirmation, refunds, payouts
  - **Image processing**: triggered by photo upload (resize, compress, generate thumbnails)
  - **Search index updates**: triggered by business/service changes
  - **Report generation**: triggered by admin request or scheduled (daily/weekly/monthly)
  - **Data cleanup**: scheduled (expired tokens, old logs, soft-deleted records)
  - **Reminder notifications**: scheduled (24h, 1h before appointment)
- [ ] Job retry policy: 3 attempts with exponential backoff (1min, 5min, 15min)
- [ ] Dead letter queue for failed jobs after retries exhausted
- [ ] Job progress tracking and admin visibility
- [ ] Scheduled jobs: daily at 00:00 (timezone-aware), weekly on Monday
- [ ] Job concurrency limits per queue type
- [ ] Job deduplication for idempotent operations

---

## 3. Non-Functional Requirements

### 3.1 Performance
- Page load time < 2s (95th percentile)
- API response time < 200ms for cached data, < 500ms for computed data
- Image loading with progressive blur-up and lazy loading
- Search results in < 300ms

### 3.2 Security
- HTTPS everywhere
- OWASP Top 10 mitigation
- Rate limiting on all public endpoints
- Input validation and sanitization
- SQL injection prevention via ORM
- XSS protection via output encoding
- CSRF tokens for state-changing operations
- Data encryption at rest (AES-256)

### 3.3 Scalability
- Horizontal scaling support
- Database read replicas for search queries
- CDN for static assets and images
- Caching strategy: Redis for sessions, application cache, rate limiting

### 3.4 Reliability
- 99.9% uptime SLA
- Database backups: daily full, continuous WAL
- Graceful degradation: core features work with degraded services
- Circuit breakers for external service dependencies

---

## 4. Data Model Overview

### Core Entities
- **User**: customers, business owners, admins
- **Business**: business profiles with metadata, settings
- **Service**: individual services offered by businesses
- **Staff**: employees/professionals working at businesses
- **Appointment**: booking records linking customer, business, service, staff, time
- **Review**: customer ratings and feedback
- **Payment**: transaction records
- **Category**: hierarchical service categorization

---

## 5. API Design Principles

- RESTful API with JSON payloads
- Versioning in URL: `/api/v1/...`
- Consistent response envelope: `{ success: boolean, data?: T, error?: { code, message, details } }`
- HTTP status codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 429 Too Many Requests, 500 Internal Server Error
- Pagination: cursor-based for real-time data, offset-based for stable data
- Rate limiting: 100 requests/minute per authenticated user, 20/minute per IP for guests

---

## 6. Mobile Considerations

- Native iOS and Android apps (or React Native/Flutter)
- Deep linking support for all shareable content
- Offline mode: view cached favorites, upcoming appointments
- Background location for "nearby" features (with permission)
- Widget support: upcoming appointment on home screen
- Biometric authentication option

---

## 7. Analytics & Tracking

- Event tracking: search, view business, view service, start booking, complete booking, cancel, review
- Funnel analysis: search → view → start booking → payment → confirmation
- Attribution: source, campaign, medium
- Business owner analytics: views, bookings, conversion rate, revenue
- Admin dashboard: platform health, growth metrics

---

## 8. Release Phases

### Phase 1 (MVP)
- User Authentication
- Guest Browse & Explore
- Business Search & Discovery
- Map-based Search
- Business Detail View
- Service Categories
- Booking Flow
- Appointment Management (basic)
- User Profile
- Availability & Slot Computation
- Shared Types & Design System
- Payment Integration (basic)

### Phase 2
- Favorites
- Reviews & Ratings
- Notifications (push, email)
- Provider Portal (full)
- Background Jobs

### Phase 3
- Admin Dashboard
- Advanced Analytics
- Promotional Tools
- Multi-language Support
- Advanced Payment Features (subscriptions, packages)

---

*Document Version: 1.0*
*Last Updated: 2024*
*Owner: Product Team*
