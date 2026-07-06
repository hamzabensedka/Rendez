# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first platform connecting consumers with beauty/wellness businesses for appointment booking. It serves three user segments: **Consumers** (book appointments), **Providers** (manage businesses), and **Admins** (platform governance). This spec defines features, acceptance criteria, and priorities for MVP and post-MVP phases.

---

## 2. User Personas

| Persona | Goals | Pain Points |
|---------|-------|-------------|
| **Consumer Ana** | Book salon appointments quickly, avoid phone calls | Can't compare availability across salons |
| **Provider Pierre** | Fill empty slots, reduce no-shows | Manual booking management is time-consuming |
| **Admin Amélie** | Ensure platform quality, monitor transactions | Fraud detection, dispute resolution |

---

## 3. Feature Specifications

### 3.1 User Authentication [P0]

**Description:** Secure identity verification for all user types.

| Item | Details |
|------|---------|
| **Consumer Auth** | Email/password, Google OAuth, Apple Sign-In |
| **Provider Auth** | Email/password with manual verification; 2FA required |
| **Admin Auth** | SSO-only, IP whitelisting |
| **Security** | JWT access (15min) + refresh (7d), Argon2 hashing, rate limiting (5 attempts/hour) |

**Acceptance Criteria:**
- [ ] New user completes registration in < 30 seconds via social login
- [ ] Password reset delivers email within 60 seconds
- [ ] Account lockout after 5 failed attempts, unlock via email
- [ ] Token refresh is transparent to user (no re-login for 7 days of activity)
- [ ] Provider accounts require email verification before business creation

---

### 3.2 Guest Browse & Explore [P0]

**Description:** Unauthenticated access to browse businesses and services without booking.

| Item | Details |
|------|---------|
| **Browse Scope** | View business listings, service menus, prices, reviews (read-only) |
| **Limitations** | No booking, no favorites, no appointment history |
| **Conversion** | Persistent prompts to register/sign in at booking CTA |

**Acceptance Criteria:**
- [ ] Guest sees full business directory with search and filter
- [ ] Attempting to book triggers auth modal with pre-filled context
- [ ] Post-auth, user returns to intended booking flow without data loss
- [ ] Guest session data (filters, viewed businesses) persists 24 hours locally

---

### 3.3 Business Search & Discovery [P0]

**Description:** Find businesses via multiple entry points.

| Item | Details |
|------|---------|
| **Search** | Full-text on business name, service name, provider name; typo-tolerant (fuzzy matching) |
| **Filters** | Category, price range, rating (≥), distance, availability today/this week, gender of provider, amenities |
| **Sorting** | Relevance (default), distance, rating, price (low/high) |
| **Results** | Card with: image, name, rating, distance, starting price, next available slot |

**Acceptance Criteria:**
- [ ] Search returns results in < 200ms for 90th percentile query
- [ ] Empty states suggest nearby alternatives or broader filters
- [ ] "Available now" filter shows only businesses with slots within 2 hours
- [ ] Recent searches and trending categories shown on search landing

---

### 3.4 Map-based Search [P0]

**Description:** Visual discovery using interactive map.

| Item | Details |
|------|---------|
| **Map Provider** | Mapbox or Google Maps SDK |
| **Clustering** | Auto-cluster at zoom levels > 50 markers |
| **Interaction** | Tap marker → bottom sheet with key info; tap card → full detail |
| **Geolocation** | Auto-center on user location with permission; fallback to city default |
| **Bounds Search** | Results update on map pan/zoom with debounce (300ms) |

**Acceptance Criteria:**
- [ ] Map loads initial viewport in < 2s on 4G
- [ ] User location accuracy within 50m; graceful handling of denied permission
- [ ] Map and list views are synchronized (same results, same sort)
- [ ] Deep link to specific map coordinates and zoom level

---

### 3.5 Business Detail View [P0]

**Description:** Comprehensive business profile driving conversion.

| Section | Content |
|---------|---------|
| **Header** | Hero image carousel (up to 5), business name, verified badge, favorite toggle |
| **Key Info** | Address, hours (today), phone, website link |
| **Services** | Categorized list with duration, price, description; expandable |
| **Team** | Provider photos, names, specialties; tap to see individual availability |
| **Reviews** | Aggregate rating, review count, recent reviews with photos |
| **Book CTA** | Sticky button; pre-selects service if deep-linked |

**Acceptance Criteria:**
- [ ] Page loads in < 1.5s; images lazy-loaded with blur placeholder
- [ ] "Add to calendar" and "Share" actions available
- [ ] Hours show "Open now" / "Closes at X" / "Closed" with color coding
- [ ] Phone number triggers native dialer; website opens in-app browser
- [ ] Deep links from external sources land on correct service tab

---

### 3.6 Service Categories [P0]

**Description:** Hierarchical taxonomy for service organization.

| Level | Examples |
|-------|----------|
| **Category** | Hair, Nails, Face, Body, Massage |
| **Subcategory** | Haircut, Coloring, Styling |
| **Service** | Women's Haircut, Men's Haircut, Child's Haircut |

**Acceptance Criteria:**
- [ ] Admin can CRUD categories with icon upload (SVG, 24x24)
- [ ] Each service has: name, description, duration (min), price (fixed or from), category assignment
- [ ] Services can be marked as gender-specific (displayed in filters)
- [ ] Provider can set service as "bookable online" or "call to book"
- [ ] Category browse page shows popular services and nearby businesses

---

### 3.7 Booking Flow [P0]

**Description:** Multi-step conversion funnel optimized for completion.

| Step | Action | Data Collected |
|------|--------|----------------|
| 1. Service | Select service (or bundle) | Service ID, provider preference |
| 2. Provider | Choose specific staff or "no preference" | Provider ID |
| 3. Date/Time | Calendar view with available slots | Date, time slot |
| 4. Details | Confirm or edit (name, phone, notes) | Contact info, special requests |
| 5. Payment | Pay deposit or full amount | Payment method, promo code |
| 6. Confirmation | Summary with add-to-calendar, share | Booking reference |
 | **Slot Display** | Morning / Afternoon / Evening buckets; scrollable 2-week horizon |

**Acceptance Criteria:**
- [ ] Flow completion rate > 60% (benchmark: industry 50%)
- [ ] Slot selection prevents double-booking via pessimistic locking (5-min hold on selection)
- [ ] Guest checkout allowed with email + phone; account auto-created post-booking
- [ ] Modification allowed up to 2 hours before appointment (policy-configurable)
- [ ] Cancellation with reason collection; refund policy displayed pre-booking
- [ ] Booking confirmation delivered via push, email, and SMS within 10 seconds

---

### 3.8 Appointment Management [P0]

**Description:** Lifecycle management for consumer and provider.

**Consumer View:**
- Upcoming / Past / Cancelled tabs
- Reschedule (same business, same service type) with slot availability check
- Cancel with automated refund per policy
- Rebook favorite provider
- Add to native calendar (iOS/Android)

**Provider View:**
- Daily/weekly calendar view
- Mark no-show, check-in, complete
- Block time (lunch, vacation)
- Quick book for walk-ins

**Acceptance Criteria:**
- [ ] Consumer sees real-time status: confirmed → reminder sent → checked in → completed
- [ ] Push notification 24h and 1h before appointment with one-tap directions
- [ ] Provider calendar syncs bidirectionally with Google/Outlook (optional, post-MVP)
- [ ] Bulk actions: confirm all, message all for day
- [ ] Audit log of all status changes with timestamp and actor

---

### 3.9 Favorites [P1]

**Description:** Bookmark businesses and providers for quick rebooking.

| Item | Details |
|------|---------|
| **Save** | Heart icon on business card and detail page |
| **List** | Grid/sortable list with next available slot preview |
| **Notifications** | Opt-in alerts for new availability or promotions from favorites |

**Acceptance Criteria:**
- [ ] Favorite/unfavorite toggles with haptic feedback
- [ ] Favorites sync across devices (authenticated users)
- [ ] Maximum 200 favorites per user (soft limit with upgrade prompt)
- [ ] Favorited businesses prioritized in search results (mild boost)

---

### 3.10 User Profile [P1]

**Description:** Centralized user data management.

| Section | Content |
|---------|---------|
| **Personal Info** | Name, email, phone, photo, birthday (for offers) |
| **Preferences** | Default gender filter, notification settings, payment methods |
| **History** | All appointments with receipt access |
| **Loyalty** | Points/stamps per business (if enabled) |
| **Security** | Password change, 2FA toggle, active sessions, delete account |

**Acceptance Criteria:**
- [ ] Profile completion percentage shown; incentivize with booking credit
- [ ] GDPR-compliant data export (JSON/CSV) within 48 hours of request
- [ ] Account deletion initiates 30-day grace period with recovery option
- [ ] Marketing preferences respected at granular level (push, email, SMS separately)

---

### 3.11 Availability & Slot Computation [P0]

**Description:** Core engine generating bookable slots from business rules.

| Component | Logic |
|-----------|-------|
| **Business Hours** | Weekly recurring schedule + exception dates (holidays) |
| **Breaks** | Lunch, cleanup, setup time between appointments |
| **Buffer Rules** | Minimum notice (e.g., 2 hours ahead), max booking horizon (e.g., 60 days) |
| **Provider Assignment** | Service-provider matrix; some services require specific provider |
| **Slot Generation** | Pre-computed or on-demand; cache invalidation on any rule change |
| **Conflict Resolution** | Pessimistic lock on selection; optimistic for display with stale-while-revalidate |

**Acceptance Criteria:**
- [ ] Slot computation for 30-day horizon in < 100ms
- [ ] Handles complex rules: "Tuesdays only," "alternating Saturdays," "closed 3rd Monday"
- [ ] Concurrent users selecting same slot: first to complete payment wins; others notified
- [ ] Overbooking impossible at database constraint level (unique index on provider + start_time)
- [ ] Timezone-aware: business timezone stored, converted to user local time

---

### 3.12 Shared Types & Design System [P0]

**Description:** Reusable components and type definitions ensuring consistency.

| Layer | Contents |
|-------|----------|
| **Design Tokens** | Colors, typography (Inter + Playfair Display), spacing, shadows, border-radius |
| **Components** | Buttons, inputs, cards, modals, bottom sheets, calendar, time picker, skeleton loaders |
| **Icons** | Lucide React; custom for category taxonomy |
| **Types (TypeScript)** | Shared interfaces: User, Business, Service, Appointment, Slot, Payment, Notification |
| **Accessibility** | WCAG 2.1 AA: minimum 4.5:1 contrast, screen reader labels, focus management, reduce motion |

**Acceptance Criteria:**
- [ ] All UI components documented in Storybook with usage examples
- [ ] Dark mode support via CSS variables / Tailwind dark:
- [ ] RTL layout support for internationalization readiness
- [ ] Component test coverage > 80% (unit + visual regression)

---

### 3.13 Reviews & Ratings [P1]

**Description:** Social proof and quality feedback loop.

| Item | Details |
|------|---------|
| **Eligibility** | Verified customers only (post-appointment) |
| **Rating** | 1-5 stars, mandatory; optional detailed review |
| **Categories** | Service quality, ambiance, value, punctuality (optional sub-ratings) |
| **Photos** | Up to 5 per review, moderated |
| **Response** | Business owner can reply publicly |
| **Moderation** | Auto-flag profanity, manual review for reported content |

**Acceptance Criteria:**
- [ ] Review prompt sent 2 hours after appointment completion via push
- [ ] Aggregate rating recalculated in real-time; cached for list views
- [ ] Sort reviews by: most helpful, newest, highest/lowest rating
- [ ] Business can flag review for investigation; not removed without admin review
- [ ] Reviewer anonymity option: "Verified Customer" vs. public name

---

### 3.14 Payment Integration [P0]

**Description:** Secure, multi-method payment processing.

| Item | Details |
|------|---------|
| **Processor** | Stripe Connect (marketplace model) |
| **Methods** | Cards (Visa, MC, Amex), Apple Pay, Google Pay, PayPal (post-MVP) |
| **Flows** | Full payment at booking, deposit + balance, or pay at venue (provider-configured) |
| **Split** | Platform fee auto-deducted; remainder to provider (7-day rolling payout) |
| **Refund** | Automated per policy; manual override by admin |
| **Invoicing** | VAT-compliant receipts emailed; downloadable from app |

**Acceptance Criteria:**
- [ ] PCI compliance via Stripe Elements (no card data touches servers)
- [ ] 3D Secure triggered for flagged transactions; fallback to SMS verification
- [ ] Failed payment: 3 retry attempts with user notification; slot released after final failure
- [ ] Provider dashboard shows: pending, available, paid, upcoming payouts
- [ ] Currency display matches business location; EUR default, multi-currency post-MVP

---

### 3.15 Notifications [P1]

**Description:** Multi-channel, preference-driven communication.

| Channel | Use Cases |
|---------|-----------|
| **Push** | Booking confirmation, reminders, promotions, new availability |
| **Email** | Receipts, account security, monthly summary, marketing (opt-in) |
| **SMS** | Critical: booking changes, 2FA, appointment reminders |
| **In-App** | System messages, chat from business, loyalty updates |

**Acceptance Criteria:**
- [ ] User controls frequency: immediate, daily digest, weekly digest, off (per channel)
- [ ] Notification preferences editable pre-emptively and from any notification
- [ ] Deep links from push navigate to relevant screen with correct context
- [ ] Delivery tracking: failed push falls back to SMS for critical messages
- [ ] Unsubscribe honored within 24 hours; suppression list for bounced emails

---

### 3.16 Provider / Business Owner Portal [P0]

**Description:** Web-based management interface for business operations.

| Module | Features |
|--------|----------|
| **Dashboard** | Today's appointments, revenue this week, occupancy rate, recent reviews |
| **Calendar** | Day/week/month views; drag-to-reschedule; color-coded by status |
| **Services** | CRUD services, set pricing, duration, online booking toggle |
| **Staff** | Add providers, set services they perform, manage their hours |
| **Clients** | CRM: notes, visit history, preferences, marketing consent |
| **Analytics** | Booking volume, revenue, no-show rate, popular services, peak hours |
| **Settings** | Business hours, break times, cancellation policy, payment methods |

**Acceptance Criteria:**
- [ ] Portal is responsive down to tablet; mobile app for providers post-MVP
- [ ] Real-time updates via WebSocket for new bookings and cancellations
- [ ] Data export: appointments (CSV), clients (CSV), financials (PDF)
- [ ] Role-based access: Owner (full), Manager (bookings, staff), Staff (own calendar only)
- [ ] Onboarding wizard: new business setup in < 10 minutes

---

### 3.17 Admin Dashboard [P1]

**Description:** Platform governance and operational oversight.

| Module | Features |
|--------|----------|
| **User Management** | Search users, suspend/activate, impersonate for support, view activity log |
| **Business Verification** | KYC review, document verification, approve/reject with reason |
| **Content Moderation** | Review queue for flagged businesses, services, reviews; bulk actions |
| **Financial** | Transaction monitoring, dispute resolution, refund approval, payout scheduling |
| **Analytics** | MAU, booking volume, GMV, CAC, LTV, churn by cohort |
| **System Health** | API latency, error rates, queue depth, infrastructure status |
| **Communications** | Broadcast push/email/SMS to segments; scheduled maintenance notices |

**Acceptance Criteria:**
- [ ] All admin actions ;;actions logged immutably; tamper-evident audit trail
- [ ] SLA: critical issues escalated to on-call within 5 minutes via PagerDuty
- [ ] Data retention: raw logs 90 days, aggregated metrics 2 years, financial records 7 years
- [ ] Role-based access with MFA enforcement for sensitive operations

---

### 3.18 Background Jobs (BullMQ) [P0]

**Description:** Asynchronous task processing for reliability and performance.

| Queue | Jobs | Priority |
|-------|------|----------|
| **notifications** | Send push, email, SMS | High (user-facing latency) |
| **payments** | Process charge, payout, refund | Critical (financial integrity) |
| **reminders** | 24h and 1h appointment reminders | High |
| **analytics** | Aggregate metrics, generate reports | Low |
| **media** | Image resize, thumbnail generation, virus scan | Medium |
| **search** | Reindex business/service on change | Medium |
| **cleanup** | Expire old locks, archive stale data, GDPR deletion | Low |

**Acceptance Criteria:**
- [ ] Job failure: 3 retries with exponential backoff; dead letter queue after final failure
- [ ] Monitoring: queue depth, processing rate, failure rate, job age dashboards in Grafana
- [ ] Stalled job detection and requeue within 30 seconds
- [ ] Priority preemption: payment jobs processed before analytics
- [ ] Job idempotency: safe to retry without side effects (use idempotency keys)

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | App cold start < 2s; API p95 < 200ms; image load < 1s |
| **Reliability** | 99.9% uptime; scheduled maintenance < 4 hours monthly |
| **Security** | OWASP Top 10 mitigation; annual penetration test; SOC 2 Type II roadmap |
| **Scalability** | Horizontal scaling; 10x traffic spike handling (Black Friday) |
| **Compliance** | GDPR, CCPA, PSD2 (payments); data residency in EU |

---

## 5. Prioritization

| Priority | Features |
|----------|----------|
| **P0 (MVP)** | 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.11, 3.12, 3.14, 3.16, 3.18 |
| **P1 (Post-MVP)** | 3.9, 3.10, 3.13, 3.15, 3.17 |
| **P2 (Growth)** | Loyalty program, subscriptions, marketplace (retail products), AI recommendations |

---

## 6. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Monthly Bookings | 10K by month 6 | Database aggregation |
| Booking Conversion | > 15% search-to-book | Funnel analytics |
| NPS (Consumers) | > 50 | In-app survey |
| Provider Activation | > 80% complete profile | Onboarding funnel |
| App Store Rating | > 4.5 | Platform data |
| Support Tickets | < 2% of transactions | Zendesk integration |

---

*Document Version: 1.0*
*Last Updated: 2024*
*Owner: Alex — Product Owner*