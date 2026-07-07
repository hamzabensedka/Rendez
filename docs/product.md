# Planity Clone — Product Specification

## 1. Overview

Build a cross-platform mobile application (iOS/Android) that connects users with local beauty/wellness businesses, enabling discovery, booking, and appointment management. Two-sided marketplace: consumer app + business owner portal.

**Target Users:** Consumers seeking beauty/wellness services; business owners managing appointments.
**Success Metrics:** Booking conversion rate >15%, search-to-book <3 taps, business onboarding <10 min.

---

## 2. User Authentication

**Priority:** P0 | **Owner:** Backend/Auth Team

### Description
Secure, frictionless authentication supporting multiple entry points with progressive profiling.

### Acceptance Criteria
- [ ] User can register with email/password, phone/SMS, or OAuth (Google, Apple, Facebook)
- [ ] Password minimum: 8 chars, 1 uppercase, 1 number, 1 special character
- [ ] Email verification required before first booking; phone verification acceptable for browsing
- [ ] JWT access token (15min expiry) + refresh token (30 days) with secure storage (Keychain/Keystore)
- [ ] Biometric login (Face ID/Touch ID/Fingerprint) after initial password entry
- [ ] "Continue as Guest" always available, with persistent cart/booking state upon conversion
- [ ] Password reset via email link (1-hour expiry) or SMS code
- [ ] Account linking: merge phone+email accounts if same verified identity
- [ ] Rate limiting: 5 failed attempts triggers 15-min lockout

### Technical Notes
- Use OAuth 2.0 + OpenID Connect for social providers
- Implement token refresh silent on 401 responses
- Store auth state in secure context, never AsyncStorage/plain text

---

## 3. Guest Browse & Explore

**Priority:** P0 | **Owner:** Mobile Team

### Description
Zero-friction discovery for unauthenticated users to drive conversion.

### Acceptance Criteria
- [ ] Full search, filter, and browse functionality available without login
- [ ] Location permission requested on first search; fallback to manual city selection
- [ ] Guest can view business details, services, availability, and reviews
- [ ] "Book" CTA triggers auth modal with pre-filled context (business, service, time)
- [ ] Guest state (favorites, cart items) persists for 30 days via device ID + local storage
- [ ] On registration, guest state seamlessly migrates to authenticated account
- [ ] Guest sees contextual nudges: "Sign up to save this favorite" or "Book in 1 tap with account"

---

## 4. Business Search & Discovery

**Priority:** P0 | **Owner:** Mobile/Backend

### Description
Intelligent search with multi-factor ranking and personalized results.

### Acceptance Criteria
- [ ] Text search across: business name, service name, staff name, category tags
- [ ] Autocomplete with typo tolerance (fuzzy matching, 2-edit distance)
- [ ] Filters: distance (0.5km–50km), price range, rating (4.0+), availability (today/this week), amenities, gender of staff
- [ ] Sort options: relevance, distance, rating, price (low/high), availability (soonest)
- [ ] Search results display: thumbnail, name, rating, distance, price from, next available slot
- [ ] Recent searches persist (last 10), clearable
- [ ] Trending searches and popular near-you suggestions on empty state
- [ ] Voice search capability (native speech-to-text integration)
- [ ] Search analytics: log queries, zero-result rates, filter usage for ranking optimization

---

## 5. Map-based Search

**Priority:** P0 | **Owner:** Mobile Team

### Description
Visual geographic exploration with clustering and interactive pins.

### Acceptance Criteria
- [ ] Full-screen map view with business pins; list view toggle
- [ ] Pin clustering at zoom levels <14; individual pins at ≥14
- [ ] Tap pin shows bottom sheet: business name, rating, price from, photo, CTA
- [ ] Current location button with animated recenter
- [ ] Custom markers: open now (green), closed (gray), fully booked (red), promotion (star badge)
- [ ] Map bounds trigger new search query; debounced 300ms
- [ ] Offline: cache last viewed map tiles and business markers for 7 days
- [ ] Support satellite and terrain map styles

---

## 6. Business Detail View

**Priority:** P0 | **Owner:** Mobile Team

### Description
Comprehensive business profile driving conversion to booking.

### Acceptance Criteria
- [ ] Hero image carousel (up to 10 images), pinch-to-zoom
- [ ] Business name, verified badge, rating, review count, favorite toggle
- [ ] Address with native maps navigation (Google/Apple Maps/Waze)
- [ ] Hours: current day highlighted, open/closed status, special hours noted
- [ ] Phone, website, social links (deep-linked)
- [ ] Services list with expandable categories, pricing, duration descriptions
- [ ] Staff profiles with photos, bios, specialties, individual ratings
- [ ] Amenities icons: WiFi, parking, wheelchair access, card payment, etc.
- [ ] "Book Now" sticky CTA; pre-selects first available service if none chosen
- [ ] Share business via native share sheet (deep link)

---

## 7. Service Categories

**Priority:** P0 | **Owner:** Backend/Mobile

### Description
Hierarchical taxonomy for service organization and discovery.

### Acceptance Criteria
- [ ] Top-level categories: Hair, Nails, Face, Body, Massage, Makeup, Barbershop, Medical Aesthetic, Spa, Fitness
- [ ] Subcategories: 3-5 per category (e.g., Hair > Cut, Color, Styling, Treatment)
- [ ] Category icons from design system; consistent color coding
- [ ] Business can assign services to multiple categories/tags
- [ ] Category browse page with featured businesses, trending services, price guides
- [ ] Admin can CRUD categories; changes reflect in app within 5 minutes (cache invalidation)
- [ ] Category search weighting: exact category match > partial match > description match

---

## 8. Booking Flow

**Priority:** P0 | **Owner:** Mobile/Backend

### Description
Streamlined multi-step booking with minimal friction and clear progress.

### Acceptance Criteria
- [ ] Step 1: Select service (or bundle multiple services)
- [ ] Step 2: Select staff (specific or "no preference"); show staff availability
- [ ] Step 3: Select date/time from computed availability slots (see §11)
- [ ] Step 4: Review booking summary with service, staff, time, location, price, cancellation policy
- [ ] Step 5: Add notes (allergies, preferences); apply promo code
- [ ] Step 6: Payment method selection (see §14) or "Pay at venue"
- [ ] Confirmation screen with calendar add, share, and "Book Again" CTA
- [ ] Booking held for 10 minutes during payment; released on timeout or cancellation
- [ ] Modify booking: change time/staff up to 2 hours before (business-configurable)
- [ ] Guest checkout: collect name, phone, email; auto-create account post-booking

### Edge Cases
- Service requires deposit: block booking until paid
- Staff no longer available mid-flow: graceful error, suggest alternatives
- Concurrent booking conflict: optimistic UI, server validation, retry with next slot

---

## 9. Appointment Management

**Priority:** P0 | **Owner:** Mobile/Backend

### Description
Full lifecycle management for consumer appointments.

### Acceptance Criteria
- [ ] Upcoming appointments: chronological list, grouped by date
- [ ] Appointment card: business, service, staff, time, status, actions
- [ ] Actions per status:
  - Confirmed: Reschedule, Cancel, Add to Calendar, Directions, Call
  - Completed: Rebook, Review, Receipt
  - Cancelled: Rebook, Support
- [ ] Reschedule: select new slot from real-time availability; preserve original if user aborts
- [ ] Cancellation: reason capture (optional), refund policy display, instant confirmation
- [ ] Push + SMS reminders: 24h, 2h, and 15min before appointment
- [ ] No-show handling: mark after scheduled time + 15min grace; impact loyalty status
- [ ] Appointment history: searchable, filterable by date range, business, status

---

## 10. Favorites

**Priority:** P1 | **Owner:** Mobile Team

### Description
Save and organize preferred businesses for quick rebooking.

### Acceptance Criteria
- [ ] Toggle favorite from business detail, search results, or map pin
- [ ] Favorites list: sortable by name, distance, last visited; grid/list view
- [ ] Quick rebook: 1-tap to last service or most common service
- [ ] Favorite区分: active favorites vs. "saved" (wishlist) with notes
- [ ] Sync favorites across devices via cloud
- [ ] Share favorites list (export or collaborative list)
- [ ] Suggest similar businesses based on favorite patterns

---

## 11. User Profile

**Priority:** P1 | **Owner:** Mobile Team

### Description
Centralized user identity, preferences, and history.

### Acceptance Criteria
- [ ] Editable: name, phone, email, photo, gender, birthday (for birthday offers)
- [ ] Preference settings: notification types, default search radius, currency, language
- [ ] Privacy: data download (GDPR), account deletion with 30-day grace period
- [ ] Loyalty: points balance, tier status, history, referral code
- [ ] Payment methods: manage cards, default selection, billing addresses
- [ ] Security: change password, 2FA toggle, active sessions management
- [ ] Family/friends: book on behalf of others with their details stored

---

## 12. Availability & Slot Computation

**Priority:** P0 | **Owner:** Backend Team

### Description
Real-time, accurate availability computation considering complex business rules.

### Acceptance Criteria
- [ ] Input factors: staff schedules, existing appointments, service duration, buffer time, resource (room/equipment) constraints
- [ ] Slot granularity: 15-minute intervals by default; business-configurable
- [ ] Compute latency: <200ms for 7-day view; <500ms for 30-day view
- [ ] Cache computed slots with 5-second TTL; invalidate on booking mutation
- [ ] Handle recurring schedules and exception dates (holidays, staff PTO)
- [ ] Overbooking prevention: pessimistic locking at database level
- [ ] Waitlist: offer when fully booked; notify on cancellation
- [ ] Business hours, staff breaks, and lunch closures respected
- [ ] Multi-service booking: consecutive slot finding with gap minimization
- [ ] Timezone handling: store all times in UTC, display in business timezone

---

## 13. Shared Types & Design System

**Priority:** P0 | **Owner:** Design/Frontend

### Description
Consistent, accessible UI foundation across platforms.

### Acceptance Criteria
- [ ] Component library: buttons, inputs, cards, modals, bottom sheets, date pickers, skeleton loaders
- [ ] Typography: 2-font system (display + body), 6-level hierarchy, dynamic type support
- [ ] Color system: semantic tokens (primary, success, warning, error, info), dark mode support
- [ ] Spacing: 4px base grid, consistent rhythm
- [ ] Animation: 60fps transitions, reduced motion respect
- [ ] Accessibility: WCAG 2.1 AA, screen reader support, minimum touch 44x44dp
- [ ] Shared TypeScript types: API contracts, domain models, DTOs auto-generated from OpenAPI
- [ ] Design tokens in JSON syncable to Figma, iOS, Android, Web
- [ ] Icon set: 200+ icons, consistent stroke width, RTL support

---

## 14. Reviews & Ratings

**Priority:** P1 | **Owner:** Backend/Mobile

### Description
Trust-building through verified, structured feedback.

### Acceptance Criteria
- [ ] Review eligibility: post-appointment, within 30 days, verified booking
- [ ] Rating: 1-5 stars, mandatory; optional detailed review (min 20 chars)
- [ ] Structured feedback: service quality, staff, ambiance, value (1-5 each)
- [ ] Photo upload: up to 5 images, moderated for appropriacy
- [ ] Business response: public reply to any review; notification to reviewer
- [ ] Review display: sort by relevant/helpful/recent; filter by rating, with photos
- [ ] Aggregate: overall rating, category breakdown, rating distribution histogram
- [ ] Abuse prevention: flag system, auto-hide on multiple reports, human review queue
- [ ] Incentivize reviews: loyalty points, but prohibit quid pro quo for positive reviews

---

## 15. Payment Integration

**Priority:** P0 | **Owner:** Backend/Finance

### Description
Secure, multi-provider payment processing with local methods.

### Acceptance Criteria
- [ ] PCI-DSS compliant; no card data touches servers (tokenization via Stripe/Adyen)
- [ ] Methods: credit/debit (Visa, MC, Amex), Apple Pay, Google Pay, PayPal, Klarna (BNPL)
- [ ] Local methods: iDEAL, Bancontact, Giropay per market
- [ ] "Pay at venue" option: business-configurable, may require card hold
- [ ] Full prepay vs. deposit (percentage or fixed amount) vs. post-pay
- [ ] Refund flows: automatic (cancellation policy) or manual (support); original payment method
- [ ] Receipt: email + in-app, with VAT breakdown
- [ ] Failed payment: 3 retry attempts, user notification, booking hold extension
- [ ] Payout to businesses: weekly, net of platform commission

---

## 16. Notifications

**Priority:** P1 | **Owner:** Backend/Mobile

### Description
Multi-channel, preference-aware communication system.

### Acceptance Criteria
- [ ] Channels: push (FCM/APNs), SMS, email, in-app inbox
- [ ] Types: booking confirmation, reminder, modification, cancellation, promotional, transactional
- [ ] User preference control: per-channel, per-type opt-in/opt-out
- [ ] Rich push: deep links, images, action buttons (confirm, reschedule, call)
- [ ] Notification center: persistent in-app inbox with read/unread, 90-day history
- [ ] Smart delivery: batch non-urgent, respect quiet hours (22:00–08:00 local time)
- [ ] Unsubscribe: one-tap for marketing, transactional exempted
- [ ] Delivery tracking: sent, delivered, opened metrics; retry failed channels

---

## 17. Provider / Business Owner Portal

**Priority:** P0 | **Owner:** Web Team

### Description
Web-based dashboard for business operations and growth.

### Acceptance Criteria
- [ ] Dashboard: today's appointments, revenue, occupancy rate, new reviews
- [ ] Calendar: day/week/month views, drag-drop reschedule, color-coded statuses
- [ ] Staff management: schedules, services assigned, performance metrics, commission tracking
- [ ] Service catalog: CRUD services, pricing, duration, description, photos
- [ ] Availability rules: recurring schedule, exceptions, time off requests
- [ ] Booking settings: lead time, cancellation policy, deposit requirements, buffer time
- [ ] Client management: CRM view, visit history, notes, marketing tags
- [ ] Analytics: revenue, bookings by service/staff, no-show rate, cancellation rate, peak hours
- [ ] Promotions: create discount codes, flash sales, package deals
- [ ] Multi-location support: switch context, aggregate reporting
- [ ] Mobile-responsive PWA for on-the-go management

---

## 18. Admin Dashboard

**Priority:** P1 | **Owner:** Web Team

### Description
Platform operations and governance control center.

### Acceptance Criteria
- [ ] User management: search, view, suspend, impersonate, data export
- [ ] Business onboarding: verification workflow, document review, approval/rejection with notes
- [ ] Content moderation: review flagged reviews/photos, business descriptions
- [ ] Financial: transaction monitoring, dispute handling, payout scheduling, commission adjustment
- [ ] Analytics: MAU, booking volume, GMV, churn, CAC, LTV by cohort
- [ ] Support tools: ticket system, live chat integration, knowledge base
- [ ] System health: service status, error rates, queue depths, alert configuration
- [ ] Role-based access: super admin, finance, support, marketing, read-only
- [ ] Audit log: all admin actions, immutable, 2-year retention

---

## 19. Background Jobs (BullMQ)

**Priority:** P0 | **Owner:** Backend Team

### Description
Reliable, observable asynchronous job processing.

### Acceptance Criteria
- [ ] Job types: email send, SMS send, push notification, payment processing, report generation, data export, image processing, search index update, slot cache warm, reminder dispatch
- [ ] Retry policy: 3 attempts with exponential backoff (2^n * 1s), dead letter queue after failure
- [ ] Priority queues: critical (payments), normal (notifications), low (reports)
- [ ] Job idempotency: deduplication via idempotency key, 24-hour window
- [ ] Observability: job count, processing time, failure rate, queue depth dashboards
- [ ] Rate limiting: respect external API limits (SMS provider, email service)
- [ ] Scheduled jobs: cron syntax support for recurring tasks
- [ ] Manual intervention: retry, cancel, inspect payload from admin UI

---

## Appendix: Priority Legend

| Priority | Meaning | Timeline |
|----------|---------|----------|
| P0 | Critical path, MVP launch | Sprint 1-4 |
| P1 | Important, post-launch | Sprint 5-8 |
| P2 | Nice to have, roadmap | Q2+ |

## Appendix: Definition of Ready

- Acceptance criteria clear and testable
- Design mockups approved for P0/P1
- API contract drafted for backend-dependent features
- Dependencies identified and unblocked
- Estimation complete (story points)

## Appendix: Definition of Done

- Code reviewed and merged to main
- Unit test coverage >80%
- Integration tests passing
- QA sign-off on iOS and Android
- Analytics events instrumented
- Documentation updated
- Feature flag configurable for gradual rollout