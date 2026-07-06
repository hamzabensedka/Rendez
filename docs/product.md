# Planity Clone — Product Specification

## 1. Overview

Build a cross-platform mobile and web application that connects consumers with local beauty/wellness businesses, enabling discovery, booking, and appointment management. Two primary user types: **Consumers** (book appointments) and **Providers/Business Owners** (manage business, staff, and appointments). An **Admin** layer oversees platform health.

---

## 2. User Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Consumer** | Wants to book beauty/wellness services | Find, compare, book, manage appointments |
| **Guest** | Unregistered user browsing | Explore businesses without commitment |
| **Provider Owner** | Salon/spa owner or manager | Manage business profile, services, staff, bookings |
| **Provider Staff** | Individual professional | View schedule, manage own availability |
| **Admin** | Platform operator | Monitor, moderate, support |

---

## 3. Feature Specifications

### 3.1 User Authentication

**Priority:** P0 — Critical Path

| Aspect | Specification |
|--------|---------------|
| **Registration Methods** | Email/password, Google OAuth, Apple Sign-In |
| **Account Types** | Consumer (default), Provider (requires verification) |
| **Email Verification** | Required before booking; resend with 60s cooldown |
| **Password Reset** | Secure token via email, 24h expiry |
| **Session Management** | JWT access token (15min) + refresh token (7 days); biometric unlock optional |
| **Social Login Linking** | Allow linking additional methods to existing account |

**Acceptance Criteria:**
- [ ] User can register with email, receive verification, and activate account
- [ ] User can log in with valid credentials; invalid attempts show specific error (email not found vs. wrong password)
- [ ] Token refresh is seamless; user not logged out on app background < 5min
- [ ] Biometric prompt appears if enabled and device supports it
- [ ] Provider account creation triggers verification workflow

---

### 3.2 Guest Browse & Explore

**Priority:** P0 — Conversion Funnel

| Aspect | Specification |
|--------|---------------|
| **Access Level** | No account required; no booking without account |
| **Browse Scope** | Search businesses, view listings, see basic details, read reviews |
| **Limitations** | Cannot favorite, book, or see full availability; prompt to register at conversion points |
| **Persistence** | Guest session tracked; converting to registered account preserves search context |

**Acceptance Criteria:**
- [ ] Guest sees identical search/browse experience as logged-in user
- [ ] "Book" CTA triggers registration modal; pre-fills any captured data
- [ ] Deep links to business pages work for guests
- [ ] Converting guest preserves: search filters, viewed businesses (last 7 days)

---

### 3.3 Business Search & Discovery

**Priority:** P0 — Core Value

| Aspect | Specification |
|--------|---------------|
| **Search Inputs** | Free text (business name, service), current location, selected city/neighborhood |
| **Filters** | Category, price range, rating (min stars), availability (today, this week), distance, amenities (parking, wheelchair access, etc.) |
| **Sorting** | Relevance (default), distance, rating, price (low-high) |
| **Results Display** | Card list with: photo, name, rating, price indicator, next available slot, distance |
| **Autocomplete** | Suggest businesses, services, neighborhoods; debounced 300ms |
| **Recent Searches** | Store last 10; clearable per-item or all |

**Acceptance Criteria:**
- [ ] Search returns results in < 500ms for cached indices; < 2s for fresh
- [ ] Empty state suggests popular categories near user
- [ ] Filter combination is reflected in URL/shareable link
- [ ] Results update as filters change without full page reload
- [ ] "No results" suggests broadening filters or expanding radius

---

### 3.4 Map-based Search

**Priority:** P1 — Discovery Enhancement

| Aspect | Specification |
|--------|---------------|
| **Map Provider** | Mapbox or Google Maps |
| **Default View** | User location or search center; default 5km radius |
| **Markers** | Clustered at zoom levels; color-coded by category; selected business highlights |
| **Card Interaction** | Tapping marker opens bottom sheet with business preview; swipe to expand to detail |
| **List/Map Toggle** | Persistent across session; animate transition |
| **Bounds Search** | Moving map triggers new search within visible bounds |

**Acceptance Criteria:**
- [ ] Map loads with current location permission; fallback to city center
- [ ] Pin density clusters appropriately; no overlap at any zoom
- [ ] Map movement > 50% of viewport triggers new search with debounce
- [ ] Selected business marker is distinct; deselecting returns to default state
- [ ] Map view is shareable with current bounds and filters

---

### 3.5 Business Detail View

**Priority:** P0 — Conversion Critical

| Aspect | Specification |
|--------|---------------|
| **Header** | Photo gallery (swipeable, up to 10), business name, rating, favorite toggle, share |
| **Info Section** | Address (tappable for maps), hours (today + full schedule), phone, website |
| **Services Tab** | Categorized list; expandable for description, duration, price; "Book" CTA per service |
| **Reviews Tab** | Sortable (recent, highest, lowest); aggregate stats; verified badge |
| **Team Tab** | Staff profiles with photos, specialties, ratings |
| **About Tab** | Description, amenities, policies (cancellation, late arrival), social links |

**Acceptance Criteria:**
- [ ] Page loads in < 2s; images lazy-loaded with blur placeholder
- [ ] Photo gallery supports pinch-zoom and swipe navigation
- [ ] "Call" and "Get Directions" use native intents
- [ ] Share generates deep link with preview image
- [ ] Offline: cached basic info displayed with stale banner

---

### 3.6 Service Categories

**Priority:** P0 — Navigation Structure

| Aspect | Specification |
|--------|---------------|
| **Hierarchy** | Category → Subcategory → Service (e.g., Hair → Coloring → Balayage) |
| **Platform Categories** | Predefined taxonomy; businesses map to subset |
| **Business Services** | Owner-defined with: name, description, duration, price (fixed or from), category assignment |
| **Add-ons** | Services can have optional add-ons (e.g., hair treatment) |

**Acceptance Criteria:**
- [ ] Category browse shows count of available businesses per category
- [ ] Business can assign services to multiple categories
- [ ] Service duration enforces minimum slot granularity (15min)
- [ ] Price display handles ranges: "From €45" or "€45 – €80"

---

### 3.7 Booking Flow

**Priority:** P0 — Revenue Critical

| Step | Description |
|------|-------------|
| **1. Service Selection** | Pre-selected from business detail, or multi-select enabled |
| **2. Staff Selection** | "Any available" or specific staff; show staff photos and ratings |
| **3. Date & Time** | Calendar view with availability; morning/afternoon/evening quick filters |
| **4. Review & Confirm** | Summary: services, staff, time, total price, cancellation policy |
| **5. Payment** | See Payment Integration (3.14) |
| **6. Confirmation** | Success screen with add-to-calendar, share, booking reference |

| Aspect | Specification |
|--------|---------------|
| **Slot Display** | 15-min increments; contiguous blocks for multi-service |
| **Constraints** | Respect staff breaks, business hours, existing bookings, buffer time |
| **Waitlist** | Offer if no slots; notify on cancellation |
| **Guest Booking** | Require name, phone, email; create lightweight account |

**Acceptance Criteria:**
- [ ] Flow completes in < 5 steps; progress indicator shown
- [ ] Slot selection prevents double-booking with optimistic locking
- [ ] Changing service or staff recalculates availability without losing date preference
- [ ] Booking holds slot for 10min during payment; release on timeout or abandon
- [ ] Confirmation email/SMS sent within 30 seconds

---

### 3.8 Appointment Management

**Priority:** P0 — Retention

| Aspect | Specification |
|--------|---------------|
| **Consumer Views** | Upcoming (sorted by date), Past, Cancelled |
| **Actions** | Reschedule (select new slot), Cancel (with policy enforcement), Rebook (same service) |
| **Detail View** | All booking info, QR code for check-in, directions, contact business, add review (post-appointment) |
| **Reschedule Rules** | Within cancellation policy; new slot must meet same constraints |
| **No-Show Handling** | Business can mark; affects consumer reliability score |

**Acceptance Criteria:**
- [ ] Upcoming appointments surface in app widget/push summary
- [ ] Cancellation enforces policy: show refund/penalty before confirm
- [ ] Reschedule offers same staff if available, or "any" fallback
- [ ] Past appointments prompt for review if unrated (up to 14 days)
- [ ] Calendar sync exports with .ics on request

---

### 3.9 Favorites

**Priority:** P1 — Engagement

| Aspect | Specification |
|--------|---------------|
| **Actions** | Heart toggle from search, detail, or past booking |
| **List View** | Grid of favorited businesses; sort by recently added or name |
| **Notifications** | Option to notify of new availability or promotions |
| **Sync** | Persisted to account; reflected across devices |

**Acceptance Criteria:**
- [ ] Favorite/unfavorite is instantaneous with optimistic UI; revert on failure
- [ ] Favorited businesses surface in search as "Liked"
- [ ] Empty state suggests popular businesses near user
- [ ] User can enable/disable promotional notifications per favorite

---

### 3.10 User Profile

**Priority:** P1 — Account Management

| Section | Content |
|---------|---------|
| **Personal Info** | Name, phone, email, photo, birthday (for offers) |
| **Preferences** | Default search radius, notification settings, language, currency |
| **Payment Methods** | Saved cards (tokenized), billing address, transaction history |
| **Security** | Password change, 2FA option, active sessions, delete account |
| **Support** | FAQ, chat, email support ticket |

**Acceptance Criteria:**
- [ ] Profile completion percentage encourages adding photo, preferences
- [ ] Email/phone changes require re-verification
- [ ] Account deletion requires confirmation, shows data retention policy
- [ ] GDPR/CCPA data export available as JSON download

---

### 3.11 Availability & Slot Computation

**Priority:** P0 — Technical Foundation

| Aspect | Specification |
|--------|---------------|
| **Business Hours** | Weekly recurring schedule + exception dates (holidays, closures) |
| **Staff Availability** | Inherits business hours; individual exceptions and breaks |
| **Slot Generation** | Real-time based on: hours, staff, service duration,toneeded buffers, existing bookings |
| **Buffer Time** | Configurable between appointments (cleaning, prep) |
| **Parallel Bookings** | Multiple staff → concurrent slots; single staff → serial |
| **Caching** | Generated slots cached with TTL; invalidated on booking mutation |

**Acceptance Criteria:**
- [ ] Slot query for single business returns in < 200ms
- [ ] Booking mutation invalidates cache within 1 second
- [ ] Handles timezone correctly: business in different timezone from user
- [ ] Daylight saving transitions handled without duplicate/missing slots
- [ ] Overbooking impossible due to database-level constraint

---

### 3.12 Shared Types & Design System

**Priority:** P0 — Engineering Foundation

| Layer | Elements |
|-------|----------|
| **Design Tokens** | Colors (primary, secondary, semantic), typography scale, spacing grid, border radius, shadows |
| **Components** | Buttons, inputs, cards, modals, bottom sheets, avatars, badges, loaders, empty states, error states |
| **Navigation** | Tab bar (consumer), drawer (provider), top bar with contextual actions |
| **Icons** | Consistent set; category icons mapped to taxonomy |
| **Accessibility** | Minimum touch target 44x44dp; color contrast WCAG AA; screen reader labels |

**Acceptance Criteria:**
- [ ] All UI components exist in Storybook/component library
- [ ] Dark mode supported via design token swap
- [ ] Components responsive across phone/tablet breakpoints
- [ ] Accessibility audit passes automated checks (no color-only communication)

---

### 3.13 Reviews & Ratings

**Priority:** P1 — Trust & Conversion

| Aspect | Specification |
|--------|---------------|
| **Eligibility** | Only verified customers (completed appointment) can review |
| **Rating Dimensions** | Overall (1-5 stars), optional: service quality, staff, ambiance, value |
| **Content** | Text (max 500 chars), photos (up to 5), staff attribution |
| **Moderation** | Auto-flag profanity; human review for reported content; business can respond |
| **Display** | Aggregate score, distribution histogram, recent highlights |
| **Sorting** | Default: most relevant (weighted recency + helpfulness) |

**Acceptance Criteria:**
- [ ] Review prompt triggers 24h after appointment completion via push + email
- [ ] Business response shows "Business owner" badge and response date
- [ ] Reported reviews hidden pending moderation; reporter notified of outcome
- [ ] Editable within 7 days; deletable by author
- [ ] Aggregate score recalculates within 5 minutes of new review

---

### 3.14 Payment Integration

**Priority:** P0 — Revenue

| Aspect | Specification |
|--------|---------------|
| **Provider** | Stripe Connect (marketplace) or equivalent |
| **Consumer Methods** | Cards, Apple Pay, Google Pay, PayPal (regional) |
| **Pricing Model** | Platform fee % + fixed per transaction; split at time of charge |
| **Flows** | Immediate charge, authorize+capture (for no-show), deposit/partial (for packages) |
| **Refunds** | Full or partial; initiated by business or automated per cancellation policy |
| **Invoicing** | VAT invoice generation for business; consumer receipt |

**Acceptance Criteria:**
- [ ] PCI compliance via tokenization; no raw card data touches servers
- [ ] 3D Secure handled for applicable cards
- [ ] Failed payment shows specific error with retry option
- [ ] Refund processed within platform SLA; consumer notified
- [ ] Payout to business account on configurable schedule (weekly default)

---

### 3.15 Notifications

**Priority:** P1 — Engagement & Operations

| Channel | Triggers |
|---------|----------|
| **Push** | Booking confirmed, 24h reminder, same-day reminder, cancelled by business, waitlist available, review prompt, promotional (opt-in) |
| **SMS** | Backup for critical: booking confirmation, same-day reminder, urgent cancellation |
| **Email** | Confirmation, receipt, reminder, account activity, marketing (preference-managed) |
| **In-App** | New message from business, system announcements |

| Aspect | Specification |
|--------|---------------|
| **Preferences** | Granular opt-in per channel and category |
| **Delivery** | Push via Firebase/APNs; SMS via Twilio; email via SendGrid |
| **Retry** | Failed push → SMS fallback for critical; exponential backoff for email |

**Acceptance Criteria:**
- [ ] Notification preferences respected; no send to opted-out channel
- [ ] Rich push includes deep link to relevant screen
- [ ] Reminder timing: 24h before, 2h before, at start time
- [ ] Batch non-urgent notifications if user inactive > 4 hours

---

### 3.16 Provider / Business Owner Portal

**Priority:** P0 — Supply Side

| Module | Features |
|--------|----------|
| **Dashboard** | Today's appointments, revenue summary, pending actions, quick stats |
| **Calendar** | Day/week/month views; staff-filtered; drag-to-reschedule; block time |
| **Appointments** | List with filters; accept/decline (if approval required); check-in with QR scan |
| **Services** | CRUD services; set duration, price, category, staff eligibility |
| **Staff** | Add staff, set permissions, manage individual schedules and breaks |
| **Business Profile** | Photos, description, hours, amenities, policies; preview as consumer sees |
| **Clients** | CRM: notes, visit history, preferences, no-show count |
| **Analytics** | Revenue, bookings, cancellation rate, popular services, staff utilization |
| **Settings** | Payout account, notification preferences, team management |

**Acceptance Criteria:**
- [ ] Calendar supports multi-staff view with color coding
- [ ] Booking modification triggers instant consumer notification
- [ ] Revenue dashboard updates within 1 hour of transaction
- [ ] Staff can have restricted access (view own calendar only)
- [ ] Business can set temporary closure with auto-cancellation of affected bookings

---

### 3.17 Admin Dashboard

**Priority:** P2 — Platform Operations

| Module | Features |
|--------|----------|
| **Overview** | KPIs: active users, bookings, GMV, churn, top categories |
| **Business Management** | Onboarding queue, verification, status toggle, featured placement |
| **User Management** | Search, view, suspend, impersonate (with audit log) |
| **Content Moderation** | Review queue for reported content; business photo approval |
| **Support** | Ticket queue, assignment, escalation, canned responses |
| **Financial** | Transaction monitoring, dispute handling, payout reconciliation |
| **System** | Feature flags, announcement banners, maintenance mode |

**Acceptance Criteria:**
- [ ] All admin actions logged with admin ID, timestamp, before/after state
- [ ] Impersonation requires secondary approval; auto-terminates after 30min
- [ ] Financial reports exportable to CSV/Excel
- [ ] Real-time alert for anomalous patterns (booking spike, refund cluster)

---

### 3.18 Background Jobs (BullMQ)

**Priority:** P1 — Infrastructure

| Queue | Jobs | Trigger |
|-------|------|---------|
| **notifications** | Send push, SMS, email | Booking events, scheduled reminders, marketing |
| **bookings** | Release held slot, process no-show, auto-complete | Timer expiry, cron |
| **payments** | Capture authorized payment, process refund, payout | Webhook, schedule |
| **search** | Reindex business, update availability cache | CRUD events |
| **analytics** | Aggregate daily stats, generate reports | Cron (nightly) |
| **images** | Resize, optimize, generate thumbnails | Upload event |
| **exports** | GDPR data export, report generation | User request, admin request |

**Acceptance Criteria:**
- [ ] Failed jobs retry with exponential backoff (max 5 attempts)
- [ ] Dead letter queue for manual inspection after max retries
- [ ] Job progress trackable for long-running tasks (exports)
- [ ] Queue health monitored: depth, processing rate, error rate alerts
- [ ] Jobs are idempotent or guarded against duplicate execution

---

## 4. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Performance** | App cold start < 3s; screen transition < 300ms; API p95 < 200ms |
| **Availability** | 99.9% uptime; maintenance windows announced |
| **Security** | OWASP Top 10 mitigated; penetration tested quarterly |
| **Privacy** | GDPR, CCPA compliant; data minimization; retention policies |
| **Localization** | French, English, Spanish, German at launch; RTL consideration |
| **Accessibility** | WCAG 2.1 AA compliance |

---

## 5. Analytics & Measurement

| Metric | Definition | Target |
|--------|-----------|--------|
| Search-to-Business | % searches resulting in business detail view | > 30% |
| Business-to-Book | % detail views with booking initiation | > 15% |
| Booking Completion | % initiated bookings completed | > 70% |
| Day-7 Retention | % new users returning within 7 days | > 25% |
| NPS | Consumer satisfaction score | > 50 |
| GMV | Gross merchandise value monthly | Growth 20% MoM |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Guest Browse, Search, Business Detail, Booking, Appointments, Basic Provider Portal, Payments | Week 1-8 |
| **V1.1** | Map Search, Favorites, Reviews, Notifications, Availability Engine | Week 9-12 |
| **V1.2** | Advanced Provider Portal, Admin Dashboard, Analytics, Background Jobs | Week 13-16 |
| **V2.0** | Waitlist, Packages/Memberships, Marketplace Promotions, AI Recommendations | Post-launch |

---

## 7. Open Questions & Assumptions

1. **Geographic scope:** Launch in France, expand to EU; assume EUR, French labor laws for staff scheduling
2. **Payment split:** Platform takes 10% + €0.30 per transaction; negotiable for high-volume providers
3. **Staff as users:** Phase 1: staff managed by owner; Phase 2: staff mobile app with own login
4. **Inventory/services:** No physical inventory; service-only bookings