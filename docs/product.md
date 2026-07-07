# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a marketplace platform connecting consumers with beauty, wellness, and service professionals for appointment booking. The platform serves three user segments: **Consumers** (book appointments), **Providers/Business Owners** (manage business and appointments), and **Admin** (platform oversight).

---

## 2. User Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Consumer** | Individual seeking beauty/wellness services | Discover, book, manage appointments |
| **Guest** | Unregistered browser | Explore without commitment |
| **Provider** | Salon owner/independent professional | Manage bookings, grow business |
| **Admin** | Platform operator | Monitor, moderate, optimize |

---

## 3. Feature Specifications

### 3.1 User Authentication
**Priority:** P0 — Critical

| Aspect | Specification |
|--------|---------------|
| **Registration Methods** | Email/password, Google OAuth, Apple Sign-In |
| **Login** | JWT-based session with refresh token rotation |
| **Password Recovery** | Secure token-based reset via email (6-digit code, 15-min expiry) |
| **Account Verification** | Email confirmation required for bookings; SMS optional for providers |
| **Role Assignment** | `consumer` (default), `provider` (on business claim), `admin` (manual) |

**Acceptance Criteria:**
- [ ] User can register with email, password, and optional phone number
- [ ] Password minimum: 8 chars, 1 uppercase, 1 number, 1 special character
- [ ] OAuth users auto-verified; can link email/password later
- [ ] Rate limit: 5 login attempts per 15 minutes per IP
- [ ] Tokens expire: access 15 min, refresh 7 days
- [ ] Logout invalidates refresh token on server

---

### 3.2 Guest Browse & Explore
**Priority:** P0 — Critical

| Aspect | Specification |
|--------|---------------|
| **Access** | No account required for browsing search and business profiles |
| **Limitations** | Booking, favorites, and reviews require authentication |
| **Prompt Strategy** | Soft prompts at booking CTA; hard gate only at payment |
| **Guest Data** | Local storage for viewed businesses; prompt to save on login |

**Acceptance Criteria:**
- [ ] Guest sees full search results and business profiles
- [ ] "Book Now" CTA triggers auth modal with option to continue as guest (email capture)
- [ ] Guest checkout collects: name, email, phone; auto-creates account post-booking
- [ ] Guest session data merges on account creation

---

### 3.3 Business Search & Discovery
**Priority:** P0 — Critical

| Aspect | Specification |
|--------|---------------|
| **Search Input** | Free text (business name, service name, category) |
| **Filters** | Category, price range, rating (≥), distance radius, availability ("open now", specific date), amenities |
| **Sorting** | Relevance (default), rating, price (low-high), distance, most reviewed |
| **Results Display** | Card list with: image, name, rating, distance, starting price, next available slot |
| **Pagination** | Cursor-based, 20 results per load |

**Acceptance Criteria:**
- [ ] Search debounced at 300ms; min 2 characters
- [ ] Typo tolerance via fuzzy matching (Levenshtein distance ≤ 2)
- [ ] Empty state with popular categories and nearby suggestions
- [ ] Filter count badge; clear all option
- [ ] Results update within 500ms for cached data, 2s max for cold query

---

### 3.4 Map-based Search
**Priority:** P1 — High

| Aspect | Specification |
|--------|---------------|
| **Map Provider** | Mapbox GL JS (web), native maps (mobile) |
| **Clustering** | Marker clustering at zoom levels < 12 |
| **User Location** | GPS with fallback to IP geolocation; accuracy indicator |
| **Business Markers** | Price indicator or category icon; tap for preview card |
| **Interactions** | Pan/zoom updates results; list/map toggle persists preference |
| **Bounds Search** | Search within visible map area with "Search here" button on move |

**Acceptance Criteria:**
- [ ] Map initializes to user location within 5 seconds
- [ ] Marker tap opens bottom sheet with key info and CTA
- [ ] Cluster tap zooms to de-cluster
- [ ] List and map views stay synchronized on filter/sort changes
- [ ] Accessibility: screen reader announces result count on map

---

### 3.5 Business Detail View
**Priority:** P0 — Critical

| Aspect | Specification |
|--------|---------------|
| **Hero Section** | Image carousel (max 10), business name, rating, favorite toggle, share |
| **Info Tabs** | Services, Reviews, About, Availability |
| **Services** | Categorized list with duration, price, description, book CTA |
| **Reviews Summary** | Aggregate rating, distribution histogram, top tags |
| **About** | Description, hours, amenities, contact, social links |
| **Staff** | Selectable team members with photos, specialties, ratings |
| **Action Bar** | Sticky: phone, direction, book now |

**Acceptance Criteria:**
- [ ] Page loads core content in < 1.5s; images lazy-loaded
- [ ] Deep linkable URL: `/b/{slug}-{businessId}`
- [ ] Share generates preview image with business info
- [ ] Offline: cached business data viewable
- [ ] "Book Now" pre-selects service if tapped from service card

---

### 3.6 Service Categories
**Priority:** P1 — High

| Aspect | Specification |
|--------|---------------|
| **Hierarchy** | Category → Subcategory → Service |
| **Examples** | Hair > Cut & Style > Women's Haircut; Wellness > Massage > Swedish Massage |
| **Business Assignment** | Businesses select from taxonomy; can add custom services |
| **Discovery** | Category browse from homepage; trending categories |
| **Icons** | Custom SVG icon set per category/subcategory |

**Acceptance Criteria:**
- [ ] Taxonomy managed via CMS; max 3 levels deep
- [ ] Search matches across all category levels
- [ ] Business can suggest new categories (admin approval)
- [ ] Category pages SEO-optimized with structured data

---

### 3.7 Booking Flow
**Priority:** P0 — Critical

| Step | Details |
|------|---------|
| **1. Service Selection** | Single or multiple services; duration and price auto-summed |
| **2. Provider/Staff Selection** | Any available or specific staff; shows staff calendar |
| **3. Date/Time Selection** | Calendar view with available slots; timezone aware |
| **4. Slot Confirmation** | Hold slot for 10 minutes (distributed lock) |
| **5. Details** | Notes, preferences, first-time client questionnaire |
| **6. Payment** | Full, deposit, or pay-at-business (configurable per business) |
| **7. Confirmation** | Booking reference, calendar invite, directions |

**Acceptance Criteria:**
- [ ] Slot selection triggers 10-min hold; countdown visible
- [ ] Hold releases automatically on timeout, back navigation, or payment failure
- [ ] Double-booking prevented via atomic slot reservation
- [ ] Guest checkout flows through without friction; account created post-booking
- [ ] Booking confirmation email/SMS sent within 30 seconds
- [ ] Retry mechanism: 3 attempts for payment, exponential backoff

---

### 3.8 Appointment Management
**Priority:** P0 — Critical

| Aspect | Specification |
|--------|--------------- bearing |
| **Consumer View** | Upcoming (sorted by date), past, cancelled tabs |
| **Actions** | Reschedule (same business, new slot), cancel with policy check, rebook |
| **Cancellation Policy** | Business-defined: flexible (24h), moderate (48h), strict (72h); penalties displayed |
| **Reminders** | 24h and 1h before via push/SMS/email (user preference) |
| **Check-in** | QR code or in-app confirmation on arrival |
| **No-show Handling** | Provider marks no-show; triggers policy enforcement |

**Acceptance Criteria:**
- [ ] Reschedule enforces same business, future slots only
- [ ] Cancellation within policy window: full refund; outside: partial/no refund
- [ ] Past appointments prompt for review (48-hour window)
- [ ] Calendar sync: Google/Apple calendar integration (one-way add, optional two-way)
- [ ] Push notification deep-links to appointment detail

---

### 3.9 Favorites
**Priority:** P2 — Medium

| Aspect | Specification |
|--------|---------------|
| **Save Action** | Heart toggle on business card and detail page |
| **List View** | Grid/sortable; show open status, next availability |
| **Notifications** | Opt-in: "New availability at [favorite]", "Deal from [favorite]" |
| **Sync** | Cross-device; survives logout/login |

**Acceptance Criteria:**
- [ ] Unauthenticated: prompt login; no local-only favorites (avoid data loss)
- [ ] Batch remove option
- [ ] Maximum 500 favorites per user (performance guardrail)

---

### 3.10 User Profile
**Priority:** P1 — High

| Section | Content |
|---------|---------|
| **Personal Info** | Name, email, phone, photo, birthday (for birthday offers) |
| **Preferences** | Notification channels, default search radius, language, currency |
| **Payment Methods** | Multiple cards, default selection; PCI-compliant tokenization |
| **Addresses** | Home/work/frequent locations for quick search |
| **Booking History** | All appointments with receipts |
| **Settings** | Privacy, data export, account deletion (GDPR) |

**Acceptance Criteria:**
- [ ] Profile completion progress indicator; 80% for "verified" badge
- [ ] Data export: JSON/CSV, delivered via email within 24 hours
- [ ] Account deletion: 30-day grace period, anonymize data post-period
- [ ] Change history logged for security audit

---

### 3.11 Availability & Slot Computation
**Priority:** P0 — Critical (Infrastructure)

| Aspect | Specification |
|--------|---------------|
| **Business Hours** | Weekly recurring + exception dates (holidays, closures) |
| **Slot Generation** | Based on service duration + buffer + staff availability |
| **Constraints** | Staff schedule, existing bookings, break times, buffer between appointments |
| **Optimization** | Pre-compute next 30 days; real-time for today + next 7 days |
| **Caching** | Redis with TTL; invalidate on booking mutation |

**Acceptance Criteria:**
- [ ] Slot query returns in < 200ms for cached data
- [ ] Concurrent booking requests handled atomically (Redis SET NX or DB unique constraint)
- [ ] Slot computation accounts for: staff lunch breaks, back-to-back same-service optimization
- [ ] Business can block slots manually (admin override)
- [ ] Timezone handling: store UTC, display local to user and business

---

### 3.12 Shared Types & Design System
**Priority:** P1 — High (Enabler)

| Component | Specification |
|-----------|---------------|
| **Design Tokens** | Colors, typography, spacing, shadows in JSON/CSS variables |
| **Component Library** | React Native + Web (Storybook); shared via monorepo |
| **Core Components** | Button, Input, Card, Modal, DatePicker, TimeSlot, Avatar, RatingStars, Skeleton |
| **Icons** | Lucide icon set; custom category icons |
| **Theme** | Light/dark mode; brand color injection per business (white-label ready) |
| **Accessibility** | WCAG 2.1 AA minimum; focus management, ARIA labels, color contrast |

**Acceptance Criteria:**
- [ ] All UI components documented in Storybook with usage examples
- [ ] Component props typed with TypeScript; no `any`
- [ ] Responsive breakpoints: mobile < 768px, tablet 768-1024px, desktop > 1024px
- [ ] RTL language support structurally prepared

---

### 3.13 Reviews & Ratings
**Priority:** P1 — High

| Aspect | Specification |
|--------|---------------|
| **Eligibility** | Verified booking completed; review window: 48h post-appointment to 30 days |
| **Rating Dimensions** | Overall (1-5), optional: service quality, staff, ambiance, value |
| **Content** | Text (max 500 chars), photos (max 5), staff tag |
| **Moderation** | Auto-approve with keyword filter; manual queue for flagged content |
| **Business Response** | Public reply; notification to reviewer |
| **Helpfulness** | Upvote/downvote; sort by helpful or recent |

**Acceptance Criteria:**
- [ ] User cannot review same appointment twice; can edit within 48h
- [ ] Business can flag inappropriate reviews; admin adjudicates within 48h
- [ ] Review average recalculates with 24-hour delay (prevent gaming)
- [ ] Anonymous option: display "Verified Customer" vs. name
- [ ] Photo reviews require manual approval (moderation)

---

### 3.14 Payment Integration
**Priority:** P0 — Critical

| Aspect | Specification |
|--------|---------------|
| **Provider** | Stripe (primary); Adyen for EU expansion |
| **Methods** | Cards, Apple Pay, Google Pay, PayPal (optional) |
| **Flows** | Immediate charge, deposit (hold), or full at business |
| **Split Payments** | Platform fee deducted; remainder to business (weekly payout) |
| **Refunds** | Full, partial, or credit; processed via dashboard or API |
| **Invoicing** | VAT/GST compliant receipts; business branding |

**Acceptance Criteria:**
- [ ] PCI compliance: never touch raw card data (Stripe Elements)
- [ ] 3D Secure for applicable transactions
- [ ] Webhook handling: idempotent, retry with exponential backoff
- [ ] Failed payment: 3 retries, user notification, auto-cancellation after final failure
- [ ] Payout dashboard for providers: pending, paid, upcoming

---

### 3.15 Notifications
**Priority:** P1 — High

| Channel | Use Cases |
|---------|-----------|
| **Push** | Booking confirmation, reminders, promotions, message from business |
| **SMS** | Booking critical (confirmation, reminder, OTP); fallback for push |
| **Email** | Receipts, account activity, marketing (opt-in), digest |
| **In-App** | Notification center with read/unread, deep-linking |

**Acceptance Criteria:**
- [ ] User controls per-channel, per-type preferences
- [ ] Quiet hours: no push 22:00-08:00 local time (except critical)
- [ ] Delivery tracking: log sent, delivered, opened; retry undelivered
- [ ] Unsubscribe: one-click for marketing; transactional always sent
- [ ] Template management: CMS-editable with variable injection

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0 — Critical

| Module | Features |
|--------|----------|
| **Dashboard** | Today's appointments, revenue snapshot, new reviews, quick actions |
| **Calendar** | Day/week/month views; drag-to-reschedule; color-coded by status |
| **Services** | CRUD services, pricing, duration, buffer, online booking toggle |
| **Staff** | Add team members, set permissions, manage individual schedules |
| **Bookings** | View all, filter, manual booking entry, block time |
| **Clients** | CRM: notes, visit history, preferences, marketing tags |
| **Analytics** | Revenue trends, booking sources, cancellation rate, staff utilization |
| **Settings** | Business info, hours, cancellation policy, payment methods, integrations |

**Acceptance Criteria:**
- [ ] Role-based access: owner (full), manager (bookings, staff), staff (own calendar only)
- [ ] Calendar sync: two-way with Google/Outlook
- [ ] Manual booking: bypass payment, mark as walk-in or phone booking
- [ ] Export: bookings and client data to CSV
- [ ] Mobile-responsive for on-the-go management

---

### 3.17 Admin Dashboard
**Priority:** P2 — Medium

| Module | Features |
|--------|----------|
| **User Management** | Search, view, suspend, impersonate (audit logged) |
| **Business Verification** | Onboarding queue, document verification, approval/rejection with reason |
| **Content Moderation** | Review flag queue, image moderation, business content approval |
| **Financial** | Transaction monitoring, refund approval, payout management, fee structure |
| **Analytics** | MAU, bookings, GMV, churn, top categories, geographic heatmap |
| **System Health** | Queue monitoring, error rates, third-party service status |
| **CMS** | Category management, featured business curation, promotional content |

**Acceptance Criteria:**
- [ ] All admin actions audit-logged with before/after state
- [ ] Role-based access: super admin, support, finance, content moderator
- [ ] Data export: anonymized for analytics; full for legal requests (GDPR/SAR)
- [ ] Alerting: Slack/email for critical thresholds (payment failures, spike in refunds)

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P1 — High (Infrastructure)

| Queue | Jobs | Priority |
|-------|------|----------|
| **notifications** | Send push/email/SMS, digest compilation | High |
| **bookings** | Slot hold release, no-show processing, reminder scheduling | Critical |
| **payments** | Payout to providers, retry failed charges, invoice generation | Critical |
| **analytics** | Aggregate reporting, recommendation engine updates | Low |
| **maintenance** | Data cleanup, log archiving, backup verification | Low |
| **search** | Index updates, suggest rebuild | Medium |

**Acceptance Criteria:**
- [ ] Job retries: 3 attempts with jittered exponential backoff
- [ ] Dead letter queue for failed jobs; manual retry UI in admin
- [ ] Job progress trackable via dashboard for long-running tasks
- [ ] Rate limiting: respect third-party API limits (SMS provider, etc.)
- [ ] Scheduled jobs: cron syntax, timezone-aware, daylight saving handled

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | P95 API response < 500ms; page load < 2s on 3G |
| **Availability** | 99.9% uptime; scheduled maintenance windows |
| **Security** | OWASP Top 10 mitigated; annual penetration testing |
| **Scalability** | Auto-scaling; handle 10x traffic spike (Black Friday) |
| **Compliance** | GDPR, CCPA, PCI-DSS Level 1 |
| **Localization** | i18n framework; launch EN, FR, ES; expand to 10 languages |

---

## 5. Prioritization Matrix

| Feature | Priority | Sprint Target | Dependencies |
|---------|--------|-------------|--------------|
| User Authentication | P0 | Sprint 1 | — |
| Guest Browse & Explore | P0 | Sprint 1 | — |
| Business Search & Discovery | P0 | Sprint 1-2 | — |
| Business Detail View | P0 | Sprint 2 | Search |
| Booking Flow | P0 | Sprint 3-4 | Auth, Search, Slots |
| Appointment Management | P0 | Sprint 4 | Booking Flow |
| Availability & Slot Computation | P0 | Sprint 2-3 | — |
| Payment Integration | P0 | Sprint 4 | Booking Flow |
| Map-based Search | P1 | Sprint 3 | Search |
| Service Categories | P1 | Sprint 2 | CMS setup |
| User Profile | P1 | Sprint 3 | Auth |
| Reviews & Ratings | P1 | Sprint 5 | Booking completion |
| Notifications | P1 | Sprint 4-5 | Booking, Appointments |
| Provider Portal | P0 | Sprint 3-6 | Auth, Booking, Payments |
| Admin Dashboard | P2 | Sprint 6-8 | Provider Portal |
| Favorites | P2 | Sprint 5 | Auth, Search |
| Shared Types & Design System | P1 | Ongoing | — |
| Background Jobs | P1 | Sprint 3-4 | Notifications, Bookings |

---

## 6. Success Metrics

| Metric | Target |
|--------|--------|
| Search-to-booking conversion | > 8% |
| Booking completion rate | > 75% (started to confirmed) |
| Provider NPS | > 50 |
| Consumer NPS | > 60 |
| Cancellation rate | < 10% |
| No-show rate | < 5% |
| App crash-free rate | > 99.5% |
| Support ticket volume | < 1% of bookings |

---

## 7. Appendix

### 7.1 Glossary
- **Slot**: A specific time interval available for booking
- **Hold**: Temporary reservation of a slot during booking flow
- **Buffer**: Mandatory gap between consecutive appointments
- **GMV**: Gross Merchandise Value (total booking value)

### 7.2 Revision History
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-XX-XX | Alex (Product Owner) | Initial specification |

---

*This specification is a living document. Features and priorities may be adjusted based on user feedback, technical constraints, and business objectives.*
