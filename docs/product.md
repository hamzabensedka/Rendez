# Planity Clone Product Specification

## 1. Overview
Planity Clone is a mobile-first booking platform for beauty and wellness services. It enables end users to discover businesses (salons, spas, barbershops), browse services and availability, book appointments, pay, and manage their schedules. Business owners can manage their profile, services, staff, availability, and appointments via a provider portal. An admin dashboard handles platform oversight. The system comprises a consumer app, provider portal, admin dashboard, backend API, and background jobs for notifications and cleanup.

**Target Users:**
- **End Users:** people seeking beauty/wellness services
- **Business Owners / Providers:** salon owners/managers
- **Platform Admins:** managing the marketplace

## 2. Product Features & Acceptance Criteria

All features are described with acceptance criteria (AC). Priority levels:
- **P0:** must-have for MVP launch
- **P1:** high priority, essential soon after launch
- **P2:** nice-to-have, iterative improvements

### 2.1 User Authentication (P0)
Users can register and log in using email/password or social login (Google, Apple). Providers/admins will have separate auth flows (see Provider Portal, Admin Dashboard).

**AC:**
- User can sign up with email and password; system validates email format and password length (min 8 chars).
- User can log in with email/password, receive JWT token.
- Social login (Google, Apple) works on mobile; if new social login, a local account is created linked to the social ID.
- Forgot password flow: user enters email -> receives reset link -> can set new password.
- Session management: token refresh, logout clears token.
- Email verification required? For MVP, optional but can be toggled (P1).

### 2.2 Guest Browse & Explore (P0)
Unregistered users can browse businesses, view services, and check availability without signing up. Conversion to sign-up is prompted only when attempting to book.

**AC:**
- Home screen shows featured businesses, categories, and search accessible to guests.
- Guest can view business details, services, ratings, and availability calendar (no booking).
- Tapping “Book” prompts login/sign-up modal.
- Guest can search and filter normally. No personalization (no favorites).

### 2.3 Business Search & Discovery (P0)
Users can search for businesses by name, service, location, and filters (category, rating, price range, distance).

**AC:**
- Search bar on top with autocomplete suggestions (by name, category, service).
- Filter options: category (hair, nails, spa, etc.), rating (min 1-5 star), price range ($ to $$$), availability (today, this week), distance (1km, 5km, 10km, etc.).
- Results list shows business name, thumbnail, rating, distance, primary services & price range.
- Sorting: by relevance (default), rating, distance, price low/high.
- Infinite scroll with pagination.
- Location permissions: request user location to show nearby results; if denied, default to manual city selection or allow search by location/address.
- No results state with suggestion to widen filters.

### 2.4 Map-based Search (P0)
Users can view businesses on an interactive map and switch between list/map views.

**AC:**
- Toggle between list view and map view on search results screen.
- Map shows pins for businesses within current viewport or search radius.
- Pin tap shows popup with business name, rating, thumbnail, and “View Details” button.
- Map clustering for dense areas.
- User can move map and tap “Search this area” to refresh results based on map bounds.
- Map respects filters.

### 2.5 Business Detail View (P0)
Comprehensive screen for a selected business.

**AC:**
- Images gallery (carousel).
- Business name, rating (stars + count), address with map link, distance.
- Description, services list with durations and prices.
- Provider/staff list (if multiple) with individual ratings? (P1).
- Reviews section (see Reviews & Ratings).
- “Book” CTA button, fixed at bottom.
- Tapping service opens booking flow pre-selected.
- Contact: phone and website (if provided).
- Favorite button (see Favorites).
- Operating hours display (today highlighted, expandable for week).

### 2.6 Service Categories (P0)
Administrators define a taxonomy of service categories and subcategories. Businesses assign their services to these categories.

**AC:**
- Admin can manage categories (CRUD) via Admin Dashboard (see Admin Dashboard).
- Home screen shows category icons (e.g., Hair, Nails, Massage, Barber, Skincare, Makeup).
- Tapping category leads to businesses filtered by that category.
- A business can have services across multiple categories.
- Category metadata: name, icon, display order.

### 2.7 Booking Flow (P0)
Seamless appointment booking experience.

**AC:**
- Flow: select business -> select service(s) or package -> select provider/staff (if applicable) -> choose date and time slot based on availability (see Availability & Slot Computation) -> confirm booking with summary (service, provider, date, time, duration, price) -> payment (see Payment Integration) -> booking confirmed with success screen.
- Support for multiple services in one booking: add services sequentially, each with separate duration slots chained sequentially (back-to-back). System calculates total duration and available contiguous slots.
- Slot selection shows time slots as tappable buttons; unavailable slots greyed out.
- Option to book for another person? (P2).
- Validation: prevent double booking, ensure slot still available when confirming.
- Pre-booking data like client notes (“extra details”) allowed.
- Cancel/back navigation at any step.

### 2.8 Appointment Management (P0)
Users can view upcoming and past appointments, cancel, reschedule, and add to calendar.

**AC:**
- Appointments tab in user profile shows list with statuses: Upcoming, Completed, Canceled, No-show.
- Upcoming: shows date, time, service, business, provider, address, and buttons to reschedule or cancel.
- Reschedule flow: select new date/time from availability; old appointment cancelled and new one created (or update same appointment ID but with new time). Confirmation required.
- Cancelation: confirm dialog, business cancellation policy can be shown (e.g., free cancellation up to 24h before). If within policy window, cancel with optional reason; if late, might incur charge (P1).
- Add to calendar: link to generate .ics file or add to Google/Apple calendar.
- Push notifications for upcoming appointment reminders (see Notifications).
- Past appointments: rate and review option (if not already).

### 2.9 Favorites (P0)
Users can save businesses to a favorites list for quick access.

**AC:**
- Heart icon on business card and detail view, to toggle favorite.
- Requires authentication.
- Favorites screen lists saved businesses with quick-book option.
- Removal from favorites with swipe or unheart.
- Syncs across user’s logged-in devices.

### 2.10 User Profile (P0)
Basic profile management for end users.

**AC:**
- Edit name, phone number, profile photo, email (readonly after verification).
- View booking history, favorites, payment methods, notification settings.
- Account deletion option (with confirmation).
- Preferences: default location? (P2).

### 2.11 Availability & Slot Computation (P0)
Core engine to compute available appointment slots considering business operating hours, staff schedules, existing bookings, breaks, and service durations.

**AC:**
- Each business has operating hours per day (e.g., Mon 9-18:30), with possible breaks (e.g., lunch 13-14).
- Each staff member has their own schedule and days off, with service assignments (which services they perform).
- When booking, only staff that can perform selected service(s) are considered.
- Slot computation: For a given date, service duration, staff member, system returns available start times as timestamps (e.g., 09:00, 09:15, 09:30...) based on interval (e.g., 15 min).
- A slot is available if staff is working, not on break, and no overlapping confirmed appointments for that staff (including multi-service bookings where slots are already reserved).
- Multi-service booking: total duration = sum of durations + optional buffer (P1). System must find contiguous block for all services.
- Blocking out time after a booking: buffer time before next appointment can be configured (P1).
- Timezone handling: store dates in UTC, display in business local timezone.
- Optimization for real-time availability checking with caching but avoids booking conflicts via transactional locking.

### 2.12 Shared Types & Design System (P0)
A shared set of TypeScript types/interfaces and a consistent UI design system across all apps.

**AC:**
- Type definitions for core entities: User, Business, Service, Staff, Appointment, Review, Category, Slot, Payment, Notification, etc.
- Consistent UI components (buttons, inputs, cards, modals, etc.) in a design system library (e.g., using React Native Paper or custom).
- Color palette, typography, spacing tokens.
- Shared validation schemas (e.g., Zod) for forms.
- Ensure all frontend apps adhere to these types and components.

### 2.13 Reviews & Ratings (P1)
Users can rate and write reviews for businesses after an appointment.

**AC:**
- After appointment completion, prompt user to rate (1-5 stars) and leave optional text review.
- Users can edit/delete their own reviews.
- Business detail shows average rating, total review count, and a list of reviews sorted by newest/most helpful.
- Review includes user name, rating, date, text, and optional photos? (P2).
- Report inappropriate review functionality (flag).
- Business owner cannot delete reviews but can respond (see Provider Portal).
- Moderation: reviews may be held for admin approval if flagged or based on content scanning (P2).

### 2.14 Payment Integration (P0)
Secure payment processing at booking time. Support card payments (Stripe or similar) and possibly digital wallets.

**AC:**
- During booking, user selects payment method (credit/debit card, Apple Pay/Google Pay if available).
- Card details entered and tokenized via Stripe (or equivalent) on frontend; backend uses token to create charge.
- Payment is captured immediately upon confirmation (or authorized and captured later? Default: capture upon booking).
- Support for partial refunds via cancellation (P1).
- Payment history viewable in user profile.
- PCI compliance handled by payment gateway; no sensitive card data stored on our servers.
- Clear indication of total price, including taxes and any service fees.
- Failed payment handling with error message and retry.

### 2.15 Notifications (P1)
Push notifications and in-app notifications for appointment reminders, cancellations, confirmations, promotions.

**AC:**
- Users receive push notification for: booking confirmation, upcoming appointment reminder (e.g., 24h and 1h before), cancellation, rescheduling, and marketing (opt-in).
- Notification preferences: user can toggle which notifications to receive (reminders on/off, marketing on/off).
- In-app notification center listing recent notifications with read/unread state.
- Providers receive notifications for new bookings, cancellations, etc. (see Provider Portal).
- Implemented using Firebase Cloud Messaging (FCM) or similar with backend integration.
- Deep linking: tap notification opens relevant screen (booking detail).

### 2.16 Provider / Business Owner Portal (P0, P1 for some advanced)
Web and/or mobile interface for business owners to manage their listing, services, staff, appointments, and insights.

**AC (MVP P0):**
- Separate login for providers (email/password, invite based).
- Dashboard: today’s appointments summary, upcoming appointments list, daily statistics (bookings, revenue).
- Manage business profile: name, description, photos, address, contact, operating hours, breaks.
- Service management: add/edit/delete services, set duration, price, assign to categories and staff.
- Staff management: add staff members, set their working hours, services they perform, days off.
- Appointment management: view all bookings calendar view (day/week), ability to manually add a booking (walk-in), cancel/reschedule, mark no-show.
- Customer history: view past bookings for a customer.
- Availability override: block off time, special day hours (P1).

**AC (P1):**
- Analytics/insights: revenue trends, popular services, customer retention.
- Review management: respond to reviews.
- Multi-location support for chains.
- Booking policies: set cancellation window, late policy, prepayment requirements.
- Import/export data.

### 2.17 Admin Dashboard (P1)
Central administration for platform admins to manage businesses, users, categories, and monitor system.

**AC:**
- Admin login (separate role).
- Business management: approve new businesses (if required), suspend/list, view details, manage listing quality.
- User management: view users, suspend accounts, handle support.
- Category management as described.
- Monitor bookings, revenue, commissions.
- System configuration: commission percentage, platform fees, featured placements.
- Audit log for sensitive actions.
- Content moderation for reviews.

### 2.18 Background Jobs (BullMQ) (P0 for crucial ones, P1 for others)
Background job processing using BullMQ for tasks like sending emails, notifications, generating reports, cleaning old data.

**AC:**
- Email sending (welcome, password reset, booking confirmation) via queue to avoid slowing API response.
- Push notification dispatch via queue.
- Scheduled jobs: appointment reminders (e.g., cron job checking upcoming appointments and queueing notifications).
- Cleanup jobs: remove expired unverified accounts, old tokens, etc.
- Reporting jobs: generate monthly reports for providers (P1).
- Job retries and failure handling, logging in dashboard.
- Use Redis as backend for BullMQ.

## 3. Feature Priority Matrix

**P0 (MVP must-have):**
- User Authentication
- Guest Browse & Explore
- Business Search & Discovery
- Map-based Search
- Business Detail View
- Service Categories
- Booking Flow
- Appointment Management
- Favorites
- User Profile
- Availability & Slot Computation
- Shared Types & Design System
- Payment Integration (card)
- Provider Portal (basic: profile, services, staff, appointments)
- Background Jobs (email, booking confirmations)

**P1 (Post-MVP high priority):**
- Reviews & Ratings
- Notifications (push and in-app)
- Admin Dashboard
- Provider Portal advanced (analytics, review responses, policies)
- Payment Integration advanced (refunds, Apple/Google Pay)
- Multi-service booking with buffer
- Staff ratings?
- Add to calendar
- Deep linking from notifications

**P2 (Future iterations):**
- Reviews with photos
- Book for another person
- User location preferences
- Provider import/export
- Marketing automation
- Multi-location chain support
- Advanced moderation

## 4. Technical Constraints & Assumptions
- Backend: Node.js/Express with TypeScript, PostgreSQL for data, Redis for caching and BullMQ.
- Mobile app: React Native for cross-platform.
- Web portals: React for provider and admin.
- API authentication via JWT; payment via Stripe; notifications via FCM.
- All times stored in UTC; business timezone stored.
- Availability computed server-side to prevent race conditions; booking uses transaction with row-level locking.

## 5. Success Metrics
- Registration to first booking conversion rate.
- Average search to booking time.
- Booking completion rate (no drop-off).
- Provider onboarding completion rate.
- User and provider retention.

End of specification.