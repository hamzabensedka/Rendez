# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first platform connecting customers with local service businesses (salons, barbershops, spas, clinics) for appointment booking. The product serves three user segments: **Customers** (book appointments), **Providers** (manage business and availability), and **Admin** (platform oversight).

---

## 2. User Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Customer** | Urban professional, 25-45, values convenience | Find, compare, and book services quickly |
| **Guest** | Unregistered user exploring the platform | Browse without commitment, convert to registered user |
| **Provider** | Small business owner or manager | Manage schedule, reduce no-shows, grow clientele |
| **Admin** | Platform operator | Monitor health, resolve disputes, ensure quality |

---

## 3. Feature Specifications

### 3.1 User Authentication

**Priority:** P0 | **Owner:** Product-Engineering

| Aspect | Specification |
|--------|---------------|
| **Registration Methods** | Email/password, Google OAuth, Apple Sign-In |
| pseudonym | Password min 8 chars, 1 uppercase, 1 number, 1 special character |
| **Email Verification** | Required before booking; resend link expires in 24h |
| **Login** | JWT access token (15min) + refresh token (7 days); biometric option on mobile |
| **Password Reset** | Secure token via email, single-use, 1-hour expiry |
| **Session Management** | Max 5 concurrent sessions; force logout from all devices option |

**Acceptance Criteria:**
- AC1: User can register with email, verify via link, and log in within 30 seconds
- AC2: OAuth flow completes in under 10 seconds with valid credentials
- AC3: Expired/invalid tokens return 401 with clear error message, triggering re-auth
- AC4: Biometric prompt appears after 3 successful password logins (mobile only)
- AC5: "Remember me" extends session to 30在用户请求时30天; unchecked expires in 2 hours idle

---

### 3.2 Guest Browse & Explore

**Priority:** P0 | **Owner:** Product-Growth

| Aspect | Specification |
|--------|---------------|
| **Access Level** | No account required for browsing search, listings, and basic business details |
| **Restrictions** | Booking, favorites, and reviews require authentication |
| **Conversion Triggers** | "Book Now" CTA prompts login; post-login redirect preserves intended action |
| **Guest Data** | Location (IP-derived, editable), recent searches stored locally (7 days) |

**Acceptance Criteria:**
- AC1: Guest sees full search results and business detail pages without login barrier
- AC2: Attempting to book triggers auth modal with "Continue as Guest" disabled (booking requires account)
- AC3: Post-authentication redirect returns user to original intent (search filters preserved)
- AC4: Guest sees persistent banner: "Create account to book and save favorites"

---

### 3.3 Business Search & Discovery

**Priority:** P0 | **Owner:** Product-Core

| Aspect | Specification |
|--------|---------------|
| **Search Inputs** | Free-text (business name, service), location (current/given), date range |
| **Filters** | Service category, price range, rating (4.0+, 4.5+), availability (today, this week), amenities, language spoken |
| **Sorting** | Relevance (default), distance, rating, price (low-high), availability (soonest) |
| **Results Display** | Card list with: thumbnail, name, rating, distance, starting price, next available slot |
| **Pagination** | Cursor-based, 20 results per page, infinite scroll on mobile |
| **Search History** | Store last 10 searches per user; allow one-tap re-run |

**Acceptance Criteria:**
- AC1: Search returns relevant results in under 500ms for 95th percentile queries
- AC2: Typo tolerance handles 2-character Levenshtein distance (e.g., "haircut" → "haitcut")
- AC3: Empty state suggests: nearby alternatives, popular categories, or "broaden filters" action
- AC4: Tapping "Book" on result card pre-fills business in booking flow

---

### 3.4 Map-based Search

**Priority:** P0 | **Owner:** Product-Core

| Aspect | Specification |
|--------|---------------|
| **Map Provider** | Mapbox (custom styling) or Google Maps (fallback) |
| **Default View** | User's current location with 2km radius; cluster markers for density |
| **Marker States** | Default (available today), busy (limited slots), closed (grayed), promoted (highlighted) |
| **Interaction** | Pin tap → bottom sheet preview; "View" → full business detail |
| **Boundaries** | Search adapts to visible map region; update results on pan/zoom end (debounced 300ms) |
| **List/Map Toggle** | Persistent toggle; preserve scroll position when switching |

**Acceptance Criteria:**
- AC1: Map initializes with user location within 3 seconds (with permission) or city center (denied)
- AC2: 100+ markers cluster without performance degradation; de-cluster at zoom level 12
- AC3: Bottom sheet swipes up to 60% screen; full detail on "View" tap
- AC4: Map search and list search are synchronized; filter changes reflect on both

---

### 3.5 Business Detail View

**Priority:** P0 | **Owner:** Product-Core

| Aspect | Specification |
|--------|---------------|
| **Header** | Hero image carousel (max 10), business name, verified badge, rating, review count |
| **Info Section** | Address (with directions link), hours (today's status + full schedule), phone, website |
| **Services** | Categorized list with: name, duration, description, price, "Book" CTA |
| **Team** | Staff profiles with photo, name, specialty, rating; filter services by staff |
| **Reviews** | Aggregate score, distribution histogram, 3 featured reviews, "See all" link |
| **Footer** | Sticky "Book Appointment" button; disabled if no availability |

**Acceptance Criteria:**
- AC1: Page loads in under 2 seconds on 3G; images lazy-loaded with blur placeholder
- AC2: "Add to Calendar" pre-populates with business address and service details
- AC3: Share button generates deep link with preview image for social platforms
- AC4: Offline: cached business details viewable; "Book" triggers sync queue

---

### 3.6 Service Categories

**Priority:** P0 | **Owner:** Product-Core

| Aspect | Specification |
|--------|---------------|
| **Hierarchy** | 2-level: Category (e.g., Hair) → Subcategory (e.g., Cut, Color, Styling) |
| **Default Categories** | Hair, Nails, Face & Skin, Massage & Spa, Fitness & Wellness, Medical Aesthetics, Pet Services |
| **Provider Assignment** | Each business selects from master list; can suggest new categories (pending admin approval) |
| **Discovery** | Category icons on home; trending categories algorithmically surfaced |
| **SEO** | Category pages indexable with localized content |

**Acceptance Criteria:**
- AC1: Category icon grid renders in 2 rows on mobile, 4 on tablet
- AC2: Selecting category filters search to that category with subcategory chips
- AC3: Category with no local results shows "No [Category] nearby" with nearest option and "Notify me" for new openings

---

### 3.7 Booking Flow

**Priority:** P0 | **Owner:** Product-Core

**Flow Steps:**
1. **Select Service** (or bundle multiple services)
2. **Select Provider/Staff** (optional "Any available")
3. **Select Date** → **Select Time Slot** from computed availability
4. **Review & Confirm** (service, time, price, cancellation policy)
5. **Payment** (if required) or **Confirm**
6. **Confirmation** with calendar invite, directions, add-to-wallet

| Aspect | Specification |
|--------|---------------|
| **Slot Selection** | Morning/Afternoon/Evening grouping; first available highlighted |
| **Waitlist** | Full day offers "Join waitlist" for cancellations |
| **Guest Booking** | Require name, phone, email; create account prompt post-booking |
| **Modification** | Reschedule (same business, any future slot) or Cancel with policy enforcement |

**Acceptance Criteria:**
- AC1: Complete booking in under 60 seconds for returning user with saved payment
- AC2: Slot selection prevents double-booking via optimistic lock (hold for 5 minutes during checkout)
- AC3: Cancellation policy displayed pre-booking; enforced automatically (e.g., 24h notice = full refund, <24h = 50%)
- AC4: Booking confirmation arrives via push, email, and SMS within 10 seconds
- AC5: Failed payment releases hold with graceful retry (3 attempts, user notified each)

---

### 3.8 Appointment Management

**Priority:** P0 | **Owner:** Product-Core

| Aspect | Specification |
|--------|---------------|
| **Customer Views** | Upcoming (chronological), Past, Cancelled; group by month |
| **Actions** | Reschedule (wizard re-uses booking flow), Cancel, Rebook (repeat same service), Get Directions, Call |
| **Status States** | Confirmed, Checked-in, In-Progress, Completed, Cancelled, No-Show, Rescheduled |
| **Reminders** | 24h email, 2h SMS/push (configurable by user) |
| **Receipts** | PDF invoice post-completion; accessible in app indefinitely |

**Acceptance Criteria:**
- AC1: Upcoming appointments widget on home shows next 3; deep link to full list
- AC2: Reschedule within policy window; outside window shows "Contact business" with tap-to-call
- AC3: Cancelled appointment prompts reason collection (mandatory for platform, optional share with business)
- AC4: Past appointments rateable for 7 days post-completion; prompt on 2nd app open after completion

---

### 3.9 Favorites

**Priority:** P1 | **Owner:** Product-Growth

| Aspect | Specification |
|--------|---------------|
| **Actions** | Heart icon on business card/detail; toggle with haptic feedback |
| **Organization** | Default list; user-created lists (e.g., "Hair in Paris", "Gift Ideas") |
| **Notifications** | Optional: alert for new availability, promotions, or new reviews from favorited businesses |
| **Privacy** | Lists private by default; shareable via link (future) |

**Acceptance Criteria:**
- AC1: Favorite/unfavorite syncs immediately; offline action queues for sync
- AC2: Favorites tab shows empty state with "Discover businesses" CTA when none saved
- AC3: Favorited businesses surface in search results with heart indicator

---

### 3.10 User Profile

**Priority:** P1 | **Owner:** Product-Core

| Aspect | Specification |
|--------|---------------|
| **Profile Data** | Photo, name, phone, email, birthday (for birthday offers), preferred language |
| **Preferences** | Default booking reminders, notification channels, privacy settings |
| **Payment Methods** | Multiple cards, default selection; PCI-compliant tokenization (Stripe) |
| **Security** | Change password, 2FA option, active sessions list, delete account (GDPR/CCPA) |
| **History** | Booking statistics, total spent, favorite categories |

**Acceptance Criteria:**
- AC1: Profile completion percentage drives progressive disclosure of features (e.g., 80% for early access)
- AC2: Account deletion initiates 30-day grace period with recovery option; permanent after
- AC3: Data export (GDPR Article 20) generates downloadable archive within 24 hours

---

### 3.11 Availability & Slot Computation

**Priority:** P0 | **Owner:** Product-Platform

| Aspect | Specification |
|--------|---------------|
| **Business Hours** | Weekly recurring + exception dates (holidays, closures) |
| **Staff Schedules** | Individual availability with break blocks, time-off requests |
| **Slot Generation** | Dynamic based on: service duration, buffer time, staff availability, existing bookings, concurrent service limits |
| **Buffer Rules** | Configurable pre/post buffer (e.g., 15min cleanup); travel time for mobile services |
| **Real-time** | Slot availability recomputed on every search; hold expires in 5 minutes |
| **Complex Services** | Multi-service sequences (e.g., color then cut) computed as single block |

**Acceptance Criteria:**
- AC1: Slot query for single service returns in under 200ms for 30-day window
- AC2: Concurrent booking attempts for same slot: first succeeds, second receives "Just booked" with next alternatives
- AC3: Business can set "Accept walk-ins only" to disable online booking while remaining discoverable
- AC4: Staff absence (sick day) automatically frees their slots and reassigns "Any" bookings if possible

---

### 3.12 Shared Types & Design System

**Priority:** P0 | **Owner:** Product-Design

| Aspect | Specification |
|--------|---------------|
| **Design Tokens** | Colors (primary #FF6B6B, secondary #4ECDC4, semantic states), typography (Inter family, 12 scales), spacing (4px base), radii, shadows |
| **Components** | Buttons (5 variants), inputs (with validation states), cards, modals, bottom sheets, date/time pickers, skeleton loaders, empty states, error boundaries |
| **Accessibility** | WCAG 2.1 AA minimum; screen reader labels, focus management, color contrast 4.5:1, reduced motion support |
| **Platform Parity** | iOS/Android share 95% visual consistency; native patterns for navigation (iOS bottom tabs, Android top + drawer optional) |
| **Theme** | Light default; dark mode follows system preference |

**Acceptance Criteria:**
- AC1: All components documented in Storybook with usage examples
- AC2: New feature uses existing components; deviation requires design review
- AC3: Accessibility audit passes automated checks (axe) and manual screen reader test

---

### 3.13 Reviews & Ratings

**Priority:** P1 | **Owner:** Product-Growth

| Aspect | Specification |
|--------|---------------|
| **Eligibility** | Verified customers only (completed appointment); review window 7 days post-appointment |
| **Rating Dimensions** | Overall (1-5 stars), optional: Service Quality, Staff, Ambiance, Value |
| **Content** | Text (min 20, max 1000 chars), photos (max 5, 5MB each) |
| **Moderation** | Auto-flag: profanity, spam patterns, competitor mentions; human review queue for disputes |
| **Business Response** | Public reply capability; response rate and time displayed on profile |
| **Review Sorting** | Most helpful (default), newest, highest/lowest rating |

**Acceptance Criteria:**
- AC1: Review form pre-fills business, service, staff from appointment
- AC2: Anonymous option hides customer name but shows "Verified Visit"
- AC3: Business receives email notification of new review; response within 72 hours highlighted
- AC4: Review reported by 3+ users or business auto-hides pending investigation

---

### 3.14 Payment Integration

**Priority:** P0 | **Owner:** Product-Platform

| Aspect | Specification |
|--------|---------------|
| **Processor** | Stripe (primary); Adyen (EU expansion) |
| **Methods** | Cards (credit/debit), Apple Pay, Google Pay, PayPal (optional), Buy Now Pay Later (Klarna/Afterpay) |
| **Flows** | Pay at booking (full), deposit (partial), pay at venue (card on file for no-show protection) |
| **Pricing** | Transparent: service price + booking fee (displayed) + tax; business absorbs or passes fee |
| **Refunds** | Automated per cancellation policy; manual refund tool for support |
| **Payouts** | Business receives funds T+2; dashboard shows pending/settled amounts |

**Acceptance Criteria:**
- AC1: Payment sheet loads in under 3 seconds; 3D Secure handled inline
- AC2: Failed payment: clear error, preserve slot for 2 minutes for retry
- AC3: Receipt emailed with itemized breakdown; accessible in app
- AC4: PCI compliance: no raw card data touches our servers (Stripe Elements)

---

### 3.15 Notifications

**Priority:** P1 | **Owner:** Product-Engagement

| Channel | Use Cases | User Control |
|---------|-----------|--------------|
| **Push** | Booking confirmation, reminders (24h, 2h), promotions, waitlist availability | Granular per-type toggles |
| **Email** | Receipts, policy changes, marketing (opt-in), monthly summary | Frequency settings |
| **SMS** | Urgent: same-day reminders, last-minute changes | On/Off only |
| **In-App** | New features, account alerts, review prompts | Badge + inbox |

**Acceptance Criteria:**
- AC1: Notification preference center accessible from profile and settings
- AC2: Quiet hours respected (default 10pm-8am local time, customizable)
- AC3: Deep links from notifications route to correct screen with context preserved
- AC4: Failed push delivery falls back to SMS for critical (booking change) within 5 minutes

---

### 3.16 Provider / Business Owner Portal

**Priority:** P0 | **Owner:** Product-Platform

| Module | Specification |
|--------|---------------|
| **Dashboard** | Today's appointments, weekly revenue, occupancy rate, new vs. returning customers |
| **Calendar** | Day/week/month views; drag-drop reschedule; color-coded by status; block time off |
| **Services** | CRUD services with: name, description, duration, price, buffer, online booking toggle |
| **Staff** | Add staff, set permissions (view only, manage own, full admin), individual schedules |
| **Customers** | CRM: view history, notes, contact; export for marketing (with consent) |
| **Bookings** | Manual entry (walk-in, phone), modify/cancel with customer notification |
| **Settings** | Business hours, holidays, cancellation policy, payment methods, integrations (Google Business, social) |
| **Mobile App** | iOS/Android for on-the-go management; tablet-optimized for front desk |

**Acceptance Criteria:**
- AC1: Provider onboarding: business verification in under 5 minutes (auto-approval for most; manual for regulated services)
- AC2: Calendar syncs with Google/Outlook bi-directionally; conflict detection prevents double-booking
- AC3: Revenue report exportable to CSV/PDF; filtered by date range
- AC4: Staff can clock in/out; hours report for payroll integration

---

### 3.17 Admin Dashboard

**Priority:** P1 | **Owner:** Product-Platform

| Module | Specification |
|--------|---------------|
| **Overview** | KPIs: MAU, bookings, GMV, churn, top categories, geographic heatmap |
| **User Management** | Search/filter users, view activity, suspend/activate, impersonate (with audit log) |
| **Business Management** | Onboarding queue, verification status, featured placement, commission settings |
| **Content Moderation** | Review queue, reported content, automated flag review, action (hide, warn, ban) |
| **Financial** | Transaction monitoring, refund approval, payout scheduling, fee structure management |
| **Support** | Ticket system integration, escalation rules, canned responses |
| **System Health** | API latency, error rates, job queue depth, third-party status |

**Acceptance Criteria:**
- AC1: Role-based access: Admin, Support (limited), Finance (read-only financials), Developer (system health)
- AC2: All admin actions logged immutably; exportable for compliance
- AC3: Critical alerts (payment failure spike, service outage) push to on-call via PagerDuty

---

### 3.18 Background Jobs (BullMQ)

**Priority:** P0 | **Owner:** Product-Platform

| Job Type | Description | Schedule/Trigger |
|----------|-------------|------------------|
| **Slot Pre-computation** | Generate availability cache for popular businesses | Every 15 minutes + on schedule change |
| **Reminder Dispatch** | Send push/SMS/email reminders | 24h, 2h before appointment |
| **Notification Batch** | Aggregate and send digest emails | Daily at user-preferred time |
| **Payment Reconciliation** | Match settlements, flag discrepancies | Daily at 6am UTC |
| **Review Prompt** | Trigger post-appointment review request | 2 hours after appointment end |
| **Data Cleanup** | Purge expired holds, anonymize old data, archive | Daily at 3am UTC |
| **Search Index Update** | Sync business/service changes to Elasticsearch | Real-time via change streams |
| **Report Generation** | Compile analytics for business/admin dashboards | Weekly (Mon 7am) or on-demand |
| **Failed Job Handling** | Retry with exponential backoff (3x), then dead letter queue | Automatic |

**Acceptance Criteria:**
- AC1: Job queue depth visible in admin; alert if >1000 queued for >10 minutes
- AC2: Reminder job processes within 1 minute of scheduled time (99.9% SLA)
- AC3: Failed jobs retry 3x with 5min, 15min, 1hour intervals; manual retry from dashboard
- AC4: Job execution idempotent; duplicate runs produce no side effects

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | App cold start < 3s; API p95 < 200ms; image load < 1s |
| **Reliability** | 99.9% uptime; graceful degradation when third-party down |
| **Security** | OWASP Top 10 mitigation; encryption at rest and in transit; annual penetration test |
| **Scalability** | Support 10,000 concurrent bookings; auto-scale on load |
| **Compliance** | GDPR, CCPA, PCI-DSS Level 1; SOC 2 Type II target Q2 |
| **Localization** | FR, EN, ES, DE at launch; RTL support planned |

---

## 5. Analytics & Success Metrics

| Metric | Target | Tracking |
|--------|--------|----------|
| Booking Conversion Rate | >15% | Search → Book funnel |
| Guest-to-Registered Conversion | >30% | Post-booking account creation |
| Provider Activation (first booking) | >70% within 14 days of signup | Onboarding funnel |
| NPS (Customers) | >50 | Quarterly survey |
| NPS (Providers) | >40 | Quarterly survey |
| Monthly Churn | <5% | Cohort analysis |
| Support Ticket Volume | <2% of transactions | Zendesk integration |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Guest Browse, Search, Map, Business Detail, Booking Flow, Appointment Mgmt, Provider Portal (basic), Availability Engine, Payments | 8 weeks |
| **v1.1** | Favorites, Reviews, Notifications, User Profile enhancements | +4 weeks |
| **v1.2** | Admin Dashboard, Analytics, Background Jobs optimization, BullMQ migration | +4 weeks |
| **v2.0** | Waitlist, Packages/Gift Cards, Memberships, Marketplace expansion | Q3 |

---

## 7. Appendix

- **Glossary:** Slot = bookable time interval; Provider = business owner/staff; Hold = temporary reservation during checkout
- **Dependencies:** Stripe, Mapbox/Google Maps, Twilio (SMS), SendGrid (email), Firebase (push)
- **Risk Register:** Payment fraud (mitigation: Stripe Radar), no-show rate (mitigation: card holds), provider churn (mitigation: success team, reduced fees early)

*Document Version: 1.0 | Last Updated: 2024 | Owner: Alex, Product Owner*