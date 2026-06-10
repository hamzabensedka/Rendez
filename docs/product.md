# Planity Clone — Product Specification

## 1. Overview

**Product Name:** Planity Clone  
**Version:** 1.0.0  
**Status:** Draft  
**Last Updated:** 2024-01-15  

Planity Clone is a mobile-first appointment booking platform connecting customers with local service businesses (beauty, wellness, health). Customers can discover businesses, view real-time availability, book appointments, and manage their bookings. Business owners manage their schedules, services, and client relationships through a dedicated portal.

---

## 2. Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Customer** | End-user seeking to book appointments | Find businesses, book quickly, manage appointments |
| **Business Owner** | Provider managing their business | Manage schedule, services, clients, and revenue |
| **Admin** | Platform administrator | Monitor platform health, manage users, handle disputes |

---

## 3. Feature Specifications

### 3.1 User Authentication

**Priority:** P0 (Critical)  
**Owner:** Product / Engineering  

#### Description
Secure authentication system supporting multiple login methods with role-based access control.

#### User Stories
- As a Customer, I want to register with email/phone so I can create an account
- As a Customer, I want to log in with email/password or social accounts so I can access my data
- As a Business Owner, I want to register my business so I can start accepting bookings
- As a User, I want to reset my password so I can regain access to my account
- As a User, I want to stay logged in via refresh tokens so I don't have to log in repeatedly

#### Acceptance Criteria
- [ ] Users can register with email + password, phone + OTP, or OAuth (Google, Apple, Facebook)
- [ ] Passwords must be minimum 8 characters with at least one uppercase, one lowercase, one number
- [ ] Email verification required before first booking
- [ ] JWT access tokens expire in 15 minutes; refresh tokens expire in 7 days
- [ ] Role-based access: `CUSTOMER`, `BUSINESS_OWNER`, `ADMIN`
- [ ] Rate limiting: 5 failed login attempts triggers 30-minute lockout
- [ ] Business owner registration includes business name, category, and address validation

---

### 3.2 Guest Browse & Explore

**Priority:** P0 (Critical)  
**Owner:** Product / Engineering  

#### Description
Allow unauthenticated users to browse businesses and services without registration, with clear CTAs to convert.

#### User Stories
- As a Guest, I want to browse nearby businesses so I can see what's available
- As a Guest, I want to view business details and services so I can evaluate options
- As a Guest, I want to see pricing and availability so I can make informed decisions
- As a Guest, I want to be prompted to register at booking time so the flow is frictionless

#### Acceptance Criteria
- [ ] Guest users can access search, discovery, and business detail views without login
- [ ] Booking action triggers authentication modal (not blocking redirect)
- [ ] Post-authentication, guest is returned to their intended booking flow with state preserved
- [ ] Guest session data (favorites, search filters) persisted for 24 hours via localStorage
- [ ] No personal data collection from guest users beyond analytics events

---

### 3.3 Business Search & Discovery

**Priority:** P0 (Critical)  
**Owner:** Product / Engineering  

#### Description
Powerful search and filtering system to help customers find the right business.

#### User Stories
- As a Customer, I want to search by business name so I can find a specific place
- As a Customer, I want to filter by service category so I can find relevant businesses
- As a Customer, I want to filter by price range so I can match my budget
- As a Customer, I want to filter by rating so I can find highly-rated providers
- As a Customer, I want to filter by availability so I can find businesses open now

#### Acceptance Criteria
- [ ] Full-text search on business name, service name, and description
- [ ] Filters: category, price range (min/max), rating (1-5 stars), open now, distance radius
- [ ] Sort options: relevance, rating, price (low to high), distance, most reviewed
- [ ] Search results return within 500ms for cached queries
- [ ] Pagination with cursor-based infinite scroll (20 items per page)
- [ ] Search history saved for authenticated users (last 10 searches)
- [ ] Autocomplete suggestions with debounce (300ms)

---

### 3.4 Map-based Search

**Priority:** P0 (Critical)  
**Owner:** Product / Engineering  

#### Description
Interactive map view showing business locations with clustering and detail popups.

#### User Stories
- As a Customer, I want to see businesses on a map so I can choose by location
- As a Customer, I want to zoom and pan the map so I can explore different areas
- As a Customer, I want to see business info by tapping a map pin so I can quickly evaluate

#### Acceptance Criteria
- [ ] Map displays business pins with clustering for dense areas (cluster size > 5)
- [ ] Tapping a pin shows business card with name, rating, photo, and starting price
- [ ] Map view and list view are toggleable with state sync (filters apply to both)
- [ ] Default map center uses user's current location (with permission) or city center
- [ ] Map bounds trigger new search query for visible area
- [ ] Support for satellite and standard map tiles
- [ ] Pin color differentiates open (green) vs closed (gray) businesses

---

### 3.5 Business Detail View

**Priority:** P0 (Critical)  
**Owner:** Product / Engineering  

#### Description
Comprehensive business profile page with all information needed to make a booking decision.

#### User Stories
- As a Customer, I want to see business photos so I can evaluate the environment
- As a Customer, I want to see all services and prices so I can choose what to book
- As a Customer, I want to see business hours so I know when they're open
- As a Customer, I want to see contact info and address so I can visit or call
- As a Customer, I want to read reviews so I can assess quality

#### Acceptance Criteria
- [ ] Hero image carousel (up to 10 images) with business name overlay
- [ ] Services list with name, duration, description, and price
- [ ] Business hours displayed in user's timezone with "Open Now" indicator
- [ ] Address with clickable map link, phone number with tap-to-call, website link
- [ ] Average rating and total review count prominently displayed
- [ ] Staff/team section with provider photos and names
- [ ] Shareable URL with OG tags for social sharing
- [ ] "Book Now" CTA sticky at bottom on mobile

---

### 3.6 Service Categories

**Priority:** P0 (Critical)  
**Owner:** Product / Engineering  

#### Description
Hierarchical category system for organizing and discovering services.

#### User Stories
- As a Customer, I want to browse by category so I can find the type of service I need
- As a Business Owner, I want to assign categories to my services so customers can find me
- As an Admin, I want to manage the category taxonomy so the platform stays organized

#### Acceptance Criteria
- [ ] Two-level hierarchy: Parent Category → Subcategory (e.g., Beauty → Hair, Nails, Spa)
- [ ] Category icons and colors for visual identification
- [ ] Services can belong to multiple categories
- [ ] Category pages show featured businesses and trending services
- [ ] Admin CRUD for categories with slug-based URLs
- [ ] Categories support localization (FR, EN, ES, DE)

---

### 3.7 Booking Flow

**Priority:** P0 (Critical)  
**Owner:** Product / Engineering  

#### Description
Seamless multi-step booking flow optimized for mobile conversion.

#### User Stories
- As a Customer, I want to select a service so I can book what I need
- As a Customer, I want to choose a date and time so I can find a convenient slot
- As a Customer, I want to select a specific staff member so I can see my preferred provider
- As a Customer, I want to add notes to my booking so the business knows my preferences
- As a Customer, I want to confirm and pay so my appointment is secured

#### Acceptance Criteria
- [ ] Step 1: Service selection with duration and price display
- [ ] Step 2: Staff selection (optional, with "No preference" option)
- [ ] Step 3: Date picker with availability visualization (green/orange/red density)
- [ ] Step 4: Time slot selection in 15-minute increments
- [ ] Step 5: Review booking details, add notes, apply promo code
- [ ] Step 6: Payment (if required) or confirm (if pay-at-venue)
- [ ] Booking confirmation screen with calendar invite (.ics) and add-to-calendar buttons
- [ ] Booking held for 10 minutes during payment; released if payment fails
- [ ] Support for guest checkout with email/phone collection
- [ ] Booking ID generated in format: `BK-YYYY-XXXXXX`

---

### 3.8 Appointment Management

**Priority:** P0 (Critical)  
**Owner:** Product / Engineering  

#### Description
Comprehensive appointment lifecycle management for customers and business owners.

#### User Stories (Customer)
- As a Customer, I want to view my upcoming appointments so I can plan my schedule
- As a Customer, I want to reschedule my appointment so I can adapt to changes
- As a Customer, I want to cancel my appointment so I can free up the slot
- As a Customer, I want to rebook a past appointment so I can easily repeat a service

#### User Stories (Business Owner)
- As a Business Owner, I want to see all appointments in a calendar view so I can manage my day
- As a Business Owner, I want to block time slots so I can take breaks or handle emergencies
- As a Business Owner, I want to mark no-shows so I can track reliability

#### Acceptance Criteria
- [ ] Customer: List view of upcoming/past appointments with status badges
- [ ] Customer: Reschedule allowed up to 2 hours before appointment (configurable per business)
- [ ] Customer: Cancel allowed up to 2 hours before; late cancellations subject to policy
- [ ] Customer: Push notification and email confirmation for all changes
- [ ] Business Owner: Day/week/month calendar views with appointment details on click
- [ ] Business Owner: Drag-to-reschedule and quick-action buttons
- [ ] Business Owner: Block time with reason (break, meeting, other)
- [ ] Business Owner: Check-in/check-out flow for tracking actual duration
- [ ] Appointment statuses: `PENDING`, `CONFIRMED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, `NO_SHOW`

---

### 3.9 Favorites

**Priority:** P1 (High)  
**Owner:** Product / Engineering  

#### Description
Allow customers to save favorite businesses for quick rebooking.

#### User Stories
- As a Customer, I want to favorite a business so I can find it quickly later
- As a Customer, I want to see my favorite businesses so I can rebook easily
- As a Customer, I want to receive notifications about my favorites so I know about deals

#### Acceptance Criteria
- [ ] Heart icon on business cards and detail page toggles favorite status
- [ ] Favorites tab in main navigation with grid/list view
- [ ] Favorites persist to user account (not just local)
- [ ] Option to receive push notifications for new availability or promotions from favorites
- [ ] Maximum 200 favorites per user
- [ ] Quick rebook button from favorites list

---

### 3.10 User Profile

**Priority:** P1 (High)  
**Owner:** Product / Engineering  

#### Description
Customer profile management with preferences, history, and settings.

#### User Stories
- As a Customer, I want to edit my personal info so my bookings are accurate
- As a Customer, I want to manage my notification preferences so I control communication
- As a Customer, I want to view my booking history so I can track my spending
- As a Customer, I want to manage payment methods so checkout is faster

#### Acceptance Criteria
- [ ] Editable fields: name, phone, email, profile photo, birthday (for birthday offers)
- [ ] Notification preferences: email, push, SMS toggles for booking confirmations, reminders, promotions
- [ ] Booking history with filtering by date range, status, and business
- [ ] Saved payment methods with default selection and PCI-compliant display (last 4 digits only)
- [ ] Data export: download personal data as JSON (GDPR compliance)
- [ ] Account deletion with 30-day grace period and data retention policy disclosure

---

### 3.11 Availability & Slot Computation

**Priority:** P0 (Critical)  
**Owner:** Product / Engineering  

#### Description
Real-time availability engine that computes bookable slots based on business hours, staff schedules, existing appointments, and service duration.

#### User Stories
- As a Customer, I want to see only available slots so I don't book conflicts
- As a Business Owner, I want to set my working hours so customers know when I'm open
- As a Business Owner, I want to set staff schedules so availability reflects reality
- As a Business Owner, I want to add buffer time between appointments so I have breaks

#### Acceptance Criteria
- [ ] Weekly recurring schedule with exceptions for holidays and time off
- [ ] Slot computation accounts for: business hours, staff working hours, existing bookings, service duration, buffer time
- [ ] Slots computed in 15-minute increments
- [ ] Real-time availability API responds in <200ms
- [ ] Support for multiple staff with individual schedules
- [ ] Buffer time configurable per service (0, 5, 10, 15, 30 minutes)
- [ ] Handle timezone correctly for businesses and customers
- [ ] Cache availability for 30 seconds to reduce load

---

### 3.12 Shared Types & Design System

**Priority:** P0 (Critical)  
**Owner:** Product / Design / Engineering  

#### Description
Consistent design system and shared TypeScript types across web and mobile.

#### User Stories
- As a Developer, I want reusable components so I can build features quickly
- As a Developer, I want shared types so API contracts are consistent
- As a User, I want a consistent experience across platforms so the app feels familiar

#### Acceptance Criteria
- [ ] Component library: buttons, inputs, cards, modals, date picker, time picker, skeleton loaders
- [ ] Color system: primary (#FF6B6B), secondary (#4ECDC4), success, warning, error, neutral grays
- [ ] Typography: Inter font family, 6 heading levels, body, caption
- [ ] Spacing scale: 4px base unit (4, 8, 12, 16, 24, 32, 48, 64)
- [ ] Shared TypeScript types for all API entities (User, Business, Service, Booking, etc.)
- [ ] Dark mode support with automatic system preference detection
- [ ] Accessibility: WCAG 2.1 AA compliance, minimum 44px touch targets
- [ ] Animation standards: 200ms transitions, ease-in-out

---

### 3.13 Reviews & Ratings

**Priority:** P1 (High)  
**Owner:** Product / Engineering  

#### Description
Customer review and rating system for businesses and services.

#### User Stories
- As a Customer, I want to read reviews so I can evaluate a business
- As a Customer, I want to leave a review after my appointment so I can share my experience
- As a Business Owner, I want to respond to reviews so I can address feedback

#### Acceptance Criteria
- [ ] 5-star rating with optional text review (10-1000 characters)
- [ ] Reviews can only be left by verified customers who completed an appointment
- [ ] Review prompt sent 2 hours after appointment completion via push/email
- [ ] Business owner can respond once per review
- [ ] Reviews display: rating, date, verified badge, service received, review text, owner response
- [ ] Flag inappropriate reviews for admin moderation
- [ ] Average rating recalculated in real-time; cached for performance
- [ ] Sort reviews by: most recent, most helpful, highest/lowest rating

---

### 3.14 Payment Integration

**Priority:** P0 (Critical)  
**Owner:** Product / Engineering  

#### Description
Secure payment processing with support for multiple methods and business models.

#### User Stories
- As a Customer, I want to pay by card so my booking is confirmed
- As a Customer, I want to save my card for faster checkout so future bookings are easier
- As a Customer, I want to pay at the venue so I have flexibility
- As a Business Owner, I want to receive payouts so I get paid for my services

#### Acceptance Criteria
- [ ] Stripe integration for card payments (Visa, Mastercard, Amex)
- [ ] Apple Pay and Google Pay support
- [ ] Payment intents with 3D Secure for SCA compliance
- [ ] Save payment methods for reuse (Stripe Customer + PaymentMethod)
- [ ] Support for deposit-only, full prepayment, or pay-at-venue (configurable per business)
- [ ] Automatic refunds for cancellations according to business policy
- [ ] Payouts to business owners via Stripe Connect (7-day rolling)
- [ ] Invoice generation and email delivery
- [ ] Transaction history in user profile and business dashboard

---

### 3.15 Notifications

**Priority:** P1 (High)  
**Owner:** Product / Engineering  

#### Description
Multi-channel notification system for booking lifecycle and marketing.

#### User Stories
- As a Customer, I want booking reminders so I don't forget my appointment
- As a Customer, I want confirmation of changes so I'm informed
- As a Business Owner, I want new booking alerts so I can prepare
- As a User, I want to control which notifications I receive so I'm not overwhelmed

#### Acceptance Criteria
- [ ] Channels: push (Firebase Cloud Messaging), email (SendGrid), SMS (Twilio)
- [ ] Booking confirmation: immediate via push + email
- [ ] Reminders: 24 hours and 1 hour before appointment
- [ ] Cancellation notice: immediate to both customer and business
- [ ] Marketing notifications: opt-in only, with frequency cap (max 2/week)
- [ ] Notification preferences granularly configurable per channel
- [ ] Delivery tracking and retry logic for failed notifications
- [ ] In-app notification center with read/unread status

---

### 3.16 Provider / Business Owner Portal

**Priority:** P0 (Critical)  
**Owner:** Product / Engineering  

#### Description
Dedicated web portal for business owners to manage their entire operation.

#### User Stories
- As a Business Owner, I want to manage my business profile so customers see accurate info
- As a Business Owner, I want to add and edit services so my offerings are up to date
- As a Business Owner, I want to manage my schedule so availability is correct
- As a Business Owner, I want to view my revenue so I can track performance
- As a Business Owner, I want to manage my staff so they can have their own schedules

#### Acceptance Criteria
- [ ] Dashboard with KPIs: today's appointments, weekly revenue, new customers, cancellation rate
- [ ] Business profile editor: photos, description, hours, contact info, social links
- [ ] Service management: CRUD with name, description, duration, price, category, buffer time
- [ ] Staff management: add staff members with individual schedules and service assignments
- [ ] Calendar with appointment management (accept, decline, reschedule, mark no-show)
- [ ] Revenue reports: daily, weekly, monthly with export to CSV
- [ ] Customer list with visit history and notes
- [ ] Settings: cancellation policy, booking lead time, payment methods accepted
- [ ] Role-based access within business: Owner, Manager, Staff (view-only own schedule)

---

### 3.17 Admin Dashboard

**Priority:** P1 (High)  
**Owner:** Product / Engineering  

#### Description
Platform administration interface for managing users, businesses, and platform health.

#### User Stories
- As an Admin, I want to view platform metrics so I can monitor growth
- As an Admin, I want to manage user accounts so I can handle support issues
- As an Admin, I want to moderate reviews so content is appropriate
- As an Admin, I want to manage business approvals so quality is maintained

#### Acceptance Criteria
- [ ] Analytics dashboard: MAU, total bookings, GMV, top categories, geographic distribution
- [ ] User management: search, view, suspend, delete accounts
- [ ] Business management: approve new registrations, feature/unfeature, suspend
- [ ] Review moderation: queue for flagged reviews, approve/reject with reason
- [ ] Support ticket integration with assignment and status tracking
- [ ] Financial overview: transaction volume, refunds, payouts pending
- [ ] Audit log of all admin actions with admin identity and timestamp
- [ ] Role-based admin access: Super Admin, Support, Finance, Moderator

---

### 3.18 Background Jobs (BullMQ)

**Priority:** P1 (High)  
**Owner:** Product / Engineering  

#### Description
Robust background job processing for asynchronous tasks using BullMQ.

#### User Stories
- As a Developer, I want reliable job processing so critical tasks don't fail silently
- As a Customer, I want timely notifications so I'm informed of my bookings
- As a Business Owner, I want accurate reports so my data is reliable

#### Acceptance Criteria
- [ ] Job queues: `notifications`, `payments`, `reports`, `emails`, `sms`, `data-exports`
- [ ] Retry policy: 3 attempts with exponential backoff (5s, 25s, 125s)
- [ ] Dead letter queue for failed jobs after max retries
- [ ] Job monitoring dashboard with queue depth, processing rate, failure rate
- [ ] Scheduled jobs: daily reports at 6 AM, weekly summary on Mondays
- [ ] Job idempotency keys to prevent duplicate processing
- [ ] Priority levels: `critical` (payments), `high` (notifications), `normal` (reports), `low` (analytics)
- [ ] Redis-backed with BullMQ Pro for rate limiting and job concurrency control

#### Defined Jobs
| Job | Queue | Trigger | Priority |
|-----|-------|---------|----------|
| Send booking confirmation | notifications | Booking created | Critical |
| Send reminder | notifications | 24h/1h before appt | High |
| Process payment | payments | Booking confirmed | Critical |
| Generate daily report | reports | Daily at 6 AM | Low |
| Export user data | data-exports | User request | Normal |
| Send marketing email | emails | Campaign scheduled | Normal |
| Sync search index | search | Business updated | Normal |

---

## 4. Non-Functional Requirements

### Performance
- API response time: P95 < 200ms for cached queries, < 500ms for computed queries
- App cold start: < 3 seconds on mid-range devices
- Image loading: progressive loading with blur placeholder, WebP format

### Security
- OWASP Top 10 compliance
- End-to-end encryption for payment data (PCI DSS Level 1 via Stripe)
- GDPR and CCPA compliance for data privacy
- Regular security audits and penetration testing

### Scalability
- Support 10,000 concurrent users at launch
- Auto-scaling based on CPU and request queue depth
- Database read replicas for search and listing queries

### Reliability
- 99.9% uptime SLA
- Database backups: daily full, hourly incremental, 30-day retention
- Graceful degradation: core booking flow works if non-critical services fail

---

## 5. Analytics & Metrics

### Key Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Booking conversion rate | > 15% | Bookings / Business detail views |
| Search to booking | > 5% | Bookings / Searches |
| User retention (30d) | > 25% | DAU / MAU |
| Business owner activation | > 70% | Completed profile / Registrations |
| App store rating | > 4.5 | Average rating |
| Support ticket volume | < 2% of users | Tickets / Active users |

### Tracked Events
- `search_performed`, `business_viewed`, `service_selected`, `slot_selected`, `booking_initiated`, `payment_started`, `payment_completed`, `booking_confirmed`, `appointment_rescheduled`, `appointment_cancelled`, `review_submitted`, `favorite_added`

---

## 6. Release Criteria

### MVP (Phase 1)
- [ ] User Authentication (email, social)
- [ ] Guest Browse & Explore
- [ ] Business Search & Discovery
- [ ] Map-based Search
- [ ] Business Detail View
- [ ] Service Categories
- [ ] Booking Flow
- [ ] Appointment Management (customer)
- [ ] Availability & Slot Computation
- [ ] Payment Integration (card only)
- [ ] Provider Portal (basic)

### Phase 2
- [ ] Favorites
- [ ] User Profile enhancements
- [ ] Reviews & Ratings
- [ ] Notifications (push, email, SMS)
- [ ] Admin Dashboard
- [ ] Background Jobs (full)
- [ ] Apple Pay / Google Pay

### Phase 3
- [ ] Loyalty program
- [ ] Subscription plans for businesses
- [ ] AI-powered recommendations
- [ ] Multi-location business support
- [ ] Marketplace for products

---

## 7. Open Questions

1. Should we support group bookings (multiple people, same time)?
2. What is the commission structure for the platform?
3. Do we need integration with external calendars (Google, Outlook)?
4. Should we offer waitlist functionality for fully booked times?
5. What is the international expansion timeline?

---

## 8. Appendix

### Glossary
- **GMV**: Gross Merchandise Value
- **SCA**: Strong Customer Authentication
- **PCI DSS**: Payment Card Industry Data Security Standard
- **BullMQ**: Redis-based queue system for Node.js

### Related Documents
- `docs/architecture.md` — Technical architecture
- `docs/api-spec.md` — API specification
- `docs/design-system.md` — Design system documentation
- `output/reports/progress_report.md` — Project progress

---

*Document maintained by Product Team. For questions, contact product@planity-clone.com*
