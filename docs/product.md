# Planity Clone Product Specification

## 1. Introduction
Planity Clone is a mobile-first platform that connects customers with beauty and wellness salons for seamless appointment booking. This document defines the complete set of features, user stories, acceptance criteria and priorities for the initial public release (v1.0). It serves as the single source of truth for the engineering, design and QA teams.

## 2. Product Vision & Goals
- **Vision:** Become the go-to app for discovering and booking beauty appointments in under 60 seconds.
- **Business Goals:** 15,000 monthly bookings within 6 months, 30% user retention, 4.5+ star app store rating.
- **User Goals:** Easy discovery of nearby salons, transparent pricing, instant booking, reliable reminders and a seamless post-booking experience (reviews, rescheduling).

## 3. User Personas
1. **End User (Customer):** Books services for themselves or family. Values convenience, trust and price clarity.
2. **Provider (Salon Owner/Staff):** Manages calendar, services and staff. Needs simplicity and real-time updates.
3. **Admin (Platform Operator):** Oversees marketplace health, resolves disputes, monitors KPIs.

## 4. Feature Catalog & Acceptance Criteria
Each feature includes a brief description, priority (P0 – must-have, P1 – high, P2 – nice-to-have), and detailed acceptance criteria.

---

### 4.1 User Authentication
**Description:** Secure sign-up/login via email/password and social providers (Google, Apple). Role-based access: customer and provider.
**Priority:** P0

**Acceptance Criteria:**
- AC1: Users can register with email, password (min 8 chars, 1 number, 1 uppercase), first name, last name, phone number.
- AC2: Login with email/password, Google, Apple Sign-In. OAuth flow returns JWT token and user profile.
- AC3: Password reset flow: request link, email sent, valid for 15 min, sets new password.
- AC4: After registration, user selects role (Customer/Provider). Provider must enter business name to continue (later completes full profile).
- AC5: Sessions expire after 30 days, refresh token rotation implemented.
- AC6: Logout invalidates token on client, server-side blacklisting optional for v1.
- AC7: Errors displayed inline (e.g., "email already in use", "weak password").

---

### 4.2 Guest Browse & Explore
**Description:** Unauthenticated users can explore salons, services, availability and prices. No booking allowed.
**Priority:** P0

**Acceptance Criteria:**
- AC1: Home feed shows featured salons, popular services, categories.
- AC2: Search and map views accessible without login.
- AC3: Tapping any salon/service opens detail view. "Book" button prompts login/registration.
- AC4: Guest can switch location manually or allow GPS (one-time prompt). Defaults to device locale.
- AC5: All booking CTA buttons display a lock icon or "Sign in to book" label.

---

### 4.3 Business Search & Discovery
**Description:** Full-text search with filters, categories, and sort options. Results include salon cards with rating, distance, number of reviews.
**Priority:** P0

**Acceptance Criteria:**
- AC1: Search bar at top of home. As user types, suggestions appear (salon names, services, categories). Debounce 300ms.
- AC2: Filters: category (multi-select), distance (radius slider 1–50 km), price range, rating, availability "today", "this week".
- AC3: Sort by relevance, rating (highest), distance (nearest), price (low-high/high-low).
- AC4: Results are paginated (10 per page) with infinite scroll.
- AC5: Empty state shows "No salons found. Try adjusting filters."
- AC6: Recent searches saved locally (max 10).

---

### 4.4 Map-based Search
**Description:** Interactive map showing salon pins with clustering, tap to see preview, full-list switch.
**Priority:** P1

**Acceptance Criteria:**
- AC1: Map renders on a dedicated tab or toggle. Centers on user location (with permission) or default city center.
- AC2: Salon pins display star rating and price level. Clustering at far zoom levels.
- AC3: Tapping a pin shows a mini-card: name, rating, thumbnail, distance, "View" button.
- AC4: "List" button switches to list view while keeping same filters and location.
- AC5: Map updates as user moves; search area redrawn (debounce 1s).
- AC6: Performance: 200+ pins without significant lag.

---

### 4.5 Business Detail View
**Description:** Comprehensive salon profile: gallery, services, staff (optional), reviews, location, hours, FAQ.
**Priority:** P0

**Acceptance Criteria:**
- AC1: Hero image carousel (tap to full-screen). Swipe gestures.
- AC2: Salon name, address (open in maps), phone (tap to call), rating average, total reviews.
- AC3: Services tab: categorized list, each showing duration, price, "Book" button. Staff filter if multi-staff.
- AC4: Reviews tab: summary (5-star bar chart) and paginated reviews. Each review shows rating, text, photos, date, user first name and last initial.
- AC5: About section: description, amenities, COVID measures, cancellation policy.
- AC6: "Favorite" heart icon (filled if saved).
- AC7: Operating hours with current status ("Open now", "Closes soon").
- AC8: Deep linking: direct link to salon detail from notifications or external sources.

---

### 4.6 Service Categories
**Description:** Browse by predefined service categories (Hair, Nails, Massage, etc.) with icons. Serves as top-level navigation.
**Priority:** P0

**Acceptance Criteria:**
- AC1: Category icons displayed horizontally scrollable on home screen.
- AC2: Tap category opens a view with subcategories (e.g., Hair → Cut, Color, Styling) and popular salons offering those services.
- AC3: Admin can add/edit categories and subcategories via Admin Dashboard. Changes reflect within 5 minutes (cache invalidation).
- AC4: Each category has a representative image and SEO-friendly slug.

---

### 4.7 Booking Flow
**Description:** Step-by-step wizard: select service, choose professional (if applicable), pick date/time, confirm, pay/authorize. Seamless for returning users.
**Priority:** P0

**Acceptance Criteria:**
- AC1: Start from salon detail (specific service) or "Book" button with service pre-selected.
- AC2: Step 1 – Service: user can add multiple services to same booking (max 4 services per appointment) with quantity selector. Real-time total updates.
- AC3: Step 2 – Staff (optional): display staff matching services. Each staff card shows photo, rating, next available slot.
- AC4: Step 3 – Date/Time: interactive calendar highlighting days with availability. Time slots based on duration and buffer. Slots disabled if past.
- AC5: Step 4 – Review: service summary, total, date, time, staff, salon, cancellation policy text (e.g., "Free cancellation up to 24h before"). User can add notes (max 250 chars).
- AC6: Step 5 – Payment: integrated payment sheet (Stripe). Supports credit/debit, Apple Pay, Google Pay. Payment is captured upon booking (hold amount or full charge based on salon policy).
- AC7: Booking confirmation screen: booking ID, QR code, add to calendar (iCal/Google), option to share.
- AC8: Users can book as signed-in customer only. Guest is redirected to sign-up with deep link back to continue booking.
- AC9: Concurrency handling: if two users try to book the same slot, first to pay wins; second sees "Sorry, this slot is no longer available" and offered alternatives.

---

### 4.8 Appointment Management
**Description:** Users view upcoming, past appointments, reschedule or cancel based on policy.
**Priority:** P0

**Acceptance Criteria:**
- AC1: "My Appointments" screen with tabs: Upcoming, Past.
- AC2: Upcoming card shows: service, date/time, salon name, staff (if any), status (Confirmed, Pending, etc.), countdown.
- AC3: Actions: Reschedule (opens available slots per policy), Cancel (with confirmation modal explaining refund if any), Contact salon (in-app chat v2 or call).
- AC4: Cancellation policy enforced: if within free window, full refund; otherwise, partial/no refund displayed before final cancel.
- AC5: Rescheduling re-runs availability and holds new slot for 10 min during payment adjustment (if cost difference).
- AC6: Past appointments list with ability to rate/review (if not already done) and rebook same service with one tap.
- AC7: Appointment detail page includes booking code, history log (created, confirmed, rescheduled, cancelled).

---

### 4.9 Favorites
**Description:** Save salons to a favorites list for quick access.
**Priority:** P1

**Acceptance Criteria:**
- AC1: Heart icon on salon cards and detail view toggles favorite state.
- AC2: Favorites screen accessible from profile tab; empty state "Add your favorite salons…".
- AC3: Synced to backend; persists across devices.
- AC4: Option to sort favorites by recently added, rating, distance.

---

### 4.10 User Profile
**Description:** Manage personal info, payment methods, notification preferences, privacy settings.
**Priority:** P0

**Acceptance Criteria:**
- AC1: Edit first name, last name, phone, email (email change requires verification).
- AC2: Profile photo upload (max 5 MB, cropped circle).
- AC3: Saved payment methods list (card brand, last4, exp. date). Option to add/delete. Default payment method selected.
- AC4: Notification preferences toggles: push (booking reminders, promotions, salon messages) and email.
- AC5: Section for linked accounts (Google, Apple). Show status and option to unlink with confirm password.
- AC6: Account deletion option with 30-day grace period (soft delete). Warning about losing history.
- AC7: App version, terms of service, privacy policy links.

---

### 4.11 Availability & Slot Computation
**Description:** Core engine that calculates bookable time windows based on staff schedules, service durations, breaks, existing bookings and salon-level buffers.
**Priority:** P0 (system logic)

**Acceptance Criteria:**
- AC1: Providers define working hours per staff member (recurring weekly template with date overrides for holidays, vacations).
- AC2: Services have duration (in 5-min increments) and optional break before/after (buffer) and clean-up time.
- AC3: Engine considers existing appointments (including pending holds) to avoid double booking. Slot held for 10 minutes after user enters payment step (state=held).
- AC4: Support parallel availability for multiple staff. If a service can be performed by multiple staff, slots reflect combined availability.
- AC5: Calendar returns slots for a given date range, service ID, staff ID (optional). Slots are computed from opening time + service duration + buffer, stepping in 15-min blocks.
- AC6: Caching strategy: pre-compute slots for next 7 days per staff, invalidate on booking/cancellation. Quick response <200ms.
- AC7: Admin can manually block time slots (e.g., maintenance).

---

### 4.12 Shared Types & Design System
**Description:** Unified TypeScript types shared across frontend/backend (monorepo) and a consistent UI component library.
**Priority:** P0 (architecture)

**Acceptance Criteria:**
- AC1: Shared npm package `@planity/shared-types` contains interfaces for User, Salon, Service, Booking, Review, Notification, Payment, TimeSlot, etc., with strict typing.
- AC2: Design system tokens: colors, typography, spacing, shadows defined in Figma and exported as JSON/CSS variables.
- AC3: Reusable UI components: Button (variants: primary, secondary, danger, ghost), Input (with error states), Card, Modal, BottomSheet, StarRating, Badge, Skeleton loader.
- AC4: Components handle loading, empty, error states as per design.
- AC5: Accessibility: minimum contrast ratios, touch targets >= 44px, proper ARIA labels.
- AC6: Dark mode considered but deferred to v2 (design ready, logic extendible).

---

### 4.13 Reviews & Ratings
**Description:** Customers rate and review completed appointments. Moderation queue for providers.
**Priority:** P0

**Acceptance Criteria:**
- AC1: After appointment is marked completed, user receives push notification/email encouraging review. Direct link to review form with booking context.
- AC2: Review form: star rating (1-5), text (min 10 chars, max 1000), optional photo upload (max 3).
- AC3: Reviews are displayed on salon profile with relative time and user’s first name, last initial.
- AC4: Provider can view all reviews in Provider Portal. Can report a review (reason required). Reports go to admin moderation queue.
- AC5: Admin can approve/reject flagged reviews, hide or remove.
- AC6: Rating average calculated with rolling update. Sorted by recent by default, option to sort by most helpful (future).
- AC7: Users can edit/delete their own review within 7 days.

---

### 4.14 Payment Integration
**Description:** Secure payment processing via Stripe. Supports pre-authorization, capture, refunds, and split payouts to providers (via Stripe Connect).
**Priority:** P0

**Acceptance Criteria:**
- AC1: Customer can add cards via Stripe Elements; PCI compliance handled by Stripe.
- AC2: Booking flow creates a PaymentIntent with amount, currency, customer ID. Capture method depends on salon setting (manual capture vs automatic upon completion). Default is manual: hold at booking, capture after service is marked complete.
- AC3: For cancellations, refunds processed according to cancellation policy. Stripe refund object created; admin/ system can trigger partial/full refund.
- AC4: Provider onboarding via Stripe Connect Express (country limit initially FR, BE). Provider Dashboard shows onboarding status.
- AC5: Platform fee (configurable percentage) deducted at transfer time. Remaining amount goes to provider’s connected account.
- AC6: All payment events logged (webhook processing idempotent).
- AC7: Users see receipts in booking history; downloadable PDF.

---

### 4.15 Notifications
**Description:** Multi-channel notifications: push (Firebase/APNs), email, optional SMS. Transactional and promotional, with user control.
**Priority:** P0

**Acceptance Criteria:**
- AC1: Transactional triggers: booking confirmation, reminder 24h/1h before, reschedule confirmation, cancellation, payment receipt, review request.
- AC2: Promotional (opt-in): deals, new salon in area, re-engagement after 30 days inactive.
- AC3: Push notifications use FCM/APNs with rich media (image for promotions).
- AC4: Email via SendGrid with responsive templates; includes iCal attachment for bookings.
- AC5: User preferences respected; immediate unsubscribe link in email footer.
- AC6: Notification history screen in-app showing last 30 days.
- AC7: Delivery status tracked; failed push logged and retried once.

---

### 4.16 Provider / Business Owner Portal
**Description:** Web-based dashboard for salon owners to manage their profile, services, staff, calendar, and view analytics.
**Priority:** P0 (providers are core)

**Acceptance Criteria:**
- AC1: Secure login with same credentials; only Provider role has access.
- AC2: Dashboard home: upcoming bookings (today/tomorrow), quick stats (total bookings, revenue, new clients past 7/30 days).
- AC3: Calendar view (day/week/month) showing appointments with color-coded services, staff filter. Click appointment to see details, mark as completed, no-show, or cancel.
- AC4: Service management: add/edit/delete services with name, category, duration, price, color, staff assignment (multi-select), description, image.
- AC5: Staff management: add staff members (name, photo, role), set weekly working hours, assign services they perform. Temporary blocks (vacation, sick leave).
- AC6: Booking management: manual booking on behalf of customer (walk-in), accept/reject booking requests if manual approval mode enabled.
- AC7: Profile settings: business name, description, address (geocoded automatically), phone, photos gallery upload (drag-and-drop, min 5, max 20), cancellation policy template.
- AC8: Financial reporting: earnings summary, upcoming payouts, transaction list with date, service, client, amount, fee. Export CSV.
- AC9: Review management: list of reviews with ability to respond (public reply).
- AC10: Notifications: real-time alerts for new booking, cancellation, low inventory (future). Sound toggle.
- AC11: Sub-account roles: Owner (full), Manager (booking & calendar), Staff (view-only own calendar).

---

### 4.17 Admin Dashboard
**Description:** Super-admin panel for marketplace governance, user management, moderation, analytics, and configuration.
**Priority:** P1

**Acceptance Criteria:**
- AC1: Role-based access: super admins, support agents.
- AC2: Dashboard metrics: total users (customers/providers), bookings (daily, weekly, monthly), revenue, platform fees, active salons, churn.
- AC3: User management: search by email/name, view detail, suspend/ban, reset password, view booking history.
- AC4: Salon verification: review submitted salons, approve/reject with reason, set featured flag.
- AC5: Moderation queue: reported reviews, flagged content. Ability to hide/delete review, notify reporter.
- AC6: Dispute handling: cancellation/refund requests, manual refund tool with reason logging.
- AC7: Configuration: platform fee percentage, cancellation policy defaults, supported categories, feature toggles (map search, social login).
- AC8: Audit log: sensitive actions (admin actions, role changes) stored with timestamp and user.
- AC9: Background job monitoring: view BullMQ dashboard with queue sizes, failed jobs, retry capability.
- AC10: Customer support: impersonate user (with legal consent) to diagnose issues.

---

### 4.18 Background Jobs (BullMQ)
**Description:** Asynchronous task processing for time-consuming or scheduled operations using BullMQ with Redis. Ensures reliability and decoupling.
**Priority:** P0 (infrastructure)

**Acceptance Criteria:**
- AC1: Job queues: `notifications`, `payments`, `scheduling`, `data-export`, `index-rebuild`.
- AC2: Notification jobs: build payload, send via appropriate channel with retry (exponential backoff, max 3 attempts).
- AC3: Payment jobs: capture payment after service completion automatically if salon policy auto-capture, process refunds, sync Stripe status.
- AC4: Scheduling jobs: release expired held slots after 10 minutes, update booking statuses (e.g., auto-complete 24h after appointment time if not marked).
- AC5: Cron-like job: generate daily/weekly reports for providers (email CSV).
- AC6: All jobs are idempotent; failed jobs go to dead-letter queue and alert admin via Slack/email.
- AC7: Job processing time monitored, dashboard accessible from admin.

---

## 5. Non-Functional Requirements
- **Performance:** App cold start < 2s, API responses p95 < 300ms, slot calculation <200ms.
- **Scalability:** Support 10k concurrent users, 100k bookings/day. Horizontal scaling with stateless containers.
- **Security:** HTTPS everywhere, JWT with RS256, RBAC, input sanitization, rate limiting (100 req/min per IP for auth, 300 for general), Stripe PCI.
- **Data Privacy:** GDPR compliant; data export, account deletion, consent records.
- **Accessibility:** WCAG 2.1 AA for customer-facing screens (color contrast, focus management).
- **Reliability:** 99.9% uptime target, automated backups, graceful degradation (e.g., map unavailable, show list).

## 6. Release Milestones
- **Sprint 1-2:** Setup: Shared types, design system foundations, auth (customer), database schema.
- **Sprint 3-4:** Provider onboarding, salon profile CRUD, service/ staff management.
- **Sprint 5-6:** Search, map, booking flow, availability engine, payment integration.
- **Sprint 7-8:** Notifications, reviews, favorites, appointment management, provider portal calendar.
- **Sprint 9-10:** Admin dashboard, background jobs, hardening, performance tuning, internal testing.
- **Sprint 11-12:** Beta testing, localization FR, playstore review, launch.

## 7. Appendix: Glossary
- **Slot:** A specific start time at which a service can be booked.
- **Buffer:** Additional time before/after service to prepare/clean.
- **Held Slot:** Temporarily reserved slot during payment processing.
- **Connect:** Stripe Connect for marketplace payouts.
- **Provider:** Salon owner or staff using the business portal.
- **Customer:** End user booking beauty services.