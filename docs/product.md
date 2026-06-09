# Planity Clone — Product Specification

## 1. Overview

**Product Name:** Planity Clone  
**Description:** A mobile-first platform connecting customers with beauty & wellness businesses for appointment booking, discovery, and management.  
**Target Platforms:** iOS, Android (React Native), Web (Next.js)  
**Primary Users:** Consumers seeking beauty/wellness services, Business Owners, Platform Admins  

---

## 2. Feature Specifications

### 2.1 User Authentication

**Priority:** P0 (Critical)  
**Description:** Secure, multi-method authentication enabling users to create accounts, log in, and manage sessions across devices.

**User Stories:**
- As a new user, I want to register with email/phone so I can create an account quickly
- As a returning user, I want to log in with my preferred method so I can access my bookings
- As a security-conscious user, I want optional 2FA so my account is protected
- As a user, I want to reset my password so I can recover access if forgotten

**Acceptance Criteria:**
- [ ] Users can register via email + password, phone + OTP, or OAuth (Google, Apple, Facebook)
- [ ] Passwords must be minimum 8 characters with 1 uppercase, 1 number, 1 special character
- [ ] JWT tokens issued with 7-day access / 30-day refresh lifecycle
- [ ] Biometric login (Face ID / Touch ID / Fingerprint) available on supported devices
- [ ] Account lockout after 5 failed attempts with 30-minute cooldown
- [ ] Email verification required before first booking
- [ ] Users can log out from all devices
- [ ] Guest checkout flow preserves cart data upon registration

**Technical Notes:**
- Use Firebase Auth or Auth0 for identity management
- Store refresh tokens hashed in database
- Implement token rotation on refresh

---

### 2.2 Guest Browse & Explore

**Priority:** P0 (Critical)  
**Description:** Unauthenticated users can browse businesses, services, and availability to reduce friction and drive conversion.

**User Stories:**
- As a guest, I want to browse businesses without creating an account so I can evaluate the platform
- As a guest, I want to see service prices and availability so I can make informed decisions
- As a guest, I want my search filters to persist so I don't lose context when I decide to register

**Acceptance Criteria:**
- [ ] All business listings visible without login
- [ ] Service catalogs, prices, and descriptions fully accessible
- [ ] Real-time availability shown for next 14 days
- [ ] Search, filter, and sort functionality fully functional for guests
- [ ] "Book Now" CTA prompts registration with pre-filled context
- [ ] Guest session data (favorites, filters, cart) retained for 7 days via localStorage/device ID
- [ ] Prompt to create account appears after 3rd business view or on booking attempt

**Technical Notes:**
- Track guest sessions via anonymous ID
- Merge guest data upon registration
- Rate-limit guest API requests to prevent scraping

---

### 2.3 Business Search & Discovery

**Priority:** P0 (Critical)  
**Description:** Powerful search and discovery tools to help users find the right business for their needs.

**User Stories:**
- As a user, I want to search by business name, service, or location so I can find relevant results quickly
- As a user, I want to filter by price, rating, distance, and availability so I can narrow options
- As a user, I want to see trending and recommended businesses so I discover new places

**Acceptance Criteria:**
- [ ] Full-text search across business names, services, descriptions, and tags
- [ ] Autocomplete suggestions with typo tolerance (fuzzy matching)
- [ ] Filters: distance (1-50km), price range, rating (1-5 stars), availability (today, this week), service category, amenities
- [ ] Sort options: relevance, distance, rating, price (low-high, high-low), most reviewed
- [ ] "Near Me" uses GPS with fallback to IP geolocation
- [ ] Search results display: photo, name, rating, distance, price range, next available slot
- [ ] Empty state with suggestions when no results found
- [ ] Recent searches persisted per user (last 10)
- [ ] Personalized recommendations based on booking history and favorites

**Technical Notes:**
- Implement with Elasticsearch or PostgreSQL full-text search
- Cache popular search results for 5 minutes
- Log search queries for analytics and autocomplete optimization

---

### 2.4 Map-based Search

**Priority:** P0 (Critical)  
**Description:** Visual map interface for geographic discovery of businesses.

**User Stories:**
- As a user, I want to see businesses on a map so I understand their locations visually
- As a user, I want to pan and zoom the map to explore different areas
- As a user, I want to see business details from map pins so I can compare options

**Acceptance Criteria:**
- [ ] Interactive map (Google Maps / Mapbox) with business markers
- [ ] Cluster markers for dense areas (group when zoomed out)
- [ ] Marker color indicates category or availability status
- [ ] Tapping marker opens bottom sheet with: photo, name, rating, address, next availability, price range
- [ ] "Directions" button opens native maps app with pre-filled destination
- [ ] Map and list views toggleable with synchronized state
- [ ] User location dot with accuracy ring
- [ ] Search this area" button appears after map movement
- [ ] Default zoom level shows businesses within 5km radius

**Technical Notes:**
- Debounce map movement events (300ms)
- Fetch markers via viewport-bounded API query
- Cache tile data aggressively

---

### 2.5 Business Detail View

**Priority:** P0 (Critical)  
**Description:** Comprehensive business profile page with all information needed to make a booking decision.

**User Stories:**
- As a user, I want to see photos, descriptions, and credentials so I trust the business
- As a user, I want to browse all services with prices so I can choose what I need
- As a user, I want to see staff profiles so I can select my preferred provider

**Acceptance Criteria:**
- [ ] Hero image carousel (up to 10 photos), video support
- [ ] Business info: name, verified badge, category, address, phone, website, social links
- [ ] Business hours with "Open Now" / "Closes at" / "Closed" status
- [ ] Average rating with breakdown by star (histogram)
- [ ] Services tab: list with name, duration, description, price, "Book" CTA
- [ ] Staff tab: photos, bios, specialties, average rating per staff member
- [ ] Reviews tab: sortable (newest, highest, lowest), paginated (10 per page)
- [ ] About tab: business description, amenities list, COVID/safety protocols, parking info
- [ ] "Call" and "Get Directions" prominent buttons
- [ ] Share business via native share sheet / copy link
- [ ] Similar businesses carousel at bottom

**Technical Notes:**
- Lazy-load images with blur placeholder
- Preload critical data for instant navigation from search

---

### 2.6 Service Categories

**Priority:** P0 (Critical)  
**Description:** Hierarchical categorization system for organizing and discovering services.

**User Stories:**
- As a user, I want to browse by category so I can find relevant services intuitively
- As a business owner, I want to categorize my services so customers find them easily
- As a platform, we want consistent categorization for search and analytics

**Acceptance Criteria:**
- [ ] Two-level hierarchy: Category (e.g., Hair, Nails, Massage) → Subcategory (e.g., Haircut, Coloring, Styling)
- [ ] 15+ top-level categories with icons
- [ ] Category landing pages with featured businesses and popular services
- [ ] Services can belong to multiple categories (many-to-many)
- [ ] Category-based filtering in search and browse
- [ ] Trending categories surfaced on home screen
- [ ] Admin-managed category taxonomy with ability to add/edit/deprecate

**Categories (v1):**
- Hair (Cut, Coloring, Styling, Treatments, Extensions)
- Nails (Manicure, Pedicure, Nail Art, Gel, Acrylic)
- Face (Facials, Makeup, Eyebrows, Lashes, Waxing)
- Body (Massage, Hair Removal, Tanning, Spa Treatments)
- Wellness (Yoga, Pilates, Meditation, Nutrition)
- Medical Aesthetic (Botox, Fillers, Laser, Dermatology)
- Fitness (Personal Training, Classes, Gym Access)
- Tattoos & Piercings
- Barbershop

---

### 2.7 Booking Flow

**Priority:** P0 (Critical)  
**Description:** Seamless, multi-step booking process from service selection to confirmation.

**User Stories:**
- As a user, I want to book an appointment in minimal steps so I can secure my slot quickly
- As a user, I want to see real-time availability so I know what's actually bookable
- As a user, I want to add notes or preferences so the business can prepare

**Acceptance Criteria:**
- [ ] Step 1: Select service(s) — allow multiple services, show total duration/price
- [ ] Step 2: Select staff member or "No preference" / "First available"
- [ ] Step 3: Select date (calendar view) and time slot (horizontal scroll or grid)
- [ ] Step 4: Review booking summary with edit capability
- [ ] Step 5: Add notes, apply promo code, select payment method
- [ ] Step 6: Confirm booking — hold slot for 5 minutes during payment
- [ ] Confirmation screen with: booking reference, add to calendar, share, directions
- [ ] Booking reference: 8-character alphanumeric, unique
- [ ] Support for recurring bookings (weekly, bi-weekly, monthly)
- [ ] Group booking: book for multiple people
- [ ] Waitlist option when no slots available (notify when opens up)

**Slot Selection UX:**
- Default to next 3 available days
- Morning / Afternoon / Evening quick filters
- Show slot as "Popular" or "Last available" when relevant
- Gray out past slots, holidays, and blocked times

**Technical Notes:**
- Slot computation engine (see 2.11)
- Optimistic UI with rollback on failure
- Idempotency key on booking creation to prevent duplicates

---

### 2.8 Appointment Management

**Priority:** P0 (Critical)  
**Description:** Full lifecycle management of appointments for both customers and businesses.

**User Stories (Customer):**
- As a customer, I want to view my upcoming appointments so I can plan my schedule
- As a customer, I want to reschedule or cancel so I can adapt to changes
- As a customer, I want to receive reminders so I don't miss appointments

**Acceptance Criteria (Customer):**
- [ ] Upcoming appointments list with: business photo, name, service, staff, date/time, status
- [ ] Appointment detail view with all info and actions
- [ ] Reschedule: re-enter slot selection flow, preserve original as fallback
- [ ] Cancel with reason selection (mandatory if within 24h), confirmation modal
- [ ] Cancellation policy displayed: free until X hours before, percentage fee after
- [ ] Rebook same service with one tap from past appointments
- [ ] Appointment history with ability to review

**User Stories (Business Owner):**
- As a business owner, I want to see my daily/weekly schedule so I can manage operations
- As a business owner, I want to block time or mark unavailable so customers can't book
- As a business owner, I want to confirm or decline bookings based on my policies

**Acceptance Criteria (Business Owner):**
- [ ] Calendar view: day, week, month modes
付诸东流- [ ] Color-coded by status: confirmed, pending, completed, cancelled, no-show
- [ ] Drag-and-drop to reschedule
- [ ] Block time: single occurrence or recurring (every Monday 9-10am)
- [ ] Set buffer time between appointments
- [ ] Override availability for special dates (extended hours, closures)
- [ ] Accept/decline pending bookings with optional message to customer
- [ ] Check-in customer on arrival, mark no-show if absent

---

### 2.9 Favorites

**Priority:** P1 (High)  
**Description:** Save and organize preferred businesses for quick rebooking.

**User Stories:**
- As a user, I want to favorite businesses so I can find them quickly later
- As a user, I want to see my favorites' availability at a glance so I can book efficiently

**Acceptance Criteria:**
- [ ] Heart icon on business cards and detail pages toggles favorite status
- [ ] Favorites list in profile with search and sort (recently added, alphabetical, nearest)
- [ ] Push notification option: "Notify me when [Business] has availability this week"
- [ ] Quick rebook from favorites: one-tap to last service or choose new
- [ ] Suggest similar businesses if favorite is fully booked or closed
- [ ] Sync favorites across devices for logged-in users
- [ ] Maximum 200 favorites per user

---

### 2.10 User Profile

**Priority:** P1 (High)  
**Description:** Central hub for user information, preferences, and account management.

**User Stories:**
- As a user, I want to manage my personal info so my bookings are accurate
- As a user, I want to set preferences so the app tailors to my needs

**Acceptance Criteria:**
- [ ] Profile photo, name, phone, email, birthday (for birthday offers)
- [ ] Default location for search
- [ ] Notification preferences: push, email, SMS — per type (bookings, promotions, reminders)
- [ ] Payment methods: add, remove, set default
- [ ] Booking history with filter by status and date range
- [ ] Loyalty points / rewards balance and history
- [ ] Referral code and sharing
- [ ] Data export (GDPR) and account deletion
- [ ] Dark mode / light mode preference

---

### 2.11 Availability & Slot Computation

**Priority:** P0 (Critical)  
**Description:** Core engine for calculating bookable time slots based on complex business rules.

**User Stories:**
- As a business, I want accurate availability so I don't get overbooked
- As a user, I want to see only real, bookable slots so my booking succeeds

**Acceptance Criteria:**
- [ ] Compute slots based on: business hours, staff schedules, service duration, existing bookings, blocked times, buffer times
- [ ] Support variable service durations (e.g., 30-90 min haircut depending on hair length)
- [ ] Handle multi-staff services (e.g., couple's massage requires 2 staff)
- [ ] Handle room/resource constraints (e.g., massage room, nail station)
- [ ] Real-time computation: slot availability updates within 2 seconds of any change
- [ ] Cache computed slots for 30 seconds, invalidate on booking/block change
- [ ] Timezone-aware: store in business timezone, display in user timezone
- [ ] Support split shifts (e.g., 9am-12pm, 2pm-6pm)
- [ ] Handle daylight saving transitions gracefully

**Algorithm Requirements:**
- [ ] O(n log n) complexity for 30-day slot generation
- [ ] Parallel computation for multiple staff
- [ ] Fallback to degraded mode (show approximate) if computation exceeds 500ms

---

### 2.12 Shared Types & Design System

**Priority:** P0 (Critical)  
**Description:** Consistent design language and reusable components across platforms.

**Design System Requirements:**
- [ ] Color palette: primary (#6C5CE7), secondary (#00D2D3), success, warning, error, neutrals (10 shades)
- [ ] Typography: Inter for body, Playfair Display for headings
- [ ] Spacing scale: 4px base unit (4, 8, 12, 16, 24, 32, 48, 64)
- [ ] Border radius: 8px (components), 16px (cards), 24px (bottom sheets), full (avatars)
- [ ] Shadow system: 3 levels (elevation 1, 2, 3)
- [ ] Animation: 200ms default, ease-out, spring for interactive elements

**Component Library:**
- [ ] Buttons: primary, secondary, ghost, danger — with loading and disabled states
- [ ] Inputs: text, phone, email, search, date picker, time picker, select, multiselect
- [ ] Cards: business card, service card, staff card, review card, booking card
- [ ] Overlays: modal, bottom sheet, toast, tooltip, popover
- [ ] Feedback: skeleton loaders, empty states, error states, success animations
- [ ] Navigation: tab bar, top navigation, bottom sheet navigation

**Shared Types (TypeScript):**
- [ ] User, Business, Service, Staff, Booking, Review, Payment, Notification interfaces
- [ ] API request/response types
- [ ] Enums for statuses, categories, roles
- [ ] Zod schemas for runtime validation

---

### 2.13 Reviews & Ratings

**Priority:** P1 (High)  
**Description:** Social proof system for quality assurance and discovery.

**User Stories:**
- As a user, I want to read reviews so I can assess business quality
- As a user, I want to leave reviews so I can share my experience
- As a business, I want to respond to reviews so I can manage my reputation

**Acceptance Criteria:**
- [ ] 5-star rating system with half-star precision
- [ ] Review components: overall rating, service quality, staff, ambiance, value (optional)
- [ ] Text review: 10-1000 characters, optional photo upload (max 5)
- [ ] Verified badge: only post-service customers can review
- [ ] Review eligibility: within 30 days of completed appointment
- [ ] Business owner response with notification to reviewer
- [ ] Report review for moderation
- [ ] Sort reviews: newest, highest, lowest, verified first
- [ ] Average rating recalculated in real-time
- [ ] Review summary: "4.5 (128 reviews)" with histogram

**Moderation:**
- [ ] Auto-flag: profanity, all-caps, suspicious patterns
- [ ] Human review queue for flagged content
- [ ] Appeal process for removed reviews

---

### 2.14 Payment Integration

**Priority:** P0 (Critical)  
**Description:** Secure, flexible payment processing for bookings.

**User Stories:**
- As a user, I want to pay securely so I can confirm my booking
- As a user, I want to save payment methods so checkout is faster next time
- As a business, I want to receive payments reliably so my revenue is protected

**Acceptance Criteria:**
- [ ] Payment methods: credit/debit card (Stripe), Apple Pay, Google Pay, PayPal
- [ ] Save payment method for future use (PCI-compliant tokenization)
- [ ] Full payment at booking OR deposit + balance at appointment
- [ ] No-show protection: hold on card, charge if no-show per policy
- [ ] Refund processing: full or partial, initiated by business or customer request
- [ ] Receipt emailed and available in app
- [ ] Payment failure handling: retry, alternative method, booking hold extension
- [ ] Tip option: pre-set (15%, 20%, 25%) or custom, added to total
- [ ] Promo code / gift card redemption
- [ ] Invoice generation for business customers

**Business Payout:**
- [ ] Daily, weekly, or monthly payout schedule (business configurable)
- [ ] Payout to connected bank account (Stripe Connect)
- [ ] Platform fee: 2.9% + $0.30 per transaction, 15% commission on service price
- [ ] Payout dashboard with transaction history and upcoming payouts

---

### 2.15 Notifications

**Priority:** P1 (High)  
**Description:** Multi-channel notification system for timely, relevant user communication.

**Notification Types:**
- [ ] Booking: confirmation, reminder (24h, 2h before), modification, cancellation
- [ ] Promotional: new business in area, favorite business promotion, seasonal offers
- [ ] System: password changed, new login, payment issue
- [ ] Engagement: review request, incomplete booking, loyalty reward

**Channels & Rules:**
- [ ] Push notifications: primary for urgent, real-time communications
- [ ] Email: detailed info, receipts, summaries
- [ ] SMS: backup for critical (reminders, cancellations), opt-in required
- [ ] In-app notification center with unread badge
- [ ] User controls: enable/disable per channel per type
- [ ] Quiet hours: no push notifications 10pm-8am user local time
- [ ] Batch non-urgent notifications (max 1 per 4 hours)

**Technical:**
- [ ] Firebase Cloud Messaging for push
- [ ] SendGrid for email
- [ ] Twilio for SMS
- [ ] BullMQ for reliable queue processing (see 2.17)

---

### 2.16 Provider / Business Owner Portal

**Priority:** P0 (Critical)  
**Description:** Dedicated interface for businesses to manage their presence, services, and operations.

**User Stories:**
- As a business owner, I want to set up my business profile so customers find accurate info
- As a business owner, I want to manage my services and pricing so my offerings are current
- As a business owner, I want to view and manage bookings so I can run my business

**Acceptance Criteria:**
- [ ] Business registration: name, address, phone, website, description, photos (max 10), logo
- [ ] Service management: CRUD services with name, description, duration, price, category, staff assignment
- [ ] Staff management: add staff profiles, set schedules, assign services, set commission rates
- [ ] Booking calendar: day/week/month views, accept/decline, reschedule, cancel with customer notification
- [ ] Customer management: view customer history, notes, contact info
- [ ] Analytics dashboard: bookings, revenue, occupancy rate, new vs. returning customers, popular services, peak hours
- [ ] Settings: business hours, cancellation policy, payment methods accepted, notification preferences
- [ ] Multiple location support (franchise/chain)
- [ ] Team member roles: Owner, Manager, Staff (permission levels)

---

### 2.17 Admin Dashboard

**Priority:** P1 (High)  
**Description:** Platform administration tools for operations, support, and business intelligence.

**User Stories:**
- As an admin, I want to monitor platform health so I can ensure reliability
- As an admin, I want to manage businesses and users so I can maintain quality
- As an admin, I want to view analytics so I can make data-driven decisions

**Acceptance Criteria:**
- [ ] Overview: KPIs (DAU, bookings, GMV, new businesses, churn rate), real-time charts
- [ ] User management: search, view profiles, suspend/activate, impersonate for support
- [ ] Business management: approve new registrations, verify documents, feature/hide listings
- [ ] Content moderation: review flagged reviews, photos, business info
- [ ] Financial: transaction monitoring, dispute resolution, refund approval, payout management
- [ ] Analytics: cohort analysis, funnel conversion, retention, LTV, geographic distribution
- [ ] System health: API latency, error rates, queue depths, database performance
- [ ] Audit log: all admin actions with timestamp and admin identity
- [ ] Role-based access: Super Admin, Operations, Support, Finance, Read-only

---

### 2.18 Background Jobs (BullMQ)

**Priority:** P0 (Critical)  
**Description:** Reliable, scalable background job processing for asynchronous operations.

**Required Job Queues:**
- [ ] `notifications`: send push, email, SMS with retry logic and dead letter queue
- [ ] `payments`: process charges, refunds, payouts with idempotency
- [ ] `bookings`: slot computation cache warming, waitlist processing
- [ ] `emails`: transactional emails with template rendering
- [ ] `analytics`: event ingestion, report generation
- [ ] `images`: upload, resize, optimize, CDN invalidation
- [ ] `search`: index updates for businesses, services
- [ ] `exports`: GDPR data export, report downloads

**Acceptance Criteria:**
- [ ] Jobs processed with at-least-once delivery guarantee
- [ ] Retry with exponential backoff (max 5 attempts)
- [ ] Dead letter queue for failed jobs with alerting
- [ ] Job progress tracking for long-running operations
- [ ] Priority queues: critical > high > normal > low
- [ ] Rate limiting per queue and per job type
- [ ] Dashboard for monitoring queue depths, processing rates, failures
- [ ] Graceful shutdown: finish in-progress jobs before stopping

---

## 3. Non-Functional Requirements

### Performance
- App cold start < 2 seconds
- Screen transitions < 300ms
- API response time: p50 < 100ms, p95 < 500ms, p99 < 1s
- Search results < 200ms
- Slot computation < 500ms

### Reliability
- 99.9% uptime SLA
- Database backups: continuous, point-in-time recovery
- Zero-downtime deployments
- Circuit breakers for external services

### Security
- OWASP Mobile Top 10 compliance
- Data encryption at rest (AES-256) and in transit (TLS 1.3)
- Annual penetration testing
- SOC 2 Type II certification target

### Accessibility
- WCAG 2.1 AA compliance
- Screen reader support
- Minimum touch target: 44x44dp
- Color contrast ratio ≥ 4.5:1

---

## 4. Success Metrics

| Metric | Target |
|--------|--------|
| Monthly Active Users (MAU) | 100K by month 12 |
| Booking Conversion Rate | >15% of app opens |
| Search-to-Book Time | <3 minutes median |
| Business Retention | >80% at 6 months |
| App Store Rating | >4.5 stars |
| Customer Support Tickets | <2% of bookings |
| Payment Success Rate | >99% |

---

## 5. Release Phases

### MVP (Month 1-2)
- User Authentication (email, social)
- Guest Browse & Explore
- Business Search & Discovery
- Map-based Search
- Business Detail View
- Service Categories
- Booking Flow (card payment only)
- Basic Appointment Management
- Availability & Slot Computation
- Shared Types & Design System
- Background Jobs

### v1.0 (Month 3-4)
- Favorites
- User Profile
- Reviews & Ratings
- Payment Integration (full)
- Notifications
- Provider Portal (basic)

### v1.5 (Month 5-6)
- Admin Dashboard
- Advanced Provider Portal (analytics, team)
- Loyalty Program
- Referral System
- Group Bookings
- Recurring Bookings

---

*Document Version: 1.0*  
*Last Updated: 2024*  
*Owner: Product Team*