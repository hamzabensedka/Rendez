# Planity Clone — Product Specification

## 1. Overview

### 1.1 Product Vision
Build a mobile-first marketplace connecting beauty/wellness professionals with clients seeking appointment-based services. The platform enables discovery, booking, and management of appointments while providing business tools for providers.

### 1.2 Target Users
- **Clients**: Consumers aged 18-55 seeking beauty/wellness services (hair, nails, spa, fitness)
- **Providers**: Independent professionals and salon owners managing appointments
- **Admin**: Platform operators overseeing marketplace health

### 1.3 Success Metrics
- Booking conversion rate > 15%
- Provider onboarding < 10 minutes
- Search-to-book time < 3 minutes
- App crash rate < 0.5%

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority**: P0 | **Effort**: Medium

| Aspect | Specification |
|--------|---------------|
| **Description** | Secure account creation and access for clients and providers |
| **User Story** | As a user, I want to quickly create an account so I can book appointments and manage my history |

**Acceptance Criteria**
- [ ] Sign-up via email/password with validation (8+ chars, 1 uppercase, 1 number)
- [ ] Sign-up via OAuth 2.0 (Google, Apple, Facebook)
- [ ] Phone number verification via SMS (Twilio) for high-value actions
- [ ] JWT access token (15min) + refresh token (7 days) with secure storage
- [ ] Password reset via email with 1-hour expiry link
- [ ] Biometric login (Face ID/Touch ID) after initial setup
- [ ] Session management: max 5 concurrent sessions, revoke on suspicious activity
- [ ] Guest checkout option preserving cart state for post-booking account creation
- [ ] Role-based access: `client`, `provider`, `admin`

**Edge Cases**
- Resend SMS cooldown: 60 seconds, max 3 attempts/hour
- Account lockout after 5 failed password attempts (30-min cooldown)

---

### 2.2 Guest Browse & Explore
**Priority**: P0 | **Effort**: Low

| Aspect | Specification |
|--------|---------------|
| **Description** | Unauthenticated discovery experience to reduce friction |
| **User Story** | As a guest, I want to browse services without creating an account so I can evaluate the platform |

**Acceptance Criteria**
- [ ] Full search and filter functionality without login
- [ ] Business profile and service detail visibility
- [ ] Reviews and ratings readable
- [ ] Prompt account creation at booking initiation (not before)
- [ ] Guest session stored in localStorage with 7-day expiry
- [ ] Seamless account migration: favorites, viewed businesses, and cart transfer on signup

---

### 2.3 Business Search & Discovery
**Priority**: P0 | **Effort**: High

| Aspect | Specification |
|--------|---------------|
| **Description** | Intelligent search with multi-factor filtering and ranking |
| **User Story** | As a client, I want to find the right provider quickly based on my preferences |

**Acceptance Criteria**
- [ ] Text search across: business name, service name, provider name, tags
- [ ] Auto-complete with typo tolerance (Levenshtein distance ≤ 2)
- [ ] Search history (last 10 queries, deletable)
- [ ] Trending searches and suggested queries
- [ ] Filters: category, price range, rating (1-5 stars), distance (km/mi), availability (today, this week), gender of provider, amenities
- [ ] Sort options: relevance (default), distance, rating, price (low-high), availability
- [ ] Pagination: 20 results per page, infinite scroll on mobile
- [ ] Result cards show: thumbnail, business name, rating, distance, starting price, next available slot, "book now" CTA
- [ ] Empty state with alternative suggestions and nearby options

**Technical Notes**
- Elasticsearch for full-text search with fuzzy matching
- Geospatial indexing for distance calculations
- Search results cached 5 minutes

---

### 2.4 Map-based Search
**Priority**: P0 | **Effort**: High

| Aspect | Specification |
|--------|---------------|
| **Description** | Visual location exploration with interactive clustering |
| **User Story** | As a client, I want to see businesses on a map to find convenient locations |

**Acceptance Criteria**
- [ ] Default map view centered on user location (with permission) or city center
- [ ] Business markers: distinct icons by category, color-coded by availability (green = available today, gray = no availability)
- [ ] Clustering: auto-cluster at < zoom level 12, individual markers at ≥ 12
- [ ] Marker tap: bottom sheet with key info and "view details" link
- [ ] List/map toggle with state persistence
- [ ] Search this area: re-query on map pan/zoom with debounce (300ms)
- [ ] Current location button with blue dot accuracy indicator
- [ ] Directions integration (Google Maps, Apple Maps, Waze)
- [ ] Map bounds filter applied to main search results

**Performance**
- Initial render < 2s on 4G
- Marker load < 500ms for 100 points

---

### 2.5 Business Detail View
**Priority**: P0 | **Effort**: High

| Aspect | Specification |
|--------|---------------|
| **Description** | Comprehensive provider profile driving conversion |
| **User Story** | As a client, I want detailed information to make an informed booking decision |

**Acceptance Criteria**
- [ ] Hero image carousel (max 10 images, min 3 for featured)
- [ ] Business info: name, verified badge, category, address with map thumbnail, hours, phone, website link
- [ ] Average rating with distribution breakdown (5-4-3-2-1 star counts)
- [ ] Services list: expandable cards with name, duration, description, price, "book" CTA
- [ ] Team/professionals tab: photos, bios, specialties, individual ratings
- [ ] Reviews tab: sortable (recent, highest, lowest), filterable, paginated (10 per load)
- [ ] Photo gallery: full-screen viewer with pinch-to-zoom
- [ ] Share functionality: deep link, native share sheet
- [ ] Similar businesses carousel (same category, < 2km)
- [ ] "Save to favorites" with heart animation
- [ ] Report business option (content, fraud, closed)

**Analytics**
- Track: view duration, scroll depth, image interactions, CTA clicks

---

### 2.6 Service Categories
**Priority**: P0 | **Effort**: Medium

| Aspect | Specification |
|--------|---------------|
| **Description** | Hierarchical taxonomy for service organization |
| **User Story** | As a client, I want to browse by category to discover new services |

**Acceptance Criteria**
- [ ] Two-level hierarchy: Category (e.g., Hair) → Subcategory (e.g., Haircut, Coloring, Styling)
- [ ] Categories: Hair, Nails, Face & Body, Massage, Fitness, Medical Aesthetic, Tattoo & Piercing, Barbershop
- [ ] Category icons (custom SVG, consistent 24px grid)
- [ ] Featured/promoted categories on home screen
- [ ] Category-specific filters (e.g., hair length for haircuts, nail shape for manicures)
- [ ] Provider self-categorization with admin approval for new categories
- [ ] Category analytics: popular, trending, seasonal boosts

---

### 2.7 Booking Flow
**Priority**: P0 | **Effort**: High

| Aspect | Specification |
|--------|---------------|
| **Description** | Friction-reduced appointment reservation with clear commitment |
| **User Story** | As a client, I want to book an appointment in minimal steps with confidence |

**Acceptance Criteria**
- [ ] Step 1: Service selection (pre-selected if from business detail)
- [ ] Step 2: Professional selection (optional "any available"), with availability preview
- [ ] Step 3: Date/time picker with real-time slot availability (see 2.11)
- [ ] Step 4: Add-ons/upsells (optional products, service upgrades)
- [ ] Step 5: Client details (auto-filled for logged users), special requests (250 chars)
- [ ] Step 6: Payment method selection, promo code, price breakdown
- [ ] Step 7: Confirmation with calendar invite (.ics), add to wallet, share
- [ ] Progress indicator (step X of 7)
- [ ] Edit any previous step without data loss
- [ ] Price and cancellation policy displayed before final commit
- [ ] Booking hold: 10-minute reservation during payment (see 2.11)
- [ ] Post-booking: immediate confirmation screen, email + push notification

**Cancellation Policy**
- Free cancellation > 24h before appointment
- 50% charge 4-24h before
- Full charge < 4h (configurable per business)

---

### 2.8 Appointment Management
**Priority**: P0 | **Effort**: High

| Aspect | Specification |
|--------|---------------|
| **Description** | Lifecycle management for client and provider |
| **User Story** | As a user, I want to view and manage my appointments easily |

**Acceptance Criteria**
- [ ] Client view: Upcoming (sorted by date), Past, Cancelled tabs
- [ ] Appointment card: service, business, professional, date/time, status badge, actions
- [ ] Statuses: Pending → Confirmed → Checked-in → Completed → Reviewed (or Cancelled/No-show)
- [ ] Reschedule: search alternative slots, preserve original for release on confirmation
- [ ] Cancel: with reason selection, refund processing per policy
- [ ] Rebook: one-tap rebook same service
- [ ] Add to calendar: Google, Apple, Outlook
- [ ] Directions link
- [ ] Contact business (in-app message or phone)
- [ ] Provider view: daily/weekly calendar, client details, check-in function, mark no-show

---

### 2.9 Favorites
**Priority**: P1 | **Effort**: Low

| Aspect | Specification |
|--------|---------------|
| **Description** | Bookmarking for quick re-access and rebooking |
| **User Story** | As a client, I want to save preferred businesses for future bookings |

**Acceptance Criteria**
- [ ] Toggle favorite from business detail, search results, or appointment card
- [ ] Favorites list: sortable (recently added, alphabetical, nearest)
- [ ] Quick rebook from favorite (pre-filled service selection)
- [ ] Availability indicator (green dot = slots today)
- [ ] Push notification: "Your favorite [Business] has new availability"
- [ ] Max 500 favorites per user
- [ ] Sync across devices (real-time)

---

### 2.10 User Profile
**Priority**: P1 | **Effort**: Medium

| Aspect | Specification |
|--------|---------------|
| **Description** | Personal hub for preferences, history, and account |
| **User Story** | As a user, I want to manage my information and preferences centrally |

**Acceptance Criteria**
- [ ] Profile photo upload (crop, max 5MB, JPG/PNG)
- [ ] Editable: name, phone, email (verification required), birthday (for birthday offers)
- [ ] Saved payment methods (Stripe/PayPal tokenized)
- [ ] Notification preferences: push, email, SMS (granular per type)
- [ ] Privacy settings: profile visibility, data download, account deletion (GDPR/CCPA)
- [ ] Referral code and credits balance
- [ ] Loyalty program: points per booking, tier status, rewards catalog
- [ ] Help & Support: FAQ, chatbot, ticket creation, callback request

---

### 2.11 Availability & Slot Computation
**Priority**: P0 | **Effort**: High

| Aspect | Specification |
|--------|---------------|
| **Description** | Real-time availability engine preventing double-booking |
| **User Story** | As a client, I want accurate available times; as a provider, I want conflict-free scheduling |

**Acceptance Criteria**
- [ ] Business defines: operating hours per day, break times, slot duration per service
- [ ] Blackout dates (holidays, vacation)
- [ ] Buffer time between appointments (configurable: 0, 5, 10, 15, 30 min)
- [ ] Concurrent booking prevention: pessimistic locking with 10-minute hold expiry
- [ ] Slot generation: calculate available slots from business rules minus existing bookings minus holds
- [ ] Cache invalidation: < 2s propagation on new booking/cancellation
- [ ] Overbooking protection: hard stop at 100% capacity
- [ ] Waitlist: notify when preferred slot becomes available
- [ ] Bulk availability update (provider vacation, recurring breaks)

**Algorithm**
- Pre-compute daily slots at 00:00 UTC for next 60 days
- Real-time recompute on booking events
- Redis for hold management with TTL

---

### 2.12 Shared Types & Design System
**Priority**: P0 | **Effort**: Medium

| Aspect | Specification |
|--------|---------------|
| **Description** | Consistent UI/UX foundation across platforms |

**Acceptance Criteria**
- [ ] Design tokens: colors (primary #FF6B6B, secondary #4ECDC4, semantic states), typography (Inter font family, 6 sizes), spacing (4px grid), shadows, radii
- [ ] Component library: buttons (5 variants), inputs, cards, modals, bottom sheets, date pickers, loaders, empty states, error states
- [ ] Accessibility: WCAG 2.1 AA minimum, screen reader support, minimum touch 44x44px
- [ ] Dark mode support
- [ ] iOS and Android native patterns where platform-appropriate
- [ ] Animation standards: 200ms transitions, spring physics for gestures
- [ ] Shared TypeScript types: User, Business, Service, Appointment, Slot, Payment, Notification
- [ ] API contract documentation (OpenAPI 3.0)

---

### 2.13 Reviews & Ratings
**Priority**: P1 | **Effort**: Medium

| Aspect | Specification |
|--------|---------------|
| **Description** | Trust-building through verified feedback |
| **User Story** | As a client, I want honest reviews; as a provider, I want fair representation |

**Acceptance Criteria**
- [ ] Review eligibility: verified booking completion (no-show = ineligible)
- [ ] Rating: 1-5 stars with optional per-criteria (service quality, ambiance, value, punctuality)
- [ ] Text review: 10-500 characters, photo upload (max 5)
- [ ] Provider response capability
- [ ] Review moderation: auto-flag profanity, manual review for disputes
- [ ] "Helpful" voting, sort by helpfulness
- [ ] Review digestibility: highlight keywords, verified badge, client history ("12 bookings")
- [ ] Provider dashboard: rating trends, review analytics, response templates
- [ ] Fake review detection: velocity checks, cross-pattern analysis

---

### 2.14 Payment Integration
**Priority**: P0 | **Effort**: High

| Aspect | Specification |
|--------|---------------|
| **Description** | Secure, flexible transaction processing |
| **User Story** | As a user, I want trusted payment options with clear receipts |

**Acceptance Criteria**
- [ ] Payment methods: credit/debit (Stripe), Apple Pay, Google Pay, PayPal
- [ ] Payment timing options: pay now (full), pay deposit, pay at venue
- [ ] Split payment: gift cards + card, promo code + card
- [ ] Refund processing: automatic per cancellation policy, manual override by provider
- [ ] Receipts: email and in-app, itemized with tax
- [ ] Saved payment methods: tokenized, PCI-DSS compliant (never touch server)
- [ ] Failed payment: 3 retry attempts, graceful degradation to pay-at-venue if deposit paid
- [ ] Provider payout: weekly to connected account, dashboard with transaction history
- [ ] Platform fee: 10-15% configurable, transparent to provider

---

### 2.15 Notifications
**Priority**: P1 | **Effort**: Medium

| Aspect | Specification |
|--------|---------------|
| **Description** | Timely, relevant multi-channel communication |
| **User Story** | As a user, I want to stay informed without noise |

**Acceptance Criteria**
- [ ] Channels: push (OneSignal), SMS (Twilio), email (SendGrid), in-app inbox
- [ ] Client triggers: booking confirmation, 24h reminder, 1h reminder, provider cancellation, waitlist availability, review prompt (post-appointment), promotional (opt-in)
- [ ] Provider triggers: new booking, 24h reminder, client cancellation, daily digest
- [ ] Preference management: granular opt-in/out per channel per category
- [ ] Rich push: deep links, action buttons (confirm, reschedule, cancel)
- [ ] Delivery tracking and fallback (push → SMS if unread 10 min)
- [ ] Quiet hours: no non-urgent notifications 22:00-08:00 user timezone

---

### 2.16 Provider / Business Owner Portal
**Priority**: P0 | **Effort**: High

| Aspect | Specification |
|--------|---------------|
| **Description** | Self-service business management and growth tools |
| **User Story** | As a provider, I want to manage my availability, bookings, and business presence |

**Acceptance Criteria**
- [ ] Onboarding wizard: business info, services, team, hours, photos (guided, < 10 min)
- [ ] Calendar view: day/week/month, drag-to-reschedule, block time
- [ ] Booking management: accept/decline (if approval required), view client history, notes
- [ ] Service management: CRUD services, pricing, duration, description, photos
- [ ] Team management: add professionals, set permissions, individual schedules
- [ ] Client database: view history, contact, notes, marketing opt-in status
- [ ] Analytics dashboard: bookings, revenue, occupancy rate, no-show rate, review average, top services
- [ ] Settings: business hours, cancellation policy, notification preferences, payment account
- [ ] Mobile-responsive web app (dedicated native app P2)

---

### 2.17 Admin Dashboard
**Priority**: P1 | **Effort**: High

| Aspect | Specification |
|--------|---------------|
| **Description** | Platform oversight and operational control |
| **User Story** | As an admin, I want visibility and control over marketplace health |

**Acceptance Criteria**
- [ ] User management: search, view, suspend, impersonate (audit logged)
- [ ] Business verification: KYC document review, approval workflow, badge management
- [ ] Content moderation: review flagged content, dispute resolution, content removal
- [ ] Financial oversight: transaction monitoring, refund approval, payout scheduling, fee adjustment
- [ ] Analytics: MAU, booking volume, GMV, CAC, LTV, churn, top categories/geographies
- [ ] System health: API latency, error rates, queue depths, scheduled job status
- [ ] Feature flags: gradual rollout, A/B test configuration
- [ ] Audit log: all admin actions, immutable, 7-year retention

---

### 2.18 Background Jobs (BullMQ)
**Priority**: P0 | **Effort**: Medium

| Aspect | Specification |
|--------|---------------|
| **Description** | Reliable asynchronous processing for scale |
| **User Story** | As a system, I need durable, retryable background task execution |

**Acceptance Criteria**
- [ ] Job types and priorities:
  - **Critical**: Payment processing, slot hold management (highest priority)
  - **High**: Notification dispatch, search index updates
  - **Normal**: Email sends, analytics aggregation, report generation
  - **Low**: Data cleanup, log archiving
- [ ] Retry policy: 3 attempts with exponential backoff (5s, 25s, 125s)
- [ ] Dead letter queue for failed jobs after max retries, manual requeue capability
- [ ] Scheduled jobs: daily availability pre-computation (02:00 UTC), weekly analytics (Monday 06:00 UTC), reminder notifications (triggered by appointment time)
- [ ] Job idempotency: unique job ID prevents duplicate execution
- [ ] Monitoring: queue depth, processing rate, failure rate, average processing time (Grafana dashboards)
- [ ] Redis-backed with Redis Sentinel for HA
- [ ] Graceful shutdown: finish in-progress jobs, pause new intake

---

## 3. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Performance** | API p95 < 200ms, page load < 2s on 4G, image optimization (WebP, responsive sizes) |
| **Security** | OWASP Top 10 mitigation, encryption at rest (AES-256) and in transit (TLS 1.3), annual penetration testing |
| **Compliance** | GDPR, CCPA, PCI-DSS Level 1 for payment handling |
| **Reliability** | 99.9% uptime SLA, automated backups (point-in-time recovery 35 days), multi-region failover |
| **Scalability** | Horizontal scaling to 10M MAU, database read replicas, CDN for static assets |

---

## 4. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | 2.1-2.8, 2.11, 2.12, 2.14, 2.16 | Q1 |
| **V1.1** | 2.9, 2.10, 2.13, 2.15 | Q2 |
| **V1.2** | 2.17, 2.18 enhancements, advanced analytics | Q3 |
| **V2.0** | AI recommendations, subscription plans, marketplace expansion | Q4 |

---

## 5. Open Questions

1. Internationalization scope (languages, currencies, tax rules)?
2. Provider subscription vs. commission-only revenue model?
3. Insurance/liability coverage for service disputes?
4. Integration with existing salon management software (Salonist, Fresha)?

---

*Document version: 1.0 | Last updated: 2024 | Owner: Alex (Product Owner)*