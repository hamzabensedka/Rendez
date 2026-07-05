# Planity Clone — Product Specification

## 1. Overview

### 1.1 Product Vision
A dual-sided marketplace connecting service-seeking customers with beauty, wellness, and health professionals. Customers discover, book, and manage appointments. Businesses manage schedules, services, and client relationships.

### 1.2 Target Users
- **Customers**: Individuals aged 18-55 seeking convenient appointment booking
- **Business Owners**: Salons, spas, barbershops, independent professionals
- **Admin**: Platform operators managing marketplace health

### 1.3 Success Metrics
- Booking conversion rate > 15%
- Search-to-book time < 3 minutes
- Business onboarding completion > 80%
- Customer retention (30-day) > 40%

---

## 2. Feature Specifications

### F1: User Authentication
**Priority**: P0 | **Effort**: Medium

#### Description
Secure identity system with multiple authentication methods, role-based access, and session management.

#### User Stories
- As a customer, I want to create an account quickly to start booking
- As a business owner, I want to register my business and access my portal
- As any user, I want to reset my password securely

#### Acceptance Criteria
- [ ] Registration via email/password, Google OAuth, Apple Sign-In
- [ ] Password requirements: min 8 chars, 1 uppercase nicode, 1 number, 1 special character
- [ ] Email verification required before booking; browsing allowed unverified
- [ ] JWT access tokens (15min expiry) + refresh tokens (7 days)
- [ ] Role assignment: `customer`, `business_owner`, `admin`
- [ ] Account lockout after 5 failed attempts; 30-minute cooldown
- [ ] "Remember me" extends session to 30 days
- [ ] Logout invalidates tokens on server (token blacklist)

#### Technical Notes
- Implement rate limiting: 5 requests/minute on auth endpoints
- Store password hashes with bcrypt (cost factor 12)

---

### F2: Guest Browse & Explore
**Priority**: P0 | **Effort**: Medium

#### Description
Unauthenticated users can discover businesses and services without commitment, reducing friction to registration.

#### User Stories
- As a visitor, I want to browse businesses without creating an account
- As a visitor, I want to see what's available before committing to sign up

#### Acceptance Criteria
- [ ] Full search and filter access without authentication
- [ ] Business detail pages fully viewable
- [ ] Reviews and ratings visible
- [ ] Service catalog and pricing displayed
- [ ] "Book Now" CTA prompts login/signup with return URL preserved
- [ ] Up to 3 business profile views trigger soft prompt to register
- [ ] No personal data collection beyond analytics (anonymous ID)

---

### F3: Business Search & Discovery
**Priority**: P0 | **Effort**: Large

#### Description
Intelligent search system with multi-faceted filtering to help customers find relevant businesses.

#### User Stories
- As a customer, I want to search by service type, location, and availability
- As a customer, I want to filter by price, rating, and distance

#### Acceptance Criteria
- [ ] Text search across: business name, service names, descriptions, tags
- [ ] Auto-complete with suggestions after 2 characters; debounced 300ms
- [ ] Filters: distance (1-50km), price range, rating (1-5 stars), availability (today, this week), service category, amenities
- [ ] Sort options: relevance (default), distance, rating, price (low-high), newest
- Hatch results with pagination (20 per page)
- [ ] "Near me" uses geolocation with fallback to city center
- [ ] Recent searches stored locally (last 10); clearable
- [ ] Empty state with suggested alternatives when no matches

#### Technical Notes
- Elasticsearch or PostgreSQL full-text search with trigram similarity
- Geospatial index on business locations

---

### F4: Map-based Search
**Priority**: P0 | **Effort**: Medium

#### Description
Visual discovery through interactive map with business clustering and detail popovers.

#### User Stories
- As a customer, I want to see businesses near me on a map
- As a customer, I want to explore a neighborhood visually

#### Acceptance Criteria
- [ ] Toggle between list and map views; persist preference
- [ ] Map bounds filter results dynamically (debounced 500ms)
- [ ] Business markers: distinct icon by category; color by availability (green = slots today, gray = none)
- [ ] Marker clustering for zoom levels > 12
- [ ] Click marker: popover with name, rating, price range, next available slot
- [ ] Popover CTA: "View Profile" or "Book Now"
- [ ] User location dot with accuracy radius
- [ ] Map supports satellite/street/hybrid layers

---

### F5: Business Detail View
**Priority**: P0 | **Effort**: Medium

#### Description
Comprehensive business profile converting interest to booking.

#### User Stories
- As a customer, I want to see all business information before booking
- As a customer, I want to understand services, prices, and availability

#### Acceptance Criteria
- [ ] Hero: business name, photos (up to 10), verified badge, favorite toggle
- [ ] Key info: address (with directions link), phone, hours, website, social links
- [ ] Services tab: list with name, duration, description, price; expandable for details
- [ ] Reviews tab: aggregate rating, distribution histogram, sortable reviews (newest, highest, lowest)
- [ ] Team tab: staff profiles with specialties and photos
- [ ] Availability tab: calendar with next 7 days' slots; quick-select date
- [ ] "Book" button sticky on mobile; prominent on desktop
- [ ] Share functionality (copy link, native share API)
- [ ] Report business option (content, fraud, other)

---

### F6: Service Categories
**Priority**: P0 | **Effort**: Small

#### Description
Hierarchical categorization for consistent organization and discovery.

#### Acceptance Criteria
- [ ] Predefined categories: Hair, Nails, Face & Skin, Massage, Barber, Spa, Medical Aesthetic, Fitness
- [ ] Subcategories: 3-5 per category (e.g., Hair > Cut, Color, Styling, Treatment)
- [ ] Business can select up to 3 primary categories; unlimited subcategories
- [ ] Category icons and color coding in UI
- [ ] Category pages with featured businesses and trending services
- [ ] SEO-optimized category landing pages

---

### F7: Booking Flow
**Priority**: P0 | **Effort**: Large

#### Description
Streamlined multi-step booking minimizing abandonment.

#### User Stories
- As a customer, I want to book an appointment in under 60 seconds
- As a customer, I want to see real-time availability

#### Acceptance Criteria
- [ ] Step 1: Service selection (from business profile or direct)
- [ ] Step 2: Staff preference (specific person or "no preference")
- [ ] Step 3: Date/time selection with live availability (see F11)
- [ ] Step 4: Customer details (auto-filled if logged in); notes field (500 chars)
- [ ] Step 5: Review and confirm with price breakdown
- [ ] Optional Step 6: Payment (if required by business; see F14)
- [ ] Confirmation screen with ICS file download, add-to-calendar links, share booking
- [ ] Booking held for 10 minutes during flow; released on timeout or abandonment
- [ ] Guest checkout: collect name, email, phone; create lightweight account
- [ ] Modification: allow date/time change up to 2 hours before if slots available

---

### F8: Appointment Management
**Priority**: P0 | **Effort**: Medium

#### Description
Customer and business views for appointment lifecycle.

#### Customer Acceptance Criteria
- [ ] Upcoming appointments list with countdown, rescheduling, cancellation
- [ ] Past appointments with rebook option
- [ ] Cancel: full refund if >24h; partial (50%) if 2-24h; no refund if <2h (configurable by business)
- [ ] Reschedule: same business, any future slot with availability

#### Business Acceptance Criteria
- [ ] Calendar view: day, week, month; drag-to-reschedule
- [ ] Appointment statuses: pending, confirmed, in-progress, completed, no-show, cancelled
- [ ] Quick actions: confirm, check-in, complete, cancel with reason
- [ ] Block time: recurring or one-off unavailability
- [ ] Walk-in support: add manual appointment

---

### F9: Favorites
**Priority**: P1 | **Effort**: Small

#### Description
Save and organize preferred businesses for quick reaccess.

#### Acceptance Criteria
- [ ] Heart toggle on business cards and detail pages
- [ ] Favorites list with search and sort (recently added, alphabetical, nearest)
- [ ] Quick-book from favorites: show next availability inline
- [ ] Push notification when favorite adds new service or promotion
- [ ] Maximum 200 favorites; prompt to organize when approaching limit
- [ ] Sync across devices for logged-in users

---

### F10: User Profile
**Priority**: P1 | **Effort**: Medium

#### Description
Customer identity and preference management.

#### Acceptance Criteria
- [ ] Profile photo, name, phone, email (editable with re-verification)
- [ ] Notification preferences: email, push, SMS; per-type toggles
- [ ] Payment methods: add, remove, set default (PCI-compliant token storage)
- [ ] Booking history: filterable, exportable (PDF receipt)
- [ ] Privacy settings: profile visibility, data download, account deletion (GDPR)
- [ ] Referral code and credits tracking

---

### F11: Availability & Slot Computation
**Priority**: P0 | **Effort**: Large

#### Description
Real-time, rule-based availability engine handling complex scheduling constraints.

#### Acceptance Criteria
- [ ] Business defines: operating hours per day, slot duration per service, buffer between appointments
- [ ] Staff-specific schedules and break times
- [ ] Service dependencies: some services require specific staff or equipment
- [ ] Concurrent booking limits: rooms, chairs, stations
- [ ] Slot computation accounts for existing appointments, blocks, and staff availability
- [ ] API response < 200ms for 7-day view; cached with 30-second TTL
- [ ] Handle timezone correctly: business timezone stored, converted for customer
- [ ] Overbooking protection: strict or configurable (e.g., 105% capacity)
- [ ] Recurring availability patterns with exception dates

---

### F12: Shared Types & Design System
**Priority**: P0 | **Effort**: Medium

#### Description
Consistent UI/UX foundation across platforms.

#### Acceptance Criteria
- [ ] Component library: buttons, inputs, cards, modals, date picker, time slot grid
- [ ] Color system: primary (brand), semantic (success, warning, error, info), neutrals
- [ ] Typography: 2-font system (display, body), 6-level scale
- [ ] Spacing: 8px base grid
- [ ] Accessibility: WCAG 2.1 AA minimum; focus states, ARIA labels, screen reader support
- [ ] Dark mode support with system preference detection
- [ ] Animation standards: 150ms micro-interactions, 300ms transitions
- [ ] Shared TypeScript types: strict, documented, versioned

---

### F13: Reviews & Ratings
**Priority**: P1 | **Effort**: Medium

#### Description
Trust and quality signal through verified customer feedback.

#### Acceptance Criteria
- [ ] Eligibility: customer can review after completed appointment; 14-day window
- [ ] Rating: 1-5 stars with half-star precision
- [ ] Review: 10-1000 characters, optional photo upload (max 5)
- [ ] Business can respond once; customer can update review once
- [ ] Moderation: auto-flag profanity; manual review queue for reports
- [ ] Rating aggregation: weighted recency (recent reviews weighted 2x)
- [ ] Sort and filter reviews by rating, date, with photos, verified only
- [ ] Anonymous option: display "Verified Customer" instead of name

---

### F14: Payment Integration
**Priority**: P0 | **Effort**: Large

#### Description
Flexible payment handling for deposits, full payments, and no-show protection.

#### Acceptance Criteria
- [ ] Stripe Connect: platform collects, distributes to business accounts
- [ ] Payment models: free booking, deposit (fixed or %), full prepay, card-on-file (no charge)
- [ ] Supported methods: credit/debit, Apple Pay, Google Pay, iDEAL, Bancontact (EU focus)
- [ ] Refund processing: automatic per cancellation policy; manual override by business
- [ ] Receipts: email and in-app; VAT details if applicable
- [ ] Failed payment handling: 3 retries, notify customer, auto-cancel if unresolved in 24h
- [ ] Payout schedule: business-configurable (daily, weekly, monthly)
- [ ] Financial reporting: transaction history, fees, net payouts

---

### F15: Notifications
**Priority**: P1 | **Effort**: Medium

#### Description
Multi-channel, preference-aware communication system.

#### Acceptance Criteria
- [ ] Channels: push (mobile), email, SMS; user-configurable per type
- [ ] Notification types:
  - Booking: confirmation, reminder (24h, 2h before), modification, cancellation
  - Marketing: promotions, new services from favorites (opt-in required)
  - System: password reset, security alerts, policy updates
- [ ] Delivery reliability: retry with exponential backoff; fallback to next channel if primary fails
- [ ] Deep linking: notification opens relevant screen
- [ ] Batch digest option for non-urgent notifications (daily summary)
- [ ] Unsubscribe: one-click for marketing; support contact for transactional

---

### F16: Provider / Business Owner Portal
**Priority**: P0 | **Effort**: Large

#### Description
Comprehensive business management interface.

#### Acceptance Criteria
- [ ] Dashboard: upcoming appointments, revenue today/this week, occupancy rate, recent reviews
- [ ] Service management: CRUD services, pricing, duration, staff associations
- [ ] Staff management: profiles, schedules, permissions (view-only, manage bookings, admin)
- [ ] Client management: CRM view, notes, visit history, marketing tags
- [ ] Analytics: booking volume, revenue, cancellation rate, popular services, peak hours
- [ ] Settings: business hours, cancellation policy, payment requirements, integrations
- [ ] Multi-location support: switch between locations, consolidated reporting
- [ ] Mobile-responsive: full functionality on tablet and phone

---

### F17: Admin Dashboard
**Priority**: P1 | **Effort**: Large

#### Description
Platform oversight and operational management.

#### Acceptance Criteria
- [ ] User management: search, view, suspend, impersonate (audit logged)
- [ ] Business verification: onboarding queue, document review, approve/reject with reason
- [ ] Content moderation: reported reviews, businesses, users; action with audit trail
- [ ] Financial oversight: transaction monitoring, dispute handling, payout tracking
- [ ] Analytics: MAU, booking volume, GMV, churn, CAC, top categories, geographic distribution
- [ ] System health: job queue status, error rates, API latency
- [ ] Configuration: global settings, feature flags, maintenance mode
- [ ] Role-based access: super_admin, support, finance, marketing

---

### F18: Background Jobs (BullMQ)
**Priority**: P0 | **Effort**: Medium

#### Description
Reliable asynchronous processing for time-sensitive and resource-intensive operations.

#### Acceptance Criteria
- [ ] Job types and priorities:
  - **Critical**: payment processing, booking confirmation (immediate)
  - **High**: notification dispatch, email sending (< 1 min delay)
  - **Medium**: report generation, data exports, search index updates (< 5 min)
  - **Low**: analytics aggregation, data cleanup, log archival (< 1 hour)
- [ ] Retry policy: 3 attempts with exponential backoff; dead letter queue after failure
- [ ] Job idempotency: duplicate execution produces same result
- [ ] Monitoring: dashboard showing queue depths, processing rates, failures, average wait time
- [ ] Alerting: PagerDuty integration for critical queue depth > 100 or job age > 5 minutes
- [ ] Scheduled jobs: daily reports, weekly summaries, monthly billing cycle

---

## 3. Non-Functional Requirements

| Aspect | Requirement |
|--------|-------------|
| Performance | P95 API response < 200ms; page load < 2s (3G) |
| Scalability | Horizontal scaling to 10M monthly active users |
| Security | OWASP Top 10 mitigation; annual penetration test |
| Compliance | GDPR, CCPA, PCI-DSS Level 1 |
| Reliability | 99.9% uptime SLA; < 0.1% error rate |

## 4. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | F1-F5, F7, F8, F11, F12, F14, F16, F18 | 8 weeks |
| v1.1 | F6, F9, F10, F13, F15 | +4 weeks |
| v1.2 | F17, analytics enhancement, mobile apps | +6 weeks |

## 5. Appendix

- **Glossary**: Slot = bookable time period; Business = service provider; Provider = business owner/staff
- **Reference**: [Planity](https://www.planity.com) for competitive feature parity
