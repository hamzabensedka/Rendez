# Planity Clone Product Specification

## 1. Introduction
This document defines the complete feature set, priorities, and acceptance criteria for the Planity Clone application. The platform connects customers with local service businesses (salons, spas, etc.), enabling discovery, booking, and management. The specification is written for development teams and covers all user-facing modules, backend services, and tooling.

## 2. Feature Priority Summary
| Priority | Meaning |
|----------|---------|
| P0 | Must-have for MVP launch |
| P1 | Essential for v1, can follow shortly after MVP |
| P2 | Nice-to-have, post-launch enhancements |

---

## 3. Shared Types & Design System
**Priority:** P0

**Description:** Establish a unified design language, reusable components, and TypeScript types shared across frontends (customer app, provider portal, admin dashboard) to ensure consistency and reduce duplication.

**Acceptance Criteria:**
- Design tokens defined: colors, typography, spacing, shadows, border radii.
- Core UI library with components: Button, Input, Modal, Card, Avatar, Rating, Badge, Tabs, DatePicker, TimeSlotPicker, SearchBar, MapPin, Skeleton loaders.
- TypeScript interfaces for all core domain models (Business, Service, Category, User, Appointment, Review, Slot, etc.).
- Theme support (light/dark) provided via a Context/Provider.
- Each component documented in Storybook with interactive examples.
- Responsive guidelines: components adapt to mobile (web responsive) and native platforms.

---

## 4. User Authentication
**Priority:** P0

**Description:** Allow customers to sign up, log in, and manage account security. Social login and passwordless options improve conversion.

**User Story:** As a customer, I want to create an account quickly so I can book services and manage my appointments.

**Acceptance Criteria:**
- Registration with email/password; confirm password field; validation: valid email, password strength (min 8 chars, uppercase, digit).
- Email verification: OTP or link sent; account activated only after verification.
- Login with email/password; rate limiting (5 attempts per IP per 5 min).
- Social login: Google and Apple (native SDKs) returning JWT tokens.
- Forgot password: request reset link, valid for 15 minutes; new password must differ from old.
- JWT token management: access token (short-lived), refresh token (httpOnly cookie for web, secure storage for mobile). Auto-refresh on 401.
- Logout clears local session and invalidates refresh token server-side.
- Error messages: “Invalid credentials”, “Account not verified”, “Email already in use”. All in user’s language.
- Profile completion step after first login (name, phone number) if coming from social login.

---

## 5. Guest Browse & Explore
**Priority:** P1

**Description:** Allow unauthenticated users to explore the platform—search businesses, view details and availability—without friction. Conversion prompt appears only when they attempt to book.

**User Story:** As an unregistered visitor, I want to browse salons and see available time slots so I can decide whether to sign up.

**Acceptance Criteria:**
- Guest can access home page, category browsing, search, map view, business detail page.
- Business detail shows summary info, services list, average rating, and an “Available times” preview (generic slots, e.g., “Mon 10:00 AM – 2 spots”).
- Tapping “Book” or a time slot triggers a modal: “Sign up to book this appointment” with social/email options. Session continues after sign-up to complete booking.
- No personal data stored; search history may be cached anonymously in local storage but not associated with a user.
- Back navigation works correctly; guest state does not break deep links.

---

## 6. Business Search & Discovery
**Priority:** P0

**Description:** Primary mechanism for customers to find businesses by name, location, category, and filters. Supports autocomplete and sorting.

**User Story:** As a customer, I want to search for “hair salon near downtown” and filter by price range and rating.

**Acceptance Criteria:**
- Search bar on home screen with placeholder “Search services or businesses”.
- Full-text search on business name, service names, and description.
- Autocomplete suggestions (business names, categories, popular searches) as user types; fetch from API within 300ms.
- Location filter: “Near me” uses device GPS (or entered address if geolocation denied). Results sorted by distance first.
- Category filter: multi-select from top-level categories; drill-down optional.
- Additional filters: price range (slider), rating (4+), open now, amenities (WiFi, parking).
- Sorting: relevance, distance, rating, price low-high.
- Results displayed as a list with business card (photo, name, category, distance, rating, next available slot badge).
- Pagination: infinite scroll loading 20 items per page.
- No results state: “No businesses found. Try adjusting your filters.”
- Error handling: network failures show retry button.

---

## 7. Map-based Search
**Priority:** P1

**Description:** Visual map interface where users can pan and zoom to discover businesses. Pins cluster and show summary info.

**User Story:** As a visual explorer, I want to see businesses pinned on a map and tap them to preview details.

**Acceptance Criteria:**
- Map view toggle accessible from search results; default location centers on user’s current position (if granted) or city center.
- Businesses shown as custom markers with category icon and rating badge.
- Marker clustering: at higher zoom levels, nearby markers group into a cluster with count; tap expands the cluster.
- Tapping a marker opens a bottom sheet/ popover with business name, photo, rating, and “View details” button.
- Moving the map triggers a new search query (debounced 500ms) within the viewport bounds; list updates accordingly.
- Location permission flow: request rationale; if denied, fallback to manual address input.
- Performance: handle up to 5000 markers without lag using clustering and viewport culling.

---
## 8. Business Detail View
**Priority:** P0

**Description:** Comprehensive page for a single business, covering key information, services, reviews snapshot, and booking entry point.

**User Story:** As a customer, I want to see a salon’s full profile including services and availability to decide to book.

**Acceptance Criteria:**
- Header with cover photo, business name, average rating, number of reviews, and favorite button.
- Tabs/sections: About (description, amenities, address with map thumbnail, contact), Services (list with name, duration, price), Reviews (latest 5 with “See all”), Availability (calendar component showing real-time slots for each service).
- Services list: each item shows a “Book” button if user authenticated; tapping opens booking flow with that service pre-selected.
- Availability calendar: displays next 14 days; day cells colored by availability (green – many slots, yellow – few, grey – none). Select a date to see time slots below with count of remaining spots.
- Sticky bottom bar on mobile: “Book Appointment” CTA, always visible.
- Gallery: photo carousel (up to 10 images, lightbox on tap).
- Loading skeleton while fetching; error fallback with retry.
- Deep link support: direct URL to business detail.
- Location link opens native maps app.

---

## 9. Service Categories
**Priority:** P0

**Description:** Hierarchical category system enabling structured browsing. Admin sets categories; businesses tag their services.

**User Story:** As a customer, I want to browse “Hair” -> “Coloring” to find relevant salons.

**Acceptance Criteria:**
- Home screen displays top-level category cards with icons (Hair, Nails, Face, Massage, Barbershop, etc.).
- Tapping a category navigates to a page with subcategories and a list of businesses offering services in that category.
- Subcategory drilldown: all levels exposed; breadcrumb navigation.
- Each business can be linked to multiple categories through its services.
- Admin can create/edit/delete categories, set order, and upload icons.
- Category pages support sorting/filtering similar to search.
- SEO-friendly URLs for categories (e.g., /categories/hair-coloring).

---

## 10. Booking Flow
**Priority:** P0

**Description:** Step-by-step wizard from service selection to confirmation, with validation and error recovery. Integrates with availability engine.

**User Story:** As a customer, I want to book a haircut for next Tuesday at 2pm and pay securely.

**Acceptance Criteria:**
- Flow: 1. Select Service (from business detail or directly). 2. Choose Professional (if business assigns specific staff; optional). 3. Select Date from calendar (only dates with availability). 4. Select Time slot (list of available slots with duration badge). 5. Review (service, professional, date/time, total price, duration, cancellation policy). 6. Payment (if required; see Payment Integration). 7. Confirmation.
- Real-time slot availability fetched on date change; if slot becomes unavailable after selection, show “Slot just taken” error and allow reselection.
- Booking summary includes business name, service, date/time, provider name, price, taxes (if applicable).
- Input validation: date & time must be in the future, slot must be valid.
- Guest user: after selecting slot, must sign up / log in; then booking continues seamlessly from step 5.
- Error handling: network issues, payment failure, concurrent booking conflict – all show user-friendly messages with recovery options.
- Success screen shows booking ID, calendar add-to-calendar link, and invitation to enable notifications.
- Back navigation allowed; state preserved until payment step; once booked, cannot go back.

---

## 11. Availability & Slot Computation
**Priority:** P0

**Description:** Backend engine that calculates bookable time slots respecting business hours, individual service duration, buffer times, existing appointments, and unavailability. Must be fast and consistent.

**User Story:** As a business owner, I need accurate availability shown to customers to avoid double bookings.

**Acceptance Criteria:**
- Slot generation algorithm: given service duration, business working hours (per day, multiple time blocks), provider availability (overrides working hours), buffer before/after (configurable), existing confirmed/pending appointments, and holiday/timeoffs.
- Real-time check: before confirming a booking, a distributed lock ensures no double booking.
- Endpoint `GET /availability?businessId=...&serviceId=...&dateFrom=...&dateTo=...` returns day-wise slots with timestamp and available count.
- Supports multi-staff businesses: show per-provider slots or aggregated “any provider” slots with count.
- Handles overlapping service durations, back-to-back bookings without buffer.
- Timezone awareness: business stores timezone; all slots returned in the business’s local time.
- Caching: slot data cached with TTL 30 seconds, invalidated on any booking for that business.
- Edge cases: same-day booking when remaining time is shorter than service duration; slot should not show.
- Performance: response time < 200ms for up to 60 days with 5 providers.

---

## 12. Appointment Management
**Priority:** P1

**Description:** Customers view, reschedule, or cancel upcoming appointments. Respects cancellation policies and triggers notifications.

**User Story:** As a customer, I want to see my upcoming appointments and reschedule if needed.

**Acceptance Criteria:**
- Two tabs: Upcoming and Past.
- Upcoming list sorted by date, showing business name, service, date/time, status (confirmed, pending, cancelled).
- Tap to view appointment detail with full info, cancel/reschedule buttons (if within allowed window).
- Reschedule: opens availability view for same business/service; selection replaces appointment with same price; old slot released, new slot booked atomically.
- Cancel: confirm dialog, shows cancellation policy (e.g., free up to 24h before); if eligible, appointment status set to cancelled, slot freed, refund processed (if paid).
- Past appointments: show with ability to add a review (if not already reviewed).
- Cancellation policy display: inline text and tooltip.
- Optimistic UI with rollback on failure.
- Loading and empty states.

---

## 13. Favorites
**Priority:** P1

**Description:** Let customers save businesses for quick access.

**User Story:** As a customer, I want to bookmark salons I like so I can easily find them later.

**Acceptance Criteria:**
- Heart icon on business card and detail page; toggling adds/removes from favorites (authenticated only).
- A dedicated Favorites screen accessible from profile or tab bar; grid/list of saved businesses.
- Sync across devices via backend; optimistic toggle with revert on error.
- Empty state: “No favorites yet. Discover businesses you love!”
- Favorites count shown on business’s public card.

---

## 14. User Profile
**Priority:** P1

**Description:** Manage account details, preferences, payment methods, and appointment history.

**User Story:** As a customer, I want to update my name, phone, and notification preferences.

**Acceptance Criteria:**
- Profile screen with editable fields: name, email (read-only after verification), phone number, profile photo (upload/camera).
- Section: Saved payment methods (list with last4 digits, expiry; add/remove).
- Notification preferences: toggles for push (appointment reminders, promotions) and email (booking confirmations, newsletters).
- Language preference selector (if multi-lang).
- Link to Terms, Privacy, and app version.
- Logout button with confirmation.
- Integration with authentication: email change triggers re-verification.

---

## 15. Reviews & Ratings
**Priority:** P1 (customer side), P2 (business owner responses)

**Description:** After service completion, customers can rate and review. Public average ratings influence discovery.

**User Story:** As a customer, I want to rate my experience and read others’ reviews to make informed decisions.

**Acceptance Criteria:**
- After appointment status becomes “completed”, a push notification invites review within 7 days.
- Review form: star rating 1-5, optional written review (up to 500 chars), optional photo upload (up to 3).
- Submission creates a review linked to user and business; status pending until moderation (configurable).
- Moderation: admin can approve/reject reviews with reason (profanity filter automatic flag).
- Business detail page: average rating displayed as stars and numeric; “Reviews” section shows approved reviews sorted by most recent, with “Show more” pagination.
- Each review shows user first name, date, rating, text, photos (if any).
- Business owner portal: view reviews, report inappropriate, later respond (P2).
- Edit/delete review: allowed within 48 hours after posting; moderation resets if edited.

---

## 16. Payment Integration
**Priority:** P0

**Description:** Secure payment processing for bookings that require upfront payment (configurable per business). Supports card and digital wallets.

**User Story:** As a customer, I want to pay for my appointment safely and receive a receipt.

**Acceptance Criteria:**
- Integration with Stripe (server-side handling). Use Payment Intents for authorization/capture.
- Business can set payment policy: “Pay full at booking”, “Pay deposit (amount/% )”, or “No pre-payment”.
- During booking, if payment required, present payment sheet (Stripe Elements for web, native SDK for mobile) to collect card details without the app touching sensitive data.
- Support saved payment methods: after first payment, option to save card (tokenized) for future use; displayed in profile.
- Payment flow: on booking confirmation, create PaymentIntent with amount, currency; confirm on client; on success, finalize booking; on failure, show error and retry.
- Capture immediately or later (depending on policy). Refund via Stripe on cancellation following policy.
- Receipt email sent automatically by Stripe; booking confirmation includes payment info.
- PCI compliance: never log or store raw card numbers; all card data transmitted directly to Stripe.
- Handle 3D Secure, SCA compliance.
- Error states: insufficient funds, card declined, expired – user sees specific messages.

---

## 17. Notifications
**Priority:** P1

**Description:** Multi-channel notifications to keep users informed. Backed by BullMQ jobs for reliability.

**User Story:** As a user, I want to receive booking confirmation and reminders so I don't miss appointments.

**Acceptance Criteria:**
- Push notifications: via Firebase Cloud Messaging (FCM) for Android and APNs for iOS. Prompt permission after first booking success.
- Email notifications: transactional emails via SendGrid/Mailgun.
- Types:
  - Customer: booking confirmed, reminder (24h and 1h before), rescheduled, cancelled, review request.
  - Business owner: new booking alert, cancellation alert, review received.
  - Admin: high-severity incidents (e.g., payment failure spike).
- Notification settings per user: toggle each type per channel.
- Deep linking: tapping push notification opens relevant screen (appointment detail, business page).
- Offline handling: push received when app in background; badge count updates.
- Delivery handled by BullMQ jobs (see Background Jobs) to ensure reliable delivery with retries.

---

## 18. Provider / Business Owner Portal
**Priority:** P0

**Description:** Web dashboard for service providers to manage their business profile, services, staff, availability, appointments, and get insights.

**User Story:** As a salon owner, I want to list my services, set my schedule, and manage bookings.

**Acceptance Criteria:**
- Separate web application accessible via subdomain or /provider.
- Authentication: same user base but role-based access (BUSINESS_OWNER). Can be same email as customer? Separate account recommended but can link if same email via role selector.
- Onboarding: after registration, wizard to create business profile: name, category, address, phone, description, photos, working hours (day-of-week, multiple time blocks), service list.
- Dashboard: snapshot of today's appointments, upcoming count, revenue summary (week), recent reviews.
- Services management: CRUD for services (name, description, price, duration, category, color). Reorder. Enable/disable.
- Staff (if multi-staff): add staff members, assign services, set individual working hours and timeoffs.
- Calendar view: day/week/month; shows appointments with customer name, service, status; click to view detail; ability to manually add appointment (walk-in) or block time.
- Appointment management: view list, confirm/reject (if business requires manual approval), cancel with reason, mark no-show.
- Availability overrides: block specific date ranges or change hours for holidays.
- Settings: cancellation policy (free until X hours before), payment policy (pay full/deposit/no prepay), auto-confirm toggle.
- Analytics: basic charts for bookings, revenue, popular services over time.
- Notifications: real-time alert when new booking arrived (via WebSocket).
- Responsive design for desktop/tablet; mobile access acceptable but not primary.

---

## 19. Admin Dashboard
**Priority:** P1

**Description:** Superadmin panel to manage the entire platform, moderate content, and view system metrics.

**User Story:** As a platform administrator, I want to manage businesses and users to ensure quality and trust.

**Acceptance Criteria:**
- Secure access with role ADMIN; separate login page.
- Dashboard: key metrics (total businesses, active users, bookings today, revenue, reviews pending moderation).
- Business management: list, search, approve/reject new registrations, suspend/activate businesses, edit details.
- User management: list, search, suspend users, view activity.
- Category management: CRUD for service categories (name, icon, parent).
- Review moderation queue: approve/reject with optional reason; auto-flag based on banned words.
- Appointment management: view all, cancel fraudulent bookings.
- Configuration: global settings (max images per business, review approval required, default cancellation window).
- Reports: export CSV for bookings, revenue within date range.
- Audit log: critical actions logged (who changed what).

---

## 20. Background Jobs (BullMQ)
**Priority:** P0 (infrastructure)

**Description:** Reliable async job processing using BullMQ with Redis for tasks that require retries and scheduling (notifications, payment webhooks, data cleanups).

**User Story:** As a developer, I want to offload notification delivery and payment processing to ensure non-blocking API responses and resilience.

**Acceptance Criteria:**
- Queue setup: multiple queues (notifications, payments, maintenance) with configurable concurrency.
- Job types for notifications: booking confirmation email, push reminder (scheduled with delay/cron), cancellation notice.
- Payment jobs: handle Stripe webhook events (payment_intent.succeeded, payment_intent.payment_failed) to update appointment status reliably.
- Retry with exponential backoff: max attempts 5 for notification, 10 for payment jobs.
- Dead letter queue for permanently failed jobs; admin can view and retry.
- Scheduled jobs: appointment reminders 24h and 1h before using BullMQ repeatable jobs or delayed jobs.
- Job progress and logging: track each attempt.
- Graceful shutdown: workers finish active jobs before exit.
- Monitoring: Bull Board UI accessible in dev/staging; metrics exported.

---

## Appendix: Non-Functional Requirements
- Performance: API response time < 200ms (95th percentile).
- Security: HTTPS everywhere, input sanitization, rate limiting, CSRF tokens.
- Accessibility: WCAG 2.1 AA for web portals.
- Localization: i18n support with at least English and French.
- Observability: structured logging, error tracking (Sentry), APM integration.

This specification serves as the foundational document for development planning and QA testing.