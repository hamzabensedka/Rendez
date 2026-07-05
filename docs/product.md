# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first marketplace connecting customers with local service businesses (salons, barbershops, spas, clinics) for appointment booking. The platform serves three user types: **Customers** (book appointments), **Business Owners** (manage availability and services), and **Admin** (platform oversight).

---

## 2. User Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Customer** | End-user seeking to discover and book services | Find, compare, book, manage appointments |
| **Guest** | Unregistered browser | Explore without commitment |
| **Business Owner** | Service provider managing their business | Configure services, availability, view bookings |
| **Admin** | Platform operator | Monitor, moderate, support |

---

## 3. Feature Specifications

### 3.1 User Authentication (Priority: P0)

**Description:** Secure identity management for all user types with role-based access.

**Requirements:**
- Email/password registration with validation
- Login with JWT tokens (access + refresh)
- OAuth 2.0: Google, Apple Sign-In
- Password reset via email
- Account verification email
- Role selection during onboarding (Customer vs Business Owner)
- Biometric login (Face ID / Touch ID) — mobile only
- Session management with secure token refresh

**Acceptance Criteria:**
- [ ] New user registers with email, receives verification, activates account
- [ ] User logs in and receives valid JWT; refresh token rotates on use
- [ ] OAuth login creates account or links to existing matching email
- [ ] Password reset flow completes in < 3 steps
- [ ] Biometric prompt appears after 2 successful password logins
- [ ] Token expires after 15 min idle; refresh valid for 7 days
- [ ] Business Owner role triggers additional onboarding (business creation)

---

### 3.2 Guest Browse & Explore (Priority: P0)

**Description:** Unauthenticated access to browse businesses and services with intentional friction at conversion points.

**Requirements:**
- View business listings, search, filters without login
- View business detail pages with services and reviews
- See real-time availability (read-only)
- Prompt to login/register at booking initiation
- Persist guest session data (search filters, selected business) to post-auth conversion

**Acceptance Criteria:**
- [ ] Guest accesses all browse features without authentication
- [ ] "Book" CTA triggers auth modal; post-auth returns to booking flow with context preserved
- [ ] Guest cannot complete booking, leave review, or favorite without account
- [ ] Guest session data (localStorage) merges to account upon registration
- [ ] Analytics distinguish guest vs authenticated sessions

---

### 3.3 Business Search & Discovery (Priority: P0)

**Description:** Primary discovery mechanism for customers to find relevant businesses.

**Requirements:**
- Full-text search across business name, service name, description
- Autocomplete with suggestions (businesses, services, locations)
- Filter: category, price range, rating, distance, availability ("open now"), amenities
- Sort: relevance, distance, rating, price (low/high)
- Recent searches persistence
- Trending / popular near you section

**Acceptance Criteria:**
- [ ] Search returns results in < 500ms for 3+ character queries
- [ ] Autocomplete displays after 2 characters with top 5 suggestions
- [ ] Filters combine with AND logic; clear all option present
- [ ] "No results" state suggests nearby alternatives or broader filters
- [ ] Pagination at 20 results; infinite scroll on mobile
- [ ] Search history persists 30 days, max 20 entries

---

### 3.4 Map-based Search (Priority: P0)

**Description:** Visual geospatial discovery with interactive map integration.

**Requirements:**
- Interactive map with business markers
- Current location detection with permission handling
- Map/List toggle with synced state
- Cluster markers for dense areas
- Custom marker styling by category
- Boundary search (pan/zoom updates results)
- Directions link to native maps app

**Acceptance Criteria:**
- [ ] Map initializes centered on user location or default city
- [ ] Markers display business name, rating, price indicator on tap
- [ ] Clustering activates at zoom level < 12
- [ ] Pan/zoom fetches new results within visible bounds in < 1s
- [ ] List view and map view maintain filter/sort sync
- [ ] Location permission denied gracefully falls back to city-level default
- [ ] Marker tap opens bottom sheet with quick actions (call, book, view)

---

### 3.5 Business Detail View (Priority: P0)

**Description:** Comprehensive business profile driving conversion.

**Requirements:**
- Hero image gallery (up to 10 photos), video support
- Business info: name, category, address, phone, hours, description
- Service menu with pricing and duration
- Staff/professional list
- Reviews summary and detail
- Availability calendar widget
- Social proof: badges ("verified", "top rated"), response rate
- Share functionality (deep link)

**Acceptance Criteria:**
- [ ] Page loads all critical content in < 2s; images lazy-loaded
- [ ] Image gallery supports swipe, pinch-zoom, fullscreen
- [ ] Service list expandable with full details
- [ ] "Book" CTA sticky on scroll; pre-selects service if navigated from service
- [ ] Hours display current day highlighted; closed days grayed
- [ ] Share generates deep link with preview metadata
- [ ] Offline: cached business info viewable if previously loaded

---

### 3.6 Service Categories (Priority: P0)

**Description:** Hierarchical classification for discovery and business organization.

**Requirements:**
- Predefined category tree (e.g., Beauty > Hair > Haircut)
- Business can assign multiple categories
- Category icons and color coding
- Trending services per category
- Admin-managed category taxonomy

**Acceptance Criteria:**
- [ ] Category tree navigable with breadcrumbs
- [ ] Business search filters by any category level
- [ ] Category assignment affects search indexing within 5 minutes
- [ ] Uncategorized businesses excluded from category browse
- [ ] Icon set covers 50+ top-level categories; fallback generic icon

---

### 3.7 Booking Flow (Priority: P0)

**Description:** Core conversion flow from service selection to confirmed appointment.

**Requirements:**
- Step 1: Select service (or bundle multiple)
- Step 2: Select staff (optional "any" option)
- Step 3: Select date/time from available slots
- Step 4: Confirm details, apply promo code
- Step 5: Payment (if required) or confirm
- Booking confirmation with calendar invite, directions, add-to-wallet
- Guest checkout option (collect minimal info)

**Acceptance Criteria:**
- [ ] Flow completes in < 5 steps; progress indicator visible
- [ ] Slot selection shows 7 days forward; expandable to 30/60 days
- [ ] Double-booking prevented via optimistic locking; race condition handling
- [ ] Service bundle pricing calculated correctly with discounts
- [ ] Promo code validates in real-time; error states clear
- [ ] Confirmation arrives via push, email, SMS within 10 seconds
- [ ] Booking holds slot for 10 minutes during payment; releases on timeout or failure
- [ ] Guest checkout collects: name, phone, email; auto-creates lightweight account

---

### 3.8 Appointment Management (Priority: P0)

**Description:** Post-booking lifecycle for customers and business owners.

**Customer Requirements:**
- View upcoming and past appointments
- Reschedule (with availability check) or cancel with policy enforcement
- Add to native calendar
- Rebook same service
- Contact business about appointment

**Business Owner Requirements:**
- Calendar view (day/week/month) of all appointments
- Status management: confirm, mark complete, no-show, cancel
- Block time manually
- Appointment notes
- Customer arrival check-in

**Acceptance Criteria:**
- [ ] Customer reschedules within business policy; cancellation fees apply if applicable
- [ ] Business owner receives push/email on new booking, cancellation, rescheduling
- [ ] Calendar syncs bidirectionally with Google/Outlook (optional integration)
- [ ] No-show status triggers automatic review request suppression
- [ ] Business can set cancellation policy: hours before, fee percentage
- [ ] Appointment history searchable and filterable

---

### 3.9 Favorites (Priority: P1)

**Description:** Save businesses and services for quick access.

**Requirements:**
- One-tap favorite/unfavorite
- Favorites list with search and sort
- Favorite count visible to business (analytics)
- Notifications for new availability or promotions from favorited businesses

**Acceptance Criteria:**
- [ ] Favorite action provides immediate visual feedback (heart animation)
- [ ] Favorites persist across sessions and devices
- [ ] Unauthenticated user prompted to login; post-auth merge
- [ ] Favorites list loads in < 1s for < 100 items
- [ ] Option to receive/not receive promotional notifications per favorite

---

### 3.10 User Profile (Priority: P1)

**Description:** Customer identity and preference management.

**Requirements:**
- Profile photo, name, phone, email, birthday
- Notification preferences (push, email, SMS) by type
- Payment methods management
- Booking history with receipts
- Loyalty/points (if applicable)
- Data export / account deletion (GDPR/CCPA)

**Acceptance Criteria:**
- [ ] Profile completion percentage incentivizes full completion
- [ ] Birthday triggers optional discount notification
- [ ] Payment methods support add, default set, delete (with active subscription check)
- [ ] Data export delivers all personal data within 30 days of request
- [ ] Account deletion irreversible, confirms with email, completes in 30 days

---

### 3.11 Availability & Slot Computation (Priority: P0)

**Description:** Core algorithm generating bookable time slots from business rules.

**Requirements:**
- Business defines: working hours, break times, service durations, buffer between appointments
- Staff-specific availability (overrides business default)
- Time off / vacation blocking
- Slot generation based on service duration + buffers
- Real-time availability (account for pending bookings)
- Support for variable-duration services
- Group bookings (multiple people, same slot)

**Acceptance Criteria:**
- [ ] Slots generated respecting all constraints; no overlapping bookings possible
- [ ] 15-minute buffer between appointments configurable per business
- [ ] Staff vacation removes all their slots from availability
- [ ] Pending bookings (unpaid) hold slots for configurable duration (default 10 min)
- [ ] Slot query API responds in < 200ms for 30-day range
- [ ] Edge cases handled: service longer than any single open slot (split not allowed), minimum advance booking (e.g., 2 hours)

---

### 3.12 Shared Types & Design System (Priority: P0)

**Description:** Consistent UI/UX foundation across all platforms.

**Requirements:**
- Design tokens: colors, typography, spacing, shadows, border-radius
- Component library: buttons, inputs, cards, modals, toasts, skeletons
- Icon system (SVG, consistent 24px grid)
- Animation standards (150-300ms transitions)
- Accessibility: WCAG 2.1 AA minimum, focus states, screen reader support
- Theme: light/dark mode support
- Responsive breakpoints: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)

**Acceptance Criteria:**
- [ ] All components documented in Storybook
- [ ] No custom one-off styles; all via design system
- [ ] Dark mode respects system preference, user override persisted
- [ ] Touch targets minimum 44x44px on mobile
- [ ] Color contrast ratios verified programmatically in CI

---

### 3.13 Reviews & Ratings (Priority: P1)

**Description:** Social proof system for business quality and trust.

**Requirements:**
- Post-appointment review prompt (24 hours after)
- Star rating (1-5) + text review + photo option
- Business owner response
- Review helpfulness voting
- Report inappropriate content
- Average rating calculation with review count
- Sort/filter reviews (recent, highest, lowest, with photos)

**Acceptance Criteria:**
- [ ] Only customers with completed appointments can review
- [ ] Review prompt sent via push; fallback to email after 48 hours
- [ ] Business owner notified of new review; can respond once
- [ ] Reported reviews enter admin queue; hidden after 3 reports pending review
- [ ] Rating recalculates within 5 minutes of new review
- [ ] Photo reviews moderated for inappropriate content (automated + manual)

---

### 3.14 Payment Integration (Priority: P0)

**Description:** Secure, flexible payment processing for bookings.

**Requirements:**
- Stripe integration for card payments
- Support: credit/debit, Apple Pay, Google Pay
- Full payment vs deposit vs pay-at-business options
- Refund processing with policy enforcement
- Invoice/receipt generation
- Failed payment handling with retry
- Payout to business owners (Stripe Connect)

**Acceptance Criteria:**
- [ ] PCI compliance via Stripe Elements; no card data touches servers
- [ ] 3D Secure handled for applicable cards
- [ ] Payment intent created on booking initiation; confirmed on slot confirmation
- [ ] Refund processes within 5-10 business days per policy
- [ ] Business owner receives payout minus platform fee within 2 business days
- [ ] Payment failure notifies user with clear next steps; slot released

---

### 3.15 Notifications (Priority: P1)

**Description:** Multi-channel communication for engagement and operational updates.

**Requirements:**
- Push notifications (OneSignal or Firebase)
- Email (transactional: SendGrid/Mailgun; marketing: customer choice)
- SMS for urgent: booking reminders, same-day changes
- Notification types: booking confirmed, reminder (24h, 2h), cancelled, promotional, review request
- Preference management per channel and type
- Notification history in-app

**Acceptance Criteria:**
- [ ] Notification delivery rate > 95% for push, > 99% for email/SMS
- [ ] User can mute all or per-type; respects legal requirements (transactional always on)
- [ ] Reminder timing respects timezone of appointment location
- [ ] Unsubscribe from marketing honored within 24 hours
- [ ] Notification deep-links to relevant in-app screen

---

### 3.16 Provider / Business Owner Portal (Priority: P0)

**Description:** Dedicated interface for business management.

**Requirements:**
- Dashboard: today's bookings, revenue, new customers
- Business profile management (info, photos, hours)
- Service catalog: CRUD services with pricing, duration, description
- Staff management: add staff, set their services and hours
- Availability configuration
- Booking calendar with actions
- Customer list with notes and history
- Analytics: bookings, revenue, no-shows, popular services, customer retention
- Settings: notification preferences, payment account, cancellation policy

**Acceptance Criteria:**
- [ ] Dashboard loads key metrics in < 2s
- [ ] Service changes reflect in customer-facing app within 5 minutes
- [ ] Staff can have reduced permissions (view only, no pricing edit)
- [ ] Analytics exportable to CSV
- [ ] Multiple business locations manageable under single account
- [ ] Mobile-responsive for on-the-go management

---

### 3.17 Admin Dashboard (Priority: P1)

**Description:** Platform oversight and operational management.

**Requirements:**
- User management: search, view, suspend, impersonate
- Business verification and approval workflow
- Content moderation: reviews, photos, business claims
- Category and taxonomy management
- Financial oversight: transactions, refunds, payouts, platform fee adjustment
- Analytics: MAU, bookings, GMV, churn, top businesses/categories
- System health: API performance, error rates, job queue status
- Support ticket integration

**Acceptance Criteria:**
- [ ] Role-based access: admin, support, finance, super-admin
- [ ] Business approval workflow: pending → approved/rejected with reason
- [ ] Moderation queue processes reported content within 24 hours SLA
- [ ] Financial reports exportable; audit trail immutable
- [ ] Real-time metrics refresh every 30 seconds
- [ ] All admin actions logged with admin ID and timestamp

---

### 3.18 Background Jobs (BullMQ) (Priority: P0)

**Description:** Asynchronous task processing for reliability and performance.

**Requirements:**
- Job queues: notifications, payments, search indexing, analytics, image processing, data exports
- Retry logic with exponential backoff
- Dead letter queue for failed jobs
- Job prioritization
- Scheduled/recurring jobs
- Monitoring: queue depth, processing time, failure rate

**Acceptance Criteria:**
- [ ] Notification jobs process within 30 seconds of trigger
- [ ] Failed jobs retry 3 times; then move to dead letter with alert
- [ ] Image processing (resize, optimize) completes async; placeholder shown
- [ ] Search index updates within 5 minutes of data change
- [ ] Daily/weekly analytics pre-computation runs overnight
- [ ] Job processing scales horizontally with worker instances
- [ ] Alert on queue depth > 1000 or oldest job > 5 minutes

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | App launch < 3s; page load < 2s; API response < 200ms (p95) |
| **Scalability** | Support 10,000 concurrent users; 100,000 bookings/day |
| **Security** | OWASP Top 10 mitigation; encryption at rest and in transit |
| **Compliance** | GDPR, CCPA, PCI-DSS (via Stripe) |
| **Reliability** | 99.9% uptime; graceful degradation when services down |
| **Accessibility** | WCAG 2.1 AA; screen reader compatible; keyboard navigable |

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion rate | > 15% |
| Search-to-booking | > 5% |
| App store rating | > 4.5 stars |
| Day-7 retention | > 30% |
| Business owner NPS | > 50 |
| Customer support tickets | < 2% of bookings |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Guest Browse, Search, Business Detail, Booking, Appointments, Availability, Business Owner Portal, Payments | Month 1-2 |
| **V1.1** | Map Search, Favorites, Reviews, Notifications | Month 3 |
| **V1.2** | Admin Dashboard, Analytics, Background Jobs optimization | Month 4 |
| **V2.0** | Loyalty, Group bookings, Advanced scheduling, API for partners | Month 5-6 |

---

*Document Version: 1.0 | Last Updated: 2024 | Product Owner: Alex*