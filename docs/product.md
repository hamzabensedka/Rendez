# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first platform connecting customers with local service businesses (salons, barbershops, spas, clinics) for appointment booking. The platform serves three user types: **Customers** (book appointments), **Providers** (manage businesses), and **Admins** (platform oversight).

---

## 2. User Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Customer** | Wants to discover and book local services quickly | Find, compare, book, manage appointments |
| **Guest** | Unregistered user exploring the platform | Browse without commitment |
| **Provider** | Business owner/manager | Manage schedule, services, staff, revenue |
| **Admin** | Platform operator | Monitor, moderate, optimize |

---

## 3. Feature Specifications

### 3.1 User Authentication
**Priority:** P0 | **Owner:** Product / Backend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| AUTH-001 | Phone number registration with OTP | User receives SMS OTP within 30 seconds; 3 retry attempts allowed |
| AUTH-002 | Email/password registration | Valid email format; password ≥8 chars with 1 uppercase, 1 number, 1 special char |
| AUTH-003 | Social login (Google, Apple) | OAuth 2.0 flow; account linking if email exists |
| AUTH-004 | JWT token management | Access token 15min expiry; refresh token 7 days; silent refresh on app foreground |
| AUTH-005 | Biometric login (Face ID / Fingerprint) | Optional opt-in; fallback to PIN |
| AUTH-006 | Account deletion (GDPR) | Self-service deletion with 30-day grace period; data purge confirmation email |
| AUTH-007 | Password reset | Secure token via email; 1-hour expiry |

**Technical Notes:** Implement rate limiting (5 attempts/minute). Store hashed passwords with bcrypt (cost factor 12).

---

### 3.2 Guest Browse & Explore
**Priority:** P0 | **Owner:** Product / Mobile

| ID | Requirement | Acceptance Criteria
|----|-------------|---------------------|
| GUEST-001 | Browse businesses without account | Full search and filter access; booking requires auth |
| GUEST-002 | Persistent session for 24 hours | Guest ID stored locally; preferences retained |
| GUEST-003 | Prompt auth at booking intent | Non-blocking modal; dismissible with "Continue as Guest" option (limited to 3 times) |
| GUEST-004 | Convert guest data on signup | Favorites, search history, pending bookings migrate to new account |

---

### 3.3 Business Search & Discovery
**Priority:** P0 | **Owner:** Product / Search Team

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| SEARCH-001 | Text search by business name, service, or keyword | Results in <200ms; typo tolerance (fuzzy matching); search history persisted |
| SEARCH-002 | Filter by: category, price range, rating (≥), availability today, distance | Multiple filters combinable; filter count badge on UI |
| SEARCH-003 | Sort by: relevance, distance, rating, price (low-high), availability | Default: relevance; user preference persisted |
| SEARCH-004 | Auto-complete suggestions | Top 5 suggestions; categories and businesses mixed; debounced 300ms |
| SEARCH-005 | Recent searches | Last 10 searches; clear all option; tap to re-execute |
| SEARCH-006 | Trending / popular searches | Admin-configurable; refresh weekly |

---

### 3.4 Map-based Search
**Priority:** P0 | **Owner:** Product / Mobile

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| MAP-001 | Interactive map with business pins | Default zoom: 2km radius; cluster pins at < zoom level 12 |
| MAP-002 | User location centering | Request permission on first use; fallback to city center; blue dot accuracy indicator |
| MAP-003 | Business card on pin tap | Show: name, rating, price from, next availability; tap for full detail |
| MAP-004 | List/map toggle | Persist user preference; smooth transition animation |
| MAP-005 | Area search (move map, search here) | "Search this area" button appears on pan; execute on tap |
| MAP-006 | Directions integration | Open native maps app (Google/Apple) with pre-filled destination |

---

### 3.5 Business Detail View
**Priority:** P0 | **Owner:** Product / Mobile

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| BIZ-001 | Hero: name, photos (carousel), rating, review count, favorite toggle | Up to 10 photos; pinch-to-zoom; video support (max 30s) |
| BIZ-002 | Quick info: address, hours, phone, website | Tap to call; tap to open website in-app browser; hours show "Open now/next" status |
| BIZ-003 | Services list with pricing | Grouped by category; expandable; from/to pricing; duration |
| BIZ-004 | Staff/professional selection | Show available staff; photo, name, specialty, rating |
| BIZ-005 | Reviews summary and detail | Average rating, distribution histogram; sort by newest/most helpful; flag inappropriate |
| BIZ-006 | Similar businesses carousel | Max 5; same category, nearby |
| BIZ-007 | Share business | Native share sheet; deep link generation |

---

### 3.6 Service Categories
**Priority:** P0 | **Owner:** Product / Backend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| CAT-001 | Hierarchical category system | 2 levels: Category (e.g., Hair) → Subcategory (e.g., Haircut, Coloring) |
| CAT-002 | Icon + color per category | Consistent design system; accessible color contrast (WCAG AA) |
| CAT-003 | Category-based discovery | Home screen category grid; trending in category |
| CAT-004 | Admin-managed category taxonomy | CRUD in admin; ability to merge, split, deprecate with migration |
| CAT-005 | Business self-categorization | Select up to 3 primary categories; affects search ranking |

---

### 3.7 Booking Flow
**Priority:** P0 | **Owner:** Product / Core Team

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| BOOK-001 | Service selection | Single or multiple services; total duration and price calculated |
| BOOK-002 | Staff selection (optional) | "Any available" default; show staff-specific pricing if different |
| BOOK-003 | Date and time slot selection | Calendar view (2-week horizon default); available slots highlighted; unavailable grayed |
| BOOK-004 | Real-time slot availability | Slots computed on request; 5-minute hold on selection (see 3.11) |
| BOOK-005 | Guest information capture | Name, phone, email; optional notes (max 500 chars); preference save |
| BOOK-006 | Booking confirmation | Summary screen; terms acceptance; confirm action |
| BOOK-007 | Confirmation screen with details | Booking reference, calendar invite, add to wallet, share |
| BOOK-008 | Booking modification (customer) | Reschedule/cancel per business policy; push notification to provider |

**Booking States:** `PENDING_HOLD` → `CONFIRMED` → `COMPLETED` / `CANCELLED_BY_CUSTOMER` / `CANCELLED_BY_PROVIDER` / `NO_SHOW`

---

### 3.8 Appointment Management
**Priority:** P0 | **Owner:** Product / Mobile

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| APT-001 | Upcoming appointments list | Chronological; next appointment highlighted; pull-to-refresh |
| APT-002 | Past appointments history | Last 2 years; rebook shortcut; review prompt for unrated |
| APT-003 | Appointment detail view | Full info: business, services, staff, time, status, actions |
| APT-004 | Reschedule flow | New slot selection; business policy check; confirmation |
| APT-005 | Cancel with reason | Predefined reasons + other; cancellation policy displayed; refund status |
| APT-006 | Add to calendar | iCal/ICS generation; native calendar integration |

---

### 3.9 Favorites
**Priority:** P1 | **Owner:** Product / Mobile

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FAV-001 | Toggle favorite from business detail | Heart icon; haptic feedback; animation |
| FAV-002 | Favorites list | Grid/list view; sort by: recently added, name, distance |
| FAV-003 | Quick book from favorite | Direct to booking flow with business pre-selected |
| FAV-004 | Availability notifications | Opt-in per favorite: "Notify when next available" |
| FAV-005 | Sync across devices | Real-time via WebSocket; offline queue |

---

### 3.10 User Profile
**Priority:** P1 | **Owner:** Product / Mobile

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| PROF-001 | Profile info: photo, name, phone, email | Photo crop to circle; editable fields; verification status |
| PROF-002 | Notification preferences | Push, SMS, email toggles per type (bookings, promotions, reminders) |
| PROF-003 | Payment methods management | Add, remove, set default; PCI-compliant tokenization |
| PROF-004 | Privacy settings | Data download request; marketing opt-out; location history clear |
| PROF-005 | Referral code | Unique code; share sheet; tracking of credits earned |

---

### 3.11 Availability & Slot Computation
**Priority:** P0 | **Owner:** Product / Backend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| SLOT-001 | Business-defined operating hours | Day-level granularity; exception dates (holidays, closures) |
| SLOT-002 | Staff-specific schedules | Override business hours; recurring patterns; one-off adjustments |
| SLOT-003 | Service duration mapping | Fixed or variable duration; buffer time between appointments |
| SLOT-004 | Real-time slot computation | Query-time calculation considering: existing bookings, staff availability, service duration, concurrent service limits |
| SLOT-005 | Optimistic hold mechanism | 5-minute hold on slot selection; release on timeout or abandonment; webhook on confirm |
| SLOT-006 | Waitlist for fully booked days | User notified if slot opens; auto-book option if configured |
| SLOT-007 | Performance: <100ms slot query | Redis caching; pre-computed availability windows |

**Algorithm:** Slot generation = (Operating Hours ∩ Staff Schedule) − Existing Bookings − Buffers. Consider parallel services (e.g., manicure + pedicure simultaneous).

---

### 3.12 Shared Types & Design System
**Priority:** P0 | **Owner:** Design / Frontend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| DS-001 | Component library | Buttons, inputs, cards, modals, date picker, time picker, skeleton loaders |
| DS-002 | Color tokens | Primary (#0066FF), Success, Warning, Error, Neutral scales; dark mode support |
| DS-003 | Typography scale | 6 levels; system fonts with fallbacks; dynamic type support |
| DS-004 | Spacing system | 4px base grid; consistent padding/margin tokens |
| DS-005 | Shared TypeScript types | Published package; versioned; auto-generated from API schema |
| DS-006 | Accessibility | Minimum 44pt touch targets; screen reader labels; reduce motion support |
| DS-007 | Animation standards | 200ms default duration; ease-in-out; meaningful motion only |

---

### 3.13 Reviews & Ratings
**Priority:** P1 | **Owner:** Product / Trust & Safety

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REV-001 | Post-review eligibility | Only verified customers (completed appointment); 14-day window |
| REV-002 | Rating dimensions | Overall (1-5); optional: service quality, staff, value, cleanliness |
| REV-003 | Review content | Text (max 1000 chars); optional photos (max 5); moderation before publish |
| REV-004 | Provider response | Public reply; notification to reviewer |
| REV-005 | Review helpfulness | Upvote; sort by helpful; report inappropriate |
| REV-006 | Rating recalculation | Weighted average (recent reviews weighted higher); updated on new review |

---

### 3.14 Payment Integration
**Priority:** P0 | **Owner:** Product / Payments

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| PAY-001 | Payment methods | Credit/debit (Stripe), Apple Pay, Google Pay; saved methods with CVC re-auth |
| PAY-002 | Pricing models | Pay in full, deposit (configurable %), pay at venue |
| PAY-003 | Cancellation refund policy | Business-configurable: full, partial (50%), or no refund by cutoff time |
| PAY-004 | Refund processing | Automated for policy-compliant cancellations; manual for disputes |
| PAY-005 | Receipt generation | PDF email; in-app accessible; itemized breakdown |
| PAY-006 | Provider payout | Weekly to connected account; dashboard reporting; tax document generation |
| PAY-007 | Failed payment handling | Retry with saved method; notify user; auto-cancel if unresolved in 24h |

---

### 3.15 Notifications
**Priority:** P1 | **Owner:** Product / Growth

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| NOT-001 | Push notifications | Booking confirmations, reminders (24h, 1h before), cancellations, promotions |
| NOT-002 | SMS fallback | For critical alerts when push not delivered; configurable by user |
| NOT-003 | Email notifications | Rich HTML; consistent branding; unsubscribe per category |
| NOT-004 | In-app notification center | Bell icon with badge; read/unread state; deep link to relevant screen |
| NOT-005 | Notification preferences | Granular toggles by category and channel |
| NOT-006 | Delivery tracking | Firebase/OneSignal integration; delivery receipt; failed delivery retry |

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0 | **Owner:** Product / B2B

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| PROV-001 | Dashboard overview | Today's appointments, revenue this week, upcoming week preview |
| PROV-002 | Appointment management | View, confirm, reschedule, cancel; block time; mark no-show |
| PROV-003 | Service catalog management | CRUD services; set duration, price, description, staff assignment |
| PROV-004 | Staff management | Add team members; set permissions (view only, manage, admin); individual schedules |
| PROV-005 | Availability configuration | Operating hours; breaks; time off; recurring patterns |
| PROV-006 | Customer database | Searchable list; booking history; notes (internal); marketing consent |
| PROV-007 | Revenue reporting | Daily/weekly/monthly views; export to CSV; payout status |
| PROV-008 | Review management | Respond to reviews; flag inappropriate; request review removal (with cause) |
| PROV-009 | Business profile editing | Photos, description, contact info, social links; preview before publish |
| PROV-010 | Mobile-responsive web app | Full functionality on tablet and phone; PWA support |

---

### 3.17 Admin Dashboard
**Priority:** P1 | **Owner:** Product / Operations

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| ADMIN-001 | User management | Search, view, suspend, delete accounts; audit log |
| ADMIN-002 | Business onboarding approval | KYC document review; verification workflow; rejection with reason |
| ADMIN-003 | Content moderation | Review flagged reviews/businesses; take action; appeal process |
| ADMIN-004 | Platform analytics | MAU, bookings, GMV, churn, top categories; date range filter; export |
| ADMIN-005 | Financial reports | Transaction volume, fees collected, payouts, refunds; reconciliation |
| ADMIN-006 | System health monitoring | API latency, error rates, queue depth; alert thresholds |
| ADMIN-007 | Promotional tools | Coupon code generation; featured business placement; push campaign creation |

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P0 | **Owner:** Engineering

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| JOB-001 | Job queue architecture | BullMQ with Redis; separate queues by priority and type |
| JOB-002 | Notification dispatch | Retry with exponential backoff (3 attempts); dead letter queue for failures |
| JOB-003 | Slot hold expiration | Cron: every minute; release held slots; notify waiting users |
| JOB-004 | Reminder scheduling | 24h and 1h before appointment; idempotent; reschedule on booking change |
| JOB-005 | Payout processing | Weekly batch; idempotent; reconciliation report generation |
| JOB-006 | Data exports | Async generation; email on completion; 24h expiry link |
| JOB-007 | Analytics aggregation | Nightly rollup of metrics; materialized view refresh |
| JOB-008 | Job monitoring dashboard | Bull Board or equivalent; retry, pause, resume operations |

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | App cold start <2s; screen load <1s; API response <200ms (p95) |
| **Reliability** | 99.9% uptime; graceful degradation; circuit breakers for external services |
| **Security** | OWASP Mobile Top 10 compliance; encryption at rest and in transit; annual penetration test |
| **Scalability** | Auto-scaling at 70% CPU; database read replicas; CDN for media |
| **Compliance** | GDPR, CCPA, PCI-DSS (Level 1); accessibility WCAG 2.1 AA |

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion rate | >15% (search to confirmed booking) |
| Day-7 retention | >30% |
| NPS | >50 |
| Provider response time | <2 hours for new bookings |
| Customer support tickets | <2% of bookings |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Search, Business Detail, Booking, Provider Portal, Payments | Week 1-8 |
| **V1.1** | Map, Favorites, Reviews, Notifications | Week 9-12 |
| **V1.2** | Admin Dashboard, Analytics, Promotions | Week 13-16 |
| **V2.0** | AI recommendations, Loyalty program, Marketplace | Week 17-24 |

---

*Document version: 1.0 | Last updated: 2024 | Owner: Alex, Product Owner*
