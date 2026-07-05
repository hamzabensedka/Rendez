# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first marketplace connecting customers with beauty, wellness, and service professionals for appointment booking. The platform serves three user segments: **Customers** (book appointments), **Providers/Business Owners** (manage schedules and services), and **Admin** (platform oversight).

---

## 2. User Personas

| Persona | Goals | Pain Points |
|---------|-------|-------------|
| **Customer** | Find, compare, and book services quickly | No visibility into real-time availability |
| **Guest** | Browse without commitment | Forced registration too early |
| **Provider** | Fill calendar, reduce no-shows | Managing bookings across channels |
| **Admin** | Monitor platform health, resolve disputes | Fraud, payment issues, content quality |

---

## 3. Feature Specifications

---

### 3.1 User Authentication
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Registration** | Email/password, Google OAuth, Apple Sign-In |
| **Login** | JWT access + refresh tokens; biometric prompt (Face ID/Touch ID) after first successful login |
| **Password Recovery** | Secure token via email, 1-hour expiry |
| **Session Management** | 30-day refresh token; revoke on logout; single-device option in settings |
| **Role Selection** | Post-registration flow asks "Book services" or "Manage my business" — can switch later |

**Acceptance Criteria:**
- [ ] User can register with email, verify via 6-digit code
- [ ] OAuth flows complete in <3 seconds after provider redirect
- [ ] Biometric login appears after first password login, can be disabled
- [ ] Token refresh is transparent to user; 401 triggers re-login
- [ ] Rate limit: 5 login attempts per 15 minutes

---

### 3.2 Guest Browse & Explore
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Access** | No account required for browsing search, business profiles, reviews, and availability |
| **Friction Points** | Prompt login only at: booking initiation, favoriting, or leaving review |
| **Guest Data** | Store search filters in localStorage; merge to account upon registration |

**Acceptance Criteria:**
- [ ] Guest sees full search results and business detail pages
- [ ] "Book" CTA triggers login modal with option to continue as guest (enter email + phone)
- [ ] Guest checkout collects minimal info; auto-creates account post-booking
- [ ] Guest session expires after 24 hours of inactivity

---

### 3.3 Business Search & Discovery
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Search Input** | Free text (business name, service, or generic term like "massage") |
| **Filters** | Service category, price range, rating (4.0+), availability today, gender of professional, accessibility |
| **Sort Options** | Relevance, distance, rating, price (low to high), availability soonest |
| **Results Display** | Card list with: thumbnail, name, rating, starting price, next available slot, distance |
| **Pagination** | Infinite scroll with 20 results per page |

**Acceptance Criteria:**
- [ ] Search returns results in <500ms for cached indexes, <2s for cold queries
- [ ] Typo tolerance: "masage" returns "massage" results
- [ ] Empty state suggests nearby alternatives and popular categories
- [ ] Active filters persist across session, clearable with one tap
- [ ] Deep link support: `/search?query=massage&location=paris&date=2024-01-15`

---

### 3.4 Map-based Search
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Map Provider** | Mapbox or Google Maps (configurable) |
| **Markers** | Clustered at zoom <12; individual pins with price or rating color coding |
| **Interaction** | Tap marker → bottom sheet preview; tap preview → full detail |
| **Geolocation** | Request on first use; fallback to IP-based city center; manual search override |
| **Radius** | Default 5km; adjustable 1-50km slider |

**Acceptance Criteria:**
- [ ] Map loads with user location dot within 3 seconds
- [ ] Pan/zoom triggers debounced re-query (300ms)
- [ ] "List view" toggle preserves current map bounds as filter
- [ ] Offline: show cached businesses in last viewed area with stale indicator
- [ ] Accessibility: screen reader announces "15 businesses visible on map"

---

### 3.5 Business Detail View
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Header** | Image carousel (max 10), business name, verified badge, overall rating, favorite CTA |
| **Tabs** | Services, Reviews, About, Availability |
| **Services Tab** | Grouped by category, collapsible; each shows duration, price, description, "Book" CTA |
| **Reviews Tab** | Sortable (newest, highest, lowest); paginated; photo reviews highlighted |
| **About Tab** | Address, hours, phone, website, amenities, staff profiles |
| **Availability Tab** | Mini calendar with next 7 days; quick-slot selection |

**Acceptance Criteria:**
- [ ] Page loads core info in <1.5s; images lazy-loaded
- [ ] "Call" and "Get directions" require one tap each
- [ ] Share button generates deep link with preview image
- [ ] If business is closed, show next opening time prominently
- [ ] Report business button for inappropriate content

---

### 3.6 Service Categories
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Hierarchy** | Category → Subcategory → Service (e.g., Hair → Coloring → Balayage) |
| **Category Examples** | Hair, Nails, Face & Skin, Massage, Fitness, Medical Aesthetics, Tattoos, Pet Services |
| **Metadata per Service** | Name, description, duration (min-max), base price, variable pricing by staff seniority |
| **Admin Control** | Categories managed via admin; providers can suggest new ones |

**Acceptance Criteria:**
- [ ] Category icons are consistent, recognizable, and accessible
- [ ] Provider can add custom service name within standard category
- [ ] Service with variable duration (e.g., "consultation") shows range, confirms exact at booking
- [ ] Inactive services hidden from browse but visible in historical bookings

---

### 3.7 Booking Flow
**Priority:** P0

| Step | Action |
|------|--------|
| 1. Select Service | From business detail or quick rebook |
| 2. Choose Provider | Any available staff, or "no preference" |
| 3. Pick Date/Time | Calendar view with available slots; consecutive slot selection for multi-service |
| 4. Add-ons | Upsell options (e.g., deep conditioning, premium products) |
| 5. Confirm Details | Review, special requests text field, cancellation policy acknowledgment |
| 6. Payment | See 3.14; option to pay in-store for supported businesses |
| 7. Confirmation | Booking reference, calendar invite, directions CTA |

**Acceptance Criteria:**
- [ ] Slot holds for 10 minutes during checkout; release on timeout or abandonment
- [ ] Concurrent booking race condition handled: first completion wins, second gets waitlist offer
- [ ] Guest checkout collects: first name, last name, email, phone
- [ ] Modify booking: change time up to 2 hours before, same service/provider
- [ ] Cancel with full refund if >24h; 50% if 2-24h; 0% if <2h (configurable per business)

---

### 3.8 Appointment Management
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Customer View** | Upcoming (chronological), Past (grouped by month); color-coded by status |
| **Statuses** | Confirmed, Pending, Checked-in, In-Progress, Completed, Cancelled, No-show |
| **Actions per Appointment** | Reschedule (if allowed), Cancel, Rebook same service, Call business, Get directions, Add to calendar |
| **Reminders** | Push + SMS at T-24h, T-2h; configurable by user |

**Acceptance Criteria:**
- [ ] Upcoming appointments surface on home screen widget
- [ ] Swipe to quick-actions on mobile; dropdown on web
- [ ] Past appointments show "Book again" with original service pre-selected
- [ ] No-show marked by provider updates customer history (affects future bookings)

---

### 3.9 Favorites
**Priority:** P1

| Aspect | Specification |
|--------|---------------|
| **Save** | Heart icon on business card and detail page |
| **List View** | Grid of favorited businesses; sort by recently added, name, or next availability |
| **Notifications** | Optional: notify when favorite has new availability or promotion |

**Acceptance Criteria:**
- [ ] Sync favorites across devices within 5 seconds
- [ ] Offline: show cached favorites with sync on reconnect
- [ ] Unfavorite with undo toast (5 seconds)
- [ ] Share favorites list as curated collection

---

### 3.10 User Profile
**Priority:** P1

| Aspect | Specification |
|--------|---------------|
| **Sections** | Personal info, Payment methods, Notifications preferences, Booking history, Favorite businesses |
| **Preferences** | Default reminder times, preferred communication channel, accessibility needs |
| **Data Export** | GDPR-compliant data download; account deletion with 30-day grace period |

**Acceptance Criteria:**
- [ ] Profile completion meter encourages adding photo, preferences
- [ ] Change email requires re-verification; change phone requires SMS code
- [ ] Account deletion shows impact (lost loyalty points, active bookings)
- [ ] Marketing opt-in separate from transactional notifications

---

### 3.11 Availability & Slot Computation
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Business Hours** | Weekly recurring schedule + exception dates (holidays, vacation) |
| **Staff Schedules** | Individual availability, breaks, time off |
| **Slot Generation** | Service duration + buffer + staff availability + existing bookings + buffer between appointments |
| **Buffer Types** | Pre-service prep, post-service cleanup, travel (for mobile services) |
| **Complex Rules** | Double-booking prevention, room/resource constraints, service chaining (e.g., color then cut) |

**Acceptance Criteria:**
- [ ] Slots compute in <200ms for 30-day window
- [ ] Real-time: booking by one user removes slot for others within 2 seconds
- [ ] Waitlist: when no slots, user joins waitlist; auto-notify on cancellation
- [ ] Bulk operations: provider can block recurring time, open extra hours
- [ ] Audit log: all schedule changes tracked with before/after state

---

### 3.12 Shared Types & Design System
**Priority:** P0 (Infrastructure)

| Aspect | Specification |
|--------|---------------|
| **Design Tokens** | Colors, typography, spacing, shadows, border-radius — in ThemeProvider |
| **Components** | Button, Input, Card, Modal, DatePicker, TimeSlot, Avatar, Badge, Skeleton, EmptyState |
| **Typography** | Inter (body), Playfair Display (headings) — web-safe fallbacks |
| **Accessibility** | WCAG 2.1 AA minimum; focus rings, aria-labels, reduced-motion support |
| **Breakpoints** | Mobile <768px, Tablet 768-1024px, Desktop >1024px |

**Acceptance Criteria:**
- [ ] All components in Storybook with usage documentation
- [ ] Dark mode supported via design tokens
- [ ] Component props typed with TypeScript; no `any`
- [ ] Color contrast ratios verified via automated testing

---

### 3.13 Reviews & Ratings
**Priority:** P1

| Aspect | Specification |
|--------|---------------|
| **Eligibility** | Only verified customers who completed appointment can review |
| **Rating Dimensions** | Overall (1-5), optional: Service quality, Ambiance, Staff professionalism, Value |
| **Content** | Text (min 20 chars), optional photos (max 5), staff attribution |
| **Moderation** | Auto-approve; flag for review if contains profanity or reported by business |
| **Response** | Business owner can reply publicly once per review |

**Acceptance Criteria:**
- [ ] Review prompt sent 2 hours post-appointment via push; email fallback at 24h
- [ ] Anonymous option: display "Verified Customer" instead of name
- [ ] Edit window: 48 hours to modify or delete own review
- [ ] Aggregate rating recalculates within 5 minutes of new review
- [ ] Reported reviews hidden pending admin review within 24 hours

---

### 3.14 Payment Integration
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Providers** | Stripe primary; Adyen for EU expansion |
| **Methods** | Cards, Apple Pay, Google Pay, PayPal, Klarna (BNPL), iDEAL, SEPA |
| **Flows** | Pay full at booking, deposit (e.g., 20%), pay in-store, or pay after service (invoice) |
| **Escrow** | Platform holds funds until service completion; release on provider check-in or 24h post-appointment |
| **Refunds** | Automated per cancellation policy; manual override by admin with audit trail |

**Acceptance Criteria:**
- [ ] PCI compliance via tokenization; never store raw card data
- [ ] 3D Secure for transactions >€30
- [ ] Payment failure retry with saved method or new method
- [ ] Receipt emailed with VAT breakdown; downloadable PDF in app
- [ ] Provider payout: weekly to linked bank account; instant payout option (fee applies)

---

### 3.15 Notifications
**Priority:** P1

| Channel | Use Cases |
|---------|-----------|
| **Push** | Booking confirmation, reminders, promotions, waitlist availability, review request |
| **SMS** | Backup for critical: booking confirmation, day-of reminder, urgent changes |
| **Email** | Receipts, account changes, marketing (opt-in), monthly summary |
| **In-App** | Bell icon with unread count; categorized by type |

**Acceptance Criteria:**
- [ ] User controls per-channel, per-type preferences
- [ ] Quiet hours: no push 22:00-08:00 local time unless emergency
- [ ] Delivery tracking: log sent/delivered/opened; retry failed channels
- [ ] Unsubscribe from marketing in one tap; transactional always allowed

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0

| Module | Features |
|--------|----------|
| **Dashboard** | Today's appointments, revenue this week, occupancy rate, new reviews |
| **Calendar** | Day/week/month views; drag-to-reschedule; block time; color by service type |
| **Services** | CRUD services, pricing tiers, duration, online booking toggle |
| **Staff** | Add team members, set permissions, manage individual schedules |
| **Bookings** | View all, filter by status, manual entry (walk-in/phone), check-in/out actions |
| **Clients** | CRM: notes, visit history, preferences, no-show count |
| **Settings** | Business hours, cancellation policy, payment methods accepted, integrations (Google Calendar, iCal) |

**Acceptance Criteria:**
- [ ] Mobile-responsive web app; native app for iOS/Android with offline queue sync
- [ ] Role-based access: Owner, Manager, Staff (restricted to own calendar)
- [ ] Multi-location support: switch context, aggregate reporting
- [ ] Export data: CSV for bookings, clients, financials
- [ ] Onboarding wizard: 5-step setup to first bookable state

---

### 3.17 Admin Dashboard
**Priority:** P1

| Module | Features |
|--------|----------|
| **User Management** | Search, view, suspend, impersonate customers and providers |
| **Business Verification** | KYC document review, site verification, badge assignment |
| **Content Moderation** | Review queue for reported businesses, reviews, images |
| **Financial Oversight** | Transaction search, refund processing, payout monitoring, dispute resolution |
| **Analytics** | MAU, booking volume, GMV, churn, top categories, geographic heatmap |
| **System Health** | Queue depth, error rates, third-party service status |
| **Communications** | Broadcast push/email to segments; manage automated templates |

**Acceptance Criteria:**
- [ ] Role-based access: Super Admin, Support Agent, Finance, Content Moderator
- [ ] All actions logged with admin identity and timestamp
- [ ] SLA alerts: respond to provider disputes within 4 hours
- [ ] Data retention: auto-archive after 2 years, purge after 7 (GDPR)

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P0 (Infrastructure)

| Queue | Jobs | Schedule/Trigger |
|-------|------|------------------|
| **notifications** | Send push, SMS, email | Event-driven or scheduled |
| **reminders** | Appointment reminders | T-24h, T-2h cron |
| **payments** | Process payout, retry failed charges, release escrow | Event-driven |
| **search-index** | Reindex business/service on change | Event-driven |
| **analytics** | Aggregate daily metrics, generate reports | Nightly cron |
| **cleanup** | Expire holds, archive old data, purge soft-deleted | Hourly cron |
| **exports** | Generate CSV/PDF for user/business download | On-demand, email on completion |

**Acceptance Criteria:**
- [ ] Jobs retry with exponential backoff (max 5 attempts)
- [ ] Dead letter queue for manual inspection after max retries
- [ ] Job progress trackable via API for long-running exports
- [ ] Priority: payment processing > notifications > analytics
- [ ] Monitoring: alert if queue depth >1000 or job age >5 minutes

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | App launch <2s; page transitions <300ms; API p95 <200ms |
| **Reliability** | 99.9% uptime; graceful degradation when third parties fail |
| **Security** | OWASP Top 10 mitigation; annual penetration test; SOC 2 Type II roadmap |
| **Compliance** | GDPR, CCPA, PCI-DSS; data residency options (EU, US) |
| **Localization** | i18n framework; launch in FR, EN, ES, DE; RTL for future |
| **Accessibility** | WCAG 2.1 AA; screen reader tested; keyboard navigable |

---

## 5. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Guest browse, Search, Business detail, Booking, Provider portal, Payments, Notifications | Month 1-3 |
| **V1.1** | Map search, Favorites, Reviews, Appointment mgmt | Month 4 |
| **V1.2** | Admin dashboard, Analytics, Background jobs optimization | Month 5 |
| **V2.0** | Multi-location, Staff management, Advanced scheduling, Marketing tools | Month 6-8 |

---

## 6. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion rate | >15% of searchers |
| Guest to registered conversion | >30% |
| Provider calendar utilization | >70% for active accounts |
| NPS (customers) | >50 |
| NPS (providers) | >40 |
| Support ticket rate | <2% of bookings |
| App store rating | >4.5 stars |

---

*Document version: 1.0 | Last updated: 2024 | Owner: Alex, Product Owner*