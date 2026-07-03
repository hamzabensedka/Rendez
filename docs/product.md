# Product Specification: Planity Clone

## 1. Overview
Planity Clone is a mobile-first (responsive web & native iOS/Android) appointment booking platform connecting customers with local service businesses (salons, spas, barbers, fitness, pet grooming, etc.). The platform enables guests to browse services, discover businesses via search and map, book appointments, manage bookings, pay securely, leave reviews, and receive notifications. Providers have a portal to manage services, availability, staff, and bookings. Admins oversee the entire system. The system uses BullMQ for background job processing (notifications, reminders, payments).

## 2. Key Features & User Stories

### 2.1 User Authentication
**Priority: P0 (Must-have)**
- Guest users can browse without logging in.
- Users can create an account (email/password, Google SSO, Apple Sign-in).
- Users can log in/out, reset password.
- Provider accounts require business verification (manual or automated).

**Acceptance Criteria:**
1. Register with email/password: fields email, password, confirm password; password strength at least 8 chars, 1 uppercase, 1 number.
2. Registration sends email verification link (valid for 24h). Account not active until verified.
3. Google and Apple SSO: after consent, user is registered and logged in immediately (email verified).
4. Login with email/password or SSO.
5. Forgot password flow: enter email -> receive reset link -> set new password.
6. Session management: JWT (access token 1h, refresh token 30d).
7. Provider sign-up: during registration, user selects "I'm a business owner" and must provide business name, address, license number. Account initially deactivated; admin approves via admin dashboard.
8. Error handling: invalid credentials, duplicate email, expired tokens.

### 2.2 Guest Browse & Explore
**Priority: P0**
- Non-authenticated users can view search, categories, business list, business detail, reviews, but cannot book or favorite.

**Acceptance Criteria:**
1. Guest sees home screen with service categories, featured businesses, search bar, map toggle.
2. Clicking "Book" or "Add to Favorites" triggers a modal prompting login/sign-up.
3. All public data accessible; no sensitive info exposed.

### 2.3 Business Search & Discovery
**Priority: P0**
- Search by keyword, service, business name, location.
- Filters: category, price range, rating, distance, availability.
- Sort: relevance, rating, distance, price low-high.

**Acceptance Criteria:**
1. Search bar at top; real-time suggestions as user types (debounced 300ms).
2. Results list shows business name, rating, distance, address, thumbnail, next available slot (if logged in), price range.
3. Filters panel: multiple categories (checkbox), price range slider, rating 1-5 stars, max distance (5/10/20/50 km), open now toggle.
4. Sorting persists until cleared.
5. Empty state: "No businesses found. Try different filters."
6. Pagination: infinite scroll, loading skeleton.
7. Results update upon filter/sort change.

### 2.4 Map-based Search
**Priority: P1**
- Interactive map (Leaflet/Mapbox) displaying businesses as pins.
- User can drag map, and results update to show businesses within visible bounds.

**Acceptance Criteria:**
1. Toggle between list/map view.
2. Map shows business pin with popup: name, rating, photo, "View Details" link.
3. User location button (if granted permission) centers map.
4. On map moveend/idle, fetch businesses within bounds (client-side or backend API with bounding box).
5. Clustering for dense areas.
6. Pins filtered same as list filters.

### 2.5 Business Detail View
**Priority: P0**
- Public profile: name, description, photos gallery, services & pricing, working hours, location, rating & reviews, contact info.

**Acceptance Criteria:**
1. Hero image slider, business name, rating stars, total reviews count, address (with map thumbnail link).
2. Services tab: list of services with name, duration, price, description, "Book" button per service (or "Select" to add to booking).
3. Staff/team tab (if multi-staff): list of employees with photo, specialties, and their availability; selecting a staff member filters bookable slots.
4. About tab: description, amenities, photos, social links.
5. Reviews tab: paginated list of reviews (avatar, name, date, rating, text), overall rating breakdown.
6. "Favorite" heart icon (toggles).
7. "Share" button (share business URL).
8. Dynamic booking CTA: "Check Availability" button that opens slot picker.
9. Working hours displayed in local timezone.

### 2.6 Service Categories
**Priority: P0**
- Predefined categories (e.g., Hair, Nails, Massage, Barbers, Skin Care, Fitness, Pet Grooming, etc.). Admin can manage categories.

**Acceptance Criteria:**
1. Home screen displays category tiles (icon + name).
2. Clicking a category navigates to search results filtered by that category.
3. Admin can add/edit/delete categories (name, icon, active status).
4. Providers can assign multiple categories to their business.

### 2.7 Booking Flow
**Priority: P0 (core)**
- Users can book a service at a business with chosen staff, date, time slot. Steps: Select service(s) -> Select staff (optional/all) -> Select date & time -> Review -> Confirm & Pay.

**Acceptance Criteria:**
1. Service selection: multi-service booking allowed if provider supports it; quantity per service is 1 (default); summary updates dynamically.
2. Staff selection: dropdown list of staff offering selected service(s); "Any available" option; step can be skipped if no preference.
3. Date/Time picker: calendar (disable days where fully booked or closed); time slots fetched based on real-time availability (see 2.11). Slots shown as buttons with time. If multi-service, slots shown only if all selected services can be booked consecutively (consider staff availability and total duration).
4. Review screen: summary of business, service(s), total price, breakdown (service fee, tax if applicable), selected staff, date, start time, end time.
5. Promo code input (optional).
6. Confirm: upon confirmation, backend creates a booking with status "pending_payment" or "confirmed" depending on payment requirement (see 2.12). If payment required, user proceeds to payment gateway; success updates status to "confirmed".
7. After booking, success screen with booking details and option to add to calendar.
8. Real-time slot locking (30 second hold during checkout to prevent double-booking).
9. Error handling: slot taken, payment failure, network issues.

### 2.8 Appointment Management
**Priority: P0**
- Users view upcoming, past, cancelled appointments. Can reschedule, cancel, add to calendar.

**Acceptance Criteria:**
1. List of appointments grouped by upcoming/completed/cancelled.
2. Each appointment shows business name, service, date/time, staff, status badge (confirmed, pending, completed, cancelled, no-show).
3. Reschedule flow: select new date/time (same as booking), backend updates appointment, sends notifications.
4. Cancel: confirmation modal; applies cancellation policy (e.g., free up to 24h). Backend may charge cancellation fee.
5. "Add to Calendar" (generates .ics or deep link).
6. "Leave Review" link after appointment completed (appears for 30 days).
7. Push notifications for reminders (1 day, 1 hour before).

### 2.9 Favorites
**Priority: P1**
- Authenticated users can save businesses to favorites.

**Acceptance Criteria:**
1. Heart icon toggle on business card/detail.
2. Favorite list accessible from profile/navigation; shows saved businesses with mini cards, next available slot if any.
3. Empty state: "No favorites yet. Discover businesses."
4. Sync across devices (cloud).

### 2.10 User Profile
**Priority: P1**
- Edit personal info, manage payment methods, notification preferences, view booking history.

**Acceptance Criteria:**
1. Edit fields: name, email, phone, profile photo (upload).
2. Saved payment methods (list, add/delete, set default).
3. Notification preferences: push, email, SMS toggles for booking confirmations, reminders, promotions.
4. Booking history tab.
5. Delete account (with data deletion compliant).

### 2.11 Availability & Slot Computation
**Priority: P0 (critical backend)**
- Dynamic slot generation based on business working hours, staff schedules, service durations, buffer time, existing bookings, global breaks, and provider-specific time off.

**Acceptance Criteria:**
1. Each business defines working hours per day (e.g., Mon 9-18, break 13-14); multiple intervals per day supported.
2. Staff schedules: each staff has own working hours (inherits business defaults, overrides allowed).
3. Services have duration and optional buffer time after (padding).
4. Existing bookings reduce availability; staff blocked time if assigned to booking.
5. Multi-staff: if a service can be performed by multiple staff, slots shown as available if any staff is free.
6. Multi-service booking: slot must have contiguous block from start time covering total duration of all selected services (including buffers) on the same staff.
7. Slot generation algorithm: for a given date and staff, time is divided into intervals (e.g., 15 min slots). Each slot start time is valid if: (a) within working hours, (b) not overlapping break, (c) staff free for the duration (no conflicting bookings), (d) buffer after does not conflict with next booking. Day marked unavailable if no slots.
8. Real-time updates: when a booking is confirmed, affected slots are immediately removed from other concurrent booking sessions via WebSockets or polling.
9. Timezone handling: all times stored in UTC; business timezone saved; frontend converts.
10. Future time-off: providers can add date-specific closures or staff vacation.

### 2.12 Shared Types & Design System
**Priority: P0 (foundational)**
- Unified TypeScript interfaces/types shared across frontend and backend (monorepo). Design system ensures consistent UI components.

**Acceptance Criteria:**
1. Types defined for: User, Business, Service, Staff, Booking, Review, Category, Payment, Notification, etc.
2. Shared enums: BookingStatus, PaymentStatus, UserRole, etc.
3. Reusable UI components: Button, Input, Modal, Card, StarRating, Avatar, Calendar, SlotPicker, SearchBar, MapView, etc., across React Native/React.
4. Design tokens: colors, typography, spacing, shadows, border radii stored in a central theme.
5. Components documented in Storybook.

### 2.13 Reviews & Ratings
**Priority: P1**
- Users can leave a review (1-5 star rating, text, optional photo) after a completed appointment. All reviews visible on business profile. Provider can respond.

**Acceptance Criteria:**
1. After appointment completes, user sees a prompt to review; accessible from booking history for 30 days.
2. Review form: star rating (tap to set), text (min 10 chars, max 500), optional photo upload (camera/gallery).
3. Validation: rating must be selected.
4. Review displayed on business page with username, date, rating, text, photo (if any).
5. Owner response: business owner can reply to a review (one level); response shown below review with “Owner” badge.
6. Moderation: admin can hide/report inappropriate reviews.
7. Overall business rating calculated as average of all visible reviews, displayed to 1 decimal.

### 2.14 Payment Integration
**Priority: P0**
- Secure payment processing via Stripe. Support for capturing pre-auth and final charge, handling refunds, saving cards for future use.

**Acceptance Criteria:**
1. Payment method: card input (Stripe Elements) or saved cards. Cards tokenized via Stripe.
2. Booking flow: when user confirms booking with payment required, a PaymentIntent is created for the total amount; client confirms with payment method.
3. Booking status transitions: "pending_payment" -> "confirmed" upon successful payment. If payment fails, booking remains in pending_payment with retry option (15-min window).
4. Pre-authorization: optionally business can set a capture policy (charge 1 day before appointment). Business owner portal sets.
5. Refunds: admin or provider can initiate full/partial refund from dashboard; handled via Stripe refund API, booking status updated accordingly.
6. Receipt: email receipt generated after successful payment.
7. Payment failure handling: show appropriate error, allow changing payment method, do not confirm booking.
8. PCI compliance: no raw card data touches server.

### 2.15 Notifications
**Priority: P0**
- Push notifications, email, SMS (optional) for appointment reminders, booking confirmations, cancellations, reschedules, promotions. Real-time via WebSockets.

**Acceptance Criteria:**
1. Events trigger notification: booking confirmed, booking reminder (1 day, 1 hour), cancelled, reschedule, new review reply, payment receipt.
2. Push notifications via Firebase Cloud Messaging (FCM) / APNs; email via SendGrid/Mailgun; SMS via Twilio.
3. User can opt-in/out per channel in profile preferences.
4. Notification content: dynamic (business name, date, time) with deep links to booking details.
5. Background workers (BullMQ) process notification jobs to handle delivery and retries.
6. In-app notification bell with recent list, mark as read.
7. Real-time notification via WebSocket for in-app alerts.

### 2.16 Provider / Business Owner Portal
**Priority: P0 (phase 1 after customer app)**
- A web dashboard where business owners manage their profile, services, staff, schedule, bookings, reviews. Can also receive walk-in/manual bookings.

**Acceptance Criteria:**
1. Dashboard overview: upcoming appointments for today/next, revenue summary, new reviews.
2. Business profile management: edit name, description, logo, photos, contact info, address (geocoded), working hours, categories, amenities.
3. Service management: CRUD for services (name, duration, price, buffer, description, active, assignable staff).
4. Staff management: add staff members (name, email invitation to set up staff login), photo, set working hours overrides, time-off, services they perform.
5. Booking management: calendar view (day/week/month), list of appointments with filters by status, staff, service. Manual booking: staff can create a booking for a walk-in customer (select service, staff, time).
6. Cancellation/reschedule on behalf of customer.
7. Availability exceptions: add global closures (holidays, events) and staff-specific time off.
8. Review responses.
9. Payment settings: set payment requirements (pay online, pay in-store), capture policy.
10. Notifications: receive instant alerts for new bookings/cancellations.
11. Staff logins with limited permissions (view own schedule only).

### 2.17 Admin Dashboard
**Priority: P1 (after provider portal)**
- Super admin manages all businesses, users, reviews, categories, system config.

**Acceptance Criteria:**
1. Business management: list all businesses with search/filter; approve new provider registrations; suspend/delete businesses; view business details, bookings, reviews.
2. User management: list customers, search, disable accounts.
3. Review moderation: list flagged/hidden reviews, approve or remove.
4. Category management: CRUD categories.
5. System configuration: global platform fee percentage, cancellation policies, maximum booking advance days, etc.
6. Reporting: basic analytics (bookings count, revenue, top businesses).
7. Roles and permissions: admin, superadmin.

### 2.18 Background Jobs (BullMQ)
**Priority: P0 (infrastructure)**
- Asynchronous processing using BullMQ with Redis for: sending notifications, processing booking expiry/cleanup, generating receipts, reminder triggers, slot release after payment timeout.

**Acceptance Criteria:**
1. Job queues: notifications (email, push, SMS), booking-reminders, slot-release, payment-capture.
2. Notification job: when booking confirmed, enqueue job to send confirmation email/push/SMS; worker processes with retries and backoff, failure logging.
3. Reminder scheduler: cron-like job every minute checks upcoming appointments that need reminders (1 day, 1 hour) and enqueues reminder jobs.
4. Slot release: when a booking is created but payment pending, a temporary hold is placed. A delayed job (30 seconds) releases the hold if booking not confirmed; prevents double-booking.
5. Payment capture: for deferred capture, a scheduled job triggers capture at specified time (e.g., 1 day before appointment).
6. Cleanup: delete expired password reset tokens, unconfirmed bookings after 15 min of inactivity.
7. Dashboard (Bull Board) for monitoring queues in admin area.
8. Graceful worker handling and error recovery.

## 3. Design & UX Principles
- Mobile-first responsive design (native mobile apps primary).
- Consistent bottom tab navigation: Explore, Favorites, Bookings, Profile (customer); for providers: Dashboard, Calendar, Bookings, Business, Profile.
- Accessibility: proper labels, color contrast, keyboard navigation.
- Offline support: cache business data, reviews; show stale data + prompt to retry.
- Performance: lazy loading, image optimizations, bundle splitting.

## 4. Technical Stack
- Frontend: React Native (iOS/Android) + React for web admin/portal.
- Backend: Node.js, Express (or NestJS), TypeScript.
- Database: PostgreSQL (main), Redis (caching, queues, session).
- Queue: BullMQ.
- Payments: Stripe.
- Notifications: FCM/APNs, SendGrid, Twilio.
- Maps: Mapbox/Leaflet (web), react-native-maps.
- File Storage: AWS S3/Cloudinary for images.

## 5. Non-Functional Requirements
- Security: HTTPS, JWT with refresh rotation, rate limiting, input sanitization, CORS, Stripe PCI compliance.
- Scalability: stateless backend, separate worker processes for queues, DB connection pooling, caching of business/service data.
- Availability: 99.9% uptime SLA.
- Performance: API response <200ms p95 for critical paths (search, slot fetch).
- Localization: support for multiple languages and timezones.

## 6. Release Phases
1. MVP: User auth, search/discovery, business detail, booking flow with basic availability, appointment management, reviews, favorites, notifications (email/push), payment (Stripe), provider portal (basic profile & booking management), admin dashboard (approve providers), background jobs.
2. V2: Map-based search, multi-service booking, staff-specific booking, promotions & discounts, loyalty points, referral system, waitlist.
3. V3: Real-time chat between customer & provider, video consultation, inventory management (product sales), marketplace for renting spaces.

## 7. Acceptance Testing Strategy
- Manual QA for flows.
- Automated E2E: Detox for mobile, Cypress/Playwright for web.
- API integration tests.
- Performance and load testing for slot query.
