# Planity Clone — Product Specification

## 1. Overview

A mobile-first marketplace connecting service providers (beauty, wellness, health) with clients seeking appointments. Two-sided platform: consumer app for booking, provider portal for business management, admin dashboard for operations.

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Registration** | Email/password, Google OAuth, Apple Sign-In |
| **Login** | JWT access (15min) + refresh token (7 days) rotation |
| **Password Recovery** | Secure token via email, 1-hour expiry |
| **Phone Verification** | Optional SMS verification for booking confirmation |
| **Account States** | Active, EmailUnverified, Suspended, Deleted (soft) |

**Acceptance Criteria:**
- [ ] New user completes registration in < 30 seconds
- [ ] OAuth users auto-merge with existing email accounts
- [ ] Refresh token rotation invalidates stolen tokens
- [ ] Rate limit: 5 login attempts per 15 minutes per IP
- [ ] Account deletion initiates 30-day grace period with data export

---

### 2.2 Guest Browse & Explore
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Browse Access** | Full catalog visibility without account |
| **Friction Points** | Login required to: book, favorite, view past searches |
| **Guest Session** | Anonymous ID persisted locally; merge on registration |
| **Prompt Strategy** | Contextual login prompts at booking initiation, not on browse |

**Acceptance Criteria:**
- [ ] Guest sees identical search results as logged-in user
- [ ] Guest search history persists 7 days locally
- [ ] Converting guest to registered user preserves session data
- [ ] Login modal appears with clear value proposition ("Save this booking")

---

### 2.3 Business Search & Discovery
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Search Inputs** | Text query, current location, selected area, date filter |
| **Filters** | Category, subcategory, price range, rating (4.0+), availability today, gender of service provider, accessibility |
| **Sorting** | Relevance (default), distance, rating, price (low-high), availability soonest |
| **Results Display** | Card: thumbnail, name, rating, distance, starting price, next available slot |
| **Pagination** | Cursor-based, 20 results per page |

**Acceptance Criteria:**
- [ ] Search returns results in < 500ms for 95th percentile
- [ ] Typo tolerance: "hair saln" returns "hair salon" results
- [ ] Empty states suggest nearby alternatives or broader filters
- [ ] Recent searches persist (last 10), deletable
- [ ] "Near me" uses geolocation with fallback to IP-based city

---

### 2.4 Map-based Search
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Map Provider** | Mapbox GL JS / native maps |
| **Clustering** | Cluster markers at zoom levels > 12 |
| **Marker States** | Default, selected (business detail card), favorited (if logged in) |
| **Interaction** | Pan, zoom, tap marker → bottom sheet with preview; tap preview → full detail |
| **List/Map Toggle** | Persistent user preference per session |
| **Bounds Search** | Auto-search on map movement with debounce (500ms) |

**Acceptance Criteria:**
- [ ] Map initializes to user location or last searched area
- [ ] 100+ markers render at 60fps on mid-tier devices
- [ ] Selected business card slides up with 300ms ease-out animation
- [ ] Map search radius adapts to zoom level (min 500mawa, max 50km)
- [ ] Offline: cached tiles display with last-known business markers

---

### 2.5 Business Detail View
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Header** | Image carousel (max 10), business name, category, rating, favorite toggle |
| **Tabs** | Services, Reviews, About, Availability |
| **Services** | Grouped by category, expandable, with duration and price |
| **About** | Description, amenities, payment methods, cancellation policy, location with mini-map |
| **Staff** | Selectable service providers with photos, bios, ratings |

**Acceptance Criteria:**
- [ ] Page loads core content in < 1s; images lazy-loaded
- [ ] Image carousel supports pinch-zoom, swipe navigation
- [ ] "Book" CTA sticky at bottom, disabled if no services selected
- [ ] Share functionality generates deep link with preview image
- [ ] Report business option accessible from overflow menu

---

### 2.6 Service Categories
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Hierarchy** | Category → Subcategory → Service |
| **Examples** | Beauty > Hair > Women's Cut; Wellness > Massage > Deep Tissue |
| **Dynamic** | Admin-configurable; supports icons, descriptions, SEO slugs |
| **Discovery** | Homepage horizontal scroll of categories; category landing pages |

**Acceptance Criteria:**
- [ ] Category schema supports 3-level nesting without code changes
- [ ] Uncategorized services hidden from browse but accessible via direct link
- [ ] Category images optimized: WebP, 3 sizes via CDN
- [ ] Trending categories surface algorithmically (booking volume growth)

---

### 2.7 Booking Flow
**Priority:** P0

| Step | Action |
|------|--------|
| 1. Service Selection | Single or multiple services (cart model) |
| 2. Provider Selection | "Any available" or specific staff member |
| 3. Date/Time | Calendar view with available slots highlighted |
| 4. Confirmation | Review details, apply promo code, add notes |
| 5. Payment | Hold or charge (see Payment Integration) |
| 6. Success | Confirmation with add-to-calendar, share, directions |

**Acceptance Criteria:**
- [ ] Booking completes in < 5 steps from service selection
- [ ] Slot availability reflects real-time updates (pessimistic locking)
- [ ] Concurrent booking of same slot prevented (unique constraint + transaction)
- [ ] Guest checkout supported with email/phone capture
- [ ] Booking modification allowed up to provider's cancellation window
- [ ] Abandoned booking recovery: push notification at 15 min, email at 1 hour

---

### 2.8 Appointment Management
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **User Views** | Upcoming (sorted by date), Past, Cancelled |
| **Actions** | Reschedule (same business), Cancel with reason, Rebook, Add to calendar |
| **Status States** | Pending → Confirmed → Checked-in → Completed → No-show / Cancelled |
| **Reminders** | Push + SMS at 24h, 2h before appointment (configurable) |

**Acceptance Criteria:**
- [ ] Upcoming appointments surface on home screen widget (iOS/Android)
- [ ] Cancel/Reschedule respects provider's policy (min 24h default)
- [ ] Late cancellation applies fee per provider settings
- [ ] Past appointments prompt for review if unrated (up to 14 days)
- [ ] Series/recurring bookings: create, modify, or cancel individual instances

---

### 2.9 Favorites
**Priority:** P1

| Aspect | Specification |
|--------|---------------|
| **Collection** | Heart toggle on business cards, detail pages |
| **Organization** | Default list only (v1); folders/tags in v2 |
| **Notifications** | Optional: notify of new availability, promotions |
| **Sync** | Cross-device, immediate |

**Acceptance Criteria:**
- [ ] Favorite/unfavorite toggles with optimistic UI, rollback on failure
- [ ] Favorites list supports search and sort (recently added, alphabetical, distance)
- [ ] Empty state suggests nearby popular businesses
- [ ] Batch unfavorite with multi-select mode

---

### 2.10 User Profile
**Priority:** P1

| Aspect | Specification |
|--------|---------------|
| **Fields** | Name, photo, phone, email, birthday (for offers), preferred notification channels |
| **Privacy** | Profile visibility: public (reviews), private (default) |
| **Data** | Export all data (GDPR), delete account |
| **Preferences** | Default search radius, preferred payment method, accessibility needs |

**Acceptance Criteria:**
- [ ] Profile completion meter encourages 100% (rewards integration)
- [ ] Photo upload: crop to circle, max 5MB, auto-compress to 500KB
- [ ] Change email requires verification before activation
- [ ] Data export delivers JSON/CSV within 24 hours via email

---

### 2.11 Availability & Slot Computation
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Business Hours** | Weekly recurring + exception dates (holidays, closures) |
| **Slot Generation** | Service duration + buffer + staff availability intersected |
| **Constraints** | Staff schedule, existing bookings, breaks, max advance booking (e.g., 60 days) |
| **Buffer Types** | Pre-service (setup), post-service (cleanup), between-bookings |
| **Optimization** | Cache daily slots; invalidate on booking/cancellation |

**Acceptance Criteria:**
- [ ] Slot query for single staff + service returns in < 200ms
- [ ] Multi-staff, multi-service queries resolve correctly (cartesian product)
- [ ] Daylight saving time transitions handled without duplicate/missing slots
- [ ] Business can block emergency time without cancelling existing bookings
- [ ] Overbooking impossible: database transaction with advisory lock pattern

---

### 2.12 Shared Types & Design System
**Priority:** P0

| Component | Specification |
|-----------|---------------|
| **Colors** | Primary #6B4EE6, Secondary #FF6B6B, Semantic (success/error/warning), Neutrals (12-step gray) |
| **Typography** | Inter font family, 6 heading levels, 2 body sizes, caption, overline |
| **Spacing** | 4px base grid, 14 sizes (4-96px) |
| **Components** | Button (5 variants), Input (7 states), Card, Bottom Sheet, Modal, Toast, Skeleton |
| **Tokens** | Platform-agnostic JSON; consumed by iOS (SwiftUI), Android (Compose), Web (Tailwind) |

**Acceptance Criteria:**
- [ ] All components support light/dark mode
- [ ] Accessibility: minimum 4.5:1 contrast, 44x44dp touch targets
- [ ] Component library published with Storybook/Docs
- [ ] Breaking changes versioned; migration guides provided
- [ ] RTL language support (Arabic, Hebrew) verified

---

### 2.13 Reviews & Ratings
**Priority:** P1

| Aspect | Specification |
|--------|---------------|
| **Submission** | Post-appointment only (verified purchase); 1-5 stars, text, photo optional |
| **Dimensions** | Overall, Service Quality, Ambiance, Value, Staff (specific) |
| **Moderation** | Auto-approve + post-moderation; flag for: profanity, spam, off-topic |
| **Response** | Business owner reply; marked as "Business Owner" |
| **Aggregation** | Bayesian average for ranking; recency-weighted for display |

**Acceptance Criteria:**
- [ ] Review form pre-fills appointment details, editable
- [ ] User can edit review within 48 hours; delete anytime
- [ ] Business receives notification on new review; reply within 72h for "Responds Quickly" badge
- [ ] Reported reviews hidden pending review; SLA 24h
- [ ] Fake review detection: velocity checks, pattern matching, manual audit queue

---

### 2.14 Payment Integration
**Priority:** P0

| Aspect | Specification |
|--------|---------------|
| **Providers** | Stripe (primary), PayPal (secondary), Apple Pay, Google Pay |
| **Models** | Pay in full, Deposit (hold), Pay at venue, Subscription/membership |
| **Flow** | Client-side tokenization → server intent creation → confirm → webhook confirmation |
| **Security** | PCI DSS Level 1 via Stripe; never store raw card data |
| **Payouts** | Stripe Connect: destination charges, automatic transfers to provider accounts |

**Acceptance Criteria:**
- [ ] Payment form supports 3D Secure, SCA compliance
- [ ] Failed payment: 3 retry attempts with clear error messaging
- [ ] Refund initiated by user or provider; processed per policy
- [ ] Invoice/receipt emailed and available in-app
- [ ] Dispute management: notification, evidence upload, status tracking

---

### 2.15 Notifications
**Priority:** P1

| Channel | Use Cases |
|---------|-----------|
| **Push** | Booking confirmation, reminders, promotions, provider messages |
| **SMS** | Critical: booking changes, 2FA; Marketing: opt-in only |
| **Email** | Receipts, account security, weekly digest, re-engagement |
| **In-App** | Inbox for all notification history; unread badge |

**Acceptance Criteria:**
- [ ] User controls channel preferences per notification type
- [ ] Quiet hours respected (default 22:00-08:00 local time)
- [ ] Deep links navigate to relevant screen, not just app open
- [ ] Delivery tracking: sent, delivered, opened metrics
- [ ] Batch similar notifications ("3 new appointments today")

---

### 2.16 Provider / Business Owner Portal
**Priority:** P0

| Module | Features |
|--------|----------|
| **Dashboard** | Today's appointments, revenue this week, new reviews, quick actions |
| **Calendar** | Day/week/month views; drag-drop reschedule; block time |
| **Services** | CRUD services, pricing, duration, staff assignment |
| **Staff** | Add team members, set permissions, manage schedules |
| **Bookings** | View all, filter by status, manual entry (walk-in), export |
| **Clients** | CRM: notes, visit history, preferences, marketing tags |
| **Settings** | Business hours, cancellation policy, payment methods, integrations |

**Acceptance Criteria:**
- [ ] Calendar syncs bidirectionally with Google/Outlook (iCal feed)
- [ ] Staff permissions: Owner > Manager > Receptionist > Practitioner (view-only own)
- [ ] Offline mode: view schedule, queue changes for sync
- [ ] Mobile-responsive: full functionality on tablet; core on phone
- [ ] Onboarding wizard: business setup in < 10 minutes

---

### 2.17 Admin Dashboard
**Priority:** P1

| Module | Features |
|--------|----------|
| **User Management** | Search, view, suspend, impersonate, audit log |
| **Business Verification** | KYC document review, approval workflow, rejection with reason |
| **Content Moderation** | Review queue for businesses, reviews, user reports |
| **Analytics** | MAU, booking volume, GMV, churn, top categories, geographic heatmap |
| **Finance** | Transaction monitoring, dispute overview, payout reconciliation |
| **System** | Feature flags, rate limits, broadcast notifications, maintenance mode |

**Acceptance Criteria:**
- [ ] All admin actions logged secure audit trail (immutable, 7-year retention)
- [ ] Role-based access: Super Admin, Support, Finance, Content Mod
- [ ] Bulk operations with confirmation and undo window (5 minutes)
- [ ] Real-time alerts: anomaly detection (fraud, system errors)
- [ ] Report builder: scheduled exports to S3/email

---

### 2.18 Background Jobs (BullMQ)
**Priority:** P0

| Queue | Jobs | Priority |
|-------|------|----------|
| **notifications** | Push, SMS, email dispatch | High |
| **bookings** | Slot cache warm, reminder scheduling, no-show check | High |
| **payments** | Payout calculation, invoice generation, retry failed charges | High |
| **search** | Business index update, geocoding | Medium |
| **analytics** | Aggregation, report generation, ML feature computation | Low |
| **maintenance** | Data cleanup, backup verification, log rotation | Lowest |

**Acceptance Criteria:**
- [ ] Job failure: 3 retries with exponential backoff; dead letter queue after
- [ ] Stalled jobs detected and reprocessed within 5 minutes
- [ ] Queue depth alerts at > 1000 jobs or processing lag > 5 minutes
- [ ] Job idempotency: duplicate execution produces same outcome
- [ ] Scheduled jobs (reminders) survive restarts via Redis persistence

---

## 3. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | App cold start < 2s; screen transition < 300ms; API p95 < 200ms |
| **Availability** | 99.9% uptime; maintenance windows announced 48h ahead |
| **Security** | OWASP Top 10 mitigated; annual penetration test; bug bounty |
| **Compliance** | GDPR, CCPA, PCI DSS; SOC 2 Type II target Q2 |
| **Localization** | EN, FR, ES, DE launch; RTL support; date/number/currency formatting |
| **Accessibility** | WCAG 2.1 AA; VoiceOver/TalkBack tested |

---

## 4. Success Metrics

| Metric | Target |
|--------|--------|
| Monthly Bookings | 10% MoM growth post-launch |
| Search-to-Book Conversion | > 8% |
| Provider Activation (first booking) | > 70% within 30 days of signup |
| NPS | > 50 |
| App Store Rating | > 4.5 |
| Support Tickets / 1000 Users | < 5 |

---

## 5. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Auth, Search, Business Detail, Booking, Provider Calendar | Week 1-8 |
| **v1.0** | Payments, Reviews, Favorites, Notifications, Profile | Week 9-14 |
| **v1.5** | Map Search, Admin Dashboard, Analytics, Subscriptions | Week 15-22 |
| **v2.0** | AI Recommendations, Memberships, Marketplace Expansion | Week 23-30 |
