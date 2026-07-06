# Planity Clone — Product Specification

## 1. Overview

A mobile-first marketplace connecting customers with local service businesses (salons, barbershops, spas, clinics). Customers discover, book, and pay for appointments. Businesses manage their calendar, services, and client base.

**Target Platforms:** iOS, Android, Web (responsive)
**Monetization:** Commission per booking + SaaS subscription for businesses

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority:** P0 | **Owner:** Engineering

| Aspect | Specification |
|--------|---------------|
| **Registration** | Email/password, Google OAuth, Apple Sign-In |
| **Login** | JWT access + refresh tokens; biometric option (Face ID/Touch ID) |
| **Password Recovery** | Email OTP with 15-min expiry |
| **Account States** | Active, Suspended, Pending Verification |
| **Security** | Rate limiting (5 attempts), password complexity (8+ chars, 1 uppercase, 1 number) |

**Acceptance Criteria:**
- [ ] New user completes registration in < 30 seconds
- [ ] Token refresh is seamless (no re-login for 30 days)
- [ ] Biometric prompt appears after first successful password login
- [ ] Suspended accounts receive clear error message with support contact

---

### 2.2 Guest Browse & Explore
**Priority:** P0 | **Owner:** Product

| Aspect | Specification |
|--------|---------------|
| **Access** | No account required for browsing search results and business profiles |
| **Limitations** | Booking, favorites, and reviews require authentication |
| **CTA Placement** | Persistent "Book" buttons trigger login modal; dismissible "Join to unlock" banner |
| **Data Capture** | Store search history locally; prompt account creation after 3 searches |

**Acceptance Criteria:**
- [ ] Guest user sees full search results without login friction
- [ ] Login prompt appears only on high-intent actions (book, save, review)
- [ ] Post-login, guest session data (search history, selected slot) persists

---

### 2.3 Business Search & Discovery
**Priority:** P0 | **Owner:** Product

| Aspect | Specification |
|--------|---------------|
| **Search Inputs** | Free text (business name, service, staff name), filters (price, rating, distance, open now) |
| **Results Display** | Vertical list with card: photo, name, rating, distance, starting price, next available slot |
| **Sorting** | Relevance (default), distance, rating, price (low to high) |
| **Pagination** | Infinite scroll, 20 results per fetch |
| **Auto-complete** | Suggestions after 2 characters; recent searches + trending |

**Acceptance Criteria:**
- [ ] Search returns results in < 500ms for cached queries
- [ ] Empty state suggests nearby popular businesses
- [ ] Filter combination produces valid results or clear "No matches" state
- [ ] Tapping recent search executes query immediately

---

### 2.4 Map-based Search
**Priority:** P0 | **Owner:** Product

| Aspect | Specification |
|--------|---------------|
| **Map Provider** | Google Maps (mobile), Mapbox (web fallback) |
| **Markers** | Clustered pins; color-coded by category; selected pin expands to card |
| **Interaction** | Pan/zoom updates results; "Search this area" button after manual move |
| **User Location** | GPS with permission handling; fallback to IP geolocation |
| **List/Map Toggle** | Persistent toggle; remember user preference |

**Acceptance Criteria:**
- [ ] Map loads with user location or city center default in < 2s
- [ ] Pin tap reveals business card with 1-tap booking CTA
- [ ] Cluster breaks into individual pins at zoom level 12
- [ ] Permission denied shows manual address input with autocomplete

---

### 2.5 Business Detail View
**Priority:** P0 | **Owner:** Product

| Aspect | Specification |
|--------|---------------|
| **Header** | Photo carousel (max 10), business name, rating, review count, favorite toggle |
| **Info Section** | Address (tappable for directions), hours, phone, website, social links |
| **Services Tab** | Categorized list with duration, price, description; expandable for details |
| **Staff Tab** | Staff profiles with photos, specialties, availability |
| **Reviews Tab** | Star distribution, review list with photos, owner responses |
| **Booking CTA** | Sticky bottom bar; pre-selects service if tapped from service list |

**Acceptance Criteria:**
- [ ] Page loads in < 1.5s on 3G
- [ ] Photo gallery supports pinch-zoom and swipe
- [ ] "Call" and "Get Directions" are single-tap actions
- [ ] Hours display "Open now" / "Closes at X" / "Closed" with color coding

---

### 2.6 Service Categories
**Priority:** P0 | **Owner:** Product

| Aspect | Specification |
|--------|---------------|
| **Hierarchy** | Category > Subcategory > Service (e.g., Hair > Coloring > Balayage) |
| **Discovery** | Horizontal scroll of category icons on home; deep link to category search |
| **Business Assignment** | Businesses select from master list; can add custom services |
| **Icons** | Consistent 48x48 SVG set; themable per category |

**Acceptance Criteria:**
- [ ] Category browse shows popular subcategories first
- [ ] Custom services display "by [Business Name]" badge
- [ ] Category pages are SEO-indexable with structured data

---

### 2.7 Booking Flow
**Priority:** P0 | **Owner:** Product

| Step | Specification |
|------|---------------|
| **1. Service Selection** | Multi-select allowed; running total displayed |
| **2. Staff Selection** | "Any available" default; staff calendar shows personal availability |
| **3. Date & Time** | Calendar view with available slots; timezone from business location |
| **4. Add-ons** | Upsells (e.g., deep conditioning, product purchase) |
| **5. Review & Confirm** | Summary with edit capability; cancellation policy, estimated duration |
| **6. Payment** | Stored cards or new payment method; hold vs. immediate charge per business setting |
| **7. Confirmation** | Booking reference, add-to-calendar, share, direction links |

**Acceptance Criteria:**
- [ ] Complete flow in < 5 taps after service selection
- [ ] Slot availability is real-time (no stale data > 30s)
- [ ] Double-booking prevented at payment confirmation (idempotency key)
- [ ] Guest checkout allowed with email/phone capture

---

### 2.8 Appointment Management
**Priority:** P0 | **Owner:** Product

| Aspect | Specification |
|--------|---------------|
| **Customer View** | Upcoming (chronological), Past (grouped by month), Cancelled |
| **Actions** | Reschedule (same business, new slot), Cancel (with reason selection), Rebook |
| **Modification Rules** | Configurable by business (e.g., cancel up to 24h before) |
| **No-show Policy** | Track no-shows; warn user on 3rd no-show; business can flag |

**Acceptance Criteria:**
- [ ] Reschedule shows only slots meeting business policy
- [ ] Cancellation displays refund amount and timeline clearly
- [ ] Push notification sent 24h before appointment with quick actions
- [ ] Past appointments prompt for review after 2 hours

---

### 2.9 Favorites
**Priority:** P1 | **Owner:** Product

| Aspect | Specification |
|--------|---------------|
| **Save Action** | Heart icon on business card and detail; haptic feedback on toggle |
| **List View** | Grid of saved businesses; sort by recently saved, name, or next availability |
| **Sync** | Cloud-synced; available cross-device on login |
| **Notifications** | Optional: alert when favorite has new availability or promotion |

**Acceptance Criteria:**
- [ ] Favorite/unfavorite is instant UI update with optimistic response
- [ ] Offline: queue action, sync on reconnect
- [ ] Empty state suggests nearby popular businesses

---

### 2.10 User Profile
**Priority:** P1 | **Owner:** Product

| Section | Specification |
|---------|---------------|
| **Personal Info** | Photo, name, phone, email (editable); birthday for birthday offers |
| **Payment Methods** | Stripe/PayPal vault; default payment selection |
| **Preferences** | Notification settings (push, email, SMS), default search radius, language |
| **History** | Total bookings, favorite categories, spending summary |
| **Account** | Change password, delete account (GDPR-compliant, 30-day grace) |

**Acceptance Criteria:**
- [ ] Profile completion meter incentivizes 100% (unlock features)
- [ ] Account deletion requires typed confirmation and password re-auth
- [ ] Data export available as JSON download

---

### 2.11 Availability & Slot Computation
**Priority:** P0 | **Owner:** Engineering

| Aspect | Specification |
|--------|---------------|
| **Business Hours** | Weekly recurring + exception dates (holidays, closures) |
| **Breaks** | Lunch, preparation, buffer between appointments (configurable) |
| **Slot Generation** | Real-time based on staff availability, service duration, existing bookings |
| **Buffer Rules** | Minimum lead time (e.g., 2 hours), max advance booking (e.g., 60 days) |
| **Optimization** | Prefer contiguous blocks, minimize gaps, respect staff skill-to-service mapping |

**Acceptance Criteria:**
- [ ] Slot query for single staff + service returns in < 200ms
- [ ] Concurrent booking requests handled with row-level locking
- [ ] Business can block emergency slots manually
- [ ] Timezone conversion accurate for cross-timezone bookings

---

### 2.12 Shared Types & Design System
**Priority:** P0 | **Owner:** Design

| Element | Specification |
|---------|---------------|
| **Typography** | Inter (body), Playfair Display (headings); 6-level scale |
| **Color System** | Primary (#6C5CE7), Secondary (#00D2D3), Semantic (Success: #00B894, Error: #D63031) |
| **Spacing** | 4px base grid; 8 standard increments |
| **Components** | Buttons (4 variants), Inputs (5 states), Cards, Modals, Skeletons, Toasts |
| **Accessibility** | WCAG 2.1 AA minimum; 44px touch targets; screen reader labels |

**Acceptance Criteria:**
- [ ] All UI components documented in Storybook with usage examples
- [ ] Dark mode supported via CSS variables
- [ ] RTL layout validated for Arabic/Hebrew markets

---

### 2.13 Reviews & Ratings
**Priority:** P1 | **Owner:** Product

| Aspect | Specification |
|--------|---------------|
| **Submission** | Post-appointment only; 1-5 stars, text (optional, min 10 chars), photo (max 5) |
| **Verification** | "Verified visit" badge for completed appointments |
| **Response** | Business owner can respond publicly; notification to reviewer |
| **Moderation** | Auto-flag profanity; manual review queue for reported content |
| **Display** | Weighted average (recent reviews weighted higher); helpful/not helpful voting |

**Acceptance Criteria:**
- [ ] User can edit review within 24 hours
- [ ] Business response is prominently displayed below review
- [ ] Reported reviews hidden pending review within 24 hours
- [ ] Aggregate rating recalculates in real-time

---

### 2.14 Payment Integration
**Priority:** P0 | **Owner:** Engineering

| Aspect | Specification |
|--------|---------------|
| **Providers** | Stripe (primary), PayPal (secondary), Apple Pay, Google Pay |
| **Flows** | Immediate charge, deposit + balance, hold + capture, subscription |
| **Split Payments** | Platform fee auto-deducted; remainder to business account (Stripe Connect) |
| **Refunds** | Full, partial, store credit; automated per cancellation policy |
| **Invoicing** | PDF receipt emailed; downloadable from app |

**Acceptance Criteria:**
- [ ] PCI compliance via tokenization; no raw card data stored
- [ ] Failed payment retries with fallback method; 3 strikes = booking cancellation
- [ ] Webhook handling for dispute, chargeback, refund events
- [ ] Multi-currency support with real-time conversion display

---

### 2.15 Notifications
**Priority:** P1 | **Owner:** Product

| Channel | Use Cases |
|---------|-----------|
| **Push** | Booking confirmation, reminders (24h, 1h), promotions, new availability |
| **Email** | Receipts, policy changes, monthly summary, re-engagement (dormant 30 days) |
| **SMS** | Critical only: same-day changes, verification codes |
| **In-app** | Booking updates, review prompts, system announcements |

**Acceptance Criteria:**
- [ ] User controls frequency and channel per notification type
- [ ] Deep links navigate to relevant screen, not just app open
- [ ] Unsubscribe honored within 24 hours
- [ ] Delivery tracking: retry logic for failed pushes

---

### 2.16 Provider / Business Owner Portal
**Priority:** P0 | **Owner:** Product

| Module | Specification |
|--------|---------------|
| **Dashboard** | Today's appointments, revenue summary, upcoming week preview |
| **Calendar** | Day/week/month views; drag-to-reschedule; color-coded by status |
| **Services** | CRUD services, pricing, duration, assignable staff |
| **Staff** | Profiles, permissions (Admin/Manager/Staff), schedule templates |
| **Clients** | CRM: notes, visit history, preferences, marketing consent |
| **Settings** | Business hours, cancellation policy, payment methods, integrations |

**Acceptance Criteria:**
- [ ] Calendar supports multi-staff view with conflict highlighting
- [ ] Staff can be deactivated (future bookings reassigned or cancelled)
- [ ] Export bookings to CSV/iCal
- [ ] Mobile-responsive for on-the-go management

---

### 2.17 Admin Dashboard
**Priority:** P1 | **Owner:** Product

| Module | Specification |
|--------|---------------|
| **Overview** | KPIs: MAU, bookings, GMV, churn, top categories |
| **Business Management** | Onboard, verify, suspend, feature/unfeature |
| **User Management** | Search, view, suspend, impersonate (audit logged) |
| **Disputes** | Booking disputes, refund requests, escalation workflow |
| **Content** | Category management, featured collections, in-app announcements |
| **Finance** | Payout schedule, transaction ledger, commission reporting |

**Acceptance Criteria:**
- [ ] Role-based access (Super Admin, Ops, Support, Finance)
- [ ] All actions audit-logged with before/after state
- [ ] Data export to BI tools (Metabase/Tableau connector)
- [ ] SLA: critical issues escalated to on-call within 15 minutes

---

### 2.18 Background Jobs (BullMQ)
**Priority:** P0 | **Owner:** Engineering

| Job Type | Specification |
|----------|---------------|
| **Reminder Notifications** | Queue 24h and 1h before appointments; retry on failure |
| **Slot Cache Warming** | Pre-compute popular business/time combinations |
| **Email Drip Campaigns** | Welcome series, re-engagement, review requests |
| **Payment Reconciliation** | Nightly sync with Stripe; flag discrepancies |
| **Data Archival** | Move bookings > 2 years to cold storage |
| **Search Indexing** | Reindex on business/service update |

**Acceptance Criteria:**
- [ ] Job failures alert via PagerDuty after 3 retries
- [ ] Dead letter queue for manual inspection
- [ ] Job scheduling idempotent (safe to re-run)
- [ ] Monitoring dashboard shows queue depth, processing rate, errors

---

## 3. Non-Functional Requirements

| Area | Target |
|------|--------|
| **Performance** | App cold start < 2s; API p95 < 200ms |
| **Availability** | 99.9% uptime; scheduled maintenance windows |
| **Security** | OWASP Top 10 mitigation; annual penetration test |
| **Compliance** | GDPR, CCPA, PCI-DSS Level 1 |
| **Localization** | EN, FR, ES, DE at launch; RTL support |

---

## 4. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion (search → book) | > 8% |
| Day-7 retention | > 30% |
| Business NPS | > 50 |
| Support tickets per 1000 bookings | < 5 |
| Payment success rate | > 98% |

---

*Document version: 1.0 | Last updated: [Date] | Owner: Alex, Product Owner*