# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first platform connecting customers with beauty, wellness, and service professionals for appointment booking. It serves three user types: **Customers** (book appointments), **Providers/Business Owners** (manage business and appointments), and **Admin** (platform oversight).

## 2. Product Goals

| Goal | Metric |
|------|--------|
| Reduce booking friction | < 3 taps to book a known service |
| Maximize provider utilization | > 80% appointment fill rate |
| Build trust & retention | > 4.5 average app store rating |

## 3. User Personas

- **Emma (28, Customer)**: Books monthly salon appointments, values convenience and reviews
- **Marc (45, Salon Owner)**: Manages 5 stylists, needs efficient scheduling and client management
- **Platform Admin**: Monitors business health, handles disputes, manages onboarding

---

## 4. Feature Specifications

### 4.1 User Authentication

**Priority**: P0 | **Owner**: Backend/Frontend

| Aspect | Specification |
|--------|---------------|
| Registration | Email/password, Google OAuth, Apple Sign-In |
| Login | JWT access (15min) + refresh (7 day) tokens, biometric unlock (Face ID/Touch ID) |
| Password Reset | Email link with 1-hour expiry, rate-limited |
| Account Linking | Merge social accounts with existing email account |
| Guest Conversion | Seamless migration of favorites/search history to registered account |

**Acceptance Criteria**:
- [ ] New user completes registration in < 30 seconds
- [ ] Biometric prompt appears after 2nd successful login
- [ ] Guest data persists for 30 days, prompts for conversion at key actions
- [ ] Invalid credentials show generic "Invalid login" message (security)

---

### 4.2 Guest Browse & Explore

**Priority**: P0 | **Owner**: Frontend

| Aspect | Specification |
|--------|---------------|
| Access Level | Full search, view business profiles, see availability (not book) |
| Conversion Triggers | "Book" button, "Save to Favorites", "See Full Reviews" prompt login |
| Data Persistence | Guest session ID stored locally, syncs on registration |
| Browse Limits | None; full open discovery to reduce friction |

**Acceptance Criteria**:
- [ ] Guest sees identical search results as logged-in user
- [ ] Login modal appears with context: "Log in to book with [Business Name]"
- [ ] Guest selections pre-populate registration form

---

### 4.3 Business Search & Discovery

**Priority**: P0 | **Owner**: Backend/Frontend

| Aspect | Specification |
|--------|---------------|
| Search Inputs | Free text (business name, service), filters (category, price range, rating, distance, availability date) |
| Results Display | List view (default) / Map view toggle; sort by relevance, rating, distance, price |
| Auto-complete | Service names, business names, locations; < 200ms response |
| Recent Searches | Store last 10, clearable; sync across devices for logged-in users |
| Empty States | "No results" with suggested nearby businesses or popular categories |

**Acceptance Criteria**:
- [ ] Search returns results in < 500ms for 95th percentile
- [ ] Typo tolerance (Levenshtein distance ≤ 2) for business/service names
- [ ] Filters combine with AND logic; availability filter shows only businesses with open slots
- [ ] Pull-to-refresh updates results with latest data

---

### 4.4 Map-based Search

**Priority**: P0 | **Owner**: Frontend

| Aspect | Specification |
|--------|---------------|
| Map Provider | Mapbox or Google Maps (cost-dependent) |
| Default View | User's current location with 5km radius; fallback to city center if denied |
| Pins | Color-coded by category; cluster at zoom levels > 10 pins visible |
| Pin Detail | Tap shows bottom sheet: name, rating, price range, next available slot |
| Boundary Search | Pan/zoom map triggers new search within visible bounds |
| User Location | Blue dot with accuracy ring; "Recenter" button when moved |

**Acceptance Criteria**:
- [ ] Map initializes with user location in < 3 seconds
- [ ] Pin tap to business detail navigation < 1 second
- [ ] Clustering prevents pin overlap at any zoom level
- [ ] "List view" button returns to search results with current map filters applied

---

### 4.5 Business Detail View

**Priority**: P0 | **Owner**: Frontend

| Aspect | Specification |
|--------|---------------|
| Header | Hero image carousel (max 5), business name, verified badge, favorite toggle |
| Quick Info | Address, hours, phone, website link, average rating with count |
| Services Tab | Categorized list with duration, price, description; expandable for details |
| Team Tab | Staff profiles with specialties, photos, individual ratings |
| Reviews Tab | Sortable (newest, highest, lowest), filter by service, photos |
| Gallery | Full-screen image viewer with pinch-to-zoom |
| Action | "Book Now" FAB, sticky on scroll |

**Acceptance Criteria**:
- [ ] Page loads in < 2 seconds (Largest Contentful Paint)
- [ ] Image lazy-loading with blur placeholder
- [ ] Offline: cached data viewable, "Book Now" shows "Connect to book"
- [ ] Deep linking: `/business/:id` opens directly to this view

---

### 4.6 Service Categories

**Priority**: P0 | **Owner**: Backend/Frontend

| Aspect | Specification |
|--------|---------------|
| Hierarchy | Category → Subcategory → Service (e.g., Hair → Coloring → Balayage) |
| Taxonomy | Admin-managed; 15 top categories, ~100 subcategories |
| Business Assignment | Businesses select services from taxonomy; can suggest new ones (pending approval) |
| Discovery | Category pills on home screen; category landing pages with featured businesses |
| Icons | Consistent icon set per category for visual recognition |

**Acceptance Criteria**:
- [ ] Category change reflects in search within 5 minutes (cache invalidation)
- [ ] Service search matches across category names and synonyms
- [ ] Business can set custom service name (display) while linked to canonical category

---

### 4.7 Booking Flow

**Priority**: P0 | **Owner**: Full Stack

| Aspect | Specification |
|--------|---------------|
| Entry Points | Business detail "Book", service selection, staff-specific booking |
| Steps | 1. Select service(s) → 2. Select staff (or "No preference") → 3. Pick date/time → 4. Confirm details → 5. Payment (if required) → 6. Confirmation |
| Slot Selection | Calendar view (week) + time grid; shows real availability |
| Add-ons | Upsell related services during flow (e.g., deep conditioning with coloring) |
| Notes | Customer can add special requests (max 500 chars) |
| Guest Booking | Allowed with email + phone; account creation prompt post-booking |

**Acceptance Criteria**:
- [ ] Complete booking in < 60 seconds for returning user
- [ ] Slot held for 10 minutes during payment; released on timeout/cancel
- [ ] Double-booking prevented via optimistic locking at database level
- [ ] Confirmation screen shows calendar invite, directions, cancel/reschedule links
- [ ] Booking modification allowed up to 2 hours before appointment (configurable by business)

---

### 4.8 Appointment Management

**Priority**: P0 | **Owner**: Full Stack

| Aspect | Specification |
|--------|---------------|
| Customer View | Upcoming/past tabs; color-coded by status (confirmed, completed, cancelled, no-show) |
| Actions | Reschedule (select new slot), cancel (with reason selection), rebook same service |
| Reminders | Push + SMS 24 hours, 2 hours before; email confirmation on book/modify/cancel |
| Calendar Sync | Export to Apple/Google Calendar with .ics attachment |
| History | Full history with ability to review past businesses |

**Acceptance Criteria**:
- [ ] Upcoming appointments surface on app open (widget/home screen)
- [ ] Cancellation shows penalty warning if within business policy window
- [ ] Reschedule maintains original payment if price unchanged; handles difference if changed
- [ ] Push notification deep-links to appointment detail

---

### 4.9 Favorites

**Priority**: P1 | **Owner**: Frontend

| Aspect | Specification |
|--------|---------------|
| Save Action | Heart toggle on business card, detail, and map pin |
| List View | Grid of favorites with quick info; sort by name, recently added, next availability |
| Notifications | Optional: alert when favorite adds new service or has last-minute availability |
| Sync | Cross-device for logged-in users; guest favorites prompt conversion |
| Limit | None |

**Acceptance Criteria**:
- [ ] Toggle responds in < 100ms (optimistic UI, sync in background)
- [ ] Offline: queue favorite action, sync on reconnect
- [ ] Unfav removes from list with undo toast (5 seconds)

---

### 4.10 User Profile

**Priority**: P1 | **Owner**: Frontend

| Aspect | Specification |
|--------|---------------|
| Sections | Personal info, payment methods, notification preferences, privacy settings |
| Avatar | Upload or generate from initials; 5MB max, cropped to circle |
| Payment | Saved cards (Stripe tokens), default tipping percentage, billing history |
| Preferences | Default search radius, preferred notification channels, accessibility settings |
| Data Export | GDPR-compliant data download request |
| Account Deletion | Self-service with 30-day grace period, confirmation required |

**Acceptance Criteria**:
- [ ] Profile completion percentage shown; prompts to complete missing info
- [ ] Payment method addition uses Stripe Elements for PCI compliance
- [ ] Deletion requires email confirmation; data purged after grace period

---

### 4.11 Availability & Slot Computation

**Priority**: P0 | **Owner**: Backend

| Aspect | Specification |
|--------|---------------|
| Business Hours | Weekly recurring schedule + exception dates (holidays, closures) |
| Staff Schedules | Individual availability within business hours; supports part-time, breaks |
| Slot Generation | Dynamic based on service duration, buffer time, staff assignment |
| Constraints | No double-booking; respect service-specific prep/cleanup time; block after last slot if insufficient time |
| Real-time Updates | Slot availability recalculates on every booking/cancellation; cache with 30-second TTL |
| Complex Scenarios | Multi-service booking (sequential), group bookings, room/resource allocation |

**Acceptance Criteria**:
- [ ] Slot query for single staff + single service returns in < 200ms
- [ ] Booking at 11:59 for 12:00 slot correctly blocks or allows based on business policy
- [ ] Daylight saving time transitions handled without duplicate/missing slots
- [ ] Concurrent booking requests for same slot: first succeeds, others get "Slot just taken"

---

### 4.12 Shared Types & Design System

**Priority**: P0 | **Owner**: Design/Frontend

| Aspect | Specification |
|--------|---------------|
| Design Tokens | Colors, typography, spacing, shadows in platform-agnostic format (JSON) |
| Component Library | Buttons, inputs, cards, modals, loading states, empty states, error boundaries |
| Typography | 2-font system: Display (headings) and Body; supports dynamic type |
| Color | Light/dark mode; primary brand color, semantic colors (success, warning, error, info) |
| Accessibility | WCAG 2.1 AA minimum; screen reader support, minimum touch targets 44x44dp, reduce motion |
| Icons | Custom icon set + Feather/Lucide fallback; consistent 24px grid |

**Acceptance Criteria**:
- [ ] All UI components render correctly on iOS 14+ and Android 10+
- [ ] Dark mode respects system setting, manual override in settings
- [ ] Color contrast ratio ≥ 4.5:1 for all text
- [ ] Components documented in Storybook with usage examples

---

### 4.13 Reviews & Ratings

**Priority**: P1 | **Owner**: Full Stack

| Aspect | Specification |
|--------|---------------|
| Eligibility | Verified customers only (completed appointment within past 30 days) |
| Rating | 1-5 stars, overall + optional category ratings (service, cleanliness, value, atmosphere) |
| Review Text | Optional, max 2000 characters; profanity filter |
| Photos | Up to 5 photos per review; moderation queue for inappropriate content |
| Response | Business owner can respond once; customer can update review once |
| Display | Aggregate rating, rating distribution histogram, verified badge, "helpful" count |
| Sort/Filter | Newest, highest, lowest, with photos, verified only |

**Acceptance Criteria**:
- [ ] Review prompt appears 24 hours after appointment completion (configurable)
- [ ] Unverified reviews never shown; flagged for admin review
- [ ] Business response notifies reviewer (opt-in)
- [ ] Review deletion: customer can delete own; admin can remove for TOS violation

---

### 4.14 Payment Integration

**Priority**: P0 | **Owner**: Backend

| Aspect | Specification |
|--------|---------------|
| Provider | Stripe (primary); SEPA, iDEAL, Bancontact for EU markets |
| Flow | Customer: card on file or one-time; Provider: connected account (Express/Custom) |
| Pricing | Full payment, deposit, or free booking (business-configurable) |
| Refunds | Full or partial; automated for cancellations within policy; manual for disputes |
| Receipts | Automatic email; in-app invoice download |
| Security | PCI DSS Level 1 via Stripe; no card data touches our servers |

**Acceptance Criteria**:
- [ ] Payment intent created and confirmed in < 3 seconds
- [ ] 3D Secure handled natively in-app
- [ ] Failed payment shows specific error (insufficient funds, expired card) with retry option
- [ ] Provider payout schedule visible in portal (daily/weekly/monthly)

---

### 4.15 Notifications

**Priority**: P1 | **Owner**: Backend/Frontend

| Channel | Use Cases |
|---------|-----------|
| Push | Booking confirmations, reminders, promotions, favorites availability |
| SMS | Critical: booking confirmations, same-day reminders, urgent changes |
| Email | Receipts, marketing (opt-in), account security, monthly summaries |
| In-app | Notification center with unread count; persists 90 days |

| Aspect | Specification |
|--------|---------------|
| Preferences | Granular per-channel, per-type controls; default to all on |
| Delivery | Firebase Cloud Messaging (Android), APNs (iOS); fallback to SMS for critical |
| Scheduling | Respect quiet hours (10pm-8am local time) except true emergencies |
| Deep Linking | Every notification navigates to relevant screen |

**Acceptance Criteria**:
- [ ] Push delivery rate > 95% for active devices
- [ ] Notification preference changes reflect within 5 minutes
- [ ] Unread count badge accurate across app restarts
- [ ] Rich push with images and action buttons where platform supports

---

### 4.16 Provider / Business Owner Portal

**Priority**: P0 | **Owner**: Full Stack (Web)

| Module | Features |
|--------|----------|
| Dashboard | Today's appointments, revenue this week, occupancy rate, new reviews |
| Calendar | Day/week/month views; drag-to-reschedule; color by staff/service status |
| Appointment Mgmt | View details, mark no-show, add notes, contact customer |
| Services | CRUD services, set pricing, duration, description, online booking toggle |
| Staff | Add team members, set permissions, manage individual schedules |
| Availability | Set recurring hours, add exceptions, block time off |
| Clients | CRM: view history, notes, contact info; export capability |
| Reviews | Respond to reviews, flag inappropriate, view analytics |
| Settings | Business info, payment settings, notification preferences, integrations |

**Acceptance Criteria**:
- [ ] Calendar supports concurrent bookings for multi-staff businesses
- [ ] Schedule changes sync to customer app in < 30 seconds
- [ ] Staff permissions: Owner (full), Manager (most), Staff (view own, limited edit)
- [ ] Mobile-responsive: full functionality on tablet; core actions on phone

---

### 4.17 Admin Dashboard

**Priority**: P2 | **Owner**: Full Stack (Web)

| Module | Features |
|--------|----------|
| Overview | KPIs: active users, bookings, GMV, churn, top categories |
| Business Mgmt | Onboarding pipeline, verification status, suspension, featured placement |
| User Mgmt | Search users, view activity, suspend/terminate, impersonate (audit logged) |
| Content | Review moderation queue, category management, featured content curation |
| Finance | Transaction monitoring, dispute resolution, payout tracking, refunds |
| Support | Ticket system, escalation rules, canned responses |
| System | Feature flags, rate limiting, maintenance mode, broadcast messages |

**Acceptance Criteria**:
- [ ] Role-based access control (RBAC): Super Admin, Ops, Support, Finance, Read-only
- [ ] All destructive actions require confirmation + audit log
- [ ] Data export to CSV/Excel for any list view
- [ ] Real-time alerts for anomalous patterns (spike in refunds, failed payments)

---

### 4.18 Background Jobs (BullMQ)

**Priority**: P1 | **Owner**: Backend

| Queue | Jobs | Frequency |
|-------|------|-----------|
| `notifications` | Send push, SMS, email; retry with exponential backoff | Event-driven |
| `reminders` | Schedule and trigger appointment reminders | Cron (every minute) |
| `payments` | Process payouts, handle subscription billing, retry failed charges | Daily + event-driven |
| `analytics` | Aggregate metrics, generate reports, update search index | Hourly/daily |
| `media` | Image processing (resize, compress, CDN invalidation) | Event-driven |
| `exports` | Generate user data exports, financial reports | On-demand + scheduled |
| `cleanups` | Purge old sessions, archive completed appointments, soft-delete enforcement | Daily |
| `webhooks` | Deliver to third-party integrations, retry failed deliveries | Event-driven |

**Acceptance Criteria**:
- [ ] Job failure alerts to on-call within 5 minutes
- [ ] Dead letter queue for manual inspection; auto-retry max 5 attempts
- [ ] Job idempotency: duplicate execution has no side effects
- [ ] Queue depth monitoring with auto-scaling workers
- [ ] Graceful shutdown: finish in-progress jobs before terminating

---

## 5. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | API p95 < 500ms; image load < 2s on 3G; app launch < 3s |
| Scalability | Support 10k concurrent users, 1M monthly bookings at launch architecture |
| Security | OWASP Top 10 mitigation, annual penetration test, bug bounty program |
| Compliance | GDPR (EU), CCPA (California), PCI DSS for payments |
| Reliability | 99.9% uptime SLA; scheduled maintenance < 2 hours monthly |
| Monitoring | APM (Datadog/New Relic), error tracking (Sentry), log aggregation |

## 6. Release Criteria

- [ ] All P0 features implemented and QA-passed
- [ ] Load testing passed at 2x expected peak traffic
- [ ] Security audit completed with no critical findings
- [ ] App store submissions prepared (screenshots, descriptions, compliance)
- [ ] Provider onboarding documentation complete
- [ ] Customer support playbooks ready

## 7. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Monthly Active Users (MAU) | 50K in 6 months | Analytics |
| Booking Conversion Rate | > 15% search-to-book | Funnel analysis |
| Provider NPS | > 50 | Quarterly survey |
| Customer Retention (30d) | > 40% | Cohort analysis |
| App Store Rating | > 4.5 | App Store / Play Console |
| Support Tickets / 1000 Users | < 5 | Zendesk/Intercom |

---

*Document Version: 1.0*
*Last Updated: 2024*
*Next Review: Post-MVP launch*