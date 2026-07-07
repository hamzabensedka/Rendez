# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first appointment booking platform connecting customers with beauty, wellness, and service professionals. The platform serves three primary user segments: **Customers** (booking appointments), **Providers/Business Owners** (managing their business and appointments), and **Admins** (platform oversight). This specification defines all features, acceptance criteria, and priorities for MVP and post-MVP phases.

---

## 2. User Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Customer** | End user seeking to book beauty/wellness services | Discover, book, manage appointments |
| **Guest** | Unregistered browser exploring the platform | Browse services without commitment |
| **Provider** | Business owner or employee managing a salon/shop | Manage calendar, services, staff, bookings |
| **Admin** | Platform operator | Monitor, support, moderate the platform |

---

## 3. Feature Specifications

### 3.1 User Authentication
**Priority:** P0 (Critical Path)

| Item | Specification |
|------|---------------|
| **Registration** | Email/password, Google OAuth, Apple Sign-In |
| **Login** | JWT-based session with refresh token rotation |
| **Password Reset** | Email link with 1-hour expiry |
| **Phone Verification** | Optional SMS verification for booking confirmation |
| **Role Selection** | Post-registration: "I want to book" vs "I manage a business" |

**Acceptance Criteria:**
- [ ] User can register with email, password, and optional phone
- [ ] Password requires min 8 chars, 1 uppercase, 1 number, 1 special char
- [ ] OAuth flows redirect correctly with deep linking on mobile
- [ ] Refresh token invalidates on logout from all devices
- [ ] Account lockout after 5 failed login attempts (30-min cooldown)
- [ ] Role selection screen appears once after first login; persisted in `user.role`

---

### 3.2 Guest Browse & Explore
**Priority:** P0

| Item | Specification |
|------|---------------|
| **Browse Without Login** | Full search and discovery without authentication |
| **Booking Prompt** | Login required at checkout; pre-filled data retained post-auth |
| **Guest Session** | 30-day local storage of favorites and recent searches |

**Acceptance Criteria:**
- [ ] Guest can access all browse/discovery features
- [ ] Attempting to book triggers auth modal; returns to booking flow after login
- [ ] Guest favorites persist to account upon registration
- [ ] Guest search history converts to authenticated user history on login

---

### 3.3 Business Search & Discovery
**Priority:** P0

| Item | Specification |
|------|---------------|
| **Text Search** | Business name, service name, staff name with typo tolerance |
| **Filters** | Category, price range, rating (4.0+), availability (today, this week), distance, amenities |
| **Sorting** | Relevance, rating, price (low-high), distance |
| **Auto-complete** | Suggestions after 2 characters with recent searches |
| **Search History** | Persist last 10 searches; clearable by user |

**Acceptance Criteria:**
- [ ] Search returns results in <500ms for 95th percentile
- [ ] Typo tolerance handles Levenshtein distance ≤2
- [ ] Filters stack combinatorially (AND logic)
- [ ] Empty state shows popular categories and nearby businesses
- [ ] Search query in URL for shareability

---

### 3.4 Map-based Search
**Priority:** P1

| Item | Specification |
|------|---------------|
| **Map View** | Toggle between list and map; default based on user preference |
| **Clustering** | Group markers at zoom levels > 12 |
| **User Location** | Request permission; fallback to IP geolocation with manual override |
| **Business Pins** | Color-coded by category; tap opens bottom sheet with summary |
| **Radius Search** | Adjustable 1-50km slider |

**Acceptance Criteria:**
- [ ] Map initializes to user location within 3 seconds
- [ ] Pin tap opens bottom sheet with: name, rating, price from, next availability, book button
- [ ] Map bounds trigger new search query (debounced 300ms)
- [ ] Offline: cache last viewed map tiles and business pins
- [ ] Accessibility: screen reader announces "Map showing X businesses near [location]"

---

### 3.5 Business Detail View
**Priority:** P0

| Item | Specification |
|------|---------------|
| **Header** | Business name, rating, review count, favorite toggle, share |
| **Media Gallery** | Up to 20 images/videos; swipeable carousel |
| **Info Section** | Address, hours (today's hours + full schedule), phone, website |
| **Services Tab** | Grouped by category; expandable with price and duration |
| **Reviews Tab** | Aggregate rating, distribution histogram, sortable reviews |
| **Team Tab** | Staff profiles with specialties and ratings |
| **Sticky CTA** | "Book Appointment" button always visible |

**Acceptance Criteria:**
- [ ] Page loads in <2s with lazy-loaded images
- [ ] Deep link `/business/:id` opens correct business
- [ ] Share generates preview image with business name and rating
- [ ] Hours show "Open now" / "Closes at X" / "Closed today" dynamically
- [ ] Phone tap initiates call; website opens in-app browser

---

### 3.6 Service Categories
**Priority:** P0

| Item | Specification |
|------|---------------|
| **Hierarchy** | Category → Subcategory → Service |
| **Examples** | Hair > Cut > Women's Cut, Men's Cut, Child's Cut |
| **Provider-defined** | Providers create services with: name, description, duration, price, buffer time, category assignment |
| **Add-ons** | Optional upsells (e.g., deep conditioning +15min/+€15) |

**Acceptance Criteria:**
- [ ] Category tree supports 3 levels deep
- [ ] Provider can reorder services within a category
- [ ] Service duration enforces 15-min increments (15, 30, 45... 480)
- [ ] Add-ons display with +duration and +price clearly indicated
- [ ] Category icons from design system; fallback to generic icon

---

### 3.7 Booking Flow
**Priority:** P0 (Critical Path)

| Step | Action | Details |
|------|--------|---------|
| 1 | Select Service(s) | Single or multiple; duration and price calculated |
| 2 | Select Staff | "Any available" or specific staff; show next availability |
| 3 | Select Date & Time | Calendar view with available slots; timezone handling |
| 4 | Add-ons | Optional upsells presented |
| 5 | Review & Confirm | Summary with cancellation policy |
| 6 | Payment | See §3.14 |
| 7 | Confirmation | Booking reference, calendar invite, directions |

**Acceptance Criteria:**
- [ ] Multi-service booking enforces compatibility (same staff or sequential availability)
- [ ] Calendar shows 2 weeks forward by default; load more on scroll
- [ ] Slot selection holds reservation for 10 minutes (Redis lock)
- [ ] Booking confirmation arrives in <3 seconds
- [ ] Modification allowed up to provider's cancellation window
- [ ] No-show policy displayed and acknowledged

---

### 3.8 Appointment Management
**Priority:** P0

| Item | Specification |
|------|---------------|
| **Customer View** | Upcoming / Past / Cancelled tabs; chronological |
| **Actions** | Reschedule (within policy), Cancel (with reason), Rebook, Review |
| **Details** | QR code for check-in, staff info, directions, add to calendar |
| **Reminders** | Push + SMS 24h and 1h before appointment |

**Acceptance Criteria:**
- [ ] Reschedule presents available slots for same service/staff
- [ ] Cancellation enforces provider policy (e.g., 24h minimum)
- [ ] Late cancellation fee displayed if applicable
- [ ] Past appointments prompt for review after 1 hour
- [ ] Calendar sync exports with .ics format

---

### 3.9 Favorites
**Priority:** P1

| Item | Specification |
|------|---------------|
| **Toggle** | Heart icon on business cards and detail page |
| **List View** | Grid of favorited businesses with quick-book |
| **Sync** | Cross-device with server persistence |
| **Notifications** | Optional: notify of new availability or promotions |

**Acceptance Criteria:**
- [ ] Favorite/unfavorite is idempotent; optimistic UI update
- [ ] Guest favorites prompt login on app restart; merge on auth
- [ ] Maximum 500 favorites per user
- [ ] Favorited businesses surface higher in search results (personalization)

---

### 3.10 User Profile
**Priority:** P1

| Item | Specification |
|------|---------------|
| **Personal Info** | Name, email, phone, profile photo, birthday (for offers) |
| **Preferences** | Default search radius, notification settings, payment methods |
| **Privacy** | Data download, account deletion (GDPR compliance) |
| **Activity** | Booking history stats: total appointments, favorite categories |

**Acceptance Criteria:**
- [ ] Profile completion percentage shown; incentivize with badge
- [ ] Email change requires verification
- [ ] Account deletion queues 30-day grace period with recovery option
- [ ] Data export delivers .zip with JSON and PDF formats within 24 hours

---

### 3.11 Availability & Slot Computation
**Priority:** P0 (Technical Foundation)

| Item | Specification |
|------|---------------|
| **Business Hours** | Weekly recurring + exception dates (holidays, closures) |
| **Staff Schedules** | Overrides to business hours; lunch breaks; time off |
| **Slot Generation** | Real-time based on: business hours, staff availability, existing bookings, service duration, buffer time |
| **Buffer Time** | Pre/post-service cleanup; configurable per service |
| **Concurrent Bookings** | Multiple staff = parallel slots; single staff = serial |

**Algorithm Requirements:**
- [ ] Slot query returns results in <200ms
- [ ] Caches invalidation: booking creation/cancellation, schedule change
- [ ] Handles timezone correctly (business timezone, user timezone display)
- [ ] Supports "request off" with approval workflow
- [ ] Overbooking prevention via atomic slot reservation

---

### 3.12 Shared Types & Design System
**Priority:** P1 (Enabler)

| Item | Specification |
|------|---------------|
| **Design Tokens** | Colors, typography, spacing, shadows in ThemeProvider |
| **Components** | Button, Input, Card, Modal, Calendar, TimePicker, Skeleton |
| **Icons** | Phosphor Icons; consistent 24px default, 20px compact |
| **Accessibility** | WCAG 2.1 AA; minimum 44px touch targets; screen reader labels |
| **Platform** | iOS and Android native patterns; web responsive |

**Acceptance Criteria:**
- [ ] All components in Storybook with documented props
- [ ] Dark mode support with `prefers-color-scheme` and manual toggle
- [ ] RTL language support (Arabic, Hebrew)
- [ ] Animation: 200ms default, `prefers-reduced-motion` respected
- [ ] Error boundaries on all component trees

---

### 3.13 Reviews & Ratings
**Priority:** P1

| Item | Specification |
|------|---------------|
| **Eligibility** | Only verified customers who completed appointment |
| **Rating** | 1-5 stars; mandatory with optional text review |
| **Categories** | Cleanliness, Service, Value, Atmosphere (optional) |
| **Response** | Provider can respond publicly once |
| **Moderation** | Auto-flag profanity; admin review queue for reports |

**Acceptance Criteria:**
- [ ] Review prompt sent 1 hour after appointment completion
- [ ] Edit window: 30 days; deletion by user or admin only
- [ ] Aggregate rating recalculates with 4-hour cache
- [ ] Photo reviews: max 5 images, 5MB each, auto-moderated
- [ ] Provider response notifies reviewer

---

### 3.14 Payment Integration
**Priority:** P0

| Item | Specification |
|------|---------------|
| **Methods** | Stripe: cards, Apple Pay, Google Pay, SEPA (EU) |
| **Flows** | Pay in full, deposit (configurable %), pay at venue |
| **Refund** | Full, partial, or no refund per cancellation policy |
| **Invoicing** | Receipt email; VAT invoice on request |
| **Payout** | Stripe Connect: provider receives payout T+2 |

**Acceptance Criteria:**
- [ ] Payment intent created server-side; client confirms with 3D Secure
- [ ] Failed payment: 3 retries with SCA re-authentication
- [ ] Webhook handling for: succeeded, failed, disputed, refunded
- [ ] PCI compliance: no card data touches our servers
- [ ] Currency display matches business location; conversion shown for user clarity

---

### 3.15 Notifications
**Priority:** P1

| Channel | Use Cases |
|---------|-----------|
| **Push** | Booking confirmed, reminder (24h, 1h), promotional (opt-in) |
| **SMS** | Critical: reminders, same-day changes |
| **Email** | Receipt, review request, account security |
| **In-app** | Booking updates, provider messages, system announcements |

**Acceptance Criteria:**
- [ ] User controls channel preferences per notification type
- [ ] Push opt-in on first booking; pre-permission explanation screen
- [ ] Notification deep links to relevant screen
- [ ] Delivery tracking: mark as read, unread count badge
- [ ] Rate limiting: max 3 promotional pushes per week

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0

| Module | Features |
|--------|----------|
| **Dashboard** | Today's appointments, revenue this week, upcoming week preview |
| **Calendar** | Day/week/month views; drag-to-reschedule; color-coded by status |
| **Services** | CRUD services, pricing, duration, add-ons, categories |
| **Staff** | Add team members, set permissions, manage schedules |
| **Bookings** | View all, filter by status, manual entry, block time |
| **Clients** | CRM: notes, visit history, preferences, marketing consent |
| **Analytics** | Revenue, bookings, no-shows, popular services, staff utilization |
| **Settings** | Business hours, cancellation policy, payment settings, integrations |

**Acceptance Criteria:**
- [ ] Calendar supports multi-staff view with swimlanes
- [ ] Manual booking bypasses payment; marks as "pay at venue"
- [ ] Staff permissions: Owner > Manager > Receptionist > Stylist (view-only own calendar)
- [ ] Export bookings to CSV (last 90 days, or custom range)
- [ ] Business profile completeness affects search ranking

---

### 3.17 Admin Dashboard
**Priority:** P2

| Module | Features |
|--------|----------|
| **Overview** | KPIs: users, bookings, GMV, active providers, growth rate |
| **User Management** | Search, suspend, impersonate, data export |
| **Provider Onboarding** | Application review, verification, approval workflow |
| **Content Moderation** | Review queue, business claim disputes, photo moderation |
| **Finance** | Transaction log, refunds, payouts, fee structure adjustment |
| **Support** | Ticket system, canned responses, escalation rules |
| **System** | Feature flags, announcement banners, maintenance mode |

**Acceptance Criteria:**
- [ ] Role-based access: Super Admin, Ops, Support, Finance
- [ ] Audit log of all admin actions with before/after state
- [ ] Provider approval: automated checks (business registration, identity) + manual review
- [ ] Financial reports export to Excel with pivot support
- [ ] 99.9% uptime SLA for admin dashboard

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P1 (Infrastructure)

| Job | Frequency | Description |
|-----|-----------|-------------|
| **Slot Cache Warmer** | Every 15 min | Pre-compute next 14 days availability |
| **Reminder Sender** | Every minute | Push/SMS reminders due within next window |
| **Review Solicitation** | Triggered | 1 hour post-appointment |
| **Payment Reconciliation** | Daily | Match Stripe settlements to bookings |
| **Report Generation** | Weekly/Monthly | Analytics emails to providers |
| **Data Retention** | Daily | Purge soft-deleted accounts after 30 days |
| **Search Index Update** | Real-time | Sync business changes to Algolia/Elasticsearch |

**Acceptance Criteria:**
- [ ] Job failures retry with exponential backoff (max 5 attempts)
- [ ] Dead letter queue for manual inspection after max retries
- [ ] Job concurrency controlled per queue priority
- [ ] Monitoring: Grafana dashboard with queue depth, processing time, error rate
- [ ] Graceful shutdown: finish in-progress jobs before process exit

---

## 4. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | App launch <2s; API response <200ms (p95); image load <1s |
| **Scalability** | Support 10k concurrent users; 100k bookings/day |
| **Security** | OWASP Top 10 mitigation; encryption at rest and in transit |
| **Compliance** | GDPR, CCPA, PSD2 for payments |
| **Reliability** | 99.9% uptime; <0.1% booking failure rate |

---

## 5. Prioritization Matrix

| Priority | Features |
|----------|----------|
| **P0 (Critical)** | User Auth, Guest Browse, Search & Discovery, Business Detail, Booking Flow, Appointment Management, Availability/Slots, Payment, Provider Portal |
| **P1 (Important)** | Map Search, Favorites, User Profile, Design System, Reviews, Notifications, Background Jobs |
| **P2 (Valuable)** | Admin Dashboard, Advanced Analytics, Referral Program, Loyalty Points |
| **P3 (Nice-to-have)** | AI Recommendations, Group Bookings, Gift Cards, Marketplace |

---

## 6. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion rate | >15% (search → booking) |
| Day-7 retention | >30% |
| Provider activation | >80% complete profile within 48h |
| NPS score | >50 |
| Support tickets per 1000 bookings | <5 |

---

*Document version: 1.0*
*Last updated: 2024*
*Owner: Alex, Product Owner*