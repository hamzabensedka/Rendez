# Planity Clone Product Specification

## 1. Overview
Planity Clone is a mobile-first beauty and wellness booking platform connecting customers with salons, spas, and independent professionals. The app enables users to discover businesses, browse services, check real-time availability, book appointments, pay, and manage their visits. Business owners manage their profiles, services, staff, and schedules via a dedicated portal. An admin dashboard provides oversight. Background jobs handle notifications, reminders, and slot computations.

## 2. User Roles
- **Guest**: Unauthenticated user who can browse and search but cannot book.
- **Customer**: Authenticated user with full booking capabilities, favorites, profile, and history.
- **Provider (Business Owner)**: Authenticated business owner managing one or more locations, staff, services, schedules, and appointments.
- **Admin**: Superuser with access to dashboard, user management, and platform settings.

## 3. Feature Specifications

### 3.1 User Authentication
**Priority: P0**

**Description**
Secure sign-up, login, and account recovery for customers and providers. Support email/password and social login (Google, Apple). Session management with JWT tokens.

**Acceptance Criteria**
- Customer can sign up with email, password, first name, last name, and phone number.
- Provider sign-up requires business name, address, and tax ID in addition to personal details.
- Email verification: a 6-digit code sent to email; account activated upon verification.
- Login returns access token (15 min) and refresh token (7 days).
- Social login (Google, Apple) creates account if new, links to existing if email matches.
- Forgot password flow: enter email → receive reset link → set new password.
- Session persists across app restarts using secure storage.
- Logout clears tokens locally and invalidates refresh token on server.
- All auth endpoints rate-limited (5 attempts per IP per minute).

### 3.2 Guest Browse & Explore
**Priority: P0**

**Description**
Allow unauthenticated users to explore the platform, search businesses, view details, and see services without booking. Encourage sign-up via contextual prompts.

**Acceptance Criteria**
- Guest lands on home screen with featured businesses, popular categories, and search bar.
- Can search by keyword, category, or location; results are viewable.
- Business detail page shows services, ratings, photos, and working hours.
- "Book" button is visible but triggers a sign-up modal with social login options.
- Guest can browse service categories and filter by price/duration.
- Map view accessible; tapping a pin shows business summary.
- No personalization (no favorites, no history).
- All guest actions are tracked anonymously for analytics.

### 3.3 Business Search & Discovery
**Priority: P0**

**Description**
Full-text search with filters and sorting. Users find businesses by name, service, category, or location. Results include relevance scoring.

**Acceptance Criteria**
- Search bar supports autocomplete with business names, services, and categories.
- Filters: category (multi-select), price range, rating, distance, availability (today, this week).
- Sort options: relevance, rating (high to low), distance, price (low to high).
- Results show business card: name, main photo, rating, distance, next available slot, and favorite icon.
- Pagination with infinite scroll (20 items per page).
- Search query persists in URL for deep linking.
- No results state with suggestions to broaden filters.
- Search analytics logged for trending queries.

### 3.4 Map-based Search
**Priority: P1**

**Description**
Interactive map showing business locations. Users can move the map to update results, view clusters, and tap pins for quick info.

**Acceptance Criteria**
- Map loads with user's current location (if permission granted) or default city center.
- Business pins color-coded by category.
- Clustering for dense areas; tap cluster to zoom in.
- Tapping a pin shows a bottom sheet with business name, rating, distance, and "View Details" button.
- Moving the map triggers a search within the new bounds (debounced 500ms).
- Search bar and filters work in conjunction with map; results update both list and map.
- "List" toggle switches to list view preserving filters.
- Map supports standard gestures (zoom, rotate).

### 3.5 Business Detail View
**Priority: P0**

**Description**
Comprehensive business profile with all information needed to make a booking decision.

**Acceptance Criteria**
- Header: cover photo, business name, rating (stars + count), address, distance, favorite button.
- Tab bar: About, Services, Reviews, Photos.
- About tab: description, working hours (collapsible per day), amenities (Wi-Fi, parking, etc.), contact info (phone, website), social links.
- Services tab: list of services grouped by category, each with name, duration, price, and "Book" button. Expandable to see description.
- Reviews tab: summary (average rating, distribution bar), list of reviews with user name, date, rating, comment, and provider response if any. Sort by recent or highest.
- Photos tab: grid of business photos with lightbox viewer.
- Sticky bottom bar: "Book Appointment" CTA (if authenticated) or "Sign Up to Book" (guest).
- Share button generates deep link.
- Loading skeleton while fetching data.

### 3.6 Service Categories
**Priority: P0**

**Description**
Hierarchical category system for services (e.g., Hair > Haircut, Coloring). Used for discovery, filtering, and provider service management.

**Acceptance Criteria**
- Admin can manage categories (CRUD) via admin dashboard.
- Categories have name, icon, parent category (optional), and display order.
- Home screen shows top-level categories as tappable cards.
- Tapping a category navigates to a subcategory list or directly to search results filtered by that category.
- Provider assigns services to categories when creating/editing services.
- Category list cached on client; updates fetched on app launch.
- Search and filter use category IDs.

### 3.7 Booking Flow
**Priority: P0**

**Description**
Step-by-step booking wizard: select service, choose staff (optional), pick date/time from real-time slots, add extras, review, and confirm. Integrated with payment.

**Acceptance Criteria**
- Flow initiated from service "Book" button or business detail CTA.
- Step 1: Service selection. If multiple services, allow multi-select with quantity. Show total duration and price.
- Step 2: Staff selection (if business has multiple staff). Show staff cards with photo, name, rating. "Any available" default.
- Step 3: Date & time. Calendar shows available dates highlighted. Time slots fetched from server based on real-time availability (see 3.11). Slots shown in 15-min increments. User selects slot; if service duration > slot gap, next available slot shown.
- Step 4: Review summary: business, service(s), staff, date, time, total price, duration. Option to add notes (max 200 chars). Promo code field.
- Step 5: Payment (if not free). Integrate Stripe; collect card details or use saved card. Apply promo code. Show final total.
- Confirmation: success screen with booking ID, date/time, business, and option to add to calendar. Push notification sent.
- Error handling: if slot becomes unavailable during booking, show message and suggest next available.
- Guest users are prompted to sign up/sign in after step 4; booking resumes after authentication.
- Booking ID format: BOK-XXXXX.

### 3.8 Appointment Management
**Priority: P0**

**Description**
Customers can view upcoming and past appointments, cancel or reschedule (subject to policy), and see details.

**Acceptance Criteria**
- "My Appointments" tab with Upcoming and History sections.
- Upcoming: list sorted by date ascending. Each card shows business name, service, date, time, status (confirmed, pending, cancelled).
- Tap to see full details: booking ID, address, map link, staff name, price paid, cancellation policy, and actions.
- Actions: Cancel (if >24h before), Reschedule (if >24h before), Contact business (call/chat placeholder).
- Reschedule flow: similar to booking but pre-filled; user picks new date/time; old appointment cancelled and new one created.
- Cancellation: confirmation dialog; if within free cancellation window, refund initiated (see payment). Status updated to cancelled.
- History: past appointments with status (completed, no-show, cancelled). Option to leave review if not already reviewed.
- Pull-to-refresh.
- Empty state with illustration.

### 3.9 Favorites
**Priority: P1**

**Description**
Users can save businesses to a favorites list for quick access.

**Acceptance Criteria**
- Heart icon on business cards and detail page toggles favorite.
- Favorites tab in user profile shows list of favorited businesses with name, photo, rating, and next available slot.
- Tap navigates to business detail.
- Favorites sync across devices (stored server-side).
- Unfavoriting removes from list with animation.
- Guest users prompted to sign up when tapping heart.
- Max 200 favorites per user.

### 3.10 User Profile
**Priority: P1**

**Description**
Central place for user personal information, preferences, payment methods, and notification settings.

**Acceptance Criteria**
- Profile screen accessible from tab bar.
- Sections: Personal Info (name, email, phone, profile photo), Payment Methods (saved cards), Notification Preferences (push, email, SMS toggles), App Settings (language, theme).
- Edit personal info: inline editing with validation.
- Profile photo: upload from camera/gallery, crop circle, max 5MB.
- Payment methods: add/delete card; default card selection. Card data tokenized via Stripe.
- Notification toggles: appointment reminders, promotions, review requests.
- Delete account option with confirmation and data wipe (GDPR compliant).
- All changes saved via API.

### 3.11 Availability & Slot Computation
**Priority: P0**

**Description**
Real-time slot generation based on business working hours, staff schedules, existing appointments, breaks, and service durations. Ensures no double-booking.

**Acceptance Criteria**
- Business sets working hours per day (e.g., Mon-Fri 9:00-18:00). Multiple intervals per day supported (e.g., 9:00-12:00, 14:00-18:00).
- Staff have individual schedules that override business hours (e.g., staff A works 10:00-16:00).
- Staff can have breaks (e.g., 12:00-12:30).
- Services have duration in minutes and buffer time (pre/post) configurable.
- Slot computation algorithm: for a given date, staff, and service, generate all possible start times where the service fits within working hours, not overlapping existing appointments or breaks, and respecting buffer times.
- Slots are computed in 15-minute increments (e.g., 9:00, 9:15, 9:30...).
- When a customer requests slots for a service without specifying staff, the system returns union of available slots across all staff who perform that service, indicating staff name.
- Slot computation is triggered by:
  - Real-time API call when user opens date picker (cached for 30 seconds).
  - Background job (BullMQ) pre-computes slots for next 14 days every night and whenever a booking/cancellation occurs.
- Booking endpoint atomically checks slot availability and creates appointment using database transactions/locks to prevent race conditions.
- If slot taken between display and confirmation, return error with next available suggestion.
- Admin can configure global booking lead time (e.g., min 2 hours in advance) and max future days (e.g., 90 days).

### 3.12 Shared Types & Design System
**Priority: P0**

**Description**
Unified TypeScript types and UI component library to ensure consistency across web and mobile (React Native) clients.

**Acceptance Criteria**
- Shared types package (`@planity/shared-types`) includes interfaces for User, Business, Service, Appointment, Review, etc.
- Design system package (`@planity/ui`) includes atoms (Button, Input, Typography), molecules (Card, Modal, RatingStars), and tokens (colors, spacing, typography scale).
- Components support loading, empty, error, and disabled states.
- Dark mode support via theme provider.
- All components documented in Storybook.
- Mobile components use React Native primitives; web uses React.
- Accessibility: minimum contrast ratios, touch targets 44px, screen reader labels.

### 3.13 Reviews & Ratings
**Priority: P1**

**Description**
Customers can leave reviews and ratings after a completed appointment. Businesses can respond. Moderation by admin.

**Acceptance Criteria**
- After appointment status becomes "completed", customer receives push notification and email prompting review.
- Review form: star rating (1-5), text comment (min 10 chars, max 500), optional photo upload (max 3 photos).
- Review appears on business detail page after submission (or after moderation if enabled).
- Business owner can respond to a review once; response shown below review.
- Review list shows average rating and distribution.
- User can edit their review within 48 hours.
- Admin can hide/report inappropriate reviews.
- Reviews are tied to verified appointments (verified badge).
- One review per appointment.

### 3.14 Payment Integration
**Priority: P0**

**Description**
Secure payment processing via Stripe. Supports card payments, saved cards, and refunds. Handles platform fees and provider payouts.

**Acceptance Criteria**
- Customer enters card details in Stripe Elements (PCI-compliant) during booking.
- Option to save card for future use (tokenized).
- Payment is authorized at booking time; captured upon service completion (or immediately based on business setting).
- Booking total includes service price + taxes + platform fee (if any).
- Promo codes: applied before payment; validate code, adjust total.
- Receipt sent via email after successful payment.
- Cancellation refund: if within free cancellation window, full refund minus non-refundable fee (if configured). Refund processed via Stripe.
- Provider payouts: admin can trigger payouts to provider's connected Stripe account (manual or scheduled).
- Payment statuses: pending, authorized, captured, refunded, failed.
- All payment actions logged for audit.

### 3.15 Notifications
**Priority: P0**

**Description**
Multi-channel notifications (push, email, SMS) for appointment reminders, confirmations, cancellations, and marketing.

**Acceptance Criteria**
- Push notifications via Firebase Cloud Messaging (FCM) for mobile.
- Email via SendGrid (or similar) with HTML templates.
- SMS via Twilio for critical alerts (optional, based on user preference).
- Notification triggers:
  - Booking confirmation (push + email)
  - Appointment reminder 24h and 1h before (push + email)
  - Cancellation confirmation (push + email)
  - Review request after appointment (push + email)
  - Promotional (marketing) based on user opt-in.
- Notification preferences in user profile: toggles per channel and type.
- Deep linking: tapping notification opens relevant screen (appointment detail, business page).
- Background job (BullMQ) processes notification queue, respecting user preferences and rate limits.
- Admin can send bulk push notifications to segments.

### 3.16 Provider / Business Owner Portal
**Priority: P0**

**Description**
Web-based portal for business owners to manage their profile, services, staff, schedules, and appointments. Separate from customer app.

**Acceptance Criteria**
- Login with provider credentials (same auth system, role-based access).
- Dashboard: today's appointments, revenue summary, new reviews, quick actions.
- Business Profile: edit name, description, address, phone, photos, working hours, amenities.
- Services Management: CRUD services with name, category, duration, price, buffer time, description, image, active/inactive.
- Staff Management: add/edit staff members with name, photo, email, phone, service assignments, working hours, breaks.
- Calendar: daily/weekly view of appointments with staff filter. Color-coded by status. Click to see details, cancel, or mark no-show/complete.
- Appointment details: customer name, service, date/time, status, notes, payment status.
- Manual appointment creation: provider can book on behalf of a customer (by phone number lookup).
- Reviews: view and respond to reviews.
- Settings: cancellation policy (free cancellation window, fee), booking lead time, payment capture timing, notifications.
- Multi-location support: if owner has multiple businesses, location switcher.
- Responsive design for tablet use.

### 3.17 Admin Dashboard
**Priority: P1**

**Description**
Web-based dashboard for platform administrators to manage users, businesses, categories, promotions, and monitor platform health.

**Acceptance Criteria**
- Secure login with admin role.
- Dashboard overview: total users, businesses, appointments, revenue (with charts for last 30 days).
- User management: list/search users, view details, suspend/delete accounts.
- Business management: approve new businesses (if approval required), edit details, suspend.
- Category management: CRUD service categories.
- Promo codes: create/edit promo codes with discount type (percentage/fixed), validity dates, usage limits, applicable services/businesses.
- Review moderation: queue of reported reviews, ability to hide/delete.
- Transaction log: view all payments, refunds, payouts with filters.
- System config: global settings (booking lead time, max future days, platform fee percentage, etc.).
- Audit log: track admin actions.
- Export data: CSV exports for users, appointments, revenue.

### 3.18 Background Jobs (BullMQ)
**Priority: P0**

**Description**
Reliable job processing for async tasks: slot pre-computation, notifications, payment capture, reminders, and data cleanup.

**Acceptance Criteria**
- BullMQ with Redis used for job queues.
- Queues:
  - `slots-generation`: nightly job to pre-compute slots for next 14 days for all businesses. Also triggered on booking/cancellation for affected business.
  - `notifications`: send push, email, SMS. Handles batching and rate limiting.
  - `payment-capture`: capture authorized payments after service completion (scheduled job).
  - `reminders`: enqueue reminder jobs at booking time with delay (24h and 1h before appointment).
  - `data-cleanup`: anonymize/delete user data after account deletion, clean expired tokens.
- Jobs are idempotent and retry with exponential backoff (max 3 attempts).
- Failed jobs logged to admin dashboard with reason.
- Concurrency limits per queue to avoid overwhelming external services.
- Scheduled jobs (cron) for nightly tasks.
- Monitoring via Bull Board UI (admin only).

## 4. Non-Functional Requirements
- **Performance**: API response time < 200ms for 95th percentile; slot computation < 500ms.
- **Scalability**: Horizontal scaling for API and workers; database read replicas for search.
- **Security**: HTTPS, JWT with rotation, input sanitization, rate limiting, Stripe PCI compliance, GDPR compliance (data export, deletion).
- **Reliability**: 99.9% uptime for core booking flow; graceful degradation for non-critical features.
- **Observability**: Structured logging, metrics (Prometheus), distributed tracing.

## 5. Priorities Summary
- **P0 (Must-have)**: User Authentication, Guest Browse, Business Search, Business Detail, Service Categories, Booking Flow, Appointment Management, Availability & Slot Computation, Shared Types & Design System, Payment Integration, Notifications, Provider Portal, Background Jobs.
- **P1 (Should-have)**: Map-based Search, Favorites, User Profile, Reviews & Ratings, Admin Dashboard.
- **P2 (Nice-to-have)**: Social features (share appointments), loyalty program, advanced analytics, multi-language support.

## 6. Assumptions & Dependencies
- Stripe for payments; provider onboarding via Stripe Connect.
- Firebase for push notifications; SendGrid for email; Twilio for SMS.
- Map provider: Google Maps or Mapbox.
- Hosting on AWS/GCP with Kubernetes.
- React Native for mobile, React for web portals.
- PostgreSQL for primary DB, Redis for caching and queues, Elasticsearch for full-text search.

## 7. Glossary
- **Buffer time**: Extra time before/after a service for preparation/cleanup.
- **Lead time**: Minimum advance notice required for booking.
- **Slot**: A specific start time interval available for booking.
- **Provider**: Business owner or staff member.
- **Promo code**: Discount code applied at checkout.
