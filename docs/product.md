# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first platform connecting customers with local service businesses (beauty, wellness, health) for online appointment booking. The platform serves three user types: **Customers** (book appointments), **Business Owners** (manage business and appointments), and **Admin** (platform oversight).

---

## 2. User Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Customer** | Urban professional, 25-45, values convenience | Find, book, manage appointments quickly |
| **Guest** | Unregistered user exploring the platform | Browse services without commitment |
| **Business Owner** | Salon/spa owner or manager | Manage schedule, services, staff, revenue |
| **Admin** | Platform operator | Monitor health, resolve disputes, onboard businesses |

---

## 3. Feature Specifications

### 3.1 User Authentication
**Priority:** P0 | **Owner:** Backend / Mobile

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| AUTH-1 | Email/password registration | User can register with email, password, first/last name; password min 8 chars with uppercase, number, symbol; email verification required before booking |
| AUTH-2 | Social login (Google, Apple) | OAuth 2.0 flow; account linking if email exists; profile data pre-filled |
| AUTH-3 | Phone number verification | Optional SMS verification for account recovery; OTP expires in 10 min |
| AUTH-4 | JWT session management | Access token (15 min), refresh token (7 days); secure storage in mobile keychain |
| AUTH-5 | Password reset | Email link valid 1 hour; redirects to in-app reset screen |
| AUTH-6 | Biometric login | Face ID / Touch ID option after first successful password login |

**Business Rules:** One account per email; social accounts auto-verified; deleted accounts soft-deleted for 30 days.

---

### 3.2 Guest Browse & Explore
**Priority:** P0 | **Owner:** Mobile / Backend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| GUEST-1 | Unrestricted category browsing | Guest can view all service categories, featured businesses, and basic business info without login |
| GUEST-2 | Location-based content | Guest sees businesses near detected or selected city; prompt for location permission on first visit |
| GUEST-3 | Booking gate | Attempting to book triggers auth modal with option to continue as guest (phone-only booking) or register |
| GUEST-4 | Guest checkout | Guest can book with phone + name; booking linked to phone; account creation prompt post-booking |
| GUEST-5 | Session persistence | Guest preferences (location, recent views) stored locally; prompt to create account after 3rd visit |

---

### 3.3 Business Search & Discovery
**Priority:** P0 | **Owner:** Backend / Mobile

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| SEARCH-1 | Text search | Search by business name, service name, or description; results ranked by relevance, proximity, rating; debounced input (300ms) |
| SEARCH-2 | Filter system | Filters: category, price range, rating (4+), availability (today, this week), gender of staff, amenities; multi-select with chip UI |
| SEARCH-3 | Sort options | Relevance, nearest, highest rated, most reviewed, price (low-high) |
| SEARCH-4 | Search history | Store last 10 searches; suggest recent + trending searches |
| SEARCH-5 | Autocomplete | Suggest businesses, services, locations as user types; max 5 suggestions, 150ms response |
| SEARCH-6 | Empty states | No results show: nearby alternatives, popular categories, option to expand radius |

**Performance:** Search results < 500ms; pagination at 20 items.

---

### 3.4 Map-based Search
**Priority:** P0 | **Owner:** Mobile

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| MAP-1 | Interactive map view | Toggle between list and map; business pins clustered at zoom levels; tap pin shows bottom sheet preview |
| MAP-2 | Current location | Blue dot with accuracy ring; recenter button; follow mode option |
| MAP-3 | Dynamic bounds | Fetch businesses visible in current viewport; update on pan/zoom end (debounced 500ms) |
| MAP-4 | Pin information | Pin shows: business name, rating, price indicator, open/closed status; color-coded by category |
| MAP-5 | Directions | Tap "Directions" opens native maps app with pre-filled destination |
| MAP-6 | Radius search | Default 5km, adjustable 1-50km; show "search this area" button after significant pan |

---

### 3.5 Business Detail View
**Priority:** P0 | **Owner:** Mobile / Backend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| BIZ-1 | Hero section | Business name, photos (carousel, max 10), verified badge, favorite toggle |
| BIZ-2 | Key info | Address, phone, hours (today's hours + full schedule), website link, social links |
| BIZ-3 | Services list | Grouped by category; each shows: name, duration, description, price, staff who perform it |
| BIZ-4 | Staff profiles | Photo, name, bio, specialties, rating, years experience; filter services by staff |
| BIZ-5 | Reviews summary | Aggregate rating, rating distribution bar chart, total count; sort reviews by recent, highest, lowest |
| BIZ-6 | Action buttons | "Book Now" (primary), "Call" (tel link), "Share" (native share sheet), "Report" |
| BIZ-7 | Photo gallery | Full-screen gallery with pinch-zoom; upload date, caption if any |

---

### 3.6 Service Categories
**Priority:** P0 | **Owner:** Backend / Admin

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| CAT-1 | Hierarchical categories | Top level: Hair, Beauty, Wellness, Health, Fitness; 2-3 levels deep; admin-managed taxonomy |
| CAT-2 | Category icons | Consistent iconography per category; fallback generic icon |
| CAT-3 | Category landing | Featured businesses, trending services, new openings per category |
| CAT-4 | Dynamic discovery | "Popular near you" and "Trending now" sections based on booking data |
| CAT-5 | Category analytics | Track views, bookings, conversion per category for business insights |

---

### 3.7 Booking Flow
**Priority:** P0 | **Owner:** Mobile / Backend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| BOOK-1 | Service selection | User selects one or more services; cart shows total duration and price; validates no conflicting services |
| BOOK-2 | Staff preference | "Any available" or specific staff; show staff availability inline |
| BOOK-3 | Date/time selection | Calendar view (next 60 days); available slots shown as time chips; unavailable slots disabled; real-time slot fetch |
| BOOK-4 | Guest info capture | For logged-in: pre-filled profile, editable; for guest: name, phone, email (optional), notes |
| BOOK-5 | Booking confirmation | Summary screen with all details; T&Cs checkbox; confirm triggers slot hold (10 min) |
| BOOK-6 | Confirmation state | Success animation; add to calendar option; share booking; directions; "Book again" shortcut |
| BOOK-7 | Concurrent booking protection | Pessimistic locking on slots; if slot taken during flow, show "Slot no longer available" with nearest alternatives |

**Booking Rules:** Min 2 hours advance notice; max 60 days ahead; no double-booking same staff at overlapping times.

---

### 3.8 Appointment Management
**Priority:** P0 | **Owner:** Mobile / Backend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| APPT-1 | Upcoming list | Chronological list; group by date; show: business, service, time, status badge |
| APPT-2 | Detail view | Full booking details; map, contact, modify/cancel actions |
| APPT-3 | Reschedule | Select new date/time within business rules; same-slot availability check; notification to business |
| APPT-4 | Cancel | Customer can cancel per business policy; show refund status; reason capture (optional); block last-minute abuse |
| APPT-5 | No-show handling | Business can mark no-show; affects customer reliability score; 3 no-shows = required prepay |
| APPT-6 | Past appointments | History with rebook button; prompt to review 24h after appointment |
| APPT-7 | Status lifecycle | Pending → Confirmed → Checked-in → Completed → Reviewed / Cancelled / No-show |

---

### 3.9 Favorites
**Priority:** P1 | **Owner:** Mobile / Backend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FAV-1 | Add/remove favorite | Heart toggle on business card/detail; haptic feedback; sync across devices |
| FAV-2 | Favorites list | Grid/list view of saved businesses; sort by recently added, name, nearest |
| FAV-3 | Availability alert | Optional: notify when favorite has last-minute availability (push opt-in) |
| FAV-4 | Quick rebook | One-tap to book same service from favorite's past appointment |

---

### 3.10 User Profile
**Priority:** P1 | **Owner:** Mobile / Backend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| PROF-1 | Profile data | Name, phone, email, photo, birthday (for loyalty), gender preference (for matching) |
| PROF-2 | Payment methods | Saved cards (tokenized); default card; add/delete via secure PCI-compliant flow |
| PROF-3 | Addresses | Home, work, custom; geocoded for location features |
| PROF-4 | Preferences | Notification settings (push, email, SMS); default booking reminders (15 min, 1 hour, 24 hours) |
| PROF-5 | Privacy | Data export (GDPR); account deletion with 30-day grace; marketing opt-in/out |
| PROF-6 | Loyalty | Points balance, tier status, history; redeem at checkout |

---

### 3.11 Availability & Slot Computation
**Priority:** P0 | **Owner:** Backend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| SLOT-1 | Business hours | Weekly schedule with exceptions (holidays, closures); timezone-aware |
| SLOT-2 | Staff schedules | Individual working hours, breaks, time off; recurring and one-off |
| SLOT-3 | Service duration mapping | Each service has base duration; combos add durations with buffer time |
| SLOT-4 | Real-time availability | Query available slots for (business, [staff], date range, services); exclude existing bookings and blocks |
| SLOT-5 | Slot generation algorithm | Generate slots at business-defined intervals (e.g., every 15 min) or based on actual availability gaps; handle variable durations |
| SLOT-6 | Buffer time | Configurable pre/post buffers per service/staff; default 0 min pre, 15 min post |
| SLOT-7 | Cache strategy | Redis cache slot data with 30s TTL; invalidate on booking mutation |

**Algorithm Constraints:** O(n) slot generation; support multi-staff simultaneous bookings (e.g., massage + facial); handle overnight spans.

---

### 3.12 Shared Types & Design System
**Priority:** P0 | **Owner:** Design / Frontend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| DS-1 | Design tokens | Colors (primary #6366F1, semantic states), typography (Inter family, 6 scales), spacing (4px grid), shadows, radii |
| DS-2 | Component library | Buttons (5 variants), inputs, cards, modals, bottom sheets, date picker, time chips, skeleton loaders |
| DS-3 | Accessibility | WCAG 2.1 AA: min 4.5:1 contrast, 44pt touch targets, screen reader labels, reduce motion support |
| DS-4 | Dark mode | Full theme swap; system default with manual override; images adjust via overlay |
| DS-5 | Shared types | TypeScript interfaces for all API contracts; Zod schemas for runtime validation; shared between web, mobile, backend |
| DS-6 | Localization | i18n framework; EN, FR, DE, ES Phase 1; RTL preparation for Phase 2 |

---

### 3.13 Reviews & Ratings
**Priority:** P1 | **Owner:** Backend / Mobile

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REV-1 | Review eligibility | Only verified customers who completed appointment can review; 14-day window post-appointment |
| REV-2 | Rating components | Overall 1-5 stars; optional sub-ratings: service quality, staff, ambiance, value |
| REV-3 | Review content | Text (min 10, max 1000 chars); optional photo upload (max 5); auto-moderation for profanity |
| REV-4 | Business response | Owner can respond once; response shown inline; notification to reviewer |
| REV-5 | Review display | Sort by relevant (default), recent, highest, lowest; verified badge; helpful count |
| REV-6 | Abuse prevention | Flag system; auto-hide if 3+ flags; admin review queue; prevent review bombing via velocity check |

---

### 3.14 Payment Integration
**Priority:** P0 | **Owner:** Backend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| PAY-1 | Payment methods | Credit/debit cards (Stripe); Apple Pay; Google Pay; option for "Pay at venue" |
| PAY-2 | Deposit/prepay | Business-configurable: full prepay, deposit (fixed or %), or pay later |
| PAY-3 | Cancellation refund | Auto-refund per policy: full if >24h, 50% if 4-24h, none if <4h; manual override by business |
| PAY-4 | Receipts | Email receipt; in-app invoice download; transaction history |
| PAY-5 | Payout to business | Weekly automated payout to connected account; dashboard shows pending/available balance |
| PAY-6 | Failed payment | Retry logic (3 attempts); booking held 30 min during processing; notify user to update method |

---

### 3.15 Notifications
**Priority:** P1 | **Owner:** Backend / Mobile

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| NOTIF-1 | Push notifications | Booking confirmations, reminders (configurable), changes, promotions; rich with deep links |
| NOTIF-2 | SMS fallback | Critical messages (same-day changes) via SMS if push not delivered in 5 min |
| NOTIF-3 | Email | Booking summary, receipts, marketing (opt-in), account security |
| NOTIF-4 | In-app inbox | Persistent notification history; unread badge; mark as read |
| NOTIF-5 | Preference center | Granular control per channel and type; respect DND hours |
| NOTIF-6 | Notification scheduling | Reminders sent at calculated times; timezone-aware; batch if multiple same-day |

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0 | **Owner:** Web / Backend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| PORT-1 | Dashboard overview | Today's appointments, revenue (today/this week/this month), occupancy rate, new reviews |
| PORT-2 | Calendar management | Day/week/month views; drag-to-reschedule; block time; color-coded by status; print view |
| PORT-3 | Staff management | Add staff profiles, set schedules, assign services, track individual performance |
| PORT-4 | Service configuration | CRUD services with name, description, duration, price, category, photo, online booking enable/disable |
| PORT-5 | Booking rules | Set cancellation policy, advance notice, max future booking window, buffer times |
| PORT-6 | Customer management | View customer history, notes, contact; export customer list (CSV) |
| PORT-7 | Revenue reports | Daily/weekly/monthly breakdown; export to CSV/PDF; tax-ready summaries |
| PORT-8 | Multi-location | Switch between business locations; aggregated or per-location views |

---

### 3.17 Admin Dashboard
**Priority:** P1 | **Owner:** Web / Backend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| ADMIN-1 | Business onboarding | Review applications, approve/reject with reason, track onboarding funnel |
| ADMIN-2 | User management | Search users; view activity; suspend/restore accounts; impersonate for support |
| ADMIN-3 | Content moderation | Review flagged reviews, business photos, reports; approve/hide/remove with audit log |
| ADMIN-4 | Financial oversight | Platform fee configuration; payout monitoring; dispute resolution interface; refund processing |
| ADMIN-5 | Analytics | MAU, booking volume, GMV, churn, top categories/geographies; cohort analysis |
| ADMIN-6 | System health | Queue monitoring, error rates, API latency; alert thresholds |

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P0 | **Owner:** Backend

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| JOB-1 | Notification dispatch | Queue: `notifications`; workers per channel (push, SMS, email); retry 3x with backoff; dead letter queue |
| JOB-2 | Slot cache warming | Pre-compute next 7 days availability for active businesses; refresh nightly |
| JOB-3 | Payment processing | Queue: `payments`; idempotent charge creation; webhook handling; reconcile pending states |
| JOB-4 | Report generation | Async CSV/PDF generation; notify on completion; S3 storage with expiry |
| JOB-5 | Data cleanup | Soft-delete purge after 30 days; anonymize old analytics; log rotation |
| JOB-6 | Search index updates | Re-index on business/service changes; incremental updates; full re-index weekly |
| JOB-7 | Monitoring | BullMQ dashboard integration; job duration/age alerting; worker scaling rules |

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | App cold start < 2s; screen transitions 60fps; API p95 < 200ms |
| **Reliability** | 99.9% uptime; zero-downtime deploys; graceful degradation |
| **Security** | OWASP Mobile Top 10; certificate pinning; encrypted at rest and in transit |
| **Scalability** | Handle 10K concurrent users; horizontal scaling of stateless services |
| **Compliance** | GDPR, CCPA, PCI-DSS (Level 1 via Stripe); SOC 2 roadmap |

---

## 5. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Guest browse, Search, Map, Business detail, Categories, Booking, Appointments, Slot computation, Payments, Owner portal basics | 8 weeks |
| **V1.1** | Favorites, Reviews, Notifications, Profile enhancements | 4 weeks |
| **V1.2** | Admin dashboard, Analytics, Loyalty, Background jobs optimization | 4 weeks |
| **V2.0** | Multi-booking, Gift cards, Subscriptions, AI recommendations | 8 weeks |

---

## 6. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion rate | > 15% |
| Search-to-book time | < 3 minutes |
| App store rating | > 4.5 |
| Business NPS | > 50 |
| Customer retention (30d) | > 40% |
| Payment success rate | > 99% |

---

*Document version: 1.0 | Last updated: 2024 | Owner: Alex, Product Owner*