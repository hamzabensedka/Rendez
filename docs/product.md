# Planity Clone — Product Specification

## 1. Overview

### 1.1 Product Vision
Build a comprehensive beauty and wellness booking platform that connects customers with local businesses (salons, barbershops, spas, clinics). The platform serves three primary user types: **Customers** (booking services), **Providers/Business Owners** (managing their business), and **Admins** (platform oversight).

### 1.2 Target Users
| User Type | Description | Primary Goals |
|-----------|-------------|---------------|
| Customer | End-user seeking beauty/wellness services | Discover, book, manage appointments |
| Guest | Unauthenticated browser | Explore businesses without commitment |
| Provider | Business owner/manager | Manage schedule, services, staff, bookings |
| Admin | Platform administrator | Oversee operations, resolve disputes, analytics |

### 1.3 Success Metrics
- Booking conversion rate > 15%
- Search-to-book time < 3 minutes
- Provider onboarding completion > 80%
- Customer retention (30-day) > 40%

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority:** P0 (Critical)  
**Description:** Secure identity management for all user types with role-based access control.

#### Acceptance Criteria
- [ ] Users can register with email/password, Google OAuth, or Apple Sign-In
- [ ] Passwords must be hashed with bcrypt (cost factor 12) and meet complexity requirements (min 8 chars, 1 uppercase, 1 number, 1 special)
- [ ] JWT access tokens expire after 15 minutes; refresh tokens expire after 7 days
- [ ] Users receive email verification link upon registration; account restricted until verified
- [ ] Password reset flow sends secure token via email (expires 1 hour)
- [ ] Role assignment at registration: `CUSTOMER`, `PROVIDER`, `ADMIN`
- [ ] Middleware enforces route-level access control based on roles
- [ ] Rate limiting: 5 login attempts per 15 minutes per IP

#### Technical Notes
- Use `passport-jwt` and `passport-local` strategies
- Store refresh tokens in httpOnly cookies
- Implement token rotation on refresh

---

### 2.2 Guest Browse & Explore
**Priority:** P0 (Critical)  
**Description:** Allow unauthenticated users to discover businesses and services to drive conversion.

#### Acceptance Criteria
- [ ] Guests can view business listings without authentication
- [ ] Guests can search by location, service category, and business name
- [ ] Guests can view business profiles, services, and reviews
- [ ] Guests can view availability (slot patterns) but cannot book
- [ ] "Book Now" CTA prompts login/signup with return URL preservation
- [ ] Guest session data (search filters, viewed businesses) persisted in localStorage for 24 hours
- [ ] No personal data collection beyond analytics events

#### Conversion Triggers
- After 3 business views, show gentle login prompt
- After viewing 2 service details, show "Save time — create an account" modal

---

### 2.3 Business Search & Discovery
**Priority:** P0 (Critical)  
**Description:** Powerful search and filtering to help users find the right business.

#### Acceptance Criteria
- [ ] Full-text search across business name, description, service names
- [ ] Autocomplete suggestions with debounce (300ms) and max 10 results
- [ ] Filters: category, price range, rating (min stars), distance, availability ("open now", specific date)
- [ ] Sort options: relevance, rating, price (low-high), distance, most reviewed
- [ ] Pagination with cursor-based approach for performance (20 results/page)
- [ ] Search results display: business photo, name, rating, starting price, distance, next available slot
- [ ] Recent searches stored per user (max 10, de-duplicated)
- [ ] Search query logged for analytics and search quality improvement

#### Performance Criteria
- Search response time < 200ms (p95)
- Autocomplete response time < 100ms

---

### 2.4 Map-based Search
**Priority:** P1 (High)  
**Description:** Visual geographic exploration of businesses.

#### Acceptance Criteria
- [ ] Interactive map (Google Maps or Mapbox) with business markers
- [ ] Map view and list view are toggleable and state-synced
- [ ] Map auto-centers on user's current location (with permission) or default city
- [ ] Clustering for dense areas; zoom reveals individual markers
- [ ] Marker click reveals business card with key info and link to detail
- [ ] Map bounds trigger new search query (debounced 500ms)
- [ ] User can drag/zoom map to explore; results update dynamically
- [ ] "Search this area" button appears after map movement

---

### 2.5 Business Detail View
**Priority:** P0 (Critical)  
**Description:** Comprehensive business profile that drives booking decisions.

#### Acceptance Criteria
- [ ] Header: business name, photos (carousel, max 10), verified badge, favorite toggle
- [ ] Key info: address, phone, hours, website link, social links
- [ ] Services tab: list of services with prices, durations, descriptions; filter by category
- [ ] Reviews tab: aggregate rating, rating distribution, review list with photos, provider response
- [ ] Team tab: staff profiles with photos, bios, specialties
- [ ] About tab: business description, amenities, policies (cancellation, late arrival)
- [ ] Sticky "Book Appointment" CTA on mobile
- [ ] Share functionality (deep link, native share API)
- [ ] Report business option (inappropriate content)

---

### 2.6 Service Categories
**Priority:** P1 (High)  
**Description:** Hierarchical categorization for discovery and organization.

#### Acceptance Criteria
- [ ] Predefined category tree: Hair, Nails, Face, Body, Massage, Medical Aesthetic, Wellness
- [ ] Each category has icon, display name, and optional subcategories
- [ ] Businesses can assign multiple categories to their profile
- [ ] Services belong to exactly one category
- [ ] Category pages show featured businesses and trending services
- [ ] Categories searchable and filterable
- [ ] Admin can add/edit/disable categories (soft delete)

---

### 2.7 Booking Flow
**Priority:** P0 (Critical)  
**Description:** Seamless, low-friction appointment reservation.

#### Acceptance Criteria
- [ ] Step 1: Select service(s) — allow multiple services, show total duration/price
- [ ] Step 2: Select staff member (or "no preference") — shows staff availability
- [ ] Step 3: Select date and time slot — calendar view with available slots highlighted
- [ ] Step 4: Review booking details and add notes/special requests
- [ ] Step 5: Confirm booking (payment if required, or skip for pay-at-venue)
- [ ] Real-time slot availability — no double-booking possible
- [ ] Booking held for 10 minutes during payment; released if not completed
- [ ] Confirmation screen with booking reference, add-to-calendar links
- [ ] Booking confirmation email and push notification sent
- [ ] Support for guest checkout (collect name, phone, email)

#### Edge Cases
- Slot taken during flow: show error, offer next available
- Provider cancels: automatic refund, rebooking assistance
- Customer reschedules: preserve payment, adjust if price differs

---

### 2.8 Appointment Management
**Priority:** P0 (Critical)  
**Description:** Lifecycle management for customer appointments.

#### Acceptance Criteria
- [ ] Customer can view all upcoming and past appointments
- [ ] Customer can reschedule appointment (up to provider's cancellation window)
- [ ] Customer can cancel appointment with reason selection; refund policy displayed
- [ ] Customer can rebook past appointment with one click
- [ ] Push and email reminders: 24 hours, 2 hours before appointment
- [ ] Post-appointment: prompt to review, option to rebook, add to favorites
- [ ] Appointment statuses: PENDING, CONFIRMED, COMPLETED, CANCELLED_BY_CUSTOMER, CANCELLED_BY_PROVIDER, NO_SHOW
- [ ] Provider can view, confirm, reschedule, or cancel appointments
- [ ] Provider can add internal notes to appointments

---

### 2.9 Favorites
**Priority:** P2 (Medium)  
**Description:** Save businesses for quick re-access.

#### Acceptance Criteria
- [ ] Customer can favorite/unfavorite a business from search results or detail page
- [ ] Favorites accessible from profile tab
- [ ] Favorites show business snapshot: photo, name, rating, next availability
- [ ] Customer can remove favorite with swipe (mobile) or button click
- [ ] Favorites sync across devices for logged-in users
- [ ] Push notification when favorited business has new availability or promotion
- [ ] Maximum 500 favorites per user

---

### 2.10 User Profile
**Priority:** P1 (High)  
**Description:** Customer identity and preference management.

#### Acceptance Criteria
- [ ] Profile fields: photo, first name, last name, phone, email, birthday (for birthday offers)
- [ ] Notification preferences: email, push, SMS — per event type
- [ ] Payment methods: view, add, delete (Stripe customer portal integration)
- [ ] Booking history with search and filter
- [ ] Privacy settings: profile visibility, data download, account deletion (GDPR)
- [ ] Referral code and referral history
- [ ] Loyalty points balance and history (if applicable)

---

### 2.11 Availability & Slot Computation
**Priority:** P0 (Critical)  
**Description:** Core scheduling engine that generates bookable time slots.

#### Acceptance Criteria
- [ ] Providers define weekly recurring schedules (e.g., Mon-Fri 9:00-18:00)
- [ ] Providers can add exceptions: time off, holidays, modified hours
- [ ] Service duration defines slot granularity; buffer time between appointments configurable
- [ ] Slot computation accounts for existing bookings and blocked times
- [ ] Real-time availability API with sub-200ms response
- [ ] Support for multiple staff members with individual schedules
- [ ] Support for double-booking prevention at staff level
- [ ] Timezone-aware: store in UTC, display in business timezone
- [ ] Bulk schedule editing for providers
- [ ] Preview mode: see schedule before publishing changes

#### Algorithm Requirements
- Generate slots from opening time, respecting service duration + buffer
- Exclude slots that would extend past closing time
- Handle overnight schedules (e.g., spa open until 2 AM)

---

### 2.12 Shared Types & Design System
**Priority:** P1 (High)  
**Description:** Consistent UI/UX across platforms.

#### Acceptance Criteria
- [ ] Design tokens: colors, typography, spacing, shadows, border-radius
- [ ] Component library: buttons, inputs, cards, modals, date picker, time picker, skeleton loaders
- [ ] Shared TypeScript types between frontend and backend (monorepo)
- [ ] Responsive breakpoints: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)
- [ ] Accessibility: WCAG 2.1 AA compliance, keyboard navigation, screen reader support
- [ ] Dark mode support
- [ ] Loading states and error boundaries for all async operations
- [ ] Consistent empty states with illustrations and CTA

---

### 2.13 Reviews & Ratings
**Priority:** P1 (High)  
**Description:** Social proof and quality feedback loop.

#### Acceptance Criteria
- [ ] Customers can leave review after completed appointment (within 30 days)
- [ ] Rating: 1-5 stars, mandatory; review text: optional, max 1000 chars
- [ ] Photo upload: max 5 photos per review
- [ ] Reviews display: customer name (or "Verified Customer"), date, rating, text, photos
- [ ] Provider can respond to reviews publicly
- [ ] Review helpfulness voting (thumbs up)
- [ ] Flag inappropriate reviews for admin moderation
- [ ] Average rating recalculated on new review; cached for performance
- [ ] Sort reviews: most recent, highest rated, lowest rated, most helpful
- [ ] Prevent self-review, multiple reviews for same appointment

---

### 2.14 Payment Integration
**Priority:** P0 (Critical)  
**Description:** Secure, flexible payment processing.

#### Acceptance Criteria
- [ ] Stripe integration for payment processing
- [ ] Payment methods: credit/debit cards, Apple Pay, Google Pay
- [ ] Payment flows: pay in full, deposit (partial payment), pay at venue
- [ ] Payment intent created at booking confirmation; captured on service completion or immediately based on settings
- [ ] Refund support: full, partial, with reason tracking
- [ ] Provider payout: automatic transfer to connected Stripe account (weekly or on-demand)
- [ ] Invoice and receipt generation (PDF)
- [ ] Failed payment handling: retry logic, customer notification, booking hold extension
- [ ] PCI compliance: never store raw card data; use Stripe Elements
- [ ] Tax calculation support (configurable by jurisdiction)

---

### 2.15 Notifications
**Priority:** P1 (High)  
**Description:** Multi-channel communication for engagement and operations.

#### Acceptance Criteria
- [ ] Channels: push (Firebase/OneSignal), email (SendGrid/SES), SMS (Twilio)
- [ ] Event-triggered notifications: booking confirmed, reminder, cancelled, rescheduled, completed, review prompt
- [ ] Provider notifications: new booking, cancellation, review received, payout
- [ ] Admin notifications: new provider signup, dispute, high-value refund
- [ ] Notification preferences: user can enable/disable per channel and event type
- [ ] Notification templates with variable substitution
- [ ] Delivery tracking: sent, delivered, opened, failed
- [ ] Batching: digest emails for non-urgent notifications
- [ ] In-app notification center with unread count

---

### 2.16 Provider / Business Owner Portal
**Priority:** P0 (Critical)  
**Description:** Dedicated interface for business management.

#### Acceptance Criteria
- [ ] Dashboard: upcoming appointments, appointments today, revenue this week, new reviews
- [ ] Calendar view: day, week, month; drag-to-reschedule, click for details
- [ ] Service management: CRUD services, set prices, durations, categories, availability
- [ ] Staff management: add team members, set individual schedules and services
- [ ] Booking management: view, confirm, reschedule, cancel; add walk-in appointments
- [ ] Customer management: view customer history, notes, contact info
- [ ] Analytics: booking volume, revenue, cancellation rate, popular services, customer retention
- [ ] Business profile editing: photos, description, hours, policies
- [ ] Payout settings: bank account, payout schedule, payout history
- [ ] Subscription/billing: plan selection, upgrade/downgrade, invoice history

---

### 2.17 Admin Dashboard
**Priority:** P1 (High)  
**Description:** Platform oversight and operational management.

#### Acceptance Criteria
- [ ] User management: search, view, suspend/activate, impersonate
- [ ] Business management: approve new registrations, verify documents, suspend
- [ ] Content moderation: review flagged reviews, businesses, photos
- [ ] Financial oversight: transaction logs, refund approval, payout monitoring
- [ ] Analytics: MAU, booking volume, GMV, churn, top categories, geographic distribution
- [ ] System health: API latency, error rates, queue depths, database performance
- [ ] Configuration: feature flags, promotional campaigns, category management
- [ ] Audit log: all admin actions with timestamp and admin identity
- [ ] Support ticket integration: view, assign, resolve customer/provider issues

---

### 2.18 Background Jobs (BullMQ)
**Priority:** P1 (High)  
**Description:** Reliable asynchronous task processing.

#### Acceptance Criteria
- [ ] Job types: email sending, push notifications, SMS, payment processing, report generation, data exports, cleanup tasks
- [ ] Retry policy: 3 attempts with exponential backoff (delay = 2^attempt * 1000ms)
- [ ] Dead letter queue for failed jobs after max retries
- [ ] Job prioritization: critical (payment), high (notifications), normal (reports), low (cleanup)
- [ ] Scheduled jobs: daily reports, weekly summaries, nightly data aggregation
- [ ] Job monitoring: queue depth, processing rate, failure rate, average processing time
- [ ] Idempotency: jobs can be safely retried without side effects
- [ ] Concurrency control: limit parallel workers per queue type

---

## 3. Non-Functional Requirements

### 3.1 Performance
- Page load time < 2s (Lighthouse performance score > 90)
- API response time p95 < 300ms
- Image optimization: WebP, lazy loading, CDN delivery

### 3.2 Security
- HTTPS everywhere
- SQL injection prevention (Prisma parameterized queries)
- XSS protection (output encoding, CSP headers)
- CSRF protection for state-changing operations
- Rate limiting on all public endpoints
- Data encryption at rest (AES-256)

### 3.3 Scalability
- Horizontal scaling support (stateless API servers)
- Database read replicas for reporting queries
- Redis caching for hot data (slots, search results)
- CDN for static assets

### 3.4 Compliance
- GDPR: data portability, right to erasure, consent tracking
- CCPA: consumer rights fulfillment
- PCI DSS Level 1 (via Stripe)

---

## 4. Prioritization Matrix

| Feature | Priority | Effort | Dependencies |
|---------|----------|--------|--------------|
| User Authentication | P0 | Medium | — |
| Guest Browse & Explore | P0 | Low | — |
| Business Search & Discovery | P0 | High | Service Categories |
| Map-based Search | P1 | Medium | Business Search |
| Business Detail View | P0 | Medium | — |
| Service Categories | P1 | Low | — |
| Booking Flow | P0 | High | Availability, Payment |
| Appointment Management | P0 | Medium | Booking Flow |
| Favorites | P2 | Low | User Auth, Business |
| User Profile | P1 | Low | User Auth |
| Availability & Slot Computation | P0 | High | — |
| Shared Types & Design System | P1 | Medium | — |
| Reviews & Ratings | P1 | Medium | Booking, User Auth |
| Payment Integration | P0 | High | Booking Flow |
| Notifications | P1 | Medium | Booking, Background Jobs |
| Provider Portal | P0 | High | User Auth, Booking |
| Admin Dashboard | P1 | High | User Auth |
| Background Jobs (B scalable) | P1 | Medium | — |

---

## 5. Release Roadmap

### MVP (Month 1-2)
- User Authentication, Guest Browse, Business Search, Business Detail, Booking Flow (basic), Appointment Management, Availability Engine, Provider Portal (basic), Payment (card only)

### V1.0 (Month 3)
- Map Search, Service Categories, Reviews, Notifications, User Profile, Admin Dashboard

### V1.1 (Month 4)
- Favorites, Advanced Analytics, Referral Program, Loyalty Points, Bulk Scheduling

### V1.2 (Month 5-6)
- Mobile Apps (React Native/Flutter), AI Recommendations, Marketplace Features

---

## 6. Appendix

### 6.1 Glossary
- **Slot**: A bookable time period for a specific service and staff member
- **GMV**: Gross Merchandise Value — total value of bookings
- **MAU**: Monthly Active Users

### 6.2 Revision History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-01-15 | Alex (PO) | Initial specification |
