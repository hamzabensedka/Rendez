# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first platform connecting customers with local service businesses (salons, barbershops, spas, clinics). Customers discover, book, and manage appointments. Business owners manage their calendar, services, and clientele. Admins oversee platform health and growth.

**Target Users:** Customers seeking beauty/wellness services; Business owners managing appointments; Platform administrators.

**Platforms:** iOS, Android, Web (responsive).

---

## 2. Feature Specifications

### 2.1 User Authentication

**Priority:** P0 — Critical

**Description:** Secure, frictionless identity system supporting multiple entry points.

**User Stories:**
- As a new user, I want to register with email/phone so I can create an account.
- As a returning user, I want to log in quickly so I can access my bookings.
- As a privacy-conscious user, I want to continue as guest so I can browse without commitment.

**Acceptance Criteria:**
- [ ] Users can register via email + password, phone + OTP, or OAuth (Google, Apple, Facebook).
- [ ] Password minimum: 8 chars, 1 uppercase, 1 number, 1 special character.
- [ ] JWT access token (15min expiry) + refresh token (7 days) with secure httpOnly cookie storage.
- [ ] "Continue as Guest" button on onboarding; guest data persists locally and prompts account creation at booking.
- [ ] Account linking: merging guest cart/bookings upon registration.
- [ ] Biometric login (Face ID/Touch ID) enabled after first successful password login.
- [ ] "Forgot Password" flow with 6-digit code via email/SMS, expires in 10 minutes.
- [ ] Rate limiting: 5 failed attempts triggers 30-minute lockout + email notification.

**Non-Functional:**
- Auth endpoints respond < 500ms (p95).
- OAuth redirect completes in < 3 seconds.

---

### 2.2 Guest Browse & Explore

**Priority:** P0 — Critical

**Description:** Unauthenticated discovery experience maximizing conversion to registered users.

**User Stories:**
- As a guest, I want to browse businesses without creating an account.
- As a guest, I want to see my location-based results so I find nearby services.

**Acceptance Criteria:**
- [ ] Full search, filter, and map functionality available without login.
- [ ] Business detail pages accessible; "Book Now" CTA triggers auth modal with pre-filled context.
- [ ] Guest favorites stored in localStorage; prompt to save on account creation.
- [ ] Guest booking data (selected service, time, business) retained for 7 days post-account creation.
- [ ] Sticky banner: "Create account to save your favorites and manage bookings" — dismissible for 24h.

---

### 2.3 Business Search & Discovery

**Priority:** P0 — Critical

**Description:** Intelligent search and filtering to help users find ideal businesses.

**User Stories:**
- As a customer, I want to search by service name, business name, or treatment type.
- As a customer, I want to filter by availability, price, rating, and distance.

**Acceptance Criteria:**
- [ ] Search supports: text input with autocomplete (business names, services, neighborhoods).
- [ ] Filters: distance (0.5km–50km), price range, rating (1–5 stars), availability ("Available today", "This weekend"), service category, amenities (parking, wheelchair accessible, accepts card).
- [ ] Sort options: relevance, distance, rating (highest first), price (lowest/highest), availability (soonest).
- [ ] Results display: card with image, name, rating, distance, price range, next available slot.
- [ ] Empty state with suggested nearby alternatives when no results match.
- [ ] Search history saved (last 10 searches), clearable.
- [ ] Voice search capability on mobile.

**Performance:**
- Search results return < 800ms (p95).
- Debounce autocomplete at 150ms.

---

### 2.4 Map-based Search

**Priority:** P0 — Critical

**Description:** Visual geographic exploration of available businesses.

**User Stories:**
- As a customer, I want to see businesses on a map so I choose by location.
- As a customer, I want to explore a different area by panning the map.

**Acceptance Criteria:**
- [ ] Default map view centers on user GPS location or last searched address.
- [ ] Clustered pins at zoomed-out levels; individual pins at zoomed-in levels.
- [ ] Pin color coding: green (available today), yellow (available this week), gray (limited availability).
- [ ] Tap pin reveals bottom sheet with business summary, image, rating, and "View" CTA.
- [ ] Map and list views toggle-able; state synchronized (filters, search query persist).
- [ ] "Search this area" button appears after map pan; triggers new query for visible bounds.
- [ ] User location dot with accuracy ring; permission request with value proposition.
- [ ] Offline: cached map tiles for previously viewed areas; businesses cached with last-known availability.

---

### 2.5 Business Detail View

**Priority:** P0 — Critical

**Description:** Comprehensive business profile driving booking conversion.

**User Stories:**
- As a customer, I want to see all business information before booking.
- As a customer, I want to see real availability to make informed decisions.

**Acceptance Criteria:**
- [ ] Header: business name, verified badge, overall rating, review count, favorite toggle.
- [ ] Image gallery: up to 10 photos, swipeable, pinch-to-zoom.
- [ ] Info section: address (with directions link), hours, phone, website, amenities, COVID-19 protocols.
- [ ] Services tab: categorized list with name, duration, description, price. Expandable for details.
- [ ] Team tab: staff profiles with photo, bio, specialties, individual ratings.
- [ ] Reviews tab: sortable (newest, highest, lowest), filterable by service, photo reviews highlighted.
- [ ] Availability widget: date picker (next 30 days default), time slots for selected service + staff.
- [ ] "Book Now" CTA sticky at bottom; pre-selects service if tapped from service card.
- [ ] Share functionality: native share sheet, copy link, QR code.
- [ ] Similar businesses carousel at bottom.

---

### 2.6 Service Categories

**Priority:** P0 — Critical

**Description:** Hierarchical classification for discoverability and business management.

**User Stories:**
- As a customer, I want to browse by category so I find the right service type.
- As a business owner, I want to categorize my services for better discovery.

**Acceptance Criteria:**
- [ ] Predefined category tree: Hair (Cut, Color, Styling), Nails, Face (Facial, Makeup), Body (Massage, Waxing), Medical Aesthetic, Wellness.
- [ ] Each category has icon, hero image, and subcategory list.
- [ ] Business owners assign services to categories; can request new category (admin approval).
- [ ] Category pages show featured businesses, trending services, educational content.
- [ ] Cross-category suggestions: "Customers who booked Hair Color also booked..."
- [ ] Category analytics visible to business owners: search volume, conversion rate.

---

### 2.7 Booking Flow

**Priority:** P0 — Critical

**Description:** Seamless, trustworthy appointment reservation with minimal friction.

**User Stories:**
- As a customer, I want to book an appointment in under 60 seconds.
- As a customer, I want to see all costs upfront before confirming.

**Acceptance Criteria:**
- [ ] Step 1 — Service Selection: single or multiple services (cart-style). Duration and price calculated dynamically.
- [ ] Step 2 — Staff Preference: specific staff, "any available," or category of staff (senior stylist).
- [ ] Step 3 — Date/Time: calendar view with available slots highlighted. Slot granularity matches service duration.
- [ ] Step 4 — Review: service summary, staff, time, location, total price, cancellation policy, add-ons (tip pre-selection, product purchase).
- [ ] Step 5 — Payment: see Payment Integration (2.14).
- [ ] Confirmation screen with booking reference, add-to-calendar, share, and "Book Again" shortcut.
- [ ] Guest checkout: collect name, phone, email; offer account creation post-booking.
- [ ] Booking modification: change time (up to 2 hours before), change staff (if slot available), add services.
- [ ] Booking cancellation: policy displayed at booking; refund processed per business terms.
- [ ] Waitlist: option to join waitlist for fully-booked slots; notification if opening occurs.

**Edge Cases:**
- Concurrent booking: pessimistic locking with 5-minute hold during checkout.
- Business closes or staff becomes unavailable mid-booking: graceful error with alternatives.

---

### 2.8 Appointment Management

**Priority:** P0 — Critical

**Description:** Central hub for customers to view and manage their bookings.

**User Stories:**
- As a customer, I want to see all my appointments at a glance.
- As a customer, I want to reschedule or cancel without calling.

**Acceptance Criteria:**
- [ ] Upcoming appointments list: chronological, grouped by month.
- [ ] Each card shows: business image, service name, date/time, staff name, status (confirmed, pending, completed, cancelled).
- [ ] Statuses: Confirmed, Pending (payment required), Completed, Cancelled by Customer, Cancelled by Business, No-show.
- [ ] Actions per appointment: reschedule (with availability check), cancel (with policy confirmation), rebook, contact business, get directions, add to calendar.
- [ ] Past appointments: searchable, rebookable, review-eligible (within 14 days of completion).
- [ ] Empty state for new users with CTA to browse.
- [ ] Push notification deep-links to specific appointment detail.

---

### 2.9 Favorites

**Priority:** P1 — High

**Description:** Save and organize preferred businesses for quick re-access.

**User Stories:**
- As a customer, I want to save my favorite businesses.
- As a customer, I want to be notified about my favorites' availability and offers.

**Acceptance Criteria:**
- [ ] Heart toggle on business cards, detail pages, and search results.
- [ ] Favorites list: grid/list view, sortable (recently added, alphabetical, nearest).
- [ ] Collections: user-created lists ("My Regular Spots," "To Try").
- [ ] Smart alerts: notify when favorite has new availability, price drop, or special offer.
- [ ] Synchronization across devices for logged-in users.
- [ ] Maximum 500 favorites per user; prompt to organize into collections.

---

### 2.10 User Profile

**Priority:** P1 — High

**Description:** Personal identity, preferences, and account management.

**User Stories:**
- As a user, I want to manage my personal information.
- As a user, I want to set preferences for a personalized experience.

**Acceptance Criteria:**
- [ ] Profile photo, name, phone, email, date of birth (for birthday offers), gender (optional, for service recommendations).
- [ ] Addresses: home, work, other — with default for map centering.
- [ ] Preferences: notification settings (push, email, SMS), language, currency, accessibility needs.
- [ ] Payment methods: see Payment Integration (2.14).
- [ ] Privacy: data download (GDPR), account deletion with 30-day grace period.
- [ ] Loyalty: points balance, tier status, history.
- [ ] Referral code: shareable link, reward tracking.

---

### 2.11 Availability & Slot Computation

**Priority:** P0 — Critical

**Description:** Core engine determining bookable time slots with complex business rules.

**User Stories:**
- As a business owner, I want accurate availability without double-bookings.
- As a customer, I want to see only genuinely available slots.

**Acceptance Criteria:**
- [ ] Business defines: operating hours per day, break times, holidays, special hours.
- [ ] Staff-level availability: working hours, breaks, time off, services qualified for.
- [ ] Service constraints: duration, buffer time before/after, equipment needed, room required.
- [ ] Slot computation accounts for: existing bookings, staff unavailability, service conflicts (same staff, same room), business rules (max advance booking, min notice).
- [ ] Real-time availability: computed on-demand with < 200ms response; cached with 30-second TTL.
- [ ] Complex scenarios: multi-service booking (sequential or parallel), group booking (multiple customers, one time slot), recurring appointment series.
- [ ] Overbooking protection: strict pessimistic locking; no overbooking even with concurrent requests.
- [ ] Admin override: business owner can block slots, release holds, or manually book.

---

### 2.12 Shared Types & Design System

**Priority:** P0 — Critical

**Description:** Consistent, accessible UI/UX across all platforms.

**User Stories:**
- As a user, I want a familiar, predictable interface.
- As a developer, I want reusable components for rapid, consistent development.

**Acceptance Criteria:**
- [ ] Design tokens: colors (primary #E91E63, secondary #00BCD4, semantic colors), typography (Inter font family, 6-scale system), spacing (4px grid), shadows, border-radius.
- [ ] Component library: buttons (5 variants, 3 sizes), inputs, cards, modals, bottom sheets, date pickers, time selectors, skeleton loaders, error states, empty states.
- [ ] Accessibility: WCAG 2.1 AA minimum; screen reader support, minimum touch targets 44x44dp, color contrast 4.5:1, reduced motion support.
- [ ] Dark mode: automatic (system preference) or manual toggle; all components support.
- [ ] Localization: i18n framework; initial languages EN, FR, DE, ES, IT.
- [ ] Shared TypeScript types: strict typing across frontend, backend, API contracts.
- [ ] Storybook documentation for all components.

---

### 2.13 Reviews & Ratings

**Priority:** P1 — High

**Description:** Social proof system building trust and quality feedback loop.

**User Stories:**
- As a customer, I want to read honest reviews before booking.
- As a customer, I want to share my experience after a visit.

**Acceptance Criteria:**
- [ ] Eligibility: verified booking completion required to leave review; 14-day window.
- [ ] Rating: 1–5 stars overall, plus optional sub-ratings (Service, Cleanliness, Value, Atmosphere).
- [ ] Review content: text (max 1000 chars), photo upload (max 5, 5MB each).
- [ ] Business owner response: public reply within 30 days; notification to reviewer.
- [ ] Moderation: auto-flag for profanity, images screened for inappropriate content; user report functionality.
- [ ] Review helpfulness: users can mark reviews as helpful; sort by helpfulness.
- [ ] Aggregate display: average rating, rating distribution histogram, recent vs. all-time toggle.
- [ ] Impact on search: rating factor in relevance scoring (not sole determinant).

---

### 2.14 Payment Integration

**Priority:** P0 — Critical

**Description:** Secure, flexible payment handling for bookings.

**User Stories:**
- As a customer, I want to pay securely with my preferred method.
- As a business owner, I want to receive payments reliably.

**Acceptance Criteria:**
- [ ] Payment methods: credit/debit cards (Stripe, Adyen), Apple Pay, Google Pay, PayPal, Klarna (pay in installments).
- [ ] Pricing models: pay in full, deposit (fixed or percentage), pay at venue, gift card redemption.
- [ ] Cancellation/refund policy: business-configurable; automatic refund processing per policy.
- [ ] No-show policy: option to charge no-show fee (disclosed at booking).
- [ ] Receipts: email and in-app; downloadable PDF; itemized with tax breakdown.
- [ ] Tipping: pre-set percentages or custom amount, charged with main payment.
- [ ] Saved payment methods: tokenized, PCI-compliant; biometric confirmation for reuse.
- [ ] Failed payment handling: 3 retry attempts, notification to user, booking held for 15 minutes.
- [ ] Payout to businesses: daily/weekly/monthly options; dashboard with transaction history.
- [ ] Platform fee: configurable percentage or flat fee; transparent to business.

---

### 2.15 Notifications

**Priority:** P1 — High

**Description:** Timely, relevant, and configurable communication across channels.

**User Stories:**
- As a user, I want reminders so I don't miss appointments.
- As a user, I want to control what notifications I receive.

**Acceptance Criteria:**
- [ ] Channels: push (mobile), email, SMS, in-app (notification center).
- [ ] Trigger types: booking confirmation, reminder (24h, 2h before), modification, cancellation, waitlist availability, promotional (opt-in), review request (post-visit), payment confirmation, loyalty rewards.
- [ ] User preferences: granular control per channel per notification type; master on/off.
- [ ] Delivery: push via Firebase/OneSignal; email via SendGrid/Mailgun; SMS via Twilio.
- [ ] Quiet hours: no push/SMS 22:00–08:00 user local time; queue for morning delivery.
- [ ] Rich notifications: action buttons (confirm, reschedule, cancel from notification).
- [ ] Notification history: 90 days retained in-app; searchable.
- [ ] A/B testing framework for notification copy and timing.

---

### 2.16 Provider / Business Owner Portal

**Priority:** P0 — Critical

**Description:** Comprehensive tools for businesses to manage their presence and operations.

**User Stories:**
- As a business owner, I want to manage my schedule and team efficiently.
- As a business owner, I want to attract and retain customers.

**Acceptance Criteria:**
- [ ] Dashboard: today's bookings, revenue, occupancy rate, new reviews, quick actions.
- [ ] Calendar: day/week/month views; drag-to-reschedule; color-coded by staff or service.
- [ ] Staff management: profiles, schedules, services assigned, performance metrics.
- [ ] Service management: CRUD services, pricing, duration, descriptions, photos.
- [ ] Booking rules: cancellation policy, notice requirements, max advance booking, online booking enabled/disabled.
- [ ] Customer management: client list, visit history, notes, marketing consent, loyalty status.
- [ ] Analytics: revenue trends, booking sources, no-show rate, staff utilization, popular services, customer retention.
- [ ] Marketing tools: promotion creation, gift cards, package deals, social media integration.
- [ ] Multi-location support: switch between locations; aggregated reporting.
- [ ] Mobile app: core calendar and notification functions on-the-go.

---

### 2.17 Admin Dashboard

**Priority:** P1 — High

**Description:** Platform governance, support, and growth management.

**User Stories:**
- As an admin, I want to monitor platform health and support users.
- As an admin, I want to grow the business network and revenue.

**Acceptance Criteria:**
- [ ] User management: customer and business account search, view, edit, suspend, impersonate (with audit log).
- [ ] Business onboarding: application review, verification workflow, document management.
- [ ] Content moderation: review flagged content, business claims, dispute resolution.
- [ ] Financial oversight: transaction monitoring, refund processing, payout management, fee structure configuration.
- [ ] Analytics: MAU, booking volume, GMV, churn, CAC, LTV, geographic distribution, category trends.
- [ ] Marketing operations: push campaign creation, email campaigns, promo code management, featured placement.
- [ ] System health: API latency, error rates, queue depths, database performance.
- [ ] Role-based access: super admin, support agent, finance, marketing, read-only analyst.
- [ ] Audit logging: all admin actions logged, immutable, 2-year retention.

---

### 2.18 Background Jobs (BullMQ)

**Priority:** P1 — High

**Description:** Reliable, scalable asynchronous processing for critical operations.

**User Stories:**
- As a system, I want to process heavy tasks without blocking user requests.
- As a developer, I want visibility into job processing and failure recovery.

**Acceptance Criteria:**
- [ ] Job types and priorities:
  - **Critical (process immediately):** Payment processing, booking confirmation, slot release on timeout.
  - **High:** Notification delivery, email sending, SMS dispatch.
  - **Normal:** Review aggregation, analytics computation, search index updates.
  - **Low:** Data archival, cleanup tasks, report generation.
- [ ] Retry policy: exponential backoff, max 5 attempts; dead letter queue for manual review.
- [ ] Job scheduling: cron-based for daily reports, weekly summaries; one-time for delayed notifications.
- [ ] Con_capacity: configurable concurrency per queue; priority queue support.
- [ ] Monitoring: BullMQ Dashboard or integrated UI showing queue depths, processing rates, failed jobs, average job duration.
- [ ] Idempotency: job handlers idempotent; duplicate execution safe.
- [ ] Graceful shutdown: finish in-progress jobs before process termination; requeue incomplete.
- [ ] Rate limiting: respect third-party API limits (SMS, email providers).

---

## 3. Cross-Cutting Concerns

| Concern | Approach |
|---------|----------|
| Security | OWASP Top 10 mitigation, encryption at rest and in transit, regular penetration testing |
| Privacy | GDPR/CCPA compliance, data minimization, consent management |
| Performance | CDN for assets, database query optimization, Redis caching, image optimization |
| Scalability | Horizontal scaling, stateless services, database sharding readiness |
| Monitoring | Sentry for errors, Datadog/New Relic for APM, custom business metrics |

---

## 4. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | 2.1–2.8, 2.11, 2.12, 2.14 (basic) | Month 1–2 |
| v1.0 | +2.9, 2.10, 2.13, 2.15, 2.16 | Month 3–4 |
| v1.5 | +2.17, 2.18, 2.14 (full), advanced analytics | Month 5–6 |

---

## 5. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion rate | > 15% |
| Search-to-booking time | < 3 minutes |
| App store rating | > 4.5 stars |
| Business NPS | > 50 |
| Customer retention (30d) | > 40% |
| System uptime | 99.9% |
| API p95 latency | < 500ms |

---

*Document Version: 1.0*
*Last Updated: 2024*
*Owner: Alex, Product Owner*