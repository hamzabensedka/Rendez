# Planity Clone — Product Specification

## 1. Overview

**Product Name:** Planity Clone  
**Platform:** Web (Responsive) + Mobile (iOS/Android via React Native)  
**Target Audience:** Consumers booking beauty & wellness appointments; Business owners managing salons/spas; Platform administrators  
**MVP Goal:** Enable end-to-end appointment booking between consumers and beauty/wellness businesses with payment processing and business management tools.

---

## 2. Feature Specifications

### 2.1 User Authentication

**Priority:** P0 (Critical)  
**Description:** Secure identity management for consumers, business owners, and admins.

**User Stories:**
- As a user, I want to register with email/password so I can create an account
- As a user, I want to log in with email/password so I can access my account
- As a user, I want to log in with Google/Apple so I can access my account quickly
- As a user, I want to reset my password so I can regain access if I forget it
- As a user, I want to stay logged in via refresh tokens so I don't have to log in repeatedly
- As a user, I want to log out so I can secure my account on shared devices

**Acceptance Criteria:**
- [ ] User can register with email, password, first name, last name, phone number
- [ ] Password must be minimum 8 characters with 1 uppercase, 1 lowercase, 1 number
- [ ] Email verification required before first login
- [ ] OAuth 2.0 integration for Google and Apple sign-in
- [ ] JWT access token (15 min expiry) + refresh token (7 days) rotation
- [ ] Password reset via secure email link (expires in 1 hour)
- [ ] Rate limiting: 5 failed attempts triggers 15-minute lockout
- [ ] Account lockout after 10 failed attempts, requires admin unlock or email verification

**Technical Notes:**
- Use bcrypt with salt rounds 12 for password hashing
- Store refresh tokens hashed in database with device fingerprint
- Implement token blacklisting on logout

---

### 2.2 Guest Browse & Explore

**Priority:** P0 (Critical)  
**Description:** Allow unauthenticated users to browse businesses and services to drive conversion.

**User Stories:**
- As a guest, I want to view featured businesses so I can discover popular salons
- As a guest, I want to browse service categories so I can explore available offerings
- As a guest, I want to search for businesses so I can find relevant providers
- As a guest, I want to view business details so I can evaluate before committing

**Acceptance Criteria:**
- [ ] Guest can access home/landing page with featured content
- [ ] Guest can browse business listings without authentication
- [ ] Guest can search by keyword, location, and category
- [ ] Guest can view business profile, services, and reviews
- [ ] Prompt to sign up appears when attempting to book
- [ ] Guest session data (search filters, viewed businesses) persisted for 24 hours via localStorage

---

### 2.3 Business Search & Discovery

**Priority:** P0 (Critical)  
**Description:** Powerful search and filtering to help users find the right business.

**User Stories:**
- As a user, I want to search by business name so I can find a specific salon
- As a user, I want to filter by service category so I can find relevant businesses
- As a user, I want to filter by price range so I can find services within my budget
- As a user, I want to filter by rating so I can find highly-rated businesses
- As a user, I want to filter by availability so I can find businesses open now
- As a user, I want to sort results by relevance, rating, distance, and price

**Acceptance Criteria:**
- [ ] Full-text search on business name, description, service names
- [ ] Autocomplete suggestions with debounce (300ms)
- [ ] Filter by: category, subcategory, price range (min/max), rating (1-5 stars), open now, accepts online booking
- [ ] Sort options: Best Match (default), Highest Rated, Most Reviewed, Nearest, Price: Low to High, Price: High to Low
- [ ] Search results pagination: 20 items per page
- [ ] Search query execution time < 500ms for 95th percentile
- [ ] Recent searches stored (last 10), clearable by user
- [ ] Search history synced across devices for authenticated users

---

### 2.4 Map-based Search

**Priority:** P1 (High)  
**Description:** Visual location-based discovery of businesses.

**User Stories:**
- As a user, I want to see businesses on a map so I can find nearby options
- As a user, I want to adjust map bounds so I can explore different areas
- As a user, I want to see my current location so I can find businesses near me

**Acceptance Criteria:**
- [ ] Interactive map with business markers (Google Maps or Mapbox)
- [ ] Cluster markers for dense areas (cluster threshold: 5 businesses)
- [ ] Current location detection with permission prompt
- [ ] Map bounds update search results in real-time
- [ ] Marker click shows business card with name, rating, starting price, and photo
- [ ] Toggle between map and list view
- [ ] Default zoom shows businesses within 5km radius
- [ ] Map loads with fallback to default city center if location denied

---

### 2.5 Business Detail View

**Priority:** P0 (Critical)  
**Description:** Comprehensive business profile with all information needed to make booking decision.

**User Stories:**
- As a user, I want to see business photos so I can evaluate the ambiance
- As a user, I want to see business hours so I know when they're open
- As a user, I want to see contact information so I can reach out if needed
- As a user, I want to see the full service menu so I can choose what to book
- As a user, I want to read reviews so I can gauge quality

**Acceptance Criteria:**
- [ ] Hero image gallery (up to 10 images, swipeable on mobile)
- [ ] Business name, verified badge, average rating, total reviews
- [ ] Address with copy-to-clipboard and "Get Directions" link
- [ ] Phone number with click-to-call on mobile
- [ ] Business hours with current day highlighted, "Open Now" indicator
- [ ] Full service menu with category grouping
- [ ] Staff/professional list with photos and specialties
- [ ] Reviews section with pagination (10 per page)
- [ ] "About" section with business description, amenities, languages spoken
- [ ] Social media links (Instagram, Facebook, website)
- [ ] Share business via native share API or copy link

---

### 2.6 Service Categories

**Priority:** P0 (Critical)  
**Description:** Hierarchical categorization of beauty and wellness services.

**User Stories:**
- As a user, I want to browse by category so I can find the type of service I need
- As a business owner, I want to categorize my services so customers can find them

**Acceptance Criteria:**
- [ ] Top-level categories: Hair, Nails, Face, Body, Massage, Makeup, Barber, Spa, Medical Aesthetic, Wellness
- [ ] Subcategories up to 2 levels deep (e.g., Hair > Coloring > Balayage)
- [ ] Category icons and color coding in UI
- [ ] Category-based navigation in search and filtering
- [ ] Business can assign multiple categories to their profile
- [ ] Services belong to exactly one subcategory
- [ ] Category admin managed via CMS; not editable by business owners

---

### 2.7 Booking Flow

**Priority:** P0 (Critical)  
**Description:** Seamless appointment reservation from selection to confirmation.

**User Stories:**
- As a user, I want to select a service so I can book what I need
- As a user, I want to choose a professional so I can book with my preferred staff
- As a user, I want to see available time slots so I can pick a convenient time
- As a user, I want to add optional notes so I can communicate special requests
- As a user, I want to confirm my booking so I can secure my appointment

**Acceptance Criteria:**
- [ ] Step 1: Select service(s) — allow multiple services, show duration and price
- [ ] Step 2: Select professional — "Any available" option or specific staff
- [ ] Step 3: Select date — calendar view with availability indicators
- [ ] Step 4: Select time slot — grid of available slots, grouped by morning/afternoon/evening
- [ ] Step 5: Add notes (optional, max 500 characters)
- [ ] Step 6: Review booking summary with all details
- [ ] Step 7: Payment (if required) or confirm (if free/pay at venue)
- [ ] Booking confirmation screen with booking reference, add to calendar option
- [ ] Booking reference format: BK-YYYYMMDD-XXXXXX (6 random alphanumeric)
- [ ] Time slot holds for 10 minutes during checkout; released if not completed
- [ ] Prevent double-booking via optimistic locking on slot selection

---

### 2.8 Appointment Management

**Priority:** P0 (Critical)  
**Description:** Full lifecycle management of user appointments.

**User Stories:**
- As a user, I want to view my upcoming appointments so I can keep track
- As a user, I want to reschedule my appointment so I can change if needed
- As a user, I want to cancel my appointment so I can free up the slot
- As a user, I want to see my appointment history so I can reference past visits
- As a user, I want to rebook a past service so I can quickly book again

**Acceptance Criteria:**
- [ ] Upcoming appointments list with date, time, business, service, status
- [ ] Appointment detail view with full information and actions
- [ ] Reschedule: select new date/time within availability, same cancellation policy applies
- [ ] Cancel with reason selection (optional): Change of plans, Found better price, Emergency, Other
- [ ] Cancellation policy displayed: free cancellation up to 24 hours before, 50% charge within 24 hours, no refund within 2 hours
- [ ] Past appointments with option to rebook same service
- [ ] No-show flagging after appointment time passes
- [ ] Push and email notifications for upcoming appointments (24h, 2h before)

---

### 2.9 Favorites

**Priority:** P1 (High)  
**Description:** Save and quickly access preferred businesses.

**User Stories:**
- As a user, I want to favorite a business so I can find it easily later
- As a user, I want to view my favorites so I can browse saved businesses
- As a user, I want to remove a favorite so I can keep my list relevant

**Acceptance Criteria:**
- [ ] Heart icon toggle on business card and detail page
- [ ] Favorites list with search and sort (recently added, alphabetical, nearest)
- [ ] Quick book button from favorites list
- [ ] Favorites synced across devices for authenticated users
- [ ] Maximum 500 favorites per user
- [ ] Favorites count displayed on business profile

---

### 2.10 User Profile

**Priority:** P1 (High)  
**Description:** Personal account management and preferences.

**User Stories:**
- As a user, I want to edit my personal information so my profile is accurate
- As a user, I want to manage my payment methods so I can pay conveniently
- As a user, I want to set notification preferences so I control what I receive
- As a user, I want to view my loyalty points/rewards so I can track benefits

**Acceptance Criteria:**
- [ ] Profile photo upload (JPG/PNG, max 5MB, cropped to 400x400)
- [ ] Editable fields: first name, last name, phone number, email (requires re-verification)
- [ ] Saved payment methods list with default selection
- [ ] Notification preferences: email, SMS, push — toggle per type (bookings, promotions, reminders)
- [ ] Delete account option with 30-day grace period and data retention notice
- [ ] Privacy settings: profile visibility, marketing consent
- [ ] Activity log: recent logins, password changes

---

### 2.11 Availability & Slot Computation

**Priority:** P0 (Critical)  
**Description:** Core engine for calculating and managing bookable time slots.

**User Stories:**
- As a business owner, I want to set my working hours so customers can book accordingly
- As a business owner, I want to add breaks and time off so my schedule is accurate
- As a business owner, I want to set service durations so slots are computed correctly
- As a user, I want to see real-time availability so I can book confidently

**Acceptance Criteria:**
- [ ] Weekly recurring schedule: open/close times per day, closed days
- [ ] Exception dates: holidays, special hours, temporary closures
- [ ] Break blocks within day (e.g., lunch break 12:00-13:00)
- [ ] Service duration defines slot granularity; buffer time between appointments configurable
- [ ] Real-time slot availability with < 2 second computation
- [ ] Slot caching with Redis, invalidated on schedule change or booking
- [ ] Overbooking prevention with database-level constraints
- [ ] Support for variable service durations (e.g., 30-60 min range)
- [ ] Timezone handling based on business location

---

### 2.12 Shared Types & Design System

**Priority:** P0 (Critical)  
**Description:** Consistent UI/UX foundation across all platforms.

**User Stories:**
- As a developer, I want reusable components so I can build features efficiently
- As a user, I want consistent interactions so the app feels polished

**Acceptance Criteria:**
- [ ] Color palette: primary (#6C5CE7), secondary (#00B894), success, warning, error, neutral grays
- [ ] Typography: Inter font family, 6 heading levels, body, caption, overline
- [ ] Spacing system: 4px base unit (4, 8, 12, 16, 24, 32, 48, 64)
- [ ] Component library: Button, Input, Select, DatePicker, Modal, Card, Avatar, Badge, Skeleton, Toast
- [ ] Form validation patterns with consistent error messaging
- [ ] Loading states: skeleton screens for content, spinners for actions
- [ ] Empty states for all list views
- [ ] Accessibility: WCAG 2.1 AA compliance, focus management, ARIA labels
- [ ] Dark mode support
- [ ] Shared TypeScript types package between frontend and backend

---

### 2.13 Reviews & Ratings

**Priority:** P1 (High)  
**Description:** Social proof and feedback system for businesses.

**User Stories:**
- As a user, I want to read reviews so I can evaluate businesses
- As a user, I want to leave a review so I can share my experience
- As a business owner, I want to respond to reviews so I can engage with customers

**Acceptance Criteria:**
- [ ] 5-star rating system with half-star precision
- [ ] Review components: overall rating, service-specific rating, text review (10-1000 chars), photos (up to 5)
- [ ] Verified purchase badge for reviews from completed bookings
- [ ] Review eligibility: user must have completed appointment to review
- [ ] Review window: 7 days after appointment to leave review
- [ ] Business owner response within 30 days of review
- [ ] Report inappropriate review functionality
- [ ] Review helpfulness voting
- [ ] Average rating recalculated in real-time; cached for performance
- [ ] Sort reviews by: most relevant, newest, highest/lowest rating

---

### 2.14 Payment Integration

**Priority:** P0 (Critical)  
**Description:** Secure processing of payments for appointments.

**User Stories:**
- As a user, I want to pay securely so I can confirm my booking
- As a user, I want to save my card so I can checkout faster next time
- As a business owner, I want to receive payouts so I can get paid for services
- As a user, I want to receive refunds so I'm protected if I cancel appropriately

**Acceptance Criteria:**
- [ ] Stripe integration for payment processing
- [ ] Supported methods: credit/debit cards, Apple Pay, Google Pay
- [ ] PCI compliance via Stripe Elements (no raw card data touches servers)
- [ ] Payment intent created at booking initiation, confirmed on slot confirmation
- [ ] Saved payment methods with customer ID in Stripe
- [ ] Payout to business owners: weekly transfers to connected account
- [ ] Platform fee: 2.5% + $0.30 per transaction
- [ ] Full refund within cancellation policy; partial refund per policy terms
- [ ] Payment receipt emailed with invoice PDF
- [ ] Failed payment handling with retry logic (3 attempts, 24h apart)

---

### 2.15 Notifications

**Priority:** P1 (High)  
**Description:** Multi-channel communication for booking lifecycle events.

**User Stories:**
- As a user, I want to receive booking confirmations so I know my appointment is set
- As a user, I want reminders so I don't forget my appointment
- As a business owner, I want to be notified of new bookings so I can prepare

**Acceptance Criteria:**
- [ ] Channels: Email (SendGrid), SMS (Twilio), Push (Firebase Cloud Messaging)
- [ ] Triggered events: booking confirmed, booking rescheduled, booking cancelled, appointment reminder (24h, 2h), review request (post-appointment), payment received, payment failed
- [ ] User preference controls for each channel and event type
- [ ] Notification templates with business branding
- [ ] Delivery tracking and failure handling with retry
- [ ] Unsubscribe compliance for marketing communications
- [ ] In-app notification center with read/unread status

---

### 2.16 Provider / Business Owner Portal

**Priority:** P0 (Critical)  
**Description:** Comprehensive business management interface.

**User Stories:**
- As a business owner, I want to manage my business profile so customers see accurate info
- As a business owner, I want to manage my services so customers know what I offer
- As a business owner, I want to view and manage bookings so I can run my schedule
- As a business owner, I want to manage my staff so I can coordinate my team
- As a business owner, I want to see analytics so I can understand my performance

**Acceptance Criteria:**
- [ ] Dashboard: upcoming appointments today, revenue this week, new reviews, quick actions
- [ ] Business profile editor: all fields from detail view editable
- [ ] Service management: CRUD services, pricing, duration, category assignment, availability
- [ ] Staff management: add staff profiles, assign services, set individual schedules
- [ ] Booking calendar: day/week/month views, drag-to-reschedule, color-coded by status
- [ ] Booking actions: confirm, reschedule, cancel, mark no-show, mark complete
- [ ] Customer list with visit history and notes
- [ ] Analytics: revenue trends, booking volume, cancellation rate, popular services, customer retention
- [ ] Export data: bookings CSV, customer list CSV
- [ ] Multiple business locations support with location switching

---

### 2.17 Admin Dashboard

**Priority:** P1 (High)  
**Description:** Platform administration and oversight.

**User Stories:**
- As an admin, I want to manage businesses so I can onboard and support them
- As an admin, I want to manage users so I can handle support issues
- As an admin, I want to view platform analytics so I can monitor health
- As an admin, I want to manage categories so the taxonomy stays organized

**Acceptance Criteria:**
- [ ] Business management: list, search, approve/reject onboarding, suspend/activate, view details
- [ ] User management: list, search, view activity, suspend/activate, impersonate for support
- [ ] Category management: CRUD categories and subcategories, reorder, assign icons
- [ ] Booking oversight: search all bookings, view details, intervene if needed
- [ ] Financial dashboard: platform revenue, payouts pending, transaction volume, fees collected
- [ ] Content moderation: review flagged reviews, handle disputes
- [ ] System health: API metrics, error rates, queue depths
- [ ] Role-based access: super admin, support agent, finance viewer
- [ ] Audit log of all admin actions

---

### 2.18 Background Jobs (BullMQ)

**Priority:** P1 (High)  
**Description:** Reliable asynchronous job processing.

**User Stories:**
- As a developer, I want reliable job processing so critical operations don't fail silently
- As a user, I want timely notifications so I'm informed of updates
- As a business owner, I want automated reports so I can track performance

**Acceptance Criteria:**
- [ ] Job queues: notifications (email, SMS, push), payment processing, report generation, data exports, search index updates, image processing, cleanup tasks
- [ ] Retry policy: 3 attempts with exponential backoff (5s, 25s, 125s)
- [ ] Dead letter queue for failed jobs after retries exhausted
- [ ] Job priority levels: critical (payment), high (notifications), normal (reports), low (cleanup)
- [ ] Job monitoring dashboard: queue lengths, processing rates, failed jobs, retry actions
- [ ] Scheduled jobs: daily reports at 6 AM, weekly summary on Mondays, monthly billing on 1st
- [ ] Job idempotency keys to prevent duplicate processing
- [ ] Redis-backed with BullMQ; horizontal scaling support

---

## 3. Non-Functional Requirements

### Performance
- Page load time < 3 seconds on 4G
- API response time < 200ms for 95th percentile (cached reads)
- Support 10,000 concurrent users
- Image optimization: WebP with JPEG fallback, lazy loading

### Security
- HTTPS everywhere
- OWASP Top 10 mitigation
- Rate limiting on all public endpoints
- Data encryption at rest (AES-256)
- GDPR compliance: data export, right to erasure

### Reliability
- 99.9% uptime SLA
- Database backups: daily full, point-in-time recovery
- Graceful degradation: core features work offline with sync on reconnect

---

## 4. Success Metrics

| Metric | Target |
|--------|--------|
| Monthly Active Users (MAU) | 50,000 by month 6 |
| Booking Conversion Rate | > 15% of app opens |
| Search to Booking | < 3 sessions |
| Business Onboarded | 500 by month 6 |
| App Store Rating | > 4.5 stars |
| Customer Support Tickets | < 2% of bookings |

---

## 5. Release Phases

### Phase 1 — MVP (Weeks 1-8)
User Authentication, Guest Browse, Business Search & Discovery, Business Detail View, Service Categories, Booking Flow, Appointment Management, Availability & Slot Computation, Shared Types & Design System, Basic Business Owner Portal

### Phase 2 — Growth (Weeks 9-14)
Map-based Search, Favorites, User Profile, Reviews & Ratings, Payment Integration, Notifications, Enhanced Business Owner Portal

### Phase 3 — Scale (Weeks 15-20)
Admin Dashboard, Background Jobs, Advanced Analytics, Loyalty Program, Referral System, Multi-language Support

---

*Document Version: 1.0*  
*Last Updated: 2024*  
*Owner: Product Team*