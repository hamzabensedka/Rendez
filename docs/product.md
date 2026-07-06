# Planity Clone — Product Specification

## 1. Product Overview

Planity Clone is a B2C2B marketplace connecting consumers with beauty/wellness businesses for appointment booking. The platform serves three user types: **Consumers** (book appointments), **Providers/Business Owners** (manage business and availability), and **Admins** (platform oversight).

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority:** P0 | **Owner:** Backend/Frontend

| Aspect | Specification |
|--------|---------------|
| Methods | Email/password, Google OAuth, Apple Sign-In |
| Flow | Registration → Email verification → Login → JWT access + refresh tokens |
| Password Security | Min 8 chars, 1 uppercase, 1 number, 1 special char; bcrypt hashing |
| Session | 7-day access token, 30-day refresh token; biometric login on mobile |
| Roles | `consumer`, `provider`, `admin` (role-based access control) |

**Acceptance Criteria:**
- [ ] User can register with email, verify via 6-digit code (expires 15 min)
- [ ] User can login with valid credentials and receive JWT pair
- [ ] User can reset password via secure email link (expires 1 hour)
- [ ] OAuth users have account linked to existing email if match exists
- [ ] Unauthenticated users receive 401 on protected endpoints with refresh attempt
- [ ] Account lockout after 5 failed attempts (30 min cooldown)

---

### 2.2 Guest Browse & Explore
**Priority:** P0 | **Owner:** Frontend

| Aspect | Specification |
|--------|---------------|
| Access | No login required for browse, search, view business profiles |
| Limitations | Booking requires authentication; favorites require login |
| Prompt | Smart prompt to login/register at booking intent moments |
| Data Persistence | Guest session ID for temporary cart (expires 24 hours) |

**Acceptance Criteria:**
- [ ] Guest can view home feed, search results, and business details
- [ ] Guest sees "Login to book" CTA replacing booking button
- [ ] Guest search filters and location preferences persist in localStorage
- [ ] Converting guest to user preserves search context and any cart items

---

### 2.3 Business Search & Discovery
**Priority:** P0 | **Owner:** Full Stack

| Aspect | Specification |
|--------|---------------|
| Search Types | Full-text (business name, service), filter-based, category browse |
| Filters | Service category, price range, rating (4+), availability (today, this week), distance, amenities |
| Sorting | Relevance, rating (highest), price (low-high), distance (nearest) |
| Results | Pagination (20/page), infinite scroll on mobile |
| Indexing | Elasticsearch/PostgreSQL full-text search with trigram for fuzzy matching |

**Acceptance Criteria:**
- [ ] Search returns results in < 200ms for 90th percentile queries
- [ ] Typo-tolerant search matches "hair cut" to "haircut"
- [ ] Active filters display as removable chips with result count update
- [ ] Empty state suggests popular categories near user location
- [ ] Search history persists (last 10 queries, clearable)

---

### 2.4 Map-based Search
**Priority:** P1 | **Owner:** Frontend/Maps Integration

| Aspect | Specification |
|--------|---------------|
| Provider | Mapbox GL JS (web), native maps (mobile) |
| Features | Clustered markers, boundary-based search, user location dot |
| Interaction | Tap marker → business card preview; tap card → detail view |
| Default View | Fit bounds to search results; remember user preference (list/map) |
| Performance | Lazy load markers; debounce map movement queries (300ms) |

**Acceptance Criteria:**
- [ ] Map initializes centered on user location (with permission) or default city
- [ ] Zooming/panning triggers new search within visible bounds
- [ ] Cluster expands to individual markers at zoom level 14+
- [ ] Business card preview shows name, rating, price from, next availability
- [ ] Map view count limited to 100 markers; overflow triggers "Show more results"

---

### 2.5 Business Detail View
**Priority:** P0 | **Owner:** Full Stack

| Section | Content |
|---------|---------|
| Header | Business name, verified badge, rating, review count, favorite toggle |
| Gallery | Carousel of images (max 10), video support (max 60 sec) |
| Info | Address, hours (today's status + full schedule), phone, website, social links |
| Services | Categorized list with description, duration, price, "Book" CTA |
| Team | Selectable staff members with specialties and ratings |
| Reviews | Aggregate rating breakdown, recent reviews with photos |
| Similar | Nearby similar businesses carousel |

**Acceptance Criteria:**
- [ ] Page loads in < 2s (Lighthouse performance score > 80)
- [ ] Deep link to any business works with proper OG tags
- [ ] "Book" on service opens booking flow with pre-selected service
- [ ] Share button generates link with UTM tracking
- [ ] Hours display in user's timezone; "Open now" / "Closes at X" / "Closed" badges

---

### 2.6 Service Categories
**Priority:** P0 | **Owner:** Backend/Frontend

| Aspect | Specification |
|--------|---------------|
| Hierarchy | Category → Subcategory → Service (3 levels max) |
| Examples | Beauty > Hair > Cut, Color, Styling; Wellness > Massage > Swedish, Deep Tissue |
| Management | Admin-defined; providers can select from catalog or request new |
| Display | Icon + color coding per category; horizontal scroll on mobile |
| SEO | Category pages crawlable with canonical URLs |

**Acceptance Criteria:**
- [ ] Homepage shows top 8 categories by booking volume in user's region
- [ ] Category selection filters search results immediately
- [ ] Category breadcrumb visible in business detail service listings
- [ ] New category requests queue to admin approval (48-hour SLA)

---

### 2.7 Booking Flow
**Priority:** P0 | **Owner:** Full Stack

| Step | Action | State |
|------|--------|-------|
| 1 | Select service(s) | Cart accumulates multiple services |
| 2 | Select staff (optional "No preference") | Filters available slots |
| 3 | Select date/time | Calendar view with available slots highlighted |
| 4 | Add notes | Optional: allergies, preferences (max 500 chars) |
| 5 | Review & confirm | Summary with cancellation policy, total price, duration |
| 6 | Payment (if required) | Stripe integration; some businesses allow pay-at-venue |
| 7 | Confirmation | Booking reference, calendar invite (.ics), add to wallet |

**Slot Display Rules:**
- Show slots in business timezone, convert to user timezone
- Minimum lead time: 2 hours (configurable per business)
- Maximum booking window: 60 days
- Buffer between bookings: 0-30 min (configurable)

**Acceptance Criteria:**
- [ ] Booking completes end-to-end in < 5 steps from service selection
- [ ] Slot calendar updates in real-time (SSE/polling) to prevent double-booking
- [ ] User receives confirmation within 5 seconds of payment success
- [ ] Failed payment holds slot for 10 minutes with retry option
- [ ] Guest checkout possible with email + phone (account creation prompt post-booking)

---

### 2.8 Appointment Management
**Priority:** P0 | **Owner:** Full Stack

| Feature | Consumer | Provider |
|---------|----------|----------|
| View | List/calendar view, filter upcoming/past/cancelled | Full schedule, staff filter, day/week view |
| Reschedule | Up to 2 hours before (configurable), same flow as booking | Drag-and-drop or modal edit |
| Cancel | With reason selection; penalty if within policy window | Immediate with optional notification to customer |
| No-show | Marked by provider, triggers notification | Log with notes |
| Reminders | Push/SMS/email at 24h, 2h, 15min (configurable) | Daily digest of next day's appointments |

**Acceptance Criteria:**
- [ ] Consumer can reschedule with 3 clicks/taps maximum
- [ ] Cancellation policy displayed clearly before confirmation
- [ ] Provider calendar syncs bidirectionally with Google/Outlook (optional)
- [ ] Appointment status transitions: `pending` → `confirmed` → `completed` / `cancelled` / `no-show`
- [ ] Push notification deep-links to appointment detail

---

### 2.9 Favorites
**Priority:** P1 | **Owner:** Frontend

| Aspect | Specification |
|--------|---------------|
| Action | Heart toggle on business card, detail page, search results |
| List | Dedicated tab with recent activity sort, notes per favorite |
| Notifications | Optional: alert for new availability, promotions from favorited businesses |
| Sync | Cross-device with account; anonymous favorites prompt login |

**Acceptance Criteria:**
- [ ] Favorite/unfavorite toggles with optimistic UI, rollback on failure
- [ ] Favorites list loads in < 1s for users with < 50 favorites
- [ ] Empty state suggests popular businesses near user
- [ ] Swipe-to-remove on mobile with undo toast (5 seconds)

---

### 2.10 User Profile
**Priority:** P1 | **Owner:** Full Stack

| Section | Content |
|---------|---------|
| Personal | Name, email, phone, photo, birthday (optional, for birthday offers) |
| Preferences | Notification settings, default search radius, currency/timezone |
| Payment | Saved payment methods (Stripe tokens), billing history |
| Activity | Booking history with reorder/rebook, review history |
| Security | Password change, 2FA option, active sessions, delete account |

**Acceptance Criteria:**
- [ ] Profile completion percentage encourages photo and preferences
- [ ] GDPR-compliant data export (JSON) and account deletion
- [ ] Phone verification required for SMS notifications
- [ ] Avatar upload with automatic compression (max 2MB, WebP conversion)

---

### 2.11 Availability & Slot Computation
**Priority:** P0 | **Owner:** Backend

| Component | Logic |
|-----------|-------|
| Business Hours | Weekly recurring schedule + exception dates (holidays, closures) |
| Staff Availability | Override business hours; vacation blocking |
| Service Duration | Fixed or range (e.g., 30-45 min for men's haircut) |
| Buffer Time | Pre/post service padding (configurable) |
| Slot Generation | Compute available start times based on above + existing bookings |
| Concurrent Bookings | Support rooms/equipment constraints |

**Algorithm Requirements:**
- Precompute daily slots for next 60 days, invalidate on change
- Cache with Redis (TTL: until end of business day + 1 hour)
- Real-time availability check at booking confirmation (pessimistic locking)

**Acceptance Criteria:**
- [ ] Slot query returns in < 100ms for single business, single day
- [ ] Booking holds slot for 10 minutes during payment
- [ ] Overbooking impossible even with concurrent requests (database constraint + application check)
- [ ] Staff vacation immediately removes affected slots

---

### 2.12 Shared Types & Design System
**Priority:** P0 | **Owner:** Frontend Lead

| Element | Specification |
|---------|---------------|
| Framework | React Native (mobile), React (web), shared component library |
| Design Tokens | Colors, typography, spacing, shadows in CSS variables/Tailwind config |
| Components | Button, Input, Card, Modal, DatePicker, TimeSlot, Calendar, Avatar, Badge, Toast |
| Accessibility | WCAG 2.1 AA; focus management, alt text, reduced motion support |
| Localization | i18n framework; initial: French, English, Spanish, German |
| Theme | Light/dark mode with system preference detection |

**Acceptance Criteria:**
- [ ] All UI components have Storybook documentation
- [ ] Component usage tracked; no duplicate custom implementations
- [ ] Design tokens consumed from single source of truth (Figma → code)
- [ ] Accessibility audit passes automated testing (axe-core)

---

### 2.13 Reviews & Ratings
**Priority:** P1 | **Owner:** Full Stack

| Aspect | Specification |
|--------|---------------|
| Eligibility | Verified customers only (post-appointment or within 7 days of completion) |
| Content | Star rating (1-5), text review (optional, max 1000 chars), photo upload (max 5) |
| Moderation | Auto-approve; flag for manual review if reported; profanity filter |
| Response | Business owner can respond once; response editable |
| Display | Aggregate score, distribution histogram, helpful/not helpful voting |

**Acceptance Criteria:**
- [ ] Review prompt sent 2 hours post-appointment via push/email
- [ ] Review appears within 5 minutes of submission
- [ ] Business average rating recalculates in real-time
- [ ] Reported reviews hidden pending admin review (24-hour SLA)
- [ ] Sort reviews by: most helpful, newest, highest/lowest rating

---

### 2.14 Payment Integration
**Priority:** P0 | **Owner:** Backend

| Aspect | Specification |
|--------|---------------|
| Provider | Stripe (primary), Adyen (future) |
| Methods | Cards (Visa, MC, Amex), Apple Pay, Google Pay, PayPal (future) |
| Flows | Pay in full, deposit + balance, pay at venue, subscription packages |
| Security | PCI DSS compliant via Stripe Elements; never touch raw card data |
| Receipts | Auto-generated PDF, emailed; available in app |
| Refunds | Full/partial via dashboard; automatic for cancellations per policy |

**Acceptance Criteria:**
- [ ] Payment intent created server-side; client confirms with Stripe.js
- [ ] 3D Secure handled for applicable cards
- [ ] Webhook handling for: payment success, failure, dispute, refund
- [ ] Failed payment notifies user with clear error and retry path
- [ ] Payout to business accounts weekly (configurable: daily, weekly, monthly)

---

### 2.15 Notifications
**Priority:** P1 | **Owner:** Backend/Frontend

| Channel | Use Cases |
|---------|-----------|
| Push (Firebase/OneSignal) | Booking reminders, confirmations, promotions, chat |
| SMS (Twilio) | Critical: verification codes, same-day appointment reminders |
| Email (SendGrid/Mailgun) | Receipts, marketing, account security, digest |
| In-App | Activity feed, system announcements |

| Feature | Specification |
|---------|---------------|
| Preferences | Granular opt-in/out per channel and notification type |
| Templates | Localized, brand-consistent, dynamic content injection |
| Scheduling | Timezone-aware; quiet hours respect (default 22:00-08:00) |
| Delivery | At-least-once delivery; deduplication by notification ID |

**Acceptance Criteria:**
- [ ] User controls all notification preferences in profile
- [ ] Marketing notifications require explicit opt-in (GDPR)
- [ ] Push token management: refresh, invalid token cleanup
- [ ] Notification analytics: delivery, open, conversion rates

---

### 2.16 Provider / Business Owner Portal
**Priority:** P0 | **Owner:** Full Stack

| Module | Features |
|--------|----------|
| Dashboard | Today's appointments, revenue summary, new reviews, quick actions |
| Calendar | Day/week/month views, staff filter, drag-to-reschedule, block time |
| Services | CRUD services, pricing, duration, description, photos, category assignment |
| Staff | Manage team members, permissions, schedules, services performed |
| Bookings | View all, filter, status update, communicate with customer |
| Clients | CRM: notes, visit history, preferences, marketing opt-in |
| Settings | Business info, hours, cancellation policy, payment methods, integrations |
| Analytics | Revenue trends, booking volume, popular services, no-show rate |

**Acceptance Criteria:**
- [ ] Portal responsive for tablet use (primary in-salon device)
- [ ] Multi-location support with location switcher
- [ ] Staff permissions: owner (full), manager (most), receptionist (bookings only)
- [ ] Data export: appointments, clients, revenue (CSV, date range)

---

### 2.17 Admin Dashboard
**Priority:** P1 | **Owner:** Backend/Frontend

| Module | Features |
|--------|----------|
| Overview | KPIs: users, bookings, revenue, active businesses, growth rate |
| Businesses | Onboarding workflow, verification status, suspension, featured placement |
| Users | Search, view profiles, impersonation for support, ban/suspend |
| Transactions | Full payment ledger, refunds, disputes, payout tracking |
| Content | Category management, featured content, promotional campaigns |
| Support | Ticket system, escalation rules, response templates |
| System | Feature flags, rate limits, global configuration, audit logs |

**Acceptance Criteria:**
- [ ] Role-based access: super admin, support agent, finance, content manager
- [ ] All destructive actions require confirmation and are logged immutably
- [ ] Search across all entities with filters
- [ ] Report generation: scheduled and on-demand (PDF/CSV export)

---

### 2.18 Background Jobs (BullMQ)
**Priority:** P0 | **Owner:** Backend

| Queue | Jobs | Priority |
|-------|------|----------|
| `notifications` | Send push/SMS/email, process delivery status | High |
| `bookings` | Slot precomputation, cleanup expired holds, no-show detection | High |
| `payments` | Process payouts, retry failed webhooks, generate reports | High |
| `search` | Reindex businesses, update search rankings | Medium |
| `analytics` | Aggregate daily metrics, compute recommendations | Medium |
| `maintenance` | Data cleanup, backup verification, log rotation | Low |

| Feature | Specification |
|---------|---------------|
| Retry | Exponential backoff, max 5 attempts, dead letter queue after |
| Monitoring | Job count, processing time, failure rate dashboards (Grafana) |
| Concurrency | Configurable workers per queue; scale horizontally |

**Acceptance Criteria:**
- [ ] All background jobs idempotent (safe to retry)
- [ ] Failed jobs visible in monitoring with full context for debugging
- [ ] Queue depth alerts at > 1000 pending jobs
- [ ] Job processing latency < 5 seconds for high priority queues (95th percentile)

---

## 3. Non-Functional Requirements

| Area | Target |
|------|--------|
| Availability | 99.9% uptime (excluding planned maintenance) |
| Performance | API p95 < 200ms; page load < 2s on 4G |
| Security | OWASP Top 10 mitigated; annual penetration test |
| Scalability | Horizontal scaling; handle 10x traffic spike |
| Compliance | GDPR, CCPA, PCI DSS; data residency options |

---

## 4. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, guest browse, search, business detail, booking flow, provider portal basics | 8 weeks |
| v1.0 | Payments, notifications, reviews, favorites, profile, admin dashboard | +4 weeks |
| v1.1 | Map search, advanced analytics, marketing tools, multi-language expansion | +6 weeks |
| v2.0 | Mobile apps, AI recommendations, subscription packages, marketplace features | +12 weeks |

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion rate | > 15% (search to completed booking) |
| Provider activation | > 80% complete profile, > 50% take first booking within 7 days |
| User retention | D7 > 40%, D30 > 25% |
| NPS | > 50 for consumers, > 40 for providers |
| Support tickets | < 2% of monthly active users |
