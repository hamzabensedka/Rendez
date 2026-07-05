# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a platform connecting clients with beauty/wellness businesses for appointment booking. It serves three user types: **Clients** (book appointments), **Providers/Business Owners** (manage business and appointments), and **Admins** (platform oversight).

---

## 2. User Personas

| Persona | Goals | Pain Points |
|---------|-------|-------------|
| **Client** | Find, compare, and book beauty services quickly | No visibility into real-time availability; phone tag with salons |
| **Provider** | Fill calendar, reduce no-shows, manage online presence | Manual booking overhead; fragmented tools |
| **Admin** | Ensure platform health, onboard businesses, resolve disputes | Fraud detection; quality control |

---

## 3. Feature Specifications

### 3.1 User Authentication
**Priority:** P0 | **Owner:** Platform Team

| Aspect | Specification |
|--------|---------------|
| **Registration Methods** | Email/password, Google OAuth, Apple Sign-In |
| **Login** | JWT-based session with refresh token rotation; 30-day remember me |
| **Password Security** | BCrypt hashing, minimum 8 chars with complexity requirements |
| **Account Verification** | Email verification required for booking; SMS optional for providers |
| **Role Selection** | Post-registration flow asks "Booking appointments" or "Managing my business" |
| **Password Reset** | Secure token via email, 1-hour expiry |
| **Session Management** | Concurrent session limit (3); device list with remote logout |

**Acceptance Criteria:**
- AC1: New user completes registration in < 30 seconds via OAuth
- AC2: Unverified users can browse but cannot book
- AC3: Token refresh is transparent to user; no forced re-login < 30 days
- AC4: Provider accounts require phone verification before calendar activation

---

### 3.2 Guest Browse & Explore
**Priority:** P0 | **Owner:** Growth Team

| Aspect | Specification |
|--------|---------------|
| **Guest Permissions** | View businesses, services, prices, reviews, availability (read-only) |
| **Conversion Prompts** | Soft prompts at booking attempt, favorite action, or 3rd business view |
| **Guest Session** | LocalStorage for temporary favorites; merge on account creation |
| **SEO** | Server-rendered business pages for search indexing |

**Acceptance Criteria:**
- AC1: Guest sees full business directory without authentication
- AC2: "Sign up to book" CTA appears on any booking attempt
- AC3: Guest favorites persist for 7 days or until account creation
- AC4: Page load for business listing < 2s (Lighthouse performance score > 80)

---

### 3.3 Business Search & Discovery
desc
**Priority:** P0 | **Owner:** Core Experience Team

| Aspect | Specification |
|--------|---------------|
| **Search Inputs** | Free text (business name, service), location (auto-detected or manual), date preference |
| **Filters** | Category, price range, rating, distance, availability for specific date/time, amenities |
| **Sorting** | Relevance (default), distance, rating, price (low to high) |
| **Auto-complete** | Business names, service names, neighborhoods — debounced 200ms |
| **Search History** | Last 10 searches per user, clearable |
| **Results Display** | Card-based: image, name, rating, starting price, next available slot, distance |
| **Empty States** | Suggested alternatives (nearby locations, similar services) |

**Acceptance Criteria:**
- AC1: Search returns results in < 500ms for 95th percentile queries
- AC2: Typo-tolerance handles 1-2 character deviations
- AC3: Results update dynamically as filters change without full page reload
- AC4: "Book Now" on result card deep-links to booking flow with pre-filled context

---

### 3.4 Map-based Search
**Priority:** P1 | **Owner:** Core Experience Team

| Aspect | Specification |
|--------|---------------|
| **Map Provider** | Mapbox or Google Maps (TBD based on pricing) |
| **Clustering** |zent** | Cluster markers at zoomed-out levels; individual pins at street level |
| **Pin Information** | Price indicator, rating color-coding, quick-view on tap/click |
| **Hybrid View** | Split-screen list+map on desktop; toggle on mobile |
| **Geolocation** | Browser/device GPS with permission prompt; fallback to IP-based city center |
| **Bounds Search** | Update results to visible map area on pan/zoom (debounced 300ms) |

**Acceptance Criteria:**
- AC1: Map initializes with user location within 2 seconds of permission grant
- AC2: 500+ markers render without frame drops (60fps target)
- AC3: Map/list views maintain filter/sort state across toggle
- AC4: Pin tap reveals mini-card with 1-tap booking path

---

### 3.5 Business Detail View
**Priority:** P0 | **Owner:** Core Experience Team

| Aspect | Specification |
|--------|---------------|
| **Header** | Hero image carousel (up to 5), business name, rating, favorite toggle |
| **Info Section** | Address with directions link, phone, hours, website, social links |
| **Services Tab** | Categorized service list with duration, description, price, "Book" CTA per service |
| **Team Tab** | Staff profiles with specialties, photos, individual availability |
| **Reviews Tab** | Rating distribution, review list with photos, owner responses |
| **About Tab** | Business description, amenities, COVID/safety policies, certifications |
| **Sticky Footer** | "Book Appointment" with starting price on mobile |

**Acceptance Criteria:**
- AC1: All images lazy-loaded; above-fold renders in < 1.5s
- AC2: Service selection pre-fills booking flow with correct provider, service, duration
- AC3: Reviews paginated (10 per page); sortable by newest/most helpful
- AC4: Share button generates deep link with preview image for social platforms

---

### 3.6 Service Categories
**Priority:** P0 | **Owner:** Core Experience Team

| Aspect | Specification |
|--------|---------------|
| **Category Hierarchy** | 2-level: e.g., Hair > Cut, Color, Styling; Nails > Manicure, Pedicure, Art |
| **Category Icons** | Consistent icon set; fallback to text if icon unavailable |
| **Popular Services** | "Trending" algorithm: booking velocity + seasonality + regional popularity |
| **Custom Services** | Providers can create custom services within standard categories |
| **Service Metadata** | Name, description, duration (min/max), price (fixed or range), deposit requirement |

**Acceptance Criteria:**
- AC1: Category browse accessible from homepage in 1 tap/click
- AC2: Provider can add custom service during onboarding in < 2 minutes
- AC3: Service duration enforces slot boundaries in availability engine
- AC4: Price range display handles fixed price ("$50") and range ("From $30")

---

### 3.7 Booking Flow
**Priority:** P0 | **Owner:** Core Experience Team

| Step | Specification |
|------|-------------|
| **1. Service Selection** | Single or multiple services (cart-style); validate compatibility |
| **2. Provider/Any** | Choose specific staff or "no preference" for fastest availability |
| **3. Date & Time** | Calendar view with available slots; morning/afternoon/evening quick filters |
| **4. Extras/Add-ons** | Optional upgrades (e.g., deep conditioning, nail art) |
| **5. Client Details** | Name, phone, email (pre-filled for authenticated users); special requests field |
| **6. Payment** | Card on file, Apple/Google Pay, or pay at venue (per business setting) |
| **7. Confirmation** | Summary with add-to-calendar, directions, cancellation policy |

| Aspect | Specification |
|--------|---------------|
| **Slot Display** | Show 3-5 days forward by default; load more on scroll |
| **Real-time Validation** | Slots disappear if booked by another user during session (optimistic locking) |
| **Hold Mechanism** | 10-minute hold on selected slot during payment; auto-release on timeout |
| **Guest Checkout** | Allow booking with email + phone; auto-create account post-booking |

**Acceptance Criteria:**
- AC1: Complete booking in < 4 steps for returning user with saved payment
- AC2: Slot selection shows accurate availability within 5 seconds of selection
- AC3: Double-booking prevented at database level (unique constraint on slot)
- AC4: Abandoned booking (exit mid-flow) triggers email reminder with deep link

---

### 3.8 Appointment Management
**Priority:** P0 | **Owner:** Core Experience Team

| Aspect | Specification |
|--------|---------------|
| **Client Views** | Upcoming (sorted by date), Past, Cancelled |
| **Actions** | Reschedule (to new slot), Cancel (with policy enforcement), Rebook (same service) |
| **Details** | QR code for check-in, directions, contact business, add to calendar |
| **Status States** | Confirmed, Reminder Sent, Checked In, In Progress, Completed, Cancelled, No-show |
| **Modification Rules** | Reschedule/cancel allowed up to defined hours before appointment (business-configurable) |

**Acceptance Criteria:**
- AC1: Client receives push + email confirmation within 10 seconds of booking
- AC2: Cancellation policy displayed prominently; enforced at action time
- AC3: Reschedule finds next available slots for same service/provider
- AC4: Past appointments trigger review prompt 2 hours post-completion

---

### 3.9 Favorites
**Priority:** P1 | **Owner:** Engagement Team

| Aspect | Specification |
|--------|---------------|
| **Actions** | Heart toggle from any business card or detail page |
| **Collection** | User's favorites page with search/filter within collection |
| **Notifications** | Optional: notify when favorite adds new service, has availability, or offers promotion |
| **Sync** | Cross-device; guest favorites prompt login on action |

**Acceptance Criteria:**
- AC1: Favorite/unfavorite is instantaneous UI; background sync tolerates offline
- AC2: Favorites page loads in < 1s for collections up to 100 items
- AC3: Unfavorited items can be recovered via undo toast (5 seconds)

---

### 3.10 User Profile
**Priority:** P1 | **Owner:** Core Experience Team

| Aspect | Specification |
|--------|---------------|
| **Personal Info** | Name, email, phone, profile photo, birthdate (optional, for birthday offers) |
| **Preferences** | Default city, notification settings, payment methods, privacy controls |
| **Booking History** | Same as Appointment Management; data exportable (GDPR) |
| **Loyalty** | Points/visits tracking per business (if loyalty program active) |
| **Account Actions** | Edit info, change password, delete account with 30-day grace period |

**Acceptance Criteria:**
- AC1: Profile completion progress bar incentivizes 100% completion
- AC2: Account deletion initiates data retention workflow; anonymizes bookings after grace period
- AC3: GDPR data export delivers complete user data package within 72 hours of request

---

### 3.11 Availability & Slot Computation
**Priority:** P0 | **Owner:** Platform Team

| Aspect | Specification |
|--------|---------------|
| **Business Hours** | Weekly template + exception dates (holidays, closures) |
| **Breaks** | Lunch, cleanup, custom recurring blocks |
| **Slot Generation** | Dynamic based on service duration + buffer time; respect staff assignment |
| **Constraints** | Service-staff competency matrix; room/equipment requirements |
| **Buffer Rules** | Pre/post-service buffers; minimum notice (e.g., 2 hours ahead) |
| **Multi-booking** | Group classes vs. individual appointments (capacity management) |

**Algorithm Requirements:**
- Slot query must complete in < 100ms for single-day, < 300ms for week view
- Cache invalidation on any booking, cancellation, or schedule change
- Handle timezone correctly for businesses near timezone boundaries

**Acceptance Criteria:**
- AC1: Slot availability is accurate to within 5 seconds of any state change
- AC2: Concurrent slot requests serializable; no overbooking under load testing
- AC3: Business can set "blackout" dates with 0 availability
- AC4: Recurring availability changes propagate to future dates without manual re-entry

---

### 3.12 Shared Types & Design System
**Priority:** P0 | **Owner:** Design System Team

| Aspect | Specification |
|--------|---------------|
| **Component Library** | React Native / React web components with Storybook documentation |
| **Core Components** | Buttons, inputs, cards, modals, date picker, time slot grid, loading states, empty states |
| **Tokens** | Colors, typography, spacing, shadows, border-radius as CSS variables/design tokens |
| **Accessibility** |inet** | WCAG 2.1 AA minimum; screen reader support, focus management, color contrast |
| **Theming** | Light/dark mode; brand color injection for whitelabel scenarios |
| **Icons** | Phosphor or similar; consistent sizing scale |

**Acceptance Criteria:**
- AC1: All new UI uses design system components; no one-off styles
- AC2: Component test coverage > 80% (Jest + React Testing Library)
- AC3: Design tokens sync between Figma and codebase via CI pipeline
- AC4: Accessibility audit passes automated (axe) and manual (screen reader) testing

---

### 3.13 Reviews & Ratings
**Priority:** P1 | **Owner:** Trust & Safety Team

| Aspect | Specification |
|--------|---------------|
| **Eligibility** | Verified clients only; after appointment completion |
| **Rating Dimensions** | Overall (1-5), service quality, staff, ambiance, value (optional granularity) |
| **Content** | Text (min 10 chars, max 2000), photos (up to 5), optional name display |
| **Moderation** | Auto-flag profanity, personal info, off-topic; human review queue for disputes |
| **Business Response** | Public reply to any review; edit window 30 days |
| **Dispute Process** | Client or provider can flag; platform adjudicates within 48 hours |
| **Display Logic** | Weighted recency; verified purchase badge; helpfulness voting |

**Acceptance Criteria:**
- AC1: Review submission within 14 days of appointment; reminder at 2 hours, 3 days, 7 days
- AC2: Inappropriate reviews hidden pending moderation; not deleted without audit trail
- AC3: Average rating recalculates within 1 minute of new review
- AC4: Business cannot delete reviews; only respond or flag for platform review

---

### 3.14 Payment Integration
**Priority:** P0 | **Owner:** Platform Team

| Aspect | Specification |
|--------|---------------|
| **Providers** | Stripe primary; Adyen for EU expansion (future) |
| **Payment Methods** | Cards, Apple Pay, Google Pay, SEPA (future) |
| **Models** | Full prepay, deposit, or pay-at-venue (business-configurable) |
| **Flow** | PCI-compliant: tokenize client-side, charge server-side |
| **Receipts** | Auto-email; in-app receipt history |
| **Refunds** | Full or partial; automatic per cancellation policy, or manual admin action |
| **Payouts** | To business bank account; daily, weekly, or monthly schedule |

**Acceptance Criteria:**
- AC1: Payment succeeds in < 5 seconds under normal conditions
- AC2: Failed payment offers retry with alternative method; holds auto-released
- AC3: Refund processes within platform SLA; business notified immediately
- AC4: Financial reconciliation report available to business and admin

---

### 3.15 Notifications
**Priority:** P1 | **Owner:** Engagement Team

| Channel | Use Cases |
|---------|-----------|
| **Push** | Booking confirmation, reminder (24h, 2h), check-in prompt, promotion from favorite |
| **SMS** | Backup for critical: confirmation, same-day reminder, OTP |
| **Email** | Detailed receipts, marketing (opt-in), account security |
| **In-app** | Feed of updates, unread badge, persistent for 30 days |

| Aspect | Specification |
|--------|---------------|
| **Preferences** | Granular opt-in/out per channel and notification type |
| **Delivery** | Retry logic for failed push/SMS; deliverability monitoring |
| **Localization** | Content in user locale; timezone-aware scheduling |

**Acceptance Criteria:**
- AC1: Critical notifications (booking, reminder) deliver with > 99.5% success rate
- AC2: User can fully unsubscribe from marketing without affecting transactional
- AC3: Notification preferences save and apply within 1 minute
- AC4: Batch marketing sends rate-limited to avoid provider spam

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0 | **Owner:** Provider Team

| Module | Specification |
|--------|-------------|
| **Dashboard** | Today's appointments, revenue this week, occupancy rate, quick actions |
| **Calendar** | Day/week/month views; drag-to-reschedule; block time; color-coded by status |
| **Services** | CRUD services, pricing, duration, online booking enable/disable |
| **Staff** | Add team members, set permissions, assign services, manage individual schedules |
| **Clients** | CRM: client list, visit history, notes, marketing tags |
| **Bookings** | All appointments; filter by status, date, staff; manual booking entry |
| **Settings** | Business info, hours, cancellation policy, payment settings, integrations |
| **Analytics** | Revenue, bookings, no-show rate, top services, client retention (basic) |

**Acceptance Criteria:**
- AC1: Provider completes onboarding (business profile, services, hours) in < 15 minutes
- AC2: Calendar updates sync to client-facing availability in < 5 seconds
- AC3: Manual booking by provider triggers same confirmation flow as online booking
- AC4: Staff permissions restrict access to assigned calendar and client data

---

### 3.17 Admin Dashboard
**Priority:** P1 | **Owner:** Platform Team

| Module | Specification |
|--------|-------------|
| **Business Management** | Onboard, verify, suspend, feature businesses; view details |
| **User Management** | Search clients/providers; view activity; suspend/merge accounts |
| **Booking Oversight** | View all bookings; intervene in disputes; process manual refunds |
| **Content Moderation** | Review queue for flagged reviews, photos, business claims |
| **Financial** | Platform fee tracking, payout monitoring, anomaly detection |
| **Analytics** | MAU, booking volume, GMV, CAC, LTV, churn by cohort |
| **System Health** | API latency, error rates, queue depths, third-party service status |

**Acceptance Criteria:**
- AC1: Admin actions audited with immutable log; non-repudiable
- AC2: Critical alerts (fraud, system down) escalate through PagerDuty in < 2 minutes
- AC3: Business verification includes document upload and manual review workflow
- AC4: Financial reports exportable to CSV/Excel with date range selection

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P1 | **Owner:** Platform Team

| Queue | Jobs | Priority |
|-------|------|----------|
| **notifications** | Send push, email, SMS; retry with backoff | High |
| **bookings** | Slot hold expiration, confirmation follow-up, no-show detection | Critical |
| **payments** | Charge, refund, payout scheduling | Critical |
| **search-index** | Business/service index updates for Elasticsearch | Medium |
| **reports** | Nightly aggregation, analytics materialization | Low priority, off-peak |
| **media** | Image resize, virus scan, CDN invalidation | Medium |
| **reminders** | Appointment reminders at T-24h, T-2h | Time-critical |

| Aspect | Specification |
|--------|---------------|
| **Reliability** | At-least-once delivery; idempotent job handlers |
| **Observability** | Job success/failure metrics in Grafana; dead letter queue for manual review |
| **Scaling** | Horizontal pod autoscaling based on queue depth |
| **Scheduling** | BullMQ cron syntax; timezone-aware for reminder jobs |

**Acceptance Criteria:**
- AC1: No job lost on worker crash; Redis AOF persistence configured
- AC2: Failed jobs retry 3x with exponential backoff, then dead-letter
- AC3: Queue depth alerts trigger before consumer lag affects UX
- AC4: Scheduled jobs execute within 1 minute of target time

---

## 4. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | P95 API response < 200ms; page load < 2s on 4G |
| **Availability** | 99.9% uptime SLA; scheduled maintenance windows communicated |
| **Security** | OWASP Top 10 mitigation; annual penetration test; SOC 2 Type II target |
| **Scalability** | Handle 10x traffic spike without manual intervention (auto-scaling) |
| **Compliance** | GDPR, CCPA, PCI-DSS (level 1 for payment handling) |
| **Localization** | FR, EN, ES, DE at launch; RTL language support in design system |

---

## 5. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Booking conversion rate | > 15% | Bookings / unique visitors |
| Provider activation | > 80% | Complete onboarding / signups |
| Client retention (30d) | > 40% | Return booking within 30 days |
| NPS — Clients | > 50 | Quarterly survey |
| NPS — Providers | > 40 | Quarterly survey |
| Support ticket volume | < 1% of transactions | / month |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Guest browse, Search, Business detail, Booking flow (pay at venue), Provider portal basic, Admin basic | Month 1-2 |
| **V1.0** | + Payments, Reviews, Notifications, Map search, Favorites | Month 3-4 |
| **V1.5** | + Advanced analytics, Loyalty, Marketing tools, Multi-location | Month 5-6 |
| **Scale** | Internationalization, API platform, Third-party integrations | Month 7-12 |

---

*Document version: 1.0 | Last updated: 2024 | Owner: Alex, Product Owner*
