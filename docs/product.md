# Planity Clone - Product Specification

## 1. Overview

A mobile-first platform connecting customers with beauty/wellness businesses for appointment booking. Two-sided marketplace: consumer app for discovery/booking, provider portal for business management, admin dashboard for platform oversight.

---

## 2. User Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Customer** | Seeks beauty/wellness services, values convenience | Find, compare, book appointments |
| **Guest** | Unregistered browser exploring options | Discover services without commitment |
| **Provider** | Business owner/staff managing appointments | Fill calendar, manage clients, grow revenue |
| **Admin** | Platform operator | Monitor health, support users, ensure quality |

---

## 3. Feature Specifications

### 3.1 User Authentication (P0)

**Description:** Secure identity management for all user types.

| Aspect | Specification |
|--------|---------------|
| Registration | Email/password, Google OAuth, Apple Sign-In |
| Login | JWT access + refresh tokens, biometric option (mobile) |
| Password Recovery | Email reset link, 1-hour expiry |
| Account Types | Customer, Provider, Admin (role-based) |
| Session | 30-day refresh, forced re-auth on sensitive actions |

**Acceptance Criteria:**
- [ ] New user completes registration in < 30 seconds
- [ ] Login succeeds in < 2 seconds under normal conditions
- [ ] Token refresh is transparent to user
- [ ] Biometric prompt appears after first successful password login
- [ ] Account lockout after 5 failed attempts (15-min cooldown)

---

### 3.2 Guest Browse & Explore (P0)

**Description:** Pre-auth discovery to reduce friction and drive conversion.

| Aspect | Specification |
|--------|---------------|
| Access | No account required for browse, search, view business profiles |
| Limitations | Cannot book, favorite, or leave reviews |
| Conversion Triggers | "Book" CTA prompts signup; progress saved post-registration |
| Data Persistence | Guest session stored 30 days via device ID |

**Acceptance Criteria:**
- [ ] Guest sees full search results and business profiles
- [ ] Attempting to book shows auth modal with pre-filled context
- [ ] Post-signup, guest state merges to authenticated account
- [ ] Guest can convert to customer without losing browse history

---

### 3.3 Business Search & Discovery (P0)

**Description:** Find businesses through multiple entry points.

| Aspect | Specification |
|--------|---------------|
| Search Inputs | Text query, filters (service, price, rating, distance, availability) |
| Results Display | List view with cards: photo, name, rating, distance, next available slot |
| Sorting | Relevance (default), rating, distance, price (low-high) |
| Auto-complete | Suggest businesses, services, locations as user types |
| Recent Searches | Store last 10, clearable |

**Acceptance Criteria:**
- [ ] Search returns results in < 500ms for cached queries
- [ ] Filters combine with AND logic; empty states handled gracefully
- [ ] Tapping suggestion executes search immediately
- [ ] Results update in real-time as filters change
- [ ] Empty search shows popular/nearby suggestions

---

### 3.4 Map-based Search (P0)

**Description:** Visual geographic exploration of businesses.

| Aspect | Specification |
|--------|---------------|
| Map Provider | Mapbox/Google Maps |
| Markers | Clustered at zoom out, individual pins at zoom in; color-coded by category |
| User Location | GPS dot with accuracy ring; fallback to IP geolocation |
| Interaction | Tap marker → bottom sheet preview; tap preview → full detail |
| Boundaries | Search results update to visible map area on pan/zoom end |

**Acceptance Criteria:**
- [ ] Map loads initial viewport in < 3 seconds
- [ ] Markers render smoothly at 100+ business density
- [ ] User location prompt follows platform permissions best practices
- [ ] Map/list toggle preserves search context
- [ ] Offline: show last cached viewport with stale data indicator

---

### 3.5 Business Detail View (P0)

**Description:** Comprehensive business profile driving booking decisions.

| Section | Content |
|---------|---------|
| Header | Gallery (max 10 images/videos), name, category, rating, favorite toggle |
| Info | Address, hours, phone, website, social links |
| Services | Categorized list with prices, durations, descriptions |
| Team | Staff profiles with photos, specialties, ratings |
| Reviews | Aggregate rating, distribution histogram, recent reviews |
| Availability | Next 3 available slots quick-pick; full calendar link |

**Acceptance Criteria:**
- [ ] Page loads in < 2 seconds (above-fold content)
- [ ] Image gallery supports pinch-zoom and swipe
- [ ] Tapping phone number initiates call; address opens maps app
- [ ] "Book" CTA is persistently visible
- [ ] Deep link to any business detail works from push/SMS/share

---

### 3.6 Service Categories (P0)

**Description:** Hierarchical classification for browse and filter.

| Aspect | Specification |
|--------|---------------|
| Hierarchy | Category → Subcategory → Service (3 levels) |
| Examples | Hair > Coloring > Balayage; Body > Massage > Swedish 60min |
| Attributes | Name, description, base price, duration, buffer time, staff required |
| Variants | Price/duration variants per service (e.g., junior/senior stylist) |
| Assignment | Business selects from master list; can customize price/duration |

**Acceptance Criteria:**
- [ ] Category tree loads in < 1 second
- [ ] Business can add custom service if not categorized
- [ ] Category changes propagate to search indexing within 5 minutes
- [ ] Services display with consistent iconography per category

---

### 3.7 Booking Flow (P0)

**Description:** Multi-step appointment reservation with minimal friction.

| Step | Action | Details |
|------|--------|---------|
| 1 | Select Service | From business profile or direct link; allow multiple services |
| 2 | Choose Staff | Any available, or specific staff member; show staff calendar |
| 3 | Pick Date/Time | Calendar view with available slots; timezone-aware |
| 4 | Add-ons | Upsell: products, extra time, premium options |
| 5 | Review & Confirm | Summary with cancelation policy, price breakdown |
| 6 | Payment | See 3.14; optional for pay-at-venue businesses |
| 7 | Confirmation | Booking reference, add to calendar, shareSilent notification opt-in |

**Acceptance Criteria:**
- [ ] Complete flow in < 5 steps for single-service booking
- [ ] Slot availability reflects real-time changes (pessimistic locking)
- [ ] Held slot expires after 10 minutes of inactivity
- [ ] Guest checkout supported (email + phone required)
- [ ] Booking confirmation arrives in < 5 seconds
- [ ] Retry mechanism handles payment timeout without double-booking

---

### 3.8 Appointment Management (P0)

**Description:** Lifecycle management for customer bookings.

| Feature | Specification |
|---------|---------------|
| Upcoming List | Chronological, grouped by date; pull-to-refresh |
| Detail View | All booking info, directions, contact business, reschedule/cancel |
| Reschedule | Select new slot from available; same business/service restriction |
| Cancel | Customer-initiated up to policy deadline; instant refund if prepaid |
| History | Past appointments, rebook shortcut, review prompt |
| Receipts | Invoice PDF, email copy |

**Acceptance Criteria:**
- [ ] Upcoming appointments sync across devices in < 30 seconds
- [ ] Cancelation policy displayed before confirmation; enforced automatically
- [ ] Reschedule preserves original payment; handles price differences
- [ ] Push notification 24h and 2h before appointment
- [ ] No-show flagging with post-appointment confirmation flow

---

### 3.9 Favorites (P1)

**Description:** Save businesses and services for quick access.

| Aspect | Specification |
|--------|---------------|
| Actions | Heart toggle on business card/detail; saved to account |
| Organization | Default list only; no custom lists (MVP) |
| Notifications | Opt-in: new availability, promotions from favorited businesses |
| Sync | Cross-device; survives app reinstall via account |

**Acceptance Criteria:**
- [ ] Favorite/unfavorite is instant with optimistic UI
- [ ] Favorites tab loads in < 1 second (cached, background refresh)
- [ ] Empty state prompts discovery
- [ ] Max 500 favorites per account (soft limit with warning)

---

### 3.10 User Profile (P1)

**Description:** Customer account management and preferences.

| Section | Content |
|---------|---------|
| Personal Info | Name, email, phone, profile photo, birthday (for birthday offers) |
| Preferences | Default search radius, notification settings, payment methods |
| Payment | Saved cards (tokenized), billing history, receipts |
| Privacy | Data export, account deletion (GDPR/CCPA compliant) |
| Loyalty | Points balance, tier status, history (if loyalty program active) |

**Acceptance Criteria:**
- [ ] Profile photo upload with crop/resize; max 5MB
- [ ] Phone change requires re-verification via SMS
- [ ] Account deletion initiates 30-day grace period with recovery option
- [ ] Data export (JSON) delivered within 24 hours of request

---

### 3.11 Availability & Slot Computation (P0)
 mutable
**Description:** Core engine calculating bookable time slots.

| Component | Specification |
|-----------|---------------|
| Business Hours | Weekly recurring schedule + exception dates (holidays, closures) |
| Staff Schedules | Individual availability, breaks, time-off |
| Service Duration | Fixed or variable; buffer time between appointments |
| Blocking | Existing appointments, buffer, manual blocks |
| Computation | Generate slots from (now + lead time) to (now + booking horizon) |
| Rules | No double-booking; respect staff-service competency; min/max advance notice |
| Performance | Pre-computed cache with 5-minute TTL; real-time for immediate slots |

**Acceptance Criteria:**
- [ ] Slot query for single staff returns in < 200ms
- [ ] Concurrent booking requests for same slot: first succeeds, others rejected
- [ ] Timezone handling correct for customer, business, and staff locations
- [ ] Daylight saving transitions handled without gaps/overlaps
- [ ] Cache invalidation on any schedule change within 10 seconds

---

### 3.12 Shared Types & Design System (P0)

**Description:** Consistent foundation for all client applications.

| Layer | Specification |
|-------|---------------|
| Design Tokens | Colors (primary, semantic, neutral), typography (scale, weights), spacing, radii, shadows |
| Components | Buttons, inputs, cards, lists, modals, loaders, empty states, error boundaries |
| Icons | Lucide React; custom for domain-specific concepts |
| Layout | Mobile-first; responsive breakpoints: sm 640px, md 768px, lg 1024px, xl 1280px |
| Accessibility | WCAG 2.1 AA minimum; focus management, screen reader labels, motion preferences |
| Theme | Light default; dark mode support |

**Acceptance Criteria:**
- [ ] All UI components render correctly at 200% zoom
- [ ] Color contrast ratios meet AA standard
- [ ] Component library documented in Storybook with usage examples
- [ ] No custom one-off styles; all variations via props/theme

---

### 3.13 Reviews & Ratings (P1)

**Description:** Social proof and quality feedback loop.

| Aspect | Specification |
|--------|---------------|
| Eligibility | Verified customers only; post-appointment or within 30 days |
| Rating | 1-5 stars, mandatory; review text optional, min 20 chars if provided |
| Categories | Optional: service quality, staff, ambiance, value |
| Photos | Max 5 per review; moderated for appropriateness |
| Response | Business owner can reply publicly; notification to reviewer |
| Moderation | Auto-flag profanity/spam; human review queue for disputes |
| Display | Aggregate on profile; individual reviews sortable (newest, highest, lowest) |

**Acceptance Criteria:**
- [ ] Review submission in < 3 seconds
- [ ] Editable within 24 hours; deletable by author anytime
- [ ] Business response notifies original reviewer via push/email
- [ ] Reported reviews hidden pending investigation (max 48h)
- [ ] Fake review detection: flag accounts with suspicious patterns

---

### 3.14 Payment Integration (P0)

**Description:** Secure, flexible transaction processing.

| Aspect | Specification |
|--------|---------------|
| Provider | Stripe primary; PayPal secondary |
| Methods | Cards (tokenized), Apple Pay, Google Pay, pay-at-venue |
| Flow | Customer pays full, deposit, or none (business-configured) |
| Capture | Immediate for full; authorize-hold for deposit; no-op for pay-at-venue |
| Refunds | Full or partial via admin/provider portal; auto on customer cancel within policy |
| Receipts | Email + in-app; itemized with business VAT info |
| Payouts | Stripe Connect to provider accounts; platform fee auto-deducted |

**Acceptance Criteria:**
- [ ] Payment intent creation in < 3 seconds
- [ ] 3D Secure handled without app restart
- [ ] Failed payment offers retry with alternative method
- [ ] Webhook failures retried with exponential backoff; manual reconciliation UI
- [ ] PCI compliance: no raw card data touches servers

---

### 3.15 Notifications (P1)

**Description:** Multi-channel user engagement and operational alerts.

| Type | Channels | Triggers |
|------|----------|----------|
| Transactional | Push, SMS, Email | Booking confirmed, reminder, canceled, modified |
| Marketing | Push, Email | Promotions, favorites availability, re-engagement |
| Operational | Email | Account issues, security alerts, policy updates |
| Preferences | Granular per-channel opt-out; marketing requires explicit consent |

**Acceptance Criteria:**
- [ ] Delivery receipt tracking; retry failed channels via alternate
- [ ] Quiet hours respected (22:00-08:00 local time, except emergencies)
- [ ] Deep links navigate to relevant screen
- [ ] Unsubscribe honors immediate effect
- [ ] Notification history stored 90 days in-app

---

### 3.16 Provider / Business Owner Portal (P0)

**Description:** Web-based business management dashboard.

| Module | Features |
|--------|----------|
| Dashboard | Today's appointments, revenue snapshot, quick stats |
| Calendar | Day/week/month views; drag-drop reschedule; block time |
| Appointments | Full CRUD, customer notes, status management (confirmed, no-show, completed) |
| Services | CRUD with pricing, duration, staff assignment |
| Staff | Profiles, schedules, permissions (owner/admin/staff roles) |
| Customers | CRM view, visit history, notes, marketing opt-in status |
| Settings | Business hours, booking policies, payment methods, integrations |
| Analytics | Booking volume, revenue, cancellation rate, popular services/staff |

**Acceptance Criteria:**
- [ ] Calendar supports 50+ concurrent appointments without lag
- [ ] Staff permissions enforce data access boundaries
- [ ] All changes sync to customer app in < 10 seconds
- [ ] Export reports to CSV/PDF
- [ ] Mobile-responsive for on-the-go management

---

### 3.17 Admin Dashboard (P1)

**Description:** Platform oversight and operational control.

| Module | Features |
|--------|----------|
| Overview | KPIs: users, bookings, GMV, active businesses, churn |
| Users | Search, view, suspend, impersonate (audit logged) |
| Businesses | Onboard, verify, suspend, feature, commission settings |
| Support | Ticket queue, refund approval, dispute resolution |
| Content | Category management, featured content curation |
| Finance | Transaction ledger, payout scheduling, fee structure |
| System | Webhook logs, job queue status, feature flags |

**Acceptance Criteria:**
- [ ] Dashboard data refreshes every 5 minutes; manual refresh available
- [ ] All admin actions audit-logged with before/after state
- [ ] Bulk operations (approve 100+ businesses) complete in < 30 seconds
- [ ] Role-based access: super admin, finance, support, content manager

---

### 3.18 Background Jobs (BullMQ) (P0)

**Description:** Reliable asynchronous task processing.

| Queue | Jobs | Priority |
|-------|------|----------|
| `notifications` | Send push/SMS/email; retry 3x with backoff | High |
| `payments` | Process charges, refunds, payouts; idempotent | Critical |
| `search-index` | Update Elasticsearch/Algolia on business/service changes | Medium |
| `analytics` | Aggregate metrics, generate reports | Low |
| `media` | Image/video processing, thumbnail generation | Low |
| `cleanup` | Expire holds, archive old data, GDPR deletion | Low |
| `reminders` | Appointment reminder scheduling and dispatch | High |

**Acceptance Criteria:**
- [ ] Job processing rate: 1000 jobs/minute per worker
- [ ] Failed jobs to dead-letter queue with alert; manual retry UI
- [ ] Stalled job detection and recovery
- [ ] Job progress trackable for long-running tasks (video processing)
- [ Redis-backed; horizontal scaling via worker count increase |

---

## 4. Non-Functional Requirements

| Area | Target |
|------|--------|
| Performance | P95 API response < 500ms; page load < 2s (3G) |
| Availability | 99.9% uptime; scheduled maintenance windows |
| Security | OWASP Top 10 mitigated; annual penetration test |
| Privacy | GDPR, CCPA compliant; data processing agreements |
| Scalability | Support 10M users, 100K businesses, 1M daily bookings |

---

## 5. Prioritization

| Priority | Features |
|----------|----------|
| P0 (MVP) | Auth, Guest Browse, Search, Map, Business Detail, Booking, Appointments, Availability, Payments, Provider Portal, Background Jobs, Design System |
| P1 | Favorites, Profile, Reviews, Notifications, Admin Dashboard |
| P2 | Loyalty program, Referrals, In-app messaging, AI recommendations |

---

## 6. Success Metrics

| Metric | Target |
|--------|--------|
| Guest-to-customer conversion | > 15% |
| Booking completion rate | > 70% started |
| Day-7 retention | > 30% |
| Provider calendar utilization | > 60% |
| NPS (customers) | > 50 |
| Support ticket volume | < 1% of transactions |
