# Planity Clone — Product Specification

## 1. Overview

**Product Name:** Planity Clone  
**Platform:** Web (Responsive), iOS, Android  
**Target Audience:** Consumers seeking beauty & wellness appointments; Business owners managing bookings  
**MVP Goal:** Enable seamless discovery, booking, and management of beauty/wellness appointments.

---

## 2. Feature List & Priorities

| # | Feature | Priority | Status |
|---|---------|----------|--------|
| 1 | User Authentication | P0 | Required |
| 2 | Guest Browse & Explore | P0 | Required |
| 3 | Business Search & Discovery | P0 | Required |
| 4 | Map-based Search | P0 | Required |
| 5 | Business Detail View | P0 | Required |
| 6 | Service Categories | P0 | Required |
| 7 | Booking Flow | P0 | Required |
| 8 | Appointment Management | P0 | Required |
| 9 | Favorites | P1 | Required |
| 10 | User Profile | P1 | Required |
| 11 | Availability & Slot Computation | P0 | Required |
| 12 | Shared Types & Design System | P0 | Required |
| 13 | Reviews & Ratings | P1 | Required |
| 14 | Payment Integration | P0 | Required |
| 15 | Notifications | P1 | Required |
| 16 | Provider / Business Owner Portal | P0 | Required |
| 17 | Admin Dashboard | P2 | Required |
| 18 | Background Jobs (BullMQ) | P1 | Required |

---

## 3. Feature Specifications

### 3.1 User Authentication

**Description:** Secure user registration, login, and session management for both customers and business owners.

**User Stories:**
- As a new user, I want to register with email/password or social accounts so I can create an account quickly.
- As a returning user, I want to log in securely so I can access my bookings and profile.
- As a user, I want to reset my password so I can recover access if I forget it.
- As a business owner, I want to register my business so I can start receiving bookings.

**Acceptance Criteria:**
- [ ] Users can register with email, password, first name, last name, and phone number
- [ ] Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number
- [ ] Users can register/login via Google OAuth and Apple Sign-In
- [ ] JWT tokens are issued with 15-minute access and 7-day refresh expiry
- [ ] Users can request password reset via email with secure token (expires in 1 hour)
- [ ] Business owners can register with additional fields: business name, SIRET/tax ID, address
- [ ] Role-based access control (customer, business_owner, admin) is enforced
- [ ] Rate limiting: 5 login attempts per 15 minutes per IP

**API Endpoints:**
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/oauth/google`
- `POST /auth/oauth/apple`

---

### 3.2 Guest Browse & Explore

**Description:** Allow unauthenticated users to browse businesses, services, and availability without creating an account.

**User Stories:**
- As a guest, I want to browse businesses without logging in so I can explore before committing.
- As a guest, I want to view business details and services so I can evaluate options.
- As a guest, I want to see pricing and availability so I can make informed decisions.

**Acceptance Criteria:**
- [ ] Guest users can access search, categories, and business listings without authentication
- [ ] Guest users can view business profiles, services, and reviews
- [ ] Guest users can view real-time availability (read-only)
- [ ] Booking action prompts login/signup modal
- [ ] Guest session data (favorites, search filters) is persisted for 30 days via localStorage/cookies
- [ ] Upon registration, guest data merges into authenticated account

---

### 3.3 Business Search & Discovery

**Description:** Powerful search and filtering to help users find the right business for their needs.

**User Stories:**
- As a user, I want to search by business name, service, or location so I can find relevant results.
- As a user, I want to filter by price, rating, distance, and availability so I can narrow options.
- As a user, I want to see search results with key info at a glance so I can compare quickly.

**Acceptance Criteria:**
- [ ] Full-text search across business name, service names, and descriptions
- [ ] Filters: price range (min/max), rating (1-5 stars), distance (km/miles), category, availability date
- [ ] Sort options: relevance, rating, price (low to high), distance
- [ ] Pagination with 20 results per page, infinite scroll on mobile
- [ ] Search results display: business photo, name, rating, starting price, distance, next available slot
- [ ] Recent searches stored (max 10), clearable by user
- [ ] Search autocomplete with suggestions after 3 characters
- [ ] Search response time < 500ms for cached results, < 2s for fresh queries

---

### 3.4 Map-based Search

**Description:** Visual map interface showing business locations with interactive pins and clustering.

**User Stories:**
- As a user, I want to see businesses on a map so I can choose by location.
- As a user, I want to click map pins to see quick business info so I can preview without leaving the map.
- As a user, I want the map to update as I pan/zoom so results stay relevant to my view.

**Acceptance Criteria:**
- [ ] Interactive map using Mapbox/Google Maps with custom styling
- [ ] Business pins clustered at zoom levels > 10, individual pins at <= 10
- [ ] Pin click opens card with: photo, name, rating, starting price, "View" button
- [ ] Map bounds filter search results in real-time (debounced 300ms)
- [ ] User location detection with permission prompt
- [ ] Default map center: user location or city center if location unavailable
- [ ] List view toggle: split screen (map + list) on desktop, full map or full list on mobile
- [ ] Map loads with max 100 visible pins; load more on zoom/pan

---

### 3.5 Business Detail View

**Description:** Comprehensive business profile page with all information needed to make a booking decision.

**User Stories:**
- As a user, I want to see business photos, description, and services so I can evaluate fit.
- As a user, I want to see staff/professionals so I can choose who provides my service.
- As a user, I want to see opening hours and location details so I can plan my visit.

**Acceptance Criteria:**
- [ ] Hero image gallery (up to 10 images), swipeable on mobile
- [ ] Business info: name, rating, review count, address, phone, website link
- [ ] Opening hours with current day highlighted, "Open Now" / "Closed" indicator
- [ ] Services list with: name, duration, price, description, book button
- [ ] Staff/professionals section with photos, names, specialties, ratings
- [ ] Reviews summary (average, distribution) with top 3 reviews visible, "See all" link
- [ ] Location map embed with directions link
- [ ] Share button (copy link, native share on mobile)
- [ ] "Add to Favorites" button (requires auth, prompts guest)

---

### 3.6 Service Categories

**Description:** Hierarchical categorization of services for easy browsing and discovery.

**User Stories:**
- As a user, I want to browse by category so I can find the type of service I need.
- As a business owner, I want to assign categories to my services so customers can find them.

**Acceptance Criteria:**
- [ ] Predefined category tree: Beauty > Hair, Nails, Face, Body; Wellness > Massage, Spa, Fitness
- [ ] Category icons and colors defined in design system
- [ ] Services can have 1 primary category and up to 2 secondary categories
- [ ] Category pages show featured businesses, trending services, and subcategory filters
- [ ] Category badges displayed on business cards and detail pages
- [ ] Admin can add/edit categories; changes reflect immediately (cache invalidation)

---

### 3.7 Booking Flow

**Description:** Streamlined multi-step booking process from service selection to confirmation.

**User Stories:**
- As a user, I want to select a service, professional, and time slot so I can book an appointment.
- As a user, I want to see my booking summary before confirming so I can verify details.
- As a user, I want to receive immediate confirmation so I know my booking is secured.

**Acceptance Criteria:**
- [ ] Step 1: Select service (or package/bundle if applicable)
- [ ] Step 2: Select professional (or "No preference" for any available)
- [ ] Step 3: Select date and time slot from computed availability
- [ ] Step 4: Review booking summary (service, professional, date/time, price, business address)
- [ ] Step 5: Enter payment method (or select saved method) and confirm
- [ ] Real-time slot availability with optimistic locking (hold slot for 10 minutes during checkout)
- [ ] Booking confirmation page with add-to-calendar (ICS download, Google/Apple Calendar)
- [ ] Confirmation email and push notification sent within 30 seconds
- [ ] Failed payment releases slot hold immediately
- [ ] Guest checkout supported with email/phone collection; account creation offered post-booking

**States:**
- `PENDING_PAYMENT` → `CONFIRMED` (payment success) → `COMPLETED` (post-appointment)
- `PENDING_PAYMENT` → `CANCELLED` (payment failure or timeout)
- `CONFIRMED` → `CANCELLED` (user or business cancellation)

---

### 3.8 Appointment Management

**Description:** Users and business owners can view, modify, and cancel appointments.

**User Stories:**
- As a user, I want to see my upcoming and past appointments so I can manage my schedule.
- As a user, I want to reschedule or cancel my appointment so I can adapt to changes.
- As a business owner, I want to see all bookings for my business so I can manage operations.

**Acceptance Criteria:**
- [ ] User appointment list: upcoming (sorted by date), past (last 12 months), cancelled
- [ ] Appointment card shows: business name, service, professional, date/time, status, price
- [ ] Reschedule: select new slot from available times, subject to business cancellation policy
- [ ] Cancel: user can cancel up to business policy deadline (default 24h before), with refund per policy
- [ ] Business owner sees calendar view (day/week/month) with all appointments
- [ ] Business owner can: view details, mark no-show, add notes, reschedule, or cancel with customer notification
- [ ] Cancellation policy displayed at booking and in confirmation (flexible, moderate, strict)
- [ ] Push, email, and SMS notifications for all status changes

---

### 3.9 Favorites

**Description:** Users can save businesses to a personal favorites list for quick access.

**User Stories:**
- As a user, I want to save my favorite businesses so I can book them again easily.
- As a user, I want to see my favorites list so I can quickly access preferred businesses.

**Acceptance Criteria:**
- [ ] Heart icon on business cards and detail pages toggles favorite status
- [ ] Favorites list accessible from user profile, sorted by recently added
- [ ] Favorites persist across devices for authenticated users
- [ ] Guest favorites stored locally with merge prompt on login
- [ ] Maximum 200 favorites per user
- [ ] Option to remove from favorites with confirmation

---

### 3.10 User Profile

**Description:** Personal profile management for customers and business owners.

**User Stories:**
- As a user, I want to manage my personal information so my bookings are accurate.
- As a user, I want to manage my payment methods so checkout is faster.
- As a user, I want to set my preferences so the app is personalized.

**Acceptance Criteria:**
- [ ] Profile fields: first name, last name, email, phone, profile photo, date of birth (optional)
- [ ] Email and phone verification badges
- [ ] Saved payment methods (Stripe PaymentMethod objects), default payment method selection
- [ ] Notification preferences: email, push, SMS — per event type (bookings, promotions, reminders)
- [ ] Privacy settings: profile visibility (public, friends, private), data download request, account deletion
- [ ] Booking history with invoice/receipt download (PDF)
- [ ] Loyalty/points display (if applicable)

---

### 3.11 Availability & Slot Computation

**Description:** Core engine for calculating real-time available booking slots based on business rules, staff schedules, and existing bookings.

**User Stories:**
- As a business owner, I want to set my availability so customers can book during open times.
- As a business owner, I want to block time off so no bookings can be made.
- As a user, I want to see accurate availability so I can book confidently.

**Acceptance Criteria:**
- [ ] Business sets weekly recurring schedule with open/close times per day
- [ ] Exception dates for holidays, closures, modified hours
- [ ] Staff-specific schedules override business default
- [ ] Service duration defines slot granularity; buffer time between appointments configurable
- [ ] Slot computation accounts for: existing bookings, staff breaks, staff unavailability
- [ ] Real-time slot query API with < 200ms response (cached, stale-while-revalidate)
- [ ] Timezone handling: all times stored in UTC, displayed in business timezone
- [ ] Support for split shifts (e.g., 9am-12pm, 2pm-6pm)
- [ ] Buffer before/after appointments configurable per service

---

### 3.12 Shared Types & Design System

**Description:** Consistent design language, component library, and type definitions across all platforms.

**User Stories:**
- As a developer, I want reusable components so I can build features quickly and consistently.
- As a user, I want a consistent experience across web and mobile.

**Acceptance Criteria:**
- [ ] Design tokens: colors (primary, secondary, semantic), typography (font families, sizes, weights), spacing scale, border radius, shadows
- [ ] Component library: Button, Input, Select, DatePicker, TimeSlotGrid, Card, Modal, Toast, Skeleton, Avatar, Badge, RatingStars
- [ ] Shared TypeScript types published as `@planity-clone/types` package
- [ ] Core types: User, Business, Service, Professional, Appointment, AvailabilitySlot, Review, Payment, Notification
- [ ] Responsive breakpoints: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)
- [ ] Dark mode support with system preference detection and manual toggle
- [ ] Accessibility: WCAG 2.1 AA compliance, keyboard navigation, screen reader labels, focus management
- [ ] Animation standards: 200ms transitions, reduced motion respect

---

### 3.13 Reviews & Ratings

**Description:** Customer feedback system for businesses and professionals.

**User Stories:**
- As a user, I want to read reviews so I can choose quality services.
- As a user, I want to leave a review after my appointment so I can share my experience.
- As a business owner, I want to respond to reviews so I can engage with customers.

**Acceptance Criteria:**
- [ ] 5-star rating with optional text review (10-1000 characters)
- [ ] Review eligibility: only verified customers who completed the appointment
- [ ] Review prompt sent 24 hours after appointment completion
- [ ] Reviews display: rating, text, date, customer name (first name + initial), verified badge
- [ ] Business owner can respond once per review; response is public
- [ ] Review sorting: most helpful, newest, highest/lowest rating
- [ ] Flag/report review for moderation; admin dashboard for review management
- [ ] Average rating and review count displayed on business card and detail page
- [ ] Reviews are immutable after 48 hours (edit window); deletion by user or admin only

---

### 3.14 Payment Integration

**Description:** Secure payment processing for bookings with support for multiple methods and refund handling.

**User Stories:**
- As a user, I want to pay securely so my booking is confirmed.
- As a user, I want to save my payment method so future checkouts are faster.
- As a business owner, I want to receive payouts so I am compensated for services.

**Acceptance Criteria:**
- [ ] Stripe integration for payment processing
- [ ] Supported methods: credit/debit cards (Visa, MC, Amex), Apple Pay, Google Pay
- [ ] PaymentIntent created at checkout start, confirmed on slot confirmation
- [ ] 3D Secure support for card authentication
- [ ] Saved payment methods with Stripe Customer objects
- [ ] Refund processing: full refund (within policy), partial refund (business discretion), no refund (past deadline)
- [ ] Payouts to business owners via Stripe Connect (Express accounts)
- [ ] Platform fee: 2.5% + €0.25 per transaction (configurable)
- [ ] Invoice generation with VAT/tax details
- [ ] Webhook handling for payment events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
- [ ] Idempotency keys on all payment API calls

---

### 3.15 Notifications

**Description:** Multi-channel notification system for booking events, reminders, and promotions.

**User Stories:**
- As a user, I want to receive booking confirmations so I know my appointment is set.
- As a user, I want appointment reminders so I don't forget.
- As a business owner, I want to be notified of new bookings so I can prepare.

**Acceptance Criteria:**
- [ ] Channels: push (Firebase Cloud Messaging), email (SendGrid), SMS (Twilio)
- [ ] Notification types: booking confirmation, reminder (24h, 2h before), cancellation, reschedule, review request, promotion
- [ ] User preference controls per channel and type
- [ ] Notification templates with dynamic content injection
- [ ] Delivery tracking: sent, delivered, opened (push/email)
- [ ] Retry logic for failed deliveries (3 attempts, exponential backoff)
- [ ] In-app notification center with read/unread status
- [ ] Quiet hours: no push notifications 10pm-8am user local time

---

### 3.16 Provider / Business Owner Portal

**Description:** Dedicated interface for business owners to manage their business profile, services, staff, and bookings.

**User Stories:**
- As a business owner, I want to set up my business profile so customers can find me.
- As a business owner, I want to manage my services and pricing so my offerings are current.
- As a business owner, I want to view and manage bookings so my schedule is organized.

**Acceptance Criteria:**
- [ ] Business profile: name, description, photos (logo, cover, gallery), contact info, social links
- [ ] Service management: CRUD services with name, description, duration, price, category, buffer time
- [ ] Staff management: add professionals with names, photos, bio, specialties, individual schedules
- [ ] Availability calendar: set weekly hours, exceptions, time off
- [ ] Booking calendar: day/week/month views, filter by staff, status
- [ ] Booking actions: confirm, reschedule, cancel, mark complete, mark no-show
- [ ] Customer notes: add private notes per customer
- [ ] Analytics dashboard: bookings per day/week/month, revenue, cancellation rate, top services
- [ ] Payout settings: bank account, payout schedule (daily, weekly, monthly)
- [ ] Subscription management: plan tier, billing cycle, upgrade/downgrade

---

### 3.17 Admin Dashboard

**Description:** Internal tool for platform administrators to manage users, businesses, content, and system health.

**User Stories:**
- As an admin, I want to manage user accounts so I can handle support issues.
- As an admin, I want to moderate business listings so quality is maintained.
- As an admin, I want to view platform metrics so I can monitor growth.

**Acceptance Criteria:**
- [ ] User management: search, view, suspend, delete accounts; impersonate for support
- [ ] Business management: approve/reject new registrations, edit listings, suspend/close accounts
- [ ] Content moderation: review flagged reviews, photos, business descriptions; approve/remove
- [ ] Financial overview: total GMV, revenue, payouts pending, refunds processed
- [ ] Analytics: MAU, DAU, booking conversion funnel, churn rate, top categories/cities
- [ ] System health: API latency, error rates, queue depths, database performance
- [ ] Audit log: all admin actions with timestamp, admin ID, before/after state
- [ ] Role-based access: super_admin, admin, support_agent with granular permissions

---

### 3.18 Background Jobs (BullMQ)

**Description:** Asynchronous job processing for notifications, reports, data processing, and integrations.

**User Stories:**
- As a developer, I want reliable job processing so critical tasks don't block user requests.
- As a business owner, I want automated reports so I can track performance.

**Acceptance Criteria:**
- [ ] BullMQ with Redis for job queuing
- [ ] Queues defined: `notifications`, `emails`, `payments`, `reports`, `search-index`, `analytics`
- [ ] Job types and priorities:
  - **notifications**: booking confirmations (high), reminders (medium), marketing (low)
  - **emails**: transactional (high), digest (low)
  - **payments**: payout processing (high), refund processing (high)
  - **reports**: daily business summary (low), weekly platform analytics (low)
  - **search-index**: business/service index updates (medium)
  - **analytics**: event aggregation (low)
- [ ] Retry policy: 3 attempts for standard jobs, 5 for payments, dead-letter queue after exhaustion
- [ ] Job scheduling: cron-based for recurring reports, reminders
- [ ] Job monitoring: dashboard with queue lengths, processing rates, failed jobs, retry controls
- [ ] Rate limiting: max 100 emails/minute per business, 1000 SMS/day per account
- [ ] Idempotency: duplicate job detection via unique job IDs

---

## 4. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | API p95 latency < 500ms; page load < 2s; TTI < 3s |
| Scalability | Support 10k concurrent users; 100k bookings/day |
| Security | OWASP Top 10 mitigation; encryption at rest and in transit; SOC 2 compliance roadmap |
| Availability | 99.9% uptime SLA; automated failover; daily backups |
| Compliance | GDPR (EU), CCPA (US); data retention policies; right to erasure |
| Localization | French (default), English, Spanish, German; EUR, USD, GBP currency support |

---

## 5. Success Metrics (KPIs)

| Metric | Target |
|--------|--------|
| Monthly Active Users (MAU) | 50,000 by month 6 |
| Booking Conversion Rate | > 15% (search to booking) |
| User Retention (30-day) | > 40% |
| Average Booking Value | €50 |
| Business Owner NPS | > 50 |
| Customer NPS | > 60 |
| App Store Rating | > 4.5 stars |

---

## 6. Release Plan

| Phase | Features | Timeline |
|-------|----------|----------|
| Alpha | Auth, Guest Browse, Search, Business Detail, Categories, Booking Flow, Availability | Week 1-4 |
| Beta | Payment, Appointment Mgmt, Favorites, Profile, Reviews, Notifications | Week 5-8 |
| v1.0 | Provider Portal, Background Jobs, Admin Dashboard | Week 9-12 |
| v1.1 | Map Search, Analytics, Loyalty Program | Week 13-16 |

---

*Document Version: 1.0*  
*Last Updated: 2024*  
*Owner: Alex (Product Owner)*
