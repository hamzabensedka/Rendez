# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first marketplace connecting customers with local service businesses (salons, barbershops, clinics, etc.) for appointment booking. The platform serves three user types: **Customers** (book appointments), **Providers** (manage business and availability), and **Admin** (platform oversight).

---

## 2. User Personas

| Persona | Goal | Frustration |
|---------|------|-------------|
| Busy Customer | Book services quickly, anytime | Can't find available slots; phone tag with businesses |
| Salon Owner | Fill calendar, reduce no-shows | Manual booking, last-minute cancellations |
| Platform Admin | Ensure quality, scale operations | Fraud, disputes, content moderation |

---

## 3. Feature Specifications

### 3.1 User Authentication
**Priority:** P0 | **Owner:** Backend/Security

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| AUTH-01 | Email/password registration | User receives verification email; account inactive until verified |
| AUTH-02 | Social login (Google, Apple) | OAuth 2.0 flow; account linking if email matches existing |
| AUTH-03 | JWT-based session management | Access token (15min), refresh token (7 days); secure httpOnly cookies |
| AUTH-04 | Password reset | Secure token via email; expires in 1 hour |
| AUTH-05 | Role-based access (customer/provider/admin) | Middleware enforces role guards on all protected routes |
| AUTH-06 | Account deletion (GDPR) | Soft delete with 30-day grace; full purge after grace period |

**Non-functional:** Rate limit auth endpoints to 5 attempts/minute per IP.

---

### 3.2 Guest Browse & Explore
**Priority:** P0 | **Owner:** Frontend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| GUEST-01 | View businesses without account | Read-only access to search, listings, basic business info |
| GUEST-02 | Prompt to login on booking attempt | Modal appears; preserve intent (deep link post-auth) |
| GUEST-03 | Guest session tracking | Anonymous ID stored; merge to account upon registration |

---

### 3.3 Business Search & Discovery
**Priority:** P0 | **Owner:** Full Stack

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| SEARCH-01 | Text search (business name, service) | Fuzzy matching; results ranked by relevance + proximity + rating |
| SEARCH-02 | Filter by: category, price range, rating, open now | Multi-select filters; URL-synced for shareability |
| SEARCH-03 | Sort by: recommended, distance, rating, price (low/high) | Default: recommended algorithm |
| SEARCH-04 | Pagination | Cursor-based; 20 results per page |
| SEARCH-05 | Search suggestions | Autocomplete with recent searches; debounced (300ms) |

**Algorithm:** Recommended = 0.4×rating + 0.3×proximity + 0.2×completion_rate + 0.1×recency.

---

### 3.4 Map-based Search
**Priority:** P0 | **Owner:** Frontend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| MAP-01 | Interactive map with business pins | Clustering at zoom levels; tap pin shows business card |
| MAP-02 | Current location detection | Permission prompt; fallback to city center |
| MAP-03 | Radius filter | Adjustable 1-50km; real-time result update |
| MAP-04 | List/map toggle | Persist user preference; smooth transition |
| MAP-05 | Business detail navigation | Tap card → full detail view with back navigation preserved |

---

### 3.5 Business Detail View
**Priority:** P0 | **Owner:** Full Stack

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| BIZ-01 | Header: name, photos (carousel), rating, favorite toggle | Max 10 photos; lazy loading; aspect ratio 16:9 |
| BIZ-02 | Services list with pricing and duration | Group by category; expand/collapse |
| BIZ-03 | Operating hours | Weekly schedule; "Open now" indicator with next closing time |
| BIZ-04 | Location with address, directions link | Deep link to native maps app |
| BIZ-05 | Contact: phone (click-to-call), social links | Validate URLs; track click events |
| BIZ-06 | Reviews summary + recent reviews | Average rating, distribution histogram; paginated reviews |
| BIZ-07 | "Book Now" CTA | Sticky bottom button; scrolls to services if tapped |

---

### 3.6 Service Categories
**Priority:** P0 | **Owner:** Backend/Admin

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| categories-01 | Hierarchical categories | 2-level depth (e.g., Beauty → Hair, Nails, Spa) |
| CATEG-02 | Category icons and display names | Configurable via admin; i18n ready |
| CATEG-03 | Business-category many-to-many | Business can belong to multiple categories |
| CATEG-04 | Category-based search filtering | OR logic within level, AND across levels |

**Seed Categories:** Beauty, Wellness, Health, Fitness, Automotive, Home Services, Education, Pet Services.

---

### 3.7 Booking Flow
**Priority:** P0 | **Owner:** Full Stack

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| BOOK-01 | Select service(s) | Single or multiple services; total duration and price computed |
| BOOK-02 | Select staff member (optional) | "Any" option; show staff photo and rating |
| BOOK-03 | Select date → view available slots | Calendar view; only show dates with availability |
| BOOK-04 | Select time slot | 15-min interval display; slot duration matches service |
| BOOK-05 | Add notes (optional) | Max 500 characters |
| BOOK-06 | Review and confirm | Summary screen with all details; editable before confirm |
| BOOK-07 | Booking confirmation | Unique booking code; add to calendar option; in-app confirmation |
| BOOK-08 | Hold slot during checkout | 10-minute hold; release if payment not completed |

**State Machine:** `pending_hold → held → confirmed → completed/cancelled/no_show`

---

### 3.8 Appointment Management
**Priority:** P0 | **Owner:** Full Stack

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| APPT-01 | Customer: view upcoming/past appointments | Tabbed view; pull-to-refresh |
| APPT-02 | Customer: reschedule (up to 2 hours before) | New slot availability check; single reschedule per booking |
| APPT-03 | Customer: cancel with reason | Up to 2 hours before; cancellation policy displayed |
| APPT-04 | Customer: rebook past appointment | One-tap rebook with same service/staff |
| APPT-05 | Provider: view daily/weekly calendar | Agenda and calendar views; color-coded by status |
| APPT-06 | Provider: block/unblock slots | Ad-hoc availability changes; recurring exceptions |
| APPT-07 | Provider: mark no-show | Post-appointment status update; triggers customer flag |
| APPT-08 | Provider: add walk-in appointment | Manual entry; bypasses online availability |

**Cancellation Policy:** Free cancellation >24h; 50% charge 2-24h; non-refundable <2h (configurable per business).

---

### 3.9 Favorites
**Priority:** P1 | **Owner:** Frontend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FAV-01 | Toggle favorite from business detail | Heart icon; optimistic UI update |
| FAV-02 | View favorites list | Grid view; sorted by recently added; offline cached |
| FAV-03 | Quick rebook from favorites | Deep link to booking flow with pre-selected business |
| FAV-04 | Sync across devices | Real-time via WebSocket; merge on conflict |

---

### 3.10 User Profile
**Priority:** P1 | **Owner:** Full Stack

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| PROF-01 | View/edit personal info | Name, phone, email (verification required for change), photo |
| PROF-02 | Notification preferences | Push, email, SMS toggles per event type |
| PROF-03 | Payment methods management | Stripe customer portal integration; default payment method |
| PROF-04 | Booking history | Searchable; filter by status, date range |
| PROF-05 | Addresses (for home services) | Multiple saved addresses; geocoded for provider routing |

---

### 3.11 Availability & Slot Computation
**Priority:** P0 | **Owner:** Backend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| SLOT-01 | Weekly recurring schedule | Day-based: start time, end time, breaks (multiple per day) |
| SLOT-02 | Exception dates (holidays, time off) | Override recurring schedule; bulk import support |
| SLOT-03 | Slot generation algorithm | Generate 15-min slots respecting service duration + buffer |
| SLOT-04 | Real-time availability | Slots exclude confirmed bookings and holds; cache with 5s TTL |
| SLOT-05 | Staff-specific availability | Each staff member has independent schedule |
| SLOT-06 | Service concurrency rules | Room/equipment constraints; max parallel bookings |
| SLOT-07 | Timezone handling | All times stored in UTC; display in business customer's local timezone |

**Algorithm:** For requested date, generate candidate slots from schedule → subtract existing appointments and active holds → subtract breaks → filter by service duration fit → return available start times.

---

### 3.12 Shared Types & Design System
**Priority:** P0 | **Owner:** Frontend Lead

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| DESIGN-01 | Component library | Storybook; 100% coverage of atomic components |
| DESIGN-02 | Theme system | Light/dark mode; brand color injection per business tier |
| DESIGN-03 | Typography scale | 6 levels; responsive; accessibility compliant (WCAG 2.1 AA) |
| DESIGN-04 | Spacing system | 4px base grid; consistent across platforms |
| DESIGN-05 | Shared TypeScript types | Monorepo shared package; strict null checks |
| DESIGN-06 | Form validation patterns | Zod schemas; reusable error display |
| DESIGN-07 | Loading and error states | Skeleton screens; retry mechanisms; empty states |

---

### 3.13 Reviews & Ratings
**Priority:** P1 | **Owner:** Full Stack

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REV-01 | Post-review after completed appointment | Eligible 24h after appointment; reminder notification |
| REV-02 | Star rating (1-5) + text review | Minimum 10 characters for text; optional photo |
| REV-03 | Business owner response | Public reply; notification to reviewer |
| REV-04 | Review moderation | Auto-flag profanity; admin queue for reported reviews |
| REV-05 | Review helpfulness voting | Sort by helpful; prevent self-voting |
| REV-06 | Aggregate rating display | Bayesian average for businesses with <10 reviews |

---

### 3.14 Payment Integration
**Priority:** P0 | **Owner:** Backend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| PAY-01 | Stripe integration for card payments | PCI-compliant; Stripe Elements for card capture |
| PAY-02 | Payment at booking vs. at venue | Configurable per business; clearly communicated |
| PAY-03 | Deposit/partial payment support | Percentage or fixed amount; remainder at venue |
| PAY-04 | Refund processing | Automated per cancellation policy; manual override by admin |
| PAY-05 | Provider payout | Weekly to connected Stripe account; transaction fee deduction |
| PAY-06 | Invoice/receipt generation | PDF emailed; available in app |
| PAY-07 | Failed payment handling | Retry once; auto-cancel if persistent |

---

### 3.15 Notifications
**Priority:** P1 | **Owner:** Full Stack

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| NOTIF-01 | Push notifications (Firebase) | Booking confirmations, reminders (24h, 2h before), promotions |
| NOTIF-02 | Email notifications (SendGrid) | Transactional: booking, cancellation, receipt; digest: weekly |
| NOTIF-03 | SMS reminders (Twilio) | Configurable; for high-value bookings or 24h before |
| NOTIF-04 | In-app notification center | Grouped by date; unread badge; deep link to relevant screen |
| NOTIF-05 | Preference management | Granular toggles per channel and event type |
| NOTIF-06 | Quiet hours | No push 22:00-08:00 local time; exceptions for urgent |

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0 | **Owner:** Full Stack

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| PORTAL-01 | Business profile management | Edit all fields; photo upload; preview before publish |
| PORTAL-02 | Service catalog management | CRUD services; set duration, price, description; archive option |
| PORTAL-03 | Staff management | Add staff profiles; assign services; manage permissions |
| PORTAL-04 | Availability management | Weekly template + exceptions; bulk edit; copy week |
| PORTAL-05 | Appointment dashboard | Day/week/month views; status filters; quick actions |
| PORTAL-06 | Customer notes | Internal notes per customer; visible to all staff |
| PORTAL-07 | Analytics overview | Bookings, revenue, cancellation rate, top services; date range filter |
| PORTAL-08 | Subscription/billing | View plan; upgrade/down Winds; payment method update |

---

### 3.17 Admin Dashboard
**Priority:** P1 | **Owner:** Full Stack

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| ADMIN-01 | User management | Search, view, suspend/activate accounts; audit log |
| ADMIN-02 | Business onboarding approval | Review submitted businesses; approve/reject with reason |
| ADMIN-03 | Content moderation | Review flagged reviews, photos; remove with reason |
| ADMIN-04 | Financial overview | Platform revenue, payouts pending, disputes; export CSV |
| ADMIN-05 | Dispute resolution | View payment disputes; issue refunds; communicate with parties |
| ADMIN-06 | System health monitoring | Queue depths, error rates, API latency; alert thresholds |
| ADMIN-07 | Promotional campaigns | Create discount codes; target by user segment; track redemption |

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P0 | **Owner:** Backend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| QUEUE-01 | Booking confirmation emails | Job queued on booking creation; retry 3x with backoff |
| QUEUE-02 | Appointment reminders | Scheduled at 24h and 2h before; timezone-aware |
| QUEUE-03 | Slot hold expiration | Job scheduled at hold + 10min; idempotent release |
| QUEUE-04 | Payment processing | Async for reliability; webhook handling for Stripe events |
| QUEUE-05 | Search index updates | On business/service change; debounced 5s |
| QUEUE-06 | Analytics aggregation | Nightly jobs for dashboards; incremental updates |
| QUEUE-07 | Image processing | Resize uploads; generate thumbnails; WebP conversion |
| QUEUE-08 | Dead letter queue | Failed jobs after max retries; manual retry UI in admin |

**Infrastructure:** Redis cluster; separate queues by priority; monitoring via Bull Board.

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | App launch <2s; page load <1s; API response <200ms (p95) |
| Scalability | Horizontal scaling; 10k concurrent users at launch |
| Security | OWASP Top 10 mitigation; annual penetration testing |
| Accessibility | WCAG 2.1 AA; screen reader support; dynamic type |
| i18n | French (default), English; RTL-ready architecture |
| Offline | Browse cached data; queue actions for sync |

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Monthly Bookings | 10,000 by month 6 |
| Booking Completion Rate | >70% from cart start |
| Provider NPS | >50 |
| App Store Rating | >4.5 |
| Customer Retention (30d) | >40% |

---

## 6. Release Plan

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Search, Booking, Provider Portal, Payments, Slots | 8 weeks |
| v1.1 | Reviews, Favorites, Notifications, Map | +4 weeks |
| v1.2 | Admin Dashboard, Analytics, Background Jobs optimization | +4 weeks |
| v2.0 | AI recommendations, Loyalty program, Marketplace features | Q2+ |

---

*Document Version: 1.0 | Last Updated: 2024 | Owner: Alex (Product Owner)*