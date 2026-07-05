# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first platform connecting customers with local service businesses (salons, barbershops, spas, clinics) for online appointment booking. The product serves three user segments: **Customers** (book appointments), **Business Owners** (manage availability and bookings), and **Platform Admins** (oversee operations).

---

## 2. User Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Casual Customer** | Wants quick booking, minimal friction | Find → Book → Done in < 3 minutes |
| **Loyal Customer** | Regular with preferred providers | Rebook favorites, manage schedule |
| **Business Owner** | Manages staff and appointments | Fill calendar, reduce no-shows |
| **Admin** | Platform operations team | Monitor, support, grow marketplace |

---

## 3. Feature Specifications

### 3.1 User Authentication
**Priority:** P0 | **Owner:** Backend / Mobile

| Item | Specification |
|------|---------------|
| **Registration** | Email/password, Google OAuth, Apple Sign-In |
| **Login** | JWT access (15min) + refresh (7 days) tokens |
| **Password Reset** | Secure token via email, 1-hour expiry |
| **Account Verification** | Email confirmation required before booking |
| **Guest Conversion** | Prompt to register at booking confirmation, preserving cart state |

**Acceptance Criteria:**
- [ ] User can register with email in < 30 seconds
- [ ] OAuth flows complete without full page reload in mobile webviews
- [ ] Refresh token rotation prevents concurrent request race conditions
- [ ] Guest users see "Create account to save booking" at checkout
- [ ] Account deletion (GDPR) initiates 30-day grace period with data export

---

### 3.2 Guest Browse & Explore
**Priority:** P0 | **Owner:** Mobile / Frontend

| Item | Specification |
|------|---------------|
| **Landing Experience** | Location permission prompt → nearby businesses |
| **Category Browsing** | Curated horizontal scroll: Hair, Nails, Massage, etc. |
| **Trending Section** | Algorithm: booking velocity + review score |
| **Search Suggestions** | Recent searches, popular terms, nearby neighborhoods |

**Acceptance Criteria:**
- [ ] First-time user sees location permission with value proposition
- [ ] Fallback to manual city selection if permission denied
- [ ] Skeleton loaders during geolocation resolution (< 2s target)
- [ ] Deep links from marketing campaigns land on relevant category

---

### 3.3 Business Search & Discovery
**Priority:** P0 | **Owner:** Backend / Search

| Item | Specification |
|------|---------------|
| **Full-Text Search** | Business name, service name, staff name |
| **Filters** | Distance (km), price range, rating, open now, instant booking |
| **Sorting** | Relevance, distance, rating, price (low-high) |
| **Pagination** | Cursor-based, 20 results per page |

**Acceptance Criteria:**
- [ ] Search returns results in < 300ms (p95)
- [ ] Typo tolerance: "haircut" matches "hair cut"
- [ ] Active filter count displayed; one-tap clear all
- [ ] Empty state suggests alternative searches or nearby locations
- [ ] Search history persists across sessions (registered users)

---

### 3.4 Map-based Search
**Priority:** P0 | **Owner:** Mobile

| Item | Specification |
|------|---------------|
| **Map View** | Clustered pins, auto-fit to visible results |
| **User Location** | Blue dot with accuracy ring; recenter button |
| **Business Cards** | Bottom sheet with photo, rating, price, next availability |
| **Bounds Search** | Query updates on map pan/zoom with debounce (300ms) |

**Acceptance Criteria:**
- [ ] Map initializes to user location within 2 seconds
- [ ] Pin tap opens business card; second tap navigates to detail
- [ ] List ↔ Map toggle preserves search context
- [ ] Offline: cache last viewed map tiles and business markers

---

### 3.5 Business Detail View
**Priority:** P0 | **Owner:** Mobile

| Item | Specification |
|------|---------------|
| **Header** | Photo carousel (max 10), business name, rating, favorite toggle |
| **Info Section** | Address, hours, phone, website, social links |
| **Services Tab** | Grouped by category, expandable with prices/duration |
| **Staff Tab** | Staff profiles with photos, specialties, ratings |
| **Reviews Tab** | Rating distribution, photo reviews, owner responses |
| **Booking CTA** | Sticky bottom button; disabled if no available slots |

**Acceptance Criteria:**
- [ ] Photo gallery supports pinch-zoom and swipe
- [ ] "Call" and "Get Directions" require one tap each
- [ ] Service selection pre-fills booking flow
- [ ] Share button generates deep link with preview image
- [ ] Business hours highlight today's schedule; "Closed" shown prominently

---

### 3.6 Service Categories
**Priority:** P0 | **Owner:** Backend / Admin

| Item | Specification |
|------|---------------|
| **Hierarchy** | Category → Subcategory → Service |
| **Example** | Beauty → Hair → Women's Haircut (45 min, €35) |
| **Attributes** | Name, description, duration, price, buffer time, max bookings per slot |
| **Staff Assignment** | Services linked to qualified staff members |

**Acceptance Criteria:**
- [ ] Category tree configurable via admin; max 3 levels
- [ ] Service duration used for slot computation (not just display)
- [ ] Price can be "from €X" or fixed; displayed clearly in booking flow
- [ ] Inactive services hidden from customer view but retained historically

---

### 3.7 Booking Flow
**Priority:** P0 | **Owner:** Full Stack

| Step | Action | Details |
|------|--------|---------|
| 1. Service Selection | User picks service(s) | Multi-service booking supported |
| 2. Staff Selection | "Any" or specific staff | Shows staff availability calendar |
| 3. Date/Time | Calendar + time slots | Real-time availability; 15-min slots default |
| 4. Details | Notes, contact info pre-filled | Option to book for another person |
| 5. Review | Order summary with cancel policy | Price breakdown, estimated duration |
| 6. Payment | Stored card or new method | Hold or charge based on business policy |
| 7. Confirmation | Booking reference, calendar invite, directions | Share option, add to calendar |

**Acceptance Criteria:**
- [ ] Complete flow in < 5 taps after service selection
- [ ] Slot selection shows loading state during availability fetch
- [ ] Concurrent booking: pessimistic lock holds slot for 5 minutes
- [ ] Price recalculates if service/staff changes
- [ ] Guest checkout collects minimal info: name, phone, email
- [ ] Confirmation screen has clear "Add to Calendar" and "Get Directions"

---

### 3.8 Appointment Management
**Priority:** P0 | **Owner:** Full Stack

**Customer Actions:**
- View upcoming/past appointments
- Reschedule (same business, subject to policy)
- Cancel with reason selection; refund per policy
- Rebook identical service in one tap

**Business Owner Actions:**
- View daily/weekly calendar
- Confirm, reschedule, or cancel with customer notification
- Mark no-show; flag for review
- Block time (lunch, emergency)

**Acceptance Criteria:**
- [ ] Upcoming appointments sorted chronologically; past in reverse
- [ ] Reschedule enforces business cancellation policy (e.g., 24hr notice)
- [ ] Push + SMS + email notifications for all status changes
- [ ] Calendar sync (Google/Apple) two-way where possible
- [ ] No-show tracking feeds into customer reliability score

---

### 3.9 Favorites
**Priority:** P1 | **Owner:** Mobile / Backend

| Item | Specification |
|------|---------------|
| **Toggle** | Heart icon on business cards and detail view |
| **List View** | Grid of favorited businesses with next availability |
| **Notifications** | Optional: alert when favorite has new availability |

**Acceptance Criteria:**
- [ ] Heart state updates optimistically; syncs on reconnect
- [ ] Favorites available offline (cached)
- [ ] Unfavorite requires confirmation if upcoming booking exists
- [ ] Maximum 500 favorites per user (soft limit)

---

### 3.10 User Profile
**Priority:** P1 | **Owner:** Mobile

| Section | Content |
|---------|---------|
| **Personal Info** | Name, phone, email, photo (optional) |
| **Payment Methods** | Stripe Customer; add, default, delete cards |
| **Preferences** | Notification settings, default search radius, language |
| **Booking History** | All appointments with status, filterable |
| **Loyalty** | Points or stamps if program active |

**Acceptance Criteria:**
- [ ] Profile completion percentage encourages photo add
- [ ] Payment methods use Stripe Elements; no raw card data touches servers
- [ ] Export personal data (GDPR) generates downloadable JSON
- [ ] Account deletion requires re-authentication and confirmation

---

### 3.11 Availability & Slot Computation
**Priority:** P0 | **Owner:** Backend

| Component | Logic |
|-----------|-------|
| **Business Hours** | Weekly recurring + exception dates (holidays) |
| **Staff Schedules** | Individual availability, time off, breaks |
| **Slot Generation** | Divide available time by service duration + buffer |
| **Booking Rules** | Min advance notice (e.g., 2 hours), max future bookable (e.g., 60 days) |
| **Conflict Resolution** | Existing bookings, blocked times, staff unavailability |

**Acceptance Criteria:**
- [ ] Slots computed on-the-fly; cache 5 minutes with invalidation on booking change
- [ ] Multi-service booking finds contiguous slots or suggests alternatives
- [ ] Timezone handling: store all times in UTC; display—even for recurring rules
- [ ] DST transitions handled without duplicate or missing slots
- [ ] Performance: 100 concurrent slot queries < 200ms

---

### 3.12 Shared Types & Design System
**Priority:** P0 | **Owner:** Design / Frontend

| Element | Specification |
|---------|---------------|
| **Color Palette** | Primary: #FF6B6B (coral), Neutral grays, Semantic (green/red/amber) |
| **Typography** | Inter font family; 6-level scale (12px–32px) |
| **Spacing** | 4px base grid; consistent padding/margin tokens |
| **Components** | Buttons, inputs, cards, modals, toasts, skeletons |
| **Icons** | Lucide React; consistent 24px default |
| **Animations** | 200ms default duration; prefers-reduced-motion support |

**Acceptance Criteria:**
- [ ] All UI components in Storybook with prop documentation
- [ ] Dark mode support via CSS variables
- [ ] Accessibility: WCAG 2.1 AA minimum; focus states, alt text, aria-labels
- [ ] RTL language readiness (future-proofing)

---

### 3.13 Reviews & Ratings
**Priority:** P1 | **Owner:** Full Stack

| Item | Specification |
|------|---------------|
| **Eligibility** | Only customers with completed appointments can review |
| **Components** | Star rating (1-5), text review, photo upload (max 5) |
| **Moderation** | Auto-approve; flag for manual review if reported |
| **Owner Response** | Public reply within 30 days of review |
| **Rating Calculation** | Weighted recent reviews; recalculate nightly |

**Acceptance Criteria:**
- [ ] Review prompt sent 24 hours after appointment completion
- [ ] Cannot review same appointment twice; edit window 48 hours
- [ ] Photo reviews require moderation queue if reported
- [ ] Aggregate rating displayed with count; breakdown by star level
- [ ] Fake review detection: velocity checks, duplicate content flagging

---

### 3.14 Payment Integration
**Priority:** P0 | **Owner:** Backend / Finance

| Item | Specification |
|------|---------------|
| **Processor** | Stripe Connect (marketplace) |
| **Models** | Pay at venue, deposit, full prepay |
| **Flow** | Customer → Platform holds → Payout to business (minus commission) |
| **Refunds** | Full, partial, or credit per cancellation policy |
| **Invoicing** | Email receipt; annual summary for tax |

**Acceptance Criteria:**
- [ ] 3D Secure handled for EU cards; fallback gracefully
- [ ] Webhook idempotency: process each event exactly once
- [ ] Failed payment: retry once, then notify user with 15-min hold extension
- [ ] Payout schedule configurable per business (weekly default)
- [ ] Financial reporting: gross, fees, net, refunds in admin dashboard

---

### 3.15 Notifications
**Priority:** P1 | **Owner:** Backend / Mobile

| Channel | Use Cases |
|---------|-----------|
| **Push** | Booking confirmed, reminder (24h, 2h), promotional |
| **SMS** | Reminders, urgent updates (fallback for push) |
| **Email** | Receipts, account changes, marketing (opt-in) |
| **In-App** | New features, loyalty updates, review requests |

**Acceptance Criteria:**
- [ ] User controls each channel per notification type
- [ ] Quiet hours respected (default 22:00–08:00 local time)
- [ ] Delivery tracking: mark as read, click-through rates
- [ ] Unsubscribe from marketing in one tap; transactional always sent
- [ ] Notification preferences synced across devices

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0 | **Owner:** Full Stack

| Module | Features |
|--------|----------|
| **Dashboard** | Today's bookings, revenue, occupancy rate, alerts |
| **Calendar** | Day/week/month views; drag-to-reschedule; color-coded statuses |
| **Services** | CRUD services, pricing, duration, online/offline toggle |
| **Staff** | Add staff, set permissions, manage schedules |
| **Clients** | CRM: notes, visit history, spending, no-show count |
| **Settings** | Business hours, cancellation policy, payment preferences, integrations |

**Acceptance Criteria:**
- [ ] Mobile-responsive; primary use case is tablet/desktop
- [ ] Calendar supports multi-staff view and individual filtered views
- [ ] Client search by name, phone, or email
- [ ] Export bookings to CSV (date range selectable)
- [ ] Role-based access: Owner, Manager, Staff (view-only own calendar)

---

### 3.17 Admin Dashboard
**Priority:** P1 | **Owner:** Full Stack

| Module | Features |
|--------|----------|
| **Overview** | KPIs: GMV, bookings, new users, churn, top businesses |
| **Business Management** | Onboard, verify, suspend, feature, commission rates |
| **User Management** | Search, view, suspend, impersonate (audit logged) |
| **Support** | Ticket system, refund issuance, dispute resolution |
| **Content** | Category management, featured content, push campaigns |
| **Finance** | Payout monitoring, commission reconciliation, fraud alerts |

**Acceptance Criteria:**
- [ ] Real-time KPIs refresh every 60 seconds
- [ ] Business verification workflow: submitted → review → approved/rejected
- [ ] All admin actions logged with before/after state
- [ ] Data export for all list views (CSV/JSON)
- [ ] Role-based access: Super Admin, Operations, Support, Finance

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P0 | **Owner:** Backend

| Queue | Jobs | Schedule |
|-------|------|----------|
| **notifications** | Send push, SMS, email | Event-driven + scheduled |
| **bookings** | Slot hold expiration, no-show detection | Delayed (5min hold, post-appointment) |
| **payments** | Payout calculation, retry failed charges | Daily, event-driven |
| **search** | Index updates for businesses, services | On change + nightly rebuild |
| **reports** | Daily/weekly business summaries, admin KPIs | Cron scheduled |
| **cleanup** | Soft-deleted data purge, old log archival | Weekly |

**Acceptance Criteria:**
- [ ] All jobs idempotent; safe to retry on failure
- [ ] Dead letter queue for manual inspection after 3 retries
- [ ] Job progress trackable via dashboard (Bull Board or similar)
- [ ] Queue priorities: notifications > bookings > reports > cleanup
- [ ] Graceful shutdown: finish active jobs before process exit

---

## 4. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Performance** | App launch < 2s; page transitions < 300ms; API p95 < 200ms |
| **Availability** | 99.9% uptime; scheduled maintenance windows announced |
| **Security** | OWASP Top 10 mitigation; penetration testing annually |
| **Privacy** | GDPR/CCPA compliant; data retention policies enforced |
| **Scalability** | Horizontal scaling; 10x traffic spike handling |
| **Accessibility** | WCAG 2.1 AA; screen reader tested |

---

## 5. Analytics & Success Metrics

| Metric | Target | Tracking |
|--------|--------|----------|
| Booking conversion rate | > 15% | Funnel analysis |
| Search-to-book time | < 5 minutes | Session recording |
| Business activation | > 80% complete profile | Cohort analysis |
| Customer retention | > 40% monthly (MAU/registered) | Cohort analysis |
| NPS | > 50 | In-app survey |
| Support ticket volume | < 2% of bookings | Zendesk integration |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Search, Business Detail, Booking, Basic Owner Portal | 8 weeks |
| **V1.0** | Payments, Notifications, Reviews, Favorites, Profile | +4 weeks |
| **V1.5** | Map Search, Admin Dashboard, Advanced Analytics, BullMQ optimization | +4 weeks |
| **V2.0** | Loyalty, Referrals, Multi-location businesses, API for partners | +8 weeks |

---

## 7. Open Questions

1. Geographic launch sequence (city-by-city vs. national)?
2. Commission structure: flat fee vs. percentage vs. hybrid?
3. Insurance or guarantee for no-shows — platform or business responsibility?
4. Staff as independent contractors — need for separate payout accounts?

---

*Document version: 1.0 | Last updated: [Date] | Next review: Post-MVP retrospective*