# Planity Clone — Product Specification

## 1. Overview

Planity Clone is a mobile-first platform connecting customers with local beauty and wellness businesses for appointment booking. The product serves three user segments: customers seeking services, business owners managing their operations, and administrators overseeing the platform.

**Target Platforms:** iOS, Android, Web (responsive)
**Release Strategy:** MVP → Growth → Scale

---

## 2. Feature Specifications

### 2.1 User Authentication

**Description:** Secure account creation and access for customers and business owners.

**User Stories:**
- As a customer, I want to register with email/phone so I can book appointments.
- As a returning user, I want to log in quickly so I can access my account.
- As a user, I want to reset my password so I can recover access.
- As a user, I want social login options so I can avoid creating new credentials.

**Acceptance Criteria:**
- [ ] Registration accepts email, phone number, and password with validation rules (8+ chars, 1 uppercase, 1 number)
- [ ] Phone verification via SMS OTP with 3-minute expiry
- [ ] Email verification with clickable link, 24-hour expiry
- [ ] Social login supports Google, Apple, Facebook OAuth 2.0
- [ ] JWT access token (15 min) + refresh token (7 days) with secure httpOnly cookie storage
- [ ] Biometric login (Face ID/Touch ID) enabled after initial password login
- [ ] Rate limiting: 5 failed attempts triggers 30-minute lockout
- [ ] "Remember me" extends session to 30 days

**Priority:** P0 — Must Have
**Estimation:** 2 weeks

---

### 2.2 Guest Browse & Explore

**Description:** Allow unauthenticated users to browse businesses and services without commitment.

**User Stories:**
- As a guest, I want to see nearby businesses so I can evaluate the platform before registering.
- As a guest, I want to view business profiles so I can make informed decisions.

**Acceptance Criteria:**
- [ ] Guest users can access search, map, and business detail views
- [ ] Booking actions redirect to registration with return URL preserved
- [ ] Guest session stored in localStorage; prompts to convert after 3 business views
- [ ] Guest data (favorites, search history) merges upon registration
- [ ] Soft limit: 10 business detail views before mandatory registration prompt

**Priority:** P0 — Must Have
**Estimation:** 1 week

---

### 2.3 Business Search & Discovery

**Description:** Intelligent search to find businesses by name, service, location, or availability.

**User Stories:**
- As a customer, I want to search "haircut" and see relevant salons so I can find what I need.
- As a customer, I want filters for price, rating, and distance so I can narrow results.

**Acceptance Criteria:**
- [ ] Full-text search across business name, service names, and descriptions
- [ ] Autocomplete with suggestion ranking by popularity and relevance
- [ ] Filters: distance (0.5km–50km), price range, rating (1–5 stars), category, availability ("open now"), amenities
- [ ] Sort options: relevance, distance, rating, price (low/high)
- [ ] Search history persists for 30 days
- [ ] Results load in <500ms with skeleton loading states
- [ ] Empty state with "No results" and alternative suggestions
- [ ] Pagination: 20 results per page, infinite scroll on mobile

**Priority:** P0 — Must Have
**Estimation:** 2 weeks

---

### 2.4 Map-based Search

**Description:** Visual exploration of businesses on an interactive map.

**User Stories:**
- As a customer, I want to see businesses on a map so I can choose by location.
- As a customer, I want to see my position relative to businesses so I can plan my trip.

**Acceptance Criteria:**
- [ ] Interactive map using Mapbox/Google Maps with custom business pins
- [ ] User location dot with accuracy radius; fallback to IP geolocation
- [ ] Clustering for dense areas (groups 10+ pins), de-clusters on zoom
- [ ] Bottom sheet shows list of visible businesses; tapping pin opens detail card
- [ ] Map bounds update search results in real-time
- [ ] "Search this area" button after map pan
- [ ] Offline: cached map tiles for last viewed area

**Priority:** P0 — Must Have
**Estimation:** 2 weeks

---

### 2.5 Business Detail View

**Description:** Comprehensive business profile with all information needed to book.

**User Stories:**
- As a customer, I want to see photos, services, and reviews so I can decide to book.
- As a customer, I want to see exact location and hours so I can plan my visit.

**Acceptance Criteria:**
- [ ] Hero image carousel (up to 10 images), video support
- [ ] Business info: name, category, rating, review count, address, phone, website
- [ ] Operating hours with "Open now" / "Closes at" / "Closed" status
- [ ] Service menu with pricing, duration, description
- [ ] Staff profiles with photos, bios, specialties
- [ ] Reviews summary (average, distribution) with 3 featured reviews
- [ ] "Book Now" CTA sticky at bottom
- [ ] Share functionality (deep link, native share sheet)
- [ ] Report business option

**Priority:** P0 — Must Have
**Estimation:** 2 weeks

---

### 2.6 Service Categories

**Description:** Hierarchical organization of beauty and wellness services.

**User Stories:**
- As a customer, I want to browse by category so I can discover new services.
- As a business owner, I want to categorize my services so customers find them easily.

**Acceptance Criteria:**
- [ ] Pre-defined category tree: Hair, Nails, Face, Body, Massage, Medical Aesthetics, etc.
- [ ] Sub-categories: e.g., Hair > Cut, Color, Styling, Treatments
- [ ] Category icons and color coding in design system
- [ ] Business can assign services to multiple categories
- [ ] Category landing pages with featured businesses
- [ ] Trending categories based on booking volume

**Priority:** P1 — Should Have
**Estimation:** 1 week

---

### 2.7 Booking Flow

**Description:** Seamless appointment reservation from selection to confirmation.

**User Stories:**
- As a customer, I want to book an appointment in under 60 seconds so I can secure my slot.
- As a customer, I want to add notes so my provider knows my preferences.

**Acceptance Criteria:**
- [ ] Step 1: Select service(s) with optional add-ons
- [ ] Step 2: Choose staff member or "no preference"
tell me to continue from the previous line.
- [ ] Step 3: Calendar view with available slots (15-min granularity); slots disappear if booked by another user within 5 minutes
- [ ] Step 4: Review booking details, apply promo code, add notes (max 500 chars)
- [ ] Step 5: Confirm booking with payment or "pay at venue" option
- [ ] Booking confirmation screen with calendar invite (.ics), add to Google/Apple Calendar
- [ ] Booking reference number generated (format: PLN-XXXXXX)
- [ ] 10-minute hold on selected slot during checkout; released if payment fails
- [ ] Guest checkout supported with email/phone collection

**Priority:** P0 — Must Have
**Estimation:** 3 weeks

---

### 2.8 Appointment Management

**Description:** Full lifecycle management for customer appointments.

**User Stories:**
- As a customer, I want to see my upcoming appointments so I can plan my schedule.
- As a customer, I want to reschedule or cancel so I can adapt to changes.

**Acceptance Criteria:**
- [ ] Upcoming appointments list with chronological sort
- [ ] Appointment detail: service, staff, time, location, QR code for check-in
- [ ] Reschedule: select new slot with same 10-minute hold; unlimited reschedules until cutoff
- [ ] Cancel with reason selection (mandatory); refund policy displayed
- [ ] Cancellation windows: free >24h, 50% fee 4-24h, 100% fee <4h (configurable by business)
- [ ] Push/email confirmation for all changes
- [ ] Past appointments with rebook option
- [ ] No-show flagging with business notification

**Priority:** P0 — Must Have
**Estimation:** 2 weeks

---

### 2.9 Favorites

**Description:** Save preferred businesses for quick re-access.

**User Stories:**
- As a customer, I want to favorite businesses so I can book them again quickly.

**Acceptance Criteria:**
- [ ] Heart icon on business cards and detail pages; toggles with haptic feedback
- [ ] Favorites list with search and sort (recently added, alphabetical)
- [ ] Quick book from favorites: one-tap to business's next available slot
- [ ] Sync across devices for logged-in users
- [ ] Maximum 500 favorites; prompt to organize when approaching limit

**Priority:** P1 — Should Have
**Estimation:** 1 week

---

### 2.10 User Profile

**Description:** Customer account management and preferences.

**User Stories:**
- As a customer, I want to manage my profile so my bookings are personalized.
- As a customer, I want to set preferences so I get relevant recommendations.

**Acceptance Criteria:**
- [ ] Profile photo, name, phone, email, birthday (for birthday offers)
- [ ] Notification preferences: push, email, SMS — per type (bookings, promotions, reminders)
- [ ] Payment methods: add, remove, set default; PCI-compliant tokenization
- [ ] Loyalty points balance and history (if applicable)
- [ ] Booking history with filter by status and date range
- [ ] Data export (GDPR) and account deletion with 30-day grace period
- [ ] Referral code and sharing

**Priority:** P1 — Should Have
**Estimation:** 2 weeks

---

### 2.11 Availability & Slot Computation

**Description:** Real-time calculation of bookable time slots considering complex constraints.

**User Stories:**
- As a business owner, I want my availability to update automatically so I avoid double-booking.
- As a customer, I want to see only real available slots so I trust the system.

**Acceptance Criteria:**
- [ ] Algorithm considers: business hours, staff schedules, service duration, buffer time, existing appointments
- [ ] Recurring availability patterns (weekly) with exception handling (time off, holidays)
- [ ] Real-time slot cache with 5-second invalidation on changes
- [ ] Concurrent booking protection: database-level locking, optimistic UI updates
- [ ] Slot generation supports: split services (color + cut), package duration, variable service times
- [ ] Performance: <200ms for 30-day slot generation for single staff
- [ ] Fallback to waitlist when fully booked

**Priority:** P0 — Must Have
**Estimation:** 3 weeks

---

### 2.12 Shared Types & Design System

**Description:** Consistent UI/UX foundation across all platforms.

**User Stories:**
- As a developer, I want reusable components so I can build features efficiently.
- As a user, I want consistent interactions so the app feels polished.

**Acceptance Criteria:**
- [ ] Design tokens: colors (primary #FF6B6B, secondary, semantic states), typography (Inter font family), spacing (4px grid), shadows, border-radius
- [ ] Component library: buttons, inputs, cards, modals, date picker, time slot grid, skeleton loaders, empty states, error boundaries
- [ ] Accessibility: WCAG 2.1 AA minimum, screen reader support, minimum 44px touch targets, color contrast 4.5:1
- [ ] Dark mode support with system preference detection
- [ ] Shared TypeScript types across web and mobile (React Native)
- [ ] Storybook documentation for all components
- [ ] Animation standards: 200ms transitions, ease-in-out

**Priority:** P0 — Must Have (enabler)
**Estimation:** Ongoing, 2 weeks initial setup

---

### 2.13 Reviews & Ratings

**Description:** Customer feedback system for service quality transparency.

**User Stories:**
- As a customer, I want to read reviews so I can choose quality providers.
- As a customer, I want to share my experience so others benefit.

**Acceptance Criteria:**
- [ ] 5-star rating with optional text review (10–2000 chars)
- [ ] Review eligibility: only verified customers who completed appointment
- [ ] Review prompt: push notification 2 hours after appointment
- [ ] Photo upload (up to 5 images) in reviews
- [ ] Business owner response capability
- [ ] Review moderation: auto-flag for profanity, manual review for disputes
- [ ] Rating breakdown by category: service, staff, ambiance, value
- [ ] Sort reviews: most recent, most helpful, highest/lowest rating
- [ ] Reviews editable for 30 days, deletable by author

**Priority:** P1 — Should Have
**Estimation:** 2 weeks

---

### 蹈.14 Payment Integration

**Description:** Secure, flexible payment processing for bookings.

**User Stories:**
- As a customer, I want to pay securely so I can confirm my booking.
- As a business owner, I want to receive payments so I can operate my business.

**Acceptance Criteria:**
- [ ] Payment methods: credit/debit cards (Stripe), Apple Pay, Google Pay, PayPal
- [ ] "Pay at venue" option (business configurable, may require card on file)
- [ ] Deposit/partial payment support (e.g., 20% to secure booking)
- [ ] Full refund, partial refund, and no-refund policies per business
- [ ] Payment confirmation with receipt (email + in-app)
- [ ] Failed payment retry with 10-minute window before slot release
- [ ] Tip option post-service (24-hour window)
- [ ] Payout to business: weekly to connected account, invoice generation
- [ ] PCI compliance: no raw card data stored; all via Stripe Elements/tokenization

**Priority:** P0 — Must Have
**Estimation:** 3 weeks

---

### 2.15 Notifications

**Description:** Multi-channel communication for booking lifecycle and engagement.

**User Stories:**
- As a customer, I want timely reminders so I don't miss my appointment.
- As a business owner, I want to be notified of new bookings so I can prepare.

**Acceptance Criteria:**
- [ ] Push notifications: booking confirmed, 24h reminder, 1h reminder, rescheduled, cancelled
- [ ] Email notifications: confirmation, receipt, review request, marketing (opt-in)
- [ ] SMS: backup for critical alerts (premium feature option)
- [ ] In-app notification center with read/unread status, 90-day retention
- [ ] Notification preferences granular control per channel and type
- [ ] Quiet hours: no push 22:00–08:00 unless emergency cancellation
- [ ] Delivery tracking: failed push → fallback to SMS if critical
- [ ] Rich push with deep links to relevant screens

**Priority:** P1 — Should Have
**Estimation:** 2 weeks

---

### 2.16 Provider / Business Owner Portal

**Description:** Dedicated interface for businesses to manage their presence and operations.

**User Stories:**
- As a business owner, I want to manage my services and schedule so I control my business.
- As a business owner, I want to see my bookings so I can plan staffing.

**Acceptance Criteria:**
- [ ] Dashboard: today's appointments, revenue this week, upcoming week preview
- [ ] Service management: CRUD services, set duration, price, description, photos
- [ ] Staff management: add team members, set their services and schedules
- [ ] Availability calendar: set recurring hours, block time off, set vacation
- [ ] Booking management: view all appointments, accept/decline (if approval required), check-in with QR scan
- [ ] Customer notes: view booking notes, add internal notes
- [ ] Analytics: booking volume, revenue, no-show rate, popular services, customer retention
- [ ] Settings: business info, photos, cancellation policy, payment settings, notification preferences
- [ ] Mobile-responsive web app; native app version in Phase 2

**Priority:** P0 — Must Have
**Estimation:** 4 weeks

---

### 2.17 Admin Dashboard

**Description:** Platform administration and oversight tools.

**User Stories:**
- As an admin, I want to monitor the platform so I can ensure quality.
- As an admin, I want to manage businesses so I can onboard new providers.

**Acceptance Criteria:**
- [ ] Business onboarding: application review, approval workflow, document verification
- [ ] User management: search customers and business owners, view activity, suspend accounts
- [ ] Content moderation: review flagged reviews and businesses, take action
- [ ] Financial overview: platform revenue, payouts due, transaction monitoring
- [ ] Analytics: MAU, booking conversion funnel, churn rate, top categories and regions
- [ ] System health: API latency, error rates, queue depth
- [ ] Role-based access: super admin, support agent, finance, moderator
- [ ] Audit log: all admin actions with timestamp and actor

**Priority:** P1 — Should Have
**Estimation:** 3 weeks

---

### 2.18 Background Jobs (BullMQ)

**Description:** Asynchronous task processing for reliability and performance.

**User Stories:**
- As a developer, I want reliable job processing so critical operations don't fail silently.
- As a user, I want timely notifications so I'm always informed.

**Acceptance Criteria:**
- [ ] Job types: email sending, push notification delivery, SMS sending, payment webhooks, report generation, data exports, search index updates, image/video processing
- [ ] Retry policy: 3 attempts with exponential backoff (5s, 25s, 125s)
- [ ] Dead letter queue for failed jobs; admin alert after 3 failures
- [ ] Job priorities: critical (payments, cancellations), high (notifications), normal (reports), low (analytics)
- [ ] Scheduled jobs: daily reports at 06:00, weekly summaries on Monday
- [ ] Monitoring: job completion rate, average processing time, queue depth alerts
- [ ] Concurrency control: max 5 workers per queue, scalable horizontally
- [ ] Idempotency keys to prevent duplicate processing

**Priority:** P0 — Must Have (infrastructure)
**Estimation:** 2 weeks setup, ongoing maintenance

---

## 3. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | App launch <2s; screen load <1s; API response <200ms (p95) |
| Availability | 99.9% uptime; scheduled maintenance windows |
| Security | OWASP Top 10 mitigation; encryption in transit (TLS 1.3) and at rest |
| Scalability | Support 10,000 concurrent users; auto-scaling enabled |
| Compliance | GDPR, CCPA, PCI-DSS Level 1 |
| Localization | French (default), English, Spanish, German; RTL support planned |

---

## 4. Success Metrics

| Metric | Target |
|--------|--------|
| Booking conversion rate | >15% |
| Search-to-book time | <3 minutes |
| App store rating | >4.5 stars |
| Business NPS | >50 |
| Customer retention (30-day) | >40% |
| System uptime | >99.9% |

---

## 5. Release Roadmap

| Phase | Features | Timeline |
|-------|----------|----------|
| MVP | Auth, Guest Browse, Search, Map, Business Detail, Booking Flow, Appointment Mgmt, Slot Computation, Design System, Payment, Background Jobs, Business Portal | 12 weeks |
| v1.1 | Favorites, User Profile, Reviews, Notifications, Admin Dashboard | 6 weeks |
| v1.2 | Categories enhancement, Loyalty program, Referrals, Analytics v2 | 6 weeks |
| Scale | AI recommendations, Marketplace features, International expansion | Q3+ |

---

## 6. Open Questions

1. Geographic launch markets and localization priorities
2. Commission structure: percentage per booking or subscription SaaS model
3. Insurance/liability coverage for marketplace transactions
4. Integration requirements with existing salon software (Salonist, Fresha, etc.)

---

*Document version: 1.0*
*Last updated: 2024*
*Owner: Alex, Product Owner*