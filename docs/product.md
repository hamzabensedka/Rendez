# Planity Clone — Product Specification

## 1. Overview

**Product Name:** Planity Clone  
**Version:** 1.0.0  
**Last Updated:** 2024  
**Author:** Alex — Product Owner  

### 1.1 Vision
Build a comprehensive beauty and wellness appointment booking platform that connects customers with local businesses (salons, barbershops, spas, clinics). The platform enables seamless discovery, booking, and management of appointments while providing business owners with powerful tools to manage their operations.

### 1.2 Target Users
- **Customers (B2C):** Individuals seeking beauty/wellness services
- **Business Owners (B2B):** Salons, barbershops, spas, clinics managing appointments
- **Admin Staff:** Platform administrators overseeing operations

### 1.3 Success Metrics
- User registration conversion rate > 30%
- Booking completion rate > 60%
- Business owner adoption rate > 40%
- App rating > 4.5 stars
- Average booking time < 3 minutes

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority:** P0 (Critical)  
**Status:** Required for MVP

#### Description
Secure user authentication system supporting multiple login methods with role-based access control.

#### User Stories
- As a customer, I want to create an account so I can book appointments
- As a business owner, I want to register my business so I can manage bookings
- As a user, I want to log in with my email/password or social accounts
- As a user, I want to reset my password if I forget it
- As a user, I want to stay logged in via secure token refresh

#### Acceptance Criteria
- [ ] Users can register with email, password, first name, last name, phone number
- [ ] Password must be minimum 8 characters with uppercase, lowercase, number, and special character
- [ ] Email verification required before account activation
- [ ] Users can log in with email/password
- [ ] OAuth 2.0 integration for Google and Facebook login
- [ ] JWT tokens with 15-minute access and 7-day refresh token expiry
- [ ] Password reset via email with 1-hour expiry link
- [ ] Role assignment: CUSTOMER, BUSINESS_OWNER, ADMIN
- [ ] Account lockout after 5 failed login attempts (30-minute cooldown)
- [ ] Rate limiting: 5 requests per minute for auth endpoints

#### Technical Notes
- Use bcrypt for password hashing (12 rounds)
- Implement CSRF protection for cookie-based auth
- Store refresh tokens hashed in database
- Support both Bearer token and cookie-based authentication

---

### 2.2 Guest Browse & Explore
**Priority:** P0 (Critical)  
**Status:** Required for MVP

#### Description
Allow unauthenticated users to browse businesses and services without requiring login, encouraging conversion.

#### User Stories
- As a guest, I want to browse businesses without creating an account
- As a guest, I want to view business details and services
- As a guest, I want to see ratings and reviews
- As a guest, I want to be prompted to log in when attempting to book

#### Acceptance Criteria
- [ ] Guest users can access home page with featured businesses
- [ ] Guest users can search and filter businesses
- [ ] Guest users can view business detail pages
- [ ] Guest users can view service catalogs and pricing
- [ ] Guest users can read reviews and ratings
- [ ] Booking action redirects to login with return URL
- [ ] Guest session data (selected business/service) preserved post-login
- [ ] Guest browsing limited to 100 requests per hour per IP

---

### 2.3 Business Search & Discovery
**Priority:** P0 (Critical)  
**Status:** Required for MVP

#### Description
Powerful search and discovery engine for customers to find businesses based on multiple criteria.

#### User Stories
- As a customer, I want to search businesses by name, service, or keyword
- As a customer, I want to filter by location, rating, price range, and availability
- As a customer, I want to see businesses near me
- As a customer, I want to sort results by relevance, rating, distance, or price

#### Acceptance Criteria
- [ ] Full-text search across business name, description, services, and tags
- [ ] Auto-complete suggestions with debounce (300ms)
- [ ] Filter by: category, subcategory, price range (min/max), rating (1-5), distance, availability date
- [ ] Sort options: relevance, highest rated, nearest, price low-to-high, price high-to-low, most reviewed
- [ ] Pagination with 20 results per page
- [ ] Search results display: business image, name, rating, starting price, distance, next available slot
- [ ] Recent searches stored locally (last 10)
- [ ] Search analytics logged for trending queries
- [ ] Response time < 500ms for search queries

---

### 2.4 Map-based Search
**Priority:** P1 (High)  
**Status:** Required for MVP

#### Description
Interactive map integration for visual business discovery and location-based search.

#### User Stories
- As a customer, I want to see businesses on a map
- As a customer, I want to explore businesses in a specific area
- As a customer, I want to get directions to a business

#### Acceptance Criteria
- [ ] Interactive map with business markers (Google Maps or Mapbox)
- [ ] Map clusters for dense areas (clustering at zoom < 12)
- [ ] Click marker to show business card preview (name, rating, image)
- [ ] Card preview links to full business detail page
- [ ] User location detection with permission prompt
- [ ] Default map view: 5km radius around user location or search center
- [ ] Map bounds update triggers new search query
- [ ] List view toggle alongside map view
- [ ] Directions button opens native maps app with business address
- [ ] Map loads within 2 seconds on 3G connection

---

### 2.5 Business Detail View
**Priority:** P0 (Critical)  
**Status:** Required for MVP

#### Description
Comprehensive business profile page displaying all relevant information for customer decision-making.

#### User Stories
- As a customer, I want to see business photos, description, and contact info
- As a customer, I want to view the complete service menu with prices
- As a customer, I want to see staff/professional profiles
- As a customer, I want to check availability and book directly

#### Acceptance Criteria
- [ ] Hero image gallery (up to 10 images) with swipe/carousel
- [ ] Business name, verified badge, rating, review count
- [ ] Full address with copy-to-clipboard and directions
- [ ] Phone number with click-to-call (mobile)
- [ ] Business hours display (current day highlighted, open/closed status)
- [ ] About/description section (max 2000 characters)
- [ ] Service menu organized by category with name, duration, description, price
- [ ] Staff/professional cards with photo, name, bio, specialties
- [ ] Reviews summary (average rating, rating distribution histogram)
- [ ] "Book Now" CTA sticky on mobile, prominent on desktop
- [ ] Social sharing capability
- [ ] Report business functionality

---

### 2.6 Service Categories
**Priority:** P0 (Critical)  
**Status:** Required for MVP

#### Description
Hierarchical categorization system for organizing businesses and services.

#### User Stories
- As a customer, I want to browse by service category (hair, nails, spa, etc.)
- As a business owner, I want to categorize my services properly
- As a platform, we want consistent categorization across all listings

#### Acceptance Criteria
- [ ] Predefined category hierarchy: 8-10 top-level categories
  - Hair (Haircut, Coloring, Styling, Treatment)
  - Nails (Manicure, Pedicure, Nail Art, Extensions)
  - Face (Facial, Makeup, Eyebrows, Lashes)
  - Body (Massage, Hair Removal, Tanning, Tattoo)
  - Wellness (Yoga, Meditation, Nutrition)
  - Medical Aesthetic (Botox, Fillers, Laser)
  - Barbershop (Haircut, Beard, Shave)
  - Spa (Body Wrap, Hydrotherapy, Sauna)
- [ ] Each category has icon, description, and SEO metadata
- [ ] Businesses can select up to 3 primary categories
- [ ] Services linked to specific categories
- [ ] Category pages with featured businesses and trending services
- [ ] Category breadcrumbs for navigation

---

### 2.7 Booking Flow
**Priority:** P0 (Critical)  
**Status:** Required for MVP

#### Description
Streamlined multi-step booking process for reserving appointments with selected services and providers.

#### User Stories
- As a customer, I want to select a service and see available time slots
- As a customer, I want to choose my preferred staff member or let the system assign
- As a customer, I want to book multiple services in one appointment
- As a customer, I want to receive confirmation after booking

#### Acceptance Criteria
- [ ] Step 1: Service Selection
  - Display services with name, duration, description, price
  - Allow multiple service selection
  - Show total duration and price summary
  - Validate service compatibility (same provider required for combo)

- [ ] Step 2: Provider Selection (optional)
  - "No preference" option for automatic assignment
  - Display provider availability calendar
  - Show provider profile cards with ratings

- [ ] Step 3: Date & Time Selection
  - Calendar view with available dates highlighted
  - Time slot grid showing available slots
  - Slots computed based on provider schedule and existing bookings
  - Real-time availability (no stale data > 30 seconds)

- [ ] Step 4: Review & Confirm
  - Summary: services, provider, date/time, location, total price
  - Special requests text field (max 500 characters)
  - Cancellation policy acknowledgment
  - Terms acceptance checkbox

- [ ] Step 5: Payment (if required)
  - Payment method selection
  - Secure payment processing
  - Deposit handling where applicable

- [ ] Post-booking:
  - Immediate confirmation screen with booking reference
  - Email confirmation within 1 minute
  - Add to calendar option (ICS file)
  - Booking added to user's appointment list

- [ ] Booking constraints:
  - Minimum 2 hours advance notice for same-day bookings
  - Maximum 60 days in advance
  - Cannot double-book same time slot
  - Hold slot for 10 minutes during payment (optimistic locking)

---

### 2.8 Appointment Management
**Priority:** P0 (Critical)  
**Status:** Required for MVP

#### Description
Comprehensive appointment lifecycle management for customers and business owners.

#### User Stories
- As a customer, I want to view my upcoming and past appointments
- As a customer, I want to reschedule or cancel my appointment
- As a business owner, I want to manage all appointments for my business
- As a business owner, I want to handle no-shows and cancellations

#### Acceptance Criteria (Customer)
- [ ] Appointment list view: upcoming (sorted by date) and past tabs
- [ ] Appointment card shows: business name, service(s), date/time, status, total price
- [ ] Detail view with full information and actions
- [ ] Reschedule: select new date/time within availability, same constraints as booking
- [ ] Cancel: with reason selection, refund policy display
- [ ] Free cancellation up to 24 hours before appointment
- [ ] Late cancellation fee: 50% of service price if < 24 hours
- [ ] No-show fee: 100% of service price
- [ ] Push notification and email for any status change

#### Acceptance Criteria (Business Owner)
- [ ] Calendar view (day, week, month) of all appointments
- [ ] List view with filtering by status, provider, service
- [ ] Accept/decline pending appointments (if approval required)
- [ ] Mark as completed, no-show, or cancelled
- [ ] Add internal notes to appointments
- [ ] Block time slots (breaks, unavailability)
- [ ] Export appointments (CSV, ICS)

#### Appointment Statuses
- PENDING_CONFIRMATION → CONFIRMED → COMPLETED
- PENDING_CONFIRMATION → DECLINED
- CONFIRMED → CANCELLED_BY_CUSTOMER / CANCELLED_BY_BUSINESS
- CONFIRMED → NO_SHOW

---

### 2.9 Favorites
**Priority:** P1 (High)  
**Status:** Required for MVP

#### Description
Allow users to save favorite businesses for quick access and rebooking.

#### User Stories
- As a customer, I want to save businesses I like
- As a customer, I want to quickly access my favorite businesses
- As a customer, I want to receive notifications about my favorites

#### Acceptance Criteria
- [ ] Heart icon on business cards and detail pages to toggle favorite
- [ ] Favorites list accessible from profile menu
- [ ] Favorites displayed in grid with business image, name, rating, next availability
- [ ] Quick rebook button from favorites list
- [ ] Remove from favorites with confirmation
- [ ] Maximum 200 favorites per user
- [ ] Favorites sync across devices
- [ ] Optional: Notify when favorite business adds new service or promotion

---

### 2.10 User Profile
**Priority:** P1 (High)  
**Status:** Required for MVP

#### Description
User profile management for personal information, preferences, and account settings.

#### User Stories
- As a user, I want to manage my personal information
- As a user, I want to view my booking history
- As a user, I want to manage my payment methods
- As a user, I want to set my preferences

#### Acceptance Criteria
- [ ] Profile photo upload (JPG/PNG, max 5MB, cropped to square)
- [ ] Editable fields: first name, last name, phone, email (with re-verification)
- [ ] Change password with current password verification
- [ ] Booking history with filtering and search
- [ ] Saved payment methods (PCI-compliant tokenization)
- [ ] Notification preferences: email, push, SMS (toggle per type)
- [ ] Privacy settings: profile visibility, data download, account deletion
- [ ] Referral code and credits tracking
- [ ] Account deletion with 30-day grace period and data export

---

### 2.11 Availability & Slot Computation
**Priority:** P0 (Critical)  
**Status:** Required for MVP

#### Description
Core scheduling engine that computes available time slots based on business hours, staff schedules, existing bookings, and service durations.

#### User Stories
- As a business owner, I want to set my working hours and breaks
- As a business owner, I want to manage staff schedules
- As a customer, I want to see real-time accurate availability

#### Acceptance Criteria
- [ ] Business hours: set per day (open/close times), supports multiple shifts
- [ ] Exception dates: holidays, special hours, temporary closures
- [ ] Staff schedules: individual working hours, breaks, time off
- [ ] Service duration configuration with buffer time between appointments
- [ ] Slot computation algorithm:
  - Generate slots based on business hours + staff schedule
  - Subtract existing bookings and blocked times
  - Account for service duration + buffer
  - Respect minimum advance notice rules
  - Handle multi-service bookings (consecutive slots)
- [ ] Real-time availability with < 2 second response
- [ ] Cache invalidation on any schedule/booking change
- [ ] Timezone handling for all date/time operations
- [ ] Bulk schedule editing for recurring patterns

---

### 2.12 Shared Types & Design System
**Priority:** P1 (High)  
**Status:** Required for MVP

#### Description
Consistent design system and shared TypeScript types across frontend and backend for maintainability and UI consistency.

#### Acceptance Criteria
- [ ] Color palette: primary (#6C5CE7), secondary (#00D2D3), success, warning, error, neutral grays
- [ ] Typography: Inter font family, 6 heading levels, body, caption styles
- [ ] Spacing system: 4px base grid (4, 8, 12, 16, 24, 32, 48, 64)
- [ ] Border radius: 4px (small), 8px (medium), 16px (large), 24px (xl), full (pills)
- [ ] Shadow system: 3 levels (subtle, medium, elevated)
- [ ] Component library: Button, Input, Select, Card, Modal, Toast, DatePicker, TimeSlot, Avatar, Badge, Skeleton
- [ ] Shared TypeScript interfaces for all API entities
- [ ] Zod schemas for runtime validation (mirrors TypeScript types)
- [ ] Responsive breakpoints: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)
- [ ] Dark mode support
- [ ] Accessibility: WCAG 2.1 AA compliance, focus states, ARIA labels
- [ ] Animation standards: 200ms ease-in-out for transitions

---

### 2.13 Reviews & Ratings
**Priority:** P1 (High)  
**Status:** Required for MVP

#### Description
Customer review and rating system for businesses and services.

#### User Stories
- As a customer, I want to rate and review businesses I've visited
- As a customer, I want to read honest reviews before booking
- As a business owner, I want to respond to reviews

#### Acceptance Criteria
- [ ] 5-star rating system with half-star precision
- [ ] Review fields: rating (required), title (optional), comment (optional, max 2000 chars)
- [ ] Photo upload (up to 5 images per review)
- [ ] Only verified customers can review (completed appointment required)
- [ ] Review window: 7 days after appointment completion
- [ ] Business owner response capability
- [ ] Review helpfulness voting (thumbs up/down)
- [ ] Report inappropriate review
- [ ] Reviews sorted by: most helpful, newest, highest/lowest rating
- [ ] Average rating recalculated on new review (weighted for recency)
- [ ] Review moderation: auto-flag for profanity, manual review queue
- [ ] Business owner cannot delete reviews, only respond

---

### 2.14 Payment Integration
**Priority:** P0 (Critical)  
**Status:** Required for MVP

#### Description
Secure payment processing for booking deposits, full payments, and refunds.

#### User Stories
- As a customer, I want to pay securely for my bookings
- As a customer, I want to save my payment method for future use
- As a business owner, I want to receive payouts for completed services
- As a platform, we want to handle refunds automatically per policy

#### Acceptance Criteria
- [ ] Stripe integration for payment processing
- [ ] Supported payment methods: credit/debit cards, Apple Pay, Google Pay
- [ ] Payment intents for 3D Secure authentication
- [ ] Save payment method for future use (customer-scoped)
- [ ] Full payment or deposit options (configurable per business)
- [ ] Automatic capture on appointment completion
- [ ] Refund processing: full or partial with reason tracking
- [ ] Payout to business owners (weekly, bi-weekly, or monthly)
- [ ] Platform fee deduction (configurable percentage)
- [ ] Payment receipt emailed to customer
- [ ] PCI compliance: no card data stored locally, use Stripe tokens
- [ ] Webhook handling for payment status updates
- [ ] Failed payment retry logic (3 attempts, 24-hour intervals)

---

### 2.15 Notifications
**Priority:** P1 (High)  
**Status:** Required for MVP

#### Description
Multi-channel notification system for keeping users informed about bookings, promotions, and account activity.

#### User Stories
- As a user, I want to receive booking confirmations and reminders
- As a user, I want to be notified of schedule changes
- As a business owner, I want to be notified of new bookings

#### Acceptance Criteria
- [ ] Channels: push (mobile), email, SMS (configurable per user)
- [ ] Notification types:
  - Booking: confirmation, reminder (24h, 2h before), modification, cancellation
  - Account: welcome, password reset, email verification
  - Marketing: promotions, new features (opt-in required)
  - Business: new booking, cancellation, review received
- [ ] Push notification deep linking to relevant app screens
- [ ] Email templates: responsive, branded, accessible
- [ ] SMS for critical alerts only (booking reminders, urgent changes)
- [ ] Notification preferences: toggle per channel and type
- [ ] Notification history in app (last 90 days)
- [ ] Unsubscribe link in all marketing communications
- [ ] Delivery tracking and retry for failed notifications

---

### 2.16 Provider / Business Owner Portal
**Priority:** P0 (Critical)  
**Status:** Required for MVP

#### Description
Dedicated portal for business owners to manage their profile, services, staff, schedule, and appointments.

#### User Stories
- As a business owner, I want to set up and customize my business profile
- As a business owner, I want to manage my services and pricing
- As a business owner, I want to add and manage staff members
- As a business owner, I want to view and manage all appointments

#### Acceptance Criteria
- [ ] Dashboard with key metrics: upcoming appointments, revenue today/this week, new reviews, occupancy rate
- [ ] Business profile editor: all fields from business detail view
- [ ] Service management: CRUD operations, pricing, duration, description, category assignment
- [ ] Staff management: add staff profiles, set permissions, manage schedules
- [ ] Schedule management: set business hours, breaks, exceptions
- [ ] Appointment calendar with day/week/month views
- [ ] Booking settings: approval required vs. instant booking, cancellation policy, deposit requirements
- [ ] Customer management: view customer history, add notes, block customers
- [ ] Revenue reports: daily, weekly, monthly, yearly with export
- [ ] Payout settings: bank account, payout schedule, payout history
- [ ] Subscription/billing management for platform fees

---

### 2.17 Admin Dashboard
**Priority:** P2 (Medium)  
**Status:** Post-MVP

#### Description
Comprehensive admin interface for platform management, user support, and business oversight.

#### User Stories
- As an admin, I want to monitor platform health and metrics
- As an admin, I want to manage businesses and users
- As an admin, I want to handle support tickets and disputes

#### Acceptance Criteria
- [ ] Analytics dashboard: total users, bookings, revenue, growth metrics
- [ ] User management: search, view, suspend, delete accounts
- [ ] Business management: approve new businesses, verify documents, suspend/activate
- [ ] Content moderation: review flagged reviews, businesses, images
- [ ] Support ticket system: assign, track, resolve customer and business issues
- [ ] Financial overview: platform revenue, payouts, refunds, fees
- [ ] System health: API metrics, error rates, queue status
- [ ] Role-based admin access (super admin, support, finance, operations)
- [ ] Audit log of all admin actions
- [ ] Data export and reporting capabilities

---

### 2.18 Background Jobs (BullMQ)
**Priority:** P1 (High)  
**Status:** Required for MVP

#### Description
Robust background job processing system for handling asynchronous tasks reliably.

#### User Stories
- As a developer, I want to offload heavy tasks from the main API
- As a user, I want reliable delivery of notifications and emails
- As a business owner, I want accurate and timely report generation

#### Acceptance Criteria
- [ ] BullMQ with Redis for job queue management
- [ ] Job types:
  - Email sending (welcome, confirmation, marketing)
  - Push notification delivery
  - SMS sending
  - Payment processing webhooks
  - Report generation and export
  - Image processing and optimization
  - Search index updates
  - Data aggregation for analytics
  - Cleanup and maintenance tasks
- [ ] Job retry logic: 3 attempts with exponential backoff
- [ ] Dead letter queue for failed jobs after max retries
- [ ] Job priority levels: critical, high, normal, low
- [ ] Job scheduling: delayed jobs, recurring jobs (cron)
- [ ] Monitoring: job counts, processing rates, failure rates, queue depths
- [ ] Graceful shutdown: complete in-progress jobs before stopping
- [ ] Concurrency control per job type

---

## 3. Non-Functional Requirements

### 3.1 Performance
- API response time: p95 < 500ms
- Page load time: p95 < 3s on 4G
- Image optimization: WebP format, lazy loading, CDN delivery
- Database query optimization: N+1 prevention, proper indexing

### 3.2 Security
- HTTPS everywhere
- OWASP Top 10 mitigation
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- XSS protection
- Rate limiting on all endpoints
- GDPR compliance: data portability, right to deletion, consent management

### 3.3 Scalability
- Horizontal scaling support
- Database read replicas for reporting
- Caching strategy (Redis): sessions, frequent queries, computed availability
- CDN for static assets

### 3.4 Reliability
- 99.9% uptime SLA
- Automated backups: database (daily), files (continuous)
- Disaster recovery plan with RPO < 1 hour, RTO < 4 hours
- Health checks and monitoring alerts

---

## 4. Prioritization Matrix

| Feature | Priority | MVP | Effort | Business Value | User Value |
|---------|----------|-----|--------|----------------|------------|
| User Authentication | P0 | Yes | Medium | High | Critical |
| Guest Browse & Explore | P0 | Yes | Low | High | High |
| Business Search & Discovery | P0 | Yes | High | Critical | Critical |
| Map-based Search | P1 | Yes | Medium | Medium | High |
| Business Detail View | P0 | Yes | Medium | High | Critical |
| Service Categories | P0 | Yes | Low | Medium | High |
| Booking Flow | P0 | Yes | High | Critical | Critical |
| Appointment Management | P0 | Yes | High | Critical | Critical |
| Favorites | P1 | Yes | Low | Low | Medium |
| User Profile | P1 | Yes | Medium | Medium | High |
| Availability & Slot Computation | P0 | Yes | High | Critical | Critical |
| Shared Types & Design System | P1 | Yes | Medium | Medium | Medium |
| Reviews & Ratings | P1 | Yes | Medium | High | High |
| Payment Integration | P0 | Yes | High | Critical | Critical |
| Notifications | P1 | Yes | Medium | High | High |
| Provider/Business Owner Portal | P0 | Yes | High | Critical | Critical |
| Admin Dashboard | P2 | No | High | Medium | Low |
| Background Jobs (BullMQ) | P1 | Yes | Medium | High | Medium |

---

## 5. Release Plan

### Phase 1: MVP (Months 1-3)
All P0 features + P1 features marked for MVP

### Phase 2: Growth (Months 4-6)
- Admin Dashboard
- Advanced analytics
- Loyalty program
- Referral system

### Phase 3: Scale (Months 7-12)
- AI-powered recommendations
- Multi-language support
- International expansion
- Advanced marketing tools

---

## 6. Appendix

### 6.1 Glossary
- **Slot:** A specific time period available for booking
- **Provider:** Individual staff member who performs services
- **Business:** Salon, shop, or establishment offering services
- **Booking:** Reserved appointment for one or more services

### 6.2 Revision History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2024 | Alex | Initial specification |
