# Planity Clone — Product Specification

## 1. Overview

Build a multi-platform appointment booking platform connectinglla clients discover, book, and manage appointments with local service businesses (salons, barbershops, spas, clinics). Two mobile apps (customer iOS/Android), a business owner web portal, and an admin dashboard.

---

## 2. User Personas

| Persona | Needs | Pain Points |
|---------|-------|-------------|
| **Booking Customer** | Quick booking, flexibility, reminders | Phone tag, no availability visibility |
| **Guest Browser** | Explore before committing | Forced signup friction |
| **Business Owner** | Fill calendar gaps, reduce no-shows | Manual scheduling, last-minute cancellations |
| **Admin** | Platform health, fraud detection, support | Disputes, payment issues |

---

## 3. Feature Specifications

### 3.1 User Authentication (Priority: P0)

**Goal:** Secure, frictionless access with multiple entry points.

| Story | Acceptance Criteria |
|-------|---------------------|
| Sign up with email | Email validation, password (min 8 chars, 1 uppercase, 1 number), T&Cs acceptance. Account created in `pending_email_verification` state. |
| Email verification | 6-digit code expires in 15 min. Resend available after 60 sec. Success flips `email_verified` flag. |
| Social login (Google, Apple) | OAuth 2.0 flow. Auto-link by email if exists. New accounts skip password. |
| Login | JWT access (15 min) + refresh token (7 days). Rate limit: 5 attempts / 5 min per IP. |
| Password reset | Email link expires in 1 hour. Reset invalidates all existing sessions. |
| Biometric login (mobile) | Face ID / Touch ID after initial password login. Toggle in settings. |
| Logout | Client clears tokens; server blacklists refresh token in Redis (24h TTL). |
| Delete account | 30-day grace period. GDPR data export on request. Hard delete after grace period. |

**Non-functional:** Auth service 99.9% uptime. Token refresh < 100ms.

---

### 3.2 Guest Browse & Explore (Priority: P0)

**Goal:** Convert anonymous visitors without forced signup.

| Story | Acceptance Criteria |
|-------|---------------------|
| View featured businesses | Carousel of promoted businesses, geolocated if permission granted. |
| Browse by category | Tap category → filtered list. No login required. |
| View business profile | All public info visible: services, prices, hours, reviews (read-only). |
| View service details | Description, duration, price, cancellation policy. |
| Search businesses | Text search on name, service, category. |
| **Trigger login** | Only at booking attempt. Pre-fill any collected data post-auth. |

**Analytics:** Track guest-to-signed conversion funnel.

---

### 3.3 Business Search & Discovery (Priority: P0)

**Goal:** Find the right business efficiently.

| Story | Acceptance Criteria |
|-------|---------------------|
| Text search | Debounced (300ms) search on business name, service name, category. Results in < 500ms. |
| Search history | Store last 10 searches per user, deletable. |
| Trending searches | Admin-curated or algorithmic (top volume last 7 days). |
| Autocomplete | Prefix match on business names, categories, services. Max 8 suggestions. |
| Recent searches | Tappable chips below search bar. |
| Filter by: category | Multi-select: Hair, Beauty, Wellness, Medical, Fitness, Other. |
| Filter by: price range | Min/max slider, aligned to service prices. |
| Filter by: availability | "Available today", "Available this week", specific date. |
| Filter by: rating | 4.0+, 4.5+ stars. |
| Filter by: distance | 1km, 5km, 10km, 20km, city-wide. |
| Sort by: relevance (default), distance, rating, price (low/high) | Toggle persists per session. |
| Save search | Named saved search with active filters. Push notification on new matching business. |

---

### 3.4 Map-based Search (Priority: P1)

**Goal:** Geographic discovery with context.

| Story | Acceptance Criteria |
|-------|---------------------|
| Map view toggle | List ↔ Map toggle. Default based on last user preference. |
| Current location | Blue dot with accuracy ring. Center-on-me button. |
| Business pins | Cluster at zoom < 12. Single pins at zoom ≥ 12. Pin color by category. |
| Pin tap | Bottom sheet: name, rating, price range, next availability. Tap sheet → detail view. |
| Search this area | Button appears after pan/zoom. Re-queries with new viewport bounds. |
| Directions | Deep-link to Google Maps / Apple Maps for routing. |

---

### 3.5 Business Detail View (Priority: P0)

**Goal:** Comprehensive evaluation before booking.

| Story | Acceptance Criteria |
|-------|---------------------|
| Hero gallery | Up to 10 images, swipeable, pinch-to-zoom. Video support (max 30s). |
| Business info | Name, category, address (clickable for map), phone (click-to-call), website link. |
| Rating summary | Average stars, total review count, rating distribution histogram. |
| Hours | Today’s hours highlighted. Weekly schedule expandable. "Open now" / "Closes at X" badge. |
| Services list | Grouped by category. Each: name, duration, price, description, "Book" CTA. |
| Staff list | Names, photos, specialties. Tap staff → their services + availability. |
| Reviews preview | Top 3 most helpful. "See all" → full reviews. |
| Favorite toggle | Heart icon. Syncs immediately if logged in; prompts login if guest. |
| Share | Native share sheet with deep link. |

---

### 3.6 Service Categories (Priority: P0)

**Goal:** Consistent taxonomy across platform.

| Story | Acceptance Criteria |
|-------|---------------------|
| Category hierarchy | Parent: Hair, Beauty, Wellness, Medical, Fitness, Other. Sub-categories (e.g., Hair → Cut, Color, Styling). |
| Category icons | SVG icons, color-coded. Consistent across search, filters, business profiles. |
| Category management (admin) | CRUD operations. Prevent deletion if businesses assigned. Merge capability. |
| Business category assignment | Multi-select (max 3 primary). Affects discovery and search ranking. |

---

### 3.7 Booking Flow (Priority: P0)

**Goal:** Complete reservation in < 60 seconds.

| Step | Acceptance Criteria |
|------|---------------------|
| 1. Select service | From business profile. Multi-service booking supported (sequential slots). |
| 2. Select staff (optional) | "Any available" default. Show staff availability calendar. |
| 3. Select date | Calendar view. Disabled past dates, business closed days. |
| 4. Select time slot | Grid of available slots. Slot computation (see §3.11). Gray out if < booking lead time (e.g., 2 hours). |
| 5. Review & confirm | Service, staff, date/time, price summary, cancellation policy, business address. Editable. |
| 6. Payment (if required) | See §3.14. "Pay at venue" option if business allows. |
| 7. Confirmation | Screen with booking reference, add-to-calendar, share. Push + email confirmation. |

**Edge cases:** Slot taken during flow → real-time validation at confirm, offer next 3 available. Business goes offline → graceful error with retry.

---

### 3.8 Appointment Management (Priority: P0)

**Goal:** Full lifecycle control for customers.

| Story | Acceptance Criteria |
|-------|---------------------|
| View appointments | Upcoming / Past / Cancelled tabs. Sort upcoming by date ascending. |
| Appointment detail | All booking info, QR code for check-in, directions, contact business. |
| Reschedule | Select new slot from available. Same service/staff or change allowed. Old slot released immediately. |
| Cancel | Button visible if within cancellation window. Reason capture (optional). Refund per policy. |
| No-show marking | Business can mark; affects future booking restrictions (3 strikes = 6-month block). |
| Rebook | One-tap rebook same service/staff from past appointment. |
| Add to calendar | iCal / Google Calendar integration. |

---

### 3.9 Favorites (Priority: P1)

| Story | Acceptance Criteria |
|-------|---------------------|
| Add/remove favorite | Heart toggle. Haptic feedback. Immediate sync. |
| Favorites list | Grid of saved businesses. Sort: recently added, alphabetical, nearest. |
| Quick actions | Book, call, get directions from list view. |
| Notifications | Push when favorite adds new service or promotion. |
| Guest behavior | Stored locally; merge to account on login with conflict resolution (latest wins). |

---

### 3.10 User Profile (Priority: P1)

| Story | Acceptance Criteria |
|-------|---------------------|
| View/edit profile | Photo, name, phone, email, birthday (for birthday offers). |
| Notification preferences | Push, email, SMS toggles per type (bookings, promotions, reminders). |
| Payment methods | See §3.14. |
| Booking history | All appointments with status, filterable by date range. |
| Addresses | Saved addresses for map search defaults. |
| Referral code | Unique code, shareable. Track credits. |
| Help & support | FAQ, chat support, report issue. |

---

### 3.11 Availability & Slot Computation (Priority: P0)

**Goal:** Accurate, real-time slot availability.

| Component | Specification |
|-----------|---------------|
| Business hours | Weekly recurring schedule + exception dates (holidays, closures). |
| Service duration | Fixed or variable (e.g., 30-60 min with price adjustment). |
| Staff assignment | Service-staff matrix. Some services require specific staff. |
| Buffer time | Pre/post appointment buffers (e.g., 15 min cleaning). |
| Existing bookings | Block scheduled slots. Pessimistic locking during booking flow. |
| Slot generation | Compute available start times in 15-min increments. Respect all constraints. |
| Real-time updates | WebSocket push when slot taken/released. Poll fallback every 30 sec. |
| Lead time | Minimum advance booking (business configurable: 0-48 hours). |
| Max advance | Default 60 days, business configurable. |
| Concurrent bookings | Single-staff: sequential only. Multi-staff businesses: parallel if resources allow. |

**Algorithm:** Generate candidate slots from business hours → subtract blocked times (bookings, breaks, buffers) → filter by staff availability → filter by lead/max advance → return.

---

### 3.12 Shared Types & Design System (Priority: P0)

| Element | Specification |
|---------|-------------|
| Typography | Inter (body), Playfair Display (headings). Scale: 12/14/16/20/24/32/48px. |
| Color palette | Primary: #6C5CE7 (purple). Success: #00B894. Error: #D63031. Warning: #FDCB6E. Neutral grays: #2D3436 to #DFE6E9. |
| Spacing | 4px base grid. Standard: 8/16/24/32/48px. |
| Components | Buttons (filled/outline/ghost), inputs, cards, modals, bottom sheets, date picker, time grid, avatar, rating stars, badges, empty states, skeleton loaders. |
| Icons | Phosphor Icons, consistent 24px default. |
| Accessibility | Minimum 4.5:1 contrast. Touch targets 48x48dp. Screen reader labels. Dynamic type support. |
| Shared types | TypeScript definitions for: User, Business, Service, Staff, Appointment, Review, Payment, Notification. |

---

### 3.13 Reviews & Ratings (Priority: P1)

| Story | Acceptance Criteria |
|-------|---------------------|
| Eligibility to review | Post-appointment, within 30 days of service completion. One review per appointment. |
| Rating | 1-5 stars, mandatory. |
| Review text | Optional, max 1000 chars. Prohibited content filter. |
| Service tagged | Auto-associate with booked service. |
| Business reply | Owner can respond once. Marked as "Business owner". |
| Review moderation | Auto-flag: profanity, spam patterns, dispute keywords. Admin queue for manual review. |
| Report review | Users can report. 3 reports triggers auto-hide pending review. |
| Review helpfulness | Thumbs up/down. Sort by helpful by default. |
| Aggregate display | Average to 1 decimal, total count, trend (up/down last 30 days). |

---

### 3.14 Payment Integration (Priority: P0)

| Story | Acceptance Criteria |
|-------|---------------------|
| Payment methods | Stripe integration: cards (Visa, MC, Amex), Apple Pay, Google Pay. SEPA for EU. |
| Payment flows | Full prepay, deposit (fixed or %), pay at venue. Business-configurable per service. |
| Saved cards | Stripe customer + payment method. PCI compliance via Stripe Elements. |
| Strong Customer Authentication | 3D Secure triggered for applicable cards. Fallback flow for failed authentication. |
| Refunds | Full or partial via Stripe API. Automated for cancellations per policy. Manual refund tool for support. |
| Receipts | Email receipt with business VAT info if applicable. In-app receipt history. |
| Failed payment | Retry logic (3 attempts, 24h apart). Booking held for 10 min during initial attempt. |
| Payouts | Stripe Connect: business onboarding (KYB), automatic payouts to linked account (T+2). |
| Platform fee | Configurable % per transaction, deducted before payout. |
| Disputes | Webhook-driven alert. Hold funds. Evidence submission workflow. |

---

### 3.15 Notifications (Priority: P1)

| Type | Trigger | Channels |
|------|---------|----------|
| Booking confirmation | Successful booking | Push, email |
| Booking reminder | 24h, 2h before appointment | Push, SMS (opt-in) |
| Booking modification | Reschedule/cancel by either party | Push, email |
| Payment receipt | Successful payment | Email |
| Review request | 2h after appointment end | Push |
| Promotional | Marketing campaigns | Push, email (opt-in) |
| Favorites | New availability, price drop | Push |
| System | Maintenance, T&Cs updates | Email |

**Infrastructure:** Firebase Cloud Messaging (mobile), SendGrid (email), Twilio (SMS). Preference center for granular control.

---

### 3.16 Provider / Business Owner Portal (Priority: P0)

**Goal:** Self-service business management.

| Module | Features |
|--------|----------|
| Dashboard | Today's appointments, revenue this week, upcoming week preview, quick stats. |
| Calendar | Day/week/month views. Drag-to-reschedule. Color-coded by status. Block time (breaks, vacation). |
| Appointment management | View details, mark complete/no-show Fiscal, send message to customer. |
| Services | CRUD services: name, description, duration, price, category, staff assignable, online bookable toggle. |
| Staff management | Add staff (invite by email), set permissions (view only / manage own / manage all), set working hours, services performed. |
| Business settings | Profile info, photos, hours, address, booking policies (lead time, cancellation window, deposit rules). |
| Customers | CRM view: history, notes, frequency. Export (CSV). |
| Reviews | View, respond, report. Rating analytics. |
| Finances | Transaction history, payout schedule, invoice download. |
| Analytics | Booking volume, revenue, fill rate, no-show rate, top services, customer retention. Date range selector. |

**Access:** Role-based (owner, manager, staff). Audit log of all changes.

---

### 3.17 Admin Dashboard (Priority: P1)

| Module | Features |
|--------|----------|
| Overview | KPIs: active users, bookings today, GMV, businesses onboarded, support tickets. |
| User management | Search, view, suspend, impersonate. Export user data (GDPR). |
| Business management | Approve/reject applications, edit profiles, feature/unfeature, suspend. Verification status tracking. |
| Content moderation | Review queue for flagged reviews, businesses, images. Bulk actions. |
| Financial oversight | Transaction search, refund execution, payout monitoring, fee adjustment. |
| Support tickets | Assignment, SLA tracking, canned responses, escalation. |
| Marketing tools | Promo code creation, push campaign composer, email campaign (integration). |
| System health | Service status, error rates, queue depths, database performance. |
| Configuration | Feature flags, global settings, category management. |

---

### 3.18 Background Jobs (BullMQ) (Priority: P0)

| Queue | Jobs | Priority | Retry |
|-------|------|----------|-------|
| `notifications` | Send push, email, SMS | High | 3x, 5 min backoff |
| `payments` | Process charges, refunds, payouts | Critical | 5x, exponential backoff |
| `bookings` | Slot release on timeout, waitlist fulfillment | Critical | 3x |
| `emails` | Transactional emails, marketing | Medium | 3x |
| `analytics` | Aggregate metrics, report generation | Low | 2x |
| `search-index` | Update Algolia/Elasticsearch index | Medium | 3x |
| `image-processing` | Resize uploads, generate variants | Low | 2x |
| `data-exports` | GDPR exports, business reports | Low | 2x |
| `reminders` | Trigger appointment reminders at scheduled time | High | 3x |
| `webhooks` | Deliver to business systems | High | 5x, exponential |

**Monitoring:** Dead letter queue with alert. Job duration/throughput dashboards. Stalled job detection.

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | App cold start < 2s. Screen load < 1s. API response p95 < 200ms. |
| Availability | 99.9% uptime. Scheduled maintenance windows announced 48h ahead. |
| Security | OWASP Top 10 mitigation. Encryption in transit (TLS 1.3) and at rest. Regular penetration testing. |
| Scalability | Auto-scaling on CPU/memory. Handle 10x traffic spikes (Black Friday readiness). |
| Compliance | GDPR, CCPA, PCI-DSS (Level 1 service provider). |

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Guest-to-signup conversion | > 20% |
| Booking completion rate | > 85% |
| Day-7 retention | > 30% |
| NPS | > 50 |
| Business owner activation | > 70% complete profile within 48h |
| Support ticket volume | < 2% of transactions |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, guest browse, search, business detail, booking flow, appointment mgmt, basic owner portal, payments | 8 weeks |
| V1.1 | Map search, favorites, reviews, notifications, admin dashboard | 4 weeks |
| V1.2 | Advanced analytics, marketing tools, referral program, background jobs optimization | 4 weeks |

---

*Document version: 1.0 | Last updated: 2024 | Owner: Alex, Product Owner*