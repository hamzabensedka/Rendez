# Planity Clone — Product Specification

## 1. Overview

Build a cross-platform mobile application (iOS/Android) and responsive web platform connecting customers with beauty/wellness service providers for appointment booking. The platform serves three user types: customers seeking services, business owners managing their operations, and administrators overseeing the marketplace.

**Target Users:**
- **Customers:** 18-55 years old, mobile-first, value convenience and discovery
- **Business Owners:** Salon/spa/barbershop managers, need schedule optimization and client acquisition
- **Admins:** Platform operators managing marketplace health and quality

---

## 2. Core Principles

| Principle | Description |
|-----------|-------------|
| Mobile-First | Core booking flow optimized for mobile; feature parity on web |
| Real-Time | Availability reflects actual state; no double-booking |
| Trust & Transparency | Clear pricing, verified reviews, secure payments |
| Friction Reduction | Minimize steps to book; smart defaults; persistent preferences |

---

## 3. Feature Specifications

### 3.1 User Authentication
**Priority:** P0 | **Owner:** Backend / Mobile

| Aspect | Specification |
|--------|---------------|
| Registration Methods | Email/password, Google OAuth, Apple Sign-In |
| Phone Verification | Required for booking; SMS OTP via Twilio |
| Password Requirements | Min 8 chars, 1 uppercase, 1 number, 1 special character |
| Session Management | JWT access token (15min) + refresh token (7 days); biometric unlock on mobile |
| Account States | Unverified (browse only) → Verified (can book) → Suspended |

**Acceptance Criteria:**
- [ ] User can register with email in < 60 seconds
- [ ] OAuth users prompted for phone number before first booking
- [ ] Session refreshes transparently; user never sees auth error during active use
- [ ] Biometric prompt appears on app open if enabled, with fallback to PIN
- [ ] Password reset completes via email link with 1-hour expiry

---

### 3.2 Guest Browse & Explore
**Priority:** P0 | **Owner:** Mobile / Frontend

| Aspect | Specification |
|--------|---------------|
| Guest Capabilities | Browse businesses, view details, see availability, read reviews |
| Conversion Trigger | "Book" or "Favorite" prompts registration modal |
| Data Persistence | Guest search history and filters stored locally; merged on registration |
| Onboarding | 3-screen value prop shown once; skippable |

**Acceptance Criteria:**
- [ ] Guest lands on explore screen in < 2 seconds (cached data)
- [ ] Registration modal appears with context ("Sign in to book with [Business Name]")
- [ ] Guest filters and location persist through registration flow
- [ ] Deep links to business pages work for unauthenticated users

---

### 3.3 Business Search & Discovery
**Priority:** P0 | **Owner:** Backend / Search

| Aspect | Specification |
|--------|---------------|
| Search Inputs | Text query (business name, service, staff name), filters, location |
| Filters | Service category, price range, rating (4.0+), availability today, gender of staff, amenities |
| Sort Options | Relevance (default), distance, rating, price (low-high), availability soonest |
| Results Display | Card view with: image, name, rating, distance, price from, next available slot |
| Pagination | Cursor-based, 20 results per page, infinite scroll |

**Acceptance Criteria:**
- [ ] Search returns results in < 300ms for cached index, < 800ms for fresh query
- [ ] Typo tolerance handles 1-2 character errors ("massag" → "massage")
- [ ] Empty state suggests nearby alternatives or broader filters
- [ ] "Book Again" section surfaces previously visited businesses above fold
- [ ] Recent searches persist and are tappable

---

### 3.4 Map-based Search
**Priority:** P0 | **Owner:** Mobile

| Aspect | Specification |
|--------|---------------|
| Map Provider | Mapbox (custom styling) with Google Maps fallback |
| Default View | User location with 5km radius; cluster markers for density > 5 |
| Business Pins | Color-coded by category; tap reveals bottom sheet preview |
| Interaction | Pan, zoom, rotate; recenter button; follow mode |
| List/Map Toggle | Persistent user preference; animate transition |

**Acceptance Criteria:**
- [ ] Map renders with current location dot in < 3 seconds
- [ ] Pin tap opens bottom sheet with key info; second tap navigates to detail
- [ ] Map bounds query fetches businesses as user pans (debounced 300ms)
- [ ] Cluster breaks into individual pins at zoom level ≥ 14
- [ ] Offline: last viewed map tiles cached; businesses from local storage shown

---

### 3.5 Business Detail View
**Priority:** P0 | **Owner:** Mobile / Frontend

| Aspect | Specification |
|--------|---------------|
| Header | Image carousel (max 10), business name, rating, review count, favorite toggle |
| Info Section | Address (tappable for directions), hours (today's hours expanded), phone, website |
| Services Tab | Categorized list with: service name, duration, price, description, "Book" CTA |
| Staff Tab | Staff profiles with photo, bio, specialties, rating; filter by service |
| Reviews Tab | Summary (average, distribution), sortable list with photos, verified badge |
| About Tab | Business description, amenities, cancellation policy, COVID protocols |

**Acceptance Criteria:**
- [ ] Page loads in < 2 seconds with skeleton screens during fetch
- [ ] Image carousel supports pinch-zoom on tap; video autoplay muted
- [ ] "Call" and "Get Directions" are prominent fixed actions
- [ ] Service selection pre-filters staff tab to those offering that service
- [ ] Share button generates deep link with preview image

---

### 3.6 Service Categories
**Priority:** P0 | **Owner:** Backend / Taxonomy

| Aspect | Specification |
|--------|---------------|
| Hierarchy | 8 top-level categories → 40+ subcategories → specific services |
| Top Categories | Hair, Nails, Face & Skin, Body & Massage, Hair Removal, Makeup, Barbershop, Medical Aesthetic |
| Category Icons | Custom SVG, consistent 24dp style |
| Dynamic Display | Categories shown based on search history and seasonal trends |
| Business Assignment | Businesses select from taxonomy; can request additions |

**Acceptance Criteria:**
- [ ] Category browse loads in < 1 second
- [ ] Trending categories update within 24 hours of data change
- [ ] Search within category returns relevant results (not just keyword match)
- [ ] Category page shows featured businesses and popular services

---

### 3.7 Booking Flow
**Priority:** P0 | **Owner:** Full Stack

| Step | Description |
|------|-------------|
| 1. Service Selection | User selects service(s); multi-service booking supported (max 3) |
| 2. Staff Selection | "Any available" default; specific staff with their next availability shown |
| 3. Date/Time | Calendar view (2 weeks forward); slots computed from availability engine |
| 4. Add-ons | Upsell: upgrade service, add product, request specific amenity |
| 5. Review | Summary with cancellation policy, price breakdown, estimated duration |
| 6. Payment | Stored payment method or new card; hold placed, charged on completion or no-show policy |
| 7. Confirmation | Booking reference, add to calendar, share, directions |

**Acceptance Criteria:**
- [ ] Complete booking in < 5 taps from service selection
- [ ] Slot times update in real-time; expired slots removed within 5 seconds
- [ ] Concurrent booking race condition handled: first completer wins, others shown alternatives
- [ ] Payment failure preserves slot for 2 minutes while retry attempted
- [ ] Confirmation screen includes all details; editable for 5 minutes post-booking

---

### 3.8 Appointment Management
**Priority:** P0 | **Owner:** Mobile / Backend

| Aspect | Specification |
|--------|---------------|
| Customer View | Upcoming (sorted by date), past, cancelled tabs; color-coded by status |
| Actions | Reschedule (same business, any future slot), cancel with reason, rebook |
| Cancellation Policy | Defined per business: free until X hours before, then percentage fee |
| No-Show Handling | Marked by business; affects future booking restrictions |
| Receipts | Generated post-appointment; downloadable PDF, email copy |

**Acceptance Criteria:**
- [ ] Upcoming appointments visible in app within 5 seconds of booking
- [ ] Reschedule finds next 5 available slots for same service/staff
- [ ] Cancellation refund processed per policy; confirmation within 30 seconds
- [ ] Push notification 24 hours and 1 hour before appointment
- [ ] Past appointments review-requested once, 2 hours after completion

---

### 3.9 Favorites
**Priority:** P1 | **Owner:** Mobile

| Aspect | Specification |
|--------|---------------|
| Save Action | Heart icon on business card and detail; haptic feedback |
| Organization | Default list only; future: custom lists |
| Notifications | Optional: notify of new availability or promotions from favorites |
| Sync | Cross-device via account; available offline as cached list |

**Acceptance Criteria:**
- [ ] Favorite/unfavorite responds in < 100ms UI, syncs in background
- [ ] Favorites list loads with cached data, refreshes silently
- [ ] Empty state suggests nearby popular businesses
- [ ] Maximum 500 favorites per user (soft limit with warning)

---

### 3.10 User Profile
**Priority:** P1 | **Owner:** Mobile

| Section | Content |
|---------|---------|
| Personal Info | Name, phone, email, profile photo (optional), birthday (for offers) |
| Preferences | Default notification settings, preferred payment method, home location |
| Privacy | Data export, account deletion (GDPR compliant), marketing opt-outs |
| Activity | Booking history, total spent, loyalty status per business |
| Payment Methods | Add, edit, delete cards; default selection; Apple/Google Pay toggle |

**Acceptance Criteria:**
- [ ] Profile photo upload with crop and compression (max 2MB)
- [ ] Account deletion initiates 30-day grace period with recovery option
- [ ] Data export (GDPR) completes within 24 hours, delivered via secure link
- [ ] Preference changes apply immediately to all active sessions

---

### 3.11 Availability & Slot Computation
**Priority:** P0 | **Owner:** Backend

| Aspect | Specification |
|--------|---------------|
| Business Hours | Weekly recurring + exceptions (holidays, temporary closures) |
| Staff Availability | Override business hours; breaks; time-off requests |
| Service Duration | Base duration + buffer (cleanup, setup); variable by staff |
| Slot Generation | Real-time computation considering: existing bookings, staff constraints, service combinations |
| Buffer Rules | No back-to-back without X min gap; lunch block enforcement |
| Last-Minute | Configurable: block booking within X hours of appointment start |

**Acceptance Criteria:**
- [ ] Slot computation for single staff + service completes in < 50ms
- [ ] Multi-staff, multi-service query completes in < 200ms
- [ ] Booking creation atomically checks and reserves slot; conflict rate < 0.01%
- [ ] Schedule changes (staff sick, business closure) invalidate affected slots within 10 seconds
- [ ] Historical booking patterns inform suggested slot availability confidence

---

### 3.12 Shared Types & Design System
**Priority:** P0 | **Owner:** Design / Frontend

| Element | Specification |
|---------|-------------|
| Design Tokens | Colors (primary #FF6B6B, semantic states), typography (Inter family, 6 sizes), spacing (4px base), shadows, borders |
| Components | 40+ reusable: buttons, inputs, cards, modals, bottom sheets, skeletons, toasts |
| Animation | 200ms standard duration; spring physics for interactive elements; reduce-motion support |
| Accessibility | WCAG 2.1 AA: minimum 4.5:1 contrast, 44dp touch targets, screen reader labels, focus indicators |
| Theming | Business brand color injection (subtle, maintains platform identity) |

**Acceptance Criteria:**
- [ ] All components render correctly on iOS 14+, Android 10+, Chrome/Safari/Firefox latest
- [ ] Dark mode supported with full component coverage
- [ ] Screen reader navigates booking flow successfully
- [ ] Component library documented in Storybook with usage examples

---

### 3.13 Reviews & Ratings
**Priority:** P1 | **Owner:** Backend / Mobile

| Aspect | Specification |
|--------|---------------|
| Eligibility | Verified customers only; within 30 days of appointment |
| Rating | 1-5 stars, overall + optional sub-ratings (service, cleanliness, value, atmosphere) |
| Content | Text (max 500 chars), photo upload (max 5, 3MB each) |
| Moderation | Auto-flag profanity, images; human review within 24 hours for flagged content |
| Business Response | Owner can reply once; reply marked as such |
| Display | Sort by relevant (default), newest, highest/lowest; filter by rating, with photos |

**Acceptance Criteria:**
- [ ] Review submission available 2 hours post-appointment (prevents premature reviews)
- [ ] Average rating updates within 5 minutes of new review
- [ ] Flagged content hidden pending review; user notified of decision
- [ ] Business response notification sent to reviewer (if opted in)
- [ ] Review helpfulness voting with abuse detection

---

### 3.14 Payment Integration
**Priority:** P0 | **Owner:** Backend

| Aspect | Specification |
|--------|---------------|
| Providers | Stripe (primary), PayPal (secondary); Apple Pay, Google Pay |
| Flow | Authorization at booking, capture on service completion or no-show window expiry |
| Split Payments | Platform fee deducted; remainder to business account (weekly payout) |
| Refunds | Full, partial, or credit; processed per cancellation policy |
| Security | PCI DSS Level 1 via Stripe; no card data touches our servers |
| Invoicing | VAT invoice generation for business customers |

**Acceptance Criteria:**
- [ ] Payment method addition with 3D Secure challenge where required
- [ ] Failed payment retries with saved method or new method; 2-minute slot hold
- [ ] Refund completes to original payment method within 5-10 business days
- [ ] Payout report accessible to business owner with transaction breakdown
- [ ] Dispute handling workflow with evidence submission

---

### 3.15 Notifications
**Priority:** P1 | **Owner:** Backend / Mobile

| Channel | Use Cases |
|---------|-----------|
| Push (OneSignal) | Booking confirmation, reminders (24h, 1h), promotions, favorites availability |
| SMS (Twilio) | OTP, urgent booking changes, day-of reminders |
| Email (SendGrid) | Receipts, account security, marketing (opt-in) |
| In-App | Activity feed, system messages, feature announcements |

| Aspect | Specification |
|--------|---------------|
| Preferences | Granular opt-in per channel and notification type |
| Delivery | Push: best effort with retry; SMS: at-least-once; Email: queued with bounce handling |
| Localization | Content in user's app language; time in their timezone |

**Acceptance Criteria:**
- [ ] Push notification delivery rate > 95% for active devices
- [ ] Reminder timing accurate within 1 minute of scheduled time
- [ ] Unsubscribe from marketing honored within 24 hours across all channels
- [ ] Notification history retained 90 days in-app

---

### 3.16 Provider / Business Owner Portal
**Priority:** P0 | **Owner:** Frontend / Backend

| Module | Features |
|--------|----------|
| Dashboard | Today's appointments, revenue this week, upcoming week preview, action items |
| Calendar | Day/week/month views; drag-to-reschedule; block time; color by staff/service |
| Booking Management | View all bookings, filter by status, manual entry for walk-ins/phone bookings |
| Staff Management | Add staff, set services, hours, breaks, time off |
| Services | CRUD services, pricing, duration, descriptions; set as active/inactive |
| Clients | CRM view: history, notes, preferences, no-show count; export contacts |
| Reviews | Monitor, respond, report; sentiment summary |
| Settings | Business info, photos, policies, payout account, notification preferences |

**Acceptance Criteria:**
- [ ] Portal loads in < 3 seconds on desktop; responsive down to tablet
- [ ] Calendar supports 50+ concurrent bookings without performance degradation
- [ ] Manual booking validates against availability rules same as customer booking
- [ ] Staff can have restricted access (view only, or specific locations)
- [ ] Data export (appointments, clients, revenue) to CSV/Excel

---

### 3.17 Admin Dashboard
**Priority:** P1 | **Owner:** Backend / Frontend

| Module | Features |
|--------|----------|
| Overview | KPIs: active users, bookings, GMV, churn, top categories, geographic heatmap |
| Business Management | Onboard, verify, suspend; view disputes; edit commission rates |
| User Management | Search, view activity, suspend, impersonate (with audit log) |
| Content Moderation | Review queue for flagged reviews, businesses, images |
| Financial | Transaction ledger, payout scheduling, refund approval, commission reporting |
| System Health | Job queue status, error rates, API latency, third-party service status |
| Communications | Broadcast push/email/SMS to segments; scheduled maintenance notices |

**Acceptance Criteria:**
- [ ] Dashboard data refreshes every 30 seconds for real-time metrics
- [ ] All admin actions logged with admin ID, timestamp, before/after state
- [ ] Impersonation requires second approval, auto-terminates after 30 minutes
- [ ] Financial reports exportable with audit trail for accounting

---

### 3.18 Background Jobs (BullMQ)
**Priority:** P0 | **Owner:** Backend

| Job Type | Description | Priority | Retry |
|----------|-------------|----------|-------|
| Slot Pre-computation | Generate next 14 days of slots for high-traffic businesses | High | 3x, 5min delay |
| Notification Dispatch | Send push/SMS/email based on trigger | Critical | 5x, exponential |
| Payment Processing | Authorize, capture, refund, payout | Critical | 5x, immediate |
| Search Index Update | Reindex business/service on change | High | 3x, 1min delay |
| Analytics Aggregation | Roll up booking/revenue data for reporting | Low | 2x, 1hr delay |
| Image Processing | Compress, generate thumbnails, moderate content | Medium | 3x, 5min delay |
| Data Export | Generate GDPR export or business report | Medium | 2x, 10min delay |
| Cleanup | Archive old data, delete expired tokens | Low | 1x, next scheduled run |

**Acceptance Criteria:**
- [ ] Job queue depth monitored; alert if > 1000 pending for > 5 minutes
- [ ] Failed jobs visible in admin with full context for manual retry
- [ ] Job processing rate scales with worker count (horizontal scaling)
- [ ] Stalled jobs detected and requeued within 30 seconds
- [ ] Scheduled jobs execute within 1 minute of target time

---

## 4. Non-Functional Requirements

| Area | Target |
|------|--------|
| Availability | 99.9% uptime; planned maintenance < 1 hour monthly |
| Performance | P95 API response < 200ms; page load < 2s (3G) |
| Security | OWASP Top 10 mitigated; annual penetration test |
| Scalability | Support 10,000 concurrent booking attempts |
| Compliance | GDPR, CCPA, PCI DSS; data residency options |

---

## 5. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Booking Conversion | > 15% of app opens result in completed booking | Funnel analysis |
| Search-to-Book | < 3 minutes average | Session timing |
| No-Show Rate | < 8% | Booking status tracking |
| Business NPS | > 50 | Quarterly survey |
| Customer NPS | > 60 | In-app survey post-appointment |
| Support Tickets | < 1% of transactions | Zendesk categorization |

---

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Browse, Search, Business Detail, Booking, Appointments, Basic Provider Portal | 10 weeks |
| v1.1 | Map Search, Favorites, Reviews, Payments, Notifications | 4 weeks |
| v1.2 | Admin Dashboard, Background Jobs, Analytics, Advanced Provider Features | 4 weeks |
| v2.0 | AI Recommendations, Subscription Plans, Marketplace Features | TBD |

---

*Document Version: 1.0 | Last Updated: 2024 | Owner: Alex, Product Owner*