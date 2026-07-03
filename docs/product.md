# Planity Clone Product Specification

## 1. Introduction
Planity Clone is a mobile-first beauty and wellness appointment booking platform connecting customers with salons, spas, and independent professionals. This document defines the complete feature set, acceptance criteria, and priorities to guide development.

## 2. Product Vision
Provide a seamless, delightful experience for users to discover local beauty services, book appointments in real time, and manage their bookings, while empowering providers to manage their business efficiently.

## 3. User Personas
- **Customer**: End-user searching for and booking beauty/wellness services.
- **Provider**: Salon owner or professional managing services, staff, schedules, and bookings.
- **Admin**: Platform operator overseeing users, providers, analytics, and content.

## 4. Feature Specifications

### 4.1 User Authentication
**Description:** Secure sign-up and sign-in with email/password and social logins. Supports password recovery and session management.

**Acceptance Criteria:**
- User can register with email, password, first name, last name.
- Provide option to sign up with Google and Apple.
- Login with registered email and password; return JWT token.
- "Forgot password" sends reset email; successful password reset after clicking link.
- Social login creates account if new, or links to existing account.
- Logged-in state persists across app restarts (secure token storage).
- Logout clears tokens and redirects to login.
- All protected API endpoints reject unauthenticated requests.

**Priority:** P0 (Must-have)

### 4.2 Guest Browse & Explore
**Description:** Unauthenticated users can browse businesses, view services, and read reviews without logging in, but must log in to book.

**Acceptance Criteria:**
- Home screen shows featured salons, categories, and search bar for guests.
- Business detail page is fully accessible (services, description, photos, reviews).
- Tapping "Book" on any service or slot prompts login/registration with a smooth redirect.
- Booking flow remains blocked until authenticated.

**Priority:** P1 (Should-have)

### 4.3 Business Search & Discovery
**Description:** Users search for salons by name, category, location, or service type. Supports filters like rating, price range, and availability.

**Acceptance Criteria:**
- Search box with autocomplete suggests categories, business names, services.
- Results list shows business name, rating, distance, main image, short description, and "Book" button.
- Filters: category (hair, nails, etc.), rating (1–5), price range (€, €€, €€€), distance (1/5/10 km), open now toggle.
- Sort options: relevance, rating, distance, price low-high.
- Empty state message when no results match filters.
- Real-time location used to sort by distance (with permission).

**Priority:** P0 (Must-have)

### 4.4 Map-based Search
**Description:** Interactive map view showing nearby salons with pins, supporting tap-to-select and region-based search.

**Acceptance Criteria:**
- Map screen with current location marker; pins for salons visible in viewport.
- Pin shows business name, rating, and category icon; tap opens detail card.
- Pan/zoom the map refreshes visible businesses (boundary search).
- Search bar on map filters within current map bounds.
- Tap a pin to see compact info and a link to business detail.
- Seamless toggle between list and map views preserving filters.

**Priority:** P1 (Should-have)

### 4.5 Business Detail View
**Description:** Full profile of a salon including photos, description, location, working hours, services menu, team members, reviews, and booking entry points.

**Acceptance Criteria:**
- Image gallery with swipeable high-resolution photos.
- Business name, address (open in maps), distance, rating summary (average, total reviews).
- Expandable "About us" section.
- Working hours for each day; "open now" indicator.
- Services grouped by category with price, duration, and "Book" button per service.
- Team members list with photo, name, specializations, and availability link.
- Reviews section with average rating breakdown, list of recent reviews (load more).
- Floating action button "Book" that anchors to the first service when tapped.

**Priority:** P0 (Must-have)

### 4.6 Service Categories
**Description:** Pre-defined taxonomy of beauty/wellness categories used for discovery and organization.

**Acceptance Criteria:**
- Standard categories: Haircut & Styling, Hair Coloring, Manicure & Pedicure, Facial & Skincare, Massage, Makeup, Hair Removal, Spa Packages, Barber, Eyebrows & Lashes.
- Admin can add/edit top-level categories and subcategories (e.g., Haircut > Women's Haircut).
- Each service is assigned one category; used in search filters and provider onboarding.
- Category icons and images configurable by admin.

**Priority:** P0 (Must-have)

### 4.7 Booking Flow
**Description:** Step-by-step process from selecting a service to confirming an appointment with a secure time slot.

**Acceptance Criteria:**

1. **Service Selection:** User picks a service from business detail (price, duration, description shown).
2. **Professional Preference (optional):** Choose "No preference" or select a specific staff member. Show staff photo, rating, next available slots.
3. **Date & Time Selection:** Calendar showing available days (exclude fully blocked days). Time slots derived from real-time availability; highlight peak/hot slots. Slots represent the exact start time.
4. **Review Summary:** Display service name, business, staff, date, time, duration, total price, and any discounts.
5. **Confirmation & Payment:** Tap "Confirm & Pay" triggers payment flow (if service is paid online). Free bookings confirm immediately. Success screen shows appointment details and option to add to calendar.

- The flow must prevent double booking of the same slot by another user (locked slot during payment, with timeout).
- If payment fails, slot is released and user sees error with retry option.
- Confirmed bookings generate a push notification and email (if enabled).

**Priority:** P0 (Must-have)

### 4.8 Appointment Management
**Description:** Users view upcoming and past appointments, reschedule, cancel (with policy), and access appointment details.

**Acceptance Criteria:**
- Appointments list: Upcoming tab (sorted by date ascending) and History tab (past, sorted descending).
- Each card shows date, time, business name, service name, staff, price, status (confirmed, cancelled, completed).
- Reschedule flow: tap reschedule, choose new date/time (same service/staff). Old slot released after successful change.
- Cancel flow: confirmation step, shows cancellation policy (free until X hours). After cancel, slot freed and provider notified.
- Appointment detail page with service info, business contacts, add to calendar, share, and review prompt after completion.
- Cancellation policy must be enforced: free cancellation window before appointment. Late cancellation may incur fee.

**Priority:** P0 (Must-have)

### 4.9 Favorites
**Description:** Users save businesses to a favorites list for quick access.

**Acceptance Criteria:**
- Heart icon on business card and detail page toggles favorite state.
- Dedicated Favorites screen shows all liked businesses with visual cards; sorted by date added or name.
- Remove from favorites with a swipe or heart tap; optimistic UI with sync.
- Favorites persist across sessions (server-side sync).
- Prompt to login if guest tries to favorite.

**Priority:** P1 (Should-have)

### 4.10 User Profile
**Description:** Manage personal information, login settings, notification preferences, and payment methods.

**Acceptance Criteria:**
- Profile photo (upload or delete), first name, last name, phone number, email.
- Password change.
- Notification preferences toggles: push (appointment reminders, marketing) and email.
- Saved payment methods (add/delete credit card; show last 4 digits, expiry).
- App settings: language (EN/FR), theme toggle (future).
- Delete account option with confirmation and GDPR compliance (erasure).
- Order history link to appointments.

**Priority:** P1 (Should-have)

### 4.11 Availability & Slot Computation
**Description:** Real-time logic to compute available appointment slots based on provider schedules, service durations, existing bookings, breaks, and time-off.

**Acceptance Criteria:**
- Providers define working hours per staff member per day, including breaks.
- Service duration (e.g., 30 min) used to calculate slots: slot = start time where staff is free for full duration.
- Bookings block time; system prevents overlap.
- Slot engine respects buffer time before/after appointments (configurable per service).
- Supports multiple staff for same service; slot availability aggregates all eligible staff (if "No preference" chosen).
- Client API returns a list of available DateTime slots for a given service + staff + date range.
- Response times must be <500ms for typical daily slot queries.
- Admins can manually block dates for a provider.

**Priority:** P0 (Must-have)

### 4.12 Shared Types & Design System
**Description:** A unified component library and TypeScript types shared across frontend (web, mobile) to ensure consistency and speed.

**Acceptance Criteria:**
- TypeScript interfaces for: User, Business, Service, StaffMember, Appointment, Review, Category, TimeSlot, Notification.
- Reusable UI components: Button, Input, Avatar, Card, Modal, Badge, Calendar, TimeSlotPicker, RatingStars, SearchBar, MapPin.
- Consistent design tokens: colors, typography, spacing, shadows, border-radius.
- Theme support: light mode as default; structure for dark mode.
- All components are documented in Storybook.
- Components maintain accessibility (contrast, touch targets, screen reader labels).

**Priority:** P0 (Must-have – foundational)

### 4.13 Reviews & Ratings
**Description:** Customers rate and review businesses and optionally staff after a completed appointment.

**Acceptance Criteria:**
- After appointment status becomes "completed", user receives prompt to leave a review (push notification / in-app message).
- Rating scale: 1 to 5 stars for overall experience; optional written review (min 10 characters).
- Can also rate staff member separately.
- Reviews are visible on business detail page with moderation queue for providers to report abuse.
- Provider cannot delete or hide reviews unilaterally; admin can moderate.
- Average rating and total count update in near real-time.
- User can edit/delete their own review.

**Priority:** P1 (Should-have)

### 4.14 Payment Integration
**Description:** Secure online payment for paid services via a payment gateway (Stripe).

**Acceptance Criteria:**
- Support for credit/debit cards; Apple Pay / Google Pay optional.
- Payment flow integrated into booking confirmation step.
- Platform holds payment until service is rendered (if cancellation policy allows refund) or captures immediately (configurable).
- Secure tokenization – no raw card details stored on server (PCI compliance via Stripe Elements).
- Payment confirmation shows success; receipt emailed.
- On cancellation, trigger refund according to policy.
- Provider receives payout information in provider portal (future: connect with Stripe Connect).
- Error handling for declined cards, insufficient funds, network issues.

**Priority:** P0 (Must-have for paid bookings)

### 4.15 Notifications
**Description:** Push notifications (mobile) and email for booking confirmations, reminders, cancellations, and promotional messages.

**Acceptance Criteria:**
- Push notification tokens registered at login; associated with user device.
- Transactional emails: booking confirmation, reschedule, cancellation, payment receipt.
- Push reminders: 24-hour and 1-hour before appointment.
- Providers notified of new booking, cancellation, review left.
- Notification preferences honored (opt-in/out per category).
- In-app notification center showing recent alerts.
- Admin can send targeted promotional push notifications (by location, category).

**Priority:** P1 (Should-have, email confirmation P0)

### 4.16 Provider / Business Owner Portal
**Description:** Web and mobile interface for providers to manage business profile, services, staff, schedules, and bookings calendar.

**Acceptance Criteria:**
- Provider onboarding: business registration, service listing, staff setup, schedule definition.
- Dashboard: upcoming appointments count, today’s revenue, recent reviews.
- Calendar view with day/week/month; color-coded by staff; drag-and-drop reschedule.
- Manual appointment creation for walk-ins.
- Appointments management: accept, cancel, mark as no-show, reschedule; automated notifications to customer on changes.
- Services management: add, edit, delete service (with category, price, duration, buffer).
- Staff management: add/staff member, assign services, set working hours, block time-off.
- Business profile editing: photos, description, address, phone, social links.
- Availability settings: apply global breaks, holidays.
- Review inbox: see latest reviews, report abusive content.
- All actions sync availability instantly.

**Priority:** P0 (Must-have)

### 4.17 Admin Dashboard
**Description:** Central control panel for platform administrators to manage users, providers, transactions, and system health.

**Acceptance Criteria:**
- User management: list/search users, view profile, disable/enable accounts.
- Provider management: list/search providers, verify registration, manage subscription (future), deactivate.
- Service categories management: add/edit/delete categories and subcategories.
- Content moderation: review reported reviews, hide inappropriate content.
- Appointments overview: filter by date, provider, status; ability to cancel/refund.
- Transactions list with status, amount, payout info.
- Analytics dashboard: total bookings, revenue, top categories, new users over custom date range (charts).
- System settings: manage commission rate (future), site banners.

**Priority:** P1 (Should-have)

### 4.18 Background Jobs (BullMQ)
**Description:** Asynchronous job processing for tasks such as sending reminders, cleaning up expired holds, and generating reports.

**Acceptance Criteria:**
- BullMQ queues: `reminders` (schedule 24h/1h push), `slot-cleanup` (release unpaid slots after 10 min timeout), `review-request` (send review prompt after appointment completion), `export-reports`.
- Jobs are idempotent and retry with exponential backoff.
- Failed jobs logged and surfaced in admin.
- Job monitoring dashboard (optional) showing queue lengths, completed/failed counts.
- System gracefully handles server restarts by resuming jobs.

**Priority:** P0 (Must-have for operational reliability)

## 5. Non-functional Requirements
- **Performance:** Server response <200ms for key APIs, slot computation <500ms.
- **Scalability:** Support 10k concurrent users; auto-scaling infrastructure.
- **Security:** HTTPS, JWT auth, input sanitization, rate limiting, GDPR compliance.
- **Reliability:** 99.9% uptime for booking core services; backup recovery plan.
- **Mobile:** Responsive PWA and native iOS/Android apps using shared components.

## 6. Release Plan
- **MVP (P0):** User Auth, Business Search & Discovery, Business Detail, Service Categories, Booking Flow (with payment), Availability engine, Appointment Management, Provider Portal (basic), Background Jobs (reminders, slot-cleanup), Shared Types & Design System.
- **V1.1 (P1):** Guest Browse, Map Search, Favorites, Reviews & Ratings, Notifications (push/email), User Profile enhancements.
- **V1.2 (P2):** Admin Dashboard, advanced analytics, marketing push, provider subscription tiers.

---
*All acceptance criteria must be verified by automated tests (unit, integration, E2E) and manual QA prior to each release.*