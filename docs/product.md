# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first platform connecting customers with beauty and wellness businesses for appointment booking. It serves three user types: customers seeking services, business owners managing their presence, and administrators overseeing the platform.

---

## 2. User Personas

| Persona | Description | core need |
|---------|-------------|-----------|
| **Customer** | Books beauty/wellness appointments | Discover, compare, and book seamlessly |
| **Business Owner** | Manages salon, clinic, or independent practice | Fill calendar, reduce no-shows, grow clientele |
| **Admin** | Platform operator | Monitor health, support users, ensure quality |

---

## 3. Features

### 3.1 User Authentication
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Registration** | Email/password, Google OAuth, Apple Sign-In |
| **Login** | JWT-based session with refresh token rotation |
| **Password Recovery** | Secure token via email, 1-hour expiry |
| **Account Linking** | Merge OAuth with existing email account |
| **Session** | 30-day refresh, biometric prompt on sensitive actions |

**Acceptance Criteria:**
- [ ] New user completes registration in < 30 seconds
- [ ] OAuth users auto-provision profile with name/email/avatar
- [ ] Duplicate email returns clear error with resolution path
- [ ] Refresh token invalidation on logout from all devices
- [ ] Rate limit: 5 login attempts per 15 minutes

---

### 3.2 Guest Browse & Explore
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Entry Point** | Unauthenticated users see curated content |
| **Browse Depth** | View categories, featured businesses, limited detail previews |
| **Friction Point** | Booking action triggers auth modal; favorites saved post-auth |
| **SEO** | Public business pages indexed, SSR for web |

**Acceptance Criteria:**
- [ ] Guest sees 20 nearest businesses without location permission (IP-based)
- [ ] "Book" CTA opens auth modal; successful auth resumes booking flow
- [ ] Deep links preserve intended destination post-authentication
- [ ] No app store rejection risk from guest functionality limitations

---

### 3.3 Business Search & Discovery
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Search Inputs** | Text query, filters (service, price, rating, availability), sort |
| **Filters** | Category, price range, rating threshold, open now, accepts online booking |
| **Sort Options** | Relevance, distance, rating, price (low-high), availability soonest |
| **Results** | Card list with photo, name, rating, price indicator, next available slot |
| **Auto-complete** | Suggest businesses, services, neighborhoods |

**Acceptance Criteria:**
- [ ] Search returns results in < 500ms for 90th percentile queries
- [ ] Empty state offers category browsing and location radius expansion
- [ ] Filter count badge updates dynamically; reset clears all
- [ ] Recent searches persist 30 days, max 10

---

### 3.4 Map-based Search
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Map Provider** | MapLibre (open) or Google Maps |
| **Clustering** | Auto-cluster at zoom levels; expand on tap |
| **Business Pins** | Color-coded by category; tap opens bottom sheet summary |
| **User Location** | Blue dot with accuracy ring; follow mode option |
| **List/Map Toggle** | Persistent across session; default from last use |

**Acceptance Criteria:**
- [ ] Map initializes to user location within 2 seconds (with permission)
- [ ] Pin tap shows business name, rating, price, and "View" CTA in bottom sheet
- [ ] Bounds change triggers debounced re-query (300ms)
- [ ] Offline: cache last viewed region, show stale data indicator

---

### 3.5 Business Detail View
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Header** | Photo carousel (max 10), business name, rating, favorite toggle |
| **Tabs** | Services, Reviews, About, Availability |
| **Services** | Grouped by category, with duration, price, description |
| **Team** | Selectable staff member; affects availability |
| **Contact** | Phone (direct dial), address (maps link), hours, social links |
| **Policies** | Cancellation terms, late arrival policy |

**Acceptance Criteria:**
- [ ] Photo swipe gesture; pinch-to-zoom on fullscreen view
- [ ] "Book" on service card pre-selects that service in booking flow
- [ ] Hours show current day highlighted; "Closed" with next open time
- [ ] Share button generates deep link with preview image

---

### 3.6 Service Categories
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Hierarchy** | Category → Subcategory → Service |
| **Examples** | Hair > Color > Balayage; Wellness > Massage > Deep Tissue |
| **Discovery** | Icon grid on home; searchable in filter |
| **Business Assignment** | Multiple categories per business; primary for discovery |

**Acceptance Criteria:**
- [ ] Category icons consistent with design system; accessible labels
- [ ] New category deploys without app update (CMS-driven)
- [ ] Uncategorized services hidden from browse, still searchable

---

### 3.7 Booking Flow
**Priority:** P0

| Step | Action | Details |
|------|--------|---------|
| 1 | Select Service | From business detail or rebooking |
| 2 | Choose Staff | "Any" option for fastest availability; per-staff pricing if applicable |
| 3 | Pick Date/Time | Calendar view with available slots; timezone from business |
| 4 | Add-ons | Upsell options (e.g., conditioning treatment) |
| 5 | Review & Confirm | Service, staff, time, price, cancellation policy |
| 6 | Payment | Saved card or new; hold for free cancellation, charge for deposit-required |
| 7 | Confirmation | Booking reference, calendar invite, directions CTA |

**Acceptance Criteria:**
- [ ] Slot selection prevents double-booking via pessimistic UI lock (5 min hold)
- [ ] Price breakdown shows subtotal, add-ons, taxes, total
- [ ] Guest checkout: collect minimal fields (name, phone, email); prompt account creation
- [ ] Modification: change time/staff up to policy cutoff; cancel with refund rules
- [ ] Flow completion rate > 60% (tracked via analytics)

---

### 3.8 Appointment Management
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Customer View** | Upcoming/past tabs; chronological sort |
| **Card Actions** | Reschedule (if policy allows), cancel, rebook, contact business |
| **Status** | Confirmed, pending payment, completed, cancelled, no-show |
| **Reminders** | Push + SMS 24h and 2h before; configurable by business |
| **Check-in** | QR code or "I'm here" button for queue management |

**Acceptance Criteria:**
- [ ] Reschedule presents same slot picker; old slot releases immediately
- [ ] Cancellation applies business policy: full refund, partial, or credit
- [ ] Past appointments prompt review after 24 hours
- [ ] Calendar sync: iCal/ICS export, Google Calendar one-tap add

---

### 3.9 Favorites
**Priority:** P1

| Aspect | Specification |
|--------|---------------|
| **Toggle** | Heart icon on business card and detail; haptic feedback |
| **List View** | Grid of favorited businesses; sort by recent, name, nearest |
| **Notifications** | Option to receive availability alerts for fully-booked favorites |
| **Sync** | Cross-device; persists on account deletion recovery (30 days) |

**Acceptance Criteria:**
- [ ] Favorite/unfavorite updates optimistically; revert on failure
- [ ] Max 500 favorites; prompt to clean up at 450
- [ ] Empty state: browse CTA with category suggestions

---

### 3.10 User Profile
**Priority:** P1

| Aspect | Specification |
|--------|---------------|
| **Fields** | Name, photo, phone, email, birthday (for offers), preferences |
| **Preferences** | Notification settings, default map view, currency, language |
| **Payment Methods** | Stripe Customer; multiple cards, default selection |
| **Privacy** | Data export (GDPR), account deletion with 7-day grace period |
| **History** | Bookings, reviews, total spent, loyalty points if applicable |

**Acceptance Criteria:**
- [ ] Profile photo: upload, crop circle, remove; max 5MB
- [ ] Phone verification via SMS for booking confirmations
- [ ] Account deletion: confirm with typed "DELETE", email notification

---

### 3.11 Availability & Slot Computation
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Business Hours** | Weekly recurring + exception dates (holidays, closures) |
| **Staff Schedules** | Individual availability, breaks, time off |
| **Slot Generation** | Based on service duration, buffer time, staff availability |
| **Constraints** | No overlap, respect min/max advance booking, same-day cutoff |
| **Optimization** | Prefer contiguous blocks; surface "next available" prominently |

**Algorithm Requirements:**
- Precompute daily slots for next 60 days; regenerate on schedule change
- Cache in Redis with 5-min TTL; stale-while-revalidate pattern
- Handle DST transitions; all times stored in UTC, displayed in business timezone

**Acceptance Criteria:**
- [ ] Slot query returns in < 200ms for single staff, < 500ms for "any staff"
- [ ] Booking hold creates temporary reservation; expire after 5 min inactivity
- [ ] Concurrent bookings: last-write-wins with notification to conflicted user
- [ ] Business can block slots manually (lunch, emergency) without deleting

---

### 3.12 Shared Types & Design System
**Priority:** P0 (enabler)

| Layer | Specification |
|-------|---------------|
| **Tokens** | Colors, typography, spacing, shadows, radii in design tokens (JSON) |
| **Components** | Button, Input, Card, Avatar, Badge, Modal, Toast, Skeleton |
| **Icons** | Lucide or custom set; 24px default, 20px compact |
| **Accessibility** | WCAG 2.1 AA; minimum 4.5:1 contrast, screen reader labels, focus states |
| **Theming** | Light/dark mode; business brand color injection (primary only) |

**Acceptance Criteria:**
- [ ] All components in Storybook with interactive states
- [ ] No hardcoded values; all via theme provider
- [ ] Dark mode respects system preference, user override persists

---

### 3.13 Reviews & Ratings
**Priority:** P1

| Aspect | Specification |
|--------|---------------|
| **Eligibility** | Verified customers only; post-appointment prompt |
| **Rating** | 1-5 stars; half-star display, whole-star input |
| **Content** | Title (optional), body, service received, staff name, date |
| **Photos** | Max 5 per review; moderation queue |
| **Business Response** | Owner can reply once; edit/delete own reply |
| **Sorting** | Most recent, highest/lowest rated, with photos |

**Acceptance Criteria:**
- [ ] Review form pre-fills service/staff from appointment
- [ ] Anonymous option: display "Verified Customer" instead of name
- [ ] Report review: flag for moderation; auto-hide after 3 reports pending review
- [ ] Aggregate rating: weighted average, recalculated nightly or on new review

---

### 3.14 Payment Integration
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Provider** | Stripe; SEPA, cards, Apple Pay, Google Pay |
| **Flows** | Pay at venue, deposit, full prepay, no-show charge |
| **Split** | Platform fee deducted; remainder to business (weekly transfer) |
| **Invoicing** | Customer receipt; business monthly statement |
| **Disputes** | Admin dashboard for chargeback handling |

**Acceptance Criteria:**
- [ ] PCI compliance via Stripe Elements; no raw card data touches servers
- [ ] 3D Secure for EU cards; fallback to standard auth
- [ ] Refund: full or partial via admin or business portal; customer notified
- [ ] Failed payment: retry once, then prompt new method; preserve booking 10 min

---

### 3.15 Notifications
**Priority:** P1

| Channel | Triggers |
|---------|----------|
| **Push** | Booking confirmed, 24h reminder, 2h reminder, promotional (opt-in) |
| **SMS** | Backup for push; required for reminders if push declined |
| **Email** | Receipt, changes, marketing (unsubscribe) |
| **In-App** | New review reply, favorite availability, system announcements |

**Acceptance Criteria:**
- [ ] Notification preferences granular per channel and type
- [ ] Deep links open correct screen; fall back to relevant tab
- [ ] Delivery tracking: mark read, unread badge, notification center history 90 days
- [ ] Rate limiting: max 3 promotional pushes per week

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0

| Module | Features |
|--------|----------|
| **Dashboard** | Today's appointments, revenue this week, upcoming week preview |
| **Calendar** | Day/week/month views; drag to reschedule; color by status |
| **Services** | CRUD services, pricing, duration, assignable staff |
| **Staff** | Add team members, set schedules, permissions (view only, manage) |
| **Bookings** | View all, filter, manual entry (walk-in, phone), block time |
| **Clients** | CRM: notes, visit history, preferences, bulk messaging |
| **Settings** | Business hours, cancellation policy, payment methods, integrations |

**Acceptance Criteria:**
- [ ] Mobile-responsive web app; native app optional P2
- [ ] Real-time calendar sync via WebSocket for new bookings
- [ ] Staff can be "independent contractor" (sees own only) or "employee" (sees all)
- [ ] Export: appointments to CSV, client list to CSV

---

### 3.17 Admin Dashboard
**Priority:** P1

| Module | Features |
|--------|----------|
| **Overview** | MAU, bookings, GMV, top businesses, churn indicators |
| **Businesses** | Onboard, verify documents, suspend, feature, analytics drill-down |
| **Users** | Search, view history, suspend, impersonate (audit log) |
| **Support** | Ticket queue, assign, internal notes, resolution tracking |
| **Finance** | Payout schedule, hold/release, dispute resolution, platform fee config |
| **Content** | Category management, featured curation, push broadcast |
| **System** | Feature flags, rate limits, maintenance mode |

**Acceptance Criteria:**
- [ ] Role-based access: super admin, finance, support, content
- [ ] All actions audit-logged; immutable, exportable
- [ ] Impersonation requires second approval for sensitive accounts
- [ ] Dashboard loads key metrics in < 2 seconds; async detail loading

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P0 (enabler)

| Queue | Jobs | Priority |
|-------|------|----------|
| **notifications** | Send push, SMS, email | Time-critical; retry 3x exponential |
| **payments** | Capture authorized payments, process refunds, payouts | Critical; manual review on fail |
| **search-index** | Update Algolia/Elasticsearch on business/service change | Standard; batched |
| **analytics** | Aggregate metrics, materialized view refresh | Low; off-peak |
| **media** | Image resize, video transcode, virus scan | Standard; progress trackable |
| **reminders** | Generate and queue notification jobs for upcoming appointments | Time-critical |
| **reports** | Generate CSV/PDF exports, email links | Low; notify on completion |
| **cleanup** | Soft-deleted data purge, old log archival, session cleanup | Lowest; idempotent |

**Acceptance Criteria:**
- [ ] Job failure alerts PagerDuty after 3 retries; dead letter queue inspectable
- [ ] Stalled job detection (< 30s heartbeat); auto-requeue or alert
- [ ] Queue depth monitoring; auto-scale workers at threshold
- [ ] Job idempotency: duplicate execution safe via idempotency keys

---

## 4. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Performance** | App launch < 2s; screen transition < 300ms; API p95 < 200ms |
| **Availability** | 99.9% uptime; maintenance windows < 1 hour monthly |
| **Security** | OWASP Top 10 mitigated; annual penetration test |
| **Privacy** | GDPR/CCPA compliant; data residency options |
| **Scalability** | Support 10,000 concurrent bookings; horizontal scaling path |

---

## 5. Analytics & Success Metrics

| Metric | Target | Tracking |
|--------|--------|----------|
| Monthly Bookings | Growth 15% MoM | Conversion funnel |
| Booking Completion Rate | > 60% | Drop-off by step |
| NPS | > 50 | Post-appointment survey |
| Business Retention | > 80% at 12 months | Cohort analysis |
| Support Tickets / 1000 Users | < 5 | Category tagging |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, search, business detail, booking, basic owner portal | 8 weeks |
| **V1.0** | Payments, notifications, reviews, favorites, admin | +6 weeks |
| **V1.5** | Map search, loyalty, advanced analytics, marketing tools | +8 weeks |
| **V2.0** | Marketplace (products), subscriptions, AI recommendations | Q2+ |

---

## 7. Open Questions

1. Geographic launch scope (country-specific payment/tax requirements)
2. White-label or single-brand strategy
3. In-house delivery vs. third-party logistics for product marketplace

---

*Document Version: 1.0*
*Last Updated: 2024*
*Owner: Product (Alex)*