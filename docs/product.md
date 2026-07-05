# Planity Clone — Product Specification

## 1. Overview

A mobile-first platform connecting customers with local beauty/wellness businesses for appointment booking. Two-sided marketplace: consumer app + business owner portal.

---

## 2. User Personas

| ID | Persona | Goals |
|----|---------|-------|
| P1 | Customer | Discover, book, manage appointments |
| P2 | Business Owner | Manage schedule, services, staff |
| P3 | Admin | Platform oversight, support, analytics |

---

## 3. Feature Specifications

### 3.1 User Authentication [Priority: P0]

**Description:** Secure identity management for all user types.

**Acceptance Criteria:**
- AC1.1: Email/password registration with validation (email format, password ≥8 chars, 1 uppercase, 1 number)
- AC1.2: Login with JWT tokens, refresh token rotation
- AC1.3: OAuth 2.0 (Google, Apple) for customers
- AC1.4: Password reset via email with 1-hour expiry link
- AC1.5: Account verification email before first booking
- AC1.6: Biometric login (Face ID/Touch ID) optional post-first login
- AC1.7: Role-based access: customer, business_owner, admin, staff
- AC1.8: Session timeout after 30 min inactivity

**Out of Scope:** Phone number authentication (future v2)

---

### 3.2 Guest Browse & Explore [Priority: P0]

**Description:** Allow unauthenticated users to browse businesses before committing to registration.

**Acceptance Criteria:**
- AC2.1: View business listings without login
- AC2.2: Search by service category, location, date
- AC2.3: View business detail page (read-only: services, reviews, photos, hours)
- AC2.4: "Book Now" CTA triggers login modal with return URL preserved
- AC2.5: Guest search state persisted in localStorage for 7 days
- AC2.6: Maximum 10 business detail views before registration prompt

---

### 3.3 Business Search & Discovery [Priority: P0]

**Description:** Find businesses through multiple entry points.

**Acceptance Criteria:**
- AC3.1: Full-text search across business name, service name, description
- AC3.2: Autocomplete with top 5 suggestions, debounced 300ms
- AC3.3: Filters: category, price range, rating (≥4.0, ≥4.5), distance, availability today/open now
- AC3.4: Sort options: relevance, distance, rating, price (low-high)
- AC3.5: Pagination: 20 results per page, infinite scroll on mobile
- AC3.6: Recent searches stored (max 10), clearable
- AC3.7: "Near Me" uses geolocation with fallback to manual city selection
- AC3.8: Empty state with category suggestions when no results

---

### 3.4 Map-based Search [Priority: P0]

**Description:** Visual exploration of businesses on interactive map.

**Acceptance Criteria:**
- AC4.1: Toggle between list and map views
- AC4.2: Clustered pins at zoom levels (cluster count visible)
- AC4.3: Pin tap reveals business card with name, rating, price from
- AC4.4: Map bounds trigger re-query (debounced 500ms)
- AC4.5: User location dot with accuracy radius
- AC4.6: "Re-center" button after manual pan
- AC4.7: Business card CTA navigates to detail or booking

---

### 3.5 Business Detail View [Priority: P0]

**Description:** Comprehensive business information page.

**Acceptance Criteria:**
- AC5.1: Photo gallery (max 10, swipeable, pinch-to-zoom)
- AC5.2: Business info: name, verified badge, rating, review count, address, hours, phone
- AC5.3: Service menu with categories, durations, prices
- AC5.4: Staff/professional list with photos, specialties, ratings
- AC5.5: "Book" button per service or per staff member
- AC5.6: Share business via native share sheet
- AC5.7: Report business for policy violations
- AC5.8: Average load time <2s on 3G

---

### 3.6 Service Categories [Priority: P0]

**Description:** Hierarchical classification for discovery and business setup.

**Acceptance Criteria:**
- AC6.1: Predefined categories: Hair, Nails, Face, Body, Massage, Wellness
- AC6.2: Subcategories (e.g., Hair > Cut, Color, Styling)
- AC6.3: Business can assign services to multiple categories
- AC6.4: Category icons consistent in search, filters, and business portal
- AC6.5: Admin can add/edit categories without code deploy
- AC6.6: Category analytics: search volume, conversion rate

---

### 3.7 Booking Flow [Priority: P0]

**Description:** Core conversion flow for appointment reservation.

**Acceptance Criteria:**
- AC7.1: Step 1: Select service (or bundle multiple services)
- AC7.2: Step 2: Select staff member or "no preference"
- AC7.3: Step 3: Date picker with availability visualization (green/orange/red density)
- AC7.4: Step 4: Time slot selection (15-min increments, respecting business hours)
- AC7.5: Step 5: Review and confirm (service, staff, time, price, cancellation policy)
- AC7.6: Step 6: Payment or "pay at venue" option
- AC7.7: Booking confirmation with calendar invite (.ics) and QR code
- AC7.8: Hold slot for 10 min during payment; release on timeout or abandonment
- AC7.9: Guest checkout: collect name, phone, email; auto-create account post-booking
- AC7.10: Reschedule link in confirmation (up to business cancellation policy)

---

### 3.8 Appointment Management [Priority: P0]

**Description:** Post-booking lifecycle for customers and businesses.

**Acceptance Criteria:**
- AC8.1: Customer: view upcoming/past appointments in chronological list
- AC8.2: Customer: cancel with reason selection (24h before default policy)
- AC8.3: Customer: reschedule to new available slot (same business, same service type)
- AC8.4: Business: calendar view (day/week/month) with appointment status colors
- AC8.5: Business: create manual bookings (walk-ins, phone bookings)
- AC8.6: Business: block time (breaks, unavailability)
- AC8.7: Business: mark no-show with automated follow-up
- AC8.8: Status transitions: pending → confirmed → completed / cancelled / no-show
- AC8.9: Sync to Google/Outlook calendar (customer and business)

---

### 3.9 Favorites [Priority: P1]

**Description:** Save preferred businesses for quick rebooking.

**Acceptance Criteria:**
- AC9.1: Heart icon on business card and detail page
- AC9.2: Favorites list with quick-book CTA
- AC9.3: Push notification on new availability or promotion from favorited business
- AC9.4: Maximum 200 favorites; prompt to organize/remove at limit
- AC9.5: Sync across devices for logged-in users

---

### 3.10 User Profile [Priority: P1]

**Description:** Customer identity and preferences.

**Acceptance Criteria:**
- AC10.1: Profile photo, name, phone, email (editable)
- AC10.2: Preferred notification channels (push, SMS, email)
- AC10.3: Payment methods (save for reuse, PCI-compliant tokenization)
- AC10.4: Booking history with reorder capability
- AC10.5: Preferred staff members per business
- AC10.6: Data export (GDPR) and account deletion
- AC10.7: Referral code and rewards tracking

---

### 3.11 Availability & Slot Computation [Priority: P0]

**Description:** Real-time accurate availability engine.

**Acceptance Criteria:**
- AC11.1: Business defines: operating hours, staff schedules, service durations, buffer times
- AC11.2: Slot generation accounts for existing bookings, blocks, staff breaks
- AC11.3: Concurrent booking prevention (optimistic locking)
- AC11.4: Cache availability with 30-second TTL; invalidate on booking mutation
- AC11.5: Handle timezone correctly (business timezone stored, display in user timezone)
- AC11.6: Support recurring availability patterns and exceptions (holidays)
- AC11.7: Last-slot cutoff: prevent booking within X minutes of slot start (configurable)

---

### 3.12 Shared Types & Design System [Priority: P0]

**Description:** Consistent UI/UX across platforms.

**Acceptance Criteria:**
- AC12.1: Component library: buttons, inputs, cards, modals, date picker, time selector
- AC12.2: Color tokens: primary (#6C5CE7), success, warning, error, neutrals
- AC12.3: Typography scale: 12 levels from caption to H1
- AC12.4: Spacing system: 4px base grid
- AC12.5: Shared TypeScript types between frontend and API (monorepo)
- AC12.6: Accessibility: WCAG 2.1 AA minimum (contrast, focus states, screen reader labels)
- AC12.7: Dark mode support
- AC12.8: Storybook documentation for all components

---

### 3.13 Reviews & Ratings [Priority: P1]

**Description:** Social proof and quality feedback loop.

**Acceptance Criteria:**
- AC13.1: Post-review eligibility: completed appointment, within 14 days
- AC13.2: Rating: 1-5 stars, mandatory; text review optional (min 20 chars if provided)
- AC13.3: Categories: service quality, staff, ambiance, value
- AC13.4: Business owner can respond publicly
- AC13.5: Flag inappropriate reviews for admin moderation
- AC13.6: Average rating recalculated on new review; display count
- AC13.7: Sort reviews: most helpful, most recent, highest/lowest rating
- AC13.8: Verified purchase badge on reviews

---

### 3.14 Payment Integration [Priority: P0]

**Description:** Secure transaction processing.

**Acceptance Criteria:**
- AC14.1: Stripe integration: card payments, Apple Pay, Google Pay
- AC14.2: Full payment at booking OR deposit with balance at venue
- AC14.3: No-show charge: configurable percentage (default 50%)
- AC14.4: Refund processing: automatic (policy-based) or manual (admin)
- AC14.5: Receipt emailed with transaction ID
- AC14.6: PCI compliance: never store raw card data (use Stripe Elements)
- AC14.7: Webhook handling for payment status updates
- AC14.8: Failed payment retry with alternative method suggestion

---

### 3.15 Notifications [Priority: P1]

**Description:** Multi-channel user engagement.

**Acceptance Criteria:**
- AC15.1: Push notifications: booking confirmed, reminder (24h, 2h before), cancelled, promotional
- AC15.2: SMS: critical only (booking changes, day-of reminder)
- AC15.3: Email: confirmation, receipt, review request (post-appointment), marketing (opt-in)
- AC15.4: In-app notification center with unread badge
- AC15.5: User preference controls per channel and notification type
- AC15.6: Notification templates editable by admin (no code deploy)
- AC15.7: Delivery tracking: sent, delivered, opened metrics

---

### 3.16 Provider / Business Owner Portal [Priority: P0]

**Description:** Web-based management for business operations.

**Acceptance Criteria:**
- AC16.1: Dashboard: today's appointments, revenue this week, upcoming week preview
- AC16.2: Service management: CRUD services with variants (e.g., men's/women's cut)
- AC16.3: Staff management: profiles, schedules, permissions (view own / manage all)
- AC16.4: Availability rules: standard hours, exceptions, time off requests
- AC16.5: Booking settings: lead time, cancellation policy, deposit requirement
- AC16.6: Client management: view history, notes, contact info, blacklist capability
- AC16.7: Reports: appointments, revenue, no-shows, popular services (exportable CSV)
- AC16.8: Multiple location support with location switcher

---

### 3.17 Admin Dashboard [Priority: P1]

**Description:** Platform governance and operations.

**Acceptance Criteria:**
- AC17.1: Business onboarding: approval workflow, verification document upload
- AC17.2: User management: search, view, suspend, impersonate
- AC17.3: Content moderation: review flagged reviews, businesses, images
- AC17.4: Financial: transaction overview, payout scheduling, dispute handling
- AC17.5: Analytics: MAU, booking conversion, GMV, top categories, churn
- AC17.6: System health: queue depths, error rates, API latency
- AC17.7: Feature flags: enable/disable features per business or globally
- AC17.8: Audit log: all admin actions with actor and timestamp

---

### 3.18 Background Jobs (BullMQ) [Priority: P0]

**Description:** Asynchronous task processing for reliability and performance.

**Acceptance Criteria:**
- AC18.1: Job types defined: email_send, sms_send, push_notification, payment_webhook, availability_cache_warm, report_generation, data_export
- AC18.2: Retry policy: 3 attempts with exponential backoff (job-specific override allowed)
- AC18.3: Dead letter queue for failed jobs after retries exhausted; admin alert
- AC18.4: Scheduled jobs: daily reports, nightly availability pre-computation, review request emails
- AC18.5: Job priority: payment processing > notifications > reports
- AC18.6: Monitoring: queue depth, processing rate, average job duration, failure rate
- AC18.7: Idempotency keys for payment-related jobs
- AC18.8: Graceful shutdown: finish in-progress jobs before process exit

---

## 4. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | API p95 < 200ms; page load < 3s on 4G |
| Scalability | Support 10k concurrent users; 100 bookings/min |
| Security | OWASP Top 10; SOC 2 Type II target year 2 |
| Compliance | GDPR, CCPA; PCI DSS via Stripe |
| Reliability | 99.9% uptime; < 0.1% booking failure rate |

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion rate | > 15% |
| Search-to-book time | < 5 minutes |
| App store rating | > 4.5 |
| Business NPS | > 50 |
| Customer retention (30d) | > 40% |

## 6. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | 3.1, 3.2, 3.3, 3.5, 3.7, 3.8, 3.11, 3.14, 3.16, 3.18 | 8 weeks |
| v1.1 | 3.4, 3.6, 3.9, 3.10, 3.12 | 4 weeks |
| v1.2 | 3.13, 3.15, 3.17 | 4 weeks |
| v2.0 | Subscriptions, loyalty, AI recommendations | Q3 |

---

*Document version: 1.0 | Last updated: [Date] | Owner: Alex (Product)*