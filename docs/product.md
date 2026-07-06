# Planity Clone — Product Specification

## 1. Overview

### 1.1 Product Vision
A mobile-first platform connecting customers with beauty & wellness businesses for seamless appointment booking. Customers discover, book, and manage appointments. Business owners manage their calendar, services, and client relationships.

### 1.2 Target Users
- **Customers (B2C)**: Individuals seeking beauty/wellness services
- **Business Owners (B2B)**: Salons, barbershops, spas, independent professionals
- **Admin**: Platform operators managing the marketplace

### 1.3 Platform
- iOS & Android native apps (React Native)
- Web responsive (Next.js)
- Business owner portal (web)
- Admin dashboard (web)

---

## 2. Feature Specifications

### 2.1 User Authentication
**Priority: P0**

Enable secure account creation and access across all platforms.

| Aspect | Specification |
|--------|---------------|
| Registration Methods | Email/password, Google OAuth, Apple Sign-In |
| Email Verification | Required before first booking; resend capability |
| Password Requirements | Min 8 chars, 1 uppercase, 1 number, 1 special char |
| Login | JWT access token (15min) + refresh token (7 days) |
| Password Reset | Email link with 1-hour expiration |
| Account Deletion | Self-service; 30-day grace period with data export |
| Roles | `customer`, `business_owner`, `admin` (stored in JWT) |

**Acceptance Criteria:**
- [ ] User can register with email, verify email, and log in within 60 seconds
- [ ] Social login creates account or links to existing email match
- [ ] Token refresh is transparent to user; re-login required after 7 days inactivity
- [ ] Rate limit: 5 login attempts per 15 minutes per IP
- [ ] Deletion request triggers email confirmation and data retention notice

---

### 2.2 Guest Browse & Explore
**Priority: P0**

Allow unauthenticated users to browse and reduce friction to conversion.

| Aspect | Specification |
|--------|---------------|
| Accessible Content | Business listings, search, filters, map view, basic business details |
| Restricted Actions | Booking, favorites, reviews, appointment management |
| Prompt Strategy | Non-blocking "Book now?" CTA triggers auth modal; dismissible |
| Data Persistence | Guest session stored locally; merge on registration |

**Acceptance Criteria:**
- [ ] Guest sees identical search results and map as authenticated user
- [ ] Attempting to book opens auth modal with pre-filled context
- [ ] Post-auth, guest is redirected to intended action with state preserved
- [ ] Guest can browse up to 20 business detail pages before soft login prompt

---

### 2.3 Business Search & Discovery
**Priority: P0**

Powerful, fast search to match customers with relevant businesses.

| Aspect | Specification |
|--------|---------------|
| Search Inputs | Free text (business name, service), current location, or specified address |
| Filters | Service category, price range, rating (4.0+), availability today, gender of staff, amenities, distance radius (1-50km) |
| Sort Options | Relevance (default), distance, rating, price (low-high) |
| Results Display | Card list with thumbnail, name, rating, distance, starting price, next available slot |
| Pagination | Cursor-based, 20 results per page |
| Search History | Store last 10 searches per user; clearable |
| Popular Searches | Trending in area, shown as quick chips |

**Acceptance Criteria:**
- [ ] Search returns results in <500ms for 95th percentile
- [ ] Empty state suggests nearby alternatives or popular searches
- [ ] Active filters persist during session, clearable with one tap
- [ ] Results update in real-time as filters change (debounced 300ms)
- [ ] Search handles typos via fuzzy matching (Levenshtein distance ≤2)

---

### 2.4 Map-based Search
**Priority: P0**

Visual discovery of businesses by geographic proximity.

| Aspect | Specification |
|--------|---------------|
| Map Provider | Mapbox (cost-effective, customizable) |
| Default View | User's current location with 5km radius |
| Markers | Category-colored pins; cluster at zoom <12 |
| Marker Interaction | Tap reveals mini-card; tap card navigates to detail |
| List/Map Toggle | Persistent bottom sheet with draggable list overlay |
| Location Permission | Requested contextually; fallback to city-center |
| Bounds Search | Automatically query as map moves; debounced 500ms |

**Acceptance Criteria:**
- [ ] Map renders with <2s initial load on 4G
- [ ] Clustering handles 500+ markers without performance degradation
- [ ] User location dot updates every 5 seconds when active
- [ ] Tapping "Re-center" returns to current location with 500m zoom
- [ ] Offline: cached tiles display with "offline mode" banner

---

### 2.5 Business Detail View
**Priority: P0**

Comprehensive information to drive booking decisions.

| Section | Content |
|---------|---------|
| Hero | Image carousel (up to 10), business name, rating, review count, favorite toggle |
| Quick Actions | Call, directions, share, website link |
| Info | Address, hours (with "Open now" indicator), description, amenities tags |
| Services | Expandable categories, each service with duration, price, description |
| Team | Staff profiles with photos, specialties, ratings |
| Reviews | Aggregate rating breakdown, sortable reviews, "Verified visit" badge |
| Availability | Inline mini-calendar showing next 3 available days |

**Acceptance Criteria:**
- [ ] Images lazy-load with blur placeholder; full-screen gallery on tap
- [ ] "Open now" updates without page refresh; next opening time shown if closed
- [ ] Services filterable by category; selecting pre-fills booking flow
- [ ] Deep link to any business detail works cross-platform
- [ ] Share generates preview image with business info

---

### 2.6 Service Categories
**Priority: P0**

Hierarchical taxonomy for service organization and discovery.

| Level | Examples |
|-------|----------|
| Root | Hair, Nails, Face, Body, Massage, Medical Aesthetic |
| Sub | Hair: Cut, Color, Styling, Treatment |
| Service | Women's Haircut, Balayage, Bridal Updo, Keratin Treatment |

| Aspect | Specification |
|--------|---------------|
| Category Icons | Consistent SVG set, color-coded by root category |
| Business Assignment | Up to 5 primary categories; unlimited services |
| Search Relevance | Category match boosts search ranking |
| Trending | Algorithm surfaces rising categories by booking volume |

**Acceptance Criteria:**
- [ ] Category tree is navigable in 3 taps from home
- [ ] Business can be found searching any level of category hierarchy
- [ ] Category icons are accessible (alt text, sufficient contrast)
- [ ] New categories require admin approval; 24hr SLA

---

### 2.7 Booking Flow
**Priority: P0**

Frictionless conversion from interest to confirmed appointment.

| Step | Action | Details |
|------|--------|---------|
| 1 | Select Service | From business detail or re-book from history |
| 2 | Choose Provider | Any available staff, or "No preference" for fastest |
| 3 | Pick Date/Time | Calendar view with available slots; scroll 4 weeks |
| 4 | Add Details | Notes for provider, coupon code, gift card |
| 5 | Review & Confirm | Summary with cancellation policy, payment method |
| 6 | Confirmation | Booking ID, calendar invite, add to native calendar |

| Aspect | Specification |
|--------|---------------|
| Slot Resolution | 15-minute increments |
| Concurrent Holds | 10-minute hold on selected slot during flow |
| Waitlist | Offer if preferred slot unavailable; notify on cancellation |
| Guest Booking | Require name, phone, email; prompt account creation post-booking |
| Modification | Reschedule or cancel per business policy (up to 24h before) |

**Acceptance Criteria:**
- [ ] Complete booking in <60 seconds for returning user with saved payment
- [ ] Slot availability is real-time; double-booking prevented via optimistic locking
- [ ] Hold expires with countdown UI; auto-release triggers notification
- [ ] Cancellation policy displayed prominently; enforced automatically
- [ ] Confirmation email/SMS sent within 30 seconds

---

### 2.8 Appointment Management
**Priority: P0**

Central hub for customer appointment lifecycle.

| View | Content |
|------|---------|
| Upcoming | Next 7 days highlighted; all future appointments |
| Past | Completed, no-show, cancelled; rebook button |
| Detail | Business info, service, provider, time, QR code check-in, directions, modify/cancel |

| Action | Specification |
|--------|---------------|
| Reschedule | Available slots within business rules; same flow as booking |
| Cancel | Reason selection (optional); refund per policy |
| Rebook | One-tap to same service/provider with date picker |
| Reminders | Push + SMS at 24h, 2h, 15min before |

**Acceptance Criteria:**
- [ ] Upcoming appointments sync to native calendar (optional, opt-in)
- [ ] QR code generated 1 hour before; scannable by business for check-in
- [ ] Late cancellation (>policy) shows fee warning with explicit confirmation
- [ ] No-show tracked; 3 no-shows triggers account review

---

### 2.9 Favorites
**Priority: P1**

Personalized list for quick re-access and rebooking.

| Aspect | Specification |
|--------|---------------|
| Add | Heart toggle from search results or business detail |
| List View | Thumbnail, name, next availability, starting price |
| Organization | Manual sort; no folders (MVP) |
| Notifications | Opt-in for "new availability" or "promotion" from favorited business |
| Sync | Cross-device within 5 seconds of action |
| Limit | 200 favorites per user |

**Acceptance Criteria:**
- [ ] Heart state updates optimistically; reverts on failure with toast
- [ ] Empty state suggests nearby popular businesses
- [ ] Removing favorite shows undo for 5 seconds
- [ ] Favorited businesses slightly boosted in search ranking (personalized)

---

### 2.10 User Profile
**Priority: P1**

Customer identity and preferences management.

| Section | Content |
|---------|---------|
| Personal Info | Name, phone, email, profile photo, birthday (for offers) |
| Preferences | Notification settings, default booking reminders, payment methods |
| Payment | Saved cards (PCI-compliant tokenization via Stripe), billing history |
| Security | Password change, 2FA option, active sessions, login history |
| Data | Download personal data (GDPR), account deletion |
| Loyalty | Points balance, tier status, history |

**Acceptance Criteria:**
- [ ] Profile completion percentage shown; 80%+ unlocks "priority support"
- [ ] Phone number editable with re-verification
- [ ] Payment method can be set as default; requires CVV for first use
- [ ] Data export delivered via email within 24 hours

---

### 2.11 Availability & Slot Computation
**Priority: P0**

Core engine powering accurate, real-time booking capacity.

| Component | Specification |
|-----------|---------------|
| Business Hours | Weekly template + exceptions (holidays, temporary closures) |
| Staff Schedules | Individual availability, breaks, time off |
| Service Duration | Base duration + buffer (cleanup, setup) |
| Slot Generation | Pre-computed 30 days ahead; on-demand beyond |
| Booking Rules | Min advance notice (e.g., 2h), max advance (e.g., 60 days), gap filling |
| Buffer Types | Before (prep), after (cleanup), between (recovery) |
| Overbooking | Configurable; default disabled |

**Algorithm Requirements:**
- Slots computed from staff availability minus existing appointments minus buffers
- Multi-staff services (e.g., couples massage) require concurrent availability
- Recurring appointments generate series with individual modification
- Timezone-aware; stored in UTC, displayed in business locale

**Acceptance Criteria:**
- [ ] Slot query returns in <200ms for single staff, <500ms for "any staff"
- [ ] Booking commits atomically; race condition returns "slot taken" with alternatives
- [ ] Schedule changes (staff sick day) trigger re-computation and affected customer notifications
- [ ] Historical accuracy: 99.99% of displayed slots bookable without conflict

---

### 2.12 Shared Types & Design System
**Priority: P0**

Consistency across platforms for quality and velocity.

| Layer | Specification |
|-------|---------------|
| Design Tokens | Colors, typography, spacing, shadows, animations in Figma + code |
| Components | Button, Input, Card, Modal, Calendar, Time Picker, Toast, Skeleton |
| Icons | Phosphor Icons (consistent, customizable) |
| Theme | Light default; dark mode planned Q3 |
| Accessibility | WCAG 2.1 AA minimum; screen reader support, focus management, color contrast |
| Localization | i18n framework; EN, FR, ES for launch; RTL support in architecture |

**Technical Standards:**
- TypeScript strict mode; shared types package (`@planity/types`)
- API contracts defined in OpenAPI; client generated
- Component library: Storybook with visual regression testing

**Acceptance Criteria:**
- [ ] All UI components have Storybook stories with interactive states
- [ ] No custom one-off styles; all via design system tokens
- [ ] Accessibility audit score 90+ via automated testing (axe-core)
- [ ] Component usage tracked; deprecated components flagged in CI

---

### 2.13 Reviews & Ratings
**Priority: P1**

Social proof and quality assurance.

| Aspect | Specification |
|--------|---------------|
| Eligibility | Verified booking completion (no-show ineligible) |
| Rating | 1-5 stars, overall + category (service, ambiance, value, staff) |
| Content | Text (500 char max), photo (up to 5), optional staff mention |
| Moderation | Auto-flag profanity, images; human review within 24h |
| Response | Business owner can reply publicly once |
| Edit/Delete | Customer can edit within 30 days; delete anytime |
| Display | Chronological default; sort by recent, highest, lowest |

**Acceptance Criteria:**
- [ ] Review prompt sent 2 hours post-appointment via push; email fallback at 24h
- [ ] Aggregate rating recalculates within 5 minutes of new review
- [ ] Business average displayed to 1 decimal; exact on tap
- [ ] Fake review detection: ML model flags suspicious patterns for review

---

### 2.14 Payment Integration
**Priority: P0**

Secure, flexible payment processing.

| Aspect | Specification |
|--------|---------------|
| Provider | Stripe (primary), PayPal (secondary market) |
| Methods | Cards, Apple Pay, Google Pay, SEPA (EU), Buy Now Pay Later (Klarna) |
| Flow | Customer pays at booking; hold authorized, capture on service completion or 24h before |
| Business Payout | Weekly to connected account; instant payout option (fee) |
| Refunds | Full or partial via platform; automatic per cancellation policy |
| Invoicing | Business can generate invoice for corporate clients |
| Fees | Platform fee: 2.5% + €0.25 per transaction; payment processing passed through |

**Acceptance Criteria:**
- [ ] PCI compliance: no card data touches our servers (Stripe Elements)
- [ ] 3D Secure handled seamlessly; fallback to app authentication
- [ ] Failed payment retries with saved method; 3 attempts before cancellation
- [ ] Payout dashboard for business with transaction-level detail
- [ ] Tax calculation (VAT) automatic by jurisdiction

---

### 2.15 Notifications
**Priority: P1**

Multi-channel, preference-respecting communication.

| Channel | Use Cases |
|---------|-----------|
| Push | Booking confirmation, reminders, promotions, waitlist availability |
| SMS | Critical: booking changes, day-of reminders, 2FA |
| Email | Receipts, marketing (opt-in), account security, monthly summary |
| In-App | Feed of updates, promotions, loyalty milestones |

| Aspect | Specification |
|--------|---------------|
| Preferences | Granular per-channel, per-category; default all on for transactional |
| Delivery | Push via Firebase Cloud Messaging; SMS via Twilio; email via SendGrid |
| Batching | Marketing pushes batched max 1/day at optimal send time |
| Unsubscribe | One-tap for marketing; transactional always on |

**Acceptance Criteria:**
- [ ] Push delivery rate >95% for active devices; fallback to SMS for critical
- [ ] Notification deep-links to relevant screen with back navigation to home
- [ ] Preference changes effective within 60 seconds
- [ ] Quiet hours respected (default 22:00-08:00 local time)

---

### 2.16 Provider / Business Owner Portal
**Priority: P0**

Self-service business management platform.

| Module | Features |
|--------|----------|
| Dashboard | Today's appointments, revenue snapshot, occupancy rate, alerts |
| Calendar | Day/week/month views; drag-drop reschedule; color-coded by status |
| Services | CRUD services, pricing, duration, staff assignment, online visibility |
| Staff | Manage team, permissions (admin/receptionist/therapist), schedules |
| Clients | CRM view, visit history, notes, marketing tags |
| Bookings | All appointments, filter, export; manual booking entry |
| Settings | Business hours, cancellation policy, payment account, integrations |
| Analytics | Revenue, booking volume, no-show rate, popular services, staff utilization |

**Acceptance Criteria:**
- [ ] Portal responsive for tablet use in reception areas
- [ ] Calendar supports multi-staff view with conflict highlighting
- [ ] Manual booking sends confirmation to client automatically
- [ ] Staff can clock in/out; hours feed to payroll integration
- [ ] Data export to CSV/Excel for all lists

---

### 2.17 Admin Dashboard
**Priority: P1**

Platform operations and governance.

| Module | Features |
|--------|----------|
| Overview | KPIs: active users, bookings, GMV, churn, top categories |
| Businesses | Onboarding workflow, verification status, suspension, featured placement |
| Users | Search, profile view, booking history, manual support actions |
| Disputes | Refund requests, review disputes, escalation workflow |
| Content | Category management, featured collections, banner management |
| Finance | Transaction ledger, payout batching, fee structure adjustment |
| System | Feature flags, rate limits, maintenance mode, audit logs |

**Acceptance Criteria:**
- [ ] Role-based access: super_admin, finance, support, content_manager
- [ ] All destructive actions require confirmation and are audit-logged
- [ ] Support actions trigger email to affected user with explanation
- [ ] Dashboard loads primary KPIs in <3 seconds

---

### 2.18 Background Jobs (BullMQ)
**Priority: P0**

Reliable, scalable asynchronous processing.

| Queue | Jobs | Priority |
|-------|------|----------|
| `notifications` | Push/SMS/email delivery, retry with backoff | High |
| `bookings` | Slot release on hold expiry, reminder scheduling | High |
| `payments` | Payout calculation, failed payment retry, refund processing | High |
| `analytics` | Aggregation, report generation, ML feature computation | Medium |
| `images` | Upload processing, thumbnail generation, CDN invalidation | Medium |
| `exports` | User data download, business reports | Low |
| `maintenance` | Data cleanup, archive old data, health checks | Low |

| Aspect | Specification |
|--------|---------------|
| Retry Policy | Exponential backoff: 1min, 5min, 15min, 1hr, 4hrs; then dead letter |
| Monitoring | Dashboard: queue depth, processing rate, failed jobs, avg duration |
| Concurrency | Configurable per queue; scale workers independently |
| Idempotency | All jobs include idempotency key; duplicate detection |

**Acceptance Criteria:**
- [ ] 99.9% job completion rate; <0.1% dead letter without manual intervention
- [ ] Failed job retry does not cause duplicate side effects (idempotent)
- [ ] Queue depth alerting: warning at 1000, critical at 5000
- [ ] Job latency: 95th percentile <30 seconds for high priority

---

## 3. Non-Functional Requirements

| Area | Target |
|------|--------|
| Performance | App cold start <2s; screen render <100ms; API p95 <200ms |
| Availability | 99.9% uptime; scheduled maintenance <4hrs/month |
| Security | OWASP Top 10 mitigated; annual penetration test |
| Privacy | GDPR, CCPA compliant; data minimization by design |
| Scalability | Support 10M users, 100K businesses, 1M daily bookings |

---

## 4. Success Metrics

| Metric | Target |
|--------|--------|
| Booking Conversion | Guest 15%, Returning 35% |
| Search to Detail | 40% CTR |
| Detail to Booking | 25% |
| App Retention (D30) | 30% |
| Business NPS | >50 |
| Customer NPS | >60 |
| Support Tickets | <2% of transactions |

---

## 5. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Browse, Search, Map, Detail, Booking, Appointments, Payments, Business Portal | Month 1-3 |
| V1.1 | Favorites, Reviews, Notifications, Profile | Month 4 |
| V1.2 | Waitlist, Loyalty, Analytics, Admin Dashboard | Month 5-6 |
| V2.0 | AI Recommendations, Subscription Plans, Marketplace | Month 7-9 |

---

*Document Version: 1.0*
*Last Updated: 2024*
*Owner: Alex, Product Owner*