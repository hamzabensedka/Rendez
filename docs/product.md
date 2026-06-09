# Planity Clone — Product Specification

## 1. Overview

**Product Name:** Planity Clone  
**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** Draft  

Planity Clone is a mobile-first appointment booking platform that connects customers with beauty, wellness, and health service providers. Customers can discover businesses, view services, check real-time availability, and book appointments. Business owners manage their schedules, services, and customer relationships through a dedicated portal.

---

## 2. Personas

| Persona | Description | Goals |
|---------|-------------|-------|
| **Customer** | End-user seeking beauty/wellness services | Find, compare, and book appointments quickly |
| **Business Owner** | Salon/spa/clinic owner or manager | Manage bookings, staff, services, and grow business |
| **Staff Member** | Employee of a business | View and manage their own schedule |
| **Admin** | Platform administrator | Oversee platform health, resolve disputes, manage payouts |

---

## 3. Feature Specifications

### 3.1 User Authentication

**Priority:** P0 (Critical)  
**Owner:** Product Owner  

#### Description
Secure authentication system supporting multiple login methods with role-based access control.

#### User Stories
- As a Customer, I want to register with email/phone so I can create an account quickly.
- As a Customer, I want to log in with social providers (Google, Apple) so I don't need to remember another password.
- As a Business Owner, I want to register my business and create an admin account so I can start managing my business.
- As a User, I want to reset my password so I can regain access if I forget it.
- As a User, I want to stay logged in via secure token refresh so I don't need to log in repeatedly.

#### Acceptance Criteria
- [ ] Users can register with email, phone number, or social OAuth (Google, Apple)
- [ ] Passwords must be minimum 8 characters with at least one uppercase, one lowercase, and one number
- [ ] Email verification required before first booking
- [ ] Phone number verification via SMS OTP
- [ ] JWT access tokens expire after 15 minutes; refresh tokens valid for 7 days
- [ ] Role assignment: `CUSTOMER`, `BUSINESS_OWNER`, `STAFF`, `ADMIN`
- [ ] Rate limiting: max 5 login attempts per 15 minutes per IP
- [ ] Account lockout after 5 failed attempts, unlock via email
- [ ] Social login accounts can add password for email/password login later
- [ ] Users can delete their account with 30-day grace period for data recovery

#### Technical Notes
- Use NestJS Passport with JWT strategy
- Store passwords with bcrypt (cost factor 12)
- Redis for refresh token blacklist on logout
- Prisma User model with role enum

---

### 3.2 Guest Browse & Explore

**Priority:** P0 (Critical)  
**Owner:** Product Owner  

#### Description
Allow unauthenticated users to browse businesses and services to reduce friction before registration.

#### User Stories
- As a Guest, I want to browse businesses without logging in so I can evaluate the platform first.
- As a Guest, I want to see service details and prices so I can make informed decisions.
- As a Guest, I want to be prompted to log in when I try to book so the conversion path is clear.

#### Acceptance Criteria
- [ ] Guest users can access search, business listings, and business detail views
- [ ] Guest users can view services, prices, descriptions, and reviews
- [ ] "Book Now" button triggers login/signup modal with return URL preserved
- [ ] Guest browsing data (recent searches, viewed businesses) stored in localStorage for 7 days
- [ ] Upon registration, localStorage data merged to authenticated account
- [ ] Guest users cannot: book, favorite, leave reviews, or access profile featuresijd- [ ] Analytics distinguish guest vs. authenticated user sessions

---

### 3.3 Business Search & Discovery

**Priority:** P0 (Critical)  
**Owner:** Product Owner  

#### Description
Powerful search and filtering to help customers find the right business for their needs.

#### User Stories
- As a Customer, I want to search by business name, service, or location so I can find relevant results.
- As a Customer, I want to filter by price range, rating, availability, and distance so I can narrow options.
- As a Customer, I want to see search results sorted by relevance, rating, or distance so I find the best match.

#### Acceptance Criteria
- [ ] Full-text search across business name, service names, and descriptions
- [ ] Autocomplete suggestions with debounce (300ms) after 3 characters
- [ ] Filters: category, price range (min/max), minimum rating, distance radius, available today, gender of staff
- [ ] Sort options: relevance (default), highest rated, most reviewed, nearest, price (low to high)
- [ ] Pagination: 20 results per page with cursor-based pagination for performance
- [ ] Search results display: business image, name, rating, review count, starting price, distance, next available slot
- [ ] Recent searches stored (last 10), clearable by user
- [ ] Search query and filters reflected in URL for shareability
- [ ] Empty state with suggestions when no results found
- [ ] Search performance: results return in <200ms for 95th percentile

---

### 3.4 Map-based Search

**Priority:** P1 (High)  
**Owner:** Product Owner  

#### Description
Interactive map view showing business locations with clustering for dense areas.

#### User Stories
- As a Customer, I want to see businesses on a map so I understand their location.
- As a Customer, I want to search an area by panning/zooming the map so I can explore neighborhoods.
- As a Customer, I want to see my current location so I find nearby businesses easily.

#### Acceptance Criteria
- [ ] Map displays business pins with clustering for zoom levels
- [ ] Tap pin shows business card with key info and link to detail
- [ ] User location button centers map with permission prompt
- [ ] Map bounds trigger new search query for visible area
- [ ] Toggle between list view and map view; preference persisted
- [ ] Default zoom shows ~5km radius around search point or user location
- [ ] Custom map markers: open (green), closing soon (orange), closed (gray)
- [ ] Map accessible offline with cached tile data (last viewed area)

---

### 3.5 Business Detail View

**Priority:** P0 (Critical)  
**Owner:** Product Owner  

#### Description
Comprehensive business profile page with all information needed to make a booking decision.

#### User Stories
- As a Customer, I want to see business photos, hours, and descriptions so I know what to expect.
- As a Customer, I want to see all services with prices and durations so I can choose appropriately.
- As a Customer, I want to see staff profiles so I can select my preferred provider.

#### Acceptance Criteria
- [ ] Hero image carousel (up to 10 images), with thumbnail navigation
- [ ] Business info: name, category, address, phone, website, social links
- [ ] Operating hours with current day highlighted; "Open Now" / "Closes at X" / "Closed" status
- [ ] Services tab: list with name, description, duration, price; groupable by category
- [ ] Staff tab: photo, name, bio, specialties, average rating
- [ ] Reviews tab: overall rating breakdown (1-5 stars), review list with photos, sort by recent/helpful
- [ ] "Book" CTA sticky at bottom; scrolls to service selection
- [ ] Share button generates deep link to business
- [ ] Report business option for inappropriate content
- [ ] View count tracked for business analytics

---

### 3.6 Service Categories

**Priority:** P1 (High)  
**Owner:** Product Owner  

#### Description
Hierarchical categorization of services for discovery and business organization.

#### User Stories
- As a Customer, I want to browse by category so I can discover new businesses.
- As a Business Owner, I want to categorize my services so customers can find them easily.

#### Acceptance Criteria
- [ ] Predefined category tree: Beauty > Hair, Nails, Makeup, etc.; Wellness > Massage, Spa, etc.
- [ ] Categories have icons and cover images for visual identification
- [ ] Business can assign services to multiple categories
- [ ] Category pages show featured businesses and trending services
- [ ] Admin can add, edit, or deprecate categories (soft delete)
- [ ] Category slugs are SEO-friendly

---

### 3.7 Booking Flow

**Priority:** P0 (Critical)  
**Owner:** Product Owner  

#### Description
Seamless multi-step booking process from service selection to confirmation.

#### User Stories
- As a Customer, I want to select a service, staff, and time slot so I can book an appointment.
- As a Customer, I want to add notes to my booking so the business knows my preferences.
- As a Customer, I want to receive immediate confirmation so I know my appointment is secured.

#### Acceptance Criteria
- [ ] Step 1: Select service(s) with optional add-ons
- [ ] Step 2: Select staff member or "No preference" (any available)
- [ ] Step 3: Select date (calendar view, up to 60 days ahead) and time slot
- [ ] Step 4: Review booking details, add notes, apply promo code
- [ ] Step 5: Payment (if required) or confirm (if free/pay at venue)
- [ ] Real-time slot availability with optimistic locking (5-minute hold on selected slot)
- [ ] Booking confirmation screen with add-to-calendar option
- [ ] Confirmation email and push notification sent
- [ ] Booking reference number generated (format: BK-YYYY-XXXXXX)
- [ ] Support for group bookings (multiple services, same time block)
- [ ] Guest checkout option with email/phone only (no account required)

---

### 3.8 Appointment Management

**Priority:** P0 (Critical)  
**Owner:** Product Owner  

#### Description
Customers and businesses can view, modify, and cancel appointments with appropriate policies.

#### User Stories
- As a Customer, I want to see all my upcoming and past appointments so I can manage my schedule.
- As a Customer, I want to reschedule or cancel my appointment so I have flexibility.
- As a Business Owner, I want to see all bookings for my business so I can manage operations.

#### Acceptance Criteria
- [ ] Customer appointment list: upcoming (sorted by date), past, cancelled tabs
- [ ] Appointment detail: service, staff, time, location, notes, status, actions
- [ ] Reschedule: select new slot with same policy as new booking; notify business and customer
- [ ] Cancel: customer can cancel up to business policy cutoff (default 24h); late cancellations may incur fee
- [ ] Business calendar view: day/week/month views with drag-and-drop rescheduling
- [ ] Business can block time slots (breaks, unavailability)
- [ ] Business can mark no-show with customer notification
- [ ] Automated reminders: 24h and 1h before appointment via push/SMS/email (configurable)
- [ ] Appointment statuses: PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED_BY_CUSTOMER, CANCELLED_BY_BUSINESS, NO_SHOW

---

### 3.9 Favorites

**Priority:** P2 (Medium)  
**Owner:** Product Owner  

#### Description
Customers can save favorite businesses for quick access.

#### User Stories
- As a Customer, I want to favorite businesses so I can quickly rebook with providers I trust.
- As a Customer, I want to receive notifications about my favorites' offers so I don't miss deals.

#### Acceptance Criteria
- [ ] Heart icon on business card and detail page toggles favorite status
- [ ] Favorites list accessible from profile; sortable by recently added, name, or nearest
- [ ] Favorite count displayed on business profile (public)
- [ ] Option to receive notifications for new services or promotions from favorites
- [ ] Favorites sync across devices for logged-in users
- [ ] Suggest similar businesses based on favorite categories

---

### 3.10 User Profile

**Priority:** P1 (High)  
**Owner:** Product Owner  

#### Description
Customer profile management with preferences, history, and settings.

#### User Stories
- As a Customer, I want to manage my personal information so my bookings are accurate.
- As a Customer, I want to set my preferences so the app personalizes my experience.

#### Acceptance Criteria
- [ ] Profile fields: name, email, phone, profile photo, date of birth (optional, for birthday offers)
- [ ] Address book: multiple saved addresses with label (home, work, etc.)
- [ ] Notification preferences: push, email, SMS toggles per type (bookings, promotions, reminders)
- [ ] Payment methods: saved cards via Stripe, default payment method
- [ ] Booking history with reorder/rebook functionality
- [ ] Loyalty points or credits display (if applicable)
- [ ] Privacy settings: profile visibility, data download, account deletion
- [ ] Referral code generation and tracking

---

### 3.11 Availability & Slot Computation

**Priority:** P0 (Critical)  
**Owner:** Product Owner  

#### Description
Core scheduling engine that computes available time slots based on business rules, staff schedules, and existing bookings.

#### User Stories
- As a Business Owner, I want to set my operating hours and staff schedules so customers see accurate availability.
- As a Customer, I want to see only truly available slots so I don't book unavailable times.

#### Acceptance Criteria
- [ ] Business sets weekly recurring hours with exceptions for holidays/special dates
- [ ] Staff schedules linked to business hours with individual overrides
- [ ] Service duration + buffer time = slot consumption
- [ ] Concurrent booking prevention via database constraints
- [ ] Slot computation accounts for: staff breaks, existing bookings, blocked times, service-specific prep/cleanup time
- [ ] Performance: slot query for 30-day range returns in <100ms
- [ ] Cache computed slots with invalidation on schedule change or booking mutation
- [ ] Support for variable-duration services (e.g., consultation determines actual service)
- [ ] Overbooking protection with configurable waitlist option

---

### 3.12 Shared Types & Design System

**Priority:** P1 (High)  
**Owner:** Product Owner  

#### Description
Consistent UI/UX across platforms with reusable components and typed interfaces.

#### Acceptance Criteria
- [ ] Design tokens: colors, typography, spacing, shadows in theme configuration
- [ ] Component library: Button, Input, Card, Modal, Calendar, TimePicker, Rating, Avatar, Badge, Skeleton
- [ ] Shared TypeScript interfaces for all API entities (User, Business, Service, Booking, etc.)
- [ ] Responsive breakpoints: mobile (<640px), tablet (640-1024px), desktop (>1024px)
- [ ] Accessibility: WCAG 2.1 AA compliance, screen reader support, keyboard navigation
- [ ] Dark mode support with system preference detection
- [ ] Animation standards: 200ms transitions, consistent easing curves
- [ ] Icon set: Lucide icons with consistent sizing (16, 20, 24, 32px)

---

### 3.13 Reviews & Ratings

**Priority:** P1 (High)  
**Owner:** Product Owner  

#### Description
Customer feedback system to build trust and help businesses improve.

#### User Stories
- As a Customer, I want to read reviews so I can choose quality businesses.
- As a Customer, I want to leave a review after my appointment so I can share my experience.
- As a Business Owner, I want to respond to reviews so I can address feedback.

#### Acceptance Criteria
- [ ] Verified reviews only: customer must have completed appointment to review
- [ ] Review form: rating (1-5 stars), title, text, optional photo upload (max 5 images)
- [ ] Rating categories: overall, service quality, staff, ambiance, value (optional)
- [ ] Business owner reply within 30 days of review posting
- [ ] Review moderation: auto-flag for inappropriate content; admin escalation
- [ ] Review helpfulness voting (thumbs up/down)
- [ ] Average rating recalculated in real-time; cached for performance
- [ ] Reviews editable by customer for 48 hours after posting
- [ ] Business can report unfair reviews for admin review

---

### 3.14 Payment Integration

**Priority:** P0 (Critical)  
**Owner:** Product Owner  

#### Description
Secure payment processing for deposits, full prepayments, and in-app purchases.

#### User Stories
- As a Customer, I want to pay securely in the app so my booking is confirmed.
- As a Business Owner, I want to receive payouts for online payments so I have reliable cash flow.

#### Acceptance Criteria
- [ ] Stripe integration for card payments (Visa, Mastercard, Amex)
- [ ] Payment methods: card (saved), Apple Pay, Google Pay
- [ ] Payment intents: authorize and capture vs. immediate charge based on business settings
- [ ] Deposit option: percentage or fixed amount configurable by business
- [ ] Full refund, partial refund, and no-refund policies per business
- [ ] Automatic payout to business bank account (weekly or monthly)
- [ ] Invoice generation and email delivery
- [ ] Payment failure handling: retry logic, customer notification, booking hold extension
- [ ] PCI compliance: no card data stored locally; use Stripe Elements
- [ ] Transaction history in customer and business portals

---

### 3.15 Notifications

**Priority:** P1 (High)  
**Owner:** Product Owner  

#### Description
Multi-channel notification system for timely, relevant user communication.

#### Acceptance Criteria
- [ ] Channels: push (Firebase Cloud Messaging), email (SendGrid), SMS (Twilio)
- [ ] Notification types: booking confirmation, reminder, modification, cancellation, promotion, system
- [ ] User preference management per channel and type
- [ ] Rich push notifications with deep linking to relevant screens
- [ ] Notification inbox in-app with read/unread status
- [ ] Batch promotional notifications with scheduling and targeting
- [ ] Delivery tracking and bounce handling
- [ ] Rate limiting to prevent notification fatigue (max 3 promotional/day)

---

### 3.16 Provider / Business Owner Portal

**Priority:** P0 (Critical)  
**Owner:** Product Owner  

#### Description
Comprehensive web dashboard for business owners to manage their presence, services, staff, and operations.

#### Acceptance Criteria
- [ ] Dashboard: upcoming appointments, revenue summary, recent reviews, quick actions
- [ ] Business profile editor: photos, description, hours, contact info, social links
- [ ] Service management: CRUD services with pricing, duration, description, category assignment
- [ ] Staff management: add staff, set schedules, assign services, deactivate
- [ ] Booking calendar: day/week/month views, filter by staff, drag-and-drop reschedule
- [ ] Customer management: view customer history, notes, contact; export customer list
- [ ] Analytics: appointments, revenue, cancellation rate, popular services, peak hours
- [ ] Settings: notification preferences, payment settings, integration (Google Calendar sync)
- [ ] Role-based access: Owner (full), Manager (most), Staff (schedule only)
- [ ] Mobile-responsive design for on-the-go management

---

### 3.17 Admin Dashboard

**Priority:** P1 (High)  
**Owner:** Product Owner  

#### Description
Platform administration tools for overseeing users, businesses, and platform health.

#### Acceptance Criteria
- [ ] User management: search, view, suspend, impersonate; filter by role, status, date
- [ ] Business management: approve new registrations, verify documents, suspend/activate
- [ ] Content moderation: review flagged businesses, services, reviews; take action
- [ ] Financial overview: total GMV, transaction volume, revenue, payouts pending
- [ ] Dispute resolution: view payment disputes, issue refunds, communicate with parties
- [ ] Analytics: MAU, booking conversion funnel, churn rate, top categories/geographies
- [ ] System health: API latency, error rates, queue depths, database performance
- [ ] Audit log: all admin actions with admin ID, timestamp, before/after state
- [ ] Role-based admin access: Super Admin, Support, Finance, Content Moderator

---

### 3.18 Background Jobs (BullMQ)

**Priority:** P1 (High)  
**Owner:** Product Owner  

#### Description
Reliable asynchronous job processing for time-consuming or scheduled operations.

#### Acceptance Criteria
- [ ] Job types久queues: notifications, payments, reports, data exports, search index updates
- [ ] Retry policy: 3 attempts with exponential backoff for failed jobs
- [ ] Dead letter queue for jobs exceeding retry limit; admin alert
- [ ] Scheduled jobs: daily reports, weekly payouts, nightly data cleanup
- [ ] Job priority levels: critical (payment processing), high (notifications), normal (reports), low (analytics)
- [ ] Job progress tracking and admin visibility into queue status
- [ ] Idempotency keys to prevent duplicate job execution
- [ ] Graceful shutdown: finish active jobs before process termination

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | API p95 <200ms; page load <2s; map tile render <100ms |
| **Scalability** | Support 10,000 concurrent users; 100,000 bookings/day |
| **Security** | OWASP Top 10 mitigation; encryption at rest and in transit; audit logging |
| **Reliability** | 99.9% uptime SLA; automated failover; daily backups |
| **Compliance** | GDPR data handling; PCI-DSS for payments; accessibility WCAG 2.1 AA |

---

## 5. Analytics & Metrics

| Metric | Target | Tracking |
|--------|--------|----------|
| User registration rate | >30% of app opens | Firebase Analytics |
| Booking conversion (view to book) | >5% | Custom events |
| Search to booking | >10% | Custom events |
| Cancellation rate | <10% | Database |
| NPS score | >50 | In-app survey |
| App store rating | >4.5 stars | Store monitoring |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Guest Browse, Search, Business Detail, Booking, Appointments, Payments, Business Portal | Month 1-2 |
| **V1.1** | Map Search, Favorites, Reviews, Notifications | Month 3 |
| **V1.2** | Admin Dashboard, Analytics, Background Jobs optimization | Month 4 |
| **V2.0** | AI recommendations, Loyalty program, Marketplace features | Month 6 |

---

## 7. Open Questions

1. Internationalization requirements and supported languages for launch?
2. Commission structure: percentage fee per booking or subscription model for businesses?
3. Insurance or liability coverage for bookings?
4. Integration with existing salon management software (two-way sync)?

---

*Document Owner: Alex, Product Owner*  
*Review Cycle: Bi-weekly during active development*