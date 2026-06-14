# Planity Clone — Product Specification

## 1. Overview

### 1.1 Product Vision
Build a comprehensive beauty and wellness appointment booking platform that connects customers with local businesses (salons, barbershops, spas, clinics). The platform serves three primary user segments: customers seeking to discover and book services, business owners managing their operations, and administrators overseeing the marketplace.

### 1.2 Target Users
- **Customers**: Individuals aged 18-55 seeking beauty/wellness services
- **Business Owners**: Salon/spa/clinic managers and independent professionals
- **Administrators**: Platform operators managing the marketplace

### 1.3 Success Metrics
- Booking conversion rate > 15%
- Search-to-book time < 3 minutes
- Business owner adoption rate > 60%
- Customer retention (30-day) > 40%

---

## 2. Feature Specifications

---

### 2.1 User Authentication
**Priority**: P0 (?) Critical Path

**User Stories**
- As a customer, I want to create an account so I can book appointments and manage my history
- As a business owner, I want to register my business so I can manage my services and availability
- As a user, I want to log in securely so my data is protected
- As a user, I want to reset my password so I can recover access
- As a user, I want to use social login so registration is faster

**Functional Requirements**
1. Support email/password registration with validation
2. Support Google and Facebook OAuth 2.0
3. Implement JWT-based authentication with refresh tokens
4. Password requirements: min 8 chars, 1 uppercase, 1 number, 1 special character
5. Email verification required before booking
6. Role-based access: CUSTOMER, BUSINESS_OWNER, ADMIN
7. Account lockout after 5 failed attempts (30-min cooldown)
8. Secure password reset via email token (expires in 1 hour)

**Acceptance Criteria**
- [ ] User can register with email/password and receives verification email
- [ ] User can login with valid credentials and receives JWT + refresh token
- [ ] User can login via Google/Facebook OAuth
- [ ] Unverified users cannot complete bookings
- [ ] Password reset flow completes successfully within token expiry
- [ ] Refresh token rotation prevents token replay attacks
- [ ] Rate limiting enforced on auth endpoints (5 req/min per IP)

**Technical Notes**
- Use bcrypt with cost factor 12 for password hashing
- Store refresh tokens hashed in database
- Implement token blacklist for logout

---

### 2.2 Guest Browse & Explore
**Priority**: P0

**User Stories**
- As a guest, I want to browse businesses without creating an account
- As a guest, I want to view business details and services
- As a guest, I want to be prompted to register when attempting to book

**Functional Requirements**
1. Allow unauthenticated access to search, business listings, and detail views
2. Display "Book" CTA that triggers auth modal for guests
3. Cache guest session preferences (location, filters) for 24 hours
4. Show limited reviews (last 10) to guests

**Acceptance Criteria**
- [ ] Guest can access /explore, /search, /business/:id without authentication
- [ ] Guest sees auth prompt with preserved intent when attempting booking
- [ ] Guest location preferences persist across session
- [ ] Guest cannot access /bookings, /profile, or checkout

---

### 2.3 Business Search & Discovery
**Priority**: P0

**User Stories**
- As a customer, I want to search for businesses by name, service, or location
- As a customer, I want to filter results by price, rating, availability, and distance
- As a customer, I want to see relevant results sorted by relevance, rating, or distance

**Functional Requirements**
1. Full-text search across business name, service names, and descriptions
2. Filters: category, price range (min-max), rating (1-5), distance (km), availability (today, this week), amenities
3. Sort options: relevance (default), highest rated, nearest, price (low-high)
4. Pagination with cursor-based approach for performance
5. Auto-complete suggestions for search queries
6. Recent searches stored per user (last 10)

**Acceptance Criteria**
- [ ] Search returns results in < 200ms for 90th percentile
- [ ] Empty search state shows popular businesses near user
- [ ] Active filters display as removable chips with count badge
- [ ] URL encodes search state for shareability
- [ ] No results state suggests alternative searches
- [ ] Search handles typos with fuzzy matching (Levenshtein distance ≤ 2)

---

### 2.4 Map-based Search
**Priority**: P0

**User Stories**
- As a customer, I want to see businesses on a map to understand proximity
- As a customer, I want to explore a specific area by panning/zooming the map
- As a customer, I want to see business clusters when zoomed out

**Functional Requirements**
1. Interactive map with custom business markers
2. Marker clustering for dense areas (cluster count shown)
3. Map bounds filter applied to search results
4. User geolocation with permission prompt
5. Business card preview on marker click
6. "Re-center to my location" button
7. Support satellite and standard map views

**Acceptance Criteria**
- [ ] Map initializes centered on user location or default city
- [ ] Markers update within 500ms of map movement (debounced)
- [ ] Clustering activates at zoom level < 13
- [ ] Business card shows: name, rating, price range, next availability
- [ ] Map and list views are synchronized (same results)
- [ ] Mobile: full-screen map with bottom sheet for results

---

### 2.5 Business Detail View
**Priority**: P0

**User Stories**
- As a customer, I want to view comprehensive business information before booking
- As a customer, I want to see all available services and their details
- As a customer, I want to see photos, hours, and policies

**Functional Requirements**
1. Hero section: business name, rating, review count, favorite toggle, share
2. Photo gallery (up to 10 images, lightbox on click)
3. Business info: address, phone, website, hours (today's hours highlighted)
4. Service menu with categories, pricing, duration
5. Staff/professional list with specialties
6. Reviews summary (average, distribution) and recent reviews
7. Location map (static or interactive)
8. "Book Now" sticky CTA on mobile

**Acceptance Criteria**
- [ ] Page loads in < 2 seconds with lazy-loaded images
- [ ] Service selection initiates booking flow
- [ ] Hours display in user's timezone with "Open now" / "Closed" indicator
- [ ] Phone number triggers tel: link, address opens maps
- [ ] Share generates deep link with preview metadata
- [ ] Reviews paginated (10 per page) with "Helpful" voting

---

### 2.6 Service Categories
**Priority**: P0

**User Stories**
- As a customer, I want to browse services by category to find what I need
- As a business owner, I want to categorize my services for discoverability

**Functional Requirements**
1. Hierarchical categories: Hair, Nails, Face, Body, Massage, Medical Aesthetic
2. Subcategories: e.g., Hair > Cut, Color, Styling, Treatment
3. Category icons and color coding
4. Trending/featured categories on homepage
5. Business can assign multiple categories

**Acceptance Criteria**
- [ ] Category tree renders to 3 levels deep
- [ ] Category filter shows active state with result count
- [ ] Uncategorized services hidden from browse
- [ ] Category management in business portal with drag-and-drop ordering

---

### 2.7 Booking Flow
**Priority**: P0 — Critical Path

**User Stories**
- As a customer, I want to book an appointment with my chosen service, provider, and time
- As a customer, I want to add multiple services to a single booking
- As a customer, I want to receive confirmation of my booking

**Functional Requirements**
1. **Step 1 — Service Selection**: Select service(s), see duration and price totals
2. **Step 2 — Provider Selection**: Choose specific professional or "no preference"
3. **Step 3 — Date & Time**: Calendar view with available slots (computed in real-time)
4. **Step 4 — Review & Confirm**: Summary with cancellation policy, payment method
5. **Step 5 — Payment**: Process payment or pay at venue (if business allows)
6. **Step 6 — Confirmation**: Booking reference, add to calendar, share

**Business Rules**
- Minimum booking notice: 2 hours (configurable per business)
- Maximum advance booking: 3 months
- Buffer time between appointments (configurable)
- Block bookings during business closed hours

**Acceptance Criteria**
- [ ] User completes booking in < 5 steps (excluding payment)
- [ ] Slot availability updates in real-time (pessimistic locking for 10 min hold)
- [ ] Multi-service booking calculates total duration and contiguous slots
- [ ] Guest onboarded with phone verification if not already done
- [ ] Confirmation email/SMS sent within 30 seconds
- [ ] Booking appears in user's appointments immediately
- [ ] Failed payment releases hold within 2 minutes

---

### 2.8 Appointment Management
**Priority**: P0

**User Stories**
- As a customer, I want to view my upcoming and past appointments
- As a customer, I want to reschedule or cancel my appointment
- As a business owner, I want to manage all appointments for my business

**Functional Requirements**
1. Customer view: list and calendar views, filter by status (upcoming, completed, cancelled)
2. Reschedule: select new slot, subject to same availability rules
3. Cancel: with reason selection, refund policy applied
4. Business owner view: daily/weekly calendar, staff filter, status management
5. Statuses: PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED_BY_CUSTOMER, CANCELLED_BY_BUSINESS, NO_SHOW
6. Actions: confirm, check-in, complete, cancel, reschedule, add notes

**Acceptance Criteria**
- [ ] Customer can reschedule up to 2 hours before appointment (configurable)
- [ ] Customer can cancel with full refund if > 24 hours before
- [ ] Business owner receives real-time notification on changes
- [ ] Calendar sync (Google/Apple) option available
- [ ] Appointment history searchable by business or service name

---

### 2.9 Favorites
**Priority**: P1

**User Stories**
- As a customer, I want to save my favorite businesses for quick access
- AsUi want to receive notifications about favorites (new availability, promotions)

**Functional Requirements**
1. Toggle favorite from business card or detail view
2. Favorites list with quick book and availability preview
3. Favorite count visible to business owners (aggregated, anonymous)
4. Optional: notify when favorite has last-minute availability

**Acceptance Criteria**
- [ ] Favorite/unfavorite toggles with optimistic UI update
- [ ] Favorites persist across sessions and devices
- [ ] Favorites list loads in < 1 second
- [ ] Maximum 200 favorites per user

---

### 2.10 User Profile
**Priority**: P1

**User Stories**
- As a user, I want to manage my personal information and preferences
- As a user, I want to manage my payment methods
- As a user, I want to view my activity history

**Functional Requirements**
1. Profile: name, email, phone, photo, birthday (for birthday offers)
2. Preferences: notification settings, default location, language, currency
3. Payment methods: add, remove, set default (Stripe integration)
4. Activity: bookings, reviews, favorites history
5. Data export and account deletion (GDPR compliance)

**Acceptance Criteria**
- [ ] Profile updates reflect immediately across app
- [ ] Phone change requires re-verification
- [ ] Account deletion initiates 30-day grace period with recovery option
- [ ] Data export delivers all user data within 24 hours

---

### 2.11 Availability & Slot Computation
**Priority**: P0 — Core Engine

**User Stories**
- As a business owner, I want to define my working hours and breaks
- As a business owner, I want to block specific times for vacation or personal reasons
- As a customer, I want to see only genuinely available slots

**Functional Requirements**
1. **Business Hours**: Weekly recurring schedule with exceptions
2. **Breaks**: Lunch, cleaning, staff meetings (recurring or one-off)
3. **Time Off**: Date ranges with reason
4. **Slot Generation**:
   - Compute available slots based on service duration + buffer
   - Respect existing bookings (pessimistic locking during checkout)
   - Support variable service durations
   - Handle multi-service bookings (contiguous slot finding)
5. **Optimization**: Cache computed slots for 5 minutes, invalidate on booking change

**Algorithm Requirements**
- Generate slots in business timezone, display in user timezone
- Round to nearest 15-minute increments
- Respect staff-specific schedules and skills

**Acceptance Criteria**
- [ ] Slot computation for 30 days completes in < 100ms
- [ ] Concurrent booking requests for same slot: first succeeds, others get next available
- [ ] Timezone conversion accurate for all global timezones
- [ ] DST transitions handled correctly
- [ ] Cache hit rate > 80% for popular businesses

---

### 2.12 Shared Types & Design System
**Priority**: P0 (Foundation)

**Requirements**
1. **Design Tokens**: Colors, typography, spacing, shadows, breakpoints
2. **Component Library**: Buttons, inputs, cards, modals, date picker, time slot grid, calendar
3. **Icons**: Consistent icon set (Lucide or similar)
4. **Animations**: Page transitions, loading states, micro-interactions
5. **Accessibility**: WCAG 2.1 AA compliance, keyboard navigation, screen reader support
6. **Responsive**: Mobile-first, breakpoints at 640px, 768px, 1024px, 1280px

**Acceptance Criteria**
- [ ] All UI components documented in Storybook
- [ ] Color contrast ratios meet WCAG standards
- [ ] Touch targets minimum 44x44px on mobile
- [ ] Reduced motion preference respected
- [ ] Components tested across iOS Safari, Android Chrome, desktop browsers

---

### 2.13 Reviews & Ratings
**Priority**: P1

**User Stories**
- As a customer, I want to read honest reviews before booking
- As a customer, I want to leave feedback after my appointment
- As a business owner, I want to respond to reviews

**Functional Requirements**
1. Review eligibility: verified customers only, within 14 days of appointment
2. Rating: 1-5 stars with half-star precision
3. Review content: title, body (min 20 chars), photos (up to 5)
4. Categories: service quality, ambiance, staff professionalism, value
5. Business response with notification to reviewer
6. Flag inappropriate reviews for admin review
7. Review helpfulness voting

**Acceptance Criteria**
- [ ] Only completed appointment customers can review
- [ ] One review per appointment, editable for 48 hours
- [ ] Business response displays within 24 hours of posting
- [ ] Flagged reviews hidden pending moderation
- [ ] Average rating recalculates in real-time

---

### 2.14 Payment Integration
**Priority**: P0

**User Stories**
- As a customer, I want to pay securely for my bookings
- As a business owner, I want to receive payouts for completed appointments
- As a customer, I want to save my payment method for faster checkout

**Functional Requirements**
1. **Payment Methods**: Credit/debit cards (Stripe), Apple Pay, Google Pay
2. **Payment Timing**: Pay now (full) or pay at venue (business configurable)
3. **Deposits**: Partial payment option (e.g., 20% to secure booking)
4. **Refunds**: Automated based on cancellation policy, manual override by business
5. **Payouts**: Weekly to business bank account, minus platform fee
6. **Invoices**: Generated automatically, downloadable as PDF

**Financial Rules**
- Platform fee: 10% per transaction (configurable)
- Stripe processing fee: passed through at cost
- Minimum payout: €10
- Hold period: 7 days after appointment completion

**Acceptance Criteria**
- [ ] Payment intent created and confirmed with 3D Secure where required
- [ ] Failed payment provides clear error and retry option
- [ ] Refund processed within 5-10 business days to original payment method
- [ ] Business owner sees pending and available balance
- [ ] PCI compliance maintained (no card data stored locally)

---

### 2.15 Notifications
**Priority**: P1

**User Stories**
- As a user, I want to receive timely updates about my bookings
- As a business owner, I want to be notified of new bookings and changes

**Functional Requirements**
1. **Channels**: Push (mobile), email, SMS (critical only)
2. **Customer Events**: Booking confirmed, reminder (24h, 2h), changed, cancelled, review prompt
3. **Business Events**: New booking, cancellation, rescheduling, low inventory alert
4. **Preferences**: Granular opt-in/opt-out per channel and event type
5. **Templates**: Branded, localized, with deep links

**Acceptance Criteria**
- [ ] Push notification delivers in < 5 seconds for real-time events
- [ ] Email deliverability rate > 95%
- [ ] SMS sent only for same-day critical updates
- [ ] Unsubscribe link functional in all emails
- [ ] Notification history accessible in app

---

### 2.16 Provider / Business Owner Portal
**Priority**: P0

**User Stories**
- As a business owner, I want to manage my business profile and services
- As a business owner, I want to manage my staff and their schedules
- As a business owner, I want to view analytics and financial reports

**Functional Requirements**
1. **Dashboard**: Today's appointments, revenue snapshot, recent reviews, quick actions
2. **Calendar Management**: Day/week/month views, drag-to-reschedule, bulk actions
3. **Service Management**: CRUD services, pricing, duration, categories, photos
4. **Staff Management**: Add professionals, set schedules, assign services, permissions
5. **Business Settings**: Hours, booking rules, cancellation policy, payment settings
6. **Analytics**: Bookings, revenue, customer retention, popular services, peak hours
7. **Customer Management**: Customer list, notes, visit history, marketing tags

**Acceptance Criteria**
- [ ] Dashboard loads in < 2 seconds
- [ ] Calendar supports concurrent multi-staff view
- [ ] Service changes reflect immediately in customer search
- [ ] Analytics exportable to CSV/Excel
- [ ] Role-based access: Owner, Manager, Staff (view-only own calendar)

---

### 2.17 Admin Dashboard
**Priority**: P1

**User Stories**
- As an admin, I want to oversee platform health and user activity
- As an admin, I want to manage business onboarding and verification
- As an admin, I want to handle disputes and content moderation

**Functional Requirements**
1. **Overview**: KPIs, active users, bookings, revenue, growth trends
2. **Business Management**: Onboarding workflow, verification status, suspension
3. **User Management**: Customer accounts, search, support actions
4. **Content Moderation**: Review flagged content, approve/reject
5. **Financial Oversight**: Transaction monitoring, refund approval, payout management
6. **System Health**: Error rates, API performance, job queue status
7. **Configuration**: Global settings, feature flags, notification templates

**Acceptance Criteria**
- [ ] Real-time metrics update every 30 seconds
- [ ] Business verification workflow: submitted → under review → approved/rejected
- [ ] Suspended businesses hidden from search immediately
- [ ] Audit log for all admin actions
- [ ] Role-based admin permissions (super admin, support, finance, ops)

---

### 2.18 Background Jobs (BullMQ)
**Priority**: P1 — Infrastructure

**User Stories**
- As a system, I want to process non-critical tasks asynchronously
- As a user, I want reliable delivery of notifications and emails

**Functional Requirements**
1. **Job Types**:
   - `send-email`: Transactional emails with retry (3 attempts, exponential backoff)
   - `send-sms`: SMS via Twilio with delivery tracking
   - `send-push`: Firebase/OneSignal push notifications
   - `process-payment`: Idempotent payment processing
   - `generate-invoice`: PDF generation and storage
   - `sync-calendar`: Google/Outlook calendar sync
   - `cleanup-expired-holds`: Release uncompleted booking holds
   - `analytics-aggregation`: Daily rollup of metrics
   - `reminder-notifications`: Scheduled appointment reminders

2. **Queue Configuration**:
   - Priority queues: critical, high, normal, low
   - Delayed jobs for scheduled reminders
   - Repeatable jobs for recurring tasks
   - Dead letter queue for failed jobs after max retries

3. **Monitoring**: Job success/failure rates, processing time, queue depth alerts

**Acceptance Criteria**
- [ ] Job processed within 30 seconds of enqueue (normal priority)
- [ ] Failed jobs retried 3x with jitter, then moved to DLQ
- [ ] Delayed jobs execute within 1 minute of scheduled time
- [ ] Queue depth alerts trigger at > 1000 pending jobs
- [ ] Job idempotency prevents duplicate processing
- [ ] Graceful shutdown: finish in-progress jobs before process exit

---

## 3. Non-Functional Requirements

### 3.1 Performance
- API response time: p95 < 200ms for cached, < 500ms for computed
- Page load: First Contentful Paint < 1.5s, Largest Contentful Paint < 2.5s
- Time to Interactive < 3.5s on 4G

### 3.2 Security
- OWASP Top 10 mitigation
- Rate limiting on all public endpoints
- Input validation and sanitization
- SQL injection prevention via ORM parameterized queries
- XSS protection via output encoding
- CSRF tokens for state-changing operations

### 3.3 Scalability
- Horizontal scaling of API servers
- Database read replicas for search queries
- Redis cluster for session and cache storage
- CDN for static assets and images

### 3.4 Compliance
- GDPR: consent management, data portability, right to erasure
- PCI-DSS: via Stripe hosted fields
- Accessibility: WCAG 2.1 AA

---

## 4. Release Phases

### Phase 1 (MVP) — Weeks 1-6
- User Authentication (email + Google)
- Guest Browse & Explore
- Business Search & Discovery (text + filters)
- Business Detail View
- Service Categories
- Booking Flow (pay at venue only)
- Appointment Management (customer + basic business)
- Availability & Slot Computation
- Shared Types & Design System

### Phase 2 — Weeks 7-10
- Map-based Search
- Favorites
- User Profile
- Reviews & Ratings
- Payment Integration (full)
- Notifications (push + email)
- Business Owner Portal (complete)

### Phase 3 — Weeks 11-14
- Admin Dashboard
- Background Jobs (BullMQ)
- Advanced Analytics
- Social Login (Facebook)
- Calendar Sync
- Marketing Tools

---

## 5. Appendix

### 5.1 Glossary
- **Slot**: A time period available for booking, defined by start time and duration
- **Hold**: Temporary reservation of a slot during checkout (10 minutes)
- **Buffer**: Mandatory gap between consecutive appointments

### 5.2 Revision History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-01-15 | Alex (PO) | Initial specification |

---

*This document is a living specification. All changes require PO approval and developer impact assessment.*
