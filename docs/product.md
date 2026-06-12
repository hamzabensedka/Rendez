# Planity Clone — Product Specification

## 1. Overview

**Product Name:** Planity Clone  
**Version:** 1.0.0  
**Last Updated:** 2024-01-15  
**Status:** Draft  

Planity Clone is a mobile-first appointment booking platform connecting customers with local service businesses (beauty salons, barbershops, spas, wellness centers). The platform enables customers to discover, book, and manage appointments while providing business owners with tools to manage their schedules, services, and client base.

## 2. Product Vision

Empower customers to effortlessly discover and book local beauty and wellness services while helping small businesses streamline operations, reduce no-shows, and grow their client base.

## 3. Target Users

| Persona | Description | Goals |
|---------|-------------|-------|
| **Customer** | Individuals seeking beauty/wellness services | Find, compare, and book appointments quickly |
| **Business Owner** | Salon/spa owners and managers | Manage schedule, services, and client relationships |
| **Staff Member** | Individual service providers | View schedule, manage availability |
| **Admin** | Platform administrators | Oversee platform health, resolve disputes |

## 4. Feature Specifications

---

### 4.1 User Authentication

**Priority:** P0 (Critical)  
**Owner:** Product / Engineering  

#### Description
Secure authentication system allowing users to create accounts, log in, and manage their sessions across the platform.

#### User Stories
- As a customer, I want to create an account so I can book appointments and manage my bookings.
- As a business owner, I want to log in securely so I can access my business dashboard.
- As a user, I want to reset my password so I can regain access if I forget it.

#### Acceptance Criteria
- [ ] Users can register with email/password or social login (Google, Apple)
- [ ] Password must be minimum 8 characters with at least one uppercase, one lowercase, and one number
- [ ] Email verification required before first booking
- [ ] JWT tokens with 7-day access token and 30-day refresh token
- [ ] Users can log out from all devices
- [ ] Rate limiting: 5 failed login attempts triggers 15-minute lockout
- [ ] Social login accounts can add password for email/password login
- [ ] Account deletion option available in profile settings

#### Technical Notes
- Use OAuth 2.0 + OpenID Connect for social logins
- Store passwords with bcrypt (cost factor 12)
- Implement token rotation for security

---

### 4.2 Guest Browse & Explore

**Priority:** P0 (Critical)  
**Owner:** Product / Engineering  

#### Description
Allow non-authenticated users to browse businesses, view services, and explore the platform before committing to registration.

#### User Stories
- As a guest, I want to browse nearby salons so I can see what's available before signing up.
- As a guest, I want to view business details and service prices so I can make informed decisions.

#### Acceptance Criteria
- [ ] Guest users can access search, discovery, and business detail views without login
- [ ] Guest users can view business profiles, services, reviews, and availability
- [ ] Booking action prompts login/signup (modal or redirect)
- [ ] Guest search history stored in localStorage for 7 days
- [ ] Upon registration, guest browsing history can be linked to new account (optional)
- [ ] No limit on guest browsing sessions

#### Technical Notes
- Implement auth guards only on mutation operations
- Track guest sessions with anonymous ID for analytics

---

### 4.3 Business Search & Discovery

**Priority:** P0 (Critical)  
**Owner:** Product / Engineering  

#### Description
Powerful search and filtering system enabling customers to find businesses matching their needs.

#### User Stories
- As a customer, I want to search for businesses by name, service, or location so I can find what I need.
- As a customer, I want to filter results by rating, price, distance, and availability so I can narrow options.

#### Acceptance Criteria
- [ ] Full-text search across business name, service names, and descriptions
- [ ] Filters: distance (1-50km), rating (1-5 stars), price range, category, availability (today, this week)
- [ ] Sort options: relevance, distance, rating, price (low to high)
- [ ] Auto-complete suggestions with recent searches
- [ ] Search results display: business photo, name, rating, distance, starting price, next available slot
- [ ] Pagination with 20 results per page
- [ ] Search query debounced at 300ms
- [ ] Empty state with suggestions to refine search

#### Technical Notes
- Use PostgreSQL full-text search or Elasticsearch for scalable search
- Cache popular search queries for 5 minutes
- Geospatial indexing for distance calculations

---

### 4.4 Map-based Search

**Priority:** P1 (High)  
**Owner:** Product / Engineering  

#### Description
Interactive map view showing business locations with clustering for visual discovery.

#### User Stories
- As a customer, I want to see businesses on a map so I can choose one that's convenient.
- As a customer, I want to explore a specific neighborhood so I can discover hidden gems.

#### Acceptance Criteria
- [ ] Map displays business pins with clustering for dense areas
- [ ] Tap on pin shows business card preview (name, rating, photo)
- [ ] Card preview links to full business detail
- [ ] User location dot with accuracy radius
- [ ] Map bounds trigger new search query
- [ ] Toggle between list and map views
- [ ] Default zoom shows businesses within 5km
- [ ] Support for satellite and standard map styles

#### Technical Notes
- Use Mapbox or Google Maps SDK
- Implement viewport-based query to fetch only visible businesses
- Cluster markers using supercluster or similar library

---

### 4.5 Business Detail View

**Priority:** P0 (Critical)  
**Owner:** Product / Engineering  

#### Description
Comprehensive business profile page displaying all relevant information for customer decision-making.

#### User Stories
- As a customer, I want to see all business details so I can decide if it's right for me.
- As a customer, I want to see staff profiles so I can choose my preferred provider.

#### Acceptance Criteria
- [ ] Header: business name, photos (gallery), rating, review count, favorite button
- [ ] Info section: address, hours, phone, website, description
- [ ] Services tab: categorized list with prices, durations, descriptions
- [ ] Staff tab: provider profiles with photos, bios, specialties
- [ ] Reviews tab: sorted by most recent, filter by rating
- [ ] Availability preview: next 3 available slots with link to full booking
- [ ] Share button generates deep link
- [ ] Report business option for inappropriate content

#### Technical Notes
- Lazy load images with blur placeholder
- Cache business detail for 5 minutes
- Track page views for business analytics

---

### 4.6 Service Categories

**Priority:** P1 (High)  
**Owner:** Product / Engineering  

#### Description
Hierarchical categorization system for organizing services across the platform.

#### User Stories
- As a customer, I want to browse by category so I can discover new services.
- As a business owner, I want to categorize my services so customers can find them easily.

#### Acceptance Criteria
- [ ] Predefined categories: Hair, Nails, Face, Body, Massage, Wellness, Medical Aesthetic
- [ ] Subcategories up to 2 levels deep (e.g., Hair > Coloring > Balayage)
- [ ] Category icons and color coding for visual recognition
- [ ] Trending categories section on home screen
- [ ] Businesses can assign multiple categories
- [ ] Category pages show featured businesses and popular services

#### Technical Notes
- Categories stored in database with slug-based URLs
- Support for category-specific filters (e.g., hair length for coloring)

---

### 4.7 Booking Flow

**Priority:** P0 (Critical)  
**Owner:** Product / Engineering  

#### Description
Seamless multi-step booking process from service selection to confirmation.

#### User Stories
- As a customer, I want to book an appointment in a few taps so I can secure my preferred time.
- As a customer, I want to book multiple services in one appointment so I can plan my visit.

#### Acceptance Criteria
- [ ] Step 1: Select service(s) with optional staff preference
- [ ] Step 2: View calendar with available slots (respects business hours and staff schedules)
- [ ] Step 3: Select date and time slot
- [ ] Step 4: Review booking details with price breakdown
- [ ] Step 5: Add notes or special requests (max 500 chars)
- [ ] Step 6: Confirm booking (payment if required)
- [ ] Booking confirmation screen with add-to-calendar option
- [ ] Booking reference number generated
- [ ] Support for guest checkout with email/phone
- [ ] Show cancellation policy before confirmation

#### Technical Notes
- Implement optimistic UI for slot selection
- Hold selected slot for 10 minutes during checkout
- WebSocket or polling for real-time availability

---

### 4.8 Appointment Management

**Priority:** P0 (Critical)  
**Owner:** Product / Engineering  

#### Description
Comprehensive appointment lifecycle management for customers and businesses.

#### User Stories
- As a customer, I want to view my upcoming appointments so I can plan my schedule.
- As a customer, I want to reschedule or cancel if my plans change.
- As a business owner, I want to manage all appointments from a central calendar.

#### Acceptance Criteria (Customer)
- [ ] Upcoming appointments list with date, time, business, services, status
- [ ] Appointment detail view with all information and actions
- [ ] Reschedule: select new slot, confirm change, notify business
- [ ] Cancel: with reason selection, confirmation modal, refund if applicable
- [ ] Past appointments with rebook option
- [ ] Push and email reminders 24h and 1h before appointment

#### Acceptance Criteria (Business)
- [ ] Calendar view (day/week/month) with all appointments
- [ ] Color-coded by status: confirmed, pending, completed, cancelled, no-show
- [ ] Quick actions: confirm, reschedule, cancel, mark no-show
- [ ] Add manual appointment (walk-in, phone booking)
- [ ] Block time off (lunch, vacation)
- [ ] Export calendar (ICS format)

#### Technical Notes
- Soft delete for audit trail
- All changes logged with timestamp and user
- Conflict detection for double-booking prevention

---

### 4.9 Favorites

**Priority:** P2 (Medium)  
**Owner:** Product / Engineering  

#### Description
Allow customers to save and quickly access preferred businesses.

#### User Stories
- As a customer, I want to favorite businesses so I can quickly rebook with them.

#### Acceptance Criteria
- [ ] Heart icon on business cards and detail page
- [ ] Favorites list in user profile
- [ ] Quick rebook from favorites
- [ ] Receive notifications for new services or promotions from favorites
- [ ] Sync favorites across devices
- [ ] Maximum 200 favorites per user

---

### 4.10 User Profile

**Priority:** P1 (High)  
**Owner:** Product / Engineering  

#### Description
Customer profile management for personal information, preferences, and account settings.

#### User Stories
- As a customer, I want to manage my profile so my bookings are accurate.
- As a customer, I want to save payment methods for faster checkout.

#### Acceptance Criteria
- [ ] Profile photo, name, phone, email, date of birth
- [ ] Address book with default address
- [ ] Saved payment methods (PCI-compliant tokenization)
- [ ] Notification preferences (email, push, SMS)
- [ ] Booking history with receipts
- [ ] Loyalty/points balance (if applicable)
- [ ] Privacy settings: profile visibility, marketing consent
- [ ] Account deletion with 30-day grace period

---

### 4.11 Availability & Slot Computation

**Priority:** P0 (Critical)  
**Owner:** Product / Engineering  

#### Description
Core scheduling engine that computes available time slots based on business hours, staff schedules, service durations, and existing appointments.

#### User Stories
- As a customer, I want to see real-time availability so I can book with confidence.
- As a business owner, I want my availability to update automatically so I don't get overbooked.

#### Acceptance Criteria
- [ ] Generate slots based on: business hours + staff working hours - existing appointments - breaks
- [ ] Slot duration matches selected service duration
- [ ] Buffer time between appointments (configurable, default 0 min)
- [ ] Support for variable service durations (e.g., 30-60 min)
- [ ] Handle multi-staff services (requires 2+ providers)
- [ ] Timezone-aware for businesses and customers
- [ ] Cache computed slots for 30 seconds
- [ ] Precompute next 30 days of availability

#### Technical Notes
- Use interval tree or similar data structure for efficient slot computation
- Background job to precompute and cache availability
- Handle daylight saving time transitions

---

### 4.12 Shared Types & Design System

**Priority:** P1 (High)  
**Owner:** Product / Design / Engineering  

#### Description
Consistent design language and reusable components across the platform.

#### Acceptance Criteria
- [ ] Color palette: primary, secondary, success, warning, error, neutral grays
- [ ] Typography: heading sizes, body text, captions with defined line heights
- [ ] Spacing system: 4px base grid
- [ ] Component library: buttons, inputs, cards, modals, toasts, loaders
- [ ] Icon set: consistent style, 24px default size
- [ ] Animation standards: 200ms default transition, ease-in-out
- [ ] Dark mode support
- [ ] Accessibility: WCAG 2.1 AA minimum, focus states, screen reader labels
- [ ] Shared TypeScript types between frontend and backend

---

### 4.13 Reviews & Ratings

**Priority:** P1 (High)  
**Owner:** Product / Engineering  

#### Description
Customer feedback system for businesses and services.

#### User Stories
- As a customer, I want to read reviews so I can choose quality services.
- As a customer, I want to leave feedback so others can benefit from my experience.

#### Acceptance Criteria
- [ ] 5-star rating with optional text review (min 10, max 1000 chars)
- [ ] Review eligibility: only customers who completed the appointment
- [ ] Review window: 7 days after appointment completion
- [ ] Business owner can respond to reviews
- [ ] Reviews display: rating, date, verified badge, service received
- [ ] Flag inappropriate reviews for moderation
- [ ] Average rating and distribution displayed on business profile
- [ ] Sort reviews: most recent, highest rated, lowest rated

---

### 4.14 Payment Integration

**Priority:** P0 (Critical)  
**Owner:** Product / Engineering  

#### Description
Secure payment processing for appointment bookings with support for multiple payment methods.

#### User Stories
- As a customer, I want to pay securely so my financial information is protected.
- As a business owner, I want to receive payments directly to my account.

#### Acceptance Criteria
- [ ] Payment methods: credit/debit cards, Apple Pay, Google Pay
- [ ] Payment at booking or in-store (business configurable)
- [ ] Full payment or deposit option (business configurable)
- [ ] Automatic receipt emailed to customer
- [ ] Refund processing with business approval for paid bookings
- [ ] Failed payment retry with alternative method
- [ ] PCI compliance — no card data stored on our servers
- [ ] Transaction history in user profile

#### Technical Notes
- Stripe or Adyen for payment processing
- Webhook handling for payment status updates
- Idempotency keys for payment requests

---

### 4.15 Notifications

**Priority:** P1 (High)  
**Owner:** Product / Engineering  

#### Description
Multi-channel notification system for booking updates, reminders, and promotions.

#### User Stories
- As a customer, I want to receive reminders so I don't miss my appointments.
- As a business owner, I want to be notified of new bookings so I can prepare.

#### Acceptance Criteria
- [ ] Channels: push notifications, email, SMS
- [ ] Notification types: booking confirmed, reminder (24h, 1h), cancelled, rescheduled, promotional
- [ ] User preference controls per channel and type
- [ ] Rich push with deep links to relevant screens
- [ ] Notification history in app
- [ ] Batch digest option for non-urgent notifications
- [ ] Delivery tracking and retry for failed notifications

---

### 4.16 Provider / Business Owner Portal

**Priority:** P0 (Critical)  
**Owner:** Product / Engineering  

#### Description
Dedicated web and mobile interface for business owners to manage their presence, services, and operations.

#### User Stories
- As a business owner, I want to set up my business profile so customers can find me.
- As a business owner, I want to manage my services and pricing so they're always current.

#### Acceptance Criteria
- [ ] Business profile: name, description, photos, hours, contact info, social links
- [ ] Service management: add, edit, archive services with pricing and duration
- [ ] Staff management: add team members, set permissions, manage schedules
- [ ] Appointment calendar with full management capabilities
- [ ] Client database with notes, visit history, contact info
- [ ] Analytics dashboard: bookings, revenue, cancellation rate, new vs returning clients
- [ ] Settings: cancellation policy, booking rules, payment settings
- [ ] Multiple location support

---

### 4.17 Admin Dashboard

**Priority:** P1 (High)  
**Owner:** Product / Engineering  

#### Description
Platform administration interface for managing users, businesses, and platform health.

#### User Stories
- As an admin, I want to monitor platform activity so I can ensure smooth operations.
- As an admin, I want to manage business approvals so only legitimate businesses join.

#### Acceptance Criteria
- [ ] User management: search, view, suspend, delete accounts
- [ ] Business verification workflow: pending, approved, rejected, suspended
- [ ] Content moderation: review flagged content, take action
- [ ] Financial overview: transaction volume, revenue, refunds, payouts
- [ ] Support ticket management
- [ ] System health: API metrics, error rates, queue status
- [ ] Role-based access (super admin, support, finance)
- [ ] Audit log of all admin actions

---

### 4.18 Background Jobs (BullMQ)

**Priority:** P1 (High)  
**Owner:** Engineering  

#### Description
Robust job queue system for handling asynchronous tasks reliably.

#### User Stories
- As a developer, I want reliable background processing so the app remains responsive.
- As a business owner, I want timely notifications so my customers are informed.

#### Acceptance Criteria
- [ ] Job types: email sending, push notifications, SMS, payment webhooks, availability precomputation, report generation, data exports
- [ ] Retry logic: 3 attempts with exponential backoff
- [ ] Dead letter queue for failed jobs after retries exhausted
- [ ] Job priority levels: critical, high, normal, low
- [ ] Scheduled jobs with cron expressions
- [ ] Job monitoring: queue depth, processing rate, failure rate
- [ ] Concurrency control per job type
- [ ] Job cancellation and pause capabilities

---

## 5. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | App launch < 2s, API response < 200ms (p95), image load < 1s |
| **Scalability** | Support 10,000 concurrent users, 1M businesses |
| **Security** | OWASP Top 10 compliance, encryption in transit and at rest |
| **Reliability** | 99.9% uptime, graceful degradation |
| **Accessibility** | WCAG 2.1 AA, screen reader support, dynamic text sizing |
| **Localization** | French (default), English, Spanish, German |

## 6. Analytics & Metrics

| Metric | Target | Tracking |
|--------|--------|----------|
| Booking conversion rate | > 15% | Funnel analysis |
| Search to booking | > 10% | Event tracking |
| App retention (D7) | > 30% | Cohort analysis |
| Business activation | > 80% complete profiles | Onboarding funnel |
| NPS | > 50 | In-app survey |

## 7. Release Criteria

- [ ] All P0 features implemented and tested
- [ ] No critical or high bugs open
- [ ] Performance benchmarks met
- [ ] Security audit passed
- [ ] App store guidelines compliance
- [ ] Monitoring and alerting configured

## 8. Appendix

### 8.1 Glossary
- **Slot**: A specific time interval available for booking
- **Buffer**: Time added between appointments
- **No-show**: Customer fails to attend without cancellation

### 8.2 Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2024-01-15 | Alex (PO) | Initial specification |
