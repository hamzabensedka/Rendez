# Planity Clone — Product Specification

## 1. Document Information

| Attribute | Value |
|-----------|-------|
| Version | 1.0 |
| Status | Draft for Review |
| Last Updated | 2024 |
| Author | Alex — Product Owner |

## 2. Product Vision

A multi-platform application connecting service-seeking customers with local beauty, wellness, and health businesses. Customers discover, book, and manage appointments. Business owners manage their presence, availability, and bookings through a dedicated portal.

## 3. Target Users

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Customer** | Seeks beauty/wellness services | Find, book, manage appointments |
| **Guest** | Unregistered browser | Explore without commitment |
| **Business Owner** | Manages one or more establishments | Attract customers, manage schedule |
| **Admin** | Platform operator | Monitor health, support users |

## 4. Feature Specifications

---

### F1: User Authentication

**Priority:** P0 | **Effort:** Medium

| Aspect | Specification |
|--------|---------------|
| **Registration Methods** | Email/password, Google OAuth, Apple Sign-In |
| **Login Methods** | Same as registration + magic link option |
| **Password Requirements** | Min 8 chars, 1 uppercase, 1 number, 1 special character |
| **Session Management** | JWT access token (15min) + refresh token (7 days); biometric unlock on mobile |
| **Account Recovery** | Email-based password reset with 1-hour expiry |
| **Role Assignment** | Customer (default), BusinessOwner, Admin |

**Acceptance Criteria:**
- [ ] User can register with email and verify via 6-digit code
- [ ] User can register/login with Google/Apple in ≤3 taps
- [ ] Invalid credentials show generic error (security through obscurity)
- [ ] Token refresh is seamless and invisible to user
- [ ] Biometric prompt appears after first successful password login (mobile)
- [ ] Account deletion initiates 30-day grace period with data export option

---

### F2: Guest Browse & Explore

**Priority:** P0 | **Effort:** Low

| Aspect | Specification |
|--------|---------------|
| **Access Level** | Full read-only access to business listings, services, reviews |
| **Limitations** | No booking, no favorites, no appointment history |
| **Conversion Trigger** | "Book" or "Save" prompts registration modal |
| **Guest Data** | Search history stored locally; cleared on logout or 30 days inactive |

**Acceptance Criteria:**
- [ ] Guest sees identical business discovery experience as logged-in user
- [ ] Attempting to book shows registration modal with pre-filled context
- [ ] Guest can convert to registered user preserving search context
- [ ] Guest session analytics tracked separately from authenticated users

---

### F3: Business Search & Discovery

**Priority:** P0 | **Effort:** High

| Aspect | Specification |
|--------|---------------|
| **Search Inputs** | Free text (business name, service), location (current/given), date range |
| **Filters** | Category, price range, rating (≥), distance, availability on date, service type |
| **Sorting Options** | Relevance, distance, rating, price (low-high), availability soonest |
| **Results Display** | Card list with: thumbnail, name, rating, distance, starting price, next available slot |
| **Pagination** | Infinite scroll with 20 results per fetch |
| **Search History** | Last 10 searches, deletable, not shared across devices for guests |

**Acceptance Criteria:**
- [ ] Search returns results in <500ms for 90th percentile queries
- [ ] Empty states suggest nearby alternatives or broader filters
- [ ] Typo tolerance handles 1-2 character edits (Levenshtein distance ≤2)
- [ ] Results update in real-time as filters change (no page reload)
- [ ] Deep link to any search state is shareable and functional

---

### F4: Map-based Search

**Priority:** P1 | **Effort:** High

| Aspect | Specification |
|--------|---------------|
| **Map Provider** | Mapbox or Google Maps (configurable) |
| **Default View** | User's current location or last searched area |
| **Clustering** | Auto-cluster at zoom levels <14; individual pins at ≥14 |
| **Pin Information** | Price indicator dot (green/orange/red for availability), tap for preview card |
| **Interactions** | Pan, zoom, tap pin, tap preview to open detail, "re-center" button |
| **List/Map Toggle** | Persistent toggle preserving search context |

**Acceptance Criteria:**
- [ ] Map renders with ≤2s initial load on 3G connection
- [ ] Pin tap shows preview card with core info in <200ms
- [ ] Map bounds trigger new search query (debounced 300ms)
- [ ] User location request explains value proposition before system prompt
- [ ] Offline: cached tiles display with "search unavailable" overlay

---

### F5: Business Detail View

**Priority:** P0 | **Effort:** Medium

| Section | Content |
|---------|---------|
| **Header** | Cover image carousel, business name, category, rating, review count, distance, favorite toggle |
| **Info** | Address (tappable for directions), phone, hours (today + full schedule), website link |
| **Services** | Expandable categories with: service name, duration, description, price, "Book" CTA |
| **Team** | Selectable staff members with photos, specialties, and individual availability |
| **Reviews** | Aggregate rating, distribution histogram, recent reviews (paginated) |
| **Similar** | Horizontal carousel of related businesses |

**Acceptance Criteria:**
- [ ] All content loads in <1s on 4G; images lazy-loaded with blur placeholder
- [ ] "Book" on service pre-selects it in booking flow
- [ ] Staff selection filters available slots to that provider
- [ ] Share button generates deep link with preview image
- [ ] Report business/flag review available with 3-tap maximum

---

### F6: Service Categories

**Priority:** P0 | **Effort:** Medium

| Aspect | Specification |
|--------|---------------|
| **Category Hierarchy** | Parent > Child > Service (3 levels max) |
| **Initial Categories** | Hair, Nails, Face, Body, Massage, Hair Removal, Makeup, Wellness |
| **Category Attributes** | Icon, color code, description, typical duration range, FAQ |
| **Business Assignment** | Businesses select applicable categories; services map to one category |
| **Discovery** | Category pills on home, dedicated category browse page with trending |

**Acceptance Criteria:**
- [ ] Category navigation requires ≤3 taps to reach any service
- [ ] Uncategorized services appear in search but not browse
- [ ] Category metadata drives SEO-friendly URLs
- [ ] Admin can add/edit categories without code deployment

---

### F7: Booking Flow

**Priority:** P0 | **Effort:** High

| Step | Action | Details |
|------|--------|---------|
| 1. Service Selection | Pre-filled or browse from business | Show duration, price, description |
| 2. Staff Selection | "Any available" or specific provider | Show staff calendar preview |
| 3. Date/Time Selection | Calendar view + time slots | Show next 30 days; slots computed from availability engine |
| 4. Add-ons/Options | Upsell related services | "Often booked together" |
| 5. Customer Details | Auto-fill for returning users | Name, phone, special requests (250 chars) |
| 6. Confirmation | Summary with edit capability | Cancellation policy, reschedule terms |
| 7. Payment (if required) | See F14 | Deposit, full prepay, or pay at venue |

**Acceptance Criteria:**
- [ ] Flow completes in ≤5 taps from service selection for returning user
- [ ] Slot selection shows "only X left" for high-demand times
- [ ] Booking holds slot for 10 minutes during payment; auto-release on timeout
- [ ] Confirmation screen has add-to-calendar and share functionality
- [ ] Abandoned cart (step ≥3) triggers reminder notification at 24h

---

### F8: Appointment Management

**Priority:** P0 | **Effort:** Medium

| Feature | Specification |
|---------|---------------|
| **Upcoming View** | Chronological list with: business, service, date/time, status badge |
| **Detail View** | Full booking info, directions, contact, modify options |
| **Actions** | Reschedule (same business, new slot), Cancel (with policy enforcement), Rebook |
| **History** | Past appointments with rebook CTA, review prompt (if unrated) |
| **Status States** | Pending → Confirmed → Checked-in → Completed → No-show / Cancelled |

**Acceptance Criteria:**
- [ ] Reschedule respects original business's cancellation policy
- [ ] Cancel enforces policy: full refund, partial, or forfeit based on notice
- [ ] Push notification 24h and 2h before appointment with check-in option
- [ ] Past appointment review prompt appears once, dismissible permanently

---

### F9: Favorites

**Priority:** P1 | **Effort:** Low

| Aspect | Specification |
|--------|---------------|
| **Actions** | Heart toggle from any business card or detail view |
| **Storage** | User account (synced), unlimited |
| **List View** | Grid/sortable by: recently added, name, next availability |
| **Notifications** | Optional: "New availability at [favorite]" or "Special offer" |
| **Quick Rebook** | One-tap to last service from favorites list |

**Acceptance Criteria:**
- [ ] Toggle provides haptic feedback and animation
- [ ] Un-favoriting shows undo toast for 5 seconds
- [ ] Favorites load offline from cache with stale-while-revalidate
- [ ] Share favorite business as referral link with attribution

---

### F10: User Profile

**Priority:** P1 | **Effort:** Medium

| Section | Content |
|---------|---------|
| **Personal Info** | Name, email, phone, profile photo, birthday (optional, for offers) |
| **Preferences** | Default notification settings, preferred payment method, home location |
| **Security** | Password change, 2FA toggle, active sessions management |
| **Data** | Download personal data, delete account |
| **Activity** | Appointment count, review count, member since |

**Acceptance Criteria:**
- [ ] Profile photo upload supports crop, max 5MB, auto-compress to 500KB
- [ ] Email change requires verification at new address before switch
- [ ] Data export completes in <24 hours, delivered via secure link
- [ ] Account deletion shows impact summary and requires typed confirmation

---

### F11: Availability & Slot Computation

**Priority:** P0 | **Effort:** High

| Aspect | Specification |
|--------|---------------|
| **Business Schedule** | Weekly recurring + exception dates (holidays, closures) |
| **Staff Schedule** | Individual schedules with business default override |
| **Slot Generation** | Based on: open hours, service duration, staff availability, existing bookings, buffer time |
| **Constraints** | Min booking notice (e.g., 2h ahead), max advance (e.g., 90 days), concurrent bookings per staff |
| **Optimization** | Prefer contiguous bookings; minimize gaps; respect staff break preferences |
| **Caching** | Pre-compute next 7 days; on-demand beyond; invalidate on booking mutation |

**Acceptance Criteria:**
- [ ] Slot query for single service returns in <200ms
- [ ] Multi-service consecutive booking finds valid combinations
- [ ] Double-booking impossible even with concurrent requests (database constraint + optimistic locking)
- [ ] Business can set "blackout" periods with bulk operation
- [ ] System handles daylight saving transitions correctly

---

### F12: Shared Types & Design System

| Layer | Specification |
|-------|---------------|
| **Design Tokens** | Colors, typography, spacing, shadows, animation curves in platform-agnostic format |
| **Component Library** | Buttons, inputs, cards, modals, date picker, time slot grid, loading states, error states |
| **Accessibility** | WCAG 2.1 AA minimum; screen reader labels, focus management, color-independent states |
| **Localization** | i18n framework; initial: FR, EN, ES, DE; RTL support in architecture |
| **Theming** | Light/dark mode; business brand color injection (subtle, within constraints) |

**Acceptance Criteria:**
- [ ] New screen composed from existing components without custom CSS
- [ ] All interactive elements have ≥44x44pt touch target
- [ ] Error states are contextual, actionable, and non-blocking where possible
- [ ] Loading skeletons match final layout to prevent CLS > 0.1

---

### F13: Reviews & Ratings

**Priority:** P1 | **Effort:** Medium

| Aspect | Specification |
|--------|---------------|
| **Eligibility** | Post-completion only; one per appointment; editable for 30 days |
| **Rating Dimensions** | Overall (1-5), optional: staff, value, cleanliness, atmosphere |
| **Content** | Text (500 chars max), photos (up to 5) |
| **Moderation** | Auto-flag: profanity, contact info, competitor mentions; human review queue |
| **Business Response** | Public reply capability; notification on new review |
| **Aggregation** | Weighted recency (recent reviews weighted 2x); update on new submission |

**Acceptance Criteria:**
- [ ] Review form pre-populates from quick-tap star rating
- [ ] Photo upload compresses to max 2MB each, with preview
- [ ] Business owner notified within 15 minutes of new review
- [ ] Inappropriate review hidden pending review within 4 hours (business hours)
- [ ] Customer can update or delete own review; deletion removes from aggregation

---

### F14: Payment Integration

**Priority:** P1 | **Effort:** High

| Aspect | Specification |
|--------|---------------|
| **Providers** | Stripe primary; Adyen for EU expansion |
| **Payment Methods** | Cards, Apple Pay, Google Pay, SEPA (DE/FR), Klarna/Afterpay (BNPL) |
| **Models** | Full prepay, deposit (fixed or %), pay at venue (card on file for no-show) |
| **Flows** | Payment at booking, or saved card for automatic charge on service completion |
| **Refund Policy** | Configurable per business; automated for policy-compliant cancellations |
| **Receipts** | Email + in-app; itemized with VAT where applicable |

**Acceptance Criteria:**
- [ ] PCI compliance via tokenization; no raw card data touches servers
- [ ] 3D Secure handled with fallback for friction reduction
- [ ] Failed payment shows specific error and retry path; holds slot for 5 min
- [ ] Refund processes to original payment method in <7 business days
- [ ] Financial reconciliation report for business owners (daily/weekly/monthly)

---

### F15: Notifications

**Priority:** P1 | **Effort:** Medium

| Channel | Use Cases |
|---------|-----------|
| **Push** | Booking confirmation, reminder (24h, 2h), modification, cancellation, review prompt, promotional (opt-in) |
| **SMS** | Backup for critical; appointment reminders for next-day |
| **Email** | Receipt, account activity, monthly summary, re-engagement |
| **In-App** | Real-time booking status, messages from business |

**Acceptance Criteria:**
- [ ] User controls per-channel, per-type preferences
- [ ] Quiet hours respected (default 22:00-08:00, user-configurable)
- [ ] Notification deep-links to relevant screen with back navigation to home
- [ ] Delivery tracking: attempted, delivered, opened (where technically possible)
- [ ] Rate limiting prevents >3 promotional notifications per week

---

### F16: Provider / Business Owner Portal

**Priority:** P0 | **Effort:** High

| Module | Functionality |
|--------|---------------|
| **Dashboard** | Today's appointments, revenue snapshot, occupancy rate, new reviews |
| **Calendar** | Day/week/month views; drag-to-reschedule; block time; staff view toggle |
| **Services** | CRUD services with: name, description, duration, price, category, staff assignment |
| **Staff** | Manage team members, their schedules, services, and permissions |
| **Bookings** | View all; filter by status, date, staff; manual entry for walk-ins/phone |
| **Customers** | CRM light: visit history, notes, contact; export capability |
| **Analytics** | Revenue trends, popular services, staff utilization, no-show rate; date-range comparison |
| **Settings** | Business info, hours, cancellation policy, payment methods, integrations |

**Acceptance Criteria:**
- [ ] Calendar supports multi-staff view with color coding
- [ ] Manual booking validates against same rules as customer-facing flow
- [ ] Staff permissions: Owner (full), Manager (bookings, staff), Staff (own calendar only)
- [ ] Revenue figures match payment provider settlement within 24 hours
- [ ] Data export in CSV/Excel for any date range, max 12 months per request

---

### F17: Admin Dashboard

**Priority:** P2 | **Effort:** High

| Module | Functionality |
|--------|---------------|
| **Overview** | MAU, bookings, GMV, active businesses, churn metrics; real-time and trended |
| **User Management** | Search, view, suspend/activate, impersonate (with audit log) |
| **Business Onboarding** | Application review, document verification, approval workflow |
| **Content Moderation** | Review queue for flagged businesses, services, reviews |
| **Financial** | Platform fee configuration, payout scheduling, dispute management |
| **System Health** | API latency, error rates, queue depths, third-party status |
| **Communications** | In-app announcements, email campaigns, push broadcast |

**Acceptance Criteria:**
- [ ] All admin actions logged with admin ID, timestamp, before/after state
- [ ] Sensitive operations require re-authentication or second approver
- [ ] Dashboard loads primary KPIs in <2s; drill-down queries <5s
- [ ] Role-based access: SuperAdmin, Operations, Support, Finance, ReadOnly

---

### F18: Background Jobs (BullMQ)

| Queue | Jobs | Priority | Retry |
|-------|------|----------|-------|
| **notifications** | Push send, email send, SMS send | High | 3x with backoff |
| **bookings** | Slot release on timeout, waitlist notification, no-show processing | Critical | Immediate retry |
| **payments** | Charge capture, refund processing, payout generation | Critical | 5x with manual queue after |
| **analytics** | Aggregation rollups, report generation, data warehouse sync | Low | Next scheduled run |
| **media** | Image resize/optimize, video transcode, CDN invalidation | Medium | 3x |
| **integrations** | Third-party sync (accounting, marketing tools) | Medium | Exponential backoff |
| **maintenance** | Data cleanup, archive old records, index optimization | Lowest | Next window |

**Acceptance Criteria:**
- [ ] Critical jobs processed with <30s latency at p99
- [ ] Failed jobs alert on-call after 2 attempts; manual retry UI available
- [ ] Job progress trackable for long-running operations (reports, bulk actions)
- [ ] Dead letter queue with 30-day retention for forensic analysis
- [ ] Queue depth monitoring with auto-scaling trigger at threshold

## 5. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | App cold start <2s; screen transition <300ms; API p95 <200ms |
| **Reliability** | 99.9% uptime; graceful degradation for non-critical features |
| **Security** | OWASP Top 10 mitigation; annual penetration test; SOC 2 Type II roadmap |
| **Privacy** | GDPR/CCPA compliant; data residency options; cookie consent |
| **Scalability** | Support 10M users, 100K businesses, 1M daily bookings |

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | F1, F2, F3, F5, F6, F7, F8, F11, F16 (core) | Month 1-3 |
| **Growth** | F4, F9, F10, F13, F14, F15 | Month 4-6 |
| **Scale** | F12 refinement, F17, F18 optimization, advanced analytics | Month 7-9 |

## 7. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion (visit → book) | >8% |
| Search-to-book time | <5 minutes median |
| Business owner NPS | >50 |
| Customer retention (90-day) | >40% |
| App store rating | >4.5 |
| Support tickets per 1000 bookings | <2 |
