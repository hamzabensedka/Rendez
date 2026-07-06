# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first marketplace connecting customers with local beauty & wellness businesses for appointment booking. The platform serves three user types: **Customers** (book appointments), **Providers** (manage businesses/services/availability), and **Admins** (platform oversight).

### Success Metrics
- Customer: < 3 min to first booking, < 2% booking failure rate
- Provider: < 5 min business onboarding, 95% calendar utilization visibility
- Platform: NPS > 50, 80% booking completion rate

---

## 2. Shared Types & Design System (P0)

### Description
Foundational design tokens, component library, and type definitions used across all features.

### Acceptance Criteria
- [ ] Color palette: primary (#6C5CE7), secondary (#00D2D3), semantic states (success/error/warning/info), dark mode support
- [ ] Typography: Inter font family, 12-scale system (xs to 6xl), line-height ratios
- [ ] Spacing: 4px base grid, responsive breakpoints (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
- [ ] Component library: Button, Input, Select, DatePicker, TimeSlot, Card, Modal, BottomSheet, Avatar, Badge, Skeleton, Toast
- [ ] TypeScript interfaces: User, Business, Service, Appointment, Slot, Review, Payment, Notification (shared across frontend/backend)
- [ ] Icon system: Lucide icons, consistent 24px default, 20px compact variant
- [ ] Accessibility: WCAG 2.1 AA minimum, focus states, screen reader labels, minimum touch target 44px

### Priority: P0 (Foundation)

---

## 3. User Authentication (P0)

### Description
Secure, multi-method authentication for customers and providers.

### Acceptance Criteria
- [ ] Registration: email/password, Google OAuth, Apple Sign-In (iOS)
- [ ] Login: same methods + "Remember me" (30-day refresh token)
- [ ] Password reset: email link (1-hour expiry), in-app deep link to reset screen
- [ ] Phone verification: SMS OTP for high-risk actions (first booking, provider onboarding)
- [ ] JWT access token (15-min expiry) + httpOnly refresh token rotation
- [ ] Biometric login: Face ID / Touch ID / Fingerprint (after initial password login)
- [ ] Account linking: merge email and social accounts if same email detected
- [ ] Logout: clear tokens, revoke refresh token server-side, optional "Log out all devices"
- [ ] Rate limiting: 5 failed attempts → 15-min lockout, CAPTCHA after 3 attempts

### Priority: P0

---

## 4. Guest Browse & Explore (P0)

### Description
Allow non-authenticated users to discover businesses and services before committing to registration.

### Acceptance Criteria
- [ ] Home screen accessible without login: featured businesses, popular categories, nearby recommendations
- [ ] Category browsing, search, and map view functional for guests
- [ ] Business detail pages viewable (services, prices, reviews, hours)
- [ ] Prompt to register/login appears at booking initiation (not before)
- [ ] Guest session persists for 24 hours; converting to registered account preserves guest actions (favorites, selected slots)
- [ ] Deep links from shared business/service pages work for guests

### Priority: P0 (Conversion funnel)

---

## 5. Business Search & Discovery (P0)

### Description
Powerful, fast search to help customers find relevant businesses.

### Acceptance Criteria
- [ ] Text search: business name, service name, staff name with typo tolerance (fuzzy matching)
- [ ] Filters: category, price range, rating (4.0+), availability ("open now", "available today"), amenities, gender (male/female/unisex)
- [ ] Sort options: relevance (default), distance, rating, price (low-high), most reviewed
- [ ] Auto-complete: suggestions after 2 characters, recent searches, trending searches
- [ ] Results: card list view with thumbnail, name, rating, price from, next available slot, distance
- [ ] Empty state: helpful messaging + popular alternatives
- [ ] Search history: local storage, clearable, max 20 recent searches
- [ ] Performance: < 200ms for auto-complete, < 500ms for full search results

### Priority: P0

---

## 6. Map-based Search (P0)

### Description
Visual discovery using interactive map with business clustering.

### Acceptance Criteria
- [ ] Map view: Google Maps or Mapbox integration, custom business pins
- [ ] Default viewport: user location (with permission) or city center; fallback to manual location entry
- [ ] Pin clustering: cluster pins at zoomed-out levels, show count badge
- [ ] Pin tap: bottom sheet preview with key business info, tap to full detail
- [ ] "Near me" button: recenter to current location with accuracy indicator
- [ ] Area search: move map, tap "Search this area" to refresh results
- [ ] List/map toggle: persistent state during session
- [ ] Directions: native maps app integration (Google Maps, Apple Maps, Waze)

### Priority: P0

---

## 7. Service Categories (P0)

### Description
Hierarchical categorization of beauty & wellness services.

### Acceptance Criteria
- [ ] Top-level categories: Hair, Nails, Face, Body, Massage, Hair Removal, Makeup, Barbershop, Spa & Wellness, Medical Aesthetic
- [ ] Sub-categories: 3-5 per top-level (e.g., Hair: Cut, Color, Styling, Treatment, Extensions)
- [ ] Category icons: consistent, recognizable, from design system
- [ ] Category landing pages: featured businesses, popular services, price ranges
- [ ] Business can assign multiple categories and sub-categories
- [ ] Category-based search: filter by any level of hierarchy
- [ ] Trending categories: algorithm based on booking volume in user's area

### Priority: P0

---

## 8. Business Detail View (P0)

### Description
Comprehensive business profile to convert browsers to bookers.

### Acceptance Criteria
- [ ] Header: business name, verified badge, favorite toggle, share button
- [ ] Photo gallery: up to 20 images, swipeable full-screen view, business logo
- [ ] Key info: address (with map preview), phone, website, hours (with "open now" status)
- [ ] Services tab: categorized list with name, duration, description, price, "Book" CTA
- [ ] Reviews tab: average rating (1-5, decimal), total count, rating distribution, sortable reviews, photo reviews
- [ ] Team tab: staff profiles with photos, specialties, ratings
- [ ] About tab: business description, amenities, languages spoken, COVID/safety measures
- [ ] Sticky "Book Now" button: scrolls to services or opens booking flow
- [ ] Similar businesses nearby section

### Priority: P0

---

## 9. Booking Flow (P0)

### Description
Seamless, guided appointment booking minimizing abandonment.

### Acceptance Criteria
- [ ] Step 1 — Select Service: from business detail or rebook from history; multi-select supported
- [ ] Step 2 — Select Staff: specific staff or "no preference"; show staff availability
- [ ] Step 3 — Select Date & Time: calendar view with availability, morning/afternoon/evening quick filters, timezone handling
- [ ] Step 4 — Review & Confirm: service summary, total price, duration, cancellation policy, add notes
- [ ] Step 5 — Payment: see Payment Integration; option to "pay at venue" where supported
- [ ] Confirmation: booking reference, add to calendar (iCal), share, directions
- [ ] Guest checkout: collect minimal info (name, phone, email), auto-create account
- [ ] Modification: edit any step before final confirmation
- [ ] Conflict prevention: real-time slot availability check before final confirmation (optimistic locking)
- [ ] Booking hold: 10-minute hold on selected slot during checkout; release on timeout or abandonment

### Priority: P0

---

## 10. Availability & Slot Computation (P0)

### Description
Core engine for generating accurate, real-time bookable slots.

### Acceptance Criteria
- [ ] Business defines: weekly recurring hours, special hours (holidays), breaks, slot duration per service
- [ ] Staff-level availability: individual schedules, time off, service-specific eligibility
- [ ] Slot generation: based on service duration + buffer time, respecting business and staff availability
- [ ] Real-time computation: account for existing bookings, blocks, holds
- [ ] Buffer times: configurable pre/post-service buffers (e.g., 15 min sanitization)
- [ ] Concurrent bookings: support for multiple staff, shared resources (rooms, chairs)
- [ ] Timezone handling: store all times in UTC, display in business timezone or user preference
- [ ] Performance: slot generation < 100ms for 30-day view
- [ ] Edge cases: daylight saving transitions, 24h businesses, cross-day appointments

### Priority: P0 (Critical infrastructure)

---

## 11. Appointment Management (P0)

### Description
Customer and provider views for managing bookings.

### Acceptance Criteria (Customer)
- [ ] Upcoming appointments: list view with date, time, business, services, status
- [ ] Appointment detail: full info, directions, contact business, add to calendar
- [ ] Reschedule: select new slot, subject to cancellation policy; one-tap rebooking for recurring
- [ ] Cancel: with reason selection, refund status if applicable, confirmation
- [ ] History: past appointments, rebook button, review prompt (if not reviewed)
- [ ] No-show policy: clearly communicated consequences

### Acceptance Criteria (Provider)
- [ ] Calendar views: day, week, month; staff filter
- [ ] Appointment actions: confirm, check-in, complete, no-show, cancel with reason
- [ ] Block time: manual busy time for breaks or admin
- [ ] Walk-in support: add unbooked appointments to system
- [ ] Customer notes: view booking notes, add internal notes

### Priority: P0

---

## 12. Favorites (P1)

### Description
Save and quickly access preferred businesses.

### Acceptance Criteria
- [ ] Favorite toggle: heart icon on business cards and detail, haptic feedback
- [ ] Favorites list: grid/list view, sorted by recently favorited or alphabetical
- [ ] Quick rebook: next available slot shown, one-tap booking for repeat services
- [ ] Notifications: optional alerts for new availability or promotions from favorites
- [ ] Sync: across devices for logged-in users
- [ ] Limit: no hard limit, soft warning at 500 for performance

### Priority: P1

---

## 13. User Profile (P1)

### Description
Customer account management and preferences.

### Acceptance Criteria
- [ ] Profile info: name, email, phone, profile photo, preferred language
- [ ] Security: change password, 2FA option, active sessions management
- [ ] Preferences: notification settings, default search radius, preferred payment method
- [ ] Privacy: data download (GDPR), account deletion with 30-day grace period
- [ ] Family/friends: add profiles for booking on behalf of others (parent, child, partner)
- [ ] Loyalty: points balance, tier status, history (if loyalty program active)
- [ ] Referral: unique code, invite credits, tracking

### Priority: P1

---

## 14. Reviews & Ratings (P1)

### Description
Social proof system for quality and trust.

### Acceptance Criteria
- [ ] Eligibility: can review after completed appointment; one review per appointment
- [ ] Rating: 1-5 stars, mandatory; optional detailed review with title and body
- [ ] Categories: rate specific aspects (service quality, ambiance, staff, value)
- [ ] Photo reviews: up to 5 images, moderation for inappropriate content
- [ ] Business response: public reply to reviews, notification to reviewer
- [ ] Review display: verified badge, date, service received, helpfulness voting
- [ ] Flagging: report inappropriate reviews, admin moderation queue
- [ ] Sort/filter: most recent, highest rated, lowest rated, with photos
- [ ] Impact on search: rating factor in relevance scoring

### Priority: P1

---

## 15. Payment Integration (P1)

### Description
Secure, flexible payment processing for bookings.

### Acceptance Criteria
- [ ] Payment methods: credit/debit cards (Stripe), Apple Pay, Google Pay, PayPal
- [ ] Payment timing: full upfront, deposit (partial), or pay at venue (configurable per business)
- [ ] Saved payment methods: tokenized storage, default selection, CVV required for new devices
- [ ] Receipts: email and in-app, downloadable PDF
- [ ] Refunds: automated per cancellation policy, manual refund by provider, partial refund support
- [ ] Failed payment handling: retry logic, grace period, notification
- [ ] Payouts: Stripe Connect for provider disbursement, configurable schedule (daily/weekly/monthly)
- [ ] Platform fee: configurable percentage + fixed fee, transparent display
- [ ] Tax: automatic tax calculation based on location and service type
- [ ] PCI compliance: no raw card data storage, Stripe Elements for card input

### Priority: P1

---

## 16. Notifications (P1)

### Description
Multi-channel, preference-aware notification system.

### Acceptance Criteria
- [ ] Channels: push (FCM/APNs), email, SMS; user-selectable per notification type
- [ ] Booking confirmations: immediate push + email summary
- [ ] Reminders: 24 hours, 2 hours before appointment (configurable)
- [ ] Changes: rescheduled, cancelled by provider or system
- [ ] Promotions: opt-in marketing, personalized offers from favorites
- [ ] In-app notification center: persistent history, unread badges, deep links
- [ ] Quiet hours: respect Do Not Disturb, configurable silent periods
- [ ] Delivery tracking: notification sent/delivered/read status for support
- [ ] Unsubscribe: granular opt-out per type, global marketing unsubscribe

### Priority: P1

---

## 17. Provider / Business Owner Portal (P0)

### Description
Comprehensive web and mobile interface for business management.

### Acceptance Criteria
- [ ] Onboarding: business info, location(s), services, staff, hours, payment setup (Stripe Connect)
- [ ] Dashboard: today's appointments, revenue this week, upcoming week preview, action items
- [ ] Calendar management: drag-and-drop rescheduling, bulk actions, color-coded status
- [ ] Service management: CRUD services, pricing, duration, description, online booking enable/disable
- [ ] Staff management: profiles, permissions (admin/receptionist/staff), schedules, service associations
- [ ] Client management: client list, visit history, notes, marketing tags
- [ ] Settings: booking policies (cancellation, no-show, lead time), notification preferences, integrations
- [ ] Analytics: bookings, revenue, cancellation rate, popular services, staff utilization, customer retention
- [ ] Multi-location: switch between locations, consolidated reporting for chains
- [ ] Mobile app: iOS and Android with core functionality (calendar, notifications, quick actions)

### Priority: P0

---

## 18. Admin Dashboard (P2)

### Description
Platform administration and oversight tools.

### Acceptance Criteria
- [ ] Business management: approval workflow, verification status, suspension, featured placement
- [ ] User management: customer and provider accounts, search, suspension, impersonation for support
- [ ] Content moderation: review flagged reviews, photos, business claims
- [ ] Financial oversight: transaction monitoring, dispute resolution, payout tracking
- [ ] Analytics: MAU, booking volume, GMV, conversion funnel, churn, top categories/cities
- [ ] System health: error rates, API performance, third-party service status
- [ ] Configuration: platform fees, promotional campaigns, category management
- [ ] Audit log: all admin actions, immutable record
- [ ] Role-based access: super admin, operations, support, finance roles

### Priority: P2

---

## 19. Background Jobs (BullMQ) (P0)

### Description
Reliable, scalable asynchronous job processing.

### Acceptance Criteria
- [ ] Job types: email sending, push notifications, SMS, payment webhooks, slot cache warming, report generation, data exports
- [ ] Retry policy: exponential backoff, max 5 attempts, dead letter queue for failures
- [ ] Scheduling: cron-based recurring jobs (daily reports, nightly cleanup), delayed jobs (reminders)
- [ ] Concurrency: configurable per queue, priority levels (critical, high, normal, low)
- [ ] Monitoring: job counts, processing rates, failure alerts, retry dashboard
- [ ] Idempotency: job deduplication keys to prevent duplicate processing
- [ ] Graceful shutdown: finish active jobs before process termination
- [ ] Redis-backed: BullMQ with Redis, cluster support for production

### Priority: P0 (Infrastructure)

---

## 20. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | App cold start < 2s; screen transition < 300ms; API response < 200ms (p95) |
| Reliability | 99.9% uptime; zero-downtime deployments; automated rollback |
| Security | OWASP Top 10 mitigation; encryption at rest and in transit; annual penetration testing |
| Scalability | Support 100K concurrent users; horizontal scaling of stateless services |
| Localization | i18n framework; launch in FR, EN, ES, DE; RTL readiness |
| Compliance | GDPR, CCPA, PCI-DSS; data residency options |

## 21. Release Phases

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Guest Browse, Search, Map, Business Detail, Booking Flow, Slot Engine, Appointment Mgmt, Provider Portal (basic), Background Jobs | 8 weeks |
| V1 | Favorites, Profile, Reviews, Payments, Notifications, Provider Analytics | +6 weeks |
| V2 | Admin Dashboard, Loyalty, Referrals, Advanced Provider Features, International Expansion | +8 weeks |

## 22. Open Questions

1. Geographic launch strategy (single city vs. multi-city from start)
2. Provider acquisition: self-serve vs. sales-assisted onboarding
3. Insurance/liability coverage for marketplace transactions
4. Integration with existing salon management software (competition vs. partnership)
