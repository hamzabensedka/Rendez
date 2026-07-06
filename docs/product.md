# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first platform connecting customers with local service businesses (salons, barbershops, spas, clinics) for appointment booking. The product serves three user segments: **Customers** (book appointments), **Providers/Business Owners** (manage availability and bookings), and **Platform Admins** (oversee operations).

---

## 2. User Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Customer** | End user seeking to book beauty/wellness services | Discover, compare, book, manage appointments |
| **Guest** | Unregistered browser | Explore businesses without commitment |
| **Provider** | Business owner or manager | Manage schedule, services, staff, revenue |
| **Admin** | Platform operator | Monitor growth, handle disputes, configure platform |

---

## 3. Feature Specifications

### 3.1 User Authentication
**Priority:** P0 | **Owner:** Product / Engineering

| Aspect | Specification |
|--------|---------------|
| **Registration Methods** | Email/password, Google OAuth, Apple Sign-In |
| **Login** | JWT-based session with refresh token rotation; biometric unlock (Face ID/Touch ID) |
| **Password Recovery** | Secure token-based reset via email, 1-hour expiry |
| **Account Verification** | Email confirmation required before booking; SMS optional for 2FA |
| **Guest to Registered** | Seamless migration: favorites and partial bookings retained upon registration |

**Acceptance Criteria:**
- [ ] User can register with email, Google, or Apple in < 30 seconds
- [ ] JWT access token expires in 15 min; refresh token valid for 7 days
- [ ] Biometric prompt appears on app open if enabled
- [ ] Password reset email delivers within 2 minutes; link expires after 1 hour or first use
- [ ] Guest data (favorites, cart) merges to registered account without loss

---

### 3.2 Guest Browse & Explore
**Priority:** P0 | **Owner:** Product / Growth

| Aspect | Specification |
|--------|---------------|
| **Access** | Full browse capability without account; booking gated behind login |
| **Persistent Session** | 30-day device identifier for guest state; prompt to register at key moments (3rd search, add favorite, proceed to book) |
| **Onboarding** | 3-screen tutorial on first open: discover → book → enjoy |

**Acceptance Criteria:**
- [ ] Guest sees full business directory and can filter/search
- [ ] "Book Now" CTA triggers registration modal; booking state preserved for 24 hours post-registration
- [ ] Guest favorites stored locally; merge prompt on registration
- [ ] Onboarding skippable; completion rate tracked

---

### 3.3 Business Search & Discovery
**Priority:** P0 | **Owner:** Product / Design

| Aspect | Specification |
|--------|---------------|
| **Search Inputs** | Free-text (business name, service name), recent searches, trending searches |
| **Filters** | Category, price range, rating (4.0+), availability ("open now"), distance, amenities (parking, wheelchair access, WiFi) |
| **Sort Options** | Relevance, distance, rating, price (low-high), availability (next available slot) |
| **Results Display** | Card list with: thumbnail, name, rating, distance, price from, next available slot |
| **Auto-complete** | Suggest businesses, services, neighborhoods; debounced 300ms |

**Acceptance Criteria:**
- [ ] Search returns results in < 500ms for 95th percentile
- [ ] Filters apply without full page reload; URL shareable with filter state
- [ ] Empty state suggests nearby alternatives and "broaden search" action
- [ ] Results update within 300ms of filter change

---

### 3.4 Map-based Search
**Priority:** P0 | **Owner:** Product / Engineering

| Aspect | Specification |
|--------|---------------|
| **Map Provider** | Mapbox or Google Maps (TBD based on pricing) |
| **Clustering** | Auto-cluster pins at zoom levels; expand on tap |
| **User Location** | Request on first use; fallback to city center if denied |
| **Business Pins** | Color-coded by category; tap reveals preview card |
| **Bounds Search** | Results update on pan/zoom; loading indicator for new fetch |
| **List/Map Toggle** | Persist user preference per session |

**Acceptance Criteria:**
- [ ] Map initializes to user location within 2 seconds
- [ ] Pin tap opens bottom sheet with business preview in < 200ms
- [ ] 500+ pins in viewport cluster without performance degradation
- [ ] "Re-center" button appears when map panned from user location

---

### 3.5 Business Detail View
**Priority:** P0 | **Owner:** Product / Design

| Aspect | Specification |
|--------|---------------|
| **Header** | Image carousel (max 10), business name, category, rating, favorite toggle |
| **Info Section** | Address (tappable for directions), hours (today's hours expanded), phone, website |
| **Services Tab** | Grouped by category, collapsible; each shows duration, price, description, "Book" CTA |
| **Team Tab** | Staff profiles with photo, bio, specialties, average rating |
| **Reviews Tab** | Aggregate rating, distribution histogram, review list with photos |
| **About Tab** | Business description, amenities, payment methods, cancellation policy |

**Acceptance Criteria:**
- [ ] Page loads all content in < 2 seconds on 3G
- [ ] Image carousel supports pinch-zoom and swipe
- [ ] "Book" on service pre-selects it in booking flow
- [ ] Deep link opens correct business detail view
- [ ] Share button generates preview image for social platforms

---

### 3.6 Service Categories
**Priority:** P0 | **Owner:** Product / Operations

| Aspect | Specification |
|--------|---------------|
| **Taxonomy** | Hierarchical: Category → Subcategory → Service. Example: Hair → Coloring → Balayage |
| **Category Icons** | Custom icon set; consistent with design system |
| **Discovery** | Category pills in search; browse by category from home |
| **Provider Assignment** | Services linked to businesses; staff can be assigned to subset |
| **Dynamic Pricing** | Support variable pricing (e.g., by hair length) noted in description |

**Acceptance Criteria:**
- [ ] Category tree depth ≤ 3; navigate back up easily
- [ ] Service without subcategory shows directly
- [ ] Provider can reorder services within category for prominence
- [ ] Category metadata (icon, description) editable by admin

---

### 3.7 Booking Flow
**Priority:** P0 | **Owner:** Product / Engineering

| Step | Action | Details |
|------|--------|---------|
| 1. Service Selection | Pre-filled if from detail; else browse | Can add multiple services |
| 2. Provider/Staff | Choose specific staff or "no preference" | Show staff availability calendar |
| 3. Date & Time | Calendar view with available slots | Default to earliest; timezone-aware |
| 4. Add-ons | Upsell options (e.g., deep conditioning) | Max 3 add-ons per service |
| 5. Review | Order summary with cancellation policy | Editable before confirm |
| 6. Payment | Select method; if free, skip | Hold payment method for no-show policy |
| 7. Confirmation | Booking reference, add to calendar, share | Push + email confirmation |

**Acceptance Criteria:**
- [ ] Complete flow in < 5 steps; progress indicator visible
- [ ] Slot selection prevents double-booking via pessimistic lock (5 min hold)
- [ ] Booking confirmation in < 3 seconds; failure shows retry with state preserved
- [ ] Guest checkout supported; account creation post-booking offered
- [ ] Cancellation within policy: full refund processed automatically

---

### 3.8 Appointment Management
**Priority:** P0 | **Owner:** Product / Engineering

| Aspect | Specification |
|--------|---------------|
| **Customer View** | Upcoming (next 7 days highlighted), past, cancelled tabs |
| **Actions** | Reschedule (select new slot, subject to policy), cancel with reason, rebook, contact business |
| **Status States** | Pending → Confirmed → Checked-in → Completed → No-show / Cancelled |
| **Reminders** | Push + SMS 24h and 1h before appointment |
| **Receipts** | PDF generation post-completion; accessible in app |

**Acceptance Criteria:**
- [ ] Reschedule enforces business cancellation policy (e.g., 24h notice)
- [ ] Cancelled slot immediately returns to availability pool
- [ ] Customer receives confirmation of any status change
- [ ] Past appointments searchable by business name or date

---

### 3.9 Favorites
**Priority:** P1 | **Owner:** Product / Engagement

| Aspect | Specification |
|--------|---------------|
| **Add/Remove** | Heart toggle on business card, detail, and post-booking |
| **List View** | Grid of favorited businesses; sort by recently added, name, or next availability |
| **Notifications** | Opt-in: "New availability at [Business]" or "[Business] has a new review" |
| **Sync** | Cross-device for registered users; local-only for guests |

**Acceptance Criteria:**
- [ ] Favorite/unfavorite in < 100ms with haptic feedback
- [ ] Empty state prompts discovery browse
- [ ] Batch remove available in edit mode
- [ ] Notification frequency capped at 1/week per business to prevent spam

---

### 3.10 User Profile
**Priority:** P1 | **Owner:** Product / Engineering

| Aspect | Specification |
|--------|---------------|
| **Personal Info** | Name, phone, email (editable), profile photo, birthday (optional, for offers) |
| **Preferences** | Default notification settings, preferred payment method, home location |
| **History** | Total bookings, favorite categories, spending summary |
| **Settings** | Language, accessibility (font size, screen reader), data export, delete account |
| **Loyalty** | Points or stamps per business (if enabled) |

**Acceptance Criteria:**
- [ ] Profile photo upload with crop/rotate; max 5MB
- [ ] GDPR-compliant data export (JSON) within 24 hours of request
- [ ] Account deletion confirmation with 7-day grace period (reversible)
- [ ] All profile changes reflected in real-time across sessions

---

### 3.11 Availability & Slot Computation
**Priority:** P0 | **Owner:** Product / Engineering

| Aspect | Specification |
|--------|---------------|
| **Business Hours** | Configurable per day; split shifts (e.g., 9-12, 14-18); exceptions for holidays |
| **Slot Generation** | Based on service duration + buffer; round to nearest 15 min |
| **Constraints** | Staff availability, room/equipment requirements, max concurrent bookings |
| **Buffer Rules** | Pre/post-service buffer configurable per service (e.g., 15 min cleanup) |
| **Dynamic Updates** | Real-time slot availability; cache with 30-second TTL |
| **Complex Scenarios** | Multi-staff services (e.g., colorist + stylist), variable duration services |

**Acceptance Criteria:**
- [ ] Slot computation for 30-day horizon in < 200ms
- [ ] Booking holds expire and release slots automatically
- [ ] Business hours change reflects in availability within 30 seconds
- [ ] Conflict detection prevents any double-booking at database level

---

### 3.12 Shared Types & Design System
**Priority:** P0 | **Owner:** Product / Design

| Aspect | Specification |
|--------|---------------|
| **Design Tokens** | Colors, typography (Inter + system fonts), spacing (4px base), shadows, radii |
| **Component Library** | Buttons, inputs, cards, modals, bottom sheets, calendars, skeleton loaders |
| **Accessibility** | WCAG 2.1 AA minimum; focus states, alt text, minimum 44pt touch targets |
| **Platform Parity** | iOS and Android share 95%+ component structure; native navigation patterns respected |
| **Dark Mode** | Follows system preference; manual override in settings |
| **Localization** | i18n framework; initial languages: EN, FR, ES, DE |

**Acceptance Criteria:**
- [ ] All UI components documented in Storybook/ equivalent
- [ ] Color contrast ratios pass automated audit
- [ ] Dynamic type scales without truncation up to 200%
- [ ] RTL layout support for future expansion

---

### 3.13 Reviews & Ratings
**Priority:** P1 | **Owner:** Product / Trust & Safety

| Aspect | Specification |
|--------|---------------|
| **Eligibility** | Only verified customers (completed appointment) can review |
| **Rating Dimensions** | Overall (1-5), optional: service quality, staff, ambiance, value |
| **Content** | Text (min 20 chars, max 1000), photos (max 5), staff attribution |
| **Moderation** | Auto-flag profanity/spam; manual review queue; provider response capability |
| **Display** | Sort by relevant, recent, highest/lowest; filter by rating, with photos |
| **Aggregation** | Bayesian average for businesses with < 10 reviews; recalculate nightly |

**Acceptance Criteria:**
- [ ] Review prompt triggers 24 hours post-appointment; max 2 reminders
- [ ] Provider can respond once; response editable for 24 hours
- [ ] Reported reviews reviewed within 24 hours by moderation team
- [ ] Review helpfulness voting (thumbs up/down) with abuse detection

---

### 3.14 Payment Integration
**Priority:** P0 | **Owner:** Product / Engineering

| Aspect | Specification |
|--------|---------------|
| **Providers** | Stripe primary; PayPal secondary; Apple Pay / Google Pay for mobile |
| **Models** | Pay in full, deposit (partial payment), pay at venue, subscription/membership |
| **Saved Methods** | Tokenized card storage; PCI compliance via provider (never store raw) |
| **Invoicing** | Email receipt; business VAT invoice on request |
| **Refunds** | Full, partial, or credit; processed via dashboard or automated by policy |
| **Payouts** | To provider bank account; 2-day rolling for established accounts |

**Acceptance Criteria:**
- [ ] Payment processing completes in < 5 seconds
- [ ] 3D Secure challenge handled in-app without redirect
- [ ] Failed payment offers retry with alternative method; booking held 10 minutes
- [ ] Webhook handling for all Stripe events with idempotency
- [ ] Financial reconciliation report generated daily

---

### 3.15 Notifications
**Priority:** P1 | **Owner:** Product / Growth

| Channel | Use Cases | User Control |
|---------|-----------|--------------|
| **Push** | Booking confirmations, reminders, promotions, new availability | Granular per-type toggles |
| **SMS** | Critical: reminders, same-day changes | On/off only |
| **Email** | Receipts, summaries, marketing (opt-in), account security | Granular per-type |
| **In-App** | System messages, loyalty updates, new features | Badge count; dismissible |

**Acceptance Criteria:**
- [ ] Push notification delivery rate > 95% (tracked via FCM/APNs feedback)
- [ ] Preference changes propagate within 60 seconds
- [ ] Unsubscribe from marketing honored within 24 hours (legal compliance)
- [ ] Notification history accessible for 90 days

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0 | **Owner:** Product / B2B

| Module | Features |
|--------|----------|
| **Dashboard** | Today's appointments, revenue snapshot, occupancy rate, recent reviews |
| **Calendar** | Day/week/month views; drag-to-reschedule; block time off; staff view filter |
| **Services** | CRUD services, pricing, duration, buffer, online booking toggle |
| **Staff** | Add team members, set permissions, manage individual schedules |
| **Clients** | CRM: notes, visit history, preferences, no-show count |
| **Bookings** | Manual entry, modify/cancel, check-in, no-mark, export |
| **Finances** | Payout history, transaction list, tax report export |
| **Settings** | Business info, hours, cancellation policy, payment methods, integrations |
| **Analytics** | Booking trends, revenue by service/staff, cancellation rate, customer retention |

**Acceptance Criteria:**
- [ ] Portal responsive for tablet and desktop; mobile app companion for alerts
- [ ] Calendar supports 50+ concurrent staff without performance degradation
- [ ] Manual booking validates all constraints same as customer booking
- [ ] Data export (CSV, PDF) for all list views
- [ ] Role-based access: Owner, Manager, Staff (view own only)

---

### 3.17 Admin Dashboard
**Priority:** P1 | **Owner:** Product / Operations

| Module | Features |
|--------|----------|
| **Overview** | MAU, bookings, GMV, active businesses, top categories; real-time and trended |
| **Business Management** | Onboarding workflow, verification status, suspension, featured placement |
| **User Management** | Customer support lookup, account actions, dispute resolution |
| **Content Moderation** | Review queue for flagged content, business photo approval |
| **Finance** | Platform fee configuration, payout monitoring, refund approval |
| **Marketing** | Promo code creation, push campaign targeting, banner management |
| **System** | Feature flags, maintenance mode, forced update configuration |

**Acceptance Criteria:**
- [ ] Dashboard loads primary KPIs in < 1 second
- [ ] Audit log for all admin actions with admin identity and timestamp
- [ ] Bulk operations (approve, suspend, message) for efficiency
- [ ] Role-based access: Super Admin, Ops, Support, Finance, Read-only

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P0 | **Owner:** Product / Engineering

| Job Type | Description | Frequency / Trigger |
|----------|-------------|---------------------|
| **Notification Dispatch** | Queue and send push/SMS/email via respective providers | Event-driven |
| **Slot Cache Warm** | Pre-compute availability for popular businesses | Every 5 minutes |
| **Booking Hold Expiry** | Release expired holds, notify waitlist | Every minute |
| **Reminder Dispatch** | 24h and 1h appointment reminders | Scheduled (cron) |
| **Review Solicitation** | Prompt eligible customers for reviews | 24h post-appointment |
| **Report Generation** | Daily/weekly/monthly analytics exports | Scheduled (cron) |
| **Payout Processing** | Calculate and initiate provider transfers | Daily |
| **Data Cleanup** | Archive old data, purge soft-deleted accounts | Weekly |
| **Search Index Update** | Sync business/service changes to search backend | Event-driven |

**Acceptance Criteria:**
- [ ] Job failure rate < 0.1%; automatic retry with exponential backoff (max 5)
- [ ] Dead letter queue for manual investigation; alerting on queue depth > 1000
- [ ] Job idempotency: duplicate execution produces same result
- [ ] Priority queue: notification > booking > reporting > cleanup
- [ ] Observability: job duration, success rate, queue depth dashboards

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | App cold start < 2s; page load < 1s; API response p95 < 200ms |
| **Reliability** | 99.9% uptime; booking flow 99.99% success rate |
| **Security** | OWASP Top 10 mitigation; annual penetration test; SOC 2 Type II target |
| **Scalability** | Support 100K concurrent users; 10M monthly bookings |
| **Compliance** | GDPR (EU), CCPA (CA), PCI-DSS Level 1 (via Stripe) |

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Monthly Active Users (MAU) | 500K by month 12 |
| Booking Conversion Rate | > 15% of app opens |
| Provider NPS | > 50 |
| Customer NPS | > 60 |
| App Store Rating | > 4.5 stars |
| Support Ticket Volume | < 2% of monthly active users |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | 3.1–3.8, 3.11, 3.12, 3.14 (basic) | Month 1–2 |
| **V1.0** | +3.9, 3.10, 3.13, 3.15, 3.16 | Month 3–4 |
| **V1.5** | +3.17, 3.18, 3.14 (advanced), loyalty | Month 5–6 |

---

*Document Version: 1.0 | Last Updated: [Date] | Next Review: Post-MVP*