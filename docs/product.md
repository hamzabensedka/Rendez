# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first appointment booking platform connecting consumers with beauty, wellness, and health service providers. The platform serves two primary user segments: **Consumers** (booking appointments) and **Providers** (managing businesses, services, and availability). An **Admin Dashboard** oversees platform operations.

---

## 2. User Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Consumer** | End-user seeking to book appointments | Discover, compare, book, manage appointments |
| **Guest** | Unregistered visitor browsing services | Explore without commitment |
| **Provider Owner** | Business owner managing their salon/clinic | Configure services, set availability, manage bookings |
| **Provider Staff** | Employee of a business | View and manage their appointments |
| **Admin** | Platform operator | Monitor, moderate, support |

---

## 3. Feature Specifications

### 3.1 User Authentication

**Priority:** P0 — Critical Path

**Description:** Secure identity management for all user types with role-based access.

| Aspect | Specification |
|--------|---------------|
| **Registration Methods** | Email/password, Google OAuth, Apple Sign-In |
| **Login Methods** | All registration methods + "Continue as Guest" |
| **Password Security** | Min 8 chars, 1 uppercase, 1 number, 1 special char; bcrypt hashing |
| **Session Management** | JWT access token (15 min expiry) + refresh token (7 days); biometric re-auth optional |
| **Account Verification** | Email OTP for email registration; phone SMS optional for providers |
| **Password Recovery** | Secure token via email, 1-hour expiry, single-use |
| **Role Assignment** | `consumer`, `provider_owner`, `provider_staff`, `admin` — set at registration or by invitation |

**Acceptance Criteria:**
- [ ] New user can register with email in < 30 seconds
- [ ] OAuth users auto-create profile with available data
- [ ] Token refresh is seamless (no user-facing re-login)
- [ ] Biometric prompt appears on app resume after 5 minutes idle
- [ ] "Continue as Guest" bypasses auth, restricts booking and favorites
- [ ] Provider accounts require email + phone verification before business activation

---

### 3.2 Guest Browse & Explore

**Priority:** P0 — Acquisition Funnel

**Description:** Unauthenticated discovery experience to convert visitors to registered users.

| Aspect | Specification |
|--------|---------------|
| **Accessible Content** | Business listings, service categories, search, basic business details, reviews (read-only) |
| **Restricted Actions** | Booking, favorites, appointment management, leaving reviews |
| **Conversion Triggers** | Prompt registration at: attempt to book, add favorite, or view full availability |
| **Guest Data Persistence** | 30-day local storage of search history and viewed businesses; prompt to save on registration |

**Acceptance Criteria:**
- [ ] Guest sees identical search and discovery UI as authenticated users
- [ ] Registration modal appears with context of attempted action pre-filled
- [ ] Guest can view business open hours and service descriptions
- [ ] Guest cannot see real-time slot availability ("Sign in to see available times")
- [ ] Post-registration, guest history merges with new account

---

### 3.3 Business Search & Discovery

**Priority:** P0 — Core Value Proposition

**Description:** Intelligent search enabling consumers to find suitable service providers.

| Aspect | Specification |
|--------|---------------|
| **Search Inputs** | Free text (business name, service name), category filter, location (current/detected/manual), date range, price range, rating, availability filter ("available today") |
| **Search Algorithm** | PostgreSQL full-text search + weighted scoring (relevance, distance, rating, availability) |
| **Results Display** | List view (default) / Map view toggle; sort by relevance, distance, rating, price |
| **Auto-complete** | Business names, service names, popular categories; < 200ms response |
| **Recent Searches** | Persist last 10, clearable; sync across devices for authenticated users |
| **Empty States** | Suggested alternatives: broader radius, different date, related categories |

**Acceptance Criteria:**
- [ ] Search returns results in < 500ms for 95th percentile queries
- [ ] Typo tolerance handles 1-2 character errors ("massge" → "massage")
- [ ] Results update dynamically as filters change without full reload
- [ ] "Available today" filter excludes businesses with no open slots
- [ ] Search history is searchable and deletable

---

### 3.4 Map-based Search

**Priority:** P0 — Discovery Enhancement

**Description:** Geographic visualization of businesses with interactive exploration.

| Aspect | Specification |
|--------|---------------|
| **Map Provider** | Mapbox GL / Google Maps SDK |
| **Default Viewport** | User's current location; fallback to city center |
| **Business Markers** | Clustered at zoom < 12; individual pins at zoom ≥ 12; color-coded by category |
| **Marker Info** | Tap reveals: business name, rating, price indicator, next available slot |
| **Boundary Search** | Visible map area triggers new search; debounced 300ms |
| **User Location** | Blue dot with accuracy ring; permission request on first use |
| **Directions** | External maps app integration for navigation |

**Acceptance Criteria:**
- [ ] Map initializes to user location within 3 seconds
- [ ] 1000+ markers cluster without performance degradation
- [ ] Pin tap reveals info card in < 200ms
- [ ] Map-to-list transition preserves search context and scroll position
- [ ] Works offline with cached tile data for previously viewed areas

---

### 3.5 Business Detail View

**Priority:** P0 — Conversion Point

**Description:** Comprehensive business profile driving booking decisions.

| Section | Content |
|---------|---------|
| **Header** | Cover image carousel (max 10), business name, verified badge, favorite toggle |
| **Key Info** | Rating (average + count), price range indicator, address, distance, open now status |
| **Services** | Categorized list with: name, duration, description, price, book button |
| **Availability Preview** | Next 3 available slots across upcoming 7 days; "See full calendar" CTA |
| **About** | Description, amenities, languages spoken, parking info, COVID protocols |
| **Team** | Staff profiles with photos, specialties, ratings |
| **Reviews** | Aggregate rating, rating distribution, recent reviews with photos |
| **Location** | Static map with address, hours, contact info |
| **Similar Businesses** | Carousel of related providers |

**Acceptance Criteria:**
- [ ] Page loads critical content in < 2s (Lighthouse performance score ≥ 90)
- [ ] Image gallery supports pinch-zoom and swipe
- [ ] "Book" action on service item pre-fills booking flow
- [ ] Phone number triggers native dialer; address opens maps
- [ ] Share button generates deep link with preview image
- [ ] Reviews paginate 10 per load; sort by recent, relevant, critical

---

### 3.6 Service Categories

**Priority:** P0 — Taxonomy Foundation

**Description:** Hierarchical classification enabling discovery and business organization.

| Aspect | Specification |
|--------|---------------|
| **Hierarchy** | Category → Subcategory → Service (3 levels) |
| **Root Categories** | Hair, Face & Skin, Body & Massage, Nails, Medical Aesthetic, Fitness, Wellness |
| **Category Attributes** | Icon, color, description, popular services, SEO metadata |
| **Business Assignment** | Businesses select 1-3 primary categories; services map to subcategories |
| **Dynamic Discovery** | Trending categories, seasonal promotions, "New in [City]" |

**Acceptance Criteria:**
- [ ] Category tree loads in < 300ms
- [ ] Category pages show relevant businesses sorted by composite score
- [ ] Businesses appear in parent category searches when assigned to child
- [ ] Admin can create, edit, merge categories without code deploy
- [ ] Category changes trigger reindex within 5 minutes

---

### 3.7 Booking Flow

**Priority:** P0 — Revenue Critical

**Description:** Friction-reduced appointment reservation with flexible options.

| Step | Interaction |
|------|-------------|
| **1. Service Selection** | Pre-selected from business page, or choose from business services |
| **2. Staff Preference** | "Any available" (default) or select specific staff member; show staff availability |
| **3. Date & Time** | Calendar view with available slots highlighted; slot grid for selected date |
| **4. Add-ons** | Optional upsells: specific products, extra time, package deals |
| **5. Guest Info** | Auto-fill for returning users; name, phone, email, notes for provider |
| **6. Confirmation** | Order summary with cancellation policy, payment method, terms acceptance |
| **7. Booking Result** | Success animation, add to calendar, share, direction links |

**Slot Display Rules:**
- Show slots in business timezone, converted to user timezone with clear indication
- Hide slots within 2 hours of current time (buffer for preparation)
- Respect business buffer time between appointments
- Block staff lunch breaks and time-off

**Acceptance Criteria:**
- [ ] Complete flow in ≤ 5 taps from service selection
- [ ] Slot selection updates availability in real-time (pessimistic locking)
- [ ] Held slot expires after 10 minutes of inactivity; user notified at 8 min
- [ ] Double-booking prevented at database level (unique constraint on staff + start time)
- [ ] Booking confirmation arrives via push + email + SMS within 5 seconds
- [ ] Guest checkout supported with email capture for account creation prompt

---

### 3.8 Appointment Management

**Priority:** P0 — Retention Critical

**Description:** Lifecycle management for consumer appointments.

| Status | Description | Transitions |
|--------|-------------|-------------|
| `pending` | Awaiting provider confirmation | → confirmed, cancelled, declined |
| `confirmed` | Booked and scheduled | → completed, cancelled, no-show |
| `completed` | Service rendered | → reviewable |
| `cancelled` | Cancelled by user or provider | — |
| `declined` | Provider rejected | — |
| `no-show` | User failed to attend | — |

**Consumer Actions:**
- View upcoming and past appointments with status indicators
- Reschedule: select new slot within business's rescheduling policy (default 24h before)
- Cancel with reason selection; refund policy displayed
- Rebook: one-tap repeat of previous service with same provider
- Add to native calendar (iCal/ICS)

**Acceptance Criteria:**
- [ ] Upcoming appointments sorted by date; past by recency
- [ ] Reschedule respects business policy; blocked with explanation if violated
- [ ] Cancellation triggers instant notification to provider and waitlist check
- [ ] Push notification 24h and 1h before appointment
- [ ] Review prompt appears 2 hours after `completed` status

---

### 3.9 Favorites

**Priority:** P1 — Engagement

**Description:** Bookmarked businesses for quick re-access.

| Aspect | Specification |
|--------|---------------|
| **Actions** | Add/remove from business detail, search results, or post-booking |
| **Organization** | Default list + user-created custom lists ("My regulars", "To try") |
| **Notifications** | Optional: notify of new availability, promotions, or openings at favorite businesses |
| **Privacy** | Private by default; share lists via link (optional) |

**Acceptance Criteria:**
- [ ] Toggle updates in < 200ms with haptic feedback
- [ ] Favorites accessible from main navigation in 2 taps
- [ ] Offline: favorited businesses cached for basic info viewing
- [ ] Sync across devices; handle conflicts (last-write-wins)

---

### 3.10 User Profile

**Priority:** P1 — Personalization

| Section | Content |
|---------|---------|
| **Personal Info** | Name, email, phone, profile photo, birthday (for birthday offers) |
| **Preferences** | Notification settings, default search radius, preferred payment method, language |
| **Payment Methods** | Saved cards (PCI-compliant tokenization), Apple Pay, Google Pay |
| **Loyalty** | Points balance, tier status, reward history |
| **Security** | Password change, -account deletion, download data |
| **Activity** | Appointment history, reviews written, favorites |

**Acceptance Criteria:**
- [ ] Profile completion percentage incentivizes filling optional fields
- [ ] Data export (GDPR) generates downloadable archive within 24 hours
- [ ] Account deletion anonymizes data, retains transactional records per legal requirement
- [ ] Profile photo upload supports crop, rotate, max 5MB

---

### 3.11 Availability & Slot Computation

**Priority:** P0 — Technical Foundation

**Description:** Real-time, accurate availability calculation considering all constraints.

| Input | Description |
|-------|-------------|
| **Business Hours** | Weekly recurring schedule + exception dates (holidays, closures) |
| **Staff Schedules** | Individual working hours, breaks, time-off |
| **Service Duration** | Base duration + variable add-ons |
| **Booking Constraints** | Min/max advance notice, max future booking window, buffer between appointments |
| **Existing Bookings** | Confirmed and pending appointments |
| **Staff-Service Mapping** | Which staff can perform which services |

**Computation Logic:**
1. Generate candidate slots from business hours intersecting staff availability
2. Filter by advance notice (e.g., no bookings < 2 hours out)
3. Subtract existing bookings and buffers
4. Apply staff-service constraints
5. Return available slots grouped by date

**Optimization:**
- Cache computed slots with 30-second TTL
- Invalidate on booking mutation
- Pre-compute next 7 days; on-demand for 8-30 days

**Acceptance Criteria:**
- [ ] Slot query returns in < 100ms for 30-day window
- [ ] Concurrent booking requests serialize correctly (no overbooking)
- [ ] Timezone transitions handled correctly (DST, business in different zone)
- [ ] Slot accuracy: 100% match between displayed and bookable slots
- [ ] System degrades gracefully: if computation fails, show "Call to book" fallback

---

### 3.12 Shared Types & Design System

**Priority:** P0 — Quality Foundation

**Design System — "Planity DS":**

| Element | Specification |
|---------|---------------|
| **Colors** | Primary: #6B4EE6 (purple), Secondary: #00C9A7 (teal), Semantic: red/green/amber, Neutrals: slate scale |
| **Typography** | Inter (body), DM Sans (headings); scale: 12px caption to 32px H1 |
| **Spacing** | 4px base unit; 0.5rem–6rem scale disciplines |
| **Elevation** | 4 shadow levels (sm, md, lg, xl) |
| **Border Radius** | 8px default, 16px cards, 9999px pills |
| **Motion** | 200ms standard transition, ease-in-out; 300ms for page transitions |

**Component Library:**
- Buttons (primary, secondary, ghost, danger; sm/md/lg)
- Inputs (text, search, select, date, time, textarea)
- Cards (business, service, review, appointment)
- Modals (bottom sheet mobile, centered desktop)
- Loading states (skeleton, spinner, progress)
- Empty states (illustrated, actionable)

**Shared Types (TypeScript):**
Core entities: `User`, `Business`, `Service`, `Staff`, `Appointment`, `Review`, `Category`, `Availability`, `Payment`, `Notification`

**Acceptance Criteria:**
- [ ] 100% component coverage in Storybook with interactive states
- [ ] WCAG 2.1 AA compliance across all components
- [ ] Dark mode support via CSS variables
- [ ] Type safety: no `any` types in shared package
- [ ] Design tokens sync to Figma via plugin

---

### 3.13 Reviews & Ratings

**Priority:** P1 — Trust & Discovery

| Aspect | Specification |
|--------|---------------|
| **Rating Dimensions** | Overall (1-5 stars), plus optional: Service quality, Ambiance, Staff professionalism, Value |
| **Review Content** | Text (10-2000 chars), photos (max 5, 10MB each), service received, date visited |
| **Verification** | "Verified visit" badge for completed appointments; anonymous option |
| **Provider Response** | Public reply capability; notification on new review |
| **Moderation** | Auto-flag: profanity, spam patterns, competitor mentions; human review queue |
| **Display** | Sortable; helpfulness voting; report function |

**Acceptance Criteria:**
- [ ] Review form accessible within 2 hours post-appointment; closes after 30 days
- [ ] Photo upload with compression preview
- [ ] Rating distribution chart accurate to 0.1 stars
- [ ] Provider response appears below review with "Business owner" badge
- [ ] Reported reviews hidden pending review within 4 hours

---

### 3.14 Payment Integration

**Priority:** P0 — Revenue Enabler

| Aspect | Specification |
|--------|---------------|
| **Providers** | Stripe (primary), PayPal (alternative) |
| **Payment Types** | Card (tokenized), Apple Pay, Google Pay, Buy Now Pay Later (Klarna/Afterpay) |
| **Flows** | Pay at booking, pay at appointment, deposit + balance, gift card redemption |
| **Security** | PCI-DSS Level 1 via Stripe; never touch raw card data |
| **Receipts** | Auto-email; in-app history; downloadable PDF |
| **Refunds** | Full, partial, or credit per business policy; admin override |

**Acceptance Criteria:**
- [ ] Payment intent created in < 3 seconds
- [ ] 3D Secure handled natively
- [ ] Failed payment shows specific error with retry guidance
- [ ] Webhook handling idempotent (prevent double-charge)
- [ ] Payout to providers: daily batch, 2-day hold, detailed statement

---

### 3.15 Notifications

**Priority:** P1 — Engagement & Operations

| Channel | Use Cases | User Control |
|---------|-----------|------------|
| **Push** | Booking confirmation/reminder, promotion, message from provider | Granular per-type toggles |
| **Email** | Receipt, policy changes, marketing (opt-in), weekly digest | Frequency preferences |
| **SMS** | Booking reminder, last-minute availability, security codes | On/off per type |
| **In-App** | New review, appointment update, loyalty milestone | Mark read, archive |

**Notification Types:**
- Booking: confirmation, reminder (24h, 1h), modification, cancellation
- Promotional: favorite business offer, new service, re-engagement
- Operational: password change, payment issue, policy update
- Social: review response, provider message

**Acceptance Criteria:**
- [ ] Push delivery rate > 95% (excluding unsubscribed devices)
- [ ] Notification deep links to relevant screen
- [ ] Batch similar notifications ("3 new appointments today")
- [ ] Respect Do Not Disturb hours (configurable, default 22:00-08:00)
- [ ] Unsubscribe processes all channels within 24 hours

---

### 3.16 Provider / Business Owner Portal

**Priority:** P0 — Supply Side

**Dashboard:**
- Today's appointments overview with status
- Weekly revenue, booking volume, occupancy rate charts
- Quick actions: block time, add booking, message client

**Calendar Management:**
- Day/week/month views; staff filter
- Click to create manual booking, view details, modify
- Drag to reschedule; color-coded by status

**Service Configuration:**
- CRUD services with: name, description, duration, price, buffer time, category mapping
- Staff assignment: who can perform which services
- Availability templates and exceptions

**Staff Management:**
- Add staff (invite via email), set permissions, configure schedules
- Individual staff performance metrics

**Client Management:**
- Client directory with history, notes, preferences
- Marketing: send offers to segments

**Settings:**
- Business profile, photos, hours, policies (cancellation, no-show)
- Payment account connection, payout schedule
- Notification preferences

**Acceptance Criteria:**
- [ ] Portal responsive: full function on tablet, optimized on desktop
- [ ] Real-time sync: booking from consumer instantly appears
- [ ] Offline mode: queue changes, sync on reconnect
- [ ] Multi-location support: switch context, consolidated reporting
- [ ] Staff permissions: owner (full), manager (most), staff (view own only)

---

### 3.17 Admin Dashboard

**Priority:** P1 — Platform Operations

| Module | Function |
|--------|----------|
| **User Management** | Search, view, suspend, impersonate; KYC review for providers |
| **Business Moderation** | Approve new registrations, verify documents, handle disputes |
| **Content Moderation** | Review queue for reported reviews, photos, business info |
| **Financial Oversight** | Transaction monitoring, refund approval, payout tracking, fee adjustment |
| **Analytics** | MAU, booking volume, GMV, churn, top categories, geographic distribution |
| **System Health** | Queue depths, error rates, API latency, third-party status |
| **Communications** | Broadcast announcements, targeted emails, in-app messages |

**Acceptance Criteria:**
- [ ] Role-based access: super_admin, ops, support, finance, readonly
- [ ] Audit log: all admin actions with before/after state
- [ ] SLA alerts: page support for P1 issues in < 5 minutes
- [ ] Data export for any reportable view

---

### 3.18 Background Jobs (BullMQ)

**Priority:** P0 — Infrastructure

| Queue | Jobs | Priority | Concurrency |
|-------|------|----------|-------------|
| `notifications` | Send push/email/SMS, process preferences | High | 10 workers |
| `bookings` | Compute availability, process confirmations, handle waitlist | Critical | 5 workers |
| `payments` | Charge, refund, payout, reconciliation | Critical | 5 workers |
| `search-index` | Reindex businesses, update rankings | Medium | 3 workers |
| `reports` | Generate analytics, export data, email delivery | Low | 2 workers |
| `media` | Image optimization, thumbnail generation, virus scan | Medium | 5 workers |
| `reminders` | Appointment reminders, follow-ups, re-engagement | High | 5 workers |

**Job Patterns:**
- Idempotency: deduplicate by job ID or composite key
- Retry: exponential backoff, max 3 attempts, then dead letter
- Scheduling: cron for recurring (daily reports), delay for one-time (reminders)
- Monitoring: job duration, success rate, queue depth alerts

**Acceptance Criteria:**
- [ ] No job loss on worker crash (Redis persistence)
- [ ] Failed jobs visible in dashboard with retry/abort actions
- [ ] Queue depth alert if > 1000 jobs unprocessed for > 5 minutes
- [ ] Job processing latency: 95th percentile < 30 seconds for critical queues

---

## 4. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Performance** | App cold start < 2s; page load < 1.5s; API response < 200ms (p95) |
| **Availability** | 99.9% uptime; < 4 hours monthly planned maintenance |
| **Security** | OWASP Top 10 mitigation, annual penetration test, SOC 2 Type II |
| **Privacy** | GDPR/CCPA compliant, data retention policies, breach notification 72h |
| **Accessibility** | WCAG 2.1 AA, VoiceOver/TalkBack tested |
| **Localization** | French (default), English, German, Spanish; RTL ready |

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Monthly Bookings | 10% MoM growth |
| Booking Completion Rate | > 60% of carts initiated |
| Provider Activation | > 80% complete profile within 7 days |
| Consumer Retention | > 40% second booking within 30 days |
| NPS | > 50 for consumers, > 40 for providers |
| Support Tickets | < 2% of transactions |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Guest Browse, Search, Business Detail, Booking, Appointments, Provider Portal basics | Month 1-2 |
| **V1.0** | Map, Categories, Reviews, Payments, Notifications, Favorites | Month 3-4 |
| **V1.5** | Advanced availability, Staff management, Loyalty, Marketing tools | Month 5-6 |
| **V2.0** | Admin Dashboard, Analytics, API for partners, Internationalization | Month 7-8 |

---

*Document Version: 1.0*
*Last Updated: 2024*
*Owner: Alex — Product Owner*