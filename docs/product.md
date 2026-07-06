# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first platform connecting customers with beauty/wellness businesses for appointment booking. It serves three user types: **Customers** (book appointments), **Providers** (manage business), and **Admins** (platform oversight).

---

## 2. User Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Customer** | Seeks beauty/wellness services | Discover, book, manage appointments |
| **Guest** | Unregistered browser | Explore without commitment |
| **Provider** | Business owner/manager | Manage schedule, services, clientele |
| **Admin** | Platform operator | Monitor, support, grow marketplace |

---

## 3. Feature Specifications

### 3.1 User Authentication

**Priority:** P0 — Critical Path

| Aspect | Specification |
|--------|---------------|
| **Registration Methods** | Email/password, Google OAuth, Apple Sign-In |
| **Login** | JWT-based session with refresh token rotation |
| **Password Recovery** | Secure token via email, 1-hour expiry |
| **Account States** | Active, Email-Unverified, Suspended, Deleted (soft) |
| **Role Assignment** | Customer (default), Provider (verification required), Admin (internal) |

**Acceptance Criteria:**
- [ ] User can register with email, password, first/last name, phone (optional)
- [ ] Password enforces: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
- [ ] OAuth users have verified email auto-marked
- [ ] Email verification link expires in 24 hours
- [ ] Rate limit: 5 login attempts per 15 minutes per IP
- [ ] JWT access token: 15 min expiry; refresh token: 7 days, single-use
- [ ] Users can delete account (GDPR): 30-day grace period, data anonymization option

---

### 3.2 Guest Browse & Explore

**Priority:** P0 — Conversion Funnel Entry

| Aspect | Specification |
|--------|---------------|
| **Access** | No authentication required for browse/search |
| **Limitations** | Cannot book, save favorites, or leave reviews |
| **Prompts** | Contextual CTA to register/login at conversion points |

**Acceptance Criteria:**
- [ ] Guest sees full search, discovery, and business detail views
- [ ] "Book Now" CTA triggers auth modal with return URL preserved
- [ ] Guest session data (search filters, viewed businesses) persists 7 days locally
- [ ] Post-authentication, guest data merges to authenticated account

---

### 3.3 Business Search & Discovery

**Priority:** P0 — Core Discovery

| Aspect | Specification |
|--------|---------------|
| **Search Inputs** | Free-text query, location (geo or typed), date/time intent, service category |
| **Filters** | Distance (1-50km), rating (4.0+), price range, availability today/this week, amenities, open now |
| **Sorting** | Relevance (default), distance, rating, price (low-high), most reviewed |
| **Results Display** | Card list with: image, name, rating, distance, starting price, next availability |

**Acceptance Criteria:**
- [ ] Search returns results in <500ms for 95th percentile
- [ ] Typo-tolerant search (fuzzy matching on business name, service names)
- [ ] Location auto-detects with permission; fallback to manual entry
- [ ] Empty state suggests: broader radius, different time, nearby categories
- [ ] Pagination: 20 results per page, infinite scroll on mobile
- [ ] Recent searches stored (last 10), clearable by user

---

### 3.4 Map-based Search

**Priority:** P1 — Enhanced Discovery

| Aspect | Specification |
|--------|---------------|
| **Map Provider** | Mapbox (flexible, cost-effective) or Google Maps |
| **Markers** | Clustered at zoom out; individual pins with price/rating badge |
| **Interaction** | Tap marker → bottom sheet preview; tap preview → detail view |
| **Bounds Search** | Results update on map pan/zoom with debounce (300ms) |

**Acceptance Criteria:**
- [ ] Map and list views are synchronized (same results, toggleable)
- [ ] User location dot with accuracy radius
- [ ] "Search this area" button appears after map movement
- [ ] Marker colors indicate: open (green), closing soon (orange), closed (gray)
- [ ] Accessibility: list view always available as map alternative

---

### 3.5 Business Detail View

**Priority:** P0 — Conversion Decision Point

| Section | Content |
|---------|---------|
| **Header** | Hero image carousel (max 10), business name, verified badge, rating, review count, favorite toggle |
| **Quick Actions** | Call, Directions, Share, Book |
| **Info** | Address, hours (today's status), description, amenities, languages spoken |
| **Services** | Categorized list with prices, durations, descriptions |
| **Team** | Selectable staff members with photos, specialties, ratings |
| **Reviews** | Aggregate rating, distribution histogram, recent reviews (paginated) |
| **Availability** | Inline mini-calendar showing next 3 available slots |

**Acceptance Criteria:**
- [ ] Page loads in <2s; images lazy-loaded with blur placeholder
- [ ] Deep-linkable URL: `/business/:slug/:id`
- [ ] Share generates preview image with business info
- [ ] "Add to Calendar" available post-booking
- [ ] Report business option (inappropriate content, closed, etc.)

---

### 3.6 Service Categories

**Priority:** P1 — Navigation & SEO

| Aspect | Specification |
|--------|---------------|
| **Hierarchy** | Category → Subcategory → Service (3 levels max) |
| **Examples** | Hair > Cut > Women's Cut, Men's Cut, Child's Cut |
| **Discovery** | Homepage category grid, search suggestions, trending |
| **Provider Assignment** | Services linked to categories; providers can customize names/prices |

**Acceptance Criteria:**
- [ ] Platform-managed master category list; localized names
- [ ] Providers select from master list, cannot create top-level categories
- [ ] Category pages are SEO-optimized with structured data
- [ ] Category images are consistent, rights-cleared

---

### 3.7 Booking Flow

**Priority:** P0 — Revenue Critical

**Flow Steps:**
1. **Service Selection** — Single or multiple services (cart-like)
2. **Provider Selection** — Any available, specific staff, or "no preference"
3. **Date/Time Selection** — Calendar view with available slots
4. **Confirmation** — Review details, apply promo code, add notes
5. **Payment** — See 3.14
6. **Confirmation** — Booking reference, calendar invite, directions

| Aspect | Specification |
|--------|---------------|
| **Slot Granularity** | 15-minute intervals |
| **Booking Window** | Up to 90 days advance; minimum 2 hours before |
| **Buffer Time** | Configurable by provider (e.g., 15 min between appointments) |
| **Group Bookings** | Multiple services, sequential or parallel scheduling |

**Acceptance Criteria:**
- [ ] Real-time slot availability with optimistic locking (5-min hold on selection)
- [ ] Slot expires if not confirmed; user notified with countdown
- [ ] Booking modification allowed up to 24h before (provider policy may vary)
- [ ] Cancellation with refund per provider policy (full, partial, none)
- [ ] Waitlist option when fully booked
- [ ] Guest checkout: collect minimal info (name, email, phone) with option to register post-booking

---

### 3.8 Appointment Management

**Priority:** P0 — Post-Booking Experience

**Customer View:**
- Upcoming/Past tabs
- Detail: service, provider, time, location, directions, contact, cancel/reschedule
- Add to calendar (iCal/Google/Outlook)
- Rebook same service

**Provider View:** (see 3.16)

**Acceptance Criteria:**
- [ ] Push + SMS + email reminders: 24h, 2h before
- [ ] Late arrival policy displayed (e.g., "15 min grace period")
- [ ] No-show tracking; 3 no-shows → account flag for review
- [ ] Reschedule finds next available slots, preserving original service/provider if possible

---

### 3.9 Favorites

**Priority:** P1 — Engagement/Retention

| Aspect | Specification |
|--------|---------------|
| **Actions** | Save/unsave business; optional: save specific service or provider |
| **Organization** | Default list only (MVP); folders in future |
| **Notifications** | Opt-in: new availability, promotions from favorited businesses |

**Acceptance Criteria:**
- [ ] Heart toggle on business card, detail, and search results
- [ ] Favorites sync across devices immediately
- [ ] Maximum 500 favorites per user (performance guardrail)
- [ ] Export/share favorites list

---

### 3.10 User Profile

**Priority:** P1 — Personalization

| Section | Content |
|---------|---------|
| **Personal Info** | Name, email, phone, photo, birthday (optional, for birthday offers) |
| **Preferences** | Notification settings, default search radius, preferred payment |
| **Addresses** | Home, work, other (for location suggestions) |
| **Payment Methods** | See 3.14 |
| **Privacy** | Data download, account deletion |
| **Activity** | Booking history, reviews written, favorites |

**Acceptance Criteria:**
- [ ] Profile completion percentage gamified (e.g., "Add photo for 10% complete")
- [ ] Email/phone changes require re-verification
- [ ] Data export: JSON/CSV, GDPR-compliant, delivered within 48 hours

---

### 3.11 Availability & Slot Computation

**Priority:** P0 — Technical Foundation

| Aspect | Specification |
|--------|---------------|
| **Business Hours** | Weekly recurring + exception dates (holidays, closures) |
| **Staff Schedules** | Individual hours, breaks, time off |
| **Slot Generation** | Computed on-demand from: business hours + staff schedule + existing bookings + buffers + service duration |
| **Caching** | Redis with 5-min TTL; invalidated on booking changes |

**Acceptance Criteria:**
- [ ] Slots accurate to the minute; no double-bookings possible (database constraint)
- [ ] Complex scenarios handled: multi-service sequential, parallel staff, room/resource conflicts
- [ ] Timezone-aware throughout (store UTC, display local)
- [ ] Performance: slot query for 30-day range <100ms
- [ ] Edge cases: DST transitions, leap year, cross-midnight services

---

### 3.12 Shared Types & Design System

**Priority:** P0 — Development Efficiency

| Layer | Specification |
|-------|---------------|
| **Design Tokens** | Colors, typography, spacing, shadows, radii in JSON/Tailwind |
| **Components** | Button, Input, Card, Modal, Calendar, TimeSlot, Rating, Avatar, Badge |
| **Icons** | Lucide React; consistent sizing (16/20/24/32px) |
| **Animations** | Framer Motion; subtle, purposeful, respect `prefers-reduced-motion` |

**Acceptance Criteria:**
- [ ] All UI components in Storybook with usage docs
- [ ] Dark mode support (toggle + system preference)
- [ ] WCAG 2.1 AA minimum; screen reader tested
- [ ] Mobile-first responsive; tablet optimization for provider portal
- [ ] RTL language support architecture (i18n ready)

---

### 3.13 Reviews & Ratings

**Priority:** P1 — Trust & Discovery

| Aspect | Specification |
|--------|---------------|
| **Eligibility** | Verified customers only (completed appointment) |
| **Components** | Overall rating (1-5), optional text (10-1000 chars), service rated, staff rated, date |
| **Photos** | Optional, max 5, moderated |
| **Provider Response** | Public reply to any review |
| **Moderation** | Auto-flag: profanity, spam, personal info; human review queue |

**Acceptance Criteria:**
- [ ] Review prompt: 24 hours post-appointment via push/email
- [ ] Editable for 30 days; deletable by author
- [ ] Rating contributes to sort/score after 24h (cooling period)
- [ ] Fake review detection: velocity checks, pattern analysis
- [ ] Aggregate rating recalculated with weighted recent reviews

---

### 3.14 Payment Integration

**Priority:** P0 — Revenue Collection

| Aspect | Specification |
|--------|---------------|
| **Provider** | Stripe Connect (Express/Custom accounts) |
| **Customer Methods** | Cards (Visa, MC, Amex), Apple Pay, Google Pay, PayPal (future) |
| **Models** | Pay at booking (full), deposit, pay at venue |
| **Fees** | Platform fee: 2.5% + $0.30 per transaction; provider bears Stripe fees |
| **Payouts** | Daily to provider Stripe account; manual withdrawal option |

**Acceptance Criteria:**
- [ ] PCI compliance via Stripe Elements (no raw card data touch)
- [ ] 3D Secure for applicable cards
- [ ] Failed payment: 3 retry attempts, then booking auto-cancelled
- [ ] Refunds processed through platform; provider can issue partial/full
- [ ] Invoice/receipt generated; tax calculation support (future)
- [ ] Dispute handling workflow with provider notification

---

### 3.15 Notifications

**Priority:** P1 — Engagement & Operations

| Channel | Use Cases |
|---------|-----------|
| **Push** | Booking confirmed/reminder/change, promotion, new availability |
| **SMS** | Critical: booking reminders, same-day changes, 2FA |
| **Email** | Receipts, marketing (opt-in), account security |
| **In-App** | Activity feed, system messages |

**Acceptance Criteria:**
- [ ] User controls per-channel, per-type preferences
- [ ] Quiet hours respected (default 10pm-8am, user configurable)
- [ ] Delivery tracking: opened, clicked, failed (with retry logic)
- [ ] Unsubscribe honors all channels for marketing; transactional always deliver
- [ ] Localization: content in user's app language

---

### 3.16 Provider / Business Owner Portal

**Priority:** P0 — Supply Side

**Modules:**
- **Dashboard:** Today's appointments, revenue this week, new customers
- **Calendar:** Day/week/month views; drag-to-reschedule; block time off
- **Services:** CRUD with pricing, duration, description, category assignment
- **Staff:** Manage team members, permissions, individual schedules
- **Customers:** CRM view, notes, visit history, no-show count
- **Bookings:** All appointments, filterable, exportable
- **Settings:** Business info, hours, policies (cancellation, late arrival), payment account

**Acceptance Criteria:**
- [ ] Mobile-responsive; native app experience preferred for calendar
- [ ] Real-time sync: new bookings appear without refresh (WebSocket/SSE)
- [ ] Offline mode: view cached data, queue changes for sync
- [ ] Multi-location support (future: location switcher)
- [ ] Role-based access: Owner (full), Manager (most), Staff (own schedule only)

---

### 3.17 Admin Dashboard

**Priority:** P2 — Platform Operations

| Module | Function |
|--------|----------|
| **User Management** | Search, view, suspend, impersonate login |
| **Business Onboarding** | Application review, verification, approval workflow |
| **Content Moderation** | Review reports, flagged content, business claims |
| **Analytics** | MAU, bookings, GMV, churn, top categories, geographic distribution |
| **Support** | Ticket system, refund processing, dispute resolution |
| **Configuration** | Category management, fee rates, promo codes, system announcements |

**Acceptance Criteria:**
- [ ] Role-based access: Super Admin, Support Agent, Content Moderator, Finance
- [ ] Audit log: all admin actions with before/after state
- [ ] Data export for reporting (CSV/Excel)
- [ ] SLA tracking for support tickets

---

### 3.18 Background Jobs (BullMQ)

**Priority:** P1 — Scalability

| Queue | Jobs | Priority |
|-------|------|----------|
| `notifications` | Send push/SMS/email, retry with backoff | High |
| `bookings` | Slot hold expiration, no-show processing, reminder scheduling | High |
| `payments` | Payout calculation, invoice generation, failed payment retry | High |
| `search` | Index updates, suggestion cache warming | Medium |
| `analytics` | Aggregate reports, cohort calculations | Low |
| `maintenance` | Data cleanup, old log archival, backup verification | Lowest |

**Acceptance Criteria:**
- [ ] Job idempotency: safe to retry without side effects
- [ ] Dead letter queue for failed jobs after max retries
- [ ] Monitoring: queue depth, processing rate, failure rate dashboards
- [ ] Rate limiting per provider/customer to prevent abuse
- [ ] Scheduled jobs (cron): daily reports, nightly data exports

---

## 4. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Performance** | App launch <2s; screen transitions <300ms; API p95 <200ms |
| **Availability** | 99.9% uptime; scheduled maintenance windows communicated |
| **Security** | OWASP Top 10 mitigation; annual penetration testing |
| **Privacy** | GDPR, CCPA compliant; data processing agreements |
| **Accessibility** | WCAG 2.1 AA; VoiceOver/TalkBack tested |

---

## 5. Success Metrics

| Metric | Target | Feature Area |
|--------|--------|------------|
| Guest-to-registered conversion | 15% | Auth, Guest Browse |
| Search-to-booking conversion | 8% | Search, Booking Flow |
| Booking completion rate | 85% | Booking Flow, Payments |
| Provider activation (first booking) | 70% within 30 days | Provider Portal |
| NPS | 50+ | All |
| App store rating | 4.5+ | All |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Guest Browse, Search, Business Detail, Booking, Payments, Provider Portal basics | Month 1-2 |
| **V1** | Map Search, Favorites, Reviews, Notifications, Admin Dashboard | Month 3-4 |
| **V2** | Advanced scheduling, Group bookings, Loyalty program, Analytics | Month 5-6 |

---

*Document Version: 1.0*
*Last Updated: 2024*
*Owner: Alex, Product Owner*