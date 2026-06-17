# Planity Clone — Product Specification

## 1. Overview

### 1.1 Product Vision
Planity Clone is a mobile-first appointment booking platform connecting customers with beauty, wellness, and health service providers. Customers can discover businesses, view real-time availability, book appointments, and manage their bookings. Business owners manage their schedules, services, and client relationships through a dedicated portal.

### 1.2 Target Users
- **Customers (B2C)**: Individuals seeking beauty, wellness, and health services
- **Business Owners/Providers (B2B)**: Salons, spas, independent practitioners
- **Platform Admins**: Operations team managing the marketplace

### 1.3 Success Metrics
- Booking conversion rate > 15%
- Search-to-booking time < 3 minutes
- Business owner adoption rate > 80%
- Customer retention (30-day) > 40%

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority:** P0 — Critical

**User Stories:**
- As a customer, I want to create an account so I can book appointments and manage my history.
- As a business owner, I want to log in securely so I can manage my business.
- As a user, I want to reset my password so I can regain access to my account.

**Acceptance Criteria:**
- [ ] Users can register with email/password or social login (Google, Apple)
- [ ] Password must be minimum 8 characters with at least one uppercase, one lowercase, and one number
- [ ] Email verification required before first booking
- [ ] JWT tokens with refresh token rotation implemented
- [ ] Social login creates/merges account with existing email
- [ ] Password reset flow: email → secure token link → reset form (expires in 1 hour)
- [ ] Rate limiting: 5 login attempts per 15 minutes per IP
- [ ] Session timeout after 30 days of inactivity

**Technical Notes:**
- Use NestJS Passport with JWT strategy
- Store passwords with bcrypt (salt rounds: 12)
- Refresh tokens stored in httpOnly cookies

---

### 2.2 Guest Browse & Explore
**Priority:** P0 — Critical

**User Stories:**
- As a guest, I want to browse businesses without creating an account so I can evaluate the platform.
- As a guest, I want to view business details and services so I can make informed decisions.

**Acceptance Criteria:**
- [ ] Full browse and search functionality available without authentication
- [ ] Business profiles, services, reviews, and availability visible to guests
- [ ] "Book Now" CTA prompts login/signup (modal with context preservation)
- [ ] Guest state preserved in localStorage for 24 hours
- [ ] Deep links work for guests (redirect to login with return URL)
- [ ] No access to: booking management, favorites, profile, notifications

**Technical Notes:**
- Implement route guards that allow guest access to public routes
- Store pending booking intent in session for post-auth redirect

---

### 2.3 Business Search & Discovery
**Priority:** P0 — Critical

**User Stories:**
- As a customer, I want to search for businesses by name, service, or location so I can find relevant providers.
- As a customer, I want to filter results so I can narrow down my options.

**Acceptance Criteria:**
- [ ] Full-text search across business name, service names, and descriptions
- [ ] Autocomplete suggestions with debounce (300ms)
- [ ] Recent searches stored (last 10, clearable)
- [ ] Filters: distance (1-50km), rating (4+, 4.5+), price range, availability today/open now
- [ ] Sort options: relevance, distance, rating, price (low to high)
- [ ] Search results display: business image, name, rating, distance, starting price, next available slot
- [ ] Empty state with suggestions and "expand search radius" option
- [ ] Pagination with infinite scroll (20 results per page)

**Technical Notes:**
- PostgreSQL full-text search with tsvector
- Geospatial queries with PostGIS
- Redis cache for popular searches (5-minute TTL)

---

### 2.4 Map-based Search
**Priority:** P0 — Critical

**User Stories:**
- As a customer, I want to see businesses on a map so I can choose based on location.
- As a customer, I want to explore different areas so I can find businesses near me or near a destination.

**Acceptance Criteria:**
- [ ] Interactive map with business markers (clustered at zoom levels)
- [ ] User location detection with permission prompt
- [ ] Map bounds trigger new search (debounced 500ms)
- [ ] Marker tap shows business card preview (image, name, rating, price)
- [ ] Card tap navigates to business detail
- [ ] List/map toggle with state persistence
- [ ] Default zoom: 12 (neighborhood level)
- [ ] Custom marker for user's current location

**Technical Notes:**
- Mapbox or Google Maps SDK
- Marker clustering with Supercluster
- Location services with fallback to IP geolocation

---

### 2.5 Business Detail View
**Priority:** P0 — Critical

**User Stories:**
- As a customer, I want to see comprehensive business information so I can decide whether to book.

**Acceptance Criteria:**
- [ ] Hero image gallery (up to 10 images, swipeable)
- [ ] Business name, verified badge, rating, review count
- [ ] Address with "Get Directions" (opens native maps)
- [ ] Phone number with tap-to-call
- [ ] Business hours with "Open Now" indicator
- [ ] About/description section (expandable)
- [ ] Services list with pricing and duration
- [ ] Staff/professional list with photos and specialties
- [ ] Reviews summary (average, distribution, recent 3)
- [ ] "Book Now" sticky CTA
- [ ] Share button (native share sheet)
- [ ] Report business option

**Technical Notes:**
- Image optimization: WebP with fallback, lazy loading
- Preload adjacent images in gallery

---

### 2.6 Service Categories
**Priority:** P0 — Critical

**User Stories:**
- As a customer, I want to browse by category so I can discover relevant services.
- As a business owner, I want to categorize my services so customers can find them.

**Acceptance Criteria:**
- [ ] Hierarchical categories: Beauty > Hair > Haircut, Coloring, Styling
- [ ] Category icons and color coding
- [ ] Trending/popular categories highlighted
- [ ] Business can assign multiple categories to services
- [ ] Category-based filtering in search
- [ ] Category pages with featured businesses and promotions

**Predefined Categories:**
- Hair (cut, color, styling, treatments)
- Nails (manicure, pedicure, nail art)
- Face (facials, makeup, brows, lashes)
- Body (massage, waxing, tanning, spa)
- Wellness (yoga, fitness, nutrition, mental health)
- Medical Aesthetics (injectables, laser, dermatology)

---

### 2.7 Booking Flow
**Priority:** P0 — Critical

**User Stories:**
- As a customer, I want to book an appointment in as few steps as possible so I can secure my preferred time.

**Acceptance Criteria:**
- [ ] Step 1: Select service(s) — show duration and price, allow multiple services
- [ ] Step 2: Select professional (or "No preference") — show availability calendar
- [ ] Step 3: Select date and time slot — real-time availability
- [ ] Step 4: Review and confirm — summary with cancelation policy
- [ ] Step 5: Payment (if required) or confirm
- [ ] Booking confirmation with calendar invite (.ics) and add-to-calendar options
- [ ] Booking reference number generated (format: BK-XXXXXX)
- [ ] Guest checkout: collect name, phone, email; create account option post-booking
- [ ] Maximum booking window: 90 days in advance
- [ ] Minimum notice initiates: 2 hours before (configurable per business)

**Edge Cases:**
- Slot taken during booking: show next 3 available alternatives
- Business closes or slot becomes unavailable: graceful error with alternatives
- Payment failure: hold slot for 10 minutes, allow retry

---

### 2.8 Appointment Management
**Priority:** P0 — Critical

**User Stories:**
- As a customer, I want to view and manage my appointments so I can stay organized.
- As a business owner, I want to manage my appointment calendar so I can run my business efficiently.

**Customer Acceptance Criteria:**
- [ ] Upcoming appointments list with date, time, business, services
- [ ] Appointment detail: full info, directions, contact, cancel/reschedule
- [ ] Cancelation: allowed per business policy, confirmation required
- [ ] Reschedule: select new slot, subject to availability and policy
- [ ] Past appointments with rebook option
- [ ] No-show policy displayed

**Business Owner Acceptance Criteria:**
- [ ] Calendar view (day/week/month) with appointment blocks
- [ ] Create, edit, cancel appointments manually
- [ ] Block time off (lunch, vacation, sick leave)
- [ ] Client notes and history accessible from appointment
- [ ] Check-in/check-out functionality
- [ ] Walk-in appointment support

**Cancelation Policies (configurable per business):**
- Flexible: free cancelation up to 2 hours before
- Moderate: free cancelation up to 24 hours before
- Strict: free cancelation up to 48 hours before
- Custom: business-defined

---

### 2.9 Favorites
**Priority:** P1 — High

**User Stories:**
- As a customer, I want to save favorite businesses so I can quickly rebook.

**Acceptance Criteria:**
- [ ] Heart icon on business cards and detail pages
- [ ] Favorites list with quick rebook and view
- [ ] Push notification for new availability or promotions from favorites
- [ ] Sync across devices
- [ ] Maximum 200 favorites
- [ ] Suggest similar businesses if favorite is unavailable

---

### 2.10 User Profile
**Priority:** P1 — High

**User Stories:**
- As a user, I want to manage my profile so my experience is personalized.

**Acceptance Criteria:**
- [ ] Profile photo upload (crop, max 5MB)
- [ ] Name, phone, email (editable)
- [ ] Preferred notification settings (push, email, SMS)
- [ ] Preferred language and timezone
- [ ] Saved payment methods (PCI-compliant tokenization)
- [ ] Booking history with receipts
- [ ] Data export (GDPR compliance)
- [ ] Account deletion with 30-day grace period

---

### 2.11 Availability & Slot Computation
**Priority:** P0 — Critical

**User Stories:**
- As a customer, I want to see real-time availability so I can book confidently.
- As a business owner, I want my availability to update automatically so I avoid double-bookings.

**Acceptance Criteria:**
- [ ] Slot computation based on: business hours, staff schedules, existing bookings, blocked time, service duration
- [ ] Slot granularity: 15, 30, or 60 minutes (configurable)
- [ ] Buffer time between appointments (configurable, default 0)
- [ ] Real-time updates via WebSocket
- [ ] Timezone-aware (business timezone displayed, converted to user)
- [ ] "Next available" quick select
- [ ] Handle multi-service bookings (sum durations + buffers)
- [ ] Recurring availability patterns with exception handling

**Algorithm Requirements:**
- O(n) slot generation where n = slots in range
- Cache computed slots for 5 minutes
- Invalidate cache on booking/cancelation

---

### 2.12 Shared Types & Design System
**Priority:** P0 — Critical

**Acceptance Criteria:**
- [ ] Design tokens: colors, typography, spacing, shadows, radii
- [ ] Component library: buttons, inputs, cards, modals, date picker, time slot selector
- [ ] Consistent loading, empty, and error states
- [ ] Accessibility: WCAG 2.1 AA minimum
- [ ] Dark mode support
- [ ] RTL language support
- [ ] Animation standards (150ms transitions, 300ms for modals)

**Color Palette:**
- Primary: #6C5CE7 (purple)
- Secondary: #00B894 (green — success/booking)
- Accent: #FD79A8 (pink — beauty focus)
- Error: #D63031
- Warning: #FDCB6E
- Neutral grays: #2D3436 to #F5F6FA

---

### 2.13 Reviews & Ratings
**Priority:** P1 — High

**User Stories:**
- As a customer, I want to read and write reviews so I can make informed decisions and share my experience.

**Acceptance Criteria:**
- [ ] 5-star rating with half-star precision
- [ ] Review form: rating, title, body, service received, date visited
- [ ] Photo attachments (up to 5, max 5MB each)
- [ ] Verified purchase badge (actually attended appointment)
- [ ] Business owner response capability
- [ ] Review helpfulness voting
- [ ] Flag inappropriate reviews
- [ ] Reviews appear after moderation (auto-approve if no flags)
- [ ] Customer can edit review within 48 hours
- [ ] Average rating recalculated in real-time

---

### 2.14 Payment Integration
**Priority:** P0 — Critical

**User Stories:**
- As a customer, I want to pay securely so I can confirm my booking.
- As a business owner, I want to configure payment options so I match my business model.

**Acceptance Criteria:**
- [ ] Stripe integration for card payments
- [ ] Payment methods: card (Visa, MC, Amex), Apple Pay, Google Pay
- [ ] Payment timing options: pay now, pay at venue, deposit + balance
- [ ] Secure payment: PCI-DSS compliant, no raw card data stored
- [ ] Payment confirmation and receipt via email
- [ ] Refund processing per cancelation policy
- [ ] Failed payment handling with retry
- [ ] Invoice generation for business records

**Business Payout:**
- [ ] Connected Stripe Connect account for each business
- [ ] Payout schedule: daily, weekly, monthly (configurable)
- [ ] Platform fee deduction (configurable %)
- [ ] Payout dashboard with transaction history

---

### 2.15 Notifications
**Priority:** P1 — High

**User Stories:**
- As a user, I want timely notifications so I don't miss my appointments.

**Acceptance Criteria:**
- [ ] Push notifications (iOS/Android)
- [ ] Email notifications
- [ ] SMS notifications (optional, premium)
- [ ] Notification types:
  - Booking confirmation
  - 24-hour reminder
  - 1-hour reminder
  - Cancelation confirmation
  - Reschedule confirmation
  - Review request (post-appointment)
  - Promotional (opt-in)
- [ ] Preference management per channel
- [ ] Quiet hours respect (10 PM - 8 AM local time)
- [ ] Delivery tracking and retry logic

---

### 2.16 Provider / Business Owner Portal
**Priority:** P0 — Critical

**User Stories:**
- As a business owner, I want to manage my entire business presence so I can attract and serve customers.

**Acceptance Criteria:**
- [ ] Business profile management: name, description, photos, hours, contact
- [ ] Service management: CRUD services with name, description, duration, price, category
- [ ] Staff management: add professionals, set schedules, assign services
- [ ] Availability calendar: set recurring patterns, exceptions, time off
- [ ] Appointment calendar with day/week/month views
- [ ] Client management: view history, notes, contact info
- [ ] Analytics dashboard: bookings, revenue, occupancy rate, popular services, new vs. returning clients
- [ ] Settings: cancelation policy, booking rules, payment settings, notification preferences
- [ ] Multiple location support (if applicable)

---

### 2.17 Admin Dashboard
**Priority:** P2 — Medium

**User Stories:**
- As a platform admin, I want to oversee the marketplace so I can ensure quality and growth.

**Acceptance Criteria:**
- [ ] User management: search, view, suspend, impersonate
- [ ] Business verification and approval workflow
- [ ] Content moderation: review flagged reviews, businesses, images
- [ ] Analytics: MAU, bookings, GMV, churn, top categories, geographic distribution
- [ ] Financial: transaction monitoring, dispute handling, payout management
- [ ] Support ticket management
- [ ] Feature flags and A/B test configuration
- [ ] System health monitoring

---

### 2.18 Background Jobs (BullMQ)
**Priority:** P1 — High

**User Stories:**
- As a system, I want reliable background processing so operations don't block user requests.

**Acceptance Criteria:**
- [ ] Job queue with Redis-backed BullMQ
- [ ] Retry logic with exponential backoff (max 5 attempts)
- [ ] Dead letter queue for failed jobs
- [ ] Job types:
  - Send notification (email, push, SMS)
  - Process image uploads (resize, optimize, generate thumbnails)
  - Generate reports
  - Sync search index
  - Process payouts
  - Cleanup old data (GDPR)
  - Recurring: daily summary emails, weekly analytics
- [ ] Job monitoring dashboard (Bull Board or similar)
- [ ] Priority queues: critical > high > normal > low

---

## 3. Non-Functional Requirements

### 3.1 Performance
- API response time: p95 < 200ms
- Image load: first meaningful image < 1s
- App cold start: < 3s
- Search results: < 500ms

### 3.2 Security
- OWASP Mobile Top 10 compliance
- API rate limiting
- Input validation and sanitization
- SQL injection prevention (Prisma ORM)
- XSS protection
- CSRF tokens for web

### 3.3 Scalability
- Horizontal scaling with stateless services
- Database read replicas for search
- CDN for static assets
- Auto-scaling based on CPU/memory

### 3.4 Reliability
- 99.9% uptime SLA
- Database backups: daily full, continuous WAL
- Graceful degradation (offline mode for viewing)

---

## 4. Release Phases

### Phase 1 — MVP (Weeks 1-6)
- User Authentication
- Guest Browse & Explore
- Business Search & Discovery
- Map-based Search
- Business Detail View
- Service Categories
- Booking Flow (pay at venue only)
- Appointment Management (customer + basic business)
- Availability & Slot Computation
- Shared Types & Design System

### Phase 2 — Growth (Weeks 7-10)
- Payment Integration
- Reviews & Ratings
- Favorites
- User Profile
- Notifications
- Provider Portal (full)

### Phase 3 — Scale (Weeks 11-14)
- Admin Dashboard
- Background Jobs (BullMQ)
- Advanced analytics
- Marketing tools
- API for partners

---

## 5. Appendix

### 5.1 Glossary
- **Slot**: A specific time interval available for booking
- **GMV**: Gross Merchandise Value
- **WAL**: Write-Ahead Logging

### 5.2 Reference
- Planity app (iOS/Android)
- Treatwell, Fresha competitor analysis
