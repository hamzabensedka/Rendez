# Planity Clone — Product Specification

## 1. Overview

Build a marketplace connecting service providers (salons, barbers, wellness, healthcare) with customers seeking appointments. Two-sided platform: consumer mobile/web app + provider/business owner portal + admin dashboard.

**Target Users:** Consumers booking appointments; Business owners managing schedules; Platform administrators.

**Platforms:** iOS, Android, Responsive Web.

---

## 2. Shared Types & Design System [Priority: Critical]

### 2.1 Description
Foundational design tokens, component library, and shared TypeScript types used across all modules.

### 2.2 Acceptance Criteria
- [ ] Color palette, typography (font: Inter), spacing scale (4px base), and elevation system defined in Figma
- [ ] Component library: buttons, inputs, cards, modals, bottom sheets, date picker, time slot grid, loading states, empty states
- [ ] Shared TypeScript interfaces: User, Business, Service, Appointment, Review, Payment, Notification
- [ ] Dark mode support with `prefers-color-scheme` and manual toggle
- [ ] Accessibility: WCAG 2.1 AA minimum, focus indicators, screen reader labels
- [ ] Design tokens exported as npm package `@planity-clone/design-system`

---

## 3. User Authentication [Priority: Critical]

### 3.1 Description
Secure identity management for consumers and business owners with role-based access.

### 3.2 Acceptance Criteria
- [ ] Registration: email/password, Google OAuth, Apple Sign-In
- [ ] Login with biometric fallback (Face ID/Touch ID/Fingerprint) after first successful auth
- [ ] Password reset via secure email link (expires 1 hour)
- [ ] Phone number verification via SMS (Twilio) optional during onboarding
- [ ] JWT access token (15min expiry) + refresh token (7 days) with secure storage (Keychain/Keystore)
- [ ] Role assignment: `customer`, `business_owner`, `admin` — enforced server-side
- [ ] Account lockout after 5 failed attempts, 30-minute cooldown
- [ ] GDPR-compliant account deletion with 30-day grace period

---

## 4. Guest Browse & Explore [Priority: Critical]

### 4.1 Description
Unauthenticated users can browse businesses and services to reduce friction before registration.

### 4.2 Acceptance Criteria
- [ ] Home feed visible without login: featured businesses, trending categories, promotional banners
- [ ] Business list and detail views accessible; booking requires authentication
- [ ] Persistent guest session ID for analytics; prompt to register at booking CTA
- [ ] Guest data merged to authenticated account upon registration
- [ ] "Skip for now" option on all auth prompts; limit to 3 prompts per session

---

## 5. Business Search & Discovery [Priority: Critical]

### 5.1 Description
Powerful search and filtering to help users find relevant service providers.

### 5.2 Acceptance Criteria
- [ ] Full-text search across business name, service name, description, tags
- [ ] Filters: category, price range, rating (minimum stars), distance, availability ("open now", specific date), amenities
- [ ] Sort options: relevance, distance, rating, price (low to high), availability (soonest)
- [ ] Search history saved (last 10 queries), clearable
- [ ] Autocomplete with suggestions in <200ms; debounced at 300ms
- [ ] "No results" state with alternative suggestions and category browsing
- [ ] Elasticsearch/Algolia integration for fuzzy matching and typo tolerance
emit
- [ ] Pagination: 20 results per page, infinite scroll on mobile

---

## 6. Map-based Search [Priority: High]

### 6.1 Description
Visual exploration of businesses on an interactive map with clustering and bounds-based loading.

### 6.2 Acceptance Criteria
- [ ] Google Maps or Mapbox integration with custom business pins
- [ ] User location with permission handling; fallback to city/zip input
- [ ] Clustering at zoom levels >50 businesses visible
- [ ] Tap pin shows bottom sheet with business preview; tap preview navigates to detail
- [ ] List/map toggle with state persistence per session
- [ ] Map bounds trigger re-fetch; cache previous bounds for 5 minutes
- [ ] "Search this area" button after manual map pan

---

## 7. Business Detail View [Priority: Critical]

### 7.1 Description
Comprehensive business profile driving conversion to booking.

### 7.2 Acceptance Criteria
- [ ] Header: business name, hero image carousel (max 10), average rating, review count, favorite toggle
- [ ] Quick info: address, hours (with "open now" indicator), phone, website link
- [ ] Services tab: categorized list with duration, price, description; expandable for details
- [ ] Reviews tab: sortable (newest, highest, lowest), paginated, photo reviews
- [ ] Team/Staff tab: profiles with photos, bios, average rating
- [ ] Photos tab: gallery with categories (interior, work, team)
- [ ] "Book Now" CTA sticky at bottom; pre-selects first service if none chosen
- [ ] Share functionality: deep link, native share sheet
- [ ] Report business for inappropriate content

---

## 8. Service Categories [Priority: High]

### 8.1 Description
Hierarchical taxonomy for business classification and discovery.

### 8.2 Acceptance Criteria
- [ ] Admin-managed category tree: 3 levels max (e.g., Beauty > Hair > Haircut)
- [ ] Each category has icon, cover image, and SEO-optimized slug
- [ ] Business can assign up to 5 primary categories; services linked to subcategories
- [ ] Category pages with featured businesses, trending services, educational content
- [ ] Analytics on category popularity and conversion rates

---

## 9. Booking Flow [Priority: Critical]

### 9.1 Description
Streamlined multi-step reservation from service selection to confirmation.

### 9.2 Acceptance Criteria
- [ ] Step 1 — Service Selection: single or multiple services, staff preference ("any" or specific), duration auto-calculated
- [ ] Step 2 — Date/Time: calendar view with available days highlighted, time slots in 15-min increments; timezone handling
- [ ] Step 3 — Details: existing user info pre-filled, notes field (max 500 chars), optional add-ons
- [ ] Step 4 — Review: order summary with cancellation policy, terms acceptance
- [ ] Step 5 — Payment: see Payment Integration; option to "pay at venue" where enabled
- [ ] Confirmation screen with booking reference, calendar invite (.ics), add to native calendar
- [ ] Booking held for 10 minutes during payment; auto-release if unpaid
- [ ] Idempotency key prevents duplicate bookings
- [ ] Guest checkout flow with email/phone collection

---

## 10. Availability & Slot Computation [Priority: Critical]

### 10.1 Description
Real-time availability engine respecting business rules, staff schedules, and existing bookings.

### 10.2 Acceptance Criteria
- [ ] Business sets: operating hours per day, break times, slot duration granularity, buffer between appointments
- [ ] Staffdac Staff-specific schedules, time off, and service competencies
- [ ] Slot computation accounts for: existing appointments, blocked times, staff availability, service duration
- [ ] Real-time availability query responds in <500ms for 30-day window
- [ ] Cache invalidation on booking creation/cancellation/modification
- [ ] Overbooking protection: pessimistic locking at database level
- [ ] Support for recurring availability patterns and exception dates
- [ ] Timezone-aware: all storage in UTC, display in business timezone

---

## 11. Appointment Management [Priority: Critical]

### 11.1 Description
Lifecycle management for customer appointments.

### 11.2 Acceptance Criteria (Customer)
- [ ] Upcoming appointments list with status: confirmed, pending payment, completed, cancelled, no-show
- [ ] Reschedule: within cancellation window, subject to availability; 1 free reschedule, then business policy applies
- [ ] Cancel with reason selection; refund per business policy
- [ ] Appointment detail: QR code for check-in, directions, contact business, add to calendar
- [ ] Push notification 24h and 1h before appointment

### 11.3 Acceptance Criteria (Business Owner)
- [ ] Calendar view: day, week, month; color-coded by status
- [ ] Check-in/check-out actions with timestamp logging
- [ ] Mark no-show with customer notification
- [ ] Block time manually (lunch, maintenance)
- [ ] Override booking rules for VIP/customer service cases (audit logged)

---

## 12. Favorites [Priority: Medium]

### 12.1 Description
Save businesses and services for quick re-access.

### 12.2 Acceptance Criteria
- [ ] Toggle favorite from business card, detail view, or post-booking
- [ ] Favorites list with search and sort (recently added, name, nearest)
- [ ] Sync across devices; persist if app reinstalled with account recovery
- [ ] Push notification for favorites: new services, promotions, availability openings
- [ ] Maximum 200 favorites; prompt to organize at limit

---

## 13. User Profile [Priority: High]

### 13.1 Description
Customer identity and preference management.

### 13.2 Acceptance Criteria
- [ ] Editable: name, email, phone, profile photo, preferred notification channels
- [ ] Addresses: multiple saved with label (home, work), default selection
- [ ] Preferences: service categories, staff gender preference, language
- [ ] Payment methods: see Payment Integration
- [ ] Appointment history with rebooking shortcut
- [ ] Loyalty points balance and history (if program active)
- [ ] Privacy settings: marketing opt-in, data download, account deletion

---

## 14. Reviews & Ratings [Priority: High]

### 14.1 Description
Trust and quality signal through verified customer feedback.

### 14.2 Acceptance Criteria
- [ ] Review eligibility: absoluteriqued: post-appointment, within 14 days, one per appointment
- [ ] Rating: 1-5 stars with optional detailed review (max 2000 chars)
- [ ] Photo/video attachments (max 5, 10MB each)
- [ ] Business owner response with notification to reviewer
- [ ] Flag inappropriate reviews; admin moderation queue
- [ ] Review helpfulness voting; sort by most helpful
- [ ] AggregateMessaging Average recalculated nightly; outlier detection for fraudulent reviews
- [ ] Display: overall rating, rating distribution histogram, recent reviews, review highlights

---

## 15. Payment Integration [Priority: Critical]

### 15.1 Description
Secure, flexible payment processing for bookings.

### 15.2 Acceptance Criteria
- [ ] Stripe integration: cards, Apple Pay, Google Pay, SEPA, Buy Now Pay Later (Klarna/Afterpay where relevant)
- [ ] PCI DSS compliance: no raw card data stored; use Stripe Elements/ Payment Sheet
- [ ] Payment flows: full prepay, deposit (configurable %), pay at venue
- [ ] Saved payment methods with default selection; require CVC for new device
- [ ] Refund processing: automatic (per policy), partial, or manual override by admin
- [ ] Receipt generation: email and in-app, with VAT where applicable
- [ ] Failed payment retry with exponential backoff; notify user at 24h, 12h, 2h before hold expires
- [ ] Payout scheduling to business owners (weekly/biweekly/monthly)
- [ ] Dispute handling interface with evidence submission

---

## 16. Notifications [Priority: High]

### 16.1 Description
Multi-channel communication for engagement and operational efficiency.

### 16.2 Acceptance Criteria
- [ ] Channels: push (OneSignal/Firebase), SMS (Twilio), email (SendGrid), in-app inbox
- [ ] Types: booking confirmations, reminders (24h, 1h, 15min), promotions, system alerts, review requests
- [ ] Preference management per channel and notification type
- [ ] Rich push with deep links to relevant screens
- [ ] Notification scheduling with timezone awareness
- [ ] Delivery tracking and retry logic for failed sends
- [ ] Unsubscribe compliance for marketing communications
- [ ] Inbox: persistent message history, mark read/unread, delete

---

## 17. Provider / Business Owner Portal [Priority: Critical]

### 17.1 Description
Web-based dashboard for business operations and growth.

### 17.2 Acceptance Criteria
- [ ] Onboarding wizard: business info, services, staff, hours, payment setup (Stripe Connect)
- [ ] Dashboard: today's appointments, revenue this week, upcoming week preview, quick actions
- [ ] Calendar management: drag-and-drop rescheduling, multi-staff view, availability overrides
- [ ] Client management: CRM with visit history, notes, tags, communication log
- [ ] Staff management: roles (owner, manager, staff), permissions, schedule assignment
- [ ] Service catalog: CRUD with pricing, duration, description, photos, online booking toggle
- [ ] Booking rules: cancellation policy, lead time, max future booking window
- [ ] Analytics: revenue, appointments, no-show rate, new vs. returning clients, peak hours
- [ ] Marketing: promotion creation, email/SMS campaigns to client segments
- [ ] Settings: business hours, break times, payment methods, integrations (Google Business, Instagram)

---

## 18. Admin Dashboard [Priority: High]

### 18.1 Description
Platform administration and oversight.

### 18.2 Acceptance Criteria
- [ ] User management: search, view, suspend, impersonate (audit logged)
- [ ] Business verification: onboarding review, document verification, approval workflow
- [ ] Content moderation: reported reviews, business content, user-generated photos
- [ ] Financial oversight: transaction monitoring, refund approval, payout tracking, fee configuration
- [ ] Analytics: MAU, booking volume, GMV, churn, top categories, geographic distribution
- [ ] System health: job queue status, error rates, third-party service status
- [ ] Feature flags and A/B test configuration
- [ ] Role-based access: super admin, support agent, finance, content moderator

---

## 19. Background Jobs (BullMQ) [Priority: Critical]

### 19.1 Description
Asynchronous task processing for reliability and scalability.

### 19.2 Acceptance Criteria
- [ ] Job types defined with priority levels, retry policies, and dead letter queues
- [ ] Booking confirmation emails: send within 30 seconds of booking
- [ ] Reminder notifications: scheduled at creation, adjusted for timezone
- [ ] Payment processing: idempotent charge attempts with webhook handling
- [ ] Search index updates: real-time on business/service changes
- [ ] Analytics aggregation: nightly rollups, weekly reports
- [ ] Image processing: resize uploads to variants (thumbnail, standard, full), WebP conversion
- [ ] Data exports: GDPR data portability requests within 30 days
- [ ] Job monitoring: dashboard with queue depths, processing rates, failed job inspection and retry
- [ ] Rate limiting on external API calls (SMS, email, push)

---

## 20. Non-Functional Requirements

| Aspect | Requirement |
|--------|-------------|
| Performance | App launch <3s; screen load <1.5s; API response p95 <500ms |
| Reliability | 99.9% uptime; graceful degradation of non-critical services |
| Security | OWASP Mobile Top 10; encryption in transit (TLS 1.3) and at rest (AES-256) |
| Scalability | Horizontal scaling; handle 10x traffic spikes via auto-scaling |
| Compliance | GDPR, CCPA, PCI DSS Level 1 |
| Localization | i18n framework; launch with EN, FR, DE, ES; RTL for future |

---

## 21. Success Metrics

| KPI | Target |
|-----|--------|
| Booking conversion rate | >15% of app opens |
| Search to booking | >8% |
| Day-7 retention | >30% |
| Business owner activation | >70% complete onboarding |
| NPS | >50 |
| Support ticket volume | <2% of transactions |

---

*Document version: 1.0 | Owner: Alex (Product) | Review cycle: Sprint-based*