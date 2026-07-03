# Product Specification: Planity Clone

## 1. Introduction
Planity Clone is a mobile-first booking platform for beauty and wellness appointments (salons, spas, barbershops). The platform connects customers with local businesses, enabling seamless service discovery, booking, payment, and appointment management. It also provides a portal for business owners to manage their offerings, staff, schedules, and bookings, plus an admin dashboard for platform oversight. The system relies on asynchronous background jobs for notifications and scheduled tasks.

## 2. Target Users
- **End Customers** – Individuals seeking to discover and book beauty/wellness services.
- **Business Owners/Providers** – Salon, spa, or barbershop owners who manage their listing, services, staff, and appointments.
- **Administrators** – Platform operators who oversee businesses, users, financials, and system health.

## 3. Feature Specifications, Priorities, and Acceptance Criteria

### 3.1 User Authentication
**Priority:** P0 (Must-have)
**Acceptance Criteria:**
- A visitor can sign up using email/password, Google, or Apple sign-in.
- On first sign-up, profile is created with minimal required fields (name, email).
- Returning users can log in with credentials; sessions are persisted via secure refresh tokens.
- “Forgot password” flow sends a reset link to the registered email; token expires in 30 minutes.
- Email verification is required before first booking (pre-verification reminder in booking flow).
- Logout clears session on device and invalidates refresh token server-side.
- Authentication state is shared across all frontend modules via a global auth context.

### 3.2 Guest Browse & Explore
**Priority:** P0
**Acceptance Criteria:**
- Unauthenticated users can view the home screen with featured businesses, categories, and a search bar.
- They can search businesses, filter/sort results, and view business details (excluding real-time availability and exact address until sign-in).
- Tapping “Book” on a service triggers a prompt to sign up or log in with a seamless post-login return to the booking flow.
- All content visible to guests is cached and SEO-friendly (for web).

### 3.3 Business Search & Discovery
**Priority:** P0
**Acceptance Criteria:**
- Search box accepts business name, service keywords, and location (auto-detect or manual input).
- Active filters: category, price range, rating, distance, “open now”. Filters are combinable.
- Sort options: relevance (default), highest rated, nearest, price low-to-high.
- Results displayed as a scrollable list with business name, main image, rating, distance, and a short description.
- Infinite scroll loads next page of results (20 per page).
- Empty state shows “No results found” with suggestions to broaden search.

### 3.4 Map-based Search
**Priority:** P1 (Should-have)
**Acceptance Criteria:**
- A toggle switches from list view to a full-screen map view.
- Map shows business locations as pins; tapping a pin displays a minimal card with name, rating, and a “View details” button.
- Pin clustering groups nearby businesses at higher zoom levels.
- Panning and zooming the map updates the result list (debounced 300ms).
- “Recenter on current location” button re-centers the map to user’s location (with permission).
- Map view respects active filters and search query.

### 3.5 Business Detail View
**Priority:** P0
**Acceptance Criteria:**
- Header with cover image, business name, average rating (stars), number of reviews, and a “Favorite” heart icon.
- Tabs: **Services**, **About**, **Reviews**, **Gallery**.
  - **Services**: grouped by category, each service shows name, duration, price, and a “Book” button.
  - **About**: address (with link to map), phone (tap to call), business hours for each day (highlights current day/today’s hours), description.
  - **Reviews**: summary (rating distribution), list of reviews with user name, rating, date, and text; sort by recent/helpful.
  - **Gallery**: photo grid, tap to enlarge.
- Floating “Book” button persists at the bottom of the screen.
- Share button generates a deep link to the business.

### 3.6 Service Categories
**Priority:** P0
**Acceptance Criteria:**
- Hierarchical category tree: top-level (Hair, Nails, Massage, Skin Care, Barbering, etc.) with subcategories (e.g., Hair → Women’s Haircut, Men’s Haircut, Coloring).
- Home screen displays popular/recent categories as tappable icons.
- Selecting a category filters businesses that offer at least one service in that category.
- Each business can be assigned multiple categories.
- Admin can manage the category tree (add/edit/archive).

### 3.7 Booking Flow
**Priority:** P0
**Acceptance Criteria:**
- From a service detail, user taps “Book” and progresses through steps:
  1. **Service & Staff**: Pre-selected service; optionally choose a staff member (shows profiles with photo/name).
  2. **Date**: Calendar showing next 60 days; days without any availability are disabled/greyed out.
  3. **Time**: Horizontal list of available time slots for the selected date, service, and staff. Slots update in real time. A slot can be selected; if multiple staff can serve, show earliest combined availability.
  4. **Details**: Pre-filled user info (name, phone, email); optional “special requests” text box.
  5. **Review & Pay**: Summary of booking, total price including any taxes/fees, promo code field, and payment method selection (saved card or new card / digital wallet).
- On confirmation, payment is processed, booking is created, and a success screen with booking reference is shown.
- If a slot is reserved for a limited time (10-minute timer), the UI shows a countdown; if expired, user must reselect. The reservation is released on cancel or timer expiry.
- Error at payment or slot unavailability displays a clear message and does not finalize booking.

### 3.8 Appointment Management
**Priority:** P0
**Acceptance Criteria:**
- User’s “My Appointments” tab shows two sections: Upcoming and Past.
- Upcoming appointments list each booking with business name, service, date, time, staff, status (confirmed, pending, completed).
- Tap an upcoming booking to view details: full information, cancel/reschedule buttons.
  - Cancel triggers a confirmation dialog explaining the cancellation policy (e.g., free cancellation up to 24h prior). On confirm, booking is canceled and refund processed if applicable.
  - Reschedule opens the booking flow for the same service/business, pre-selecting the current staff if possible.
- Past appointments show history status (completed, no-show, canceled). Option to leave a review if completed and not yet reviewed.
- “Add to Calendar” action generates an .ics file or deep link to device calendar.

### 3.9 Favorites
**Priority:** P1
**Acceptance Criteria:**
- From any business detail or list, user can toggle heart icon to add/remove from favorites.
- A dedicated “Favorites” screen lists all saved businesses, each with quick “Book” and “View” actions.
- List syncs across user’s sessions (persisted in backend).
- If a business is removed from platform, show it grayed out with a note.

### 3.10 User Profile
**Priority:** P0
**Acceptance Criteria:**
- Profile screen accessible from tab bar or settings.
- Editable fields: name, email, phone, profile photo (upload from camera/gallery).
- Saved payment methods: list of masked card numbers; ability to add/delete cards using Stripe tokenization.
- Notification preferences: toggles for push, email, reminders, promotions.
- Link to Appointments, Favorites.
- “Delete Account” with two-step confirmation that removes personal data and future communications.

### 3.11 Availability & Slot Computation
**Priority:** P0 (Backend Service)
**Acceptance Criteria:**
- Business defines weekly working hours per day (e.g., Mon-Fri 9:00–18:00, Sat 10:00–16:00) and global breaks (e.g., 13:00–14:00).
- Each staff member has an individual schedule (can override business hours) and can be assigned specific services.
- Service has duration (minutes), optional buffer before/after (cleanup time).
- Slot computation engine (endpoint) given a date, serviceId, optional staffId, returns array of start times where all conditions are met:
  - Business is open and not on holiday/exclusion.
  - Staff is working, not on leave, and able to perform service.
  - No conflicting confirmed/held booking for staff considering serviceDuration + double buffer.
  - Slots align to 15-minute intervals.
- Real-time slot reservation: When a user enters the time selection screen, a short-lived lock (10 min TTL) is placed on the specific slot for the service/staff combination to prevent double booking. Lock auto-expires if booking not completed.
- Concurrency: slot computation must be idempotent and handle high request loads.

### 3.12 Shared Types & Design System
**Priority:** P0 (Technical Foundation)
**Acceptance Criteria:**
- A shared TypeScript package exports interfaces/constants for core entities: User, Business, Staff, Service, Category, Booking, Review, etc.
- Design system built with modular components (Button, Card, Modal, Input, Badge, StarRating, etc.) using a consistent theme (colors, typography, spacing).
- All UI is responsive (mobile-first) and meets WCAG 2.1 AA accessibility (perceivable, operable, understandable).
- Components are documented in a Storybook-style guide for both mobile (React Native) and web (React).

### 3.13 Reviews & Ratings
**Priority:** P1
**Acceptance Criteria:**
- After appointment completion, an in-app prompt (or push notification) invites the user to rate (1–5 stars) and write an optional text review.
- Users can navigate to their past appointments to leave a review if missed.
- Business detail page shows overall rating, count, and distribution histogram.
- Reviews list loads page by page; sort options: most recent, most helpful.
- Business owner can respond to each review (reply displayed below the review).
- Report/flag inappropriate reviews for admin moderation.
- Moderation queue in admin dashboard to approve/reject flagged reviews.

### 3.14 Payment Integration
**Priority:** P0
**Acceptance Criteria:**
- Integrate with Stripe (or equivalent) to handle payments, including SCA/PSD2 compliance.
- Supported methods: credit/debit cards (Visa, MC, Amex), Apple Pay, Google Pay.
- During booking, users can select a saved payment token or enter new card details; new cards are tokenized securely (no sensitive data stored on backend).
- Payment flow: At booking confirmation, create a PaymentIntent (or charge) for the total amount; business rules dictate whether to capture immediately or only authorize and capture later (configurable per business).
- On successful payment, booking status becomes “confirmed”.
- Refund handling: When a cancellation meets free-cancel criteria, system initiates refund via Stripe and updates booking status to “canceled/refunded”.
- Platform commission is calculated and stored for accounting; payout logic is out-of-scope for MVP but data is recorded.
- PCI DSS Level 1 compliance: no raw card data touches backend servers.

### 3.15 Notifications
**Priority:** P0
**Acceptance Criteria:**
- **Push Notifications:**
  - Booking confirmation, reminder (1 day before, 1 hour before), cancellation, rescheduling.
  - Business owner: new booking, cancellation, remider of upcoming daily summary.
  - Opt-in for marketing/promotions.
- **In-app Notifications:**
  - Bell icon with badge count; tapping opens a list of notifications grouped by date.
  - Tapping a notification navigates to relevant screen (booking detail, review prompt, etc.).
  - Ability to mark as read.
- **Email Notifications:**
  - Transactional emails for booking confirmation, cancellation, receipt.
  - Password reset, email verification.
- All triggers are dispatched via BullMQ jobs for reliable delivery (retry on failure).

### 3.16 Provider / Business Owner Portal
**Priority:** P0
**Acceptance Criteria:**
- Web-based portal accessible via role-based auth (owner/admin staff).
- **Dashboard:** today’s appointment count, upcoming appointments list, daily revenue summary, quick actions “New Booking”.
- **Profile Management:** edit business name, description, address, phone, hours (weekly schedule with special hours for holidays), cover/logo images.
- **Service Management:** CRUD for services, assign to categories, set price, duration, buffer, description, active/inactive toggle.
- **Staff Management:** add/edit/remove staff members; each has name, photo, email, permissions (owner/staff), assigned services, individual work schedule (override default), days off.
- **Calendar:** week/day view showing all bookings per staff; color-coded by service; drag to create manual booking; edit/cancel/complete bookings.
- **Customer List:** searchable list of customers who visited, view their booking history.
- **Reviews:** view all reviews, respond inline.
- **Settings:** notification preferences, commission agreement view, payout account setup (Connect).

### 3.17 Admin Dashboard
**Priority:** P1
**Acceptance Criteria:**
- Super-admin panel to manage the platform.
- **Business Management:** list/search all businesses, view details, approve new businesses (if manual approval is enabled), suspend/restore business, edit categories/services (override).
- **User Management:** view users, search by name/email, suspend accounts.
- **Booking Monitor:** global booking list with filters (status, date range, business), ability to cancel a booking with refund reason.
- **Financial Overview:** dashboard with total revenue, commission, payouts, refunds (aggregate charts).
- **Category Management:** add/edit/delete categories; reorder.
- **Review Moderation:** queue of flagged reviews, approve/dismiss flags, delete reviews if necessary.
- **System Configuration:** default cancellation policy (hours before), commission rate (%) per booking, currency, timezone.
- **Analytics:** key metrics (daily active users, bookings, revenue), exportable reports.

### 3.18 Background Jobs (BullMQ)
**Priority:** P0
**Acceptance Criteria:**
- Use BullMQ with Redis for queueing background tasks.
- Defined job types:
  - Send push notification
  - Send email (using template)
  - Release expired slot reservation (every minute scan)
  - Generate daily/weekly reports
  - Process payout batch (future phase)
- Jobs are persisted and retried with exponential backoff (max 3 attempts).
- Failed jobs are logged and moved to a dead-letter queue for manual inspection.
- A monitoring dashboard (Bull Board) shows queue lengths, success/failure rates.
- All time-sensitive jobs (reminders, slot expiration) use schedulers or delayed jobs accurately.

## 4. Non‑Functional Requirements
- **Performance:** API response times < 200ms (p95), slot computation < 500ms.
- **Scalability:** System must handle 10x average load during peak hours (e.g., Saturday 10 AM).
- **Security:** OWASP Top 10 mitigations, HTTPS only, rate limiting, input validation, data encryption at rest.
- **Compliance:** GDPR-ready data handling, PCI DSS for payment processing.
- **Accessibility:** WCAG 2.1 AA compliance for all customer-facing screens.
- **Localization:** Initial support for English and French, with i18n-ready architecture.

## 5. Release Phases
- **Phase 1 – MVP (P0):** User Auth, Guest Browse, Search & Discovery, Business Detail, Service Categories, Booking Flow, Appointment Management, User Profile, Availability Engine, Shared Types, Payment, Notifications, Provider Portal core (Dashboard, Services, Staff, Calendar, Manual Booking), Background Jobs.
- **Phase 2 – Enhancement (P1):** Favorites, Map Search, Reviews & Ratings, Admin Dashboard, Provider advanced features (customer history, reports, review responses).
- **Phase 3 – Growth (P2):** Loyalty programs, referral system, advanced analytics, multi‑language expansion, waitlist for fully booked slots.