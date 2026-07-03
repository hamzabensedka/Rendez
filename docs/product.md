# Planity Clone Product Specification

## 1. Overview
Planity Clone is a mobile-first appointment booking platform connecting customers with beauty and wellness businesses. The system enables guests to browse businesses and services, customers to book appointments, and business owners to manage schedules and client bookings. An admin dashboard provides oversight.

**Key objectives:**
- Seamless booking experience from search to confirmed appointment.
- Real-time availability based on business schedules and staff.
- Reliable notifications and reminders.
- Scalable background processing for slot management and communication.

## 2. User Roles & Permissions

| Role | Capabilities |
|------|-------------|
| Guest | Browse businesses, view details, search by location/category, but cannot book or access favorites. |
| Customer | All guest capabilities plus: register/login, book appointments, manage bookings, save favorites, write reviews (after completed appointment), edit profile. |
| Business Owner | Manage business profile, services, staff, working hours, availability overrides, view calendar with bookings, accept/reschedule/cancel bookings, view customer details, view ratings. |
| Admin | Manage all businesses and owners, moderate reviews, monitor system health, view analytics, handle disputes. |

## 3. Feature Catalog

| ID  | Feature                         | Priority |
|-----|---------------------------------|----------|
| F01 | User Authentication             | P0       |
| F02 | Guest Browse & Explore          | P0       |
| F03 | Business Search & Discovery     | P0       |
| F04 | Map-based Search                | P1       |
| F05 | Business Detail View            | P0       |
| F06 | Service Categories              | P0       |
| F07 | Booking Flow                    | P0       |
| F08 | Appointment Management          | P0       |
| F09 | Favorites                       | P1       |
| F10 | User Profile                    | P0       |
| F11 | Availability & Slot Computation | P0       |
| F12 | Shared Types & Design System    | P0       |
| F13 | Reviews & Ratings               | P1       |
| F14 | Payment Integration             | P0       |
| F15 | Notifications                   | P1       |
| F16 | Provider / Business Owner Portal| P0       |
| F17 | Admin Dashboard                 | P1       |
| F18 | Background Jobs (BullMQ)        | P0       |

### 3.1 User Authentication (F01) [P0]
**Description:** Allow customers and business owners to create accounts, log in, and manage sessions. Support email/password authentication and optional social login (Google, Apple). Password reset flow included. Business owner sign-up includes business registration step.

**Acceptance Criteria:**
- Guest can sign up with email and password; verify email via link.
- User can log in; receive JWT access/refresh tokens.
- Token refresh works silently; expired sessions redirect to login.
- “Forgot password” flow: enter email → receive reset link → set new password.
- Business owner sign-up includes business registration step (name, category, address) before accessing portal.

**Dependencies:** Auth service, email service.

### 3.2 Guest Browse & Explore (F02) [P0]
**Description:** Unauthenticated users can browse featured businesses, categories, and popular services on the home screen. No login required to view listings or business details.

**Acceptance Criteria:**
- Home screen displays curated list of businesses (top-rated, nearby if location allowed).
- Swipe through category chips (e.g., Hair, Nails, Spa); tapping filters businesses.
- Guest can view business detail page with services, ratings, photos, but "Book" button prompts login.
- All data is cached for performance.

### 3.3 Business Search & Discovery (F03) [P0]
**Description:** Users can search for businesses by name, location, or service. Provide autocomplete suggestions and filter by category, rating, price range, distance.

**Acceptance Criteria:**
- Search bar on home screen; typing triggers autocomplete (business names, services).
- Search results show business cards with image, name, rating, distance, price range.
- Filters: category multi-select, minimum rating slider, price range, availability (today/tomorrow).
- Results sorted by relevance (distance, rating) with option to change sort.
- Empty state: “No results found. Try adjusting filters.”
- Search is performed via full-text index; response < 300ms.

### 3.4 Map-based Search (F04) [P1]
**Description:** Interactive map view showing business locations. Users can pan/zoom to explore, tap pins to see preview, then navigate to detail.

**Acceptance Criteria:**
- Toggle between list view and map view on search results.
- Map displays pins for businesses within the visible region; clusters when zoomed out.
- Tap pin shows a mini-card with name, rating, photo; tap "View" opens detail.
- Location service permission used to center map on user's location (optional).
- Performance: load pins smoothly for up to 500 businesses.

### 3.5 Business Detail View (F05) [P0]
**Description:** Detailed page for a business, showcasing its info, services, staff, availability, photos, and reviews.

**Acceptance Criteria:**
- Displays: cover photo, business name, address (with map thumb), rating, opening hours status (open/closed), description.
- Service list grouped by category, each showing name, duration, price.
- Staff section with photos and names (if visible to customers).
- Availability section: calendar with dates, when date selected shows time slots (computed via F11). Only future slots.
- “Book” button for a service. If not authenticated, prompt to login/signup.
- Reviews section: list recent reviews with pagination.
- Photos gallery.

### 3.6 Service Categories (F06) [P0]
**Description:** Hierarchical service categories pre-defined (e.g., Hair > Haircut, Coloring; Nails > Manicure, Pedicure). Businesses assign categories to their services. Used for filtering and discovery.

**Acceptance Criteria:**
- Admin defines top-level categories and subcategories.
- Business owner selects from pre-defined categories when creating a service.
- Users filter search by category and subcategory.
- Home screen category chips reflect top-level categories.

### 3.7 Booking Flow (F07) [P0]
**Description:** Multi-step booking: select service, choose staff (optional), pick date/time from available slots, review details, optionally add notes, and confirm/pay. Integrates with F14 Payment.

**Acceptance Criteria:**
- Customer can start booking from service list or detail page.
- Step 1: Service selection (can add multiple services from same business).
- Step 2: Date selection via calendar; only dates with availability highlighted.
- Step 3: Time slot selection, showing available staff or any staff option. Display slot start times.
- Step 4: Review summary: services, date, time, staff, total price, duration.
- Step 5: Payment (if required). After successful payment, booking is confirmed.
- Booking is created atomically; if payment fails, booking not created.
- Confirmation screen with booking ID and details, option to add to calendar.
- Guest flow: after selecting slot, prompt login/signup, then resume booking at summary step.
- Real-time slot hold: slot temporarily reserved (5 min) during payment to prevent double booking.

### 3.8 Appointment Management (F08) [P0]
**Description:** Customers can view upcoming and past appointments, reschedule or cancel (subject to business cancellation policy). Add to calendar.

**Acceptance Criteria:**
- “My Appointments” screen with tabs: Upcoming, Past.
- Each appointment card: business name, service, date, time, status (confirmed, completed, cancelled), staff.
- Tap to view detail with full info and actions: Reschedule, Cancel, Leave Review (for past completed).
- Reschedule: directs to availability calendar for the same business/service; updates booking.
- Cancel: confirmation dialog showing cancellation policy (e.g., free cancellation up to 24h before). On cancel, slot becomes available again.
- Appointment status updates reflect in real-time (via polling or WebSocket).
- Add to calendar: generate .ics file or deep link to add to device calendar.

### 3.9 Favorites (F09) [P1]
**Description:** Customers can save businesses as favorites for quick access. Guest users cannot.

**Acceptance Criteria:**
- Heart icon on business cards and detail page; toggles favorite status.
- Favorites page lists saved businesses with bookmark icon; empty state with CTA to explore.
- Synced across devices via backend.

### 3.10 User Profile (F10) [P0]
**Description:** Profile management for customers and business owners. Customers can edit personal info, view booking history, manage notification preferences.

**Acceptance Criteria:**
- Edit name, email, phone, profile photo.
- Manage saved payment methods (if stored).
- Notification preferences: push, email for reminders, promotions.
- Booking history list (same as F08).
- For business owners, the same profile but also link to business settings.

### 3.11 Availability & Slot Computation (F11) [P0]
**Description:** Backend engine that computes available appointment slots based on business working hours, staff schedules, service durations, existing bookings, and any overrides (holidays, breaks). Slots are generated for a configurable window (e.g., 4 weeks) and cached to enable fast queries.

**Acceptance Criteria:**
- Define business-level working hours (e.g., Mon–Fri 9:00-18:00) and staff-level exceptions.
- Service has duration; slot generation considers staff availability and concurrency (if multiple staff).
- Slot grid: intervals of 15 min (configurable), slot start times are multiples of interval.
- When a booking is created, the slot is marked as unavailable.
- Timezone handling: business timezone used for all slot calculations.
- Overrides: dates with special hours or closures (business owner can set via portal).
- Bulk generation happens via background job (BullMQ) daily; incremental updates on booking changes.
- API: GET /businesses/:id/slots?date=... returns array of { startTime, staffId, available }.
- Caching (Redis) with TTL of 1 hour, invalidated on change.

### 3.12 Shared Types & Design System (F12) [P0]
**Description:** Centralized TypeScript type definitions for all domain entities (User, Business, Service, Slot, Booking, Review, etc.) shared across frontend and backend. A UI component library built with React Native and Tailwind (or styled-components) ensures visual consistency. Design tokens for colors, typography, spacing.

**Acceptance Criteria:**
- Types package `@planity/types` with interfaces for all entities, DTOs, and API responses.
- Reusable components: Button, Input, Card, Avatar, Calendar, SlotPicker, Rating, etc., with consistent styling.
- Storybook documentation for components.
- Design tokens exported as a theme object used across mobile and web.
- Accessibility: components meet WCAG 2.1 AA (color contrast, touch targets).

### 3.13 Reviews & Ratings (F13) [P1]
**Description:** Customers can leave a star rating and text review after a completed appointment. Reviews are visible on business detail page, average rating calculated. Business owners cannot edit but can respond.

**Acceptance Criteria:**
- After appointment marked completed (by business or auto after time), customer prompted to write a review.
- Rating: 1-5 stars.
- Text review optional, max 500 chars.
- Admin moderation: reviews flagged with inappropriate content are hidden until approved.
- Business detail shows average rating and total count, plus paginated list.
- Business owner can reply to a review (single reply per review).
- Review submission triggers notification to business owner.

### 3.14 Payment Integration (F14) [P0]
**Description:** Handle payments for bookings. Support credit/debit cards via a provider (e.g., Stripe). Capture payment at booking time or hold depending on business setting. Allow refunds for cancellations according to policy.

**Acceptance Criteria:**
- Customers can add and manage payment methods (card via Stripe Elements).
- During booking, if payment required, show payment step using secure token (Stripe PaymentIntent).
- On successful payment, booking confirmed; on failure, display error and allow retry.
- Business owner can set payment policy: “Pay Now” (full prepayment), “Pay at Venue” (no payment), “Deposit” (partial).
- Refund flow: when cancellation meets policy, automatically refund via Stripe (or manual for admin).
- PCI compliance: no card numbers touch our servers; use Stripe SDK.
- Receipts: email receipt after payment.

### 3.15 Notifications (F15) [P1]
**Description:** Push notifications (mobile) and email for booking confirmations, reminders, cancellations, and promotions. Real-time updates for business owners on new bookings.

**Acceptance Criteria:**
- Customer receives push notification and email upon booking confirmation, 24h before appointment reminder, and 1h before.
- Business owner receives push/email for new booking, cancellation.
- Admin can send promotional push notifications to targeted segments.
- Notification preferences can be toggled in user profile.
- Delivery via Firebase Cloud Messaging (FCM) for push, SMTP for email; processed via BullMQ jobs.
- In-app notification center with list of recent notifications.

### 3.16 Provider / Business Owner Portal (F16) [P0]
**Description:** Dedicated interface for business owners to manage their business, services, staff, schedules, and bookings. Mobile-first but also accessible via web.

**Acceptance Criteria:**
- Dashboard with today’s bookings, upcoming, and simple metrics.
- Calendar view: day/week/month, showing appointments with customer names and service. Tap to see details and manage (cancel, mark as completed, no-show).
- Booking management: filter by status, search customer. Reschedule, cancel, add notes.
- Service management: CRUD services with name, description, price, duration, category, photo.
- Staff management: add/edit staff with name, working hours, services they perform.
- Availability settings: set business working hours, breaks, holidays/overrides.
- Business profile: edit name, description, address, photos, contact info.
- Basic analytics: bookings count, revenue trends.
- Settings: cancellation policy, payment policy, notification preferences.

### 3.17 Admin Dashboard (F17) [P1]
**Description:** Web-based admin panel for platform administrators to manage businesses, users, reviews, and view system metrics.

**Acceptance Criteria:**
- Business management: list with search/filter, view details, suspend/activate, verify.
- User management: list customers and business owners, flag inappropriate behavior.
- Review moderation queue: approve/reject reported reviews.
- System health: active bookings, user registrations, revenue (if taking platform commission).
- Support tools: impersonate user, view booking details, trigger refunds.
- Role-based access: admin roles with granular permissions.
- Analytics dashboard with charts (bookings over time, category popularity).

### 3.18 Background Jobs (BullMQ) (F18) [P0]
**Description:** Use BullMQ with Redis for reliable background processing of long-running or scheduled tasks. Essential for slot generation, notifications, reminders, and data cleanup.

**Jobs:**
- `slot-generation`: Runs daily to generate availability slots for the upcoming booking window. Handles new businesses and schedule changes.
- `appointment-reminder`: Sends 24h and 1h push/email reminders.
- `booking-expiry`: Releases slots if payment not completed within 5 min.
- `review-request`: After appointment completion, request review.
- `data-cleanup`: Archive old bookings, logs.
- `email-sender`: Queue for all transactional emails with retries.

**Acceptance Criteria:**
- Jobs are idempotent and can be retried with a configured number of attempts.
- Dashboard (Bull Board) for monitoring job queues (admin accessible).
- Scheduled jobs use BullMQ delayed jobs or repeatable jobs.
- Graceful error handling with logging.

## 4. Non-Functional Requirements
- **Performance:** API response time <300ms for 95th percentile for critical endpoints (search, slots). Mobile app smooth 60fps.
- **Scalability:** horizontal scaling of API servers; Redis caching; CDN for static assets.
- **Security:** HTTPS, JWT with refresh rotation, input validation, rate limiting, secure headers.
- **Reliability:** 99.9% uptime for core booking flow; graceful degradation.
- **Accessibility:** Mobile app adheres to Android/iOS accessibility guidelines; web admin passes WCAG 2.1 AA.
- **Monitoring:** logging with structured logs, Sentry for errors, Prometheus metrics.

## 5. Out of Scope (Initial Release)
- Advanced analytics for business owners (beyond basics).
- Multi-language support (i18n).
- Loyalty/rewards program.
- Client chat between customer and business.
- Marketplace for beauty products.