# Planity Clone - Product Specification

## 1. Overview

### 1.1 Product Vision
A mobile-first platform connecting customers with local beauty, wellness, and health service providers for seamless discovery, booking, and appointment management.

### 1.2 Target Users
- **Customers**: Seeking to discover and book beauty/wellness services
- **Business Owners**: Managing appointments, staff, and availability
- **Admins**: Platform oversight and support

### 1.3 Success Metrics
- Booking conversion rate > 15%
- Search-to-booking time < 3 minutes
- Provider onboarding completion > 70%

---

## 2. Feature Specifications

### 2.1 User Authentication

**Priority**: P0 | **Effort**: Medium

| Aspect | Specification |
|--------|--------------|
| Registration | Email/password, Google OAuth, Apple Sign-In |
| Login | JWT-based with refresh token rotation |
| Password Recovery | OTP via email, 15-minute expiry |
| Session Mgmt | 30-day refresh, biometric prompt (mobile)mint |
| Role Assignment | `customer`, `provider`, `admin` (single account, multiple roles possible) |

**Acceptance Criteria**:
- [ ] User can register with email + password with validation (8+ chars, 1 uppercase, 1 number)
- [ ] OAuth flows complete in < 5 seconds
- [ ] Biometric login available on supported devices after initial setup
- [ ] Token refresh is transparent to user; expired sessions redirect to login
- [ ] Rate limiting: 5 login attempts per 15 minutes

---

### 2.2 Guest Browse & Explore

**Priority**: P0 | **Effort**: Low

| Aspect | Specification |
|--------|--------------|
| Access | Full browse without authentication |
| Limitations | Cannot book, favorite, or leave reviews |
 MLS | Persistent prompt to register at conversion points |

**Acceptance Criteria**:
- [ ] Guest sees all public business listings and details
- [ ] "Book Now" and "Add to Favorites" trigger auth modal
- [ ] Post-login, guest is redirected to intended action (deep link preservation)
- [ ] Guest search history stored locally; merged on registration

---

### 2.3 Business Search & Discovery

**Priority**: P0 | **Effort**: High

| Aspect | Specification |
|--------|--------------|
| Search Types | Full-text (business name, service), category filter, location-based |
| Filters | Distance (1-50km), price range, rating (3.5+ stars), availability ("book today"), open now |
| Sorting | Relevance, distance, rating, price (low-high) |
| Results | Card-based list with thumbnail, name, rating, price indicator, next availability |
| Pagination | Cursor-based, 20 results per page |

**Acceptance Criteria**:
- [ ] Search returns results in < 500ms for cached indices
- [ ] Typo tolerance: "nail sallon" matches "nail salon"
- [ ] Empty state suggests nearby categories or popular businesses
- [ ] Recent searches persist (last 10, deletable)
- [ ] Voice search available on mobile (OS-native)

---

### 2.4 Map-based Search

**Priority**: P0 | **Effort**: High

| Aspect | Specification |
|--------|--------------|
| Map Provider | Mapbox (cost-effective, customizable) |
| Clustering | Auto-cluster at zoom levels < 13 |
| Business Pins | Color-coded by category; tap reveals preview card |
| User Location | Real-time dot with accuracy ring; fallback to manual pin drop |
| Bounds Search | Auto-query on map pan/zoom with debounce (300ms) |

**Acceptance Criteria**:
- [ ] Map initializes to user location or last searched area
- [ ] Pin tap opens bottom sheet with business preview; swipe up for full detail
- [ ] List/map toggle preserves search state
- [ ] Offline: cached tiles for last 3 viewed areas

---

### 2.5 Business Detail View

**Priority**: P0 | **Effort**: Medium

| Section | Content |
|---------|---------|
| Hero | Image carousel (max 10), business name, category, rating, review count |
| Quick Info | Address, hours, phone, website, directions link |
| Services | Expandable list with duration, price, description |
| Team | Staff profiles with specialties and individual availability |
| Reviews | Aggregate rating, distribution chart, recent reviews |
| Similar | Horizontal scroll of related businesses |

**Acceptance Criteria**:
- [ ] Images lazy-load with blur placeholder; gallery supports pinch-zoom
- [ ] "Call" and "Get Directions" use native app intents
- [ ] Service selection initiates booking flow
- [ ] Hours display current status (Open/Closed) with next opening time
- [ ] Shareable URL with deep link support

---

### 2.6 Service Categories

**Priority**: P0 | **Effort**: Low

| Aspect | Specification |
|--------|--------------|
| Hierarchy | 2-level: Category → Subcategory (e.g., Hair → Coloring, Cutting, Styling) |
| Icons | Custom SVG per category, consistent 24px grid |
| Discovery | Horizontal scroll on home; full grid in "Browse" |
| Trending | Algorithm: booking volume (7-day) + search volume |

**Acceptance Criteria**:
- [ ] Categories configurable via CMS without app release
- [ ] New category appears within 5 minutes of CMS publish
- [ ] Category pages show subcategory filter chips
- [ ] Uncategorized services hidden from browse but searchable by name

---

### 2.7 Booking Flow

**Priority**: P0 | **Effort**: High

| Step | Action |
|------|--------|
| 1. Service Select | Choose service(s), see total duration/price |
| 2. Provider Select | Auto-assign or choose specific staff |
| 3. Date/Time | Calendar view with available slots highlighted |
| 4. Confirm | Review details, apply promo code, add notes |
| 5. Payment | Select method or pay at venue (if enabled) |
| 6. Confirmation | Booking reference, add to calendar, share |

**Acceptance Criteria**:
- [ ] Slot selection prevents double-booking (optimistic locking, 5-min hold)
- [ ] Multi-service booking chains appointments with buffer time
- [ ] Guest checkout allowed; account creation prompt post-booking
- [ ] Booking modification allowed up to 2 hours before (configurable by business)
- [ ] Cancellation with full refund if > 24h; partial (50%) if 2-24h; no refund < 2h
- [ ] Flow completes in < 60 seconds for returning users

---

### 2.8 Appointment Management

**Priority**: P0 | **Effort**: Medium

| View | Content |
|------|---------|
| Upcoming | Chronological, next 7 days highlighted, countdown to next |
| Past | Completed/cancelled, rebook button, leave review prompt |
| Detail | Full info, modify, cancel, contact provider, get directions |

**Acceptance Criteria**:
- [ ] Push notification 24h and 1h before appointment
- [ ] Reschedule presents new slot picker with same constraints
- [ ] Cancel triggers refund per policy; confirmation required
- [ ] No-show marked by provider; affects future booking privileges
- [ ] Calendar sync (Google/Apple) optional, one-tap enable

---

### 2.9 Favorites

**Priority**: P1 | **Effort**: Low

| Aspect | Specification |
|--------|--------------|
| Actions | Heart toggle from any business card or detail |
| List View | Grid with quick info, next availability badge |
| Notifications | Opt-in for "new availability" or "promotion" alerts per favorite |
| Sync | Cross-device with conflict resolution (last-write-wins) |

**Acceptance Criteria**:
- [ ] Unauthenticated: heart prompts login, then auto-saves
- [ ] Maximum 200 favorites; oldest auto-removed with warning
- [ ] Bulk edit: select multiple to remove
- [ ] Share favorites list as recommendation to contacts

---

### 2.10 User Profile

**Priority**: P1 | **Effort**: Medium

| Section | Content |
|---------|---------|
| Personal Info | Name, phone, email, profile photo (optional) |
| Preferences | Notification settings, default payment, privacy |
| Payment Methods | Saved cards (tokenized), PayPal, Apple/Google Pay |
| History | Total bookings, favorite categories, spending summary |
| Loyalty | Points/badges per provider (if program active) |

**Acceptance Criteria**:
- [ ] GDPR: full data export (JSON), account deletion with 30-day grace
- [ ] Phone verification required for bookings (SMS OTP)
- [ ] Profile completion progress bar; 80%+ for "verified" badge

---

### 2.11 Availability & Slot Computation

**Priority**: P0 | **Effort**: High

| Aspect | Specification |
|--------|--------------|
| Business Hours | Weekly schedule with exceptions (holidays, closures) |
| Staff Schedules | Individual availability, break blocks, time-off requests |
| Slot Generation | Dynamic based on service duration + buffer + staff availability |
| Buffer Rules | Default 15min between appointments; configurable 0-60min |
| Overbooking | Optional: allow X% overbooking for no-show mitigation |

**Algorithm Requirements**:
- [ ] Slots computed on-demand, cached 5 minutes
- [ ] Complex services (multi-staff, room requirements) check all constraints
- [ ] Real-time updates via WebSocket when concurrent booking occurs
- [ ] Bulk availability changes (e.g., staff sick day) invalidate and recompute

---

### 2.12 Shared Types & Design System

**Priority**: P0 | **Effort**: Medium

| Element | Specification |
|---------|--------------|
| Color System | Primary #6C5CE7, Success #00B894, Error #FF7675, Warning #FDCB6E |
| Typography | Inter (body), Playfair Display (headings), 8px base grid |
| Spacing | 4px increment scale (4, 8, 12, 16, 24, 32, 48, 64) |
| Components | Button, Input, Card, Modal, Toast, Skeleton, DatePicker |
| Dark Mode | Full support, system preference default, manual override |
| Accessibility | WCAG 2.1 AA: minimum 4.5:1 contrast, 44px touch targets, screen reader labels |

**Acceptance Criteria**:
- [ ] All components in Storybook with usage documentation
- [ ] Design tokens in JSON for cross-platform (iOS, Android, Web)
- [ ] Dark mode persists per device; respects system changes
- [ ] Reduced motion preference honored for animations

---

### 2.13 Reviews & Ratings

**Priority**: P1 | **Effort**: Medium

| Aspect | Specification |
|--------|--------------|
| Eligibility | Verified customers only (completed appointment) |
| Rating | 1-5 stars, mandatory; review text optional (min 20 chars if provided) |
| Categories | Optional: service quality, staff, ambiance, value |
| Photos | Max 5 per review, moderated |
| Response | Business owner can reply once; marked as "Owner Response" |
| Reporting | Users can flag; auto-hide after 3 reports pending review |

**Acceptance Criteria**:
- [ ] Review prompt 24h post-appointment via push + email
- [ ] Average rating weighted by recency (last 12 months prioritized)
- [ ] Editable for 30 days; deletable by user anytime
- [ ] Fake review detection: NLP + pattern analysis, manual audit queue

---

### 2.14 Payment Integration

**Priority**: P0 | **Effort**: High

| Provider | Use Case |
|----------|---------|
| Stripe | Primary: cards, wallets, BNPL |
| PayPal | Alternative for user preference |
| Platform | Hold funds, payout to providers (weekly or on-demand) |

| Feature | Specification |
|---------|--------------|
| Deposit | Optional partial payment (e.g., 20%) to secure booking |
| Full Prepay | Required for promotional pricing or high-demand providers |
| At Venue | Cash/card terminal; provider confirms collection |
| Refunds | Automated per cancellation policy; manual override by support |

**Acceptance Criteria**:
- [ ] PCI compliance via Stripe Elements (no raw card data)
- [ ] 3D Secure for EU transactions; SCA compliant
- [ ] Failed payment: 3 retry attempts with user notification
- [ ] Receipt emailed and in-app; downloadable PDF
- [ ] Provider payout dashboard with transaction history

---

### 2.15 Notifications

**Priority**: P1 | **Effort**: Medium

| Channel | Triggers |
|---------|---------|
| Push | Booking confirmed, 24h/1h reminder, promotion, message |
| SMS | Booking confirmation, urgent changes, 1h reminder |
| Email | Receipt, review request, account security, marketing (opt-in) |
| In-App | Activity feed, unread count badge |

**Acceptance Criteria**:
- [ ] Granular preferences: per-channel, per-event type
- [ ] Quiet hours (default 22:00-08:00); urgent overrides
- [ ] Delivery tracking: retry failed pushes, fallback to SMS/email
- [ ] Rich push with deep links to relevant screen

---

### 2.16 Provider / Business Owner Portal

**Priority**: P0 | **Effort**: High

| Module | Features |
|--------|---------|
| Dashboard | Today's appointments, revenue (day/week/month), occupancy rate |
| Calendar | Day/week/month views, drag-drop reschedule, block time |
| Services | CRUD with pricing, duration, description, online booking toggle |
| Staff | Profiles, permissions (view/edit/all), individual schedules |
| Clients | CRM: notes, visit history, preferences, marketing tags |
| Bookings | All appointments, filter by status, export to CSV |
| Settings | Business hours, cancellation policy, payment methods, integrations |
| Analytics | Booking trends, no-show rate, revenue by service/staff, peak times |

**Acceptance Criteria**:
- [ ] Mobile-responsive web app; native app companion Q2
- [ ] Multi-location support with role-based access (owner/manager/staff)
- [ ] Real-time sync: provider calendar updates reflect in customer search instantly
- [ ] Bulk actions: mark multiple no-shows, send mass messages

---

### 2.17 Admin Dashboard

**Priority**: P1 | **Effort**: Medium

| Module | Features |
|--------|---------|
| User Mgmt | Search, suspend, impersonate, data export |
| Business Onboarding | Review applications, verify documents, approve/reject |
| Content Moderation | Review queue for reported content, bulk actions |
| Financial | Transaction monitoring, dispute resolution, payout scheduling |
| Analytics | MAU, booking volume, GMV, churn, cohort retention |
| System Health | API latency, error rates, queue depths, alerts |

**Acceptance Criteria**:
- [ ] Role-based access: super admin, support agent, finance, ops
- [ ] Audit log: all admin actions with before/after state
- [ ] SLA: critical issues escalated in < 5 minutes

---

### 2.18 Background Jobs (BullMQ)

**Priority**: P0 | **Effort**: Medium

| Queue | Jobs | Priority |
|-------|------|----------|
| `notifications` | Send push/SMS/email, retry with backoff | High |
| `payments` | Process charges, refunds, payout batches | Critical |
| `search-index` | Update Algolia/Elasticsearch indices | Medium |
| `analytics` | Aggregate events, generate reports | Low |
| `maintenance` | Data cleanup, archive old records, backups | Lowest |

| Feature | Specification |
|---------|--------------|
| Retry | Exponential backoff, max 5 attempts, dead letter queue |
| Monitoring | Dashboard: queue depth, processing rate, failed jobs |
| Concurrency | Configurable per worker; priority lanes |

**Acceptance Criteria**:
- [ ] Job failure alerts via PagerDuty within 1 minute
- [ ] Manual retry and inspection of failed jobs
- [ ] Graceful shutdown: finish current jobs before terminating
- [ ] Job idempotency: duplicate execution has no side effects

---

## 3. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | App launch < 2s; screen transition < 300ms; API p95 < 200ms |
| Availability | 99.9% uptime; scheduled maintenance windows announced |
| Security | OWASP Top 10 mitigation, dependency scanning, annual penetration test |
| Scalability | Auto-scale at 70% CPU; handle 10x traffic spike |
| Compliance | GDPR, CCPA, PCI-DSS Level 1 |

---

## 4. Release Phases

| Phase | Features | Timeline |
|-------|---------|---------|
| MVP | Auth, Guest Browse, Search, Business Detail, Booking, Provider Portal | Month 1-2 |
| V1.1 | Payments, Notifications, Reviews, Favorites | Month 3 |
| V1.2 | Map Search, Calendar Sync, Loyalty | Month 4 |
| V2.0 | Admin Dashboard, Analytics, Background Jobs optimization | Month 5-6 |

---

*Document Version: 1.0 | Last Updated: 2024 | Owner: Alex, Product Owner*