# Product Specification: Planity Clone

## 1. Introduction
Planity Clone is a mobile-first appointment booking platform connecting customers with local service businesses (salons, spas, barbers, wellness, etc.). The app allows users to discover businesses, browse services, book appointments, manage appointments, leave reviews, and pay online. Business owners and providers manage their schedules, services, staff, and appointments via a dedicated portal. An admin dashboard oversees the platform. Background jobs handle notifications, reminders, and slot computation.

## 2. User Personas
- **Guest User:** Unauthenticated user who can browse businesses, view details, and search but cannot book.
- **Registered Customer:** Authenticated user who can book appointments, manage them, save favorites, write reviews, and set preferences.
- **Provider / Business Owner:** Manages a business profile, staff, services, availability, appointments, and reviews.
- **Admin:** Platform admin overseeing businesses, users, payments, and system health.

## 3. Feature Specifications

### 3.1 User Authentication
**Priority: P0 (Must-have)**
- Registration with email/phone + password, social login (Google, Apple).
- Login with credentials, social accounts, or magic link.
- Password reset flow.
- Phone number verification via OTP (for bookings and reminders).
- Optional guest-to-registered transition saving in-progress booking.
- JWT token management with refresh tokens. Session expiry after inactivity.

**Acceptance Criteria:**
1. User can register with email and password, receive verification email, and verify account.
2. User can login via Google/Apple; if account doesn’t exist, prompt to complete registration.
3. User can request password reset, receive email with reset link, set new password.
4. Phone number entered during booking triggers OTP verification; after verification, stored in profile.
5. Auth token expires in 15 min; refresh token rotates every 30 days. When expired, user is redirected to login with no data loss.
6. Guest user data (cart/selected service) persists after sign-up and login.

---

### 3.2 Guest Browse & Explore
**Priority: P0**
- Unauthenticated users can view home screen, popular businesses, categories, and search.
- Can view business detail pages, services, reviews, and map.
- Booking button prompts login/sign-up.
- No personalization, but location-based results using approximate location (if permission granted).

**Acceptance Criteria:**
1. Guest landing page shows featured businesses, top categories, search bar.
2. Tapping 'Book' opens login/sign-up modal; after auth, returns to booking flow.
3. Location permission request: if granted, show nearby businesses; if denied, show default city or allow manual location entry.
4. All business detail information (excluding contact) is visible; contact details hidden behind auth.

---

### 3.3 Business Search & Discovery
**Priority: P0**
- Full-text search across business name, services, categories, and descriptions.
- Filters: category, price range, rating, distance, availability (today/tomorrow/this week), amenities (wifi, parking, etc.).
- Sort by: relevance, distance, rating, price, popularity.
- Autocomplete suggestions as user types.
- Search results display business cards with photo, rating, distance, category, and next available slot.

**Acceptance Criteria:**
1. Search input triggers autocomplete from business names and services (debounced).
2. Apply filters and sorting; results update without full page reload.
3. Each result card shows: name, category, average rating (stars), distance, next available appointment time, starting price.
4. Empty state with suggestion to broaden filters or search term.
5. Pagination or infinite scroll (20 items per page).

---

### 3.4 Map-based Search
**Priority: P1**
- Interactive map (Google Maps/Mapbox) displaying pins for businesses within viewport.
- Cluster pins for high density.
- Tap pin to see business preview card, tap card to open detail.
- Search bar synced with map; map re-centers on search results.
- User location button to re-center.
- Map view toggle between list and map.

**Acceptance Criteria:**
1. Map loads with user’s current location (if granted) or default city.
2. Pinch/zoom updates visible businesses; clusters form at low zoom.
3. Tapping a pin shows a bottom sheet with business name, rating, price, next slot; tap opens detail.
4. Switching to list view retains filters/sorting from map.
5. Search on map filters pins; map re-centers to best matching area.

---

### 3.5 Business Detail View
**Priority: P0**
- Business header: cover photo, logo, name, rating, review count, category, address, distance, open status.
- Photo gallery with swipe.
- Tabbed sections: About, Services, Reviews, Map, Availability.
- About: description, amenities, contact info (phone, web, social links) — phone/web show only to logged-in users.
- Services: list of service categories and individual services with duration, price, and description.
- Action button: “Book Appointment” (sticky bottom).
- Provider/staff selection if multi-staff business.
- Share button.

**Acceptance Criteria:**
1. Detail page loads with hero images and essential info.
2. Services tab displays grouped by category; tapping a service opens booking flow.
3. Reviews tab shows recent reviews with pagination, average rating distribution.
4. Contact info blurred for guest users; taps prompt login.
5. Open status dynamically computed from working hours and holidays.
6. Favorites heart toggle works (logged in).

---

### 3.6 Service Categories
**Priority: P0**
- Admin-managed category hierarchy: e.g., Hair > Haircut, Hair > Coloring; Nails > Manicure, etc.
- Categories displayed on home screen, search filters, and business detail.
- Each category has icon/image.
- Businesses can assign their services to categories.

**Acceptance Criteria:**
1. Home screen shows category carousel with icons.
2. Tapping category navigates to subcategories or list of businesses offering that category.
3. Category filter on search works with multi-select.
4. Admin can add/edit/delete categories and subcategories.
5. Service creation for business must map to a category.

---

### 3.7 Booking Flow
**Priority: P0**
- After selecting a service (from business detail or direct from search), user enters booking flow.
- Steps:
  1. Choose service (if multiple) or service variant (duration/upgrades).
  2. Choose staff member (if applicable, show next availability per staff).
  3. Select date and time from available slots (calendar with blocked days).
  4. Add notes/special requests.
  5. Review order summary: service, staff, date/time, location, price.
  6. Apply promo code if applicable.
  7. Sign in / sign up or continue as guest (guest info captured).
  8. Payment: choose payment method, confirm.
  9. Confirmation screen with booking details and option to add to calendar.

- Slot selection considers real-time availability from provider’s schedule and concurrent bookings.

**Acceptance Criteria:**
1. Each step shows progress indicator (e.g., 1-2-3-4).
2. Date picker highlights available days; unavailable days greyed out.
3. Time slots show only slots that match service duration and staff availability. No double-booking.
4. Slot holds for 5 minutes while user completes details (optimistic lock). If session expires, prompt to restart.
5. Payment supports credit/debit card, Apple Pay, Google Pay (via Stripe), with pre-authorization.
6. Successful payment triggers booking confirmation, email/SMS notification, and redirect to confirmation page.
7. Booking can be cancelled for refund if within cancellation window (provider-defined).

---

### 3.8 Appointment Management
**Priority: P0**
- Customer dashboard: list upcoming and past appointments.
- Each appointment card shows date, time, business name, service, staff, status (confirmed, in-progress, completed, cancelled, no-show).
- Actions: Reschedule, Cancel (if allowed), Add to calendar, Contact business, View invoice, Write review (after completion).
- Appointment detail: full info, map link, directions, prep instructions, add to reminders.
- Push notification reminders x hours before appointment.

**Acceptance Criteria:**
1. Upcoming tab sorted by soonest; past tab sorted by most recent.
2. Rescheduling: opens availability screen for same service/staff or different; existing slot released upon new booking confirmation.
3. Cancellation: if within free cancellation period, full refund; otherwise charge per policy. Reason required.
4. After cancellation, slot becomes available immediately.
5. Completion triggers review prompt after 1 hour via push/email.
6. All state transitions logged.

---

### 3.9 Favorites
**Priority: P1**
- Logged-in user can save businesses to favorites.
- Accessible from profile or bottom tab.
- Show list of favorite businesses with quick actions: Book, View, Remove.
- Sync across devices (tied to account).

**Acceptance Criteria:**
1. Heart icon toggle on business card and detail page.
2. Favorites list displays business cards similar to search results.
3. Empty state with suggestion to explore.
4. Swipe to delete (with undo).
5. Offline: show cached favorites if no connection.

---

### 3.10 User Profile
**Priority: P1**
- Manage personal info: name, email, phone, profile photo.
- Notification preferences (push, email, SMS).
- Payment methods management (add/delete credit/debit cards with Stripe tokenization).
- Booking history and upcoming appointments quick links.
- Logout, delete account, privacy settings.
- Family accounts: manage linked profiles (child/parent) with shared wallet? (Future P3)

**Acceptance Criteria:**
1. Edit profile fields with validation.
2. Add payment method via Stripe Elements; card details never hit our server.
3. Notification toggles per channel and type (booking confirm, reminder, promo).
4. Delete account triggers anonymization and cancellation of future appointments with notification.
5. All changes reflected in real-time.

---

### 3.11 Availability & Slot Computation
**Priority: P0 - Backend**
- Business working hours: set per day, with break periods.
- Staff availability: working hours within business hours, days off, time off.
- Exceptional hours: holidays, special events overrides.
- Service duration plus buffer time (before/after) determines slot length.
- Slot computation engine: generates available time slots for a given day considering staff schedules, existing appointments, and business-level settings (parallel bookings, resources).
- Recurring appointments not in scope for MVP.
- Slot caching with invalidation on new booking/cancellation.

**Acceptance Criteria:**
1. For a given business, service, and date, the API returns a list of start times that satisfy staff availability and service duration + buffers.
2. When an appointment is booked, that slot (and overlapping buffer) becomes unavailable for that staff.
3. Support multiple staff: each staff has own schedule; overlapping availability among staff shown if user chooses “any staff”.
4. Slots are computed considering time zone of business.
5. Performance: slot computation for a week ahead must complete in <200ms for typical business with 5 staff.
6. Background job recomputes cached slots for next 4 weeks whenever schedule changes.

---

### 3.12 Shared Types & Design System
**Priority: P0 - Foundation**
- Standardized UI components: buttons, inputs, cards, modals, loaders, toast notifications, bottom sheets, tab bars.
- Typography, color palette, spacing, icons set (e.g., Material Design or custom).
- Design tokens for consistent theming (light/dark mode).
- Shared typescript types/interfaces for all entities: User, Business, Service, Appointment, Review, etc.
- Reusable hooks and utilities for date formatting, price display, etc.

**Acceptance Criteria:**
1. All developers use shared component library; no custom buttons without design review.
2. Dark mode supported across all screens.
3. Type definitions in a monorepo package imported by both frontend and backend.
4. Design tokens stored in JSON and consumed by Tailwind/styled-components.
5. Storybook or similar documentation for UI components.

---

### 3.13 Reviews & Ratings
**Priority: P1**
- After appointment completed, customer can leave a star rating (1-5) and text review.
- Review includes service, staff, optional photos.
- Business average rating updated asynchronously.
- Public display on business detail: total average, count, star distribution, list with sorting (most recent, highest, lowest).
- Business owner can respond to reviews (one response per review).
- Moderation: flagging, auto-filter profanity.

**Acceptance Criteria:**
1. Only customers with a completed appointment can review (verified badge).
2. Review submission triggers push notification to business owner.
3. Business response appears inline under review.
4. Average rating recalculates via background job; threshold for display (≥1 review).
5. Admin can hide inappropriate reviews.
6. Photo upload limited to 5 images, resized and compressed.

---

### 3.14 Payment Integration
**Priority: P0**
- Stripe Connect for marketplace payments: customer pays platform, platform pays business (minus commission).
- Support for one-time payment for booking (full or deposit, based on business settings).
- Payment methods: credit/debit cards, digital wallets (Apple Pay, Google Pay).
- Secure tokenization; PCI-DSS compliance.
- Refunds: partial/full via dashboard or automatically on cancellation.
- Invoice generation and email after payment.

**Acceptance Criteria:**
1. Booking flow collects payment and creates Stripe PaymentIntent.
2. On successful payment, booking status moves to 'confirmed'; webhook updates backend.
3. Provider can set deposit percentage (0-100) for services.
4. Cancellation triggers refund via Stripe; if within free cancellation period, full refund; otherwise retention per policy.
5. Payouts to providers scheduled daily via Stripe Connect (manual or automatic).
6. Admin can see all transactions, fees, and disputes.

---

### 3.15 Notifications
**Priority: P0**
- Push notifications for appointment confirmations, reminders, cancellations, reschedules, review prompts, promotional (opt-in).
- In-app notification center with read/unread status.
- Email notifications for booking confirmation, receipts, reminders.
- SMS for short-term reminders (optional, user preference).
- Triggered by events via background jobs (BullMQ).

**Acceptance Criteria:**
1. User can opt channel: push, email, SMS for each event type.
2. Reminder push sent 24h and 1h before appointment.
3. Notification content rich: business name, time, address, tap to open appointment.
4. Failed delivery logged; retry with backoff.
5. In-app notification list shows all notifications with relative time; delete/clear.
6. Admin can send promotional push to segment.

---

### 3.16 Provider / Business Owner Portal
**Priority: P0 - Web responsive**
- Dashboard: today’s appointments, upcoming, key metrics (bookings this week, revenue, new clients).
- Appointment management: view, confirm, cancel, mark no-show, add notes.
- Calendar view: day/week/month with slots, drag to create block time.
- Staff management: add/edit/delete staff, set their working hours and services they provide.
- Services management: create/edit services, assign to categories, set price, duration, buffer, deposit, require staff assignment.
- Working hours: set regular hours per day, breaks, special hours/holidays.
- Client management: list of clients with history, notes, tags.
- Reviews: view and respond.
- Settings: business profile (name, description, photos, contact, address, amenities), notification preferences.
- Financial reports: earnings, payout history, transactions.
- Multi-location support if business has branches.

**Acceptance Criteria:**
1. Provider can view all appointments in calendar and list, filter by staff, service, date.
2. Creating a block time (unavailable) prevents booking for that period.
3. Staff can be assigned to specific services only.
4. Modifying working hours triggers slot recomputation job.
5. Provider can respond to reviews; response appears under review.
6. Financial dashboard shows net earnings after platform fee.
7. Accessible on mobile browsers with responsive design.

---

### 3.17 Admin Dashboard
**Priority: P1**
- Super admin: manage all businesses, users, categories, pricing rules, platform fees.
- Dashboard with KPIs: total bookings, revenue (platform share), active businesses, user growth.
- Business management: approve/suspend businesses, edit details, view analytics.
- User management: view users, suspend accounts, assist with booking issues.
- Disputes/refunds: view payment disputes, process manual refunds.
- Global settings: category hierarchy, commission percentages (per business or global), notification templates.
- Audit logs for sensitive actions.

**Acceptance Criteria:**
1. Admin can list businesses with search, filter by status (active, suspended, pending).
2. Suspend business immediately blocks new bookings and hides from search.
3. Admin can impersonate a user for support (with audit log).
4. Fee configuration: set flat fee + percentage per transaction, applied automatically.
5. Revenue reports exportable as CSV.
6. Role-based access: super admin vs support agent.

---

### 3.18 Background Jobs (BullMQ)
**Priority: P0 - Backend**
- Slot recomputation job triggered on schedule change, new appointment, cancellation.
- Notification dispatch jobs: send push, email, SMS.
- Review reminder job 1h after appointment completion.
- Appointment auto-confirm/cancel if payment fails or no-show policy.
- Payment reconciliation and payout schedule.
- Data cleanup: anonymize deleted accounts, clear expired tokens.
- Cache warming for popular business slots.

**Acceptance Criteria:**
1. Jobs are queued with appropriate priorities and retries (exponential backoff).
2. Slot recomputation job processes within 30s of trigger; updates cache.
3. Notification jobs handle failures gracefully, log attempts.
4. Dead letter queue for failed jobs after max retries; alert admin.
5. Bull dashboard accessible for monitoring.
6. Jobs are idempotent where possible.

---

## 4. Non-Functional Requirements
- Performance: App screens load <2s on 4G, API p95 latency <300ms.
- Scalability: Handle 10k concurrent bookings during peak.
- Security: HTTPS, encrypt PII at rest, OWASP top 10 mitigation, RBAC.
- Accessibility: WCAG 2.1 AA for customer-facing app.
- Offline: Cache critical data (business details, bookings) with stale-while-revalidate.

## 5. Development Priorities
- Phase 1 (MVP): User Auth, Business Search & Discovery, Service Categories, Booking Flow (basic), Payment, Appointment Management, Provider Portal (basic), Notifications, Background Jobs (core), Shared Types.
- Phase 2: Map-based Search, Reviews & Ratings, Favorites, User Profile enh, Admin Dashboard.
- Phase 3: Advanced Analytics, Loyalty, Multi-language, Family profiles.

This specification ensures a clear path from user needs to developer tasks, capturing all acceptance criteria and priorities.