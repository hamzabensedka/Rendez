# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first platform connecting clients with beauty, wellness, and service businesses for appointment booking. The platform serves three user types: **Clients** (book appointments), **Providers** (manage businesses and schedules), and **Admins** (platform governance).

**Target Platforms:** iOS, Android, Web (responsive)
**Monetization:** Commission per booking, SaaS subscription for businesses, premium listing

---

## 2. Feature Specifications

### 2.1 User Authentication

**Priority:** P0 — Critical Path

| Aspect | Specification |
|--------|---------------|
| **Registration Methods** | Email/password, Google OAuth, Apple Sign-In, Facebook Login |
| **User Types** | Client (default), Provider (requires verification), Admin (platform-assigned) |
| **Onboarding Flow** | Role selection → Profile basics → Optional preferences → Home |
| **Security** | JWT access + refresh tokens, biometric login (mobile), 2FA for Providers |
| **Password Management** | Forgot password via email link, strength enforcement, 90-day rotation prompt for Providers |

**Acceptance Criteria:**
- [ ] User can register with email in < 60 seconds
- [ ] OAuth flows complete without password creation step
- [ ] Token refresh is seamless (no user-facing logout)
- [ ] Biometric prompt appears after 3rd successful login
- [ ] Account deletion initiates 30-day grace period with data export option

---

### 2.2 Guest Browse & Explore

**Priority:** P0 — Acquisition Funnel

| Aspect | Specification |
|--------|---------------|
| **Access Level** | Full browse without account; booking requires authentication |
| **Content Available** | Business listings, services, prices, reviews (aggregate), availability windows |
| **Limitations** | Cannot book, save favorites, or receive notifications |
| **Conversion Trigger** | "Book Now" or "Save" prompts login modal with context preservation |

**Acceptance Criteria:**
- [ ] Guest sees identical search results as authenticated user for same location
- [ ] Login modal preserves intended action (e.g., specific slot, business)
- [ ] Post-login, user returns to exact context without data loss
- [ ] Guest session data (filters, viewed items) persists 7 days locally

---

### 2.3 Business Search & Discovery

**Priority:** P0 — Core Value

| Aspect | Specification |
|--------|---------------|
| **Search Inputs** | Text query (business name, service), location (current/GPS, manual, saved), date range, price range, rating filter |
| **Sorting Options** | Relevance (default), distance, rating, price (low/high), availability (soonest) |
| **Smart Suggestions** | Recent searches, trending near me, "Book again" (authenticated) |
| **Filters** | Category, subcategory, price range, rating (4.0+, 4.5+), open now, accepts walk-ins, accessibility features |

**Acceptance Criteria:**
- [ ] Search returns results in < 2 seconds for 10km radius
- [ ] Typo tolerance handles 1-2 character errors
- [ ] Empty states suggest broader filters or alternate dates
- [ ] "No results" triggers waitlist signup for unmet demand
- [ ] Results update in real-time as filters change (no full reload)

---

### 2.4 Map-based Search

**Priority:** P1 — Discovery Enhancement

| Aspect | Specification |
|--------|---------------|
| **Map Provider** | Google Maps (primary), Mapbox (fallback) |
| **Display Modes** | Split (list + map), Map-only, List-only |
| **Clustering** | Businesses cluster at zoom < 12; individual pins at ≥ 12 |
| **Pin States** | Open (green), Closing soon (orange), Closed (gray), Fully booked (red outline) |
| **Interaction** | Tap pin → bottom sheet preview; tap preview → full detail |
| **Boundary Search** | "Search this area" button on pan/zoom; auto-search optional (toggle) |

**Acceptance Criteria:**
- [ ] Map initializes to user location within 5 seconds (with permission)
- [ ] 1000 pins render without frame drop (< 16ms jank)
- [ ] Cluster count accurately reflects filtered results
- [ ] User can draw custom polygon for search area (long-press to start)
- [ ] Map state (zoom, center, filters) persists across app restarts

---

### 2.5 Business Detail View

**Priority:** P0 — Conversion Point

| Section | Content |
|---------|---------|
| **Hero** | Image carousel (up to 10), business name, rating, review count, favorite toggle |
| **Quick Info** | Address, hours (today), phone, website, directions |
| **Services** | Categorized list with duration, price, description; expandable for details |
| **Team** | Selectable staff members with specialties and ratings |
| **Reviews** | Aggregate rating, distribution histogram, paginated reviews (5 per load) |
| **Availability** | Inline mini-calendar for next 7 days; "See full calendar" CTA |
| **About** | Description, amenities, COVID protocols, languages spoken, payment methods |

**Acceptance Criteria:**
- [ ] Page loads in < 3 seconds on 3G
- [ ] Images lazy-load with blur-up placeholder
- [ ] "Call" and "Directions" are tappable from first viewport
- [ ] Service selection updates availability in real-time
- [ ] Share generates deep link with preview image
- [ ] Report business/ review functionality accessible

---

### 2.6 Service Categories

**Priority:** P0 — Taxonomy Foundation

| Aspect | Specification |
|--------|---------------|
| **Category Depth** | 2 levels: Category → Subcategory → Service |
| **Examples** | Beauty → Hair → Women's Cut, Men's Cut, Color, etc. |
| **Dynamic Properties** | Each service defines: duration (fixed/variable), price (fixed/from), buffer time, resource requirements |
| **Provider Assignment** | Services can be restricted to specific staff members |
| **Category Management** | Admin-curated; businesses request additions |

**Acceptance Criteria:**
- [ ] Category tree renders in < 1 second
- [ ] Businesses can only select from approved categories
- [ ] Search matches across all levels ("haircut" finds Men's Cut)
- [ ] Category icons are consistent and accessible (alt text)
- [ ] New category requests route to admin queue with 48hr SLA

---

### 2.7 Booking Flow

**Priority:** P0 — Revenue Critical

**Step 1: Service Selection**
- Select service(s) with optional add-ons
- Multi-service booking supported (sequential slots)

**Step 2: Staff & Time**
- "Any available" or specific staff member
- Calendar view (day/week) with available slots highlighted
- Slot granularity: 15-minute increments

**Step 3: Confirmation**
- Review details, apply promo code, add notes
- Cancellation policy display (varies by business)
- Guest info pre-fill (authenticated users)

**Step 4: Payment**
- See Section 2.14

**Step 5: Confirmation**
- Booking reference, add to calendar, share
- Option to create account (guest checkout flow)

**Acceptance Criteria:**
- [ ] Complete flow in < 5 steps, < 2 minutes
- [ ] Slot availability is accurate to ±1 second (race condition handling)
- [ ] Concurrent booking of same slot shows error with next available alternatives
- [ ] Partial failure (payment succeeds, booking fails) triggers automatic refund
- [ ] All states logged for customer support lookup

---

### 2.8 Appointment Management

**Priority:** P0 — Retention Critical

| User Action | Specification |
|-------------|---------------|
| **View** | List (upcoming → past) with status badges; detail view with full context |
| **Reschedule** | Select new slot within business's policy window; original slot released immediately |
| **Cancel** | Policy-enforced (free within X hours, partial charge, or full charge); reason capture |
| **Rebook** | One-tap rebook same service/staff from past appointment |
| **No-show** | Automatic after 15 min past start; marks user account, affects future bookings |

**Acceptance Criteria:**
- [ ] Upcoming appointments surface in app badge, widget (iOS/Android), and push
- [ ] Reschedule/cancel available until cutoff time (configurable per business: 2-24 hours)
- [ ] Cancellation refund processed per policy automatically
- [ ] User receives confirmation of any modification within 5 seconds
- [ ] Provider notified in real-time of client-initiated changes

---

### 2.9 Favorites

**Priority:** P1 — Engagement

| Aspect | Specification |
|--------|---------------|
| **Actions** | Heart toggle from any business card or detail view |
| **Collection** | Default "Favorites" list; user-created lists ("Hair Salons", "Weekend Spots") |
| **Notifications** | Optional: notify of new availability, promotions, or menu changes |
| **Sync** | Cross-device with conflict resolution (last-write-wins) |

**Acceptance Criteria:**
- [ ] Toggle responds in < 100ms (optimistic UI)
- [ ] Favorites accessible offline (stale data acceptable)
- [ ] Unfavoriting shows undo for 5 seconds
- [ ] Import from contacts/social (optional discovery feature)

---

### 2.10 User Profile

**Priority:** P1 — Personalization

| Section | Content |
|---------|---------|
| **Basics** | Photo, name, phone, email, birthday (for offers) |
| **Preferences** | Default notification settings, preferred payment method, favorite categories |
| **History** | Appointments (linked to detail), payments, reviews given |
| **Privacy** | Data download, account deletion, marketing opt-outs |
| **Loyalty** | Points balance, tier status, available rewards (if program active) |

**Acceptance Criteria:**
- [ ] Profile completion percentage shown; 80%+ unlocks express checkout
- [ ] Data export (GDPR) delivers within 24 hours via secure link
- [ ] Account deletion is irreversible after 30-day grace
- [ ] Profile changes propagate to active bookings immediately

---

### 2.11 Availability & Slot Computation

**Priority:** P0 — Technical Foundation

| Aspect | Specification |
|--------|---------------|
| **Data Model** | Business hours + staff schedules + service duration + buffer + existing bookings + blockouts |
| **Computation** | Server-side with caching; client receives pre-computed slots |
| **Real-time** | WebSocket push on slot changes (cancellations, new blocks) |
| **Buffer Logic** | Pre/post-service buffers; travel time between locations (mobile providers) |
| **Complex Rules** | Staff-specific services, equipment requirements, concurrent booking limits |

**Acceptance Criteria:**
- [ ] Slots generated for 60-day window in < 500ms
- [ ] No double-bookings at database constraint level
- [ ] Timezone handling correct for business, staff, and client locales
- [ ] DST transitions handled without off-by-one errors
- [ ] Cache invalidation on any schedule change within 5 seconds

---

### 2.12 Shared Types & Design System

**Priority:** P1 — Velocity & Consistency

| Layer | Specification |
|-------|---------------|
| **Design Tokens** | Colors (semantic: primary, success, error), typography scale (12 sizes), spacing (4px base), radii, shadows |
| **Components** | Button variants (primary, secondary, ghost, danger), inputs, cards, modals, toasts, skeletons |
| **Icons** | Phosphor Icons (consistent set), 24px default, 20px compact |
| **Accessibility** | WCAG 2.1 AA minimum; focus states, screen reader labels, minimum 44px touch targets |
| **Cross-platform** | React Native (mobile) and React (web) share component API; native rendering where needed |

**Acceptance Criteria:**
- [ ] All UI components documented in Storybook
- [ ] No custom one-off styles; deviations require design system update
- [ ] Dark mode supported via token swap
- [ ] RTL layout ready for internationalization
- [ ] Component test coverage > 80%

---

### 2.13 Reviews & Ratings

**Priority:** P1 — Trust & Discovery

| Aspect | Specification |
|--------|---------------|
| **Submission** | Post-appointment prompt (24hr delay); 1-5 stars + text + photo optional |
| **Moderation** | Auto-approve with keyword flagging; human review for reported content |
| **Response** | Business owner can reply publicly once per review |
| **Display** | Verified badge (completed appointment), sort by relevant/newest/highest/lowest |
| **Impact** | Reviews affect search ranking; response rate affects business health score |

**Acceptance Criteria:**
- [ ] User can only review after completed appointment (verified) or with email verification (unverified, lower weight)
- [ ] Review edited within 30 days; deletion by user or platform policy violation
- [ ] Business receives notification of new review within 5 minutes
- [ ] Aggregate rating recalculates with 4-hour cache
- [ ] Photo reviews flagged for manual review (AI content safety)

---

### 2.14 Payment Integration

**Priority:** P0 — Revenue Collection

| Aspect | Specification |
|--------|---------------|
| **Providers** | Stripe (primary), PayPal, Apple Pay, Google Pay |
| **Flows** | Pay in full, deposit (partial), pay at venue (record for analytics) |
| **Hold/Capture** | Authorization at booking, capture on service completion or 24hr after |
| **Refunds** | Full, partial, or store credit per business policy; automated where possible |
| **Invoicing** | Receipt email, in-app invoice history, business VAT handling |

**Acceptance Criteria:**
- [ ] PCI compliance via tokenization (never touch raw card data)
- [ ] 3D Secure handled without app exit
- [ ] Failed payment offers retry with alternative method
- [ ] Webhook handling idempotent (duplicate events handled)
- [ ] Payout to businesses on T+2 schedule with detailed breakdown

---

### 2.15 Notifications

**Priority:** P1 — Engagement & Operations

| Channel | Use Cases |
|---------|-----------|
| **Push** | Booking confirmed/reminder (24hr, 2hr, 15min), promotion, review request, message from business |
| **SMS** | Backup for push failures; high-priority (cancellation by business) |
| **Email** | Receipt, account activity, weekly digest, re-engagement |
| **In-app** | Bell icon with unread count; persistent inbox |

**Acceptance Criteria:**
- [ ] User controls per-channel, per-type preferences
- [ ] Notification deep-links to relevant screen
- [ ] Delivery tracking: attempted → delivered → opened
- [ ] Batch non-urgent notifications (max 3 per hour)
- [ ] Timezone-aware delivery (no 3am notifications)

---

### 2.16 Provider / Business Owner Portal

**Priority:** P0 — Supply Side

| Module | Features |
|--------|----------|
| **Dashboard** | Today's appointments, revenue snapshot, pending actions |
| **Calendar** | Day/week/month views; drag-to-reschedule; block time; staff view toggle |
| **Services** | CRUD services, pricing, duration, assign staff |
| **Staff** | Add team members, set permissions, manage individual schedules |
| **Clients** | CRM view: history, notes, preferences, no-show count |
| **Bookings** | Accept/reject requests, manual entry, modify/cancel with client notification |
| **Finances** | Payout history, upcoming payouts, transaction details |
| **Settings** | Business hours, cancellation policy, notification preferences, integrations |

**Acceptance Criteria:**
- [ ] Portal responsive for tablet use (primary in-salon device)
- [ ] Real-time sync with client-facing availability
- [ ] Role-based access: Owner → Manager → Staff (view own only)
- [ ] Export calendar to Google/Outlook (.ics feed)
- [ ] Offline mode: queue offline operations, sync on reconnect

---

### 2.17 Admin Dashboard

**Priority:** P2 — Platform Operations

| Module | Features |
|--------|----------|
| **User Management** | Search, view, suspend, impersonate (audit logged) |
| **Business Verification** | KYC document review, approval workflow, rejection with reason |
| **Content Moderation** | Review queue for reported businesses/reviews; bulk actions |
| **Analytics** | MAU, booking volume, GMV, churn, top categories, geographic heatmap |
| **Financial** | Commission reconciliation, refund approval, payout monitoring |
| **System Health** | Job queue depth, error rates, third-party service status |
| **Configuration** | Feature flags, category management, global settings |

**Acceptance Criteria:**
- [ ] All actions audit-logged with before/after state
- [ ] Sensitive operations require second admin approval
- [ ] Reports exportable to CSV/Excel
- [ ] Real-time alerts for anomaly detection (spike in refunds, etc.)
- [ ] RLS (Row Level Security) enforces data access boundaries

---

### 2.18 Background Jobs (BullMQ)

**Priority:** P1 — Reliability & Scale

| Queue | Jobs | Priority |
|-------|------|----------|
| **notifications** | Send push/SMS/email | High |
| **payments** | Process charges, refunds, payouts | Critical |
| **search-index** | Update Algolia/Elasticsearch index | Medium |
| **analytics** | Aggregate metrics, generate reports | Low |
| **media** | Image optimization, thumbnail generation | Low |
| **reminders** | Appointment reminder scheduling | High (time-sensitive) |
| **cleanup** | Soft-delete purge, log rotation | Lowest |

**Acceptance Criteria:**
- [ ] Job failure retries with exponential backoff (max 5 attempts)
- [ ] Dead letter queue for manual review after exhaustion
- [ ] Job progress trackable via admin dashboard
- [ ] Queue depth alerts at > 1000 jobs
- [ ] Idempotency keys prevent duplicate processing

---

## 3. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | App cold start < 3s; page load < 2s; API response < 200ms (p95) |
| **Reliability** | 99.9% uptime; graceful degradation when services down |
| **Security** | OWASP Top 10 mitigated; annual penetration test |
| **Scalability** | Handle 10x traffic spike without manual intervention |
| **Compliance** | GDPR, CCPA, PCI-DSS (Level 1 if applicable) |

---

## 4. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion (browse → book) | > 8% |
| Search-to-booking time | < 5 minutes |
| Provider activation (signup → first booking) | > 60% |
| Monthly retention (client) | > 40% |
| NPS (client) | > 50 |
| Support tickets per 1000 bookings | < 5 |

---

## 5. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Guest Browse, Search, Business Detail, Booking, Appointments, Provider Portal basics | 8 weeks |
| **V1** | Map, Favorites, Reviews, Payments, Notifications | +4 weeks |
| **V2** | Advanced scheduling, Loyalty, Marketing tools, Admin Dashboard | +6 weeks |
| **Scale** | AI recommendations, Marketplace, International | +12 weeks |
